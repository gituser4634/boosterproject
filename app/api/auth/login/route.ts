import { NextResponse } from "next/server";
import { tempAuth, type TempAuthRole } from "@/lib/temp-auth-store";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    email?: string;
    password?: string;
    role?: TempAuthRole;
  } | null;

  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";
  const role = body.role;

  if (!email || !password || (role !== "booster" && role !== "client")) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const login = tempAuth.login({ email, password, role });
  if (!login.ok) {
    return NextResponse.json({ error: login.error }, { status: 401 });
  }

  const response = NextResponse.json({ user: login.user });
  response.cookies.set({
    name: tempAuth.sessionCookieName,
    value: login.sessionToken,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
