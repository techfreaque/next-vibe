/**
 * Chart of Accounts Seeds
 * Seeds three country-specific CoA templates:
 * - AT: Österreichischer Kontenrahmen (ÖKR)
 * - DE: Standardkontenrahmen 03 (SKR03)
 * - XX: IFRS Generic (multi-country default)
 */

import { and, eq } from "drizzle-orm";

import { companies, companyMembers } from "@/app/api/[locale]/companies/db";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { accountNodes, coaTemplateNodes, coaTemplates } from "./db";
import { AccountSubtype, AccountType } from "./enum";

export const priority = 40;

// ---- Template node definitions ----

interface TemplateNodeDef {
  code: string;
  name: string;
  nameDe?: string;
  namePl?: string;
  type: (typeof AccountType)[keyof typeof AccountType];
  subtype: (typeof AccountSubtype)[keyof typeof AccountSubtype];
  parentCode?: string;
  isPostable: boolean;
  sortOrder: number;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _TemplateNodeDefCheck = TemplateNodeDef;

// ---- IFRS Generic (XX) ----
const xxNodes: TemplateNodeDef[] = [
  // Assets
  {
    code: "1000",
    name: "Assets",
    nameDe: "Vermögenswerte",
    namePl: "Aktywa",
    type: AccountType.ASSET,
    subtype: AccountSubtype.CURRENT_ASSET,
    isPostable: false,
    sortOrder: 10,
  },
  {
    code: "1100",
    name: "Current Assets",
    nameDe: "Umlaufvermögen",
    namePl: "Aktywa obrotowe",
    type: AccountType.ASSET,
    subtype: AccountSubtype.CURRENT_ASSET,
    parentCode: "1000",
    isPostable: false,
    sortOrder: 20,
  },
  {
    code: "1110",
    name: "Cash and Cash Equivalents",
    nameDe: "Kasse und Kassenäquivalente",
    namePl: "Środki pieniężne",
    type: AccountType.ASSET,
    subtype: AccountSubtype.CASH,
    parentCode: "1100",
    isPostable: true,
    sortOrder: 30,
  },
  {
    code: "1120",
    name: "Bank Accounts",
    nameDe: "Bankkonten",
    namePl: "Rachunki bankowe",
    type: AccountType.ASSET,
    subtype: AccountSubtype.BANK,
    parentCode: "1100",
    isPostable: true,
    sortOrder: 40,
  },
  {
    code: "1130",
    name: "Accounts Receivable",
    nameDe: "Forderungen aus Lieferungen und Leistungen",
    namePl: "Należności handlowe",
    type: AccountType.ASSET,
    subtype: AccountSubtype.ACCOUNTS_RECEIVABLE,
    parentCode: "1100",
    isPostable: true,
    sortOrder: 50,
  },
  {
    code: "1140",
    name: "Inventory",
    nameDe: "Vorräte",
    namePl: "Zapasy",
    type: AccountType.ASSET,
    subtype: AccountSubtype.INVENTORY,
    parentCode: "1100",
    isPostable: true,
    sortOrder: 60,
  },
  {
    code: "1150",
    name: "Prepaid Expenses",
    nameDe: "Aktive Rechnungsabgrenzungsposten",
    namePl: "Rozliczenia międzyokresowe czynne",
    type: AccountType.ASSET,
    subtype: AccountSubtype.PREPAID,
    parentCode: "1100",
    isPostable: true,
    sortOrder: 70,
  },
  {
    code: "1160",
    name: "VAT Receivable",
    nameDe: "Vorsteuer",
    namePl: "VAT naliczony",
    type: AccountType.ASSET,
    subtype: AccountSubtype.VAT_RECEIVABLE,
    parentCode: "1100",
    isPostable: true,
    sortOrder: 80,
  },
  {
    code: "1200",
    name: "Non-Current Assets",
    nameDe: "Anlagevermögen",
    namePl: "Aktywa trwałe",
    type: AccountType.ASSET,
    subtype: AccountSubtype.FIXED_ASSET,
    parentCode: "1000",
    isPostable: false,
    sortOrder: 90,
  },
  {
    code: "1210",
    name: "Property, Plant & Equipment",
    nameDe: "Sachanlagen",
    namePl: "Rzeczowe aktywa trwałe",
    type: AccountType.ASSET,
    subtype: AccountSubtype.FIXED_ASSET,
    parentCode: "1200",
    isPostable: true,
    sortOrder: 100,
  },
  {
    code: "1220",
    name: "Intangible Assets",
    nameDe: "Immaterielle Vermögenswerte",
    namePl: "Wartości niematerialne",
    type: AccountType.ASSET,
    subtype: AccountSubtype.FIXED_ASSET,
    parentCode: "1200",
    isPostable: true,
    sortOrder: 110,
  },

  // Liabilities
  {
    code: "2000",
    name: "Liabilities",
    nameDe: "Verbindlichkeiten",
    namePl: "Zobowiązania",
    type: AccountType.LIABILITY,
    subtype: AccountSubtype.ACCOUNTS_PAYABLE,
    isPostable: false,
    sortOrder: 200,
  },
  {
    code: "2100",
    name: "Current Liabilities",
    nameDe: "Kurzfristige Verbindlichkeiten",
    namePl: "Zobowiązania krótkoterminowe",
    type: AccountType.LIABILITY,
    subtype: AccountSubtype.ACCOUNTS_PAYABLE,
    parentCode: "2000",
    isPostable: false,
    sortOrder: 210,
  },
  {
    code: "2110",
    name: "Accounts Payable",
    nameDe: "Verbindlichkeiten aus Lieferungen und Leistungen",
    namePl: "Zobowiązania handlowe",
    type: AccountType.LIABILITY,
    subtype: AccountSubtype.ACCOUNTS_PAYABLE,
    parentCode: "2100",
    isPostable: true,
    sortOrder: 220,
  },
  {
    code: "2120",
    name: "VAT Payable",
    nameDe: "Umsatzsteuer",
    namePl: "VAT należny",
    type: AccountType.LIABILITY,
    subtype: AccountSubtype.VAT_PAYABLE,
    parentCode: "2100",
    isPostable: true,
    sortOrder: 230,
  },
  {
    code: "2130",
    name: "Accrued Liabilities",
    nameDe: "Rückstellungen",
    namePl: "Rezerwy",
    type: AccountType.LIABILITY,
    subtype: AccountSubtype.ACCRUED_LIABILITY,
    parentCode: "2100",
    isPostable: true,
    sortOrder: 240,
  },
  {
    code: "2140",
    name: "Short-Term Debt",
    nameDe: "Kurzfristige Darlehen",
    namePl: "Kredyty krótkoterminowe",
    type: AccountType.LIABILITY,
    subtype: AccountSubtype.SHORT_TERM_DEBT,
    parentCode: "2100",
    isPostable: true,
    sortOrder: 250,
  },
  {
    code: "2200",
    name: "Non-Current Liabilities",
    nameDe: "Langfristige Verbindlichkeiten",
    namePl: "Zobowiązania długoterminowe",
    type: AccountType.LIABILITY,
    subtype: AccountSubtype.LONG_TERM_DEBT,
    parentCode: "2000",
    isPostable: false,
    sortOrder: 260,
  },
  {
    code: "2210",
    name: "Long-Term Debt",
    nameDe: "Langfristige Darlehen",
    namePl: "Kredyty długoterminowe",
    type: AccountType.LIABILITY,
    subtype: AccountSubtype.LONG_TERM_DEBT,
    parentCode: "2200",
    isPostable: true,
    sortOrder: 270,
  },

  // Equity
  {
    code: "3000",
    name: "Equity",
    nameDe: "Eigenkapital",
    namePl: "Kapitał własny",
    type: AccountType.EQUITY,
    subtype: AccountSubtype.SHARE_CAPITAL,
    isPostable: false,
    sortOrder: 300,
  },
  {
    code: "3100",
    name: "Share Capital",
    nameDe: "Stammkapital",
    namePl: "Kapitał zakładowy",
    type: AccountType.EQUITY,
    subtype: AccountSubtype.SHARE_CAPITAL,
    parentCode: "3000",
    isPostable: true,
    sortOrder: 310,
  },
  {
    code: "3200",
    name: "Retained Earnings",
    nameDe: "Gewinnvortrag",
    namePl: "Zyski zatrzymane",
    type: AccountType.EQUITY,
    subtype: AccountSubtype.RETAINED_EARNINGS,
    parentCode: "3000",
    isPostable: true,
    sortOrder: 320,
  },
  {
    code: "3300",
    name: "Current Year Profit/Loss",
    nameDe: "Jahresergebnis",
    namePl: "Wynik roku bieżącego",
    type: AccountType.EQUITY,
    subtype: AccountSubtype.RETAINED_EARNINGS,
    parentCode: "3000",
    isPostable: true,
    sortOrder: 330,
  },

  // Revenue
  {
    code: "4000",
    name: "Revenue",
    nameDe: "Umsatzerlöse",
    namePl: "Przychody",
    type: AccountType.REVENUE,
    subtype: AccountSubtype.REVENUE_SALES,
    isPostable: false,
    sortOrder: 400,
  },
  {
    code: "4100",
    name: "Sales Revenue",
    nameDe: "Umsatzerlöse Waren",
    namePl: "Przychody ze sprzedaży towarów",
    type: AccountType.REVENUE,
    subtype: AccountSubtype.REVENUE_SALES,
    parentCode: "4000",
    isPostable: true,
    sortOrder: 410,
  },
  {
    code: "4200",
    name: "Service Revenue",
    nameDe: "Umsatzerlöse Dienstleistungen",
    namePl: "Przychody ze sprzedaży usług",
    type: AccountType.REVENUE,
    subtype: AccountSubtype.REVENUE_SERVICE,
    parentCode: "4000",
    isPostable: true,
    sortOrder: 420,
  },
  {
    code: "4300",
    name: "Financial Income",
    nameDe: "Zinserträge",
    namePl: "Przychody finansowe",
    type: AccountType.REVENUE,
    subtype: AccountSubtype.FINANCIAL_INCOME,
    parentCode: "4000",
    isPostable: true,
    sortOrder: 430,
  },

  // Expenses
  {
    code: "5000",
    name: "Expenses",
    nameDe: "Aufwendungen",
    namePl: "Koszty",
    type: AccountType.EXPENSE,
    subtype: AccountSubtype.OPEX,
    isPostable: false,
    sortOrder: 500,
  },
  {
    code: "5100",
    name: "Cost of Goods Sold",
    nameDe: "Wareneinsatz",
    namePl: "Koszt sprzedanych towarów",
    type: AccountType.EXPENSE,
    subtype: AccountSubtype.COGS,
    parentCode: "5000",
    isPostable: true,
    sortOrder: 510,
  },
  {
    code: "5200",
    name: "Payroll Expense",
    nameDe: "Personalaufwand",
    namePl: "Koszty pracownicze",
    type: AccountType.EXPENSE,
    subtype: AccountSubtype.PAYROLL,
    parentCode: "5000",
    isPostable: true,
    sortOrder: 520,
  },
  {
    code: "5300",
    name: "Rent Expense",
    nameDe: "Mietaufwand",
    namePl: "Koszty najmu",
    type: AccountType.EXPENSE,
    subtype: AccountSubtype.RENT,
    parentCode: "5000",
    isPostable: true,
    sortOrder: 530,
  },
  {
    code: "5400",
    name: "Utilities Expense",
    nameDe: "Energiekosten",
    namePl: "Media i utilities",
    type: AccountType.EXPENSE,
    subtype: AccountSubtype.UTILITIES,
    parentCode: "5000",
    isPostable: true,
    sortOrder: 540,
  },
  {
    code: "5500",
    name: "General & Administrative",
    nameDe: "Allgemeine Verwaltungskosten",
    namePl: "Koszty ogólne i administracyjne",
    type: AccountType.EXPENSE,
    subtype: AccountSubtype.OPEX,
    parentCode: "5000",
    isPostable: true,
    sortOrder: 550,
  },
  {
    code: "5600",
    name: "Financial Expense",
    nameDe: "Zinsaufwand",
    namePl: "Koszty finansowe",
    type: AccountType.EXPENSE,
    subtype: AccountSubtype.FINANCIAL_EXPENSE,
    parentCode: "5000",
    isPostable: true,
    sortOrder: 560,
  },
  {
    code: "5700",
    name: "Tax Expense",
    nameDe: "Steueraufwand",
    namePl: "Podatek dochodowy",
    type: AccountType.EXPENSE,
    subtype: AccountSubtype.TAX_EXPENSE,
    parentCode: "5000",
    isPostable: true,
    sortOrder: 570,
  },
];

// ---- SKR03 (DE) ----
const deNodes: TemplateNodeDef[] = [
  // Bestandskonten - Aktiva
  {
    code: "0",
    name: "Anlage- und Kapitalkonten",
    nameDe: "Anlage- und Kapitalkonten",
    type: AccountType.ASSET,
    subtype: AccountSubtype.FIXED_ASSET,
    isPostable: false,
    sortOrder: 10,
  },
  {
    code: "0100",
    name: "Entwicklungs- und ähnliche Kosten",
    nameDe: "Entwicklungs- und ähnliche Kosten",
    type: AccountType.ASSET,
    subtype: AccountSubtype.FIXED_ASSET,
    parentCode: "0",
    isPostable: true,
    sortOrder: 20,
  },
  {
    code: "0200",
    name: "Konzessionen, gewerbliche Schutzrechte",
    nameDe: "Konzessionen, gewerbliche Schutzrechte",
    type: AccountType.ASSET,
    subtype: AccountSubtype.FIXED_ASSET,
    parentCode: "0",
    isPostable: true,
    sortOrder: 30,
  },
  {
    code: "0400",
    name: "Grundstücke und Gebäude",
    nameDe: "Grundstücke und Gebäude",
    type: AccountType.ASSET,
    subtype: AccountSubtype.FIXED_ASSET,
    parentCode: "0",
    isPostable: true,
    sortOrder: 40,
  },
  {
    code: "0490",
    name: "Betriebs- und Geschäftsausstattung",
    nameDe: "Betriebs- und Geschäftsausstattung",
    type: AccountType.ASSET,
    subtype: AccountSubtype.FIXED_ASSET,
    parentCode: "0",
    isPostable: true,
    sortOrder: 50,
  },

  // Umlaufvermögen
  {
    code: "1",
    name: "Finanz- und Privatkonten",
    nameDe: "Finanz- und Privatkonten",
    type: AccountType.ASSET,
    subtype: AccountSubtype.CURRENT_ASSET,
    isPostable: false,
    sortOrder: 100,
  },
  {
    code: "1000",
    name: "Kasse",
    nameDe: "Kasse",
    type: AccountType.ASSET,
    subtype: AccountSubtype.CASH,
    parentCode: "1",
    isPostable: true,
    sortOrder: 110,
  },
  {
    code: "1200",
    name: "Bank",
    nameDe: "Bank",
    type: AccountType.ASSET,
    subtype: AccountSubtype.BANK,
    parentCode: "1",
    isPostable: true,
    sortOrder: 120,
  },
  {
    code: "1400",
    name: "Forderungen aus Lieferungen und Leistungen",
    nameDe: "Forderungen aus LuL",
    type: AccountType.ASSET,
    subtype: AccountSubtype.ACCOUNTS_RECEIVABLE,
    parentCode: "1",
    isPostable: true,
    sortOrder: 130,
  },
  {
    code: "1576",
    name: "Abziehbare Vorsteuer 19%",
    nameDe: "Vorsteuer 19%",
    type: AccountType.ASSET,
    subtype: AccountSubtype.VAT_RECEIVABLE,
    parentCode: "1",
    isPostable: true,
    sortOrder: 140,
  },
  {
    code: "1577",
    name: "Abziehbare Vorsteuer 7%",
    nameDe: "Vorsteuer 7%",
    type: AccountType.ASSET,
    subtype: AccountSubtype.VAT_RECEIVABLE,
    parentCode: "1",
    isPostable: true,
    sortOrder: 150,
  },

  // Verbindlichkeiten
  {
    code: "1600",
    name: "Verbindlichkeiten aus Lieferungen und Leistungen",
    nameDe: "Verbindlichkeiten aus LuL",
    type: AccountType.LIABILITY,
    subtype: AccountSubtype.ACCOUNTS_PAYABLE,
    isPostable: true,
    sortOrder: 200,
  },
  {
    code: "1740",
    name: "Umsatzsteuer",
    nameDe: "Umsatzsteuer",
    type: AccountType.LIABILITY,
    subtype: AccountSubtype.VAT_PAYABLE,
    isPostable: true,
    sortOrder: 210,
  },
  {
    code: "1741",
    name: "Umsatzsteuer 7%",
    nameDe: "Umsatzsteuer 7%",
    type: AccountType.LIABILITY,
    subtype: AccountSubtype.VAT_PAYABLE,
    isPostable: true,
    sortOrder: 220,
  },
  {
    code: "1780",
    name: "Umsatzsteuer-Vorauszahlungen",
    nameDe: "USt-Vorauszahlungen",
    type: AccountType.LIABILITY,
    subtype: AccountSubtype.VAT_PAYABLE,
    isPostable: true,
    sortOrder: 230,
  },

  // Eigenkapital
  {
    code: "0800",
    name: "Stammkapital",
    nameDe: "Stammkapital",
    type: AccountType.EQUITY,
    subtype: AccountSubtype.SHARE_CAPITAL,
    isPostable: true,
    sortOrder: 300,
  },
  {
    code: "0850",
    name: "Kapitalrücklagen",
    nameDe: "Kapitalrücklagen",
    type: AccountType.EQUITY,
    subtype: AccountSubtype.SHARE_CAPITAL,
    isPostable: true,
    sortOrder: 310,
  },
  {
    code: "0860",
    name: "Gewinnvortrag",
    nameDe: "Gewinnvortrag",
    type: AccountType.EQUITY,
    subtype: AccountSubtype.RETAINED_EARNINGS,
    isPostable: true,
    sortOrder: 320,
  },
  {
    code: "0868",
    name: "Jahresüberschuss / Jahresfehlbetrag",
    nameDe: "Jahresergebnis",
    type: AccountType.EQUITY,
    subtype: AccountSubtype.RETAINED_EARNINGS,
    isPostable: true,
    sortOrder: 330,
  },

  // Ertragskonten
  {
    code: "4",
    name: "Betriebliche Erträge",
    nameDe: "Betriebliche Erträge",
    type: AccountType.REVENUE,
    subtype: AccountSubtype.REVENUE_SALES,
    isPostable: false,
    sortOrder: 400,
  },
  {
    code: "4000",
    name: "Umsatzerlöse 19% USt",
    nameDe: "Umsatzerlöse 19% USt",
    type: AccountType.REVENUE,
    subtype: AccountSubtype.REVENUE_SALES,
    parentCode: "4",
    isPostable: true,
    sortOrder: 410,
  },
  {
    code: "4300",
    name: "Umsatzerlöse 7% USt",
    nameDe: "Umsatzerlöse 7% USt",
    type: AccountType.REVENUE,
    subtype: AccountSubtype.REVENUE_SALES,
    parentCode: "4",
    isPostable: true,
    sortOrder: 420,
  },
  {
    code: "4400",
    name: "Umsatzerlöse steuerfrei",
    nameDe: "Umsatzerlöse steuerfrei",
    type: AccountType.REVENUE,
    subtype: AccountSubtype.REVENUE_SERVICE,
    parentCode: "4",
    isPostable: true,
    sortOrder: 430,
  },
  {
    code: "4900",
    name: "Sonstige betriebliche Erträge",
    nameDe: "Sonstige betriebliche Erträge",
    type: AccountType.REVENUE,
    subtype: AccountSubtype.REVENUE_SERVICE,
    parentCode: "4",
    isPostable: true,
    sortOrder: 440,
  },

  // Aufwandskonten
  {
    code: "5",
    name: "Materialaufwand",
    nameDe: "Materialaufwand",
    type: AccountType.EXPENSE,
    subtype: AccountSubtype.COGS,
    isPostable: false,
    sortOrder: 500,
  },
  {
    code: "5000",
    name: "Waren",
    nameDe: "Waren",
    type: AccountType.EXPENSE,
    subtype: AccountSubtype.COGS,
    parentCode: "5",
    isPostable: true,
    sortOrder: 510,
  },
  {
    code: "6",
    name: "Personalaufwand",
    nameDe: "Personalaufwand",
    type: AccountType.EXPENSE,
    subtype: AccountSubtype.PAYROLL,
    isPostable: false,
    sortOrder: 600,
  },
  {
    code: "6000",
    name: "Löhne und Gehälter",
    nameDe: "Löhne und Gehälter",
    type: AccountType.EXPENSE,
    subtype: AccountSubtype.PAYROLL,
    parentCode: "6",
    isPostable: true,
    sortOrder: 610,
  },
  {
    code: "6010",
    name: "Gesetzliche soziale Aufwendungen",
    nameDe: "Sozialaufwand",
    type: AccountType.EXPENSE,
    subtype: AccountSubtype.PAYROLL,
    parentCode: "6",
    isPostable: true,
    sortOrder: 620,
  },
  {
    code: "7",
    name: "Sonstige betriebliche Aufwendungen",
    nameDe: "Sonstige betriebliche Aufwendungen",
    type: AccountType.EXPENSE,
    subtype: AccountSubtype.OPEX,
    isPostable: false,
    sortOrder: 700,
  },
  {
    code: "7000",
    name: "Raumkosten",
    nameDe: "Raumkosten (Miete)",
    type: AccountType.EXPENSE,
    subtype: AccountSubtype.RENT,
    parentCode: "7",
    isPostable: true,
    sortOrder: 710,
  },
  {
    code: "7310",
    name: "Telefon, Telefax, Internet",
    nameDe: "Telekommunikation",
    type: AccountType.EXPENSE,
    subtype: AccountSubtype.UTILITIES,
    parentCode: "7",
    isPostable: true,
    sortOrder: 720,
  },
  {
    code: "7600",
    name: "Sonstige betriebliche Aufwendungen",
    nameDe: "Sonstige Aufwendungen",
    type: AccountType.EXPENSE,
    subtype: AccountSubtype.OPEX,
    parentCode: "7",
    isPostable: true,
    sortOrder: 730,
  },
  {
    code: "7685",
    name: "Gewerbesteuer",
    nameDe: "Gewerbesteuer",
    type: AccountType.EXPENSE,
    subtype: AccountSubtype.TAX_EXPENSE,
    parentCode: "7",
    isPostable: true,
    sortOrder: 740,
  },
  {
    code: "7686",
    name: "Körperschaftsteuer",
    nameDe: "Körperschaftsteuer",
    type: AccountType.EXPENSE,
    subtype: AccountSubtype.TAX_EXPENSE,
    parentCode: "7",
    isPostable: true,
    sortOrder: 750,
  },
  {
    code: "7690",
    name: "Zinsen und ähnliche Aufwendungen",
    nameDe: "Zinsaufwand",
    type: AccountType.EXPENSE,
    subtype: AccountSubtype.FINANCIAL_EXPENSE,
    parentCode: "7",
    isPostable: true,
    sortOrder: 760,
  },
];

// ---- ÖKR (AT) ----
const atNodes: TemplateNodeDef[] = [
  // Klasse 0 - Anlagevermögen
  {
    code: "0",
    name: "Anlagevermögen",
    nameDe: "Anlagevermögen",
    type: AccountType.ASSET,
    subtype: AccountSubtype.FIXED_ASSET,
    isPostable: false,
    sortOrder: 10,
  },
  {
    code: "010",
    name: "Immaterielle Vermögensgegenstände",
    nameDe: "Immaterielle Vermögensgegenstände",
    type: AccountType.ASSET,
    subtype: AccountSubtype.FIXED_ASSET,
    parentCode: "0",
    isPostable: false,
    sortOrder: 20,
  },
  {
    code: "0100",
    name: "Konzessionen",
    nameDe: "Konzessionen",
    type: AccountType.ASSET,
    subtype: AccountSubtype.FIXED_ASSET,
    parentCode: "010",
    isPostable: true,
    sortOrder: 30,
  },
  {
    code: "020",
    name: "Sachanlagen",
    nameDe: "Sachanlagen",
    type: AccountType.ASSET,
    subtype: AccountSubtype.FIXED_ASSET,
    parentCode: "0",
    isPostable: false,
    sortOrder: 40,
  },
  {
    code: "0200",
    name: "Grundstücke und Bauten",
    nameDe: "Grundstücke und Bauten",
    type: AccountType.ASSET,
    subtype: AccountSubtype.FIXED_ASSET,
    parentCode: "020",
    isPostable: true,
    sortOrder: 50,
  },
  {
    code: "0210",
    name: "Betriebs- und Geschäftsausstattung",
    nameDe: "Betriebsausstattung",
    type: AccountType.ASSET,
    subtype: AccountSubtype.FIXED_ASSET,
    parentCode: "020",
    isPostable: true,
    sortOrder: 60,
  },

  // Klasse 1 - Umlaufvermögen
  {
    code: "1",
    name: "Umlaufvermögen",
    nameDe: "Umlaufvermögen",
    type: AccountType.ASSET,
    subtype: AccountSubtype.CURRENT_ASSET,
    isPostable: false,
    sortOrder: 100,
  },
  {
    code: "100",
    name: "Vorräte",
    nameDe: "Vorräte",
    type: AccountType.ASSET,
    subtype: AccountSubtype.INVENTORY,
    parentCode: "1",
    isPostable: false,
    sortOrder: 110,
  },
  {
    code: "1000",
    name: "Rohstoffe",
    nameDe: "Rohstoffe",
    type: AccountType.ASSET,
    subtype: AccountSubtype.INVENTORY,
    parentCode: "100",
    isPostable: true,
    sortOrder: 120,
  },
  {
    code: "110",
    name: "Forderungen und sonstige Vermögensgegenstände",
    nameDe: "Forderungen",
    type: AccountType.ASSET,
    subtype: AccountSubtype.ACCOUNTS_RECEIVABLE,
    parentCode: "1",
    isPostable: false,
    sortOrder: 130,
  },
  {
    code: "1100",
    name: "Forderungen aus L&L",
    nameDe: "Forderungen aus Lieferungen und Leistungen",
    type: AccountType.ASSET,
    subtype: AccountSubtype.ACCOUNTS_RECEIVABLE,
    parentCode: "110",
    isPostable: true,
    sortOrder: 140,
  },
  {
    code: "1110",
    name: "Vorsteuer",
    nameDe: "Vorsteuer",
    type: AccountType.ASSET,
    subtype: AccountSubtype.VAT_RECEIVABLE,
    parentCode: "110",
    isPostable: true,
    sortOrder: 150,
  },
  {
    code: "120",
    name: "Kassa, Schecks, Guthaben",
    nameDe: "Kassa und Bankguthaben",
    type: AccountType.ASSET,
    subtype: AccountSubtype.CASH,
    parentCode: "1",
    isPostable: false,
    sortOrder: 160,
  },
  {
    code: "1200",
    name: "Kassa",
    nameDe: "Kassa",
    type: AccountType.ASSET,
    subtype: AccountSubtype.CASH,
    parentCode: "120",
    isPostable: true,
    sortOrder: 170,
  },
  {
    code: "1210",
    name: "Guthaben bei Kreditinstituten",
    nameDe: "Bankguthaben",
    type: AccountType.ASSET,
    subtype: AccountSubtype.BANK,
    parentCode: "120",
    isPostable: true,
    sortOrder: 180,
  },

  // Klasse 2 - Verbindlichkeiten
  {
    code: "2",
    name: "Rückstellungen und Verbindlichkeiten",
    nameDe: "Verbindlichkeiten",
    type: AccountType.LIABILITY,
    subtype: AccountSubtype.ACCOUNTS_PAYABLE,
    isPostable: false,
    sortOrder: 200,
  },
  {
    code: "200",
    name: "Rückstellungen",
    nameDe: "Rückstellungen",
    type: AccountType.LIABILITY,
    subtype: AccountSubtype.ACCRUED_LIABILITY,
    parentCode: "2",
    isPostable: false,
    sortOrder: 210,
  },
  {
    code: "2000",
    name: "Rückstellungen für Abfertigungen",
    nameDe: "Abfertigungsrückstellungen",
    type: AccountType.LIABILITY,
    subtype: AccountSubtype.ACCRUED_LIABILITY,
    parentCode: "200",
    isPostable: true,
    sortOrder: 220,
  },
  {
    code: "210",
    name: "Verbindlichkeiten",
    nameDe: "Verbindlichkeiten",
    type: AccountType.LIABILITY,
    subtype: AccountSubtype.ACCOUNTS_PAYABLE,
    parentCode: "2",
    isPostable: false,
    sortOrder: 230,
  },
  {
    code: "2100",
    name: "Verbindlichkeiten aus L&L",
    nameDe: "Verbindlichkeiten aus Lieferungen und Leistungen",
    type: AccountType.LIABILITY,
    subtype: AccountSubtype.ACCOUNTS_PAYABLE,
    parentCode: "210",
    isPostable: true,
    sortOrder: 240,
  },
  {
    code: "2110",
    name: "Umsatzsteuer",
    nameDe: "Umsatzsteuer",
    type: AccountType.LIABILITY,
    subtype: AccountSubtype.VAT_PAYABLE,
    parentCode: "210",
    isPostable: true,
    sortOrder: 250,
  },
  {
    code: "2120",
    name: "Verbindlichkeiten gegenüber Kreditinstituten",
    nameDe: "Bankverbindlichkeiten",
    type: AccountType.LIABILITY,
    subtype: AccountSubtype.SHORT_TERM_DEBT,
    parentCode: "210",
    isPostable: true,
    sortOrder: 260,
  },

  // Klasse 3 - Eigenkapital
  {
    code: "3",
    name: "Eigenkapital",
    nameDe: "Eigenkapital",
    type: AccountType.EQUITY,
    subtype: AccountSubtype.SHARE_CAPITAL,
    isPostable: false,
    sortOrder: 300,
  },
  {
    code: "300",
    name: "Nennkapital",
    nameDe: "Nennkapital",
    type: AccountType.EQUITY,
    subtype: AccountSubtype.SHARE_CAPITAL,
    parentCode: "3",
    isPostable: false,
    sortOrder: 310,
  },
  {
    code: "3000",
    name: "Stammkapital",
    nameDe: "Stammkapital",
    type: AccountType.EQUITY,
    subtype: AccountSubtype.SHARE_CAPITAL,
    parentCode: "300",
    isPostable: true,
    sortOrder: 320,
  },
  {
    code: "3100",
    name: "Kapitalrücklagen",
    nameDe: "Kapitalrücklagen",
    type: AccountType.EQUITY,
    subtype: AccountSubtype.SHARE_CAPITAL,
    parentCode: "3",
    isPostable: true,
    sortOrder: 330,
  },
  {
    code: "3700",
    name: "Bilanzgewinn / Bilanzverlust",
    nameDe: "Bilanzgewinn/-verlust",
    type: AccountType.EQUITY,
    subtype: AccountSubtype.RETAINED_EARNINGS,
    parentCode: "3",
    isPostable: true,
    sortOrder: 340,
  },

  // Klasse 4 - Betriebliche Erträge
  {
    code: "4",
    name: "Betriebliche Erträge",
    nameDe: "Betriebliche Erträge",
    type: AccountType.REVENUE,
    subtype: AccountSubtype.REVENUE_SALES,
    isPostable: false,
    sortOrder: 400,
  },
  {
    code: "4000",
    name: "Umsatzerlöse",
    nameDe: "Umsatzerlöse (Inland)",
    type: AccountType.REVENUE,
    subtype: AccountSubtype.REVENUE_SALES,
    parentCode: "4",
    isPostable: true,
    sortOrder: 410,
  },
  {
    code: "4010",
    name: "Umsatzerlöse steuerfrei",
    nameDe: "Umsatzerlöse steuerfrei",
    type: AccountType.REVENUE,
    subtype: AccountSubtype.REVENUE_SERVICE,
    parentCode: "4",
    isPostable: true,
    sortOrder: 420,
  },
  {
    code: "4800",
    name: "Sonstige betriebliche Erträge",
    nameDe: "Sonstige betriebliche Erträge",
    type: AccountType.REVENUE,
    subtype: AccountSubtype.REVENUE_SERVICE,
    parentCode: "4",
    isPostable: true,
    sortOrder: 430,
  },

  // Klasse 5 - Materialaufwand
  {
    code: "5",
    name: "Materialaufwand und Aufwand für bezogene Leistungen",
    nameDe: "Materialaufwand",
    type: AccountType.EXPENSE,
    subtype: AccountSubtype.COGS,
    isPostable: false,
    sortOrder: 500,
  },
  {
    code: "5000",
    name: "Aufwand für Rohstoffe",
    nameDe: "Rohstoffaufwand",
    type: AccountType.EXPENSE,
    subtype: AccountSubtype.COGS,
    parentCode: "5",
    isPostable: true,
    sortOrder: 510,
  },
  {
    code: "5100",
    name: "Aufwand für Handelswaren",
    nameDe: "Warenaufwand",
    type: AccountType.EXPENSE,
    subtype: AccountSubtype.COGS,
    parentCode: "5",
    isPostable: true,
    sortOrder: 520,
  },

  // Klasse 6 - Personalaufwand
  {
    code: "6",
    name: "Personalaufwand",
    nameDe: "Personalaufwand",
    type: AccountType.EXPENSE,
    subtype: AccountSubtype.PAYROLL,
    isPostable: false,
    sortOrder: 600,
  },
  {
    code: "6000",
    name: "Löhne",
    nameDe: "Löhne",
    type: AccountType.EXPENSE,
    subtype: AccountSubtype.PAYROLL,
    parentCode: "6",
    isPostable: true,
    sortOrder: 610,
  },
  {
    code: "6010",
    name: "Gehälter",
    nameDe: "Gehälter",
    type: AccountType.EXPENSE,
    subtype: AccountSubtype.PAYROLL,
    parentCode: "6",
    isPostable: true,
    sortOrder: 620,
  },
  {
    code: "6020",
    name: "Gesetzlicher Sozialaufwand",
    nameDe: "Sozialversicherung",
    type: AccountType.EXPENSE,
    subtype: AccountSubtype.PAYROLL,
    parentCode: "6",
    isPostable: true,
    sortOrder: 630,
  },

  // Klasse 7 - Sonstige Aufwendungen
  {
    code: "7",
    name: "Sonstige Aufwendungen",
    nameDe: "Sonstige Aufwendungen",
    type: AccountType.EXPENSE,
    subtype: AccountSubtype.OPEX,
    isPostable: false,
    sortOrder: 700,
  },
  {
    code: "7000",
    name: "Mietaufwand",
    nameDe: "Mietaufwand",
    type: AccountType.EXPENSE,
    subtype: AccountSubtype.RENT,
    parentCode: "7",
    isPostable: true,
    sortOrder: 710,
  },
  {
    code: "7010",
    name: "Energieaufwand",
    nameDe: "Strom, Gas, Wasser",
    type: AccountType.EXPENSE,
    subtype: AccountSubtype.UTILITIES,
    parentCode: "7",
    isPostable: true,
    sortOrder: 720,
  },
  {
    code: "7200",
    name: "Kommunikation und IT",
    nameDe: "Telefon, Internet, EDV",
    type: AccountType.EXPENSE,
    subtype: AccountSubtype.OPEX,
    parentCode: "7",
    isPostable: true,
    sortOrder: 730,
  },
  {
    code: "7800",
    name: "Steuern und Abgaben",
    nameDe: "Körperschaftsteuer",
    type: AccountType.EXPENSE,
    subtype: AccountSubtype.TAX_EXPENSE,
    parentCode: "7",
    isPostable: true,
    sortOrder: 740,
  },
  {
    code: "7900",
    name: "Zinsen und ähnliche Aufwendungen",
    nameDe: "Zinsaufwand",
    type: AccountType.EXPENSE,
    subtype: AccountSubtype.FINANCIAL_EXPENSE,
    parentCode: "7",
    isPostable: true,
    sortOrder: 750,
  },
];

// ---- Template definitions ----

const TEMPLATES = [
  {
    country: "XX",
    name: "IFRS Generic Chart of Accounts",
    description:
      "A generic IFRS-aligned chart of accounts suitable for any country.",
    isDefault: true,
    version: "1.0",
    nodes: xxNodes,
  },
  {
    country: "DE",
    name: "SKR03 – Standardkontenrahmen 03",
    description:
      "German standard chart of accounts SKR03 for GmbH and small companies.",
    isDefault: false,
    version: "2024",
    nodes: deNodes,
  },
  {
    country: "AT",
    name: "ÖKR – Österreichischer Kontenrahmen",
    description:
      "Austrian standard chart of accounts (ÖKR) for GmbH and limited liability companies.",
    isDefault: false,
    version: "2024",
    nodes: atNodes,
  },
] as const;

// ---- Seed functions ----

async function seedTemplate(
  logger: EndpointLogger,
  template: (typeof TEMPLATES)[number],
): Promise<void> {
  const existing = await db
    .select({ id: coaTemplates.id })
    .from(coaTemplates)
    .where(eq(coaTemplates.country, template.country))
    .limit(1);

  if (existing.length > 0) {
    logger.debug(`CoA template already exists: ${template.country} — skipping`);
    return;
  }

  const [inserted] = await db
    .insert(coaTemplates)
    .values({
      country: template.country,
      name: template.name,
      description: template.description,
      isDefault: template.isDefault,
      version: template.version,
    })
    .returning({ id: coaTemplates.id });

  if (!inserted) {
    logger.error(`Failed to insert CoA template: ${template.country}`);
    return;
  }

  const templateId = inserted.id;

  // Insert nodes in order (sortOrder ensures parent codes exist before children,
  // as parents always have lower sortOrder than children)
  const nodeValues = template.nodes.map((node) => ({
    templateId,
    code: node.code,
    name: node.name,
    nameDe: node.nameDe,
    namePl: node.namePl,
    type: node.type,
    subtype: node.subtype,
    parentCode: node.parentCode,
    isPostable: node.isPostable,
    sortOrder: node.sortOrder,
  }));

  await db.insert(coaTemplateNodes).values(nodeValues);

  logger.info(
    `Seeded CoA template: ${template.country} (${template.name}) with ${nodeValues.length} accounts`,
  );
}

/**
 * Setup chart of accounts for a company from the XX (IFRS) template.
 * Idempotent — skips if accounts already exist.
 */
async function setupDemoCompanyCoA(
  logger: EndpointLogger,
  companyId: string,
): Promise<void> {
  // Check if already set up
  const existing = await db
    .select({ id: accountNodes.id })
    .from(accountNodes)
    .where(eq(accountNodes.companyId, companyId))
    .limit(1);

  if (existing.length > 0) {
    logger.debug(`CoA already set up for company ${companyId} — skipping`);
    return;
  }

  // Use the XX (IFRS) template
  const [template] = await db
    .select()
    .from(coaTemplates)
    .where(eq(coaTemplates.country, "XX"))
    .limit(1);

  if (!template) {
    logger.error("XX template not found — cannot setup demo company CoA");
    return;
  }

  const templateNodes = await db
    .select()
    .from(coaTemplateNodes)
    .where(eq(coaTemplateNodes.templateId, template.id))
    .orderBy(coaTemplateNodes.sortOrder);

  // Build code→id map
  const nodeIdMap = new Map<string, string>();
  for (const node of templateNodes) {
    nodeIdMap.set(node.code, crypto.randomUUID());
  }

  const insertValues = templateNodes.map((node) => ({
    id: nodeIdMap.get(node.code),
    companyId,
    templateNodeId: node.id,
    code: node.code,
    name: node.name,
    type: node.type,
    subtype: node.subtype,
    parentId: node.parentCode ? (nodeIdMap.get(node.parentCode) ?? null) : null,
    isPostable: node.isPostable,
    isActive: true,
    isSystem: true,
    sortOrder: node.sortOrder,
  }));

  await db.insert(accountNodes).values(insertValues);

  logger.info(
    `CoA setup for demo company: ${insertValues.length} accounts created`,
  );
}

export async function dev(logger: EndpointLogger): Promise<void> {
  for (const template of TEMPLATES) {
    await seedTemplate(logger, template);
  }

  // Setup CoA for demo company if it exists
  const demoCompany = await db
    .select({ id: companies.id })
    .from(companies)
    .innerJoin(companyMembers, eq(companyMembers.companyId, companies.id))
    .where(and(eq(companyMembers.isActive, true)))
    .limit(1);

  if (demoCompany.length > 0 && demoCompany[0]) {
    await setupDemoCompanyCoA(logger, demoCompany[0].id);
  } else {
    logger.info("No demo company found — skipping CoA setup for demo company");
  }
}

export async function prod(logger: EndpointLogger): Promise<void> {
  for (const template of TEMPLATES) {
    await seedTemplate(logger, template);
  }
}
