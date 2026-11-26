import "server-only";

import { mkdir } from "node:fs/promises";
import { eq } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { UserRole } from "next-vibe/identity/roles/enum";
import { userRoles } from "next-vibe/identity/user/db";
import { createTestSessionToken } from "next-vibe/tooling/testing/e2e/auth";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { describe, expect } from "vitest";

import { journalEntries } from "@/chart-of-accounts/db";
import { companies, companyMembers } from "@/companies/db";
import { CompanyMemberRole, CompanyType } from "@/companies/enum";
import { supplierEvidenceRecords } from "@/finance/supplier-evidence/db";

import { postAtlasFixture } from "../accounting/atlas-test-http";
import { paymentBills } from "../db";
import { historyHeader } from "./history";
import { scopedTranslation } from "./i18n";

describe("E2E: creator and referral cost history", () => {
  const e2e = useE2E("payment/creator-referral-history");

  e2e.it(
    "previews paid evidence, invoices and commitments without accounting writes",
    async ({ page, cleanup, uniqueEmail, loginAs, baseUrl }) => {
      const companyId = crypto.randomUUID();
      let userId: string | undefined;
      cleanup(async () => {
        await db.delete(companies).where(eq(companies.id, companyId));
        if (userId) await deleteTestUser(userId);
      });
      const user = await createTestUser(uniqueEmail("cost-history"));
      expect(user.success).toBe(true);
      if (!user.success) return;
      userId = user.data.user.id;
      await db.insert(userRoles).values({ userId, role: UserRole.ADMIN });
      const identity = {
        ...user.data.user,
        roles: [...user.data.user.roles, UserRole.ADMIN],
      };
      await loginAs(identity);
      const session = await createTestSessionToken(identity);
      expect(session.success).toBe(true);
      if (!session.success) return;
      const auth = { authorization: `Bearer ${session.data}` };
      await db.insert(companies).values({
        id: companyId,
        name: "History fixture",
        type: CompanyType.B2B,
        ownerUserId: userId,
        currency: "EUR",
      });
      await db.insert(companyMembers).values({
        companyId,
        userId,
        role: CompanyMemberRole.OWNER,
      });
      const history = [
        historyHeader,
        [
          "review-creator",
          "creator",
          "commitment",
          "",
          "100.00",
          "USD",
          "",
          "",
          "",
        ].join("\t"),
        [
          "review-invoice",
          "creator",
          "invoice",
          "2026-11-21",
          "24.00",
          "EUR",
          "4.00",
          "C-10",
          "",
        ].join("\t"),
        [
          "review-referral",
          "referral",
          "paid",
          "2026-11-22",
          "10.25",
          "PLN",
          "0",
          "R-10",
          "",
        ].join("\t"),
      ].join("\n");
      if (process.env["ERP_SALES_VISUALS"] === "1") {
        const proofDir = "scratchpad/erp/shots/v2/sales";
        await mkdir(proofDir, { recursive: true });
        await page.route(`${baseUrl}/**`, async (route) => {
          await route.continue({
            headers: { ...route.request().headers(), ...auth },
          });
        });
        await page.addInitScript(() => {
          localStorage.setItem("theme_v2", "system");
        });
        const { t } = scopedTranslation.scopedT(defaultLocale);
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.emulateMedia({ colorScheme: "light" });
        await page.goto(
          `${baseUrl}/${defaultLocale}/tools/creator-referral-cost-history?companyId=${companyId}`,
        );
        await page
          .locator('[data-field="history"] textarea')
          .last()
          .fill(history);
        await page
          .getByRole("button", { name: t("preview"), exact: true })
          .click();
        await page
          .getByText("review-invoice", { exact: true })
          .filter({ visible: true })
          .waitFor();
        await page.screenshot({
          path: `${proofDir}/history-desktop-light.png`,
        });
        await page
          .getByRole("button", { name: t("openBill"), exact: true })
          .filter({ visible: true })
          .click();
        await page
          .getByRole("heading", { name: "Record supplier evidence" })
          .last()
          .waitFor();
        await page.setViewportSize({ width: 390, height: 844 });
        await page.emulateMedia({ colorScheme: "dark" });
        await page.screenshot({
          path: `${proofDir}/history-supplier-phone-dark.png`,
        });
      }
      const path = `${baseUrl}/api/${defaultLocale}/payment/cost-backfill`;
      const rejected = await postAtlasFixture(path, {
        headers: auth,
        data: {
          companyId,
          history: history.replace("2026-11-21", "2026-02-30"),
        },
      });
      expect(rejected.ok).toBe(false);
      const preview = await postAtlasFixture(path, {
        headers: auth,
        data: { companyId, history },
      });
      expect(preview.ok).toBe(true);
      expect(await preview.json()).toMatchObject({
        success: true,
        data: {
          rows: [
            {
              reference: "review-creator",
              status: "commitment",
              currency: "USD",
            },
            { reference: "review-invoice", status: "ready", tax: "4.00" },
            {
              reference: "review-referral",
              status: "verifyPaid",
              gross: "10.25",
              currency: "PLN",
            },
          ],
        },
      });
      expect(
        await db
          .select()
          .from(paymentBills)
          .where(eq(paymentBills.companyId, companyId)),
      ).toHaveLength(0);
      expect(
        await db
          .select()
          .from(journalEntries)
          .where(eq(journalEntries.companyId, companyId)),
      ).toHaveLength(0);
      expect(
        await db
          .select()
          .from(supplierEvidenceRecords)
          .where(eq(supplierEvidenceRecords.companyId, companyId)),
      ).toHaveLength(0);
    },
  );
});
