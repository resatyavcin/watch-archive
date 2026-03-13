import { cn } from "@/lib/utils";

export type MediaType = "movie" | "tv";

export function Logo({
  className,
  mediaType = "movie",
  ...props
}: React.ComponentPropsWithoutRef<"h1"> & { mediaType?: MediaType }) {
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
        "inline-flex items-baseline justify-center gap-1.5 font-extrabold tracking-tight text-2xl sm:text-3xl whitespace-nowrap shrink-0",
        className,
      )}
      {...props}
    >
      <span className="text-foreground">Watch</span>
      <span className={archiveColor}>Archive</span>
      <span
        className={cn(
          "self-center px-1.5 py-0.5 text-[10px] font-bold",
          badgeBg,
          badgeColor
        )}
      >
        PRO
      </span>
    </h1>
  );
}
