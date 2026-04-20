"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileInput } from "@/components/ui/file-input";
import { ClientProfileMenu } from "@/components/shared/client-profile-menu";
import { useTempAuthSession } from "@/lib/use-temp-auth-session";

type ProfileResponse = {
  user: {
    username: string;
    country: string;
    bio: string;
    avatarUrl: string;
  };
};

export default function ClientSettingsPage() {
  const router = useRouter();
  const { user, isLoading, refresh } = useTempAuthSession();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("/booster-pfps/default-avatar.svg");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (isLoading) return;
    if (!user || user.role !== "client") {
      router.replace("/");
      return;
    }

    setUsername(user.username ?? "");
    setCountry(user.country ?? "");
    setBio(user.bio ?? "");
    setAvatarUrl(user.avatarUrl || "/booster-pfps/default-avatar.svg");
  }, [isLoading, router, user]);

  const hasUnsavedProfileChanges = useMemo(() => {
    if (!user) return false;

    return (
      username.trim() !== (user.username ?? "") ||
      country.trim() !== (user.country ?? "") ||
      bio.trim() !== (user.bio ?? "") ||
      avatarUrl !== (user.avatarUrl || "/booster-pfps/default-avatar.svg")
    );
  }, [avatarUrl, bio, country, username, user]);

  const handleAvatarUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setStatusMessage("Please choose a valid image file.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const nextValue = typeof reader.result === "string" ? reader.result : "";
      if (!nextValue) {
        setStatusMessage("Failed to read image file.");
        return;
      }

      setAvatarUrl(nextValue);
      setStatusMessage("Avatar updated in preview.");
    };

    reader.onerror = () => {
      setStatusMessage("Failed to read image file.");
    };

    reader.readAsDataURL(selectedFile);
    event.target.value = "";
  };

  const handleSaveProfile = async () => {
    setStatusMessage(null);

    if (!username.trim() || !country.trim()) {
      setStatusMessage("Username and place of origin are required.");
      return;
    }

    const response = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username.trim(),
        country: country.trim(),
        bio: bio.trim(),
        avatarUrl,
      }),
    });

    const payload = (await response.json().catch(() => ({}))) as { error?: string } & Partial<ProfileResponse>;
    if (!response.ok) {
      setStatusMessage(payload.error ?? "Failed to save profile settings.");
      return;
    }

    setStatusMessage("Profile settings saved.");
    await refresh();
  };

  const handleChangePassword = async () => {
    setStatusMessage(null);

    if (!currentPassword || !nextPassword || !confirmPassword) {
      setStatusMessage("Fill all password fields.");
      return;
    }

    if (nextPassword !== confirmPassword) {
      setStatusMessage("New password and confirmation do not match.");
      return;
    }

    const response = await fetch("/api/auth/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, nextPassword }),
    });

    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    if (!response.ok) {
      setStatusMessage(payload.error ?? "Failed to change password.");
      return;
    }

    setCurrentPassword("");
    setNextPassword("");
    setConfirmPassword("");
    setStatusMessage("Password updated.");
  };

  if (isLoading || !user || user.role !== "client") {
    return <main className="min-h-screen bg-background pt-24" />;
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

          <ClientProfileMenu avatarUrl={user.avatarUrl || "/booster-pfps/default-avatar.svg"} />
        </div>
      </header>

      <main className="min-h-screen bg-background pt-28">
        <div className="mx-auto max-w-5xl px-8 pb-20">
          <h1 className="font-headline mb-3 text-5xl font-bold uppercase italic tracking-tight text-on-surface">Client Settings</h1>
          <p className="mb-8 text-on-surface-variant">Manage your profile and account security.</p>

          {statusMessage ? (
            <div className="mb-6 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-xs font-bold uppercase tracking-wider text-primary">
              {statusMessage}
            </div>
          ) : null}

          <section className="ghost-border mb-6 rounded-xl bg-surface-container-low p-6">
            <h2 className="font-headline mb-4 text-2xl font-bold">Profile</h2>

            <div className="mb-6 flex flex-col items-center gap-4 md:flex-row">
              <div className="h-24 w-24 overflow-hidden rounded-2xl border border-primary/30">
                <img src={avatarUrl} alt="Client avatar preview" className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-wrap gap-3">
                <Button type="button" onClick={handleAvatarUploadClick} className="primary-gradient">Upload Avatar</Button>
                <FileInput ref={fileInputRef} accept="image/png,image/jpeg,image/webp" onChange={handleAvatarFileChange} className="hidden" />
                <Button type="button" variant="outline" onClick={() => setAvatarUrl("/booster-pfps/default-avatar.svg")}>Reset Avatar</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label>Username</Label>
                <Input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Username" />
              </div>
              <div>
                <Label>Place Of Origin</Label>
                <Input value={country} onChange={(event) => setCountry(event.target.value)} placeholder="Country" />
              </div>
              <div className="md:col-span-2">
                <Label>Bio</Label>
                <Textarea value={bio} onChange={(event) => setBio(event.target.value)} placeholder="Write your bio..." className="min-h-[110px]" />
              </div>
            </div>

            <div className="mt-5">
              <Button type="button" onClick={handleSaveProfile} disabled={!hasUnsavedProfileChanges} className="primary-gradient disabled:opacity-40">
                Save Profile
              </Button>
            </div>
          </section>

          <section className="ghost-border rounded-xl bg-surface-container-low p-6">
            <h2 className="font-headline mb-4 text-2xl font-bold">Change Password</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <Label>Current Password</Label>
                <Input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
              </div>
              <div>
                <Label>New Password</Label>
                <Input type="password" value={nextPassword} onChange={(event) => setNextPassword(event.target.value)} />
              </div>
              <div>
                <Label>Confirm New Password</Label>
                <Input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
              </div>
            </div>

            <div className="mt-5">
              <Button type="button" onClick={handleChangePassword} className="primary-gradient">Update Password</Button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
