import { Film, Loader2, Tv } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaTypeToggleProps {
  value: "movie" | "tv";
  onChange: (value: "movie" | "tv") => void;
  isLoading?: boolean;
  className?: string;
}

const accentColor = "text-[#e67e22]";
const accentBg = "bg-[#e67e22]/10";

export function MediaTypeToggle({
  value,
  onChange,
  isLoading = false,
  className = "",
}: MediaTypeToggleProps) {
  const handleClick = (type: "movie" | "tv") => {
    if (isLoading || value === type) return;
    onChange(type);
  };

  return (
    <div
      className={cn(
        "inline-flex bg-muted/80 p-0.5 ring-1 ring-border/50",
        isLoading && "pointer-events-none opacity-70",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => handleClick("movie")}
        disabled={isLoading}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed",
          value === "movie"
            ? `${accentBg} ${accentColor} shadow-sm`
            : "text-muted-foreground hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5 dark:hover:text-foreground",
        )}
      >
        {isLoading && value === "movie" ? (
          <Loader2 className="size-3.5 shrink-0 animate-spin" />
        ) : (
          <Film className="size-3.5 shrink-0" />
        )}
        Film
      </button>
      <button
        type="button"
        onClick={() => handleClick("tv")}
        disabled={isLoading}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed",
          value === "tv"
            ? `${accentBg} ${accentColor} shadow-sm`
            : "text-muted-foreground hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5 dark:hover:text-foreground",
        )}
      >
        {isLoading && value === "tv" ? (
          <Loader2 className="size-3.5 shrink-0 animate-spin" />
        ) : (
          <Tv className="size-3.5 shrink-0" />
        )}
        Dizi
      </button>
    </div>
  );
}
