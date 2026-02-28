"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showBottomNav =
    pathname != null && !pathname.startsWith("/login");

  return (
    <>
      <div
        className={showBottomNav ? "pb-20 sm:pb-0" : ""}
      >
        {children}
      </div>
      {showBottomNav && <BottomNav />}
    </>
  );
}
