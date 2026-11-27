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
    "hi-IN": "इन्वेंटरी",
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
    "hi-IN": "फ़िज़िकल स्टॉक, वेयरहाउस मूवमेंट और ट्रांसफ़र ट्रैक करें।",
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
    overview: { alias: "inventory-dashboard", scope: "company" },
    destinations: [
      "inventory-stock",
      "inventory-warehouses",
      "inventory-transfers",
    ],
    actions: [
      "inventory_transfer_create_POST",
      "inventory_warehouse_create_POST",
    ],
    destinationDescriptions: {
      "inventory-stock": {
        "en-US": "Stock per warehouse, with low-stock warnings.",
        "en-GLOBAL": "Stock per warehouse, with low-stock warnings.",
        "de-DE": "Bestand je Lager, mit Warnung bei Mindestbestand.",
        "pl-PL": "Stany w każdym magazynie z ostrzeżeniem o niskim stanie.",
        "fr-FR": "Stock par entrepôt, avec alerte de stock bas.",
        "it-IT": "Giacenze per magazzino, con avviso di scorte basse.",
        "es-ES": "Existencias por almacén, con aviso de stock bajo.",
        "sk-SK": "Zásoby v každom sklade s upozornením na nízky stav.",
        "hi-IN": "हर वेयरहाउस का स्टॉक, कम स्टॉक की चेतावनी के साथ।",
      },
      "inventory-warehouses": {
        "en-US": "Every warehouse and stock location you run.",
        "en-GLOBAL": "Every warehouse and stock location you run.",
        "de-DE": "Alle Lager und Lagerorte Ihres Unternehmens.",
        "pl-PL": "Wszystkie magazyny i miejsca składowania.",
        "fr-FR": "Tous vos entrepôts et emplacements de stock.",
        "it-IT": "Tutti i magazzini e i punti di stoccaggio.",
        "es-ES": "Todos sus almacenes y ubicaciones de stock.",
        "sk-SK": "Všetky sklady a skladové miesta.",
        "hi-IN": "आपके सभी वेयरहाउस और स्टॉक लोकेशन।",
      },
      "inventory-transfers": {
        "en-US": "Stock moved between warehouses, open and done.",
        "en-GLOBAL": "Stock moved between warehouses, open and done.",
        "de-DE": "Umlagerungen zwischen Lagern, offen und erledigt.",
        "pl-PL": "Przesunięcia między magazynami, otwarte i zakończone.",
        "fr-FR": "Transferts entre entrepôts, en cours et terminés.",
        "it-IT": "Trasferimenti tra magazzini, aperti e completati.",
        "es-ES": "Traslados entre almacenes, abiertos y completados.",
        "sk-SK": "Presuny medzi skladmi, otvorené aj dokončené.",
        "hi-IN": "वेयरहाउस के बीच भेजा गया स्टॉक, बाकी और पूरा।",
      },
    },
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
        "hi-IN": "स्टॉक",
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
        "hi-IN": "ट्रांसफ़र",
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
        "hi-IN": "वेयरहाउस",
      },
    },
  },
};
