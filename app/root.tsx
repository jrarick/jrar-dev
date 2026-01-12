import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useHref,
  useNavigate,
  type NavigateOptions,
} from "react-router"
import { Sidebar, SidebarContent } from "~/components/page-sections/sidebar"
import { Sheet } from "~/components/sheet"
import { RouteBreadcrumbs } from "~/components/page-sections/route-breadcrumbs"
import { Button } from "~/components/button"
import { DialogTrigger, Dialog } from "react-aria-components"
import { Menu } from "lucide-react"

import type { Route } from "./+types/root"
import "./app.css"
import { RouterProvider } from "react-aria-components"
import Noise from "./components/noise"
import { usePrefersReducedMotion } from "./hooks/use-prefers-reduced-motion"
import { loadBlogPosts, loadProjects } from "~/lib/content.server"

export function loader() {
  return {
    blogPosts: loadBlogPosts(),
    projects: loadProjects(),
  }
}

declare global {
  namespace Cloudflare {
    interface Env {
      jrar_dev_db: D1Database
      JRAR_DEV_KV: KVNamespace
    }
  }
}

// Configure the type of the `routerOptions` prop on all React Aria components.
declare module "react-aria-components" {
  interface RouterConfig {
    routerOptions: NavigateOptions
  }
}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Fragment+Mono:ital@0;1&display=swap",
  },
]

export function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const prefersReducedMotion = usePrefersReducedMotion({ ssr: true })

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="font-mono bg-app-background text-app-accent">
        {!prefersReducedMotion && (
          <div
            className="w-dvw h-dvh fixed overflow-hidden z-20 inset-0 pointer-events-none"
            aria-hidden="true"
          >
            <Noise
              patternSize={250}
              patternScaleX={1}
              patternScaleY={1}
              patternRefreshInterval={10}
              patternAlpha={15}
            />
          </div>
        )}
        <div className="pointer-events-auto">
          <RouterProvider navigate={navigate} useHref={useHref}>
            {children}
          </RouterProvider>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center gap-4 p-4 border-b border-primary-background bg-app-background/80 backdrop-blur sticky top-0 z-10">
          <DialogTrigger>
            <Button variant="quiet" className="md:hidden">
              <Menu />
              <span className="sr-only">Menu</span>
            </Button>
            <Sheet side="left" isDismissable>
              <Dialog className="h-full outline-none">
                {({ close }) => (
                  <SidebarContent onLinkClick={close} onClose={close} />
                )}
              </Dialog>
            </Sheet>
          </DialogTrigger>
          <RouteBreadcrumbs />
        </header>
        <main className="flex-1 min-w-0 @container/main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!"
  let details = "An unexpected error occurred."
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error"
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
