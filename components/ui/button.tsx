import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-black uppercase tracking-[0.12em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ice disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border border-crimson/60 bg-crimson text-white shadow-[0_0_34px_rgba(239,35,60,.18)] hover:-translate-y-0.5 hover:bg-red-600",
        ghost: "border border-white/12 bg-white/[0.045] text-white hover:-translate-y-0.5 hover:border-ice/50 hover:bg-white/[0.09]",
        danger: "border border-crimson/50 bg-crimson text-white hover:bg-red-600"
      },
      size: {
        default: "h-12 px-6",
        sm: "h-10 px-4 text-xs",
        lg: "h-14 px-8 text-base"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
