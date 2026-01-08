import { Context, Effect, Layer } from "effect";
import { D1 } from "./db";
import { DatabaseError } from "../errors";
import type {
  Bookmark,
  Folder,
  BookmarkSyncData,
  FolderSyncData,
  BookmarksResponse,
} from "../bookmark-types";

/**
 * Bookmark service interface
 */
export interface BookmarkService {
  /**
   * Get all bookmarks and folders
   */
  readonly getAll: () => Effect.Effect<BookmarksResponse, DatabaseError>;

  /**
   * Create or update a bookmark
   */
  readonly upsertBookmark: (
    data: BookmarkSyncData
  ) => Effect.Effect<void, DatabaseError>;

  /**
   * Create or update a folder
   */
  readonly upsertFolder: (
    data: FolderSyncData
  ) => Effect.Effect<void, DatabaseError>;

  /**
   * Remove a bookmark by chrome_id
   */
  readonly removeBookmark: (
    chromeId: string
  ) => Effect.Effect<void, DatabaseError>;

  /**
   * Remove a folder by chrome_id (cascades to children)
   */
  readonly removeFolder: (
    chromeId: string
  ) => Effect.Effect<void, DatabaseError>;

  /**
   * Sync all bookmarks (replaces existing data)
   */
  readonly syncAll: (data: {
    folders: FolderSyncData[];
    bookmarks: BookmarkSyncData[];
  }) => Effect.Effect<{ folders: number; bookmarks: number }, DatabaseError>;

  /**
   * Update bookmark position and parent after move
   */
  readonly moveBookmark: (
    chromeId: string,
    newParentId: string | null,
    newPath: string,
    newPosition: number
  ) => Effect.Effect<void, DatabaseError>;

  /**
   * Update folder position and parent after move
   */
  readonly moveFolder: (
    chromeId: string,
    newParentId: string | null,
    newPath: string,
    newPosition: number
  ) => Effect.Effect<void, DatabaseError>;
}

/**
 * Bookmark Service Tag for dependency injection
 */
export class Bookmarks extends Context.Tag("Bookmarks")<
  Bookmarks,
  BookmarkService
>() {}

/**
 * Generate a unique ID
 */
const generateId = () => crypto.randomUUID();

/**
 * Create the Bookmark service implementation
 */
