import { NextResponse } from "next/server";
import { tempAuth } from "@/lib/temp-auth-store";

export async function PATCH(request: Request) {
  const sessionToken = tempAuth.getSessionTokenFromCookieHeader(request.headers.get("cookie"));
  if (!sessionToken) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    username?: string;
    country?: string;
    bio?: string;
    avatarUrl?: string;
  } | null;

  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const username = body.username?.trim() ?? "";
  const country = body.country?.trim() ?? "";
  const bio = body.bio?.trim() ?? "";
  const avatarUrl = body.avatarUrl?.trim() ?? "";

  if (!username || !country) {
    return NextResponse.json({ error: "Username and place of origin are required." }, { status: 400 });
  }

  const updated = tempAuth.updateProfile(sessionToken, {
    username,
    country,
    bio,
    avatarUrl,
  });

  if (!updated.ok) {
    return NextResponse.json({ error: updated.error }, { status: 401 });
  }

  return NextResponse.json({ user: updated.user });
}
