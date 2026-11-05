/**
 * E2E: conversation path — the branch from root to leaf (GET .../messages/path).
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { describe, expect } from "vitest";

import { DefaultFolderId } from "next-vibe/core/execution-context";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";

import { createE2EUser, deleteE2EUser, seedMessage, seedThread, signInAs } from "../../../../testing/e2e-seed";
import pathEndpoints from "./definition";

const MISSING_THREAD_ID = "00000000-0000-4000-8000-00000000e2e3";

describe("E2E: message path", () => {
  const e2e = useE2E("agent/chat/threads/threadId/messages/path");

  e2e.it("GET resolves the requested branch and returns its chunk", async ({ open, context, baseUrl, loginAs, uniqueEmail, cleanup }) => {
    const customer = await createE2EUser(uniqueEmail("path-get"));
    cleanup(() => deleteE2EUser(customer));
    const threadId = await seedThread(customer, { rootFolderId: DefaultFolderId.PRIVATE, title: `E2E path ${Date.now()}` });
    const root = await seedMessage(customer, threadId, "Root");
    const branchA = await seedMessage(customer, threadId, "Branch A", { parentId: root });
    const branchB = await seedMessage(customer, threadId, "Branch B", { parentId: root });
    await signInAs({ context, baseUrl, loginAs }, customer);

    const form = await open(pathEndpoints.GET, {
      query: { threadId, rootFolderId: DefaultFolderId.PRIVATE, leafMessageId: branchA },
    });
    const loaded = await form.firstCall();
    expect(loaded.response.success, JSON.stringify(loaded.response)).toBe(true);
    if (!loaded.response.success) return;
    // The leaf resolves to the requested branch; the chunk carries every
    // sibling so the client can switch branches without a round-trip.
    expect(loaded.response.data.resolvedLeafMessageId).toBe(branchA);
    expect(loaded.response.data.messages.map((m) => m.id).toSorted()).toEqual([root, branchA, branchB].toSorted());
    expect(loaded.response.data.hasOlderHistory).toBe(false);
  });

  e2e.it("GET rejects a thread that does not exist", async ({ open, context, baseUrl, loginAs, uniqueEmail, cleanup }) => {
    const customer = await createE2EUser(uniqueEmail("path-missing"));
    cleanup(() => deleteE2EUser(customer));
    await signInAs({ context, baseUrl, loginAs }, customer);

    const form = await open(pathEndpoints.GET, {
      query: { threadId: MISSING_THREAD_ID, rootFolderId: DefaultFolderId.PRIVATE },
    });
    const loaded = await form.firstCall();
    expect(loaded.response.success).toBe(false);
  });
});
