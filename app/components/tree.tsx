import {
  Tree as AriaTree,
  TreeItem as AriaTreeItem,
  TreeItemContent as AriaTreeItemContent,
  Button,
  type TreeItemProps as AriaTreeItemProps,
  type TreeProps,
} from "react-aria-components"
import { ChevronRight } from "lucide-react"
import { tv } from "tailwind-variants"
import { Checkbox } from "./checkbox"
import { composeTailwindRenderProps, focusRing } from "~/lib/utils"

const itemStyles = tv({
  extend: focusRing,
  base: "relative font-mono flex group gap-3 cursor-default select-none py-1 px-3 text-sm text-app-foreground border-transparent -outline-offset-2",
  variants: {
    isSelected: {
      false:
        "hover:bg-primary-background/30 pressed:bg-primary-background/50 text-app-muted hover:text-primary-muted",
      true: "bg-primary-background text-primary-accent border-y-primary-muted z-20",
    },
    isActive: {
      true: "bg-primary-background text-primary-accent border-y-primary-muted z-20 hover:bg-primary-background hover:text-primary-accent",
    },
    isDisabled: {
      true: "text-app-muted/50 forced-colors:text-[GrayText] z-10",
    },
  },
})

export function Tree<T extends object>({ children, ...props }: TreeProps<T>) {
  return (
    <AriaTree
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "w-full max-w-full overflow-auto relative border border-primary-muted bg-app-background p-2"
      )}
    >
      {children}
    </AriaTree>
  )
}

const expandButton = tv({
  extend: focusRing,
  base: "border-0 p-0 bg-transparent shrink-0 w-6 h-6 rounded-none flex items-center justify-center text-start cursor-default [-webkit-tap-highlight-color:transparent] hover:bg-primary-background/30 text-primary-muted",
  variants: {
    isDisabled: {
      true: "text-app-muted/30 forced-colors:text-[GrayText]",
    },
  },
})

const chevron = tv({
  base: "w-4 h-4 text-primary-accent",
  variants: {
    isExpanded: {
      true: "transform rotate-90",
    },
    isDisabled: {
      true: "text-inherit",
    },
  },
})

export interface TreeItemProps extends Partial<AriaTreeItemProps> {
  title: string
  isActive?: boolean
}

export function TreeItem({
  title,
  children,
  isActive,
  ...props
}: TreeItemProps) {
  return (
    <AriaTreeItem
      className={(renderProps) => itemStyles({ ...renderProps, isActive })}
      textValue={title}
      {...props}
    >
      <AriaTreeItemContent>
        {({
          selectionMode,
          selectionBehavior,
          hasChildItems,
          isExpanded,
          isDisabled,
        }) => (
          <div className="flex items-center gap-2 min-w-0">
            {selectionMode !== "none" && selectionBehavior === "toggle" && (
              <Checkbox slot="selection" />
            )}
            <div className="shrink-0 w-[calc(calc(var(--tree-item-level)-1)*20px)]" />

            {hasChildItems ? (
              <Button slot="chevron" className={expandButton({ isDisabled })}>
                <ChevronRight
                  aria-hidden
                  className={chevron({ isExpanded, isDisabled })}
                />
              </Button>
            ) : (
              <div className="shrink-0 w-6 h-6" />
            )}

            <span className="truncate">{title}</span>
          </div>
        )}
      </AriaTreeItemContent>
      {children}
    </AriaTreeItem>
  )
}
