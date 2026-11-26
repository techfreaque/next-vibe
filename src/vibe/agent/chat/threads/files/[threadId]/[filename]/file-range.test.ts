import fs from "node:fs/promises";
import path from "node:path";

import { afterAll, beforeAll, expect, mock, test } from "bun:test";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

const threadId = "54f3349f-5d1b-4f8c-b063-eb9ab2971bb0";
const leadId = "f03a097c-59aa-4ba6-8d30-b19fbe5ee563";
const bytes = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8]);
const cacheControl = "private, max-age=31536000, immutable";
const fixtureEnv = { CHAT_STORAGE_TYPE: "filesystem", CHAT_STORAGE_PATH: "" };
void mock.module("../../../../../env", () => ({ agentEnv: fixtureEnv }));
void mock.module("next-vibe/database", () => ({
  db: {
    select: () => ({
      from: () => ({ where: () => ({ limit: () => Promise.resolve([]) }) }),
    }),
  },
}));
void mock.module("next-vibe/identity/auth/repository", () => ({
  AuthRepository: {
    getAuthMinimalUser: (_roles: readonly string[], { request }: { request: Request }) =>
      Promise.resolve({
        isPublic: true,
        leadId: request.headers.get("X-Fixture-Lead") ?? "",
        roles: [UserPermissionRole.PUBLIC],
      }),
  },
}));

let requestFile: (
  method: "GET" | "HEAD",
  headers?: HeadersInit,
  owner?: boolean,
  query?: string,
) => Promise<Response | undefined>;
let storedFileUrl: string;
let storedFilename: string;

beforeAll(async () => {
  fixtureEnv.CHAT_STORAGE_PATH = await fs.mkdtemp(".tmp/thread-file-range-");
  const { getStorageAdapter } = await import("../../../../storage/index");
  const storage = getStorageAdapter();
  const stored = await storage.uploadFile(bytes, {
    threadId,
    filename: "clip.mp4",
    mimeType: "video/mp4",
    leadId,
  });
  storedFileUrl = stored.url;
  storedFilename = stored.metadata.filename;
  const { wrapNextApiRoute } = await import("next-vibe/platforms/web/frameworks/tanstack-start/nextjs-compat-wrapper");
  const handlers = wrapNextApiRoute(() => import("./route"));
  requestFile = (method, headers, owner = true, query = "") => {
    const requestHeaders = new Headers(headers);
    if (owner) {
      requestHeaders.set("X-Fixture-Lead", leadId);
    }
    return Promise.resolve(handlers[method]?.({
      request: new Request(`http://localhost${stored.url}${query}`, { method, headers: requestHeaders }),
      params: { locale: defaultLocale, threadId, filename: stored.metadata.filename },
    }));
  };
});

afterAll(async () => {
  if (fixtureEnv.CHAT_STORAGE_PATH) {
    const destination = ".tmp/todelete/thread-file-range";
    await fs.mkdir(destination, { recursive: true });
    await fs.rename(fixtureEnv.CHAT_STORAGE_PATH, path.join(destination, path.basename(fixtureEnv.CHAT_STORAGE_PATH)));
  }
});

test.each([
  { range: "bytes=0-1", start: 0, end: 1 },
  { range: "bytes=4-", start: 4, end: 8 },
  { range: "bytes=-3", start: 6, end: 8 },
  { range: "bytes=7-999999999999999999999", start: 7, end: 8 },
])("serves $range as partial content", async ({ range, start, end }) => {
  const response = await requestFile("GET", { Range: range });
  expect(response?.status).toBe(206);
  expect(response?.headers.get("Content-Range")).toBe(`bytes ${start}-${end}/${bytes.length}`);
  expect(response?.headers.get("Content-Length")).toBe(String(end - start + 1));
  expect(response?.headers.get("Content-Type")).toBe("video/mp4");
  expect(response?.headers.get("Accept-Ranges")).toBe("bytes");
  expect(response?.headers.get("Cache-Control")).toBe(cacheControl);
  expect(response?.headers.get("X-Content-Type-Options")).toBe("nosniff");
  expect(await response?.bytes()).toEqual(new Uint8Array(bytes.subarray(start, end + 1)));
});

test.each(["bytes=9-", "bytes=-0", "bytes=999999999999999999999-"])(
  "rejects unsatisfiable range %s without a body",
  async (range) => {
    const response = await requestFile("GET", { Range: range });
    expect(response?.status).toBe(416);
    expect(response?.headers.get("Content-Range")).toBe(`bytes */${bytes.length}`);
    expect(response?.headers.get("Content-Length")).toBe("0");
    expect(response?.body).toBeNull();
  },
);

