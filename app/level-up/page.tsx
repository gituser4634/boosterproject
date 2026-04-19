"use client";

import Link from "next/link";
import { useState } from "react";
import { X } from "lucide-react";

export default function LevelUpPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [loginType, setLoginType] = useState<"booster" | "client">("client");
  const [registerType, setRegisterType] = useState<"booster" | "client">("client");

  return (
    <>
      <header className="ghost-border fixed top-0 z-50 w-full border-b border-white/15 bg-black/35 backdrop-blur-xl">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-8">
          <Link
            href="/"
            className="font-headline text-2xl font-bold tracking-tighter text-primary-fixed transition hover:text-primary"
          >
            Zenith Boost
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsLoginOpen(true)}
              className="top-panel-link px-4 py-2 text-sm font-bold uppercase tracking-wide"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsRegisterOpen(true)}
              className="rounded-md border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-bold uppercase tracking-wide text-primary transition hover:bg-primary/20"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      <main className="relative min-h-screen overflow-hidden bg-black pt-20">
        <div className="absolute inset-0">
          <iframe
            title="Counter Strike 2 gameplay background"
            className="h-full w-full scale-[1.28] md:scale-[1.15]"
            src="https://www.youtube.com/embed/edYCtaNueQY?start=6&autoplay=1&mute=1&controls=0&loop=1&playlist=edYCtaNueQY&modestbranding=1&rel=0&playsinline=1"
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
          ></iframe>
          <div className="absolute inset-0 bg-black/55"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/85"></div>
        </div>

        <section className="relative z-10 flex min-h-[calc(100vh-5rem)] items-center px-8">
          <div className="mx-auto w-full max-w-5xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-secondary">Counter-Strike 2</p>
            <h1 className="font-headline max-w-3xl text-5xl font-black uppercase italic tracking-tight text-white md:text-7xl">
              Precision. Aim. Rank Up.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-200 md:text-lg">
              Join live CS2 boost sessions with verified high-ELO players. Track every match update in real
              time and level up with full visibility.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => setIsLoginOpen(true)}
                className="flame-button primary-gradient ghost-border rounded-md px-8 py-3 text-sm font-bold uppercase tracking-wider text-on-primary-fixed transition-all duration-300 hover:shadow-[0_0_36px_-6px_rgba(20,214,255,0.72)]"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setIsRegisterOpen(true)}
                className="flame-button-violet rounded-md border border-secondary/40 bg-surface-container-low/50 px-8 py-3 text-sm font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-all duration-300 hover:border-secondary hover:text-secondary"
              >
                Register
              </button>
              <Link
                href="/"
                className="rounded-md border border-white/25 bg-black/30 px-8 py-3 text-sm font-bold uppercase tracking-wider text-slate-200 transition hover:border-primary/45 hover:text-white"
              >
                Back Home
              </Link>
            </div>
          </div>
        </section>
      </main>

      {isLoginOpen ? (
        <div
          className="modal-overlay-enter fixed inset-0 z-[80] flex items-center justify-center bg-black/65 px-4"
          onClick={() => setIsLoginOpen(false)}
        >
          <div
            className="modal-panel-enter ghost-border w-full max-w-lg rounded-2xl border border-outline/30 bg-surface-container p-6 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.75)]"
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

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <button
                type="button"
                className="font-semibold uppercase tracking-wider text-secondary transition-colors hover:text-primary"
              >
                Forgot password?
              </button>
              <div className="text-on-surface-variant">
                If you&apos;re new here,
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginOpen(false);
                    setIsRegisterOpen(true);
                  }}
                  className="ml-1 font-semibold uppercase tracking-wider text-primary transition-colors hover:text-primary-fixed"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {isRegisterOpen ? (
        <div
          className="fixed inset-0 z-[85] flex items-center justify-center bg-black/65 px-4 py-6"
          onClick={() => setIsRegisterOpen(false)}
        >
          <div
            className="ghost-border w-full max-w-2xl rounded-2xl border border-outline/30 bg-surface-container p-6 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.75)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-headline text-3xl font-bold tracking-tight text-primary-fixed">
                  {registerType === "booster" ? "Booster Inscription Form" : "Client Registration Form"}
                </h3>
                <p className="mt-2 text-sm text-on-surface-variant">
                  {registerType === "booster"
                    ? "Fill your details to request a booster account."
                    : "Create your client account to hire top-rated boosters."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsRegisterOpen(false)}
                className="rounded-md p-2 text-on-surface-variant transition-colors hover:bg-surface-variant/50 hover:text-on-surface"
                aria-label="Close registration form"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-surface-dim p-1">
              <button
                type="button"
                onClick={() => setRegisterType("booster")}
                className={`rounded-md px-4 py-2 text-sm font-bold uppercase tracking-wide transition-all ${
                  registerType === "booster"
                    ? "primary-gradient text-on-primary-fixed shadow-[0_8px_30px_-10px_rgba(20,214,255,0.6)]"
                    : "text-on-surface-variant hover:bg-surface-variant/60"
                }`}
              >
                Booster Register
              </button>
              <button
                type="button"
                onClick={() => setRegisterType("client")}
                className={`rounded-md px-4 py-2 text-sm font-bold uppercase tracking-wide transition-all ${
                  registerType === "client"
                    ? "primary-gradient text-on-primary-fixed shadow-[0_8px_30px_-10px_rgba(20,214,255,0.6)]"
                    : "text-on-surface-variant hover:bg-surface-variant/60"
                }`}
              >
                Client Register
              </button>
            </div>

            <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {registerType === "booster" ? (
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Alias
                  </label>
                  <input
                    type="text"
                    placeholder="Your alias"
                    className="w-full rounded-md border border-outline/25 bg-surface-container-high/80 px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary"
                  />
                </div>
              ) : null}

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Your username"
                  className="w-full rounded-md border border-outline/25 bg-surface-container-high/80 px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@email.com"
                  className="w-full rounded-md border border-outline/25 bg-surface-container-high/80 px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Country Of Origin
                </label>
                <input
                  type="text"
                  placeholder="Country"
                  className="w-full rounded-md border border-outline/25 bg-surface-container-high/80 px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Create password"
                  className="w-full rounded-md border border-outline/25 bg-surface-container-high/80 px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  className="w-full rounded-md border border-outline/25 bg-surface-container-high/80 px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary"
                />
              </div>

              <div className="md:col-span-2">
                <div className="rounded-md border border-outline/20 bg-surface-dim/50 px-4 py-3 text-sm text-on-surface-variant">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 rounded border-outline/40 bg-transparent accent-primary"
                    />
                    <span>
                      I accept the
                      <button
                        type="button"
                        onClick={() => setIsTermsOpen(true)}
                        className="mx-1 inline-block font-bold text-primary underline decoration-primary/70 underline-offset-4 transition-colors hover:text-primary-fixed"
                      >
                        Terms and Conditions
                      </button>
                      and confirm that my registration information is accurate.
                    </span>
                  </label>
                </div>
              </div>

              <div className="mt-2 md:col-span-2">
                <button
                  type="button"
                  className="primary-gradient w-full rounded-md px-5 py-3 font-bold uppercase tracking-wide text-on-primary-fixed"
                >
                  {registerType === "booster"
                    ? "Submit Booster Registration"
                    : "Create Client Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {isTermsOpen ? (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4 py-6"
          onClick={() => setIsTermsOpen(false)}
        >
          <div
            className="ghost-border w-full max-w-3xl rounded-2xl border border-outline/30 bg-surface-container p-6 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.75)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-headline text-3xl font-bold tracking-tight text-primary-fixed">
                  Terms and Conditions
                </h3>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Please read before accepting booster inscription.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsTermsOpen(false)}
                className="rounded-md p-2 text-on-surface-variant transition-colors hover:bg-surface-variant/50 hover:text-on-surface"
                aria-label="Close terms and conditions"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[60vh] space-y-4 overflow-y-auto rounded-md border border-outline/20 bg-surface-dim/40 p-4 text-sm leading-relaxed text-on-surface-variant">
              <p>
                By submitting this form, you agree to provide true and accurate information. Any
                false information may result in refusal or suspension of your booster account.
              </p>
              <p>
                You are responsible for the security of your login credentials. Do not share your
                password with anyone and report suspicious activity immediately.
              </p>
              <p>
                Booster performance and conduct must follow platform standards, including respectful
                behavior, fair play, and compliance with game publisher policies.
              </p>
              <p>
                Payments, commissions, and account status are managed under platform rules and may
                be adjusted in case of abuse, fraud, or violation of these terms.
              </p>
              <p>
                Personal data is processed for account operations, fraud prevention, and service
                quality. By continuing, you acknowledge our data handling practices.
              </p>
              <p>
                Continued use of the platform means you accept updates to these terms when legally
                required, with notice provided through official channels.
              </p>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setIsTermsOpen(false)}
                className="primary-gradient rounded-md px-6 py-2 font-bold uppercase tracking-wide text-on-primary-fixed"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
