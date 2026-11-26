import { BANK_STATEMENT_CSV_LIMIT, BANK_STATEMENT_ROW_LIMIT } from "./csv";
import {
  statementAmount,
  statementCurrency,
  statementDate,
  type StatementRows,
  type StatementSourceRow,
} from "./statement-format";

function dated(value: string): string | undefined {
  const year = Number(value.slice(0, 2));
  return statementDate(
    `${year < 70 ? 2000 + year : 1900 + year}-${value.slice(2, 4)}-${value.slice(4, 6)}`,
  );
}

function bookedFromValueDate(
  valueDate: string,
  monthDay: string | undefined,
): string | undefined {
  if (!monthDay) {
    return valueDate;
  }
  const year = Number(valueDate.slice(0, 4));
  const adjust =
    valueDate.slice(5, 7) === "12" && monthDay.startsWith("01")
      ? 1
      : valueDate.slice(5, 7) === "01" && monthDay.startsWith("12")
        ? -1
        : 0;
  return statementDate(
    `${year + adjust}-${monthDay.slice(0, 2)}-${monthDay.slice(2, 4)}`,
  );
}

export function parseMt940(raw: string): StatementRows {
  if (new TextEncoder().encode(raw).length > BANK_STATEMENT_CSV_LIMIT) {
    return { success: false, error: "size" };
  }
  const rows: StatementSourceRow[] = [];
  let currency: string | undefined;
  let open: StatementSourceRow | undefined;
  for (const [index, line] of raw
    .replace(/^\uFEFF/u, "")
    .split(/\r?\n/u)
    .entries()) {
    if (/^:60[FM]:/u.test(line)) {
      currency = statementCurrency(
        /^:60[FM]:[CD]\d{6}([A-Z]{3})/u.exec(line)?.[1],
      );
      open = undefined;
    } else if (line.startsWith(":61:")) {
      const match =
        /^:61:(\d{6})(\d{4})?(RC|RD|C|D)[A-Z]?(\d{1,10},\d{0,4})[A-Z][A-Z0-9]{3}([^\r\n]*)$/u.exec(
          line,
        );
      const [, valueInput, bookingInput, sign, rawAmount, references = ""] =
        match ?? [];
      const valueDate = valueInput && dated(valueInput);
      const bookedDate =
        valueDate && bookedFromValueDate(valueDate, bookingInput);
      const amount =
        rawAmount &&
        statementAmount(
          `${sign === "D" || sign === "RC" ? "-" : ""}${rawAmount.replace(/,$/u, "")}`,
          ",",
        );
      const bankReference = references.split("//")[1]?.trim();
      if (!bookedDate || !valueDate || !amount || !currency) {
        return { success: false, error: "row", row: index + 1 };
      }
      open = {
        transactionId:
          bankReference && !/^(NONREF|NOTPROVIDED)$/iu.test(bankReference)
            ? bankReference
            : undefined,
        bookedDate,
        valueDate,
        amount,
        currency,
      };
      rows.push(open);
      if (rows.length > BANK_STATEMENT_ROW_LIMIT) {
        return { success: false, error: "size" };
      }
    } else if (line.startsWith(":86:") && open) {
      open.description = line.slice(4).trim();
    } else if (line && !line.startsWith(":") && open?.description) {
      open.description += ` ${line.trim()}`;
    }
  }
  return rows.length
    ? { success: true, rows }
    : { success: false, error: "empty" };
}
