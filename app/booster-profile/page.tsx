"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  AtSign,
  ClipboardList,
  Copy,
  Crown,
  Edit3,
  Gamepad2,
  HelpCircle,
  History,
  LayoutDashboard,
  Lock,
  MessageSquare,
  MonitorSmartphone,
  Plus,
  Settings,
  Share2,
  Shield,
  Tv,
  UserCircle,
  UserRoundCheck,
  Wallet,
  X,
} from "lucide-react";
import { BoosterSidebar } from "@/components/booster/shell-navigation";
import { BoosterTopBar, type NotificationItem } from "@/components/booster/top-bar";
import { PickerSheet } from "@/components/booster/picker-sheet";
import { Button } from "@/components/ui/button";
import { FileInput } from "@/components/ui/file-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useBoosterAvatar } from "@/lib/use-booster-avatar";
import {
  defaultAvatar,
  gameRanks,
  supportedCountries,
  supportedGames,
  supportedLanguages,
  supportedSocialPlatforms,
} from "./data";

type GameEntry = {
  id: number;
  name: string;
  rank: string;
  accountId: string;
};

type SocialLinkEntry = {
  id: number;
  platform: string;
  username: string;
};

export default function BoosterProfilePage() {
  const savedMainGameStorageKey = "booster-main-game";
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [originalUsername, setOriginalUsername] = useState("");
  const [isUsernameUnique, setIsUsernameUnique] = useState<boolean | null>(true);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [alias, setAlias] = useState("");
  const [email, setEmail] = useState("");
  const [isOnline, setIsOnline] = useState(true);
  const [isNotificationsOn, setIsNotificationsOn] = useState(true);
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { avatarUrl, setBoosterAvatarUrl, resetBoosterAvatarUrl } = useBoosterAvatar(defaultAvatar);
  const [uiMessage, setUiMessage] = useState("Loading profile...");
  const [isSaving, setIsSaving] = useState(false);
  const [languages, setLanguages] = useState<string[]>([]);
  const [isLanguagePickerOpen, setIsLanguagePickerOpen] = useState(false);
  const [languageToAdd, setLanguageToAdd] = useState("");
  const [countryOfOrigin, setCountryOfOrigin] = useState("");
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);
  const [countryToSet, setCountryToSet] = useState("");
  const [activeGames, setActiveGames] = useState<GameEntry[]>([]);
  const [nextGameId, setNextGameId] = useState(1);
  const [isGamePickerOpen, setIsGamePickerOpen] = useState(false);
  const [gameToAdd, setGameToAdd] = useState("");
  const [rankToAdd, setRankToAdd] = useState("");
  const [socialLinks, setSocialLinks] = useState<SocialLinkEntry[]>([]);
  const [nextSocialId, setNextSocialId] = useState(1);
  const [isSocialPickerOpen, setIsSocialPickerOpen] = useState(false);
  const [socialPlatformToAdd, setSocialPlatformToAdd] = useState("");
  const [socialUsernameToAdd, setSocialUsernameToAdd] = useState("");
  const [primaryGame, setPrimaryGame] = useState("");
  const [savedPrimaryGame, setSavedPrimaryGame] = useState("");
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);
  const avatarFileInputRef = useRef<HTMLInputElement | null>(null);
  const [draftAvatarUrl, setDraftAvatarUrl] = useState(avatarUrl);
  const [hasPendingAvatarChange, setHasPendingAvatarChange] = useState(false);
  const isLoggedInBooster = true;
  const [passwordFields, setPasswordFields] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  // Load real user data on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) { showStatus("Not logged in. Please sign in first."); return; }
        const data = await res.json();
        const u = data.user;
        setUserId(u.id ?? "");
        setUsername(u.username ?? "");
        setOriginalUsername(u.username ?? "");
        setAlias(u.displayName ?? "");
        setEmail(u.email ?? "");
        if (u.boosterProfile) {
          const bp = u.boosterProfile;
          setCountryOfOrigin(bp.country ?? "");
          setLanguages(bp.languages?.map((l: { language: string }) => l.language) ?? []);
        }
        showStatus("Profile loaded.");
      } catch {
        showStatus("Failed to load profile.");
      }
    };
    loadUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const notifications: NotificationItem[] = [
    { id: "request", title: "New boost request assigned", meta: "Valorant ��� 2 min ago" },
    { id: "message", title: "Client sent you a message", meta: "Inbox ��� 14 min ago" },
  ];

  const boosterNavLinks = [
    { icon: "dashboard", label: "Dashboard", href: "#" },
    { icon: "assignment", label: "Requests", href: "/booster-requests" },
    { icon: "payments", label: "Payments", href: "/booster-payments" },
    { icon: "forum", label: "Chats", href: "/booster-chats" },
  ];

  const renderNavIcon = (icon: string, className: string) => {
    if (icon === "dashboard") return <LayoutDashboard className={className} />;
    if (icon === "assignment") return <ClipboardList className={className} />;
    if (icon === "payments") return <Wallet className={className} />;
    return <MessageSquare className={className} />;
  };

  const showStatus = (message: string) => {
    setUiMessage(message);
  };

  const availableGames = supportedGames.filter(
    (game) => !activeGames.some((active) => active.name === game)
  );
  const availableLanguages = supportedLanguages.filter(
    (language) => !languages.some((active) => active.toLowerCase() === language.toLowerCase())
  );
  const availableSocialPlatforms = supportedSocialPlatforms.filter(
    (platform) => !socialLinks.some((link) => link.platform === platform)
  );

  const handleToggleOnline = () => {
    if (isDeactivated) {
      showStatus("Account is deactivated. Availability cannot be changed.");
      return;
    }

    setIsOnline((current) => {
      const next = !current;
      showStatus(next ? "Status changed to Online." : "Status changed to Offline.");
      return next;
    });
  };

  const handleNotificationToggle = () => {
    if (isDeactivated) {
      showStatus("Account is deactivated. Notifications are locked.");
      return;
    }

    setIsNotificationsOn((current) => {
      const next = !current;
      showStatus(next ? "Notifications enabled." : "Notifications muted.");
      return next;
    });
  };

  const handleMarkNotificationsRead = () => {
    setUnreadNotificationCount(0);
    showStatus("Notifications marked as read.");
  };

  const handleProfileAction = async (action: string) => {
    if (action === "Settings") {
      router.push("/booster-profile");
      return;
    }

    if (action === "Logout") {
      router.push("/");
      return;
    }

    setIsProfileMenuOpen(false);
    showStatus(`${action} clicked.`);
  };

  const handleAvatarUpload = () => {
    if (isDeactivated) {
      showStatus("Account is deactivated. Avatar cannot be changed.");
      return;
    }

    avatarFileInputRef.current?.click();
  };

  const handleAvatarRemove = () => {
    if (isDeactivated) {
      showStatus("Account is deactivated. Avatar cannot be changed.");
      return;
    }

    setDraftAvatarUrl(defaultAvatar);
    setHasPendingAvatarChange(defaultAvatar !== avatarUrl);
    showStatus("Avatar reset in preview. Apply settings to save.");
  };

  const handleAvatarFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isDeactivated) {
      showStatus("Account is deactivated. Avatar cannot be changed.");
      event.target.value = "";
      return;
    }

    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
      showStatus("Avatar update canceled.");
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      showStatus("Please choose a valid image file.");
      event.target.value = "";
      return;
    }

    const maxFileSizeInBytes = 1024 * 1024;
    if (selectedFile.size > maxFileSizeInBytes) {
      showStatus("Image must be 1MB or smaller.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result) {
        showStatus("Failed to read image file.");
        return;
      }

      setDraftAvatarUrl(result);
      setHasPendingAvatarChange(result !== avatarUrl);
      showStatus("Avatar updated in preview. Apply settings to save.");
    };
    reader.onerror = () => {
      showStatus("Failed to read image file.");
    };
    reader.readAsDataURL(selectedFile);
    event.target.value = "";
  };

  const handleApplyAvatarSettings = () => {
    if (isDeactivated) {
      showStatus("Account is deactivated. Avatar cannot be changed.");
      return;
    }

    if (!hasPendingAvatarChange) {
      showStatus("No avatar changes to apply.");
      return;
    }

    if (draftAvatarUrl === defaultAvatar) {
      const isReset = resetBoosterAvatarUrl();
      if (!isReset) {
        showStatus("Avatar update failed. Please try again.");
        return;
      }
      setHasPendingAvatarChange(false);
      showStatus("Avatar reset to default.");
      return;
    }

    const isSaved = setBoosterAvatarUrl(draftAvatarUrl);
    if (!isSaved) {
      showStatus("Avatar update failed. Please try a smaller image.");
      return;
    }

    setHasPendingAvatarChange(false);
    showStatus("Avatar updated successfully.");
  };

  useEffect(() => {
    setDraftAvatarUrl(avatarUrl);
    setHasPendingAvatarChange(false);
  }, [avatarUrl]);

  useEffect(() => {
    if (!username || username === originalUsername) {
      setIsUsernameUnique(true);
      return;
    }
    const checkUsername = async () => {
      setIsCheckingUsername(true);
      try {
        const res = await fetch(`/api/users/check-username?username=${encodeURIComponent(username)}`);
        if (res.ok) {
          const data = await res.json();
          setIsUsernameUnique(data.isUnique);
        } else {
          setIsUsernameUnique(null);
        }
      } catch {
        setIsUsernameUnique(null);
      } finally {
        setIsCheckingUsername(false);
      }
    };
    const timer = setTimeout(checkUsername, 500);
    return () => clearTimeout(timer);
  }, [username, originalUsername]);

  const handleOpenLanguagePicker = () => {
    if (isDeactivated) {
      showStatus("Account is deactivated. Languages cannot be changed.");
      return;
    }

    if (availableLanguages.length === 0) {
      showStatus("All supported languages are already added.");
      return;
    }

    setLanguageToAdd(availableLanguages[0]);
    setIsLanguagePickerOpen(true);
  };

  const handleOpenCountryPicker = () => {
    if (isDeactivated) {
      showStatus("Account is deactivated. Country cannot be changed.");
      return;
    }

    setCountryToSet(countryOfOrigin);
    setIsCountryPickerOpen(true);
  };

  const handleSetCountryFromPicker = () => {
    setCountryOfOrigin(countryToSet);
    setIsCountryPickerOpen(false);
    showStatus(`Country of origin set to ${countryToSet}.`);
  };

  const handleAddLanguageFromPicker = () => {
    if (!languageToAdd) return;

    setLanguages((current) => [...current, languageToAdd]);
    setIsLanguagePickerOpen(false);
    showStatus(`Language added: ${languageToAdd}`);
  };

  const handleRemoveLanguage = (name: string) => {
    if (isDeactivated) {
      showStatus("Account is deactivated. Languages cannot be changed.");
      return;
    }

    setLanguages((current) => current.filter((item) => item !== name));
    showStatus(`Language removed: ${name}`);
  };

  const handleCredentialsUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isDeactivated) { showStatus("Account is deactivated. Profile updates are disabled."); return; }
    if (username && !isUsernameUnique) { showStatus("Choose an available username first."); return; }
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, displayName: alias, email }),
      });
      const data = await res.json();
      if (!res.ok) { showStatus(data.error ?? "Save failed."); return; }
      setOriginalUsername(username);
      showStatus("Identity details saved.");
    } catch {
      showStatus("Network error. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseGame = (gameId: number) => {
    if (isDeactivated) {
      showStatus("Account is deactivated. Game list cannot be changed.");
      return;
    }

    setActiveGames((current) => {
      const gameToRemove = current.find((game) => game.id === gameId);
      const next = current.filter((game) => game.id !== gameId);
      if (gameToRemove) {
        showStatus(`${gameToRemove.name} removed from active list.`);
      }
      return next;
    });
  };

  const handleOpenGamePicker = () => {
    if (isDeactivated) {
      showStatus("Account is deactivated. Game list cannot be changed.");
      return;
    }

    if (availableGames.length === 0) {
      showStatus("All supported games are already added.");
      return;
    }

    const firstGame = availableGames[0];
    setGameToAdd(firstGame);
    setRankToAdd(gameRanks[firstGame][0]);
    setIsGamePickerOpen(true);
  };

  const handleGameSelectionChange = (game: string) => {
    setGameToAdd(game);
    setRankToAdd(gameRanks[game][0]);
  };

  const handleAddGameFromPicker = () => {
    if (!gameToAdd) return;

    setActiveGames((current) => [
      ...current,
      {
        id: nextGameId,
        name: gameToAdd,
        rank: rankToAdd || gameRanks[gameToAdd][0],
        accountId: "",
      },
    ]);
    setNextGameId((current) => current + 1);
    setIsGamePickerOpen(false);
    showStatus(`${gameToAdd} added to active games.`);
  };

  const handleGameRankChange = (gameId: number, rank: string) => {
    setActiveGames((current) =>
      current.map((game) => (game.id === gameId ? { ...game, rank } : game))
    );
  };

  const handleGameAccountIdChange = (gameId: number, accountId: string) => {
    setActiveGames((current) =>
      current.map((game) => (game.id === gameId ? { ...game, accountId } : game))
    );
  };

  const handleSaveExpertise = async () => {
    if (isDeactivated) { showStatus("Account is deactivated. Service expertise cannot be saved."); return; }
    const trimmedGame = primaryGame.trim();
    setSavedPrimaryGame(trimmedGame);
    window.localStorage.setItem(savedMainGameStorageKey, trimmedGame);
    // Also save languages and country to booster profile
    try {
      await fetch("/api/profile/booster", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: countryOfOrigin, languages }),
      });
      showStatus("Expertise and profile saved.");
    } catch {
      showStatus("Expertise saved locally. Network error on server save.");
    }
  };

  useEffect(() => {
    const savedGame = window.localStorage.getItem(savedMainGameStorageKey) ?? "";
    setSavedPrimaryGame(savedGame);
    setPrimaryGame(savedGame);
  }, []);

  const handleOpenSocialPicker = () => {
    if (isDeactivated) {
      showStatus("Account is deactivated. Social connections cannot be changed.");
      return;
    }

    if (availableSocialPlatforms.length === 0) {
      showStatus("All supported social platforms are already linked.");
      return;
    }

    setSocialPlatformToAdd(availableSocialPlatforms[0]);
    setSocialUsernameToAdd("");
    setIsSocialPickerOpen(true);
  };

  const handleAddSocialFromPicker = () => {
    if (!socialPlatformToAdd) return;

    const trimmedUsername = socialUsernameToAdd.trim();
    if (!trimmedUsername) {
      showStatus("Enter a username/profile link first.");
      return;
    }

    setSocialLinks((current) => [
      ...current,
      {
        id: nextSocialId,
        platform: socialPlatformToAdd,
        username: trimmedUsername,
      },
    ]);
    setNextSocialId((current) => current + 1);
    setIsSocialPickerOpen(false);
    showStatus(`${socialPlatformToAdd} profile linked.`);
  };

  const handleSocialUsernameChange = (socialId: number, username: string) => {
    setSocialLinks((current) =>
      current.map((item) => (item.id === socialId ? { ...item, username } : item))
    );
  };

  const handleRemoveSocialLink = (socialId: number) => {
    if (isDeactivated) {
      showStatus("Account is deactivated. Social connections cannot be changed.");
      return;
    }

    setSocialLinks((current) => {
      const removed = current.find((item) => item.id === socialId);
      const next = current.filter((item) => item.id !== socialId);
      if (removed) {
        showStatus(`${removed.platform} unlinked.`);
      }
      return next;
    });
  };

  const getSocialAccentClasses = (platform: string) => {
    if (platform === "Twitch") return "bg-[#9146FF]/10 text-[#9146FF]";
    if (platform === "Discord") return "bg-[#5865F2]/10 text-[#5865F2]";
    if (platform === "Twitter (X)") return "bg-[#1DA1F2]/10 text-[#1DA1F2]";
    if (platform === "YouTube") return "bg-[#FF0000]/10 text-[#FF0000]";
    if (platform === "TikTok") return "bg-[#25F4EE]/10 text-[#25F4EE]";
    if (platform === "Instagram") return "bg-[#E1306C]/10 text-[#E1306C]";
    if (platform === "Steam") return "bg-[#66c0f4]/10 text-[#66c0f4]";
    if (platform === "Xbox") return "bg-[#107C10]/10 text-[#107C10]";
    if (platform === "PlayStation") return "bg-[#003791]/10 text-[#3f6dff]";
    return "bg-primary/10 text-primary";
  };

  const handleChangePassword = async () => {
    if (isDeactivated) { showStatus("Account is deactivated. Password changes are disabled."); return; }
    if (!passwordFields.current || !passwordFields.next || !passwordFields.confirm) {
      showStatus("Fill in all password fields first.");
      return;
    }
    if (passwordFields.next !== passwordFields.confirm) {
      showStatus("New password and confirmation do not match.");
      return;
    }
    if (passwordFields.next.length < 8) {
      showStatus("New password must be at least 8 characters.");
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: passwordFields.current, newPassword: passwordFields.next }),
      });
      const data = await res.json();
      if (!res.ok) { showStatus(data.error ?? "Password change failed."); return; }
      setPasswordFields({ current: "", next: "", confirm: "" });
      showStatus("Password changed successfully.");
    } catch {
      showStatus("Network error. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleLog = () => {
    setIsLogOpen((current) => {
      const next = !current;
      showStatus(next ? "Session logs expanded." : "Session logs collapsed.");
      return next;
    });
  };

  const handleTerminateAccount = () => {
    if (isDeactivated) {
      setIsDeactivated(false);
      setIsOnline(true);
      showStatus("Account reactivated locally.");
      return;
    }

    const confirmed = window.confirm("Deactivate this account on frontend preview?");
    if (!confirmed) {
      showStatus("Account deactivation canceled.");
      return;
    }
    setIsDeactivated(true);
    setIsOnline(false);
    showStatus("Account deactivated locally.");
  };

  return (
    <>
      <BoosterTopBar
        avatarUrl={avatarUrl}
        avatarAlt="Booster Profile Avatar"
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
        notifications={notifications}
        isProfileMenuOpen={isProfileMenuOpen}
        onToggleProfileMenu={() => {
          setIsNotificationsPanelOpen(false);
          setIsProfileMenuOpen((current) => !current);
        }}
        onCloseProfileMenu={() => setIsProfileMenuOpen(false)}
        onProfileAction={handleProfileAction}
      />

      {isLoggedInBooster ? (
        <BoosterSidebar
          active="dashboard"
          isOnline={isOnline}
          onToggleOnline={handleToggleOnline}
          mainGame={savedPrimaryGame}
        />
      ) : null}

      <main className={`h-screen overflow-y-auto px-6 pb-24 pt-24 ${isLoggedInBooster ? "ml-64" : ""}`}>
        <div className="mx-auto max-w-5xl">
          <div
            className={`mb-6 rounded-lg border px-4 py-3 text-xs font-bold uppercase tracking-wider ${
              isDeactivated
                ? "border-error/30 bg-error/10 text-error"
                : "border-primary/20 bg-primary/10 text-primary"
            }`}
          >
            {uiMessage}
          </div>

          <section className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <span className="font-label mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-primary">
                System Configuration
              </span>
              <h1 className="font-headline text-5xl font-extrabold leading-none tracking-tighter text-on-surface md:text-6xl">
                BOOSTER{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  PROFILE
                </span>
              </h1>
              <p className="mt-4 max-w-lg text-lg font-light leading-relaxed text-on-surface-variant">
                Manage your identity and availability.
              </p>
            </div>

            <div className="ghost-border min-w-[280px] rounded-xl bg-surface-container-high p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
                  Availability
                </span>
                <div
                  className={`h-2 w-2 rounded-full ${isOnline ? "animate-pulse bg-primary" : "bg-outline"}`}
                ></div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-headline text-xl font-bold text-on-surface">
                    {isOnline ? "Online Now" : "Offline"}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {isOnline ? "Visible to all clients" : "Hidden from all clients"}
                  </p>
                </div>
                <Button
                  type="button"
                  aria-pressed={isOnline}
                  onClick={handleToggleOnline}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isOnline ? "bg-primary-container" : "bg-outline-variant"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full transition ${
                      isOnline
                        ? "translate-x-6 bg-on-primary-fixed"
                        : "translate-x-1 bg-on-surface-variant"
                    }`}
                  ></span>
                </Button>
              </div>
            </div>
          </section>

          <section className="ghost-border mb-6 flex flex-col items-center gap-8 rounded-xl bg-surface-container-low p-8 md:flex-row">
            <div className="group relative">
              <div className="h-32 w-32 overflow-hidden rounded-2xl border-2 border-primary/30 shadow-[0_0_30px_rgba(143,245,255,0.1)]">
                <img
                  alt="Large Profile Avatar"
                  className="h-full w-full object-cover"
                  src={draftAvatarUrl}
                />
              </div>
              <div className="absolute -bottom-2 -right-2 rounded-lg border border-primary/20 bg-background p-1.5 shadow-xl">
                <Edit3 className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="grow">
              <h2 className="font-headline mb-2 text-2xl font-bold text-on-surface">AVATAR</h2>
              <p className="mb-6 max-w-md text-sm text-on-surface-variant">
                Update your profile image. Recommended resolution: 512x512px. JPG or PNG format
                only.
              </p>
              <p className="mb-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Avatar changes apply only after clicking Apply.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  type="button"
                  onClick={handleAvatarUpload}
                  className="primary-gradient font-label rounded-md px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider text-on-primary-fixed transition-transform active:scale-95"
                >
                  UPLOAD Avatar
                </Button>
                <FileInput
                  ref={avatarFileInputRef}
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleAvatarFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  onClick={handleAvatarRemove}
                  className="font-label rounded-md border border-white/10 bg-white/5 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-on-surface-variant transition-all hover:bg-white/10"
                >
                  Remove
                </Button>
                <Button
                  type="button"
                  onClick={handleApplyAvatarSettings}
                  disabled={!hasPendingAvatarChange}
                  className="font-label rounded-md border border-primary/30 bg-primary/10 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-primary transition-all hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Apply
                </Button>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <div className="ghost-border rounded-xl bg-surface-container-low p-8 md:col-span-7">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <UserCircle className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="font-headline text-2xl font-bold">Identity Details</h2>
                </div>
                <div className="flex items-center gap-2 rounded-md border border-white/5 bg-surface-container-lowest px-3 py-1.5">
                  <span className="font-mono text-xs text-on-surface-variant">ID: {userId ? userId.slice(0, 20) + "…" : "—"}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-on-surface-variant hover:text-primary"
                    onClick={() => {
                      navigator.clipboard.writeText(userId);
                      showStatus("Internal UID copied to clipboard.");
                    }}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <form className="space-y-6" onSubmit={handleCredentialsUpdate}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      Username
                    </Label>
                    {isCheckingUsername ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Checking...</span>
                    ) : username ? (
                      isUsernameUnique ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Available</span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-error">Taken</span>
                      )
                    ) : null}
                  </div>
                  <Input
                    className={`ghost-border w-full rounded-sm border ${username && !isUsernameUnique && !isCheckingUsername ? "border-error focus:ring-error" : "border-none focus:ring-primary"} bg-surface-container-lowest px-4 py-3 text-on-surface transition-all focus:ring-1`}
                    placeholder="foreign111"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Alias
                  </Label>
                  <Input
                    className="ghost-border w-full rounded-sm border-none bg-surface-container-lowest px-4 py-3 text-on-surface transition-all focus:ring-1 focus:ring-primary"
                    placeholder="Foreign"
                    type="text"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Email Address
                  </Label>
                  <Input
                    className="ghost-border w-full rounded-sm border-none bg-surface-container-lowest px-4 py-3 text-on-surface transition-all focus:ring-1 focus:ring-primary"
                    placeholder="your@email.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Country of Origin
                  </Label>
                  <div className="ghost-border flex items-center gap-2 rounded-sm bg-surface-container-lowest px-3 py-2">
                    <Input
                      className="w-full border-none bg-transparent p-0 text-sm text-on-surface focus:ring-0"
                      type="text"
                      value={countryOfOrigin}
                      readOnly
                    />
                    <Button
                      type="button"
                      onClick={handleOpenCountryPicker}
                      className="rounded border border-cyan-400/40 bg-cyan-400/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-300 transition-colors hover:bg-cyan-400/25"
                    >
                      Pick
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Bio Description
                  </Label>
                  <Textarea
                    className="ghost-border min-h-[120px] w-full rounded-sm border-none bg-surface-container-lowest px-4 py-3 text-on-surface transition-all focus:ring-1 focus:ring-primary"
                    placeholder="Write about your professional experience, playstyle, and achievements..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Languages Spoken
                  </Label>
                  <div className="ghost-border flex w-full flex-wrap gap-2 rounded-sm bg-surface-container-lowest px-3 py-2 text-on-surface transition-all focus-within:ring-1 focus-within:ring-primary">
                    {languages.map((name) => (
                      <div
                        key={name}
                        className="flex items-center gap-1.5 rounded border border-primary/20 bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary"
                      >
                        {name}
                        <Button
                          type="button"
                          onClick={() => handleRemoveLanguage(name)}
                          className="cursor-pointer text-primary/80 hover:text-white"
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                    <Input
                      className="min-w-[80px] flex-grow border-none bg-transparent p-0 text-sm text-on-surface-variant focus:ring-0"
                      placeholder="Use Pick to add language"
                      type="text"
                      readOnly
                    />
                    <Button
                      type="button"
                      onClick={handleOpenLanguagePicker}
                      className="rounded border border-cyan-400/40 bg-cyan-400/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-300 transition-colors hover:bg-cyan-400/25"
                    >
                      Pick
                    </Button>
                  </div>
                </div>
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="primary-gradient font-label rounded-md px-8 py-3 text-sm font-extrabold uppercase tracking-wider text-on-primary-fixed shadow-[0_0_20px_rgba(143,245,255,0.2)] transition-transform active:scale-95"
                  >
                    Update Credentials
                  </Button>
                </div>
              </form>
            </div>

            <div className="ghost-border rounded-xl bg-surface-container-low p-8 md:col-span-5">
              <div className="mb-8 flex items-center gap-4">
                <div className="rounded-lg bg-tertiary/10 p-3">
                  <Gamepad2 className="h-5 w-5 text-tertiary" />
                </div>
                <h2 className="font-headline text-2xl font-bold">Service Expertise</h2>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Primary Game
                  </Label>
                  <Select
                    className="ghost-border h-10 w-full cursor-pointer appearance-none rounded-sm border-none bg-surface-container-lowest px-4 text-xs font-bold text-on-surface transition-all focus:ring-1 focus:ring-tertiary"
                    value={primaryGame}
                    onChange={(event) => setPrimaryGame(event.target.value)}
                  >
                    <option value="" disabled>
                      Select primary game
                    </option>
                    <option>Valorant</option>
                    <option>Apex Legends</option>
                    <option>League of Legends</option>
                    <option>Counter-Strike 2</option>
                    <option>Dota 2</option>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Active GAMES &amp; Ranks
                  </Label>
                  <div className="flex flex-col gap-4">
                    {activeGames.map((game) => (
                      <div key={game.id} className="space-y-2">
                        <div className="ghost-border flex items-center gap-2 rounded-lg bg-surface-container-lowest p-2">
                          <div className="min-w-[120px] rounded-md border border-tertiary/30 bg-tertiary/20 px-3 py-1.5 text-xs font-bold text-tertiary">
                            {game.name}
                          </div>
                          <div className="flex flex-grow justify-end">
                            <Select
                              className="h-10 min-w-[130px] cursor-pointer rounded border border-primary/30 bg-primary/20 px-3 py-0 text-xs font-black uppercase tracking-tighter text-primary"
                              value={game.rank}
                              onChange={(event) => handleGameRankChange(game.id, event.target.value)}
                            >
                              {gameRanks[game.name].map((rank) => (
                                <option key={`${game.id}-${rank}`} className="bg-background text-on-surface">
                                  {rank}
                                </option>
                              ))}
                            </Select>
                          </div>
                          <Button
                            type="button"
                            onClick={() => handleCloseGame(game.id)}
                            className="cursor-pointer px-1 text-on-surface-variant transition-colors hover:text-error"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          className="ghost-border w-full rounded-sm border-none bg-surface-container-lowest/50 px-3 py-2 text-[10px] italic text-on-surface-variant transition-all focus:ring-1 focus:ring-tertiary"
                          placeholder="Add in-game ID"
                          type="text"
                          value={game.accountId}
                          onChange={(event) => handleGameAccountIdChange(game.id, event.target.value)}
                        />
                      </div>
                    ))}

                    <Button
                      type="button"
                      onClick={handleOpenGamePicker}
                      className="mt-1 flex h-10 w-full items-center justify-center gap-2 rounded-md border border-white/5 bg-surface-container-highest px-3 py-2.5 text-xs font-bold text-on-surface-variant transition-colors hover:bg-white/10"
                    >
                      <Plus className="h-4 w-4" />
                      Add Game
                    </Button>

                    {availableGames.length === 0 ? (
                      <div className="ghost-border rounded-lg bg-surface-container-lowest/70 px-3 py-2 text-[10px] uppercase tracking-wider text-on-surface-variant">
                        All supported games already added
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="button"
                    onClick={handleSaveExpertise}
                    className="w-full rounded-md border border-tertiary/20 bg-transparent px-6 py-3 font-label text-xs font-bold uppercase tracking-widest text-tertiary transition-all hover:border-tertiary hover:bg-tertiary/5"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>

            <div className="ghost-border rounded-xl bg-surface-container-low p-8 md:col-span-12 lg:col-span-6">
              <div className="mb-8 flex items-center gap-4">
                <div className="rounded-lg bg-cyan-400/10 p-3">
                  <Share2 className="h-5 w-5 text-cyan-400" />
                </div>
                <h2 className="font-headline text-2xl font-bold">Socials</h2>
              </div>
              <div className="space-y-4">
                {socialLinks.map((social) => (
                  <div
                    key={social.id}
                    className="ghost-border flex items-center gap-4 rounded-lg bg-surface-container-lowest p-3"
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-md text-[10px] font-black uppercase tracking-wider ${getSocialAccentClasses(
                        social.platform
                      )}`}
                    >
                      {social.platform.slice(0, 2)}
                    </div>
                    <div className="flex-grow">
                      <Label className="mb-1 block text-[10px] font-bold uppercase text-on-surface-variant">
                        {social.platform}
                      </Label>
                      <Input
                        className="w-full border-none bg-transparent p-0 text-sm text-on-surface focus:ring-0"
                        placeholder="Profile username or URL"
                        type="text"
                        value={social.username}
                        onChange={(event) =>
                          handleSocialUsernameChange(social.id, event.target.value)
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={() => handleRemoveSocialLink(social.id)}
                      className="rounded p-1 text-on-surface-variant transition-colors hover:bg-white/10 hover:text-error"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  onClick={handleOpenSocialPicker}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border border-white/5 bg-surface-container-highest px-3 py-2.5 text-xs font-bold text-on-surface-variant transition-colors hover:bg-white/10"
                >
                  <Plus className="h-4 w-4" />
                  Add Connection
                </Button>

                {availableSocialPlatforms.length === 0 ? (
                  <div className="ghost-border rounded-lg bg-surface-container-lowest/70 px-3 py-2 text-[10px] uppercase tracking-wider text-on-surface-variant">
                    All supported platforms already linked
                  </div>
                ) : null}
              </div>
            </div>

            <div className="ghost-border rounded-xl bg-surface-container-high p-8 md:col-span-12 lg:col-span-6">
              <div className="mb-8 flex items-center gap-4">
                <div className="rounded-lg bg-secondary/10 p-3">
                  <Lock className="h-5 w-5 text-secondary" />
                </div>
                <h2 className="font-headline text-2xl font-bold">Security</h2>
              </div>
              <div className="space-y-4">
                <p className="mb-6 text-sm leading-relaxed text-on-surface-variant">
                  Ensure your account remains fortified with a rotating high-entropy password.
                </p>
                <div className="space-y-4">
                  <PasswordInput
                    className="ghost-border w-full rounded-sm border-none bg-surface-container-lowest px-4 py-3 text-on-surface transition-all focus:ring-1 focus:ring-secondary"
                    placeholder="Current Password"
                    value={passwordFields.current}
                    onChange={(event) =>
                      setPasswordFields((current) => ({ ...current, current: event.target.value }))
                    }
                  />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <PasswordInput
                      className="ghost-border w-full rounded-sm border-none bg-surface-container-lowest px-4 py-3 text-on-surface transition-all focus:ring-1 focus:ring-secondary"
                      placeholder="New Password"
                      value={passwordFields.next}
                      onChange={(event) =>
                        setPasswordFields((current) => ({ ...current, next: event.target.value }))
                      }
                    />
                    <PasswordInput
                      className="ghost-border w-full rounded-sm border-none bg-surface-container-lowest px-4 py-3 text-on-surface transition-all focus:ring-1 focus:ring-secondary"
                      placeholder="Confirm New Password"
                      value={passwordFields.confirm}
                      onChange={(event) =>
                        setPasswordFields((current) => ({ ...current, confirm: event.target.value }))
                      }
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={handleChangePassword}
                  className="mt-4 w-full rounded-md border border-secondary/20 bg-transparent px-6 py-3 font-label text-xs font-bold uppercase tracking-widest text-secondary transition-all hover:border-secondary hover:bg-secondary/5"
                >
                  Change Password
                </Button>
              </div>
            </div>

            <div className="ghost-border rounded-xl bg-surface-container p-8 md:col-span-12">
              <div className="mb-8 flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-headline text-2xl font-bold">Session Integrity</h2>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <span className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                    Last Login
                  </span>
                  <div className="flex items-center gap-2 text-on-surface">
                    <History className="h-4 w-4 text-tertiary" />
                    <p className="font-mono text-[10px] leading-tight">
                      2024.05.22
                      <br />
                      14:32:01 GMT
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                    Active Units
                  </span>
                  <div className="flex items-center gap-2 text-on-surface">
                    <MonitorSmartphone className="h-4 w-4 text-primary" />
                    <p className="font-headline text-sm font-bold uppercase">2 Systems</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                    2FA Protocol
                  </span>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserRoundCheck className="h-4 w-4 text-primary" />
                      <p className="text-sm font-bold uppercase text-primary">Active</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Global Terminal Security: Optimal
                </p>
                <Button
                  type="button"
                  onClick={handleToggleLog}
                  className="text-[10px] font-bold uppercase tracking-tighter text-primary hover:text-primary-container"
                >
                  {isLogOpen ? "Hide Log History <" : "View Log History >"}
                </Button>
              </div>

              {isLogOpen ? (
                <div className="mt-4 rounded-md border border-white/5 bg-surface-container-lowest/70 p-3 text-[10px] uppercase tracking-wider text-on-surface-variant">
                  14:32:01 GMT - secure login accepted | 14:40:12 GMT - password policy sync |
                  15:04:51 GMT - session token renewed
                </div>
              ) : null}
            </div>
          </div>

          <section className="mt-12 border-t border-white/5 pt-12">
            <div className="ghost-border flex flex-col items-center justify-between gap-6 rounded-xl bg-error-container/10 p-8 md:flex-row">
              <div>
                <h3 className="font-headline text-xl font-bold text-error">Deactivate Terminal</h3>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Permanently remove your access and clear all tactical data from Zenith servers.
                </p>
              </div>
              <Button
                type="button"
                onClick={handleTerminateAccount}
                className="rounded-md border border-error/20 bg-error/10 px-6 py-3 font-label text-xs font-black uppercase tracking-widest text-error transition-all hover:bg-error/20"
              >
                {isDeactivated ? "Reactivate Account" : "Terminate Account"}
              </Button>
            </div>
          </section>
        </div>
      </main>

      <PickerSheet
        open={isGamePickerOpen}
        onOpenChange={setIsGamePickerOpen}
        title="Add Supported Game"
        zIndexClassName="z-[60]"
        panelClassName="h-full w-full max-w-md border-l border-white/10 bg-surface-container px-6 py-8 shadow-2xl"
      >
        {availableGames.length > 0 ? (
          <>
            <div className="mb-6 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                Choose Game
              </p>
              <div className="grid grid-cols-1 gap-2">
                {availableGames.map((game) => (
                  <Button
                    key={game}
                    type="button"
                    onClick={() => handleGameSelectionChange(game)}
                    className={`rounded-md border px-3 py-2 text-left text-xs font-bold uppercase tracking-wider transition-all ${
                      gameToAdd === game
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-white/10 bg-surface-container-low text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    {game}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mb-8 space-y-2">
              <Label className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Choose Rank
              </Label>
              <Select
                className="h-10 w-full cursor-pointer rounded border border-primary/30 bg-primary/20 px-3 py-0 text-xs font-black uppercase tracking-tighter text-primary"
                value={rankToAdd}
                onChange={(event) => setRankToAdd(event.target.value)}
              >
                {(gameRanks[gameToAdd] ?? []).map((rank) => (
                  <option key={`${gameToAdd}-${rank}`} className="bg-background text-on-surface">
                    {rank}
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                onClick={() => setIsGamePickerOpen(false)}
                className="w-full rounded-md border border-white/10 bg-surface-container-low px-4 py-3 text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAddGameFromPicker}
                className="primary-gradient w-full rounded-md px-4 py-3 text-xs font-black uppercase tracking-widest text-on-primary-fixed"
              >
                Add Game
              </Button>
            </div>
          </>
        ) : (
          <div className="ghost-border rounded-lg bg-surface-container-low p-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            No more supported games available to add.
          </div>
        )}
      </PickerSheet>

      <PickerSheet
        open={isLanguagePickerOpen}
        onOpenChange={setIsLanguagePickerOpen}
        title="Add Language"
        zIndexClassName="z-[65]"
      >
        {availableLanguages.length > 0 ? (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              <div className="mb-2 space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                  Top 20 Used Languages
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {availableLanguages.map((language) => (
                    <Button
                      key={language}
                      type="button"
                      onClick={() => setLanguageToAdd(language)}
                      className={`rounded-md border px-3 py-2 text-left text-xs font-bold uppercase tracking-wider transition-all ${
                        languageToAdd === language
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-white/10 bg-surface-container-low text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      {language}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
              <Button
                type="button"
                onClick={() => setIsLanguagePickerOpen(false)}
                className="w-full rounded-md border border-white/10 bg-surface-container-low px-4 py-3 text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAddLanguageFromPicker}
                className="primary-gradient w-full rounded-md px-4 py-3 text-xs font-black uppercase tracking-widest text-on-primary-fixed"
              >
                Add Language
              </Button>
            </div>
          </>
        ) : (
          <div className="ghost-border rounded-lg bg-surface-container-low p-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            All supported languages already added.
          </div>
        )}
      </PickerSheet>

      <PickerSheet
        open={isSocialPickerOpen}
        onOpenChange={setIsSocialPickerOpen}
        title="Link Platform"
        zIndexClassName="z-[66]"
      >
        {availableSocialPlatforms.length > 0 ? (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                  Supported Platforms
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {availableSocialPlatforms.map((platform) => (
                    <Button
                      key={platform}
                      type="button"
                      onClick={() => setSocialPlatformToAdd(platform)}
                      className={`rounded-md border px-3 py-2 text-left text-xs font-bold uppercase tracking-wider transition-all ${
                        socialPlatformToAdd === platform
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-white/10 bg-surface-container-low text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      {platform}
                    </Button>
                  ))}
                </div>

                <div className="space-y-2 pt-4">
                  <Label className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Profile Username / Link
                  </Label>
                  <Input
                    className="ghost-border w-full rounded-sm border-none bg-surface-container-lowest px-4 py-3 text-sm text-on-surface transition-all focus:ring-1 focus:ring-primary"
                    placeholder="example: @YourHandle or profile URL"
                    type="text"
                    value={socialUsernameToAdd}
                    onChange={(event) => setSocialUsernameToAdd(event.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
              <Button
                type="button"
                onClick={() => setIsSocialPickerOpen(false)}
                className="w-full rounded-md border border-white/10 bg-surface-container-low px-4 py-3 text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAddSocialFromPicker}
                className="primary-gradient w-full rounded-md px-4 py-3 text-xs font-black uppercase tracking-widest text-on-primary-fixed"
              >
                Link Profile
              </Button>
            </div>
          </>
        ) : (
          <div className="ghost-border rounded-lg bg-surface-container-low p-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            All supported platforms are already linked.
          </div>
        )}
      </PickerSheet>

      <PickerSheet
        open={isCountryPickerOpen}
        onOpenChange={setIsCountryPickerOpen}
        title="Country of Origin"
        zIndexClassName="z-[67]"
      >
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-1 gap-2">
            {supportedCountries.map((country) => (
              <Button
                key={country}
                type="button"
                onClick={() => setCountryToSet(country)}
                className={`rounded-md border px-3 py-2 text-left text-xs font-bold uppercase tracking-wider transition-all ${
                  countryToSet === country
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-white/10 bg-surface-container-low text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {country}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
          <Button
            type="button"
            onClick={() => setIsCountryPickerOpen(false)}
            className="w-full rounded-md border border-white/10 bg-surface-container-low px-4 py-3 text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSetCountryFromPicker}
            className="primary-gradient w-full rounded-md px-4 py-3 text-xs font-black uppercase tracking-widest text-on-primary-fixed"
          >
            Set Country
          </Button>
        </div>
      </PickerSheet>
    </>
  );
}


