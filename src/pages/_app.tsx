import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Geist, Geist_Mono } from "next/font/google";
import { useEffect } from "react";
import { AppHeader } from "@/components/app-header";
import { AppNav } from "@/components/app-nav";
import { ProBanner } from "@/components/pro-banner";
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

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document.body.classList.add(geistSans.className, geistMono.variable);
    return () => {
      document.body.classList.remove(geistSans.className, geistMono.variable);
    };
  }, []);

  return (
    <div className={`${geistSans.className} ${geistMono.variable}`}>
      <StoreProvider>
        <ThemeProvider>
        <div className="min-h-screen bg-background">
          <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:pb-8 lg:px-8">
            <AppHeader />
            <AppNav />
            <ProBanner />
            <Component {...pageProps} />
          </div>
        </div>
        </ThemeProvider>
      </StoreProvider>
    </div>
  );
}
