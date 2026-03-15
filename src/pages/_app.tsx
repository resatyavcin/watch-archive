import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Geist, Geist_Mono } from "next/font/google";
import { useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import { AuthProvider } from "@/components/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { StoreProvider } from "@/store/StoreProvider";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

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

  return (
    <div className={`${geistSans.className} ${geistMono.variable}`}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <StoreProvider>
          <ThemeProvider>
            <AuthProvider>
              <div className="min-h-screen bg-background">
                <AppLayout scrollHeader={pageProps.scrollHeader}>
                  <Component {...pageProps} />
                </AppLayout>
              </div>
            </AuthProvider>
          </ThemeProvider>
        </StoreProvider>
      </GoogleOAuthProvider>
    </div>
  );
}
