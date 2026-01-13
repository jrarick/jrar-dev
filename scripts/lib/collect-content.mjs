import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROUTES_DIR = path.resolve(__dirname, '../../app/routes')

/**
 * Extract frontmatter from MDX file
 * Parses YAML frontmatter between --- delimiters
 */
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/
  const match = content.match(frontmatterRegex)

  if (!match) {
    return {}
  }

  const frontmatterText = match[1]
  const frontmatter = {}

  // Simple YAML parser for key: value pairs
  const lines = frontmatterText.split('\n')
  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) continue

    const key = line.slice(0, colonIndex).trim()
    const value = line.slice(colonIndex + 1).trim().replace(/^["']|["']$/g, '')

    if (key && value) {
      frontmatter[key] = value
    }
  }

  return frontmatter
}

/**
 * Collect all blog posts with their frontmatter
 */
export async function collectBlogPosts() {
  const postsDir = path.join(ROUTES_DIR, 'blog/posts')

  try {
    const files = await fs.readdir(postsDir)
    const mdxFiles = files.filter((f) => f.endsWith('.mdx'))

    const posts = await Promise.all(
      mdxFiles.map(async (file) => {
        const slug = file.replace('.mdx', '')
        const filepath = path.join(postsDir, file)
        const content = await fs.readFile(filepath, 'utf-8')
        const frontmatter = parseFrontmatter(content)

        return {
          slug,
          title: frontmatter.title || slug,
          date: frontmatter.date || null,
          description: frontmatter.description || null,
          type: 'blog',
        }
      })
    )

    return posts
  } catch (error) {
    console.error('Failed to collect blog posts:', error.message)
    throw error
  }
}

/**
 * Collect homepage content
 */
export function collectHomepage() {
  return {
    slug: 'home',
    title: 'jrar.dev',
    type: 'homepage',
  }
}

/**
 * Collect all content for OG image generation
 */
export async function collectAllContent() {
  const blogPosts = await collectBlogPosts()

  return {
    homepage: collectHomepage(),
    blog: blogPosts,
  }
}
