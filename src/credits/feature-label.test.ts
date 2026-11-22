/**
 * credit_transactions.feature holds stable ids, never request-locale text:
 * - a charge made under de-DE stores the id;
 * - the credit history shows it in the viewer's locale;
 * - legacy rows (localized labels in any locale) resolve to the same label.
 * Requires the dev DB, like the other credits repository tests.
 */

import "server-only";

import { and, eq, inArray, or } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { userLeadLinks } from "next-vibe/identity/lead/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import {
  createTestUser,
  deleteTestUser,
  type TestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { IMAGE_GEN_ALIAS } from "next-vibe/agent/image-generation/constants";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { endpointsMeta as deMeta } from "@/generated/endpoints/meta/de";

import { creditTransactions, creditWallets } from "./db";
import { CreditFeature, CreditTransactionType } from "./enum";
import { creditFeatureLabels, normalizeCreditFeature } from "./feature-label";
import { scopedTranslation } from "./i18n";
import { CreditRepository } from "./repository";

const DE: CountryLanguage = "de-DE";
const EN: CountryLanguage = "en-US";
const logger = createEndpointLogger(false, DE);
const deT = scopedTranslation.scopedT(DE).t;
const stamp = Date.now();

describe("ledger feature ids", () => {
  let spender: TestUser;

  beforeAll(async () => {
    const created = await createTestUser(`feature-id-${stamp}@example.com`);
    expect(created.success).toBe(true);
    if (!created.success) {
      return;
    }
    spender = created.data;
    const granted = await CreditRepository.addUserCredits(
      spender.user.id,
      5,
      "permanent",
      logger,
      deT,
      undefined,
      `feature-id-${stamp}`,
    );
    expect(granted.success).toBe(true);
  });

  afterAll(async () => {
    await deleteTestUser(spender.user.id);
  });

  it("stores the id for a charge made under de-DE", async () => {
    const charged = await CreditRepository.deductCreditsForTTS(
      spender.user,
      1,
      logger,
      DE,
      deT,
    );
    expect(charged.success).toBe(true);
    // Free credits are drawn from the account's lead wallets too.
    const leadIds = (
      await db
        .select({ leadId: userLeadLinks.leadId })
        .from(userLeadLinks)
        .where(eq(userLeadLinks.userId, spender.user.id))
    ).map((row) => row.leadId);
    const wallets = (
      await db
        .select({ id: creditWallets.id })
        .from(creditWallets)
        .where(
          leadIds.length > 0
            ? or(
                eq(creditWallets.userId, spender.user.id),
                inArray(creditWallets.leadId, leadIds),
              )
            : eq(creditWallets.userId, spender.user.id),
        )
    ).map((row) => row.id);
    const rows = await db
      .select({ feature: creditTransactions.feature })
      .from(creditTransactions)
      .where(
        and(
          inArray(creditTransactions.walletId, wallets),
          eq(creditTransactions.type, CreditTransactionType.USAGE),
        ),
      );
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((row) => row.feature === CreditFeature.TEXT_TO_SPEECH)).toBe(true);
  });

  it("shows the charge in the viewer's locale in the credit history", async () => {
    const history = await CreditRepository.getTransactionHistory(
      { paginationInfo: { page: 1, limit: 20 } },
      spender.user,
      logger,
      deT,
      DE,
    );
    expect(history.success).toBe(true);
    if (!history.success) {
      return;
    }
    const details = history.data.transactions.map((row) => row.detail);
    expect(details).toContain("Text-zu-Sprache");
    expect(details).not.toContain(CreditFeature.TEXT_TO_SPEECH);
  });
});

describe("feature labels at display time", () => {
  it("translates ids and folds legacy labels from any locale", async () => {
    const imageTitleDe = deMeta.find(
      (entry) => entry.toolName === IMAGE_GEN_ALIAS,
    )?.title;
    expect(imageTitleDe).toBeDefined();

    const de = await creditFeatureLabels(
      [IMAGE_GEN_ALIAS, "Bild generieren", "Generate Image", CreditFeature.MEMORY_WRITE, "Zapis", "Schreiben", "model:kimi-k3"],
      DE,
    );
    expect(de[IMAGE_GEN_ALIAS]).toBe(imageTitleDe);
    expect(de["Bild generieren"]).toBe(imageTitleDe);
    expect(de["Generate Image"]).toBe(imageTitleDe);
    expect(de[CreditFeature.MEMORY_WRITE]).toBe("Gedächtnis schreiben");
    expect(de.Zapis).toBe("Gedächtnis schreiben");
    expect(de.Schreiben).toBe("Gedächtnis schreiben");
    expect(de["model:kimi-k3"]).toBe("model:kimi-k3");

    const en = await creditFeatureLabels([CreditFeature.MEMORY_WRITE, "Zapis"], EN);
    expect(en[CreditFeature.MEMORY_WRITE]).toBe("Memory write");
    expect(en.Zapis).toBe("Memory write");

    expect(normalizeCreditFeature("Edycja")).toBe(CreditFeature.MEMORY_EDIT);
    expect(normalizeCreditFeature("Bearbeiten")).toBe(CreditFeature.MEMORY_EDIT);
  });
});
