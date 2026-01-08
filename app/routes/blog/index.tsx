import { Link, useLoaderData } from "react-router";

// Define interface for frontmatter
interface Frontmatter {
  title: string;
  date?: string;
  description?: string;
  [key: string]: any;
}

// Define interface for MDX module
interface MdxModule {
  frontmatter: Frontmatter;
  default: React.ComponentType;
}

export async function loader() {
  // Use import.meta.glob to load all MDX files in the posts directory
  const modules = import.meta.glob<MdxModule>('./posts/*.mdx', { eager: true });

  // Map over the modules to extract slug and frontmatter
  const posts = Object.entries(modules).map(([filepath, module]) => {
    // Extract slug from filepath (e.g., "./posts/first-post.mdx" -> "first-post")
    const slug = filepath.replace(/^\.\/posts\/(.*)\.mdx$/, '$1');
    return {
      slug,
      frontmatter: module.frontmatter,
    };
  });

  return { posts };
}

export default function BlogIndex() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <div className="p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.slug} className="border p-4 rounded hover:bg-gray-50">
            <Link to={`/blog/${post.slug}`} className="block">
              <h2 className="text-xl font-semibold text-blue-600">
                {post.frontmatter.title || post.slug}
              </h2>
              {post.frontmatter.date && (
                <p className="text-sm text-gray-500">{post.frontmatter.date}</p>
              )}
              {post.frontmatter.description && (
                <p className="mt-2 text-gray-700">{post.frontmatter.description}</p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
