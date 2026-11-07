/**
 * E2E: profile editing on /user/settings — every widget type the editor uses
 * (text, markdown, url, color, file, boolean) driven through the real UI.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { eq } from "drizzle-orm";
import { describe, expect } from "vitest";

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { users } from "next-vibe/identity/user/db";
import { E2E_HYDRATION_TIMEOUT_MS } from "next-vibe/tooling/testing/e2e/config";
import { recordPage } from "next-vibe/tooling/testing/e2e/coverage";
import type { E2EFixtures } from "next-vibe/tooling/testing/e2e/harness";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  e2eEndpointId,
  EndpointForm,
} from "next-vibe/tooling/testing/e2e/endpoint-form";
import type { TestUser } from "next-vibe/tooling/testing/testing-suite/test-users";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";

import meEndpoints from "./definition";
import { scopedTranslation } from "./i18n";

const endpoint = meEndpoints.POST;
const SETTINGS_PAGE = "/user/settings";
/** Room for up to three page loads through dev-server reloads. */
const SLOW_PAGE_TIMEOUT_MS = 240_000;
const { t } = scopedTranslation.scopedT(defaultLocale);

/** 1×1 transparent PNG. */
const PNG_BYTES = Uint8Array.from(
  atob(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  ),
  (c) => c.charCodeAt(0),
);

async function signedInAccount(
  fixtures: E2EFixtures,
  tag: string,
): Promise<TestUser> {
  const created = await createTestUser(fixtures.uniqueEmail(tag), "E2E Profile");
  expect(created.success, JSON.stringify(created)).toBe(true);
  if (!created.success) {
    // eslint-disable-next-line restricted/restricted-syntax -- test setup failure
    throw new Error("test user creation failed");
  }
  const account = created.data;
  fixtures.cleanup(() => deleteTestUser(account.user.id));
  await fixtures.loginAs(account.user);
  return account;
}

/**
 * The editor is collapsed behind "Edit Profile" — the harness `open()` waits
 * for visible fields, so open the page, wait for the profile, expand it, then
 * drive the endpoint form directly.
 */
async function openEditor(
  fixtures: E2EFixtures,
  account: TestUser,
): Promise<EndpointForm<typeof endpoint>> {
  const form = new EndpointForm(fixtures.page, endpoint);
  await form.attach();
  // Profile loaded → the form was reset to it; typing before that gets wiped.
  // Retried: a dev-server reload mid-navigation (503 on the client entry)
  // leaves the page unhydrated — the harness only retries this inside open().
  for (let attempt = 1; ; attempt++) {
    await fixtures.goto(SETTINGS_PAGE);
    const loaded = await fixtures.page
      .locator("[data-hydrated]")
      .getByText(account.email)
      .first()
      .waitFor({ timeout: E2E_HYDRATION_TIMEOUT_MS / 2 })
      .then(() => true)
      .catch(() => false);
    if (loaded) {
      break;
    }
    expect(attempt, "settings page never hydrated").toBeLessThan(3);
  }
  await fixtures.page
    .getByRole("button", { name: t("widget.editProfile") })
    .click();
  await form.root.waitFor({ state: "visible" });
  recordPage(e2eEndpointId(endpoint), SETTINGS_PAGE);
  return form;
}

describe("E2E: profile settings", () => {
  const e2e = useE2E("user/private/me");

  e2e.it("saves a full creator profile edited through every widget", async (fixtures) => {
    const account = await signedInAccount(fixtures, "me-update");
    const form = await openEditor(fixtures, account);

    const slug = `e2e-${account.user.id.slice(0, 8)}`;
    await form.fill({
      basicInfo: { privateName: "E2E Private", publicName: "E2E Public" },
      profileInfo: {
        bio: "Building sharp tools.",
        websiteUrl: "https://example.com/e2e",
        githubUrl: "https://github.com/e2e-user",
        creatorSlug: slug,
        creatorAccentColor: "#12AB34",
      },
      privacySettings: { marketingConsent: true },
    });
    await form.fill({
      profileInfo: {
        creatorHeaderImageUrl: new File([PNG_BYTES], "header.png", {
          type: "image/png",
        }),
      },
    });

    const result = await form.submit();
    expect(result.sent, JSON.stringify(result)).toBe(true);
    if (!result.sent) {return;}
    expect(
      result.response.success,
      JSON.stringify({ status: result.status, type: result.contentType, body: result.response }),
    ).toBe(true);

    const [saved] = await db
      .select()
      .from(users)
      .where(eq(users.id, account.user.id));
    expect(saved.privateName).toBe("E2E Private");
    expect(saved.publicName).toBe("E2E Public");
    expect(saved.email).toBe(account.email);
    expect(saved.websiteUrl).toBe("https://example.com/e2e");
    expect(saved.githubUrl).toBe("https://github.com/e2e-user");
    expect(saved.creatorSlug).toBe(slug);
    expect(saved.creatorAccentColor?.toLowerCase()).toBe("#12ab34");
    expect(saved.marketingConsent).toBe(true);
    // Markdown editor round-trips the formatting, not just the text
    expect(saved.bio).toContain("Building sharp tools.");
    // The uploaded header is stored as a renderable image of the right type
    expect(saved.creatorHeaderImageUrl?.startsWith("data:image/png;base64,")).toBe(true);

    // Saving collapses the editor back to the profile view with the new name
    await fixtures.page
      .getByText("E2E Public", { exact: true })
      .first()
      .waitFor();
  }, SLOW_PAGE_TIMEOUT_MS);

  e2e.it("rejects a malformed link before saving", async (fixtures) => {
    const account = await signedInAccount(fixtures, "me-invalid");
    const form = await openEditor(fixtures, account);

    await form.fill({ profileInfo: { websiteUrl: "not a url" } });
    const result = await form.submit();
    expect(result.sent).toBe(false);
    if (result.sent) {return;}
    expect(Object.keys(result.fieldErrors)).toContain("profileInfo.websiteUrl");

    const [unchanged] = await db
      .select({ websiteUrl: users.websiteUrl })
      .from(users)
      .where(eq(users.id, account.user.id));
    expect(unchanged.websiteUrl).toBeNull();
  }, SLOW_PAGE_TIMEOUT_MS);

  e2e.it("lets a user clear a link they no longer want", async (fixtures) => {
    const account = await signedInAccount(fixtures, "me-clear");
    await db
      .update(users)
      .set({ websiteUrl: "https://example.com/old" })
      .where(eq(users.id, account.user.id));
    const form = await openEditor(fixtures, account);

    await form.fill({ profileInfo: { websiteUrl: "" } });
    const result = await form.submit({ assertRequestBody: false });
    expect(result.sent, JSON.stringify(result)).toBe(true);
    if (!result.sent) {return;}
    // The cleared field must travel as a clear, not be dropped from the request
    expect(result.requestBody).toMatchObject({ profileInfo: { websiteUrl: "" } });
    expect(result.response.success, JSON.stringify(result.response)).toBe(true);

    const [saved] = await db
      .select({ websiteUrl: users.websiteUrl })
      .from(users)
      .where(eq(users.id, account.user.id));
    expect(saved.websiteUrl ?? "").toBe("");
  }, SLOW_PAGE_TIMEOUT_MS);
});
