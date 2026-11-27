import { eq } from "drizzle-orm";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import { saveAdminReviewScreenshots } from "next-vibe/tooling/testing/e2e/admin-review-screenshots";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { describe, expect } from "vitest";

import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import { leadMagnetConfigs } from "../../db";
import { scopedTranslation } from "../../i18n";
import endpoints from "./definition";

describe("Google Sheets provider", () => {
  const e2e = useE2E("lead-magnet/google-sheet-selection");
  for (const locale of ["en-US", "de-DE"] as const) {
    e2e.it(`refreshes a replayed spreadsheet list, reports save failure and persists a selection in ${locale}`, async (fixture) => {
      let userId: string | undefined;
      fixture.cleanup(async () => {
        if (userId) {
          await db.delete(leadMagnetConfigs).where(eq(leadMagnetConfigs.userId, userId));
          await deleteTestUser(userId);
        }
      });
      const account = await createTestUser(fixture.uniqueEmail("sheets-owner"));
      expect(account.success).toBe(true);
      if (!account.success) {
        return;
      }
      const { user } = account.data;
      userId = user.id;
      const spreadsheet = { id: "e2e-atlas-sheet", name: "Newsletter signups" };
      await db.insert(leadMagnetConfigs).values({
        userId: user.id,
        provider: "GOOGLE_SHEETS",
        credentials: {
          googleRefreshToken: "fixture-refresh",
          googleAccessToken: "fixture-access",
          googleTokenExpiry: "2099-01-01T00:00:00.000Z",
        },
        headline: "Join the newsletter",
        buttonText: "Subscribe",
        isActive: false,
      });

      const { page } = fixture;
      let listings = 0;
      const providerApi = `/api/${locale}/lead-magnet/providers/google-sheets`;
      await page.route((url) => url.pathname === `${providerApi}/sheets-list`, (route) => {
        listings++;
        return route.fulfill({
          json: { success: true, data: { sheets: [spreadsheet] } },
        });
      });
      await authAtlas(fixture, user);
      const configPath = "/tools/lead-magnet/config/GET";
      await fixture.goto(`${configPath}?gs_connected=1`, locale);
      const { t } = scopedTranslation.scopedT(locale);
      const selector = page.getByRole("combobox", {
        name: t("providers.googleSheets.spreadsheetId.label"),
        exact: true,
      });
      await selector.waitFor();
      expect(listings).toBeGreaterThan(0);
      const refresh = page.getByRole("button", {
        name: t("providers.googleSheets.widget.refresh"),
        exact: true,
      });
      const beforeRefresh = listings;
      await refresh.click();
      await selector.waitFor();
      expect(listings).toBeGreaterThan(beforeRefresh);
      await page.setViewportSize({ width: 1440, height: 900 });
      await selector.click();
      const option = page.getByRole("option", { name: spreadsheet.name, exact: true });
      await option.waitFor();
      await saveAdminReviewScreenshots(
        page,
        "lead-magnet_providers_google-sheets_sheets-list_GET",
        locale,
      );
      if (!await option.isVisible()) {
        await selector.click();
      }
      await option.click();
      const tab = page.getByRole("textbox", { name: t("providers.googleSheets.sheetTab.label"), exact: true });
      await tab.fill("July");
      const save = page.getByRole("button", { name: t("providers.googleSheets.saveTitle"), exact: true });
      await saveAdminReviewScreenshots(page, "lead-magnet_providers_google-sheets_POST", locale);

      const error = t("providers.shared.errors.forbidden.description");
      await page.route((url) => url.pathname === providerApi, (route) => route.fulfill({
        status: 403,
        json: { success: false, message: error, errorType: ErrorResponseTypes.FORBIDDEN },
      }), { times: 1 });
      await save.click();
      await page.getByText(error, { exact: true }).first().waitFor();
      expect(await tab.inputValue()).toBe("July");
      const saved = await fixture.capture(endpoints.POST, () => save.click());
      expect(saved.response.success).toBe(true);
      const [persisted] = await db.select().from(leadMagnetConfigs).where(eq(leadMagnetConfigs.userId, user.id));
      expect(persisted).toMatchObject({
        listId: spreadsheet.id,
        headline: "Join the newsletter",
        buttonText: "Subscribe",
        isActive: true,
        credentials: { googleSheetId: spreadsheet.id, googleSheetTab: "July" },
      });
      await fixture.goto(configPath, locale);
      await selector.getByText(spreadsheet.name).waitFor();
      expect(await tab.inputValue()).toBe("July");
    });
  }
});
