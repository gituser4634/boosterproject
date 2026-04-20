"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { tempAuthLogout } from "@/lib/temp-auth-client";

type ClientProfileMenuProps = {
  avatarUrl: string;
  alt?: string;
};

export function ClientProfileMenu({ avatarUrl, alt = "Client profile avatar" }: ClientProfileMenuProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await tempAuthLogout();
    router.push("/");
  };

  return (
    <div className="relative z-[56]">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen((current) => !current)}
        className="h-8 w-8 overflow-hidden rounded-full border border-primary/20 p-0 hover:bg-transparent"
        aria-label="Open profile menu"
      >
        <img alt={alt} className="h-full w-full object-cover" src={avatarUrl} />
      </Button>

      {isOpen ? (
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close profile menu"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[55] h-auto w-auto cursor-default rounded-none p-0"
          ></Button>
          <div className="ghost-border absolute right-0 top-10 z-[56] w-[220px] rounded-xl border border-white/10 bg-surface-container p-2 shadow-2xl">
            <Button
              type="button"
              onClick={() => {
                setIsOpen(false);
                router.push("/client-settings");
              }}
              className="w-full rounded-md px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-on-surface-variant transition-colors hover:bg-white/10 hover:text-on-surface"
            >
              Settings
            </Button>
            <Button
              type="button"
              onClick={() => {
                setIsOpen(false);
                router.push("/client-orders");
              }}
              className="w-full rounded-md px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-on-surface-variant transition-colors hover:bg-white/10 hover:text-on-surface"
            >
              My Orders
            </Button>
            <Button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-md px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
            >
              Logout
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
}
