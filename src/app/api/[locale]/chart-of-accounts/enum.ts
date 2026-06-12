/**
 * Chart of Accounts enums
 * Defines the enums used in the chart-of-accounts module using createEnumOptions pattern
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * Account type enum
 * Top-level classification in the chart of accounts
 */
export const {
  enum: AccountType,
  options: AccountTypeOptions,
  Value: AccountTypeValue,
} = createEnumOptions(scopedTranslation, {
  ASSET: "enums.accountType.ASSET",
  LIABILITY: "enums.accountType.LIABILITY",
  EQUITY: "enums.accountType.EQUITY",
  REVENUE: "enums.accountType.REVENUE",
  EXPENSE: "enums.accountType.EXPENSE",
});

/**
 * Account subtype enum
 * Detailed classification within each account type
 */
export const {
  enum: AccountSubtype,
  options: AccountSubtypeOptions,
  Value: AccountSubtypeValue,
} = createEnumOptions(scopedTranslation, {
  CURRENT_ASSET: "enums.accountSubtype.CURRENT_ASSET",
  FIXED_ASSET: "enums.accountSubtype.FIXED_ASSET",
  BANK: "enums.accountSubtype.BANK",
  CASH: "enums.accountSubtype.CASH",
  ACCOUNTS_RECEIVABLE: "enums.accountSubtype.ACCOUNTS_RECEIVABLE",
  INVENTORY: "enums.accountSubtype.INVENTORY",
  PREPAID: "enums.accountSubtype.PREPAID",
  ACCOUNTS_PAYABLE: "enums.accountSubtype.ACCOUNTS_PAYABLE",
  VAT_PAYABLE: "enums.accountSubtype.VAT_PAYABLE",
  VAT_RECEIVABLE: "enums.accountSubtype.VAT_RECEIVABLE",
  ACCRUED_LIABILITY: "enums.accountSubtype.ACCRUED_LIABILITY",
  SHORT_TERM_DEBT: "enums.accountSubtype.SHORT_TERM_DEBT",
  LONG_TERM_DEBT: "enums.accountSubtype.LONG_TERM_DEBT",
  SHARE_CAPITAL: "enums.accountSubtype.SHARE_CAPITAL",
  RETAINED_EARNINGS: "enums.accountSubtype.RETAINED_EARNINGS",
  REVENUE_SALES: "enums.accountSubtype.REVENUE_SALES",
  REVENUE_SERVICE: "enums.accountSubtype.REVENUE_SERVICE",
  COGS: "enums.accountSubtype.COGS",
  PAYROLL: "enums.accountSubtype.PAYROLL",
  RENT: "enums.accountSubtype.RENT",
  UTILITIES: "enums.accountSubtype.UTILITIES",
  OPEX: "enums.accountSubtype.OPEX",
  FINANCIAL_INCOME: "enums.accountSubtype.FINANCIAL_INCOME",
  FINANCIAL_EXPENSE: "enums.accountSubtype.FINANCIAL_EXPENSE",
  TAX_EXPENSE: "enums.accountSubtype.TAX_EXPENSE",
  OTHER: "enums.accountSubtype.OTHER",
});

/**
 * Period status enum
 * Tracks the lifecycle of accounting periods
 */
export const {
  enum: PeriodStatus,
  options: PeriodStatusOptions,
  Value: PeriodStatusValue,
} = createEnumOptions(scopedTranslation, {
  OPEN: "enums.periodStatus.OPEN",
  CLOSED: "enums.periodStatus.CLOSED",
  LOCKED: "enums.periodStatus.LOCKED",
});

/**
 * Journal entry status enum
 * Tracks the lifecycle of journal entries
 */
export const {
  enum: JournalEntryStatus,
  options: JournalEntryStatusOptions,
  Value: JournalEntryStatusValue,
} = createEnumOptions(scopedTranslation, {
  DRAFT: "enums.journalEntryStatus.DRAFT",
  POSTED: "enums.journalEntryStatus.POSTED",
  REVERSED: "enums.journalEntryStatus.REVERSED",
});

