import { Context, Effect, Layer } from "effect";
import type { D1Database, D1Result } from "@cloudflare/workers-types";
import { DatabaseError } from "../errors";

/**
 * D1 Database service interface
 */
export interface D1Service {
  readonly db: D1Database;

  /**
   * Execute a query and return all results
   */
  readonly query: <T>(
    sql: string,
    ...params: unknown[]
  ) => Effect.Effect<D1Result<T>, DatabaseError>;

  /**
   * Execute a query and return the first result
   */
  readonly queryFirst: <T>(
    sql: string,
    ...params: unknown[]
  ) => Effect.Effect<T | null, DatabaseError>;

  /**
   * Execute a mutation (INSERT, UPDATE, DELETE)
   */
  readonly execute: (
    sql: string,
    ...params: unknown[]
  ) => Effect.Effect<D1Result<unknown>, DatabaseError>;

  /**
   * Execute multiple statements in a batch
   */
  readonly batch: <T>(
    statements: Array<{ sql: string; params?: unknown[] }>
  ) => Effect.Effect<D1Result<T>[], DatabaseError>;
}

/**
 * D1 Service Tag for dependency injection
 */
export class D1 extends Context.Tag("D1")<D1, D1Service>() {}

/**
 * Create a D1 service layer from a database instance
 */
export const makeD1Service = (db: D1Database): D1Service => ({
  db,

  query: <T>(sql: string, ...params: unknown[]) =>
    Effect.tryPromise({
      try: () => db.prepare(sql).bind(...params).all<T>(),
      catch: (cause) =>
        new DatabaseError({
          message: `Query failed: ${sql}`,
          cause,
        }),
    }),

  queryFirst: <T>(sql: string, ...params: unknown[]) =>
    Effect.tryPromise({
      try: () => db.prepare(sql).bind(...params).first<T>(),
      catch: (cause) =>
        new DatabaseError({
          message: `Query failed: ${sql}`,
          cause,
        }),
    }),

  execute: (sql: string, ...params: unknown[]) =>
    Effect.tryPromise({
      try: () => db.prepare(sql).bind(...params).run(),
      catch: (cause) =>
        new DatabaseError({
          message: `Execute failed: ${sql}`,
          cause,
        }),
    }),

  batch: <T>(statements: Array<{ sql: string; params?: unknown[] }>) =>
    Effect.tryPromise({
      try: () =>
        db.batch(
          statements.map((s) =>
            s.params ? db.prepare(s.sql).bind(...s.params) : db.prepare(s.sql)
          )
        ) as Promise<D1Result<T>[]>,
      catch: (cause) =>
        new DatabaseError({
          message: "Batch execution failed",
          cause,
        }),
    }),
});

/**
 * Create a Layer for the D1 service
 */
export const makeD1Layer = (db: D1Database): Layer.Layer<D1> =>
  Layer.succeed(D1, makeD1Service(db));
