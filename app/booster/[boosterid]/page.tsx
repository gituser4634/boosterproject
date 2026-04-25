import { BoosterProfileView, BoosterProfileData } from "@/components/booster/booster-profile-view";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{
    boosterid: string;
  }>;
}

export default async function BoosterProfilePage({ params }: Props) {
  const { boosterid } = await params;
  let profileData: BoosterProfileData | undefined = undefined;
  
  try {
    const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(boosterid);

    const includeBlock = {
      user: true,
      mainGame: true,
      boosterGames: {
        include: {
          rank: true
        }
      },
      reviews: {
        include: {
          customer: true
        },
        take: 4,
        orderBy: {
          createdAt: 'desc' as const
        }
      },
      languages: true
    };

    const boosterProfile = isUuid 
      ? await prisma.boosterProfile.findUnique({
          where: { id: boosterid },
          include: includeBlock
        })
      : await prisma.boosterProfile.findFirst({
          where: { user: { username: boosterid } },
          include: includeBlock
        });

    if (boosterProfile) {
      const completedOrders = await prisma.order.count({
        where: {
          boosterId: boosterProfile.id,
          status: "COMPLETED"
        }
      });

      const mainBoosterGame = boosterProfile.boosterGames.find(bg => bg.gameId === boosterProfile.mainGameId);

      profileData = {
        boosterId: boosterProfile.id,
        username: boosterProfile.user.username,
        alias: boosterProfile.displayName,
        pfpUrl: boosterProfile.user.profilePictureUrl || "",
        bio: boosterProfile.bio || "",
        rating: Number(boosterProfile.averageRating),
        hoursPlayed: boosterProfile.hours > 0 ? `${boosterProfile.hours}` : "0",
        successRate: `${boosterProfile.successRate}%`,
        hourlyRate: Number(boosterProfile.hourlyRate),
        totalOrders: completedOrders,
        mainGame: boosterProfile.mainGame?.name || "Multiple Games",
        mainRank: mainBoosterGame?.rank.name || "Unranked",
        mainBadgeUrl: (mainBoosterGame?.rank as any)?.imageUrl || "https://mmonster.co/media/40/b0/a8/1715176623/apex-legends-predator-badge.webp",
        origin: boosterProfile.country || "Global",
        languages: boosterProfile.languages.map(l => l.language),
        joinDate: new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(boosterProfile.createdAt),
        reviews: boosterProfile.reviews.map(r => ({
          id: r.id,
          name: r.customer.displayName || r.customer.username,
          summary: "Verified Client",
          rating: (r.rating >= 4 ? r.rating : 5) as 4 | 5,
          comment: r.comment,
          tone: (["primary", "secondary", "tertiary"][Math.floor(Math.random() * 3)]) as "primary" | "secondary" | "tertiary"
        }))
      };
    }
  } catch (error) {
    console.error("Critical Profile Load Error:", error);
  }

  return <BoosterProfileView profileData={profileData} />;
}
