import CoverImage from '@/app/components/CoverImage'
import PortableText from '@/app/components/PortableText'
import { sanityFetch } from '@/sanity/lib/live'
import { getProjectQuery } from '@/sanity/lib/queries'
import { resolveOpenGraphImage } from '@/sanity/lib/utils'
import type { Metadata, ResolvingMetadata } from 'next'
import type { PortableTextBlock } from 'next-sanity'

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const params = await props.params
  const project = await sanityFetch({
    query: getProjectQuery,
    params,
  })
  const ogImage = resolveOpenGraphImage(project.data?.coverImage)

  return {
    title: project.data?.title || 'Project',
    description: project.data?.description || '',
    openGraph: {
      title: project.data?.title || 'Project',
      description: project.data?.description || '',
      images: ogImage ? [ogImage] : [],
    },
  }
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  const project = await sanityFetch({
    query: getProjectQuery,
    params,
  })

  if (!project.data?._id) {
    return (
      <div className="py-40">
        <h1 className="text-center text-2xl font-bold">Project not found</h1>
      </div>
    )
  }

  const { title, coverImage, content, linkToProject } = project.data

  return (
    <div className="overflow-auto px-4 py-12">
      <article className="prose prose-neutral prose-sm sm:prose-base dark:prose-invert prose-invert mx-auto prose-img:m-0">
        <a
          href={linkToProject ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-12 min-h-full relative"
        >
          <CoverImage image={coverImage} />
          <span className="absolute inset-0 bg-gradient-to-br from-50% to-fill" />
          <span className="absolute bottom-4 right-4 font-bold">Click me</span>
        </a>
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        {content?.length && (
          <PortableText className="max-w-2xl prose-invert" value={content as PortableTextBlock[]} />
        )}
      </article>
    </div>
  )
}
