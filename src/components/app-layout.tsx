"use client";

import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { AppHeader } from "@/components/app-header";
import { AppNav } from "@/components/app-nav";
import { AuthHeader } from "@/components/auth-header";
import { ScrollHeader } from "@/components/scroll-header";
import type { RootState } from "@/store";

type AppLayoutProps = {
  children: React.ReactNode;
  scrollHeader?: {
    title: string;
    backHref: string;
    backAlwaysVisible?: boolean;
  };
};

export function AppLayout({ children, scrollHeader }: AppLayoutProps) {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.app.auth.user);

  const isLoginPage = router.pathname === "/login";
  const isDetailPage =
    router.pathname === "/[type]/[tmdbId]" ||
    /^\/(movie|series)\/[^/]+$/.test(router.asPath);

  const showAuthLayout = isLoginPage;
  const scrollTitle =
    router.pathname === "/settings" && user?.displayName
      ? user.displayName
      : scrollHeader?.title ?? "Profilim";

  return (
    <div
      className={
        showAuthLayout
          ? "relative flex min-h-screen w-full flex-col"
          : "mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:pb-8 lg:px-8"
      }
    >
      {showAuthLayout ? (
        <>
          <AuthHeader />
          <main className="flex min-h-0 flex-1 flex-col">{children}</main>
        </>
      ) : (
        <>
          {!isDetailPage && (
            <>
              <AppHeader />
              <AppNav />
            </>
          )}
          {scrollHeader && (
            <ScrollHeader
              title={scrollTitle}
              backHref={scrollHeader.backHref}
              backAlwaysVisible={scrollHeader.backAlwaysVisible}
            />
          )}
          {children}
        </>
      )}
    </div>
  );
}
