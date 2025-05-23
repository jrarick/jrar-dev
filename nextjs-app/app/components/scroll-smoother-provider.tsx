'use client'

import gsap from 'gsap'
import {useGSAP} from '@gsap/react'
import {ScrollSmoother} from 'gsap/ScrollSmoother'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import {ReactNode, useRef} from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother)

export default function ScrollSmootherProvider({children}: {children: ReactNode}) {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      ScrollSmoother.create({
        effects: true,
        normalizeScroll: true,
        ignoreMobileResize: true,
      })
    },
    {scope: container},
  )

  return <div ref={container}>{children}</div>
}
