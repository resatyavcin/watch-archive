"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface ScrollRowProps {
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ScrollRow({ title, children, className = "" }: ScrollRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  const updateFades = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const threshold = 4;
    setShowLeftFade(scrollLeft > threshold);
    setShowRightFade(scrollLeft < scrollWidth - clientWidth - threshold);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateFades();
    el.addEventListener("scroll", updateFades);
    const ro = new ResizeObserver(updateFades);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateFades);
      ro.disconnect();
    };
  }, [updateFades]);

  return (
    <div className={`relative -mx-4 sm:-mx-6 ${className}`}>
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-hide"
      >
        {title && <div className="mb-2 pl-4 sm:pl-6">{title}</div>}
        <div className="flex items-start gap-4 overflow-x-auto scroll-smooth pt-3 pb-2 pl-4 scrollbar-hide sm:pl-6 *:shrink-0">
          {children}
        </div>
      </div>
      <div
        className={`pointer-events-none absolute bottom-0 left-0 top-10 w-12 bg-linear-to-r from-background to-transparent transition-opacity duration-200 sm:w-16 ${showLeftFade ? "opacity-100" : "opacity-0"}`}
        aria-hidden
      />
      <div
        className={`pointer-events-none absolute bottom-0 right-0 top-10 w-12 bg-linear-to-l from-background to-transparent transition-opacity duration-200 sm:w-16 ${showRightFade ? "opacity-100" : "opacity-0"}`}
        aria-hidden
      />
    </div>
  );
}
