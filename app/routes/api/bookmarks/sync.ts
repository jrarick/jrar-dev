import { Effect, Layer } from "effect";
import type { Route } from "./+types/sync";
import { D1, makeD1Layer } from "~/lib/services/db";
import { Auth, AuthLive } from "~/lib/services/auth";
import { Bookmarks, BookmarksLive } from "~/lib/services/bookmarks";
import {
  DatabaseError,
  UnauthorizedError,
  ValidationError,
} from "~/lib/errors";
import type {
  SyncPayload,
  SyncResponse,
  BookmarkSyncData,
} from "~/lib/bookmark-types";
import { isValidBookmarkUrl } from "~/lib/security-utils";

/**
 * POST /api/bookmarks/sync
 * Handles bookmark sync events from Chrome extension
 * Requires API key authentication via Authorization header
 */
export async function action({ request, context }: Route.ActionArgs) {
  const db = context.cloudflare.env.jrar_dev_db;

  // Extract API key from Authorization header
  const authHeader = request.headers.get("Authorization");
  const apiKey = authHeader?.replace("Bearer ", "") ?? null;

  // Parse request body
  let payload: SyncPayload;
  try {
    payload = await request.json();
  } catch {
    return Response.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const program = Effect.gen(function* () {
    const auth = yield* Auth;
    const bookmarks = yield* Bookmarks;

    // Validate API key
    yield* auth.validateApiKey(apiKey);

    // Handle different sync actions
    switch (payload.action) {
      case "create": {
        if (!payload.bookmark) {
          return yield* Effect.fail(
            new ValidationError({ message: "Bookmark data required", field: "bookmark" })
          );
        }

        if (payload.bookmark.is_folder) {
          yield* bookmarks.upsertFolder({
            chrome_id: payload.bookmark.chrome_id,
            parent_id: payload.bookmark.parent_id,
            title: payload.bookmark.title,
            path: payload.bookmark.path,
            date_added: payload.bookmark.date_added,
            date_modified: payload.bookmark.date_modified,
            position: payload.bookmark.position,
          });
        } else {
          if (!isValidBookmarkUrl(payload.bookmark.url)) {
            return yield* Effect.fail(
              new ValidationError({
                message: "Invalid bookmark URL protocol",
                field: "bookmark.url",
              })
            );
          }
          yield* bookmarks.upsertBookmark(payload.bookmark);
        }

        return { success: true, message: "Bookmark created" } satisfies SyncResponse;
      }

      case "remove": {
        if (!payload.bookmark) {
          return yield* Effect.fail(
            new ValidationError({ message: "Bookmark data required", field: "bookmark" })
          );
        }

        // Try removing as both bookmark and folder (Chrome doesn't tell us which)
        yield* bookmarks.removeBookmark(payload.bookmark.chrome_id);
        yield* bookmarks.removeFolder(payload.bookmark.chrome_id);

        return { success: true, message: "Bookmark removed" } satisfies SyncResponse;
      }

      case "change": {
        if (!payload.bookmark) {
          return yield* Effect.fail(
            new ValidationError({ message: "Bookmark data required", field: "bookmark" })
          );
        }

        if (payload.bookmark.is_folder) {
          yield* bookmarks.upsertFolder({
            chrome_id: payload.bookmark.chrome_id,
            parent_id: payload.bookmark.parent_id,
            title: payload.bookmark.title,
            path: payload.bookmark.path,
            date_added: payload.bookmark.date_added,
            date_modified: payload.bookmark.date_modified,
            position: payload.bookmark.position,
          });
        } else {
          if (!isValidBookmarkUrl(payload.bookmark.url)) {
            return yield* Effect.fail(
              new ValidationError({
                message: "Invalid bookmark URL protocol",
                field: "bookmark.url",
              })
            );
          }
          yield* bookmarks.upsertBookmark(payload.bookmark);
        }

        return { success: true, message: "Bookmark updated" } satisfies SyncResponse;
      }

      case "move": {
        if (!payload.bookmark) {
          return yield* Effect.fail(
            new ValidationError({ message: "Bookmark data required", field: "bookmark" })
          );
        }

        if (payload.bookmark.is_folder) {
          yield* bookmarks.moveFolder(
            payload.bookmark.chrome_id,
            payload.bookmark.parent_id,
            payload.bookmark.path,
            payload.bookmark.position
          );
        } else {
          yield* bookmarks.moveBookmark(
            payload.bookmark.chrome_id,
            payload.bookmark.parent_id,
            payload.bookmark.path,
            payload.bookmark.position
          );
        }

        return { success: true, message: "Bookmark moved" } satisfies SyncResponse;
      }

      case "sync_all": {
        if (!payload.folders || !payload.bookmarks) {
          return yield* Effect.fail(
            new ValidationError({
              message: "Folders and bookmarks arrays required",
              field: "folders,bookmarks",
            })
          );
        }

        // Filter out items that are folders or have no URL
        const bookmarkItems = payload.bookmarks.filter(
          (b): b is BookmarkSyncData => !b.is_folder && isValidBookmarkUrl(b.url)
        );

        const stats = yield* bookmarks.syncAll({
          folders: payload.folders,
          bookmarks: bookmarkItems,
        });

        return {
          success: true,
          message: "Full sync completed",
          stats,
        } satisfies SyncResponse;
      }

      default:
        return yield* Effect.fail(
          new ValidationError({ message: `Invalid action: ${payload.action}` })
        );
    }
  });

  // Build the layer stack
  const D1Live = makeD1Layer(db);
  const AuthLayer = AuthLive.pipe(Layer.provide(D1Live));
  const BookmarksLayer = BookmarksLive.pipe(Layer.provide(D1Live));
  const MainLayer = Layer.mergeAll(D1Live, AuthLayer, BookmarksLayer);

  const result = await program.pipe(
    Effect.provide(MainLayer),
    Effect.match({
      onFailure: (error) => {
        if (error instanceof UnauthorizedError) {
          return Response.json(
            { error: "Unauthorized", message: error.message },
            { status: 401 }
          );
        }
        if (error instanceof ValidationError) {
          return Response.json(
            { error: "Validation error", message: error.message, field: error.field },
            { status: 400 }
          );
        }
        if (error instanceof DatabaseError) {
          return Response.json(
            { error: "Database error", message: error.message, cause: String(error.cause) },
            { status: 500 }
          );
        }
        return Response.json({ error: "Unknown error" }, { status: 500 });
      },
      onSuccess: (data) => Response.json(data),
    }),
    Effect.runPromise
  );

  return result;
}
