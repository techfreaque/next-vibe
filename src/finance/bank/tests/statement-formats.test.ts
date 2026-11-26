import { describe, expect, it } from "vitest";

import { parseStatementFile } from "../statement-file";
import { normalizedStatementRowsSchema } from "../statement-format";
import { keyStatementRows } from "../statement-identity";

describe("bank statement interchange", () => {
  it("reads C24 dates, decimal commas, and values with grouping separators", () => {
    const source =
      "Buchungstag;Wertstellung;Betrag;Verwendungszweck;Zahlungspartner\n25.11.2026;26.11.2026;-1.250,35;Rechnung 8;Lieferant";
    expect(parseStatementFile(source, "c24")).toMatchObject({
      success: true,
      rows: [
        {
          bookedDate: "2026-11-25",
          valueDate: "2026-11-26",
          amount: "-1250.3500",
          currency: "EUR",
          description: "Rechnung 8",
        },
      ],
    });
  });

  it("keeps Revolut personal fees and filters unfinished activity", () => {
    const text =
      "Type,Completed Date,Description,Amount,Fee,Currency,State\nCARD_PAYMENT,2026-11-25 11:04:22,Hosting,-18.90,1.00,EUR,COMPLETED\nTRANSFER,,Unfinished,-5,0,EUR,PENDING";
    expect(parseStatementFile(text, "revolut")).toMatchObject({
      success: true,
      rows: [
        {
          bookedDate: "2026-11-25",
          amount: "-18.9000",
          currency: "EUR",
          feeAmount: "-1.0000",
          feeCurrency: "EUR",
        },
      ],
    });
  });

  it("keeps Revolut Business booked and original amounts separate", () => {
    const raw =
      "ID,Date completed (UTC),Payment currency,Amount,Original currency,Original amount,Fee,State\nABC,2026-11-25 08:24:02,EUR,-45.8012,USD,50.1234,0.2,COMPLETED";
    const result = parseStatementFile(raw, "revolutBusiness");
    expect(result).toMatchObject({
      success: true,
      rows: [
        {
          transactionId: "ABC",
          amount: "-45.8012",
          currency: "EUR",
          nativeAmount: "-50.1234",
          nativeCurrency: "USD",
          feeAmount: "-0.2000",
        },
      ],
    });
    if (result.success) {
      expect(normalizedStatementRowsSchema.safeParse(result.rows).success).toBe(
        true,
      );
    }
  });

  it("preserves CAMT amounts and rejects XML with declared external entities", () => {
    const xml =
      '<?xml version="1.0"?><Document xmlns="urn:iso:std:iso:20022:tech:xsd:camt.053.001.08"><BkToCstmrStmt><Stmt><Ntry><Amt Ccy="EUR">11.50</Amt><CdtDbtInd>DBIT</CdtDbtInd><Sts><Cd>BOOK</Cd></Sts><BookgDt><Dt>2026-11-25</Dt></BookgDt><AcctSvcrRef>bank-77</AcctSvcrRef><NtryDtls><TxDtls><AmtDtls><InstdAmt><Amt Ccy="USD">14.20</Amt></InstdAmt></AmtDtls><Chrgs><TtlChrgsAndTaxAmt Ccy="EUR">0.50</TtlChrgsAndTaxAmt></Chrgs><RmtInf><Ustrd>Hosting &amp; support</Ustrd></RmtInf></TxDtls></NtryDtls></Ntry></Stmt></BkToCstmrStmt></Document>';
    expect(parseStatementFile(xml, "camt053")).toMatchObject({
      success: true,
      rows: [
        {
          transactionId: "bank-77",
          bookedDate: "2026-11-25",
          amount: "-11.5000",
          nativeAmount: "-14.2000",
          nativeCurrency: "USD",
          feeAmount: "-0.5000",
          description: "Hosting & support",
        },
      ],
    });
    expect(
      parseStatementFile(
        `<!DOCTYPE Document [<!ENTITY a SYSTEM "ignored">]>${xml}`,
        "camt053",
      ),
    ).toEqual({ success: false, error: "header" });
  });

  it("reads MT940 book/value date rollover and bank reference", () => {
    const source =
      ":20:STMT1\n:25:1234\n:60F:C261231EUR100,00\n:61:2612310101D25,1234NTRFNONREF//BANK-42\n:86:Stock purchase\n:62F:C270101EUR74,8766";
    expect(parseStatementFile(source, "mt940")).toMatchObject({
      success: true,
      rows: [
        {
          transactionId: "BANK-42",
          bookedDate: "2027-01-01",
          valueDate: "2026-12-31",
          amount: "-25.1234",
          currency: "EUR",
          description: "Stock purchase",
        },
      ],
    });
  });

  it("uses a stable source ID and refuses indistinguishable no-ID rows", () => {
    const row = {
      bookedDate: "2026-11-25",
      currency: "EUR",
      amount: "-12.0000",
      description: "Hosting",
    };
    const first = keyStatementRows([row]);
    expect(first).toEqual(
      keyStatementRows([{ ...row, description: "  Hosting  " }]),
    );
    expect(keyStatementRows([row, row])).toEqual({ success: false, index: 1 });
    expect(
      keyStatementRows([
        { ...row, transactionId: "ID-1" },
        { ...row, transactionId: "ID-2" },
      ]),
    ).toMatchObject({ success: true, skipped: 0 });
  });
});
