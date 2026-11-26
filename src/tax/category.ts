/**
 * Category definition for the Tax module.
 * Covers tax rate configuration and tax reporting.
 */

import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { USER_ME_ALIAS } from "@/user/private/me/constants";

import { TAX_RATE_LIST_ALIAS } from "./rate/list/constants";

export const category: CategoryDefinition = {
  key: "tax",
  label: {
    "en-US": "Tax",
    "en-GLOBAL": "Tax",
    "de-DE": "Steuern",
    "pl-PL": "Podatki",
    "fr-FR": "Taxes",
    "it-IT": "Imposte",
    "es-ES": "Impuestos",
    "sk-SK": "Dane",
  },
  description: {
    "en-US": "Review your tax regime, rates and VAT summary.",
    "de-DE":
      "Prüfen Sie Steuerregelung, Steuersätze und Umsatzsteuerübersicht.",
    "pl-PL": "Sprawdź sposób rozliczania podatku, stawki i podsumowanie VAT.",
    "fr-FR":
      "Consultez votre régime fiscal, vos taux et votre synthèse de TVA.",
    "it-IT": "Consulti il regime fiscale, le aliquote e il riepilogo IVA.",
    "es-ES": "Revise su régimen fiscal, tipos impositivos y resumen de IVA.",
    "sk-SK": "Skontrolujte daňový režim firmy, sadzby a prehľad DPH.",
    "en-GLOBAL": "Review your tax regime, rates and VAT summary.",
  },
  group: "business",
  icon: "file-text",
  order: 65,
  createActions: ["tax_rate_create_POST"],
  landing: {
    destinations: [
      "company-tax-regime-view",
      "tax-rate-list",
      "coa-tax-report",
    ],
    actions: ["company-tax-regime-view", "tax-rate-list", "coa-tax-report"],
  },
  defaultEntry: {
    [UserPermissionRole.ADMIN]: TAX_RATE_LIST_ALIAS,
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
  subcategories: {
    "Tax Rates": {
      icon: "receipt",
      order: 0,
      label: {
        "en-US": "Tax Rates",
        "en-GLOBAL": "Tax Rates",
        "de-DE": "Steuersätze",
        "pl-PL": "Stawki podatkowe",
        "fr-FR": "Taux de taxe",
        "it-IT": "Aliquote fiscali",
        "es-ES": "Tasas impositivas",
        "sk-SK": "Daňové sadzby",
      },
      // inherits parent defaultEntry (tax/rate/list)
    },
    "Tax Reports": {
      icon: "bar-chart-2",
      order: 1,
      label: {
        "en-US": "Reports",
        "en-GLOBAL": "Reports",
        "de-DE": "Berichte",
        "pl-PL": "Raporty",
        "fr-FR": "Rapports",
        "it-IT": "Report",
        "es-ES": "Informes",
        "sk-SK": "Daňové výkazy",
      },
    },
  },
};
