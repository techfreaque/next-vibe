import "server-only";

/**
 * Uploads Virtual Mount
 * Exposes chat file attachments as a browseable folder at /uploads/<type>/<threadSlug>/<filename>.md
 * Each file renders as markdown with a download link + metadata frontmatter.
 * Organized by MIME type: images/, documents/, audio/, video/, other/
 */

import { and, desc, eq, isNotNull, sql } from "drizzle-orm";

import { chatMessages, chatThreads } from "@/app/api/[locale]/agent/chat/db";
import { db } from "@/app/api/[locale]/system/db";

import type { VirtualListEntry, VirtualReadResult } from "./resolver";

const TYPE_FOLDERS = [
  "images",
  "documents",
  "audio",
  "video",
  "other",
] as const;
type TypeFolder = (typeof TYPE_FOLDERS)[number];

function isTypeFolder(value: string): value is TypeFolder {
  return TYPE_FOLDERS.includes(value as TypeFolder);
}

/**
 * Determine the type folder for a MIME type
 */
function getMimeTypeFolder(mimeType: string): TypeFolder {
  if (mimeType.startsWith("image/")) {
    return "images";
  }
  if (mimeType.startsWith("audio/")) {
    return "audio";
  }
  if (mimeType.startsWith("video/")) {
    return "video";
  }
  if (
    mimeType.startsWith("text/") ||
    mimeType === "application/pdf" ||
    mimeType === "application/msword" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/vnd.ms-excel" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    mimeType === "application/vnd.ms-powerpoint" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
    mimeType === "application/json" ||
    mimeType === "application/xml"
  ) {
    return "documents";
  }
  return "other";
}

/**
 * Slugify a string for use as a path segment
 */
function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50) || "untitled"
  );
}

interface AttachmentRow {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  threadId: string;
  threadTitle: string;
  uploadedAt: Date;
}

/**
 * Load all attachments for a user across all threads.
 * Queries chatMessages metadata JSONB for attachments array.
 */
async function loadUserAttachments(userId: string): Promise<AttachmentRow[]> {
  const rows = await db
    .select({
      metadata: chatMessages.metadata,
      createdAt: chatMessages.createdAt,
      threadId: chatMessages.threadId,
      threadTitle: chatThreads.title,
    })
    .from(chatMessages)
    .innerJoin(chatThreads, eq(chatMessages.threadId, chatThreads.id))
    .where(
      and(
        eq(chatThreads.userId, userId),
        isNotNull(chatMessages.metadata),
        sql`${chatMessages.metadata}->'attachments' IS NOT NULL`,
        sql`jsonb_array_length((${chatMessages.metadata}->'attachments')::jsonb) > 0`,
      ),
    )
    .orderBy(desc(chatMessages.createdAt))
    .limit(1000);

  const attachments: AttachmentRow[] = [];

  for (const row of rows) {
    const meta = row.metadata as {
      attachments?: {
        id: string;
        url: string;
        filename: string;
        mimeType: string;
        size: number;
      }[];
    } | null;
    if (!meta?.attachments) {
      continue;
    }

    for (const att of meta.attachments) {
      if (!att.url || !att.filename) {
        continue;
      }
      attachments.push({
        id: att.id,
        url: att.url,
        filename: att.filename,
        mimeType: att.mimeType || "application/octet-stream",
        size: att.size || 0,
        threadId: row.threadId,
        threadTitle: row.threadTitle ?? "Untitled",
        uploadedAt: row.createdAt,
      });
    }
  }

  return attachments;
}

/**
 * Read an upload file rendered as markdown.
 * Path: /uploads/<type>/<threadSlug>/<filename>.md
 */
