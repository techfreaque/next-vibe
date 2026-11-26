import { afterAll, beforeAll, expect, it, mock } from "bun:test";

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";

const pg = new PGlite();
const queries: string[] = [];
const db = drizzle(pg, {
  logger: {
    logQuery(query: string): void {
      queries.push(query);
    },
  },
});
mock.module("next-vibe/database", () => ({ db }));

const owner = "c8d910af-b361-4b3d-9374-e894d0a17929";
const otherUser = "bc23e53d-cfb2-4023-b73e-92c384f90e2e";
const threadId = "eb3a8c4c-de39-4d30-baad-fa32f10d555e";
const context = "Saved message context. ".repeat(90);

beforeAll(async () => {
  await pg.exec(`
    CREATE TABLE chat_threads (id uuid PRIMARY KEY, user_id uuid, title text);
    CREATE TABLE chat_messages (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), thread_id uuid, metadata jsonb, content text, created_at timestamp NOT NULL DEFAULT now(), role text DEFAULT 'user'
    );
  `);
  await pg.query("INSERT INTO chat_threads VALUES ($1, $2, 'Sample thread')", [
    threadId,
    owner,
  ]);
  await pg.query(
    "INSERT INTO chat_messages (thread_id,metadata,content,created_at) VALUES ($1, $2, $3, '2026-11-22 01:00:00')",
    [
      threadId,
      JSON.stringify({
        attachments: [
          {
            name: "Legacy PDF",
            type: "application/pdf",
            size: 196_608,
            data: "Zmls".repeat(65_536),
          },
          {
            filename: "Hosted PDF",
            mimeType: "application/pdf",
            url: "https://example.com/hosted.pdf",
            size: 256,
          },
          { filename: "Empty PDF", mimeType: "application/pdf", data: "" },
        ],
      }),
      context,
    ],
  );
});

afterAll(async () => {
  await pg.close();
});

it("counts only arrays across owned messages, including legacy inline uploads", async () => {
  await pg.query(
    "INSERT INTO chat_messages (thread_id, metadata) VALUES ($1, '{}'), ($1, '{\"attachments\":null}'), ($1, '{\"attachments\":[]}')",
    [threadId],
  );
  const { getUploadCounts } = await import("./uploads");
  expect((await getUploadCounts(owner)).total).toBe(3);
  expect((await getUploadCounts(otherUser)).total).toBe(0);
});

it("lists legacy and hosted uploads using attachment summaries", async () => {
  const { listUploadPath, readUploadPath } = await import("./uploads");
  const path = `/uploads/documents/sample-thread-${threadId}`;
  const files = await listUploadPath(owner, path);
  expect(files.map(({ name, size }) => [name, size])).toEqual([
    ["legacy-pdf.md", 196_608],
    ["hosted-pdf.md", 256],
  ]);
  expect(queries.at(-1)).toContain("'hasData'");
  expect(queries.at(-1)).not.toContain('"chat_messages"."content"');
  expect(await listUploadPath(otherUser, path)).toEqual([]);

  const embedded = await readUploadPath(owner, `${path}/legacy-pdf.md`);
  expect(embedded?.content).toContain("embedded: true");
  expect(embedded?.content.split("## Message Context\n\n").at(-1)).toBe(
    context.slice(0, 1000),
  );
  expect(queries.at(-1)).toContain('left("chat_messages"."content"');
  const hosted = await readUploadPath(owner, `${path}/hosted-pdf.md`);
  expect(hosted?.content).toContain("https://example.com/hosted.pdf");
});

