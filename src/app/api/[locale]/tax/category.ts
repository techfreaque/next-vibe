/**
 * Category definition for the Tax module.
 * Covers tax rate configuration and tax reporting.
 */

import type { CategoryDefinition } from "@/app/api/[locale]/system/help/category-types";
import { USER_ME_ALIAS } from "@/app/api/[locale]/user/private/me/constants";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import { TAX_RATE_LIST_ALIAS } from "./rate/list/constants";

export const category: CategoryDefinition = {
  key: "tax",
  label: {
    "en-US": "Tax",
    "en-GLOBAL": "Tax",
    "de-DE": "Steuern",
    "pl-PL": "Podatki",
  },
  group: "business",
  icon: "file-text",
  order: 65,
  defaultEntry: {
    [UserPermissionRole.ADMIN]: TAX_RATE_LIST_ALIAS,
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
  subcategories: {
    "Tax Rates": {
      icon: "receipt",
      order: 0,
      label: {
        "en-US": "Tax Rates",
        "en-GLOBAL": "Tax Rates",
        "de-DE": "Steuersätze",
        "pl-PL": "Stawki podatkowe",
      },
      // inherits parent defaultEntry (tax/rate/list)
    },
    "Tax Reports": {
      icon: "bar-chart-2",
      order: 1,
      label: {
        "en-US": "Reports",
        "en-GLOBAL": "Reports",
        "de-DE": "Berichte",
        "pl-PL": "Raporty",
      },
    },
  },
};
