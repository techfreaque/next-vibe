/**
 * ECB Daily Exchange Rates Fetcher & Multi-Currency Lookup Engine
 *
 * Parses the official ECB eurofxref-daily.xml feed (`1 EUR = rate quoteCurrency`),
 * stores rates in `exchange_rates`, and resolves bidirectional + cross-EUR rates
 * as of any accounting date (preferring MANUAL overrides over ECB on the same day).
 */

import "server-only";

import { and, desc, eq, lte } from "drizzle-orm";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { exchangeRates, type ExchangeRateSource } from "../db";
import type { LedgerTransaction } from "../shared/ledger-write";

export const ECB_DAILY_XML_URL =
  "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";

export interface ParsedEcbRates {
  rateDate: string;
  rates: Array<{ currency: string; rate: number }>;
}

export interface ResolvedExchangeRate {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  rateDate: string;
  source: ExchangeRateSource | "IDENTITY";
}

type RateDbClient = Pick<typeof db, "select"> | LedgerTransaction;

/** Pure parser for ECB eurofxref-daily.xml. */
export function parseEcbDailyXml(xml: string): ParsedEcbRates | null {
  const timeMatch = /<Cube\s+[^>]*time=['"](\d{4}-\d{2}-\d{2})['"]/i.exec(xml);
  if (!timeMatch?.[1]) {
    return null;
  }
  const rateDate = timeMatch[1];
  const rates: Array<{ currency: string; rate: number }> = [];
  const regex =
    /<Cube\s+[^>]*currency=['"]([A-Z]{3})['"][^>]*rate=['"]([0-9]+(?:\.[0-9]+)?)['"][^>]*\/?>/gi;
  let match = regex.exec(xml);
  while (match !== null) {
    const currency = match[1]?.toUpperCase();
    const rate = Number(match[2]);
    if (currency && Number.isFinite(rate) && rate > 0) {
      rates.push({ currency, rate });
    }
    match = regex.exec(xml);
  }
  if (rates.length === 0) {
    return null;
  }
  return { rateDate, rates };
}

/** Round translated monetary amount to 4 decimal places (ledger storage precision). */
export function convertToFunctional(amount: number, rate: number): number {
  return Math.round(amount * rate * 10_000) / 10_000;
}

/** Round an exchange rate to 8 decimal places (numeric(16,8)). */
export function roundExchangeRate(rate: number): number {
  return Math.round(rate * 100_000_000) / 100_000_000;
}

function toIsoDate(value: Date | string): string {
  if (typeof value === "string") {
    return value.slice(0, 10);
  }
  return value.toISOString().slice(0, 10);
}

async function lookupDirectPair(
  reader: RateDbClient,
  base: string,
  quote: string,
  asOfIso: string,
): Promise<{
  rate: number;
  rateDate: string;
  source: ExchangeRateSource;
} | null> {
  const rows = await reader
    .select({
      rate: exchangeRates.rate,
      rateDate: exchangeRates.rateDate,
      source: exchangeRates.source,
    })
    .from(exchangeRates)
    .where(
      and(
        eq(exchangeRates.baseCurrency, base),
        eq(exchangeRates.quoteCurrency, quote),
        lte(exchangeRates.rateDate, asOfIso),
      ),
    )
    .orderBy(desc(exchangeRates.rateDate))
    .limit(4);

  if (rows.length === 0) {
    return null;
  }
  const latestDate = rows[0].rateDate;
  const sameDate = rows.filter((r) => r.rateDate === latestDate);
  const manual = sameDate.find((r) => r.source === "MANUAL");
  const chosen = manual ?? sameDate[0];
  return chosen
    ? { rate: chosen.rate, rateDate: chosen.rateDate, source: chosen.source }
    : null;
}

async function lookupDirectOrInverse(
  reader: RateDbClient,
  fromCurrency: string,
  toCurrency: string,
  asOfIso: string,
): Promise<ResolvedExchangeRate | null> {
  const direct = await lookupDirectPair(
    reader,
    fromCurrency,
    toCurrency,
    asOfIso,
  );
  const inverse = await lookupDirectPair(
    reader,
    toCurrency,
    fromCurrency,
    asOfIso,
  );

  if (direct && (!inverse || direct.rateDate >= inverse.rateDate)) {
    return {
      fromCurrency,
      toCurrency,
      rate: roundExchangeRate(direct.rate),
      rateDate: direct.rateDate,
      source: direct.source,
    };
  }
  if (inverse && inverse.rate > 0) {
    return {
      fromCurrency,
      toCurrency,
      rate: roundExchangeRate(1 / inverse.rate),
      rateDate: inverse.rateDate,
      source: inverse.source,
    };
  }
  return null;
}

/**
 * Resolves `1 fromCurrency = rate toCurrency` as of `asOfDate`.
 * Checks identity, direct pair, inverse pair, and cross-rate via EUR.
 */
export async function lookupExchangeRate(
  reader: RateDbClient,
  fromCurrency: string,
  toCurrency: string,
  asOfDate: Date | string,
): Promise<ResolvedExchangeRate | null> {
  const from = fromCurrency.trim().toUpperCase();
  const to = toCurrency.trim().toUpperCase();
  const asOfIso = toIsoDate(asOfDate);

  if (from === to) {
    return {
      fromCurrency: from,
      toCurrency: to,
      rate: 1,
      rateDate: asOfIso,
      source: "IDENTITY",
    };
  }

  const directOrInverse = await lookupDirectOrInverse(
    reader,
    from,
    to,
    asOfIso,
  );
  if (directOrInverse) {
    return directOrInverse;
  }

  if (from !== "EUR" && to !== "EUR") {
    const fromToEur = await lookupDirectOrInverse(reader, from, "EUR", asOfIso);
    const eurToTarget = await lookupDirectOrInverse(reader, "EUR", to, asOfIso);
    if (fromToEur && eurToTarget) {
      return {
        fromCurrency: from,
        toCurrency: to,
        rate: roundExchangeRate(fromToEur.rate * eurToTarget.rate),
        rateDate:
          fromToEur.rateDate < eurToTarget.rateDate
            ? fromToEur.rateDate
            : eurToTarget.rateDate,
        source:
          fromToEur.source === "MANUAL" || eurToTarget.source === "MANUAL"
            ? "MANUAL"
            : "ECB",
      };
    }
  }

  return null;
}

export async function upsertExchangeRates(
  parsed: ParsedEcbRates,
  source: ExchangeRateSource = "ECB",
  createdByUserId?: string,
): Promise<{ rateDate: string; upsertedCount: number }> {
  for (const item of parsed.rates) {
    await db
      .insert(exchangeRates)
      .values({
        baseCurrency: "EUR",
        quoteCurrency: item.currency,
        rate: roundExchangeRate(item.rate),
        rateDate: parsed.rateDate,
        source,
        createdByUserId: createdByUserId ?? null,
      })
      .onConflictDoUpdate({
        target: [
          exchangeRates.baseCurrency,
          exchangeRates.quoteCurrency,
          exchangeRates.rateDate,
          exchangeRates.source,
        ],
        set: {
          rate: roundExchangeRate(item.rate),
        },
      });
  }
  return { rateDate: parsed.rateDate, upsertedCount: parsed.rates.length };
}

export async function syncEcbDailyRates(
  logger: EndpointLogger,
  xmlOverride?: string,
): Promise<{ rateDate: string; upsertedCount: number } | null> {
  let xml = xmlOverride;
  if (!xml) {
    // oxlint-disable-next-line restricted/no-raw-fetch -- external API (ECB daily reference rates)
    const response = await fetch(ECB_DAILY_XML_URL, {
      headers: { Accept: "application/xml, text/xml" },
    });
    if (!response.ok) {
      logger.warn("ECB daily rates fetch failed", { status: response.status });
      return null;
    }
    xml = await response.text();
  }
  const parsed = parseEcbDailyXml(xml);
  if (!parsed) {
    logger.warn("Failed to parse ECB daily XML feed");
    return null;
  }
  return upsertExchangeRates(parsed, "ECB");
}
