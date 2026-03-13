"use client";

import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { setAllowAdult } from "@/store";
import type { RootState } from "@/store";

const switchMovie =
  "data-[state=checked]:bg-[#e67e22] data-[state=unchecked]:bg-[#e67e22]/20 dark:data-[state=unchecked]:bg-[#e67e22]/20";
const switchTv =
  "data-[state=checked]:bg-emerald-500 dark:data-[state=checked]:bg-emerald-400 data-[state=unchecked]:bg-emerald-500/20 dark:data-[state=unchecked]:bg-emerald-400/20";
const iconMovie = "text-[#e67e22]";
const iconTv = "text-emerald-600 dark:text-emerald-400";

export default function Settings() {
  const dispatch = useDispatch();
  const allowAdult = useSelector((state: RootState) => state.app.allowAdult);
  const mediaType = useSelector((state: RootState) => state.app.mediaType);

  const switchClass = mediaType === "movie" ? switchMovie : switchTv;
  const iconClass = mediaType === "movie" ? iconMovie : iconTv;

  return (
    <main className="py-8">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" asChild aria-label="Ana sayfaya dön">
          <Link href="/">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Ayarlar</h1>
      </div>
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">
          Tercihler
        </h2>
        <ul className="divide-y divide-border rounded-lg border border-border bg-card">
          <li className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="flex items-center gap-3">
              <div
                className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${mediaType === "movie" ? "bg-[#e67e22]/15" : "bg-emerald-500/15 dark:bg-emerald-400/15"}`}
              >
                <Shield className={`size-5 ${iconClass}`} />
              </div>
              <div>
                <p className="text-sm font-semibold">+18 Adult</p>
                <p className="text-xs text-muted-foreground">
                  Yetişkin içerikleri göster
                </p>
              </div>
            </div>
            <Switch
              checked={allowAdult}
              onCheckedChange={(checked) => dispatch(setAllowAdult(checked))}
              className={switchClass}
            />
          </li>
        </ul>
      </section>
    </main>
  );
}
