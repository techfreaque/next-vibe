import { z } from "zod";

import { parseCamt053 } from "./camt053";
import { parseBankStatementCsv } from "./csv";
import { parseMt940 } from "./mt940";
import { parseStatementCsv, statementColumns } from "./statement-csv";
import type {
  bankStatementFormatSchema,
  StatementRows,
} from "./statement-format";

export const statementMappingSchema = z.partialRecord(
  z.enum(statementColumns),
  z.number().int().nonnegative().max(99),
);
export const statementFileOptionsSchema = z.object({
  mapping: statementMappingSchema.optional(),
  separator: z.enum([",", ";"]).optional(),
  decimal: z.enum([",", "."]).optional(),
});

export function parseStatementFile(
  raw: string,
  format: z.infer<typeof bankStatementFormatSchema>,
  options?: z.infer<typeof statementFileOptionsSchema>,
  accountCurrency?: string,
): StatementRows | { success: false; error: "duplicate"; row?: number } {
  switch (format) {
    case "normalized":
      return parseBankStatementCsv(raw);
    case "camt053":
      return parseCamt053(raw);
    case "mt940":
      return parseMt940(raw);
    default:
      return parseStatementCsv(raw, {
        preset: format,
        separator: options?.separator ?? (format === "c24" ? ";" : ","),
        decimal: options?.decimal ?? (format === "c24" ? "," : "."),
        mapping: options?.mapping,
        accountCurrency:
          format === "c24" ? (accountCurrency ?? "EUR") : accountCurrency,
      });
  }
}
