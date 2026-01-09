import type { Route } from "./+types/tools"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tools" },
    { name: "description", content: "Tools and Utilities" },
  ]
}

export default function Tools() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-primary-vivid mb-4">Tools</h1>
      <p className="text-app-muted">Coming soon...</p>
    </div>
  )
}
