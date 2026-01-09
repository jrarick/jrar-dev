# CLAUDE.md

## Project Overview

Personal website/portfolio built with React Router 7 on Cloudflare Workers.

## Tech Stack

- **Framework**: React Router 7 (framework mode for routing)
- **Runtime**: Cloudflare Workers
- **Database**: Cloudflare D1 (binding: `jrar_dev_db`)
- **Styling**: TailwindCSS 4 with custom neon terminal theme (there is no js tailwind config file in version 4)
- **UI Components**: React Aria Components
- **Backend Logic**: Effect framework for typed errors, services, and async operations

## Project Structure

```
app/
  routes.ts           # Route definitions (React Router framework mode)
  routes/             # Page and API routes
  components/         # Reusable UI components
  lib/                # Utilities and services
    services/         # Effect service layers
workers/
  app.ts              # Cloudflare Workers entry point
```

## Conventions

### Routing (React Router 7 Framework Mode)

Routes are defined in `app/routes.ts` using the declarative API:

```typescript
import { index, route, prefix } from "@react-router/dev/routes"

export default [
  index("routes/home.tsx"),
  route("bookmarks", "routes/bookmarks.tsx"),
  ...prefix("api", [route("bookmarks", "routes/api/bookmarks/index.ts")]),
] satisfies RouteConfig
```

### Effect Framework

Use Effect for all backend/service layer code:

- **Typed Errors**: Define error classes with `Data.TaggedError`
- **Services**: Use `Context.Tag` for dependency injection
- **Database Operations**: Wrap D1 calls with `Effect.tryPromise`
- **Composition**: Use `Effect.gen` for sequential async operations

Example pattern:

```typescript
import { Effect, Data } from "effect"

// Define typed errors
class DatabaseError extends Data.TaggedError("DatabaseError")<{
  cause: unknown
}> {}

// Database operation with Effect
const getBookmarks = Effect.tryPromise({
  try: () => db.prepare("SELECT * FROM bookmarks").all(),
  catch: (cause) => new DatabaseError({ cause }),
})
```

### D1 Database

- Database binding available via `context.cloudflare.env.jrar_dev_db`
- Use parameterized queries to prevent SQL injection
- Schema migrations in `schema.sql`

### Styling

- Neon terminal theme with matrix green (`--color-primary-*`) and ruby red (`--color-ruby-*`)
- Use `tv()` from tailwind-variants for component styles
- `focusRing` utility from `app/lib/utils.tsx` for accessibility

## Commands

```bash
# Development
pnpm dev

# Build
pnpm build

# Deploy
pnpm deploy

# D1 Database
npx wrangler d1 execute jrar-dev-db --remote --file=schema.sql
```
