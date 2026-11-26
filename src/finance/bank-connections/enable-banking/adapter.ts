import "server-only";

import { z } from "zod";

import { statementAmount } from "../../bank/statement-format";
import type {
  BankFeedAdapter,
  BankFeedPage,
  BankFeedResult,
  BankFeedRow,
} from "../adapter";
import { type BankTransport, createEnableBankingTransport } from "./http";

const cash = z.object({
  amount: z.string(),
  currency: z.string().regex(/^[A-Z]{3}$/),
});
const party = z.object({ name: z.string().nullish() });
const transaction = z.object({
  entry_reference: z.string().nullish(),
  transaction_id: z.string().nullish(),
  transaction_amount: cash,
  credit_debit_indicator: z.enum(["CRDT", "DBIT"]),
  booking_date: z.iso.date().nullish(),
  value_date: z.iso.date().nullish(),
  debtor: party.nullish(),
  creditor: party.nullish(),
  debtor_account: z.object({ iban: z.string().nullish() }).nullish(),
  creditor_account: z.object({ iban: z.string().nullish() }).nullish(),
  remittance_information: z.array(z.string()).nullish(),
  exchange_rate: z.object({ instructed_amount: cash.nullish() }).nullish(),
  status: z.enum(["BOOK", "CNCL", "HOLD", "OTHR", "PDNG", "RJCT", "SCHD"]),
});
const responseSchema = z.object({
  transactions: z.array(transaction),
  continuation_key: z.string().nullish(),
});

function signedAmount(value: string, debit: boolean): string | undefined {
  const amount = statementAmount(value.replace(/^[+-]/u, ""), ".");
  if (!amount) {
    return undefined;
  }
  return debit && Number(amount) !== 0 ? `-${amount}` : amount;
}

export function enableBankingPage(
  data: z.input<typeof responseSchema>,
): BankFeedResult<BankFeedPage> {
  const rows: BankFeedRow[] = [];
  for (const txn of data.transactions) {
    if (txn.status !== "BOOK") {
      continue;
    }
    const debit = txn.credit_debit_indicator === "DBIT";
    const amount = signedAmount(txn.transaction_amount.amount, debit);
    if (!amount || !txn.booking_date) {
      return { success: false, reason: "invalidResponse" };
    }
    const instructed = txn.exchange_rate?.instructed_amount;
    const original =
      instructed?.currency !== txn.transaction_amount.currency
        ? instructed
        : undefined;
    const nativeAmount = original
      ? signedAmount(original.amount, debit)
      : undefined;
    if (original && !nativeAmount) {
      return { success: false, reason: "invalidResponse" };
    }
    rows.push({
      transactionId: txn.entry_reference || undefined,
      bookedDate: txn.booking_date,
      valueDate: txn.value_date ?? undefined,
      amount,
      currency: txn.transaction_amount.currency,
      nativeAmount,
      nativeCurrency: original?.currency,
      description: txn.remittance_information?.join(" ") || undefined,
      counterpartyIban:
        (debit ? txn.creditor_account : txn.debtor_account)?.iban ?? undefined,
      counterparty: (debit ? txn.creditor : txn.debtor)?.name || undefined,
    });
  }
  return { success: true, data: { rows, next: data.continuation_key ?? null } };
}

export function createEnableBankingAdapter(
  appId: string,
  privateKey: string,
  accountReference: string,
  transport: BankTransport,
): BankFeedAdapter {
  const send = createEnableBankingTransport(appId, privateKey, transport);
  return {
    async readPage(period, cursor) {
      const url = new URL(
        `https://api.enablebanking.com/accounts/${encodeURIComponent(
          accountReference,
        )}/transactions`,
      );
      url.searchParams.set("date_from", period.from);
      url.searchParams.set("date_to", period.to);
      url.searchParams.set("transaction_status", "BOOK");
      if (cursor) {
        url.searchParams.set("continuation_key", cursor);
      }
      try {
        const response = await send(url.pathname + url.search, {
          method: "GET",
        });
        if (response.status === 401 || response.status === 403) {
          return { success: false, reason: "consent" };
        }
        if (response.status === 429) {
          return { success: false, reason: "rateLimit" };
        }
        if (!response.ok) {
          return { success: false, reason: "unavailable" };
        }
        const result = responseSchema.safeParse(await response.json());
        return result.success
          ? enableBankingPage(result.data)
          : { success: false, reason: "invalidResponse" };
      } catch {
        return { success: false, reason: "unavailable" };
      }
    },
  };
}
