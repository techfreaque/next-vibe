/**
 * Category definition for the Credits module.
 * Covers credit balance, history, purchases, grants, and admin operations.
 */

import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { CREDIT_USAGE_REPORT_ALIAS } from "./analytics/usage/constants";
import { CREDITS_ALIAS } from "./constants";

export const category: CategoryDefinition = {
  key: "credits",
  label: {
    "en-US": "Credits",
    "en-GLOBAL": "Credits",
    "de-DE": "Guthaben",
    "pl-PL": "Środki",
    "fr-FR": "Crédits",
    "it-IT": "Crediti",
    "es-ES": "Créditos",
    "sk-SK": "Kredity",
  },
  description: {
    "en-US": "Review credit purchases, balances and usage.",
    "en-GLOBAL": "Review credit purchases, balances and usage.",
    "de-DE": "Prüfen Sie Guthabenkäufe, Salden und Verbrauch.",
    "pl-PL": "Sprawdź zakupione środki, salda i zużycie.",
    "fr-FR": "Consultez les achats de crédits, les soldes et la consommation.",
    "it-IT": "Consulti gli acquisti di crediti, i saldi e i consumi.",
    "es-ES": "Consulte las compras de créditos, los saldos y el consumo.",
    "sk-SK": "Skontrolujte nákupy kreditov, zostatky a čerpanie.",
  },
  group: "billing",
  icon: "coins",
  order: 15,
  landing: {
    actions: ["credit-usage-report", "credits-history", "credits-balance"],
  },
  defaultEntry: {
    [UserPermissionRole.ADMIN]: CREDIT_USAGE_REPORT_ALIAS,
    [UserPermissionRole.CUSTOMER]: CREDITS_ALIAS,
    [UserPermissionRole.PUBLIC]: CREDITS_ALIAS,
  },
  subcategories: {
    Credits: {
      icon: "coins",
      order: 0,
      label: {
        "en-US": "Credits",
        "en-GLOBAL": "Credits",
        "de-DE": "Guthaben",
        "pl-PL": "Środki",
        "fr-FR": "Crédits",
        "it-IT": "Crediti",
        "es-ES": "Créditos",
        "sk-SK": "Kredity",
      },
      // inherits parent defaultEntry (credits-balance)
    },
    Management: {
      icon: "shield",
      order: 1,
      label: {
        "en-US": "Management",
        "en-GLOBAL": "Management",
        "de-DE": "Verwaltung",
        "pl-PL": "Zarządzanie",
        "fr-FR": "Gestion",
        "it-IT": "Gestione",
        "es-ES": "Gestión",
        "sk-SK": "Správa",
      },
    },
  },
};
