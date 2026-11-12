import type { EndpointLogger } from "../../../logger/types";

/**
 * Copy text to the clipboard. Resolves false when the browser denies access
 * (insecure context, permission denied, document not focused). Pass a logger
 * so the denial reaches the error log instead of vanishing.
 */
export async function copyToClipboard(
  text: string,
  logger: EndpointLogger,
): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    logger.warn("Clipboard write failed", {
      operation: "copyToClipboard",
      error: error instanceof Error ? error.message : String(error),
      errorName: error instanceof Error ? error.name : undefined,
      textLength: text.length,
    });
    return false;
  }
}

export async function copyImageToClipboard(
  url: string,
  logger: EndpointLogger,
): Promise<boolean> {
  try {
    // oxlint-disable-next-line restricted/no-raw-fetch
    const res = await fetch(url);
    const blob = await res.blob();
    const mimeType = blob.type || "image/png";
    await navigator.clipboard.write([new ClipboardItem({ [mimeType]: blob })]);
    return true;
  } catch (error) {
    // Recovered: falls back to copying the URL as text
    logger.warn("Clipboard image write failed, falling back to URL text", {
      operation: "copyImageToClipboard",
      error: error instanceof Error ? error.message : String(error),
      errorName: error instanceof Error ? error.name : undefined,
    });
    return copyToClipboard(url, logger);
  }
}

export function hasClipboardAccess(): boolean {
  return "clipboard" in navigator;
}
