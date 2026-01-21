/**
 * Validates that a URL is safe to display/visit (http or https only).
 * Rejects javascript:, file:, data:, and other potentially dangerous protocols.
 */
export function isValidBookmarkUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
