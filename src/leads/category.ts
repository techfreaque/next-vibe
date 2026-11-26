/**
 * Category definition for the Leads module.
 * Covers lead records, imports, campaigns, and bulk operations.
 */

import type {
  CategoryDefinition,
  RecordSearchDestination,
} from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { ACQUISITION_REPORT_ALIAS } from "@/leads/analytics/acquisition/constants";
import { LEADS_SEARCH_ALIAS } from "@/leads/search/constants";
import type leadSearch from "@/leads/search/definition";
import { USER_ME_ALIAS } from "@/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "leads",
  label: {
    "en-US": "Leads",
    "en-GLOBAL": "Leads",
    "de-DE": "Leads",
    "pl-PL": "Leady",
    "fr-FR": "Leads",
    "it-IT": "Contatti commerciali",
    "es-ES": "Prospectos",
    "sk-SK": "Potenciálni zákazníci",
  },
  description: {
    "en-US":
      "Review where leads came from, how they converted and who arrived recently.",
    "de-DE":
      "Prüfen Sie die Herkunft, Konversion und letzten Zugänge Ihrer Leads.",
    "pl-PL": "Sprawdź źródła leadów, konwersje i ostatnie kontakty.",
    "fr-FR":
      "Identifiez les sources de vos leads, les conversions et les nouveaux contacts.",
    "it-IT": "Verifica la provenienza, le conversioni e i nuovi contatti.",
    "es-ES":
      "Revisa el origen, las conversiones y los prospectos más recientes.",
    "sk-SK":
      "Skontrolujte zdroje kontaktov, konverzie a najnovších potenciálnych zákazníkov.",
    "en-GLOBAL":
      "Review where leads came from, how they converted and who arrived recently.",
  },
  group: "people",
  icon: "target",
  order: 20,
  createActions: ["leads_create_POST"],
  landing: {
    summary: { alias: "leads-dashboard", scope: "platform" },
    actions: ["leads_create_POST"],
    destinations: [
      "leads-list",
      "leads-search",
      "acquisition-report",
      "funnel-report",
      "abuse-report",
      "campaign-stats",
    ],
  },
  defaultEntry: {
    [UserPermissionRole.ADMIN]: ACQUISITION_REPORT_ALIAS,
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
  recordSearch: {
    alias: LEADS_SEARCH_ALIAS,
    field: "search",
  } satisfies RecordSearchDestination<typeof leadSearch.GET>,
  subcategories: {
    Analytics: {
      icon: "bar-chart-2",
      order: -1,
      label: {
        "en-US": "Analytics",
        "en-GLOBAL": "Analytics",
        "de-DE": "Analysen",
        "pl-PL": "Analityka",
        "fr-FR": "Analyses",
        "it-IT": "Analisi",
        "es-ES": "Análisis",
        "sk-SK": "Analytika",
      },
    },
    Management: {
      icon: "users",
      order: 0,
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
      // inherits parent defaultEntry (acquisition-report)
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
        "it-IT": "Importazione",
        "es-ES": "Importación",
        "sk-SK": "Import",
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
        "it-IT": "Contatti commerciali",
        "es-ES": "Prospectos",
        "sk-SK": "Potenciálni zákazníci",
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
        "it-IT": "Campagne",
        "es-ES": "Campañas",
        "sk-SK": "Kampane",
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
        "it-IT": "Percorsi",
        "es-ES": "Secuencias",
        "sk-SK": "Komunikačné scenáre",
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
        "it-IT": "Coda",
        "es-ES": "Cola",
        "sk-SK": "Front",
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
        "it-IT": "Statistiche campagne",
        "es-ES": "Estadísticas de campañas",
        "sk-SK": "Štatistiky kampaní",
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
        "it-IT": "Crescita",
        "es-ES": "Crecimiento",
        "sk-SK": "Rast",
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
        "it-IT": "Primi contatti",
        "es-ES": "Contacto inicial",
        "sk-SK": "Oslovovanie zákazníkov",
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
        "it-IT": "Integrazioni",
        "es-ES": "Integraciones",
        "sk-SK": "Integrácie",
      },
    },
  },
};
