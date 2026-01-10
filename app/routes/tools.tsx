import type { Route } from "./+types/tools"
import { useState, useMemo } from "react"
import { TagGroup, Tag } from "~/components/tag-group"

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
    <main className="min-h-screen bg-app-background py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <header className="mb-12">
          <h1 className="text-3xl font-mono font-bold text-primary-vivid uppercase mb-4">
            Tools
          </h1>
          <p className="font-mono text-app-vivid max-w-2xl">
            Framework, Library, and tools that power my development workflow.
          </p>
        </header>

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

          <div className="@container/tools">
            <div className="grid grid-cols-1 @xl/tools:grid-cols-2 @4xl/tools:grid-cols-3 @6xl/tools:grid-cols-4 gap-6">
              {filteredTools.map((tool) => (
                <a
                  key={tool.name}
                  href={tool.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block p-6 border border-primary-muted bg-app-background hover:border-primary-vivid hover:bg-primary-background/50 focus:outline-none focus:ring-1 focus:ring-primary-vivid"
                >
                  {/* Corner Accents */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-primary-muted group-hover:border-primary-vivid" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-primary-muted group-hover:border-primary-vivid" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-primary-muted group-hover:border-primary-vivid" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-primary-muted group-hover:border-primary-vivid" />

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

                      <span className="inline-block mt-1 text-xs font-mono text-primary-muted uppercase tracking-wider border border-primary-muted/30 px-2 py-0.5">
                        {tool.kind}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-primary-muted/20">
                    <span className="text-xs font-mono text-app-muted group-hover:text-primary-muted">
                      {new URL(tool.website).hostname.replace("www.", "")}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {filteredTools.length === 0 && (
            <div className="py-12 text-center border border-dashed border-primary-muted">
              <p className="font-mono text-primary-muted">
                No tools found in this category.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
