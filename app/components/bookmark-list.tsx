import { ExternalLink, FileText } from "lucide-react";
import type { Bookmark } from "~/lib/bookmark-types";

interface BookmarkListProps {
  bookmarks: Bookmark[];
  highlightText?: string;
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
  );
}

interface BookmarkItemProps {
  bookmark: Bookmark;
  highlightText?: string;
}

function BookmarkItem({ bookmark, highlightText }: BookmarkItemProps) {
  return (
    <a
      href={bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 py-2.5 px-4 text-sm hover:bg-primary-background/50 hover:text-primary-vivid border-b border-primary-background/50 last:border-b-0"
    >
      {bookmark.favicon_url ? (
        <img
          src={bookmark.favicon_url}
          alt=""
          className="w-4 h-4 shrink-0"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <FileText className="w-4 h-4 text-app-muted shrink-0" />
      )}

      <span className="flex-1 truncate text-app-accent group-hover:text-primary-vivid">
        <HighlightedText text={bookmark.title || bookmark.url} highlight={highlightText} />
      </span>

      <ExternalLink className="w-3 h-3 text-app-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </a>
  );
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

interface HighlightedTextProps {
  text: string;
  highlight?: string;
}

function HighlightedText({ text, highlight }: HighlightedTextProps) {
  if (!highlight || highlight.trim() === "") {
    return <>{text}</>;
  }

  const parts = text.split(new RegExp(`(${escapeRegex(highlight)})`, "gi"));

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
  );
}
