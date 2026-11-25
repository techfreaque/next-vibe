/**
 * advanceQueuedMessages must never close a parentId cycle.
 *
 * Prod 2026-11-25: a message stayed queued after its run ended, the user
 * replied UNDER it, and the next stream's frontier (a descendant of the queued
 * row) became its new parent: user -> queued -> tool -> assistant -> user.
 * Rendering that thread pinned the Next.js renderer at 100% CPU on both nodes.
 */

import { eq, inArray } from "drizzle-orm";
import { DefaultFolderId } from "next-vibe/core/execution-context";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { createEndpointLogger } from "next-vibe/logger/server";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";

import { chatMessages, chatThreads } from "../../../../chat/db";
import { ChatMessageRole } from "../../../../chat/enum";
import { createMessagesEmitter } from "../../../../chat/threads/[threadId]/messages/emitter";
import { ThrottleEngine } from "./throttle-engine";

const logger = createEndpointLogger(false, defaultLocale);

describe("ThrottleEngine.advanceQueuedMessages", () => {
  let admin: JwtPrivatePayloadType;
  const threadId = crypto.randomUUID();
  const ids = {
    root: crypto.randomUUID(),
    firstAnswer: crypto.randomUUID(),
    queuedWithReply: crypto.randomUUID(),
    replyUnderQueued: crypto.randomUUID(),
    frontier: crypto.randomUUID(),
    queuedPlain: crypto.randomUUID(),
  };

  beforeAll(async () => {
    admin = await resolveTestAdminUser();
    const at = (s: number): Date => new Date(Date.now() - 60_000 + s * 1000);
    await db.insert(chatThreads).values({
      id: threadId,
      userId: admin.id,
      leadId: admin.leadId,
      title: "queued cycle guard test",
      rootFolderId: DefaultFolderId.PRIVATE,
    });
    await db.insert(chatMessages).values([
      {
        id: ids.root,
        threadId,
        role: ChatMessageRole.USER,
        content: "first",
        createdAt: at(1),
        updatedAt: at(1),
      },
      {
        id: ids.firstAnswer,
        threadId,
        role: ChatMessageRole.ASSISTANT,
        content: "answer",
        isAI: true,
        parentId: ids.root,
        createdAt: at(2),
        updatedAt: at(2),
      },
      {
        // Still flagged queued, but the user already replied under it.
        id: ids.queuedWithReply,
        threadId,
        role: ChatMessageRole.USER,
        content: "queued",
        parentId: ids.firstAnswer,
        metadata: { isQueued: true },
        createdAt: at(3),
        updatedAt: at(3),
      },
      {
        id: ids.replyUnderQueued,
        threadId,
        role: ChatMessageRole.USER,
        content: "reply under queued",
        parentId: ids.queuedWithReply,
        createdAt: at(4),
        updatedAt: at(4),
      },
      {
        id: ids.frontier,
        threadId,
        role: ChatMessageRole.ASSISTANT,
        content: "streaming",
        isAI: true,
        parentId: ids.replyUnderQueued,
        createdAt: at(5),
        updatedAt: at(5),
      },
      {
        // A normal queued message (no descendants) keeps rolling forward.
        id: ids.queuedPlain,
        threadId,
        role: ChatMessageRole.USER,
        content: "plain queued",
        parentId: ids.firstAnswer,
        metadata: { isQueued: true },
        createdAt: at(6),
        updatedAt: at(6),
      },
    ]);
  }, 60_000);

  afterAll(async () => {
    await db
      .delete(chatMessages)
      .where(inArray(chatMessages.id, Object.values(ids)));
    await db.delete(chatThreads).where(eq(chatThreads.id, threadId));
  });

  it("skips queued ancestors of the frontier and advances the rest", async () => {
    const engine = new ThrottleEngine({
      isIncognito: false,
      logger,
      creditsT: creditsScopedTranslation.scopedT(defaultLocale).t,
      locale: defaultLocale,
      wsEmit: createMessagesEmitter(logger, admin, {
        threadId,
        rootFolderId: DefaultFolderId.PRIVATE,
      }),
      emitTitle: () => undefined,
    });

    engine.advanceQueuedMessages(threadId, ids.frontier);

    // Fire-and-forget: poll until the plain queued row moved.
    let parents = new Map<string, string | null>();
    for (let attempt = 0; attempt < 50; attempt++) {
      const rows = await db
        .select({ id: chatMessages.id, parentId: chatMessages.parentId })
        .from(chatMessages)
        .where(
          inArray(chatMessages.id, [ids.queuedPlain, ids.queuedWithReply]),
        );
      parents = new Map(rows.map((r) => [r.id, r.parentId]));
      if (parents.get(ids.queuedPlain) === ids.frontier) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    expect(parents.get(ids.queuedPlain)).toBe(ids.frontier);
    // Moving it under the frontier would close the cycle.
    expect(parents.get(ids.queuedWithReply)).toBe(ids.firstAnswer);
  });
});
