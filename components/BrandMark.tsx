import React from "react";
import { LuNetwork } from "react-icons/lu";

/** CodeMap mark — a connected node graph inside an ink tile. */
export function BrandMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-lg bg-ink text-background ${className}`}
      aria-hidden
    >
      <LuNetwork className="h-[60%] w-[60%]" />
    </span>
  );
}
