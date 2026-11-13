/**
 * E2E: forgot-password page — real browser against the running server.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { identityEnv } from "next-vibe/identity/env";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";

import resetRequestEndpoints from "./definition";

const endpoint = resetRequestEndpoints.POST;
const RESET_PAGE = "/user/reset-password";

describe("E2E: reset password request", () => {
  const e2e = useE2E("user/public/reset-password/request");

  e2e.it("answers identically for known and unknown emails (no account enumeration)", async ({ open, uniqueEmail }) => {
    const known = await open(endpoint, { path: RESET_PAGE });
    await known.fill({ email: identityEnv.VIBE_ADMIN_USER_EMAIL });
    const knownResult = await known.submit();

    const unknown = await open(endpoint, { path: RESET_PAGE });
    await unknown.fill({ email: uniqueEmail("nobody") });
    const unknownResult = await unknown.submit();

    expect(knownResult.sent && unknownResult.sent).toBe(true);
    if (!knownResult.sent || !unknownResult.sent) return;
    expect(knownResult.status).toBe(unknownResult.status);
    expect(knownResult.response.success).toBe(unknownResult.response.success);
    if (knownResult.response.success && unknownResult.response.success) {
      expect(knownResult.response.data).toEqual(unknownResult.response.data);
    }
  });

  e2e.it("blocks a malformed email client-side", async ({ open }) => {
    const form = await open(endpoint, { path: RESET_PAGE });
    await form.fill({ email: "not-an-email" });

    const result = await form.submit();
    expect(result.sent).toBe(false);
    if (result.sent) return;
    expect(Object.keys(result.fieldErrors)).toEqual(["email"]);
  });
});
