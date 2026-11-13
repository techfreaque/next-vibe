/**
 * E2E: reset-token validation. The reset page validates server-side, so the
 * endpoint's own surface is its tool page.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { describe, expect } from "vitest";

import { scopedTranslation } from "../i18n";
import { PasswordRepository } from "../repository";
import resetValidateEndpoints from "./definition";

const endpoint = resetValidateEndpoints.GET;
const { t } = scopedTranslation.scopedT(defaultLocale);

describe("E2E: reset password token validation", () => {
  const e2e = useE2E("user/public/reset-password/validate");

  e2e.it("confirms a live reset token", async ({ open, uniqueEmail, cleanup }) => {
    const email = uniqueEmail("reset-validate");
    const created = await createTestUser(email);
    expect(created.success, JSON.stringify(created)).toBe(true);
    if (!created.success) return;
    cleanup(() => deleteTestUser(created.data.user.id));
    const token = await PasswordRepository.createResetToken(
      email,
      defaultLocale,
      createEndpointLogger(false, defaultLocale),
      t,
    );
    expect(token.success).toBe(true);
    if (!token.success) return;

    const form = await open(endpoint);
    await form.fill({ tokenInput: { token: token.data } });
    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success, JSON.stringify(result.response)).toBe(true);
    if (!result.response.success) return;
    const { response } = result.response.data;
    expect(response.valid).toBe(true);
    expect(response.message).toBe(t("validate.success.description"));
    await form.root.getByText(response.message).first().waitFor();
  });

  e2e.it("rejects an unknown token", async ({ open }) => {
    const form = await open(endpoint);
    await form.fill({ tokenInput: { token: "not-a-real-token" } });
    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success, JSON.stringify(result.response)).toBe(false);
    if (result.response.success) return;
    expect(result.response.message).toBe(t("errors.tokenInvalid"));
  });

  e2e.it("blocks an empty token client-side", async ({ open }) => {
    const form = await open(endpoint);
    const result = await form.submit();
    expect(result.sent).toBe(false);
    if (result.sent) return;
    expect(Object.keys(result.fieldErrors)).toEqual(["tokenInput.token"]);
  });
});
