import { href, useLocation } from "react-router"
import { Button } from "~/components/button"
import { Tree, TreeItem } from "~/components/tree"
import { X } from "lucide-react"
import { useBlogPosts, useProjects } from "~/hooks/use-content"
import { Link } from "../link"

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

  // Determine the selected key based on current path
  const getSelectedKey = (): string => {
    if (pathname === "/") return "index"
    if (pathname === "/blog") return "blog"
    if (pathname === "/bookmarks") return "bookmarks"
    if (pathname === "/projects") return "projects"
    if (pathname === "/tools") return "tools"

    // Check for blog post match
    const blogMatch = pathname.match(/^\/blog\/(.+)$/)
    if (blogMatch) {
      return `blog-${blogMatch[1]}`
    }

    // Check for project match
    const projectMatch = pathname.match(/^\/projects\/(.+)$/)
    if (projectMatch) {
      return `project-${projectMatch[1]}`
    }

    return ""
  }

  const selectedKey = getSelectedKey()

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <Link
          className="text-xl font-bold text-primary-vivid pl-4 decoration-transparent"
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
          title="/"
          href={href("/")}
          isActive={selectedKey === "index"}
        />
        <TreeItem
          id="projects"
          title="/projects"
          href={href("/projects")}
          isActive={selectedKey === "projects"}
        >
          {projects.map((project) => (
            <TreeItem
              key={project.id}
              id={project.id}
              title={`/${project.slug}`}
              href={href("/projects/:slug", { slug: project.slug })}
              isActive={selectedKey === project.id}
            />
          ))}
        </TreeItem>
        <TreeItem
          id="blog"
          title="/blog"
          href={href("/blog")}
          isActive={selectedKey === "blog"}
        >
          {blogPosts.map((post) => (
            <TreeItem
              key={post.id}
              id={post.id}
              title={`/${post.slug}`}
              href={href("/blog/:slug", { slug: post.slug })}
              isActive={selectedKey === post.id}
            />
          ))}
        </TreeItem>
        <TreeItem
          id="bookmarks"
          title="/bookmarks"
          href={href("/bookmarks")}
          isActive={selectedKey === "bookmarks"}
        />
        <TreeItem
          id="tools"
          title="/tools"
          href={href("/tools")}
          isActive={selectedKey === "tools"}
        />
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
