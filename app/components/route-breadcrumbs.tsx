import { useLocation } from "react-router"
import { Breadcrumbs, Breadcrumb } from "./breadcrumbs"

const routeMap: Record<string, string> = {
  blog: "blog",
  bookmarks: "bookmarks",
  projects: "projects",
  tools: "tools",
}

export function RouteBreadcrumbs() {
  const location = useLocation()
  const pathnames = location.pathname.split("/").filter((x) => x)

  const items = [
    { id: "/", label: "index", href: "/" },
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
