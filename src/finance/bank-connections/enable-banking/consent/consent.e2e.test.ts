import "server-only";

import { mkdir } from "node:fs/promises";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { UserRole } from "next-vibe/identity/roles/enum";
import { userRoles } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import { createTestSessionToken } from "next-vibe/tooling/testing/e2e/auth";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { describe, expect } from "vitest";
import { z } from "zod";

import { accountNodes } from "@/chart-of-accounts/db";
import { AccountSubtype, AccountType } from "@/chart-of-accounts/enum";
import { companies, companyMembers } from "@/companies/db";
import { CompanyMemberRole, CompanyType } from "@/companies/enum";
import { bankFeedMappings } from "@/finance/bank-connections/db";
import { bankPrivacySettings } from "@/finance/bank-connections/privacy/db";
import { notifications } from "@/notifications/db";

import { scopedTranslation } from "./i18n";
import { redirectBankConsent } from "../callback/repository";
import type { ConsentTransport } from "./client";
import {
  enableBankingAttempts,
  enableBankingConsentAccounts,
  enableBankingConsents,
} from "./db";
import {
  consentOrigin,
  enableBankingCallbackPath,
  listEnableBankingAccounts,
  resolveEnableBankingAccount,
  sendEnableBankingConsentReminders,
  startEnableBankingConsent,
} from "./repository";

