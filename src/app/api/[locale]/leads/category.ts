/**
 * Category definition for the Leads module.
 * Covers lead records, imports, campaigns, and bulk operations.
 */

import { LEADS_DASHBOARD_ALIAS } from "@/app/api/[locale]/leads/dashboard/constants";
import type { CategoryDefinition } from "@/app/api/[locale]/system/help/category-types";
import { USER_ME_ALIAS } from "@/app/api/[locale]/user/private/me/constants";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

export const category: CategoryDefinition = {
  key: "leads",
  label: {
    "en-US": "Leads",
    "en-GLOBAL": "Leads",
    "de-DE": "Leads",
    "pl-PL": "Leady",
  },
  group: "business",
  icon: "target",
  order: 20,
  defaultEntry: {
    [UserPermissionRole.ADMIN]: LEADS_DASHBOARD_ALIAS,
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
  subcategories: {
    Management: {
      icon: "users",
      order: 0,
      label: {
        "en-US": "Management",
        "en-GLOBAL": "Management",
        "de-DE": "Verwaltung",
        "pl-PL": "Zarządzanie",
      },
      // inherits parent defaultEntry (leads-dashboard)
    },
    Import: {
      icon: "upload",
      order: 1,
      label: {
        "en-US": "Import",
        "en-GLOBAL": "Import",
        "de-DE": "Import",
        "pl-PL": "Import",
      },
    },
    Leads: {
      icon: "target",
      order: 2,
      label: {
        "en-US": "Leads",
        "en-GLOBAL": "Leads",
        "de-DE": "Leads",
        "pl-PL": "Leady",
      },
    },
    emailCampaignsProcessing: {
      icon: "mail",
      order: 3,
      label: {
        "en-US": "Campaigns",
        "en-GLOBAL": "Campaigns",
        "de-DE": "Kampagnen",
        "pl-PL": "Kampanie",
      },
    },
    emailCampaignsJourneys: {
      icon: "git-branch",
      order: 4,
      label: {
        "en-US": "Journeys",
        "en-GLOBAL": "Journeys",
        "de-DE": "Journeys",
        "pl-PL": "Ścieżki",
      },
    },
    emailCampaignsQueue: {
      icon: "list",
      order: 5,
      label: {
        "en-US": "Queue",
        "en-GLOBAL": "Queue",
        "de-DE": "Warteschlange",
        "pl-PL": "Kolejka",
      },
    },
    emailCampaignsStats: {
      icon: "bar-chart-2",
      order: 6,
      label: {
        "en-US": "Campaign Stats",
        "en-GLOBAL": "Campaign Stats",
        "de-DE": "Kampagnenstatistiken",
        "pl-PL": "Statystyki kampanii",
      },
    },
    leadMagnetIntegrations: {
      icon: "plug",
      order: 7,
      label: {
        "en-US": "Integrations",
        "en-GLOBAL": "Integrations",
        "de-DE": "Integrationen",
        "pl-PL": "Integracje",
      },
    },
  },
};
