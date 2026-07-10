import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border border-white/10 bg-white/[0.055] px-3 py-1 font-mono text-[0.66rem] font-bold uppercase tracking-[0.16em] text-ice",
        className
      )}
      {...props}
    />
  );
}
