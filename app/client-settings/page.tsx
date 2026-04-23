"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Textarea } from "@/components/ui/textarea";
import { FileInput } from "@/components/ui/file-input";

export default function ClientSettingsPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("/booster-pfps/default-avatar.svg");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const hasUnsavedProfileChanges = useMemo(() => {
    return Boolean(username.trim() || country.trim() || bio.trim() || avatarUrl !== "/booster-pfps/default-avatar.svg");
  }, [avatarUrl, bio, country, username]);

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
    setStatusMessage("Temporary auth was removed. Connect your real backend to save profile settings.");
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

    setStatusMessage("Temporary auth was removed. Connect your real backend to change password.");
  };

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
                <PasswordInput value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
              </div>
              <div>
                <Label>New Password</Label>
                <PasswordInput value={nextPassword} onChange={(event) => setNextPassword(event.target.value)} />
              </div>
              <div>
                <Label>Confirm New Password</Label>
                <PasswordInput value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
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
