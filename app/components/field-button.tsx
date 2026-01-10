import {
  composeRenderProps,
  Button as RACButton,
  type ButtonProps as RACButtonProps,
} from "react-aria-components"
import { tv } from "tailwind-variants"
import { focusRing } from "~/lib/utils"

export interface ButtonProps extends RACButtonProps {
  /** @default 'primary' */
  variant?: "primary" | "secondary" | "destructive" | "icon"
}

let button = tv({
  extend: focusRing,
  base: "relative inline-flex items-center border-0 font-mono text-sm text-center transition rounded-none cursor-default p-1 justify-center text-app-accent bg-transparent hover:bg-primary-background hover:text-app-background pressed:bg-primary-vivid disabled:bg-transparent [-webkit-tap-highlight-color:transparent]",
  variants: {
    isDisabled: {
      true: "text-app-muted cursor-not-allowed forced-colors:text-[GrayText]",
    },
  },
})

export function FieldButton(props: ButtonProps) {
  return (
    <RACButton
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        button({ ...renderProps, className })
      )}
    >
      {props.children}
    </RACButton>
  )
}
