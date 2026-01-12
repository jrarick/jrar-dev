import { FileText } from "lucide-react"
import type { Bookmark } from "~/lib/bookmark-types"

function getFaviconUrl(url: string): string | null {
  try {
    const domain = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
  } catch {
    return null
  }
}

interface BookmarkListProps {
  bookmarks: Bookmark[]
  highlightText?: string
}

export function BookmarkList({ bookmarks, highlightText }: BookmarkListProps) {
  return (
    <div className="font-mono bg-app-background border border-primary-background">
      {bookmarks.map((bookmark) => (
        <BookmarkItem
          key={bookmark.id}
          bookmark={bookmark}
          highlightText={highlightText}
        />
      ))}
    </div>
  )
}

interface BookmarkItemProps {
  bookmark: Bookmark
  highlightText?: string
}

function BookmarkItem({ bookmark, highlightText }: BookmarkItemProps) {
  const faviconUrl = getFaviconUrl(bookmark.url)

  return (
    <a
      href={bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 py-2.5 px-4 text-sm hover:bg-primary-background/50 hover:text-primary-vivid border-b border-primary-background/50 last:border-b-0   focus-visible:outline-2 focus-visible:outline-primary-vivid focus-visible:outline-offset-2"
    >
      {faviconUrl ? (
        <img
          src={faviconUrl}
          alt=""
          className="w-4 h-4 shrink-0"
          onError={(e) => {
            e.currentTarget.style.display = "none"
          }}
        />
      ) : (
        <FileText className="w-4 h-4 text-app-muted shrink-0" />
      )}

      <div className="flex-1 min-w-0">
        <span className="block truncate text-app-accent group-hover:text-primary-vivid">
          <HighlightedText
            text={bookmark.title || bookmark.url}
            highlight={highlightText}
          />
        </span>
        <div className="flex items-center gap-2 text-xs text-app-muted group-hover:text-primary-muted justify-between">
          <span className="truncate">{bookmark.url}</span>
          <span className="shrink-0 tabular-nums">
            {new Date(bookmark.date_added).toISOString()}
          </span>
        </div>
      </div>
    </a>
  )
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

interface HighlightedTextProps {
  text: string
  highlight?: string
}

function HighlightedText({ text, highlight }: HighlightedTextProps) {
  if (!highlight || highlight.trim() === "") {
    return <>{text}</>
  }

  const parts = text.split(new RegExp(`(${escapeRegex(highlight)})`, "gi"))

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark
            key={i}
            className="bg-primary-muted/30 text-primary-vivid rounded-none"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  )
}
