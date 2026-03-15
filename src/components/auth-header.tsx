"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { Logo } from "@/components/ui/logo";
import type { RootState } from "@/store";

export function AuthHeader() {
  const mediaType = useSelector((state: RootState) => state.app.mediaType);

  return (
    <header className="absolute top-0 left-0 right-0 z-10 flex w-full shrink-0 items-center justify-center bg-transparent px-4 py-3 sm:px-6">
      <Link
        href="/"
        className="outline-none rounded-lg focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        aria-label="Ana sayfa"
      >
        <Logo className="shrink-0" mediaType={mediaType} light hideBadge />
      </Link>
    </header>
  );
}
