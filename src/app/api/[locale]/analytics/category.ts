/**
 * Category definition for the Analytics module.
 * Covers pipeline graphs, KPI indicators, evaluators, transformers, and data sources.
 */

import type { CategoryDefinition } from "@/app/api/[locale]/system/help/category-types";
import { CHAT_MESSAGES_BY_USER_ALIAS } from "@/app/api/[locale]/agent/chat/data-sources/chat-messages-by-user/constants";
import { LEADS_CONVERTED_ALIAS } from "@/app/api/[locale]/leads/data-sources/leads-converted/constants";
import { MESSENGER_DELIVERED_ALIAS } from "@/app/api/[locale]/messenger/data-sources/messenger-delivered/constants";
import { NEWSLETTER_UNSUBSCRIBES_ALIAS } from "@/app/api/[locale]/newsletter/data-sources/newsletter-unsubscribes/constants";
import { PAYMENTS_INVOICES_PAID_ALIAS } from "@/app/api/[locale]/payment/data-sources/payments-invoices-paid/constants";
import { REFERRALS_EARNINGS_VOLUME_ALIAS } from "@/app/api/[locale]/referral/data-sources/referrals-earnings-volume/constants";
import { SUBSCRIPTIONS_NEW_ALIAS } from "@/app/api/[locale]/subscription/data-sources/subscriptions-new/constants";
import { CRON_EXECUTIONS_SUCCEEDED_ALIAS } from "@/app/api/[locale]/system/unified-interface/data-sources/cron-executions-succeeded/constants";
import { CREDITS_USAGE_WITH_FEATURE_ALIAS } from "@/app/api/[locale]/credits/data-sources/credits-usage-with-feature/constants";
import { USERS_ACTIVE_TOTAL_ALIAS } from "@/app/api/[locale]/user/data-sources/users-active-total/constants";
import { VIBE_SENSE_GRAPHS_ALIAS } from "@/app/api/[locale]/system/unified-interface/vibe-sense/graphs/constants";

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
  defaultEntry: VIBE_SENSE_GRAPHS_ALIAS,
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
      defaultEntry: VIBE_SENSE_GRAPHS_ALIAS,
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
      defaultEntry: LEADS_CONVERTED_ALIAS,
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
      defaultEntry: USERS_ACTIVE_TOTAL_ALIAS,
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
      defaultEntry: MESSENGER_DELIVERED_ALIAS,
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
      defaultEntry: PAYMENTS_INVOICES_PAID_ALIAS,
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
      defaultEntry: CREDITS_USAGE_WITH_FEATURE_ALIAS,
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
      defaultEntry: SUBSCRIPTIONS_NEW_ALIAS,
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
      defaultEntry: REFERRALS_EARNINGS_VOLUME_ALIAS,
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
      defaultEntry: NEWSLETTER_UNSUBSCRIBES_ALIAS,
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
      defaultEntry: CHAT_MESSAGES_BY_USER_ALIAS,
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
      defaultEntry: CRON_EXECUTIONS_SUCCEEDED_ALIAS,
    },
  },
};
