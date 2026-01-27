import type { Route } from "./+types/index"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Utilities | jrar.dev" },
    { name: "description", content: "Developer utilities and tools" },
  ]
}

export default function UtilitiesIndex() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl font-mono">Utilities</h1>
      <p className="text-primary-vivid">Developer utilities and tools</p>
    </div>
  )
}
