/**
 * E2E: thread list (GET threads) — the customer's own threads, per root folder.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import type { Page } from "playwright";
import { describe, expect } from "vitest";

import { DefaultFolderId } from "next-vibe/core/execution-context";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";

import threadsEndpoints from "./definition";
import { createE2EUser, deleteE2EUser, seedThread, signInAs } from "../testing/e2e-seed";

/** The list widget renders rows, not filter inputs — ready once `text` shows. */
function visibleText(page: Page, text: string): Promise<void> {
  return page.getByText(text, { exact: true }).locator("visible=true").first().waitFor({ state: "visible" });
}

describe("E2E: thread list", () => {
  const e2e = useE2E("agent/chat/threads");

  e2e.it("lists the customer's own threads, never another user's", async ({ open, context, baseUrl, loginAs, uniqueEmail, cleanup }) => {
    const customer = await createE2EUser(uniqueEmail("threads-list"));
    cleanup(() => deleteE2EUser(customer));
    const stranger = await createE2EUser(uniqueEmail("threads-list-stranger"));
    cleanup(() => deleteE2EUser(stranger));
    const stamp = Date.now();
    const mine = await seedThread(customer, { rootFolderId: DefaultFolderId.PRIVATE, title: `E2E mine ${stamp}` });
    const foreign = await seedThread(stranger, { rootFolderId: DefaultFolderId.PRIVATE, title: `E2E foreign ${stamp}` });
    await signInAs({ context, baseUrl, loginAs }, customer);

    const form = await open(threadsEndpoints.GET, {
      query: { rootFolderId: DefaultFolderId.PRIVATE },
      ready: (page) => visibleText(page, `E2E mine ${stamp}`),
    });
    const loaded = await form.firstCall();
    expect(loaded.response.success, JSON.stringify(loaded.response)).toBe(true);
    if (!loaded.response.success) return;
    const ids = loaded.response.data.threads.map((t) => t.id);
    expect(ids).toContain(mine);
    expect(ids).not.toContain(foreign);
  });

  e2e.it("defaults to the private folder when none is given", async ({ open, context, baseUrl, loginAs, uniqueEmail, cleanup }) => {
    const customer = await createE2EUser(uniqueEmail("threads-default"));
    cleanup(() => deleteE2EUser(customer));
    const title = `E2E default ${Date.now()}`;
    const mine = await seedThread(customer, { rootFolderId: DefaultFolderId.PRIVATE, title });
    await signInAs({ context, baseUrl, loginAs }, customer);

    const form = await open(threadsEndpoints.GET, { ready: (page) => visibleText(page, title) });
    const loaded = await form.firstCall();
    expect(loaded.response.success, JSON.stringify(loaded.response)).toBe(true);
    if (!loaded.response.success) return;
    expect(loaded.response.data.threads.map((t) => t.id)).toContain(mine);
  });
});