const makeBookmarkService = Effect.gen(function* () {
  const d1 = yield* D1;

  const getAll = (): Effect.Effect<BookmarksResponse, DatabaseError> =>
    Effect.gen(function* () {
      const [foldersResult, bookmarksResult] = yield* Effect.all([
        d1.query<Folder>("SELECT * FROM folders ORDER BY path, position"),
        d1.query<Bookmark>("SELECT * FROM bookmarks ORDER BY path, position"),
      ]);

      return {
        folders: foldersResult.results,
        bookmarks: bookmarksResult.results,
      };
    });

  const upsertBookmark = (
    data: BookmarkSyncData
  ): Effect.Effect<void, DatabaseError> =>
    Effect.gen(function* () {
      // Check if bookmark exists
      const existing = yield* d1.queryFirst<Bookmark>(
        "SELECT id, folder_id FROM bookmarks WHERE chrome_id = ?",
        data.chrome_id
      );

      // Get folder_id from parent chrome_id
      let folderId: string | null = null;
      if (data.parent_id) {
        const folder = yield* d1.queryFirst<Folder>(
          "SELECT id FROM folders WHERE chrome_id = ?",
          data.parent_id
        );
        folderId = folder?.id ?? null;
      }

      const now = Date.now();

      if (existing) {
        // Update existing bookmark
        yield* d1.execute(
          `UPDATE bookmarks SET
            folder_id = ?, title = ?, url = ?, path = ?,
            date_modified = ?, position = ?, updated_at = ?
          WHERE chrome_id = ?`,
          folderId,
          data.title,
          data.url,
          data.path,
          data.date_modified ?? now,
          data.position,
          now,
          data.chrome_id
        );
      } else {
        // Insert new bookmark
        yield* d1.execute(
          `INSERT INTO bookmarks
            (id, chrome_id, folder_id, title, url, path, date_added, date_modified, position, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          generateId(),
          data.chrome_id,
          folderId,
          data.title,
          data.url,
          data.path,
          data.date_added,
          data.date_modified,
          data.position,
          now,
          now
        );
      }
    });

  const upsertFolder = (
    data: FolderSyncData
  ): Effect.Effect<void, DatabaseError> =>
    Effect.gen(function* () {
      // Check if folder exists
      const existing = yield* d1.queryFirst<Folder>(
        "SELECT id, parent_id FROM folders WHERE chrome_id = ?",
        data.chrome_id
      );

      // Get parent_id from parent chrome_id
      let parentId: string | null = null;
      if (data.parent_id) {
        const parent = yield* d1.queryFirst<Folder>(
          "SELECT id FROM folders WHERE chrome_id = ?",
          data.parent_id
        );
        parentId = parent?.id ?? null;
      }

      const now = Date.now();

      if (existing) {
        // Update existing folder
        yield* d1.execute(
          `UPDATE folders SET
            parent_id = ?, title = ?, path = ?,
            date_modified = ?, position = ?, updated_at = ?
          WHERE chrome_id = ?`,
          parentId,
          data.title,
          data.path,
          data.date_modified ?? now,
          data.position,
          now,
          data.chrome_id
        );
      } else {
        // Insert new folder
        const id = generateId();
        yield* d1.execute(
          `INSERT INTO folders
            (id, chrome_id, parent_id, title, path, date_added, date_modified, position, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          id,
          data.chrome_id,
          parentId,
          data.title,
          data.path,
          data.date_added,
          data.date_modified,
          data.position,
          now,
          now
        );
      }
    });

  const removeBookmark = (
    chromeId: string
  ): Effect.Effect<void, DatabaseError> =>
    Effect.gen(function* () {
      yield* d1.execute("DELETE FROM bookmarks WHERE chrome_id = ?", chromeId);
    });

  const removeFolder = (chromeId: string): Effect.Effect<void, DatabaseError> =>
    Effect.gen(function* () {
      // Get the folder id first
      const folder = yield* d1.queryFirst<Folder>(
        "SELECT id FROM folders WHERE chrome_id = ?",
        chromeId
      );

      if (folder) {
        // Delete bookmarks in this folder
        yield* d1.execute(
          "DELETE FROM bookmarks WHERE folder_id = ?",
          folder.id
        );
        // Delete the folder (child folders cascade)
        yield* d1.execute("DELETE FROM folders WHERE id = ?", folder.id);
      }
    });

  const syncAll = (data: {
    folders: FolderSyncData[];
    bookmarks: BookmarkSyncData[];
  }): Effect.Effect<{ folders: number; bookmarks: number }, DatabaseError> =>
    Effect.gen(function* () {
      // Clear existing data
      yield* d1.execute("DELETE FROM bookmarks");
      yield* d1.execute("DELETE FROM folders");

      // Create a map of chrome_id -> generated id for folders
      const folderIdMap = new Map<string, string>();
      const now = Date.now();

      // Insert folders first (need to handle hierarchy)
      // Sort folders by path length to ensure parents are created first
      const sortedFolders = [...data.folders].sort(
        (a, b) => a.path.split("/").length - b.path.split("/").length
      );

      for (const folder of sortedFolders) {
        const id = generateId();
        folderIdMap.set(folder.chrome_id, id);

        // Get parent_id from our map
        let parentId: string | null = null;
        if (folder.parent_id && folderIdMap.has(folder.parent_id)) {
          parentId = folderIdMap.get(folder.parent_id)!;
        }

        yield* d1.execute(
          `INSERT INTO folders
            (id, chrome_id, parent_id, title, path, date_added, date_modified, position, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          id,
          folder.chrome_id,
          parentId,
          folder.title,
          folder.path,
          folder.date_added ?? now,
          folder.date_modified ?? null,
          folder.position ?? 0,
          now,
          now
        );
      }

      // Insert bookmarks
      for (const bookmark of data.bookmarks) {
        const folderId = bookmark.parent_id
          ? folderIdMap.get(bookmark.parent_id) ?? null
          : null;

        yield* d1.execute(
          `INSERT INTO bookmarks
            (id, chrome_id, folder_id, title, url, path, date_added, date_modified, position, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          generateId(),
          bookmark.chrome_id,
          folderId,
          bookmark.title,
          bookmark.url,
          bookmark.path,
          bookmark.date_added ?? now,
          bookmark.date_modified ?? null,
          bookmark.position ?? 0,
          now,
          now
        );
      }

      return {
        folders: data.folders.length,
        bookmarks: data.bookmarks.length,
      };
    });

  const moveBookmark = (
    chromeId: string,
    newParentId: string | null,
    newPath: string,
    newPosition: number
  ): Effect.Effect<void, DatabaseError> =>
    Effect.gen(function* () {
      // Get folder_id from parent chrome_id
      let folderId: string | null = null;
      if (newParentId) {
        const folder = yield* d1.queryFirst<Folder>(
          "SELECT id FROM folders WHERE chrome_id = ?",
          newParentId
        );
        folderId = folder?.id ?? null;
      }

      yield* d1.execute(
        `UPDATE bookmarks SET folder_id = ?, path = ?, position = ?, updated_at = ? WHERE chrome_id = ?`,
        folderId,
        newPath,
        newPosition,
        Date.now(),
        chromeId
      );
    });

  const moveFolder = (
    chromeId: string,
    newParentId: string | null,
    newPath: string,
    newPosition: number
  ): Effect.Effect<void, DatabaseError> =>
    Effect.gen(function* () {
      // Get parent_id from parent chrome_id
      let parentId: string | null = null;
      if (newParentId) {
        const parent = yield* d1.queryFirst<Folder>(
          "SELECT id FROM folders WHERE chrome_id = ?",
          newParentId
        );
        parentId = parent?.id ?? null;
      }

      yield* d1.execute(
        `UPDATE folders SET parent_id = ?, path = ?, position = ?, updated_at = ? WHERE chrome_id = ?`,
        parentId,
        newPath,
        newPosition,
        Date.now(),
        chromeId
      );
    });

  return {
    getAll,
    upsertBookmark,
    upsertFolder,
    removeBookmark,
    removeFolder,
    syncAll,
    moveBookmark,
    moveFolder,
  } satisfies BookmarkService;
});

/**
 * Bookmark service layer (depends on D1)
 */
export const BookmarksLive: Layer.Layer<Bookmarks, never, D1> = Layer.effect(
  Bookmarks,
  makeBookmarkService
);
