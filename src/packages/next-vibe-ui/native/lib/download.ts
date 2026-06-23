import { Linking } from "react-native";

export function downloadFile(
  filename: string,
  content: string,
  mimeType = "text/plain",
): void {
  void filename;
  void content;
  void mimeType;
}

export function downloadBinaryFile(
  filename: string,
  data: Uint8Array<ArrayBuffer>,
  mimeType = "application/octet-stream",
): void {
  void filename;
  void data;
  void mimeType;
}

export function downloadFromUrl(filename: string, url: string): void {
  void filename;
  Linking.openURL(url).catch(() => undefined);
}
