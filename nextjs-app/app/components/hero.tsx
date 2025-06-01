'use client'

import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { SplitText } from 'gsap/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

export default function Hero() {
  const heroContainerRef = useRef(null)

  useGSAP(
    () => {
      const splitTitle = new SplitText('#hero-title', { type: 'lines, words, chars' })

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

      const titleTl = gsap.timeline({
        repeat: -1,
      })

      titleTl.to('#hero-title', {
        transformOrigin: 'center center',
        ease: 'sine.inOut',
        keyframes: [
          { x: 0.5, duration: 0.0125 },
          { x: -0.5, duration: 0.0125 },
          { x: 0, duration: 0.0125 },
        ],
        repeat: 60,
      })

      titleTl.to('#hero-title', {
        transformOrigin: 'center center',
        ease: 'sine.inOut',
        keyframes: [
          { skewX: 50, duration: 0.0125 },
          { skewX: -50, duration: 0.0125 },
          { skewX: 0, duration: 0.0125 },
        ],
      })

      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroContainerRef.current,
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
            scale: 0.7,
            opacity: 0,
            filter: 'blur(6px)',
            ease: 'power3.inOut',
            transformOrigin: 'center top',
          },
          index * 0.08,
        )
      })
    },
    { scope: heroContainerRef },
  )

  return (
    <div ref={heroContainerRef}>
      <section className="w-full flex justify-center py-48 sm:py-64">
        <h1
          id="hero-title"
          className="text-center max-w-5xl text-4xl/14 md:text-5xl/20 lg:text-7xl/28 font-bold blur-[1px] px-8"
        >{`Hey, my name's Josh. I build first-class user experiences.`}</h1>
      </section>
    </div>
  )
}
