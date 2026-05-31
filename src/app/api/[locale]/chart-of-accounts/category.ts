/**
 * Category definition for the Accounting module.
 * Covers chart of accounts, journal entries, ledger reports, and accounting periods.
 */

import type { CategoryDefinition } from "@/app/api/[locale]/system/help/category-types";
import { ACCOUNTING_DASHBOARD_ALIAS } from "@/app/api/[locale]/chart-of-accounts/dashboard/constants";
import { COA_ACCOUNT_LIST_ALIAS } from "@/app/api/[locale]/chart-of-accounts/account/list/constants";
import { COA_JOURNAL_LIST_ALIAS } from "@/app/api/[locale]/chart-of-accounts/journal/list/constants";
import { COA_PERIOD_LIST_ALIAS } from "@/app/api/[locale]/chart-of-accounts/period/list/constants";
import { COA_BALANCE_SHEET_ALIAS } from "@/app/api/[locale]/chart-of-accounts/reports/balance-sheet/constants";
import { COA_SETUP_ALIAS } from "@/app/api/[locale]/chart-of-accounts/setup/constants";

export const category: CategoryDefinition = {
  key: "accounting",
  label: {
    "en-US": "Accounting",
    "en-GLOBAL": "Accounting",
    "de-DE": "Buchhaltung",
    "pl-PL": "Księgowość",
  },
  group: "business",
  icon: "receipt",
  order: 30,
  defaultEntry: ACCOUNTING_DASHBOARD_ALIAS,
  subcategories: {
    Accounts: {
      icon: "book-open",
      order: 0,
      label: {
        "en-US": "Accounts",
        "en-GLOBAL": "Accounts",
        "de-DE": "Konten",
        "pl-PL": "Konta",
      },
      defaultEntry: COA_ACCOUNT_LIST_ALIAS,
    },
    Journal: {
      icon: "edit",
      order: 1,
      label: {
        "en-US": "Journal",
        "en-GLOBAL": "Journal",
        "de-DE": "Journal",
        "pl-PL": "Dziennik",
      },
      defaultEntry: COA_JOURNAL_LIST_ALIAS,
    },
    Ledger: {
      icon: "bar-chart-2",
      order: 2,
      label: {
        "en-US": "Ledger",
        "en-GLOBAL": "Ledger",
        "de-DE": "Hauptbuch",
        "pl-PL": "Księga główna",
      },
      defaultEntry: COA_BALANCE_SHEET_ALIAS,
    },
    Periods: {
      icon: "calendar",
      order: 3,
      label: {
        "en-US": "Periods",
        "en-GLOBAL": "Periods",
        "de-DE": "Perioden",
        "pl-PL": "Okresy",
      },
      defaultEntry: COA_PERIOD_LIST_ALIAS,
    },
    Accounting: {
      icon: "settings",
      order: 4,
      label: {
        "en-US": "Setup",
        "en-GLOBAL": "Setup",
        "de-DE": "Einrichtung",
        "pl-PL": "Konfiguracja",
      },
      defaultEntry: COA_SETUP_ALIAS,
    },
  },
};
