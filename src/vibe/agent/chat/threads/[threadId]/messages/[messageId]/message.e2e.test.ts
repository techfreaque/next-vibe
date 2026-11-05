/**
 * E2E: single message — read, edit, delete (GET / PATCH / DELETE .../messages/[messageId]).
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { eq } from "drizzle-orm";
import { describe, expect } from "vitest";

import { endpointToUrlSegment } from "next-vibe/core/core-utils/path";
import { DefaultFolderId } from "next-vibe/core/execution-context";
import { db } from "next-vibe/database";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";

import { chatMessages } from "../../../../db";
import { createE2EUser, deleteE2EUser, seedMessage, seedThread, signInAs } from "../../../../testing/e2e-seed";
import messageEndpoints from "./definition";

const MISSING_MESSAGE_ID = "00000000-0000-4000-8000-00000000e2e2";
const DELETE_PAGE = `/tools/${endpointToUrlSegment(messageEndpoints.DELETE)}`;

async function messageRow(messageId: string): Promise<typeof chatMessages.$inferSelect | undefined> {
  const [row] = await db.select().from(chatMessages).where(eq(chatMessages.id, messageId));
  return row;
}

describe("E2E: message [messageId]", () => {
  const e2e = useE2E("agent/chat/threads/threadId/messages/messageId");

  e2e.it("GET loads one message", async ({ open, context, baseUrl, loginAs, uniqueEmail, cleanup }) => {
    const customer = await createE2EUser(uniqueEmail("message-get"));
    cleanup(() => deleteE2EUser(customer));
    const threadId = await seedThread(customer, { rootFolderId: DefaultFolderId.PRIVATE, title: `E2E message ${Date.now()}` });
    const messageId = await seedMessage(customer, threadId, "Read me back");
    await signInAs({ context, baseUrl, loginAs }, customer);

    const form = await open(messageEndpoints.GET, {
      query: { threadId, messageId, rootFolderId: DefaultFolderId.PRIVATE },
    });
    const loaded = await form.firstCall();
    expect(loaded.response.success, JSON.stringify(loaded.response)).toBe(true);
    if (!loaded.response.success) return;
    expect(loaded.response.data.content).toBe("Read me back");
  });

  e2e.it("GET rejects a message that does not exist", async ({ open, context, baseUrl, loginAs, uniqueEmail, cleanup }) => {
    const customer = await createE2EUser(uniqueEmail("message-get-missing"));
    cleanup(() => deleteE2EUser(customer));
    const threadId = await seedThread(customer, { rootFolderId: DefaultFolderId.PRIVATE, title: `E2E message missing ${Date.now()}` });
    await signInAs({ context, baseUrl, loginAs }, customer);

    const form = await open(messageEndpoints.GET, {
      query: { threadId, messageId: MISSING_MESSAGE_ID, rootFolderId: DefaultFolderId.PRIVATE },
    });
    const loaded = await form.firstCall();
    expect(loaded.response.success).toBe(false);
  });

  e2e.it("PATCH edits the message content", async ({ open, context, baseUrl, loginAs, uniqueEmail, cleanup }) => {
    const customer = await createE2EUser(uniqueEmail("message-patch"));
    cleanup(() => deleteE2EUser(customer));
    const threadId = await seedThread(customer, { rootFolderId: DefaultFolderId.PRIVATE, title: `E2E edit ${Date.now()}` });
    const messageId = await seedMessage(customer, threadId, "Before edit");
    await signInAs({ context, baseUrl, loginAs }, customer);

    const form = await open(messageEndpoints.PATCH, { query: { threadId, messageId } });
    await form.fill({ rootFolderId: DefaultFolderId.PRIVATE, content: "After edit" });
    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success, JSON.stringify(result.response)).toBe(true);
    expect((await messageRow(messageId))?.content).toBe("After edit");
  });

  e2e.it("PATCH blocks empty content client-side", async ({ open, context, baseUrl, loginAs, uniqueEmail, cleanup }) => {
    const customer = await createE2EUser(uniqueEmail("message-patch-empty"));
    cleanup(() => deleteE2EUser(customer));
    const threadId = await seedThread(customer, { rootFolderId: DefaultFolderId.PRIVATE, title: `E2E edit empty ${Date.now()}` });
    const messageId = await seedMessage(customer, threadId, "Keep me");
    await signInAs({ context, baseUrl, loginAs }, customer);

    const form = await open(messageEndpoints.PATCH, { query: { threadId, messageId } });
    await form.fill({ rootFolderId: DefaultFolderId.PRIVATE });
    const result = await form.submit();
    expect(result.sent).toBe(false);
    if (result.sent) return;
    expect(Object.keys(result.fieldErrors)).toContain("content");
    expect((await messageRow(messageId))?.content).toBe("Keep me");
  });

  e2e.it("DELETE removes the message after confirming", async ({ page, gotoReady, capture, context, baseUrl, loginAs, uniqueEmail, cleanup }) => {
    const customer = await createE2EUser(uniqueEmail("message-delete"));
    cleanup(() => deleteE2EUser(customer));
    const threadId = await seedThread(customer, { rootFolderId: DefaultFolderId.PRIVATE, title: `E2E delete msg ${Date.now()}` });
    const messageId = await seedMessage(customer, threadId, "Delete me");
    await signInAs({ context, baseUrl, loginAs }, customer);

    // Web renders a confirmation without inputs — the ids ride the URL
    const submit = page.locator('[data-hydrated] [data-testid="endpoint-submit"]:visible').first();
    await gotoReady(`${DELETE_PAGE}?threadId=${threadId}&messageId=${messageId}&rootFolderId=${DefaultFolderId.PRIVATE}`, () => submit.waitFor({ state: "visible" }));
    const result = await capture(messageEndpoints.DELETE, () => submit.click());
    expect(result.response.success, JSON.stringify(result.response)).toBe(true);
    expect(await messageRow(messageId)).toBeUndefined();
  });

  e2e.it("DELETE rejects a message of another user and keeps it", async ({ page, gotoReady, capture, context, baseUrl, loginAs, uniqueEmail, cleanup }) => {
    const owner = await createE2EUser(uniqueEmail("message-delete-owner"));
    cleanup(() => deleteE2EUser(owner));
    const intruder = await createE2EUser(uniqueEmail("message-delete-intruder"));
    cleanup(() => deleteE2EUser(intruder));
    const threadId = await seedThread(owner, { rootFolderId: DefaultFolderId.PRIVATE, title: `E2E keep msg ${Date.now()}` });
    const messageId = await seedMessage(owner, threadId, "Not yours");
    await signInAs({ context, baseUrl, loginAs }, intruder);

    const submit = page.locator('[data-hydrated] [data-testid="endpoint-submit"]:visible').first();
    await gotoReady(`${DELETE_PAGE}?threadId=${threadId}&messageId=${messageId}&rootFolderId=${DefaultFolderId.PRIVATE}`, () => submit.waitFor({ state: "visible" }));
    const result = await capture(messageEndpoints.DELETE, () => submit.click());
    expect(result.response.success).toBe(false);
    expect((await messageRow(messageId))?.content).toBe("Not yours");
  });
});
