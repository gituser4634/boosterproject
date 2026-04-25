import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

  try {
    const boosters = await prisma.boosterProfile.findMany({
      include: {
        user: true,
        mainGame: true,
        boosterGames: {
          include: {
            rank: true
          }
        },
        reviews: true
      },
      orderBy: [
        { averageRating: 'desc' },
        { successRate: 'desc' }
      ],
      take: limit
    });

    const formattedBoosters = boosters.map(booster => {
      const mainBoosterGame = booster.boosterGames.find(bg => bg.gameId === booster.mainGameId);
      
      return {
        id: booster.id,
        name: booster.displayName || booster.user.username,
        game: booster.mainGame.name,
        rating: Number(booster.averageRating).toFixed(1),
        rank: mainBoosterGame?.rank.name || "Unranked",
        rankIcon: "military_tech", // Default or map if possible
        popularity: booster.successRate, // Mapping successRate to popularity
        rankValue: mainBoosterGame?.rank.order || 0,
        live: false, // Default to false for now
        image: mainBoosterGame?.rank.imageUrl || "https://i.ytimg.com/vi/oQtHENM_GZU/hqdefault.jpg"
      };
    });

    return NextResponse.json(formattedBoosters);
  } catch (error) {
    console.error("Failed to fetch boosters:", error);
    return NextResponse.json({ error: "Failed to fetch boosters" }, { status: 500 });
  }
}
