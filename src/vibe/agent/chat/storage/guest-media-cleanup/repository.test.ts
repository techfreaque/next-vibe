import { randomUUID } from "node:crypto";

import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, mock, test } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { coreEnv } from "next-vibe/core/env";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { Environment } from "next-vibe/env/env-util";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";

import type { FileMetadata } from "../index";
import { buildStorageFilePath } from "../storage-url";
import { GUEST_MEDIA_CLEANUP_TASK_ID } from "./constants";

const pg = new PGlite();
const fixtureDb = drizzle(pg);
const namespace = randomUUID();
const savedNamespace = randomUUID();
const guest = randomUUID();
const directlyLinked = randomUUID();
const converted = randomUUID();
const viaMerge = randomUUID();
const mergeIntermediate = randomUUID();
const viaReferral = randomUUID();
const formerAccount = randomUUID();
const viaSignupHistory = randomUUID();
const ipNeighbor = randomUUID();
const user = randomUUID();
const old = new Date("2024-01-01T12:00:00Z");
const young = new Date();

function makeFile(leadId: string, uploadedAt = old, threadId = namespace): FileMetadata {
  const id = randomUUID();
  return {
    id,
    leadId,
    threadId,
    filename: `${id}.png`,
    originalFilename: "generated.png",
    mimeType: "image/png",
    size: 100,
    uploadedAt,
  };
}

const expired = makeFile(guest);
const unavailable = makeFile(guest);
const metadataFailure = makeFile(guest);
const newFile = makeFile(guest, young);
const newerStudioRow = makeFile(guest);
const savedFile = makeFile(guest, old, savedNamespace);
const guestIpMatch = makeFile(ipNeighbor);
const protectedFiles = [
  makeFile(directlyLinked),
  makeFile(converted),
  makeFile(viaMerge),
  makeFile(viaReferral),
  makeFile(formerAccount),
  makeFile(viaSignupHistory),
  guestIpMatch,
];
const removedContent = new Set<string>();
const removedMetadata = new Set<string>();
let storageAvailable = false;
const logger = createEndpointLogger(false, defaultLocale);
const originalEnvironment = coreEnv.NODE_ENV;
const originalPreviewMode = coreEnv.IS_PREVIEW_MODE;

mock.module("next-vibe/database", () => ({ db: fixtureDb }));
mock.module("../index", () => ({
  getStorageAdapter: () => ({
    listThreadIds: async () => [namespace, savedNamespace],
    listFilesByThread: async (threadId: string) =>
      (threadId === savedNamespace
        ? [savedFile]
        : [expired, unavailable, metadataFailure, newFile, newerStudioRow, ...protectedFiles]
      ).filter((file) => !removedMetadata.has(file.id)),
    deleteFileContent: async (file: FileMetadata) => {
      if (file.id === unavailable.id && !storageAvailable) {
        return Promise.reject(new Error("fixture storage unavailable"));
      }
      removedContent.add(file.id);
    },
    deleteFileMetadata: async (file: FileMetadata) => {
      removedMetadata.add(file.id);
      if (file.id === metadataFailure.id && !storageAvailable) {
        return Promise.reject(new Error("fixture metadata delete response lost"));
      }
    },
    writeFileMetadata: async (file: FileMetadata) => {
      removedMetadata.delete(file.id);
    },
  }),
}));

let cleanup: typeof import("./repository").GuestMediaCleanupRepository.cleanup;

