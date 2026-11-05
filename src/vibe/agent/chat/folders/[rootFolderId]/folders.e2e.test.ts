/**
 * E2E: chat sidebar folder list — real browser against the running server.
 * Requires a server (Atlas dev by default): `vibe dev`.
 *
 * The chat page server-renders the folders of the root it opens on; switching
 * to another root tab is client-side and fetches that root's folders.
 */

import { describe, expect } from "vitest";

import { DefaultFolderId } from "next-vibe/core/execution-context";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";

import {
  createE2EUser,
  deleteE2EUser,
  rootFolderTab,
  seedFolder,
  signInAs,
  suppressWelcomeTour,
} from "../../testing/e2e-seed";
import foldersEndpoints from "./definition";

const endpoint = foldersEndpoints.GET;

describe("E2E: chat folder list", () => {
  const e2e = useE2E("agent/chat/folders");

  e2e.it("switching to the Shared tab loads the customer's shared folders into the sidebar", async (fixtures) => {
    const { open, page, context, uniqueEmail, cleanup } = fixtures;
    const account = await createE2EUser(uniqueEmail("folders"));
    cleanup(() => deleteE2EUser(account));
    const folderName = `E2E Shared ${Date.now()}`;
    await seedFolder(account, DefaultFolderId.SHARED, folderName);
    await signInAs(fixtures, account);
    await suppressWelcomeTour(context);

    const form = await open(endpoint, { path: "/threads/private" });
    await rootFolderTab(page, DefaultFolderId.SHARED).click();
    const call = await form.nextCall();

    expect(call.response.success, JSON.stringify(call.response)).toBe(true);
    if (!call.response.success) return;
    expect(call.response.data.folders.map((f) => f.name)).toContain(folderName);
    expect(call.response.data.rootFolderPermissions).toEqual({
      canCreateThread: true,
      canCreateFolder: true,
    });
    await page.getByText(folderName, { exact: true }).first().waitFor();
  });

  e2e.it("an anonymous visitor switching to Public sees the community folders", async (fixtures) => {
    const { open, page, context } = fixtures;
    await suppressWelcomeTour(context);
    // Anonymous visitors land in incognito (private redirects there)
    const form = await open(endpoint, { path: "/threads/incognito" });
    await rootFolderTab(page, DefaultFolderId.PUBLIC).click();
    const call = await form.nextCall();

    expect(call.response.success, JSON.stringify(call.response)).toBe(true);
    if (!call.response.success) return;
    const folders = call.response.data.folders;
    expect(folders.length).toBeGreaterThan(0);
    expect(folders.every((f) => f.rootFolderId === DefaultFolderId.PUBLIC)).toBe(true);
    // Anonymous visitors may read the community folders, never manage them
    expect(folders.every((f) => !f.canManage)).toBe(true);
    await page.getByText(folders[0].name, { exact: true }).first().waitFor();
  });

  e2e.it("rejects a root folder that does not exist", async (fixtures) => {
    const { open, uniqueEmail, cleanup } = fixtures;
    const account = await createE2EUser(uniqueEmail("folders-bad"));
    cleanup(() => deleteE2EUser(account));
    await signInAs(fixtures, account);

    const form = await open(endpoint, { query: { rootFolderId: "not-a-root" } });
    const call = await form.firstCall();

    expect(call.status).toBe(400);
    expect(call.response.success).toBe(false);
  });
});
