/**
 * File utilities for incognito mode
 * Handles file conversion to base64 for storage in message metadata
 */

export interface IncognitoAttachment {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  data: string; // base64
}

/**
 * Allowed file types for chat attachments
 */
const ALLOWED_MIME_TYPES = [
  // Images
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  // Documents
  "application/pdf",
  "text/plain",
  "text/markdown",
  "text/csv",
  // Office documents
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
] as const;

/**
 * Validate file type
 */
export function isAllowedFileType(mimeType: string): boolean {
  return ALLOWED_MIME_TYPES.includes(mimeType as (typeof ALLOWED_MIME_TYPES)[number]);
}

/**
 * Convert File to base64 string
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1] ?? "";
      resolve(base64);
    });
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

/**
 * Convert files to incognito attachments
 */
export async function convertFilesToIncognitoAttachments(
  files: File[],
): Promise<IncognitoAttachment[]> {
  const attachments: IncognitoAttachment[] = [];

  for (const file of files) {
    if (!isAllowedFileType(file.type)) {
      // Skip invalid files instead of throwing
      continue;
    }

    const base64Data = await fileToBase64(file);

    attachments.push({
      id: crypto.randomUUID(),
      url: "", // Will be generated from base64 when displaying
      filename: file.name,
      mimeType: file.type,
      size: file.size,
      data: base64Data,
    });
  }

  return attachments;
}

/**
 * Generate blob URL from base64 data
 */
export function base64ToBlobUrl(base64: string, mimeType: string): string {
  const byteString = atob(base64);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([arrayBuffer], { type: mimeType });
  return URL.createObjectURL(blob);
}

/**
 * Convert base64 string to File object
 */
export function base64ToFile(base64: string, filename: string, mimeType: string): File {
  const byteString = atob(base64);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([arrayBuffer], { type: mimeType });
  return new File([blob], filename, { type: mimeType });
}

/**
 * Convert incognito attachments back to File objects
 */
export function convertIncognitoAttachmentsToFiles(attachments: IncognitoAttachment[]): File[] {
  return attachments
    .filter((att) => att.data)
    .map((att) => base64ToFile(att.data, att.filename, att.mimeType));
}

/**
 * Download file from URL and convert to File object
 * Used for branching/editing messages in private mode where attachments are stored as S3 URLs
 * Returns null if download fails
 */
export async function urlToFile(
  url: string,
  filename: string,
  mimeType: string,
): Promise<File | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
  } catch {
    return null;
  }
}
