import { Effect, Layer } from "effect";
import type { Route } from "./+types/index";
import { D1, makeD1Layer } from "~/lib/services/db";
import { Bookmarks, BookmarksLive } from "~/lib/services/bookmarks";
import { DatabaseError } from "~/lib/errors";

/**
 * GET /api/bookmarks
 * Returns all folders and bookmarks for frontend display
 * Public endpoint - no authentication required
 */
export async function loader({ context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.jrar_dev_db;

  const program = Effect.gen(function* () {
    const bookmarks = yield* Bookmarks;
    return yield* bookmarks.getAll();
  });

  // Build the layer stack
  const D1Live = makeD1Layer(db);
  const MainLayer = Layer.merge(D1Live, BookmarksLive.pipe(Layer.provide(D1Live)));

  const result = await program.pipe(
    Effect.provide(MainLayer),
    Effect.match({
      onFailure: (error) => {
        if (error instanceof DatabaseError) {
          return Response.json(
            { error: "Database error", message: error.message },
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
