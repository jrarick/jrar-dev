import { useEffect, useRef, useState } from "react"
import type { Route } from "./+types/qr-code-generator"
import { TextField } from "~/components/text-field"
import { Select, SelectItem } from "~/components/select"
import { Button } from "~/components/button"
import { ColorPicker } from "~/components/color-picker"
import { parseColor } from "react-aria-components"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "QR Code Generator | jrar.dev" },
    { name: "description", content: "Generate custom QR codes" },
  ]
}

type QRSize = "small" | "medium" | "large"
type ErrorCorrectionLevel = "L" | "M" | "Q" | "H"

const QR_SIZES: Record<QRSize, number> = {
  small: 256,
  medium: 384,
  large: 512,
}

const ERROR_CORRECTION_LABELS: Record<ErrorCorrectionLevel, string> = {
  L: "Low (7%)",
  M: "Medium (15%)",
  Q: "Quartile (25%)",
  H: "High (30%)",
}

export default function QRCodeGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [text, setText] = useState("")
  const [size, setSize] = useState<QRSize>("medium")
  const [errorCorrection, setErrorCorrection] =
    useState<ErrorCorrectionLevel>("M")
  const [foreground, setForeground] = useState("#00ff00")
  const [background, setBackground] = useState("#000000")

  // Generate QR code whenever inputs change (client-side only)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !text) return

    // Only run on client to avoid SSR issues with qrcode library
    if (typeof window === "undefined") return

    // Dynamic import to avoid SSR issues
    import("qrcode").then((QRCode) => {
      QRCode.toCanvas(
        canvas,
        text,
        {
          width: QR_SIZES[size],
          margin: 2,
          color: {
            dark: foreground,
            light: background,
          },
          errorCorrectionLevel: errorCorrection,
        },
        (error) => {
          if (error) console.error(error)
        },
      )
    })
  }, [text, size, foreground, background, errorCorrection])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = "qr-code.png"
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="container mx-auto px-4 max-w-7xl space-y-6 py-24">
      <div>
        <h1 className="text-4xl font-mono text-primary-accent">
          QR Code Generator
        </h1>
        <p className="text-primary-muted mt-2">
          Generate custom QR codes with real-time preview
        </p>
      </div>

      <div className="grid @3xl/main:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="border border-primary-background bg-app-muted/20 p-6 flex flex-col gap-4">
          <h2 className="text-xl font-mono text-primary-vivid">Settings</h2>

          <TextField
            label="Text or URL"
            value={text}
            onChange={setText}
            placeholder="https://google.com"
          />

          <Select
            label="Size"
            value={size}
            onChange={(key) => setSize(key as QRSize)}
          >
            <SelectItem id="small">Small (256px)</SelectItem>
            <SelectItem id="medium">Medium (384px)</SelectItem>
            <SelectItem id="large">Large (512px)</SelectItem>
          </Select>

          <Select
            label="Error Correction"
            value={errorCorrection}
            onChange={(key) => setErrorCorrection(key as ErrorCorrectionLevel)}
            description="Higher levels allow more damage but increase size"
          >
            {(
              Object.keys(ERROR_CORRECTION_LABELS) as ErrorCorrectionLevel[]
            ).map((level) => (
              <SelectItem key={level} id={level}>
                {ERROR_CORRECTION_LABELS[level]}
              </SelectItem>
            ))}
          </Select>

          <div className="grid grid-cols-2 gap-4">
            <ColorPicker
              label="Foreground"
              value={parseColor(foreground)}
              onChange={(color) => setForeground(color.toString("hex"))}
            />
            <ColorPicker
              label="Background"
              value={parseColor(background)}
              onChange={(color) => setBackground(color.toString("hex"))}
            />
          </div>
        </div>

        {/* Preview */}
        <div className="border border-primary-background bg-app-muted/20 p-6 flex flex-col gap-4">
          <h2 className="text-xl font-mono text-primary-vivid">Preview</h2>

          <div className="flex flex-col items-center justify-center flex-1 gap-4">
            <div className="border border-primary-muted p-4 bg-app-background">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto block"
                style={{ imageRendering: "pixelated" }}
              />
            </div>

            <Button onPress={handleDownload} variant="primary">
              Download PNG
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
