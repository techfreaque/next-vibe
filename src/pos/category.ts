/**
 * Category definition for the Point of Sale module.
 * Covers orders, sessions, and terminal management.
 */

import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { POS_DASHBOARD_ALIAS } from "@/pos/dashboard/constants";
import { USER_ME_ALIAS } from "@/user/private/me/constants";

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
  defaultEntry: {
    [UserPermissionRole.ADMIN]: POS_DASHBOARD_ALIAS,
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
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
