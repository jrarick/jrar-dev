import { Suspense } from 'react'
import { AllPosts } from '../components/Posts'

export default async function Page() {
  return (
    <aside className="py-20 sm:py-28">
      <Suspense>{await AllPosts()}</Suspense>
    </aside>
  )
}
