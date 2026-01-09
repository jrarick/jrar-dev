import {
  TextField as AriaTextField,
  TextArea,
  type TextFieldProps as AriaTextFieldProps,
  type ValidationResult,
} from "react-aria-components"
import { tv } from "tailwind-variants"
import {
  Description,
  FieldError,
  Input,
  Label,
  fieldBorderStyles,
} from "./field"
import { composeTailwindRenderProps, focusRing } from "~/lib/utils"

const inputStyles = tv({
  extend: focusRing,
  base: "border min-h-9 font-mono text-sm py-0 px-3 box-border transition",
  variants: {
    isFocused: fieldBorderStyles.variants.isFocusWithin,
    isInvalid: fieldBorderStyles.variants.isInvalid,
    isDisabled: fieldBorderStyles.variants.isDisabled,
  },
  compoundVariants: fieldBorderStyles.compoundVariants,
})

const textareaStyles = tv({
  extend: focusRing,
  base: "border min-h-16 font-mono text-sm py-1.5 px-3 box-border transition",
  variants: {
    isFocused: fieldBorderStyles.variants.isFocusWithin,
    isInvalid: fieldBorderStyles.variants.isInvalid,
    isDisabled: fieldBorderStyles.variants.isDisabled,
  },
  compoundVariants: fieldBorderStyles.compoundVariants,
})

export interface TextFieldProps extends AriaTextFieldProps {
  label?: string
  description?: string
  placeholder?: string
  errorMessage?: string | ((validation: ValidationResult) => string)
}

export function TextField({
  label,
  description,
  errorMessage,
  kind = "input",
  ...props
}: TextFieldProps & { kind?: "input" | "textarea" }) {
  return (
    <AriaTextField
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "flex flex-col gap-1 font-mono group"
      )}
    >
      {label && <Label>{label}</Label>}
      {kind === "input" ? (
        <Input className={inputStyles} />
      ) : (
        <TextArea className={textareaStyles} />
      )}
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaTextField>
  )
}
