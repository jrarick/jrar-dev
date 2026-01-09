import { ChevronDown } from "lucide-react"
import React from "react"
import {
  Select as AriaSelect,
  type SelectProps as AriaSelectProps,
  Button,
  ListBox,
  type ListBoxItemProps,
  SelectValue,
  type ValidationResult,
} from "react-aria-components"
import { tv } from "tailwind-variants"
import { Description, FieldError, Label, fieldBorderStyles } from "./field"
import {
  DropdownItem,
  DropdownSection,
  type DropdownSectionProps,
} from "./list-box"
import { Popover } from "./popover"
import { composeTailwindRenderProps, focusRing } from "~/lib/utils"

const styles = tv({
  extend: focusRing,
  base: "flex items-center text-start gap-4 w-full font-mono border cursor-default pl-3 pr-2 h-9 min-w-[180px] transition bg-app-background [-webkit-tap-highlight-color:transparent]",
  variants: {
    isFocusVisible: fieldBorderStyles.variants.isFocusWithin,
    isInvalid: fieldBorderStyles.variants.isInvalid,
    isDisabled: {
      false:
        "text-app-accent hover:bg-primary-background/20 pressed:bg-primary-background/30",
      true: "border-transparent text-app-muted forced-colors:text-[GrayText] bg-app-muted/10",
    },
  },
  compoundVariants: [
    {
      isFocusVisible: true,
      isInvalid: true,
      className:
        "border-ruby-accent via-ruby-background/25 to-ruby-background/75 outline-ruby-vivid",
    },
  ],
})

export interface SelectProps<T extends object>
  extends Omit<AriaSelectProps<T>, "children"> {
  label?: string
  description?: string
  errorMessage?: string | ((validation: ValidationResult) => string)
  items?: Iterable<T>
  children: React.ReactNode | ((item: T) => React.ReactNode)
}

export function Select<T extends object>({
  label,
  description,
  errorMessage,
  children,
  items,
  ...props
}: SelectProps<T>) {
  return (
    <AriaSelect
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "group flex flex-col gap-1 relative font-mono"
      )}
    >
      {({ isOpen, isInvalid }) => (
        <>
          {label && <Label>{label}</Label>}
          <Button
            className={(renderProps) =>
              styles({
                ...renderProps,
                isFocusVisible: renderProps.isFocusVisible || isOpen,
                isInvalid,
              })
            }
          >
            <SelectValue className="flex-1 text-sm">
              {({ selectedText, defaultChildren }) =>
                selectedText || defaultChildren
              }
            </SelectValue>
            <ChevronDown
              aria-hidden
              className="w-4 h-4 text-app-vivid forced-colors:text-[ButtonText] group-disabled:text-app-muted forced-colors:group-disabled:text-[GrayText]"
            />
          </Button>
          {description && <Description>{description}</Description>}
          <FieldError>{errorMessage}</FieldError>
          <Popover className="min-w-(--trigger-width)">
            <ListBox
              items={items}
              className="outline-hidden box-border p-1 max-h-[inherit] overflow-auto [clip-path:inset(0_0_0_0_round_.75rem)]"
            >
              {children}
            </ListBox>
          </Popover>
        </>
      )}
    </AriaSelect>
  )
}

export function SelectItem(props: ListBoxItemProps) {
  return <DropdownItem {...props} />
}

export function SelectSection<T extends object>(
  props: DropdownSectionProps<T>
) {
  return <DropdownSection {...props} />
}
