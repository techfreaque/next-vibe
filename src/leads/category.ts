/**
 * Category definition for the Leads module.
 * Covers lead records, imports, campaigns, and bulk operations.
 */

import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { LEADS_DASHBOARD_ALIAS } from "@/leads/dashboard/constants";
import { USER_ME_ALIAS } from "@/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "leads",
  label: {
    "en-US": "Leads",
    "en-GLOBAL": "Leads",
    "de-DE": "Leads",
    "pl-PL": "Leady",
    "fr-FR": "Leads",
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
        "fr-FR": "Gestion",
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
        "fr-FR": "Import",
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
        "fr-FR": "Leads",
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
        "fr-FR": "Campagnes",
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
        "fr-FR": "Parcours",
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
        "fr-FR": "File d'attente",
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
        "fr-FR": "Stats des campagnes",
      },
    },
    growth: {
      icon: "trending-up",
      order: 8,
      label: {
        "en-US": "Growth",
        "en-GLOBAL": "Growth",
        "de-DE": "Wachstum",
        "pl-PL": "Wzrost",
        "fr-FR": "Croissance",
      },
    },
    outreach: {
      icon: "mail",
      order: 9,
      label: {
        "en-US": "Outreach",
        "en-GLOBAL": "Outreach",
        "de-DE": "Outreach",
        "pl-PL": "Outreach",
        "fr-FR": "Prospection",
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
        "fr-FR": "Intégrations",
      },
    },
  },
};
