import { NextResponse } from "next/server";
import { tempAuth } from "@/lib/temp-auth-store";

export async function POST(request: Request) {
  const sessionToken = tempAuth.getSessionTokenFromCookieHeader(request.headers.get("cookie"));

  if (sessionToken) {
    tempAuth.logout(sessionToken);
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: tempAuth.sessionCookieName,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
