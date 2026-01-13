import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import satori from 'satori'
import React from 'react'
import { createSatoriConfig } from './lib/satori-config.mjs'
import { svgToPng } from './lib/svg-to-png.mjs'
import { collectAllContent } from './lib/collect-content.mjs'
import { HomepageTemplate } from './og-templates/homepage-template.tsx'
import { BlogPostTemplate } from './og-templates/blog-post-template.tsx'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PUBLIC_DIR = path.resolve(__dirname, '../public')
const OG_DIR = path.join(PUBLIC_DIR, 'og')

/**
 * Template registry - maps content types to their templates
 */
const TEMPLATES = {
  homepage: HomepageTemplate,
  blog: BlogPostTemplate,
}

/**
 * Generate a single OG image
 */
async function generateImage(content, outputPath, satoriConfig) {
  const Template = TEMPLATES[content.type]

  if (!Template) {
    throw new Error(`No template found for content type: ${content.type}`)
  }

  try {
    // Render template to SVG using Satori
    const svg = await satori(
      React.createElement(Template, content),
      satoriConfig
    )

    // Convert SVG to PNG
    const png = await svgToPng(svg)

    // Ensure output directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true })

    // Write PNG to file
    await fs.writeFile(outputPath, png)

    return outputPath
  } catch (error) {
    console.error(`Failed to generate image for ${content.slug}:`, error.message)
    throw error
  }
}

/**
 * Main generation function
 */
async function main() {
  console.log('🎨 Generating OG images...\n')

  try {
    // Load Satori configuration with fonts
    const satoriConfig = await createSatoriConfig()

    // Collect all content
    const content = await collectAllContent()

    // Generate homepage image
    console.log('Homepage:')
    const homepagePath = path.join(OG_DIR, 'home.png')
    await generateImage(content.homepage, homepagePath, satoriConfig)
    console.log(`  ✓ Generated /og/home.png`)

    // Generate blog post images
    console.log(`\nBlog posts (${content.blog.length} posts):`)
    for (const post of content.blog) {
      const postPath = path.join(OG_DIR, 'blog', `${post.slug}.png`)
      await generateImage(post, postPath, satoriConfig)
      console.log(`  ✓ Generated /og/blog/${post.slug}.png`)
    }

    const totalImages = 1 + content.blog.length
    console.log(`\n✨ Done! Generated ${totalImages} images`)
  } catch (error) {
    console.error('\n❌ Error generating OG images:', error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

main()
