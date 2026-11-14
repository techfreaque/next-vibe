/**
 * Media type of base64 image bytes, from their magic bytes.
 *
 * Providers reject an image whose declared media type does not match its
 * bytes (Anthropic: "The image was specified using the image/png media type,
 * but the image appears to be a image/jpeg image"). Generated images carry no
 * media type in the tool result and used to default to image/png, so every
 * follow-up turn after a JPEG generation failed with a 400 (prod 2026-11-14).
 */

/** Recognized type from the leading bytes, or null. */
export function sniffImageMediaType(base64: string): string | null {
  let head: string;
  try {
    // 16 base64 chars = the first 12 bytes, enough for every signature below
    head = atob(base64.slice(0, 16));
  } catch {
    return null;
  }
  const byte = (i: number): number => head.codePointAt(i) ?? -1;
  if (byte(0) === 0x89 && head.slice(1, 4) === "PNG") {
    return "image/png";
  }
  if (byte(0) === 0xff && byte(1) === 0xd8 && byte(2) === 0xff) {
    return "image/jpeg";
  }
  if (head.startsWith("GIF8")) {
    return "image/gif";
  }
  if (head.startsWith("RIFF") && head.slice(8, 12) === "WEBP") {
    return "image/webp";
  }
  return null;
}

/**
 * The bytes decide; the declared type is only a fallback for formats the
 * sniffer does not know.
 */
export function resolveImageMediaType(
  base64: string,
  declared: string | null | undefined,
): string {
  return sniffImageMediaType(base64) ?? declared ?? "image/png";
}
