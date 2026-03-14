import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Geist, Geist_Mono } from "next/font/google";
import { useEffect } from "react";
import { AppHeader } from "@/components/app-header";
import { AppNav } from "@/components/app-nav";
import { ScrollHeader } from "@/components/scroll-header";
import { ThemeProvider } from "@/components/theme-provider";
import { StoreProvider } from "@/store/StoreProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function App({ Component, pageProps, router }: AppProps) {
  useEffect(() => {
    document.body.classList.add(geistSans.className, geistMono.variable);
    return () => {
      document.body.classList.remove(geistSans.className, geistMono.variable);
    };
  }, []);

  const isDetailPage =
    router.pathname === "/[type]/[tmdbId]" ||
    /^\/(movie|series)\/[^/]+$/.test(router.asPath);

  return (
    <div className={`${geistSans.className} ${geistMono.variable}`}>
      <StoreProvider>
        <ThemeProvider>
        <div className="min-h-screen bg-background">
          <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:pb-8 lg:px-8">
            {!isDetailPage && <AppHeader />}
            {!isDetailPage && <AppNav />}
            {pageProps.scrollHeader && (
              <ScrollHeader
                title={pageProps.scrollHeader.title}
                backHref={pageProps.scrollHeader.backHref}
                backAlwaysVisible={pageProps.scrollHeader.backAlwaysVisible}
              />
            )}
            <Component {...pageProps} />
          </div>
        </div>
        </ThemeProvider>
      </StoreProvider>
    </div>
  );
}
