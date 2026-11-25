import { expect, it } from "bun:test";

import {
  BANK_STATEMENT_CSV_LIMIT,
  BANK_STATEMENT_HEADER,
  BANK_STATEMENT_ROW_LIMIT,
  mapBankCsvColumns,
  parseBankStatementCsv,
  readBankCsvColumns,
} from "./csv";

it("parses quoted normalized CSV scalars and keeps signed amounts exact", () => {
  const csv = `\uFEFF${BANK_STATEMENT_HEADER}\r\n"bank:1","2024-02-29","+0.0001","EUR"\r\nbank:2,2026-11-25,-9999999999.9999,EUR\r\n`;
  expect(parseBankStatementCsv(csv)).toEqual({
    success: true,
    skippedDuplicateRows: 0,
    rows: [
      {
        transactionId: "bank:1",
        bookedDate: "2024-02-29",
        amount: "0.0001",
        currency: "EUR",
      },
      {
        transactionId: "bank:2",
        bookedDate: "2026-11-25",
        amount: "-9999999999.9999",
        currency: "EUR",
      },
    ],
  });
});

it("skips exact in-file duplicates and reports conflicting records", () => {
  const first = `${BANK_STATEMENT_HEADER}\nbank:1,2026-11-25,+15.5,EUR`;
  expect(
    parseBankStatementCsv(`${first}\nbank:1,2026-11-25,15.5000,EUR`),
  ).toMatchObject({
    success: true,
    skippedDuplicateRows: 1,
  });
  expect(parseBankStatementCsv(`${first}\nbank:1,2026-11-26,15.5,EUR`)).toEqual(
    {
      success: false,
      error: "duplicate",
      row: 3,
    },
  );
});

it("rejects wrong headers, invalid dates and amounts, and oversized UTF-8 CSV", () => {
  expect(
    parseBankStatementCsv(
      "transactionId;date;amount;currency\nabc;2026-01-01;1;EUR",
    ),
  ).toEqual({
    success: false,
    error: "header",
  });
  expect(parseBankStatementCsv(BANK_STATEMENT_HEADER)).toEqual({
    success: false,
    error: "empty",
  });
  for (const row of [
    "abc,2026-02-29,1,EUR",
    "abc,0000-01-01,1,EUR",
    "abc\r,2026-11-25,1,EUR",
    "abc,2026-11-25,1e9,EUR",
    "abc,2026-11-25,1.00001,EUR",
    "abc,2026-11-25,-0.00,EUR",
    "abc,2026-11-25,10000000000,EUR",
    "abc,2026-11-25,5,eur",
    "abc,2026-11-25,5,EUR,extra",
    '"abc,quote",2026-11-25,5,EUR',
  ]) {
    expect(parseBankStatementCsv(`${BANK_STATEMENT_HEADER}\n${row}`)).toEqual({
      success: false,
      error: "row",
      row: 2,
    });
  }
  expect(
    parseBankStatementCsv("Ż".repeat(BANK_STATEMENT_CSV_LIMIT / 2 + 1)),
  ).toEqual({
    success: false,
    error: "size",
  });
  const tooMany = "bank:1,2026-01-01,1,EUR\n".repeat(
    BANK_STATEMENT_ROW_LIMIT + 1,
  );
  expect(parseBankStatementCsv(`${BANK_STATEMENT_HEADER}\n${tooMany}`)).toEqual(
    {
      success: false,
      error: "size",
    },
  );
});

it("maps named CSV columns without changing values or collapsing duplicate counts", () => {
  const source = readBankCsvColumns(
    'Amount,Reference,ISO,Booking,Memo\n"125.3456",wire-1,EUR,2026-11-25,"Parts, freight"\n+125.3456,wire-1,EUR,2026-11-25,',
  );
  expect(source.success).toBe(true);
  if (!source.success) return;
  const mapped = mapBankCsvColumns(source, {
    amount: 0,
    transactionId: 1,
    currency: 2,
    date: 3,
  });
  expect(mapped).toMatchObject({
    success: true,
    rows: [
      {
        transactionId: "wire-1",
        bookedDate: "2026-11-25",
        amount: "125.3456",
        currency: "EUR",
      },
    ],
  });
  if (mapped.success) {
    expect(parseBankStatementCsv(mapped.csv)).toMatchObject({
      skippedDuplicateRows: 1,
    });
  }
});

it("reports source rows and mapped fields for malformed input and preserves strict conflict checks", () => {
  const mapping = { amount: 0, transactionId: 1, currency: 2, date: 3 };
  const header = "Amount,Reference,ISO,Booking,Notes";
  const cases = [
    {
      text: "1,ref,EUR,11/25/2026,note",
      error: "value",
      field: "date",
      row: 2,
    },
    {
      text: '"1,23",ref,EUR,2026-11-25,note',
      error: "value",
      field: "amount",
      row: 2,
    },
    { text: "1,ref,EUR,2026-11-25", error: "columns", row: 2 },
    {
      text: "1,ref,EUR,2026-11-25,note\n2,ref,EUR,2026-11-25,note",
      error: "duplicate",
      row: 3,
    },
  ];
  for (const { text, ...expected } of cases) {
    const source = readBankCsvColumns(`${header}\n${text}`);
    expect(source.success).toBe(true);
    if (source.success)
      expect(mapBankCsvColumns(source, mapping)).toMatchObject({
        success: false,
        ...expected,
      });
  }
});

it("maps explicit semicolon, decimal comma and dotted day-first dates to canonical CSV", () => {
  const source = readBankCsvColumns(
    "Ref;Booked;Value;ISO\nwire-1;25.11.2026;-71,25;EUR",
    ";",
  );
  const mapping = { transactionId: 0, date: 1, amount: 2, currency: 3 };
  expect(source.success).toBe(true);
  if (!source.success) return;
  expect(mapBankCsvColumns(source, mapping, "EUR")).toEqual({
    success: true,
    csv: `${BANK_STATEMENT_HEADER}\nwire-1,2026-11-25,-71.25,EUR`,
    rows: [
      {
        transactionId: "wire-1",
        bookedDate: "2026-11-25",
        amount: "-71.2500",
        currency: "EUR",
      },
    ],
  });
  expect(mapBankCsvColumns(source, mapping, "PLN")).toMatchObject({
    success: false,
    error: "currency",
    row: 2,
  });
  const grouped = readBankCsvColumns(
    "Ref;Booked;Value;ISO\nwire-1;25.11.2026;1.099,20;EUR",
    ";",
  );
  const invalidDate = readBankCsvColumns(
    "Ref;Booked;Value;ISO\nwire-1;31.02.2026;9,20;EUR",
    ";",
  );
  if (grouped.success)
    expect(mapBankCsvColumns(grouped, mapping)).toMatchObject({
      success: false,
      error: "value",
      field: "amount",
    });
  if (invalidDate.success)
    expect(mapBankCsvColumns(invalidDate, mapping)).toMatchObject({
      success: false,
      error: "value",
      field: "date",
    });
});
