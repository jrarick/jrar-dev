import { twMerge } from "tailwind-merge"
import type { HTMLAttributes } from "react"

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {}

export function Badge({ children, className, ...props }: BadgeProps) {
  return (
    <span
      className={twMerge(
        "inline-block text-xs font-mono text-primary-muted border border-primary-muted/30 px-2 py-0.5 uppercase tracking-wider",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
