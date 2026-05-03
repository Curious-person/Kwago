import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-[#0066FF] text-white shadow-[0_4px_0_0_#0047B3] hover:bg-[#0052CC] active:translate-y-[2px] active:shadow-[0_2px_0_0_#0047B3] focus:ring-[#0066FF]",
        secondary: "bg-zinc-100 text-zinc-900 shadow-[0_4px_0_0_#D4D4D8] hover:bg-zinc-200 active:translate-y-[2px] active:shadow-[0_2px_0_0_#D4D4D8] focus:ring-zinc-300",
        outline: "border border-zinc-200 text-zinc-700 shadow-[0_4px_0_0_#D4D4D8] hover:bg-zinc-50 active:translate-y-[2px] active:shadow-[0_2px_0_0_#D4D4D8] focus:ring-zinc-200",
        ghost: "text-zinc-600 hover:bg-zinc-100 focus:ring-zinc-200",
        link: "text-[#0066FF] underline-offset-4 hover:underline",
      },
      size: {
        sm: "px-4 py-1.5 text-xs",
        md: "px-6 py-2.5 text-sm",
        lg: "px-8 py-3.5 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

function Button({
  className,
  variant,
  size,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
