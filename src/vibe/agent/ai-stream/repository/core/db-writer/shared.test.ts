import { describe, expect, it } from "bun:test";
import {
  DefaultFolderId,
  rootlessToolExecutionContext,
} from "next-vibe/core/execution-context";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";

import { createMessagesEmitter } from "../../../../chat/threads/[threadId]/messages/emitter";
import { MessageDbWriter } from "../message-db-writer";
import { noteThreadGoneWrite } from "./shared";

const THREAD_ID = "00000000-0000-4000-8000-0000000000aa";

function makeWriter(): MessageDbWriter {
  const logger = createEndpointLogger(false, defaultLocale);
  const user = {
    isPublic: true as const,
    leadId: "00000000-0000-4000-8000-0000000000bb",
    roles: [],
  };
  const ctx = rootlessToolExecutionContext();
  ctx.threadId = THREAD_ID;
  return new MessageDbWriter(
    false,
    logger,
    creditsScopedTranslation.scopedT(defaultLocale).t,
    defaultLocale,
    createMessagesEmitter(logger, user, {
      threadId: THREAD_ID,
      rootFolderId: DefaultFolderId.PRIVATE,
    }),
    () => undefined,
    ctx,
  );
}

describe("noteThreadGoneWrite", () => {
  it("stops the stream on the first dropped write, once", () => {
    const writer = makeWriter();
    let stops = 0;
    writer.onThreadGone = (): void => {
      stops++;
    };
    noteThreadGoneWrite(writer, "tool message create", {
      threadId: THREAD_ID,
      messageId: "m1",
    });
    noteThreadGoneWrite(writer, "tool result write", {
      threadId: THREAD_ID,
      messageId: "m1",
    });
    expect(stops).toBe(1);
    expect(writer.threadGoneWrites).toBe(2);
  });
});