/**
 * Journal source type enum
 * Identifies the originating system for a journal entry
 */
export const {
  enum: JournalSourceType,
  options: JournalSourceTypeOptions,
  Value: JournalSourceTypeValue,
} = createEnumOptions(scopedTranslation, {
  MANUAL: "enums.journalSourceType.MANUAL",
  AR_INVOICE: "enums.journalSourceType.AR_INVOICE",
  AR_PAYMENT: "enums.journalSourceType.AR_PAYMENT",
  AP_BILL: "enums.journalSourceType.AP_BILL",
  AP_PAYMENT: "enums.journalSourceType.AP_PAYMENT",
  POS_ORDER: "enums.journalSourceType.POS_ORDER",
  TAX_PAYMENT: "enums.journalSourceType.TAX_PAYMENT",
  PERIOD_CLOSE: "enums.journalSourceType.PERIOD_CLOSE",
  CREDIT_TRANSACTION: "enums.journalSourceType.CREDIT_TRANSACTION",
});

/**
 * Line type enum
 * Debit or credit for journal entry lines
 */
export const {
  enum: LineType,
  options: LineTypeOptions,
  Value: LineTypeValue,
} = createEnumOptions(scopedTranslation, {
  DEBIT: "enums.lineType.DEBIT",
  CREDIT: "enums.lineType.CREDIT",
});

// DB enum arrays for Drizzle
export const AccountTypeDB = [
  AccountType.ASSET,
  AccountType.LIABILITY,
  AccountType.EQUITY,
  AccountType.REVENUE,
  AccountType.EXPENSE,
] as const;

export const AccountSubtypeDB = [
  AccountSubtype.CURRENT_ASSET,
  AccountSubtype.FIXED_ASSET,
  AccountSubtype.BANK,
  AccountSubtype.CASH,
  AccountSubtype.ACCOUNTS_RECEIVABLE,
  AccountSubtype.INVENTORY,
  AccountSubtype.PREPAID,
  AccountSubtype.ACCOUNTS_PAYABLE,
  AccountSubtype.VAT_PAYABLE,
  AccountSubtype.VAT_RECEIVABLE,
  AccountSubtype.ACCRUED_LIABILITY,
  AccountSubtype.SHORT_TERM_DEBT,
  AccountSubtype.LONG_TERM_DEBT,
  AccountSubtype.SHARE_CAPITAL,
  AccountSubtype.RETAINED_EARNINGS,
  AccountSubtype.REVENUE_SALES,
  AccountSubtype.REVENUE_SERVICE,
  AccountSubtype.COGS,
  AccountSubtype.PAYROLL,
  AccountSubtype.RENT,
  AccountSubtype.UTILITIES,
  AccountSubtype.OPEX,
  AccountSubtype.FINANCIAL_INCOME,
  AccountSubtype.FINANCIAL_EXPENSE,
  AccountSubtype.TAX_EXPENSE,
  AccountSubtype.OTHER,
] as const;

export const PeriodStatusDB = [
  PeriodStatus.OPEN,
  PeriodStatus.CLOSED,
  PeriodStatus.LOCKED,
] as const;

export const JournalEntryStatusDB = [
  JournalEntryStatus.DRAFT,
  JournalEntryStatus.POSTED,
  JournalEntryStatus.REVERSED,
] as const;

export const JournalSourceTypeDB = [
  JournalSourceType.MANUAL,
  JournalSourceType.AR_INVOICE,
  JournalSourceType.AR_PAYMENT,
  JournalSourceType.AP_BILL,
  JournalSourceType.AP_PAYMENT,
  JournalSourceType.POS_ORDER,
  JournalSourceType.TAX_PAYMENT,
  JournalSourceType.PERIOD_CLOSE,
  JournalSourceType.CREDIT_TRANSACTION,
] as const;

export const LineTypeDB = [LineType.DEBIT, LineType.CREDIT] as const;
