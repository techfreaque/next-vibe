import "server-only";

import { createHash } from "node:crypto";

import type { StatementSourceRow } from "./statement-format";

interface KeyedStatementRow extends StatementSourceRow {
  transactionId: string;
  stableFingerprint: string;
  sourceReference: string | null;
}

export function keyStatementRows(
  rows: readonly StatementSourceRow[],
):
  | { success: true; rows: KeyedStatementRow[]; skipped: number }
  | { success: false; index: number } {
  const byId = new Map<string, KeyedStatementRow>();
  let skipped = 0;
  for (const [index, row] of rows.entries()) {
    const reference = row.transactionId?.trim().normalize("NFC");
    const description = row.description
      ?.replace(/\s+/gu, " ")
      .trim()
      .normalize("NFC");
    const counterparty = row.counterparty
      ?.replace(/\s+/gu, " ")
      .trim()
      .normalize("NFC");
    if (
      (reference?.length ?? 0) > 500 ||
      (description?.length ?? 0) > 2_000 ||
      (counterparty?.length ?? 0) > 500
    ) {
      return { success: false, index };
    }
    const digest = createHash("sha256")
      .update(
        JSON.stringify([
          row.bookedDate,
          row.valueDate ?? null,
          row.amount,
          row.currency,
          row.nativeAmount ?? null,
          row.nativeCurrency ?? null,
          row.feeAmount ?? null,
          row.feeCurrency ?? null,
          description ?? null,
          counterparty ?? null,
        ]),
      )
      .digest("hex");
    const transactionId = reference
      ? /^[A-Z0-9][A-Z0-9._:/-]{0,127}$/iu.test(reference)
        ? reference
        : `id:${createHash("sha256").update(reference).digest("hex")}`
      : `hash:${digest}`;
    const existing = byId.get(transactionId);
    if (existing) {
      if (!reference || existing.stableFingerprint !== digest) {
        return { success: false, index };
      }
      skipped++;
      continue;
    }
    byId.set(transactionId, {
      ...row,
      transactionId,
      description,
      counterparty,
      stableFingerprint: digest,
      sourceReference: reference ?? null,
    });
  }
  return { success: true, rows: [...byId.values()], skipped };
}
