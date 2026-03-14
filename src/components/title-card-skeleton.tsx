import { cn } from "@/lib/utils";

const sizeClasses = {
  default: "w-[96px] sm:w-[112px]",
  lg: "w-[112px] sm:w-[160px] lg:w-[200px]",
} as const;

export function TitleCardSkeleton({
  className,
  size = "default",
}: {
  className?: string;
  size?: "default" | "lg";
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 flex-col",
        sizeClasses[size],
        className,
      )}
    >
      <div className="mb-1 aspect-2/3 overflow-hidden rounded-md bg-muted animate-pulse" />
      <div className="mb-1 h-2.5 w-14 rounded-sm bg-muted animate-pulse" />
      <div className="mb-0.5 h-3 w-full rounded-sm bg-muted animate-pulse" />
      <div className="h-2.5 w-8 rounded-sm bg-muted animate-pulse" />
    </div>
  );
}
