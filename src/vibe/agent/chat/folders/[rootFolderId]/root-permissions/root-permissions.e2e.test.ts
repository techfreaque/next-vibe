/**
 * E2E: root folder permissions — real browser against the running server.
 * Requires a server (Atlas dev by default): `vibe dev`.
 *
 * The chat composer server-renders the permissions of the root it opens on;
 * switching root tabs client-side fetches the new root's permissions, which
 * decide whether the customer may start a thread there.
 */

import { DefaultFolderId } from "next-vibe/core/execution-context";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";

import { scopedTranslation as aiStreamScopedTranslation } from "../../../../ai-stream/stream/i18n";
import {
  createE2EUser,
  deleteE2EUser,
  rootFolderTab,
  signInAs,
  suppressWelcomeTour,
} from "../../../testing/e2e-seed";
import rootPermissionsEndpoints from "./definition";

const endpoint = rootPermissionsEndpoints.GET;

describe("E2E: root folder permissions", () => {
  const e2e = useE2E("agent/chat/folders/root-permissions");
  const { t: tStream } = aiStreamScopedTranslation.scopedT(defaultLocale);

  e2e.it("switching to Shared fetches its permissions and lets the customer post there", async (fixtures) => {
    const { open, page, context, uniqueEmail, cleanup } = fixtures;
    const account = await createE2EUser(uniqueEmail("root-perms"));
    cleanup(() => deleteE2EUser(account));
    await signInAs(fixtures, account);
    await suppressWelcomeTour(context);

    const form = await open(endpoint, { path: "/threads/private" });
    await rootFolderTab(page, DefaultFolderId.SHARED).click();
    const call = await form.nextCall();

    expect(call.response.success, JSON.stringify(call.response)).toBe(true);
    if (!call.response.success) return;
    expect(call.response.data).toEqual({
      canCreateThread: true,
      canCreateFolder: true,
    });
    await page.waitForURL((url) => url.pathname.includes(`/threads/${DefaultFolderId.SHARED}`));
    await page.getByText(tStream("input.noPermission")).first().waitFor({ state: "hidden" });
  });

  e2e.it("rejects a root folder that does not exist", async (fixtures) => {
    const { open, uniqueEmail, cleanup } = fixtures;
    const account = await createE2EUser(uniqueEmail("root-perms-bad"));
    cleanup(() => deleteE2EUser(account));
    await signInAs(fixtures, account);

    const form = await open(endpoint, { query: { rootFolderId: "not-a-root" } });
    const call = await form.firstCall();

    expect(call.status).toBe(400);
    expect(call.response.success).toBe(false);
  });
});
