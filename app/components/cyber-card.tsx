import { Link, type LinkProps } from "react-router"
import { twMerge } from "tailwind-merge"
import { type ReactNode, type AnchorHTMLAttributes } from "react"

interface CyberCardBaseProps {
  children: ReactNode
  className?: string
}

type ExternalLinkProps = CyberCardBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
    to?: never
  }

type InternalLinkProps = CyberCardBaseProps &
  LinkProps & {
    to: string
    href?: never
  }

type CyberCardProps = ExternalLinkProps | InternalLinkProps

export function CyberCard({ children, className, ...props }: CyberCardProps) {
  const baseClassName = twMerge(
    "group relative block p-6 border border-primary-muted bg-app-background hover:border-primary-vivid hover:bg-primary-background/50 focus:outline-none focus:ring-1 focus:ring-primary-vivid",
    className
  )

  const content = (
    <>
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-primary-muted group-hover:border-primary-vivid" />
      <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-primary-muted group-hover:border-primary-vivid" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-primary-muted group-hover:border-primary-vivid" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-primary-muted group-hover:border-primary-vivid" />
      {children}
    </>
  )

  if (props.to) {
    return (
      <Link {...(props as InternalLinkProps)} className={baseClassName}>
        {content}
      </Link>
    )
  }

  return (
    <a
      {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      className={baseClassName}
    >
      {content}
    </a>
  )
}
