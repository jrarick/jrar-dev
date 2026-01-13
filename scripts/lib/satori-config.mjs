import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PUBLIC_DIR = path.resolve(__dirname, "../../public")

/**
 * OKLCH color tokens converted to hex approximations
 * Based on app/app.css color system
 */
export const colors = {
  // App base colors
  background: "#000000", // oklch(0 0 0) - Pure black
  muted: "#525252", // oklch(0.44 0 0) - Dark gray
  vivid: "#8f8f8f", // oklch(0.65 0 0) - Medium gray
  accent: "#f2f2f2", // oklch(0.96 0 0) - Near white

  // Primary colors (matrix green, hue 145)
  primaryBackground: "#05310b", // oklch(0.275 0.08 145)
  primaryMuted: "#11ad32", // oklch(0.65 0.2 145)
  primaryVivid: "#00e81d", // oklch(0.8 0.28 145)
  primaryAccent: "#00ff33", // oklch(0.88 0.32 145)
}

/**
 * Load Monaspace Neon font files as ArrayBuffers
 */
export async function loadFonts() {
  const fontsDir = path.join(PUBLIC_DIR, "monaspace-neon")

  try {
    const fonts = {
      regular: await fs.readFile(
        path.join(fontsDir, "MonaspaceNeonFrozen-Regular.ttf")
      ),
      medium: await fs.readFile(
        path.join(fontsDir, "MonaspaceNeonFrozen-Medium.ttf")
      ),
      bold: await fs.readFile(
        path.join(fontsDir, "MonaspaceNeonFrozen-Bold.ttf")
      ),
    }

    return fonts
  } catch (error) {
    console.error("Failed to load fonts:", error.message)
    throw new Error(
      "Could not load Monaspace Neon fonts. Ensure font files exist in /public/monaspace-neon/"
    )
  }
}

/**
 * Create Satori configuration with loaded fonts
 */
export async function createSatoriConfig() {
  const fonts = await loadFonts()

  return {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Monaspace Neon",
        data: fonts.regular,
        weight: 400,
        style: "normal",
      },
      {
        name: "Monaspace Neon",
        data: fonts.medium,
        weight: 500,
        style: "normal",
      },
      {
        name: "Monaspace Neon",
        data: fonts.bold,
        weight: 700,
        style: "normal",
      },
    ],
  }
}
