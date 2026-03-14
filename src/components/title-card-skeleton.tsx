import { cn } from "@/lib/utils";

export function TitleCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex shrink-0 flex-col w-[96px] sm:w-[112px]",
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
