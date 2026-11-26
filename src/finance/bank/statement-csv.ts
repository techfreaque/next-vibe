import { readBankCsvColumns, readMappedRecord } from "./csv";
import {
  statementAmount,
  statementCurrency,
  statementDate,
  type StatementRows,
  type StatementSourceRow,
} from "./statement-format";

export const statementColumns = [
  "id",
  "date",
  "valueDate",
  "amount",
  "currency",
  "nativeAmount",
  "nativeCurrency",
  "feeAmount",
  "feeCurrency",
  "description",
  "counterparty",
  "counterpartyIban",
  "status",
] as const;
type Column = (typeof statementColumns)[number];
export type StatementMapping = Partial<Record<Column, number>>;

const c24Headers: Record<Column, readonly string[]> = {
  id: ["Transaktions-ID", "Umsatz-ID", "Bankreferenz", "Referenznummer"],
  date: ["Buchungstag", "Buchungsdatum", "Datum"],
  valueDate: ["Wertstellung", "Valutadatum", "Wertstellungsdatum"],
  amount: ["Betrag", "Betrag (€)", "Betrag (EUR)"],
  currency: ["Währung", "Kontowährung"],
  nativeAmount: ["Originalbetrag", "Fremdwährungsbetrag"],
  nativeCurrency: ["Originalwährung", "Fremdwährung"],
  feeAmount: ["Gebühr", "Entgelt"],
  feeCurrency: ["Gebührenwährung"],
  description: ["Verwendungszweck", "Buchungstext", "Beschreibung"],
  counterparty: [
    "Auftraggeber/Empfänger",
    "Name",
    "Zahlungspartner",
    "Empfänger/Auftraggeber",
  ],
  counterpartyIban: [
    "IBAN",
    "IBAN Zahlungspartner",
    "IBAN Auftraggeber/Empfänger",
  ],
  status: [],
};

const revolutHeaders: Record<Column, readonly string[]> = {
  id: ["Transaction ID", "ID", "Reference", "Transaktions-ID"],
  date: ["Completed Date", "Date", "Abschlussdatum"],
  valueDate: ["Value Date", "Wertstellung"],
  amount: ["Amount", "Betrag"],
  currency: ["Currency", "Währung"],
  nativeAmount: ["Original Amount", "Native Amount", "Originalbetrag"],
  nativeCurrency: ["Original Currency", "Native Currency", "Originalwährung"],
  feeAmount: ["Fee", "Fees", "Gebühr"],
  feeCurrency: ["Fee Currency", "Gebührenwährung"],
  description: ["Description", "Beschreibung"],
  counterparty: ["Counterparty", "Merchant", "Zahlungspartner"],
  counterpartyIban: ["Counterparty IBAN", "Beneficiary IBAN", "IBAN"],
  status: ["State", "Status"],
};

const businessHeaders: Record<Column, readonly string[]> = {
  ...revolutHeaders,
  date: [
    "Date completed (UTC)",
    "Completed Date",
    "Completed at",
    "Abschlussdatum",
  ],
  currency: ["Payment currency", "Account currency", "Currency", "Währung"],
  id: ["Transaction ID", "ID", "Transaction reference", "Reference"],
  counterparty: ["Counterparty", "Payer", "Beneficiary", "Merchant"],
};

export function parseStatementCsv(
  raw: string,
  options: {
    preset: "c24" | "revolut" | "revolutBusiness" | "mapped";
    mapping?: StatementMapping;
    separator: "," | ";";
    decimal: "," | ".";
    accountCurrency?: string;
  },
): StatementRows {
  const source = readBankCsvColumns(raw, options.separator, 2);
  if (!source.success) {
    return source;
  }

  const mapping = { ...options.mapping };
  const aliases =
    options.preset === "c24"
      ? c24Headers
      : options.preset === "revolutBusiness"
        ? businessHeaders
        : revolutHeaders;
  if (options.preset !== "mapped") {
    for (const key of statementColumns) {
      const index = source.headers.findIndex((header) =>
        aliases[key].some(
          (label) => label.toLowerCase() === header.trim().toLowerCase(),
        ),
      );
      if (index >= 0 && mapping[key] === undefined) {
        mapping[key] = index;
      }
    }
  }
  const configured = Object.values(mapping);
  if (
    mapping.date === undefined ||
    mapping.amount === undefined ||
    (mapping.currency === undefined && !options.accountCurrency) ||
    new Set(configured).size !== configured.length ||
    configured.some(
      (index) =>
        !Number.isInteger(index) || index < 0 || index >= source.headers.length,
    )
  ) {
    return { success: false, error: "header" };
  }

  const rows: StatementSourceRow[] = [];
  for (const [index, record] of source.records.entries()) {
    const fields = readMappedRecord(record, source.separator);
    if (!fields || fields.length !== source.headers.length) {
      return { success: false, error: "row", row: index + 2 };
    }
    const field = (column: Column): string | undefined =>
      fields[mapping[column] ?? -1]?.trim() || undefined;
    if (
      (options.preset === "revolut" || options.preset === "revolutBusiness") &&
      mapping.status !== undefined
    ) {
      const status = field("status")?.toUpperCase();
      if (status !== "COMPLETED" && status !== "ABGESCHLOSSEN") {
        continue;
      }
    }
    const bookedDate = statementDate(field("date"));
    const valueDate = statementDate(field("valueDate"));
    const amount = statementAmount(field("amount") ?? "", options.decimal);
    const currency = statementCurrency(
      field("currency") ?? options.accountCurrency,
    );
    const nativeField = field("nativeAmount");
    const nativeCurrencyField = field("nativeCurrency");
    const nativeAmount = nativeField
      ? statementAmount(nativeField, options.decimal)
      : undefined;
    const nativeCurrency = statementCurrency(nativeCurrencyField);
    const feeField = field("feeAmount");
    const hasFee =
      feeField !== undefined && !/^[+-]?0+(?:[,.]0+)?$/u.test(feeField);
    const parsedFee = hasFee
      ? statementAmount(feeField, options.decimal)
      : undefined;
    const feeAmount =
      parsedFee && options.preset !== "mapped" && !parsedFee.startsWith("-")
        ? `-${parsedFee}`
        : parsedFee;
    const feeCurrency = feeAmount
      ? statementCurrency(
          field("feeCurrency") ??
            (options.preset === "mapped" ? undefined : currency),
        )
      : undefined;
    if (
      !bookedDate ||
      !amount ||
      !currency ||
      (field("valueDate") && !valueDate) ||
      ((nativeField || nativeCurrencyField) &&
        (!nativeAmount || !nativeCurrency)) ||
      (hasFee && (!feeAmount || !feeCurrency))
    ) {
      return { success: false, error: "row", row: index + 2 };
    }
    rows.push({
      transactionId: field("id"),
      bookedDate,
      valueDate,
      amount,
      currency,
      nativeAmount:
        nativeAmount &&
        amount.startsWith("-") &&
        options.preset !== "mapped" &&
        !nativeAmount.startsWith("-")
          ? `-${nativeAmount}`
          : nativeAmount,
      nativeCurrency,
      feeAmount,
      feeCurrency,
      description: field("description"),
      counterparty: field("counterparty"),
      counterpartyIban: field("counterpartyIban"),
    });
  }
  return rows.length
    ? { success: true, rows }
    : { success: false, error: "empty" };
}
