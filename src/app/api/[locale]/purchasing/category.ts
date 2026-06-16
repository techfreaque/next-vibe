/**
 * Category definition for the Purchasing module.
 * Covers purchase orders and vendor management.
 */

import { PURCHASING_DASHBOARD_ALIAS } from "@/app/api/[locale]/purchasing/dashboard/constants";
import type { CategoryDefinition } from "@/app/api/[locale]/system/help/category-types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
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
  defaultEntry: PURCHASING_DASHBOARD_ALIAS,
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
