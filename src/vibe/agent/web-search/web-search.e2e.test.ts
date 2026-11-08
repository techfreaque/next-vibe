/**
 * E2E: web search tool page — unified provider dispatch (Brave by default).
 * External search calls record on the first run and replay after
 * (src/generated/ai-fixtures/http-cache/e2e-vibe-agent-web-search--*).
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { describe, expect } from "vitest";

import { useE2E } from "next-vibe/tooling/testing/e2e/harness";

import webSearchEndpoints from "./definition";
import { SearchProvider } from "./enum";

const endpoint = webSearchEndpoints.GET;
const QUERY = "bun runtime";

describe("E2E: web search", () => {
  const e2e = useE2E("vibe/agent/web-search", {
    fixtures: true,
    guestCredits: 100,
  });

  e2e.it(
    "searches with Brave and renders the results",
    async ({ open, page }) => {
      const form = await open(endpoint);
      // Cheapest call: one result, Brave (the default provider).
      // The search bar is a SEARCH_BAR widget (no field driver) — type into it.
      await form.field("query").locator("input").fill(QUERY);
      await form.fill({ maxResults: 1 });

      const result = await form.submit();
      expect(result.sent).toBe(true);
      if (!result.sent) return;
      expect(result.requestBody).toMatchObject({ query: QUERY });
      expect(result.response.success, JSON.stringify(result.response)).toBe(
        true,
      );
      if (!result.response.success) return;
      expect(result.response.data.usedProvider).toBe(SearchProvider.BRAVE);
      const first = result.response.data.results[0];
      expect(first).toBeDefined();
      if (!first) return;
      await page
        .getByText(first.title, { exact: true })
        .first()
        .waitFor({ state: "visible" });
    },
  );

  e2e.it(
    "blocks an empty query client-side without searching",
    async ({ open }) => {
      const form = await open(endpoint);

      const result = await form.submit();
      expect(result.sent).toBe(false);
      if (result.sent) return;
      expect(Object.keys(result.fieldErrors)).toEqual(["query"]);
    },
  );
});