describe("E2E: bank consent", () => {
  const e2e = useE2E("finance/enable-banking-consent");

  e2e.it(
    "preserves encrypted multi-account consent and rejects callback replay or foreign scope",
    async ({ page, cleanup, uniqueEmail, baseUrl, loginAs }) => {
      const companyId = crypto.randomUUID();
      const foreignCompanyId = crypto.randomUUID();
      const ledgerAccountId = crypto.randomUUID();
      const accountReferences = [crypto.randomUUID(), crypto.randomUUID()];
      const sessionReference = crypto.randomUUID();
      const firstHash = "provider:primary:first";
      const secondHash = "provider:primary:second";
      let providerSession = sessionReference;
      let providerAccounts = accountReferences.map((uid, index) => ({
        uid,
        currency: "EUR",
        account_id: { iban: `synthetic:${uid}` },
        identification_hash: index === 0 ? firstHash : secondHash,
        identification_hashes: ["provider:nonunique:shared"],
      }));
      const origin = "http://localhost:3000";
      const bank = { name: "Fixture Bank", country: "DE" };
      const now = new Date();
      const maximumConsentSeconds = 7_776_000;
      const dayMs = 86_400_000;
      const requestedUntil = new Date(
        Math.floor(now.getTime() / 1000) * 1000 + maximumConsentSeconds * 1000,
      );
      const validUntil = new Date(now.getTime() + 80 * dayMs);
      const ids: string[] = [];
      const companyIds = [companyId, foreignCompanyId];
      let stopFixture: (() => void) | undefined;
      cleanup(async () => {
        stopFixture?.();
        await db
          .delete(enableBankingAttempts)
          .where(inArray(enableBankingAttempts.companyId, companyIds));
        await db
          .delete(accountNodes)
          .where(inArray(accountNodes.companyId, companyIds));
        await db.delete(companies).where(inArray(companies.id, companyIds));
        for (const userId of ids) await deleteTestUser(userId);
      });
      const owner = await createTestUser(uniqueEmail("consent-owner"));
      expect(owner.success).toBe(true);
      if (!owner.success) return;
      const actorId = owner.data.user.id;
      ids.push(actorId);
      const outsider = await createTestUser(uniqueEmail("consent-outsider"));
      expect(outsider.success).toBe(true);
      if (!outsider.success) return;
      const outsiderId = outsider.data.user.id;
      ids.push(outsiderId);
      await db
        .insert(userRoles)
        .values(ids.map((id) => ({ userId: id, role: UserRole.ADMIN })));
      await db.insert(companies).values([
        {
          id: companyId,
          name: "Consent fixture",
          type: CompanyType.B2B,
          ownerUserId: actorId,
        },
        {
          id: foreignCompanyId,
          name: "Foreign fixture",
          type: CompanyType.B2B,
          ownerUserId: outsiderId,
        },
      ]);
      await db.insert(companyMembers).values([
        { companyId, userId: actorId, role: CompanyMemberRole.OWNER },
        { companyId, userId: outsiderId, role: CompanyMemberRole.ADMIN },
        {
          companyId: foreignCompanyId,
          userId: outsiderId,
          role: CompanyMemberRole.OWNER,
        },
      ]);
      await db.insert(accountNodes).values({
        id: ledgerAccountId,
        companyId,
        name: "Fixture bank ledger",
        code: "1100",
        type: AccountType.ASSET,
        subtype: AccountSubtype.BANK,
      });
      if (process.env["ERP_BANK_CONSENT_VISUALS"] === "1") {
        const directory = "scratchpad/erp/shots/v2/bank-consent";
        await mkdir(directory, { recursive: true });
        const identity = {
          ...owner.data.user,
          roles: [...owner.data.user.roles, UserRole.ADMIN],
        };
        await loginAs(identity);
        const token = await createTestSessionToken(identity);
        expect(token.success).toBe(true);
        if (!token.success) return;
        await page.route(`${baseUrl}/**`, async (route) => {
          await route.continue({
            headers: {
              ...route.request().headers(),
              authorization: `Bearer ${token.data}`,
            },
          });
        });
        await page.route(
          "**/api/*/finance/bank-connections/enable-banking/connect",
          async (route) => {
            const body = z
              .object({
                companyId: z.string(),
                ledgerAccountId: z.string(),
                bankCountry: z.string(),
                bankName: z.string(),
                personal: z.boolean(),
              })
              .safeParse(route.request().postDataJSON());
            expect(body.success && body.data).toEqual({
              companyId,
              ledgerAccountId,
              bankCountry: "DE",
              bankName: bank.name,
              personal: true,
            });
            await route.fulfill({
              json: {
                success: true,
                data: {
                  url: "https://auth.enablebanking.com/ais/start?sessionid=synthetic",
                  authorizedBank: bank.name,
                  authorizedLedgerAccount: "Fixture bank ledger",
                },
              },
            });
          },
        );
        await page.addInitScript(() => {
          localStorage.setItem("theme_v2", "system");
        });
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.emulateMedia({ colorScheme: "light" });
        const { t } = scopedTranslation.scopedT(defaultLocale);
        await page.goto(
          `${baseUrl}/${defaultLocale}/tools/connect-bank?companyId=${companyId}`,
        );
        await page
          .getByRole("heading", { name: t("title"), exact: true })
          .last()
          .waitFor({ timeout: 60_000 });
        await page
          .locator('[data-field="ledgerAccountId"] button')
          .last()
          .click();
        await page
          .getByRole("option", { name: "Fixture bank ledger", exact: true })
          .click();
        await page
          .locator('[data-field="bankCountry"] input')
          .last()
          .fill("DE");
        await page
          .locator('[data-field="bankName"] input')
          .last()
          .fill(bank.name);
        await page.screenshot({
          path: `${directory}/connect-desktop-light.png`,
        });
        await page
          .getByRole("button", { name: t("start"), exact: true })
          .click();
        await page
          .getByRole("link", { name: t("authorize"), exact: true })
          .waitFor();
        await page.screenshot({
          path: `${directory}/continue-desktop-light.png`,
        });
        await page.setViewportSize({ width: 390, height: 844 });
        await page.emulateMedia({ colorScheme: "dark" });
        await page.goto(
          `${baseUrl}/sk-SK/tools/connect-bank?companyId=${companyId}`,
        );
        const { t: sk } = scopedTranslation.scopedT("sk-SK");
        await page
          .getByRole("heading", { name: sk("title"), exact: true })
          .last()
          .waitFor();
        await page.screenshot({
          path: `${directory}/connect-sk-phone-dark.png`,
        });
      }
      const logger = createEndpointLogger(false, defaultLocale);
      const startBody = z.object({
        state: z.string(),
        redirect_url: z.string(),
        access: z.object({ valid_until: z.string() }),
      });
      let state = "";
      let exchanges = 0;
      let expectedRequestedUntil = requestedUntil;
      const upstream: ConsentTransport = async (path, init) => {
        if (path.startsWith("/aspsps?")) {
          return Response.json({
            aspsps: [
              { ...bank, maximum_consent_validity: maximumConsentSeconds },
            ],
          });
        }
        const body =
          typeof init.body === "string" ? JSON.parse(init.body) : undefined;
        if (path === "/auth") {
          const input = startBody.safeParse(body);
          expect(input.success).toBe(true);
          if (!input.success) return Response.json({}, { status: 400 });
          state = input.data.state;
          expect(input.data.redirect_url).toBe(
            origin + enableBankingCallbackPath,
          );
          expect(input.data.access.valid_until).toBe(
            expectedRequestedUntil.toISOString(),
          );
          return Response.json({
            url: "https://auth.enablebanking.com/ais/start?sessionid=synthetic",
          });
        }
        if (path === "/sessions") {
          exchanges++;
          expect(body).toEqual({ code: "fixture-consent-code" });
          return Response.json({
            session_id: providerSession,
            aspsp: bank,
            access: { valid_until: validUntil.toISOString() },
            psu_type: "personal",
            accounts: providerAccounts,
          });
        }
        return Response.json({}, { status: 404 });
      };
      const options = {
        request: upstream,
        logger,
        locale: defaultLocale,
        now: () => now,
      };
      const connect = {
        actorId,
        companyId,
        ledgerAccountId,
        bank,
        psu: "personal",
        origin,
      } satisfies Parameters<typeof startEnableBankingConsent>[0];
      expect(
        await startEnableBankingConsent(
          { ...connect, actorId: outsiderId, companyId: foreignCompanyId },
          options,
        ),
      ).toEqual({ status: "forbidden" });
      expect((await startEnableBankingConsent(connect, options)).status).toBe(
        "started",
      );
      const [attempt] = await db
        .select()
        .from(enableBankingAttempts)
        .where(eq(enableBankingAttempts.companyId, companyId));
      expect(attempt?.nonceDigest).not.toBe(state);
      expect(attempt?.requestedUntil.toISOString()).toBe(
        requestedUntil.toISOString(),
      );

      const server = Bun.serve({
        hostname: "127.0.0.1",
        port: 0,
        fetch: (input) => {
          const inbound = new URL(input.url);
          return redirectBankConsent(
            new Request(origin + inbound.pathname + inbound.search),
            origin,
            upstream,
          );
        },
      });
      stopFixture = () => {
        void server.stop(true);
      };
      const callbackUrl = (nonce: string): URL => {
        const query = new URLSearchParams({
          state: nonce,
          code: "fixture-consent-code",
        });
        return new URL(`${enableBankingCallbackPath}?${query}`, server.url);
      };
      const callback = async (nonce: string): Promise<Response> => {
        // oxlint-disable-next-line restricted/no-raw-fetch -- real loopback callback on the Atlas fixture DB
        return fetch(callbackUrl(nonce), { redirect: "manual" });
      };

      // The real Atlas route receives a corrupted callback and must never follow an upstream link.
      // oxlint-disable-next-line restricted/no-raw-fetch -- real Atlas HTTP route without upstream traffic
      const realRejection = await fetch(
        `${baseUrl}${enableBankingCallbackPath}?state=corrupted`,
        { redirect: "manual" },
      );
      expect(realRejection.status).toBe(303);
      expect(realRejection.headers.get("location")).toContain(
        "bankConsent=failed",
      );
      expect(consentOrigin("https://unbottled.ai.evil.test")).toBeUndefined();
      expect((await callback("corrupted")).headers.get("location")).toContain(
        "bankConsent=failed",
      );
      expect(exchanges).toBe(0);
      const approved = await callback(state);
      expect(approved.status).toBe(303);
      expect(approved.headers.get("location")).toBe(
        `${origin}/en-GLOBAL/tools/bank-connections?bankConsent=connected`,
      );
      expect(approved.headers.get("referrer-policy")).toBe("no-referrer");
      expect((await callback(state)).headers.get("location")).toContain(
        "bankConsent=failed",
      );
      expect(exchanges).toBe(1);
      expect((await startEnableBankingConsent(connect, options)).status).toBe(
        "started",
      );
      await db
        .update(enableBankingAttempts)
        .set({ expiresAt: new Date(now.getTime() - dayMs) })
        .where(
          and(
            eq(enableBankingAttempts.companyId, companyId),
            isNull(enableBankingAttempts.consumedAt),
          ),
        );
      expect((await callback(state)).headers.get("location")).toContain(
        "bankConsent=failed",
      );
      expect(exchanges).toBe(1);

      const [consent] = await db
        .select()
        .from(enableBankingConsents)
        .where(eq(enableBankingConsents.companyId, companyId));
      expect(consent?.sessionEncrypted).not.toContain(sessionReference);
      expect(consent?.consentUntil.toISOString()).toBe(
        validUntil.toISOString(),
      );
      if (!consent) return;
      const encryptedAccounts = await db
        .select()
        .from(enableBankingConsentAccounts)
        .where(eq(enableBankingConsentAccounts.consentId, consent.id));
      expect(encryptedAccounts).toHaveLength(2);
      expect(JSON.stringify(encryptedAccounts)).not.toContain(
        accountReferences[0],
      );
      const accounts = await listEnableBankingAccounts(
        companyId,
        actorId,
        logger,
        defaultLocale,
      );
      expect(accounts.success && accounts.data).toHaveLength(2);
      if (!accounts.success) return;
      const opaqueId = accounts.data[0]?.id;
      expect(opaqueId).toBeDefined();
      if (!opaqueId) return;
      expect(
        await resolveEnableBankingAccount(
          companyId,
          actorId,
          opaqueId,
          logger,
          defaultLocale,
        ),
      ).toMatchObject({
        success: true,
        data: { accountReference: accountReferences[0], actorId },
      });
      expect(
        (
          await resolveEnableBankingAccount(
            companyId,
            outsiderId,
            opaqueId,
            logger,
            defaultLocale,
          )
        ).success,
      ).toBe(false);
      expect(
        (
          await resolveEnableBankingAccount(
            foreignCompanyId,
            outsiderId,
            opaqueId,
            logger,
            defaultLocale,
          )
        ).success,
      ).toBe(false);

      await db
        .update(enableBankingConsents)
        .set({ consentUntil: new Date(now.getTime() + 5 * dayMs) })
        .where(eq(enableBankingConsents.id, consent.id));
      await sendEnableBankingConsentReminders(
        now,
        logger,
        defaultLocale,
        companyId,
      );
      await sendEnableBankingConsentReminders(
        now,
        logger,
        defaultLocale,
        companyId,
      );
      const reminders = await db
        .select()
        .from(notifications)
        .where(
          eq(notifications.dedupeKey, `enable-banking-expiry:${consent.id}`),
        );
      expect(reminders).toHaveLength(1);
      await db
        .update(enableBankingConsents)
        .set({ consentUntil: new Date(now.getTime() - dayMs) })
        .where(eq(enableBankingConsents.id, consent.id));
      expect(
        (
          await resolveEnableBankingAccount(
            companyId,
            actorId,
            opaqueId,
            logger,
            defaultLocale,
          )
        ).success,
      ).toBe(false);

      const mappingId = crypto.randomUUID();
      const mapping = {
        id: mappingId,
        companyId,
        accountId: ledgerAccountId,
        actorId,
        consentAccountId: opaqueId,
        startDay: "2026-01-01",
        daily: true,
      };
      const privacy = { mappingId, mode: "business" } satisfies Pick<
        typeof bankPrivacySettings.$inferInsert,
        "mappingId" | "mode"
      >;
      await db.insert(bankFeedMappings).values(mapping);
      await db
        .insert(bankPrivacySettings)
        .values({ ...privacy, retentionDays: 23 });

      const renewedUid = crypto.randomUUID();
      const unrelatedUid = crypto.randomUUID();
      providerSession = crypto.randomUUID();
      providerAccounts = [
        {
          uid: unrelatedUid,
          currency: "EUR",
          account_id: { iban: "synthetic:unrelated" },
          identification_hash: "provider:primary:unrelated",
          identification_hashes: ["provider:nonunique:shared"],
        },
        {
          uid: renewedUid,
          currency: "EUR",
          account_id: { iban: "synthetic:renewed" },
          identification_hash: firstHash,
          identification_hashes: [firstHash, "provider:nonunique:shared"],
        },
      ];
      expect((await startEnableBankingConsent(connect, options)).status).toBe(
        "started",
      );
      const beforeRenewal = exchanges;
      const renewedState = state;
      if (process.env["ERP_BANK_RECONSENT_BROWSER"] === "1") {
        await loginAs({
          ...owner.data.user,
          roles: [...owner.data.user.roles, UserRole.ADMIN],
        });
        await page.goto(callbackUrl(renewedState).href, {
          waitUntil: "commit",
        });
        expect(new URL(page.url()).searchParams.get("bankConsent")).toBe(
          "connected",
        );
        expect(new URL(page.url()).searchParams.has("state")).toBe(false);
      } else {
        const results = await Promise.all([
          callback(renewedState),
          callback(renewedState),
        ]);
        expect(
          results
            .map((result) =>
              new URL(
                result.headers.get("location") ?? origin,
              ).searchParams.get("bankConsent"),
            )
            .toSorted(),
        ).toEqual(["connected", "failed"]);
      }
      expect(exchanges).toBe(beforeRenewal + 1);

      const resolved = await resolveEnableBankingAccount(
        companyId,
        actorId,
        opaqueId,
        logger,
        defaultLocale,
      );
      expect(resolved).toMatchObject({
        success: true,
        data: { accountReference: renewedUid, actorId },
      });
      const renewedAccounts = await listEnableBankingAccounts(
        companyId,
        actorId,
        logger,
        defaultLocale,
      );
      expect(renewedAccounts.success && renewedAccounts.data).toHaveLength(2);
      if (!renewedAccounts.success) return;
      expect(JSON.stringify(renewedAccounts)).not.toContain(renewedUid);
      expect(
        renewedAccounts.data.some((account) => account.id === opaqueId),
      ).toBe(true);
      const [unchangedMapping] = await db
        .select()
        .from(bankFeedMappings)
        .where(eq(bankFeedMappings.id, mappingId));
      expect(unchangedMapping).toMatchObject(mapping);
      const [unchangedPrivacy] = await db
        .select()
        .from(bankPrivacySettings)
        .where(eq(bankPrivacySettings.mappingId, mappingId));
      expect(unchangedPrivacy).toMatchObject({ ...privacy, retentionDays: 23 });

      expect((await startEnableBankingConsent(connect, options)).status).toBe(
        "started",
      );
      const racingState = state;
      expect((await startEnableBankingConsent(connect, options)).status).toBe(
        "started",
      );
      const races = await Promise.all([callback(racingState), callback(state)]);
      expect(
        races.every((response) =>
          response.headers.get("location")?.endsWith("bankConsent=connected"),
        ),
      ).toBe(true);
      const afterRace = await listEnableBankingAccounts(
        companyId,
        actorId,
        logger,
        defaultLocale,
      );
      expect(afterRace.success && afterRace.data).toHaveLength(2);

      expect((await startEnableBankingConsent(connect, options)).status).toBe(
        "started",
      );
      const staleState = state;
      expectedRequestedUntil = new Date(requestedUntil.getTime() + 1000);
      const later = { ...options, now: () => new Date(now.getTime() + 1000) };
      expect((await startEnableBankingConsent(connect, later)).status).toBe(
        "started",
      );
      expect((await callback(state)).headers.get("location")).toContain(
        "bankConsent=connected",
      );
      expect((await callback(staleState)).headers.get("location")).toContain(
        "bankConsent=failed",
      );
      expectedRequestedUntil = requestedUntil;

      // Another administrator's independent authorization must never inherit this mapping.
      expect(
        (
          await startEnableBankingConsent(
            { ...connect, actorId: outsiderId },
            options,
          )
        ).status,
      ).toBe("started");
      expect((await callback(state)).headers.get("location")).toContain(
        "bankConsent=connected",
      );
      expect(
        (
          await resolveEnableBankingAccount(
            companyId,
            outsiderId,
            opaqueId,
            logger,
            defaultLocale,
          )
        ).success,
      ).toBe(false);

      providerAccounts = providerAccounts.map((providerAccount) => ({
        ...providerAccount,
        identification_hash: firstHash,
      }));
      expect((await startEnableBankingConsent(connect, options)).status).toBe(
        "started",
      );
      expect((await callback(state)).headers.get("location")).toContain(
        "bankConsent=failed",
      );
      expect(
        await resolveEnableBankingAccount(
          companyId,
          actorId,
          opaqueId,
          logger,
          defaultLocale,
        ),
      ).toMatchObject({
        success: true,
        data: { accountReference: renewedUid },
      });
    },
  );
});
