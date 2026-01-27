import React from "react"
import {
  Button,
  ColorPicker as AriaColorPicker,
  type ColorPickerProps as AriaColorPickerProps,
  DialogTrigger,
} from "react-aria-components"
import { ColorSwatch } from "./color-swatch"
import { ColorArea } from "./color-area"
import { ColorSlider } from "./color-slider"
import { ColorField } from "./color-field"
import { Dialog } from "./dialog"
import { Popover } from "./popover"
import { tv } from "tailwind-variants"
import { focusRing } from "~/lib/utils"

const buttonStyles = tv({
  extend: focusRing,
  base: "border-0 bg-transparent flex gap-2 items-center cursor-default font-mono text-sm text-neutral-800 dark:text-neutral-200 [-webkit-tap-highlight-color:transparent]",
})

export interface ColorPickerProps extends Omit<
  AriaColorPickerProps,
  "children"
> {
  label?: string
  children?: React.ReactNode
}

export function ColorPicker({ label, children, ...props }: ColorPickerProps) {
  return (
    <AriaColorPicker {...props}>
      <DialogTrigger>
        <Button className={buttonStyles}>
          <ColorSwatch />
          <span>{label}</span>
        </Button>
        <Popover placement="bottom start">
          <Dialog className="flex flex-col gap-2 bg-primary-background/50">
            {children || (
              <>
                <ColorArea
                  colorSpace="hsb"
                  xChannel="saturation"
                  yChannel="brightness"
                />
                <ColorSlider colorSpace="hsb" channel="hue" />
                <ColorField label="Hex" />
              </>
            )}
          </Dialog>
        </Popover>
      </DialogTrigger>
    </AriaColorPicker>
  )
}
