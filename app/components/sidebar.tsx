import { Link } from "react-aria-components"
import { useLocation } from "react-router"
import { twMerge } from "tailwind-merge"
import { Button } from "./button"
import { X } from "lucide-react"

export const links = [
  { to: "/", label: "Index" },
  { to: "/blog", label: "Blog" },
  { to: "/bookmarks", label: "Bookmarks" },
  { to: "/projects", label: "Projects" },
  { to: "/tools", label: "Tools" },
]

interface SidebarContentProps {
  onLinkClick?: () => void
  onClose?: () => void
}

export function SidebarContent({ onLinkClick, onClose }: SidebarContentProps) {
  const location = useLocation()

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div className="text-xl font-bold text-primary-vivid">jrar.dev</div>
        {onClose && (
          <Button variant="quiet" onPress={onClose}>
            <X className="w-5 h-5" />
            <span className="sr-only">Close</span>
          </Button>
        )}
      </div>
      <ul className="space-y-2">
        {links.map((link) => {
          const isActive =
            link.to === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(link.to)

          return (
            <li key={link.to}>
              <Link
                href={link.to}
                onPress={onLinkClick}
                className={twMerge(
                  "block px-4 py-2 transition-colors hover:text-primary-vivid hover:bg-primary-muted/10 outline-none focus-visible:ring-2 focus-visible:ring-primary-vivid",
                  isActive
                    ? "text-primary-vivid bg-primary-muted/20 border-l-2 border-primary-vivid pl-[14px]"
                    : "text-app-muted decoration-transparent"
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
    <nav className="hidden md:flex w-64 border-r border-primary-background h-screen flex-col p-4 bg-app-background text-app-accent shrink-0 sticky top-0">
      <SidebarContent />
    </nav>
  )
}
