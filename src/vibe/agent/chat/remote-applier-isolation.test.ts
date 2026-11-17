/**
 * Remote applier isolation — integration tests against the real DB.
 *
 * A connected peer instance holds customer A's token and fully controls every
 * id in a relayed envelope / sync payload. These tests replay events AS A that
 * name customer B's threads, messages and folders, and assert B's rows stay
 * untouched. Positive cases prove A's own mirror still applies (so a drop is
 * the ownership guard, not an envelope parse failure).
 *
 *   ISO1  — message-created into B's thread is dropped
 *   ISO2  — message-created reusing B's message id (A's new thread) is dropped
 *   ISO3  — content-done / content-delta / tool-result / tokens-updated on B's message
 *   ISO4  — stream-finished / streaming-state-changed on B's thread
 *   ISO5  — thread-title-updated (threads + folder-contents) on B's thread
 *   ISO6  — thread-created with B's thread id
 *   ISO7  — folder-deleted with B's folder id keeps B's folder + threads
 *   ISO8  — thread-updated / thread-deleted on B's thread
 *   ISO9  — sync payload naming B's thread + message
 *   ISO10 — A's own mirror: content-done, message-created and sync still apply
 */

import "server-only";

import { randomUUID } from "node:crypto";

import { and, eq, inArray } from "drizzle-orm";
import { DefaultFolderId } from "next-vibe/core/execution-context";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { createEndpointLogger } from "next-vibe/logger/server";
import { dispatchRemoteEvent } from "next-vibe/realtime/remote-event-bridge/registry";
import { applySyncPayloads } from "next-vibe/remote-connection/sync/provider";
import {
  createTestUser,
  deleteTestUser,
  type TestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { chatFolders, chatMessages, chatThreads } from "./db";
import { ChatMessageRole, ThreadStatus, ThreadStreamingState } from "./enum";

const logger = createEndpointLogger(false, defaultLocale);
const stamp = Date.now();
const PEER = `iso-peer-${stamp}`;

const MESSAGES_PATH = [
  "vibe",
  "agent",
  "chat",
  "threads",
  "[threadId]",
  "messages",
] as const;
const THREADS_PATH = ["vibe", "agent", "chat", "threads"] as const;
const THREAD_BY_ID_PATH = [
  "vibe",
  "agent",
  "chat",
  "threads",
  "[threadId]",
] as const;
const FOLDER_CONTENTS_PATH = [
  "vibe",
  "agent",
  "chat",
  "folder-contents",
  "[rootFolderId]",
] as const;

let customerA: TestUser;
let customerB: TestUser;

// B's data
const bThreadId = randomUUID();
const bMessageId = randomUUID();
const bFolderId = randomUUID();
const bFolderThreadId = randomUUID();
// A's own mirror
const aMirrorThreadId = randomUUID();
const aMirrorMessageId = randomUUID();
// Ids A tries to create
const aNewThreadId = randomUUID();
const aNewMessageId = randomUUID();
const aSyncThreadId = randomUUID();

const B_TITLE = "B secret thread";
const B_CONTENT = "B original content";

async function relay(params: {
  path: readonly string[];
  method: string;
  eventName: string;
  responseData?: Record<string, WireValue>;
  requestData?: Record<string, WireValue>;
  urlPathParams?: Record<string, string>;
}): Promise<void> {
  await dispatchRemoteEvent(
    params.path,
    params.method,
    {
      endpointPath: params.path,
      endpointMethod: params.method,
      eventName: params.eventName,
      responseData: params.responseData ?? {},
      requestData: params.requestData ?? {},
      urlPathParams: params.urlPathParams ?? {},
      payload: undefined,
    },
    {
      instanceId: `iso-self-${stamp}`,
      originInstanceId: PEER,
      user: customerA.user,
      locale: defaultLocale,
      logger,
      isServer: true,
    },
  );
}

type WireValue =
  | string
  | number
  | boolean
  | null
  | WireValue[]
  | { [key: string]: WireValue };

async function bMessage(): Promise<
  | {
      threadId: string;
      content: string | null;
      authorId: string | null;
      metadata: Record<string, WireValue> | null;
    }
  | undefined
> {
  const [row] = await db
    .select({
      threadId: chatMessages.threadId,
      content: chatMessages.content,
      authorId: chatMessages.authorId,
      metadata: chatMessages.metadata,
    })
    .from(chatMessages)
    .where(eq(chatMessages.id, bMessageId));
  return row
    ? {
        threadId: row.threadId,
        content: row.content,
        authorId: row.authorId,
        metadata: row.metadata ? JSON.parse(JSON.stringify(row.metadata)) : null,
      }
    : undefined;
}

async function bThread(): Promise<
  | {
      userId: string | null;
      title: string;
      rootFolderId: string;
      streamingState: string;
      originInstanceId: string | null;
    }
  | undefined
> {
  const [row] = await db
    .select({
      userId: chatThreads.userId,
      title: chatThreads.title,
      rootFolderId: chatThreads.rootFolderId,
      streamingState: chatThreads.streamingState,
      originInstanceId: chatThreads.originInstanceId,
    })
    .from(chatThreads)
    .where(eq(chatThreads.id, bThreadId));
  return row;
}

async function messageIdsIn(threadId: string): Promise<string[]> {
  const rows = await db
    .select({ id: chatMessages.id })
    .from(chatMessages)
    .where(eq(chatMessages.threadId, threadId));
  return rows.map((r) => r.id).toSorted();
}

describe("remote applier isolation", () => {
  beforeAll(async () => {
    const a = await createTestUser(`iso-a-${stamp}@example.com`, "Iso A");
    const b = await createTestUser(`iso-b-${stamp}@example.com`, "Iso B");
    if (!a.success || !b.success) {
      expect.fail("test users could not be created");
    }
    customerA = a.data;
    customerB = b.data;

    await db.insert(chatThreads).values({
      id: bThreadId,
      userId: customerB.user.id,
      rootFolderId: DefaultFolderId.PRIVATE,
      title: B_TITLE,
      streamingState: ThreadStreamingState.STREAMING,
    });
    await db.insert(chatMessages).values({
      id: bMessageId,
      threadId: bThreadId,
      role: ChatMessageRole.USER,
      content: B_CONTENT,
      isAI: false,
      authorId: customerB.user.id,
      metadata: {},
    });
    await db.insert(chatFolders).values({
      id: bFolderId,
      userId: customerB.user.id,
      rootFolderId: DefaultFolderId.PRIVATE,
      name: "B folder",
    });
    await db.insert(chatThreads).values({
      id: bFolderThreadId,
      userId: customerB.user.id,
      rootFolderId: DefaultFolderId.PRIVATE,
      folderId: bFolderId,
      title: "B folder thread",
    });

    await db.insert(chatThreads).values({
      id: aMirrorThreadId,
      userId: customerA.user.id,
      rootFolderId: DefaultFolderId.REMOTE,
      title: "A mirror",
      originInstanceId: PEER,
    });
    await db.insert(chatMessages).values({
      id: aMirrorMessageId,
      threadId: aMirrorThreadId,
      role: ChatMessageRole.ASSISTANT,
      content: "A old",
      isAI: true,
      metadata: {},
    });
  }, 60_000);

  afterAll(async () => {
    const threadIds = [
      bThreadId,
      bFolderThreadId,
      aMirrorThreadId,
      aNewThreadId,
      aSyncThreadId,
    ];
    await db
      .delete(chatMessages)
      .where(inArray(chatMessages.threadId, threadIds));
    await db.delete(chatThreads).where(inArray(chatThreads.id, threadIds));
    await db.delete(chatFolders).where(eq(chatFolders.id, bFolderId));
    if (customerA) {
      await deleteTestUser(customerA.user.id);
    }
    if (customerB) {
      await deleteTestUser(customerB.user.id);
    }
  }, 60_000);

  it("ISO1: message-created into B's thread is dropped", async () => {
    await relay({
      path: MESSAGES_PATH,
      method: "GET",
      eventName: "message-created",
      urlPathParams: { threadId: bThreadId },
      responseData: {
        messages: [
          {
            id: aNewMessageId,
            threadId: bThreadId,
            role: ChatMessageRole.ASSISTANT,
            content: "injected",
            isAI: true,
            authorId: customerB.user.id,
          },
        ],
        streamingState: ThreadStreamingState.IDLE,
      },
    });
    expect(await messageIdsIn(bThreadId)).toEqual([bMessageId]);
    const thread = await bThread();
    expect(thread?.streamingState).toBe(ThreadStreamingState.STREAMING);
    expect(thread?.userId).toBe(customerB.user.id);
  });

  it("ISO2: message-created reusing B's message id is dropped", async () => {
    await relay({
      path: MESSAGES_PATH,
      method: "GET",
      eventName: "message-created",
      urlPathParams: { threadId: aNewThreadId },
      responseData: {
        messages: [
          {
            id: bMessageId,
            threadId: aNewThreadId,
            role: ChatMessageRole.ASSISTANT,
            content: "overwrite",
            isAI: true,
          },
        ],
      },
    });
    const msg = await bMessage();
    expect(msg?.threadId).toBe(bThreadId);
    expect(msg?.content).toBe(B_CONTENT);
    // The whole event is dropped — no stub thread for A either.
    const [stub] = await db
      .select({ id: chatThreads.id })
      .from(chatThreads)
      .where(eq(chatThreads.id, aNewThreadId));
    expect(stub).toBeUndefined();
  });

  it("ISO3: content/tool/token events on B's message are dropped", async () => {
    for (const threadId of [bThreadId, aMirrorThreadId]) {
      await relay({
        path: MESSAGES_PATH,
        method: "GET",
        eventName: "content-done",
        urlPathParams: { threadId },
        responseData: { messages: [{ id: bMessageId, content: "done" }] },
      });
      await relay({
        path: MESSAGES_PATH,
        method: "GET",
        eventName: "content-delta",
        urlPathParams: { threadId },
        responseData: { messages: [{ id: bMessageId, content: " delta" }] },
      });
      await relay({
        path: MESSAGES_PATH,
        method: "GET",
        eventName: "tokens-updated",
        urlPathParams: { threadId },
        responseData: {
          messages: [{ id: bMessageId, metadata: { promptTokens: 999 } }],
        },
      });
      await relay({
        path: MESSAGES_PATH,
        method: "GET",
        eventName: "tool-result",
        urlPathParams: { threadId },
        responseData: {
          messages: [
            {
              id: bMessageId,
              metadata: {
                toolCall: {
                  toolCallId: "iso-call",
                  toolName: "iso-tool",
                  args: {},
                  status: "completed",
                },
              },
            },
          ],
        },
      });
    }
    const msg = await bMessage();
    expect(msg?.threadId).toBe(bThreadId);
    expect(msg?.content).toBe(B_CONTENT);
    expect(msg?.metadata ?? {}).toEqual({});
    expect(await messageIdsIn(aMirrorThreadId)).toEqual([aMirrorMessageId]);
  });

  it("ISO4: stream state events on B's thread are dropped", async () => {
    await relay({
      path: MESSAGES_PATH,
      method: "GET",
      eventName: "streaming-state-changed",
      urlPathParams: { threadId: bThreadId },
      responseData: { streamingState: ThreadStreamingState.IDLE },
    });
    await relay({
      path: MESSAGES_PATH,
      method: "GET",
      eventName: "stream-finished",
      urlPathParams: { threadId: bThreadId },
      responseData: { streamingState: ThreadStreamingState.IDLE },
    });
    expect((await bThread())?.streamingState).toBe(
      ThreadStreamingState.STREAMING,
    );
  });

  it("ISO5: thread-title-updated on B's thread is dropped", async () => {
    await relay({
      path: THREADS_PATH,
      method: "GET",
      eventName: "thread-title-updated",
      responseData: { threads: [{ id: bThreadId, title: "pwned 1" }] },
    });
    await relay({
      path: FOLDER_CONTENTS_PATH,
      method: "GET",
      eventName: "thread-title-updated",
      urlPathParams: { rootFolderId: DefaultFolderId.PUBLIC },
      responseData: { items: [{ id: bThreadId, title: "pwned 2" }] },
    });
    expect((await bThread())?.title).toBe(B_TITLE);
  });

  it("ISO6: thread-created with B's thread id is dropped", async () => {
    await relay({
      path: THREADS_PATH,
      method: "POST",
      eventName: "thread-created",
      requestData: {
        id: bThreadId,
        title: "pwned 3",
        rootFolderId: DefaultFolderId.PRIVATE,
        subFolderId: bFolderId,
      },
    });
    const thread = await bThread();
    expect(thread?.title).toBe(B_TITLE);
    expect(thread?.rootFolderId).toBe(DefaultFolderId.PRIVATE);
    expect(thread?.userId).toBe(customerB.user.id);
  });

  it("ISO7: folder-deleted with B's folder id keeps B's folder + threads", async () => {
    await relay({
      path: FOLDER_CONTENTS_PATH,
      method: "GET",
      eventName: "folder-deleted",
      urlPathParams: { rootFolderId: DefaultFolderId.PRIVATE },
      responseData: {
        items: [{ id: bFolderId, rootFolderId: DefaultFolderId.PRIVATE }],
      },
    });
    const [folder] = await db
      .select({ id: chatFolders.id })
      .from(chatFolders)
      .where(eq(chatFolders.id, bFolderId));
    expect(folder?.id).toBe(bFolderId);
    const [thread] = await db
      .select({ id: chatThreads.id, folderId: chatThreads.folderId })
      .from(chatThreads)
      .where(eq(chatThreads.id, bFolderThreadId));
    expect(thread?.folderId).toBe(bFolderId);
  });

  it("ISO8: thread-updated / thread-deleted on B's thread are dropped", async () => {
    await relay({
      path: THREAD_BY_ID_PATH,
      method: "PATCH",
      eventName: "thread-updated",
      urlPathParams: { threadId: bThreadId },
      requestData: { title: "pwned 4", rootFolderId: DefaultFolderId.PRIVATE },
    });
    await relay({
      path: THREAD_BY_ID_PATH,
      method: "DELETE",
      eventName: "thread-deleted",
      urlPathParams: { threadId: bThreadId },
      requestData: { rootFolderId: DefaultFolderId.PRIVATE },
    });
    const thread = await bThread();
    expect(thread?.title).toBe(B_TITLE);
    expect(await messageIdsIn(bThreadId)).toEqual([bMessageId]);
  });

  it("ISO9: sync payload naming B's thread and message is dropped", async () => {
    const now = new Date().toISOString();
    const syncedMessage = (
      id: string,
      content: string,
    ): Record<string, WireValue> => ({
      id,
      role: ChatMessageRole.ASSISTANT,
      content,
      parentId: null,
      sequenceId: null,
      authorId: customerB.user.id,
      authorName: null,
      isAI: true,
      model: null,
      skill: null,
      metadata: null,
      createdAt: now,
      updatedAt: now,
    });
    const syncedThread = (
      id: string,
      messages: Record<string, WireValue>[],
    ): Record<string, WireValue> => ({
      id,
      originInstanceId: PEER,
      folderId: null,
      originRootFolderId: DefaultFolderId.PRIVATE,
      loopInstanceId: null,
      title: "synced",
      status: ThreadStatus.ACTIVE,
      defaultModel: null,
      defaultSkill: null,
      systemPrompt: null,
      description: null,
      tags: [],
      pinned: false,
      archived: false,
      updatedAt: now,
      messages,
    });
    await applySyncPayloads(
      {
        threads: JSON.stringify({
          senderInstanceId: PEER,
          threads: [
            // B's thread id with a fresh message.
            syncedThread(bThreadId, [syncedMessage(randomUUID(), "inject")]),
            // A's new thread but reusing B's message id.
            syncedThread(aSyncThreadId, [
              syncedMessage(bMessageId, "overwrite"),
            ]),
          ],
        }),
      },
      customerA.user.id,
      logger,
    );
    const thread = await bThread();
    expect(thread?.title).toBe(B_TITLE);
    expect(thread?.userId).toBe(customerB.user.id);
    expect(await messageIdsIn(bThreadId)).toEqual([bMessageId]);
    const msg = await bMessage();
    expect(msg?.threadId).toBe(bThreadId);
    expect(msg?.content).toBe(B_CONTENT);
    // A's own synced thread lands (as a REMOTE mirror), just without the
    // foreign message.
    const [aSynced] = await db
      .select({
        userId: chatThreads.userId,
        rootFolderId: chatThreads.rootFolderId,
      })
      .from(chatThreads)
      .where(eq(chatThreads.id, aSyncThreadId));
    expect(aSynced?.userId).toBe(customerA.user.id);
    expect(aSynced?.rootFolderId).toBe(DefaultFolderId.REMOTE);
    expect(await messageIdsIn(aSyncThreadId)).toEqual([]);
  });

  it("ISO10: A's own mirror still applies", async () => {
    await relay({
      path: MESSAGES_PATH,
      method: "GET",
      eventName: "content-done",
      urlPathParams: { threadId: aMirrorThreadId },
      responseData: { messages: [{ id: aMirrorMessageId, content: "A new" }] },
    });
    const [mirrorMsg] = await db
      .select({ content: chatMessages.content })
      .from(chatMessages)
      .where(eq(chatMessages.id, aMirrorMessageId));
    expect(mirrorMsg?.content).toBe("A new");

    // Brand-new mirror thread via message-created: stub owned by A; a wire
    // authorId naming B is re-attributed to A.
    await relay({
      path: MESSAGES_PATH,
      method: "GET",
      eventName: "message-created",
      urlPathParams: { threadId: aNewThreadId },
      responseData: {
        messages: [
          {
            id: aNewMessageId,
            threadId: aNewThreadId,
            role: ChatMessageRole.USER,
            content: "hello",
            isAI: false,
            authorId: customerB.user.id,
          },
        ],
      },
    });
    const [stub] = await db
      .select({
        userId: chatThreads.userId,
        rootFolderId: chatThreads.rootFolderId,
        originInstanceId: chatThreads.originInstanceId,
      })
      .from(chatThreads)
      .where(eq(chatThreads.id, aNewThreadId));
    expect(stub?.userId).toBe(customerA.user.id);
    expect(stub?.rootFolderId).toBe(DefaultFolderId.REMOTE);
    expect(stub?.originInstanceId).toBe(PEER);
    const [created] = await db
      .select({
        content: chatMessages.content,
        authorId: chatMessages.authorId,
      })
      .from(chatMessages)
      .where(
        and(
          eq(chatMessages.id, aNewMessageId),
          eq(chatMessages.threadId, aNewThreadId),
        ),
      );
    expect(created?.content).toBe("hello");
    expect(created?.authorId).toBe(customerA.user.id);

    // Own-thread title update still applies.
    await relay({
      path: THREADS_PATH,
      method: "GET",
      eventName: "thread-title-updated",
      responseData: { threads: [{ id: aMirrorThreadId, title: "A renamed" }] },
    });
    const [renamed] = await db
      .select({ title: chatThreads.title })
      .from(chatThreads)
      .where(eq(chatThreads.id, aMirrorThreadId));
    expect(renamed?.title).toBe("A renamed");
  });
});
