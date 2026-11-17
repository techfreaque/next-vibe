/**
 * Forum Post tests
 *
 * forum-post publishes an AI draft verbatim and enforces the guard rails that
 * keep automated forum posting honest. Real DB, real admin user; every thread
 * created here is removed afterwards.
 */

import { inArray } from "drizzle-orm";
import { DefaultFolderId } from "next-vibe/core/execution-context";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { ChatModelId } from "../../../ai-stream/models";
import { chatMessages, chatThreads } from "../../db";
import { ChatMessageRole } from "../../enum";
import feedEndpoints from "../definition";
import { FeedSortMode } from "../definition";
import postEndpoints from "./definition";

const TEST_TIMEOUT = 60_000;
const DRAFT_MODEL = ChatModelId.UNCENSORED_LM_V1_2;

describe("forum-post", () => {
  let admin: JwtPrivatePayloadType;
  const threadIds: string[] = [];
  const stamp = `forumpost${Date.now()}`;

  /** An AI draft in one of the admin's own background threads. */
  async function createDraft(
    text: string,
    model: ChatModelId = DRAFT_MODEL,
  ): Promise<string> {
    const threadId = crypto.randomUUID();
    threadIds.push(threadId);
    await db.insert(chatThreads).values({
      id: threadId,
      userId: admin.id,
      title: `${stamp} draft`,
      rootFolderId: DefaultFolderId.BACKGROUND,
    });
    const messageId = crypto.randomUUID();
    await db.insert(chatMessages).values({
      id: messageId,
      threadId,
      role: ChatMessageRole.ASSISTANT,
      content: `<think>planning</think>${text}`,
      authorId: admin.id,
      isAI: true,
      model,
      skill: "debater",
    });
    return messageId;
  }

  beforeAll(async () => {
    admin = await resolveTestAdminUser();
  });

  afterAll(async () => {
    if (threadIds.length > 0) {
      await db.delete(chatThreads).where(inArray(chatThreads.id, threadIds));
    }
  });

  it(
    "opens a thread with the draft verbatim, then blocks reposts, self-replies and double answers",
    async () => {
      const draftText = `${stamp} Refusals mostly protect the vendor. Where is the line?`;
      const draftId = await createDraft(draftText);

      const opened = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: postEndpoints.POST,
        data: {
          draftMessageId: draftId,
          threadId: undefined,
          parentId: undefined,
          title: `${stamp} Who do refusals protect?`,
          category: "philosophy",
        },
        user: admin,
      });
      expect(opened.success, JSON.stringify(opened)).toBe(true);
      if (!opened.success) {
        return;
      }
      const forumThreadId = opened.data.postedThreadId;
      threadIds.push(forumThreadId);
      expect(opened.data.isNewThread).toBe(true);

      const [posted] = await db
        .select()
        .from(chatMessages)
        .where(inArray(chatMessages.id, [opened.data.messageId]));
      // Verbatim: think tags stripped, nothing else touched
      expect(posted?.content).toBe(draftText);
      expect(posted?.isAI).toBe(true);
      expect(posted?.model).toBe(DRAFT_MODEL);
      expect(posted?.skill).toBe("debater");

      // Same draft again → refused
      const repost = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: postEndpoints.POST,
        data: {
          draftMessageId: draftId,
          threadId: undefined,
          parentId: undefined,
          title: `${stamp} another title`,
          category: "Philosophy",
        },
        user: admin,
      });
      expect(repost.success).toBe(false);
      if (!repost.success) {
        expect(repost.errorType.errorCode).toBe(
          ErrorResponseTypes.CONFLICT.errorCode,
        );
      }

      // Replying to its own AI opener → refused
      const selfReply = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: postEndpoints.POST,
        data: {
          draftMessageId: await createDraft(`${stamp} self reply`),
          threadId: forumThreadId,
          parentId: undefined,
        },
        user: admin,
      });
      expect(selfReply.success).toBe(false);
      if (!selfReply.success) {
        expect(selfReply.errorType.errorCode).toBe(
          ErrorResponseTypes.CONFLICT.errorCode,
        );
      }

      // Not in the needsReply list while the newest post is its own AI post
      const before = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: feedEndpoints.GET,
        data: {
          sortMode: FeedSortMode.NEW,
          page: 1,
          limit: 100,
          needsReply: true,
        },
        user: admin,
      });
      expect(before.success).toBe(true);
      if (before.success) {
        expect(before.data.items.some((i) => i.id === forumThreadId)).toBe(
          false,
        );
      }

      // A person answers → the thread needs a reply again
      const humanId = crypto.randomUUID();
      await db.insert(chatMessages).values({
        id: humanId,
        threadId: forumThreadId,
        role: ChatMessageRole.USER,
        content: "Hard disagree, hedging saves lives.",
        parentId: opened.data.messageId,
        authorId: crypto.randomUUID(),
        isAI: false,
      });
      const after = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: feedEndpoints.GET,
        data: {
          sortMode: FeedSortMode.NEW,
          page: 1,
          limit: 100,
          needsReply: true,
        },
        user: admin,
      });
      expect(after.success).toBe(true);
      if (after.success) {
        const item = after.data.items.find((i) => i.id === forumThreadId);
        expect(item?.startedByAI).toBe(true);
        expect(item?.lastMessageIsAI).toBe(false);
        expect(item?.lastMessageId).toBe(humanId);
      }

      // Reply defaults to the newest post (the human one)
      const reply = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: postEndpoints.POST,
        data: {
          draftMessageId: await createDraft(`${stamp} fair point, but`),
          threadId: forumThreadId,
          parentId: undefined,
        },
        user: admin,
      });
      expect(reply.success, JSON.stringify(reply)).toBe(true);
      if (reply.success) {
        const [replyRow] = await db
          .select({ parentId: chatMessages.parentId })
          .from(chatMessages)
          .where(inArray(chatMessages.id, [reply.data.messageId]));
        expect(replyRow?.parentId).toBe(humanId);
      }

      // A second AI answer to the same human post → refused
      const double = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: postEndpoints.POST,
        data: {
          draftMessageId: await createDraft(`${stamp} second answer`),
          threadId: forumThreadId,
          parentId: humanId,
        },
        user: admin,
      });
      expect(double.success).toBe(false);
      if (!double.success) {
        expect(double.errorType.errorCode).toBe(
          ErrorResponseTypes.CONFLICT.errorCode,
        );
      }
    },
    TEST_TIMEOUT,
  );

  it(
    "rejects an unknown category, a mainstream draft when uncensored is required, and a foreign draft",
    async () => {
      const badCategory = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: postEndpoints.POST,
        data: {
          draftMessageId: await createDraft(`${stamp} category test`),
          threadId: undefined,
          parentId: undefined,
          title: `${stamp} nowhere`,
          category: "No Such Category",
        },
        user: admin,
      });
      expect(badCategory.success).toBe(false);
      if (!badCategory.success) {
        expect(badCategory.errorType.errorCode).toBe(
          ErrorResponseTypes.NOT_FOUND.errorCode,
        );
      }

      const mainstream = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: postEndpoints.POST,
        data: {
          draftMessageId: await createDraft(
            `${stamp} mainstream draft`,
            ChatModelId.CLAUDE_SONNET_5_5,
          ),
          threadId: undefined,
          parentId: undefined,
          title: `${stamp} mainstream`,
          category: "Philosophy",
          requireUncensored: true,
        },
        user: admin,
      });
      expect(mainstream.success).toBe(false);
      if (!mainstream.success) {
        expect(mainstream.errorType.errorCode).toBe(
          ErrorResponseTypes.VALIDATION_ERROR.errorCode,
        );
      }

      // draftThreadId fallback: the newest AI message of the ai-run thread
      const viaThreadText = `${stamp} posted via draft thread`;
      await createDraft(viaThreadText);
      const draftThreadId = threadIds.at(-1);
      const viaThread = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: postEndpoints.POST,
        data: {
          draftThreadId,
          threadId: undefined,
          parentId: undefined,
          title: `${stamp} via thread`,
          category: "Philosophy",
        },
        user: admin,
      });
      expect(viaThread.success, JSON.stringify(viaThread)).toBe(true);
      if (viaThread.success) {
        threadIds.push(viaThread.data.postedThreadId);
        const [row] = await db
          .select({ content: chatMessages.content })
          .from(chatMessages)
          .where(inArray(chatMessages.id, [viaThread.data.messageId]));
        expect(row?.content).toBe(viaThreadText);
      }

      const unknownDraft = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: postEndpoints.POST,
        data: {
          draftMessageId: crypto.randomUUID(),
          threadId: undefined,
          parentId: undefined,
          title: `${stamp} ghost`,
          category: "Philosophy",
        },
        user: admin,
      });
      expect(unknownDraft.success).toBe(false);
      if (!unknownDraft.success) {
        expect(unknownDraft.errorType.errorCode).toBe(
          ErrorResponseTypes.NOT_FOUND.errorCode,
        );
      }
    },
    TEST_TIMEOUT,
  );
});
