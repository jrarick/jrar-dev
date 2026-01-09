import type { Route } from "./+types/well-known"

export function loader({}: Route.LoaderArgs) {
  return new Response(null, { status: 404 })
}
