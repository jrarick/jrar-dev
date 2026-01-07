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
import { Description, FieldError, Label } from "./field"
import {
  DropdownItem,
  DropdownSection,
  type DropdownSectionProps,
} from "./list-box"
import { Popover } from "./popover"
import { composeTailwindRenderProps, focusRing } from "~/lib/utils"

const styles = tv({
  extend: focusRing,
  base: "flex items-center text-start gap-4 w-full font-mono border border-matrix-muted cursor-default pl-3 pr-2 h-9 min-w-[180px] transition bg-app-background [-webkit-tap-highlight-color:transparent]",
  variants: {
    isDisabled: {
      false:
        "text-app-foreground hover:bg-matrix-muted/20 pressed:bg-matrix-muted/30 group-invalid:outline group-invalid:outline-ruby-vivid forced-colors:group-invalid:outline-[Mark]",
      true: "border-transparent text-app-muted forced-colors:text-[GrayText] bg-app-muted/10",
    },
  },
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
      {label && <Label>{label}</Label>}
      <Button className={styles}>
        <SelectValue className="flex-1 text-sm">
          {({ selectedText, defaultChildren }) =>
            selectedText || defaultChildren
          }
        </SelectValue>
        <ChevronDown
          aria-hidden
          className="w-4 h-4 text-app-muted forced-colors:text-[ButtonText] group-disabled:text-app-muted_50 forced-colors:group-disabled:text-[GrayText]"
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
