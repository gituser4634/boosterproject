"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTempAuthSession } from "@/lib/use-temp-auth-session";

const clientAllowedPaths = new Set([
  "/",
  "/stitch-design",
  "/booster-browse",
  "/client-settings",
  "/client-orders",
]);

export function ClientSessionGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useTempAuthSession();

  useEffect(() => {
    if (isLoading) return;
    if (!user || user.role !== "client") return;

    if (!clientAllowedPaths.has(pathname)) {
      router.replace("/");
    }
  }, [isLoading, pathname, router, user]);

  return null;
}
