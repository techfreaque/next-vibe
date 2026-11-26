export interface SupplierDocument {
  reference: string;
  date: string;
  currency: string;
  grossAmount: string;
  taxAmount: string;
}

export type SupplierReceipt = Omit<SupplierDocument, "taxAmount">;

export type Extraction =
  | { document: SupplierDocument; issue: null }
  | {
      document: null;
      issue: "missingFields" | "conflictingDocuments";
      receipt?: SupplierReceipt;
      taxUndisclosed?: boolean;
    };

const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

function fieldValues(lines: readonly string[], names: string): string[] {
  const pattern = new RegExp(`^(?:${names})(?:\\s*[:#]\\s*|\\s+|$)(.*)$`, "i");
  return lines.flatMap((line, index) => {
    const match = pattern.exec(line);
    const value = match && (match[1]?.trim() || lines[index + 1]);
    return value ? [value] : [];
  });
}

function field(lines: readonly string[], names: string): string | undefined {
  return fieldValues(lines, names)[0];
}

function documentDay(input: string): string | undefined {
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input);
  let year = Number(iso?.[1]);
  let month = Number(iso?.[2]);
  let day = Number(iso?.[3]);
  if (!iso) {
    const american = /^([a-z]+) (\d{1,2}),? (\d{4})$/i.exec(input);
    const international = /^(\d{1,2}) ([a-z]+) (\d{4})$/i.exec(input);
    const label = american?.[1] ?? international?.[2];
    if (!label) {
      return undefined;
    }
    month =
      months.findIndex(
        (value) =>
          value === label.toLowerCase() ||
          value.slice(0, 3) === label.toLowerCase(),
      ) + 1;
    day = Number(american?.[2] ?? international?.[1]);
    year = Number(american?.[3] ?? international?.[3]);
  }
  if (
    !(
      year >= 1900 &&
      year <= 2100 &&
      month >= 1 &&
      month <= 12 &&
      day >= 1 &&
      day <= 31
    )
  ) {
    return undefined;
  }
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCDate() === day
    ? date.toISOString().slice(0, 10)
    : undefined;
}

function decimal(input: string): string | undefined {
  const western = /^\d{1,3}(?:,\d{3})+(?:\.\d{1,4})?$/.test(input);
  const european = /^\d{1,3}(?:\.\d{3})+,\d{1,4}$/.test(input);
  const normalized = western
    ? input.replaceAll(",", "")
    : european
      ? input.replaceAll(".", "").replace(",", ".")
      : /^\d+,\d{1,2}$/.test(input)
        ? input.replace(",", ".")
        : input;
  if (/^\d{1,3},\d{3}$/.test(input)) {
    return undefined;
  }
  if (!/^\d{1,12}(?:\.\d{1,4})?$/.test(normalized)) {
    return undefined;
  }
  const [whole, fraction = ""] = normalized.split(".");
  return `${whole}.${fraction.padEnd(4, "0")}`;
}

function money(
  input: string,
  knownCurrency?: string,
): { currency: string; amount: string } | undefined {
  const standardized = input.trim().replaceAll(/[\u00a0\u202f]/g, " ");
  const explicit = /(?:^|\s)([A-Z]{3})(?=$|\s)/.exec(standardized)?.[1];
  const symbol = /[€£¥$]/.exec(standardized)?.[0];
  const symbolCurrency =
    symbol === "€" ? "EUR" : symbol === "£" ? "GBP" : undefined;
  const currency = explicit ?? symbolCurrency ?? knownCurrency;
  if (
    !currency ||
    (explicit && symbolCurrency && explicit !== symbolCurrency)
  ) {
    return undefined;
  }
  if (
    symbol === "$" &&
    !["USD", "CAD", "AUD", "NZD", "SGD", "HKD"].includes(currency)
  ) {
    return undefined;
  }
  if (symbol === "¥" && currency !== "JPY" && currency !== "CNY") {
    return undefined;
  }
  const amount = decimal(
    standardized
      .replace(/(?:^|\s)[A-Z]{3}(?=$|\s)/, "")
      .replaceAll(/[€£¥$]/g, "")
      .replaceAll(" ", ""),
  );
  return amount ? { currency, amount } : undefined;
}

function invoiceReceipt(
  lines: readonly string[],
  nativeCurrency?: string,
): SupplierReceipt | undefined {
  const invoice = field(lines, "Invoice (?:number|no\\.?|#)");
  const reference = invoice ?? field(lines, "Receipt (?:number|no\\.?|#)");
  const rawDate =
    field(
      lines,
      "Invoice date|Date issued|Date of issue|Payment date|Paid on",
    ) ?? field(lines, "Date");
  const date = rawDate && documentDay(rawDate);
  const total =
    field(lines, "Grand total|Invoice total|Total paid|Amount paid") ??
    field(lines, "Total");
  const parsedGross = total && money(total, nativeCurrency);
  if (
    !reference ||
    !/^[A-Za-z0-9][A-Za-z0-9_/-]{1,79}$/.test(reference) ||
    !date ||
    !parsedGross ||
    (nativeCurrency && parsedGross.currency !== nativeCurrency) ||
    toUnits(parsedGross.amount) <= BigInt(0)
  ) {
    return undefined;
  }
  return {
    reference,
    date,
    currency: parsedGross.currency,
    grossAmount: parsedGross.amount,
  };
}

