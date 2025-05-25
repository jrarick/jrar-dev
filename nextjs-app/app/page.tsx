import {Suspense} from 'react'

import {AllPosts} from '@/app/components/Posts'
import Hero from './components/hero'
import Intro from './components/intro'
import Technologies from './components/technologies'

export default async function Page() {
  return (
    <>
      <Hero />
      <Intro />
      <Technologies />
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
