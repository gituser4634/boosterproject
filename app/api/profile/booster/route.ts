import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const userId = session.user.id;
  const userRole = session.user.role;

  if (userRole !== "BOOSTER") {
    return NextResponse.json({ error: "Only boosters can update booster profile." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { alias, bio, hourlyRate, country, languages } = body;

    // Find their booster profile
    const profile = await prisma.boosterProfile.findUnique({
      where: { userId: userId },
      select: { id: true },
    });

    if (!profile) {
      return NextResponse.json({ error: "Booster profile not found." }, { status: 404 });
    }

    // Update profile fields
    const updated = await prisma.boosterProfile.update({
      where: { id: profile.id },
      data: {
        ...(alias !== undefined ? { displayName: alias } : {}),
        ...(bio !== undefined ? { bio } : {}),
        ...(hourlyRate !== undefined ? { hourlyRate: parseFloat(hourlyRate) } : {}),
        ...(country !== undefined ? { country } : {}),
      },
    });

    // Replace languages if provided
    if (Array.isArray(languages)) {
      await prisma.boosterLanguage.deleteMany({ where: { boosterId: profile.id } });
      if (languages.length > 0) {
        await prisma.boosterLanguage.createMany({
          data: languages.map((lang: string) => ({
            boosterId: profile.id,
            language: lang,
          })),
        });
      }
    }

    return NextResponse.json({ ok: true, profile: updated });
  } catch (error) {
    console.error("Booster profile update error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
