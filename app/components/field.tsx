import {
  type FieldErrorProps,
  Group,
  type GroupProps,
  type InputProps,
  type LabelProps,
  FieldError as RACFieldError,
  Input as RACInput,
  TextArea as RACTextArea,
  Label as RACLabel,
  Text,
  type TextProps,
  composeRenderProps,
  type TextAreaProps,
} from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { tv } from "tailwind-variants"
import { composeTailwindRenderProps, focusRing } from "~/lib/utils"

export function Label(props: LabelProps) {
  return (
    <RACLabel
      {...props}
      className={twMerge(
        "font-mono text-sm text-app-accent font-medium cursor-default w-fit group-invalid:selection:bg-ruby-vivid group-invalid:selection:text-app-background",
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
      className={twMerge("text-sm text-app-vivid", props.className)}
    />
  )
}

export function FieldError(props: FieldErrorProps) {
  return (
    <RACFieldError
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "text-sm text-ruby-accent forced-colors:text-[Mark] selection:bg-ruby-vivid selection:text-app-background"
      )}
    />
  )
}

export const fieldBorderStyles = tv({
  base: "transition",
  variants: {
    isFocusWithin: {
      false: "border-primary-muted forced-colors:border-[ButtonBorder]",
      true: "border-primary-accent forced-colors:border-[Highlight] bg-linear-to-b from-transparent via-primary-background/50 to-primary-background caret-primary-accent",
    },
    isInvalid: {
      true: "border-ruby-muted forced-colors:border-[Mark] outline-ruby-vivid selection:bg-ruby-vivid selection:text-app-background caret-ruby-vivid",
    },
    isDisabled: {
      true: "border-app-muted opacity-50 forced-colors:border-[GrayText]",
    },
  },
  compoundVariants: [
    {
      isFocused: true,
      isInvalid: true,
      className: "border-ruby-accent via-ruby-background/50 to-ruby-background",
    },
  ],
})

export const fieldGroupStyles = tv({
  extend: focusRing,
  base: "group flex items-center h-9 box-border bg-app-background forced-colors:bg-[Field] border overflow-hidden transition",
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
        "px-3 py-0 min-h-9 flex-1 min-w-0 border-0 outline-0 bg-app-background font-mono text-sm text-app-accent placeholder:text-app-muted disabled:text-app-muted [-webkit-tap-highlight-color:transparent]"
      )}
    />
  )
}

export function TextArea(props: TextAreaProps) {
  return (
    <RACTextArea
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "px-3 py-0 flex-1 min-w-0 min-h-24 border-0 outline-0 bg-app-background font-mono text-sm text-app-accent placeholder:text-app-muted disabled:text-app-muted [-webkit-tap-highlight-color:transparent]"
      )}
    />
  )
}
