"use client";

import Link from "next/link";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { Copy, UserCircle, Edit3 } from "lucide-react";
import { PickerSheet } from "@/components/booster/picker-sheet";
import { supportedCountries } from "@/app/booster-profile/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { FileInput } from "@/components/ui/file-input";

export default function ClientSettingsPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // User identity state
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [originalUsername, setOriginalUsername] = useState("");
  const [alias, setAlias] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);
  const [countryToSet, setCountryToSet] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("/booster-pfps/default-avatar.svg");
  const [statusMessage, setStatusMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Username uniqueness
  const [isUsernameUnique, setIsUsernameUnique] = useState<boolean | null>(true);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const showStatus = (text: string, ok = true) => {
    setStatusMessage({ text, ok });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Load current user from session
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          showStatus("Not logged in. Please sign in first.", false);
          setIsLoading(false);
          return;
        }
        const data = await res.json();
        const u = data.user;
        setUserId(u.id ?? "");
        setUsername(u.username ?? "");
        setOriginalUsername(u.username ?? "");
        setAlias(u.displayName ?? "");
        setEmail(u.email ?? "");
        setCountry(u.boosterProfile?.country ?? "");
        if (u.profilePictureUrl) setAvatarUrl(u.profilePictureUrl);
      } catch {
        showStatus("Failed to load profile.", false);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  // Username uniqueness check
  useEffect(() => {
    if (!username || username === originalUsername) {
      setIsUsernameUnique(true);
      return;
    }
    const check = async () => {
      setIsCheckingUsername(true);
      try {
        const res = await fetch(`/api/users/check-username?username=${encodeURIComponent(username)}`);
        if (res.ok) {
          const data = await res.json();
          setIsUsernameUnique(data.isUnique);
        }
      } catch {
        setIsUsernameUnique(null);
      } finally {
        setIsCheckingUsername(false);
      }
    };
    const timer = setTimeout(check, 500);
    return () => clearTimeout(timer);
  }, [username, originalUsername]);

  const hasUnsavedProfileChanges = useMemo(() => {
    return Boolean(username !== originalUsername || country || alias);
  }, [username, originalUsername, country, alias]);

  const handleOpenCountryPicker = () => {
    setCountryToSet(country);
    setIsCountryPickerOpen(true);
  };

  const handleSetCountryFromPicker = () => {
    setCountry(countryToSet);
    setIsCountryPickerOpen(false);
    showStatus(`Country of origin set to ${countryToSet}.`);
  };

  const handleAvatarUploadClick = () => fileInputRef.current?.click();

  const handleAvatarFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith("image/")) {
      showStatus("Please choose a valid image file.", false);
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const nextValue = typeof reader.result === "string" ? reader.result : "";
      if (!nextValue) { showStatus("Failed to read image file.", false); return; }
      setAvatarUrl(nextValue);
      showStatus("Avatar updated in preview.");
    };
    reader.onerror = () => showStatus("Failed to read image file.", false);
    reader.readAsDataURL(selectedFile);
    event.target.value = "";
  };

  const handleSaveProfile = async () => {
    if (username && !isUsernameUnique) {
      showStatus("Choose an available username first.", false);
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, displayName: alias, email }),
      });
      const data = await res.json();
      if (!res.ok) { showStatus(data.error ?? "Save failed.", false); return; }
      setOriginalUsername(username);
      showStatus("Profile saved successfully.");
    } catch {
      showStatus("Network error. Try again.", false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !nextPassword || !confirmPassword) {
      showStatus("Fill all password fields.", false);
      return;
    }
    if (nextPassword !== confirmPassword) {
      showStatus("New password and confirmation do not match.", false);
      return;
    }
    if (nextPassword.length < 8) {
      showStatus("New password must be at least 8 characters.", false);
      return;
    }
    setIsChangingPassword(true);
    try {
      const res = await fetch("/api/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword: nextPassword }),
      });
      const data = await res.json();
      if (!res.ok) { showStatus(data.error ?? "Password change failed.", false); return; }
      setCurrentPassword("");
      setNextPassword("");
      setConfirmPassword("");
      showStatus("Password changed successfully.");
    } catch {
      showStatus("Network error. Try again.", false);
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-on-surface-variant animate-pulse">Loading your profile...</p>
      </div>
    );
  }

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
            <Link href="/client-settings" className="top-panel-link top-panel-link-active px-4 py-2 text-sm font-bold uppercase tracking-wide">Settings</Link>
            <Link href="/client-orders" className="top-panel-link px-4 py-2 text-sm font-bold uppercase tracking-wide">Orders</Link>
          </div>
          <Button asChild type="button" variant="ghost" size="sm" className="top-panel-link px-2 py-2">
            <Link href="/level-up">Login</Link>
          </Button>
        </div>
      </header>

      <main className="min-h-screen bg-background pt-28">
        <div className="mx-auto max-w-5xl px-8 pb-20">
          <h1 className="font-headline mb-3 text-5xl font-bold uppercase italic tracking-tight text-on-surface">Client Settings</h1>
          <p className="mb-8 text-on-surface-variant">Manage your profile and account security.</p>

          {statusMessage ? (
            <div className={`mb-6 rounded-lg border px-4 py-3 text-xs font-bold uppercase tracking-wider ${statusMessage.ok ? "border-primary/30 bg-primary/10 text-primary" : "border-error/30 bg-error/10 text-error"}`}>
              {statusMessage.text}
            </div>
          ) : null}

          {/* Avatar */}
          <section className="ghost-border mb-6 flex flex-col items-center gap-8 rounded-xl bg-surface-container-low p-8 md:flex-row">
            <div className="group relative">
              <div className="h-32 w-32 overflow-hidden rounded-2xl border-2 border-primary/30 shadow-[0_0_30px_rgba(143,245,255,0.1)]">
                <img src={avatarUrl} alt="Client avatar preview" className="h-full w-full object-cover" />
              </div>
              <div className="absolute -bottom-2 -right-2 rounded-lg border border-primary/20 bg-background p-1.5 shadow-xl">
                <Edit3 className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="grow">
              <h2 className="font-headline mb-2 text-2xl font-bold text-on-surface">AVATAR</h2>
              <p className="mb-6 max-w-md text-sm text-on-surface-variant">Update your profile image. Recommended resolution: 512x512px. JPG or PNG format only.</p>
              <div className="flex flex-wrap gap-4">
                <Button type="button" onClick={handleAvatarUploadClick} className="primary-gradient font-label rounded-md px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider text-on-primary-fixed transition-transform active:scale-95">UPLOAD Avatar</Button>
                <FileInput ref={fileInputRef} accept="image/png,image/jpeg,image/webp" onChange={handleAvatarFileChange} className="hidden" />
                <Button type="button" onClick={() => setAvatarUrl("/booster-pfps/default-avatar.svg")} className="font-label rounded-md border border-white/10 bg-white/5 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-on-surface-variant transition-all hover:bg-white/10">Remove</Button>
              </div>
            </div>
          </section>

          {/* Identity */}
          <section className="ghost-border mb-6 rounded-xl bg-surface-container-low p-8">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <UserCircle className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-headline text-2xl font-bold">Identity Details</h2>
              </div>
              {userId ? (
                <div className="flex items-center gap-2 rounded-md border border-white/5 bg-surface-container-lowest px-3 py-1.5">
                  <span className="font-mono text-xs text-on-surface-variant">ID: {userId.slice(0, 20)}…</span>
                  <Button
                    type="button" variant="ghost" size="icon"
                    className="h-6 w-6 text-on-surface-variant hover:text-primary"
                    onClick={() => { navigator.clipboard.writeText(userId); showStatus("Internal UID copied to clipboard."); }}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : null}
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Username</Label>
                  {isCheckingUsername ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Checking...</span>
                  ) : username && username !== originalUsername ? (
                    isUsernameUnique
                      ? <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Available</span>
                      : <span className="text-[10px] font-bold uppercase tracking-wider text-error">Taken</span>
                  ) : null}
                </div>
                <Input
                  className={`ghost-border w-full rounded-sm border ${username && !isUsernameUnique && !isCheckingUsername ? "border-error focus:ring-error" : "border-none focus:ring-primary"} bg-surface-container-lowest px-4 py-3 text-on-surface transition-all focus:ring-1`}
                  placeholder="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Alias / Display Name</Label>
                <Input
                  className="ghost-border w-full rounded-sm border-none bg-surface-container-lowest px-4 py-3 text-on-surface transition-all focus:ring-1 focus:ring-primary"
                  placeholder="Your display name"
                  type="text"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Email Address</Label>
                <Input
                  className="ghost-border w-full rounded-sm border-none bg-surface-container-lowest px-4 py-3 text-on-surface transition-all focus:ring-1 focus:ring-primary"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Place Of Origin</Label>
                <div className="ghost-border flex items-center gap-2 rounded-sm bg-surface-container-lowest px-3 py-2">
                  <Input className="w-full border-none bg-transparent p-0 text-sm text-on-surface focus:ring-0" type="text" value={country} readOnly />
                  <Button type="button" onClick={handleOpenCountryPicker} className="rounded border border-cyan-400/40 bg-cyan-400/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-300 transition-colors hover:bg-cyan-400/25">
                    Pick
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="primary-gradient font-label rounded-md px-8 py-3 text-sm font-extrabold uppercase tracking-wider text-on-primary-fixed shadow-[0_0_20px_rgba(143,245,255,0.2)] transition-transform active:scale-95 disabled:opacity-40"
              >
                {isSaving ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </section>

          {/* Password */}
          <section className="ghost-border rounded-xl bg-surface-container-low p-8">
            <h2 className="font-headline mb-6 text-2xl font-bold">Change Password</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Current Password</Label>
                <PasswordInput value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="ghost-border rounded-sm border-none bg-surface-container-lowest px-4 py-3 text-on-surface transition-all focus:ring-1 focus:ring-primary" />
              </div>
              <div className="space-y-2">
                <Label className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">New Password</Label>
                <PasswordInput value={nextPassword} onChange={(e) => setNextPassword(e.target.value)} className="ghost-border rounded-sm border-none bg-surface-container-lowest px-4 py-3 text-on-surface transition-all focus:ring-1 focus:ring-primary" />
              </div>
              <div className="space-y-2">
                <Label className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Confirm Password</Label>
                <PasswordInput value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="ghost-border rounded-sm border-none bg-surface-container-lowest px-4 py-3 text-on-surface transition-all focus:ring-1 focus:ring-primary" />
              </div>
            </div>
            <div className="mt-8">
              <Button
                type="button"
                onClick={handleChangePassword}
                disabled={isChangingPassword}
                className="primary-gradient font-label rounded-md px-8 py-3 text-sm font-extrabold uppercase tracking-wider text-on-primary-fixed shadow-[0_0_20px_rgba(143,245,255,0.2)] transition-transform active:scale-95 disabled:opacity-40"
              >
                {isChangingPassword ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </section>
        </div>
      </main>

      <PickerSheet open={isCountryPickerOpen} onOpenChange={setIsCountryPickerOpen} title="Country of Origin" zIndexClassName="z-[67]">
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-1 gap-2">
            {supportedCountries.map((c) => (
              <Button key={c} type="button" onClick={() => setCountryToSet(c)}
                className={`rounded-md border px-3 py-2 text-left text-xs font-bold uppercase tracking-wider transition-all ${countryToSet === c ? "border-primary/40 bg-primary/10 text-primary" : "border-white/10 bg-surface-container-low text-on-surface-variant hover:text-on-surface"}`}>
                {c}
              </Button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
          <Button type="button" onClick={() => setIsCountryPickerOpen(false)} className="w-full rounded-md border border-white/10 bg-surface-container-low px-4 py-3 text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:bg-white/10">Cancel</Button>
          <Button type="button" onClick={handleSetCountryFromPicker} className="primary-gradient w-full rounded-md px-4 py-3 text-xs font-black uppercase tracking-widest text-on-primary-fixed">Set Country</Button>
        </div>
      </PickerSheet>
    </>
  );
}
