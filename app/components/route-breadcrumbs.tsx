import { useLocation } from "react-router"
import { Breadcrumbs, Breadcrumb } from "./breadcrumbs"

const routeMap: Record<string, string> = {
  blog: "Blog",
  bookmarks: "Bookmarks",
  projects: "Projects",
  tools: "Tools",
}

export function RouteBreadcrumbs() {
  const location = useLocation()
  const pathnames = location.pathname.split("/").filter((x) => x)

  const items = [
    { id: "/", label: "Index", href: "/" },
    ...pathnames.map((value, index) => {
      const href = `/${pathnames.slice(0, index + 1).join("/")}`
      const label = routeMap[value] || value
      return { id: href, label, href }
    }),
  ]

  return (
    <Breadcrumbs items={items}>
      {(item) => <Breadcrumb href={item.href}>{item.label}</Breadcrumb>}
    </Breadcrumbs>
  )
}
