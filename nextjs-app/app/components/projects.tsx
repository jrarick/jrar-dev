'use client'

import type { ProjectsPreviewQueryResult } from '@/sanity.types'
import CoverImage from './CoverImage'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function Projects({ projects }: { projects: ProjectsPreviewQueryResult }) {
  const projectsContainerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.from(projectsContainerRef.current, {
        scrollTrigger: {
          trigger: projectsContainerRef.current,
          start: 'top bottom-=10%',
          end: 'bottom-=50% top+=50%',
          scrub: 0.8,
          toggleActions: 'play reverse play reverse',
        },
        autoAlpha: 0,
        filter: 'blur(4px)',
        duration: 0.3,
        ease: 'power3.inOut',
      })

      let sections = gsap.utils.toArray<HTMLDivElement>('[id^=project-]')

      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: projectsContainerRef.current,
          pin: true,
          scrub: 1,
          // snap: 1 / (sections.length - 1),
          end: () => '+=' + projectsContainerRef.current?.offsetWidth,
        },
      })
    },
    { scope: projectsContainerRef },
  )

  return (
    <div className="pt-96">
      <div ref={projectsContainerRef} className="max-w-7xl mx-auto pt-12">
        <h2 className="text-center font-bold text-4xl mb-12">{`Projects I've worked on`}</h2>
        <div className="grid grid-cols-4 w-[400%]">
          {projects.map((project, i) => (
            <article key={project._id} id={`project-${i + 1}`} className="px-36 py-8">
              <div className="relative flex flex-col space-y-3">
                <CoverImage image={project.coverImage} />
                <Link href={`/projects/${project.slug}`} className="text-2xl font-bold">
                  <span className="absolute inset-0" />
                  {project.title}
                </Link>
                <p className="text-muted">{project.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
