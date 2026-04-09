"use client";

/**
 * File Attachments Display Component
 * Per-type rendering: images (preview), video (player), audio (player), generic (icon row).
 * Handles server-stored files (URL) and incognito files (base64 → blob URL).
 */

import { Audio } from "next-vibe-ui/ui/audio";
import { Div } from "next-vibe-ui/ui/div";
import { Download } from "next-vibe-ui/ui/icons/Download";
import { FileText } from "next-vibe-ui/ui/icons/FileText";
import { Film } from "next-vibe-ui/ui/icons/Film";
import { Image as ImageIcon } from "next-vibe-ui/ui/icons/Image";
import { Music } from "next-vibe-ui/ui/icons/Music";
import { Image } from "next-vibe-ui/ui/image";
import { ExternalLink } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import { Video } from "next-vibe-ui/ui/video";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import { useEffect, useState } from "react";

interface FileAttachment {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  data?: string; // base64 for incognito mode
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

function isVideo(mimeType: string): boolean {
  return mimeType.startsWith("video/");
}

function isAudio(mimeType: string): boolean {
  return mimeType.startsWith("audio/");
}

function FileTypeIcon({
  mimeType,
  className,
}: {
  mimeType: string;
  className?: string;
}): JSX.Element {
  if (isImage(mimeType)) {
    return <ImageIcon className={cn("h-4 w-4", className)} />;
  }
  if (isVideo(mimeType)) {
    return <Film className={cn("h-4 w-4", className)} />;
  }
  if (isAudio(mimeType)) {
    return <Music className={cn("h-4 w-4", className)} />;
  }
  return <FileText className={cn("h-4 w-4", className)} />;
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
 * Single file attachment - picks the right renderer per media type.
 */
function FileAttachmentItem({
  attachment,
}: {
  attachment: FileAttachment;
}): JSX.Element {
  const [displayUrl, setDisplayUrl] = useState<string>(attachment.url);

  // Generate blob URL from base64 for incognito mode
  useEffect(() => {
    if (attachment.data && !attachment.url) {
      try {
        const byteString = atob(attachment.data);
        const ab = new ArrayBuffer(byteString.length);
        const ua = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ua[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: attachment.mimeType });
        const blobUrl = URL.createObjectURL(blob);
        setDisplayUrl(blobUrl);
        return (): void => {
          URL.revokeObjectURL(blobUrl);
        };
      } catch {
        // Failed to generate blob URL
      }
    }
  }, [attachment.data, attachment.url, attachment.mimeType]);

  if (isImage(attachment.mimeType)) {
    return <ImageAttachment attachment={attachment} displayUrl={displayUrl} />;
  }
  if (isVideo(attachment.mimeType)) {
    return <VideoAttachment attachment={attachment} displayUrl={displayUrl} />;
  }
  if (isAudio(attachment.mimeType)) {
    return <AudioAttachment attachment={attachment} displayUrl={displayUrl} />;
  }
  return <GenericAttachment attachment={attachment} displayUrl={displayUrl} />;
}

function ImageAttachment({
  attachment,
  displayUrl,
}: {
  attachment: FileAttachment;
  displayUrl: string;
}): JSX.Element {
  const isServerFile = displayUrl.startsWith("/api/");
  return (
    <Div className="rounded-xl overflow-hidden bg-muted/20 border border-border/50">
      <ExternalLink
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
          className="w-full max-h-72 object-contain"
        />
      </ExternalLink>
      <FileFooter attachment={attachment} displayUrl={displayUrl} />
    </Div>
  );
}

function VideoAttachment({
  attachment,
  displayUrl,
}: {
  attachment: FileAttachment;
  displayUrl: string;
}): JSX.Element {
  return (
    <Div className="rounded-xl overflow-hidden bg-black/80 border border-border/50">
      <Video
        src={displayUrl}
        controls
        preload="metadata"
        className="w-full max-h-72 object-contain"
        style={{ display: "block" }}
      />
      <FileFooter attachment={attachment} displayUrl={displayUrl} />
    </Div>
  );
}

function AudioAttachment({
  attachment,
  displayUrl,
}: {
  attachment: FileAttachment;
  displayUrl: string;
}): JSX.Element {
  return (
    <Div className="rounded-xl bg-muted/30 border border-border/50 px-3 py-2.5">
      <Div className="flex items-center gap-2 mb-2">
        <Music className="h-4 w-4 text-primary/70 shrink-0" />
        <Span className="text-xs font-medium truncate flex-1">
          {attachment.filename}
        </Span>
        <Span className="text-xs text-muted-foreground shrink-0">
          {formatFileSize(attachment.size)}
        </Span>
        {displayUrl && (
          <ExternalLink
            href={displayUrl}
            download={attachment.filename}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 p-1 hover:bg-muted rounded transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
          </ExternalLink>
        )}
      </Div>
      <Audio
        src={displayUrl}
        controls
        preload="metadata"
        className="w-full h-9"
        style={{ display: "block" }}
      />
    </Div>
  );
}

function GenericAttachment({
  attachment,
  displayUrl,
}: {
  attachment: FileAttachment;
  displayUrl: string;
}): JSX.Element {
  return (
    <Div className="rounded-xl bg-muted/30 border border-border/50">
      <FileFooter attachment={attachment} displayUrl={displayUrl} showIcon />
    </Div>
  );
}

function FileFooter({
  attachment,
  displayUrl,
  showIcon = false,
}: {
  attachment: FileAttachment;
  displayUrl: string;
  showIcon?: boolean;
}): JSX.Element {
  return (
    <Div className="flex items-center gap-2 px-3 py-2">
      {showIcon && (
        <FileTypeIcon
          mimeType={attachment.mimeType}
          className="text-muted-foreground shrink-0"
        />
      )}
      <Div className="flex-1 min-w-0">
        <Div className="text-xs font-medium truncate">
          {attachment.filename}
        </Div>
        <Div className="text-[10px] text-muted-foreground">
          {formatFileSize(attachment.size)}
        </Div>
      </Div>
      {displayUrl && (
        <ExternalLink
          href={displayUrl}
          download={attachment.filename}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 p-1.5 hover:bg-muted rounded-md transition-colors"
          title="Download"
        >
          <Download className="h-3.5 w-3.5" />
        </ExternalLink>
      )}
    </Div>
  );
}