export async function readUploadPath(
  userId: string,
  path: string,
): Promise<VirtualReadResult | null> {
  const segments = path.split("/").filter(Boolean);
  // uploads / type / threadSlug / filename.md
  if (segments.length < 4) {
    return null;
  }

  const typeFolder = segments[1];
  if (!isTypeFolder(typeFolder)) {
    return null;
  }

  const threadSlugSegment = segments[2];
  const filenameSegment = segments[3];
  if (!threadSlugSegment || !filenameSegment) {
    return null;
  }

  // Extract thread ID from slug (last part after last `-`)
  const threadIdMatch = threadSlugSegment.match(
    /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i,
  );
  if (!threadIdMatch) {
    return null;
  }
  const threadId = threadIdMatch[1];

  // Load attachments for this thread
  const allAttachments = await loadUserAttachments(userId);
  const threadAttachments = allAttachments.filter(
    (a) =>
      a.threadId === threadId && getMimeTypeFolder(a.mimeType) === typeFolder,
  );

  // Find the specific file by normalized filename
  const targetFilename = filenameSegment.replace(/\.md$/, "");
  const attachment = threadAttachments.find(
    (a) =>
      slugify(a.filename) === targetFilename || a.filename === targetFilename,
  );

  if (!attachment) {
    return null;
  }

  const { formatBytes } = await import("../_shared/format-bytes");

  const frontmatterLines = [
    "---",
    `filename: "${attachment.filename.replace(/"/g, '\\"')}"`,
    `url: "${attachment.url}"`,
    `mimeType: "${attachment.mimeType}"`,
    `size: "${formatBytes(attachment.size)}"`,
    `threadId: "${attachment.threadId}"`,
    `threadTitle: "${attachment.threadTitle.replace(/"/g, '\\"')}"`,
    `uploadedAt: "${attachment.uploadedAt.toISOString()}"`,
    "---",
  ];

  const lines = [
    frontmatterLines.join("\n"),
    "",
    `# ${attachment.filename}`,
    "",
    `**Download:** [${attachment.filename}](${attachment.url})`,
    "",
    `| Field | Value |`,
    `| --- | --- |`,
    `| Type | \`${attachment.mimeType}\` |`,
    `| Size | ${formatBytes(attachment.size)} |`,
    `| Thread | ${attachment.threadTitle} |`,
    `| Uploaded | ${attachment.uploadedAt.toISOString().slice(0, 10)} |`,
  ];

  return {
    content: lines.join("\n"),
    nodeType: "file",
    updatedAt: attachment.uploadedAt.toISOString(),
  };
}

/**
 * List uploads at a virtual path
 */
export async function listUploadPath(
  userId: string,
  path: string,
): Promise<VirtualListEntry[]> {
  if (path === "/uploads") {
    // Return type folders
    return TYPE_FOLDERS.map((folder) => ({
      name: folder,
      path: `/uploads/${folder}`,
      nodeType: "dir" as const,
      size: null,
      updatedAt: new Date().toISOString(),
    }));
  }

  const segments = path.split("/").filter(Boolean);

  // /uploads/<type>
  if (segments.length === 2) {
    const typeFolder = segments[1];
    if (!isTypeFolder(typeFolder)) {
      return [];
    }

    const allAttachments = await loadUserAttachments(userId);
    const typeAttachments = allAttachments.filter(
      (a) => getMimeTypeFolder(a.mimeType) === typeFolder,
    );

    // Group by thread
    const threadMap = new Map<
      string,
      { slug: string; title: string; updatedAt: Date }
    >();
    for (const att of typeAttachments) {
      if (!threadMap.has(att.threadId)) {
        threadMap.set(att.threadId, {
          slug: `${slugify(att.threadTitle)}-${att.threadId}`,
          title: att.threadTitle,
          updatedAt: att.uploadedAt,
        });
      }
    }

    return [...threadMap.entries()].map(([, info]) => ({
      name: info.slug,
      path: `/uploads/${typeFolder}/${info.slug}`,
      nodeType: "dir" as const,
      size: null,
      updatedAt: info.updatedAt.toISOString(),
    }));
  }

  // /uploads/<type>/<threadSlug>
  if (segments.length === 3) {
    const typeFolder = segments[1];
    const threadSlugSegment = segments[2];
    if (!isTypeFolder(typeFolder) || !threadSlugSegment) {
      return [];
    }

    const threadIdMatch = threadSlugSegment.match(
      /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i,
    );
    if (!threadIdMatch) {
      return [];
    }
    const threadId = threadIdMatch[1];

    const allAttachments = await loadUserAttachments(userId);
    const threadAttachments = allAttachments.filter(
      (a) =>
        a.threadId === threadId && getMimeTypeFolder(a.mimeType) === typeFolder,
    );

    return threadAttachments.map((att) => ({
      name: `${slugify(att.filename)}.md`,
      path: `/uploads/${typeFolder}/${threadSlugSegment}/${slugify(att.filename)}.md`,
      nodeType: "file" as const,
      size: att.size,
      updatedAt: att.uploadedAt.toISOString(),
    }));
  }

  return [];
}

/**
 * Get upload counts by type folder
 */
export async function getUploadCounts(
  userId: string,
): Promise<{ total: number; byType: Record<string, number> }> {
  const allAttachments = await loadUserAttachments(userId);

  const byType: Record<string, number> = {};
  for (const att of allAttachments) {
    const folder = getMimeTypeFolder(att.mimeType);
    byType[folder] = (byType[folder] ?? 0) + 1;
  }

  return { total: allAttachments.length, byType };
}
