import { translations as componentsTranslations } from "../../components/i18n/pl";
import { translations as createTranslations } from "../../create/i18n/pl";
import { translations as editTranslations } from "../../edit/i18n/pl";
import { translations as listTranslations } from "../../list/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Klient SMTP",
  category: "Usługi Email",
  components: componentsTranslations,
  create: createTranslations,
  edit: editTranslations,
  list: listTranslations,
  sending: {
    errors: {
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd na serwerze SMTP",
      },
      rejected: {
        title: "Email odrzucony",
        defaultReason: "Email odrzucony przez serwer",
      },
      no_recipients: {
        title: "Brak zaakceptowanych odbiorców",
        defaultReason: "Brak zaakceptowanych odbiorców",
      },
      rate_limit: {
        title: "Przekroczono limit szybkości",
      },
      capacity: {
        title: "Błąd pojemności",
      },
      no_account: {
        title: "Brak dostępnego konta SMTP",
      },
    },
  },
  emailMetadata: {
    errors: {
      server: {
        title: "Błąd serwera metadanych email",
        description: "Nie udało się zapisać metadanych emaila",
      },
    },
  },
  enums: {
    status: {
      active: "Aktywny",
      inactive: "Nieaktywny",
      error: "Błąd",
      testing: "Testowanie",
    },
    securityType: {
      none: "Brak",
      tls: "TLS",
      ssl: "SSL",
      starttls: "STARTTLS",
    },
    statusFilter: {
      all: "Wszystkie statusy",
    },
    healthStatus: {
      healthy: "Zdrowy",
      degraded: "Ograniczony",
      unhealthy: "Niezdrowy",
      unknown: "Nieznany",
    },
    healthStatusFilter: {
      all: "Wszystkie statusy zdrowia",
    },
    sortField: {
      name: "Nazwa",
      status: "Status",
      createdAt: "Utworzono",
      updatedAt: "Zaktualizowano",
      priority: "Priorytet",
      totalEmailsSent: "Łącznie wysłanych emaili",
      lastUsedAt: "Ostatnio używane",
    },
    campaignType: {
      leadCampaign: "Kampania leadów",
      newsletter: "Newsletter",
      transactional: "Transakcyjny",
      notification: "Powiadomienie",
      system: "System",
    },
    campaignTypeFilter: {
      all: "Wszystkie typy kampanii",
    },
    selectionRuleSortField: {
      name: "Nazwa",
      priority: "Priorytet",
      campaignType: "Typ kampanii",
      journeyVariant: "Wariant podróży",
      campaignStage: "Etap kampanii",
      country: "Kraj",
      language: "Język",
      createdAt: "Utworzono",
      updatedAt: "Zaktualizowano",
      emailsSent: "Wysłane emaile",
      successRate: "Wskaźnik sukcesu",
      lastUsedAt: "Ostatnio używane",
    },
    selectionRuleStatusFilter: {
      all: "Wszystkie",
      active: "Aktywny",
      inactive: "Nieaktywny",
      default: "Domyślny",
      failover: "Awaryjny",
    },
    loadBalancingStrategy: {
      roundRobin: "Round-Robin",
      weighted: "Ważony",
      priority: "Priorytet",
      leastUsed: "Najmniej używany",
    },
    testResult: {
      success: "Sukces",
      authFailed: "Uwierzytelnienie nie powiodło się",
      connectionFailed: "Połączenie nie powiodło się",
      timeout: "Przekroczono limit czasu",
      unknownError: "Nieznany błąd",
    },
  },
};
