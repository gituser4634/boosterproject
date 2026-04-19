"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Bell,
  BellOff,
  CircleHelp,
  ClipboardList,
  Crown,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Wallet,
  X,
} from "lucide-react";

type RequestType = "Boost Request" | "Coaching" | "Play Together";

type RequestCard = {
  id: string;
  customer: string;
  customerId: string;
  avatar: string;
  chatThreadId: string;
  hasUnreadMessage: boolean;
  requestType: RequestType;
  requestedDate: string;
  requestedTime: string;
  game: string;
  currentRank: string;
  desiredRank?: string;
  requestedHours: number;
  payPrice: string;
  notes: string;
};

type WeeklySchedule = {
  day: string;
  requested: string[];
  busy: string[];
};

const initialRequestCards: RequestCard[] = [
  {
    id: "card-1",
    customer: "GamerPro",
    customerId: "#88219",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCPPZ6U_Kh8jC7zTziP1WtlNMabB0UW1pH3ljHt5pKWlFBhg9Uu-z2eNl7UUfLA3zAS4z9yuSMky4ICXNYGWr_SbSwOq8cbgoRJMRX-GfcDxB1jAOH2ZuA-l0TXCyQ8ko2S6_mA76m2f-MoQ12fnJPWOJpnFxQVmxFu8ba1hDMmVIis_Xm7DeWCn7nJcx1mPXDrHu48a3JURo22aEQnkJHWDAXCwUwpaQD4TdBq5EjTf3MSTR0CI5x5C6LtWpO6LyqzUdfcWQyY4tE",
    chatThreadId: "card-1",
    hasUnreadMessage: true,
    requestType: "Boost Request",
    requestedDate: "Apr 19, 2026",
    requestedTime: "09:15 AM",
    game: "League of Legends",
    currentRank: "Platinum IV",
    desiredRank: "Diamond IV",
    requestedHours: 12,
    payPrice: "$120.00",
    notes: '"Prefers morning sessions, use VPN"',
  },
  {
    id: "card-2",
    customer: "ShadowReaper",
    customerId: "#88224",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBGfvlQ0S9lW3oDV8rWDSZeCf5oKnU8BuViauBXEnFTBV4oyicHXMM41MWYo6Yqa6BE-12udJjOrmut1zuL2lmbmJaB9XqDS5FEvRYINY_YWuRr8bIldB1KH1mIGs2ivUm1O1pnM2MuuZIG2aCXPt3uo1O2UzZ0rTIjqQYcHPNTNCgbuGIxzuLg7xCXGgFZ5Y1x8cXmrlf2UPjIvZdbWjoMzHRjTJU7mxt--LP-BvlLcG6IZQul9ivJcoinBavR1MAeJurfBP5o7FU",
    chatThreadId: "card-2",
    hasUnreadMessage: true,
    requestType: "Coaching",
    requestedDate: "Apr 19, 2026",
    requestedTime: "01:40 PM",
    game: "Counter-Strike 2",
    currentRank: "Faceit Lv. 6",
    requestedHours: 4,
    payPrice: "$75.00",
    notes: '"Wants aim + utility review, screen share available"',
  },
  {
    id: "card-3",
    customer: "NovaStrike",
    customerId: "#88301",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAiW2NaeWuuVRQ93jf8ldCnsr6l8wTL1OG-DuufzqFsk19InG4n3rSMxUJMsAi-fcnPYfcPxe6FWRb6IUbbpV8yF-rWLMTzbaEw6mu_wJxVcwv1hf5T2QILVY6G4_pYdUGD7TvWjI0JDQsiRNHNDDYNFli5W6yqhFP4z25XpcF_Xz6AtRCTA-LO5c4_DSfr2nSmRmd5xYFEpuEWodqH3WjNS7yHwBa5yb6jymaPh-DGlvjdFFrfSLg5uXVBW9Fg35iiWJ_D4srvtoA",
    chatThreadId: "card-3",
    hasUnreadMessage: true,
    requestType: "Play Together",
    requestedDate: "Apr 20, 2026",
    requestedTime: "08:00 PM",
    game: "Valorant",
    currentRank: "Ascendant I",
    requestedHours: 3,
    payPrice: "$45.00",
    notes: '"Duo queue preferred, comms on Discord"',
  },
];

