import { NextResponse } from "next/server";
import { tempAuth } from "@/lib/temp-auth-store";

export async function GET(request: Request) {
  const sessionToken = tempAuth.getSessionTokenFromCookieHeader(request.headers.get("cookie"));
  if (!sessionToken) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const result = tempAuth.getClientOrders(sessionToken);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 403 });
  }

  return NextResponse.json({ orders: result.orders });
}
