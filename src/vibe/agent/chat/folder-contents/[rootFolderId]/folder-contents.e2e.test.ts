/**
 * E2E: chat sidebar folder contents — real browser against the running server.
 * Requires a server (Atlas dev by default): `vibe dev`.
 *
 * The sidebar lists one folder level at a time (folders and threads
 * interleaved). Switching root tabs loads the root level; opening a folder
 * loads that folder's level.
 */

import { DefaultFolderId } from "next-vibe/core/execution-context";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";

import {
  chatReady,
  createE2EUser,
  deleteE2EUser,
  rootFolderTab,
  seedFolder,
  seedThread,
  signInAs,
  suppressWelcomeTour,
} from "../../testing/e2e-seed";
import folderContentsEndpoints from "./definition";

const endpoint = folderContentsEndpoints.GET;

describe("E2E: chat folder contents", () => {
  const e2e = useE2E("agent/chat/folder-contents");

  e2e.it("lists the Shared root level, then a folder's threads when it is opened", async (fixtures) => {
    const { capture, page, context, uniqueEmail, cleanup } = fixtures;
    const account = await createE2EUser(uniqueEmail("folder-contents"));
    cleanup(() => deleteE2EUser(account));
    const stamp = Date.now();
    const folderName = `E2E Folder ${stamp}`;
    const rootThreadTitle = `E2E Root Thread ${stamp}`;
    const nestedThreadTitle = `E2E Nested Thread ${stamp}`;
    const folderId = await seedFolder(account, DefaultFolderId.SHARED, folderName);
    await seedThread(account, { rootFolderId: DefaultFolderId.SHARED, title: rootThreadTitle });
    await seedThread(account, {
      rootFolderId: DefaultFolderId.SHARED,
      title: nestedThreadTitle,
      folderId,
    });
    await signInAs(fixtures, account);
    await suppressWelcomeTour(context);

    // The sidebar renders its own UI (no request form) — drive it like a user
    await fixtures.gotoReady("/threads/private", chatReady(page));
    const rootLevel = await capture(endpoint, () =>
      rootFolderTab(page, DefaultFolderId.SHARED).click(),
    );

    expect(rootLevel.response.success, JSON.stringify(rootLevel.response)).toBe(true);
    if (!rootLevel.response.success) return;
    expect(rootLevel.requestBody).not.toHaveProperty("subFolderId");
    const rootItems = rootLevel.response.data.items;
    expect(rootItems.find((i) => i.type === "folder" && i.id === folderId)?.name).toBe(folderName);
    expect(rootItems.some((i) => i.type === "thread" && i.title === rootThreadTitle)).toBe(true);
    // Nested threads belong to their folder's level, not the root's
    expect(rootItems.some((i) => i.title === nestedThreadTitle)).toBe(false);
    await page.getByText(rootThreadTitle, { exact: true }).first().waitFor();

    const folderLevel = await capture(endpoint, () =>
      page.getByText(folderName, { exact: true }).first().click(),
    );

    expect(folderLevel.response.success, JSON.stringify(folderLevel.response)).toBe(true);
    if (!folderLevel.response.success) return;
    expect(folderLevel.requestBody).toMatchObject({ subFolderId: folderId });
    expect(folderLevel.response.data.items.map((i) => i.title)).toEqual([nestedThreadTitle]);
    await page.getByText(nestedThreadTitle, { exact: true }).first().waitFor();
  });

  e2e.it("rejects a root folder that does not exist", async (fixtures) => {
    const { capture, goto, uniqueEmail, cleanup } = fixtures;
    const account = await createE2EUser(uniqueEmail("folder-contents-bad"));
    cleanup(() => deleteE2EUser(account));
    await signInAs(fixtures, account);

    const call = await capture(endpoint, () =>
      goto("/tools/folder-contents?rootFolderId=not-a-root"),
    );

    expect(call.status).toBe(400);
    expect(call.response.success).toBe(false);
  });
});
