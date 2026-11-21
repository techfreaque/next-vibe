/**
 * Category definition for the Subscription admin module.
 * Covers subscription statistics, credit purchases, and referral administration.
 */

import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { REVENUE_REPORT_ALIAS } from "@/payment/analytics/revenue/constants";
import { SUBSCRIPTION_DASHBOARD_ALIAS } from "@/subscription/dashboard/constants";
import { USER_ME_ALIAS } from "@/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "subscriptions",
  label: {
    "en-US": "Subscriptions",
    "en-GLOBAL": "Subscriptions",
    "de-DE": "Abonnements",
    "pl-PL": "Subskrypcje",
    "fr-FR": "Abonnements",
    "it-IT": "Abbonamenti",
    "es-ES": "Suscripciones",
  },
  group: "business",
  icon: "refresh-cw",
  order: 12,
  defaultEntry: {
    [UserPermissionRole.ADMIN]: REVENUE_REPORT_ALIAS,
    [UserPermissionRole.CUSTOMER]: SUBSCRIPTION_DASHBOARD_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
  subcategories: {
    Subscriptions: {
      icon: "refresh-cw",
      order: 0,
      label: {
        "en-US": "Subscriptions",
        "en-GLOBAL": "Subscriptions",
        "de-DE": "Abonnements",
        "pl-PL": "Subskrypcje",
        "fr-FR": "Abonnements",
        "it-IT": "Abbonamenti",
        "es-ES": "Suscripciones",
      },
    },
    Management: {
      icon: "settings-2",
      order: 1,
      label: {
        "en-US": "Management",
        "en-GLOBAL": "Management",
        "de-DE": "Verwaltung",
        "pl-PL": "Zarządzanie",
        "fr-FR": "Gestion",
        "it-IT": "Gestione",
        "es-ES": "Gestión",
      },
    },
    subscriptionAnalytics: {
      icon: "bar-chart-2",
      order: 2,
      label: {
        "en-US": "Analytics",
        "en-GLOBAL": "Analytics",
        "de-DE": "Analytik",
        "pl-PL": "Analityka",
        "fr-FR": "Analytique",
        "it-IT": "Analisi",
        "es-ES": "Analítica",
      },
    },
  },
};
