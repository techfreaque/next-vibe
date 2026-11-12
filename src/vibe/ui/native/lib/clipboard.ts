import type { EndpointLogger } from "../../../logger/types";

export async function copyToClipboard(
  text: string,
  _logger: EndpointLogger,
): Promise<boolean> {
  void _logger;
  const Clipboard = await import("@react-native-clipboard/clipboard");
  Clipboard.default.setString(text);
  return true;
}

export async function copyImageToClipboard(
  url: string,
  _logger: EndpointLogger,
): Promise<boolean> {
  return copyToClipboard(url, _logger);
}

export function hasClipboardAccess(): boolean {
  return true;
}
