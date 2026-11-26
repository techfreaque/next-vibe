import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  formatDocDate,
  formatMoney,
} from "next-vibe/unified-ui/_shared/format-money";
import { describe, expect } from "vitest";

import {
  getAtlasFixture,
  prepareAtlasCompany,
  saveAdminViewMatrix,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { scopedTranslation as adminTranslation } from "@/vibe/help-tool/i18n";
import { paymentEstimateLines, paymentEstimates } from "@/payment/db";
import { EstimateStatus } from "@/payment/enum";
import { scopedTranslation as sendTranslation } from "../send/i18n";
import { scopedTranslation } from "./i18n";

describe("Estimate detail", () => {
  const e2e = useE2E("payment/estimate/record");
  e2e.it(
    "reads a localized quote and records when it was sent",
    async (fixtures) => {
      const { page } = fixtures;
      const company = "E2E Paper Studio";
      const { companyId, headers } = await prepareAtlasCompany(
        fixtures,
        company,
      );
      const estimateId = randomUUID();
      const number = "Q-2026-104";
      const name = "E2E Bookshop";
      const expires = new Date("2026-12-12T00:00:00.000Z");
      fixtures.cleanup(async () => {
        await db
          .delete(paymentEstimates)
          .where(eq(paymentEstimates.id, estimateId));
      });
      await db.insert(paymentEstimates).values({
        id: estimateId,
        companyId,
        estimateNumber: number,
        customerName: name,
        currency: "EUR",
        validUntil: expires,
        title: "Winter catalogue",
        terms: "Payment within 30 days of invoice.",
        subtotal: 150,
        taxAmount: 30,
        total: 180,
      });
      await db.insert(paymentEstimateLines).values({
        estimateId,
        description: "Catalogue design",
        quantity: 2,
        unitPrice: 75,
        taxRate: 0.2,
        taxAmount: 30,
        lineTotal: 180,
      });
      const path = "payment/estimate/" + estimateId;
      const tool = "/tools/payment-estimate-get?arg.estimateId=" + estimateId;
      const url = fixtures.baseUrl + "/api/en-US/" + path + "/get";
      expect((await getAtlasFixture(url, {}, headers)).status).toBe(200);
      for (const locale of ["de-DE", "sk-SK", "en-US"] as const) {
        const { t } = scopedTranslation.scopedT(locale);
        await page.route(`**/api/${locale}/${path}/*`, (route) =>
          route.continue({
            headers: { ...route.request().headers(), ...headers },
          }),
        );
        await fixtures.goto(tool, locale);
        const heading = page.getByRole("heading", {
          name: t("widget.estimateNumber") + " " + number,
        });
        const retry = page.getByRole("button", {
          name: adminTranslation.scopedT(locale).t("catalog.retry"),
          exact: true,
        });
        for (let attempt = 0; attempt < 2; attempt++) {
          await heading.or(retry).first().waitFor();
          if (await heading.isVisible()) break;
          await retry.click();
        }
        await heading.waitFor();
        await page.getByText(name, { exact: true }).first().waitFor();
        await page
          .getByText(formatDocDate(expires, locale), { exact: true })
          .first()
          .waitFor();
        await page
          .getByText(formatMoney(180, "EUR", locale), { exact: true })
          .first()
          .waitFor();
        await page
          .getByRole("button", { name: t("widget.send"), exact: true })
          .waitFor();
        await saveAdminViewMatrix(
          page,
          "businessDocuments",
          "estimate-detail-verified-" + locale.slice(0, 2),
        );
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
        ).toBe(true);
      }
      const { t } = scopedTranslation.scopedT("en-US");
      const { t: send } = sendTranslation.scopedT("en-US");
      await page
        .getByRole("button", { name: t("widget.send"), exact: true })
        .click();
      await page
        .getByText(send("widget.sendNote"), { exact: true })
        .filter({ visible: true })
        .waitFor();
      const response = page.waitForResponse(
        (reply) =>
          reply.request().method() === "POST" &&
          new URL(reply.url()).pathname.endsWith(path + "/send"),
      );
      await page
        .getByRole("button", { name: send("widget.submit"), exact: true })
        .filter({ visible: true })
        .last()
        .click();
      expect((await response).status()).toBe(200);
      const [sent] = await db
        .select()
        .from(paymentEstimates)
        .where(eq(paymentEstimates.id, estimateId));
      expect(sent.status).toBe(EstimateStatus.SENT);
      expect(sent.sentAt).toBeInstanceOf(Date);
      expect(sent.total).toBe(180);
      await fixtures.gotoReady(tool, () =>
        page
          .getByRole("button", { name: t("widget.accept"), exact: true })
          .waitFor(),
      );
      await page
        .getByText(t("widget.status.sent"), { exact: true })
        .filter({ visible: true })
        .first()
        .waitFor();
    },
    160000,
  );
});