const fullResponseHeaders: HeadersInit[] = [
  {},
  { Range: "bytes=0-1,4-5" },
  { Range: "bytes=5-4" },
  { Range: "bytes=x-y" },
  { Range: "items=0-1" },
  { Range: "bytes=0-1", "If-Range": '"old"' },
];
test.each(fullResponseHeaders)("serves the full file for %j", async (headers) => {
  const response = await requestFile("GET", headers);
  expect(response?.status).toBe(200);
  expect(response?.headers.get("Content-Range")).toBeNull();
  expect(response?.headers.get("Content-Length")).toBe(String(bytes.length));
  expect(response?.headers.get("Cache-Control")).toBe(cacheControl);
  expect(await response?.bytes()).toEqual(new Uint8Array(bytes));
});

test("?download= names the file as an attachment with the stored extension", async () => {
  const named = await requestFile("GET", {}, true, "?download=unbottled-kling-2026-11-26.tmp");
  expect(named?.status).toBe(200);
  expect(named?.headers.get("Content-Disposition")).toBe(
    "attachment; filename=\"unbottled-kling-2026-11-26.mp4\"; filename*=UTF-8''unbottled-kling-2026-11-26.mp4",
  );
  expect(await named?.bytes()).toEqual(new Uint8Array(bytes));
  const plain = await requestFile("GET");
  expect(plain?.headers.get("Content-Disposition")).toBeNull();
  const stranger = await requestFile("GET", {}, false, "?download=x");
  expect(stranger?.status).toBe(404);
});

test("HEAD returns full-file headers and no body", async () => {
  const response = await requestFile("HEAD", { Range: "bytes=0-1" });
  expect(response?.status).toBe(200);
  expect(response?.headers.get("Content-Range")).toBeNull();
  expect(response?.headers.get("Content-Length")).toBe(String(bytes.length));
  expect(response?.headers.get("Accept-Ranges")).toBe("bytes");
  expect(response?.headers.get("Cache-Control")).toBe(cacheControl);
  expect(response?.body).toBeNull();
});

test("a stranger cannot read bytes or learn the file size", async () => {
  const get = await requestFile("GET", { Range: "bytes=100-" }, false);
  const head = await requestFile("HEAD", {}, false);
  expect(get?.status).toBe(404);
  expect(get?.headers.get("Content-Range")).toBeNull();
  expect(head?.status).toBe(404);
  expect(head?.headers.get("Accept-Ranges")).toBeNull();
  expect(head?.body).toBeNull();
});

test("a signed generated-media URL serves ranges and keeps its cache policy", async () => {
  const { signedMediaUrl } = await import("@/v1/shared/media");
  const { wrapNextApiRoute } = await import(
    "next-vibe/platforms/web/frameworks/tanstack-start/nextjs-compat-wrapper"
  );
  const handlers = wrapNextApiRoute(() => import("@/v1/media/[threadId]/[filename]/route"));
  const originRequest = new Request("http://localhost");
  const url = signedMediaUrl(storedFileUrl, originRequest);
  const params = { locale: defaultLocale, threadId, filename: storedFilename };
  const partial = await handlers.GET?.({
    request: new Request(url, { headers: { Range: "bytes=-2" } }),
    params,
  });
  expect(partial?.status).toBe(206);
  expect(partial?.headers.get("Content-Range")).toBe(`bytes 7-8/${bytes.length}`);
  expect(partial?.headers.get("Cache-Control")).toBe("private, max-age=86400");
  expect(await partial?.bytes()).toEqual(new Uint8Array([7, 8]));

  const head = await handlers.HEAD?.({ request: new Request(url, { method: "HEAD" }), params });
  expect(head?.status).toBe(200);
  expect(head?.headers.get("Content-Length")).toBe(String(bytes.length));
  expect(head?.body).toBeNull();

  const tamperedUrl = new URL(url);
  tamperedUrl.searchParams.set("sig", "0".repeat(64));
  const denied = await handlers.GET?.({
    request: new Request(tamperedUrl, { headers: { Range: "bytes=100-" } }),
    params,
  });
  expect(denied?.status).toBe(404);
  expect(denied?.headers.get("Content-Range")).toBeNull();
});
