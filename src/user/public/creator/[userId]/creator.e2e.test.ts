/**
 * E2E: public creator profile — the /creator/[userId] page a visitor lands on,
 * plus the endpoint's network contract through its tool page (the page renders
 * from server-loaded data and makes no client call of its own).
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { eq } from "drizzle-orm";
import { describe, expect } from "vitest";

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { users } from "next-vibe/identity/user/db";
import type { E2EFixtures } from "next-vibe/tooling/testing/e2e/harness";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import type { TestUser } from "next-vibe/tooling/testing/testing-suite/test-users";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";

import creatorEndpoints from "./definition";
import { scopedTranslation } from "./i18n";

const endpoint = creatorEndpoints.GET;
const { t } = scopedTranslation.scopedT(defaultLocale);
const UNKNOWN_CREATOR = "00000000-0000-4000-8000-000000000000";

/** A throwaway creator with a public bio, website and slug. */
async function creator(
  fixtures: E2EFixtures,
  tag: string,
): Promise<{ account: TestUser; slug: string }> {
  const created = await createTestUser(fixtures.uniqueEmail(tag), "E2E Creator");
  expect(created.success, JSON.stringify(created)).toBe(true);
  if (!created.success) {
    // eslint-disable-next-line restricted/restricted-syntax -- test setup failure
    throw new Error("test user creation failed");
  }
  const account = created.data;
  fixtures.cleanup(() => deleteTestUser(account.user.id));
  const slug = `e2e-creator-${account.user.id.slice(0, 8)}`;
  await db
    .update(users)
    .set({
      creatorSlug: slug,
      bio: "Sharp tools for sharp people.",
      websiteUrl: "https://example.com/creator",
    })
    .where(eq(users.id, account.user.id));
  return { account, slug };
}

describe("E2E: public creator profile", () => {
  const e2e = useE2E("user/public/creator");

  e2e.it("shows the creator's profile at their slug and id", async (fixtures) => {
    const { account, slug } = await creator(fixtures, "creator-page");
    const { goto, page } = fixtures;

    for (const path of [`/creator/${slug}`, `/creator/${account.user.id}`]) {
      await goto(path);
      await page.getByText(account.publicName).first().waitFor();
      await page.getByText("Sharp tools for sharp people.").first().waitFor();
      expect(
        await page.locator('a[href="https://example.com/creator"]').count(),
      ).toBeGreaterThan(0);
    }
  });

  e2e.it("tells a visitor when a creator doesn't exist", async ({ goto, page }) => {
    await goto(`/creator/${UNKNOWN_CREATOR}`);
    await page.getByText(t("widget.notFound.title")).first().waitFor();
  });

  e2e.it("serves the profile over the API", async (fixtures) => {
    const { account } = await creator(fixtures, "creator-api");
    const form = await fixtures.open(endpoint, {
      query: { userId: account.user.id },
    });
    const call = await form.firstCall();
    expect(call.response.success, JSON.stringify(call.response)).toBe(true);
    if (!call.response.success) return;
    expect(call.response.data.publicName).toBe(account.publicName);
    expect(call.response.data.bio).toBe("Sharp tools for sharp people.");
  });

  e2e.it("answers not-found for an unknown creator over the API", async ({ open }) => {
    const form = await open(endpoint, { query: { userId: UNKNOWN_CREATOR } });
    const call = await form.firstCall();
    expect(call.response.success).toBe(false);
    if (call.response.success) return;
    expect(call.status).toBe(404);
  });
});
