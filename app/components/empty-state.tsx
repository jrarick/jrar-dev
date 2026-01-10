import { twMerge } from "tailwind-merge"
import type { HTMLAttributes } from "react"

interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export function EmptyState({ children, className, ...props }: EmptyStateProps) {
  return (
    <div
      className={twMerge(
        "py-12 text-center border border-dashed border-primary-muted",
        className
      )}
      {...props}
    >
      <p className="font-mono text-primary-muted">{children}</p>
    </div>
  )
}
