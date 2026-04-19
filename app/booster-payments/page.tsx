"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  BellOff,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Crown,
  Filter,
  HelpCircle,
  LayoutDashboard,
  MessageSquare,
  Search,
  Settings,
  Wallet,
  WalletCards,
} from "lucide-react";

type OrderRow = {
  id: string;
  date: string;
  service: string;
  serviceTone: "secondary" | "tertiary";
  commission: string;
  netAmount: string;
};

export default function BoosterPaymentsPage() {
  const [isNotificationsOn, setIsNotificationsOn] = useState(true);
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(2);
  const [searchTerm, setSearchTerm] = useState("");
  const [availableBalance] = useState(0);
  const [balanceChangePercent] = useState(0);
  const [pendingPayouts] = useState(0);
  const [settlementHours] = useState(0);
  const [totalTaxable] = useState(0);
  const [taxPeriodLabel] = useState("Tax Year 2024 • Fiscal Period Q3");
  const [weeklyRevenue] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [completedOrders] = useState<OrderRow[]>([]);

  const avatarUrl =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDapUIVOD_ilqm2x_X4VRFqt6edOsJtLJ0XikXFt-loaNOdIiDlO-WYgaMbdy_4NfYdFggWxynEL9qdarpf6ZMJh_dueNcsvitr0HtruTzF4_8jVkJq41-2V6qBn1gWnDPFVOBr19eMKhRky0iIVPd8qJ_UtQIS5YqSKGH_4IBrEZeFbRQ1Rfom9T0QSTtclhU03o_7uvNmvSBtQutaXfPGvWDOpk5QMWqljwApq4BdfoXKE7GrsaMfKURLC-tFOE2is3J_I8Wo3_E";

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const formatCurrency = (value: number) =>
    `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatPercent = (value: number) => `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;

  const maxWeeklyRevenue = Math.max(...weeklyRevenue, 1);
  const weeklyHeights = weeklyRevenue.map((value) => `${(value / maxWeeklyRevenue) * 100}%`);
  const filteredOrders = completedOrders.filter((order) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;

    return (
      order.id.toLowerCase().includes(term) ||
      order.service.toLowerCase().includes(term) ||
      order.date.toLowerCase().includes(term)
    );
  });

  const handleMarkNotificationsRead = () => {
    setUnreadNotificationCount(0);
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

    if (label === "Payments") {
      return (
        <div className="flex items-center gap-3 rounded-l-lg border-r-2 border-cyan-400 bg-cyan-400/10 p-3 text-cyan-400">
          {icon}
          <span>{label}</span>
        </div>
      );
    }

    return (
      <a
        href={label === "Dashboard" ? "/booster-dashboard" : "#"}
        className="flex cursor-pointer items-center gap-3 rounded-lg border border-transparent p-3 text-slate-500 transition-all duration-300 hover:translate-x-1 hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-300 hover:shadow-[0_0_22px_rgba(34,211,238,0.25)] active:opacity-80"
      >
        {icon}
        <span>{label}</span>
      </a>
    );
  };

  return (
    <>
      <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-white/10 bg-slate-950/70 px-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-xl">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="font-headline text-2xl font-bold tracking-tighter text-cyan-400 transition hover:text-cyan-300"
          >
            ZENITH BOOST
          </Link>
        </div>

        <div className="flex items-center gap-4">
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
                    <h3 className="font-headline text-sm font-bold uppercase tracking-wider text-on-surface">
                      Notifications
                    </h3>
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
                      <p className="text-xs font-semibold text-on-surface">2 payout confirmations pending</p>
                      <p className="text-[10px] uppercase tracking-wider text-on-surface-variant">
                        Finance • Just now
                      </p>
                    </div>
                    <div className="rounded-md border border-white/5 bg-surface-container-low px-3 py-2">
                      <p className="text-xs font-semibold text-on-surface">Weekly earnings report is ready</p>
                      <p className="text-[10px] uppercase tracking-wider text-on-surface-variant">
                        Reports • 2h ago
                      </p>
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
              <img alt="Booster profile avatar" className="h-full w-full object-cover" src={avatarUrl} />
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
                  {[
                    "View Profile",
                    "Settings",
                    "Help Support",
                    "Logout",
                  ].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        if (item === "Settings") {
                          window.location.href = "/booster-profile";
                          return;
                        }
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
      </header>

      <aside className="fixed left-0 top-0 z-40 flex h-full w-64 flex-col bg-slate-900 pt-20 shadow-2xl shadow-black">
        <div className="mb-4 flex flex-col items-center border-b border-white/5 px-6 py-4">
          <div className="ghost-border mb-2 flex h-16 w-16 items-center justify-center rounded-xl bg-surface-container-highest">
            <Crown className="h-8 w-8 text-[#b87333]" />
          </div>
          <h3 className="font-headline font-bold text-on-surface">ROOKIE</h3>
          <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
            Main Game: Not Set
          </p>
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
          <button
            type="button"
            className="mb-4 w-full rounded-md bg-gradient-to-r from-primary to-primary-container py-3 text-xs font-bold uppercase tracking-widest text-on-primary-fixed transition-all hover:brightness-110 active:scale-95"
          >
            GO ONLINE
          </button>
          <a
            href="#"
            className="mb-1 flex items-center gap-3 rounded-lg px-4 py-2 text-slate-500 transition-all hover:bg-white/5 hover:text-slate-300"
          >
            <HelpCircle className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Support</span>
          </a>
          <a
            href="/booster-profile"
            className="flex items-center gap-3 rounded-lg px-4 py-2 text-slate-500 transition-all hover:bg-white/5 hover:text-slate-300"
          >
            <Settings className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Settings</span>
          </a>
        </div>
      </aside>

      <main className="ml-64 min-h-screen bg-background pb-12 pl-6 pr-6 pt-24">
        <div className="mx-auto max-w-7xl">
          <header className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <h1 className="font-headline mb-4 text-5xl font-bold uppercase italic leading-none tracking-tighter text-on-surface md:text-7xl">
                Earnings
              </h1>
              <p className="text-lg font-light leading-relaxed text-on-surface-variant">
                Track your performance revenue, monitor pending commissions, and manage your wallet
                settlements with precision-grade analytics.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                className="ghost-border rounded-md bg-surface-container-high/70 px-6 py-3 text-sm font-bold uppercase tracking-widest text-secondary transition-all hover:bg-secondary/10 active:scale-95"
              >
                Download Report
              </button>
              <button
                type="button"
                className="rounded-md bg-gradient-to-br from-primary to-primary-container px-8 py-3 text-sm font-bold uppercase tracking-widest text-on-primary-fixed transition-all hover:shadow-[0_0_20px_rgba(143,245,255,0.3)] active:scale-95"
              >
                Withdraw Now
              </button>
            </div>
          </header>

          <section className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-12">
            <div className="ghost-border relative overflow-hidden rounded-xl bg-surface-container-high/70 p-8 md:col-span-8">
              <div className="absolute right-0 top-0 p-8 opacity-15">
                <WalletCards className="h-24 w-24 text-primary" />
              </div>

              <label className="font-label mb-2 block text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                Available Balance
              </label>
              <div className="mb-8 flex items-baseline gap-2">
                <span className="font-headline text-6xl font-black tracking-tighter text-on-surface md:text-8xl">
                  {formatCurrency(availableBalance)}
                </span>
                <span className="text-xl font-bold text-secondary">{formatPercent(balanceChangePercent)}</span>
              </div>

              <div className="flex h-24 w-full items-end gap-2">
                {weeklyHeights.map((height, index) => (
                  <div
                    key={`weekly-bar-${index}`}
                    className={`flex-1 rounded-t-sm ${
                      index === 4
                        ? "border-t-2 border-primary bg-primary/20"
                        : "bg-surface-container-highest transition-colors hover:bg-primary/40"
                    }`}
                    style={{ height }}
                  ></div>
                ))}
              </div>

              <div className="mt-3 flex justify-between text-[10px] font-bold uppercase tracking-widest text-outline">
                {weekDays.map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6 md:col-span-4">
              <div className="ghost-border flex flex-1 flex-col justify-between rounded-xl bg-surface-container-high/70 p-6">
                <div>
                  <label className="font-label mb-1 block text-[10px] font-extrabold uppercase tracking-[0.2em] text-outline">
                    Pending Payouts
                  </label>
                  <p className="font-headline text-4xl font-bold text-on-surface">{formatCurrency(pendingPayouts)}</p>
                </div>
                <div className="mt-3 inline-flex w-fit items-center gap-2 rounded bg-tertiary/5 px-2 py-1 text-xs font-bold text-tertiary-dim">
                  <Bell className="h-3.5 w-3.5" />
                  Settlement in {settlementHours}h
                </div>
              </div>

              <div className="ghost-border flex flex-1 flex-col justify-between rounded-xl bg-surface-container-high/70 p-6">
                <div>
                  <label className="font-label mb-1 block text-[10px] font-extrabold uppercase tracking-[0.2em] text-outline">
                    Total Taxable
                  </label>
                  <p className="font-headline text-4xl font-bold text-on-surface">{formatCurrency(totalTaxable)}</p>
                </div>
                <p className="text-[10px] uppercase tracking-wider text-outline">{taxPeriodLabel}</p>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl bg-surface-container-low">
            <div className="flex items-center justify-between p-6">
              <h3 className="font-headline text-2xl font-bold uppercase italic tracking-tight">
                Completed Orders
              </h3>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
                  <input
                    type="text"
                    placeholder="Search ID..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="w-48 rounded-sm border-none bg-surface-container-lowest py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary"
                  />
                </div>
                <button type="button" className="p-2 text-outline transition-colors hover:text-on-surface">
                  <Filter className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-surface-container text-left">
                    <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-[0.2em] text-outline">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-[0.2em] text-outline">
                      Date
                    </th>
                    <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-[0.2em] text-outline">
                      Service Type
                    </th>
                    <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-[0.2em] text-outline">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-[10px] font-extrabold uppercase tracking-[0.2em] text-outline">
                      Commission (15%)
                    </th>
                    <th className="px-6 py-4 text-right text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">
                      Net Amount
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.02]">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="cursor-pointer transition-colors hover:bg-surface-bright"
                      >
                        <td className="px-6 py-5 font-headline font-bold text-on-surface">{order.id}</td>
                        <td className="px-6 py-5 text-sm text-on-surface-variant">{order.date}</td>
                        <td className="px-6 py-5">
                          <span
                            className={`rounded px-2 py-1 text-xs font-bold uppercase tracking-wider ${
                              order.serviceTone === "secondary"
                                ? "bg-secondary/10 text-secondary"
                                : "bg-tertiary/10 text-tertiary"
                            }`}
                          >
                            {order.service}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(143,245,255,0.6)]"></span>
                            <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right text-sm font-medium text-error-dim">
                          {order.commission}
                        </td>
                        <td className="px-6 py-5 text-right font-headline font-bold text-primary">
                          {order.netAmount}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-6 py-8 text-sm text-on-surface-variant" colSpan={6}>
                        No payment data yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-center gap-2 p-6">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-sm bg-surface-container text-outline transition-colors hover:text-on-surface"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-xs font-bold text-on-primary-fixed"
              >
                1
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-sm bg-surface-container text-xs font-bold text-outline transition-colors hover:text-on-surface"
              >
                2
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-sm bg-surface-container text-xs font-bold text-outline transition-colors hover:text-on-surface"
              >
                3
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-sm bg-surface-container text-outline transition-colors hover:text-on-surface"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </section>

          <section className="group relative mt-12 h-64 overflow-hidden rounded-xl">
            <img
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              alt="Neon gaming arena"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfne0XVaSyF2nBJ4DsWbzlHQAti9R0jO5DLsD6qBwoIqObjXI35Jok_8UzY_qClpuuX-tXQynO2lmd2cz2uF_xqWVeAkA2xX4mpRE3DZ7ekLraDWb0WlIoIn5jvyPhRqObVza2hvWL0n8PmCdYF9RyBfpKDjVMhBFKmq9mPlp8sDiCZFf863aRe_RlXjBaqmFPmRz2CDauTz-L2nJJkLA7Vw2Hquh5rFKpEUw88-gSEiTGT-dtJP7ZMcif3GCIRbao5VJTiwsag5U"
            />
            <div className="absolute inset-0 flex items-center bg-gradient-to-r from-background via-background/80 to-transparent px-12">
              <div className="max-w-md">
                <h2 className="font-headline mb-2 text-3xl font-bold uppercase italic text-on-surface">
                  Refer a Colleague
                </h2>
                <p className="mb-6 text-sm text-on-surface-variant">
                  Earn 5% flat commission from every boost your referee completes in their first 3
                  months.
                </p>
                <button type="button" className="group/btn flex items-center gap-2">
                  <span className="font-label text-xs font-extrabold uppercase tracking-widest text-primary">
                    Get Referral Link
                  </span>
                  <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <div className="hidden fixed bottom-0 left-0 z-50 w-full items-center justify-between border-t border-white/5 bg-slate-900/90 px-6 py-3 backdrop-blur-xl md:hidden">
        <button type="button" className="flex flex-col items-center gap-1 text-slate-500">
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
        </button>
        <button type="button" className="flex flex-col items-center gap-1 text-slate-500">
          <ClipboardList className="h-5 w-5" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Requests</span>
        </button>
        <button type="button" className="flex flex-col items-center gap-1 text-cyan-400">
          <Wallet className="h-5 w-5" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Earnings</span>
        </button>
        <button type="button" className="flex flex-col items-center gap-1 text-slate-500">
          <MessageSquare className="h-5 w-5" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Chats</span>
        </button>
        <button type="button" className="flex flex-col items-center gap-1 text-slate-500">
          <img alt="Profile" className="h-6 w-6 rounded-full grayscale" src={avatarUrl} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Account</span>
        </button>
      </div>
    </>
  );
}
