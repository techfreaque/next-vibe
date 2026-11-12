/**
 * One-off repair: rewrite persisted storage-file URLs to the portable form.
 *
 * Before storage URLs were made host-free, generated media was persisted as an
 * absolute URL on whatever base the writing process resolved — a prod image
 * that baked `http://localhost:3000`, plus the pre-move `/api/{locale}/agent/...`
 * route. Those links break in the browser. This rewrites every non-canonical
 * storage URL in `chat_messages.content` / `chat_messages.metadata` to
 * `/api/en-GLOBAL/vibe/agent/chat/threads/files/{threadId}/{file}` — but ONLY
 * when this instance's storage can actually serve that file (same lookup the
 * file route uses). References to files that exist only on another instance
 * are left untouched and listed.
 *
 * Idempotent: canonical URLs are never touched; re-running is a no-op.
 * Does not bump `updated_at` (no sync churn, no reordering).
 *
 * Usage (dry run is the default; nothing is written without --apply):
 *   bun src/vibe/agent/chat/storage/repair-storage-urls.ts
 *   bun src/vibe/agent/chat/storage/repair-storage-urls.ts --apply
 */

import "server-only";

import { realpathSync } from "node:fs";
import { pathToFileURL } from "node:url";

import { eq, or, sql } from "drizzle-orm";
import { db } from "next-vibe/database";
import { createEndpointLogger } from "next-vibe/logger/server";
import type { EndpointLogger } from "next-vibe/logger/types";

import { chatMessages } from "../db";
import { getStorageAdapter } from "./index";
import {
  findStorageUrls,
  isStorageUrl,
  toPortableStorageUrl,
} from "./storage-url";
import { parseStorageUrl } from "./url-utils";

/** JSON value as stored in a jsonb column. */
type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface StorageUrlRepairReport {
  scannedRows: number;
  rowsRewritten: number;
  urlsRewritten: number;
  /** Non-canonical URLs whose file this instance can't serve: left as-is. */
  unrepairable: { messageId: string; threadId: string; url: string }[];
}

/**
 * Rewrites the non-canonical storage URLs inside `text` whose file exists
 * here; collects the ones that don't.
 */
async function rewriteText(
  text: string,
  canServe: (url: string) => Promise<boolean>,
  missing: string[],
): Promise<{ text: string; count: number }> {
  const found = findStorageUrls(text);
  const stale = [...new Set(found)].filter(
    (url) => toPortableStorageUrl(url) !== url,
  );
  let result = text;
  let count = 0;
  for (const url of stale) {
    if (!(await canServe(url))) {
      missing.push(url);
      continue;
    }
    const portable = toPortableStorageUrl(url);
    const parts = result.split(url);
    count += parts.length - 1;
    result = parts.join(portable);
  }
  return { text: result, count };
}

async function rewriteJson(
  value: JsonValue,
  canServe: (url: string) => Promise<boolean>,
  missing: string[],
): Promise<{ value: JsonValue; count: number }> {
  if (typeof value === "string") {
    const r = await rewriteText(value, canServe, missing);
    return { value: r.text, count: r.count };
  }
  if (Array.isArray(value)) {
    const out: JsonValue[] = [];
    let count = 0;
    for (const item of value) {
      const r = await rewriteJson(item, canServe, missing);
      out.push(r.value);
      count += r.count;
    }
    return { value: out, count };
  }
  if (value !== null && typeof value === "object") {
    const out: { [key: string]: JsonValue } = {};
    let count = 0;
    for (const [key, item] of Object.entries(value)) {
      const r = await rewriteJson(item, canServe, missing);
      out[key] = r.value;
      count += r.count;
    }
    return { value: out, count };
  }
  return { value, count: 0 };
}

export async function repairStorageUrls(
  apply: boolean,
  logger: EndpointLogger,
): Promise<StorageUrlRepairReport> {
  const storage = getStorageAdapter();
  const servable = new Map<string, boolean>();

  /** Same lookup the file route serves from: metadata + bytes in this thread. */
  const canServe = async (url: string): Promise<boolean> => {
    const parsed = parseStorageUrl(toPortableStorageUrl(url));
    if (!parsed || !isStorageUrl(url)) {
      return false;
    }
    const key = `${parsed.threadId}/${parsed.fileId}`;
    const cached = servable.get(key);
    if (cached !== undefined) {
      return cached;
    }
    const base64 = await storage.readFileAsBase64(
      parsed.fileId,
      parsed.threadId,
    );
    const ok = base64 !== null;
    servable.set(key, ok);
    return ok;
  };

  const pattern = "%/agent/chat/threads/files/%";
  const rows = await db
    .select({
      id: chatMessages.id,
      threadId: chatMessages.threadId,
      content: chatMessages.content,
      metadata: chatMessages.metadata,
    })
    .from(chatMessages)
    .where(
      or(
        sql`${chatMessages.content} LIKE ${pattern}`,
        sql`${chatMessages.metadata}::text LIKE ${pattern}`,
      ),
    );

  const report: StorageUrlRepairReport = {
    scannedRows: rows.length,
    rowsRewritten: 0,
    urlsRewritten: 0,
    unrepairable: [],
  };

  for (const row of rows) {
    const missing: string[] = [];
    const content =
      row.content === null
        ? { text: null, count: 0 }
        : await rewriteText(row.content, canServe, missing);
    const metadataJson: JsonValue = JSON.parse(
      JSON.stringify(row.metadata ?? null),
    );
    const metadata = await rewriteJson(metadataJson, canServe, missing);

    for (const url of new Set(missing)) {
      report.unrepairable.push({
        messageId: row.id,
        threadId: row.threadId,
        url,
      });
    }

    const count = content.count + metadata.count;
    if (count === 0) {
      continue;
    }
    report.rowsRewritten += 1;
    report.urlsRewritten += count;
    logger.info(
      `[repair-storage-urls] ${apply ? "rewrite" : "would rewrite"} message ${row.id} (thread ${row.threadId}): ${String(count)} url(s)`,
    );
    if (apply) {
      await db
        .update(chatMessages)
        .set({
          // Only touch the column that changed: a NULL metadata must stay SQL
          // NULL, never become a jsonb `null`.
          ...(content.count > 0 ? { content: content.text } : {}),
          ...(metadata.count > 0
            ? { metadata: sql`${JSON.stringify(metadata.value)}::jsonb` }
            : {}),
        })
        .where(eq(chatMessages.id, row.id));
    }
  }

  return report;
}

function isEntryPoint(): boolean {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return pathToFileURL(realpathSync(entry)).href === import.meta.url;
  } catch {
    return false;
  }
}

if (isEntryPoint()) {
  const logger = createEndpointLogger(false, "en-US");
  const apply = process.argv.includes("--apply");
  void repairStorageUrls(apply, logger).then((report) => {
    logger.info(
      `[repair-storage-urls] ${apply ? "APPLIED" : "DRY RUN"}: scanned ${String(report.scannedRows)} row(s), ${apply ? "rewrote" : "would rewrite"} ${String(report.urlsRewritten)} url(s) in ${String(report.rowsRewritten)} row(s), ${String(report.unrepairable.length)} unrepairable`,
    );
    // info, not warn: prod runs with VIBE_LOG_TARGET=db, and an expected
    // report line must not land in error_logs.
    for (const item of report.unrepairable) {
      logger.info(
        `[repair-storage-urls] unrepairable (file not in this instance's storage): message ${item.messageId} thread ${item.threadId} ${item.url}`,
      );
    }
    process.exit(0);
    return undefined;
  });
}
