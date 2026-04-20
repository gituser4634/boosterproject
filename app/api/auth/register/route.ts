import { NextResponse } from "next/server";
import { tempAuth, type TempAuthRole } from "@/lib/temp-auth-store";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    username?: string;
    email?: string;
    password?: string;
    country?: string;
    role?: TempAuthRole;
    alias?: string;
  } | null;

  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const username = body.username?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";
  const country = body.country?.trim() ?? "";
  const role = body.role;

  if (!username || !email || !password || !country || (role !== "booster" && role !== "client")) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }

  const registration = tempAuth.register({
    username,
    email,
    password,
    country,
    role,
    alias: body.alias,
  });

  if (!registration.ok) {
    return NextResponse.json({ error: registration.error }, { status: 409 });
  }

  const login = tempAuth.login({ email, password, role });
  if (!login.ok) {
    return NextResponse.json({ error: "Registration succeeded but login failed." }, { status: 500 });
  }

  const response = NextResponse.json({ user: login.user }, { status: 201 });
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
