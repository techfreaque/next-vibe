import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";
import { z } from "zod";

import {
  accountNodes,
  accountingPeriods,
  journalEntries,
  journalEntryLines,
} from "@/chart-of-accounts/db";
import {
  AccountSubtype,
  AccountType,
  LineType,
} from "@/chart-of-accounts/enum";
import {
  getAtlasFixture,
  postAtlas,
  prepareAtlasCompany,
  saveAdminViewMatrix,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { pathToAliasMap } from "@/generated/endpoints/alias-map";
import { paymentInvoices } from "@/payment/db";
import invoiceGet from "@/payment/invoice/[invoiceId]/get/definition";
import invoiceCreate from "@/payment/invoice/create/definition";
import { scopedTranslation as draftCopy } from "@/payment/invoice/create/i18n";
import creditCreate from "./definition";

describe("Operator invoice credit", () => {
  const e2e = useE2E("payment/operator-credit");
  for (const [locale, item, reason, fullReason] of [
    ["en-US", "Catalogue page", "One page was returned", "The customer returned both catalogue pages"],
    ["de-DE", "Katalogseite", "Eine Seite wurde zurückgegeben", "Der Kunde hat beide Katalogseiten zurückgegeben"],
    ["sk-SK", "Strana katalógu", "Zákazník vrátil jednu stranu", "Zákazník vrátil obe strany katalógu"],
  ] as const) {
    e2e.it(
      "issues a partial credit and checks the receivable in " + locale,
      async (fixture) => {
        const { page } = fixture;
        const { companyId, headers } = await prepareAtlasCompany(
          fixture,
          "E2E Studio Lipa",
        );
        fixture.cleanup(async () => {
          await db
            .delete(paymentInvoices)
            .where(eq(paymentInvoices.companyId, companyId));
        });
        const ar = crypto.randomUUID(),
          revenue = crypto.randomUUID(),
          vat = crypto.randomUUID();
        await db.insert(accountNodes).values([
          {
            id: ar,
            companyId,
            name: "Debtors",
            code: "201",
            type: AccountType.ASSET,
            subtype: AccountSubtype.ACCOUNTS_RECEIVABLE,
          },
          {
            id: revenue,
            companyId,
            name: "Sales",
            code: "701",
            type: AccountType.REVENUE,
            subtype: AccountSubtype.REVENUE_SALES,
          },
          {
            id: vat,
            companyId,
            name: "VAT",
            code: "221",
            type: AccountType.LIABILITY,
            subtype: AccountSubtype.VAT_PAYABLE,
          },
        ]);
        await db.insert(accountingPeriods).values({
          companyId,
          name: "Credit fixture",
          startDate: new Date(Date.now() - 86400000),
          endDate: new Date(Date.now() + 86400000),
        });
        const line = {
          description: item,
          quantity: 2,
          unitPrice: 10,
          taxRate: 0.2,
        };
        const created = await postAtlas(fixture, "payment/invoice/create", {
          companyId,
          lineItems: [line],
        });
        const {
          data: { invoice },
        } = z
          .object({
            success: z.literal(true),
            data: invoiceCreate.POST.responseSchema,
          })
          .parse(await created.json());
        expect(
          (await postAtlas(fixture, `payment/invoice/${invoice.id}/send`, {}))
            .ok,
        ).toBe(true);
        const read = async (id = invoice.id) =>
          z
            .object({
              success: z.literal(true),
              data: invoiceGet.GET.responseSchema,
            })
            .parse(
              await (
                await getAtlasFixture(
                  `${fixture.baseUrl}/api/${locale}/payment/invoice/${id}/get`,
                  {},
                  headers,
                )
              ).json(),
            ).data;
        const sourceReadStatuses: number[] = [];
        const sourceReadPath = `/api/${locale}/payment/invoice/${invoice.id}/get`;
        page.on("response", (response) => {
          if (response.request().method() === "GET" &&
              new URL(response.url()).pathname === sourceReadPath) {
            sourceReadStatuses.push(response.status());
          }
        });
        const initial = await read();
        expect(initial).toMatchObject({
          amount: "24.00",
          remainingCredit: 24,
          amountDue: 24,
          canCreateCreditNote: true,
        });
        const t = creditCreate.POST.scopedTranslation.scopedT(locale).t;
        const ti = invoiceGet.GET.scopedTranslation.scopedT(locale).t;
        const originalReference = initial.invoiceNumber ?? "";
        expect(originalReference).not.toBe("");
        const originalLines = await db
          .select()
          .from(journalEntryLines)
          .where(
            eq(journalEntryLines.journalEntryId, initial.journalEntryId ?? ""),
          )
          .orderBy(journalEntryLines.sortOrder);
        await page.setViewportSize({ width: 390, height: 844 });
        await fixture.goto(
          `/tools/payment-invoice-get?arg.invoiceId=${invoice.id}`,
          locale,
        );
        await page.locator('#admin-tools-toolbar[data-admin-ready="true"]').waitFor();
        await page
          .getByRole("button", {
            name: ti("widget.createCreditNote"),
            exact: true,
          })
          .click();
        const dialog = page.getByRole("dialog").last();
        await dialog
          .getByRole("button", { name: t("post.widget.partial"), exact: true })
          .click();
        expect(
          await dialog
            .getByRole("button", { name: t("post.widget.issue"), exact: true })
            .count(),
        ).toBe(0);
        await dialog
          .getByRole("button", {
            name: item + " · " + formatMoney(24, "EUR", locale),
            exact: true,
          })
          .click();
        const qty = dialog.getByLabel(
          draftCopy.scopedT(locale).t("post.widget.quantity"),
          { exact: true },
        );
        await qty.fill("1");
        const reviewCredit = dialog.getByRole("button", {
          name: t("post.widget.reviewCredit"), exact: true,
        });
        const backToItems = dialog.getByRole("button", {
          name: t("post.widget.backToItems"), exact: true,
        });
        const reasonField = dialog.getByPlaceholder(t("reason.placeholder"));
        expect(await reasonField.count()).toBe(0);
        await reviewCredit.click();
        expect(await qty.count()).toBe(0);
        await reasonField.fill(reason);
        await backToItems.click();
        expect(await qty.inputValue()).toBe("1");
        expect(await reasonField.count()).toBe(0);
        await reviewCredit.click();
        expect(await reasonField.inputValue()).toBe(reason);
        const total = dialog.getByText(
          t("post.widget.creditTotal") + " · " + formatMoney(12, "EUR", locale),
          { exact: true },
        );
        await total.waitFor();
        const issue = dialog.getByRole("button", {
          name: t("post.widget.issue"),
          exact: true,
        });
        const formTitle = dialog.getByRole("heading", {
          name: t("post.title"), exact: true, level: 1,
        });
        const dismiss = dialog.locator("button.absolute").filter({ has: page.locator(".sr-only") });
        const checkEditorBounds = async (input: typeof qty, label: string): Promise<void> => {
          await input.blur();
          await input.focus();
          const source = dialog.getByText(
            t("post.widget.namedSource", { reference: originalReference }),
            { exact: true },
          );
          await source.waitFor();
          const inputs = await input.boundingBox();
          const labelBox = await dialog.getByText(label, { exact: true }).boundingBox();
          const scrollArea = await input
            .locator('xpath=ancestor::div[contains(@class, "overflow-y-auto")][1]')
            .boundingBox();
          const banner = await formTitle.boundingBox();
          const sourceBox = await source.boundingBox();
          const footer = await (await reviewCredit.isVisible() ? reviewCredit : issue).boundingBox();
          expect(inputs).not.toBeNull();
          expect(labelBox).not.toBeNull();
          expect(scrollArea).not.toBeNull();
          expect(banner).not.toBeNull();
          expect(sourceBox).not.toBeNull();
          expect(footer).not.toBeNull();
          if (inputs && labelBox && scrollArea && banner && sourceBox && footer) {
            expect(scrollArea.y).toBeGreaterThanOrEqual(sourceBox.y + sourceBox.height - 1);
            expect(scrollArea.y + scrollArea.height).toBeLessThanOrEqual(footer.y + 1);
            expect(labelBox.y).toBeGreaterThanOrEqual(scrollArea.y + 1);
            expect(labelBox.y + labelBox.height).toBeLessThanOrEqual(inputs.y + 1);
            expect(inputs.y).toBeGreaterThanOrEqual(scrollArea.y + 1);
            expect(inputs.y + inputs.height).toBeLessThanOrEqual(scrollArea.y + scrollArea.height - 1);
          }
          await dismiss.waitFor();
          expect(await dismiss.count()).toBe(1);
          await total.waitFor();
        };
        await saveAdminViewMatrix(
          page, "credit-note-operator", "partial-items-" + locale,
          async (): Promise<void> => {
            if (page.viewportSize()?.width === 390) {
              await reviewCredit.or(backToItems).waitFor();
              if (await backToItems.isVisible()) {
                await backToItems.click();
              }
              await reviewCredit.waitFor();
              expect(await issue.count()).toBe(0);
              expect(await reasonField.count()).toBe(0);
            }
            await dialog.getByRole("button", {
              name: draftCopy.scopedT(locale).t("post.widget.removeItem"), exact: true,
            }).waitFor();
            await checkEditorBounds(qty, draftCopy.scopedT(locale).t("post.widget.quantity"));
          },
        );
        await saveAdminViewMatrix(
          page, "credit-note-operator", "partial-" + locale,
          async (): Promise<void> => {
            if (page.viewportSize()?.width === 390) {
              await reviewCredit.or(backToItems).waitFor();
              if (await reviewCredit.isVisible()) {
                await reviewCredit.click();
              }
              await backToItems.waitFor();
              expect(await qty.count()).toBe(0);
            }
            await checkEditorBounds(reasonField, t("reason.label"));
          },
        );
        const [posted] = await Promise.all([
          page.waitForResponse(
            (response) =>
              response.request().method() === "POST" &&
              new URL(response.url()).pathname.endsWith(
                "/payment/credit-note/create",
              ),
          ),
          issue.click(),
        ]);
        const note = z
          .object({
            success: z.literal(true),
            data: creditCreate.POST.responseSchema,
          })
          .parse(await posted.json()).data.creditNote;
        expect(note).toMatchObject({
          invoiceId: invoice.id,
          companyId,
          currency: "EUR",
          amount: "-12.00",
          reason,
        });
        const noteReference = note.invoiceNumber ?? "";
        expect(noteReference).not.toBe("");
        const openNote = dialog.getByRole("button", {
          name: t("post.widget.openNamedNote", { reference: noteReference }), exact: true,
        });
        const issuedSource = dialog.getByRole("button", {
          name: t("post.widget.openNamedSource", { reference: originalReference }), exact: true,
        });
        await saveAdminViewMatrix(
          page,
          "credit-note-operator",
          "issued-" + locale,
          async () => {
            await dialog
              .getByText(t("post.widget.issued"), { exact: true })
              .waitFor();
            await dialog
              .getByText(formatMoney(-12, "EUR", locale), { exact: true })
              .waitFor();
            await openNote.waitFor();
            await issuedSource.waitFor();
            await page.locator("h1").filter({ hasText: originalReference }).waitFor({
              timeout: 12_000,
            }).catch((error) => {
              expect(sourceReadStatuses.filter((status) => status !== 200),
                "Failed source invoice browser HTTP statuses").toEqual([]);
              return Promise.reject(error);
            });
            await page.getByText(formatMoney(12, "EUR", locale), { exact: true }).filter({ visible: true }).first().waitFor();
            expect(sourceReadStatuses).toContain(200);
            expect(sourceReadStatuses.filter((status) => status !== 200)).toEqual([]);

          },
        );
        await openNote.click();
        await page.waitForURL((location) => location.searchParams.get("arg.invoiceId") === note.id);
        await page.getByRole("heading", { name: noteReference, exact: true }).waitFor();
        expect(await read(note.id)).toMatchObject({ id: note.id, invoiceNumber: noteReference, amount: "-12.00" });
        expect(await read()).toMatchObject({
          amount: "24.00",
          amountDue: 12,
          remainingCredit: 12,
        });
        const booked = await db
          .select({
            account: journalEntryLines.accountId,
            amount: journalEntryLines.amount,
            type: journalEntryLines.type,
          })
          .from(journalEntryLines)
          .innerJoin(
            journalEntries,
            eq(journalEntries.id, journalEntryLines.journalEntryId),
          )
          .where(eq(journalEntries.sourceId, note.id))
          .orderBy(journalEntryLines.sortOrder);
        expect(booked).toEqual([
          { account: ar, amount: 12, type: LineType.CREDIT },
          { account: revenue, amount: 10, type: LineType.DEBIT },
          { account: vat, amount: 2, type: LineType.DEBIT },
        ]);
        expect(
          await db
            .select()
            .from(journalEntryLines)
            .where(
              eq(
                journalEntryLines.journalEntryId,
                initial.journalEntryId ?? "",
              ),
            )
            .orderBy(journalEntryLines.sortOrder),
        ).toEqual(originalLines);
        expect(
          (
            await postAtlas(fixture, "payment/credit-note/create", {
              companyId,
              invoiceId: invoice.id,
              reason,
              lineItems: [],
            })
          ).ok,
        ).toBe(false);
        const second = z
          .object({
            success: z.literal(true),
            data: invoiceCreate.POST.responseSchema,
          })
          .parse(
            await (
              await postAtlas(fixture, "payment/invoice/create", {
                companyId,
                lineItems: [line],
              })
            ).json(),
          ).data.invoice;
        expect(
          (await postAtlas(fixture, `payment/invoice/${second.id}/send`, {}))
            .ok,
        ).toBe(true);
        const secondIssued = await read(second.id);
        const reference =
          secondIssued.invoiceNumber ??
          `INV-${secondIssued.invoiceSequenceNumber}`;
        await fixture.goto(
          `/tools/${pathToAliasMap["payment_credit-note_create_POST"]}?arg.companyId=${companyId}`,
          locale,
        );
        await page
          .getByRole("button", {
            name: t("post.widget.chooseInvoice"),
            exact: true,
          })
          .click();
        const picker = page.getByRole("dialog").last();
        expect(
          await picker
            .getByText(note.invoiceNumber ?? "CN-000002", { exact: true })
            .count(),
        ).toBe(0);
        let failRead = true;
        await page.route(
          `**/payment/invoice/${second.id}/get*`,
          async (route) => {
            if (failRead) {
              await route.abort("failed");
            } else {
              await route.continue();
            }
          },
        );
        await picker
          .getByRole("button")
          .filter({ has: page.getByText(reference, { exact: true }) })
          .filter({ visible: true })
          .click();
        const full = page.getByRole("button", {
          name: t("post.widget.full"),
          exact: true,
        });
        const retry = page.getByRole("button", {
          name: t("post.widget.retryRead"),
          exact: true,
        });
        await retry.waitFor();
        expect(
          await page
            .getByText(t("post.widget.unavailable"), { exact: true })
            .count(),
        ).toBe(0);
        failRead = false;
        await retry.click();
        await full.waitFor();
        expect(await full.isEnabled()).toBe(true);
        await full.click();
        await page.getByPlaceholder(t("reason.placeholder")).fill(fullReason);
        const fullIssue = page.getByRole("button", {
          name: t("post.widget.issue"),
          exact: true,
        });
        await saveAdminViewMatrix(
          page,
          "credit-note-operator",
          "full-" + locale,
          async () => {
            await fullIssue.scrollIntoViewIfNeeded();
            await page
              .getByText(
                t("post.widget.amountLabel", {
                  label: t("post.widget.creditTotal"),
                  amount: formatMoney(24, "EUR", locale),
                }),
                { exact: true },
              )
              .waitFor();
          },
        );
        const [fullResponse] = await Promise.all([
          page.waitForResponse(
            (r) =>
              r.request().method() === "POST" &&
              new URL(r.url()).pathname.endsWith("/payment/credit-note/create"),
          ),
          fullIssue.click(),
        ]);
        const fullNote = z
          .object({
            success: z.literal(true),
            data: creditCreate.POST.responseSchema,
          })
          .parse(await fullResponse.json()).data.creditNote;
        expect(fullNote).toMatchObject({
          invoiceId: second.id,
          amount: "-24.00",
          reason: fullReason,
          currency: "EUR",
          companyId,
        });
        expect(await read(second.id)).toMatchObject({
          remainingCredit: 0,
          amountDue: 0,
          canCreateCreditNote: false,
        });
        expect(await read()).toMatchObject({
          remainingCredit: 12,
          amountDue: 12,
        });
        await page
          .getByText(t("post.widget.issued"), { exact: true })
          .waitFor();
        await page.getByRole("button", {
          name: t("post.widget.openNamedSource", { reference }), exact: true,
        }).click();
        await page.waitForURL((location) => location.searchParams.get("arg.invoiceId") === second.id);
        await page.getByRole("heading", { name: reference, exact: true }).waitFor();
      },
      150000,
    );
  }
});
