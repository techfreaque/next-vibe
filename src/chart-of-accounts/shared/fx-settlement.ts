/**
 * Realized FX Gain/Loss Settlement Computation
 *
 * When a foreign-currency receivable (AR) or payable (AP) is settled, the
 * document is relieved at its historical booking rate while cash/bank moves at
 * the settlement-date rate. The difference in functional currency is booked to
 * Financial Income (FX Gain) or Financial Expense (FX Loss).
 */

import { AccountSubtype, LineType } from "../enum";
import type { AutoPostLine } from "./auto-post";

export interface RealizedFxInput {
  side: "AR" | "AP";
  amount: number;
  transactionCurrency: string;
  functionalCurrency: string;
  historicalRate: number;
  settlementRate: number;
  bankOrCashSubtype: typeof AccountSubtype.BANK | typeof AccountSubtype.CASH;
  bankOrCashFallbackSubtype?: typeof AccountSubtype.CASH;
  bankOrCashAccountId?: string;
  controlAccountId: string;
}

export interface RealizedFxSettlement {
  historicalFunctional: number;
  settlementFunctional: number;
  /** Positive = realized gain, negative = realized loss (in functional currency). */
  fxGainOrLoss: number;
  lines: AutoPostLine[];
}

function toUnits(amount: number, rate: number): bigint {
  return BigInt(Math.round(amount * rate * 10_000));
}

export function buildRealizedFxSettlement(
  input: RealizedFxInput,
): RealizedFxSettlement {
  const histUnits = toUnits(input.amount, input.historicalRate);
  const settleUnits = toUnits(input.amount, input.settlementRate);
  const historicalFunctional = Number(histUnits) / 10_000;
  const settlementFunctional = Number(settleUnits) / 10_000;

  // AR: receiving more functional EUR than booked = gain; AP: paying less EUR than booked = gain
  const gainUnits =
    input.side === "AR" ? settleUnits - histUnits : histUnits - settleUnits;
  const fxGainOrLoss = Number(gainUnits) / 10_000;

  const lines: AutoPostLine[] = [];

  if (input.side === "AR") {
    lines.push({
      subtype: input.bankOrCashSubtype,
      fallbackSubtype: input.bankOrCashFallbackSubtype,
      accountNodeId: input.bankOrCashAccountId,
      type: LineType.DEBIT,
      amount: input.amount,
      currency: input.transactionCurrency,
      functionalAmount: settlementFunctional,
      functionalCurrency: input.functionalCurrency,
      exchangeRate: input.settlementRate,
    });
    lines.push({
      subtype: AccountSubtype.ACCOUNTS_RECEIVABLE,
      accountNodeId: input.controlAccountId,
      type: LineType.CREDIT,
      amount: input.amount,
      currency: input.transactionCurrency,
      functionalAmount: historicalFunctional,
      functionalCurrency: input.functionalCurrency,
      exchangeRate: input.historicalRate,
    });
  } else {
    lines.push({
      subtype: AccountSubtype.ACCOUNTS_PAYABLE,
      accountNodeId: input.controlAccountId,
      type: LineType.DEBIT,
      amount: input.amount,
      currency: input.transactionCurrency,
      functionalAmount: historicalFunctional,
      functionalCurrency: input.functionalCurrency,
      exchangeRate: input.historicalRate,
    });
    lines.push({
      subtype: input.bankOrCashSubtype,
      fallbackSubtype: input.bankOrCashFallbackSubtype,
      accountNodeId: input.bankOrCashAccountId,
      type: LineType.CREDIT,
      amount: input.amount,
      currency: input.transactionCurrency,
      functionalAmount: settlementFunctional,
      functionalCurrency: input.functionalCurrency,
      exchangeRate: input.settlementRate,
    });
  }

  if (gainUnits > BigInt(0)) {
    const absGain = Number(gainUnits) / 10_000;
    lines.push({
      subtype: AccountSubtype.FINANCIAL_INCOME,
      type: LineType.CREDIT,
      amount: absGain,
      currency: input.functionalCurrency,
      functionalAmount: absGain,
      functionalCurrency: input.functionalCurrency,
      exchangeRate: 1,
      description: `Realized FX gain (${input.transactionCurrency}/${input.functionalCurrency})`,
    });
  } else if (gainUnits < BigInt(0)) {
    const absLoss = Number(-gainUnits) / 10_000;
    lines.push({
      subtype: AccountSubtype.FINANCIAL_EXPENSE,
      type: LineType.DEBIT,
      amount: absLoss,
      currency: input.functionalCurrency,
      functionalAmount: absLoss,
      functionalCurrency: input.functionalCurrency,
      exchangeRate: 1,
      description: `Realized FX loss (${input.transactionCurrency}/${input.functionalCurrency})`,
    });
  }

  return {
    historicalFunctional,
    settlementFunctional,
    fxGainOrLoss,
    lines,
  };
}
