/**
 * Category definition for the Accounting module.
 * Covers chart of accounts, journal entries, ledger reports, and accounting periods.
 */

import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { ACCOUNTING_DASHBOARD_ALIAS } from "@/app/api/[locale]/chart-of-accounts/dashboard/constants";
import { USER_ME_ALIAS } from "@/app/api/[locale]/user/private/me/constants";

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
  defaultEntry: {
    [UserPermissionRole.ADMIN]: ACCOUNTING_DASHBOARD_ALIAS,
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
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
    },
  },
};
