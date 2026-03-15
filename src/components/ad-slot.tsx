"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";

const CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "ca-pub-8699441082010152";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdSlotProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  layout?: string;
  layoutKey?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AdSlot({
  slot,
  format = "auto",
  layout = "",
  layoutKey = "",
  className,
  style = { display: "block" },
}: AdSlotProps) {
  const router = useRouter();
  const pushedForPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!CLIENT_ID || !slot || typeof window !== "object") return;

    const path = router.asPath;
    if (pushedForPathRef.current === path) return;
    pushedForPathRef.current = path;

    const id = setTimeout(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        pushedForPathRef.current = null;
        console.error("AdSense push error:", err);
      }
    }, 100);

    return () => clearTimeout(id);
  }, [slot, router.asPath]);

  if (process.env.NODE_ENV !== "production") {
    return (
      <div
        className={cn("flex min-h-[100px] items-center justify-center rounded-lg border border-dashed border-muted-foreground/20 bg-muted/30 text-muted-foreground", className)}
        style={style}
      >
        <span className="text-xs">Ad slot</span>
      </div>
    );
  }

  return (
    <ins
      key={router.asPath}
      className={cn("adsbygoogle", className)}
      style={style}
      data-ad-client={CLIENT_ID}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
      data-ad-layout={layout}
      data-ad-layout-key={layoutKey}
    />
  );
}
