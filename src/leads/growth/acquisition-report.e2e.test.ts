import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { describe, expect } from "vitest";

describe("Lead acquisition reports", () => {
  const e2e = useE2E("leads/growth/acquisition-report");

  e2e.it("renders the lead filters and applies them to the live list", async ({ goto, loginAs, page }) => {
    await loginAs(await resolveTestAdminUser());
    await goto("/tools/leads-dashboard");
    await page.getByRole("button", { name: /^All Leads/ }).click();
    await page.getByText("Website User", { exact: true }).first().waitFor();
    await page.getByLabel("Referrer domain", { exact: true }).fill("no-results.example.invalid");
    const response = page.waitForResponse((result) =>
      new URL(result.url()).pathname.endsWith("/leads/list") &&
      new URL(result.url()).searchParams.toString().includes("no-results.example.invalid"),
      { timeout: 10000 },
    );
    await page.getByRole("button", { name: "Apply filters", exact: true }).click();
    expect((await response).ok()).toBe(true);
    await page.getByText("No leads match your filters", { exact: true }).waitFor();

    await page.getByRole("button", { name: "Stats", exact: true }).click();
    await page.getByText("Lead acquisition", { exact: true }).waitFor();
    await page.getByRole("columnheader", { name: "First chats", exact: true }).waitFor();
    await page.getByRole("columnheader", { name: "Revenue", exact: true }).waitFor();
  });
});
