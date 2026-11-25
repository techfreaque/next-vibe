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

/** Called after thread authorization for legacy images stored only in user messages. */
export async function readInlineThreadImage(
  threadId: string,
  filename: string,
): Promise<StoredFileSource | null> {
  if (!isInlineImageFilename(filename)) {
    return null;
  }
  const result = await db.execute<{ data: string }>(sql`
    SELECT attachment->>'data' AS data FROM ${chatMessages}
    CROSS JOIN LATERAL jsonb_path_query(
      ${chatMessages.metadata},
      'strict $.attachments[*] ? (@.filename == $file && @.data.type() == "string")',
      jsonb_build_object('file', ${filename}::text), true
    ) attachment
    WHERE ${chatMessages.threadId} = ${threadId}
      AND ${chatMessages.role} = ${ChatMessageRole.USER}
      AND coalesce(attachment->>'url', '') = ''
      AND length(attachment->>'data') BETWEEN 1 AND ${4 * Math.ceil(MAX_UPLOAD_BYTES / 3)}
    ORDER BY ${chatMessages.createdAt} DESC
    LIMIT 1
  `);
  const data = result.rows[0]?.data;
  const contentType = data ? sniffImageMediaType(data) : null;
  return data && contentType
    ? {
        threadId,
        filename,
        contentType,
        inlineBytes: Buffer.from(data, "base64"),
      }
    : null;
}
