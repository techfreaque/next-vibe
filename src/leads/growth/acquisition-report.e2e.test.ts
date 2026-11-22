import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { describe, expect } from "vitest";

describe("Lead acquisition reports", () => {
  const e2e = useE2E("leads/growth/acquisition-report");

  e2e.it(
    "renders the lead filters and applies them to the live list",
    async ({ goto, loginAs, page }) => {
      await loginAs(await resolveTestAdminUser());
      await goto("/tools/leads-dashboard");
      const [initialList] = await Promise.all([
        page.waitForResponse((result) =>
          new URL(result.url()).pathname.endsWith("/leads/list"),
        ),
        page.getByRole("button", { name: /^All Leads/ }).click(),
      ]);
      expect(initialList.ok()).toBe(true);
      await page
        .getByText("Website User", { exact: true })
        .filter({ visible: true })
        .first()
        .waitFor();
      await page.getByText("More filters", { exact: true }).click();

      const referrer = "no-results.example.invalid";
      await page.getByLabel("Referrer", { exact: true }).fill(referrer);
      const [response] = await Promise.all([
        page.waitForResponse(
          (result) => {
            const url = new URL(result.url());
            return (
              url.pathname.endsWith("/leads/list") &&
              url.searchParams.get("referrerHost") === referrer
            );
          },
          { timeout: 10_000 },
        ),
        page.getByRole("button", { name: "Apply", exact: true }).click(),
      ]);
      expect(response.ok()).toBe(true);
      await page
        .getByText("No leads match your filters", { exact: true })
        .waitFor();

      await goto("/tools/leads-dashboard");
      const [report] = await Promise.all([
        page.waitForResponse((result) =>
          new URL(result.url()).pathname.endsWith("/leads/analytics/acquisition"),
        ),
        page.getByRole("button", { name: /^Acquisition\b/ }).click(),
      ]);
      expect(report.ok()).toBe(true);
      await page.waitForURL("**/tools/acquisition-report");
      await page
        .getByText("Acquisition", { exact: true })
        .filter({ visible: true })
        .waitFor();
      await page.getByRole("button", { name: /^Chatted\b/ }).waitFor();
      await page
        .getByRole("columnheader", { name: "Revenue", exact: true })
        .waitFor();
    },
  );
});
