"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ClientProfileMenu } from "@/components/shared/client-profile-menu";
import { BoosterProfileMenu } from "@/components/shared/booster-profile-menu";

type ClientOrder = {
  id: string;
  game: string;
  service: string;
  status: "pending" | "accepted";
  createdAt: string;
};

export default function ClientOrdersPage() {
  const { data: session } = useSession();
  const [orders] = useState<ClientOrder[]>([]);
  const [message] = useState<string | null>(
    "Temporary auth was removed. Connect your real backend to load client orders."
  );

  const pendingOrders = useMemo(
    () => orders.filter((order) => order.status === "pending"),
    [orders]
  );
  const acceptedOrders = useMemo(
    () => orders.filter((order) => order.status === "accepted"),
    [orders]
  );

  return (
    <>
      <header className="ghost-border fixed top-0 z-50 w-full border-b border-outline-variant/20 bg-surface-variant/70 backdrop-blur-xl">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-8 font-headline tracking-tight">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-primary-fixed transition hover:text-primary">
            Zenith Boost
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/" className="top-panel-link px-4 py-2 text-sm font-bold uppercase tracking-wide">Home</Link>
            <Link href="/booster-browse" className="top-panel-link px-4 py-2 text-sm font-bold uppercase tracking-wide">Browse</Link>
            <Link href="/client-settings" className="top-panel-link px-4 py-2 text-sm font-bold uppercase tracking-wide">Settings</Link>
            <Link href="/client-orders" className="top-panel-link top-panel-link-active px-4 py-2 text-sm font-bold uppercase tracking-wide">Orders</Link>
          </div>

          {session?.user?.role === "CLIENT" ? (
            <ClientProfileMenu 
              avatarUrl={session?.user?.image ?? "/booster-pfps/default-avatar.svg"} 
              alt={session?.user?.name ?? "Client profile"} 
            />
          ) : session?.user?.role === "BOOSTER" ? (
            <BoosterProfileMenu 
              avatarUrl={session?.user?.image ?? "/booster-pfps/default-avatar.svg"} 
              alt={session?.user?.name ?? "Booster profile"} 
            />
          ) : (
            <Button asChild type="button" variant="ghost" size="sm" className="top-panel-link px-2 py-2">
              <Link href="/level-up">Login</Link>
            </Button>
          )}
        </div>
      </header>

      <main className="min-h-screen bg-background pt-28">
        <div className="mx-auto max-w-6xl px-8 pb-20">
          <h1 className="font-headline mb-3 text-5xl font-bold uppercase italic tracking-tight text-on-surface">My Orders</h1>
          <p className="mb-8 text-on-surface-variant">Track pending and accepted orders you sent.</p>

          {message ? (
            <div className="mb-6 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-xs font-bold uppercase tracking-wider text-error">
              {message}
            </div>
          ) : null}

          <section className="mb-6">
            <h2 className="font-headline mb-3 text-2xl font-bold text-on-surface">Pending</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {pendingOrders.length === 0 ? (
                <div className="ghost-border rounded-xl bg-surface-container-low p-5 text-sm text-on-surface-variant">No pending orders.</div>
              ) : (
                pendingOrders.map((order) => (
                  <article key={order.id} className="ghost-border rounded-xl bg-surface-container-low p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Pending</p>
                    <h3 className="font-headline mt-2 text-xl font-bold">{order.game}</h3>
                    <p className="mt-1 text-sm text-on-surface-variant">{order.service}</p>
                    <p className="mt-3 text-[11px] uppercase tracking-wider text-on-surface-variant">{new Date(order.createdAt).toLocaleString()}</p>
                  </article>
                ))
              )}
            </div>
          </section>

          <section>
            <h2 className="font-headline mb-3 text-2xl font-bold text-on-surface">Accepted</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {acceptedOrders.length === 0 ? (
                <div className="ghost-border rounded-xl bg-surface-container-low p-5 text-sm text-on-surface-variant">No accepted orders yet.</div>
              ) : (
                acceptedOrders.map((order) => (
                  <article key={order.id} className="ghost-border rounded-xl bg-surface-container-low p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Accepted</p>
                    <h3 className="font-headline mt-2 text-xl font-bold">{order.game}</h3>
                    <p className="mt-1 text-sm text-on-surface-variant">{order.service}</p>
                    <p className="mt-3 text-[11px] uppercase tracking-wider text-on-surface-variant">{new Date(order.createdAt).toLocaleString()}</p>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
