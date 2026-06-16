/**
 * Category definition for the Point of Sale module.
 * Covers orders, sessions, and terminal management.
 */

import { POS_DASHBOARD_ALIAS } from "@/app/api/[locale]/pos/dashboard/constants";
import type { CategoryDefinition } from "@/app/api/[locale]/system/help/category-types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import { USER_ME_ALIAS } from "@/app/api/[locale]/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "pos",
  label: {
    "en-US": "Point of Sale",
    "en-GLOBAL": "Point of Sale",
    "de-DE": "Kasse",
    "pl-PL": "Punkt sprzedaży",
  },
  group: "business",
  icon: "shopping-cart",
  order: 45,
  defaultEntry: POS_DASHBOARD_ALIAS,
  subcategories: {
    "POS: Orders": {
      icon: "shopping-bag",
      order: 0,
      label: {
        "en-US": "Orders",
        "en-GLOBAL": "Orders",
        "de-DE": "Bestellungen",
        "pl-PL": "Zamówienia",
      },
    },
    "POS: Sessions": {
      icon: "clock",
      order: 1,
      label: {
        "en-US": "Sessions",
        "en-GLOBAL": "Sessions",
        "de-DE": "Sitzungen",
        "pl-PL": "Sesje",
      },
    },
    "POS: Terminals": {
      icon: "monitor",
      order: 2,
      label: {
        "en-US": "Terminals",
        "en-GLOBAL": "Terminals",
        "de-DE": "Terminals",
        "pl-PL": "Terminale",
      },
    },
    "POS: Products": {
      icon: "package",
      order: 3,
      label: {
        "en-US": "Products",
        "en-GLOBAL": "Products",
        "de-DE": "Produkte",
        "pl-PL": "Produkty",
      },
    },
  },
};
