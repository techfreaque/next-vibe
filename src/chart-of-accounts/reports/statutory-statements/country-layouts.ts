/**
 * Country-adapted statutory financial statement layouts for:
 * - DE_HGB: German § 266 HGB Balance Sheet & § 275 Abs. 2 HGB Income Statement
 * - AT_UGB: Austrian § 224 UGB Balance Sheet & § 231 UGB Income Statement
 * - IFRS: IAS 1 Statement of Financial Position & Statement of Profit or Loss
 *
 * Pure mapping from ledger account balances (debit minus credit in 1/10000 units)
 * using account type & subtype so every company gets an official statutory layout.
 */

import { AccountSubtype, AccountType } from "../../enum";
import type { LedgerAccountBalance, StatementLineKind } from "./layout";

export interface SubtypedAccountBalance extends LedgerAccountBalance {
  subtype: string;
}

export interface GenericPeriodInput {
  balances: readonly SubtypedAccountBalance[];
  movements: readonly SubtypedAccountBalance[];
}

export interface GenericStatementLine {
  id: string;
  row: number;
  marker: string;
  kind: StatementLineKind;
  label: string;
  officialLabel: string;
  current: number;
  previous: number;
}

export interface GenericStatutoryStatement {
  balanceSheet: GenericStatementLine[];
  profitLoss: GenericStatementLine[];
  difference: { current: number; previous: number };
}

export type NonSkStatementLayout = "DE_HGB" | "AT_UGB" | "IFRS";

interface PeriodBuckets {
  fixedAssets: number;
  inventory: number;
  receivables: number;
  prepaid: number;
  cashAndBank: number;
  otherCurrentAssets: number;
  totalAssets: number;
  shareCapital: number;
  retainedEarnings: number;
  periodResult: number;
  totalEquity: number;
  longTermDebt: number;
  payables: number;
  taxLiabilities: number;
  accruedLiabilities: number;
  shortTermDebt: number;
  otherLiabilities: number;
  totalLiabilities: number;
  totalEquityAndLiabilities: number;
  // P&L
  revenue: number;
  cogs: number;
  payroll: number;
  otherOpex: number;
  financialIncome: number;
  financialExpense: number;
  taxExpense: number;
  netResult: number;
}

