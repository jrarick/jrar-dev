'use client'

import gsap from 'gsap'
import {useGSAP} from '@gsap/react'
import {ScrollSmoother} from 'gsap/ScrollSmoother'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import {ReactNode, useRef} from 'react'
import {SCROLL_SMOOTHER_WRAPPER_ID} from '../constants'

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother)

export default function ScrollSmootherProvider({children}: {children: ReactNode}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      ScrollSmoother.create({
        wrapper: `#${SCROLL_SMOOTHER_WRAPPER_ID}`,
        content: '#scroll-smoother-content',
        effects: true,
        normalizeScroll: true,
        ignoreMobileResize: true,
      })
    },
    {scope: containerRef},
  )

  return (
    <div ref={containerRef}>
      <div id={SCROLL_SMOOTHER_WRAPPER_ID}>
        <div id="scroll-smoother-content">{children}</div>
      </div>
    </div>
  )
}
