"use client";

import { Check, Coffee, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { RootState } from "@/store";

const BUYMEACOFFEE_URL =
  process.env.NEXT_PUBLIC_BUYMEACOFFEE_URL ||
  "https://buymeacoffee.com/resatyavcin";

function useResolvedDark() {
  const theme = useSelector((state: RootState) => state.app.theme);
  const [resolvedDark, setResolvedDark] = useState(false);

  useEffect(() => {
    if (theme === "dark") {
      setResolvedDark(true);
      return;
    }
    if (theme === "light") {
      setResolvedDark(false);
      return;
    }
    const m = window.matchMedia("(prefers-color-scheme: dark)");
    setResolvedDark(m.matches);
    const fn = () => setResolvedDark(m.matches);
    m.addEventListener("change", fn);
    return () => m.removeEventListener("change", fn);
  }, [theme]);

  return resolvedDark;
}

const movieStyles = {
  light: {
    banner: "border-[#e67e22]/30 bg-[#e67e22]/10",
    icon: "text-[#e67e22]",
    text: "text-[#c0392b]",
    dismiss: "text-[#e67e22]/70 hover:bg-[#e67e22]/20 hover:text-[#e67e22]",
    title: "text-[#e67e22]",
    check: "bg-[#e67e22]/15 text-[#e67e22]",
    button: "bg-[#e67e22] hover:bg-[#d35400] text-white",
  },
  dark: {
    banner: "border-[#e67e22]/40 bg-[#e67e22]/15",
    icon: "text-[#e67e22]",
    text: "text-[#e67e22]",
    dismiss: "text-[#e67e22]/80 hover:bg-[#e67e22]/25 hover:text-[#e67e22]",
    title: "text-[#e67e22]",
    check: "bg-[#e67e22]/20 text-[#e67e22]",
    button: "bg-[#e67e22] hover:bg-[#eb984e] text-white",
  },
};

const diziStyles = {
  light: {
    banner: "border-emerald-500/30 bg-emerald-500/10",
    icon: "text-emerald-600",
    text: "text-emerald-800",
    dismiss: "text-emerald-600/70 hover:bg-emerald-500/20 hover:text-emerald-700",
    title: "text-emerald-600",
    check: "bg-emerald-500/20 text-emerald-600",
    button: "bg-emerald-500 hover:bg-emerald-600 text-white",
  },
  dark: {
    banner: "border-emerald-400/30 bg-emerald-400/10",
    icon: "text-emerald-400",
    text: "text-emerald-300",
    dismiss: "text-emerald-400/70 hover:bg-emerald-400/20 hover:text-emerald-300",
    title: "text-emerald-400",
    check: "bg-emerald-400/20 text-emerald-400",
    button: "bg-emerald-600 hover:bg-emerald-500 text-white",
  },
};

export function ProBanner() {
  const [visible, setVisible] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const mediaType = useSelector((state: RootState) => state.app.mediaType);
  const isDark = useResolvedDark();

  const handleDismiss = () => setVisible(false);

  const s = (mediaType === "movie" ? movieStyles : diziStyles)[isDark ? "dark" : "light"];

  if (!visible) return null;

  return (
    <>
      <div className="relative mt-2 flex items-center justify-center gap-2 rounded-lg border border-yellow-500/40 bg-yellow-400/15 px-4 py-2.5 text-sm dark:border-yellow-500/50 dark:bg-yellow-500/20">
        <Coffee className="size-4 shrink-0 text-yellow-600 dark:text-yellow-400" />
        <p className="text-yellow-800 dark:text-yellow-200">
          Pro olmak için{" "}
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="font-semibold underline underline-offset-2 hover:no-underline"
          >
            bana bir kahve ısmarla
          </button>{" "}
          ☕
        </p>
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute right-2 rounded p-1 text-yellow-600/70 transition-colors hover:bg-yellow-500/25 hover:text-yellow-700 dark:text-yellow-400/70 dark:hover:bg-yellow-400/25 dark:hover:text-yellow-300"
          aria-label="Kapat"
        >
          <X className="size-4" />
        </button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className={cn("flex items-center gap-2", s.title)}>
              <Coffee className="size-5" />
              Bana destek ol
            </DialogTitle>
            <DialogDescription className="space-y-3 pt-1 text-left">
              <span className="block">
                WatchArchive tamamen açık kaynak ve ücretsiz bir proje. Ancak
                film ve dizi verilerini sunmak için sunucu maliyetleri gerekiyor.
              </span>
              <span className="block">
                API istekleri, veritabanı ve hosting giderleri projenin
                sürdürülebilirliği için kritik. Küçük bir destek bile bu açık
                kaynak projesinin ayakta kalmasına yardımcı olur.
              </span>
              <span className="block font-medium text-foreground/90">
                Destek olarak geliştirmeye katkıda bulunabilirsin 😊
              </span>
              <ul className="mt-4 flex flex-col gap-2">
                <li className="flex items-center gap-2 text-sm">
                  <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-full", s.check)}>
                    <Check className="size-3.5" />
                  </span>
                  <span>İkon özelleştirmeleri</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-full", s.check)}>
                    <Check className="size-3.5" />
                  </span>
                  <span>Özel tema seçenekleri</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-full", s.check)}>
                    <Check className="size-3.5" />
                  </span>
                  <span>Pro rozet ve erken erişim</span>
                </li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDialogOpen(false)}
            >
              Kapat
            </Button>
            <Button
              size="lg"
              className={s.button}
              asChild
            >
              <a
                href={BUYMEACOFFEE_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setDialogOpen(false)}
              >
                Buy Me a Coffee&apos;a git
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
