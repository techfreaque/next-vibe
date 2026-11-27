import { describe, expect, it } from "bun:test";

import { AccountSubtype, AccountType } from "../../enum";
import { buildCountryStatutoryStatement } from "./country-layouts";

describe("Country statutory statement layouts (DE HGB, AT UGB, IFRS)", () => {
  const current = {
    balances: [
      {
        code: "1200",
        name: "Bank",
        type: AccountType.ASSET,
        subtype: AccountSubtype.BANK,
        units: 120_000_000, // 12,000.00
      },
      {
        code: "1400",
        name: "Receivables",
        type: AccountType.ASSET,
        subtype: AccountSubtype.ACCOUNTS_RECEIVABLE,
        units: 30_000_000, // 3,000.00
      },
      {
        code: "0800",
        name: "Share Capital",
        type: AccountType.EQUITY,
        subtype: AccountSubtype.SHARE_CAPITAL,
        units: -100_000_000, // 10,000.00 credit
      },
      {
        code: "1600",
        name: "Payables",
        type: AccountType.LIABILITY,
        subtype: AccountSubtype.ACCOUNTS_PAYABLE,
        units: -20_000_000, // 2,000.00 credit
      },
      {
        code: "8400",
        name: "Revenue",
        type: AccountType.REVENUE,
        subtype: AccountSubtype.REVENUE_SERVICE,
        units: -50_000_000, // 5,000.00 credit
      },
      {
        code: "4980",
        name: "Expenses",
        type: AccountType.EXPENSE,
        subtype: AccountSubtype.OPEX,
        units: 20_000_000, // 2,000.00 debit
      },
    ],
    movements: [
      {
        code: "8400",
        name: "Revenue",
        type: AccountType.REVENUE,
        subtype: AccountSubtype.REVENUE_SERVICE,
        units: -50_000_000,
      },
      {
        code: "4980",
        name: "Expenses",
        type: AccountType.EXPENSE,
        subtype: AccountSubtype.OPEX,
        units: 20_000_000,
      },
    ],
  };

  it.each(["DE_HGB", "AT_UGB", "IFRS"] as const)(
    "produces balanced balance sheet and income statement for %s",
    (layout) => {
      const stmt = buildCountryStatutoryStatement(layout, current, {
        balances: [],
        movements: [],
      });
      expect(stmt.difference.current).toBe(0);
      expect(stmt.difference.previous).toBe(0);
      const totalAssets = stmt.balanceSheet.find(
        (l) => l.id === "bs_assets_total",
      );
      const totalPassiva = stmt.balanceSheet.find(
        (l) => l.id === "bs_liab_total",
      );
      const netProfit = stmt.profitLoss.find((l) => l.id === "pl_net");
      expect(totalAssets?.current).toBe(150_000_000);
      expect(totalPassiva?.current).toBe(150_000_000);
      expect(netProfit?.current).toBe(30_000_000);
    },
  );
});
