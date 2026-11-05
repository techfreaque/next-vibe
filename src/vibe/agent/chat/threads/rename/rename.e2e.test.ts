/**
 * E2E: rename-thread tool — real browser against the running server.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { describe, expect } from "vitest";

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { DefaultFolderId } from "next-vibe/core/execution-context";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";

import { createE2EUser, deleteE2EUser, seedThread, signInAs } from "../../testing/e2e-seed";
import renameEndpoints from "./definition";
import { scopedTranslation } from "./i18n";

const endpoint = renameEndpoints.PATCH;

describe("E2E: rename thread", () => {
  const e2e = useE2E("agent/chat/threads/rename");
  const { t } = scopedTranslation.scopedT(defaultLocale);

  e2e.it("picks a thread from the list and renames it", async ({ open, page, context, baseUrl, loginAs, uniqueEmail, cleanup }) => {
    const customer = await createE2EUser(uniqueEmail("rename"));
    cleanup(() => deleteE2EUser(customer));
    const title = `E2E rename ${Date.now()}`;
    const threadId = await seedThread(customer, { rootFolderId: DefaultFolderId.PRIVATE, title });
    await signInAs({ context, baseUrl, loginAs }, customer);

    const form = await open(endpoint);
    const newTitle = `${title} renamed`;
    await form.fill({ threadId, title: newTitle, description: "Picked from the list" });

    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success, JSON.stringify(result.response)).toBe(true);
    if (!result.response.success) return;
    expect(result.response.data.updatedThreadId).toBe(threadId);
    expect(result.response.data.updatedTitle).toBe(newTitle);

    // Success view replaces the form
    await page.getByText(t("patch.success.description")).waitFor({ state: "visible" });
  });

  e2e.it("blocks an empty title client-side", async ({ open, context, baseUrl, loginAs, uniqueEmail, cleanup }) => {
    const customer = await createE2EUser(uniqueEmail("rename-empty"));
    cleanup(() => deleteE2EUser(customer));
    await signInAs({ context, baseUrl, loginAs }, customer);

    const form = await open(endpoint);
    const result = await form.submit();
    expect(result.sent).toBe(false);
    if (result.sent) return;
    expect(Object.keys(result.fieldErrors)).toContain("title");
  });
});
