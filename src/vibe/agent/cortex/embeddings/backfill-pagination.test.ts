import { afterAll, expect, it, mock } from "bun:test";

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";

import { ChatMessageRole } from "../../chat/enum";
import { CortexNodeType } from "../enum";

const pg = new PGlite();
const bindCounts: number[] = [];
const db = drizzle(pg, {
  logger: {
    logQuery(_query: string, params: { readonly length: number }): void {
      bindCounts.push(params.length);
    },
  },
});
mock.module("next-vibe/database", () => ({ db, getLongRunningDb: () => db }));

afterAll(async () => {
  await pg.close();
});

it("advances past skipped rows in both backfills with constant bind counts", async () => {
  await pg.exec(`
    CREATE TABLE cortex_nodes (
      id uuid PRIMARY KEY, user_id uuid, path text, content text,
      node_type text, is_deleted boolean, embedding text
    );
    CREATE TABLE chat_messages (
      id uuid PRIMARY KEY, role text, content text, metadata jsonb,
      embedding_hash text, embedding text
    );
  `);
  await pg.query(
    `INSERT INTO cortex_nodes (id, path, content, node_type, is_deleted)
     SELECT md5(i::text)::uuid, '/documents/fixture', '', $1, false
     FROM generate_series(1, 11) i`,
    [CortexNodeType.FILE],
  );
  await pg.query(
    `INSERT INTO chat_messages (id, role, content)
     SELECT md5(i::text)::uuid, $1, '' FROM generate_series(1, 11) i`,
    [ChatMessageRole.USER],
  );
  const { backfillEmbeddings, backfillMessageEmbeddings } =
    await import("./backfill");
  const expected = { processed: 0, failed: 0, skipped: 11 };
  expect(
    await Promise.all([backfillEmbeddings(), backfillMessageEmbeddings()]),
  ).toEqual([expected, expected]);
  expect(bindCounts.toSorted((a, b) => a - b)).toEqual([3, 3, 4, 4, 4, 4]);
}, 30_000);
