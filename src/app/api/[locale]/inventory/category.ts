/**
 * Category definition for the Inventory module.
 * Covers stock levels, transfers, and warehouse management.
 */

import { INVENTORY_DASHBOARD_ALIAS } from "@/app/api/[locale]/inventory/dashboard/constants";
import type { CategoryDefinition } from "@/app/api/[locale]/system/help/category-types";
import { USER_ME_ALIAS } from "@/app/api/[locale]/user/private/me/constants";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

export const category: CategoryDefinition = {
  key: "inventory",
  label: {
    "en-US": "Inventory",
    "en-GLOBAL": "Inventory",
    "de-DE": "Lager",
    "pl-PL": "Magazyn",
  },
  group: "business",
  icon: "box",
  order: 50,
  defaultEntry: {
    [UserPermissionRole.ADMIN]: INVENTORY_DASHBOARD_ALIAS,
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
  subcategories: {
    "Inventory: Stock": {
      icon: "layers",
      order: 0,
      label: {
        "en-US": "Stock",
        "en-GLOBAL": "Stock",
        "de-DE": "Bestand",
        "pl-PL": "Zapasy",
      },
    },
    "Inventory: Transfers": {
      icon: "move",
      order: 1,
      label: {
        "en-US": "Transfers",
        "en-GLOBAL": "Transfers",
        "de-DE": "Transfers",
        "pl-PL": "Transfery",
      },
    },
    "Inventory: Warehouses": {
      icon: "archive",
      order: 2,
      label: {
        "en-US": "Warehouses",
        "en-GLOBAL": "Warehouses",
        "de-DE": "Lagerhäuser",
        "pl-PL": "Magazyny",
      },
    },
  },
};
