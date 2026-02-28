import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { WatchProvider } from "@/components/watch-provider";
import { AppShell } from "@/components/AppShell";
import { Toaster } from "@/components/Toaster";

export const metadata: Metadata = {
  title: "Watch Archive",
  description: "İzlediğiniz film ve dizileri takip edin, puanlayın ve arşivleyin.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistSans.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <WatchProvider>
              <AppShell>{children}</AppShell>
            <Toaster />
            </WatchProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
