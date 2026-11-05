/**
 * E2E: fetch URL content tool page (Scrappey → markdown).
 * The Scrappey call records on the first run and replays after
 * (src/generated/ai-fixtures/http-cache/e2e-vibe-agent-fetch-url-content--*).
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { describe, expect } from "vitest";

import { useE2E } from "next-vibe/tooling/testing/e2e/harness";

import fetchUrlEndpoints from "./definition";

const endpoint = fetchUrlEndpoints.GET;
/** Tiny, stable page — the cheapest possible scrape. */
const PAGE_URL = "https://example.com/";

describe("E2E: fetch URL content", () => {
  const e2e = useE2E("vibe/agent/fetch-url-content", { fixtures: true });

  e2e.it(
    "fetches a page and renders it as markdown",
    async ({ open, page }) => {
      const form = await open(endpoint);
      await form.fill({ url: PAGE_URL });

      const result = await form.submit();
      expect(result.sent).toBe(true);
      if (!result.sent) return;
      expect(result.response.success, JSON.stringify(result.response)).toBe(
        true,
      );
      if (!result.response.success) return;
      expect(result.response.data.content).toContain("Example Domain");
      await page
        .getByText("Example Domain")
        .first()
        .waitFor({ state: "visible" });
    },
  );

  e2e.it(
    "blocks a malformed URL client-side without fetching",
    async ({ open }) => {
      const form = await open(endpoint);
      await form.fill({ url: "not a url" });

      const result = await form.submit();
      expect(result.sent).toBe(false);
      if (result.sent) return;
      expect(Object.keys(result.fieldErrors)).toEqual(["url"]);
    },
  );
});
