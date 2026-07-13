export async function copyToClipboard(text: string): Promise<boolean> {
  const Clipboard = await import("@react-native-clipboard/clipboard");
  Clipboard.default.setString(text);
  return true;
}

export async function copyImageToClipboard(url: string): Promise<boolean> {
  return copyToClipboard(url);
}

export function hasClipboardAccess(): boolean {
  return true;
}
