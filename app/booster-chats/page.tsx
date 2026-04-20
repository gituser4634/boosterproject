"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Info,
  MessageSquare,
  Mic,
  PlusCircle,
  Search,
  Send,
  Smile,
} from "lucide-react";
import { BoosterMobileNav, BoosterSidebar } from "@/components/booster/shell-navigation";
import { BoosterTopBar } from "@/components/booster/top-bar";
import { Button } from "@/components/ui/button";
import { FileInput } from "@/components/ui/file-input";
import { Input } from "@/components/ui/input";
import { useBoosterAvatar } from "@/lib/use-booster-avatar";

type TabType = "chats" | "requests";
type MessageType = "text" | "image" | "voice";

type ChatMessage = {
  id: string;
  sender: "client" | "booster";
  type: MessageType;
  content: string;
  time: string;
};

type ChatThread = {
  id: string;
  customer: string;
  subtitle: string;
  gameTag: string;
  requestType?: "Play Together" | "Boost" | "Coaching";
  hasActiveOrder: boolean;
  clientStatus: "current" | "previous" | "none";
  statusText: string;
  avatar: string;
  isOnline: boolean;
  hasUnread: boolean;
  lastSeen: string;
  messages: ChatMessage[];
};

const initialThreads: ChatThread[] = [
  {
    id: "card-1",
    customer: 'Alex "Cypher" Thompson',
    subtitle: "Radiant Push",
    gameTag: "VALORANT",
    requestType: "Boost",
    hasActiveOrder: true,
    clientStatus: "current",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBfi3gwWinFD28XVeXn8mnfmn0ooenQr6igWba6JcQT7bYVOwIj-GQxYSuXrSTukfzdV7hqr66cSBLkJt83G1dClnnFOdbfV7bq95h-xlsgcKpNVZUzRtiVtF26oGqiHP1quYcLJTNq5RHahUxZuGbY7hQlSdsvePZl02lenUKNl9TY0VgPCyLqTgYJAii2pxx2BJ475DUY3niOXjCLVfHw_c57QxZQlBC7uU0NXaAVSbDtK1uWH-h6OMOroxOuFXeWW9H2fHl-_No",
    isOnline: true,
    hasUnread: true,
    statusText: "Can we start the next session in 10 mins?",
    lastSeen: "2m ago",
    messages: [
      {
        id: "m-1",
        sender: "client",
        type: "text",
        content: "Hey man, thanks for the session yesterday. I'm already seeing progress in my rank.",
        time: "09:12 AM",
      },
      {
        id: "m-2",
        sender: "booster",
        type: "text",
        content:
          "Happy to help! You're playing really solid. Just need to focus more on your positioning during post-plants.",
        time: "09:15 AM",
      },
      {
        id: "m-3",
        sender: "client",
        type: "text",
        content: "Makes sense. Can we start the next session in 10 mins?",
        time: "Just now",
      },
    ],
  },
  {
    id: "card-3",
    customer: 'Sarah "Wraith" Miller',
    subtitle: "Duo Queue",
    gameTag: "APEX",
    requestType: "Play Together",
    hasActiveOrder: true,
    clientStatus: "previous",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAnu8zZhvRRswFF8j75Wuyn1gyuowcYrNXNyi3sHCjxjaI4krSpL4BH3UUEmKZuZv7U0gBQV-hgs2UrLrbJEv7iPuU2wVmlzzok_fJ0bj82hLQYR8jx9VJdefz0rSAnANXu3186-wglxlfzS9kJwJXiYLauNrH8eWkGgKXhhNCPr1UPoZ_TMCYSBrtskDfCMA7O2pKFU837csuYv6wzTsr8g8pjvz_cV4tvmHZfeDrJd1HFMDGCs_wYQyNfFCCziWTddeKNoVkTG4A",
    isOnline: false,
    hasUnread: false,
    statusText: "Thanks for the carry! That last win was insane.",
    lastSeen: "1h ago",
    messages: [
      {
        id: "m-4",
        sender: "client",
        type: "text",
        content: "Thanks for the carry! That last win was insane.",
        time: "08:04 AM",
      },
    ],
  },
  {
    id: "card-4",
    customer: "Jason K.",
    subtitle: "Rank Check",
    gameTag: "VALORANT",
    hasActiveOrder: false,
    clientStatus: "none",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCcDEUKtsIsz9mjRhtnA2zrwJmXqoGOh3Zm9_Img80k2l0-DSiP60j6Iu152V1muGtQ-UqQbXFpeXdipcxNeSEjb_7bU-KKiMytCXFs_61YMoND7ESmLDUmIvZZR1cQ0yFkdtmytTf7E8J6innTOzlYdlLYPGbzqk8drUs-nfNJZCCngzJHIu0Fw7K7Jv3NJI995ZhWLocjLbVNUkVR1KMfpREirk5F7Og1cKxD-CR5wXN2OLx5HRiQSvtVFsGc6TQt6z4wWhTdMSk",
    isOnline: false,
    hasUnread: false,
    statusText: "Is the boost still active for my account?",
    lastSeen: "4h ago",
    messages: [
      {
        id: "m-5",
        sender: "client",
        type: "text",
        content: "Is the boost still active for my account?",
        time: "04:42 AM",
      },
    ],
  },
];

