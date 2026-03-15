import Image from "next/image";
import { ChevronRight, Film, Tv } from "lucide-react";
import { cn } from "@/lib/utils";

export type TitleListRowProps = {
  poster: string | null;
  title: string;
  year: number;
  type?: "movie" | "tv";
};

export function TitleListRow({
  poster,
  title,
  year,
  type = "movie",
}: TitleListRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg py-2 transition-colors hover:bg-muted/50">
      <div className="relative size-14 shrink-0 overflow-hidden rounded-md border border-neutral-300 dark:border-neutral-600 bg-muted">
        {poster ? (
          <Image
            src={poster}
            alt={title}
            fill
            sizes="56px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            {type === "movie" ? (
              <Film className="size-6 text-muted-foreground/50" />
            ) : (
              <Tv className="size-6 text-muted-foreground/50" />
            )}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{year}</p>
      </div>
      <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
    </div>
  );
}
