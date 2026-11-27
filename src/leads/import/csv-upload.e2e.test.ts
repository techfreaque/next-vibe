import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { leads } from "next-vibe/identity/lead/db";
import { saveAdminReviewScreenshots } from "next-vibe/tooling/testing/e2e/admin-review-screenshots";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { describe, expect } from "vitest";

import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import { importBatches } from "./db";
import definition from "./definition";
import { scopedTranslation } from "./i18n";

describe("CSV lead import", () => {
  const e2e = useE2E("leads/csv-upload");
  for (const locale of ["en-US", "de-DE"] as const) {
    e2e.it(`downloads the template and imports the uploaded CSV in ${locale}`, async (fixture) => {
      const email = fixture.uniqueEmail("lead-import");
      const fileName = `atlas-leads-${crypto.randomUUID()}.csv`;
      fixture.cleanup(async () => {
        await db.delete(leads).where(eq(leads.email, email));
        await db.delete(importBatches).where(eq(importBatches.fileName, fileName));
      });
      await authAtlas(fixture, await resolveTestAdminUser());
      const { page } = fixture;
      const { t } = scopedTranslation.scopedT(locale);
      const query = new URLSearchParams({
        "arg.fileName": fileName,
        "arg.defaultCountry": "US",
        "arg.defaultLanguage": "en",
      });
      await fixture.goto(`/tools/leads-import?${query}`, locale);
      const downloadTemplate = page.getByRole("link", { name: t("post.widget.exportTemplateButton"), exact: true });
      const [template] = await Promise.all([
        page.waitForEvent("download"),
        downloadTemplate.click(),
      ]);
      expect(template.suggestedFilename()).toBe("leads-import-template.csv");
      const guide = page.getByRole("button", { name: t("post.widget.importGuideTitle") });
      await guide.click();
      await page.getByText(t("post.widget.fileRequirementsTitle"), { exact: true }).waitFor();
      await guide.click();
      const file = Buffer.from(
        `email,businessName,contactName,phone\n${email},Example Bookshop,Alex,012345\n`,
      );
      await page.locator('input[type="file"]').setInputFiles({
        name: "September contacts.csv",
        mimeType: "text/csv",
        buffer: file,
      });
      await page.getByRole("checkbox", { name: t("post.useChunkedProcessing.label") }).uncheck();
      const submit = page.getByTestId("endpoint-submit").filter({ visible: true });
      await saveAdminReviewScreenshots(page, "leads-import", locale);
      const imported = await fixture.capture(definition.POST, () => submit.click());
      expect(imported.requestBody).toMatchObject({
        fileName,
        file: file.toString("base64"),
        useChunkedProcessing: false,
      });
      expect(imported.response).toMatchObject({
        success: true,
        data: { totalRows: 1, successfulImports: 1, failedImports: 0 },
      });
      const [saved] = await db.select().from(leads).where(eq(leads.email, email));
      expect(saved).toMatchObject({
        businessName: "Example Bookshop",
        contactName: "Alex",
        phone: "012345",
      });
    });
  }
});
