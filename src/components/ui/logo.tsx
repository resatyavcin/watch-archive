import { cn } from "@/lib/utils";

export function Logo({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"h1">) {
  return (
    <h1
      className={cn(
        "flex flex-wrap items-baseline justify-center gap-0 font-extrabold tracking-tight text-2xl sm:text-3xl whitespace-nowrap",
        className,
      )}
      {...props}
    >
      <span className="text-foreground">Watch</span>
      <span className="text-[#e67e22]">Archive</span>
    </h1>
  );
}
