'use client'

import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(useGSAP, SplitText)

export default function FloatingToast() {
  const containerRef = useRef(null)

  useGSAP(
    () => {
      const splitMessage = new SplitText('#floating-toast-message', { type: 'words, chars' })

      const tl = gsap.timeline({
        delay: 1.3,
      })

      tl.from('aside', {
        duration: 0.3,
        autoAlpha: 0,
        ease: 'power3.inOut',
        y: 50,
      })

      tl.from('#floating-toast-dot', {
        duration: 0.3,
        autoAlpha: 0,
        scale: 2,
        ease: 'power3.inOut',
      })

      tl.from(
        splitMessage.chars,
        {
          duration: 0.5,
          autoAlpha: 0,
          filter: 'blur(3px)',
          rotateX: 90,
          ease: 'power3.inOut',
          stagger: 0.0075,
        },
        0.5,
      )

      tl.to('aside', {
        duration: 0.3,
        autoAlpha: 0,
        ease: 'power3.inOut',
        y: 50,
        delay: 3, // Keep the toast visible for 5 seconds before fading out
      })
    },
    { scope: containerRef },
  )

  return (
    <div ref={containerRef}>
      <aside className="fixed bottom-4 right-4 text-xs z-50 bg-accent-muted border border-accent/50 text-accent p-4 rounded-lg shadow-lg flex items-center gap-4">
        <span id="floating-toast-dot" className="rounded-full size-1.5 bg-accent/75" />
        <span id="floating-toast-message">All systems operational</span>
      </aside>
    </div>
  )
}