const initialRequestThreads: ChatThread[] = [
  {
    id: "card-2",
    customer: "ShadowReaper",
    subtitle: "Coaching Request",
    gameTag: "CS2",
    requestType: "Coaching",
    hasActiveOrder: false,
    clientStatus: "none",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBGfvlQ0S9lW3oDV8rWDSZeCf5oKnU8BuViauBXEnFTBV4oyicHXMM41MWYo6Yqa6BE-12udJjOrmut1zuL2lmbmJaB9XqDS5FEvRYINY_YWuRr8bIldB1KH1mIGs2ivUm1O1pnM2MuuZIG2aCXPt3uo1O2UzZ0rTIjqQYcHPNTNCgbuGIxzuLg7xCXGgFZ5Y1x8cXmrlf2UPjIvZdbWjoMzHRjTJU7mxt--LP-BvlLcG6IZQul9ivJcoinBavR1MAeJurfBP5o7FU",
    isOnline: true,
    hasUnread: true,
    statusText: "Yo, I sent a request. Are you available this evening?",
    lastSeen: "now",
    messages: [
      {
        id: "m-6",
        sender: "client",
        type: "text",
        content: "Yo, I sent a request. Are you available this evening?",
        time: "Now",
      },
    ],
  },
];

const emojiPool = ["🔥", "✅", "💯", "🎯", "🚀", "😎", "🫡", "👍"];

function BoosterChatsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedThread = searchParams.get("thread");

  const [tab, setTab] = useState<TabType>("chats");
  const [threads, setThreads] = useState<ChatThread[]>(initialThreads);
  const [requestThreads, setRequestThreads] = useState<ChatThread[]>(initialRequestThreads);
  const [activeThreadId, setActiveThreadId] = useState(initialThreads[0]?.id ?? "");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [isClientTyping, setIsClientTyping] = useState(false);
  const [isSidebarOnline, setIsSidebarOnline] = useState(true);
  const [isNotificationsOn, setIsNotificationsOn] = useState(true);
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(2);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [voiceCounter, setVoiceCounter] = useState(1);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { avatarUrl } = useBoosterAvatar("/booster-pfps/default-avatar.svg");

  const activeList = tab === "chats" ? threads : requestThreads;

  useEffect(() => {
    if (!requestedThread) return;

    const inChats = threads.some((thread) => thread.id === requestedThread);
    const inRequests = requestThreads.some((thread) => thread.id === requestedThread);

    if (inRequests) {
      setTab("requests");
      setActiveThreadId(requestedThread);
      return;
    }

    if (inChats) {
      setTab("chats");
      setActiveThreadId(requestedThread);
    }
  }, [requestedThread, threads, requestThreads]);

  const filteredList = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return activeList;

    return activeList.filter(
      (thread) =>
        thread.customer.toLowerCase().includes(query) ||
        thread.subtitle.toLowerCase().includes(query) ||
        thread.gameTag.toLowerCase().includes(query)
    );
  }, [search, activeList]);

  const activeThread =
    filteredList.find((thread) => thread.id === activeThreadId) ??
    activeList.find((thread) => thread.id === activeThreadId) ??
    activeList[0] ??
    null;

  const unreadCount = useMemo(
    () => threads.reduce((acc, thread) => acc + (thread.hasUnread ? 1 : 0), 0),
    [threads]
  );

  const handleMarkNotificationsRead = () => {
    setUnreadNotificationCount(0);
  };

  const handleNotificationToggle = () => {
    setIsNotificationsOn((current) => !current);
  };

  const getClientTag = (status: ChatThread["clientStatus"]) => {
    if (status === "current") {
      return (
        <span className="rounded-full border border-emerald-500/40 bg-emerald-500/12 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-emerald-300">
          Current Client
        </span>
      );
    }

    if (status === "previous") {
      return (
        <span className="rounded-full border border-violet-400/40 bg-violet-400/12 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-violet-200">
          Previous Client
        </span>
      );
    }

    return null;
  };

  useEffect(() => {
    if (!activeThread || tab !== "chats" || !activeThread.isOnline) {
      setIsClientTyping(false);
      return;
    }

    const startTyping = window.setTimeout(() => setIsClientTyping(true), 2200);
    const stopTyping = window.setTimeout(() => setIsClientTyping(false), 5200);

    return () => {
      window.clearTimeout(startTyping);
      window.clearTimeout(stopTyping);
    };
  }, [activeThread?.id, activeThread?.messages.length, activeThread?.isOnline, tab]);

  const bumpThreadToTop = (
    list: ChatThread[],
    threadId: string,
    updater: (thread: ChatThread) => ChatThread
  ) => {
    const targetIndex = list.findIndex((thread) => thread.id === threadId);
    if (targetIndex === -1) return list;

    const updatedThread = updater(list[targetIndex]);
    const remainingThreads = list.filter((thread) => thread.id !== threadId);
    return [updatedThread, ...remainingThreads];
  };

  const appendMessage = (message: Omit<ChatMessage, "id" | "time">) => {
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const updateThread = (thread: ChatThread) => ({
      ...thread,
      hasUnread: false,
      statusText:
        message.type === "text"
          ? message.content
          : message.type === "image"
            ? "Sent an image"
            : "Sent a voice note",
      lastSeen: "now",
      messages: [
        ...thread.messages,
        {
          id: `msg-${Date.now()}`,
          sender: message.sender,
          type: message.type,
          content: message.content,
          time,
        },
      ],
    });

    if (tab === "chats") {
      setThreads((current) => bumpThreadToTop(current, activeThread.id, updateThread));
    } else {
      setRequestThreads((current) => bumpThreadToTop(current, activeThread.id, updateThread));
    }
  };

  const sendText = () => {
    const value = draft.trim();
    if (!value) return;
    appendMessage({ sender: "booster", type: "text", content: value });
    setDraft("");
  };

  const sendVoice = () => {
    appendMessage({ sender: "booster", type: "voice", content: `Voice note #${voiceCounter} (0:12)` });
    setVoiceCounter((current) => current + 1);
  };

  const sendImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    appendMessage({ sender: "booster", type: "image", content: imageUrl });
    event.target.value = "";
  };

  const openThread = (threadId: string) => {
    setActiveThreadId(threadId);
    if (tab === "chats") {
      setThreads((current) =>
        current.map((thread) => (thread.id === threadId ? { ...thread, hasUnread: false } : thread))
      );
    } else {
      setRequestThreads((current) =>
        current.map((thread) => (thread.id === threadId ? { ...thread, hasUnread: false } : thread))
      );
    }
  };

  const acceptRequest = () => {
    if (!activeThread || tab !== "requests") return;

    setRequestThreads((current) => current.filter((thread) => thread.id !== activeThread.id));
    setThreads((current) => [...current, { ...activeThread, hasUnread: false }]);
    setTab("chats");
    setActiveThreadId(activeThread.id);
  };

  const declineRequest = () => {
    if (!activeThread || tab !== "requests") return;

    setRequestThreads((current) => current.filter((thread) => thread.id !== activeThread.id));
    setActiveThreadId(threads[0]?.id ?? "");
  };

  return (
    <>
      <BoosterSidebar
        active="chats"
        isOnline={isSidebarOnline}
        onToggleOnline={() => setIsSidebarOnline((current) => !current)}
      />

      <BoosterTopBar
        brandLabel="ZENITH BOOSTER"
        brandClassName="font-headline text-2xl font-bold uppercase tracking-tighter text-cyan-400"
        headerClassName="fixed top-0 z-40 flex h-16 w-full items-center justify-between border-b border-white/5 bg-[#0b0e14]/65 px-8 pl-72 shadow-sm shadow-black/20 backdrop-blur-xl"
        rightClassName="flex items-center gap-6 pr-8"
        avatarUrl={avatarUrl}
        avatarAlt="User Avatar"
        avatarBorderClassName="border-cyan-400/30"
        isNotificationsOn={isNotificationsOn}
        unreadNotificationCount={unreadNotificationCount}
        isNotificationsPanelOpen={isNotificationsPanelOpen}
        onToggleNotificationsPanel={() => {
          setIsProfileMenuOpen(false);
          setIsNotificationsPanelOpen((current) => !current);
        }}
        onCloseNotificationsPanel={() => setIsNotificationsPanelOpen(false)}
        onToggleNotifications={handleNotificationToggle}
        onMarkNotificationsRead={handleMarkNotificationsRead}
        notifications={[
          { id: "queue", title: "2 new requests entered queue", meta: "Queue • Just now" },
          { id: "payment", title: "Payment cleared for Order #88204", meta: "Finance • 2h ago" },
        ]}
        isProfileMenuOpen={isProfileMenuOpen}
        onToggleProfileMenu={() => {
          setIsNotificationsPanelOpen(false);
          setIsProfileMenuOpen((current) => !current);
        }}
        onCloseProfileMenu={() => setIsProfileMenuOpen(false)}
        onProfileAction={(action) => {
          if (action === "Settings") {
            router.push("/booster-profile");
            return;
          }

          if (action === "Logout") {
            router.push("/");
            return;
          }

          setIsProfileMenuOpen(false);
        }}
      />

      <main className="ml-64 h-screen overflow-hidden pt-16">
        <div className="grid h-[calc(100vh-4rem)] grid-cols-1 grid-rows-[minmax(0,1fr)_minmax(0,1.2fr)] overflow-hidden lg:grid-cols-[22rem_minmax(0,1fr)] lg:grid-rows-1">
        <section className="flex min-h-0 flex-col border-b border-outline-variant/10 bg-surface-container-low/85 lg:border-b-0 lg:border-r">
          <div className="p-6 pb-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="headline text-2xl font-bold text-on-surface">Messages</h2>
            </div>

            <div className="mb-6 flex items-center gap-2">
              {tab === "requests" ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setTab("chats");
                    setActiveThreadId(threads[0]?.id ?? "");
                  }}
                  className="h-10 w-10 rounded-xl border border-white/10 bg-surface-container-highest/20 text-on-surface-variant hover:bg-surface-container-highest/40 hover:text-on-surface"
                  aria-label="Back to general chats"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              ) : null}

              <Button
                type="button"
                onClick={() => {
                  setTab("requests");
                  setActiveThreadId(requestThreads[0]?.id ?? "");
                }}
                className="group h-auto w-full items-center justify-between rounded-xl border border-primary/20 bg-surface-container-highest/25 px-4 py-3 transition-all duration-200 hover:border-primary/40 hover:bg-surface-container-highest/45"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <span className="text-sm font-bold tracking-tight text-on-surface">Message Requests</span>
                </div>
                <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-on-primary-fixed">{requestThreads.length}</span>
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
              <Input
                className="w-full rounded-xl border-none bg-surface-container-lowest/90 py-2.5 pl-10 pr-4 text-sm placeholder:text-outline-variant/60 focus:ring-1 focus:ring-primary/50"
                placeholder="Search conversations..."
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          <div className="custom-scrollbar mt-2 flex-1 overflow-y-auto px-3 pb-6">
            {filteredList.map((thread) => {
              const isActive = activeThread?.id === thread.id;

              return (
                <Button
                  key={thread.id}
                  type="button"
                  onClick={() => openThread(thread.id)}
                  className={`mb-3 h-auto min-h-[92px] w-full cursor-pointer overflow-hidden rounded-xl border p-4 text-left transition-all duration-200 ${
                    isActive
                      ? "border-cyan-400/25 bg-surface-container-highest/55 shadow-[0_0_0_1px_rgba(143,245,255,0.06)]"
                      : "group border-white/5 bg-surface-container-high/30 hover:border-white/15 hover:bg-surface-container-high/55"
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="relative shrink-0">
                      <img
                        className={`h-12 w-12 rounded-xl object-cover ${isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`}
                        alt="Conversation avatar"
                        src={thread.avatar}
                      />
                      {thread.isOnline ? (
                        <span className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 ${isActive ? "border-4 border-surface-container-highest" : "border-4 border-surface-container"}`}></span>
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center justify-between">
                        <h3 className={`truncate text-sm font-bold ${isActive ? "text-on-surface" : "text-on-surface-variant group-hover:text-on-surface"}`}>
                          {thread.customer}
                        </h3>
                        <span className="text-[10px] uppercase tracking-wider text-outline">{thread.lastSeen}</span>
                      </div>
                      <div className="mb-1">{getClientTag(thread.clientStatus)}</div>
                      <p
                        className={`truncate text-xs ${
                          thread.hasUnread
                            ? "font-semibold text-on-surface"
                            : "text-outline-variant"
                        }`}
                      >
                        {thread.statusText}
                      </p>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </section>

        <section className="relative flex min-h-0 flex-1 flex-col bg-surface-container-low/35">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute right-[-5%] top-[-10%] h-[320px] w-[320px] rounded-full bg-primary/4 blur-[90px]"></div>
            <div className="absolute bottom-[-10%] left-[-5%] h-[240px] w-[240px] rounded-full bg-tertiary/4 blur-[72px]"></div>
          </div>

          {activeThread ? (
            <>
              <div className="z-10 flex h-20 items-center justify-between border-b border-white/5 bg-surface/45 px-8 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      className="h-10 w-10 rounded-full border border-outline-variant/30 object-cover"
                      alt="Active chat avatar"
                      src={activeThread.avatar}
                    />
                    {activeThread.isOnline ? <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-surface bg-green-500"></span> : null}
                  </div>
                  <div>
                    <h3 className="headline font-bold tracking-tight text-on-surface">{activeThread.customer}</h3>
                    {activeThread.hasActiveOrder && activeThread.requestType ? (
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        {activeThread.gameTag} • {activeThread.requestType}
                      </p>
                    ) : null}
                    <p className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-primary">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary"></span>
                      {activeThread.isOnline ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {tab === "requests" ? (
                    <>
                      <Button
                        type="button"
                        onClick={declineRequest}
                        className="rounded-md border border-red-500/50 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-red-300 transition hover:bg-red-500/10"
                      >
                        Decline
                      </Button>
                      <Button
                        type="button"
                        onClick={acceptRequest}
                        className="rounded-md border border-emerald-500/50 bg-emerald-500/10 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-emerald-300 transition hover:bg-emerald-500/20"
                      >
                        Accept Request
                      </Button>
                    </>
                  ) : null}
                  <Button className="p-2 text-outline-variant transition-colors hover:text-primary" type="button" aria-label="Open conversation details">
                    <Info className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="custom-scrollbar relative z-10 flex-1 space-y-5 overflow-y-auto p-8">
                <div className="flex justify-center">
                  <span className="rounded-full bg-surface-container px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-outline-variant/50">Today, Oct 24</span>
                </div>

                {activeThread.messages.map((message) => {
                  const fromBooster = message.sender === "booster";

                  return (
                    <div key={message.id} className={`flex ${fromBooster ? "ml-auto max-w-[70%] items-end justify-end gap-3" : "max-w-[70%] items-end gap-3"}`}>
                      <div className={`flex ${fromBooster ? "items-end" : ""} flex-col gap-1`}>
                        <div
                          className={`px-4 py-3 ${
                            fromBooster
                              ? "rounded-2xl rounded-br-none border border-white/40 bg-slate-900/98 shadow-[0_8px_18px_rgba(0,0,0,0.32)]"
                              : "rounded-2xl rounded-bl-none border border-white/10 bg-surface-container-highest/85"
                          }`}
                        >
                          {message.type === "image" ? (
                            <img src={message.content} alt="Sent in chat" className="max-h-64 rounded-lg object-cover" />
                          ) : message.type === "voice" ? (
                            <p className={`inline-flex items-center gap-2 text-sm ${fromBooster ? "text-white" : "text-on-surface"}`}>
                              <Mic className="h-4 w-4" />
                              {message.content}
                            </p>
                          ) : (
                            <p className={`text-sm ${fromBooster ? "font-medium text-white" : "text-on-surface"}`}>{message.content}</p>
                          )}
                        </div>
                        <span className={`text-[10px] text-outline ${fromBooster ? "mr-1 text-right" : "ml-1"}`}>{message.time}</span>
                      </div>
                    </div>
                  );
                })}

                {isClientTyping ? (
                  <div className="w-fit rounded-full bg-surface-container-high px-3 py-2">
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 animate-[typingDots_900ms_ease-in-out_infinite] rounded-full bg-primary"></span>
                      <span className="h-1.5 w-1.5 animate-[typingDots_900ms_ease-in-out_120ms_infinite] rounded-full bg-primary"></span>
                      <span className="h-1.5 w-1.5 animate-[typingDots_900ms_ease-in-out_240ms_infinite] rounded-full bg-primary"></span>
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="z-10 border-t border-white/5 bg-surface/58 p-6 backdrop-blur-md">
                <FileInput ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={sendImage} />

                {isEmojiOpen ? (
                  <div className="mb-3 flex w-fit gap-1 rounded-xl border border-outline-variant/20 bg-surface-container p-2 shadow-xl">
                    {emojiPool.map((emoji) => (
                      <Button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          setDraft((current) => `${current}${emoji}`);
                          setIsEmojiOpen(false);
                        }}
                        className="rounded px-2 py-1 text-base transition hover:bg-white/10"
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                ) : null}

                <div className="flex items-center gap-4 rounded-2xl border border-outline-variant/10 bg-surface-container-low/90 p-2 shadow-lg shadow-black/20">
                  <Button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-outline-variant transition-colors hover:text-tertiary" aria-label="Attach image">
                    <PlusCircle className="h-5 w-5" />
                  </Button>
                  <Button type="button" onClick={() => setIsEmojiOpen((current) => !current)} className="p-2 text-outline-variant transition-colors hover:text-secondary" aria-label="Toggle emoji picker">
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Input
                    className="flex-1 border-none bg-transparent text-sm text-on-surface placeholder:text-outline-variant/50 focus:ring-0"
                    placeholder={`Type a message to ${activeThread.customer.split(" ")[0]}...`}
                    type="text"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        sendText();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="primary"
                    size="icon"
                    onClick={sendText}
                    className="h-10 w-10 rounded-xl active:scale-90"
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4 text-slate-950 stroke-[2.5]" />
                  </Button>
                </div>
                <div className="mt-3 flex justify-between px-2">
                  <div className="flex gap-4">
                    <Button type="button" onClick={sendVoice} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-outline">
                      <Mic className="h-3.5 w-3.5" />
                      Voice
                    </Button>
                  </div>
                  <span className="font-mono text-[10px] tracking-tighter text-outline-variant/40">ZENITH_ENCRYPTED_COMMS_v2.0</span>
                </div>
              </div>
            </>
          ) : (
            <div className="relative z-10 flex flex-1 items-center justify-center text-sm uppercase tracking-widest text-outline">
              No conversation selected.
            </div>
          )}
        </section>
        </div>
      </main>

      <BoosterMobileNav active="chats" avatarUrl={avatarUrl} />
    </>
  );
}

export default function BoosterChatsPage() {
  return (
    <Suspense fallback={<main className="ml-64 h-screen overflow-hidden pt-16" />}>
      <BoosterChatsPageContent />
    </Suspense>
  );
}

