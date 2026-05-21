import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold uppercase tracking-[0.16em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyanline disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-cyanline text-abyss shadow-glow hover:bg-white",
        ghost: "border border-white/10 bg-white/[0.04] text-white hover:border-cyanline/60 hover:bg-cyanline/10",
        danger: "bg-danger text-white hover:bg-red-400"
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3 text-xs",
        lg: "h-13 px-7 text-base"
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

