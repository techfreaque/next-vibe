import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";
import { get } from "node:http";
import { and, eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { UserRole } from "next-vibe/identity/roles/enum";
import { userRoles } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { createTestUser, deleteTestUser } from "next-vibe/tooling/testing/testing-suite/test-users";
import { describe, expect } from "vitest";
import { z } from "zod";

import { accountNodes } from "@/chart-of-accounts/db";
import { AccountSubtype, AccountType } from "@/chart-of-accounts/enum";
import { companies, companyMembers } from "@/companies/db";
import { CompanyMemberRole, CompanyType } from "@/companies/enum";

import { bankStatementLines } from "../../bank/db";
import { bankFeedMappings } from "../db";
import { enableBankingAttempts, enableBankingConsentAccounts, enableBankingConsents } from "../enable-banking/consent/db";
import { bankPrivacyReview } from "./db";
import endpoint from "./definition";
import { scopedTranslation } from "./i18n";
import { BankPrivacyRepository, purgeBankPrivacyEvidence, screenBankRows } from "./repository";

const logger = createEndpointLogger(false, E2E_LOCALE);
const { t } = scopedTranslation.scopedT(E2E_LOCALE);

function getCatalogFixture(
  url: URL,
  cookie: string,
): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const request = get(url, { headers: { cookie } }, (response) => {
      const parts: Buffer[] = [];
      response.on("data", (part: Buffer) => parts.push(part));
      response.on("end", () => {
        resolve({ status: response.statusCode ?? 500, body: Buffer.concat(parts).toString("utf8") });
      });
      response.on("error", reject);
    });
    request.on("error", reject);
  });
}

