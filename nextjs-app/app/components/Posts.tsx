import Link from 'next/link'

import { sanityFetch } from '@/sanity/lib/live'
import { morePostsQuery, allPostsQuery } from '@/sanity/lib/queries'
import { Post as PostType } from '@/sanity.types'
import DateComponent from '@/app/components/Date'
import OnBoarding from '@/app/components/Onboarding'

const Post = ({ post }: { post: PostType }) => {
  const { _id, title, slug, excerpt, date } = post

  return (
    <article key={_id} className="flex max-w-xl flex-col items-start justify-between">
      <div className="text-muted text-sm">
        <DateComponent dateString={date} />
      </div>

      <h3 className="mt-3 text-2xl font-semibold">
        <Link
          className="hover:text-accent hover:underline transition-colors"
          href={`/blog/${slug}`}
        >
          {title}
        </Link>
      </h3>
      <p className="mt-5 line-clamp-3 text-sm leading-6 text-muted">{excerpt}</p>
    </article>
  )
}

const Posts = ({ children, heading }: { children: React.ReactNode; heading?: string }) => (
  <div className="w-full flex flex-col items-center mx-auto">
    {heading && (
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{heading}</h2>
    )}
    <div className="mt-6 pt-6 space-y-12">{children}</div>
  </div>
)

export const MorePosts = async ({ skip, limit }: { skip: string; limit: number }) => {
  const { data } = await sanityFetch({
    query: morePostsQuery,
    params: { skip, limit },
  })

  if (!data || data.length === 0) {
    return null
  }

  return (
    <Posts heading={`Recent Posts (${data?.length})`}>
      {data?.map((post: any) => <Post key={post._id} post={post} />)}
    </Posts>
  )
}

export const AllPosts = async () => {
  const { data } = await sanityFetch({ query: allPostsQuery })

  if (!data || data.length === 0) {
    return <OnBoarding />
  }

  return (
    <Posts heading="From the Blog">
      {data.map((post: any) => (
        <Post key={post._id} post={post} />
      ))}
    </Posts>
  )
}
