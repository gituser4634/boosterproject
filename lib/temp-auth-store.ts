import { createHash, randomUUID } from "crypto";

export type TempAuthRole = "booster" | "client";

export type TempAuthPublicUser = {
  id: string;
  username: string;
  email: string;
  country: string;
  bio: string;
  avatarUrl: string;
  role: TempAuthRole;
  alias?: string;
  createdAt: string;
};

export type TempAuthClientOrder = {
  id: string;
  game: string;
  service: string;
  status: "pending" | "accepted";
  createdAt: string;
};

type TempAuthUserRecord = {
  id: string;
  username: string;
  email: string;
  country: string;
  bio: string;
  avatarUrl: string;
  role: TempAuthRole;
  alias?: string;
  passwordHash: string;
  createdAt: string;
};

type TempAuthSessionRecord = {
  token: string;
  userId: string;
  createdAt: string;
};

type TempAuthStore = {
  usersByEmail: Map<string, TempAuthUserRecord>;
  sessionsByToken: Map<string, TempAuthSessionRecord>;
  ordersByUserId: Map<string, TempAuthClientOrder[]>;
};

const SESSION_COOKIE_NAME = "zb_session";
const PASSWORD_SALT = "zenith-temp-auth-v1";
const DEFAULT_AVATAR_URL = "/booster-pfps/default-avatar.svg";

const getGlobalStore = () => {
  const globalKey = "__ZENITH_TEMP_AUTH_STORE__";
  const globalWithStore = globalThis as typeof globalThis & {
    [globalKey]?: TempAuthStore;
  };

  if (!globalWithStore[globalKey]) {
    globalWithStore[globalKey] = {
      usersByEmail: new Map<string, TempAuthUserRecord>(),
      sessionsByToken: new Map<string, TempAuthSessionRecord>(),
      ordersByUserId: new Map<string, TempAuthClientOrder[]>(),
    };
  }

  return globalWithStore[globalKey];
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();
const normalizeUsername = (username: string) => username.trim().toLowerCase();

const hashPassword = (password: string) => {
  return createHash("sha256").update(`${PASSWORD_SALT}:${password}`).digest("hex");
};

const toPublicUser = (user: TempAuthUserRecord): TempAuthPublicUser => {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    country: user.country,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    role: user.role,
    alias: user.alias,
    createdAt: user.createdAt,
  };
};

const parseSessionTokenFromCookieHeader = (cookieHeader: string | null) => {
  if (!cookieHeader) return null;

  for (const part of cookieHeader.split(";")) {
    const trimmed = part.trim();
    if (!trimmed.startsWith(`${SESSION_COOKIE_NAME}=`)) continue;
    return trimmed.slice(`${SESSION_COOKIE_NAME}=`.length);
  }

  return null;
};

const getUserRecordById = (userId: string) => {
  const store = getGlobalStore();
  for (const user of store.usersByEmail.values()) {
    if (user.id === userId) {
      return user;
    }
  }

  return null;
};

