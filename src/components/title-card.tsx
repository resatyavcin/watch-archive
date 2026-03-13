import Image from "next/image";
import { Film, Tv, Star } from "lucide-react";

export type TitleCardProps = {
  poster: string | null;
  title: string;
  year: number;
  type?: "movie" | "tv";
  rating?: number;
};

function TitleCardPoster({
  poster,
  title,
  type,
}: {
  poster: string | null;
  title: string;
  type: "movie" | "tv";
}) {
  return (
    <div className="relative mb-1 aspect-2/3 overflow-hidden rounded-md bg-muted transition-transform group-hover:scale-[1.02]">
      {poster ? (
        <Image
          src={poster}
          alt={title}
          fill
          sizes="(max-width: 768px) 88px, 104px"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          {type === "movie" ? (
            <Film className="h-10 w-10 text-muted-foreground/50" />
          ) : (
            <Tv className="h-10 w-10 text-muted-foreground/50" />
          )}
        </div>
      )}
    </div>
  );
}

const starFilled = {
  movie: "fill-[#e67e22] text-[#e67e22]",
  tv: "fill-emerald-500 text-emerald-500 dark:fill-emerald-400 dark:text-emerald-400",
} as const;

const starEmpty = {
  movie: "fill-transparent text-[#e67e22]/40 dark:text-[#e67e22]/50",
  tv: "fill-transparent text-emerald-500/40 dark:text-emerald-400/50",
} as const;

function TitleCardStars({
  filledStars,
  type,
}: {
  filledStars: number;
  type: "movie" | "tv";
}) {
  if (filledStars <= 0) return null;

  return (
    <div className="mb-0.5 flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-2.5 w-2.5 ${i <= filledStars ? starFilled[type] : starEmpty[type]}`}
          aria-hidden
        />
      ))}
    </div>
  );
}

function TitleCardInfo({ title, year }: { title: string; year: number }) {
  return (
    <>
      <p className="line-clamp-2 text-xs font-medium leading-tight">{title}</p>
      {year && (
        <p className="text-[10px] text-muted-foreground">{year}</p>
      )}
    </>
  );
}

export function TitleCard({ poster, title, year, type = "movie", rating }: TitleCardProps) {
  const filledStars = rating ? Math.min(5, Math.max(0, Math.round(rating))) : 0;

  return (
    <div className="group relative flex shrink-0 flex-col w-[88px] sm:w-[104px]">
      <TitleCardPoster poster={poster} title={title} type={type} />
      <TitleCardStars filledStars={filledStars} type={type} />
      <TitleCardInfo title={title} year={year} />
    </div>
  );
}
