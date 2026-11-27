import { generateKeyPairSync, randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";

import { and, eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { createEndpointLogger } from "next-vibe/logger/server";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";
import { z } from "zod";

import {
  accountingPeriods,
  accountNodes,
  journalEntries,
  journalEntryLines,
} from "@/chart-of-accounts/db";
import {
  AccountSubtype,
  AccountType,
  JournalEntryStatus,
  JournalSourceType,
  LineType,
} from "@/chart-of-accounts/enum";
import { prepareAtlasCompany } from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { companyMembers } from "@/companies/db";
import { CompanyMemberRole } from "@/companies/enum";
import { workspaceCompanyCookieName } from "@/companies/_shared/workspace-company";
import { paymentBills } from "@/payment/db";
import { BillStatus } from "@/payment/enum";
import { purchasingVendors } from "@/purchasing/db";

import { bankStatementLines } from "../bank/db";
import feeds from "./definition";
import { bankFeedCheckpoints, bankFeedMappings } from "./db";
import { createEnableBankingAdapter } from "./enable-banking/adapter";
import { redirectBankConsent } from "./enable-banking/callback/repository";
import connect from "./enable-banking/connect/definition";
import { connectEnableBanking } from "./enable-banking/connect/repository";
import type { ConsentTransport } from "./enable-banking/consent/client";
import { enableBankingAttempts } from "./enable-banking/consent/db";
import { scopedTranslation } from "./enable-banking/consent/i18n";
import { enableBankingCallbackPath } from "./enable-banking/consent/repository";
import { BankPrivacyRepository } from "./privacy/repository";
import { bankPrivacyReview } from "./privacy/db";
import { listBankFeeds, syncBankFeed } from "./repository";

describe("Bank connection wizard", () => {
  const suite = useE2E("finance/bank-connect-wizard");
  for (const [device, width, height] of [
    ["desktop", 1440, 900],
    ["phone", 390, 844],
  ] as const) {
    suite.it(
      `authorizes Revolut on ${device}, saves only the supplier match and opens its ledger entry`,
      async (f) => {
        const { page, baseUrl } = f;
        const locale = "en-US";
        const origin = "http://localhost:3000";
        expect(new URL(baseUrl).origin).toBe(origin);
        const { companyId, userId } = await prepareAtlasCompany(
          f,
          "unbottled.ai (test)",
        );
        const accountId = randomUUID(),
          vendorId = randomUUID(),
          paymentId = randomUUID(),
          journalId = randomUUID(),
          periodId = randomUUID(),
          payableId = randomUUID(),
          uid = randomUUID();
        const today = new Date().toISOString().slice(0, 10);
        const supplier = "Example Hosting";
        const logger = createEndpointLogger(false, locale);
        const t = scopedTranslation.scopedT(locale).t;
        f.cleanup(async () => {
          await db
            .delete(bankStatementLines)
            .where(eq(bankStatementLines.companyId, companyId));
          await db
            .delete(enableBankingAttempts)
            .where(eq(enableBankingAttempts.companyId, companyId));
          await db
            .delete(paymentBills)
            .where(eq(paymentBills.companyId, companyId));
        });
        await db.insert(accountNodes).values([
          {
            id: accountId,
            companyId,
            code: "1210",
            name: "Bank Revolut",
            type: AccountType.ASSET,
            subtype: AccountSubtype.BANK,
          },
          {
            id: payableId,
            companyId,
            code: "2200",
            name: "Payables",
            type: AccountType.LIABILITY,
            subtype: AccountSubtype.ACCOUNTS_PAYABLE,
          },
        ]);
        await db
          .insert(purchasingVendors)
          .values({ id: vendorId, companyId, name: supplier });
        await db.insert(accountingPeriods).values({
          id: periodId,
          companyId,
          name: "Test period",
          startDate: new Date(today),
          endDate: new Date(today),
        });
        await db.insert(paymentBills).values({
          id: paymentId,
          companyId,
          supplierName: supplier,
          billDate: new Date(today),
          currency: "EUR",
          status: BillStatus.PAID,
          total: 32,
          subtotal: 32,
          metadata: { vendorId },
        });
        await db.insert(journalEntries).values({
          id: journalId,
          companyId,
          periodId,
          entryNumber: "PAY-1210",
          date: new Date(today),
          description: "Hosting bill",
          status: JournalEntryStatus.POSTED,
          sourceType: JournalSourceType.AP_PAYMENT,
          sourceId: paymentId,
        });
        await db.insert(journalEntryLines).values([
          {
            journalEntryId: journalId,
            accountId,
            type: LineType.CREDIT,
            amount: 32,
            currency: "EUR",
          },
          {
            journalEntryId: journalId,
            accountId: payableId,
            type: LineType.DEBIT,
            amount: 32,
            currency: "EUR",
          },
        ]);

        let callback = "",
          expiry = "",
          transactionReads = 0;
        const key = generateKeyPairSync("rsa", { modulusLength: 2048 })
          .privateKey.export({ type: "pkcs8", format: "pem" })
          .toString();
        const server = Bun.serve({
          hostname: "127.0.0.1",
          port: 0,
          async fetch(req) {
            const url = new URL(req.url);
            switch (url.pathname) {
              case "/application":
                return Response.json({
                  active: true,
                  services: ["AIS"],
                  countries: ["DE", "LT"],
                });
              case "/aspsps":
                return Response.json({
                  aspsps: ["C24", "Revolut"].map((name) => ({
                    name,
                    country: "DE",
                    maximum_consent_validity: 86400,
                    psu_types: ["personal"],
                  })),
                });
              case "/auth": {
                const data = z
                  .object({
                    state: z.string(),
                    redirect_url: z.string(),
                    access: z.object({ valid_until: z.string() }),
                  })
                  .parse(await req.json());
                expect(data.redirect_url).toBe(
                  origin + enableBankingCallbackPath,
                );
                const target = new URL(data.redirect_url);
                target.searchParams.set("state", data.state);
                target.searchParams.set("code", "authorized-fixture");
                callback = target.href;
                expiry = data.access.valid_until;
                return Response.json({
                  url: "https://auth.enablebanking.com/ais/test-consent",
                });
              }
              case "/sessions":
                return Response.json({
                  session_id: randomUUID(),
                  aspsp: { name: "Revolut", country: "DE" },
                  psu_type: "personal",
                  access: { valid_until: expiry },
                  accounts: [{ uid, currency: "EUR" }],
                });
              case `/accounts/${uid}/transactions`: {
                transactionReads++;
                return Response.json({
                  transactions: [
                    supplier,
                    "Private groceries",
                    "Unrecognized shop",
                  ].map((name, i) => ({
                    entry_reference: `fixture-${i}`,
                    booking_date: today,
                    status: "BOOK",
                    transaction_amount: {
                      currency: "EUR",
                      amount: i === 0 ? "32.00" : "7.00",
                    },
                    credit_debit_indicator: "DBIT",
                    creditor: { name },
                    remittance_information: [
                      i === 0 ? "Hosting bill" : "private test narrative",
                    ],
                  })),
                });
              }
              default:
                return new Response(null, { status: 404 });
            }
          },
        });
        f.cleanup(async () => {
          await server.stop(true);
        });
        const upstream: ConsentTransport = (path, init) => {
          // oxlint-disable-next-line restricted/no-raw-fetch -- test-owned loopback bank server
          return fetch(new URL(path, server.url), init);
        };
        await f.context.addCookies([
          {
            url: baseUrl,
            name: workspaceCompanyCookieName(userId),
            value: companyId,
          },
        ]);
        await page.emulateMedia({ colorScheme: "dark" });
        await page.setViewportSize({ width, height });
        await page.addInitScript(() =>
          localStorage.setItem("theme_v2", "dark"),
        );
        await page.route("https://auth.enablebanking.com/**", (route) =>
          route.fulfill({
            contentType: "text/html",
            body:
              '<!doctype html><html lang="en" style="color-scheme:dark;font:18px system-ui"><title>Test bank consent</title><main style="max-width:32rem;margin:12vh auto;padding:1.5rem"><p>Enable Banking test fixture</p><h1>Revolut Personal</h1><p>Allow read-only access to the EUR account?</p><a href="' +
              callback.replaceAll("&", "&amp;") +
              '">Approve read access</a></main></html>',
          }),
        );
        await page.route(
          (url) => url.pathname === enableBankingCallbackPath,
          async (route) => {
            const response = await redirectBankConsent(
              new Request(route.request().url()),
              origin,
              upstream,
            );
            await route.fulfill({
              status: response.status,
              headers: Object.fromEntries(response.headers),
            });
          },
        );
        await page.route(
          (url) => url.pathname.endsWith("/enable-banking/connect"),
          async (route) => {
            const input = connect.POST.requestSchema.parse(
              route.request().postDataJSON(),
            );
            expect(input).toMatchObject({
              companyId,
              ledgerAccountId: accountId,
              bankName: "Revolut",
              bankCountry: "DE",
              personal: true,
            });
            const res = await connectEnableBanking(
              input,
              userId,
              logger,
              locale,
              t,
              upstream,
              origin,
            );
            await route.fulfill({
              status: res.success ? 200 : res.errorType.errorCode,
              json: res,
            });
          },
        );
        await page.route(
          (url) => url.pathname.endsWith("/finance/bank-connections"),
          async (route) => {
            const request = route.request();
            const params = new URL(request.url()).searchParams;
            if (request.method() === "GET") {
              const input = feeds.GET.requestSchema.parse({
                companyId: params.get("companyId"),
                directoryCountry: params.get("directoryCountry") ?? undefined,
                directoryPersonal: params.has("directoryPersonal")
                  ? params.get("directoryPersonal") === "true"
                  : undefined,
              });
              expect(input.companyId).toBe(companyId);
              const res = await listBankFeeds(
                input.companyId,
                userId,
                false,
                logger,
                locale,
                input.directoryCountry,
                input.directoryPersonal,
                () => upstream,
              );
              return route.fulfill({
                status: res.success ? 200 : res.errorType.errorCode,
                json: res,
              });
            }
            const input = feeds.POST.requestSchema.parse(
              request.postDataJSON(),
            );
            expect(input.companyId).toBe(companyId);
            expect(input.matchedOnly).toBe(true);
            const res = await syncBankFeed(
              userId,
              input,
              logger,
              locale,
              (reference) =>
                createEnableBankingAdapter(
                  "test-app",
                  key,
                  reference,
                  (url, init) => upstream(url.pathname + url.search, init),
                ),
            );
            expect(res.success).toBe(true);
            if (res.success && !input.setupOnly) {
              expect(res.data.result).toMatchObject({
                discardedCount: 2,
                eligibleBookings: 1,
                held: 0,
                autoMatched: input.dryRun ? 0 : 1,
              });
              expect(JSON.stringify(res)).not.toContain(
                "private test narrative",
              );
            }
            return route.fulfill({
              status: res.success ? 200 : res.errorType.errorCode,
              json: res,
            });
          },
        );
        const shot = async (name: string): Promise<void> => {
          if (process.env["ERP_BANK_CONNECT_SHOTS"] !== "1") return;
          const dir = "scratchpad/codex/bank-connect/after";
          await mkdir(dir, { recursive: true });
          if (name === "16-statement") {
            const visibleRow = page
              .getByText(supplier, { exact: true })
              .filter({ visible: true })
              .last();
            await visibleRow.scrollIntoViewIfNeeded();
          }
          await page
            .getByRole("listbox")
            .filter({ visible: true })
            .waitFor({ state: "hidden" });
          await page.screenshot({
            animations: "disabled",
            path: `${dir}/${name}-${device}.png`,
          });
        };
        const button = (name: string) =>
          page
            .getByRole("button", { name, exact: true })
            .filter({ visible: true })
            .last();
        await f.gotoReady("/tools", () =>
          page
            .locator('#admin-tools-toolbar[data-admin-ready="true"]')
            .waitFor(),
        );
        await page
          .getByRole("heading", { name: "Favorites", exact: true })
          .waitFor();
        const sidebar = page
          .locator("#platform-admin-navigation")
          .filter({ visible: true });
        if (!(await sidebar.isVisible())) {
          await button("Open tool sidebar").click();
        }
        const financeCategory = sidebar.getByRole("button", {
          name: "Finance",
          exact: true,
        });
        await financeCategory.scrollIntoViewIfNeeded();
        await shot("01-admin");
        await financeCategory.click();
        const entry = page
          .getByText("Connected bank accounts", { exact: true })
          .filter({ visible: true })
          .first();
        await entry.waitFor();
        await page
          .getByText("Loading the company overview", { exact: false })
          .filter({ visible: true })
          .waitFor({ state: "hidden" });
        await entry.scrollIntoViewIfNeeded();
        await shot("02-finance");
        await entry.click();
        await button("Connect bank").waitFor();
        await shot("03-connections");
        await button("Connect bank").click();
        await page
          .getByRole("combobox", { name: "Bank country", exact: true })
          .click();
        await page
          .getByRole("option", { name: "Germany", exact: true })
          .click();
        await page.getByLabel("Search for your bank").fill("C24 Bank");
        await button("C24").click();
        await shot("04-c24");
        await button("Choose ledger account").click();
        await button("Create a bank ledger account").click();
        await page.locator('[data-field="code"] input').last().fill("1220");
        await page.locator('[data-field="name"] input').last().fill("Bank C24");
        await shot("04b-create-ledger");
        await button("Create account").click();
        await page
          .getByRole("combobox", { name: "Ledger bank account" })
          .click();
        await page.getByRole("option", { name: "1220 · Bank C24" }).click();
        await shot("04c-created-ledger");
        await button("Back to bank").click();
        await page.getByLabel("Search for your bank").fill("Revolut");
        await button("Revolut").click();
        await shot("05-revolut");
        await button("Choose ledger account").click();
        await page
          .getByRole("combobox", { name: "Ledger bank account" })
          .click();
        await page.getByRole("option", { name: "1210 · Bank Revolut" }).click();
        await shot("06-ledger");
        await button("Start bank authorization").click();
        const bankLink = page.getByRole("link", {
          name: "Continue to your bank",
          exact: true,
        });
        await bankLink.waitFor();
        await shot("07-authorize");
        await bankLink.click();
        const approve = page.getByRole("link", { name: "Approve read access" });
        await approve.waitFor();
        await shot("08-test-bank");
        await approve.click();
        await button("Set up bank feed").waitFor();
        await shot("09-accounts");
        await button("Set up bank feed").click();
        await page
          .getByText("1210 · Bank Revolut", { exact: true })
          .last()
          .waitFor();
        await shot("10-mapping");
        await button("Set up bank feed").click();
        await button("Set privacy choices").click();
        await button("Apply").waitFor();
        await shot("11-privacy");
        await button("Apply").click();
        await button("Rules").click();
        await button("Add as a business rule").waitFor();
        await shot("12-suggestions");
        await button("Add as a business rule").click();
        await page
          .getByText(/Counterparty.*Example Hosting.*Business/)
          .waitFor();
        await button("Add or edit a rule").click();
        await page
          .locator('[data-field="literal"] input')
          .last()
          .fill("Private groceries");
        await page
          .locator('[data-field="result"]')
          .getByRole("combobox")
          .click();
        await page
          .getByRole("option", { name: "Private", exact: true })
          .click();
        await shot("12b-private-rule");
        await button("Apply").click();
        await page
          .getByText(/Counterparty.*Private groceries.*Private/)
          .waitFor();
        expect(transactionReads).toBe(0);
        await shot("13-rules");
        await button("Preview import").click();
        await page
          .getByTestId("endpoint-submit")
          .filter({ visible: true })
          .last()
          .click();
        await page.getByText("Preview result", { exact: true }).waitFor();
        expect(
          await db
            .select()
            .from(bankStatementLines)
            .where(eq(bankStatementLines.companyId, companyId)),
        ).toHaveLength(0);
        expect(
          await db
            .select()
            .from(bankFeedCheckpoints)
            .where(eq(bankFeedCheckpoints.companyId, companyId)),
        ).toHaveLength(0);
        await button("Apply import").scrollIntoViewIfNeeded();
        await shot("14-dry-run");
        await button("Apply import").click();
        await button("View imported transactions").waitFor();
        await button("View imported transactions").scrollIntoViewIfNeeded();
        await shot("15-import");
        await button("View imported transactions").click();
        const [line] = await db
          .select()
          .from(bankStatementLines)
          .where(eq(bankStatementLines.companyId, companyId));
        expect(line?.counterparty).toBe(supplier);
        expect(line?.matchedAt).toBeTruthy();
        const [mapping] = await db
          .select()
          .from(bankFeedMappings)
          .where(eq(bankFeedMappings.companyId, companyId));
        expect(mapping).toBeDefined();
        if (mapping)
          expect(
            await db
              .select({
                state: bankPrivacyReview.state,
                evidence: bankPrivacyReview.evidenceEncrypted,
              })
              .from(bankPrivacyReview)
              .where(eq(bankPrivacyReview.mappingId, mapping.id)),
          ).toEqual([{ state: "business", evidence: null }]);
        await page
          .getByRole("heading", { name: "Bank transactions", exact: true })
          .last()
          .waitFor();
        await page
          .getByText(supplier, { exact: true })
          .filter({ visible: true })
          .last()
          .waitFor();
        await shot("16-statement");
        if (mapping) {
          const rules = await BankPrivacyRepository.get(
            { connectionId: mapping.consentAccountId },
            userId,
            locale,
            logger,
          );
          expect(rules.success && rules.data.rules).toContainEqual({
            field: "counterparty",
            match: "equals",
            literal: supplier,
            result: "business",
            supplierId: vendorId,
          });
          await db
            .update(companyMembers)
            .set({ role: CompanyMemberRole.VIEWER })
            .where(
              and(
                eq(companyMembers.companyId, companyId),
                eq(companyMembers.userId, userId),
              ),
            );
          const denied = await BankPrivacyRepository.post(
            {
              connectionId: mapping.consentAccountId,
              identity: "0".repeat(64),
              disposition: "private",
              always: false,
            },
            userId,
            locale,
            logger,
          );
          expect(!denied.success && denied.errorType.errorCode).toBe(403);
        }
      },
      240_000,
    );
  }
});
