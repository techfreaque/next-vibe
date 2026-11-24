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
      thread_id uuid, metadata jsonb, content text, created_at timestamp
    );
  `);
  await pg.query("INSERT INTO chat_threads VALUES ($1, $2, 'Sample thread')", [
    threadId,
    owner,
  ]);
  await pg.query(
    "INSERT INTO chat_messages VALUES ($1, $2, $3, '2026-11-22 01:00:00')",
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
