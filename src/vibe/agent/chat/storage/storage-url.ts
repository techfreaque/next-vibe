/**
 * Instance-independent storage URL references (pure, client-safe).
 *
 * A chat storage file is identified by `{threadId}/{filename}` alone. The host
 * that served it is NOT part of its identity: persisting an absolute URL bakes
 * in whichever base URL the writing process resolved (a prod image once baked
 * `http://localhost:3000`), and a route move (`/agent/...` →
 * `/vibe/agent/...`) strands every stored link. So:
 *
 * - Writers persist the PORTABLE form: a root-relative path on the canonical
 *   route (`buildStorageFilePath`).
 * - Readers resolve it on the SERVING instance at read/render time
 *   (`resolveStorageUrl` server-side, `resolveMediaSrc` in UI).
 * - Legacy absolute URLs (any host, legacy route) normalize to the same
 *   portable form via `toPortableStorageUrl` / `rewriteStorageUrlsInText`.
 */

import { z } from "zod";

/** Canonical route of the thread-files endpoint (locale-agnostic file serving). */
export const STORAGE_FILES_ROUTE =
  "/api/en-GLOBAL/vibe/agent/chat/threads/files";

/**
 * Any storage-file URL: optional `scheme://host`, any locale segment, legacy
 * (`/agent/...`) or current (`/vibe/agent/...`) route. Groups: 1 threadId,
 * 2 filename (`{fileId}.{ext}`). Query/fragment stay outside the match.
 */
const STORAGE_URL_SOURCE =
  "(?:https?:\\/\\/[^\\s/\"'()<>\\[\\]\\\\]+)?\\/api\\/[A-Za-z]{2}-[A-Za-z]+(?:\\/vibe)?\\/agent\\/chat\\/threads\\/files\\/([A-Za-z0-9_-]+)\\/([A-Za-z0-9_-]+\\.[A-Za-z0-9]+)";

const STORAGE_URL_EXACT = new RegExp(`^${STORAGE_URL_SOURCE}(?=[?#]|$)`);

const UUID_SOURCE =
  "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}";

/** Media extensions a mangled link may carry (generated/uploaded media). */
const MEDIA_EXTENSION_SOURCE =
  "(?:png|jpe?g|gif|webp|avif|svg|bmp|mp3|wav|ogg|oga|opus|m4a|aac|flac|weba|mp4|webm|mov|m4v|mkv|pdf)";

/**
 * The form models MANGLE a storage URL into: the `/files` segment dropped
 * (`/threads/{threadId}/{fileId}.mp3`). Strict on purpose so it can never
 * catch a real thread route (`/threads/{id}/messages`): both ids must be
 * UUIDs and the filename must carry a media extension. Groups as above.
 */
const MANGLED_STORAGE_URL_SOURCE = `(?:https?:\\/\\/[^\\s/"'()<>\\[\\]\\\\]+)?\\/api\\/[A-Za-z]{2}-[A-Za-z]+(?:\\/vibe)?\\/agent\\/chat\\/threads\\/(${UUID_SOURCE})\\/(${UUID_SOURCE}\\.${MEDIA_EXTENSION_SOURCE})(?![A-Za-z0-9_-])`;

const MANGLED_STORAGE_URL_EXACT = new RegExp(
  `^${MANGLED_STORAGE_URL_SOURCE}(?=[?#]|$)`,
);

/** Match a storage URL in canonical, legacy OR mangled form. */
function matchStorageUrl(url: string): RegExpExecArray | null {
  return STORAGE_URL_EXACT.exec(url) ?? MANGLED_STORAGE_URL_EXACT.exec(url);
}

/**
 * Canonical storage path for a MANGLED storage URL (`/files` dropped), keeping
 * any query/fragment; null for anything else (incl. canonical URLs). Used to
 * redirect such requests and to repair such links in answer text.
 */
export function repairMangledStorageUrl(url: string): string | null {
  const match = MANGLED_STORAGE_URL_EXACT.exec(url);
  if (!match?.[1] || !match[2]) {
    return null;
  }
  return `${buildStorageFilePath(match[1], match[2])}${url.slice(match[0].length)}`;
}

/** Rewrite only MANGLED storage URLs inside free text to the canonical path. */
export function repairMangledStorageUrlsInText(text: string): string {
  return text.replace(
    new RegExp(MANGLED_STORAGE_URL_SOURCE, "g"),
    `${STORAGE_FILES_ROUTE}/$1/$2`,
  );
}

