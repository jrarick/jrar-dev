import { Suspense } from 'react'

import { AllPosts } from '@/app/components/Posts'
import Hero from './components/hero'
import Intro from './components/intro'
import Technologies from './components/technologies'
import Projects from './components/projects'
import { projectsPreviewQuery } from '@/sanity/lib/queries'
import { sanityFetch } from '@/sanity/lib/live'

export default async function Page() {
  const projects = await sanityFetch({
    query: projectsPreviewQuery,
  })

  return (
    <>
      <Hero />
      <Intro />
      <Technologies />
      <Projects projects={projects.data.slice(0, 4)} />
      <div className="h-dvh" />
      <div className="border-t border-gray-10">
        <div className="container">
          <aside className="py-12 sm:py-20">
            <Suspense>{await AllPosts()}</Suspense>
          </aside>
        </div>
      </div>
    </>
  )
}
