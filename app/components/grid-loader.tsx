import { useMemo } from "react"
import { useIsSSR } from "react-aria"
import { tv } from "tailwind-variants"

const PATTERNS = ["wave", "snake", "rain", "blink", "parallax"] as const
type ActualPattern = (typeof PATTERNS)[number]

export type GridLoaderPattern = ActualPattern | "random"

export interface GridLoaderProps {
  pattern?: GridLoaderPattern
  className?: string
  /** Use dark cells for light button backgrounds */
  inverted?: boolean
}

const gridStyles = tv({
  base: "grid grid-cols-3 gap-px",
  variants: {
    size: {
      sm: "w-4 h-4",
    },
  },
  defaultVariants: {
    size: "sm",
  },
})

const cellStyles = tv({
  base: "w-full h-full",
  variants: {
    inverted: {
      false: "bg-app-background",
      true: "bg-primary-accent",
    },
  },
  defaultVariants: {
    inverted: false,
  },
})

// Calculate Chebyshev distance from center (cell 4) for wave pattern
function getWaveDelay(index: number): number {
  const row = Math.floor(index / 3)
  const col = index % 3
  const centerRow = 1
  const centerCol = 1
  const distance = Math.max(
    Math.abs(row - centerRow),
    Math.abs(col - centerCol)
  )
  return distance * 200 // 200ms per ring
}

// Snake path traversal order
const SNAKE_PATH = [
  0,
  1,
  2, // Right
  5,
  4,
  3, // Left
  6,
  7,
  8, // Right
]

function getSnakeDelay(index: number): number {
  const position = SNAKE_PATH.indexOf(index)
  return position * 100 // 100ms per cell = 900ms total
}

// Rain: each column cascades down
function getRainDelay(index: number): number {
  const row = Math.floor(index / 3)
  const col = index % 3
  return col * 150 + row * 150 // Column offset + row cascade
}

// Blink: seeded "random" delays based on index
function getBlinkDelay(index: number): number {
  // Use a simple hash for consistent "random" delays
  const hash = ((index * 17 + 7) % 9) / 9
  return hash * 800
}

// Parallax: columns move in opposite directions
function getParallaxDelay(index: number): number {
  const row = Math.floor(index / 3)
  const col = index % 3
  const isEvenCol = col % 2 === 0
  // Even columns go down (0-2), odd columns go up (2-0)
  const effectiveRow = isEvenCol ? row : 2 - row
  return col * 80 + effectiveRow * 100
}

const PATTERN_CONFIG: Record<
  ActualPattern,
  { animation: string; duration: string; getDelay: (i: number) => number }
> = {
  wave: {
    animation: "grid-pulse",
    duration: "800ms",
    getDelay: getWaveDelay,
  },
  snake: {
    animation: "grid-snake",
    duration: "900ms",
    getDelay: getSnakeDelay,
  },
  rain: {
    animation: "grid-rain",
    duration: "1000ms",
    getDelay: getRainDelay,
  },
  blink: {
    animation: "grid-blink",
    duration: "400ms",
    getDelay: getBlinkDelay,
  },
  parallax: {
    animation: "grid-pulse",
    duration: "800ms",
    getDelay: getParallaxDelay,
  },
}

export function GridLoader({
  pattern = "random",
  className,
  inverted = false,
}: GridLoaderProps) {
  const isSSR = useIsSSR()

  const resolvedPattern = useMemo<ActualPattern>(() => {
    if (pattern === "random") {
      // Use a strict pattern during SSR/hydration to avoid mismatch
      if (isSSR) return "wave"
      return PATTERNS[Math.floor(Math.random() * PATTERNS.length)]
    }
    return pattern
  }, [pattern, isSSR])

  const config = PATTERN_CONFIG[resolvedPattern]

  return (
    <div className={gridStyles({ className })} aria-hidden="true">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className={cellStyles({ inverted })}
          style={{
            animation: `${config.animation} ${config.duration} ease-in-out infinite`,
            animationDelay: `${config.getDelay(i)}ms`,
          }}
        />
      ))}
    </div>
  )
}
