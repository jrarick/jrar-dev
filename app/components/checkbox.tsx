import { Check, Minus } from "lucide-react"
import {
  Checkbox as AriaCheckbox,
  type CheckboxProps,
  composeRenderProps,
} from "react-aria-components"
import { tv } from "tailwind-variants"
import { focusRing } from "~/lib/utils"

const checkboxStyles = tv({
  base: "flex gap-2 items-center group font-mono text-sm transition relative [-webkit-tap-highlight-color:transparent]",
  variants: {
    isDisabled: {
      false: "text-app-accent",
      true: "text-app-muted cursor-not-allowed",
    },
  },
})

const boxStyles = tv({
  extend: focusRing,
  base: "w-4.5 h-4.5 box-border shrink-0 rounded-none flex items-center justify-center border transition bg-app-background",
  variants: {
    isSelected: {
      false: "border-primary-muted group-pressed:border-primary-vivid",
      true: "bg-primary-accent border-primary-muted group-pressed:border-primary-vivid shadow-[0_0px_10px_var(--color-primary-muted)] group-pressed:bg-primary-vivid forced-colors:[--color:Highlight]!",
    },
    isInvalid: {
      true: "border-ruby-muted group-pressed:border-ruby-vivid outline-ruby-vivid",
    },
    isDisabled: {
      true: "border-app-muted opacity-50",
    },
  },
  compoundVariants: [
    {
      isSelected: true,
      isInvalid: true,
      class:
        "bg-ruby-accent border-ruby-muted group-pressed:bg-ruby-vivid group-pressed:border-ruby-vivid shadow-[0_0px_10px_var(--color-ruby-muted)]",
    },
  ],
})

const iconStyles =
  "w-3.5 h-3.5 text-app-background forced-colors:text-[HighlightText]"

export function Checkbox(props: CheckboxProps) {
  return (
    <AriaCheckbox
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        checkboxStyles({ ...renderProps, className })
      )}
    >
      {composeRenderProps(
        props.children,
        (children, { isSelected, isIndeterminate, ...renderProps }) => (
          <>
            <div
              className={boxStyles({
                isSelected: isSelected || isIndeterminate,
                ...renderProps,
              })}
            >
              {isIndeterminate ? (
                <Minus aria-hidden className={iconStyles} />
              ) : isSelected ? (
                <Check aria-hidden className={iconStyles} />
              ) : null}
            </div>
            {children}
          </>
        )
      )}
    </AriaCheckbox>
  )
}
