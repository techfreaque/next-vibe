/**
 * Inline `data:image/...` payloads (base64 or URL-encoded SVG). Pages embed
 * them as placeholders, icons and lazy-load stubs. In a tool result they are
 * pure token cost, and NanoGPT rejects the whole request for text-only models
 * when the prompt text contains one ("does not support image inputs", prod
 * 2026-11-27: GLM 5.3 Uncensored and Kimi K3.1 Pro Uncensored after
 * fetch-url-content results, 0 image parts on the wire).
 */
const INLINE_IMAGE_DATA_URI = /data:image\/[^\s)"'<>]*/gi;

/** Replace inline image payloads; never emits "data:image/" itself. */
export function stripInlineImageData(markdown: string): string {
  return markdown.replaceAll(INLINE_IMAGE_DATA_URI, "inline-image-omitted");
}
