import { translations as componentsTranslations } from "../../components/i18n/de";
import { translations as createTranslations } from "../../create/i18n/de";
import { translations as editTranslations } from "../../edit/i18n/de";
import { translations as listTranslations } from "../../list/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "SMTP-Client",
  category: "E-Mail-Dienste",
  components: componentsTranslations,
  create: createTranslations,
  edit: editTranslations,
  list: listTranslations,
  sending: {
    errors: {
      server: {
        title: "Server-Fehler",
        description: "Ein Fehler ist auf dem SMTP-Server aufgetreten",
      },
      rejected: {
        title: "E-Mail abgelehnt",
        defaultReason: "E-Mail vom Server abgelehnt",
      },
      no_recipients: {
        title: "Keine Empfänger akzeptiert",
        defaultReason: "Keine Empfänger akzeptiert",
      },
      rate_limit: {
        title: "Ratenlimit überschritten",
      },
      capacity: {
        title: "Kapazitätsfehler",
      },
      no_account: {
        title: "Kein SMTP-Konto verfügbar",
      },
    },
  },
  enums: {
    status: {
      active: "Aktiv",
      inactive: "Inaktiv",
      error: "Fehler",
      testing: "Testen",
    },
    securityType: {
      none: "Keine",
      tls: "TLS",
      ssl: "SSL",
      starttls: "STARTTLS",
    },
    statusFilter: {
      all: "Alle Status",
    },
    healthStatus: {
      healthy: "Gesund",
      degraded: "Beeinträchtigt",
      unhealthy: "Ungesund",
      unknown: "Unbekannt",
    },
    healthStatusFilter: {
      all: "Alle Gesundheitsstatus",
    },
    sortField: {
      name: "Name",
      status: "Status",
      createdAt: "Erstellt am",
      updatedAt: "Aktualisiert am",
      priority: "Priorität",
      totalEmailsSent: "Gesamt gesendete E-Mails",
      lastUsedAt: "Zuletzt verwendet",
    },
    campaignType: {
      leadCampaign: "Lead-Kampagne",
      newsletter: "Newsletter",
      transactional: "Transaktional",
      notification: "Benachrichtigung",
      system: "System",
    },
    campaignTypeFilter: {
      all: "Alle Kampagnentypen",
    },
    selectionRuleSortField: {
      name: "Name",
      priority: "Priorität",
      campaignType: "Kampagnentyp",
      journeyVariant: "Journey-Variante",
      campaignStage: "Kampagnenstufe",
      country: "Land",
      language: "Sprache",
      createdAt: "Erstellt am",
      updatedAt: "Aktualisiert am",
      emailsSent: "Gesendete E-Mails",
      successRate: "Erfolgsrate",
      lastUsedAt: "Zuletzt verwendet",
    },
    selectionRuleStatusFilter: {
      all: "Alle",
      active: "Aktiv",
      inactive: "Inaktiv",
      default: "Standard",
      failover: "Failover",
    },
    loadBalancingStrategy: {
      roundRobin: "Round-Robin",
      weighted: "Gewichtet",
      priority: "Priorität",
      leastUsed: "Am wenigsten verwendet",
    },
    testResult: {
      success: "Erfolg",
      authFailed: "Authentifizierung fehlgeschlagen",
      connectionFailed: "Verbindung fehlgeschlagen",
      timeout: "Zeitüberschreitung",
      unknownError: "Unbekannter Fehler",
    },
  },
};