/** Root-relative, host-free storage path: the form to persist. */
export function buildStorageFilePath(
  threadId: string,
  filename: string,
): string {
  return `${STORAGE_FILES_ROUTE}/${threadId}/${filename}`;
}

/** True for a storage-file URL in any form (relative, any host, legacy route,
 *  mangled by a model). */
export function isStorageUrl(url: string): boolean {
  return matchStorageUrl(url) !== null;
}

/**
 * `{ threadId, filename }` of a storage-file URL in any form (relative, any
 * host, legacy route), or null for anything else (data: URIs, third-party).
 */
export function parseStorageFileRef(
  url: string,
): { threadId: string; filename: string } | null {
  const match = matchStorageUrl(url);
  if (!match?.[1] || !match[2]) {
    return null;
  }
  return { threadId: match[1], filename: match[2] };
}

/**
 * Normalize a storage-file URL to its portable root-relative form on the
 * canonical route. Non-storage URLs (third-party, data URIs) return unchanged.
 */
export function toPortableStorageUrl(url: string): string {
  const match = matchStorageUrl(url);
  if (!match?.[1] || !match[2]) {
    return url;
  }
  return `${buildStorageFilePath(match[1], match[2])}${url.slice(match[0].length)}`;
}

/**
 * Rewrite every storage-file URL inside free text (markdown content, tool
 * output) to its portable form. Idempotent.
 */
export function rewriteStorageUrlsInText(text: string): string {
  return text.replace(new RegExp(STORAGE_URL_SOURCE, "g"), (match) =>
    toPortableStorageUrl(match),
  );
}

/** Every storage-file URL inside free text, in order of appearance. */
export function findStorageUrls(text: string): string[] {
  return text.match(new RegExp(STORAGE_URL_SOURCE, "g")) ?? [];
}

/**
 * Request-field schema for media URLs an AI or user passes back in: an
 * absolute URL OR a portable storage path (what tool results now return).
 * Replaces `z.string().url()`, which rejects root-relative storage paths.
 */
export const mediaUrlSchema = z
  .string()
  .refine(
    (value) =>
      isStorageUrl(value) ||
      URL.canParse(value) ||
      /^\/uploads\/(?:images|audio|video|documents|other)\/[\w-]+\/[\w-]+\.md$/.test(
        value,
      ),
    {
      message:
        "Expected an absolute URL, a storage file path or a Cortex upload path",
    },
  );

/** Media URL fields a generation tool result carries, with their link label. */
const MEDIA_LINK_FIELDS = [
  ["imageUrl", "image"],
  ["videoUrl", "video"],
  ["audioUrl", "audio"],
] as const;

/** `[label](portable path)` for an own storage URL, null for anything else. */
export function mediaMarkdownLink(
  url: string,
  label: "image" | "video" | "audio",
): string | null {
  return isStorageUrl(url) ? `[${label}](${toPortableStorageUrl(url)})` : null;
}

/** A JSON-ish tool result value (structurally matches WidgetData / JSONValue). */
type ToolResultValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Date
  | ToolResultValue[]
  | { [key: string]: ToolResultValue };

/**
 * Add a ready-to-paste `markdownLink` (`[audio](/api/.../files/{t}/{f}.mp3)`)
 * next to the media URL of a generation tool result (also inside the
 * execute-tool `{ result: … }` wrapper). Models that rebuild the link from
 * the bare URL mangle it (drop `/files`); a complete markdown link gets
 * copied verbatim. Only own storage URLs; anything else is returned as is.
 */
export function withMediaMarkdownLink<T extends ToolResultValue>(value: T): T;
export function withMediaMarkdownLink(value: ToolResultValue): ToolResultValue {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    value instanceof Date
  ) {
    return value;
  }
  for (const [field, label] of MEDIA_LINK_FIELDS) {
    const url = value[field];
    const markdownLink =
      typeof url === "string" ? mediaMarkdownLink(url, label) : null;
    if (markdownLink) {
      return { ...value, markdownLink };
    }
  }
  const inner = value.result;
  if (
    inner !== null &&
    typeof inner === "object" &&
    !Array.isArray(inner) &&
    !(inner instanceof Date)
  ) {
    const linked = withMediaMarkdownLink(inner);
    return linked === inner ? value : { ...value, result: linked };
  }
  return value;
}
