import { useState, useMemo } from "react"
import { Effect, Layer } from "effect"
import type { Route } from "./+types/bookmarks"
import { makeD1Layer } from "~/lib/services/db"
import { Bookmarks, BookmarksLive } from "~/lib/services/bookmarks"
import { TagGroup, Tag } from "~/components/tag-group"
import { SearchField } from "~/components/search-field"
import { BookmarkList } from "~/components/bookmark-list"
import type { Selection } from "react-aria-components"

export function meta() {
  return [
    { title: "Bookmarks // JRAR" },
    { name: "description", content: "Bookmarks I find interesting" },
  ]
}

export async function loader({ context }: Route.LoaderArgs) {
  try {
    const db = context.cloudflare.env.jrar_dev_db

    if (!db) {
      console.error("[Bookmarks] D1 database binding is undefined!")
      return { categories: [], bookmarks: [] }
    }

    const program = Effect.gen(function* () {
      const bookmarks = yield* Bookmarks
      return yield* bookmarks.getBookmarksBar()
    })

    const D1Live = makeD1Layer(db)
    const MainLayer = Layer.merge(
      D1Live,
      BookmarksLive.pipe(Layer.provide(D1Live))
    )

    const result = await program.pipe(
      Effect.provide(MainLayer),
      Effect.tapError((error) =>
        Effect.sync(() => console.error("[Bookmarks] Effect error:", error))
      ),
      Effect.match({
        onFailure: () => ({ categories: [], bookmarks: [] }),
        onSuccess: (data) => data,
      }),
      Effect.runPromise
    )

    return result
  } catch (error) {
    console.error("[Bookmarks] Loader exception:", error)
    return { categories: [], bookmarks: [] }
  }
}

export default function BookmarksPage({ loaderData }: Route.ComponentProps) {
  const { categories, bookmarks } = loaderData
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredBookmarks = useMemo(() => {
    return bookmarks
      .filter((b) => !selectedCategory || b.folder_id === selectedCategory)
      .filter(
        (b) =>
          !searchQuery ||
          b.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
  }, [bookmarks, selectedCategory, searchQuery])

  const handleSelectionChange = (selection: Selection) => {
    if (selection === "all") {
      setSelectedCategory(null)
    } else {
      const selected = Array.from(selection)[0] as string | undefined
      setSelectedCategory(selected ?? null)
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    if (value) {
      setSelectedCategory(null)
    }
  }

  return (
    <main className="min-h-screen bg-app-background py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-mono font-bold text-primary-vivid uppercase tracking-widest">
            Bookmarks_
          </h1>
          <p className="font-mono text-app-muted text-sm mt-2">
            {bookmarks.length} bookmarks
          </p>
        </header>

        <div className="space-y-6">
          <SearchField
            aria-label="Search bookmarks"
            placeholder="SEARCH_BOOKMARKS"
            value={searchQuery}
            onChange={handleSearchChange}
          />

          {categories.length > 0 && (
            <TagGroup
              aria-label="Filter by category"
              selectionMode="single"
              selectedKeys={selectedCategory ? [selectedCategory] : []}
              onSelectionChange={handleSelectionChange}
            >
              {categories.map((category) => (
                <Tag key={category.id} id={category.id}>
                  {category.title}
                </Tag>
              ))}
            </TagGroup>
          )}

          {filteredBookmarks.length > 0 ? (
            <BookmarkList
              bookmarks={filteredBookmarks}
              highlightText={searchQuery}
            />
          ) : (
            <section className="border border-primary-background p-8 text-center">
              <p className="font-mono text-app-muted">
                {bookmarks.length === 0
                  ? "No bookmarks available. Something went wrong."
                  : "No bookmarks match your search."}
              </p>
            </section>
          )}
        </div>
      </div>
    </main>
  )
}
