import { Context, Effect, Layer } from "effect";
import { D1 } from "./db";
import { UnauthorizedError, DatabaseError } from "../errors";
import type { ApiKey } from "../bookmark-types";

/**
 * Auth service interface
 */
export interface AuthService {
  /**
   * Validate an API key and update last_used_at
   */
  readonly validateApiKey: (
    apiKey: string | null
  ) => Effect.Effect<ApiKey, UnauthorizedError | DatabaseError>;

  /**
   * Hash an API key using SHA-256
   */
  readonly hashApiKey: (apiKey: string) => Effect.Effect<string, never>;

  /**
   * Generate a new API key (returns unhashed key and hash)
   */
  readonly generateApiKey: () => Effect.Effect<
    { key: string; hash: string },
    never
  >;
}

/**
 * Auth Service Tag for dependency injection
 */
export class Auth extends Context.Tag("Auth")<Auth, AuthService>() {}

/**
 * Hash a string using SHA-256
 */
const sha256Hash = (input: string): Effect.Effect<string, never> =>
  Effect.promise(async () => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  });

/**
 * Create the Auth service implementation
 */
const makeAuthService = Effect.gen(function* () {
  const d1 = yield* D1;

  const hashApiKey = (apiKey: string) => sha256Hash(apiKey);

  const generateApiKey = () =>
    Effect.gen(function* () {
      const key = `${crypto.randomUUID()}-${crypto.randomUUID()}`;
      const hash = yield* sha256Hash(key);
      return { key, hash };
    });

  const validateApiKey = (
    apiKey: string | null
  ): Effect.Effect<ApiKey, UnauthorizedError | DatabaseError> =>
    Effect.gen(function* () {
      if (!apiKey) {
        return yield* Effect.fail(
          new UnauthorizedError({ message: "API key required" })
        );
      }

      const keyHash = yield* sha256Hash(apiKey);

      const result = yield* d1.queryFirst<ApiKey>(
        "SELECT * FROM api_keys WHERE key_hash = ?",
        keyHash
      );

      if (!result) {
        return yield* Effect.fail(
          new UnauthorizedError({ message: "Invalid API key" })
        );
      }

      // Update last_used_at
      yield* d1.execute(
        "UPDATE api_keys SET last_used_at = ? WHERE id = ?",
        Date.now(),
        result.id
      );

      return result;
    });

  return {
    validateApiKey,
    hashApiKey,
    generateApiKey,
  } satisfies AuthService;
});

/**
 * Auth service layer (depends on D1)
 */
export const AuthLive: Layer.Layer<Auth, never, D1> = Layer.effect(
  Auth,
  makeAuthService
);
