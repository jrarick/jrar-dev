import { Check } from "lucide-react"
import React from "react"
import {
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  type ListBoxProps as AriaListBoxProps,
  Collection,
  Header,
  type ListBoxItemProps,
  ListBoxSection,
  type SectionProps,
  composeRenderProps,
} from "react-aria-components"
import { tv } from "tailwind-variants"
import { composeTailwindRenderProps, focusRing } from "~/lib/utils"

interface ListBoxProps<T>
  extends Omit<AriaListBoxProps<T>, "layout" | "orientation"> {}

export function ListBox<T extends object>({
  children,
  ...props
}: ListBoxProps<T>) {
  return (
    <AriaListBox
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "outline-0 p-1 w-[200px] bg-app-background border border-primary-background rounded-none font-mono"
      )}
    >
      {children}
    </AriaListBox>
  )
}

export const itemStyles = tv({
  extend: focusRing,
  base: "group relative flex items-center gap-8 cursor-default select-none py-1.5 px-2.5 rounded-none will-change-transform text-sm forced-color-adjust-none",
  variants: {
    isSelected: {
      false:
        "text-app-accent hover:bg-primary-background hover:text-primary-vivid pressed:bg-primary-background -outline-offset-2",
      true: "bg-primary-base text-app-background forced-colors:bg-[Highlight] forced-colors:text-[HighlightText] [&:has(+[data-selected])]:rounded-b-none [&+[data-selected]]:rounded-t-none -outline-offset-4 outline-primary-accent forced-colors:outline-[HighlightText]",
    },
    isDisabled: {
      true: "text-app-muted forced-colors:text-[GrayText]",
    },
  },
})

export function ListBoxItem(props: ListBoxItemProps) {
  let textValue =
    props.textValue ||
    (typeof props.children === "string" ? props.children : undefined)
  return (
    <AriaListBoxItem {...props} textValue={textValue} className={itemStyles}>
      {composeRenderProps(props.children, (children) => (
        <>
          {children}
          <div className="absolute left-4 right-4 bottom-0 h-px bg-app-accent/10 forced-colors:bg-[HighlightText] hidden [.group[data-selected]:has(+[data-selected])_&]:block" />
        </>
      ))}
    </AriaListBoxItem>
  )
}

export const dropdownItemStyles = tv({
  base: "group flex items-center gap-4 cursor-default select-none py-2 pl-3 pr-3 selected:pr-1 rounded-none outline-0 text-sm forced-color-adjust-none no-underline [[href]]:cursor-pointer [-webkit-tap-highlight-color:transparent]",
  variants: {
    isDisabled: {
      false: "text-app-accent",
      true: "text-app-muted forced-colors:text-[GrayText]",
    },
    isPressed: {
      true: "bg-primary-background",
    },
    isFocused: {
      true: "bg-primary-accent text-app-background forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]",
    },
  },
  compoundVariants: [
    {
      isFocused: false,
      isOpen: true,
      className: "bg-primary-background/60",
    },
  ],
})

export function DropdownItem(props: ListBoxItemProps) {
  let textValue =
    props.textValue ||
    (typeof props.children === "string" ? props.children : undefined)
  return (
    <AriaListBoxItem
      {...props}
      textValue={textValue}
      className={dropdownItemStyles}
    >
      {composeRenderProps(props.children, (children, { isSelected }) => (
        <>
          <span className="flex items-center flex-1 gap-2 font-normal truncate group-selected:font-semibold">
            {children}
          </span>
          <span className="flex items-center w-5">
            {isSelected && <Check className="w-4 h-4" />}
          </span>
        </>
      ))}
    </AriaListBoxItem>
  )
}

export interface DropdownSectionProps<T> extends SectionProps<T> {
  title?: string
  items?: any
}

export function DropdownSection<T extends object>(
  props: DropdownSectionProps<T>
) {
  return (
    <ListBoxSection className="first:-mt-[5px] after:content-[''] after:block after:h-[5px] last:after:hidden">
      <Header className="text-sm font-semibold text-app-muted px-4 py-1 truncate sticky -top-[5px] -mt-px -mx-1 z-10 bg-app-muted/90 backdrop-blur-md supports-[-moz-appearance:none]:bg-app-muted border-y border-y-primary-background [&+*]:mt-1">
        {props.title}
      </Header>
      <Collection items={props.items}>{props.children}</Collection>
    </ListBoxSection>
  )
}
