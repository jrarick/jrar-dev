import type { ComponentDefinition, ControlDef } from "~/registry"
import type { ComponentType } from "react"
import { useState } from "react"

interface ComponentShowcaseProps {
  definition: ComponentDefinition
}

// Filter out text controls and isSelected, keep only boolean and select
function getStateControls(
  controls: Record<string, ControlDef>
): Record<string, ControlDef> {
  return Object.entries(controls).reduce((acc, [key, def]) => {
    // Skip isSelected - let users toggle it manually
    if (key === "isSelected") {
      return acc
    }
    if (def.type === "boolean" || def.type === "select") {
      acc[key] = def
    }
    return acc
  }, {} as Record<string, ControlDef>)
}

// Generate variants showing each prop independently
function generateVariants(
  definition: ComponentDefinition,
  stateControls: Record<string, ControlDef>
): Array<{ props: any; label: string }> {
  const variants: Array<{ props: any; label: string }> = []
  const baseProps = { ...definition.defaultProps }

  // Add default variant (all props at defaults)
  variants.push({
    props: { ...baseProps },
    label: "default",
  })

  // For each state control, create variant(s)
  for (const [key, control] of Object.entries(stateControls)) {
    if (control.type === "select" && control.options) {
      // Create one variant per option (skip if it matches default)
      for (const option of control.options) {
        if (baseProps[key] === option) {
          continue // Skip variants identical to default
        }
        variants.push({
          props: { ...baseProps, [key]: option },
          label: `${key}: ${option}`,
        })
      }
    } else if (control.type === "boolean") {
      // Create variant with true value only (skip if default is already true)
      if (baseProps[key] === true) {
        continue // Skip if default is already true
      }
      variants.push({
        props: { ...baseProps, [key]: true },
        label: key,
      })
    }
  }

  return variants
}

interface VariantCardProps {
  Component: ComponentType<any>
  props: any
  label: string
  hasIsSelected: boolean
}

function VariantCard({
  Component,
  props,
  label,
  hasIsSelected,
}: VariantCardProps) {
  // Allow interactive toggling for components with isSelected
  const [isSelected, setIsSelected] = useState(
    props.isSelected !== undefined ? props.isSelected : false
  )

  const derivedProps = { ...props }
  if (hasIsSelected) {
    derivedProps.isSelected = isSelected
    derivedProps.onChange = setIsSelected
  }

  return (
    <div className="flex flex-col border border-primary-muted">
      {/* Component preview area with grid pattern */}
      <div className="relative p-8 flex items-center justify-center min-h-72">
        {/* Grid pattern background */}
        <div className="absolute inset-0 opacity-30 bg-primary-background/50">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
radial-gradient(circle, var(--color-primary-muted) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          />
        </div>

        {/* Component */}
        <div className="relative z-10">
          <Component {...derivedProps} />
        </div>
      </div>

      {/* Label */}
      <div className="border-t border-primary-muted bg-app-background px-4 py-2">
        <p className="text-xs font-mono text-primary-muted">{label}</p>
      </div>
    </div>
  )
}

export function ComponentShowcase({ definition }: ComponentShowcaseProps) {
  const stateControls = getStateControls(definition.controls)
  const variants = generateVariants(definition, stateControls)

  return (
    <div className="space-y-8">
      {/* Variant grid */}
      <div className="grid grid-cols-1 @2xl/main:grid-cols-2 @5xl/main:grid-cols-3 gap-6">
        {variants.map((variant, idx) => {
          const hasIsSelected = Object.keys(definition.controls).includes(
            "isSelected"
          )

          return (
            <VariantCard
              key={idx}
              Component={definition.component}
              props={variant.props}
              label={variant.label}
              hasIsSelected={hasIsSelected}
            />
          )
        })}
      </div>
    </div>
  )
}
