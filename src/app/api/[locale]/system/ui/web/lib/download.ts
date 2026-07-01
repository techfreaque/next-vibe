export function downloadFile(
  filename: string,
  content: string,
  mimeType = "text/plain",
): void {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([content], { type: mimeType }));
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function downloadBinaryFile(
  filename: string,
  data: Uint8Array<ArrayBuffer>,
  mimeType = "application/octet-stream",
): void {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadFromUrl(filename: string, url: string): void {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.target = "_blank";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
