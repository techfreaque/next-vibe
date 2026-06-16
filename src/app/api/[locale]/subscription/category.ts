/**
 * Category definition for the Subscription admin module.
 * Covers subscription statistics, credit purchases, and referral administration.
 */

import { SUBSCRIPTION_DASHBOARD_ALIAS } from "@/app/api/[locale]/subscription/dashboard/constants";
import type { CategoryDefinition } from "@/app/api/[locale]/system/help/category-types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import { USER_ME_ALIAS } from "@/app/api/[locale]/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "subscriptions",
  label: {
    "en-US": "Subscriptions",
    "en-GLOBAL": "Subscriptions",
    "de-DE": "Abonnements",
    "pl-PL": "Subskrypcje",
  },
  group: "business",
  icon: "refresh-cw",
  order: 12,
  defaultEntry: {
    [UserPermissionRole.ADMIN]: SUBSCRIPTION_DASHBOARD_ALIAS,
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
      },
    },
  },
};
