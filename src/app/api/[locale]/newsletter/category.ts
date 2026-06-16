/**
 * Category definition for the Newsletter module.
 * Covers email campaigns, journey variants, queue processing, stats, and subscriber management.
 */

import { CAMPAIGN_STATS_ALIAS } from "@/app/api/[locale]/leads/campaigns/stats/constants";
import type { CategoryDefinition } from "@/app/api/[locale]/system/help/category-types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import { USER_ME_ALIAS } from "@/app/api/[locale]/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "newsletter",
  label: {
    "en-US": "Newsletter",
    "en-GLOBAL": "Newsletter",
    "de-DE": "Newsletter",
    "pl-PL": "Newsletter",
  },
  group: "comms",
  icon: "send",
  order: 20,
  defaultEntry: {
    [UserPermissionRole.ADMIN]: CAMPAIGN_STATS_ALIAS,
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
  subcategories: {
    emailCampaignsStats: {
      icon: "bar-chart-2",
      order: 0,
      label: {
        "en-US": "Campaign Stats",
        "en-GLOBAL": "Campaign Stats",
        "de-DE": "Kampagnen-Statistiken",
        "pl-PL": "Statystyki kampanii",
      },
    },
    emailCampaignsProcessing: {
      icon: "mail",
      order: 1,
      label: {
        "en-US": "Campaigns",
        "en-GLOBAL": "Campaigns",
        "de-DE": "Kampagnen",
        "pl-PL": "Kampanie",
      },
    },
    emailCampaignsJourneys: {
      icon: "git-branch",
      order: 2,
      label: {
        "en-US": "Journeys",
        "en-GLOBAL": "Journeys",
        "de-DE": "Journeys",
        "pl-PL": "Podróże",
      },
    },
    emailCampaignsQueue: {
      icon: "list",
      order: 3,
      label: {
        "en-US": "Queue",
        "en-GLOBAL": "Queue",
        "de-DE": "Warteschlange",
        "pl-PL": "Kolejka",
      },
    },
    Subscriptions: {
      icon: "user-check",
      order: 4,
      label: {
        "en-US": "Subscriptions",
        "en-GLOBAL": "Subscriptions",
        "de-DE": "Abonnements",
        "pl-PL": "Subskrypcje",
      },
    },
  },
};
