import type { Route } from "./+types/tools"
import { useState, useMemo } from "react"
import { TagGroup, Tag } from "~/components/tag-group"
import { PageLayout, PageHeader } from "~/components/page-layout"
import { CyberCard } from "~/components/cyber-card"
import { Badge } from "~/components/badge"
import { EmptyState } from "~/components/empty-state"

const kinds = ["All", "Framework", "Language", "Library", "Platform", "Other"]

interface Tool {
  name: string
  image: string
  website: string
  kind: (typeof kinds)[number]
}

const tools: Tool[] = [
  {
    name: "Next.js",
    image: "nextjs-icon.svg",
    website: "https://nextjs.org",
    kind: "Framework",
  },
  {
    name: "React",
    image: "react-icon.svg",
    website: "https://react.dev",
    kind: "Library",
  },
  {
    name: "Tailwind CSS",
    image: "tailwind-icon.svg",
    website: "https://tailwindcss.com",
    kind: "Library",
  },
  {
    name: "Remix",
    image: "remix-icon.svg",
    website: "https://remix.run",
    kind: "Framework",
  },
  {
    name: "TypeScript",
    image: "typescript-icon.svg",
    website: "https://typescriptlang.org",
    kind: "Language",
  },
  {
    name: "Python",
    image: "python-icon.svg",
    website: "https://python.org",
    kind: "Language",
  },
  {
    name: "Node.js",
    image: "nodejs-icon.svg",
    website: "https://nodejs.org",
    kind: "Language",
  },
  {
    name: "Flask",
    image: "flask-icon.svg",
    website: "https://flask.palletsprojects.com",
    kind: "Framework",
  },
  {
    name: "React Native",
    image: "react-icon.svg",
    website: "https://reactnative.dev",
    kind: "Library",
  },
  {
    name: "Expo",
    image: "expo-icon.svg",
    website: "https://expo.dev",
    kind: "Framework",
  },
  {
    name: "React Router",
    image: "react-router-icon.svg",
    website: "https://reactrouter.com",
    kind: "Library",
  },
  {
    name: "Sanity",
    image: "sanity-icon.svg",
    website: "https://sanity.io",
    kind: "Platform",
  },
  {
    name: "Supabase",
    image: "supabase-icon.svg",
    website: "https://supabase.com",
    kind: "Platform",
  },
  {
    name: "TanStack Query",
    image: "tanstack-icon.svg",
    website: "https://tanstack.com/query",
    kind: "Library",
  },
  {
    name: "Vite",
    image: "vite-icon.svg",
    website: "https://vitejs.dev",
    kind: "Other",
  },
  {
    name: "Motion",
    image: "motion-icon.svg",
    website: "https://motion.dev/",
    kind: "Library",
  },
  {
    name: "GSAP",
    image: "gsap-icon.svg",
    website: "https://gsap.com/",
    kind: "Library",
  },
  {
    name: "Three.js",
    image: "threejs-icon.svg",
    website: "https://threejs.org",
    kind: "Library",
  },
  {
    name: "D3.js",
    image: "d3-icon.svg",
    website: "https://d3js.org",
    kind: "Library",
  },
  {
    name: "Figma",
    image: "figma-icon.svg",
    website: "https://figma.com",
    kind: "Other",
  },
  {
    name: "PostgreSQL",
    image: "postgres-icon.svg",
    website: "https://postgresql.org",
    kind: "Language",
  },
  {
    name: "SQLite",
    image: "sqlite-icon.svg",
    website: "https://sqlite.org",
    kind: "Language",
  },
  {
    name: "Prisma",
    image: "prisma-icon.svg",
    website: "https://prisma.io",
    kind: "Library",
  },
  {
    name: "Radix UI",
    image: "radix-icon.svg",
    website: "https://radix-ui.com",
    kind: "Library",
  },
  {
    name: "React Aria",
    image: "react-aria-icon.svg",
    website: "https://react-spectrum.adobe.com/react-aria/index.html",
    kind: "Library",
  },
  {
    name: "Playwright",
    image: "playwright-icon.svg",
    website: "https://playwright.dev",
    kind: "Other",
  },
  {
    name: "Vitest",
    image: "vitest-icon.svg",
    website: "https://vitest.dev",
    kind: "Other",
  },
]

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tools" },
    { name: "description", content: "Tools and Utilities" },
  ]
}

export default function Tools() {
  const [selectedKind, setSelectedKind] = useState("All")

  const filteredTools = useMemo(() => {
    if (selectedKind === "All") return tools
    return tools.filter((tool) => tool.kind === selectedKind)
  }, [selectedKind])

  return (
    <PageLayout>
      <PageHeader title="Tools">
        <p className="font-mono text-app-vivid max-w-2xl">
          libraries, frameworks, and tools that power my development workflow
        </p>
      </PageHeader>

      <div className="space-y-8">
        <TagGroup
          aria-label="Filter tools by category"
          selectionMode="single"
          selectedKeys={[selectedKind]}
          onSelectionChange={(keys) => {
            const key = Array.from(keys)[0]?.toString()
            if (key) setSelectedKind(key)
          }}
        >
          {kinds.map((kind) => (
            <Tag key={kind} id={kind}>
              {kind}
            </Tag>
          ))}
        </TagGroup>

        <div>
          <div className="grid grid-cols-1 @xl/main:grid-cols-2 @4xl/main:grid-cols-3 @6xl/main:grid-cols-4 gap-6">
            {filteredTools.map((tool) => (
              <CyberCard
                key={tool.name}
                href={tool.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-start gap-4 mb-4">
                  {/* Logo */}
                  <img
                    src={`/tool-logos/${tool.image}`}
                    alt={`${tool.name} logo`}
                    className="size-8 object-contain shrink-0 opacity-80 group-hover:opacity-100"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <h3 className="text-xl font-mono font-bold text-primary-vivid group-hover:text-primary-accent truncate">
                        {tool.name}
                      </h3>
                    </div>

                    <Badge className="mt-1">{tool.kind}</Badge>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-primary-muted/20">
                  <span className="text-xs font-mono text-app-muted group-hover:text-primary-muted">
                    {new URL(tool.website).hostname.replace("www.", "")}
                  </span>
                </div>
              </CyberCard>
            ))}
          </div>
        </div>

        {filteredTools.length === 0 && (
          <EmptyState>No tools found in this category.</EmptyState>
        )}
      </div>
    </PageLayout>
  )
}
