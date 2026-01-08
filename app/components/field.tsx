import {
  type FieldErrorProps,
  Group,
  type GroupProps,
  type InputProps,
  type LabelProps,
  FieldError as RACFieldError,
  Input as RACInput,
  Label as RACLabel,
  Text,
  type TextProps,
  composeRenderProps,
} from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { tv } from "tailwind-variants"
import { composeTailwindRenderProps, focusRing } from "~/lib/utils"

export function Label(props: LabelProps) {
  return (
    <RACLabel
      {...props}
      className={twMerge(
        "font-mono text-sm text-app-foreground font-medium cursor-default w-fit",
        props.className
      )}
    />
  )
}

export function Description(props: TextProps) {
  return (
    <Text
      {...props}
      slot="description"
      className={twMerge("text-sm text-app-muted", props.className)}
    />
  )
}

export function FieldError(props: FieldErrorProps) {
  return (
    <RACFieldError
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "text-sm text-ruby-vivid forced-colors:text-[Mark]"
      )}
    />
  )
}

export const fieldBorderStyles = tv({
  base: "transition",
  variants: {
    isFocusWithin: {
      false: "border-matrix-base forced-colors:border-[ButtonBorder]",
      true: "border-matrix-accent forced-colors:border-[Highlight] bg-linear-to-b from-transparent via-matrix-background/25 to-matrix-background/75",
    },
    isInvalid: {
      true: "border-ruby-base forced-colors:border-[Mark] outline-ruby-vivid selection:bg-ruby-vivid selection:text-app-background",
    },
    isDisabled: {
      true: "border-app-muted opacity-50 forced-colors:border-[GrayText]",
    },
  },
  compoundVariants: [
    {
      isFocused: true,
      isInvalid: true,
      className:
        "border-ruby-accent via-ruby-background/25 to-ruby-background/75",
    },
  ],
})

export const fieldGroupStyles = tv({
  extend: focusRing,
  base: "group flex items-center h-9 box-border bg-app-background forced-colors:bg-[Field] border-2 overflow-hidden transition",
  variants: fieldBorderStyles.variants,
  compoundVariants: fieldBorderStyles.compoundVariants,
})

export function FieldGroup(props: GroupProps) {
  return (
    <Group
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        fieldGroupStyles({ ...renderProps, className })
      )}
    />
  )
}

export function Input(props: InputProps) {
  return (
    <RACInput
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "px-3 py-0 min-h-9 flex-1 min-w-0 border-0 outline-0 bg-app-background font-mono text-sm text-app-foreground placeholder:text-app-muted disabled:text-app-muted [-webkit-tap-highlight-color:transparent]"
      )}
    />
  )
}
