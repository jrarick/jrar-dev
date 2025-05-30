import { sanityFetch } from '@/sanity/lib/live'
import { projectsPreviewQuery } from '@/sanity/lib/queries'
import CoverImage from '../components/CoverImage'
import Link from 'next/link'

export default async function Page() {
  const projects = await sanityFetch({
    query: projectsPreviewQuery,
  })

  return (
    <div className="py-24">
      <h2 className="text-center font-bold text-4xl px-4 pb-8">{`Projects I've worked on`}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-7xl mx-auto">
        {projects.data.map((project, i) => (
          <article key={project._id} id={`project-${i + 1}`} className="px-12 py-8">
            <div className="relative space-y-2">
              <CoverImage image={project.coverImage} />
              <Link href={`/projects/${project.slug}`} className="text-2xl font-bold block">
                <span className="absolute inset-0" />
                {project.title}
              </Link>
              <p className="text-muted">{project.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
