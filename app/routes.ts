import {
  type RouteConfig,
  index,
  route,
  prefix,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("bookmarks", "routes/bookmarks.tsx"),
  route("blog", "routes/blog/index.tsx"),
  route("blog/:slug", "routes/blog/post.tsx"),
  ...prefix("api", [
    ...prefix("bookmarks", [
      route("sync", "routes/api/bookmarks/sync.ts"),
      index("routes/api/bookmarks/index.ts"),
    ]),
  ]),
] satisfies RouteConfig;
