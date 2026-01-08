import { Suspense, useMemo, lazy } from "react";
import { useLoaderData } from "react-router";
import type { Route } from "./+types/post";

interface Frontmatter {
  title: string;
  date?: string;
  [key: string]: any;
}

interface MdxModule {
  frontmatter: Frontmatter;
  default: React.ComponentType;
}

export async function loader({ params }: Route.LoaderArgs) {
  // We use the glob to check if the post exists and get metadata if needed,
  // but we don't import the component code here to avoid serialization issues
  // and bundle bloat (if we used eager).

  // Note: For checking existence efficiently without loading code,
  // we could use a separate glob or just handle the error on client,
  // but reading frontmatter usually requires loading the module or using a specific loader.
  // Given the constraint of static MDX files, lazy import is best for code splitting.
  // But we still need to know if it's a 404.

  // Vite's import.meta.glob with { eager: false } returns { path: () => import(...) }.
  // We can't check keys of lazy glob to verify existence easily?
  // Yes, keys are the file paths.

  const modules = import.meta.glob('./posts/*.mdx');
  const filepath = `./posts/${params.slug}.mdx`;

  if (!modules[filepath]) {
    throw new Response("Not Found", { status: 404 });
  }

  // We can't return the module loader function itself easily as it's not serializable data.
  // But we can return the slug, and let the client component find the module in its own glob.

  return {
    slug: params.slug
  };
}

export default function BlogPost({ loaderData }: Route.ComponentProps) {
  const { slug } = loaderData;

  // Lazy glob for code splitting
  const modules = import.meta.glob('./posts/*.mdx');
  const filepath = `./posts/${slug}.mdx`;

  // Create a lazy component
  const Component = useMemo(() => {
    const importFn = modules[filepath] as () => Promise<MdxModule>;
    return lazy(importFn);
  }, [filepath]);

  return (
    <article className="prose lg:prose-xl mx-auto p-8 font-sans dark:prose-invert">
      <Suspense fallback={<div>Loading post...</div>}>
        <Component />
      </Suspense>
    </article>
  );
}
