import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        username: true,
        displayName: true,
        email: true,
        role: true,
        profilePictureUrl: true,
        isActive: true,
        createdAt: true,
        boosterProfile: {
          select: {
            id: true,
            displayName: true,
            bio: true,
            country: true,
            hourlyRate: true,
            hours: true,
            successRate: true,
            averageRating: true,
            totalReviews: true,
            mainGameId: true,
            languages: { select: { language: true } },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Me error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
