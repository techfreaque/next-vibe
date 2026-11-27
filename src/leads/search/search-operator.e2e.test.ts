import { inArray } from "drizzle-orm";
import { Countries, Languages } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { leads } from "next-vibe/identity/lead/db";
import { LeadSource, LeadStatus } from "next-vibe/identity/lead/enum";
import { saveAdminReviewScreenshots } from "next-vibe/tooling/testing/e2e/admin-review-screenshots";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { describe, expect } from "vitest";

import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import { scopedTranslation } from "./i18n";

describe("Lead search", () => {
  const e2e = useE2E("leads/operator-search");
  for (const locale of ["en-US", "de-DE"] as const) {
    e2e.it(`paginates scoped search results, filters by status and opens a lead in ${locale}`, async (fixture) => {
      const recent = crypto.randomUUID();
      const older = crypto.randomUUID();
      const term = `Workshop ${recent.slice(0, 7)}`;
      const newLead = `${term} North`;
      const pendingLead = `${term} South`;
      fixture.cleanup(async () => {
        await db.delete(leads).where(inArray(leads.id, [recent, older]));
      });
      await db.insert(leads).values([
        {
          id: recent,
          businessName: newLead,
          country: Countries.US,
          language: Languages.EN,
          source: LeadSource.CSV_IMPORT,
          status: LeadStatus.NEW,
          createdAt: new Date("2026-09-20T10:00:00Z"),
        },
        {
          id: older,
          businessName: pendingLead,
          country: Countries.US,
          language: Languages.EN,
          source: LeadSource.CSV_IMPORT,
          status: LeadStatus.PENDING,
          createdAt: new Date("2026-09-19T10:00:00Z"),
        },
      ]);
      await authAtlas(fixture, await resolveTestAdminUser());
      const { page } = fixture;
      const { t } = scopedTranslation.scopedT(locale);
      const query = new URLSearchParams({
        "arg.search": term,
        "arg.limit": "1",
      });
      await fixture.goto(`/tools/leads-search?${query}`, locale);
      const latest = page.getByRole("button", { name: newLead, exact: true });
      const previous = page.getByRole("button", { name: pendingLead, exact: true });
      await latest.waitFor();
      await saveAdminReviewScreenshots(page, "leads-search", locale);

      await page.getByRole("button", { name: t("widget.next"), exact: true }).click();
      await previous.waitFor();
      await page.getByRole("button", { name: t("widget.previous"), exact: true }).click();
      await latest.waitFor();
      await page.getByRole("button", { name: t("widget.statusPending"), exact: true }).click();
      await previous.waitFor();
      expect(await latest.count()).toBe(0);
      expect(await page.getByText(older, { exact: true }).count()).toBe(0);
      await previous.click();
      await page.getByRole("heading", { name: pendingLead, exact: true }).waitFor();
    });
  }
});
