import type { ByteRange } from "./index";
import { getStorageAdapter } from "./index";

export interface StoredFileSource {
  threadId: string;
  filename: string;
  contentType: string;
}

function resolveByteRange(
  first: string,
  last: string,
  size: number,
): ByteRange | "unsatisfiable" | null {
  if (!first) {
    const suffixLength = Number(last);
    return size === 0 || suffixLength === 0
      ? "unsatisfiable"
      : { start: Math.max(0, size - suffixLength), end: size - 1 };
  }
  const start = Number(first);
  const end = last ? Number(last) : size - 1;
  if (last && end < start) {
    return null;
  }
  return start >= size
    ? "unsatisfiable"
    : { start, end: Math.min(end, size - 1) };
}

export async function serveStoredFile(
  { threadId, filename, contentType }: StoredFileSource,
  request: Request | undefined,
  extraHeaders: Record<string, string>,
): Promise<Response | null> {
  const storage = getStorageAdapter();
  const headers = new Headers(extraHeaders);
  headers.set("Content-Type", contentType);
  headers.set("Accept-Ranges", "bytes");

  const head = request?.method === "HEAD";
  // HEAD ignores Range. Without a validator, If-Range requires a full response.
  const rangeHeader =
    request?.method === "GET" && !request.headers.has("If-Range")
      ? request.headers.get("Range")
      : null;
  // Ignore malformed ranges, unknown units, and multipart ranges.
  const [, first = "", last = ""] =
    (rangeHeader && /^bytes=(\d*)-(\d*)$/i.exec(rangeHeader)) || [];
  let range: ByteRange | undefined;
  if (head || first || last) {
    const size = await storage.getFileSize(threadId, filename);
    if (size === null) {
      return null;
    }
    if (head) {
      headers.set("Content-Length", String(size));
      return new Response(null, { headers });
    }
    const resolved = resolveByteRange(first, last, size);
    if (resolved === "unsatisfiable") {
      headers.set("Content-Range", `bytes */${size}`);
      headers.set("Content-Length", "0");
      return new Response(null, { status: 416, headers });
    }
    if (resolved) {
      range = resolved;
      headers.set("Content-Range", `bytes ${range.start}-${range.end}/${size}`);
    }
  }

  const file = await storage.readFileContent(threadId, filename, range);
  if (!file) {
    return null;
  }
  headers.set("Content-Length", String(file.length));
  return new Response(file.body, { status: range ? 206 : 200, headers });
}
