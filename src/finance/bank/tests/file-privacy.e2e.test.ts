import { randomUUID } from "node:crypto";

import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { createEndpointLogger } from "next-vibe/logger/server";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";

import { accountNodes } from "@/chart-of-accounts/db";
import { AccountSubtype, AccountType } from "@/chart-of-accounts/enum";
import {
  postAtlas,
  prepareAtlasCompany,
  saveWorkflowScreenshots,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { bankFeedMappings } from "@/finance/bank-connections/db";
import { encryptConsentValue } from "@/finance/bank-connections/enable-banking/consent/crypto";
import {
  enableBankingAttempts,
  enableBankingConsentAccounts,
  enableBankingConsents,
} from "@/finance/bank-connections/enable-banking/consent/db";
import { bankPrivacyReview } from "@/finance/bank-connections/privacy/db";
import { BankPrivacyRepository } from "@/finance/bank-connections/privacy/repository";

import { bankStatementLines } from "../db";
import { scopedTranslation } from "../i18n";
import importer from "../import/definition";

describe("Mixed bank statement file privacy", () => {
  const e2e = useE2E("finance/bank-file-privacy");

  e2e.it(
    "imports an explicit business match, discards other rows and safely repeats the upload",
    async (fixtures) => {
      const { companyId, userId } = await prepareAtlasCompany(
        fixtures,
        "E2E Mixed Bank File",
      );
      const accountId = randomUUID();
      const attemptId = randomUUID();
      const consentId = randomUUID();
      const feedId = randomUUID();
      const date = new Date().toISOString().slice(0, 10);
      const expiry = new Date(Date.now() + 86_400_000);
      const logger = createEndpointLogger(false, E2E_LOCALE);
      const { t } = scopedTranslation.scopedT(E2E_LOCALE);

      fixtures.cleanup(async () => {
        await db
          .delete(bankStatementLines)
          .where(eq(bankStatementLines.companyId, companyId));
        await db
          .delete(enableBankingAttempts)
          .where(eq(enableBankingAttempts.id, attemptId));
        expect(
          await db
            .select({ id: bankStatementLines.id })
            .from(bankStatementLines)
            .where(eq(bankStatementLines.companyId, companyId)),
        ).toEqual([]);
      });
      await db.insert(accountNodes).values({
        id: accountId,
        companyId,
        name: "Fixture mixed checking",
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
        callbackOrigin: fixtures.baseUrl,
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
        identifiersEncrypted: encryptConsentValue(
          JSON.stringify({ uid: randomUUID() }),
          ["account", companyId, consentId, feedId],
        ),
      });
      const setup = await postAtlas(fixtures, "finance/bank-connections", {
        companyId,
        accountId,
        feedId,
        setupOnly: true,
        startDay: date,
        matchedOnly: true,
        dryRun: true,
      });
      expect(setup.ok).toBe(true);
      const [mapping] = await db
        .select({ id: bankFeedMappings.id })
        .from(bankFeedMappings)
        .where(eq(bankFeedMappings.consentAccountId, feedId));
      expect(mapping?.id).toBeDefined();
      if (!mapping) return;
      for (const rule of [
        { literal: "Fixture Hosting", result: "business" },
        { literal: "Fixture Personal", result: "private" },
      ] as const) {
        const saved = await BankPrivacyRepository.patch(
          {
            connectionId: feedId,
            operation: "set",
            field: "counterparty",
            match: "equals",
            ...rule,
          },
          userId,
          E2E_LOCALE,
          logger,
        );
        expect(saved.success).toBe(true);
      }

      const csv = [
        "Transaktions-ID;Buchungstag;Betrag;Währung;Auftraggeber/Empfänger;Verwendungszweck",
        `fixture-business;${date};-5,00;EUR;Fixture Hosting;Business fee`,
        `fixture-private;${date};-3,00;EUR;Fixture Personal;Private note`,
        `fixture-unknown;${date};-9,00;EUR;Fixture Unknown;Unknown note`,
      ].join("\n");
      const submit = (dryRun: boolean) =>
        postAtlas(fixtures, "finance/bank/import", {
          companyId,
          accountId,
          csv,
          format: "c24",
          dryRun,
        });
      const readPrivacy = () =>
        db
          .select({
            state: bankPrivacyReview.state,
            encrypted: bankPrivacyReview.evidenceEncrypted,
            amount: bankPrivacyReview.signedAmount,
          })
          .from(bankPrivacyReview)
          .where(eq(bankPrivacyReview.mappingId, mapping.id));
      const readBank = () =>
        db
          .select({
            counterparty: bankStatementLines.counterparty,
            description: bankStatementLines.description,
          })
          .from(bankStatementLines)
          .where(eq(bankStatementLines.companyId, companyId));

      const preview = await submit(true);
      expect(preview.ok).toBe(true);
      expect(await preview.json()).toMatchObject({
        success: true,
        data: { preview: true, imported: 1, screenedOut: 2 },
      });
      expect(await readBank()).toEqual([]);
      expect(await readPrivacy()).toEqual([]);
      const previewInBrowser = async (alreadyImported: boolean): Promise<void> => {
        await fixtures.open(importer.POST, {
          query: { companyId, accountId, format: "c24" },
          ready: () =>
            fixtures.page
              .getByRole("button", { name: t("ui.upload"), exact: true })
              .waitFor(),
        });
        const [chooser] = await Promise.all([
          fixtures.page.waitForEvent("filechooser"),
          fixtures.page
            .getByRole("button", { name: t("ui.upload"), exact: true })
            .click(),
        ]);
        await chooser.setFiles({
          name: "synthetic-statement.csv",
          mimeType: "text/csv",
          buffer: Buffer.from(csv),
        });
        const previewButton = fixtures.page.getByRole("button", {
          name: t("ui.importAction"),
          exact: true,
        });
        await fixtures.page.getByText(t("statement.localPreview"), { exact: true }).waitFor();
        expect(await fixtures.page.getByText("Private note", { exact: true }).count()).toBe(0);
        expect(await fixtures.page.getByText("Unknown note", { exact: true }).count()).toBe(0);
        await fixtures.page
          .getByRole("checkbox", { name: t("statement.preview"), exact: true })
          .check();
        const browser = await fixtures.capture(importer.POST, () =>
          previewButton.click(),
        );
        expect(browser.response).toMatchObject({
          success: true,
          data: { preview: true, imported: alreadyImported ? 0 : 1, skipped: alreadyImported ? 1 : 0, screenedOut: 2 },
        });
        await fixtures.page
          .getByText(t("statement.previewSuccess"), { exact: true })
          .waitFor();
        await fixtures.page.getByText(t("statement.projected"), { exact: true }).waitFor();
        expect(
          await fixtures.page
            .getByText("Private note", { exact: true })
            .count(),
        ).toBe(0);
        expect(
          await fixtures.page
            .getByText("Unknown note", { exact: true })
            .count(),
        ).toBe(0);
      };
      await previewInBrowser(false);
      expect(await readBank()).toEqual([]);
      expect(await readPrivacy()).toEqual([]);
      const applyButton = fixtures.page.getByRole("button", {
        name: t("ui.importAction"),
        exact: true,
      });
      const applied = await fixtures.capture(importer.POST, () => applyButton.click());
      expect(applied.response).toMatchObject({
        success: true,
        data: { preview: false, imported: 1, screenedOut: 2, skipped: 0 },
      });
      await fixtures.page.getByText(t("import.success"), { exact: true }).waitFor();
      const repeated = await submit(false);
      expect(repeated.ok).toBe(true);
      expect(await repeated.json()).toMatchObject({
        success: true,
        data: { imported: 0, skipped: 1, screenedOut: 2 },
      });
      expect(await readBank()).toEqual([
        { counterparty: "Fixture Hosting", description: "Business fee" },
      ]);
      expect(await readPrivacy()).toEqual([
        { state: "business", encrypted: null, amount: null },
      ]);

      await saveWorkflowScreenshots(fixtures, "bank-mixed-file-applied");
      // A new phone preview checks duplicate suppression and does not offer Apply.
      await previewInBrowser(true);
      expect(await applyButton.count()).toBe(0);
      await fixtures.page.screenshot({
        path: ".tmp/erp-night/admin-v2-proof/bank-mixed-file-preview-phone.png",
        fullPage: true,
      });
    },
  );
});
