import { z } from "zod";

import {
  evidenceAmounts,
  evidenceCurrencies,
  parseEvidenceAmount,
} from "@/finance/supplier-evidence/rules";

export const historyLimit = 20_000;
export const historyHeader =
  "reference\tkind\tevidence\tdate\tgross\tcurrency\ttax\tinvoice\tnet";
const evidenceKinds = z.enum(["commitment", "invoice", "paid"]);
const expenseKinds = z.enum(["creator", "referral"]);
const amount = z.string().regex(/^\d{1,8}(?:\.\d{1,4})?$/);
const referenceSchema = z.string().trim().min(1).max(120);
export const historyRow = z.object({
  reference: referenceSchema,
  kind: expenseKinds,
  evidence: evidenceKinds,
  date: z.iso.date().optional(),
  gross: amount.optional(),
  currency: evidenceCurrencies.optional(),
  tax: amount.optional(),
  net: amount.optional(),
  invoice: referenceSchema.optional(),
});
export type HistoryRow = z.infer<typeof historyRow>;

export function parseCostHistory(input: string): HistoryRow[] | undefined {
  if (input.length > historyLimit) {
    return undefined;
  }
  const [header, ...lines] = input.replace(/\r?\n$/u, "").split(/\r?\n/u);
  if (header !== historyHeader || lines.length < 1 || lines.length > 100) {
    return undefined;
  }
  const rows: HistoryRow[] = [];
  const references = new Set<string>();
  for (const line of lines) {
    const cols = line.split("\t").map((value) => value.trim());
    if (cols.length !== 9) {
      return undefined;
    }
    const [
      reference,
      kind,
      evidence,
      date,
      gross,
      currency,
      tax,
      invoice,
      net,
    ] = cols;
    const parsed = historyRow.safeParse({
      reference,
      kind,
      evidence,
      date: date || undefined,
      gross: gross || undefined,
      currency: currency || undefined,
      tax: tax || undefined,
      net: net || undefined,
      invoice: invoice || undefined,
    });
    if (!parsed.success) {
      return undefined;
    }
    const row = parsed.data;
    if (references.has(row.reference)) {
      return undefined;
    }
    references.add(row.reference);
    if (row.tax) {
      const split = row.gross && evidenceAmounts(row.gross, row.tax, true);
      if (
        !split ||
        (row.net &&
          parseEvidenceAmount(row.net) !== Math.round(split.net * 10_000))
      ) {
        return undefined;
      }
    }
    rows.push(row);
  }
  return rows;
}
