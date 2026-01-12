import { type ReactNode } from "react"
import { twMerge } from "tailwind-merge"

interface PageLayoutProps {
  children: ReactNode
  maxWidth?: "max-w-4xl" | "max-w-5xl" | "max-w-6xl" | "max-w-7xl" | string
  className?: string
}

export function PageLayout({
  children,
  maxWidth = "max-w-7xl",
  className,
}: PageLayoutProps) {
  return (
    <main
      className={twMerge(
        "min-h-screen bg-app-background py-16 font-mono",
        className
      )}
    >
      <div className={twMerge("container mx-auto px-4", maxWidth)}>
        {children}
      </div>
    </main>
  )
}

interface PageHeaderProps {
  title: ReactNode
  children?: ReactNode
  className?: string
}

export function PageHeader({ title, children, className }: PageHeaderProps) {
  return (
    <header className={twMerge("mb-12", className)}>
      <h1 className="text-3xl font-mono font-bold text-primary-vivid mb-4">
        {title}
      </h1>
      {children}
    </header>
  )
}
