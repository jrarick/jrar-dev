import { PageLayout, PageHeader } from "~/components/page-layout"
import { registry } from "~/registry"
import { ComponentShowcase } from "~/components/page-sections/component-showcase"
import { Link } from "~/components/link"
import type { Route } from "./+types/slug"

export function loader({ params }: Route.LoaderArgs) {
  if (!registry[params.slug]) {
    throw new Response("Not Found", { status: 404 })
  }
  return null
}

export function meta({ params }: Route.MetaArgs) {
  const component = registry[params.slug]
  if (!component) return [{ title: "Component Not Found" }]

  return [
    { title: `${component.name} - Components` },
    { name: "description", content: component.description },
  ]
}

export default function ComponentDetail({ params }: Route.ComponentProps) {
  const definition = registry[params.slug]

  if (!definition) {
    return <div>Component not found</div>
  }

  return (
    <PageLayout>
      <div className="mb-6">
        <Link href="/components" className="decoration-transparent">
          {"< cd .."}
        </Link>

        <PageHeader title={`<${definition.name} />`} className="pt-12">
          <p className="font-mono text-app-vivid max-w-2xl">
            {definition.description}
          </p>
        </PageHeader>
      </div>

      <ComponentShowcase key={params.slug} definition={definition} />
    </PageLayout>
  )
}
