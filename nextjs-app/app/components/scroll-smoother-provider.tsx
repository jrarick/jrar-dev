'use client'

import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ReactNode, useRef } from 'react'
import { usePathname } from 'next/navigation'

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother)

export default function ScrollSmootherProvider({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useGSAP(
    () => {
      ScrollSmoother.create({
        wrapper: '#scroll-smoother-wrapper',
        content: '#scroll-smoother-content',
        ignoreMobileResize: true,
        normalizeScroll: true,
      })
    },
    { dependencies: [pathname], scope: containerRef, revertOnUpdate: true },
  )

  return (
    <div ref={containerRef}>
      <div id="scroll-smoother-wrapper">
        <div id="scroll-smoother-content">{children}</div>
      </div>
    </div>
  )
}
