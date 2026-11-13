/**
 * E2E: community feed (Public root) — real browser against the running server.
 * Requires a server (Atlas dev by default): `vibe dev`.
 *
 * Opening the Public tab loads the feed; the sort buttons and the search box
 * re-query it server-side.
 */

import { DefaultFolderId } from "next-vibe/core/execution-context";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";

import {
  chatReady,
  createE2EUser,
  deleteE2EUser,
  rootFolderTab,
  seedThread,
  suppressWelcomeTour,
} from "../testing/e2e-seed";
import publicFeedEndpoints, { FeedSortMode } from "./definition";
import { scopedTranslation } from "./i18n";

const endpoint = publicFeedEndpoints.GET;

describe("E2E: community feed", () => {
  const e2e = useE2E("agent/chat/public-feed");
  const { t } = scopedTranslation.scopedT(defaultLocale);

  e2e.it("an anonymous visitor opens the feed, re-sorts it and finds a thread by search", async (fixtures) => {
    const { capture, page, context, uniqueEmail, cleanup } = fixtures;
    const author = await createE2EUser(uniqueEmail("feed-author"));
    cleanup(() => deleteE2EUser(author));
    const stamp = `feed${Date.now()}`;
    const visibleTitle = `E2E ${stamp} open thread`;
    const restrictedTitle = `E2E ${stamp} admins only`;
    await seedThread(author, {
      rootFolderId: DefaultFolderId.PUBLIC,
      title: visibleTitle,
      published: true,
    });
    await seedThread(author, {
      rootFolderId: DefaultFolderId.PUBLIC,
      title: restrictedTitle,
      published: true,
      rolesView: [UserPermissionRole.ADMIN],
    });

    await suppressWelcomeTour(context);
    await fixtures.gotoReady("/threads/incognito", chatReady(page));

    const opened = await capture(endpoint, () =>
      rootFolderTab(page, DefaultFolderId.PUBLIC).click(),
    );
    expect(opened.response.success, JSON.stringify(opened.response)).toBe(true);
    expect(opened.requestBody).toMatchObject({ sortMode: FeedSortMode.HOT });
    await page.getByText(t("get.title"), { exact: true }).first().waitFor();

    const newest = await capture(endpoint, () =>
      page.getByRole("button", { name: t("sortMode.new"), exact: true }).click(),
    );
    expect(newest.response.success, JSON.stringify(newest.response)).toBe(true);
    expect(newest.requestBody).toMatchObject({ sortMode: FeedSortMode.NEW });
    await page
      .getByRole("button", { name: t("sortMode.new"), exact: true, pressed: true })
      .waitFor();

    const searchBox = page.getByPlaceholder(t("get.search.description"));
    const found = await capture(endpoint, () => searchBox.fill(stamp));
    expect(found.requestBody).toMatchObject({ search: stamp });
    expect(found.response.success, JSON.stringify(found.response)).toBe(true);
    if (!found.response.success) return;
    // The admins-only thread is public but not viewable by visitors — never listed
    expect(found.response.data.items.map((i) => i.title)).toEqual([visibleTitle]);
    // Listed in the feed (and the Public sidebar)
    await page.getByText(visibleTitle, { exact: true }).first().waitFor();
    expect(await page.getByText(restrictedTitle).count()).toBe(0);

    const nothing = await capture(endpoint, () => searchBox.fill(`${stamp}-no-such-thread`));
    expect(nothing.response.success).toBe(true);
    await page.getByText(t("get.feed.emptySearch"), { exact: true }).waitFor();
  });
});
