/**
 * Category definition for the Finance module.
 * Revenue vs upstream cost monitoring: margin, provider balances, alerts.
 */

import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { USER_ME_ALIAS } from "@/user/private/me/constants";

import { FINANCE_STATUS_ALIAS } from "./constants";

export const category: CategoryDefinition = {
  key: "finance",
  label: {
    "en-US": "Finance",
    "en-GLOBAL": "Finance",
    "de-DE": "Finanzen",
    "pl-PL": "Finanse",
    "fr-FR": "Finance",
    "it-IT": "Finanze",
    "es-ES": "Finanzas",
    "sk-SK": "Financie",
  },
  description: {
    "en-US": "Review monthly profit, provider costs and bank transactions.",
    "de-DE": "Prüfen Sie Monatsergebnis, Anbieterkosten und Bankumsätze.",
    "pl-PL": "Sprawdź miesięczny wynik, koszty dostawców i transakcje bankowe.",
    "fr-FR":
      "Consultez le résultat mensuel, les coûts des prestataires et les opérations bancaires.",
    "it-IT":
      "Consulti il risultato mensile, i costi dei fornitori e i movimenti bancari.",
    "es-ES":
      "Revise el resultado mensual, los costes de los proveedores y los movimientos bancarios.",
    "sk-SK":
      "Skontrolujte mesačný výsledok, náklady na poskytovateľov a bankové pohyby.",
    "en-GLOBAL": "Review monthly profit, provider costs and bank transactions.",
  },
  group: "system",
  icon: "wallet",
  order: 66,
  landing: {
    destinations: [
      "finance-monthly-profit",
      "bank-statement-lines",
      "bank-connections",
      "supplier-evidence",
      "finance-credit-liabilities",
    ],
    overview: { alias: "finance-monthly-profit", scope: "company" },
    actions: [
      "bank-statement-lines",
      "finance-monthly-profit",
      "supplier-evidence",
    ],
  },
  defaultEntry: {
    [UserPermissionRole.ADMIN]: FINANCE_STATUS_ALIAS,
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
  subcategories: {
    "Credit liabilities": {
      icon: "wallet",
      order: 3,
      label: {
        "en-US": "Credit liabilities",
        "en-GLOBAL": "Credit liabilities",
        "de-DE": "Guthabenverbindlichkeiten",
        "pl-PL": "Zobowiązania za kredyty",
        "fr-FR": "Engagements sur crédits",
        "it-IT": "Passività per crediti",
        "es-ES": "Pasivos por créditos",
        "sk-SK": "Záväzky za kredity",
      },
    },
    "Finance: Suppliers": {
      icon: "briefcase",
      order: 2,
      label: {
        "en-US": "Suppliers",
        "en-GLOBAL": "Suppliers",
        "de-DE": "Lieferanten",
        "pl-PL": "Dostawcy",
        "fr-FR": "Fournisseurs",
        "it-IT": "Fornitori",
        "es-ES": "Proveedores",
        "sk-SK": "Dodávatelia",
      },
    },
    "Bank reconciliation": {
      icon: "wallet",
      order: 1,
      label: {
        "en-US": "Bank reconciliation",
        "en-GLOBAL": "Bank reconciliation",
        "de-DE": "Bankabgleich",
        "pl-PL": "Uzgadnianie banku",
        "fr-FR": "Rapprochement bancaire",
        "it-IT": "Riconciliazione bancaria",
        "es-ES": "Conciliación bancaria",
        "sk-SK": "Párovanie bankových pohybov",
      },
    },
    Monitoring: {
      icon: "activity",
      order: 0,
      label: {
        "en-US": "Monitoring",
        "en-GLOBAL": "Monitoring",
        "de-DE": "Überwachung",
        "pl-PL": "Monitoring",
        "fr-FR": "Monitoring",
        "it-IT": "Monitoraggio",
        "es-ES": "Monitoreo",
        "sk-SK": "Monitorovanie",
      },
    },
  },
};