function summarizePeriod(input: GenericPeriodInput): PeriodBuckets {
  let fixedAssets = 0;
  let inventory = 0;
  let receivables = 0;
  let prepaid = 0;
  let cashAndBank = 0;
  let otherCurrentAssets = 0;
  let shareCapital = 0;
  let retainedEarnings = 0;
  let unclosedPnl = 0;
  let longTermDebt = 0;
  let payables = 0;
  let taxLiabilities = 0;
  let accruedLiabilities = 0;
  let shortTermDebt = 0;
  let otherLiabilities = 0;

  for (const acct of input.balances) {
    const u = acct.units; // debit - credit
    if (acct.type === AccountType.ASSET) {
      switch (acct.subtype) {
        case AccountSubtype.FIXED_ASSET:
          fixedAssets += u;
          break;
        case AccountSubtype.INVENTORY:
          inventory += u;
          break;
        case AccountSubtype.ACCOUNTS_RECEIVABLE:
        case AccountSubtype.VAT_RECEIVABLE:
          receivables += u;
          break;
        case AccountSubtype.PREPAID:
          prepaid += u;
          break;
        case AccountSubtype.BANK:
        case AccountSubtype.CASH:
          cashAndBank += u;
          break;
        default:
          otherCurrentAssets += u;
          break;
      }
    } else if (acct.type === AccountType.EQUITY) {
      const credit = -u;
      if (acct.subtype === AccountSubtype.SHARE_CAPITAL) {
        shareCapital += credit;
      } else {
        retainedEarnings += credit;
      }
    } else if (acct.type === AccountType.LIABILITY) {
      const credit = -u;
      switch (acct.subtype) {
        case AccountSubtype.LONG_TERM_DEBT:
          longTermDebt += credit;
          break;
        case AccountSubtype.ACCOUNTS_PAYABLE:
          payables += credit;
          break;
        case AccountSubtype.VAT_PAYABLE:
          taxLiabilities += credit;
          break;
        case AccountSubtype.ACCRUED_LIABILITY:
          accruedLiabilities += credit;
          break;
        case AccountSubtype.SHORT_TERM_DEBT:
          shortTermDebt += credit;
          break;
        default:
          otherLiabilities += credit;
          break;
      }
    } else if (
      acct.type === AccountType.REVENUE ||
      acct.type === AccountType.EXPENSE
    ) {
      // Credit balances are profit (+), debit balances are expense (-)
      unclosedPnl += -u;
    }
  }

  let revenue = 0;
  let cogs = 0;
  let payroll = 0;
  let otherOpex = 0;
  let financialIncome = 0;
  let financialExpense = 0;
  let taxExpense = 0;

  for (const m of input.movements) {
    const u = m.units; // debit - credit
    if (m.type === AccountType.REVENUE) {
      const credit = -u;
      if (m.subtype === AccountSubtype.FINANCIAL_INCOME) {
        financialIncome += credit;
      } else {
        revenue += credit;
      }
    } else if (m.type === AccountType.EXPENSE) {
      const debit = u;
      switch (m.subtype) {
        case AccountSubtype.COGS:
          cogs += debit;
          break;
        case AccountSubtype.PAYROLL:
          payroll += debit;
          break;
        case AccountSubtype.FINANCIAL_EXPENSE:
          financialExpense += debit;
          break;
        case AccountSubtype.TAX_EXPENSE:
          taxExpense += debit;
          break;
        default:
          otherOpex += debit;
          break;
      }
    }
  }

  const totalAssets =
    fixedAssets +
    inventory +
    receivables +
    prepaid +
    cashAndBank +
    otherCurrentAssets;
  const totalEquity = shareCapital + retainedEarnings + unclosedPnl;
  const totalLiabilities =
    longTermDebt +
    payables +
    taxLiabilities +
    accruedLiabilities +
    shortTermDebt +
    otherLiabilities;
  const totalEquityAndLiabilities = totalEquity + totalLiabilities;
  const netResult =
    revenue -
    cogs -
    payroll -
    otherOpex +
    financialIncome -
    financialExpense -
    taxExpense;

  return {
    fixedAssets,
    inventory,
    receivables,
    prepaid,
    cashAndBank,
    otherCurrentAssets,
    totalAssets,
    shareCapital,
    retainedEarnings,
    periodResult: unclosedPnl,
    totalEquity,
    longTermDebt,
    payables,
    taxLiabilities,
    accruedLiabilities,
    shortTermDebt,
    otherLiabilities,
    totalLiabilities,
    totalEquityAndLiabilities,
    revenue,
    cogs,
    payroll,
    otherOpex,
    financialIncome,
    financialExpense,
    taxExpense,
    netResult,
  };
}

interface LayoutSpec {
  bs: Array<{
    id: string;
    row: number;
    marker: string;
    kind: StatementLineKind;
    label: string;
    officialLabel: string;
    pick: (b: PeriodBuckets) => number;
  }>;
  pl: Array<{
    id: string;
    row: number;
    marker: string;
    kind: StatementLineKind;
    label: string;
    officialLabel: string;
    pick: (b: PeriodBuckets) => number;
  }>;
}

