/**
 * E2E: single thread — read, update, delete (GET / PATCH / DELETE threads/[threadId]).
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { eq } from "drizzle-orm";
import type { Page } from "playwright";
import { describe, expect } from "vitest";

import { DefaultFolderId } from "next-vibe/core/execution-context";
import { db } from "next-vibe/database";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";

import { defaultLocale } from "next-vibe/core/i18n/core/config";

import { chatThreads } from "../../db";
import { chatReady, createE2EUser, deleteE2EUser, seedThread, signInAs, suppressWelcomeTour } from "../../testing/e2e-seed";
import { scopedTranslation as foldersScopedTranslation } from "../../folders/[rootFolderId]/i18n";
import threadEndpoints from "./definition";

const MISSING_THREAD_ID = "00000000-0000-4000-8000-00000000e2e0";

async function threadRow(threadId: string): Promise<typeof chatThreads.$inferSelect | undefined> {
  const [row] = await db.select().from(chatThreads).where(eq(chatThreads.id, threadId));
  return row;
}

describe("E2E: thread [threadId]", () => {
  const e2e = useE2E("agent/chat/threads/threadId");
  // The sidebar rows are rendered by the folder-contents widget (folders i18n)
  const { t } = foldersScopedTranslation.scopedT(defaultLocale);

  /**
   * Open the "⋮" menu of the sidebar row showing `title` and pick `item`.
   * The sidebar is hand-built (no [data-hydrated]): a click on SSR markup is
   * lost, so retry until the menu actually opens.
   */
  async function pickRowAction(page: Page, title: string, item: string): Promise<void> {
    const row = page
      .locator("div.cursor-pointer", { has: page.getByText(title, { exact: true }) })
      .last();
    const menuItem = page.getByRole("menuitem", { name: item });
    for (let attempt = 0; attempt < 10; attempt++) {
      await row.hover();
      await row.getByRole("button").last().click();
      if (await menuItem.waitFor({ state: "visible", timeout: 2_000 }).then(() => true, () => false)) {
        await menuItem.click();
        return;
      }
      await page.keyboard.press("Escape");
    }
    expect(false, `[e2e] sidebar menu for "${title}" never opened`).toBe(true);
  }

  e2e.it("sidebar: renames the open thread inline", async ({ page, gotoReady, capture, context, baseUrl, loginAs, uniqueEmail, cleanup }) => {
    const customer = await createE2EUser(uniqueEmail("thread-sidebar-rename"));
    cleanup(() => deleteE2EUser(customer));
    const title = `E2E sidebar ${Date.now()}`;
    const threadId = await seedThread(customer, { rootFolderId: DefaultFolderId.PRIVATE, title });
    await signInAs({ context, baseUrl, loginAs }, customer);

    await suppressWelcomeTour(context);
    await gotoReady(`/threads/${DefaultFolderId.PRIVATE}/${threadId}`, chatReady(page));
    await pickRowAction(page, title, t("widget.actions.rename"));
    const input = page.locator(`input[value="${title}"]`);
    await input.fill(`${title} renamed`);
    // fill() leaves the input focused; its value attribute no longer matches the old title
    const result = await capture(threadEndpoints.PATCH, () => page.keyboard.press("Enter"));
    expect(result.response.success, JSON.stringify(result.response)).toBe(true);
    expect(result.requestBody).toMatchObject({ title: `${title} renamed`, rootFolderId: DefaultFolderId.PRIVATE });
    expect((await threadRow(threadId))?.title).toBe(`${title} renamed`);
    await page.getByText(`${title} renamed`, { exact: true }).first().waitFor({ state: "visible" });
  });

  e2e.it("sidebar: deletes the open thread after confirming", async ({ page, gotoReady, capture, context, baseUrl, loginAs, uniqueEmail, cleanup }) => {
    const customer = await createE2EUser(uniqueEmail("thread-sidebar-delete"));
    cleanup(() => deleteE2EUser(customer));
    const title = `E2E sidebar delete ${Date.now()}`;
    const threadId = await seedThread(customer, { rootFolderId: DefaultFolderId.PRIVATE, title });
    await signInAs({ context, baseUrl, loginAs }, customer);

    await suppressWelcomeTour(context);
    await gotoReady(`/threads/${DefaultFolderId.PRIVATE}/${threadId}`, chatReady(page));
    await pickRowAction(page, title, t("widget.common.delete"));
    const dialog = page.getByRole("alertdialog");
    await dialog.getByText(t("widget.threadList.deleteDialog.title")).waitFor({ state: "visible" });
    const result = await capture(threadEndpoints.DELETE, () =>
      dialog.getByRole("button", { name: t("widget.common.delete") }).click(),
    );
    expect(result.response.success, JSON.stringify(result.response)).toBe(true);
    expect(await threadRow(threadId)).toBeUndefined();
  });

  e2e.it("GET loads the owner's thread", async ({ open, context, baseUrl, loginAs, uniqueEmail, cleanup }) => {
    const customer = await createE2EUser(uniqueEmail("thread-get"));
    cleanup(() => deleteE2EUser(customer));
    const title = `E2E get ${Date.now()}`;
    const threadId = await seedThread(customer, { rootFolderId: DefaultFolderId.PRIVATE, title });
    await signInAs({ context, baseUrl, loginAs }, customer);

    const form = await open(threadEndpoints.GET, {
      query: { threadId, rootFolderId: DefaultFolderId.PRIVATE },
    });
    const loaded = await form.firstCall();
    expect(loaded.response.success, JSON.stringify(loaded.response)).toBe(true);
    if (!loaded.response.success) return;
    expect(loaded.response.data.title).toBe(title);
    expect(loaded.response.data.rootFolderId).toBe(DefaultFolderId.PRIVATE);
  });

  e2e.it("GET rejects a thread that does not exist", async ({ open, context, baseUrl, loginAs, uniqueEmail, cleanup }) => {
    const customer = await createE2EUser(uniqueEmail("thread-get-missing"));
    cleanup(() => deleteE2EUser(customer));
    await signInAs({ context, baseUrl, loginAs }, customer);

    const form = await open(threadEndpoints.GET, {
      query: { threadId: MISSING_THREAD_ID, rootFolderId: DefaultFolderId.PRIVATE },
    });
    const loaded = await form.firstCall();
    expect(loaded.response.success).toBe(false);
    expect(loaded.status).toBe(404);
  });

  e2e.it("PATCH updates title and description", async ({ open, context, baseUrl, loginAs, uniqueEmail, cleanup }) => {
    const customer = await createE2EUser(uniqueEmail("thread-patch"));
    cleanup(() => deleteE2EUser(customer));
    const threadId = await seedThread(customer, { rootFolderId: DefaultFolderId.PRIVATE, title: `E2E patch ${Date.now()}` });
    await signInAs({ context, baseUrl, loginAs }, customer);

    const form = await open(threadEndpoints.PATCH, { query: { threadId } });
    const newTitle = `E2E patched ${Date.now()}`;
    await form.fill({
      rootFolderId: DefaultFolderId.PRIVATE,
      title: newTitle,
      description: "Updated through the form",
      pinned: true,
    });
    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success, JSON.stringify(result.response)).toBe(true);

    const row = await threadRow(threadId);
    expect(row?.title).toBe(newTitle);
    expect(row?.description).toBe("Updated through the form");
    expect(row?.pinned).toBe(true);
  });

  e2e.it("PATCH blocks a submit without a root folder", async ({ open, context, baseUrl, loginAs, uniqueEmail, cleanup }) => {
    const customer = await createE2EUser(uniqueEmail("thread-patch-empty"));
    cleanup(() => deleteE2EUser(customer));
    const threadId = await seedThread(customer, { rootFolderId: DefaultFolderId.PRIVATE, title: `E2E patch empty ${Date.now()}` });
    await signInAs({ context, baseUrl, loginAs }, customer);

    const form = await open(threadEndpoints.PATCH, { query: { threadId } });
    await form.fill({ title: "Never saved" });
    const result = await form.submit();
    expect(result.sent).toBe(false);
    if (result.sent) return;
    expect(Object.keys(result.fieldErrors)).toContain("rootFolderId");
    expect((await threadRow(threadId))?.title).not.toBe("Never saved");
  });

  e2e.it("DELETE removes the thread", async ({ open, context, baseUrl, loginAs, uniqueEmail, cleanup }) => {
    const customer = await createE2EUser(uniqueEmail("thread-delete"));
    cleanup(() => deleteE2EUser(customer));
    const threadId = await seedThread(customer, { rootFolderId: DefaultFolderId.PRIVATE, title: `E2E delete ${Date.now()}` });
    await signInAs({ context, baseUrl, loginAs }, customer);

    const form = await open(threadEndpoints.DELETE, { query: { threadId } });
    await form.fill({ rootFolderId: DefaultFolderId.PRIVATE });
    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success, JSON.stringify(result.response)).toBe(true);
    expect(await threadRow(threadId)).toBeUndefined();
  });

  e2e.it("DELETE rejects another user's thread and keeps it", async ({ open, context, baseUrl, loginAs, uniqueEmail, cleanup }) => {
    const owner = await createE2EUser(uniqueEmail("thread-delete-owner"));
    cleanup(() => deleteE2EUser(owner));
    const intruder = await createE2EUser(uniqueEmail("thread-delete-intruder"));
    cleanup(() => deleteE2EUser(intruder));
    const threadId = await seedThread(owner, { rootFolderId: DefaultFolderId.PRIVATE, title: `E2E keep ${Date.now()}` });
    await signInAs({ context, baseUrl, loginAs }, intruder);

    const form = await open(threadEndpoints.DELETE, { query: { threadId } });
    await form.fill({ rootFolderId: DefaultFolderId.PRIVATE });
    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success).toBe(false);
    expect(await threadRow(threadId)).toBeDefined();
  });
});
