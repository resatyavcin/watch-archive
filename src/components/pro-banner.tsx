"use client";

import { Coffee, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const BUYMEACOFFEE_URL =
  process.env.NEXT_PUBLIC_BUYMEACOFFEE_URL || "https://buymeacoffee.com";

export function ProBanner() {
  const [visible, setVisible] = useState(true);

  const handleDismiss = () => setVisible(false);

  if (!visible) return null;

  return (
    <div className="relative mt-2 flex items-center justify-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm dark:border-amber-400/30 dark:bg-amber-400/10">
      <Coffee className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
      <p className="text-amber-800 dark:text-amber-200">
        Pro olmak için{" "}
        <Link
          href={BUYMEACOFFEE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline underline-offset-2 hover:no-underline"
        >
          bana bir kahve ısmarla
        </Link>{" "}
        ☕
      </p>
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute right-2 rounded p-1 text-amber-600/70 transition-colors hover:bg-amber-500/20 hover:text-amber-700 dark:text-amber-400/70 dark:hover:bg-amber-400/20 dark:hover:text-amber-300"
        aria-label="Kapat"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
