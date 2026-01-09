import type { ReactNode } from "react"
import {
  composeRenderProps,
  Radio as RACRadio,
  RadioGroup as RACRadioGroup,
  type RadioGroupProps as RACRadioGroupProps,
  type RadioProps,
  type ValidationResult,
} from "react-aria-components"
import { tv } from "tailwind-variants"
import { Description, FieldError, Label } from "./field"
import { composeTailwindRenderProps, focusRing } from "~/lib/utils"

export interface RadioGroupProps extends Omit<RACRadioGroupProps, "children"> {
  label?: string
  children?: ReactNode
  description?: string
  errorMessage?: string | ((validation: ValidationResult) => string)
}

export function RadioGroup(props: RadioGroupProps) {
  return (
    <RACRadioGroup
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "group flex flex-col gap-2 font-mono"
      )}
    >
      <Label>{props.label}</Label>
      <div className="flex group-orientation-vertical:flex-col gap-2 group-orientation-horizontal:gap-4">
        {props.children}
      </div>
      {props.description && <Description>{props.description}</Description>}
      <FieldError>{props.errorMessage}</FieldError>
    </RACRadioGroup>
  )
}

const styles = tv({
  extend: focusRing,
  base: "w-4.5 h-4.5 box-border rounded-none border bg-app-background transition-all",
  variants: {
    isSelected: {
      false: "border-primary-muted group-pressed:border-primary-vivid",
      true: "border-[6px] border-primary-accent forced-colors:border-[Highlight]! group-pressed:border-primary-vivid shadow-[0_0px_10px_var(--color-primary-muted)]",
    },
    isInvalid: {
      true: "border-ruby-muted group-pressed:border-ruby-vivid outline-ruby-vivid forced-colors:border-[Mark]!",
    },
    isDisabled: {
      true: "border-app-muted opacity-50 forced-colors:border-[GrayText]!",
    },
  },
  compoundVariants: [
    {
      isSelected: true,
      isInvalid: true,
      class:
        "border-ruby-accent group-pressed:border-ruby-vivid shadow-[0_0px_10px_var(--color-ruby-muted)]",
    },
  ],
})

export function Radio(props: RadioProps) {
  return (
    <RACRadio
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "flex relative gap-2 items-center group text-app-accent disabled:text-app-muted forced-colors:disabled:text-[GrayText] text-sm transition [-webkit-tap-highlight-color:transparent] group-invalid:selection:bg-ruby-vivid"
      )}
    >
      {composeRenderProps(props.children, (children, renderProps) => (
        <>
          <div className={styles(renderProps)} />
          {children}
        </>
      ))}
    </RACRadio>
  )
}