function getLayoutSpec(layout: NonSkStatementLayout): LayoutSpec {
  const isDe = layout === "DE_HGB";
  const isAt = layout === "AT_UGB";
  const isGerman = isDe || isAt;

  const bs: LayoutSpec["bs"] = [
    // Assets (rows 1..10)
    {
      id: "bs_assets_total",
      row: 1,
      marker: "",
      kind: "total",
      label: isGerman ? "Summe Aktiva" : "Total assets",
      officialLabel: isDe
        ? "AKTIVA (§ 266 Abs. 2 HGB)"
        : isAt
          ? "AKTIVA (§ 224 Abs. 2 UGB)"
          : "TOTAL ASSETS (IAS 1)",
      pick: (b) => b.totalAssets,
    },
    {
      id: "bs_fixed",
      row: 2,
      marker: "A.",
      kind: "group",
      label: isGerman ? "Anlagevermögen" : "Non-current assets",
      officialLabel: isGerman ? "A. Anlagevermögen" : "Non-current assets",
      pick: (b) => b.fixedAssets,
    },
    {
      id: "bs_current",
      row: 3,
      marker: "B.",
      kind: "group",
      label: isGerman ? "Umlaufvermögen" : "Current assets",
      officialLabel: isGerman ? "B. Umlaufvermögen" : "Current assets",
      pick: (b) =>
        b.inventory + b.receivables + b.cashAndBank + b.otherCurrentAssets,
    },
    {
      id: "bs_inventory",
      row: 4,
      marker: "B.I.",
      kind: "item",
      label: isGerman ? "Vorräte" : "Inventories",
      officialLabel: isGerman ? "I. Vorräte" : "Inventories",
      pick: (b) => b.inventory,
    },
    {
      id: "bs_receivables",
      row: 5,
      marker: "B.II.",
      kind: "item",
      label: isGerman
        ? "Forderungen und sonstige Vermögensgegenstände"
        : "Trade and other receivables",
      officialLabel: isGerman
        ? "II. Forderungen und sonstige Vermögensgegenstände"
        : "Trade and other receivables",
      pick: (b) => b.receivables + b.otherCurrentAssets,
    },
    {
      id: "bs_cash",
      row: 6,
      marker: "B.IV.",
      kind: "item",
      label: isGerman
        ? "Kassenbestand und Guthaben bei Kreditinstituten"
        : "Cash and cash equivalents",
      officialLabel: isGerman
        ? "IV. Kassenbestand, Guthaben bei Kreditinstituten"
        : "Cash and cash equivalents",
      pick: (b) => b.cashAndBank,
    },
    {
      id: "bs_prepaid",
      row: 7,
      marker: "C.",
      kind: "group",
      label: isGerman
        ? "Rechnungsabgrenzungsposten"
        : "Prepayments and accrued income",
      officialLabel: isGerman ? "C. Rechnungsabgrenzungsposten" : "Prepayments",
      pick: (b) => b.prepaid,
    },
    // Equity & Liabilities (rows 24..34 so Assets = <=23 and Equity & Liabilities = >=24)
    {
      id: "bs_liab_total",
      row: 24,
      marker: "",
      kind: "total",
      label: isGerman ? "Summe Passiva" : "Total equity and liabilities",
      officialLabel: isDe
        ? "PASSIVA (§ 266 Abs. 3 HGB)"
        : isAt
          ? "PASSIVA (§ 224 Abs. 3 UGB)"
          : "TOTAL EQUITY AND LIABILITIES (IAS 1)",
      pick: (b) => b.totalEquityAndLiabilities,
    },
    {
      id: "bs_equity",
      row: 25,
      marker: "A.",
      kind: "group",
      label: isGerman ? "Eigenkapital" : "Equity",
      officialLabel: isGerman ? "A. Eigenkapital" : "Total equity",
      pick: (b) => b.totalEquity,
    },
    {
      id: "bs_share_capital",
      row: 26,
      marker: "A.I.",
      kind: "item",
      label: isGerman ? "Gezeichnetes Kapital" : "Issued share capital",
      officialLabel: isDe
        ? "I. Gezeichnetes Kapital"
        : isAt
          ? "I. Eingefordertes Nennkapital"
          : "Share capital",
      pick: (b) => b.shareCapital,
    },
    {
      id: "bs_retained",
      row: 27,
      marker: "A.IV.",
      kind: "item",
      label: isGerman
        ? "Gewinn- / Verlustvortrag und Rücklagen"
        : "Retained earnings and reserves",
      officialLabel: isGerman
        ? "IV. Gewinnvortrag / Verlustvortrag"
        : "Retained earnings",
      pick: (b) => b.retainedEarnings,
    },
    {
      id: "bs_period_result",
      row: 28,
      marker: "A.V.",
      kind: "item",
      label: isGerman
        ? "Jahresüberschuss / Jahresfehlbetrag"
        : "Current period profit or loss",
      officialLabel: isGerman
        ? "V. Jahresüberschuss / Jahresfehlbetrag"
        : "Profit or loss for the period",
      pick: (b) => b.periodResult,
    },
    {
      id: "bs_accrued",
      row: 29,
      marker: "B.",
      kind: "group",
      label: isGerman ? "Rückstellungen" : "Provisions and accrued liabilities",
      officialLabel: isGerman ? "B. Rückstellungen" : "Provisions",
      pick: (b) => b.accruedLiabilities,
    },
    {
      id: "bs_liabilities",
      row: 30,
      marker: "C.",
      kind: "group",
      label: isGerman ? "Verbindlichkeiten" : "Liabilities",
      officialLabel: isGerman ? "C. Verbindlichkeiten" : "Total liabilities",
      pick: (b) =>
        b.longTermDebt +
        b.payables +
        b.taxLiabilities +
        b.shortTermDebt +
        b.otherLiabilities,
    },
    {
      id: "bs_long_debt",
      row: 31,
      marker: "C.1.",
      kind: "item",
      label: isGerman
        ? "Langfristige Verbindlichkeiten"
        : "Non-current borrowings",
      officialLabel: isGerman
        ? "Verbindlichkeiten gegenüber Kreditinstituten"
        : "Non-current borrowings",
      pick: (b) => b.longTermDebt,
    },
    {
      id: "bs_payables",
      row: 32,
      marker: "C.4.",
      kind: "item",
      label: isGerman
        ? "Verbindlichkeiten aus Lieferungen und Leistungen"
        : "Trade payables",
      officialLabel: isGerman
        ? "Verbindlichkeiten aus Lieferungen und Leistungen"
        : "Trade and other payables",
      pick: (b) => b.payables,
    },
    {
      id: "bs_tax_liab",
      row: 33,
      marker: "C.8.",
      kind: "item",
      label: isGerman ? "Steuerverbindlichkeiten" : "Current tax liabilities",
      officialLabel: isGerman ? "davon aus Steuern" : "Tax liabilities",
      pick: (b) => b.taxLiabilities,
    },
    {
      id: "bs_other_liab",
      row: 34,
      marker: "C.9.",
      kind: "item",
      label: isGerman
        ? "Sonstige und kurzfristige Verbindlichkeiten"
        : "Short-term debt and other liabilities",
      officialLabel: isGerman
        ? "Sonstige Verbindlichkeiten"
        : "Other current liabilities",
      pick: (b) => b.shortTermDebt + b.otherLiabilities,
    },
  ];

  const pl: LayoutSpec["pl"] = [
    {
      id: "pl_revenue",
      row: 1,
      marker: "1.",
      kind: "group",
      label: isGerman ? "Umsatzerlöse" : "Revenue",
      officialLabel: isDe
        ? "1. Umsatzerlöse (§ 275 Abs. 2 HGB)"
        : isAt
          ? "1. Umsatzerlöse (§ 231 Abs. 2 UGB)"
          : "Revenue (IAS 1)",
      pick: (b) => b.revenue,
    },
    {
      id: "pl_cogs",
      row: 2,
      marker: "5.",
      kind: "item",
      label: isGerman ? "Materialaufwand / Wareneinsatz" : "Cost of sales",
      officialLabel: isGerman ? "5. Materialaufwand" : "Cost of sales",
      pick: (b) => -b.cogs,
    },
    {
      id: "pl_gross",
      row: 3,
      marker: "",
      kind: "total",
      label: isGerman ? "Rohergebnis" : "Gross profit",
      officialLabel: isGerman ? "Rohergebnis" : "Gross profit",
      pick: (b) => b.revenue - b.cogs,
    },
    {
      id: "pl_payroll",
      row: 4,
      marker: "6.",
      kind: "item",
      label: isGerman ? "Personalaufwand" : "Employee benefit expense",
      officialLabel: isGerman ? "6. Personalaufwand" : "Payroll expenses",
      pick: (b) => -b.payroll,
    },
    {
      id: "pl_opex",
      row: 5,
      marker: "8.",
      kind: "item",
      label: isGerman
        ? "Sonstige betriebliche Aufwendungen"
        : "Other operating expenses",
      officialLabel: isGerman
        ? "8. Sonstige betriebliche Aufwendungen"
        : "Operating expenses",
      pick: (b) => -b.otherOpex,
    },
    {
      id: "pl_ebit",
      row: 6,
      marker: "",
      kind: "total",
      label: isGerman ? "Betriebsergebnis" : "Operating profit (EBIT)",
      officialLabel: isGerman ? "Betriebsergebnis" : "Operating profit",
      pick: (b) => b.revenue - b.cogs - b.payroll - b.otherOpex,
    },
    {
      id: "pl_fin_inc",
      row: 7,
      marker: "11.",
      kind: "item",
      label: isGerman
        ? "Sonstige Zinsen und ähnliche Erträge"
        : "Finance income",
      officialLabel: isGerman
        ? "11. Sonstige Zinsen und ähnliche Erträge"
        : "Finance income",
      pick: (b) => b.financialIncome,
    },
    {
      id: "pl_fin_exp",
      row: 8,
      marker: "13.",
      kind: "item",
      label: isGerman ? "Zinsen und ähnliche Aufwendungen" : "Finance costs",
      officialLabel: isGerman
        ? "13. Zinsen und ähnliche Aufwendungen"
        : "Finance costs",
      pick: (b) => -b.financialExpense,
    },
    {
      id: "pl_tax",
      row: 9,
      marker: "14.",
      kind: "item",
      label: isGerman
        ? "Steuern vom Einkommen und vom Ertrag"
        : "Income tax expense",
      officialLabel: isGerman
        ? "14. Steuern vom Einkommen und vom Ertrag"
        : "Income tax expense",
      pick: (b) => -b.taxExpense,
    },
    {
      id: "pl_net",
      row: 10,
      marker: "17.",
      kind: "total",
      label: isGerman
        ? "Jahresüberschuss / Jahresfehlbetrag"
        : "Profit or loss for the period",
      officialLabel: isGerman
        ? "17. Jahresüberschuss / Jahresfehlbetrag"
        : "Net profit / loss",
      pick: (b) => b.netResult,
    },
  ];

  return { bs, pl };
}

export function buildCountryStatutoryStatement(
  layout: NonSkStatementLayout,
  currentInput: GenericPeriodInput,
  previousInput: GenericPeriodInput,
): GenericStatutoryStatement {
  const cur = summarizePeriod(currentInput);
  const prev = summarizePeriod(previousInput);
  const spec = getLayoutSpec(layout);

  return {
    balanceSheet: spec.bs.map((item) => ({
      id: item.id,
      row: item.row,
      marker: item.marker,
      kind: item.kind,
      label: item.label,
      officialLabel: item.officialLabel,
      current: item.pick(cur),
      previous: item.pick(prev),
    })),
    profitLoss: spec.pl.map((item) => ({
      id: item.id,
      row: item.row,
      marker: item.marker,
      kind: item.kind,
      label: item.label,
      officialLabel: item.officialLabel,
      current: item.pick(cur),
      previous: item.pick(prev),
    })),
    difference: {
      current: cur.totalAssets - cur.totalEquityAndLiabilities,
      previous: prev.totalAssets - prev.totalEquityAndLiabilities,
    },
  };
}
