import { href, useLocation } from "react-router"
import { Button } from "~/components/button"
import { Tree, TreeItem } from "~/components/tree"
import { X } from "lucide-react"
import { useBlogPosts, useProjects } from "~/hooks/use-content"
import { Link } from "../link"
import { registry } from "~/registry"

interface SidebarContentProps {
  onLinkClick?: () => void
  onClose?: () => void
}

export function SidebarContent({ onLinkClick, onClose }: SidebarContentProps) {
  const blogPosts = useBlogPosts()
  const projects = useProjects()
  const location = useLocation()
  const pathname = location.pathname

  // Determine which keys should be expanded based on current path
  const expandedKeys: string[] = []
  if (pathname.startsWith("/blog")) {
    expandedKeys.push("blog")
  }
  if (pathname.startsWith("/projects")) {
    expandedKeys.push("projects")
  }
  if (pathname.startsWith("/components")) {
    expandedKeys.push("components")
  }
  if (pathname.startsWith("/utilities")) {
    expandedKeys.push("utilities")
  }

  // Determine the selected key based on current path
  const getSelectedKey = (): string => {
    switch (pathname) {
      case "/":
        return "index"
      case "/blog":
        return "blog"
      case "/bookmarks":
        return "bookmarks"
      case "/projects":
        return "projects"
      case "/tools":
        return "tools"
      case "/utilities":
        return "utilities"
      case "/components":
        return "components"
    }

    // Check for nested routes using prefix matching
    if (pathname.startsWith("/components/")) {
      const slug = pathname.slice("/components/".length)
      return `component-${slug}`
    }

    if (pathname.startsWith("/blog/")) {
      const slug = pathname.slice("/blog/".length)
      return `blog-${slug}`
    }

    if (pathname.startsWith("/projects/")) {
      const slug = pathname.slice("/projects/".length)
      return `project-${slug}`
    }

    if (pathname.startsWith("/utilities/")) {
      const slug = pathname.slice("/utilities/".length)
      return `utilities-${slug}`
    }

    return ""
  }

  const selectedKey = getSelectedKey()

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <Link
          className="text-xl font-medium text-primary-vivid pl-4 decoration-transparent"
          href={href("/")}
        >
          jrar.dev
        </Link>
        {onClose && (
          <Button variant="quiet" onPress={onClose}>
            <X className="w-5 h-5" />
            <span className="sr-only">Close</span>
          </Button>
        )}
      </div>
      <Tree
        aria-label="Site navigation"
        selectionMode="none"
        defaultExpandedKeys={expandedKeys}
        onAction={onLinkClick ? () => onLinkClick() : undefined}
        className="border-0 p-0 bg-transparent"
      >
        <TreeItem
          id="index"
          title="index"
          href={href("/")}
          isActive={selectedKey === "index"}
        />
        <TreeItem
          id="projects"
          title="projects"
          href={href("/projects")}
          isActive={selectedKey === "projects"}
        >
          {projects.map((project) => (
            <TreeItem
              key={project.id}
              id={project.id}
              title={project.slug}
              href={href("/projects/:slug", { slug: project.slug })}
              isActive={selectedKey === project.id}
            />
          ))}
        </TreeItem>
        <TreeItem
          id="blog"
          title="blog"
          href={href("/blog")}
          isActive={selectedKey === "blog"}
        >
          {blogPosts.map((post) => (
            <TreeItem
              key={post.id}
              id={post.id}
              title={post.slug}
              href={href("/blog/:slug", { slug: post.slug })}
              isActive={selectedKey === post.id}
            />
          ))}
        </TreeItem>
        <TreeItem
          id="bookmarks"
          title="bookmarks"
          href={href("/bookmarks")}
          isActive={selectedKey === "bookmarks"}
        />
        <TreeItem
          id="tools"
          title="tools"
          href={href("/tools")}
          isActive={selectedKey === "tools"}
        />
        <TreeItem
          id="components"
          title="components"
          href={href("/components")}
          isActive={selectedKey === "components"}
        >
          {Object.keys(registry).map((slug) => (
            <TreeItem
              key={slug}
              id={`component-${slug}`}
              title={slug}
              href={href("/components/:slug", { slug })}
              isActive={selectedKey === `component-${slug}`}
            />
          ))}
        </TreeItem>
        <TreeItem
          id="utilities"
          title="utilities"
          href={href("/utilities")}
          isActive={selectedKey === "utilities"}
        >
          <TreeItem
            id="utilities-qr-code-generator"
            title="qr-code-generator"
            href={href("/utilities/qr-code-generator")}
            isActive={selectedKey === "utilities-qr-code-generator"}
          />
        </TreeItem>
      </Tree>
    </div>
  )
}

export function Sidebar() {
  return (
    <nav className="hidden md:flex w-72 border-r border-primary-background h-screen flex-col py-4 bg-app-background text-app-accent shrink-0 sticky top-0">
      <SidebarContent />
    </nav>
  )
}
