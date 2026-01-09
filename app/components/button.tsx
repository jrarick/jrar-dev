import {
  composeRenderProps,
  Button as RACButton,
  type ButtonProps as RACButtonProps,
} from "react-aria-components"
import { tv } from "tailwind-variants"
import { focusRing } from "~/lib/utils"
import { GridLoader } from "./grid-loader"

export interface ButtonProps extends RACButtonProps {
  /** @default 'primary' */
  variant?: "primary" | "secondary" | "destructive" | "quiet"
}

let button = tv({
  extend: focusRing,
  base: "relative inline-flex items-center justify-center gap-2 border border-transparent h-9 box-border px-3.5 py-0 [&:has(>svg:only-child)]:px-0 [&:has(>svg:only-child)]:h-8 [&:has(>svg:only-child)]:w-8 text-sm text-center cursor-default [-webkit-tap-highlight-color:transparent] transition pressed:scale-97",
  variants: {
    variant: {
      primary:
        "bg-matrix-accent hover:bg-matrix-vivid text-app-background shadow-[0_0px_10px_var(--color-matrix-base)] selection:bg-app-background selection:text-matrix-accent",
      secondary:
        "border-matrix-base bg-app-background text-app-foreground hover:bg-matrix-background/50 shadow-[0_0px_10px_var(--color-matrix-background)] selection:bg-matrix-accent selection:text-app-background",
      destructive:
        "bg-ruby-accent hover:bg-ruby-vivid text-app-background shadow-[0_0px_10px_var(--color-ruby-base)] outline-ruby-vivid selection:bg-app-background selection:text-ruby-accent",
      quiet:
        "border-0 bg-transparent hover:bg-matrix-background text-app-foreground hover:shadow-[0_0px_10px_var(--color-matrix-background)] selection:bg-matrix-accent selection:text-app-background",
    },
    isDisabled: {
      true: "opacity-30 cursor-not-allowed forced-colors:text-[GrayText]",
    },
    isPending: {
      true: "text-transparent selection:text-transparent selection:bg-transparent",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
})

export function Button(props: ButtonProps) {
  return (
    <RACButton
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        button({ ...renderProps, variant: props.variant, className })
      )}
    >
      {composeRenderProps(props.children, (children, { isPending }) => (
        <>
          {children}
          {isPending && (
            <span className="flex absolute inset-0 justify-center items-center">
              <GridLoader
                pattern="random"
                inverted={
                  props.variant === "secondary" || props.variant === "quiet"
                }
              />
            </span>
          )}
        </>
      ))}
    </RACButton>
  )
}
