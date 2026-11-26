import { describe, expect, it } from "bun:test";

import {
  BALANCE_SHEET_LINE_IDS,
  buildMujStatement,
  type LedgerAccountBalance,
  PROFIT_LOSS_LINE_IDS,
  type StatementPeriodInput,
  syntheticAccount,
} from "./layout";

const U = 10_000;

function account(
  code: string,
  type: string,
  amount: number,
): LedgerAccountBalance {
  return { code, name: `Account ${code}`, type, units: amount * U };
}

/**
 * Balanced sample year: capital 5,000 paid to the bank, services sold
 * 10,000 + 23 % VAT, goods sold 2,000 (cost 1,200), input VAT on 3,000
 * services, wages 2,500 with insurance, depreciation 400, interest 50,
 * income tax 380, a customer prepayment on 324 and an overpaid supplier.
 */
const movements: LedgerAccountBalance[] = [
  account("602", "REVENUE", -10_000),
  account("604", "REVENUE", -2_000),
  account("662", "REVENUE", -20),
  account("504", "EXPENSE", 1_200),
  account("518", "EXPENSE", 2_400),
  account("518.1", "EXPENSE", 600),
  account("521", "EXPENSE", 2_500),
  account("524", "EXPENSE", 880),
  account("551", "EXPENSE", 400),
  account("562", "EXPENSE", 50),
  account("591", "EXPENSE", 380),
];

const balances: LedgerAccountBalance[] = [
  ...movements,
  account("411", "EQUITY", -5_000),
  account("022", "ASSET", 2_000),
  account("082", "ASSET", -400),
  account("132", "ASSET", 800),
  account("311", "ASSET", 4_000),
  account("321", "LIABILITY", 150),
  account("324", "LIABILITY", -300),
  account("343.1", "ASSET", 690),
  account("343.2", "LIABILITY", -2_760),
  account("341", "LIABILITY", -380),
  account("331", "LIABILITY", -1_800),
  account("336", "LIABILITY", -900),
  account("211", "ASSET", 210),
  account("221", "ASSET", 10_000),
  account("562", "EXPENSE", 0),
  // Customer card payouts in transit, then the residual that balances the sample.
  account("261", "ASSET", 0),
  account("461", "LIABILITY", -2_000),
  account("315", "ASSET", -700),
];

const empty: StatementPeriodInput = { balances: [], movements: [] };

function sumUnits(rows: readonly LedgerAccountBalance[]): number {
  return rows.reduce((sum, row) => sum + row.units, 0);
}

function line(
  statement: ReturnType<typeof buildMujStatement>,
  id: string,
): number {
  const row = [...statement.balanceSheet, ...statement.profitLoss].find(
    (item) => item.id === id,
  );
  return (row?.current ?? Number.NaN) / U;
}

describe("buildMujStatement", () => {
  it("uses the official row numbers", () => {
    const statement = buildMujStatement(empty, empty);
    expect(statement.balanceSheet.map((row) => row.id)).toEqual([
      ...BALANCE_SHEET_LINE_IDS,
    ]);
    expect(statement.profitLoss.map((row) => row.id)).toEqual([
      ...PROFIT_LOSS_LINE_IDS,
    ]);
    expect(statement.balanceSheet.at(-1)?.row).toBe(45);
    expect(statement.balanceSheet.find((row) => row.id === "bs24")?.row).toBe(
      24,
    );
    expect(statement.profitLoss.at(-1)?.row).toBe(38);
  });

  it("maps a balanced sample to equal assets and liabilities", () => {
    expect(sumUnits(balances)).toBe(0);
    const statement = buildMujStatement(
      { balances, movements },
      { balances: [], movements: [] },
    );

    // Výkaz ziskov a strát
    expect(line(statement, "pl02")).toBe(2_000);
    expect(line(statement, "pl03")).toBe(10_000);
    expect(line(statement, "pl01")).toBe(12_000);
    expect(line(statement, "pl09")).toBe(1_200);
    expect(line(statement, "pl11")).toBe(3_000);
    expect(line(statement, "pl12")).toBe(3_380);
    expect(line(statement, "pl14")).toBe(400);
    expect(line(statement, "pl08")).toBe(7_980);
    expect(line(statement, "pl18")).toBe(4_020);
    expect(line(statement, "pl19")).toBe(7_800);
    expect(line(statement, "pl24")).toBe(20);
    expect(line(statement, "pl31")).toBe(50);
    expect(line(statement, "pl34")).toBe(-30);
    expect(line(statement, "pl35")).toBe(3_990);
    expect(line(statement, "pl36")).toBe(380);
    expect(line(statement, "pl38")).toBe(3_610);

    // Súvaha
    expect(line(statement, "bs06")).toBe(1_600);
    expect(line(statement, "bs02")).toBe(1_600);
    expect(line(statement, "bs15")).toBe(800);
    // 311 4,000 + overpaid supplier 150 on 321.
    expect(line(statement, "bs18")).toBe(4_150);
    // 315 has a credit balance and becomes a trade payable with 324.
    expect(line(statement, "bs39")).toBe(1_000);
    // 343 is netted: 2,760 output VAT minus 690 input VAT, plus 341.
    expect(line(statement, "bs41")).toBe(2_450);
    expect(line(statement, "bs19")).toBe(0);
    expect(line(statement, "bs40")).toBe(2_700);
    expect(line(statement, "bs22")).toBe(10_210);
    expect(line(statement, "bs27")).toBe(5_000);
    expect(line(statement, "bs33")).toBe(3_610);
    expect(line(statement, "bs37")).toBe(2_000);
    expect(line(statement, "bs01")).toBe(16_760);
    expect(line(statement, "bs24")).toBe(16_760);
    expect(statement.difference.current).toBe(0);
    expect(statement.unmapped).toEqual([]);
  });

  it("reports unmapped accounts and the resulting difference", () => {
    const statement = buildMujStatement(
      {
        balances: [
          account("221", "ASSET", 100),
          account("CASH-DEFAULT", "ASSET", 50),
          account("411", "EQUITY", -150),
          account("697", "REVENUE", 0),
        ],
        movements: [account("664", "REVENUE", -70)],
      },
      { balances: [account("701", "EQUITY", 25)], movements: [] },
    );
    expect(statement.difference.current / U).toBe(-50);
    expect(statement.difference.previous / U).toBe(0);
    expect(
      statement.unmapped.map(({ code, statement: kind, current, previous }) => ({
        code,
        kind,
        current: current / U,
        previous: previous / U,
      })),
    ).toEqual([
      { code: "701", kind: "balanceSheet", current: 0, previous: 25 },
      { code: "CASH-DEFAULT", kind: "balanceSheet", current: 50, previous: 0 },
      { code: "664", kind: "profitLoss", current: -70, previous: 0 },
    ]);
  });

  it("fills the previous period column", () => {
    const statement = buildMujStatement(empty, {
      balances: [account("221", "ASSET", 300), account("411", "EQUITY", -300)],
      movements: [account("602", "REVENUE", -40)],
    });
    expect(
      statement.balanceSheet.find((row) => row.id === "bs22")?.previous,
    ).toBe(300 * U);
    expect(
      statement.profitLoss.find((row) => row.id === "pl03")?.previous,
    ).toBe(40 * U);
  });

  it("reads synthetic accounts from analytic codes", () => {
    expect(syntheticAccount("343.1")).toBe("343");
    expect(syntheticAccount("311")).toBe("311");
    expect(syntheticAccount("3")).toBeUndefined();
    expect(syntheticAccount("BANK-DEFAULT")).toBeUndefined();
  });
});
