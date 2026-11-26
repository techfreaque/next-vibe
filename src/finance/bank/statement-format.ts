import { z } from "zod";

export const bankStatementFormats = [
  "normalized",
  "c24",
  "revolut",
  "revolutBusiness",
  "mapped",
  "camt053",
  "mt940",
] as const;

export const bankStatementFormatSchema = z.enum(bankStatementFormats);

export interface StatementSourceRow {
  transactionId?: string;
  bookedDate: string;
  valueDate?: string;
  amount: string;
  currency: string;
  nativeAmount?: string;
  nativeCurrency?: string;
  feeAmount?: string;
  feeCurrency?: string;
  description?: string;
  counterparty?: string;
  counterpartyIban?: string;
}

export type StatementRows =
  | { success: true; rows: StatementSourceRow[]; skippedDuplicateRows?: number }
  | {
      success: false;
      error: "size" | "header" | "empty" | "row";
      row?: number;
    };

const dateSchema = z.iso.date();

export function statementDate(input: string | undefined): string | undefined {
  if (!input) {
    return undefined;
  }
  const value = input
    .trim()
    .replace(/^(\d{4}-\d{2}-\d{2})(?:T| )\d{2}:\d{2}.*$/u, "$1")
    .replace(/^(\d{2})\.(\d{2})\.(\d{4})$/u, "$3-$2-$1");
  return !value.startsWith("0000-") && dateSchema.safeParse(value).success
    ? value
    : undefined;
}

export function statementAmount(
  input: string,
  decimal: "," | ".",
): string | undefined {
  const value = input.trim().replaceAll("\u2212", "-");
  const decimalPart = decimal === "," ? "," : "\\.";
  const groupPart = decimal === "," ? "[.    ]" : "[,    ]";
  const pattern = new RegExp(
    `^([+-]?)(\\d+|\\d{1,3}(?:${groupPart}\\d{3})+)(?:${decimalPart}(\\d{1,4}))?$`,
    "u",
  );
  const [, sign, integer, fraction = ""] = pattern.exec(value) ?? [];
  if (!integer) {
    return undefined;
  }
  const whole = integer
    .replace(new RegExp(groupPart, "gu"), "")
    .replace(/^0+(?=\d)/u, "");
  const decimals = fraction.padEnd(4, "0");
  return whole.length <= 10 && (whole !== "0" || decimals !== "0000")
    ? `${sign === "-" ? "-" : ""}${whole}.${decimals}`
    : undefined;
}

export function statementCurrency(
  input: string | undefined,
): string | undefined {
  const value = input?.trim().toUpperCase();
  return value && /^[A-Z]{3}$/u.test(value) ? value : undefined;
}

export const normalizedStatementRowsSchema = z
  .array(
    z
      .object({
        transactionId: z.string().trim().min(1).max(500).optional(),
        bookedDate: z.iso.date(),
        valueDate: z.iso.date().optional(),
        amount: z.string().regex(/^-?(?:0|[1-9]\d{0,9})\.\d{4}$/u),
        currency: z.string().regex(/^[A-Z]{3}$/u),
        nativeAmount: z
          .string()
          .regex(/^-?(?:0|[1-9]\d{0,9})\.\d{4}$/u)
          .optional(),
        nativeCurrency: z
          .string()
          .regex(/^[A-Z]{3}$/u)
          .optional(),
        feeAmount: z
          .string()
          .regex(/^-?(?:0|[1-9]\d{0,9})\.\d{4}$/u)
          .optional(),
        feeCurrency: z
          .string()
          .regex(/^[A-Z]{3}$/u)
          .optional(),
        description: z.string().max(2_000).optional(),
        counterparty: z.string().max(500).optional(),
      })
      .refine(
        ({
          bookedDate,
          valueDate,
          amount,
          nativeAmount,
          nativeCurrency,
          feeAmount,
          feeCurrency,
        }) =>
          !bookedDate.startsWith("0000-") &&
          !valueDate?.startsWith("0000-") &&
          Number(amount) !== 0 &&
          Boolean(feeAmount) === Boolean(feeCurrency) &&
          (!feeAmount || Number(feeAmount) !== 0) &&
          Boolean(nativeAmount) === Boolean(nativeCurrency) &&
          (!nativeAmount ||
            (Number(nativeAmount) !== 0 &&
              amount.startsWith("-") === nativeAmount.startsWith("-"))),
      ),
  )
  .min(1)
  .max(1_000);

export interface NormalizedBankImport {
  companyId: string;
  accountId: string;
  feedIdentifier: string;
  rows: readonly StatementSourceRow[];
  dryRun: boolean;
  autoMatch?: boolean;
}

export interface PreparedBankImport {
  companyId: string;
  accountId: string;
  format: (typeof bankStatementFormats)[number] | "api";
  feedIdentifier: string | null;
  rows: readonly StatementSourceRow[];
  skipped: number;
  screenedOut?: number;
  dryRun: boolean;
  autoMatch?: boolean;
}
