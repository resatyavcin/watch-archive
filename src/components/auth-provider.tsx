"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

const LOGIN_PATH = "/login";

function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="size-8 animate-pulse rounded-full bg-muted" aria-hidden />
    </div>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const accessToken = useSelector((state: RootState) => state.app.auth.accessToken);
  const authHydrated = useSelector((state: RootState) => state.app.authHydrated);

  useEffect(() => {
    if (!authHydrated) return;
    if (!accessToken && router.pathname !== LOGIN_PATH) {
      router.replace(LOGIN_PATH);
      return;
    }
    if (accessToken && router.pathname === LOGIN_PATH) {
      router.replace("/");
    }
  }, [authHydrated, accessToken, router.pathname, router]);

  const isLoading =
    (!authHydrated && router.pathname !== LOGIN_PATH) ||
    (authHydrated && !accessToken && router.pathname !== LOGIN_PATH) ||
    (authHydrated && accessToken && router.pathname === LOGIN_PATH);

  if (isLoading) return <AuthLoading />;
  return <>{children}</>;
}
