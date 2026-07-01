import { writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export function downloadFile(
  filename: string,
  content: string,
  mimeType = "text/plain",
): void {
  void mimeType;
  const dest = join(homedir(), "Downloads", filename);
  try {
    writeFileSync(dest, content, "utf8");
  } catch {
    writeFileSync(filename, content, "utf8");
  }
}

export function downloadBinaryFile(
  filename: string,
  data: Uint8Array<ArrayBuffer>,
  mimeType = "application/octet-stream",
): void {
  void mimeType;
  const dest = join(homedir(), "Downloads", filename);
  try {
    writeFileSync(dest, data);
  } catch {
    writeFileSync(filename, data);
  }
}

export function downloadFromUrl(filename: string, url: string): void {
  void url;
  process.stdout.write(
    `Download not supported in terminal. Save manually as: ${filename}\n`,
  );
}
