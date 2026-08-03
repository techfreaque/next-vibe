export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export async function copyImageToClipboard(url: string): Promise<boolean> {
  try {
    // oxlint-disable-next-line restricted/no-raw-fetch
    const res = await fetch(url);
    const blob = await res.blob();
    const mimeType = blob.type || "image/png";
    await navigator.clipboard.write([new ClipboardItem({ [mimeType]: blob })]);
    return true;
  } catch {
    return copyToClipboard(url);
  }
}

export function hasClipboardAccess(): boolean {
  return "clipboard" in navigator;
}
