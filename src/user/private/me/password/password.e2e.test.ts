/**
 * E2E: change password through its widget — success shows the confirmation
 * panel, a wrong current password is refused and nothing changes.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { E2EFixtures } from "next-vibe/tooling/testing/e2e/harness";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import type { TestUser } from "next-vibe/tooling/testing/testing-suite/test-users";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { describe, expect } from "vitest";

import passwordEndpoints from "./definition";
import { scopedTranslation } from "./i18n";

const endpoint = passwordEndpoints.POST;
const NEW_PASSWORD = "E2e-New-Passw0rd!";
const { t } = scopedTranslation.scopedT(defaultLocale);

async function signedInAccount(
  fixtures: E2EFixtures,
  tag: string,
): Promise<TestUser | null> {
  const created = await createTestUser(fixtures.uniqueEmail(tag), "E2E Pw");
  expect(created.success, JSON.stringify(created)).toBe(true);
  if (!created.success) {
    return null;
  }
  const account = created.data;
  fixtures.cleanup(() => deleteTestUser(account.user.id));
  await fixtures.loginAs(account.user);
  return account;
}

describe("E2E: change password", () => {
  const e2e = useE2E("user/private/me/password");

  e2e.it("changes the password and confirms it", async (fixtures) => {
    const account = await signedInAccount(fixtures, "pw-change");
    if (!account) {
      return;
    }
    const form = await fixtures.open(endpoint);
    await form.fill({
      currentCredentials: { currentPassword: account.password },
      newCredentials: {
        newPassword: NEW_PASSWORD,
        confirmPassword: NEW_PASSWORD,
      },
    });
    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) {
      return;
    }
    expect(result.response.success, JSON.stringify(result.response)).toBe(
      true,
    );
    await fixtures.page.getByText(t("success.title")).first().waitFor();
  });

  e2e.it("refuses a wrong current password", async (fixtures) => {
    const account = await signedInAccount(fixtures, "pw-wrong");
    if (!account) {
      return;
    }
    const form = await fixtures.open(endpoint);
    await form.fill({
      currentCredentials: { currentPassword: "not-the-password-123" },
      newCredentials: {
        newPassword: NEW_PASSWORD,
        confirmPassword: NEW_PASSWORD,
      },
    });
    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) {
      return;
    }
    expect(result.response.success).toBe(false);
    await form.alert.waitFor({ state: "visible" });
  });
});
