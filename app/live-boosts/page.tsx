"use client";

import Link from "next/link";
import { useState } from "react";
import { Gamepad2, Rocket, ShieldCheck, Swords, Trophy, X } from "lucide-react";

const particleIcons = [Gamepad2, Trophy, Swords, Rocket, ShieldCheck, Gamepad2, Trophy, Rocket];

export default function LiveBoostsComingSoonPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginType, setLoginType] = useState<"booster" | "client">("booster");

  return (
    <>
      <header className="ghost-border fixed top-0 z-50 w-full border-b border-outline-variant/20 bg-surface-variant/70 backdrop-blur-xl">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-8 font-headline tracking-tight">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tighter text-primary-fixed transition hover:text-primary"
          >
            Zenith Boost
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="top-panel-link px-4 py-2 text-sm font-bold uppercase tracking-wide"
            >
              Home
            </Link>
            <Link
              href="/booster-browse"
              className="top-panel-link px-4 py-2 text-sm font-bold uppercase tracking-wide"
            >
              Browse
            </Link>
            <Link
              href="/live-boosts"
              className="top-panel-link top-panel-link-active px-4 py-2 text-sm font-bold uppercase tracking-wide"
            >
              Live Boosts
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://discord.gg/FkGNYr2R"
              target="_blank"
              rel="noreferrer"
              aria-label="Join our Discord"
              className="top-panel-icon"
            >
              <img
                src="https://cdn.simpleicons.org/discord/5865F2"
                alt="Discord"
                className="h-5 w-5 opacity-90"
              />
            </a>
            <button
              type="button"
              onClick={() => setIsLoginOpen(true)}
              className="top-panel-link px-2 py-2 text-sm font-bold uppercase tracking-wide"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      <main className="relative min-h-screen overflow-hidden bg-background pt-20">
        <div className="coming-soon-aurora absolute inset-0"></div>

        <div className="pointer-events-none absolute inset-0">
          {particleIcons.map((ParticleIcon, index) => (
            <div
              key={`particle-${index}`}
              className="gaming-particle"
              style={{
                left: `${8 + index * 12}%`,
                animationDelay: `${index * 0.7}s`,
                animationDuration: `${8 + (index % 4)}s`,
                color: index % 3 === 1 ? "rgba(196, 138, 255, 0.9)" : undefined,
                filter:
                  index % 3 === 1
                    ? "drop-shadow(0 0 10px rgba(168, 85, 247, 0.65)) drop-shadow(0 0 18px rgba(168, 85, 247, 0.45))"
                    : undefined,
              }}
            >
              <ParticleIcon className="h-5 w-5" />
            </div>
          ))}
        </div>

        <section className="relative z-10 flex min-h-[calc(100vh-5rem)] items-center justify-center px-8">
          <div className="coming-soon-panel ghost-border w-full max-w-3xl rounded-2xl border border-white/10 bg-surface-container/70 p-10 text-center backdrop-blur-xl md:p-14">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-secondary">
              Next Arena Feature
            </p>
            <h1 className="coming-soon-title font-headline text-5xl font-black uppercase italic tracking-tight text-on-surface md:text-7xl">
              Coming Soon
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-on-surface-variant md:text-lg">
              Live Boosts is entering final matchmaking. Real-time booster sessions, spectator-style
              tracking, and instant status updates are loading in.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <span className="rounded-full border border-primary/35 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary">
                Queue Tracking
              </span>
              <span className="rounded-full border border-secondary/35 bg-secondary/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-secondary">
                Live Telemetry
              </span>
              <span className="rounded-full border border-tertiary/35 bg-tertiary/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-tertiary">
                Match Feed
              </span>
            </div>

            <div className="mt-10">
              <Link
                href="/"
                className="cta-flame-soft cta-flame-soft-primary inline-flex items-center rounded-md border border-primary/40 bg-surface-container-high px-8 py-3 text-sm font-bold uppercase tracking-wider text-on-surface transition hover:text-primary"
              >
                Back To Landing
              </Link>
            </div>
          </div>
        </section>
      </main>

      {isLoginOpen ? (
        <div
          className="modal-overlay-enter fixed inset-0 z-[80] flex items-center justify-center bg-background/65 px-4 backdrop-blur-md"
          onClick={() => setIsLoginOpen(false)}
        >
          <div
            className="modal-panel-enter ghost-border w-full max-w-lg rounded-2xl border border-outline/30 bg-surface-container/85 p-6 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.65)] backdrop-blur-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-headline text-3xl font-bold tracking-tight text-primary-fixed">
                  Welcome Back
                </h3>
                <p className="mt-2 text-sm text-on-surface-variant">
                  Sign in as a booster or client to continue.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsLoginOpen(false)}
                className="rounded-md p-2 text-on-surface-variant transition-colors hover:bg-surface-variant/50 hover:text-on-surface"
                aria-label="Close login modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-surface-dim p-1">
              <button
                type="button"
                onClick={() => setLoginType("booster")}
                className={`rounded-md px-4 py-2 text-sm font-bold uppercase tracking-wide transition-all ${
                  loginType === "booster"
                    ? "primary-gradient text-on-primary-fixed"
                    : "text-on-surface-variant hover:bg-surface-variant/60"
                }`}
              >
                Booster Login
              </button>
              <button
                type="button"
                onClick={() => setLoginType("client")}
                className={`rounded-md px-4 py-2 text-sm font-bold uppercase tracking-wide transition-all ${
                  loginType === "client"
                    ? "primary-gradient text-on-primary-fixed"
                    : "text-on-surface-variant hover:bg-surface-variant/60"
                }`}
              >
                Client Login
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  {loginType === "booster" ? "Booster Email" : "Client Email"}
                </label>
                <input
                  type="email"
                  placeholder={loginType === "booster" ? "booster@email.com" : "client@email.com"}
                  className="w-full rounded-md border border-outline/25 bg-surface-container-high/80 px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full rounded-md border border-outline/25 bg-surface-container-high/80 px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary"
                />
              </div>

              <button
                type="button"
                className="primary-gradient mt-2 w-full rounded-md px-5 py-3 font-bold uppercase tracking-wide text-on-primary-fixed"
              >
                {loginType === "booster" ? "Login as Booster" : "Login as Client"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}