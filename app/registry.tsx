import { Button, type ButtonProps } from "~/components/button"
import { TextField, type TextFieldProps } from "~/components/text-field"
import { Checkbox } from "~/components/checkbox"
import { RadioGroup, Radio } from "~/components/radio-group"
import { Select, SelectItem } from "~/components/select"
import { Link } from "~/components/link"
import { Breadcrumbs, Breadcrumb } from "~/components/breadcrumbs"
import { TagGroup, Tag } from "~/components/tag-group"
import { Tree, TreeItem } from "~/components/tree"
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
      "Initiates a discrete execution sequence. Triggers an event handler upon strictly defined interaction parameters.",
    component: Button,
    defaultProps: {
      children: "Execute",
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
    description: "Accepts alphanumeric string input for variable assignment.",
    component: TextField,
    defaultProps: {
      label: "System Identifier",
      description: "Enter authorized user ID.",
      placeholder: "sys_admin_01",
      errorMessage: "Access Denied",
      isDisabled: false,
      isInvalid: false,
      isReadOnly: false,
    },
    controls: {
      label: { type: "text" },
      description: { type: "text" },
      placeholder: { type: "text" },
      errorMessage: { type: "text" },
      isDisabled: { type: "boolean" },
      isInvalid: { type: "boolean" },
      isReadOnly: { type: "boolean" },
    },
  },
  checkbox: {
    name: "Checkbox",
    description:
      "Binary state toggle. [ 0 | 1 ]. Represents a boolean value within the system configuration.",
    component: Checkbox,
    defaultProps: {
      children: "Enable Verbose Logging",
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
      "Mutually exclusive option selector. Enforces single-choice constraint across a related set of variables.",
    component: RadioGroup,
    defaultProps: {
      label: "Protocol Selection",
      description: "Select transmission protocol.",
      errorMessage: "Protocol verification failed.",
      isDisabled: false,
      isInvalid: false,
      isReadOnly: false,
      children: (
        <>
          <Radio value="tcp">TCP</Radio>
          <Radio value="udp">UDP</Radio>
          <Radio value="icmp">ICMP</Radio>
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
    },
  },
  select: {
    name: "Select",
    description:
      "Dropdown enumeration interface. Expands to reveal a list of pre-defined constants for assignment.",
    component: Select,
    defaultProps: {
      label: "Core Module",
      description: "Select active kernel.",
      errorMessage: "Module load failure.",
      placeholder: "Select module...",
      isDisabled: false,
      isInvalid: false,
      children: (
        <>
          <SelectItem id="net">NET_CORE</SelectItem>
          <SelectItem id="ui">UI_RENDER</SelectItem>
          <SelectItem id="db">DATA_STORE</SelectItem>
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
    description:
      "Hypertext reference pointer. Redirects the user agent to a specified URI resource.",
    component: Link,
    defaultProps: {
      children: "/sys/logs",
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
  breadcrumbs: {
    name: "Breadcrumbs",
    description:
      "Hierarchical navigation trail. Visualizes the current location within the directory structure or state machine.",
    component: Breadcrumbs,
    defaultProps: {
      children: (
        <>
          <Breadcrumb href="#">root</Breadcrumb>
          <Breadcrumb href="#">system</Breadcrumb>
          <Breadcrumb>config</Breadcrumb>
        </>
      ),
    },
    controls: {
      isDisabled: { type: "boolean" },
    },
  },
  "tag-group": {
    name: "TagGroup",
    description:
      "Collection of categorical identifiers. Used for filtering, sorting, or labeling data entities.",
    component: TagGroup,
    defaultProps: {
      label: "Request Type",
      selectionMode: "single",
      items: [
        { id: "1", name: "GET" },
        { id: "2", name: "POST" },
        { id: "3", name: "PUT" },
        { id: "4", name: "DELETE" },
      ],
      children: (item: any) => <Tag>{item.name}</Tag>,
    },
    controls: {
      label: { type: "text" },
      description: { type: "text" },
      errorMessage: { type: "text" },
      selectionMode: {
        type: "select",
        options: ["single", "multiple", "none"],
      },
    },
  },
  tree: {
    name: "Tree",
    description:
      "Recursive data structure visualization. Displays nested nodes and leaves in a collapsible hierarchy.",
    component: Tree,
    defaultProps: {
      aria_label: "Files",
      selectionMode: "multiple",
      children: (
        <>
          <TreeItem id="src" title="src">
            <TreeItem id="components" title="components">
              <TreeItem id="button" title="button.tsx" />
              <TreeItem id="input" title="input.tsx" />
            </TreeItem>
            <TreeItem id="hooks" title="hooks">
              <TreeItem id="use-auth" title="use-auth.ts" />
            </TreeItem>
          </TreeItem>
          <TreeItem id="public" title="public">
            <TreeItem id="robots" title="robots.txt" />
            <TreeItem id="favicon" title="favicon.ico" />
          </TreeItem>
        </>
      ),
    },
    controls: {
      aria_label: { type: "text", label: "Aria Label" },
      selectionMode: {
        type: "select",
        options: ["none", "single", "multiple"],
      },
    },
  },
}
