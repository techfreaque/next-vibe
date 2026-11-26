import { randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";
import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { createEndpointLogger } from "next-vibe/logger/server";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import {
  type E2EFixtures,
  useE2E,
} from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";
import { z } from "zod";

import { purchasingVendors } from "@/purchasing/db";
import { accountNodes } from "@/chart-of-accounts/db";
import { AccountSubtype, AccountType } from "@/chart-of-accounts/enum";
import {
  getAtlasFixture,
  postAtlas,
  prepareAtlasCompany,
  saveWorkflowScreenshots,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import { bankStatementLines } from "../bank/db";
import type { BankFeedAdapter } from "./adapter";
import { bankFeedCheckpoints, bankFeedMappings } from "./db";
import definition from "./definition";
import { scopedTranslation as feedTranslation } from "./i18n";
import { encryptConsentValue } from "./enable-banking/consent/crypto";
import {
  enableBankingAttempts,
  enableBankingConsentAccounts,
  enableBankingConsents,
} from "./enable-banking/consent/db";
import { bankPrivacyReview } from "./privacy/db";
import privacy from "./privacy/definition";
import { scopedTranslation as privacyTranslation } from "./privacy/i18n";
import { BankPrivacyRepository } from "./privacy/repository";
import { listBankFeeds, syncBankFeed } from "./repository";

async function prepareBankFeedFixture(fixtures: E2EFixtures): Promise<{
  companyId: string;
  userId: string;
  headers: Record<string, string>;
  accountId: string;
  feedId: string;
  date: string;
  uid: string;
}> {
  const { companyId, userId, headers } = await prepareAtlasCompany(
    fixtures,
    "E2E synthetic bank feed",
  );
  const accountId = randomUUID(),
    attemptId = randomUUID(),
    consentId = randomUUID(),
    feedId = randomUUID();
  fixtures.cleanup(async () => {
    await db
      .delete(bankStatementLines)
      .where(eq(bankStatementLines.sourceFeed, feedId));
    await db
      .delete(enableBankingAttempts)
      .where(eq(enableBankingAttempts.id, attemptId));
  });
  const date = new Date().toISOString().slice(0, 10);
  const expiry = new Date(Date.now() + 86400000);
  const uid = randomUUID();
  await db
    .insert(purchasingVendors)
    .values({ companyId, name: "Synthetic Cloud" });
  await db.insert(accountNodes).values({
    id: accountId,
    companyId,
    name: "Fixture checking",
    code: "1100",
    subtype: AccountSubtype.BANK,
    type: AccountType.ASSET,
  });
  await db.insert(enableBankingAttempts).values({
    id: attemptId,
    nonceDigest: randomUUID(),
    actorId: userId,
    companyId,
    ledgerAccountId: accountId,
    bankName: "Fixture Bank",
    bankCountry: "DE",
    personal: true,
    callbackOrigin: "http://localhost:3000",
    requestedUntil: expiry,
    expiresAt: expiry,
  });
  await db.insert(enableBankingConsents).values({
    id: consentId,
    attemptId,
    actorId: userId,
    companyId,
    bankName: "Fixture Bank",
    bankCountry: "DE",
    sessionEncrypted: encryptConsentValue(randomUUID(), [
      "session",
      companyId,
      consentId,
    ]),
    consentUntil: expiry,
  });
  await db.insert(enableBankingConsentAccounts).values({
    id: feedId,
    consentId,
    ordinal: 1,
    currency: "EUR",
    identifiersEncrypted: encryptConsentValue(JSON.stringify({ uid }), [
      "account",
      companyId,
      consentId,
      feedId,
    ]),
  });
  return { companyId, userId, headers, accountId, feedId, date, uid };
}

describe("Owner-authorized bank feed", () => {
  const e2e = useE2E("finance/bank-feed");
  // The runtime keeps the tool unavailable when its provider configuration is absent.
  const browserMode = process.env["ERP_BANK_FEED_VISUALS"];
  if (browserMode === "fixture" || browserMode === "configured") {
    e2e.it(
      "opens the privacy prerequisite and previews a matched-only feed with fixture transport",
      async (fixtures) => {
        const { companyId, userId, headers, accountId, feedId, date, uid } =
          await prepareBankFeedFixture(fixtures);
        const logger = createEndpointLogger(false, E2E_LOCALE);
        const input = {
          companyId,
          accountId,
          feedId,
          startDay: date,
          matchedOnly: true,
          dryRun: true,
        };
        let calls = 0;
        const adapter: BankFeedAdapter = {
          readPage: async () => {
            calls++;
            return {
              success: true,
              data: {
                next: null,
                rows: [
                  {
                    bookedDate: date,
                    transactionId: uid,
                    amount: "-5.0000",
                    currency: "EUR",
                    counterparty: "Synthetic Cloud",
                  },
                ],
              },
            };
          },
        };
        expect(
          await syncBankFeed(
            userId,
            { ...input, setupOnly: true },
            logger,
            E2E_LOCALE,
            () => adapter,
          ),
        ).toMatchObject({ success: true });
        expect(calls).toBe(0);
        await fixtures.page.route(
          (url) =>
            url.pathname.endsWith("/finance/bank-connections") ||
            url.pathname.endsWith("/finance/bank-connections/privacy"),
          async (route) => {
            const request = route.request();
            const method = request.method();
            const url = new URL(request.url());
            if (
              method === "GET" &&
              url.pathname.endsWith("/finance/bank-connections")
            ) {
              expect(url.searchParams.get("companyId")).toBe(companyId);
              const result = await listBankFeeds(
                companyId,
                userId,
                false,
                logger,
                E2E_LOCALE,
              );
              await route.fulfill({
                status: result.success ? 200 : result.errorType.errorCode,
                json: result,
              });
            } else if (method === "PATCH") {
              const policy = privacy.PATCH.requestSchema.parse(
                request.postDataJSON(),
              );
              expect(policy.connectionId).toBe(feedId);
              const result = await BankPrivacyRepository.patch(
                policy,
                userId,
                E2E_LOCALE,
                logger,
              );
              await route.fulfill({
                status: result.success ? 200 : result.errorType.errorCode,
                json: result,
              });
            } else if (method === "POST") {
              const preview = definition.POST.requestSchema.parse(
                request.postDataJSON(),
              );
              expect(preview).toMatchObject({
                companyId,
                accountId,
                feedId,
                startDay: date,
                matchedOnly: true,
                dryRun: true,
              });
              const result = await syncBankFeed(
                userId,
                preview,
                logger,
                E2E_LOCALE,
                () => adapter,
              );
              await route.fulfill({
                status: result.success ? 200 : result.errorType.errorCode,
                json: result,
              });
            } else {
              await route.fallback();
            }
          },
        );
        if (browserMode === "fixture") {
          await fixtures.page.route(
            /\/api\/[^/]+\/vibe\/help-tool(?:\?|$)/,
            async (route) => {
              const url = new URL(route.request().url());
              const real = await getAtlasFixture(
                url.href,
                { "bank-preflight-browser": "1" },
                headers,
              );
              const catalog = z
                .looseObject({
                  success: z.literal(true),
                  data: z.looseObject({
                    adminCatalogDestinations: z
                      .record(
                        z.string(),
                        z.object({
                          category: z.string(),
                          subCategory: z.string().optional(),
                        }),
                      )
                      .optional(),
                  }),
                })
                .safeParse(await real.json());
              expect(catalog.success).toBe(true);
              if (!catalog.success) return route.abort();
              const category = {
                category: "finance",
                subCategory: "Bank reconciliation",
              };
              catalog.data.data.adminCatalogDestinations = {
                ...catalog.data.data.adminCatalogDestinations,
                "bank-connections": category,
                "bank-connection-sync": category,
                "bank-privacy-policy": category,
              };
              return route.fulfill({ status: real.status, json: catalog.data });
            },
          );
        }
        const { t } = feedTranslation.scopedT(E2E_LOCALE);
        const { t: policyT } = privacyTranslation.scopedT(E2E_LOCALE);
        const listPath = `/tools/bank-connections?arg.companyId=${companyId}`;
        const setupPrivacy = fixtures.page
          .getByRole("button", { name: t("privacyAction"), exact: true })
          .last();
        const openPreview = fixtures.page
          .getByRole("button", { name: t("previewAction"), exact: true })
          .last();
        if (browserMode === "fixture") {
          const toolbar = fixtures.page.locator(
            '#admin-tools-toolbar[data-admin-ready="true"]',
          );
          await fixtures.gotoReady(listPath, () => toolbar.waitFor());
          const refreshed = fixtures.page.waitForResponse(
            (response) =>
              response.ok() &&
              new URL(response.url()).searchParams.get("query") ===
                "bank-preflight-fixture-refresh",
          );
          await toolbar
            .locator("input")
            .first()
            .fill("bank-preflight-fixture-refresh");
          await refreshed;
          await fixtures.page.evaluate(() =>
            globalThis.dispatchEvent(new PopStateEvent("popstate")),
          );
          await setupPrivacy.waitFor();
        } else {
          await fixtures.gotoReady(listPath, () => setupPrivacy.waitFor());
        }
        expect(await openPreview.isVisible()).toBe(false);
        await saveWorkflowScreenshots(
          fixtures,
          "bank-preflight-privacy-needed",
        );
        await setupPrivacy.click();
        const save = fixtures.page
          .getByRole("button", { name: policyT("apply"), exact: true })
          .last();
        await save.waitFor();
        await save.click();
        await fixtures.page
          .getByRole("button", { name: policyT("saved"), exact: true })
          .last()
          .waitFor();
        expect(calls).toBe(0);
        await fixtures.page
          .getByRole("button", { name: policyT("saved"), exact: true })
          .last()
          .click();
        await openPreview.waitFor();
        await openPreview.click();
        const submit = fixtures.page
          .getByTestId("endpoint-submit")
          .and(
            fixtures.page.getByRole("button", {
              name: t("previewAction"),
              exact: true,
            }),
          )
          .filter({ visible: true });
        await submit.waitFor();
        // The generic recorder replays the request upstream. Keep this
        // provider request inside the browser's fixture transport.
        const previewResponse = fixtures.page.waitForResponse(
          (response) =>
            response.request().method() === "POST" &&
            new URL(response.url()).pathname.endsWith(
              "/finance/bank-connections",
            ),
        );
        await submit.click();
        const result = await previewResponse;
        expect(await result.json()).toMatchObject({
          success: true,
          data: {
            result: {
              preview: true,
              imported: 0,
              providerBookings: 1,
              eligibleBookings: 0,
              discardedCount: 1,
              bankAccountName: "Fixture checking",
              from: date,
              to: date,
            },
          },
        });
        expect(calls).toBe(1);
        expect(
          await db
            .select()
            .from(bankStatementLines)
            .where(eq(bankStatementLines.sourceFeed, feedId)),
        ).toEqual([]);
        const summary = fixtures.page.getByRole("heading", {
          name: t("previewResult"),
          exact: true,
        });
        await summary.waitFor();
        expect(
          await fixtures.page
            .getByText(t("savedBookings"), { exact: true })
            .locator("xpath=..")
            .innerText(),
        ).toMatch(/\b0$/);
        const pageTitle = fixtures.page.getByRole("heading", {
          name: t("sync"),
          exact: true,
        });
        for (const [device, width, height] of [
          ["desktop", 1440, 900],
          ["phone", 390, 844],
        ] as const) {
          await fixtures.page.setViewportSize({ width, height });
          await pageTitle.evaluate((heading) =>
            heading.scrollIntoView({ block: "center" }),
          );
          await fixtures.page.screenshot({
            path: `.tmp/erp-night/admin-v2-proof/bank-preflight-privacy-preview-${device}.png`,
          });
        }
      },
    );
  }
  e2e.it(
    "does not fetch transactions before the mapping and privacy choices are saved",
    async (fixtures) => {
      const { companyId, userId, accountId, feedId, date, uid } =
        await prepareBankFeedFixture(fixtures);
      const logger = createEndpointLogger(false, E2E_LOCALE);
      const common = {
        companyId,
        accountId,
        feedId,
        startDay: date,
        matchedOnly: true,
      };
      let calls = 0;
      const adapter: BankFeedAdapter = {
        readPage: async () => {
          calls++;
          return {
            success: true,
            data: {
              next: null,
              rows: [
                {
                  bookedDate: date,
                  transactionId: uid,
                  amount: "-5.0000",
                  currency: "EUR",
                  counterparty: "Synthetic Cloud",
                },
              ],
            },
          };
        },
      };
      const run = (dryRun: boolean, setupOnly?: boolean) =>
        syncBankFeed(
          userId,
          { ...common, dryRun, setupOnly },
          logger,
          E2E_LOCALE,
          () => adapter,
        );
      const discover = () =>
        listBankFeeds(companyId, userId, false, logger, E2E_LOCALE);
      expect(await discover()).toMatchObject({
        success: true,
        data: {
          feeds: [{ id: feedId, accountId: null, privacyConfigured: false }],
        },
      });
      expect((await run(true)).success).toBe(false);
      expect((await run(false)).success).toBe(false);
      expect(await run(true, true)).toMatchObject({
        success: true,
        data: { result: { setupFeedId: feedId, imported: 0 } },
      });
      expect(await discover()).toMatchObject({
        success: true,
        data: { feeds: [{ id: feedId, accountId, privacyConfigured: false }] },
      });
      expect((await run(true)).success).toBe(false);
      expect((await run(false)).success).toBe(false);
      expect(calls).toBe(0);
      expect(
        await db
          .select()
          .from(bankFeedCheckpoints)
          .where(eq(bankFeedCheckpoints.feedIdentifier, feedId)),
      ).toEqual([]);
      expect(
        await BankPrivacyRepository.patch(
          {
            connectionId: feedId,
            operation: "set",
            field: "counterparty",
            literal: "Synthetic Cloud",
            match: "equals",
            result: "business",
          },
          userId,
          E2E_LOCALE,
          logger,
        ),
      ).toMatchObject({ success: true });
      expect(await discover()).toMatchObject({
        success: true,
        data: { feeds: [{ id: feedId, accountId, privacyConfigured: true }] },
      });
      expect(await run(true)).toMatchObject({
        success: true,
        data: { result: { preview: true, imported: 1 } },
      });
      expect(calls).toBe(1);
      expect(
        await db
          .select()
          .from(bankStatementLines)
          .where(eq(bankStatementLines.sourceFeed, feedId)),
      ).toEqual([]);
    },
  );
  e2e.it(
    "discovers scoped session accounts and imports only explicit business matches without retaining other evidence",
    async (fixtures) => {
      const { companyId, userId, headers, accountId, feedId, date, uid } =
        await prepareBankFeedFixture(fixtures);
      const url =
        fixtures.baseUrl + "/api/" + E2E_LOCALE + "/finance/bank-connections";
      const listed = await getAtlasFixture(url, { companyId }, headers);
      expect(listed.status).toBe(200);
      const { data } = z
        .object({
          success: z.literal(true),
          data: definition.GET.responseSchema,
        })
        .parse(await listed.json());
      expect(data.feeds).toHaveLength(1);
      expect(data.feeds[0]?.id).toBe(feedId);
      expect(JSON.stringify(data).includes(uid)).toBe(false);
      const rawRows = [
        {
          bookedDate: date,
          transactionId: "t-1",
          amount: "-5.0000",
          currency: "EUR",
          counterparty: "Synthetic Cloud",
        },
        {
          bookedDate: date,
          transactionId: "t-2",
          amount: "-3.0000",
          currency: "EUR",
          counterparty: "Fixture household",
        },
      ];
      let providerRequests = 0;
      const adapter: BankFeedAdapter = {
        readPage: async () => {
          providerRequests++;
          return { success: true, data: { rows: rawRows, next: null } };
        },
      };
      const logger = createEndpointLogger(false, E2E_LOCALE);
      const common = {
        companyId,
        accountId,
        feedId,
        matchedOnly: true,
        startDay: date,
        dryRun: true,
      };
      const sync = (dryRun: boolean) =>
        syncBankFeed(
          userId,
          { ...common, dryRun },
          logger,
          E2E_LOCALE,
          (reference) => (reference === uid ? adapter : undefined),
        );
      expect((await sync(true)).success).toBe(false);
      expect(providerRequests).toBe(0);
      expect(
        await db
          .select()
          .from(bankFeedMappings)
          .where(eq(bankFeedMappings.consentAccountId, feedId)),
      ).toHaveLength(0);
      expect((await sync(false)).success).toBe(false);
      const setup = await postAtlas(fixtures, "finance/bank-connections", {
        ...common,
        setupOnly: true,
      });
      expect(setup.status).toBe(200);
      const bound = z
        .object({
          success: z.literal(true),
          data: definition.POST.responseSchema,
        })
        .parse(await setup.json());
      expect(bound.data.result.setupFeedId).toBe(feedId);
      expect(
        await db
          .select()
          .from(bankFeedCheckpoints)
          .where(eq(bankFeedCheckpoints.feedIdentifier, feedId)),
      ).toHaveLength(0);
      expect((await sync(true)).success).toBe(false);
      expect((await sync(false)).success).toBe(false);
      expect(providerRequests).toBe(0);
      const saved = await BankPrivacyRepository.patch(
        {
          connectionId: feedId,
          operation: "set",
          field: "counterparty",
          literal: "Synthetic Cloud",
          match: "equals",
          result: "business",
        },
        userId,
        E2E_LOCALE,
        logger,
      );
      expect(saved.success).toBe(true);
      expect(await sync(true)).toMatchObject({
        success: true,
        data: {
          result: {
            imported: 1,
            discardedCount: 1,
            suppliers: [
              {
                name: "Synthetic Cloud",
                amount: "-5.0000",
                currency: "EUR",
                count: 1,
              },
            ],
          },
        },
      });
      expect(providerRequests).toBe(1);
      expect(await sync(false)).toMatchObject({
        success: true,
        data: {
          result: {
            imported: 1,
            discardedCount: 1,
            suppliers: [
              {
                name: "Synthetic Cloud",
                amount: "-5.0000",
                currency: "EUR",
                count: 1,
              },
            ],
          },
        },
      });
      expect(await sync(false)).toMatchObject({
        success: true,
        data: { result: { imported: 0, skipped: 1, discardedCount: 1 } },
      });
      expect(
        await db
          .select({ through: bankFeedCheckpoints.through })
          .from(bankFeedCheckpoints)
          .where(eq(bankFeedCheckpoints.feedIdentifier, feedId)),
      ).toEqual([{ through: date }]);
      expect(
        await db
          .select({ name: bankStatementLines.counterparty })
          .from(bankStatementLines)
          .where(eq(bankStatementLines.sourceFeed, feedId)),
      ).toEqual([{ name: "Synthetic Cloud" }]);
      const [mapping] = await db
        .select()
        .from(bankFeedMappings)
        .where(eq(bankFeedMappings.consentAccountId, feedId));
      if (!mapping) return;
      expect(
        await db
          .select({
            state: bankPrivacyReview.state,
            evidence: bankPrivacyReview.evidenceEncrypted,
          })
          .from(bankPrivacyReview)
          .where(eq(bankPrivacyReview.mappingId, mapping.id)),
      ).toEqual([{ state: "business", evidence: null }]);
      const supplierId = randomUUID();
      const otherSupplierId = randomUUID();
      const inactiveSupplierId = randomUUID();
      const foreignSupplierId = randomUUID();
      const foreign = await prepareAtlasCompany(
        fixtures,
        "E2E unlinked supplier company",
      );
      await db.insert(purchasingVendors).values([
        { id: supplierId, companyId, name: "Fixture Hosting Co." },
        { id: otherSupplierId, companyId, name: "Fixture Service LLC" },
        {
          id: inactiveSupplierId,
          companyId,
          name: "Fixture inactive",
          isActive: false,
        },
        {
          id: foreignSupplierId,
          companyId: foreign.companyId,
          name: "Fixture foreign",
        },
      ]);
      const rules = [
        {
          field: "counterparty",
          match: "equals",
          literal: "Processor alias",
          result: "business",
          supplierId,
        },
        {
          field: "description",
          match: "startsWith",
          literal: "Hosting invoice",
          result: "business",
          supplierId,
        },
        {
          field: "description",
          match: "contains",
          literal: "SUPPLIER TWO",
          result: "business",
          supplierId: otherSupplierId,
        },
        {
          field: "description",
          match: "startsWith",
          literal: "Private fixture",
          result: "private",
        },
      ] as const;
      for (const rule of rules) {
        const saved = await BankPrivacyRepository.patch(
          { connectionId: feedId, operation: "set", ...rule },
          userId,
          E2E_LOCALE,
          logger,
        );
        expect(saved.success).toBe(true);
      }
      for (const deniedSupplierId of [inactiveSupplierId, foreignSupplierId]) {
        const denied = await BankPrivacyRepository.patch(
          {
            connectionId: feedId,
            operation: "set",
            ...rules[0],
            supplierId: deniedSupplierId,
          },
          userId,
          E2E_LOCALE,
          logger,
        );
        expect(denied.success).toBe(false);
      }
      const { t } = privacyTranslation.scopedT(E2E_LOCALE);
      await fixtures.open(privacy.PATCH, {
        query: {
          connectionId: feedId,
          companyId,
          operation: "set",
          field: "description",
          match: "startsWith",
          literal: "Fixture contract",
          result: "business",
        },
        ready: () =>
          fixtures.page
            .getByRole("button", { name: t("chooseSupplier"), exact: true })
            .waitFor(),
      });
      await fixtures.page
        .getByRole("button", { name: t("chooseSupplier"), exact: true })
        .click();
      expect(
        await fixtures.page
          .getByText("Fixture foreign", { exact: true })
          .count(),
      ).toBe(0);
      await fixtures.page
        .getByText("Fixture Hosting Co.", { exact: true })
        .click();
      await fixtures.page
        .getByRole("button", { name: "Fixture Hosting Co.", exact: true })
        .waitFor();
      await mkdir(".tmp/erp-night/admin-v2-proof", { recursive: true });
      await fixtures.page.screenshot({
        path: ".tmp/erp-night/admin-v2-proof/bank-rule-supplier-desktop.png",
        fullPage: true,
      });
      const savedRule = await fixtures.capture(privacy.PATCH, () =>
        fixtures.page
          .getByRole("button", { name: t("apply"), exact: true })
          .click(),
      );
      expect(savedRule.response).toMatchObject({
        success: true,
        data: { saved: true },
      });
      const savedPolicy = await BankPrivacyRepository.get(
        { connectionId: feedId },
        userId,
        E2E_LOCALE,
        logger,
      );
      expect(savedPolicy).toMatchObject({
        success: true,
        data: {
          rules: expect.arrayContaining([
            expect.objectContaining({
              literal: "Fixture contract",
              supplierId,
            }),
          ]),
        },
      });

      const attributionAdapter: BankFeedAdapter = {
        readPage: async () => ({
          success: true,
          data: {
            rows: [
              {
                bookedDate: date,
                transactionId: "alias",
                amount: "-5.0000",
                currency: "EUR",
                counterparty: "Processor alias",
              },
              {
                bookedDate: date,
                transactionId: "description",
                amount: "-3.2501",
                currency: "EUR",
                description: "Hosting invoice 45",
              },
              {
                bookedDate: date,
                transactionId: "conflict",
                amount: "-2.0000",
                currency: "EUR",
                counterparty: "Processor alias",
                description: "SUPPLIER TWO",
              },
              {
                bookedDate: date,
                transactionId: "private",
                amount: "-90.0000",
                currency: "EUR",
                counterparty: "Processor alias",
                description: "Private fixture narrative",
              },
              {
                bookedDate: date,
                transactionId: "unknown",
                amount: "-19.0000",
                currency: "EUR",
                description: "Unknown fixture narrative",
              },
            ],
            next: null,
          },
        }),
      };
      const attributed = await syncBankFeed(
        userId,
        { ...common, dryRun: false },
        logger,
        E2E_LOCALE,
        (reference) => (reference === uid ? attributionAdapter : undefined),
      );
      expect(attributed).toMatchObject({
        success: true,
        data: {
          result: {
            imported: 3,
            discardedCount: 2,
            suppliers: [
              {
                name: "Fixture Hosting Co.",
                amount: "-8.2501",
                currency: "EUR",
                count: 2,
              },
            ],
          },
        },
      });
      expect(JSON.stringify(attributed)).not.toMatch(
        /Private fixture|Unknown fixture|Processor alias|SUPPLIER TWO/,
      );
      const afterAttribution = await db
        .select({
          state: bankPrivacyReview.state,
          evidence: bankPrivacyReview.evidenceEncrypted,
        })
        .from(bankPrivacyReview)
        .where(eq(bankPrivacyReview.mappingId, mapping.id));
      expect(afterAttribution).toHaveLength(4);
      expect(
        afterAttribution.every(
          ({ state, evidence }) => state === "business" && evidence === null,
        ),
      ).toBe(true);
    },
  );
});
