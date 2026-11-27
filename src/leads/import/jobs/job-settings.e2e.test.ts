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
import definition from "./[jobId]/definition";
import { scopedTranslation } from "./[jobId]/i18n";

describe("E2E: import job settings and removal", () => {
  const e2e = useE2E("leads/import-job-settings");

  e2e.it("saves settings and removes a stopped import job", async (fixture) => {
    const { page } = fixture;
    const locale = "en-US";
    const { t } = scopedTranslation.scopedT(locale);
    const admin = await resolveTestAdminUser();
    const jobId = crypto.randomUUID();
    fixture.cleanup(async () => {
      await db.delete(csvImportJobs).where(eq(csvImportJobs.id, jobId));
    });
    await db.insert(csvImportJobs).values({
      id: jobId,
      uploadedBy: admin.id,
      fileName: "Studio contacts.csv",
      fileContent: Buffer.from("email\nriver@example.test").toString("base64"),
      defaultCountry: Countries.GLOBAL,
      defaultLanguage: Languages.EN,
      domain: "leads",
      status: CsvImportJobStatus.PROCESSING,
      batchSize: 100,
      maxRetries: 3,
    });
    await authAtlas(fixture, admin);
    const base = "/tools/leads/import/jobs/[jobId]";
    const submit = page.getByTestId("endpoint-submit").filter({ visible: true });
    const fileName = page
      .getByText("Studio contacts.csv", { exact: true })
      .filter({ visible: true })
      .first();
    await fixture.goto(`${base}/GET?arg.jobId=${jobId}`, locale);
    await page.getByRole("button", { name: t("patch.titleShort") }).click();
    await fileName.waitFor();
    const batchSize = page.getByLabel(t("patch.batchSize.label"), { exact: true });
    const maxRetries = page.getByLabel(t("patch.maxRetries.label"), { exact: true });
    await batchSize.and(page.locator('input[value="100"]')).waitFor();
    expect(await maxRetries.inputValue()).toBe("3");
    await batchSize.fill("75");
    await maxRetries.fill("2");
    await saveAdminReviewScreenshots(
      page,
      "leads_import_jobs_jobId_PATCH",
      locale,
    );
    const saved = await fixture.capture(definition.PATCH, () => submit.click());
    expect(saved.response.success).toBe(true);
    const [job] = await db
      .select()
      .from(csvImportJobs)
      .where(eq(csvImportJobs.id, jobId));
    expect(job).toMatchObject({ batchSize: 75, maxRetries: 2 });

    const deletePath = `${base}/DELETE?arg.jobId=${jobId}`;
    await fixture.goto(deletePath, locale);
    await fileName.waitFor();
    const blocked = await fixture.capture(definition.DELETE, () =>
      submit.click(),
    );
    expect(blocked.status).toBe(409);
    expect(
      await db
        .select({ id: csvImportJobs.id })
        .from(csvImportJobs)
        .where(eq(csvImportJobs.id, jobId)),
    ).toHaveLength(1);

    await db
      .update(csvImportJobs)
      .set({ status: CsvImportJobStatus.FAILED })
      .where(eq(csvImportJobs.id, jobId));
    await fixture.goto(`${base}/GET?arg.jobId=${jobId}`, locale);
    await page.getByRole("button", { name: t("delete.titleShort") }).click();
    await fileName.waitFor();
    await submit.waitFor();
    await saveAdminReviewScreenshots(
      page,
      "leads_import_jobs_jobId_DELETE",
      locale,
    );
    const removed = await fixture.capture(definition.DELETE, () =>
      submit.click(),
    );
    expect(removed.response).toMatchObject({
      success: true,
      data: {
        result: { success: true, message: t("delete.success.description") },
      },
    });
    expect(
      await db
        .select({ id: csvImportJobs.id })
        .from(csvImportJobs)
        .where(eq(csvImportJobs.id, jobId)),
    ).toHaveLength(0);
  });
});
