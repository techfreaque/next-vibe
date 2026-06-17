/**
 * Category definition for the Products module.
 * Covers product catalog and category management.
 */

import { PRODUCTS_CATALOG_LIST_ALIAS } from "@/app/api/[locale]/products/catalog/list/constants";
import type { CategoryDefinition } from "@/app/api/[locale]/system/help/category-types";
import { USER_ME_ALIAS } from "@/app/api/[locale]/user/private/me/constants";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

export const category: CategoryDefinition = {
  key: "products",
  label: {
    "en-US": "Products",
    "en-GLOBAL": "Products",
    "de-DE": "Produkte",
    "pl-PL": "Produkty",
  },
  group: "business",
  icon: "package",
  order: 40,
  defaultEntry: {
    [UserPermissionRole.ADMIN]: PRODUCTS_CATALOG_LIST_ALIAS,
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
  subcategories: {
    "Catalog Management": {
      icon: "package",
      order: 0,
      label: {
        "en-US": "Catalog",
        "en-GLOBAL": "Catalog",
        "de-DE": "Katalog",
        "pl-PL": "Katalog",
      },
      // inherits parent defaultEntry (products-catalog-list)
    },
    "Category Management": {
      icon: "tag",
      order: 1,
      label: {
        "en-US": "Categories",
        "en-GLOBAL": "Categories",
        "de-DE": "Kategorien",
        "pl-PL": "Kategorie",
      },
    },
  },
};
