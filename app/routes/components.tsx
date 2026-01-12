import type { Route } from "./+types/components"
import { PageLayout, PageHeader } from "~/components/page-layout"
import { CyberCard } from "~/components/cyber-card"
import { registry } from "~/registry"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Components" },
    { name: "description", content: "UI Component Library and Design System" },
  ]
}

export default function ComponentsIndex() {
  const components = Object.entries(registry).map(([slug, def]) => ({
    slug,
    ...def,
  }))

  return (
    <PageLayout>
      <PageHeader title="Components">
        <p className="font-mono text-app-vivid max-w-2xl">
          I don't have a practical use for these yet, but they're too cool not
          to share
        </p>
      </PageHeader>

      <div className="grid grid-cols-1 @3xl/main:grid-cols-2 gap-6">
        {components.map((component) => (
          <CyberCard
            key={component.slug}
            to={`/components/${component.slug}`}
            className="p-0"
          >
            <div className="flex flex-col">
              <h3 className="text-xl font-mono p-4 font-bold text-primary-vivid group-hover:text-primary-accent truncate border-b border-primary-muted/20">
                {`<${component.name} />`}
              </h3>

              <div className="h-40 flex items-center justify-center bg-app-muted/5 relative overflow-hidden">
                <div className="pointer-events-none transform scale-90">
                  <component.component {...component.defaultProps} />
                </div>
              </div>
            </div>
          </CyberCard>
        ))}
      </div>
    </PageLayout>
  )
}
