'use client'

import Image from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'

gsap.registerPlugin(useGSAP)

const icons = [
  { url: '/assets/d3-icon.svg', alt: 'D3.js Icon' },
  { url: '/assets/figma-icon.svg', alt: 'Figma Icon' },
  { url: '/assets/motion-icon.svg', alt: 'Motion Icon' },
  { url: '/assets/nextjs-icon.svg', alt: 'Next.js Icon' },
  { url: '/assets/nodejs-icon.svg', alt: 'Node.js Icon' },
  { url: '/assets/playwright-icon.svg', alt: 'Playwright Icon' },
  { url: '/assets/postgres-icon.svg', alt: 'PostgreSQL Icon' },
  { url: '/assets/prisma-icon.svg', alt: 'Prisma Icon' },
  { url: '/assets/python-icon.svg', alt: 'Python Icon' },
  { url: '/assets/radix-icon.svg', alt: 'Radix Icon' },
  { url: '/assets/gsap-icon.svg', alt: 'GSAP Icon' },
  { url: '/assets/react-icon.svg', alt: 'React Icon' },
  { url: '/assets/react-router-icon.svg', alt: 'React Router Icon' },
  { url: '/assets/remix-icon.svg', alt: 'Remix Icon' },
  { url: '/assets/sanity-icon.svg', alt: 'Sanity Icon' },
  { url: '/assets/supabase-icon.svg', alt: 'Supabase Icon' },
  { url: '/assets/tailwind-icon.svg', alt: 'Tailwind CSS Icon' },
  { url: '/assets/tanstack-icon.svg', alt: 'TanStack Icon' },
  { url: '/assets/typescript-icon.svg', alt: 'TypeScript Icon' },
  { url: '/assets/vite-icon.svg', alt: 'Vite Icon' },
]

export default function Technologies() {
  const technologiesContainerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLDivElement>('[id^=technology-row]')

      // Container fade-in/out animation
      gsap.from(technologiesContainerRef.current, {
        autoAlpha: 0,
        duration: 0.3,
        scrollTrigger: {
          trigger: technologiesContainerRef.current,
          start: 'top bottom-=20%',
          end: 'bottom top+=20%',
          toggleActions: 'play reverse play reverse',
        },
      })

      // Row animations
      rows.forEach((row, index) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: technologiesContainerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        })

        tl.fromTo(
          row,
          {
            x: index % 2 === 0 ? '-50%' : '50%',
          },
          {
            x: index % 2 === 0 ? '50%' : '-50%',
          },
        )
      })
    },
    { scope: technologiesContainerRef },
  )

  return (
    <div ref={technologiesContainerRef}>
      <div className="space-y-12 md:space-y-16 -rotate-5">
        <h2 className="text-3xl sm:text-4xl md:text-6xl text-center font-mono font-bold">
          The Tools I Use
        </h2>
        {Array.from({ length: Math.ceil(icons.length / 4) }, (_, topLevelIndex) => (
          <div
            key={topLevelIndex}
            id={`technology-row-${topLevelIndex + 1}`}
            className="flex justify-center gap-12 sm:gap-18 md:gap-24"
          >
            {Array.from({ length: 5 }).map((_, bottomLevelIndex) =>
              icons
                .slice(topLevelIndex * 4, topLevelIndex * 4 + 4)
                .map((icon) => (
                  <Image
                    key={`${icon.alt} part ${bottomLevelIndex + 1}`}
                    width={80}
                    height={80}
                    src={icon.url}
                    alt={icon.alt}
                    aria-hidden={bottomLevelIndex > 0}
                    className="h-10 sm:h-14 md:h-16 lg:h-20 w-auto"
                  />
                )),
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
