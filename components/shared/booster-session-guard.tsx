"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTempAuthSession } from "@/lib/use-temp-auth-session";

const boosterProtectedPaths = [
  "/booster-dashboard",
  "/booster-chats",
  "/booster-requests",
  "/booster-payments",
  "/booster-profile",
];

const isBoosterProtectedPath = (pathname: string) => {
  return boosterProtectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
};

type BoosterSessionGuardProps = {
  children: React.ReactNode;
};

export function BoosterSessionGuard({ children }: BoosterSessionGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useTempAuthSession();

  const isProtectedPath = isBoosterProtectedPath(pathname);

  useEffect(() => {
    if (!isProtectedPath || isLoading) return;

    if (!user || user.role !== "booster") {
      router.replace("/");
    }
  }, [isLoading, isProtectedPath, router, user]);

  if (!isProtectedPath) {
    return <>{children}</>;
  }

  if (isLoading || !user || user.role !== "booster") {
    return null;
  }

  return <>{children}</>;
}