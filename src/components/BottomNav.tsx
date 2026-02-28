"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, User } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isSearch = pathname === "/add";
  const isProfile = pathname === "/profile";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex sm:hidden items-stretch border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-[env(safe-area-inset-bottom)]">
      <Link
        href="/"
        className={`flex flex-1 min-w-0 flex-col items-center justify-center gap-0.5 py-2.5 transition-colors ${isHome ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
      >
        <Home className="h-5 w-5 shrink-0" />
        <span className="text-[10px] font-medium">Ana Sayfa</span>
      </Link>
      <Link
        href="/add"
        className={`flex flex-1 min-w-0 flex-col items-center justify-center gap-0.5 py-2.5 transition-colors ${isSearch ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
      >
        <Search className="h-5 w-5 shrink-0" />
        <span className="text-[10px] font-medium">Ara</span>
      </Link>
      <Link
        href="/profile"
        className={`flex flex-1 min-w-0 flex-col items-center justify-center gap-0.5 py-2.5 transition-colors ${isProfile ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
      >
        <User className="h-5 w-5 shrink-0" />
        <span className="text-[10px] font-medium">Profilim</span>
      </Link>
    </nav>
  );
}
