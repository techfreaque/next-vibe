import { z } from "zod";

export const BANK_STATEMENT_CSV_LIMIT = 256_000;
export const BANK_STATEMENT_ROW_LIMIT = 1_000;
export const BANK_STATEMENT_HEADER = "transactionId,date,amount,currency";

export interface BankCsvRow {
  transactionId: string;
  bookedDate: string;
  amount: string;
  currency: string;
}

type BankCsvError = "size" | "header" | "empty" | "row" | "duplicate";

type BankCsvResult =
  | { success: true; rows: BankCsvRow[]; skippedDuplicateRows: number }
  | { success: false; error: BankCsvError; row?: number };

const bookedDateSchema = z.iso.date();
const transactionIdPattern = /^[a-zA-Z0-9][a-zA-Z0-9._:/-]{0,127}$/;

function readField(field: string): string {
  return field.startsWith('"') && field.endsWith('"')
    ? field.slice(1, -1)
    : field;
}

function normalizeAmount(value: string): string | null {
  const [, sign, integer, fraction] =
    /^([+-]?)(0|[1-9]\d{0,9})(?:\.(\d{1,4}))?$/.exec(value) ?? [];
  if (!integer) {
    return null;
  }
  const decimals = (fraction ?? "").padEnd(4, "0");
  if (integer === "0" && decimals === "0000") {
    return null;
  }
  return `${sign === "-" ? "-" : ""}${integer}.${decimals}`;
}

export function parseBankStatementCsv(input: string): BankCsvResult {
  if (new TextEncoder().encode(input).length > BANK_STATEMENT_CSV_LIMIT) {
    return { success: false, error: "size" };
  }
  const [header, ...records] = input.replace(/^\uFEFF/, "").split(/\r?\n/);
  if (header?.split(",").map(readField).join(",") !== BANK_STATEMENT_HEADER) {
    return { success: false, error: "header" };
  }
  if (records.at(-1) === "") {
    records.pop();
  }
  if (records.length === 0) {
    return { success: false, error: "empty" };
  }
  if (records.length > BANK_STATEMENT_ROW_LIMIT) {
    return { success: false, error: "size" };
  }

  const uniqueRows = new Map<string, BankCsvRow>();
  let skippedDuplicateRows = 0;
  for (const [index, record] of records.entries()) {
    const fields = record.split(",").map(readField);
    const [transactionId, bookedDate, rawAmount, currency] = fields;
    const amount = normalizeAmount(rawAmount ?? "");
    if (
      fields.length !== 4 ||
      record.includes("\r") ||
      !transactionId ||
      !transactionIdPattern.test(transactionId) ||
      !bookedDate ||
      bookedDate.startsWith("0000-") ||
      !bookedDateSchema.safeParse(bookedDate).success ||
      !amount ||
      !currency ||
      !/^[A-Z]{3}$/.test(currency)
    ) {
      return { success: false, error: "row", row: index + 2 };
    }

    const existing = uniqueRows.get(transactionId);
    if (existing) {
      if (
        existing.bookedDate !== bookedDate ||
        existing.amount !== amount ||
        existing.currency !== currency
      ) {
        return { success: false, error: "duplicate", row: index + 2 };
      }
      skippedDuplicateRows++;
      continue;
    }
    uniqueRows.set(transactionId, {
      transactionId,
      bookedDate,
      amount,
      currency,
    });
  }
  return {
    success: true,
    rows: [...uniqueRows.values()],
    skippedDuplicateRows,
  };
}

export const BANK_CSV_FIELDS = [
  "transactionId",
  "date",
  "amount",
  "currency",
] as const;

export type BankCsvField = (typeof BANK_CSV_FIELDS)[number];
export type BankCsvMapping = Partial<Record<BankCsvField, number>>;

export type BankCsvSeparator = "," | ";";

