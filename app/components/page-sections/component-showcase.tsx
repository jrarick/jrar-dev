import { useState } from "react"
import { TextField } from "~/components/text-field"
import { Select, SelectItem } from "~/components/select"
import { Checkbox } from "~/components/checkbox"
import type { ComponentDefinition, ControlDef } from "~/registry"
import { tv } from "tailwind-variants"

const controlStyles = tv({
  base: "flex flex-col gap-2",
})

interface ComponentShowcaseProps {
  definition: ComponentDefinition
}

export function ComponentShowcase({ definition }: ComponentShowcaseProps) {
  const [props, setProps] = useState(definition.defaultProps || {})
  const Component = definition.component

  const handlePropChange = (key: string, value: any) => {
    setProps((prev: any) => ({ ...prev, [key]: value }))
  }

  // Automatically wire up event handlers for known controlled props
  const derivedProps = { ...props }

  if (Object.keys(definition.controls).includes("isSelected")) {
    derivedProps.onChange = (val: boolean) =>
      handlePropChange("isSelected", val)
  }

  // For RadioGroup, etc.
  if (definition.component.name === "RadioGroup") {
    // NOTE: RadioGroup is often controlled via "value" or "firstName" etc.
    // but our registry definition for radio-group doesn't explicitly expose "value" in controls yet.
    // However, if we added "value" to controls, we'd bind it here.
    // For now, let's just solve Checkbox as requested.
  }

  return (
    <div className="grid grid-cols-1 @4xl/main:grid-cols-3 gap-8 items-start">
      {/* Main Preview Area */}
      <div className="@4xl/main:col-span-2 min-h-100 flex items-center justify-center p-12 border border-primary-muted bg-primary-background/20 relative overflow-hidden">
        {/* Background Grid Pattern (Visual Only) */}
        <div
          className="absolute inset-0 z-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--color-primary-muted) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative z-10">
          <Component {...derivedProps} />
        </div>
      </div>

      {/* Controls Panel */}
      <div className="@4xl/main:col-span-1 space-y-6 border border-primary-muted p-6 bg-app-background h-full">
        <h3 className="text-lg font-mono font-medium text-primary-vivid border-b border-primary-muted pb-2 mb-4">
          Levers
        </h3>

        <div className="space-y-4">
          {Object.entries(definition.controls).map(([key, def]) => (
            <Control
              key={key}
              name={key}
              def={def as ControlDef}
              value={props[key]}
              onChange={(val) => handlePropChange(key, val)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function Control({
  name,
  def,
  value,
  onChange,
}: {
  name: string
  def: ControlDef
  value: any
  onChange: (val: any) => void
}) {
  if (def.type === "select") {
    return (
      <div className={controlStyles()}>
        <Select
          label={def.label || name}
          selectedKey={value}
          onSelectionChange={(key) => onChange(key)}
          className="w-full"
        >
          {def.options?.map((opt) => (
            <SelectItem key={opt} id={opt}>
              {opt}
            </SelectItem>
          ))}
        </Select>
      </div>
    )
  }

  if (def.type === "boolean") {
    return (
      <div className={controlStyles()}>
        <Checkbox isSelected={!!value} onChange={onChange}>
          {def.label || name}
        </Checkbox>
      </div>
    )
  }

  if (def.type === "text") {
    return (
      <div className={controlStyles()}>
        <TextField
          label={def.label || name}
          value={value || ""}
          onChange={onChange}
        />
      </div>
    )
  }

  return null
}
