/**
 * E2E: thread messages — list and append (GET / POST threads/[threadId]/messages).
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { eq } from "drizzle-orm";
import { DefaultFolderId } from "next-vibe/core/execution-context";
import { db } from "next-vibe/database";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";

import { chatMessages } from "../../../db";
import { ChatMessageRole } from "../../../enum";
import { createE2EUser, deleteE2EUser, seedMessage, seedThread, signInAs } from "../../../testing/e2e-seed";
import messagesEndpoints from "./definition";

const MISSING_THREAD_ID = "00000000-0000-4000-8000-00000000e2e1";

describe("E2E: thread messages", () => {
  const e2e = useE2E("agent/chat/threads/threadId/messages");

  e2e.it("GET lists the thread's messages in order", async ({ open, context, baseUrl, loginAs, uniqueEmail, cleanup }) => {
    const customer = await createE2EUser(uniqueEmail("messages-get"));
    cleanup(() => deleteE2EUser(customer));
    const threadId = await seedThread(customer, { rootFolderId: DefaultFolderId.PRIVATE, title: `E2E messages ${Date.now()}` });
    const first = await seedMessage(customer, threadId, "First message");
    const second = await seedMessage(customer, threadId, "Second message", {
      parentId: first,
    });
    await signInAs({ context, baseUrl, loginAs }, customer);

    // Display-only widget (the chat transcript) — no request inputs to drive
    const form = await open(messagesEndpoints.GET, {
      query: { threadId, rootFolderId: DefaultFolderId.PRIVATE },
      ready: (page) =>
        page.getByText("Second message", { exact: true }).locator("visible=true").first().waitFor({ state: "visible" }),
    });
    const loaded = await form.firstCall();
    expect(loaded.response.success, JSON.stringify(loaded.response)).toBe(true);
    if (!loaded.response.success) return;
    expect(loaded.response.data.messages.map((m) => m.id)).toEqual([first, second]);
  });

  e2e.it("GET rejects a thread that does not exist", async ({ open, context, baseUrl, loginAs, uniqueEmail, cleanup }) => {
    const customer = await createE2EUser(uniqueEmail("messages-get-missing"));
    cleanup(() => deleteE2EUser(customer));
    await signInAs({ context, baseUrl, loginAs }, customer);

    const form = await open(messagesEndpoints.GET, {
      query: { threadId: MISSING_THREAD_ID, rootFolderId: DefaultFolderId.PRIVATE },
      ready: (page) => page.waitForLoadState("networkidle"),
    });
    const loaded = await form.firstCall();
    expect(loaded.response.success).toBe(false);
  });

  e2e.it("POST appends a message to the thread", async ({ open, context, baseUrl, loginAs, uniqueEmail, cleanup }) => {
    const customer = await createE2EUser(uniqueEmail("messages-post"));
    cleanup(() => deleteE2EUser(customer));
    const threadId = await seedThread(customer, { rootFolderId: DefaultFolderId.PRIVATE, title: `E2E post ${Date.now()}` });
    await signInAs({ context, baseUrl, loginAs }, customer);

    const form = await open(messagesEndpoints.POST, { query: { threadId } });
    await form.fill({
      rootFolderId: DefaultFolderId.PRIVATE,
      role: ChatMessageRole.USER,
      content: "Typed in the browser",
    });
    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success, JSON.stringify(result.response)).toBe(true);
    if (!result.response.success) return;

    const [row] = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.id, result.response.data.messageId));
    expect(row?.threadId).toBe(threadId);
    expect(row?.content).toBe("Typed in the browser");
  });

  e2e.it("POST blocks an empty message client-side", async ({ open, context, baseUrl, loginAs, uniqueEmail, cleanup }) => {
    const customer = await createE2EUser(uniqueEmail("messages-post-empty"));
    cleanup(() => deleteE2EUser(customer));
    const threadId = await seedThread(customer, { rootFolderId: DefaultFolderId.PRIVATE, title: `E2E post empty ${Date.now()}` });
    await signInAs({ context, baseUrl, loginAs }, customer);

    const form = await open(messagesEndpoints.POST, { query: { threadId } });
    await form.fill({ rootFolderId: DefaultFolderId.PRIVATE });
    const result = await form.submit();
    expect(result.sent).toBe(false);
    if (result.sent) return;
    expect(Object.keys(result.fieldErrors)).toContain("content");
  });
});
