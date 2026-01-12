import { XIcon } from "lucide-react"
import {
  Tag as AriaTag,
  TagGroup as AriaTagGroup,
  type TagGroupProps as AriaTagGroupProps,
  type TagProps as AriaTagProps,
  Button,
  TagList,
  type TagListProps,
  Text,
  composeRenderProps,
} from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { tv } from "tailwind-variants"
import { Description, Label } from "./field"
import { focusRing } from "~/lib/utils"

const tagStyles = tv({
  extend: focusRing,
  base: "transition cursor-default text-xs rounded-none border px-3 py-0.5 flex items-center max-w-fit gap-1 font-mono bg-app-background text-primary-muted border-primary-muted hover:border-primary-vivid [-webkit-tap-highlight-color:transparent]",
  variants: {
    allowsRemoving: {
      true: "pr-1",
    },
    isSelected: {
      true: "bg-primary-accent text-app-background border-primary-accent hover:border-primary-accent forced-colors:bg-[Highlight] forced-colors:text-[HighlightText] forced-color-adjust-none shadow-[0_0px_10px_var(--color-primary-muted)]",
    },
    isDisabled: {
      true: "bg-app-muted/10 text-app-muted border-app-muted/20 forced-colors:text-[GrayText]",
    },
  },
})

export interface TagGroupProps<T>
  extends Omit<AriaTagGroupProps, "children">,
    Pick<TagListProps<T>, "items" | "children" | "renderEmptyState"> {
  label?: string
  description?: string
  errorMessage?: string
}

export function TagGroup<T extends object>({
  label,
  description,
  errorMessage,
  items,
  children,
  renderEmptyState,
  ...props
}: TagGroupProps<T>) {
  return (
    <AriaTagGroup
      {...props}
      className={twMerge(
        "flex flex-col gap-2 font-mono group",
        props.className
      )}
    >
      <Label>{label}</Label>
      <TagList
        items={items}
        renderEmptyState={renderEmptyState}
        className="flex flex-wrap gap-2"
      >
        {children}
      </TagList>
      {description && <Description>{description}</Description>}
      {errorMessage && (
        <Text slot="errorMessage" className="text-sm text-ruby-accent">
          {errorMessage}
        </Text>
      )}
    </AriaTagGroup>
  )
}

const removeButtonStyles = tv({
  extend: focusRing,
  base: "cursor-default rounded-none transition-[background-color] p-0.5 flex items-center justify-center bg-transparent text-inherit border-0 hover:bg-primary-background hover:text-app-accent pressed:bg-primary-background/80",
})

export function Tag({ children, ...props }: AriaTagProps) {
  let textValue = typeof children === "string" ? children : undefined
  return (
    <AriaTag
      textValue={textValue}
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        tagStyles({ ...renderProps, className })
      )}
    >
      {composeRenderProps(
        children,
        (children, { allowsRemoving, isDisabled }) => (
          <>
            {children}
            {allowsRemoving && (
              <Button
                slot="remove"
                isDisabled={isDisabled}
                className={removeButtonStyles}
              >
                <XIcon aria-hidden className="w-3 h-3" />
              </Button>
            )}
          </>
        )
      )}
    </AriaTag>
  )
}
