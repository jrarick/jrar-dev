import { Button, type ButtonProps } from "~/components/button"
import { TextField, type TextFieldProps } from "~/components/text-field"
import { Checkbox } from "~/components/checkbox"
import { RadioGroup, Radio } from "~/components/radio-group"
import { Select, SelectItem } from "~/components/select"
import { Link } from "~/components/link"
import type { ComponentType, ReactNode } from "react"

export type ControlType = "select" | "boolean" | "text"

export interface ControlDef {
  type: ControlType
  label?: string
  options?: string[]
  description?: string
}

export interface ComponentDefinition<P = any> {
  name: string
  description: string
  component: ComponentType<P>
  controls: Record<keyof P | string, ControlDef>
  defaultProps?: Partial<P>
}

export const registry: Record<string, ComponentDefinition> = {
  button: {
    name: "Button",
    description:
      "A standard button component with standard, destructive, and quiet variants.",
    component: Button,
    defaultProps: {
      children: "Button",
      variant: "primary",
      isDisabled: false,
      isPending: false,
    },
    controls: {
      variant: {
        type: "select",
        options: ["primary", "secondary", "destructive", "quiet"],
      },
      isDisabled: { type: "boolean" },
      isPending: { type: "boolean" },
      children: { type: "text", label: "Label" },
    },
  },
  "text-field": {
    name: "TextField",
    description:
      "A text input with label, description, and error message support.",
    component: TextField,
    defaultProps: {
      label: "Username",
      description: "Enter your unique username.",
      placeholder: "johndoe",
      errorMessage: "",
      isDisabled: false,
      isInvalid: false,
      isReadOnly: false,
      isRequired: false,
    },
    controls: {
      label: { type: "text" },
      description: { type: "text" },
      placeholder: { type: "text" },
      errorMessage: { type: "text" },
      isDisabled: { type: "boolean" },
      isInvalid: { type: "boolean" },
      isReadOnly: { type: "boolean" },
      isRequired: { type: "boolean" },
    },
  },
  checkbox: {
    name: "Checkbox",
    description: "A binary selection input.",
    component: Checkbox,
    defaultProps: {
      children: "I agree to the terms",
      isSelected: false,
      isDisabled: false,
      isIndeterminate: false,
      isInvalid: false,
    },
    controls: {
      children: { type: "text", label: "Label" },
      isDisabled: { type: "boolean" },
      isIndeterminate: { type: "boolean" },
      isInvalid: { type: "boolean" },
      isSelected: { type: "boolean" },
    },
  },
  "radio-group": {
    name: "RadioGroup",
    description:
      "A set of checkable buttons, known as radio buttons, where no more than one of the buttons can be checked at a time.",
    component: RadioGroup,
    defaultProps: {
      label: "Favorite Pet",
      description: "Choose your favorite pet.",
      errorMessage: "Please select a pet.",
      isDisabled: false,
      isInvalid: false,
      isReadOnly: false,
      isRequired: false,
      children: (
        <>
          <Radio value="cat">Cat</Radio>
          <Radio value="dog">Dog</Radio>
          <Radio value="bird">Bird</Radio>
        </>
      ),
    },
    controls: {
      label: { type: "text" },
      description: { type: "text" },
      errorMessage: { type: "text" },
      isDisabled: { type: "boolean" },
      isInvalid: { type: "boolean" },
      isReadOnly: { type: "boolean" },
      isRequired: { type: "boolean" },
    },
  },
  select: {
    name: "Select",
    description:
      "A select displays a collapsible list of options and allows a user to select one.",
    component: Select,
    defaultProps: {
      label: "Favorite Color",
      description: "Pick a color.",
      errorMessage: "Selection required.",
      placeholder: "Select...",
      isDisabled: false,
      isInvalid: false,
      children: (
        <>
          <SelectItem id="red">Red</SelectItem>
          <SelectItem id="green">Green</SelectItem>
          <SelectItem id="blue">Blue</SelectItem>
        </>
      ),
    },
    controls: {
      label: { type: "text" },
      description: { type: "text" },
      errorMessage: { type: "text" },
      placeholder: { type: "text" },
      isDisabled: { type: "boolean" },
      isInvalid: { type: "boolean" },
    },
  },
  link: {
    name: "Link",
    description: "A navigational link.",
    component: Link,
    defaultProps: {
      children: "Click me",
      variant: "primary",
      href: "#",
      isDisabled: false,
    },
    controls: {
      children: { type: "text" },
      variant: {
        type: "select",
        options: ["primary", "secondary"],
      },
      isDisabled: { type: "boolean" },
    },
  },
}
