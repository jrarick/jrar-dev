import { Effect, Layer } from "effect";
import type { Route } from "./+types/bookmarks";
import { BookmarkTree } from "~/components/bookmark-tree";
import { D1, makeD1Layer } from "~/lib/services/db";
import { Bookmarks, BookmarksLive } from "~/lib/services/bookmarks";
import type { Folder, Bookmark, TreeNode } from "~/lib/bookmark-types";

export function meta() {
  return [
    { title: "Bookmarks // JRAR" },
    { name: "description", content: "Chrome bookmarks synced from my browser" },
  ];
}

/**
 * Build tree structure from flat folders and bookmarks
 */
function buildTree(folders: Folder[], bookmarks: Bookmark[]): TreeNode[] {
  // Create lookup maps
  const folderMap = new Map<string, TreeNode>();
  const rootNodes: TreeNode[] = [];

  // Initialize all folders as tree nodes
  for (const folder of folders) {
    folderMap.set(folder.id, {
      id: folder.id,
      title: folder.title,
      type: "folder",
      date_added: folder.date_added,
      children: [],
    });
  }

  // Build folder hierarchy
  for (const folder of folders) {
    const node = folderMap.get(folder.id)!;
    if (folder.parent_id && folderMap.has(folder.parent_id)) {
      folderMap.get(folder.parent_id)!.children.push(node);
    } else {
      rootNodes.push(node);
    }
  }

  // Add bookmarks to their folders
  for (const bookmark of bookmarks) {
    const bookmarkNode: TreeNode = {
      id: bookmark.id,
      title: bookmark.title,
      type: "bookmark",
      url: bookmark.url,
      favicon_url: bookmark.favicon_url ?? undefined,
      date_added: bookmark.date_added,
      children: [],
    };

    if (bookmark.folder_id && folderMap.has(bookmark.folder_id)) {
      folderMap.get(bookmark.folder_id)!.children.push(bookmarkNode);
    } else {
      rootNodes.push(bookmarkNode);
    }
  }

  return rootNodes;
}

export async function loader({ context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.jrar_dev_db;

  const program = Effect.gen(function* () {
    const bookmarks = yield* Bookmarks;
    return yield* bookmarks.getAll();
  });

  // Build the layer stack
  const D1Live = makeD1Layer(db);
  const MainLayer = Layer.merge(
    D1Live,
    BookmarksLive.pipe(Layer.provide(D1Live))
  );

  const result = await program.pipe(
    Effect.provide(MainLayer),
    Effect.match({
      onFailure: () => ({ folders: [], bookmarks: [] }),
      onSuccess: (data) => data,
    }),
    Effect.runPromise
  );

  // Build tree structure
  const tree = buildTree(result.folders, result.bookmarks);

  return {
    tree,
    stats: {
      folders: result.folders.length,
      bookmarks: result.bookmarks.length,
    },
  };
}

export default function BookmarksPage({ loaderData }: Route.ComponentProps) {
  const { tree, stats } = loaderData;

  return (
    <main className="min-h-screen bg-app-background py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="mb-12">
          <h1 className="text-3xl font-mono font-bold text-matrix-vivid uppercase tracking-widest">
            Bookmarks_
          </h1>
          <p className="font-mono text-app-muted text-sm mt-2">
            {stats.folders} folders // {stats.bookmarks} bookmarks
          </p>
        </header>

        {tree.length > 0 ? (
          <section className="border border-matrix-background">
            <BookmarkTree items={tree} />
          </section>
        ) : (
          <section className="border border-matrix-background p-8 text-center">
            <p className="font-mono text-app-muted">
              No bookmarks synced yet. Use the Chrome extension to sync your
              bookmarks.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
