import {
  type RouteConfig,
  index,
  route,
  prefix,
} from "@react-router/dev/routes"

export default [
  index("routes/home.tsx"),
  route("robots.txt", "routes/robots[.]txt.ts"),
  route("sitemap.xml", "routes/sitemap[.]xml.ts"),
  route("bookmarks", "routes/bookmarks.tsx"),
  route("blog", "routes/blog/index.tsx"),
  route("blog/:slug", "routes/blog/post.tsx"),
  ...prefix("projects", [
    index("routes/projects/index.tsx"),
    route(":slug", "routes/projects/slug.tsx"),
  ]),
  ...prefix("components", [
    index("routes/components/index.tsx"),
    route(":slug", "routes/components/slug.tsx"),
  ]),
  route("tools", "routes/tools.tsx"),
  ...prefix("api", [
    ...prefix("bookmarks", [
      route("sync", "routes/api/bookmarks/sync.ts"),
      index("routes/api/bookmarks/index.ts"),
    ]),
  ]),

  // Prevent Chrome DevTools from showing an error in dev server logs
  route(".well-known/*", "routes/well-known.ts"),
] satisfies RouteConfig
