import { Link } from "./link"
import { href, useLocation } from "react-router"
import { twMerge } from "tailwind-merge"
import { Button } from "./button"
import { X } from "lucide-react"

export const links = [
  { to: "/", label: "Index" },
  { to: "/blog", label: "Blog" },
  { to: "/bookmarks", label: "Bookmarks" },
  { to: "/projects", label: "Projects" },
  { to: "/tools", label: "Tools" },
] as const

interface SidebarContentProps {
  onLinkClick?: () => void
  onClose?: () => void
}

export function SidebarContent({ onLinkClick, onClose }: SidebarContentProps) {
  const location = useLocation()

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div className="text-xl font-bold text-primary-vivid pl-4">
          jrar.dev
        </div>
        {onClose && (
          <Button variant="quiet" onPress={onClose}>
            <X className="w-5 h-5" />
            <span className="sr-only">Close</span>
          </Button>
        )}
      </div>
      <ul>
        {links.map((link) => {
          const isActive =
            link.to === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(link.to)

          return (
            <li key={link.to}>
              <Link
                href={href(link.to)}
                onPress={onLinkClick}
                className={twMerge(
                  "block px-4 py-2 decoration-transparent hover:decoration-transparent",
                  isActive
                    ? "text-app-background border-l-2 bg-primary-accent pl-[14px] hover:text-app-background shadow-[0_0_10px_var(--primary-accent)]"
                    : "text-app-muted hover:text-primary-vivid hover:bg-primary-background"
                )}
              >
                {link.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function Sidebar() {
  return (
    <nav className="hidden md:flex w-64 border-r border-primary-background h-screen flex-col py-4 bg-app-background text-app-accent shrink-0 sticky top-0">
      <SidebarContent />
    </nav>
  )
}