describe("E2E: mixed bank activity", () => {
  const e2e = useE2E("bank-privacy");

  e2e.it("keeps unmatched details out of matched-only sync and purges private evidence", async ({
    cleanup, gotoReady, page, loginAs, capture, uniqueEmail,
  }) => {
    const owner = await resolveTestAdminUser();
    const outsider = await createTestUser(uniqueEmail("privacy-outsider"));
    expect(outsider.success).toBe(true);
    if (!outsider.success) {
      return;
    }
    const outsiderId = outsider.data.user.id;
    cleanup(async () => { await deleteTestUser(outsiderId); });
    await db.insert(userRoles).values({ userId: outsiderId, role: UserRole.ADMIN });
    const actorId = owner.id;
    const companyId = randomUUID();
    const accountId = randomUUID();
    const connectionId = randomUUID();
    const attemptId = randomUUID();
    const consentId = randomUUID();
    const mappingId = randomUUID();
    const consentUntil = new Date(Date.now() + 86_400_000);
    const bankName = "Fixture bank privacy";
    cleanup(async () => {
      await db.delete(bankStatementLines).where(eq(bankStatementLines.sourceFeed, connectionId));
      await db.delete(enableBankingAttempts).where(eq(enableBankingAttempts.id, attemptId));
      await db.delete(accountNodes).where(eq(accountNodes.id, accountId));
      await db.delete(companies).where(eq(companies.id, companyId));
    });
    await db.insert(companies).values({
      id: companyId, name: "Fixture privacy company", type: CompanyType.B2B, ownerUserId: actorId,
    });
    await db.insert(companyMembers).values([
      { companyId, userId: actorId, role: CompanyMemberRole.OWNER },
      { companyId, userId: outsiderId, role: CompanyMemberRole.ADMIN },
    ]);
    await db.insert(accountNodes).values({
      id: accountId, companyId, name: "Fixture mixed bank", code: "1100",
      type: AccountType.ASSET, subtype: AccountSubtype.BANK,
    });
    await db.insert(enableBankingAttempts).values({
      id: attemptId, nonceDigest: randomUUID(), actorId, companyId,
      ledgerAccountId: accountId, bankName, bankCountry: "DE", personal: true,
      callbackOrigin: "https://fixture.invalid", requestedUntil: consentUntil,
      expiresAt: consentUntil,
    });
    await db.insert(enableBankingConsents).values({
      id: consentId, attemptId, actorId, companyId, bankName, bankCountry: "DE",
      sessionEncrypted: "synthetic-no-session", consentUntil,
    });
    await db.insert(enableBankingConsentAccounts).values({
      id: connectionId, consentId, ordinal: 0, currency: "EUR",
      identifiersEncrypted: "synthetic-no-identifiers",
    });
    const privateRow = {
      transactionId: "fixture-one", bookedDate: "2026-01-17", amount: "-11.0000", currency: "EUR",
      counterparty: "Synthetic home expense", counterpartyIban: "DE00123456780000000000",
      description: "Synthetic private text",
    };
    const businessRow = {
      transactionId: "fixture-two", bookedDate: "2026-01-18", amount: "-23.0000", currency: "EUR",
      counterparty: "Synthetic supplier", description: "Synthetic business expense",
    };
    const scope = { companyId, accountId, connectionId, actorId };
    const preview = await screenBankRows({ ...scope, rows: [privateRow], dryRun: true }, logger, E2E_LOCALE);
    expect(preview).toMatchObject({ success: true, data: { held: 1, business: [] } });
    await db.insert(bankFeedMappings).values({
      id: mappingId, companyId, accountId, actorId, consentAccountId: connectionId, startDay: "2026-01-01",
    });
    const screened = await screenBankRows({
      ...scope, rows: [privateRow, businessRow], dryRun: false, matchedOnly: true,
    }, logger, E2E_LOCALE);
    expect(screened).toMatchObject({ success: true, data: { held: 0, discardedCount: 2, business: [] } });
    const absent = await db.select().from(bankPrivacyReview).where(eq(bankPrivacyReview.mappingId, mappingId));
    expect(absent).toEqual([]);
    const held = await screenBankRows({ ...scope, rows: [privateRow, businessRow], dryRun: false }, logger, E2E_LOCALE);
    expect(held).toMatchObject({ success: true, data: { held: 2, business: [] } });
    const before = await db.select().from(bankPrivacyReview).where(eq(bankPrivacyReview.mappingId, mappingId));
    expect(before.every(({ sourceIdentity, evidenceEncrypted }) =>
      /^[a-f0-9]{64}$/.test(sourceIdentity) && !evidenceEncrypted?.includes("Synthetic"))).toBe(true);
    const denied = await BankPrivacyRepository.get({ connectionId }, outsiderId, E2E_LOCALE, logger);
    expect(denied.success).toBe(false);
    await loginAs(owner);
    if (process.env["BANK_PRIVACY_REPLAY_CATALOG"] === "1") {
      await page.route(/\/src\/generated\/endpoints\/endpoint(?:-dev)?\.ts(?:\?|$)/, async (route) => {
        try {
          const refreshed = new URL(route.request().url());
          refreshed.searchParams.set("bank-privacy-proof", "1");
          const real = await page.request.get(refreshed.href);
          await route.fulfill({ response: real });
        } catch {
          await route.continue().catch(() => undefined);
        }
      });
      await page.route(/\/api\/[^/]+\/vibe\/help-tool(?:\?|$)/, async (route) => {
        try {
          const url = new URL(route.request().url());
          if (url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
            await route.continue();
            return;
          }
          const headers = await route.request().allHeaders();
          const real = await getCatalogFixture(url, headers["cookie"] ?? "");
          const schema = z.looseObject({
            success: z.literal(true),
            data: z.looseObject({
              adminCatalogDestinations: z.record(z.string(), z.object({
                category: z.string(), subCategory: z.string().optional(),
              })).optional(),
            }),
          });
          const parsed = schema.safeParse(JSON.parse(real.body));
          if (!parsed.success) {
            await route.fulfill({ status: real.status, body: real.body, contentType: "application/json" });
            return;
          }
          const { data } = parsed.data;
          const category = { category: "finance", subCategory: "Bank reconciliation" };
          data.adminCatalogDestinations = {
            ...data.adminCatalogDestinations,
            "bank-privacy": category,
            "bank-privacy-policy": category,
            "bank-privacy-decide": category,
          };
          await route.fulfill({ status: real.status, json: parsed.data });
        } catch {
          await route.continue().catch(() => undefined);
        }
      });
    }
    const route = `/tools/bank-privacy?arg.connectionId=${connectionId}`;
    const openReview = async (sample: string): Promise<void> => {
      const record = page.getByText(sample, { exact: true });
      if (process.env["BANK_PRIVACY_REPLAY_CATALOG"] !== "1") {
        await gotoReady(route, () => record.waitFor());
        return;
      }
      const search = page.locator("#admin-tools-toolbar input").first();
      await gotoReady(route, () => page.locator('#admin-tools-toolbar[data-admin-ready="true"]').waitFor());
      await search.waitFor();
      const catalog = page.waitForResponse((response) =>
        response.ok() && new URL(response.url()).searchParams.get("query") === "privacy-fixture-refresh",
      );
      await search.fill("privacy-fixture-refresh");
      await catalog;
      const unavailable = page.getByText("This tool is unavailable", { exact: true });
      for (let attempt = 0; attempt < 3 && await unavailable.isVisible(); attempt++) {
        await page.evaluate(() => globalThis.dispatchEvent(new PopStateEvent("popstate")));
        await page.locator("#admin-tool-bank-privacy").waitFor({ timeout: 5000 }).catch(() => undefined);
      }
      await record.waitFor();
    };
    await openReview("Synthetic private text");
    const shots = "scratchpad/erp/shots/v2/finance";
    const theme = (await page.locator("html.dark").count()) ? "dark" : "light";
    await mkdir(shots, { recursive: true });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.screenshot({ path: `${shots}/bank-privacy-default-en-desktop-${theme}.png` });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: `${shots}/bank-privacy-default-en-phone-${theme}.png` });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.getByRole("button", { name: t("privateAction"), exact: true }).last().click();
    await page.getByRole("button", { name: t("apply"), exact: true }).waitFor();
    const dec = await capture(endpoint.POST, () => page.getByRole("button", { name: t("apply"), exact: true }).click());
    expect(dec.response).toMatchObject({ success: true, data: { result: "private" } });
    const [discarded] = await db.select().from(bankPrivacyReview).where(and(eq(bankPrivacyReview.mappingId, mappingId), eq(bankPrivacyReview.state, "private")));
    expect(discarded).toMatchObject({ evidenceEncrypted: null, bookedDate: null, signedAmount: null, currency: null });
    expect(await db.select().from(bankStatementLines).where(eq(bankStatementLines.sourceFeed, connectionId))).toEqual([]);

    await openReview("Synthetic business expense");
    await page.getByRole("button", { name: t("businessAction"), exact: true }).last().click();
    await page.getByRole("button", { name: t("apply"), exact: true }).waitFor();
    const approved = await capture(endpoint.POST, () => page.getByRole("button", { name: t("apply"), exact: true }).click());
    expect(approved.response).toMatchObject({ success: true, data: { result: "business" } });
    const imported = await db.select().from(bankStatementLines).where(eq(bankStatementLines.sourceFeed, connectionId));
    expect(imported).toHaveLength(1);
    expect(imported[0]?.description).toBe("Synthetic business expense");

    const old = { ...privateRow, transactionId: "fixture-expired" };
    await screenBankRows({ ...scope, rows: [old], dryRun: false }, logger, E2E_LOCALE);
    await db.update(bankPrivacyReview).set({ expiresAt: new Date(0) }).where(and(
      eq(bankPrivacyReview.mappingId, mappingId), eq(bankPrivacyReview.state, "review"),
    ));
    await purgeBankPrivacyEvidence(mappingId);
    const [expired] = await db.select().from(bankPrivacyReview).where(and(
      eq(bankPrivacyReview.mappingId, mappingId), eq(bankPrivacyReview.state, "expired"),
    ));
    expect(expired).toMatchObject({ evidenceEncrypted: null, bookedDate: null, signedAmount: null, currency: null });
  });
});
