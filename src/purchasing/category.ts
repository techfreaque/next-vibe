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
  description: {
    "en-US": "Manage suppliers, purchase orders and deliveries.",
    "de-DE": "Verwalten Sie Lieferanten, Bestellungen und Lieferungen.",
    "pl-PL": "Zarządzaj dostawcami, zamówieniami i dostawami.",
    "fr-FR": "Gérez les fournisseurs, les commandes et les livraisons.",
    "it-IT": "Gestisca i fornitori, gli ordini di acquisto e le consegne.",
    "es-ES": "Gestione proveedores, pedidos de compra y entregas.",
    "sk-SK": "Spravujte dodávateľov, nákupné objednávky a dodávky.",
    "en-GLOBAL": "Manage suppliers, purchase orders and deliveries.",
  },
  group: "business",
  icon: "shopping-bag",
  order: 55,
  createActions: [
    "purchasing_order_create_POST",
    "purchasing_vendor_create_POST",
  ],
  landing: {
    overview: { alias: "purchasing-dashboard", scope: "company" },
    destinations: [
      "purchasing-orders",
      "purchasing-vendors",
      "payment-bill-list",
    ],
    actions: ["purchasing_order_create_POST"],
    destinationDescriptions: {
      "purchasing-orders": {
        "en-US": "Purchase orders by vendor and status.",
        "en-GLOBAL": "Purchase orders by vendor and status.",
        "de-DE": "Bestellungen nach Lieferant und Status.",
        "pl-PL": "Zamówienia zakupu według dostawcy i statusu.",
        "fr-FR": "Bons de commande par fournisseur et statut.",
        "it-IT": "Ordini di acquisto per fornitore e stato.",
        "es-ES": "Pedidos de compra por proveedor y estado.",
        "sk-SK": "Nákupné objednávky podľa dodávateľa a stavu.",
      },
      "purchasing-vendors": {
        "en-US": "The suppliers you buy from.",
        "en-GLOBAL": "The suppliers you buy from.",
        "de-DE": "Die Lieferanten, bei denen Sie einkaufen.",
        "pl-PL": "Dostawcy, od których kupujesz.",
        "fr-FR": "Les fournisseurs auprès desquels vous achetez.",
        "it-IT": "I fornitori da cui acquista.",
        "es-ES": "Los proveedores a los que compra.",
        "sk-SK": "Dodávatelia, od ktorých nakupujete.",
      },
      "payment-bill-list": {
        "en-US": "Bills from your vendors, ready to approve and pay.",
        "en-GLOBAL": "Bills from your vendors, ready to approve and pay.",
        "de-DE":
          "Rechnungen Ihrer Lieferanten, bereit zum Freigeben und Bezahlen.",
        "pl-PL": "Rachunki od dostawców gotowe do akceptacji i zapłaty.",
        "fr-FR": "Factures de vos fournisseurs, prêtes à valider et payer.",
        "it-IT": "Fatture dei fornitori, pronte da approvare e pagare.",
        "es-ES": "Facturas de sus proveedores, listas para aprobar y pagar.",
        "sk-SK": "Faktúry od dodávateľov pripravené na schválenie a úhradu.",
      },
    },
  },
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