const scheduleByRequest: Record<string, WeeklySchedule[]> = {
  "card-1": [
    { day: "Mon", requested: ["09:00-11:00"], busy: ["10:00-12:00", "18:00-20:00"] },
    { day: "Tue", requested: ["09:00-11:00"], busy: ["14:00-16:00"] },
    { day: "Wed", requested: ["08:00-10:00"], busy: ["08:00-10:00", "20:00-22:00"] },
    { day: "Thu", requested: ["09:00-11:00"], busy: ["12:00-14:00"] },
    { day: "Fri", requested: ["09:00-11:00"], busy: ["17:00-19:00"] },
    { day: "Sat", requested: ["10:00-12:00"], busy: ["10:00-12:00", "15:00-17:00"] },
    { day: "Sun", requested: ["09:00-11:00"], busy: ["13:00-15:00"] },
  ],
  "card-2": [
    { day: "Mon", requested: ["13:00-15:00"], busy: ["09:00-11:00"] },
    { day: "Tue", requested: ["13:00-15:00"], busy: ["13:00-15:00", "20:00-22:00"] },
    { day: "Wed", requested: ["13:00-15:00"], busy: ["17:00-19:00"] },
    { day: "Thu", requested: ["13:00-15:00"], busy: ["13:00-15:00"] },
    { day: "Fri", requested: ["13:00-15:00"], busy: ["11:00-13:00"] },
    { day: "Sat", requested: ["14:00-16:00"], busy: ["18:00-20:00"] },
    { day: "Sun", requested: ["14:00-16:00"], busy: ["14:00-16:00"] },
  ],
  "card-3": [
    { day: "Mon", requested: ["20:00-21:30"], busy: ["18:00-20:00"] },
    { day: "Tue", requested: ["20:00-21:30"], busy: ["20:00-22:00"] },
    { day: "Wed", requested: ["20:00-21:30"], busy: ["09:00-11:00"] },
    { day: "Thu", requested: ["20:00-21:30"], busy: ["20:00-21:30"] },
    { day: "Fri", requested: ["20:00-21:30"], busy: ["16:00-18:00"] },
    { day: "Sat", requested: ["19:00-20:30"], busy: ["19:00-20:30", "21:00-22:30"] },
    { day: "Sun", requested: ["19:00-20:30"], busy: ["11:00-13:00"] },
  ],
};

