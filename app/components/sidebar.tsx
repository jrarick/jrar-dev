import { Link } from "react-aria-components"
import { useLocation } from "react-router"
import { twMerge } from "tailwind-merge"

const links = [
  { to: "/", label: "Index" },
  { to: "/blog", label: "Blog" },
  { to: "/bookmarks", label: "Bookmarks" },
  { to: "/projects", label: "Projects" },
  { to: "/tools", label: "Tools" },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <nav className="w-64 border-r border-primary-background h-screen flex flex-col p-4 bg-app-background text-app-accent shrink-0 sticky top-0">
      <div className="text-xl font-bold mb-8 text-primary-vivid">jrar.dev</div>
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
    </nav>
  )
}
