'use client'

import gsap from 'gsap'
import {useGSAP} from '@gsap/react'
import {SplitText} from 'gsap/SplitText'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import {useRef} from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

export default function Hero() {
  const heroRef = useRef(null)

  useGSAP(
    () => {
      const splitTitle = new SplitText('.hero-title', {type: 'lines, words, chars'})
      gsap.from(splitTitle.chars, {
        duration: 0.5,
        opacity: 0,
        y: 50,
        rotateX: 90,
        skewY: 5,
        transformOrigin: 'center top',
        scale: 0.7,
        filter: 'blur(6px)',
        ease: 'power3.inOut',
        stagger: 0.01,
      })

      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#scroll-smoother',
          start: 'top top',
          end: 'top+=20% top',
          scrub: 1.2,
        },
      })

      gsap.utils.toArray<HTMLSpanElement>(splitTitle.lines).forEach((element, index) => {
        heroTl.to(
          element,
          {
            rotationX: 90,
            y: -30,
            scale: 0.7, // Scale down as it rotates away
            opacity: 0,
            filter: 'blur(6px)', // Add blur effect
            ease: 'power3.inOut', // Better easing
            transformOrigin: 'center top',
          },
          index * 0.08,
        )
      })
    },
    {scope: heroRef},
  )

  return (
    <div ref={heroRef}>
      <section className="hero-container h-dvh w-full flex justify-center py-48">
        <h1 className="hero-title text-center max-w-5xl text-7xl/22 font-bold">{`Hey my name's Josh. I build stuff with Next.js and React.`}</h1>
      </section>
    </div>
  )
}
