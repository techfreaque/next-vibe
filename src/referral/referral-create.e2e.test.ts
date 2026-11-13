/**
 * E2E: create a referral code from /user/referral — the new link shows up in
 * "Your links" straight away; a too-short code never leaves the browser.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import type { E2EFixtures } from "next-vibe/tooling/testing/e2e/harness";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { describe, expect } from "vitest";

import referralEndpoints from "./definition";

const endpoint = referralEndpoints.POST;
const REFERRAL_PAGE = "/user/referral";

async function signIn(fixtures: E2EFixtures, tag: string): Promise<string> {
  const created = await createTestUser(fixtures.uniqueEmail(tag), "E2E Ref");
  expect(created.success, JSON.stringify(created)).toBe(true);
  if (!created.success) {
    return "";
  }
  const account = created.data;
  fixtures.cleanup(() => deleteTestUser(account.user.id));
  await fixtures.loginAs(account.user);
  return account.user.id;
}

describe("E2E: create referral code", () => {
  const e2e = useE2E("referral/create");

  e2e.it("creates a code and lists its link", async (fixtures) => {
    const userId = await signIn(fixtures, "ref-create");
    const code = `NEW${userId.slice(0, 6).toUpperCase()}`;
    const form = await fixtures.open(endpoint, { path: REFERRAL_PAGE });
    await form.fill({ fieldsGrid: { code, label: "E2E bio" } });
    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) {
      return;
    }
    expect(result.response.success, JSON.stringify(result.response)).toBe(true);
    await fixtures.page.getByText(code, { exact: true }).first().waitFor();
  });

  e2e.it("blocks a code shorter than three characters", async (fixtures) => {
    await signIn(fixtures, "ref-short");
    const form = await fixtures.open(endpoint, { path: REFERRAL_PAGE });
    await form.fill({ fieldsGrid: { code: "AB" } });
    const result = await form.submit();
    expect(result.sent).toBe(false);
  });
});
