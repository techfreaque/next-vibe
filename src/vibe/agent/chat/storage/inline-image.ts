import "server-only";

import { sql } from "drizzle-orm";
import { MAX_UPLOAD_BYTES } from "next-vibe/core/route/body-limit";
import { db } from "next-vibe/database";

import { sniffImageMediaType } from "../../ai-stream/repository/context/image-media-type";
import { chatMessages } from "../db";
import { ChatMessageRole } from "../enum";
import type { StoredFileSource } from "./file-response";

export function isInlineImageFilename(filename: string): boolean {
  return /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}\.(?:webp|png|jpe?g|gif)$/i.test(
    filename,
  );
}

/** Non-UUID attachment names cannot be embedded in portable storage URLs.
 * Address their exact user message and array position instead. */
export function inlineImageDownloadName(
  attachment: { filename: string | null; name: string | null },
  messageId: string,
  index: number,
): string | null {
  if (attachment.filename && isInlineImageFilename(attachment.filename)) {
    return attachment.filename;
  }
  const filename = attachment.filename ?? attachment.name ?? "";
  const ext = /\.(webp|png|jpe?g|gif)$/i.exec(filename)?.[1];
  return ext ? `inline-${messageId}-${index}.${ext.toLowerCase()}` : null;
}

/** Called after thread authorization for legacy images stored only in user messages. */
export async function readInlineThreadImage(
  threadId: string,
  filename: string,
): Promise<StoredFileSource | null> {
  const indexed =
    /^inline-([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})-([0-9]{1,9})\.(?:webp|png|jpe?g|gif)$/i.exec(
      filename,
    );
  // Older tool calls used an upload's Cortex slug as the storage filename.
  // Accept only aliases that reconstruct the same remote ID, copy and format.
  const cortexAlias =
    /^remote-([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})-([0-9]+)-(webp|png|jpe?g|gif)\.(?:md|\3)$/i.exec(
      filename,
    );
  if (!indexed && !cortexAlias && !isInlineImageFilename(filename)) {
    return null;
  }
  const storedFilename = cortexAlias
    ? `remote-${cortexAlias[1]} (${cortexAlias[2]}).${cortexAlias[3]}`
    : filename;
  const candidates = indexed
    ? sql`SELECT ${chatMessages.metadata}->'attachments'->${Number(indexed[2])}::int AS attachment
          FROM ${chatMessages}
          WHERE ${chatMessages.id} = ${indexed[1]} AND ${chatMessages.threadId} = ${threadId}
            AND ${chatMessages.role} = ${ChatMessageRole.USER}`
    : sql`SELECT attachment FROM ${chatMessages}
          CROSS JOIN LATERAL jsonb_path_query(
            ${chatMessages.metadata},
            'strict $.attachments[*] ? (@.filename == $file && @.data.type() == "string")',
            jsonb_build_object('file', ${storedFilename}::text), true
          ) attachment
          WHERE ${chatMessages.threadId} = ${threadId} AND ${chatMessages.role} = ${ChatMessageRole.USER}
          ORDER BY ${chatMessages.createdAt} DESC`;
  const result = await db.execute<{ data: string }>(sql`
    SELECT attachment->>'data' AS data FROM (${candidates}) images
    WHERE coalesce(attachment->>'url', '') = ''
      AND jsonb_typeof(attachment->'data') = 'string'
      AND length(attachment->>'data') BETWEEN 1 AND ${4 * Math.ceil(MAX_UPLOAD_BYTES / 3)}
    LIMIT 1
  `);
  const data = result.rows[0]?.data;
  const contentType = data ? sniffImageMediaType(data) : null;
  if (!data || !contentType) {
    return null;
  }
  const inlineBytes = Buffer.from(data, "base64");
  return inlineBytes.length <= MAX_UPLOAD_BYTES
    ? { threadId, filename, contentType, inlineBytes }
    : null;
}
