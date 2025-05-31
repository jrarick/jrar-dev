'use client'

import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import { ScrambleTextPlugin } from 'gsap/all'

gsap.registerPlugin(useGSAP, ScrambleTextPlugin)

export default function Intro() {
  const IntroContainerRef = useRef<HTMLDivElement>(null)

  const paragraphsText = [
    "After 6+ years in the industry, I've done a lot:",
    'Designing and developing website templates',
    'Diagnosing and fixing performance issues',
    'Building beautiful data visualizations',
    'Obsessing over maintainable front end architecture',
    'Automating workflows to accelerate development',
    'And even more... but the big question is:',
    'What are we going to build together?',
  ]

  useGSAP(
    () => {
      const paragraphs = gsap.utils.toArray<HTMLParagraphElement>('[id^=intro-p-]')

      paragraphs.forEach((p, i) => {
        const paragraphTl = gsap.timeline({
          scrollTrigger: {
            trigger: `#intro-p-${i + 1}`,
            start: 'top bottom-=20%',
            end: 'bottom top+=10%',
            toggleActions: 'play reverse play reverse',
          },
        })

        paragraphTl.to(p, {
          scrambleText: {
            text: paragraphsText[i],
            chars: 'lowerCase',
          },
          duration: 0.6,
        })
      })
    },
    { scope: IntroContainerRef },
  )

  return (
    <div className="pb-[32rem] pt-16">
      <div
        className="font-medium px-3 sm:px-12 space-y-24 flex flex-col items-center"
        ref={IntroContainerRef}
      >
        {paragraphsText.map((text, i) => (
          <p
            key={text}
            id={`intro-p-${i + 1}`}
            className="text-sm font-semibold text-center h-3 sm:text-lg/4.5 sm:h-4.5 md:text-2xl/6 md:h-6"
          />
        ))}
      </div>
    </div>
  )
}