export default function BoosterRequestsPage() {
  const [requestCards, setRequestCards] = useState<RequestCard[]>(initialRequestCards);
  const [inspectingRequestId, setInspectingRequestId] = useState<string | null>(null);
  const [isAcceptStepUnlocked, setIsAcceptStepUnlocked] = useState(false);
  const [rescheduleRequestedIds, setRescheduleRequestedIds] = useState<string[]>([]);
  const [isSidebarOnline, setIsSidebarOnline] = useState(true);
  const [isNotificationsOn, setIsNotificationsOn] = useState(true);
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(2);

  const inspectedRequest = useMemo(
    () => requestCards.find((item) => item.id === inspectingRequestId) ?? null,
    [requestCards, inspectingRequestId]
  );

  const inspectedSchedule = useMemo(() => {
    if (!inspectingRequestId) return [];
    return scheduleByRequest[inspectingRequestId] ?? [];
  }, [inspectingRequestId]);

  const hasScheduleConflict = useMemo(
    () => inspectedSchedule.some((slot) => slot.requested.some((time) => slot.busy.includes(time))),
    [inspectedSchedule]
  );

  const handleInspect = (requestId: string) => {
    setInspectingRequestId(requestId);
    setIsAcceptStepUnlocked(false);
  };

  const handleReject = (requestId: string) => {
    setRequestCards((current) => current.filter((item) => item.id !== requestId));
    setRescheduleRequestedIds((current) => current.filter((id) => id !== requestId));
    if (inspectingRequestId === requestId) {
      setInspectingRequestId(null);
      setIsAcceptStepUnlocked(false);
    }
  };

  const handleRequestReschedule = () => {
    if (!inspectedRequest) return;
    setRescheduleRequestedIds((current) =>
      current.includes(inspectedRequest.id) ? current : [...current, inspectedRequest.id]
    );
    setInspectingRequestId(null);
    setIsAcceptStepUnlocked(false);
  };

  const handleMarkNotificationsRead = () => {
    setUnreadNotificationCount(0);
  };

  const handleConfirmRequest = () => {
    if (!inspectedRequest) return;
    setRequestCards((current) => current.filter((item) => item.id !== inspectedRequest.id));
    setInspectingRequestId(null);
    setIsAcceptStepUnlocked(false);
  };

  const getScheduleDateLabel = (dayAbbrev: string) => {
    if (!inspectedRequest) return "";

    const baseDate = new Date(inspectedRequest.requestedDate);
    if (Number.isNaN(baseDate.getTime())) return "";

    const dayIndexByAbbrev: Record<string, number> = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
    };

    const targetDayIndex = dayIndexByAbbrev[dayAbbrev];
    if (targetDayIndex === undefined) return "";

    const diffDays = (targetDayIndex - baseDate.getDay() + 7) % 7;
    const resolvedDate = new Date(baseDate);
    resolvedDate.setDate(baseDate.getDate() + diffDays);

    return resolvedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderSidebarItem = (label: string) => {
    const icon =
      label === "Dashboard" ? (
        <LayoutDashboard className="h-5 w-5" />
      ) : label === "Requests" ? (
        <ClipboardList className="h-5 w-5" />
      ) : label === "Payments" ? (
        <Wallet className="h-5 w-5" />
      ) : (
        <MessageSquare className="h-5 w-5" />
      );

    if (label === "Requests") {
      return (
        <div className="flex items-center gap-3 rounded-l-lg border-r-2 border-cyan-400 bg-cyan-400/10 p-3 text-cyan-400">
          {icon}
          <span>{label}</span>
        </div>
      );
    }

    return (
      <a
        href={label === "Dashboard" ? "/booster-dashboard" : label === "Payments" ? "/booster-payments" : "/booster-chats"}
        className="flex cursor-pointer items-center gap-3 rounded-lg border border-transparent p-3 text-slate-500 transition-all duration-300 hover:translate-x-1 hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-300 hover:shadow-[0_0_22px_rgba(34,211,238,0.25)] active:opacity-80"
      >
        {icon}
        <span>{label}</span>
      </a>
    );
  };

  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-slate-950/70 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-xl">
        <div className="flex h-16 w-full items-center justify-between px-6">
          <Link href="/" className="font-headline text-2xl font-bold uppercase tracking-tighter text-cyan-400">
            ZENITH BOOSTER
          </Link>
          <div className="flex items-center gap-6">
            <div className="relative z-[55]">
              <button
                type="button"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  setIsNotificationsPanelOpen((current) => !current);
                }}
                className={`relative rounded-lg p-1 transition-all duration-200 active:scale-95 ${
                  isNotificationsOn ? "text-cyan-300" : "text-red-400 hover:text-red-300"
                }`}
              >
                {isNotificationsOn ? <Bell className="h-6 w-6" /> : <BellOff className="h-6 w-6" />}
                {unreadNotificationCount > 0 ? (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
                    {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                  </span>
                ) : null}
              </button>

              {isNotificationsPanelOpen ? (
                <>
                  <button
                    type="button"
                    aria-label="Close notifications panel"
                    onClick={() => setIsNotificationsPanelOpen(false)}
                    className="fixed inset-0 z-[54] cursor-default"
                  ></button>
                  <div className="ghost-border absolute right-0 top-10 z-[55] w-[320px] rounded-xl border border-white/10 bg-surface-container p-4 shadow-2xl">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-headline text-sm font-bold uppercase tracking-wider text-on-surface">Notifications</h3>
                      <button
                        type="button"
                        onClick={handleMarkNotificationsRead}
                        className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary-container"
                      >
                        Mark Read
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="rounded-md border border-white/5 bg-surface-container-low px-3 py-2">
                        <p className="text-xs font-semibold text-on-surface">New request waiting for review</p>
                        <p className="text-[10px] uppercase tracking-wider text-on-surface-variant">Queue • Just now</p>
                      </div>
                      <div className="rounded-md border border-white/5 bg-surface-container-low px-3 py-2">
                        <p className="text-xs font-semibold text-on-surface">Schedule conflict detected</p>
                        <p className="text-[10px] uppercase tracking-wider text-on-surface-variant">Calendar • 5m ago</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsNotificationsOn((current) => !current)}
                      className={`mt-3 flex w-full items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs font-bold uppercase tracking-widest ${
                        isNotificationsOn
                          ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20"
                          : "border-red-500/30 bg-red-500/15 text-red-300 hover:bg-red-500/25"
                      }`}
                    >
                      {isNotificationsOn ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                      {isNotificationsOn ? "Mute Notifications" : "Unmute Notifications"}
                    </button>
                  </div>
                </>
              ) : null}
            </div>

            <div className="relative z-[56]">
              <button
                type="button"
                onClick={() => {
                  setIsNotificationsPanelOpen(false);
                  setIsProfileMenuOpen((current) => !current);
                }}
                className="h-8 w-8 overflow-hidden rounded-full border border-primary/20"
              >
                <img
                  alt="Booster profile avatar"
                  className="h-full w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOpmET-_XwpMu-U8Yyfwf7q3YBENVlPKtJSSetfzesDBvB_EBNOWEuW-JWGPYwxhcqPr6lwbqPOLNhMfpBUDn2ULU_HHxdcAATM2neuwjO4b7xcq1HSLBkxSJJUM-cnAqIHs6TG4u1xwzzoHSJ8RoQfXgNyUiz8wafsJPOdh5ScjjbzPsSDz3X0VlwGWioSiVsPgd5GDe4e0Z_Ks4bvmTCQO3ZMKE1qji8vAWXOAityeFB8pCvJbsIoPJPsA71xuU_7CawCwyZoZE"
                />
              </button>

              {isProfileMenuOpen ? (
                <>
                  <button
                    type="button"
                    aria-label="Close profile menu"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="fixed inset-0 z-[55] cursor-default"
                  ></button>
                  <div className="ghost-border absolute right-0 top-10 z-[56] w-[220px] rounded-xl border border-white/10 bg-surface-container p-2 shadow-2xl">
                    {["View Profile", "Settings", "Help Support", "Logout"].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          if (item === "Settings") {
                            window.location.href = "/booster-profile";
                            return;
                          }

                          setIsProfileMenuOpen(false);
                        }}
                        className={`w-full rounded-md px-3 py-2 text-left text-xs font-bold uppercase tracking-wider transition-colors ${
                          item === "Logout"
                            ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
                            : "text-on-surface-variant hover:bg-white/10 hover:text-on-surface"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </nav>

      <aside className="fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-white/15 bg-[#04060a]/95 pt-20 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_24px_60px_rgba(0,0,0,0.6)] backdrop-blur-md">
        <div className="mb-4 flex flex-col items-center border-b border-white/5 px-6 py-4">
          <div className="ghost-border mb-2 flex h-16 w-16 items-center justify-center rounded-xl bg-surface-container-highest">
            <Crown className="h-8 w-8 text-[#b87333]" />
          </div>
          <h3 className="font-headline font-bold text-on-surface">ROOKIE</h3>
          <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Main Game: Not Set</p>
          <div className="mt-3 w-full space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              <span>Rookie XP</span>
              <span>0%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-highest">
              <div className="primary-gradient h-full w-[0%]"></div>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-300">0 / 10000 XP</p>
          </div>
        </div>

        <nav className="font-label flex grow flex-col gap-2 p-4 text-sm font-semibold tracking-wide">
          {renderSidebarItem("Dashboard")}
          {renderSidebarItem("Requests")}
          {renderSidebarItem("Payments")}
          {renderSidebarItem("Chats")}
        </nav>

        <div className="px-4 pb-5">
          <div className="mb-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div className="mb-3 flex items-center justify-between rounded-md border border-white/10 bg-surface-container-high/60 px-2.5 py-2">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${isSidebarOnline ? "bg-emerald-400" : "bg-slate-500"}`}></span>
              <span className="text-[11px] font-semibold text-on-surface-variant">{isSidebarOnline ? "Online" : "Offline"}</span>
            </div>
            <button
              type="button"
              aria-pressed={isSidebarOnline}
              onClick={() => setIsSidebarOnline((current) => !current)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                isSidebarOnline ? "bg-cyan-400/70" : "bg-outline-variant"
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full transition ${
                  isSidebarOnline ? "translate-x-5 bg-slate-950" : "translate-x-1 bg-on-surface-variant"
                }`}
              ></span>
            </button>
          </div>
          <button className="mb-4 w-full rounded-md bg-gradient-to-r from-primary to-primary-container py-3 text-xs font-bold uppercase tracking-widest text-on-primary-fixed transition-all hover:brightness-110 active:scale-95">
            GO ONLINE
          </button>
          <a className="mb-1 flex items-center gap-3 rounded-lg px-4 py-2 text-slate-500 transition-all hover:bg-white/5 hover:text-slate-300" href="#">
            <CircleHelp className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Support</span>
          </a>
          <Link href="/booster-profile" className="flex items-center gap-3 rounded-lg px-4 py-2 text-slate-500 transition-all hover:bg-white/5 hover:text-slate-300">
            <Settings className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Settings</span>
          </Link>
        </div>
      </aside>

      <main className="min-h-screen pb-24 pl-8 pr-8 pt-24 md:ml-64">
        <div className="mx-auto max-w-6xl p-6 md:p-10">
          <header className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">Live Feed</div>
              <h1 className="font-headline mb-4 text-5xl font-bold leading-none tracking-tighter text-on-surface md:text-6xl">
                Pending <span className="text-primary italic">Requests</span>
              </h1>
              <p className="font-body max-w-lg text-lg leading-relaxed text-on-surface-variant">
                Analyze incoming assignments and inspect requested times before accepting.
              </p>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {requestCards.map((item) => (
              <div key={item.id} className="ghost-border group relative rounded-xl bg-surface-container-low p-6 transition-all duration-500 hover:bg-surface-container">
                <div className="mb-7 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="ghost-border h-12 w-12 overflow-hidden rounded-lg">
                      <img className="h-full w-full object-cover" alt={`${item.customer} avatar`} src={item.avatar} />
                    </div>
                    <div>
                      <h3 className="font-headline text-xl font-bold text-on-surface transition-colors group-hover:text-primary">{item.customer}</h3>
                      <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Customer ID: {item.customerId}</div>
                      <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{item.requestedDate} • {item.requestedTime}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-headline text-2xl font-bold text-primary">{item.requestedHours}h</div>
                    <div className="mt-1 text-sm font-bold text-cyan-300">{item.payPrice}</div>
                    <div className="mt-1 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-primary">
                      {item.requestType}
                    </div>
                    {rescheduleRequestedIds.includes(item.id) ? (
                      <div className="mt-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-amber-300">
                        Reschedule Requested
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="mb-6 rounded-lg bg-surface-container-lowest p-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Game</div>
                      <div className="font-headline text-base font-semibold text-on-surface">{item.game}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Rank</div>
                      <div className="text-sm font-bold text-slate-300">{item.currentRank}</div>
                    </div>
                    {item.requestType === "Boost Request" ? (
                      <div className="sm:col-span-2">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Desired Rank</div>
                        <div className="inline-flex rounded bg-primary/20 px-3 py-1 text-sm font-bold text-primary">{item.desiredRank ?? "Not specified"}</div>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="mb-6 rounded-lg border border-white/5 bg-surface-container-highest/30 px-4 py-3">
                  <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Notes</div>
                  <p className="text-xs italic leading-relaxed text-on-surface opacity-80">{item.notes}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleInspect(item.id)}
                    className="rounded-md border border-primary/40 bg-primary/10 px-5 py-3 text-xs font-bold uppercase tracking-widest text-primary transition-all hover:bg-primary/20 active:scale-95"
                  >
                    Inspect
                  </button>
                  {item.hasUnreadMessage ? (
                    <Link
                      href={`/booster-chats?thread=${item.chatThreadId}`}
                      className="inline-flex items-center gap-2 rounded-md border border-emerald-500/60 bg-emerald-500/10 px-4 py-3 text-xs font-bold uppercase tracking-widest text-emerald-300 transition-all hover:bg-emerald-500/20 active:scale-95"
                      aria-label={`Open chat from ${item.customer}`}
                    >
                      <MessageSquare className="h-4 w-4" />
                      Message
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => handleReject(item.id)}
                    className="rounded-md border border-red-500/70 px-5 py-3 text-xs font-bold uppercase tracking-widest text-red-400 transition-all hover:bg-red-500/10 hover:text-red-300 active:scale-95"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>

          {requestCards.length === 0 ? (
            <div className="mt-8 rounded-xl border border-white/10 bg-surface-container-low p-8 text-center text-sm uppercase tracking-widest text-on-surface-variant">
              No pending requests left.
            </div>
          ) : null}
        </div>
      </main>

      {inspectedRequest ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4 py-6" onClick={() => setInspectingRequestId(null)}>
          <div className="ghost-border w-full max-w-4xl rounded-2xl border border-white/10 bg-surface-container p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-headline text-3xl font-bold tracking-tight text-primary-fixed">Inspect Schedule</h3>
                <p className="mt-2 text-sm text-on-surface-variant">
                  Requested by {inspectedRequest.customer} • {inspectedRequest.requestType}
                </p>
              </div>
              <button type="button" onClick={() => setInspectingRequestId(null)} className="rounded-md p-2 text-on-surface-variant transition-colors hover:bg-white/10 hover:text-on-surface" aria-label="Close inspect modal">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-3 text-[11px] uppercase tracking-widest text-on-surface-variant sm:grid-cols-3">
              <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2">Requested Slot In Schedule</div>
              <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2">Already Busy</div>
              <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2">Requested Slot Not In Schedule</div>
            </div>

            <div className="mb-6 rounded-xl border border-white/10 bg-surface-container-low p-4">
              <div className="mb-3 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Visual Weekly Calendar</div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {inspectedSchedule.map((slot) => {
                  const dateLabel = getScheduleDateLabel(slot.day);
                  const requestedSlots = slot.requested.map((time) => ({
                    time,
                    inSchedule: !slot.busy.includes(time),
                  }));

                  return (
                    <div key={`calendar-${slot.day}-${dateLabel || "no-date"}`} className="rounded-lg border border-white/10 bg-surface-container-high/60 p-3">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <div className="text-sm font-bold text-on-surface">{slot.day}</div>
                        <div className="text-[11px] text-on-surface-variant">{dateLabel}</div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {requestedSlots.map((requestedSlot) => (
                          <span
                            key={`${slot.day}-${requestedSlot.time}`}
                            className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${
                              requestedSlot.inSchedule
                                ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300"
                                : "border-red-500/50 bg-red-500/15 text-red-300"
                            }`}
                          >
                            {requestedSlot.time}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-widest text-on-surface-variant">
                    <th className="border-b border-white/10 px-3 py-2">Day & Date</th>
                    <th className="border-b border-white/10 px-3 py-2">Requested Hours</th>
                    <th className="border-b border-white/10 px-3 py-2">Booster Busy Hours</th>
                    <th className="border-b border-white/10 px-3 py-2">Availability Check</th>
                  </tr>
                </thead>
                <tbody>
                  {inspectedSchedule.map((slot) => {
                    const overlaps = slot.requested.filter((time) => slot.busy.includes(time));
                    const isConflict = overlaps.length > 0;
                    const dateLabel = getScheduleDateLabel(slot.day);
                    const requestedSlots = slot.requested.map((time) => ({
                      time,
                      inSchedule: !slot.busy.includes(time),
                    }));

                    return (
                      <tr key={`${slot.day}-${dateLabel || "no-date"}`} className="border-b border-white/5">
                        <td className="px-3 py-3 font-bold text-on-surface">
                          {slot.day}
                          {dateLabel ? <span className="ml-2 text-xs font-medium text-on-surface-variant">({dateLabel})</span> : null}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex flex-wrap gap-2">
                            {requestedSlots.map((requestedSlot) => (
                              <span
                                key={`${slot.day}-table-${requestedSlot.time}`}
                                className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${
                                  requestedSlot.inSchedule
                                    ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300"
                                    : "border-red-500/50 bg-red-500/15 text-red-300"
                                }`}
                              >
                                {requestedSlot.time}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-on-surface-variant">{slot.busy.join(", ")}</td>
                        <td className="px-3 py-3">
                          <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${isConflict ? "bg-red-500/15 text-red-300 border border-red-500/40" : "bg-primary/15 text-primary border border-primary/40"}`}>
                            {isConflict ? "Conflict" : "Available"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                {hasScheduleConflict ? "Conflicting hours found" : "All requested hours are in schedule"}
              </div>

              <div className="flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={() => handleReject(inspectedRequest.id)}
                  className="rounded-md border border-red-500/70 px-5 py-3 text-xs font-bold uppercase tracking-widest text-red-300 transition-all hover:bg-red-500/10 hover:text-red-200 active:scale-95"
                >
                  Deny Request
                </button>

                {hasScheduleConflict ? (
                  <button
                    type="button"
                    onClick={handleRequestReschedule}
                    className="rounded-md border border-amber-400/60 bg-amber-400/10 px-5 py-3 text-xs font-bold uppercase tracking-widest text-amber-200 transition-all hover:bg-amber-400/20 active:scale-95"
                  >
                    Accept & Reschedule
                  </button>
                ) : !isAcceptStepUnlocked ? (
                  <button
                    type="button"
                    onClick={() => setIsAcceptStepUnlocked(true)}
                    className="rounded-md bg-gradient-to-br from-primary to-primary-container px-6 py-3 text-xs font-black uppercase tracking-widest text-on-primary-fixed transition-all hover:scale-[1.02] active:scale-95"
                  >
                    Accept
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleConfirmRequest}
                    className="rounded-md bg-gradient-to-br from-primary to-primary-container px-6 py-3 text-xs font-black uppercase tracking-widest text-on-primary-fixed transition-all hover:scale-[1.02] active:scale-95"
                  >
                    Confirm Request
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <nav className="fixed bottom-0 z-50 flex h-16 w-full items-center justify-around border-t border-white/10 bg-slate-950/90 px-4 backdrop-blur-xl md:hidden">
        <Link href="/booster-dashboard" className="flex flex-col items-center gap-1 text-slate-500">
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-[10px] font-bold">DASH</span>
        </Link>
        <button className="flex flex-col items-center gap-1 text-cyan-400">
          <ClipboardList className="h-5 w-5" />
          <span className="text-[10px] font-bold">REQS</span>
        </button>
        <Link href="/booster-payments" className="flex flex-col items-center gap-1 text-slate-500">
          <Wallet className="h-5 w-5" />
          <span className="text-[10px] font-bold">PAY</span>
        </Link>
        <Link href="/booster-chats" className="flex flex-col items-center gap-1 text-slate-500">
          <MessageSquare className="h-5 w-5" />
          <span className="text-[10px] font-bold">CHAT</span>
        </Link>
      </nav>
    </>
  );
}
