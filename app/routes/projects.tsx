import type { Route } from "./+types/projects"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Projects" },
    { name: "description", content: "My Projects" },
  ]
}

export default function Projects() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-primary-vivid mb-4">Projects</h1>
      <p className="text-app-muted">Coming soon...</p>
    </div>
  )
}
