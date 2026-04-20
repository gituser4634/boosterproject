export type TempAuthRole = "booster" | "client";

type AuthActionResult = {
  ok: boolean;
  message?: string;
};

const ensureSessionUser = async (expectedRole: TempAuthRole) => {
  const sessionResponse = await fetch("/api/auth/me", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!sessionResponse.ok) {
    return false;
  }

  const sessionPayload = (await sessionResponse.json().catch(() => ({}))) as {
    user?: { role?: TempAuthRole } | null;
  };

  return Boolean(sessionPayload.user && sessionPayload.user.role === expectedRole);
};

export async function tempAuthLogin(payload: {
  email: string;
  password: string;
  role: TempAuthRole;
}): Promise<AuthActionResult> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = (await response.json().catch(() => ({}))) as { error?: string };
    if (!response.ok) {
      return { ok: false, message: data.error ?? "Login failed." };
    }

    const hasExpectedSession = await ensureSessionUser(payload.role);
    if (!hasExpectedSession) {
      return { ok: false, message: "Login succeeded but session was not established. Please try again." };
    }

    return { ok: true };
  } catch {
    return { ok: false, message: "Could not reach the server. Please try again." };
  }
}

export async function tempAuthRegister(payload: {
  username: string;
  email: string;
  country: string;
  password: string;
  role: TempAuthRole;
  alias?: string;
}): Promise<AuthActionResult> {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = (await response.json().catch(() => ({}))) as { error?: string };
    if (!response.ok) {
      return { ok: false, message: data.error ?? "Registration failed." };
    }

    const hasExpectedSession = await ensureSessionUser(payload.role);
    if (!hasExpectedSession) {
      return {
        ok: false,
        message: "Account created but session was not established. Please log in.",
      };
    }

    return { ok: true };
  } catch {
    return { ok: false, message: "Could not reach the server. Please try again." };
  }
}

export async function tempAuthLogout(): Promise<void> {
  await fetch("/api/auth/logout", {
    method: "POST",
  }).catch(() => {
    // Ignore transient network errors and continue redirect flow.
  });
}
