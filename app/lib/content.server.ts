import type {
  BlogMdxModule,
  ProjectMdxModule,
  BlogPostMeta,
  ProjectMeta,
} from "./content-types"
import { PROJECT_ORDER } from "./content-types"

export function loadBlogPosts(): BlogPostMeta[] {
  const modules = import.meta.glob<BlogMdxModule>(
    "../routes/blog/posts/*.mdx",
    { eager: true }
  )

  return Object.entries(modules)
    .map(([filepath, module]) => {
      const slug = filepath.replace(
        /^\.\.\/routes\/blog\/posts\/(.*)\.mdx$/,
        "$1"
      )
      return {
        id: `blog-${slug}`,
        slug,
        title: module.frontmatter.title,
        date: module.frontmatter.date,
      }
    })
    .sort((a, b) => {
      const dateA = new Date(a.date || 0).getTime()
      const dateB = new Date(b.date || 0).getTime()
      return dateB - dateA
    })
}

export function loadProjects(): ProjectMeta[] {
  const modules = import.meta.glob<ProjectMdxModule>(
    "../routes/projects/collection/*.mdx",
    { eager: true }
  )

  return Object.entries(modules)
    .map(([filepath, module]) => {
      const slug = filepath.replace(
        /^\.\.\/routes\/projects\/collection\/(.*)\.mdx$/,
        "$1"
      )
      return {
        id: `project-${slug}`,
        slug,
        ...module.frontmatter,
      }
    })
    .sort((a, b) => {
      const orderA = PROJECT_ORDER[a.slug] ?? Infinity
      const orderB = PROJECT_ORDER[b.slug] ?? Infinity
      return orderA - orderB
    })
}
