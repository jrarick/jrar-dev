// Blog post frontmatter from MDX files
export interface BlogFrontmatter {
  title: string
  date?: string
  [key: string]: unknown
}

// Project frontmatter from MDX files
export interface ProjectFrontmatter {
  title: string
  description: string
  projectLink: string
  technologies: string[]
}

// MDX module types
export interface BlogMdxModule {
  frontmatter: BlogFrontmatter
  default: React.ComponentType
}

export interface ProjectMdxModule {
  frontmatter: ProjectFrontmatter
  default: React.ComponentType
}

// Serializable metadata returned from loaders
export interface BlogPostMeta {
  id: string
  slug: string
  title: string
  date?: string
}

export interface ProjectMeta {
  id: string
  slug: string
  title: string
  description: string
  projectLink: string
  technologies: string[]
}

// Project ordering constant
export const PROJECT_ORDER: Record<string, number> = {
  "setpoint-data-suite": 1,
  "longhorn-design-studio": 2,
  "shadcn-portable-text-editor": 3,
  "hydrogen-demo": 4,
  "support-docs-site": 5,
  "party-rental-ecommerce-template": 6,
}
