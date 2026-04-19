"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BadgeCheck, Search, Sparkles, Star, Trophy } from "lucide-react";

type Booster = {
  name: string;
  game: string;
  rating: string;
  rank: string;
  rankIcon: string;
  popularity: number;
  rankValue: number;
  live: boolean;
  image: string;
};

export default function BoosterBrowsePage() {
  const [selectedGame, setSelectedGame] = useState("all");
  const [selectedRank, setSelectedRank] = useState("all");
  const [sortBy, setSortBy] = useState<"game" | "popularity" | "rating" | "rank">("rating");

  const boosters: Booster[] = [
    {
      name: "MOHAMED123",
      game: "Apex Legends",
      rating: "5.0",
      rank: "Apex Predator",
      rankIcon: "military_tech",
      popularity: 97,
      rankValue: 4,
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
      popularity: 88,
      rankValue: 3,
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
      popularity: 95,
      rankValue: 5,
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
      popularity: 82,
      rankValue: 2,
      live: false,
      image:
        "https://scontent.ftun15-1.fna.fbcdn.net/v/t39.30808-1/462228392_2496981260655405_7587418930506211631_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=110&ccb=1-7&_nc_sid=e99d92&_nc_ohc=2WP56qrdVRsQ7kNvwFWkYS1&_nc_oc=Adoq-ZuUDnBhCQbyAR9VqREYcSxy5LvOkJlDh0N84iYLiDROjba75ybNbZY9hlt-tko&_nc_zt=24&_nc_ht=scontent.ftun15-1.fna&_nc_gid=mhkCClg0bo0Nr3kTbd-DLg&_nc_ss=7a3a8&oh=00_Af0mTktaRLpe0cPJdYydbfjfpXr8CNbc7S3pXGW71HVz1w&oe=69E1BA45",
    },
  ];

  const availableGames = useMemo(
    () => ["all", ...new Set(boosters.map((booster) => booster.game))],
    [boosters]
  );

  const availableRanks = useMemo(
    () => ["all", ...new Set(boosters.map((booster) => booster.rank))],
    [boosters]
  );

  const visibleBoosters = useMemo(() => {
    const filtered = boosters.filter((booster) => {
      const gameMatches = selectedGame === "all" || booster.game === selectedGame;
      const rankMatches = selectedRank === "all" || booster.rank === selectedRank;
      return gameMatches && rankMatches;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "game") {
        return a.game.localeCompare(b.game);
      }

      if (sortBy === "popularity") {
        return b.popularity - a.popularity;
      }

      if (sortBy === "rank") {
        return b.rankValue - a.rankValue;
      }

      return Number.parseFloat(b.rating) - Number.parseFloat(a.rating);
    });
  }, [boosters, selectedGame, selectedRank, sortBy]);

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

  return (
    <>
      <header className="ghost-border fixed top-0 z-50 w-full border-b border-outline-variant/20 bg-surface-variant/70 backdrop-blur-xl">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-8 font-headline tracking-tight">
          <div className="text-2xl font-bold tracking-tighter text-primary-fixed">Zenith Boost</div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="top-panel-link px-4 py-2 text-sm font-bold uppercase tracking-wide"
            >
              Home
            </Link>
            <Link
              href="/booster-browse"
              className="top-panel-link top-panel-link-active px-4 py-2 text-sm font-bold uppercase tracking-wide"
            >
              Browse
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
              aria-label="Search"
              className="top-panel-icon"
            >
              <Search size={18} />
            </button>
            <button
              type="button"
              className="top-panel-link px-2 py-2 text-sm font-bold uppercase tracking-wide"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      <main className="min-h-screen bg-background pt-28">
        <section className="border-y border-outline-variant/10 bg-surface-container-low py-16">
          <div className="container mx-auto px-8">
            <div className="mb-10">
              <span className="font-label mb-2 block text-xs uppercase tracking-widest text-secondary">
                Booster Browse
              </span>
              <h1 className="font-headline text-5xl font-bold">CHOOSE YOUR BOOSTER</h1>
              <p className="mt-3 text-sm text-on-surface-variant">
                Sort by game, popularity, rating, or booster rank in server.
              </p>
            </div>

            <div className="ghost-border mb-8 grid grid-cols-1 gap-3 rounded-xl bg-surface-container p-4 md:grid-cols-3">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Filter By Game
                <select
                  value={selectedGame}
                  onChange={(event) => setSelectedGame(event.target.value)}
                  className="mt-2 w-full rounded-md border border-outline/30 bg-surface-container-high px-3 py-2 text-sm uppercase tracking-wide text-on-surface outline-none transition focus:border-primary"
                >
                  {availableGames.map((game) => (
                    <option key={game} value={game}>
                      {game === "all" ? "All Games" : game}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Filter By Rank
                <select
                  value={selectedRank}
                  onChange={(event) => setSelectedRank(event.target.value)}
                  className="mt-2 w-full rounded-md border border-outline/30 bg-surface-container-high px-3 py-2 text-sm uppercase tracking-wide text-on-surface outline-none transition focus:border-primary"
                >
                  {availableRanks.map((rank) => (
                    <option key={rank} value={rank}>
                      {rank === "all" ? "All Ranks" : rank}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Sort By
                <select
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(event.target.value as "game" | "popularity" | "rating" | "rank")
                  }
                  className="mt-2 w-full rounded-md border border-outline/30 bg-surface-container-high px-3 py-2 text-sm uppercase tracking-wide text-on-surface outline-none transition focus:border-primary"
                >
                  <option value="game">Game</option>
                  <option value="popularity">Popularity</option>
                  <option value="rating">Rating</option>
                  <option value="rank">Booster Rank In Server</option>
                </select>
              </label>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              {visibleBoosters.map((booster) => (
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
                    <div className="mt-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      <span>Popularity</span>
                      <span className="text-primary">{booster.popularity}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
