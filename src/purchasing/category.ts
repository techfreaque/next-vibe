/**
 * Category definition for the Purchasing module.
 * Covers purchase orders and vendor management.
 */

import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { PURCHASING_DASHBOARD_ALIAS } from "@/purchasing/dashboard/constants";
import { USER_ME_ALIAS } from "@/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "purchasing",
  label: {
    "en-US": "Purchasing",
    "en-GLOBAL": "Purchasing",
    "de-DE": "Einkauf",
    "pl-PL": "Zakupy",
    "fr-FR": "Achats",
    "it-IT": "Acquisti",
    "es-ES": "Compras",
    "sk-SK": "Nákup",
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
        "fr-FR": "Commandes",
        "it-IT": "Ordini",
        "es-ES": "Pedidos",
        "sk-SK": "Nákupné objednávky",
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
        "fr-FR": "Fournisseurs",
        "it-IT": "Fornitori",
        "es-ES": "Proveedores",
        "sk-SK": "Dodávatelia",
      },
    },
  },
};
