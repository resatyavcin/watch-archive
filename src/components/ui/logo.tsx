import { cn } from "@/lib/utils";

export type MediaType = "movie" | "tv";

export function Logo({
  className,
  mediaType = "movie",
  light,
  hideBadge,
  ...props
}: React.ComponentPropsWithoutRef<"h1"> & {
  mediaType?: MediaType;
  /** Use on dark backgrounds - white/light text */
  light?: boolean;
  /** Hide the PRO badge */
  hideBadge?: boolean;
}) {
  const archiveColor =
    mediaType === "movie"
      ? "text-[#e67e22]"
      : "text-emerald-600 dark:text-emerald-400";
  const badgeBg =
    mediaType === "movie"
      ? "bg-[#e67e22]/15"
      : "bg-emerald-500/15 dark:bg-emerald-400/15";
  const badgeColor =
    mediaType === "movie"
      ? "text-[#e67e22]"
      : "text-emerald-600 dark:text-emerald-400";

  return (
    <h1
      className={cn(
        "inline-flex items-baseline justify-center gap-0 font-extrabold tracking-tight text-2xl sm:text-3xl whitespace-nowrap shrink-0",
        className,
      )}
      {...props}
    >
      <span className={light ? "text-white" : "text-foreground"}>Watch</span>
      <span className={light ? "text-[#e67e22]" : archiveColor}>Archive</span>
      {!hideBadge && (
        <span
          className={cn(
            "self-center ml-1 px-1.5 py-0.5 text-[10px] font-bold",
            light
              ? "rounded border border-white/20 bg-white/10 text-white"
              : cn(badgeBg, badgeColor),
          )}
        >
          PRO
        </span>
      )}
    </h1>
  );
}
