import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "btn-brand",
        destructive:
          "bg-red-600 text-white shadow hover:bg-red-700",
        outline:
          "border border-pink-200 text-pink-600 hover:bg-pink-50",
        secondary:
          "bg-purple-100 text-purple-700 shadow-sm hover:bg-purple-200",
        ghost:
          "text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-full",
        link: "text-pink-500 underline-offset-4 hover:underline",
        admin: "rounded-lg bg-slate-900 text-white shadow hover:bg-slate-800",
        adminOutline:
          "rounded-lg border border-slate-900 text-slate-900 bg-white hover:bg-slate-900 hover:text-white",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-11 w-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