function openRouterReceipt(
  lines: readonly string[],
  nativeCurrency?: string,
): SupplierReceipt | undefined {
  // The provider repeats its heading and prints the reference on the same line.
  // The date and gross amount follow their own labels.
  const references = new Set(
    lines.flatMap((line) => {
      const match =
        /^Receipt\b[^#]{0,100}\bReceipt\s+#\s*([A-Z0-9][A-Z0-9_/-]{1,79})$/i.exec(
          line,
        );
      return match?.[1] ? [match[1]] : [];
    }),
  );
  const [reference] = references;
  if (!reference || references.size !== 1) {
    return undefined;
  }
  const paid = field(lines, "Amount paid");
  const gross = paid && money(paid, nativeCurrency);
  const dateValue = field(lines, "Date paid");
  const displayedDate = dateValue?.replace(
    /(?:,\s+|\s+at\s+)\d{1,2}:\d{2}:\d{2}(?:\s+[AP]M)?(?:\s+(?:UTC|GMT|ET|PT|PST|PDT|EST|EDT))?$/i,
    "",
  );
  const date = displayedDate && documentDay(displayedDate);
  if (
    !gross ||
    !date ||
    (nativeCurrency && gross.currency !== nativeCurrency) ||
    BigInt(gross.amount.replace(".", "")) <= BigInt(0)
  ) {
    return undefined;
  }
  return {
    reference,
    date,
    currency: gross.currency,
    grossAmount: gross.amount,
  };
}

function toUnits(amount: string): bigint {
  return BigInt(amount.replace(".", ""));
}

function documentWithTax(
  lines: readonly string[],
  receipt: SupplierReceipt,
): SupplierDocument | undefined {
  const rawTax = field(
    lines,
    "Total tax|Sales tax|Tax amount|Tax|VAT amount|VAT",
  );
  const tax = rawTax && money(rawTax, receipt.currency);
  if (!tax || tax.currency !== receipt.currency) {
    return undefined;
  }
  if (toUnits(tax.amount) > toUnits(receipt.grossAmount)) {
    return undefined;
  }
  const rawSubtotal = field(lines, "Subtotal");
  const subtotal = rawSubtotal && money(rawSubtotal, receipt.currency);
  if (
    rawSubtotal &&
    (!subtotal ||
      subtotal.currency !== receipt.currency ||
      toUnits(subtotal.amount) + toUnits(tax.amount) !==
        toUnits(receipt.grossAmount))
  ) {
    return undefined;
  }
  return { ...receipt, taxAmount: tax.amount };
}

export function extractSupplierDocument(
  texts: readonly string[],
  nativeCurrency?: string,
  provider?: "openRouter",
): Extraction {
  const ambiguousFields = [
    "Invoice (?:number|no\\.?|#)",
    "Receipt (?:number|no\\.?|#)",
    "Invoice date|Date issued|Date of issue|Payment date|Paid on|Date paid",
    "Grand total|Invoice total|Total paid|Amount paid",
    "Total(?=\\s*[:#]|\\s+(?:[A-Z]{3}\\s|[$£€¥0-9]))",
    "Total tax|Sales tax|Tax amount|Tax|VAT amount|VAT",
    "Subtotal",
  ];
  let ambiguous = false;
  let hasOpenRouterReceipt = false;
  let taxDisclosed = false;
  const receipts: SupplierReceipt[] = [];
  const candidates = texts.flatMap((text) => {
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    if (
      lines.some((line) =>
        /^(?:tax )?(?:credit note|credit memo|refund receipt)\b/i.test(line),
      ) ||
      ambiguousFields.some(
        (names) =>
          new Set(fieldValues(lines, names).map((value) => value.toUpperCase()))
            .size > 1,
      )
    ) {
      ambiguous = true;
      return [];
    }
    const openRouter =
      provider === "openRouter"
        ? openRouterReceipt(lines, nativeCurrency)
        : undefined;
    const receipt = openRouter ?? invoiceReceipt(lines, nativeCurrency);
    hasOpenRouterReceipt ||= Boolean(openRouter);
    taxDisclosed ||= lines.some((line) =>
      /^(?:total tax|sales tax|tax amount|tax|vat amount|vat)(?!\s+(?:id|number|registration)\b)(?:\s|:|#|$)/i.test(
        line,
      ),
    );
    if (receipt) {
      receipts.push(receipt);
    }
    const extracted = receipt && documentWithTax(lines, receipt);
    return extracted ? [extracted] : [];
  });
  const [first] = candidates;
  const receipt = first ?? receipts[0];
  if (ambiguous) {
    return { document: null, issue: "conflictingDocuments" };
  }
  if (!receipt) {
    return { document: null, issue: "missingFields" };
  }
  const sameReceipt = (candidate: SupplierReceipt): boolean =>
    candidate.reference.toUpperCase() === receipt.reference.toUpperCase() &&
    candidate.date === receipt.date &&
    candidate.currency === receipt.currency &&
    candidate.grossAmount === receipt.grossAmount;
  if (
    receipts.some((candidate) => !sameReceipt(candidate)) ||
    candidates.some(
      (candidate) =>
        !sameReceipt(candidate) || candidate.taxAmount !== first?.taxAmount,
    )
  ) {
    return { document: null, issue: "conflictingDocuments" };
  }
  return first
    ? { document: first, issue: null }
    : {
        document: null,
        issue: "missingFields",
        receipt,
        ...(hasOpenRouterReceipt && !taxDisclosed
          ? { taxUndisclosed: true }
          : {}),
      };
}
