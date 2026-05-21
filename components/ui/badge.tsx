import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-cyanline/30 bg-cyanline/10 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-cyanline",
        className
      )}
      {...props}
    />
  );
}

