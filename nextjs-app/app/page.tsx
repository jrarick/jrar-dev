import { Suspense } from 'react'

import { AllPosts } from '@/app/components/Posts'
import Hero from './components/hero'
import Intro from './components/intro'
import Technologies from './components/technologies'
import Projects from './components/projects'
import { allPostsQuery, projectsPreviewQuery } from '@/sanity/lib/queries'
import { sanityFetch } from '@/sanity/lib/live'

export default async function Page() {
  const projects = await sanityFetch({
    query: projectsPreviewQuery,
  })
  const blogPosts = await sanityFetch({ query: allPostsQuery })

  return (
    <>
      <Hero />
      <Intro />
      <Technologies />
      <Projects projects={projects.data} />
      <aside className="py-28 sm:py-48">
        <Suspense>{await AllPosts()}</Suspense>
      </aside>
    </>
  )
}
