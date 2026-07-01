/**
 * Category definition for the Purchasing module.
 * Covers purchase orders and vendor management.
 */

import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { PURCHASING_DASHBOARD_ALIAS } from "@/app/api/[locale]/purchasing/dashboard/constants";
import { USER_ME_ALIAS } from "@/app/api/[locale]/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "purchasing",
  label: {
    "en-US": "Purchasing",
    "en-GLOBAL": "Purchasing",
    "de-DE": "Einkauf",
    "pl-PL": "Zakupy",
  },
  group: "business",
  icon: "shopping-bag",
  order: 55,
  defaultEntry: {
    [UserPermissionRole.ADMIN]: PURCHASING_DASHBOARD_ALIAS,
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
  subcategories: {
    "Purchasing: Orders": {
      icon: "file-plus",
      order: 0,
      label: {
        "en-US": "Orders",
        "en-GLOBAL": "Orders",
        "de-DE": "Bestellungen",
        "pl-PL": "Zamówienia",
      },
    },
    "Purchasing: Vendors": {
      icon: "briefcase",
      order: 1,
      label: {
        "en-US": "Vendors",
        "en-GLOBAL": "Vendors",
        "de-DE": "Lieferanten",
        "pl-PL": "Dostawcy",
      },
    },
  },
};
