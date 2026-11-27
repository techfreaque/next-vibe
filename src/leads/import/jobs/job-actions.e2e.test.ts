import { eq } from "drizzle-orm";
import { Countries, Languages } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { saveAdminReviewScreenshots } from "next-vibe/tooling/testing/e2e/admin-review-screenshots";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { describe, expect } from "vitest";

import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import { csvImportJobs } from "../db";
import { CsvImportJobStatus } from "../enum";
import { scopedTranslation as importTranslation } from "../i18n";
import { scopedTranslation as jobTranslation } from "./[jobId]/i18n";
import retry from "./[jobId]/retry/definition";
import { scopedTranslation as retryTranslation } from "./[jobId]/retry/i18n";
import stop from "./[jobId]/stop/definition";
import { scopedTranslation as stopTranslation } from "./[jobId]/stop/i18n";

describe("Lead import job actions", () => {
  const e2e = useE2E("leads/import-job-actions");
  for (const locale of ["en-US", "de-DE"] as const) {
    e2e.it(`opens a job by filename, stops it and queues a retry in ${locale}`, async (fixture) => {
      const admin = await resolveTestAdminUser();
      const id = crypto.randomUUID();
      const fileName = "September contacts.csv";
      fixture.cleanup(async () => {
        await db.delete(csvImportJobs).where(eq(csvImportJobs.id, id));
      });
      await db.insert(csvImportJobs).values({
        id,
        uploadedBy: admin.id,
        fileName,
        fileContent: Buffer.from("email\nsample@example.com").toString("base64"),
        defaultCountry: Countries.GLOBAL,
        defaultLanguage: Languages.EN,
        domain: "leads",
        status: CsvImportJobStatus.PROCESSING,
        batchSize: 100,
        totalRows: 240,
        processedRows: 100,
        successfulImports: 98,
        failedImports: 1,
        duplicateEmails: 1,
        currentBatchStart: 100,
      });
      const { page } = fixture;
      const { t: importT } = importTranslation.scopedT(locale);
      const { t: jobT } = jobTranslation.scopedT(locale);
      const { t: stopT } = stopTranslation.scopedT(locale);
      const { t: retryT } = retryTranslation.scopedT(locale);
      await authAtlas(fixture, admin);
      const home = "/tools/leads-import-status";
      await fixture.goto(home, locale);
      const openJob = page.getByText(fileName, { exact: true });
      await openJob.waitFor();
      expect(await page.getByText(id, { exact: true }).count()).toBe(0);
      await saveAdminReviewScreenshots(page, "leads-import-status", locale);
      await page.getByRole("button", { name: new RegExp(`^${importT("widget.filter.running")}`) }).click();
      await openJob.click();

      const openStop = page.getByRole("button", { name: jobT("get.actions.stop"), exact: true });
      await openStop.waitFor();
      await saveAdminReviewScreenshots(page, "leads_import_jobs_jobId_GET", locale);
      await openStop.click();
      const stopAction = page.getByTestId("endpoint-submit").filter({ visible: true });
      await stopAction.waitFor();
      await saveAdminReviewScreenshots(page, "leads_import_jobs_jobId_stop_POST", locale);
      const stopped = await fixture.capture(stop.POST, () => stopAction.click());
      expect(stopped.response.success).toBe(true);
      await page.getByText(stopT("widget.successMessage"), { exact: true }).waitFor();
      const [failed] = await db.select().from(csvImportJobs).where(eq(csvImportJobs.id, id));
      expect(failed?.status).toBe(CsvImportJobStatus.FAILED);
      expect(failed?.processedRows).toBe(100);

      await fixture.goto(home, locale);
      await openJob.click();
      await page.getByRole("button", { name: jobT("get.actions.retry"), exact: true }).click();
      const retryAction = page.getByTestId("endpoint-submit").filter({ visible: true });
      await retryAction.waitFor();
      await saveAdminReviewScreenshots(page, "leads_import_jobs_jobId_retry_POST", locale);
      const retried = await fixture.capture(retry.POST, () => retryAction.click());
      expect(retried.response.success).toBe(true);
      await page.getByText(retryT("widget.successMessage"), { exact: true }).waitFor();
      const [queued] = await db.select().from(csvImportJobs).where(eq(csvImportJobs.id, id));
      expect(queued).toMatchObject({
        status: CsvImportJobStatus.PENDING,
        retryCount: 1,
        processedRows: 100,
        completedAt: null,
      });
      await page.getByRole("button", { name: jobT("widget.retry.viewJobStatus"), exact: true }).click();
      await page.getByRole("heading", { name: fileName, exact: true }).waitFor();
    });
  }
});
