import { useState } from "react"
import { ChevronRight, Folder, FileText, ExternalLink } from "lucide-react"
import type { TreeNode } from "~/lib/bookmark-types"

interface BookmarkTreeProps {
  items: TreeNode[]
}

export function BookmarkTree({ items }: BookmarkTreeProps) {
  return (
    <div
      className="font-mono bg-app-background p-2"
      role="tree"
      aria-label="Bookmarks"
    >
      {items.map((item) => (
        <TreeItem key={item.id} item={item} level={0} />
      ))}
    </div>
  )
}

interface TreeItemProps {
  item: TreeNode
  level: number
}

function TreeItem({ item, level }: TreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const hasChildren = item.children.length > 0

  const handleToggle = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded)
    }
  }

  return (
    <div
      role="treeitem"
      aria-expanded={item.type === "folder" ? isExpanded : undefined}
    >
      <div
        className="group flex items-center gap-2 py-1.5 px-2 cursor-default select-none text-sm hover:bg-primary-background/50 hover:text-primary-vivid"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleToggle}
      >
        {/* Expand/collapse chevron for folders */}
        <span className="w-4 shrink-0">
          {item.type === "folder" && hasChildren && (
            <ChevronRight
              className={`w-4 h-4 text-app-muted transition-transform ${
                isExpanded ? "rotate-90" : ""
              }`}
            />
          )}
        </span>

        {/* Icon */}
        {item.type === "folder" ? (
          <Folder className="w-4 h-4 text-primary-base shrink-0" />
        ) : item.favicon_url ? (
          <img
            src={item.favicon_url}
            alt=""
            className="w-4 h-4 shrink-0"
            onError={(e) => {
              e.currentTarget.style.display = "none"
            }}
          />
        ) : (
          <FileText className="w-4 h-4 text-app-muted shrink-0" />
        )}

        {/* Title */}
        {item.type === "bookmark" && item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 truncate text-app-foreground hover:text-primary-vivid hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {item.title || item.url}
          </a>
        ) : (
          <span className="flex-1 truncate text-app-foreground">
            {item.title}
          </span>
        )}

        {/* External link icon for bookmarks */}
        {item.type === "bookmark" && item.url && (
          <ExternalLink className="w-3 h-3 text-app-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        )}
      </div>

      {/* Recursively render children */}
      {hasChildren && isExpanded && (
        <div role="group">
          {item.children.map((child) => (
            <TreeItem key={child.id} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