beforeAll(async () => {
  coreEnv.NODE_ENV = Environment.PRODUCTION;
  coreEnv.IS_PREVIEW_MODE = false;
  ({ cleanup } = (await import("./repository")).GuestMediaCleanupRepository);
  await pg.exec(`
    CREATE TABLE leads (
      id uuid PRIMARY KEY, status text NOT NULL DEFAULT 'guest',
      converted_user_id uuid, converted_at timestamp, signed_up_at timestamp,
      metadata jsonb NOT NULL DEFAULT '{}'
    );
    CREATE TABLE user_lead_links (lead_id uuid REFERENCES leads, user_id uuid, link_reason text);
    CREATE TABLE lead_lead_links (lead_id_1 uuid REFERENCES leads, lead_id_2 uuid REFERENCES leads, link_reason text);
    CREATE TABLE lead_referrals (lead_id uuid REFERENCES leads);
    CREATE TABLE signup_events (lead_id uuid REFERENCES leads, type text);
    CREATE TABLE growth_journeys (lead_id uuid REFERENCES leads, user_id uuid, signed_up_at timestamp);
    CREATE TABLE newsletter_subscriptions (lead_id uuid REFERENCES leads, user_id uuid);
    CREATE TABLE credit_wallets (lead_id uuid REFERENCES leads, user_id uuid);
    CREATE TABLE lifecycle_enrollments (lead_id uuid REFERENCES leads, user_id uuid);
    CREATE TABLE emails (lead_id uuid, user_id uuid);
    CREATE TABLE remote_connections (lead_id text);
    CREATE TABLE chat_threads (id uuid PRIMARY KEY, lead_id uuid REFERENCES leads, user_id uuid);
    CREATE TABLE chat_folders (lead_id uuid REFERENCES leads, user_id uuid);
    CREATE TABLE studio_generations (
      id uuid PRIMARY KEY, lead_id uuid REFERENCES leads, user_id uuid,
      status text, created_at timestamp, url text
    );
  `);
  await pg.query("INSERT INTO leads (id) SELECT unnest($1::uuid[])", [
    [
      guest,
      directlyLinked,
      converted,
      viaMerge,
      mergeIntermediate,
      viaReferral,
      formerAccount,
      viaSignupHistory,
      ipNeighbor,
    ],
  ]);
  await pg.query("INSERT INTO user_lead_links VALUES ($1, $2, 'login')", [directlyLinked, user]);
  await pg.query("UPDATE leads SET converted_user_id = $2 WHERE id = $1", [converted, user]);
  await pg.query("UPDATE leads SET metadata = '{\"hadAccount\":true}' WHERE id = $1", [
    formerAccount,
  ]);
  await pg.query(
    "INSERT INTO lead_lead_links VALUES ($1, $2, 'track_page'), ($2, $3, 'referral'), ($4, $3, 'ip_match')",
    [viaMerge, mergeIntermediate, directlyLinked, ipNeighbor],
  );
  await pg.query("INSERT INTO lead_referrals VALUES ($1)", [viaReferral]);
  await pg.query("INSERT INTO signup_events VALUES ($1, 'events.confirmed')", [viaSignupHistory]);
  await pg.query("INSERT INTO chat_threads (id, lead_id) VALUES ($1, $2)", [savedNamespace, guest]);
  for (const file of [expired, unavailable, metadataFailure, newerStudioRow, ...protectedFiles]) {
    await pg.query("INSERT INTO studio_generations VALUES ($1, $2, NULL, 'completed', $3, $4)", [
      file.id,
      file.leadId,
      file.id === newerStudioRow.id ? young.toISOString() : old.toISOString(),
      buildStorageFilePath(file.threadId, file.filename),
    ]);
  }
});

afterAll(async () => {
  coreEnv.NODE_ENV = originalEnvironment;
  coreEnv.IS_PREVIEW_MODE = originalPreviewMode;
  await pg.close();
});

test("counts all eligible files and bytes without writing", async () => {
  const result = await cleanup(
    { batchSize: 1, dryRun: true },
    Platform.CLI,
    undefined,
    undefined,
    logger,
    defaultLocale,
  );
  expect(result.success && result.data).toMatchObject({
    eligibleFiles: 4,
    eligibleBytes: 400,
    filesDeleted: 0,
    rowsDeleted: 0,
    scanComplete: true,
    skippedAccountLead: 6,
    skippedTooNew: 1,
    storedThreadNamespaces: 1,
  });
  expect(removedContent.size + removedMetadata.size).toBe(0);
});

test("only the production guest media task can delete files", async () => {
  const data = { batchSize: 10, dryRun: false };
  const manual = await cleanup(data, Platform.CLI, undefined, undefined, logger, defaultLocale);
  expect(manual.success).toBe(false);
  const differentTask = await cleanup(
    data,
    Platform.CRON,
    "another-task",
    undefined,
    logger,
    defaultLocale,
  );
  expect(differentTask.success).toBe(false);
  coreEnv.IS_PREVIEW_MODE = true;
  try {
    const preview = await cleanup(
      data,
      Platform.CRON,
      GUEST_MEDIA_CLEANUP_TASK_ID,
      undefined,
      logger,
      defaultLocale,
    );
    expect(preview.success).toBe(false);
  } finally {
    coreEnv.IS_PREVIEW_MODE = false;
  }
  expect(removedContent.size + removedMetadata.size).toBe(0);
});

test("deletes expired orphans and their rows, retaining linked, young and failed files", async () => {
  const run = async (batchSize: number): ReturnType<typeof cleanup> =>
    cleanup(
      { batchSize, dryRun: false },
      Platform.CRON,
      GUEST_MEDIA_CLEANUP_TASK_ID,
      undefined,
      logger,
      defaultLocale,
    );
  const first = await run(3);
  expect(first.success && first.data).toMatchObject({
    eligibleFiles: 4,
    filesDeleted: 1,
    bytesDeleted: 100,
    rowsDeleted: 1,
    failed: 2,
    deferred: 1,
  });
  expect(removedContent).toEqual(new Set([expired.id, metadataFailure.id]));
  expect(removedMetadata).toEqual(new Set([expired.id]));
  const remaining = await pg.query<{ id: string }>("SELECT id FROM studio_generations");
  expect(new Set(remaining.rows.map((row) => row.id))).toEqual(
    new Set([
      unavailable.id,
      metadataFailure.id,
      newerStudioRow.id,
      ...protectedFiles.map((file) => file.id),
    ]),
  );

  storageAvailable = true;
  const retry = await run(10);
  expect(retry.success && retry.data).toMatchObject({ filesDeleted: 3, rowsDeleted: 3, failed: 0 });
  expect(removedContent).toEqual(
    new Set([expired.id, unavailable.id, metadataFailure.id, guestIpMatch.id]),
  );
});
