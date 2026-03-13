/**
 * Email Image Component
 * Handles images for emails with Gmail optimization and base64 fallback
 */

import fs from "node:fs";
import path from "node:path";

import { Img } from "@react-email/components";
import type { JSX } from "react";

import { envClient } from "@/config/env-client";

interface EmailImageProps {
  src: string; // Relative path like "/images/unbottled-icon.png"
  alt: string;
  width?: string | number;
  height?: string | number;
  recipientEmail: string;
  style?: React.CSSProperties;
}

/**
 * Check if recipient uses Gmail
 */
function isGmailRecipient(email?: string): boolean {
  if (!email) {
    return false;
  }
  const domain = email.toLowerCase().split("@")[1];
  return domain === "gmail.com" || domain === "googlemail.com";
}

/**
 * Convert image to base64 data URL
 */
function getImageAsBase64(imagePath: string): string {
  try {
    // Remove leading slash and construct absolute path
    const relativePath = imagePath.startsWith("/")
      ? imagePath.slice(1)
      : imagePath;
    const absolutePath = path.join(process.cwd(), "public", relativePath);

    // Read file and convert to base64
    const imageBuffer = fs.readFileSync(absolutePath);
    const base64Image = imageBuffer.toString("base64");

    // Determine MIME type from extension
    const ext = path.extname(imagePath).toLowerCase();
    const mimeType =
      ext === ".png"
        ? "image/png"
        : ext === ".jpg" || ext === ".jpeg"
          ? "image/jpeg"
          : ext === ".svg"
            ? "image/svg+xml"
            : "image/png";

    return `data:${mimeType};base64,${base64Image}`;
  } catch {
    // Fallback to direct URL if base64 conversion fails
    return `${envClient.NEXT_PUBLIC_APP_URL}${imagePath}`;
  }
}

/**
 * Get optimized image URL for Gmail
 */
function getOptimizedImageUrl(
  imagePath: string,
  width?: string | number,
): string {
  const widthNum =
    typeof width === "string" ? parseInt(width, 10) : width || 32;
  const encodedPath = encodeURIComponent(imagePath);
  return `${envClient.NEXT_PUBLIC_APP_URL}/_next/image?url=${encodedPath}&w=${widthNum}&q=75`;
}

/**
 * Email Image Component
 * Uses Next.js optimized images for Gmail, base64 for others
 */
export function EmailImage({
  src,
  alt,
  width,
  height,
  recipientEmail,
  style,
}: EmailImageProps): JSX.Element {
  const isGmail = isGmailRecipient(recipientEmail);

  const imageSrc = isGmail
    ? getOptimizedImageUrl(src, width)
    : getImageAsBase64(src);

  return (
    <Img src={imageSrc} alt={alt} width={width} height={height} style={style} />
  );
}
