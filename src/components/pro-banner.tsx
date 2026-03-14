"use client";

import { Check, Coffee, Crown, Heart, Loader2 } from "lucide-react";
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
import { fetchFromApp } from "@/lib/api";
import type { RootState } from "@/store";

const ICON_MAP = {
  Check,
  Coffee,
  Crown,
  Heart,
} as const;

type ProModalData = {
  headerIcon: string;
  listIcon: string;
  headerText: string;
  description: string;
  buttonText: string;
  link: string;
  features: { icon: string; label: string }[];
};

type ProBannerData = {
  bannerIcon: string;
  description: string;
};

const DEFAULT_MODAL: ProModalData = {
  headerIcon: "Heart",
  listIcon: "Check",
  headerText: "Bana destek ol",
  description:
    "WatchArchive tamamen açık kaynak ve ücretsiz bir proje. Ancak film ve dizi verilerini sunmak için sunucu maliyetleri gerekiyor. API istekleri, veritabanı ve hosting giderleri projenin sürdürülebilirliği için kritik. Küçük bir destek bile bu açık kaynak projesinin ayakta kalmasına yardımcı olur. Destek olarak geliştirmeye katkıda bulunabilirsin 😊",
  buttonText: "Buy Me A Coffee'ye git",
  link:
    process.env.NEXT_PUBLIC_BUYMEACOFFEE_URL ||
    "https://buymeacoffee.com/resatyavcin",
  features: [
    { icon: "Check", label: "İkon özelleştirmeleri" },
    { icon: "Check", label: "Özel tema seçenekleri" },
    { icon: "Check", label: "Pro rozet ve erken erişim" },
  ],
};

const DEFAULT_BANNER: ProBannerData = {
  bannerIcon: "Crown",
  description: "Pro özelliklerine erken erişim ve özel rozet.",
};

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
    dismiss:
      "text-emerald-600/70 hover:bg-emerald-500/20 hover:text-emerald-700",
    title: "text-emerald-600",
    check: "bg-emerald-500/20 text-emerald-600",
    button: "bg-emerald-500 hover:bg-emerald-600 text-white",
  },
  dark: {
    banner: "border-emerald-400/30 bg-emerald-400/10",
    icon: "text-emerald-400",
    text: "text-emerald-300",
    dismiss:
      "text-emerald-400/70 hover:bg-emerald-400/20 hover:text-emerald-300",
    title: "text-emerald-400",
    check: "bg-emerald-400/20 text-emerald-400",
    button: "bg-emerald-600 hover:bg-emerald-500 text-white",
  },
};

function getIcon(name: string) {
  const Icon = ICON_MAP[name as keyof typeof ICON_MAP];
  return Icon ?? Check;
}

export function ProBanner() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [modalData, setModalData] = useState<ProModalData | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [bannerData, setBannerData] = useState<ProBannerData>(DEFAULT_BANNER);
  const mediaType = useSelector((state: RootState) => state.app.mediaType);
  const isDark = useResolvedDark();

  useEffect(() => {
    fetchFromApp<ProBannerData>("/api/v0/support/pro-banner")
      .then(setBannerData)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!dialogOpen) return;
    fetchFromApp<ProModalData>("/api/v0/support/pro-modal")
      .then((data) => {
        setModalData(data);
      })
      .catch(() => {
        setModalData(DEFAULT_MODAL);
      })
      .finally(() => {
        setModalLoading(false);
      });
  }, [dialogOpen]);

  const s = (mediaType === "movie" ? movieStyles : diziStyles)[
    isDark ? "dark" : "light"
  ];

  const BannerIcon = getIcon(bannerData.bannerIcon);
  const displayModal = modalData ?? DEFAULT_MODAL;
  const HeaderIcon = getIcon(displayModal.headerIcon);

  return (
    <>
      <div className="relative -mx-4 mt-2 flex items-center justify-center gap-2 rounded-none border-x-0 border-y border-yellow-500/40 bg-yellow-400/15 px-4 py-2.5 text-sm sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 dark:border-yellow-500/50 dark:bg-yellow-500/20">
        <BannerIcon className="size-4 shrink-0 text-yellow-600 dark:text-yellow-400" />
        <p className="text-yellow-800 dark:text-yellow-200">
          {bannerData.description}{" "}
          <button
            type="button"
            onClick={() => {
              setModalLoading(true);
              setModalData(null);
              setDialogOpen(true);
            }}
            className="font-semibold underline underline-offset-2 hover:no-underline"
          >
            Destek ol
          </button>
        </p>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {modalLoading ? (
            <div
              className="flex min-h-[200px] flex-col items-center justify-center gap-4 py-8"
              role="status"
              aria-label="Yükleniyor"
            >
              <Loader2
                className="size-10 animate-spin text-muted-foreground"
                aria-hidden
              />
              <p className="text-sm text-muted-foreground">Yükleniyor...</p>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle
                  className={cn("flex items-center gap-2 font-bold", s.title)}
                >
                  {displayModal.headerIcon === "Heart" ? (
                    <Heart className="size-5" fill="currentColor" />
                  ) : (
                    <HeaderIcon className="size-5" />
                  )}
                  {displayModal.headerText}
                </DialogTitle>
                <DialogDescription className="space-y-3 pt-1 text-left">
                  <span className="block">{displayModal.description}</span>
                  <ul className="mt-4 flex flex-col gap-2">
                    {displayModal.features.map((f) => {
                      const FeatureIcon = getIcon(f.icon);
                      return (
                        <li
                          key={f.label}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span
                            className={cn(
                              "flex size-6 shrink-0 items-center justify-center rounded-full",
                              s.check,
                            )}
                          >
                            <FeatureIcon className="size-3.5" />
                          </span>
                          <span>{f.label}</span>
                        </li>
                      );
                    })}
                  </ul>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex gap-2 sm:gap-2">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setDialogOpen(false)}
                >
                  Kapat
                </Button>
                <Button size="lg" className={s.button} asChild>
                  <a
                    href={displayModal.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setDialogOpen(false)}
                  >
                    {displayModal.buttonText}
                  </a>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
