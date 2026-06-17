/**
 * Category definition for the Analytics module.
 * Covers pipeline graphs, KPI indicators, evaluators, transformers, and data sources.
 */

import type { CategoryDefinition } from "@/app/api/[locale]/system/help/category-types";
import { VIBE_SENSE_GRAPHS_ALIAS } from "@/app/api/[locale]/system/unified-interface/vibe-sense/graphs/constants";
import { USER_ME_ALIAS } from "@/app/api/[locale]/user/private/me/constants";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

export const category: CategoryDefinition = {
  key: "analytics",
  label: {
    "en-US": "Analytics",
    "en-GLOBAL": "Analytics",
    "de-DE": "Analytik",
    "pl-PL": "Analityka",
  },
  group: "analytics",
  icon: "bar-chart-2",
  order: 10,
  defaultEntry: {
    [UserPermissionRole.ADMIN]: VIBE_SENSE_GRAPHS_ALIAS,
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
  subcategories: {
    "Vibe Sense": {
      icon: "activity",
      order: 0,
      label: {
        "en-US": "Vibe Sense",
        "en-GLOBAL": "Vibe Sense",
        "de-DE": "Vibe Sense",
        "pl-PL": "Vibe Sense",
      },
    },
    Indicators: {
      icon: "trending-up",
      order: 1,
      label: {
        "en-US": "Indicators",
        "en-GLOBAL": "Indicators",
        "de-DE": "Indikatoren",
        "pl-PL": "Wskaźniki",
      },
    },
    Evaluators: {
      icon: "check-circle",
      order: 2,
      label: {
        "en-US": "Evaluators",
        "en-GLOBAL": "Evaluators",
        "de-DE": "Auswertungen",
        "pl-PL": "Ewaluatory",
      },
    },
    Transformers: {
      icon: "shuffle",
      order: 3,
      label: {
        "en-US": "Transformers",
        "en-GLOBAL": "Transformers",
        "de-DE": "Transformatoren",
        "pl-PL": "Transformatory",
      },
    },
    leadsData: {
      icon: "users",
      order: 10,
      label: {
        "en-US": "Leads Data",
        "en-GLOBAL": "Leads Data",
        "de-DE": "Lead-Daten",
        "pl-PL": "Dane leadów",
      },
    },
    usersData: {
      icon: "user",
      order: 11,
      label: {
        "en-US": "Users Data",
        "en-GLOBAL": "Users Data",
        "de-DE": "Nutzerdaten",
        "pl-PL": "Dane użytkowników",
      },
    },
    messengerData: {
      icon: "mail",
      order: 12,
      label: {
        "en-US": "Messenger Data",
        "en-GLOBAL": "Messenger Data",
        "de-DE": "Messenger-Daten",
        "pl-PL": "Dane komunikatora",
      },
    },
    paymentsData: {
      icon: "credit-card",
      order: 13,
      label: {
        "en-US": "Payments Data",
        "en-GLOBAL": "Payments Data",
        "de-DE": "Zahlungsdaten",
        "pl-PL": "Dane płatności",
      },
    },
    creditsData: {
      icon: "coins",
      order: 14,
      label: {
        "en-US": "Credits Data",
        "en-GLOBAL": "Credits Data",
        "de-DE": "Guthaben-Daten",
        "pl-PL": "Dane kredytów",
      },
    },
    subscriptionsData: {
      icon: "repeat",
      order: 15,
      label: {
        "en-US": "Subscriptions Data",
        "en-GLOBAL": "Subscriptions Data",
        "de-DE": "Abonnement-Daten",
        "pl-PL": "Dane subskrypcji",
      },
    },
    referralData: {
      icon: "share-2",
      order: 16,
      label: {
        "en-US": "Referral Data",
        "en-GLOBAL": "Referral Data",
        "de-DE": "Empfehlungsdaten",
        "pl-PL": "Dane poleceń",
      },
    },
    newsletterData: {
      icon: "newspaper",
      order: 17,
      label: {
        "en-US": "Newsletter Data",
        "en-GLOBAL": "Newsletter Data",
        "de-DE": "Newsletter-Daten",
        "pl-PL": "Dane newslettera",
      },
    },
    chatData: {
      icon: "message-square",
      order: 18,
      label: {
        "en-US": "Chat Data",
        "en-GLOBAL": "Chat Data",
        "de-DE": "Chat-Daten",
        "pl-PL": "Dane czatu",
      },
    },
    systemData: {
      icon: "server",
      order: 19,
      label: {
        "en-US": "System Data",
        "en-GLOBAL": "System Data",
        "de-DE": "Systemdaten",
        "pl-PL": "Dane systemowe",
      },
    },
  },
};
