import { NextResponse } from "next/server";

export async function GET() {
  const payload = {
    sessionActive: "0h 00m",
    activeOrdersCount: 0,
    activeOrdersDeltaPct: 0,
    pendingRequestsCount: 0,
    newRequestsCount: 0,
    monthlyEarnings: 0,
    newMessagesCount: 0,
    incomingRequests: [],
    activeOrders: [],
    trendPoints: [0, 0, 0, 0, 0, 0, 0, 0],
    trendGrowthPct: 0,
    trendAvgWeekly: 0,
    recentMessages: [],
    activityFeed: [],
    eliteTopPct: 0,
    eliteRating: 0,
    unreadNotifications: 0,
  };

  return NextResponse.json(payload);
}