function readMappedRecord(
  record: string,
  separator: BankCsvSeparator,
): string[] | undefined {
  if (record.includes("\r")) {
    return undefined;
  }
  const prefixed = `${separator}${record}`;
  const pattern =
    separator === ";"
      ? /;("(?:[^"]|"")*"|[^";]*)/gu
      : /,("(?:[^"]|"")*"|[^",]*)/gu;
  const fields = [...prefixed.matchAll(pattern)];
  if (fields.map((match) => match[0]).join("") !== prefixed) {
    return undefined;
  }
  return fields.map((match) => readField(match[1] ?? "").replaceAll('""', '"'));
}

export function readBankCsvColumns(
  input: string,
  separator: BankCsvSeparator = ",",
):
  | {
      success: true;
      headers: string[];
      records: string[];
      separator: BankCsvSeparator;
    }
  | { success: false; error: "size" | "header" | "empty" } {
  if (new TextEncoder().encode(input).length > BANK_STATEMENT_CSV_LIMIT) {
    return { success: false, error: "size" };
  }
  const [header = "", ...records] = input.replace(/^\uFEFF/, "").split(/\r?\n/);
  const headers = readMappedRecord(header, separator);
  if (
    !headers ||
    headers.length < 4 ||
    headers.length > 100 ||
    headers.some((column) => !column.trim())
  ) {
    return { success: false, error: "header" };
  }
  if (records.at(-1) === "") {
    records.pop();
  }
  if (records.length === 0) {
    return { success: false, error: "empty" };
  }
  if (records.length > BANK_STATEMENT_ROW_LIMIT) {
    return { success: false, error: "size" };
  }
  return { success: true, headers, records, separator };
}

export function mapBankCsvColumns(
  source: Extract<ReturnType<typeof readBankCsvColumns>, { success: true }>,
  mapping: BankCsvMapping,
  currency?: string,
):
  | { success: true; csv: string; rows: BankCsvRow[] }
  | {
      success: false;
      error: "mapping" | "columns" | "value" | BankCsvError | "currency";
      row?: number;
      field?: BankCsvField;
    } {
  const indexes = BANK_CSV_FIELDS.map((field) => mapping[field]);
  if (
    indexes.some(
      (index) =>
        index === undefined ||
        !Number.isInteger(index) ||
        index < 0 ||
        index >= source.headers.length,
    ) ||
    new Set(indexes).size !== BANK_CSV_FIELDS.length
  ) {
    return { success: false, error: "mapping" };
  }
  const records = [BANK_STATEMENT_HEADER];
  for (const [index, line] of source.records.entries()) {
    const fields = readMappedRecord(line, source.separator);
    const row = index + 2;
    if (fields?.length !== source.headers.length) {
      return { success: false, error: "columns", row };
    }
    const [id = "", sourceDate = "", sourceAmount = "", code = ""] =
      indexes.map((column) => fields[column ?? -1]);
    if (!transactionIdPattern.test(id)) {
      return { success: false, error: "value", row, field: "transactionId" };
    }
    const date = sourceDate.replace(/^(\d{2})\.(\d{2})\.(\d{4})$/u, "$3-$2-$1");
    const amount =
      source.separator === ";" && !sourceAmount.includes(".")
        ? sourceAmount.replace(",", ".")
        : sourceAmount;
    if (date.startsWith("0000-") || !bookedDateSchema.safeParse(date).success) {
      return { success: false, error: "value", row, field: "date" };
    }
    if (
      (source.separator === ";" && sourceAmount.includes(".")) ||
      !normalizeAmount(amount)
    ) {
      return { success: false, error: "value", row, field: "amount" };
    }
    if (!/^[A-Z]{3}$/.test(code)) {
      return { success: false, error: "value", row, field: "currency" };
    }
    if (currency && code !== currency) {
      return { success: false, error: "currency", row };
    }
    records.push([id, date, amount, code].join(","));
  }
  const csv = records.join("\n");
  const parsed = parseBankStatementCsv(csv);
  return parsed.success ? { success: true, csv, rows: parsed.rows } : parsed;
}
