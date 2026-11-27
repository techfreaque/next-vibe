import { eq, inArray } from "drizzle-orm";
import { Countries, Languages } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { leads } from "next-vibe/identity/lead/db";
import { LeadSource, LeadStatus } from "next-vibe/identity/lead/enum";
import { saveAdminReviewScreenshots } from "next-vibe/tooling/testing/e2e/admin-review-screenshots";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { describe, expect } from "vitest";
import { z } from "zod";

import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import definition from "./definition";
import { scopedTranslation } from "./i18n";

describe("Lead batch actions", () => {
  const e2e = useE2E("leads/batch-workflow");
  for (const locale of ["en-US", "de-DE"] as const) {
    e2e.it(`previews, updates and deletes only the targeted lead in ${locale}`, async (fixture) => {
      const target = crypto.randomUUID();
      const control = crypto.randomUUID();
      const targetEmail = fixture.uniqueEmail("batch-target");
      const controlEmail = fixture.uniqueEmail("batch-control");
      fixture.cleanup(async () => {
        await db.delete(leads).where(inArray(leads.id, [target, control]));
      });
      await db.insert(leads).values([
        { id: target, email: targetEmail },
        { id: control, email: controlEmail },
      ].map((lead) => ({
        ...lead,
        businessName: "Example Bookshop",
        country: Countries.US,
        language: Languages.EN,
        source: LeadSource.CSV_IMPORT,
        status: LeadStatus.NEW,
      })));
      await authAtlas(fixture, await resolveTestAdminUser());
      const { page } = fixture;
      const { t } = scopedTranslation.scopedT(locale);
      const api = `/api/${locale}/leads/batch`;
      const selectiveRequest = z.object({ search: z.literal(targetEmail), maxRecords: z.literal(1) });
      await page.route((url) => url.pathname === api, (route) => {
        if (!selectiveRequest.safeParse(route.request().postDataJSON()).success) {
          return route.abort();
        }
        return route.continue();
      });
      const waitForBatch = (method: "PATCH" | "DELETE") =>
        page.waitForResponse((result) => new URL(result.url()).pathname === api && result.request().method() === method);
      const query = new URLSearchParams({ "arg.search": targetEmail, "arg.maxRecords": "1" });
      await fixture.goto(`/tools/leads/batch/PATCH?${query}`, locale);
      const submit = page.getByTestId("endpoint-submit").filter({ visible: true });
      const updatePreview = page.getByRole("checkbox", { name: t("patch.dryRun.label") });
      await page.locator('input[name="updates.notes"]').fill("Verified on the import call");
      await updatePreview.check();
      await saveAdminReviewScreenshots(page, "leads_batch_PATCH", locale);
      const updateSchema = z.object({ success: z.literal(true), data: definition.PATCH.responseSchema });
      const [preview] = await Promise.all([waitForBatch("PATCH"), submit.click()]);
      const previewData = updateSchema.parse(await preview.json()).data.response;
      expect(previewData?.preview?.map((lead) => lead.id)).toEqual([target]);
      const [before] = await db.select().from(leads).where(eq(leads.id, target));
      expect(before?.notes).toBeNull();

      await updatePreview.uncheck();
      const [updated] = await Promise.all([waitForBatch("PATCH"), submit.click()]);
      expect(updateSchema.parse(await updated.json()).data.response?.totalUpdated).toBe(1);
      const [stored] = await db.select().from(leads).where(eq(leads.id, target));
      expect(stored?.notes).toBe("Verified on the import call");

      const deletePath = `/tools/leads/batch/DELETE?${query}`;
      await fixture.goto(deletePath, locale);
      const deletePreview = page.getByRole("checkbox", { name: t("delete.dryRun.label") });
      const confirm = page.getByRole("checkbox", { name: t("delete.confirmDelete.label") });
      const hydratedDeleteForm = page.locator("[data-hydrated]").filter({ has: confirm }).first();
      await saveAdminReviewScreenshots(page, "leads_batch_DELETE", locale);
      await hydratedDeleteForm.waitFor();
      await page.waitForLoadState("networkidle");
      await deletePreview.check();
      await confirm.check();
      const checked = page.getByRole("checkbox", { checked: true });
      await deletePreview.and(checked).waitFor();
      await confirm.and(checked).waitFor();
      const deleteSchema = z.object({ success: z.literal(true), data: definition.DELETE.responseSchema });
      const [review] = await Promise.all([waitForBatch("DELETE"), submit.click()]);
      expect(deleteSchema.parse(await review.json()).data.response?.preview?.map((lead) => lead.id)).toEqual([target]);
      expect(await db.select({ id: leads.id }).from(leads).where(eq(leads.id, target))).toEqual([{ id: target }]);

      await page.getByText(t("widget.delete.previewTitle", { count: 1 }), { exact: true }).waitFor();
      await page.waitForLoadState("networkidle");
      await deletePreview.and(checked).waitFor();
      await deletePreview.uncheck();
      await confirm.check();
      await confirm.and(checked).waitFor();
      await deletePreview.and(page.getByRole("checkbox", { checked: false })).waitFor();
      const [deleted] = await Promise.all([waitForBatch("DELETE"), submit.click()]);
      expect(deleteSchema.parse(await deleted.json()).data.response?.totalDeleted).toBe(1);
      expect(await db.select({ id: leads.id }).from(leads).where(inArray(leads.id, [target, control]))).toEqual([{ id: control }]);
    });
  }
});
