import { useRouteLoaderData } from "react-router"
import type { BlogPostMeta, ProjectMeta } from "~/lib/content-types"

interface RootLoaderData {
  blogPosts: BlogPostMeta[]
  projects: ProjectMeta[]
}

export function useContent(): RootLoaderData {
  const data = useRouteLoaderData<RootLoaderData>("root")
  if (!data) {
    throw new Error(
      "useContent must be used within a route that has root as an ancestor"
    )
  }
  return data
}

export function useBlogPosts(): BlogPostMeta[] {
  return useContent().blogPosts
}

export function useProjects(): ProjectMeta[] {
  return useContent().projects
}
