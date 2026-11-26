/**
 * Download filenames for generated media (pure, client-safe).
 *
 * A bare `download` attribute leaves the name to the browser, which takes the
 * last URL segment (`<uuid>.mp4`) or, for a streamed video it has to re-fetch,
 * can keep its temporary name (`.tmp`, reported 2026-11-26). The UI asks for
 * `unbottled-<model>-<date>.<ext>` through `?download=<name>`, and the file
 * route answers with `Content-Disposition: attachment` carrying that name.
 */

import { parseStorageFileRef } from "./storage-url";

/** Query parameter the file route reads the requested download name from. */
export const DOWNLOAD_NAME_PARAM = "download";

const MAX_NAME_LENGTH = 120;

function slug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[^A-Za-z0-9._-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .toLowerCase();
}

/** Extension of a stored file name (`abc.mp4` -> `mp4`), or null. */
export function fileExtension(filename: string): string | null {
  const match = /\.([A-Za-z0-9]{1,8})$/.exec(filename);
  return match?.[1] ? match[1].toLowerCase() : null;
}

/**
 * Safe download name that always ends in the stored file's real extension.
 * Null when nothing usable is left (the caller then sends no disposition).
 */
export function sanitizeDownloadName(
  requested: string,
  storedFilename: string,
): string | null {
  const ext = fileExtension(storedFilename);
  if (!ext) {
    return null;
  }
  const base = slug(requested.replace(/\.[A-Za-z0-9]{1,8}$/, "")).slice(
    0,
    MAX_NAME_LENGTH,
  );
  return base ? `${base}.${ext}` : null;
}

/** `unbottled-<model>-<YYYY-MM-DD>.<ext>` for a generated file URL. */
export function mediaDownloadName(params: {
  url: string;
  kind: string;
  model?: string | null;
  createdAt?: Date | string;
}): string | null {
  const ref = parseStorageFileRef(params.url);
  const filename = ref?.filename ?? params.url.split(/[?#]/)[0] ?? "";
  const created = params.createdAt ? new Date(params.createdAt) : new Date();
  const date = Number.isNaN(created.getTime())
    ? new Date().toISOString().slice(0, 10)
    : created.toISOString().slice(0, 10);
  return sanitizeDownloadName(
    ["unbottled", params.model || params.kind, date].join("-"),
    filename,
  );
}

/**
 * Href that downloads `src` under `name`. Only own storage files get the
 * query (third-party hosts ignore it and the attribute alone is all we have).
 */
export function mediaDownloadHref(src: string, name: string | null): string {
  if (!name || !parseStorageFileRef(src)) {
    return src;
  }
  const joiner = src.includes("?") ? "&" : "?";
  return `${src}${joiner}${DOWNLOAD_NAME_PARAM}=${encodeURIComponent(name)}`;
}

/** RFC 6266 attachment header for a sanitized name. */
export function attachmentDisposition(name: string): string {
  return `attachment; filename="${name}"; filename*=UTF-8''${encodeURIComponent(name)}`;
}
