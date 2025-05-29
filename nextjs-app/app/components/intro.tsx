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
    'Diagnosing and fixing browser/network performance issues',
    'Building beautiful data visualizations',
    'Obsessing over maintainable front end architecture',
    'Automating workflows to accelerate development',
    'And even more... but the big question is:',
    'What are we going to build together?',
  ]

  useGSAP(
    () => {
      const paragraphs = gsap.utils.toArray<HTMLParagraphElement>('[id^=intro-p-]')

      const paragraphsTl = gsap.timeline({
        scrollTrigger: {
          trigger: IntroContainerRef.current,
          start: 'top bottom-=10%',
          end: 'bottom top+=80%',
          scrub: 1,
          toggleActions: 'play reverse play reverse',
        },
      })

      paragraphs.forEach((p, i) => {
        paragraphsTl.to(p, {
          scrambleText: {
            text: paragraphsText[i],
            chars: 'lowerCase',
          },
          duration: 1.3,
        })
      })
    },
    { scope: IntroContainerRef },
  )

  return (
    <div className="pb-96 pt-16">
      <div
        className="font-medium px-3 sm:px-12 space-y-16 flex flex-col items-center"
        ref={IntroContainerRef}
      >
        {paragraphsText.map((text, i) => (
          <p
            key={text}
            id={`intro-p-${i + 1}`}
            className="text-base text-center h-4 sm:text-xl sm:h-5 md:text-2xl/6 md:h-6"
          />
        ))}
      </div>
    </div>
  )
}
