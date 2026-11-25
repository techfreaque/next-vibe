/**
 * Category definition for the Newsletter module.
 * Covers email campaigns, journey variants, queue processing, stats, and subscriber management.
 */

import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { CAMPAIGN_STATS_ALIAS } from "@/leads/campaigns/stats/constants";
import { USER_ME_ALIAS } from "@/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "newsletter",
  label: {
    "en-US": "Newsletter",
    "en-GLOBAL": "Newsletter",
    "de-DE": "Newsletter",
    "pl-PL": "Newsletter",
    "fr-FR": "Newsletter",
    "it-IT": "Newsletter",
    "es-ES": "Boletín",
    "sk-SK": "Newsletter",
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
        "fr-FR": "Stats des campagnes",
        "it-IT": "Statistiche campagne",
        "es-ES": "Estadísticas de campañas",
        "sk-SK": "Štatistiky kampaní",
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
        "fr-FR": "Campagnes",
        "it-IT": "Campagne",
        "es-ES": "Campañas",
        "sk-SK": "Kampane",
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
        "fr-FR": "Parcours",
        "it-IT": "Percorsi",
        "es-ES": "Secuencias",
        "sk-SK": "Komunikačné scenáre",
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
        "fr-FR": "File d'attente",
        "it-IT": "Coda",
        "es-ES": "Cola",
        "sk-SK": "Front",
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
        "fr-FR": "Abonnements",
        "it-IT": "Abbonamenti",
        "es-ES": "Suscripciones",
        "sk-SK": "Predplatné",
      },
    },
  },
};
