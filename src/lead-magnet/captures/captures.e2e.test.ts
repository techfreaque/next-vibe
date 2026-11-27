import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { saveAdminReviewScreenshots } from "next-vibe/tooling/testing/e2e/admin-review-screenshots";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { describe, expect } from "vitest";

import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import { leadMagnetCaptures, leadMagnetConfigs } from "../db";
import { LeadMagnetCaptureStatus } from "../enum";
import { scopedTranslation } from "./i18n";

describe("Captured leads", () => {
  const e2e = useE2E("lead-magnet/captures");
  for (const locale of ["en-US", "de-DE"] as const) {
    e2e.it(`shows the saved outcomes and downloads spreadsheet-safe rows in ${locale}`, async (fixture) => {
      let userId: string | undefined;
      fixture.cleanup(async () => {
        if (userId) {
          await db.delete(leadMagnetConfigs).where(eq(leadMagnetConfigs.userId, userId));
          await deleteTestUser(userId);
        }
      });
      const account = await createTestUser(fixture.uniqueEmail("capture-owner"));
      expect(account.success).toBe(true);
      if (!account.success) {
        return;
      }
      const { user } = account.data;
      userId = user.id;
      const configId = crypto.randomUUID();
      await db.insert(leadMagnetConfigs).values({
        id: configId,
        userId,
        provider: "PLATFORM_EMAIL",
        credentials: {},
        isActive: false,
      });
      await db.insert(leadMagnetCaptures).values([
        {
          configId,
          firstName: "Alex",
          email: "alex@example.com",
          status: LeadMagnetCaptureStatus.SUCCESS,
        },
        {
          configId,
          firstName: "+Taylor",
          email: "taylor@example.com",
          status: LeadMagnetCaptureStatus.FAILED,
          errorMessage: "Fixture provider rejected the request",
        },
      ]);
      const { t } = scopedTranslation.scopedT(locale);
      const { page } = fixture;
      await authAtlas(fixture, user);
      await fixture.goto("/tools/lead-magnet/captures/GET", locale);
      const exportCsv = page.getByRole("button", {
        name: t("widget.exportCsv"),
        exact: true,
      });
      await exportCsv.waitFor();
      await page.getByText(t("widget.statusSuccess"), { exact: true }).filter({ visible: true }).waitFor();
      await page.getByText(t("widget.statusFailed"), { exact: true }).filter({ visible: true }).waitFor();
      await saveAdminReviewScreenshots(page, "lead-magnet_captures_GET", locale);

      const [download] = await Promise.all([
        page.waitForEvent("download"),
        exportCsv.click(),
      ]);
      expect(download.suggestedFilename()).toMatch(/^leads-\d{4}-\d{2}-\d{2}\.csv$/u);
      const stream = await download.createReadStream();
      const parts: Buffer[] = [];
      if (stream) {
        for await (const chunk of stream) {
          parts.push(Buffer.from(chunk));
        }
      }
      const csv = Buffer.concat(parts).toString("utf8");
      expect(csv).toContain('"Alex","alex@example.com","SUCCESS"');
      expect(csv).toContain('"\'+Taylor","taylor@example.com","FAILED"');
    });
  }
});
