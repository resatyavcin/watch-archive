"use client";

import { LogOut, Shield } from "lucide-react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { clearAuth, setAllowAdult } from "@/store";
import type { RootState } from "@/store";

function getInitials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return displayName.slice(0, 2).toUpperCase() || "?";
}

const switchMovie =
  "data-[state=checked]:bg-[#e67e22] data-[state=unchecked]:bg-[#e67e22]/20 dark:data-[state=unchecked]:bg-[#e67e22]/20";
const switchTv =
  "data-[state=checked]:bg-emerald-500 dark:data-[state=checked]:bg-emerald-400 data-[state=unchecked]:bg-emerald-500/20 dark:data-[state=unchecked]:bg-emerald-400/20";
const iconMovie = "text-[#e67e22]";
const iconTv = "text-emerald-600 dark:text-emerald-400";

export default function Settings() {
  const router = useRouter();
  const dispatch = useDispatch();
  const allowAdult = useSelector((state: RootState) => state.app.allowAdult);
  const mediaType = useSelector((state: RootState) => state.app.mediaType);
  const user = useSelector((state: RootState) => state.app.auth.user);

  const switchClass = mediaType === "movie" ? switchMovie : switchTv;
  const iconClass = mediaType === "movie" ? iconMovie : iconTv;
  const avatarRingColor =
    mediaType === "movie"
      ? "rgb(230, 126, 34)"
      : "rgb(16, 185, 129)";

  const handleLogout = () => {
    dispatch(clearAuth());
    router.replace("/");
  };

  return (
    <main className="pt-8 pb-16">
      {/* Profile */}
      <section className="mb-10 flex flex-col items-center gap-3 py-8">
        <span
          className="inline-flex shrink-0 rounded-full p-0.5"
          style={{ border: `2px solid ${avatarRingColor}` }}
        >
          <Avatar className="size-20 shrink-0 after:!border-0">
            {user?.avatarUrl && (
              <AvatarImage src={user.avatarUrl} alt={user.displayName} />
            )}
            <AvatarFallback className="text-xl font-medium">
              {user ? getInitials(user.displayName) : "?"}
            </AvatarFallback>
          </Avatar>
        </span>
        {user && (
          <div className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-center dark:border-neutral-700">
            <p className="font-semibold text-foreground">{user.displayName}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        )}
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">
          Tercihler
        </h2>
        <ul className="divide-y divide-border rounded-xl border border-neutral-200 overflow-hidden bg-muted/30 dark:border-neutral-700">
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

      <ul className="mt-6 rounded-xl border border-neutral-200 overflow-hidden bg-muted/30 dark:border-neutral-700">
        <li>
          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-200 hover:bg-muted/50"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted transition-colors duration-200 group-hover:bg-destructive/10">
              <LogOut className="size-5 text-muted-foreground transition-colors duration-200 group-hover:text-destructive/80" />
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground transition-colors duration-200 group-hover:text-destructive/80">
                Çıkış yap
              </p>
              <p className="text-xs text-muted-foreground">
                Hesabınızdan çıkış yapın
              </p>
            </div>
          </button>
        </li>
      </ul>
    </main>
  );
}

export async function getStaticProps() {
  return {
    props: {
      scrollHeader: {
        title: "Profilim",
        backHref: "/",
      },
    },
  };
}
