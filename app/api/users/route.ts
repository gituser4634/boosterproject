import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const ALLOWED_ROLES = new Set(["CLIENT", "BOOSTER"]);

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        displayName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unable to fetch users",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const displayName =
      typeof body.displayName === "string"
        ? body.displayName.trim()
        : typeof body.alias === "string"
          ? body.alias.trim()
          : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const role = typeof body.role === "string" ? body.role.trim().toUpperCase() : "";
    const country = typeof body.country === "string" ? body.country.trim() : null;

    if (!username || !email || !password || !ALLOWED_ROLES.has(role)) {
      return NextResponse.json(
        {
          error: "Invalid payload",
          required: ["username", "email", "password", "role: CLIENT|BOOSTER"],
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        displayName: displayName || username,
        email,
        password: hashedPassword,
        role: role as "CLIENT" | "BOOSTER",
        wallet: {
          create: {},
        },
        ...(role === "BOOSTER" ? {
          boosterProfile: {
            create: {
              displayName: displayName || username,
              country: country,
              // hours: 0 and successRate: 100 are handled by schema defaults
            }
          }
        } : {})
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error: unknown) {
    const maybePrismaError = error as { code?: string; meta?: { target?: string[] } };
    if (maybePrismaError.code === "P2002") {
      return NextResponse.json(
        {
          error: "User already exists",
          field: maybePrismaError.meta?.target,
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: "Unable to create user",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
