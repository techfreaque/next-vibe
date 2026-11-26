import { randomUUID } from "node:crypto";
import { and, eq, ne } from "drizzle-orm";
import { db } from "next-vibe/database";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  formatDocDate,
  formatMoney,
} from "next-vibe/unified-ui/_shared/format-money";
import { describe, expect } from "vitest";
import { z } from "zod";

import { accountingPeriods, accountNodes } from "@/chart-of-accounts/db";
import { AccountSubtype, AccountType } from "@/chart-of-accounts/enum";
import {
  getAtlasFixture,
  postAtlas,
  prepareAtlasCompany,
  saveAdminViewMatrix,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { scopedTranslation as adminTranslation } from "@/vibe/help-tool/i18n";
import { scopedTranslation as recordTranslation } from "@/vibe/unified-ui/hooks/i18n";
import {
  paymentEstimateLines,
  paymentEstimates,
  paymentInvoices,
} from "@/payment/db";
import {
  EstimateStatus,
  InvoiceStatus,
  ManualPaymentMethod,
} from "@/payment/enum";
import invoiceGet from "@/payment/invoice/[invoiceId]/get/definition";
import { scopedTranslation as removeTranslation } from "../../line/[lineId]/remove/i18n";
import { scopedTranslation as acceptTranslation } from "../accept/i18n";
import convert from "../convert-to-invoice/definition";
import { scopedTranslation as convertTranslation } from "../convert-to-invoice/i18n";
import { scopedTranslation as declineTranslation } from "../decline/i18n";
import { scopedTranslation as duplicateTranslation } from "../duplicate/i18n";
import { scopedTranslation as sendTranslation } from "../send/i18n";
import { scopedTranslation } from "./i18n";

const estimateCreated = z.object({
  success: z.literal(true),
  data: z.object({ estimate: z.object({ id: z.uuid() }) }),
});

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

  e2e.it(
    "accepts a quote, converts it, collects part and credits the rest",
    async (fixtures) => {
      const { page } = fixtures;
      const { companyId, headers } = await prepareAtlasCompany(
        fixtures,
        "E2E Quote Chain",
      );
      fixtures.cleanup(async () => {
        await db
          .delete(paymentInvoices)
          .where(eq(paymentInvoices.companyId, companyId));
        await db
          .delete(paymentEstimates)
          .where(eq(paymentEstimates.companyId, companyId));
      });
      const [ar, revenue, vat, bank] = [
        randomUUID(),
        randomUUID(),
        randomUUID(),
        randomUUID(),
      ];
      await db.insert(accountNodes).values([
        {
          id: ar,
          companyId,
          name: "Debtors",
          code: "311",
          type: AccountType.ASSET,
          subtype: AccountSubtype.ACCOUNTS_RECEIVABLE,
        },
        {
          id: revenue,
          companyId,
          name: "Services",
          code: "602",
          type: AccountType.REVENUE,
          subtype: AccountSubtype.REVENUE_SALES,
        },
        {
          id: vat,
          companyId,
          name: "VAT",
          code: "343",
          type: AccountType.LIABILITY,
          subtype: AccountSubtype.VAT_PAYABLE,
        },
        {
          id: bank,
          companyId,
          name: "Current account",
          code: "221",
          type: AccountType.ASSET,
          subtype: AccountSubtype.BANK,
        },
      ]);
      await db.insert(accountingPeriods).values({
        companyId,
        name: "Quote chain fixture",
        startDate: new Date(Date.now() - 86_400_000),
        endDate: new Date(Date.now() + 86_400_000),
      });
      const workshop = {
        description: "Brand workshop",
        quantity: 2,
        unitPrice: 300,
        taxRate: 0.2,
      };
      const print = {
        description: "Print proofs",
        quantity: 1,
        unitPrice: 50,
        taxRate: 0.2,
      };
      const created = estimateCreated.parse(
        await (
          await postAtlas(fixtures, "payment/estimate/create", {
            companyId,
            currency: "EUR",
            customerName: "E2E Harbour Cafe",
            title: "Spring rebrand",
            lines: [workshop, print],
          })
        ).json(),
      );
      const estimateId = created.data.estimate.id;
      expect(
        (await postAtlas(fixtures, `payment/estimate/${estimateId}/send`, {}))
          .status,
      ).toBe(200);
      const [quote] = await db
        .select()
        .from(paymentEstimates)
        .where(eq(paymentEstimates.id, estimateId));
      expect(quote.total).toBe(780);

      const locale = "en-US";
      const { t } = scopedTranslation.scopedT(locale);
      const { t: acceptT } = acceptTranslation.scopedT(locale);
      const { t: convertT } = convertTranslation.scopedT(locale);
      await fixtures.gotoReady(
        "/tools/payment-estimate-get?arg.estimateId=" + estimateId,
        () =>
          page
            .getByRole("button", { name: t("widget.accept"), exact: true })
            .waitFor(),
      );
      await page
        .getByRole("button", { name: t("widget.accept"), exact: true })
        .click();
      const dialog = page.getByRole("dialog");
      await dialog.getByText(quote.estimateNumber, { exact: true }).waitFor();
      await dialog
        .getByText(formatMoney(780, "EUR", locale), { exact: true })
        .waitFor();
      const accepted = page.waitForResponse(
        (reply) =>
          reply.request().method() === "POST" &&
          new URL(reply.url()).pathname.endsWith(estimateId + "/accept"),
      );
      await dialog
        .getByRole("button", { name: acceptT("widget.submit"), exact: true })
        .click();
      expect((await accepted).status()).toBe(200);
      const [afterAccept] = await db
        .select()
        .from(paymentEstimates)
        .where(eq(paymentEstimates.id, estimateId));
      expect(afterAccept.status).toBe(EstimateStatus.ACCEPTED);

      const convertButton = page
        .getByRole("button", { name: t("widget.convertToInvoice"), exact: true })
        .filter({ visible: true })
        .first();
      await convertButton.waitFor();
      await convertButton.click();
      const [converting] = await Promise.all([
        page.waitForResponse(
          (reply) =>
            reply.request().method() === "POST" &&
            new URL(reply.url()).pathname.endsWith(
              estimateId + "/convert-to-invoice",
            ),
        ),
        page
          .getByRole("dialog")
          .getByRole("button", { name: convertT("widget.submit"), exact: true })
          .click(),
      ]);
      const { invoiceId } = z
        .object({ success: z.literal(true), data: convert.POST.responseSchema })
        .parse(await converting.json()).data;
      const [draft] = await db
        .select()
        .from(paymentInvoices)
        .where(eq(paymentInvoices.id, invoiceId));
      expect(draft).toMatchObject({
        amount: "780.00",
        status: InvoiceStatus.DRAFT,
        metadata: { estimateId },
      });

      expect(
        (await postAtlas(fixtures, `payment/invoice/${invoiceId}/send`, {}))
          .ok,
      ).toBe(true);
      expect(
        (
          await postAtlas(
            fixtures,
            `payment/invoice/${invoiceId}/record-payment`,
            {
              amount: 300,
              method: ManualPaymentMethod.BANK_TRANSFER,
              accountNodeId: bank,
            },
          )
        ).ok,
      ).toBe(true);
      expect(
        (
          await postAtlas(fixtures, "payment/credit-note/create", {
            companyId,
            invoiceId,
            reason: "Print proofs dropped",
            lineItems: [{ ...print, taxRate: 20 }],
          })
        ).ok,
      ).toBe(true);
      const read = async (): Promise<
        ReturnType<typeof invoiceGet.GET.responseSchema.parse>
      > =>
        z
          .object({
            success: z.literal(true),
            data: invoiceGet.GET.responseSchema,
          })
          .parse(
            await (
              await getAtlasFixture(
                `${fixtures.baseUrl}/api/${locale}/payment/invoice/${invoiceId}/get`,
                {},
                headers,
              )
            ).json(),
          ).data;
      const settled = await read();
      expect(settled).toMatchObject({
        status: InvoiceStatus.OPEN,
        amountPaid: 300,
        amountDue: 420,
        sourceEstimate: { id: estimateId, number: quote.estimateNumber },
      });
      const notes = await db
        .select()
        .from(paymentInvoices)
        .where(
          and(
            eq(paymentInvoices.companyId, companyId),
            ne(paymentInvoices.id, invoiceId),
          ),
        );
      expect(notes).toHaveLength(1);
      expect(notes[0]).toMatchObject({
        amount: "-60.00",
        metadata: { originalInvoiceId: invoiceId },
      });
    },
    200000,
  );

  e2e.it(
    "trims, duplicates and declines quotes from the detail page",
    async (fixtures) => {
      const { page } = fixtures;
      const { companyId } = await prepareAtlasCompany(
        fixtures,
        "E2E Quote Actions",
      );
      fixtures.cleanup(async () => {
        await db
          .delete(paymentEstimates)
          .where(eq(paymentEstimates.companyId, companyId));
      });
      const create = async (): Promise<string> =>
        estimateCreated.parse(
          await (
            await postAtlas(fixtures, "payment/estimate/create", {
              companyId,
              currency: "EUR",
              customerName: "E2E Willow Books",
              lines: [
                {
                  description: "Shelf labels",
                  quantity: 10,
                  unitPrice: 4,
                  taxRate: 0.2,
                },
                {
                  description: "Window poster",
                  quantity: 1,
                  unitPrice: 90,
                  taxRate: 0.2,
                },
              ],
            })
          ).json(),
        ).data.estimate.id;
      const draftId = await create();
      const sentId = await create();
      expect(
        (await postAtlas(fixtures, `payment/estimate/${sentId}/send`, {}))
          .status,
      ).toBe(200);
      const locale = "en-US";
      const { t } = scopedTranslation.scopedT(locale);
      const { t: removeT } = removeTranslation.scopedT(locale);
      const { t: duplicateT } = duplicateTranslation.scopedT(locale);
      const { t: declineT } = declineTranslation.scopedT(locale);
      const { t: recordT } = recordTranslation.scopedT(locale);
      const tool = (id: string): string =>
        "/tools/payment-estimate-get?arg.estimateId=" + id;
      const post = (suffix: string): Promise<{ status: () => number }> =>
        page.waitForResponse(
          (reply) =>
            reply.request().method() === "POST" &&
            new URL(reply.url()).pathname.endsWith(suffix),
        );

      const removeName = t("widget.removeLineNamed", {
        description: "Window poster",
      });
      await fixtures.gotoReady(tool(draftId), () =>
        page.getByRole("button", { name: removeName }).first().waitFor(),
      );
      await page.getByRole("button", { name: removeName }).first().click();
      const dialog = page.getByRole("dialog");
      await dialog.getByText("Window poster", { exact: true }).waitFor();
      await dialog
        .getByText(formatMoney(108, "EUR", locale), { exact: true })
        .waitFor();
      const removed = post("/remove");
      await dialog
        .getByRole("button", { name: removeT("widget.submit"), exact: true })
        .click();
      expect((await removed).status()).toBe(200);
      const remaining = await db
        .select()
        .from(paymentEstimateLines)
        .where(eq(paymentEstimateLines.estimateId, draftId));
      expect(remaining.map((line) => line.description)).toEqual([
        "Shelf labels",
      ]);
      const [trimmed] = await db
        .select()
        .from(paymentEstimates)
        .where(eq(paymentEstimates.id, draftId));
      expect(trimmed.total).toBe(48);

      await page
        .getByRole("button", {
          name: recordT("widgets.recordState.moreActions"),
          exact: true,
        })
        .filter({ visible: true })
        .first()
        .click();
      await page
        .getByRole("menuitem", { name: t("widget.duplicate"), exact: true })
        .click();
      await dialog.getByText(trimmed.estimateNumber, { exact: true }).waitFor();
      const duplicated = post("/duplicate");
      await dialog
        .getByRole("button", { name: duplicateT("widget.submit"), exact: true })
        .click();
      expect((await duplicated).status()).toBe(200);
      const copies = await db
        .select()
        .from(paymentEstimates)
        .where(eq(paymentEstimates.companyId, companyId));
      const copy = copies.find(
        (row) => row.id !== draftId && row.id !== sentId,
      );
      expect(copy).toMatchObject({
        status: EstimateStatus.DRAFT,
        total: 48,
      });
      await dialog
        .getByRole("button", {
          name: duplicateT("widget.viewDuplicate"),
          exact: true,
        })
        .click();
      await page
        .getByRole("heading", {
          name: t("widget.estimateNumber") + " " + (copy?.estimateNumber ?? ""),
        })
        .waitFor();

      await fixtures.gotoReady(tool(sentId), () =>
        page
          .getByRole("button", { name: t("widget.accept"), exact: true })
          .waitFor(),
      );
      await page
        .getByRole("button", {
          name: recordT("widgets.recordState.moreActions"),
          exact: true,
        })
        .filter({ visible: true })
        .first()
        .click();
      await page
        .getByRole("menuitem", { name: t("widget.decline"), exact: true })
        .click();
      const declined = post(sentId + "/decline");
      await dialog
        .getByRole("button", { name: declineT("widget.submit"), exact: true })
        .click();
      expect((await declined).status()).toBe(200);
      const [afterDecline] = await db
        .select()
        .from(paymentEstimates)
        .where(eq(paymentEstimates.id, sentId));
      expect(afterDecline.status).toBe(EstimateStatus.DECLINED);
    },
    200000,
  );
});
