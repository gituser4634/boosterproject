import { NextResponse } from "next/server";
import { tempAuth } from "@/lib/temp-auth-store";

export async function GET(request: Request) {
  const sessionToken = tempAuth.getSessionTokenFromCookieHeader(request.headers.get("cookie"));

  if (!sessionToken) {
    return NextResponse.json({ user: null });
  }

  const user = tempAuth.getUserBySessionToken(sessionToken);
  return NextResponse.json({ user: user ?? null });
}
