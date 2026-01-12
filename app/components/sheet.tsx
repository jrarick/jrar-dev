import {
  Modal,
  ModalOverlay,
  type ModalOverlayProps,
  composeRenderProps,
} from "react-aria-components"
import { tv } from "tailwind-variants"

const overlayStyles = tv({
  base: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
  variants: {
    isEntering: {
      true: "animate-in fade-in duration-200 ease-out backdrop-blur-sm",
    },
    isExiting: {
      true: "animate-out fade-out duration-150 ease-in backdrop-blur-sm",
    },
  },
})

const sheetStyles = tv({
  base: "fixed z-50 bg-app-background py-6 shadow-lg transition ease-in-out border-r border-primary-muted h-full",
  variants: {
    side: {
      left: "inset-y-0 left-0 w-72 border-r",
      right: "inset-y-0 right-0 w-72 border-l",
      top: "inset-x-0 top-0 border-b",
      bottom: "inset-x-0 bottom-0 border-t",
    },
    isEntering: {
      true: "animate-in duration-200",
    },
    isExiting: {
      true: "animate-out duration-150",
    },
  },
  compoundVariants: [
    {
      side: "left",
      isEntering: true,
      class: "slide-in-from-left",
    },
    {
      side: "left",
      isExiting: true,
      class: "slide-out-to-left",
    },
    {
      side: "right",
      isEntering: true,
      class: "slide-in-from-right",
    },
    {
      side: "right",
      isExiting: true,
      class: "slide-out-to-right",
    },
    {
      side: "top",
      isEntering: true,
      class: "slide-in-from-top",
    },
    {
      side: "top",
      isExiting: true,
      class: "slide-out-to-top",
    },
    {
      side: "bottom",
      isEntering: true,
      class: "slide-in-from-bottom",
    },
    {
      side: "bottom",
      isExiting: true,
      class: "slide-out-to-bottom",
    },
  ],
  defaultVariants: {
    side: "left",
  },
})

interface SheetProps extends ModalOverlayProps {
  side?: "left" | "right" | "top" | "bottom"
}

export function Sheet({ side = "left", ...props }: SheetProps) {
  return (
    <ModalOverlay
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        overlayStyles({ ...renderProps, className })
      )}
    >
      <Modal
        {...props}
        className={composeRenderProps(
          props.className,
          (className, renderProps) =>
            sheetStyles({ ...renderProps, side, className })
        )}
      />
    </ModalOverlay>
  )
}
