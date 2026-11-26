/**
 * Category definition for the Inventory module.
 * Covers stock levels, transfers, and warehouse management.
 */

import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { INVENTORY_DASHBOARD_ALIAS } from "@/inventory/dashboard/constants";
import { USER_ME_ALIAS } from "@/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "inventory",
  label: {
    "en-US": "Inventory",
    "en-GLOBAL": "Inventory",
    "de-DE": "Lager",
    "pl-PL": "Magazyn",
    "fr-FR": "Inventaire",
    "it-IT": "Inventario",
    "es-ES": "Inventario",
    "sk-SK": "Zásoby",
  },
  description: {
    "en-US": "Track physical stock, warehouse movements and transfers.",
    "de-DE": "Verfolgen Sie Warenbestände, Lagerbewegungen und Umlagerungen.",
    "pl-PL": "Śledź stany magazynowe, ruch towarów i przesunięcia.",
    "fr-FR":
      "Suivez les stocks physiques, les mouvements et les transferts entre entrepôts.",
    "it-IT":
      "Controlli le giacenze, i movimenti e i trasferimenti tra magazzini.",
    "es-ES":
      "Controle las existencias, los movimientos y los traslados entre almacenes.",
    "sk-SK": "Sledujte stav zásob, skladové pohyby a presuny medzi skladmi.",
    "en-GLOBAL": "Track physical stock, warehouse movements and transfers.",
  },
  group: "business",
  icon: "box",
  order: 50,
  createActions: [
    "inventory_transfer_create_POST",
    "inventory_warehouse_create_POST",
  ],
  landing: {
    destinations: ["supplier-evidence", "finance-credit-liabilities"],
    actions: ["inventory-stock", "inventory-warehouses", "inventory-transfers"],
    overview: { alias: "inventory-dashboard", scope: "company" },
  },
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
        "fr-FR": "Stock",
        "it-IT": "Scorte",
        "es-ES": "Existencias",
        "sk-SK": "Stav zásob",
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
        "fr-FR": "Transferts",
        "it-IT": "Trasferimenti",
        "es-ES": "Transferencias",
        "sk-SK": "Presuny zásob",
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
        "fr-FR": "Entrepôts",
        "it-IT": "Magazzini",
        "es-ES": "Almacenes",
        "sk-SK": "Sklady",
      },
    },
  },
};
