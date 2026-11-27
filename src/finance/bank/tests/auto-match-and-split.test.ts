import { describe, expect, test } from "bun:test";

import {
  containsDocumentReference,
  dateDistanceDays,
  extractTextCorpus,
  normalizeIban,
  scoreDocumentMatch,
} from "../auto-match-engine";

describe("bank auto-match scoring engine", () => {
  test("normalizes IBANs and strips spaces", () => {
    expect(normalizeIban("de89 3704 0044 0532 0130 00")).toBe(
      "DE89370400440532013000",
    );
    expect(normalizeIban("SK31 1200 0000 1987 4263 7541")).toBe(
      "SK3112000000198742637541",
    );
    expect(normalizeIban("not-an-iban")).toBeNull();
    expect(normalizeIban(null)).toBeNull();
  });

  test("detects invoice/bill references in combined bank text", () => {
    const corpus = extractTextCorpus([
      "Payment for INV-2026-0042 thanks",
      "ACME GmbH",
    ]);
    expect(containsDocumentReference(corpus, "INV-2026-0042")).toBe(true);
    expect(containsDocumentReference(corpus, "INV-2026-0099")).toBe(false);
    expect(containsDocumentReference(corpus, "AB")).toBe(false);
  });

  test("scores exact invoice match by reference higher than amount-only match", () => {
    const refMatch = scoreDocumentMatch({
      lineCorpus: "SEPA CREDIT INV-2026-0010 ACME GMBH",
      lineCounterparty: "ACME GmbH",
      lineBookedDate: "2026-11-20",
      lineAmount: "1190.0000",
      lineCurrency: "EUR",
      lineNativeAmount: null,
      lineNativeCurrency: null,
      lineFeeAmount: null,
      lineFeeCurrency: null,
      documentNumber: "INV-2026-0010",
      counterpartyName: "ACME GmbH",
      counterpartyIban: null,
      documentDate: new Date("2026-11-18T00:00:00Z"),
      signedOpenAmount: "1190.0000",
      documentCurrency: "EUR",
      windowDays: 7,
    });
    const amountOnly = scoreDocumentMatch({
      lineCorpus: "TRANSFER",
      lineCounterparty: "Other Corp",
      lineBookedDate: "2026-11-20",
      lineAmount: "1190.0000",
      lineCurrency: "EUR",
      lineNativeAmount: null,
      lineNativeCurrency: null,
      lineFeeAmount: null,
      lineFeeCurrency: null,
      documentNumber: "INV-2026-0011",
      counterpartyName: "Other Corp",
      counterpartyIban: null,
      documentDate: new Date("2026-11-18T00:00:00Z"),
      signedOpenAmount: "1190.0000",
      documentCurrency: "EUR",
      windowDays: 7,
    });
    expect(refMatch).not.toBeNull();
    expect(amountOnly).not.toBeNull();
    expect(refMatch?.basis).toBe("reference");
    expect(amountOnly?.basis).toBe("amount_date");
    expect((refMatch?.score ?? 0) > (amountOnly?.score ?? 0)).toBe(true);
  });

  test("scores supplier bill match by IBAN and FX tolerance with fee", () => {
    const fxMatch = scoreDocumentMatch({
      lineCorpus: "CARD PAYMENT DE89370400440532013000 OPENROUTER",
      lineCounterparty: "OpenRouter",
      lineBookedDate: "2026-11-22",
      lineAmount: "-94.5000",
      lineCurrency: "EUR",
      lineNativeAmount: "-100.0000",
      lineNativeCurrency: "USD",
      lineFeeAmount: "-1.5000",
      lineFeeCurrency: "EUR",
      documentNumber: "BILL-2026-07",
      counterpartyName: "OpenRouter",
      counterpartyIban: "DE89 3704 0044 0532 0130 00",
      documentDate: new Date("2026-11-20T00:00:00Z"),
      signedOpenAmount: "-100.0000",
      carryingAmount: "-92.0000",
      documentCurrency: "USD",
      windowDays: 7,
      settings: {
        accountId: "00000000-0000-4000-8000-000000000002",
        companyId: "00000000-0000-4000-8000-000000000001",
        bookedCurrency: "EUR",
        foreignCurrency: "USD",
        maxFxDifference: "10.0000",
        maxFxBps: 500,
        maxDateDistanceDays: 7,
        gainAccountId: "00000000-0000-4000-8000-000000000011",
        lossAccountId: "00000000-0000-4000-8000-000000000012",
        feeAccountId: "00000000-0000-4000-8000-000000000013",
        configuredByUserId: "00000000-0000-4000-8000-000000000099",
        updatedAt: new Date("2026-11-20T00:00:00Z"),
      },
    });
    expect(fxMatch).not.toBeNull();
    expect(fxMatch?.basis).toBe("iban");
    expect(fxMatch?.plan.kind).toBe("fx");
    expect(fxMatch?.plan.fee).toBe(BigInt(-15_000));
    expect(fxMatch?.plan.fx).toBe(BigInt(-10_000));
  });

  test("rejects unmatched lines outside date window when no reference/IBAN/name matches", () => {
    expect(dateDistanceDays("2026-11-25", new Date("2026-11-10T00:00:00Z"))).toBe(
      15,
    );
    const miss = scoreDocumentMatch({
      lineCorpus: "RANDOM TRANSFER",
      lineCounterparty: "Unknown",
      lineBookedDate: "2026-11-25",
      lineAmount: "500.0000",
      lineCurrency: "EUR",
      lineNativeAmount: null,
      lineNativeCurrency: null,
      lineFeeAmount: null,
      lineFeeCurrency: null,
      documentNumber: "INV-999",
      counterpartyName: "Client X",
      counterpartyIban: null,
      documentDate: new Date("2026-11-10T00:00:00Z"),
      signedOpenAmount: "500.0000",
      documentCurrency: "EUR",
      windowDays: 7,
    });
    expect(miss).toBeNull();
  });
});
