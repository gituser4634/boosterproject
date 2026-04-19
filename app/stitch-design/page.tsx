"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Gamepad2,
  Headset,
  PlayCircle,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Swords,
  Trophy,
  X,
} from "lucide-react";

export default function StitchDesignPage() {
  const navItems = ["Services", "Games", "About"];
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginType, setLoginType] = useState<"booster" | "client">("booster");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registerType, setRegisterType] = useState<"booster" | "client">("booster");
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchScope, setSearchScope] = useState<"all" | "clients" | "boosters">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const featureCards = [
    {
      title: "Elite Pros Only",
      description:
        "We strictly recruit from the top 0.1% of every region. Every booster undergoes rigorous background and skill verification.",
      icon: "workspace_premium",
      color: "text-primary bg-primary/10",
    },
    {
      title: "Secure & Private",
      description:
        "Your account safety is our priority. We use military-grade VPNs and customized hardware IDs for every session.",
      icon: "shield_with_heart",
      color: "text-secondary bg-secondary/10",
    },
    {
      title: "24/7 Support",
      description:
        "Dedicated account managers available around the clock to track your progress and answer questions instantly.",
      icon: "support_agent",
      color: "text-tertiary bg-tertiary/10",
    },
  ];

  const boosters = [
    {
      name: "MOHAMED123",
      game: "Apex Legends",
      rating: "5.0",
      rank: "Apex Predator",
      rankIcon: "military_tech",
      live: true,
      image:
        "https://scontent.ftun15-1.fna.fbcdn.net/v/t39.30808-1/576952454_1436088074602191_7652156089798589190_n.jpg?stp=c446.0.1148.1148a_dst-jpg_s200x200_tt6&_nc_cat=103&ccb=1-7&_nc_sid=e99d92&_nc_ohc=5FwttousWeUQ7kNvwE2_dOn&_nc_oc=AdpPk4mtAIl23paB3xhJJBwWv2nX6TeHu1ST7rflEfluu-RBof0n3HUrQ-vTuGuZWxE&_nc_zt=24&_nc_ht=scontent.ftun15-1.fna&_nc_gid=SLWLHC_59ZkFmSMtogr80A&_nc_ss=7a3a8&oh=00_Af0A48KoauoK8UwFMnMGF5pzA-Y_8_wIedIQnnUsCPbeBw&oe=69E194CD",
    },
    {
      name: "SALMA444",
      game: "Valorant",
      rating: "4.9",
      rank: "Radiant #42",
      rankIcon: "workspace_premium",
      live: false,
      image:
        "https://scontent.ftun15-1.fna.fbcdn.net/v/t39.30808-1/410088379_1490825255102121_3710042049867810931_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=101&ccb=1-7&_nc_sid=e99d92&_nc_ohc=_kSMp2EeG-QQ7kNvwGlNKTg&_nc_oc=Adp_MILVnCVDTs_ebIdxlYcwbG3_fRIPGGzTeVjxZdpz9LtfAQYSkwXlqV2PdBgTD9Y&_nc_zt=24&_nc_ht=scontent.ftun15-1.fna&_nc_gid=AqYDt4sKU_0rHSiYRfXtxQ&_nc_ss=7a3a8&oh=00_Af1zWPBcBpwet9BbP-YmFjO9zrg2lYLFHfRbmRHcVdvpWQ&oe=69E192A2",
    },
    {
      name: "Adam",
      game: "League of Legends",
      rating: "5.0",
      rank: "Challenger",
      rankIcon: "stars",
      live: false,
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Black_colour.jpg/960px-Black_colour.jpg",
    },
    {
      name: "TAHERXx12",
      game: "Overwatch 2",
      rating: "4.8",
      rank: "Top 500",
      rankIcon: "trophy",
      live: false,
      image:
        "https://scontent.ftun15-1.fna.fbcdn.net/v/t39.30808-1/462228392_2496981260655405_7587418930506211631_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=110&ccb=1-7&_nc_sid=e99d92&_nc_ohc=2WP56qrdVRsQ7kNvwFWkYS1&_nc_oc=Adoq-ZuUDnBhCQbyAR9VqREYcSxy5LvOkJlDh0N84iYLiDROjba75ybNbZY9hlt-tko&_nc_zt=24&_nc_ht=scontent.ftun15-1.fna&_nc_gid=mhkCClg0bo0Nr3kTbd-DLg&_nc_ss=7a3a8&oh=00_Af0mTktaRLpe0cPJdYydbfjfpXr8CNbc7S3pXGW71HVz1w&oe=69E1BA45",
    },
  ];

  const reviews = [
    {
      quote:
        '"Needed help getting through Platinum hell in Apex. Commander Z was a beast. Finished the boost 2 days earlier than expected. Truly elite service."',
      name: "Rayen",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDNXsUfB_KRjVToDPWa4taaWWzLGwaIZCLMErgSWZ_AcTWhAQzh25zYapvScWeR4MAZxn5MTjkscV_hXSNz-OKryhv3eW62cOY4ArfbJPv5nnv-aYDSO5JelHpca-s__lxnkG8sL6LjuhP3oSFLL6dZYkZyEowgUUrWKRIucP1eiteFhGX00XenhjXwDW372r7OkidhsZnFeOMSazPyeLNaMHENDtniIM_uYyuYSVczxszO6T-3UaJuTgBMhKy53u6I1xAPDKoq7oo",
    },
    {
      quote:
        '"Privacy was my biggest concern. Zenith\'s dashboard made me feel completely at ease. I could track every game without revealing my credentials."',
      name: "Khaled.",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB7lsycYM7JNpQWzAywiY8kd9dKWA2T1jzpHzwd00HGfr0YPpmGMmVdFRe8WpdDds7YqzhIYTA7GVd-VmpO4nHw-MRpluLpTL6pSVoub_NhxODHF-F2WeNbjOSToBi_X4jpsyZj6AMFJX4pCLvB9NhNiYTRLgHRpfu2nGhvZrBSxARH0TzsYIWDnbR0TF7AMTFfkiLEBvi77BYBsZ6PerIkwR3l-A9sHGE4sIgHxLw7WevG1H5ARSVkdMbCB3JJQNIhAT16T79RxxU",
    },
  ];

  const renderFeatureIcon = (icon: string) => {
    switch (icon) {
      case "workspace_premium":
        return <BadgeCheck size={22} strokeWidth={2.5} />;
      case "shield_with_heart":
        return <ShieldCheck size={22} strokeWidth={2.5} />;
      case "support_agent":
        return <Headset size={22} strokeWidth={2.5} />;
      default:
        return <BadgeCheck size={22} strokeWidth={2.5} />;
    }
  };

  const renderRankIcon = (icon: string) => {
    switch (icon) {
      case "military_tech":
      case "workspace_premium":
        return <BadgeCheck size={18} strokeWidth={2.25} />;
      case "stars":
        return <Sparkles size={18} strokeWidth={2.25} />;
      case "trophy":
        return <Trophy size={18} strokeWidth={2.25} />;
      default:
        return <BadgeCheck size={18} strokeWidth={2.25} />;
    }
  };

  const openRegisterModal = (type: "booster" | "client") => {
    setRegisterType(type);
    setIsRegisterOpen(true);
  };

  const heroParticles = [Gamepad2, Trophy, Swords, Rocket, ShieldCheck, Sparkles, Gamepad2, Trophy];

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const scopedQuery = encodeURIComponent(searchQuery.trim());
    window.location.href = `/booster-browse?scope=${searchScope}&q=${scopedQuery}`;
    setIsSearchOpen(false);
  };

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
              className="top-panel-link top-panel-link-active px-4 py-2 text-sm font-bold uppercase tracking-wide"
            >
              Home
            </Link>
            <Link
              href="/booster-browse"
              className="top-panel-link px-4 py-2 text-sm font-bold uppercase tracking-wide"
            >
              Browse
            </Link>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item, index) => (
              <a
                key={item}
                href="#"
                className={
                  index === 0
                    ? "border-b-2 border-primary-fixed pb-1 font-bold text-primary-fixed"
                    : "text-on-surface transition-colors hover:text-primary-fixed"
                }
              >
                {item}
              </a>
            ))}
          </nav>

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
            <div className="relative z-[70]">
              <button
                type="button"
                aria-label="Search"
                onClick={() => setIsSearchOpen((current) => !current)}
                className="top-panel-icon"
              >
                <Search size={18} />
              </button>

              {isSearchOpen ? (
                <>
                  <button
                    type="button"
                    aria-label="Close search panel"
                    onClick={() => setIsSearchOpen(false)}
                    className="fixed inset-0 z-[69] cursor-default"
                  ></button>
                  <form
                    onSubmit={handleSearchSubmit}
                    className="ghost-border absolute right-0 top-12 z-[70] w-[340px] rounded-xl border border-white/10 bg-surface-container/95 p-4 shadow-2xl"
                  >
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                      Search In
                    </label>
                    <select
                      value={searchScope}
                      onChange={(event) =>
                        setSearchScope(event.target.value as "all" | "clients" | "boosters")
                      }
                      className="mb-3 w-full rounded-md border border-outline/30 bg-surface-container-high px-3 py-2 text-sm uppercase tracking-wide text-on-surface outline-none transition focus:border-primary"
                    >
                      <option value="all">All</option>
                      <option value="clients">Clients</option>
                      <option value="boosters">Boosters</option>
                    </select>

                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                      Search Query
                    </label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Type a name, game, or rank..."
                      className="mb-4 w-full rounded-md border border-outline/30 bg-surface-container-high px-3 py-2 text-sm text-on-surface outline-none transition focus:border-primary"
                    />

                    <button
                      type="submit"
                      className="cta-flame-soft cta-flame-soft-primary primary-gradient w-full rounded-md px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-on-primary-fixed"
                    >
                      Search
                    </button>
                  </form>
                </>
              ) : null}
            </div>
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

      <main>
        <section className="relative flex min-h-screen items-center overflow-hidden pt-20">
          <div className="absolute inset-0 z-0">
            <img
              className="h-full w-full object-cover opacity-40 grayscale-[0.5] contrast-125"
              alt="futuristic neon city"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjVhifURNLFwD_jErE39duat_p1FOXRRu3xs_vEm5dmUEeU8Os3c0OwuWAbaMeVb5DU3MPoS6fh_XukSa4frKaGOrRZMqZaL9VD3TPnM4SHMXG7DQfJF6g45L7W56O990uNrveRnMmcmUcIjOkqkWyjWy9z2WB3-ai33MMcZvo2tXKDEfeI0S1SJv7TUGJHXtespbzkx-J0voobMIWqCO8rLb0OG6Q-_hhErVizgiwK-Uv5ONXR-lziXhu-nTuvUmqZkV0icSCDhE"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 h-1/2 w-full bg-gradient-to-t from-background to-transparent"></div>
          </div>

          <div className="pointer-events-none absolute inset-0 z-[5]">
            {heroParticles.map((ParticleIcon, index) => (
              <div
                key={`hero-particle-${index}`}
                className="gaming-particle"
                style={{
                  left: `${6 + index * 12}%`,
                  animationDelay: `${index * 0.55}s`,
                  animationDuration: `${7 + (index % 4)}s`,
                  opacity: 0.55,
                  color: index % 3 === 1 ? "rgba(196, 138, 255, 0.9)" : undefined,
                  filter:
                    index % 3 === 1
                      ? "drop-shadow(0 0 10px rgba(168, 85, 247, 0.65)) drop-shadow(0 0 18px rgba(168, 85, 247, 0.45))"
                      : undefined,
                }}
              >
                <ParticleIcon className="h-4 w-4 md:h-5 md:w-5" />
              </div>
            ))}
          </div>

          <div className="container relative z-10 mx-auto px-8">
            <div className="max-w-4xl">
              <span className="font-label mb-4 block text-xs uppercase tracking-[0.2em] text-primary">
                Engineered for Victory
              </span>
              <h1 className="font-headline mb-8 text-6xl font-bold italic leading-[0.9] tracking-tighter md:text-8xl">
                ASCEND TO YOUR{" "}
                <div>
                  <span className="inline-block bg-gradient-to-r from-primary to-primary-fixed bg-clip-text text-transparent">
                    DESIRED RANK{" "}
                  </span>
                </div>
              </h1>
              <p className="mb-10 max-w-2xl text-xl leading-relaxed text-on-surface-variant md:text-2xl">
                Unleash your true potential with our secure and elite gaming performance platform.
              </p>
              <div className="flex flex-wrap gap-6">
                <Link
                  href="/level-up"
                  className="flame-button primary-gradient ghost-border rounded-md px-10 py-5 text-lg font-bold text-on-primary-fixed transition-all hover:shadow-[0_0_36px_-6px_rgba(20,214,255,0.72)]"
                >
                  LEVEL UP
                </Link>
                <Link
                  href="/live-boosts"
                  className="flame-button-violet flex items-center gap-3 rounded-md border border-secondary/40 bg-surface-container-low/50 px-10 py-5 text-lg font-bold backdrop-blur-sm transition-colors hover:border-secondary"
                >
                  <PlayCircle size={22} />
                  VIEW LIVE BOOSTS
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-surface py-24">
          <div className="container mx-auto px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {featureCards.map((feature) => (
                <div
                  key={feature.title}
                  className="group ghost-border rounded-xl bg-surface-container p-8 transition-all duration-300 hover:bg-surface-bright"
                >
                  <div
                    className={`mb-6 flex h-12 w-12 items-center justify-center rounded-lg transition-transform group-hover:scale-110 ${feature.color}`}
                  >
                    {renderFeatureIcon(feature.icon)}
                  </div>
                  <h3 className="font-headline mb-4 text-2xl font-bold">{feature.title}</h3>
                  <p className="leading-relaxed text-on-surface-variant">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-outline-variant/10 bg-surface-container-low py-24">
          <div className="container mx-auto px-8">
            <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <span className="font-label mb-2 block text-xs uppercase tracking-widest text-secondary">
                  Available Talent
                </span>
                <h2 className="font-headline text-5xl font-bold">TOP RATED BOOSTERS</h2>
              </div>
              <Link href="/booster-browse" className="group flex items-center gap-2 font-bold text-primary">
                VIEW ALL PROFESSIONALS
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              {boosters.map((booster) => (
                <div
                  key={booster.name}
                  className="group ghost-border overflow-hidden rounded-xl bg-surface-container-highest"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-110 group-hover:grayscale-0"
                      alt={`${booster.name} profile`}
                      src={booster.image}
                    />
                    {booster.live ? (
                      <div className="absolute left-4 top-4 rounded bg-tertiary px-3 py-1 text-[10px] font-black uppercase tracking-tighter">
                        Live Now
                      </div>
                    ) : null}
                  </div>
                  <div className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h4 className="font-headline text-xl font-bold">{booster.name}</h4>
                        <p className="text-xs uppercase tracking-widest text-on-surface-variant">
                          {booster.game}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-primary">
                        <Star size={14} className="fill-current" />
                        <span className="font-bold">{booster.rating}</span>
                      </div>
                    </div>
                    <div className="ghost-border flex items-center gap-3 rounded-md bg-surface-dim px-4 py-3">
                      <span className="text-secondary">{renderRankIcon(booster.rankIcon)}</span>
                      <span className="text-sm font-bold uppercase tracking-tight">{booster.rank}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-surface py-24">
          <div className="container relative z-10 mx-auto px-8">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <h2 className="font-headline mb-8 text-5xl font-bold italic tracking-tighter">
                  ELITE RESULTS, <br />
                  VERIFIED.
                </h2>
                <div className="space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="text-6xl font-black italic text-primary">98%</div>
                    <div className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                      customer satisfaction
                      <br />
                      ON 15K+ ORDERS
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-6xl font-black italic text-secondary">4.9</div>
                    <div className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                      rating
                      <div>FROM REAL USERS</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:col-span-8">
                {reviews.map((review) => (
                  <div
                    key={review.name}
                    className="ghost-border relative rounded-xl bg-surface-container-low p-8"
                  >
                    <div className="mb-6 flex gap-1 text-primary">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={`${review.name}-star-${index}`} size={13} className="fill-current" />
                      ))}
                    </div>
                    <p className="mb-8 italic leading-relaxed text-on-surface">{review.quote}</p>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 overflow-hidden rounded-full bg-surface-container-highest">
                        <img
                          className="h-full w-full object-cover"
                          alt={`${review.name} avatar`}
                          src={review.avatar}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-bold">{review.name}</div>
                        <div className="text-[10px] uppercase tracking-widest text-on-surface-variant">
                          Verified Customer
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-32">
          <div className="absolute inset-0 bg-primary-container/5 opacity-40"></div>
          <div className="container relative z-10 mx-auto px-8 text-center">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-headline mb-8 text-6xl font-bold italic leading-[0.9] tracking-tighter md:text-7xl">
                READY TO <br />
                LEVEL UP?
              </h2>
              <p className="mb-12 text-xl text-on-surface-variant">
                Join 15,000+ players who have reclaimed their competitive glory. Don&apos;t let your
                rank define your skill ceiling.
              </p>
              <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
                <button
                  type="button"
                  onClick={() => openRegisterModal("booster")}
                  className="cta-flame-soft cta-flame-soft-primary primary-gradient w-full rounded-md px-12 py-5 text-xl font-bold text-on-primary-fixed transition-transform hover:scale-105 active:scale-95 md:w-auto"
                >
                  BECOME A BOOSTER
                </button>
                <button className="cta-flame-soft cta-flame-soft-outline w-full rounded-md border border-outline/30 px-12 py-5 text-xl font-bold transition-all hover:bg-surface-variant md:w-auto">
                  HIRE A BOOSTER
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-outline-variant/10 bg-surface-container-low">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-8 py-12 md:flex-row">
          <div className="text-xl font-black text-primary-fixed">WEBSITE NAME</div>
          <div className="flex flex-wrap justify-center gap-8 font-label text-sm uppercase tracking-widest">
            {["Privacy Policy", "Terms of Service", "Contact Support", "Careers", "Refund Policy"].map(
              (item) => (
                <a key={item} href="#" className="text-on-surface/60 transition-colors duration-200 hover:text-primary-fixed">
                  {item}
                </a>
              )
            )}
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface/60">
            © 2024 Zenith Boost. All rights reserved.
          </div>
        </div>
      </footer>

      {isLoginOpen ? (
        <div
          className="modal-overlay-enter fixed inset-0 z-[80] flex items-center justify-center bg-black/65 px-4"
          onClick={() => setIsLoginOpen(false)}
        >
          <div
            className="modal-panel-enter ghost-border w-full max-w-lg transform-gpu rounded-2xl border border-outline/30 bg-surface-container p-6 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.75)]"
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
                    openRegisterModal(loginType);
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
            className="ghost-border w-full max-w-2xl transform-gpu rounded-2xl border border-outline/30 bg-surface-container p-6 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.75)]"
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
            className="ghost-border w-full max-w-3xl transform-gpu rounded-2xl border border-outline/30 bg-surface-container p-6 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.75)]"
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
