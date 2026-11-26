/**
 * Category definition for the Products module.
 * Covers product catalog and category management.
 */

import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { PRODUCTS_CATALOG_LIST_ALIAS } from "@/products/catalog/list/constants";
import { USER_ME_ALIAS } from "@/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "products",
  label: {
    "en-US": "Products",
    "en-GLOBAL": "Products",
    "de-DE": "Produkte",
    "pl-PL": "Produkty",
    "fr-FR": "Produits",
    "it-IT": "Prodotti",
    "es-ES": "Productos",
    "sk-SK": "Produkty",
  },
  description: {
    "en-US": "Manage products, services, plans and prices.",
    "de-DE": "Verwalten Sie Produkte, Leistungen, Tarife und Preise.",
    "pl-PL": "Zarządzaj produktami, usługami, planami i cenami.",
    "fr-FR": "Gérez les produits, les services, les offres et leurs prix.",
    "it-IT": "Gestisca prodotti, servizi, piani e prezzi.",
    "es-ES": "Gestione productos, servicios, planes y precios.",
    "sk-SK": "Spravujte produkty, služby, predplatné a ceny.",
    "en-GLOBAL": "Manage products, services, plans and prices.",
  },
  group: "business",
  icon: "package",
  order: 40,
  createActions: ["products_catalog_create_POST"],
  landing: {
    destinations: ["products-catalog-list", "products-category-list"],
    actions: [
      "products-catalog-list",
      "products-category-list",
      "processor-accounting-map",
    ],
  },
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
        "fr-FR": "Catalogue",
        "it-IT": "Catalogo",
        "es-ES": "Catálogo",
        "sk-SK": "Katalóg",
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
        "fr-FR": "Catégories",
        "it-IT": "Categorie",
        "es-ES": "Categorías",
        "sk-SK": "Kategórie",
      },
    },
  },
};
