"use client";

/**
 * File Attachments Display Component
 * Shows file attachments in chat messages
 * Handles both server-stored files (with URLs) and incognito files (with base64 data)
 */

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Download, FileText, Image as ImageIcon } from "next-vibe-ui/ui/icons";
import { Image } from "next-vibe-ui/ui/image";
import { Link } from "next-vibe-ui/ui/link";
import type { JSX } from "react";
import { useEffect, useState } from "react";

interface FileAttachment {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  data?: string; // base64 data for incognito mode
}

interface FileAttachmentsProps {
  attachments: FileAttachment[];
  className?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) {
    return "0 B";
  }
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}

function isImage(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}

function getFileIcon(mimeType: string): JSX.Element {
  if (isImage(mimeType)) {
    return <ImageIcon className="h-5 w-5 text-blue-500" />;
  }
  return <FileText className="h-5 w-5 text-gray-500" />;
}

export function FileAttachments({
  attachments,
  className,
}: FileAttachmentsProps): JSX.Element | null {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  return (
    <Div className={cn("flex flex-col gap-2 mt-2", className)}>
      {attachments.map((attachment) => (
        <FileAttachmentItem key={attachment.id} attachment={attachment} />
      ))}
    </Div>
  );
}

/**
 * Single file attachment item
 * Handles URL generation for incognito mode (base64 -> blob URL)
 */
function FileAttachmentItem({
  attachment,
}: {
  attachment: FileAttachment;
}): JSX.Element {
  const [displayUrl, setDisplayUrl] = useState<string>(attachment.url);
  const isImg = isImage(attachment.mimeType);

  // Detect if this is a server file URL (needs unoptimized rendering)
  // Server files: /api/.../files/... | Blob URLs: blob:http://...
  const isServerFile = Boolean(displayUrl && displayUrl.startsWith("/api/"));

  // Generate blob URL from base64 data for incognito mode
  useEffect(() => {
    if (attachment.data && !attachment.url) {
      // Incognito mode - generate blob URL from base64
      try {
        const byteString = atob(attachment.data);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
          uint8Array[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([arrayBuffer], { type: attachment.mimeType });
        const blobUrl = URL.createObjectURL(blob);
        setDisplayUrl(blobUrl);

        // Cleanup blob URL on unmount
        return (): void => {
          URL.revokeObjectURL(blobUrl);
        };
      } catch {
        // Failed to generate blob URL from base64
      }
    }
  }, [attachment.data, attachment.url, attachment.mimeType]);

  return (
    <Div className="border border-border rounded-lg overflow-hidden bg-background/50">
      {/* Image preview */}
      {isImg && displayUrl && (
        <Link
          href={displayUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Image
            src={displayUrl}
            alt={attachment.filename}
            width={800}
            height={600}
            unoptimized={isServerFile}
            className="w-full max-h-64 object-contain bg-muted"
          />
        </Link>
      )}

      {/* File info */}
      <Div className="flex items-center gap-2 p-2">
        <Div className="shrink-0">{getFileIcon(attachment.mimeType)}</Div>

        <Div className="flex-1 min-w-0">
          <Div className="text-sm font-medium truncate">
            {attachment.filename}
          </Div>
          <Div className="text-xs text-muted-foreground">
            {formatFileSize(attachment.size)}
          </Div>
        </Div>

        {displayUrl && (
          <Link
            href={displayUrl}
            download={attachment.filename}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 p-2 hover:bg-muted rounded-md transition-colors"
            title="Download file"
          >
            <Download className="h-4 w-4" />
          </Link>
        )}
      </Div>
    </Div>
  );
}
