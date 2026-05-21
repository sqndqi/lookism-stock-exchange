import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/15 bg-white/[0.065] px-4 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.24em] text-ice shadow-[0_0_22px_rgba(155,231,255,.12)] backdrop-blur-xl",
        className
      )}
      {...props}
    />
  );
}