export const tempAuth = {
  sessionCookieName: SESSION_COOKIE_NAME,
  defaultAvatarUrl: DEFAULT_AVATAR_URL,

  getSessionTokenFromCookieHeader(cookieHeader: string | null) {
    return parseSessionTokenFromCookieHeader(cookieHeader);
  },

  register(input: {
    username: string;
    email: string;
    password: string;
    country: string;
    role: TempAuthRole;
    alias?: string;
  }) {
    const store = getGlobalStore();
    const normalizedEmail = normalizeEmail(input.email);
    const normalizedUsername = normalizeUsername(input.username);

    if (store.usersByEmail.has(normalizedEmail)) {
      return { ok: false as const, error: "Email already registered." };
    }

    for (const existingUser of store.usersByEmail.values()) {
      if (normalizeUsername(existingUser.username) === normalizedUsername) {
        return { ok: false as const, error: "Username already taken." };
      }
    }

    const user: TempAuthUserRecord = {
      id: randomUUID(),
      username: input.username.trim(),
      email: normalizedEmail,
      country: input.country.trim(),
      bio: "",
      avatarUrl: DEFAULT_AVATAR_URL,
      role: input.role,
      alias: input.alias?.trim() || undefined,
      passwordHash: hashPassword(input.password),
      createdAt: new Date().toISOString(),
    };

    store.usersByEmail.set(normalizedEmail, user);

    if (input.role === "client") {
      store.ordersByUserId.set(user.id, [
        {
          id: `ord-${Math.random().toString(36).slice(2, 10)}`,
          game: "Valorant",
          service: "Rank Boost",
          status: "pending",
          createdAt: new Date().toISOString(),
        },
        {
          id: `ord-${Math.random().toString(36).slice(2, 10)}`,
          game: "Apex Legends",
          service: "Coaching",
          status: "accepted",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
        },
      ]);
    }

    return { ok: true as const, user: toPublicUser(user) };
  },

  login(input: { email: string; password: string; role: TempAuthRole }) {
    const store = getGlobalStore();
    const normalizedEmail = normalizeEmail(input.email);
    const user = store.usersByEmail.get(normalizedEmail);

    if (!user) {
      return { ok: false as const, error: "Invalid email or password." };
    }

    if (user.role !== input.role) {
      return { ok: false as const, error: `This account is registered as ${user.role}.` };
    }

    if (user.passwordHash !== hashPassword(input.password)) {
      return { ok: false as const, error: "Invalid email or password." };
    }

    const sessionToken = randomUUID();
    store.sessionsByToken.set(sessionToken, {
      token: sessionToken,
      userId: user.id,
      createdAt: new Date().toISOString(),
    });

    return {
      ok: true as const,
      sessionToken,
      user: toPublicUser(user),
    };
  },

  getUserBySessionToken(sessionToken: string) {
    const store = getGlobalStore();
    const session = store.sessionsByToken.get(sessionToken);
    if (!session) return null;

    const user = getUserRecordById(session.userId);
    if (!user) return null;

    return toPublicUser(user);
  },

  updateProfile(
    sessionToken: string,
    input: { username: string; country: string; bio: string; avatarUrl: string }
  ) {
    const store = getGlobalStore();
    const session = store.sessionsByToken.get(sessionToken);
    if (!session) {
      return { ok: false as const, error: "Unauthorized." };
    }

    const user = getUserRecordById(session.userId);
    if (!user) {
      return { ok: false as const, error: "User not found." };
    }

    user.username = input.username.trim();
    user.country = input.country.trim();
    user.bio = input.bio.trim();
    user.avatarUrl = input.avatarUrl.trim() || DEFAULT_AVATAR_URL;

    return { ok: true as const, user: toPublicUser(user) };
  },

  changePassword(sessionToken: string, currentPassword: string, nextPassword: string) {
    const store = getGlobalStore();
    const session = store.sessionsByToken.get(sessionToken);
    if (!session) {
      return { ok: false as const, error: "Unauthorized." };
    }

    const user = getUserRecordById(session.userId);
    if (!user) {
      return { ok: false as const, error: "User not found." };
    }

    if (user.passwordHash !== hashPassword(currentPassword)) {
      return { ok: false as const, error: "Current password is incorrect." };
    }

    user.passwordHash = hashPassword(nextPassword);
    return { ok: true as const };
  },

  getClientOrders(sessionToken: string) {
    const store = getGlobalStore();
    const session = store.sessionsByToken.get(sessionToken);
    if (!session) {
      return { ok: false as const, error: "Unauthorized." };
    }

    const user = getUserRecordById(session.userId);
    if (!user) {
      return { ok: false as const, error: "User not found." };
    }

    if (user.role !== "client") {
      return { ok: false as const, error: "Only client accounts can access orders." };
    }

    const orders = store.ordersByUserId.get(user.id) ?? [];
    return { ok: true as const, orders };
  },

  logout(sessionToken: string) {
    const store = getGlobalStore();
    store.sessionsByToken.delete(sessionToken);
  },
};
