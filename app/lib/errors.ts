import { Data } from "effect";

/**
 * Database operation errors
 */
export class DatabaseError extends Data.TaggedError("DatabaseError")<{
  message: string;
  cause?: unknown;
}> {}

/**
 * API authentication errors
 */
export class UnauthorizedError extends Data.TaggedError("UnauthorizedError")<{
  message: string;
}> {}

/**
 * Request validation errors
 */
export class ValidationError extends Data.TaggedError("ValidationError")<{
  message: string;
  field?: string;
}> {}

/**
 * Resource not found errors
 */
export class NotFoundError extends Data.TaggedError("NotFoundError")<{
  message: string;
  resource: string;
}> {}
