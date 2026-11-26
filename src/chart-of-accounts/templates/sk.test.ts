import { describe, expect, it } from "bun:test";

import { AccountSubtype, AccountType } from "../enum";
import { templateAccountLabel } from "./labels";
import { skNodes } from "./sk";

/** Subtypes the auto-poster and setup resolve by subtype: one postable account each. */
const REQUIRED_SUBTYPES = [
  AccountSubtype.CASH,
  AccountSubtype.BANK,
  AccountSubtype.ACCOUNTS_RECEIVABLE,
  AccountSubtype.ACCOUNTS_PAYABLE,
  AccountSubtype.VAT_RECEIVABLE,
  AccountSubtype.VAT_PAYABLE,
  AccountSubtype.INVENTORY,
  AccountSubtype.PREPAID,
  AccountSubtype.REVENUE_SERVICE,
  AccountSubtype.REVENUE_SALES,
  AccountSubtype.COGS,
  AccountSubtype.OPEX,
  AccountSubtype.PAYROLL,
  AccountSubtype.RENT,
  AccountSubtype.UTILITIES,
  AccountSubtype.FINANCIAL_INCOME,
  AccountSubtype.FINANCIAL_EXPENSE,
  AccountSubtype.TAX_EXPENSE,
  AccountSubtype.SHARE_CAPITAL,
  AccountSubtype.RETAINED_EARNINGS,
] as const;

const EXPECTED_ACCOUNT: Record<(typeof REQUIRED_SUBTYPES)[number], string> = {
  [AccountSubtype.CASH]: "211",
  [AccountSubtype.BANK]: "221",
  [AccountSubtype.ACCOUNTS_RECEIVABLE]: "311",
  [AccountSubtype.ACCOUNTS_PAYABLE]: "321",
  [AccountSubtype.VAT_RECEIVABLE]: "343.1",
  [AccountSubtype.VAT_PAYABLE]: "343.2",
  [AccountSubtype.INVENTORY]: "132",
  [AccountSubtype.PREPAID]: "381",
  [AccountSubtype.REVENUE_SERVICE]: "602",
  [AccountSubtype.REVENUE_SALES]: "604",
  [AccountSubtype.COGS]: "504",
  [AccountSubtype.OPEX]: "518",
  [AccountSubtype.PAYROLL]: "521",
  [AccountSubtype.RENT]: "518.1",
  [AccountSubtype.UTILITIES]: "502",
  [AccountSubtype.FINANCIAL_INCOME]: "662",
  [AccountSubtype.FINANCIAL_EXPENSE]: "562",
  [AccountSubtype.TAX_EXPENSE]: "591",
  [AccountSubtype.SHARE_CAPITAL]: "411",
  [AccountSubtype.RETAINED_EARNINGS]: "428",
};

/** Class 2-4 accounts that sit on the other side of the balance sheet. */
const LIABILITY_EXCEPTIONS = new Set(["231", "232"]);

describe("SK chart of accounts template", () => {
  it("has unique codes", () => {
    const codes = skNodes.map((node) => node.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("references existing parents only", () => {
    const codes = new Set(skNodes.map((node) => node.code));
    for (const node of skNodes) {
      if (node.parentCode !== undefined) {
        expect(codes.has(node.parentCode)).toBe(true);
      }
    }
  });

  it("keeps class nodes and parents non-postable", () => {
    const parents = new Set(skNodes.map((node) => node.parentCode));
    for (const node of skNodes) {
      if (node.code.length === 1) {
        expect(node.isPostable).toBe(false);
        expect(node.parentCode).toBeUndefined();
      }
    }
    expect(skNodes.find((node) => node.code === "343")?.isPostable).toBe(
      false,
    );
    expect(parents.has("343")).toBe(true);
  });

  it("has unique, ascending sort orders", () => {
    const orders = skNodes.map((node) => node.sortOrder);
    expect(orders).toEqual(orders.toSorted((a, b) => a - b));
    expect(new Set(orders).size).toBe(orders.length);
  });

  it("has exactly one postable account per required subtype", () => {
    for (const subtype of REQUIRED_SUBTYPES) {
      const matches = skNodes.filter(
        (node) => node.isPostable && node.subtype === subtype,
      );
      expect({ subtype, codes: matches.map((node) => node.code) }).toEqual({
        subtype,
        codes: [EXPECTED_ACCOUNT[subtype]],
      });
    }
  });

  it("matches account types to the account class", () => {
    for (const node of skNodes) {
      const accountClass = node.code[0];
      const synthetic = node.code.split(".")[0];
      let expected: readonly string[];
      switch (accountClass) {
        case "0":
        case "1":
          expected = [AccountType.ASSET];
          break;
        case "2":
          expected = LIABILITY_EXCEPTIONS.has(synthetic)
            ? [AccountType.LIABILITY]
            : [AccountType.ASSET];
          break;
        case "3":
          expected = [AccountType.ASSET, AccountType.LIABILITY];
          break;
        case "4":
          expected =
            synthetic.startsWith("45") ||
            synthetic.startsWith("46") ||
            synthetic.startsWith("47")
              ? [AccountType.LIABILITY]
              : [AccountType.EQUITY];
          break;
        case "5":
          expected = [AccountType.EXPENSE];
          break;
        case "6":
          expected = [AccountType.REVENUE];
          break;
        default:
          expected = [AccountType.EQUITY];
      }
      expect(expected, node.code).toContain(node.type);
    }
  });

  it("books VAT on postable analytics of 343", () => {
    const input = skNodes.find((node) => node.code === "343.1");
    const output = skNodes.find((node) => node.code === "343.2");
    expect(input?.type).toBe(AccountType.ASSET);
    expect(output?.type).toBe(AccountType.LIABILITY);
    expect(input?.parentCode).toBe("343");
    expect(output?.parentCode).toBe("343");
  });
});

describe("templateAccountLabel", () => {
  it("translates untouched template names for other locales", () => {
    expect(templateAccountLabel("SK", "211", "Pokladnica", "en-GLOBAL")).toBe(
      "Cash on hand",
    );
    expect(templateAccountLabel("sk", "343.1", "DPH na vstupe", "de-DE")).toBe(
      "Vorsteuer",
    );
  });

  it("keeps the official name for Slovak viewers", () => {
    expect(templateAccountLabel("SK", "211", "Pokladnica", "sk-SK")).toBe(
      "Pokladnica",
    );
  });

  it("keeps renamed and foreign accounts as stored", () => {
    expect(
      templateAccountLabel("SK", "211", "Hlavná pokladnica", "en-GLOBAL"),
    ).toBe("Hlavná pokladnica");
    expect(templateAccountLabel("DE", "211", "Pokladnica", "en-GLOBAL")).toBe(
      "Pokladnica",
    );
    expect(templateAccountLabel("SK", "9999", "Custom", "en-GLOBAL")).toBe(
      "Custom",
    );
  });
});
