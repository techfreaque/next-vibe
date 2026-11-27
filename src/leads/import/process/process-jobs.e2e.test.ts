import { eq, inArray } from "drizzle-orm";
import { Countries, Languages } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { leads } from "next-vibe/identity/lead/db";
import { scopedTranslation } from "next-vibe/identity/lead/i18n";
import { saveAdminReviewScreenshots } from "next-vibe/tooling/testing/e2e/admin-review-screenshots";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { describe, expect } from "vitest";

import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import { csvImportJobs } from "../db";
import { CsvImportJobStatus } from "../enum";
import definition from "./definition";

describe("Lead import worker", () => {
  const e2e = useE2E("leads/import-process");
  for (const locale of ["en-US", "de-DE"] as const) {
    e2e.it(`previews a scoped import without writing and then processes only that job in ${locale}`, async (fixture) => {
      const requestedJob = crypto.randomUUID();
      const unrelatedJob = crypto.randomUUID();
      const requestedEmail = fixture.uniqueEmail("process-requested");
      const unrelatedEmail = fixture.uniqueEmail("process-unrelated");
      fixture.cleanup(async () => {
        await db.delete(leads).where(inArray(leads.email, [requestedEmail, unrelatedEmail]));
        await db.delete(csvImportJobs).where(inArray(csvImportJobs.id, [requestedJob, unrelatedJob]));
      });
      const admin = await resolveTestAdminUser();
      await authAtlas(fixture, admin);
      await db.insert(csvImportJobs).values([
        { id: requestedJob, email: requestedEmail },
        { id: unrelatedJob, email: unrelatedEmail },
      ].map(({ id, email }) => ({
        id,
        uploadedBy: admin.id,
        fileName: "newsletter-contacts.csv",
        domain: "leads",
        fileContent: Buffer.from(`email,businessName\n${email},Example Bookshop\n`).toString("base64"),
        defaultCountry: Countries.GLOBAL,
        defaultLanguage: Languages.EN,
        totalRows: 1,
      })));
      const { t } = scopedTranslation.scopedT(locale);
      const { page } = fixture;
      const query = new URLSearchParams({
        "arg.selfTaskId": `leads-import-${requestedJob}`,
        "arg.maxJobsPerRun": "1",
      });
      await fixture.goto(`/tools/leads/import/process/POST?${query}`, locale);
      const prepare = page.getByTestId("endpoint-submit").filter({ visible: true });
      const dryRun = page.getByRole("checkbox", {
        name: t("import.process.post.fields.dryRun.label"),
      });
      await dryRun.check();
      await saveAdminReviewScreenshots(page, "leads_import_process_POST", locale);
      const preview = await fixture.capture(definition.POST, () => prepare.click());
      expect(preview.requestBody).toMatchObject({
        dryRun: true,
        selfTaskId: `leads-import-${requestedJob}`,
      });
      expect(preview.response).toMatchObject({
        success: true,
        data: { jobsProcessed: 1, totalRowsProcessed: 0 },
      });
      expect(await db.select().from(leads).where(eq(leads.email, requestedEmail))).toEqual([]);
      const [pending] = await db.select().from(csvImportJobs).where(eq(csvImportJobs.id, requestedJob));
      expect(pending?.status).toBe(CsvImportJobStatus.PENDING);

      await dryRun.uncheck();
      const completed = await fixture.capture(definition.POST, () => prepare.click());
      expect(completed.response).toMatchObject({
        success: true,
        data: { jobsProcessed: 1, totalRowsProcessed: 1 },
      });
      const [imported] = await db.select().from(leads).where(eq(leads.email, requestedEmail));
      expect(imported?.businessName).toBe("Example Bookshop");
      expect(await db.select().from(leads).where(eq(leads.email, unrelatedEmail))).toEqual([]);
      const [untouched] = await db.select().from(csvImportJobs).where(eq(csvImportJobs.id, unrelatedJob));
      expect(untouched?.status).toBe(CsvImportJobStatus.PENDING);
    });
  }
});
