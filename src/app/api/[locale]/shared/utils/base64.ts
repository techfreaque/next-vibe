/**
 * Base64 encoding utilities for email templates
 */

/**
 * Converts a string to base64 encoding
 * @param input - The string to encode
 * @returns The base64 encoded string
 */
export function encodeBase64(input: string): string {
  return Buffer.from(input).toString("base64");
}

/**
 * Creates a data URL from content and MIME type
 * @param content - The content to encode
 * @param mimeType - The MIME type (e.g., 'image/svg+xml', 'image/png')
 * @returns A data URL string
 */
export function createDataUrl(content: string, mimeType: string): string {
  const base64Content = encodeBase64(content);
  // eslint-disable-next-line i18next/no-literal-string
  return `data:${mimeType};base64,${base64Content}`;
}

/**
 * Creates a data URL from base64 content and MIME type
 * @param base64Content - The base64 encoded content
 * @param mimeType - The MIME type (e.g., 'image/png', 'image/jpeg')
 * @returns A data URL string
 */
export function createDataUrlFromBase64(base64Content: string, mimeType: string): string {
  // eslint-disable-next-line i18next/no-literal-string
  const dataPrefix = "data:";
  // eslint-disable-next-line i18next/no-literal-string
  const base64Suffix = ";base64,";
  return dataPrefix + mimeType + base64Suffix + base64Content;
}

/**
 * Creates a transparent 1x1 pixel PNG data URL for placeholders
 * @returns A data URL for a transparent pixel
 */
export function createTransparentPixelDataUrl(): string {
  return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
}
