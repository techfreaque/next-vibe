import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, it, mock } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { createEndpointLogger } from "next-vibe/logger/server";

import { scopedTranslation } from "../stream/i18n";
import type { HeadlessAiStreamResult } from "./setup/setup";

const pg = new PGlite();
mock.module("next-vibe/database", () => ({ db: drizzle(pg) }));
let shapeRunResult: typeof import("./run-result").shapeRunResult;

const { t } = scopedTranslation.scopedT("en-US");
const logger = createEndpointLogger(false, "en-US");
const turn: HeadlessAiStreamResult = {
  lastAiMessageId: "last",
  threadId: "thread",
  lastAiMessageContent: null,
  totalCreditsDeducted: 27,
  pinnedToolCount: 0,
};

beforeAll(async () => {
  ({ shapeRunResult } = await import("./run-result"));
  await pg.exec(`
    CREATE TABLE chat_messages (id text, role text, content text, metadata jsonb);
    CREATE TABLE chat_threads (id text, title text, created_at timestamp);
    INSERT INTO chat_messages VALUES
      ('last', 'assistant', 'final answer', '{"creditCost": 2, "promptTokens": 9}'),
      ('fallback', 'user', 'the original prompt', '{}');
    INSERT INTO chat_threads VALUES ('thread', 'fixture', '2026-11-25');
  `);
});
afterAll(async () => {
  await pg.close();
});

function result(
  headlessResult: HeadlessAiStreamResult,
  mode: "none" | "new" | "append",
) {
  return shapeRunResult({
    headlessResult,
    isIncognito: mode === "none",
    headlessThreadMode: mode,
    preCallResults: [],
    logger,
    t,
  });
}

it("propagates empty provider failures in new, append and incognito runs even with a committed continuation ID", async () => {
  for (const mode of ["none", "new", "append"] as const) {
    for (const lastAiMessageId of ["fallback", "last"]) {
      const outcome = await result(
        {
          ...turn,
          lastAiMessageId,
          lastAiMessageContent: "<think>internal</think>  ",
          providerErrorText:
            "malformed tool call data that could not be repaired",
        },
        mode,
      );
      expect(outcome).toMatchObject({
        success: false,
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        message: t("errors.malformedToolCall"),
      });
    }
  }
});

it("returns the whole run charge instead of the last assistant's charge", async () => {
  for (const mode of ["new", "append"] as const) {
    expect(
      await result({ ...turn, lastAiMessageContent: "final answer" }, mode),
    ).toMatchObject({
      success: true,
      data: { text: "final answer", creditCost: 27, promptTokens: 9 },
    });
  }
  expect(
    await result(
      {
        ...turn,
        lastAiMessageContent: "partial answer",
        providerErrorText: "error",
      },
      "none",
    ),
  ).toMatchObject({
    success: true,
    data: { text: "partial answer", creditCost: 27 },
  });
});

it("retains a zero-cost tool-only completion without returning the user's prompt as the answer", async () => {
  expect(
    await result(
      { ...turn, lastAiMessageId: "fallback", totalCreditsDeducted: 0 },
      "new",
    ),
  ).toMatchObject({
    success: true,
    data: { text: null, creditCost: 0 },
  });
});
