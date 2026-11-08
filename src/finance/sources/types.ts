/**
 * Finance source result types (client+server safe, no imports with side effects).
 */

import type { FinanceSourceValue, RevenueEventKindValue } from "../enum";

export type SourceOutcome =
  | { status: "ok"; note: string | null }
  | { status: "skipped"; reason: string }
  | { status: "failed"; reason: string };

export interface ProviderReadingOk {
  status: "ok";
  /** Remaining balance in USD, null when the provider reports other units */
  balanceUsd: number | null;
  balanceNative: number | null;
  unit: string;
  /** Provider-reported cumulative spend in USD, when it has one */
  cumulativeUsageUsd: number | null;
}

export type ProviderResult =
  | ProviderReadingOk
  | { status: "skipped"; reason: string }
  | { status: "failed"; reason: string };

export interface RevenueEventInput {
  source: typeof FinanceSourceValue;
  kind: typeof RevenueEventKindValue;
  externalId: string;
  amountUsd: number;
  feeUsd: number;
  currency: string;
  occurredAt: Date;
}
