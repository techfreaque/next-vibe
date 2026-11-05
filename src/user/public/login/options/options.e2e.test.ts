/**
 * E2E: login options — no customer page mounts it, so the tool page is used.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { describe, expect } from "vitest";

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { identityEnv } from "next-vibe/identity/env";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";

import { scopedTranslation as loginScopedTranslation } from "../i18n";
import loginOptionsEndpoints from "./definition";
import { SocialProviders } from "./enum";

const endpoint = loginOptionsEndpoints.GET;

describe("E2E: login options", () => {
  const e2e = useE2E("user/public/login/options");
  const loginT = loginScopedTranslation.scopedT(defaultLocale).t;

  e2e.it("returns personalised options for a known email", async ({ open, page }) => {
    const form = await open(endpoint);
    // GET forms fire once on mount with no email — general options
    const general = await form.firstCall();
    expect(general.response.success).toBe(true);
    await form.fill({ email: identityEnv.VIBE_ADMIN_USER_EMAIL });

    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success, JSON.stringify(result.response)).toBe(true);
    if (!result.response.success) return;

    const { response } = result.response.data;
    expect(response.forUser).toBe(identityEnv.VIBE_ADMIN_USER_EMAIL);
    expect(response.loginMethods.password.enabled).toBe(true);
    // Provider names reach the customer translated, never as raw keys
    const google = response.loginMethods.social.providers.find(
      (p) => p.id === SocialProviders.GOOGLE,
    );
    expect(google?.name).toBe(loginT("enums.socialProviders.google"));

    // The response renders on the page, not just over the wire
    await form.root.getByText(response.message).first().waitFor();
    await form.root.getByText(google?.name ?? "").first().waitFor();
    // Provider ids are internal — only the translated name is shown, once
    expect(await form.root.getByText(google?.name ?? "", { exact: true }).count()).toBe(1);
  });

  e2e.it("answers an unknown email like a known one (no account probing)", async ({ open, uniqueEmail }) => {
    const form = await open(endpoint);
    await form.firstCall();
    await form.fill({ email: uniqueEmail("nobody") });

    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success, JSON.stringify(result.response)).toBe(true);
  });

  e2e.it("blocks a malformed email before sending", async ({ open }) => {
    const form = await open(endpoint);
    await form.fill({ email: "not-an-email" });

    const result = await form.submit();
    expect(result.sent).toBe(false);
    if (result.sent) return;
    expect(Object.keys(result.fieldErrors)).toEqual(["email"]);
  });
});
