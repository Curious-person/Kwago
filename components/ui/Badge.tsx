import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer",
  {
    variants: {
      variant: {
        default: "border-transparent bg-zinc-900 text-white hover:bg-zinc-800",
        secondary: "border-transparent bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
        outline: "border-zinc-200 text-zinc-600 hover:bg-zinc-50",
        active: "border-transparent bg-[#0066FF] text-white",
        featured: "border-transparent bg-[#E6F0FF] text-[#0066FF] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1",
        category: "border-transparent text-[#0066FF] text-xs font-bold uppercase tracking-wider p-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