it("resolves an owned inline WebP from its virtual path and serves only its user attachment bytes", async () => {
  const { readUploadPath, resolveUploadAttachmentUrl } =
    await import("./uploads");
  const { readInlineThreadImage } =
    await import("../../chat/storage/inline-image");
  const { serveStoredFile } = await import("../../chat/storage/file-response");
  const { buildStorageFilePath } =
    await import("../../chat/storage/storage-url");
  const filename = "12345678-1234-4321-abcd-123456789012.webp";
  const path = `/uploads/images/sample-thread-${threadId}/${filename}.md`;
  const bytes = Buffer.from("RIFF0000WEBPfixture");
  const attachment = {
    filename,
    mimeType: "image/webp",
    url: "",
    data: bytes.toString("base64"),
    size: bytes.length,
  };
  await pg.query(
    "INSERT INTO chat_messages (thread_id,role,metadata) VALUES ($1, 'tool', $2)",
    [threadId, JSON.stringify({ attachments: [attachment] })],
  );
  expect(await readInlineThreadImage(threadId, filename)).toBeNull();
  expect(await resolveUploadAttachmentUrl(owner, path)).toBeNull();
  await pg.query(
    "INSERT INTO chat_messages (thread_id,role,metadata,created_at) VALUES ($1, 'user', $2, now())",
    [threadId, JSON.stringify({ attachments: [attachment] })],
  );
  expect(await resolveUploadAttachmentUrl(otherUser, path)).toBeNull();
  expect(await resolveUploadAttachmentUrl(owner, path)).toBe(
    buildStorageFilePath(threadId, filename),
  );
  const markdown = await readUploadPath(owner, path);
  expect(markdown?.content).toContain(buildStorageFilePath(threadId, filename));
  expect(markdown?.content).not.toContain(attachment.data);
  expect(await readInlineThreadImage(otherUser, filename)).toBeNull();
  const source = await readInlineThreadImage(threadId, filename);
  expect(source?.contentType).toBe("image/webp");
  if (!source) return;
  const response = await serveStoredFile(
    source,
    new Request("https://fixture.invalid", {
      headers: { Range: "bytes=8-11" },
    }),
    {},
  );
  expect(response?.status).toBe(206);
  expect(response?.headers.get("Content-Range")).toBe(
    `bytes 8-11/${bytes.length}`,
  );
  expect(await response?.text()).toBe("WEBP");
});

it("serves the listed Cortex image when its inline filename contains a browser copy suffix", async () => {
  const { listUploadPath, resolveUploadAttachmentUrl } =
    await import("./uploads");
  const { readInlineThreadImage } =
    await import("../../chat/storage/inline-image");
  const messageId = crypto.randomUUID();
  const filename = `remote-${crypto.randomUUID()} (1).png`;
  const legacyName = `${crypto.randomUUID()}.png`;
  const bytes = Buffer.from("iVBORw0KGgo=", "base64");
  await pg.query(
    "INSERT INTO chat_messages (id,thread_id,role,metadata) VALUES ($1,$2,'user',$3)",
    [
      messageId,
      threadId,
      JSON.stringify({
        attachments: [
          { name: "ignored" },
          { filename, mimeType: "image/png", data: bytes.toString("base64") },
          { name: legacyName, type: "image/png", data: bytes.toString("base64") },
        ],
      }),
    ],
  );
  const dir = `/uploads/images/sample-thread-${threadId}`;
  const files = await listUploadPath(owner, dir);
  const legacyPath = files.find((entry) =>
    entry.name.startsWith(legacyName.slice(0, 36)),
  )?.path;
  expect(legacyPath).toBeDefined();
  if (!legacyPath) return;
  expect(await resolveUploadAttachmentUrl(owner, legacyPath)).toEndWith(
    `/inline-${messageId}-2.png`,
  );
  const path = files.find((entry) =>
    entry.name.startsWith("remote-"),
  )?.path;
  expect(path).toBeDefined();
  if (!path) return;
  const key = `inline-${messageId}-1.png`;
  expect(await resolveUploadAttachmentUrl(owner, path)).toEndWith("/" + key);
  expect(await resolveUploadAttachmentUrl(otherUser, path)).toBeNull();
  expect((await readInlineThreadImage(threadId, key))?.inlineBytes).toEqual(
    bytes,
  );
  expect(await readInlineThreadImage(otherUser, key)).toBeNull();
  expect(
    await readInlineThreadImage(threadId, `inline-${messageId}-0.png`),
  ).toBeNull();
});
