"use client";

import { useCallback, useEffect, useState } from "react";
import type { TempAuthPublicUser } from "@/lib/temp-auth-store";

type SessionState = {
  user: TempAuthPublicUser | null;
  isLoading: boolean;
};

export function useTempAuthSession() {
  const [state, setState] = useState<SessionState>({ user: null, isLoading: true });

  const refresh = useCallback(async () => {
    setState((current) => ({ ...current, isLoading: true }));

    try {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      const payload = (await response.json().catch(() => ({}))) as { user?: TempAuthPublicUser | null };
      setState({ user: payload.user ?? null, isLoading: false });
    } catch {
      setState({ user: null, isLoading: false });
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    user: state.user,
    isLoading: state.isLoading,
    refresh,
  };
}
