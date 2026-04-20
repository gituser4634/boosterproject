export type TempAuthRole = "booster" | "client";

type AuthActionResult = {
  ok: boolean;
  message?: string;
};

export async function tempAuthLogin(payload: {
  email: string;
  password: string;
  role: TempAuthRole;
}): Promise<AuthActionResult> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => ({}))) as { error?: string };
  if (!response.ok) {
    return { ok: false, message: data.error ?? "Login failed." };
  }

  return { ok: true };
}

export async function tempAuthRegister(payload: {
  username: string;
  email: string;
  country: string;
  password: string;
  role: TempAuthRole;
  alias?: string;
}): Promise<AuthActionResult> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => ({}))) as { error?: string };
  if (!response.ok) {
    return { ok: false, message: data.error ?? "Registration failed." };
  }

  return { ok: true };
}

export async function tempAuthLogout(): Promise<void> {
  await fetch("/api/auth/logout", {
    method: "POST",
  }).catch(() => {
    // Ignore transient network errors and continue redirect flow.
  });
}
