/**
 * Category definition for the Subscription admin module.
 * Covers subscription statistics, credit purchases, and referral administration.
 */

import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { SUBSCRIPTION_DASHBOARD_ALIAS } from "@/subscription/dashboard/constants";
import { USER_ME_ALIAS } from "@/user/private/me/constants";

import { SUBSCRIPTION_ADMIN_LIST_ALIAS } from "./admin/list/constants";

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
    "sk-SK": "Predplatné",
  },
  description: {
    "en-US": "Find active plans, renewals and cancellations.",
    "en-GLOBAL": "Find active plans, renewals and cancellations.",
    "de-DE": "Sehen Sie aktive Abos, Verlängerungen und Kündigungen ein.",
    "pl-PL": "Sprawdź aktywne plany, odnowienia i rezygnacje.",
    "fr-FR":
      "Consultez les abonnements actifs, les renouvellements et les résiliations.",
    "it-IT": "Consulti i piani attivi, i rinnovi e le disdette.",
    "es-ES":
      "Consulte los planes activos, las renovaciones y las cancelaciones.",
    "sk-SK": "Skontrolujte aktívne predplatné, obnovenia a zrušenia.",
  },
  group: "billing",
  icon: "refresh-cw",
  order: 12,
  landing: {
    actions: [
      "subscription-admin-list",
      "subscription-admin-stats",
      "products-catalog-list",
    ],
  },
  defaultEntry: {
    [UserPermissionRole.ADMIN]: SUBSCRIPTION_ADMIN_LIST_ALIAS,
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
        "sk-SK": "Predplatné",
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
        "sk-SK": "Správa",
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
        "sk-SK": "Analytika",
      },
    },
  },
};
