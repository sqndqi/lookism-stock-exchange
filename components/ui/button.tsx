import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-2xl text-sm font-black uppercase tracking-[0.18em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border border-crimson/50 bg-gradient-to-r from-crimson via-red-500 to-white text-black shadow-[0_0_36px_rgba(239,35,60,.28)] hover:scale-[1.02] hover:shadow-[0_0_60px_rgba(239,35,60,.42)]",
        ghost: "border border-white/12 bg-white/[0.055] text-white backdrop-blur-xl hover:border-ice/60 hover:bg-ice/10 hover:text-ice",
        danger: "border border-crimson/50 bg-crimson text-white hover:bg-red-400"
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
