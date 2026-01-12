import {
  Link as AriaLink,
  type LinkProps as AriaLinkProps,
  composeRenderProps,
} from "react-aria-components"
import { tv } from "tailwind-variants"
import { focusRing } from "~/lib/utils"

interface LinkProps extends AriaLinkProps {
  variant?: "primary" | "secondary"
}

const styles = tv({
  extend: focusRing,
  base: "underline disabled:no-underline disabled:cursor-default forced-colors:disabled:text-[GrayText] [-webkit-tap-highlight-color:transparent]",
  variants: {
    variant: {
      primary:
        "text-primary-muted hover:text-primary-vivid underline decoration-primary-muted/60 hover:decoration-primary-vivid",
      secondary:
        "text-app-vivid hover:text-app-accent underline decoration-app-vivid/50 hover:decoration-app-accent",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
})

export function Link(props: LinkProps) {
  return (
    <AriaLink
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        styles({ ...renderProps, className, variant: props.variant })
      )}
    />
  )
}
