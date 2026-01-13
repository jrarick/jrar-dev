import sharp from 'sharp'

/**
 * Convert SVG string to PNG buffer using sharp
 *
 * @param {string} svgString - The SVG content as a string
 * @returns {Promise<Buffer>} PNG image buffer
 */
export async function svgToPng(svgString) {
  try {
    const pngBuffer = await sharp(Buffer.from(svgString))
      .png({
        compressionLevel: 9,  // Maximum compression
        palette: true,        // Use palette for smaller file size
      })
      .toBuffer()

    return pngBuffer
  } catch (error) {
    console.error('SVG to PNG conversion failed:', error.message)
    throw error
  }
}
