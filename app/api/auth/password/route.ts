import { NextResponse } from "next/server";
import { tempAuth } from "@/lib/temp-auth-store";

export async function POST(request: Request) {
  const sessionToken = tempAuth.getSessionTokenFromCookieHeader(request.headers.get("cookie"));
  if (!sessionToken) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    currentPassword?: string;
    nextPassword?: string;
  } | null;

  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const currentPassword = body.currentPassword ?? "";
  const nextPassword = body.nextPassword ?? "";

  if (!currentPassword || !nextPassword) {
    return NextResponse.json({ error: "Both password fields are required." }, { status: 400 });
  }

  if (nextPassword.length < 6) {
    return NextResponse.json({ error: "New password must be at least 6 characters." }, { status: 400 });
  }

  const changed = tempAuth.changePassword(sessionToken, currentPassword, nextPassword);
  if (!changed.ok) {
    return NextResponse.json({ error: changed.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
