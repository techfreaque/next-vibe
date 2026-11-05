/**
 * E2E: single skill GET — the public skill landing page (/skill/<id>) and the
 * skill-get tool page.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { describe, expect } from "vitest";

import { useE2E } from "next-vibe/tooling/testing/e2e/harness";

import skillEndpoints from "./definition";

const endpoint = skillEndpoints.GET;
/** Built-in skill — always seeded, never deleted. */
const BUILT_IN_SKILL_ID = "coder";

describe("E2E: skill detail", () => {
  const e2e = useE2E("agent/skills/[id]");

  e2e.it(
    "the skill-get tool page loads a built-in skill by id",
    async ({ open }) => {
      // The landing page SSR-seeds the query cache (no browser GET), so the
      // network contract is exercised through the tool page.
      const view = await open(endpoint, {
        query: { id: BUILT_IN_SKILL_ID },
      });
      const call = await view.firstCall();
      expect(call.response.success, JSON.stringify(call.response)).toBe(true);
      if (!call.response.success) return;
      expect(call.response.data.name).toBeTruthy();
      expect(call.response.data.variants?.length ?? 0).toBeGreaterThan(0);
    },
  );

  e2e.it(
    "the landing page for an unknown skill asks the API and gets a not-found",
    async ({ open }) => {
      const view = await open(endpoint, {
        path: "/skill/e2e-no-such-skill",
      });
      const call = await view.firstCall();
      expect(call.response.success).toBe(false);
      expect(call.status).toBe(404);
    },
  );
});
