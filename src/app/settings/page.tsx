"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { LogoutButton } from "@/components/logout-button";

export default function SettingsPage() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && (resolvedTheme ?? theme) === "dark";

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 py-2.5 sm:py-3">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="flex-shrink-0">
              <Link href="/profile" aria-label="Geri">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-sm sm:text-base font-semibold tracking-tight flex-1 min-w-0 truncate">
              Ayarlar
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-xl">
        <div className="rounded-lg border border-border bg-card divide-y divide-border overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-3 py-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                {isDark ? (
                  <Moon className="h-3 w-3" />
                ) : (
                  <Sun className="h-3 w-3" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">Görünüm</p>
                <p className="text-xs text-muted-foreground">Açık veya koyu tema</p>
              </div>
            </div>
            <Switch
              checked={isDark}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              aria-label="Koyu tema"
            />
          </div>
          <div className="flex items-center justify-between gap-3 px-3 py-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                <LogOut className="h-3 w-3 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Çıkış yap</p>
                <p className="text-xs text-muted-foreground">Hesabından çıkış yap</p>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </main>
    </div>
  );
}
