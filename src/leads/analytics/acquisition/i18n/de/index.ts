import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/de";

import { translations as leadAnalyticsTranslations } from "@/leads/analytics/i18n/de";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  ...leadAnalyticsTranslations,
  tags: {
    leads: "Leads",
    analytics: "Analytics",
  },
  get: {
    title: "Akquise",
    titleShort: "Akquise",
    description:
      "Woher Besucher und Leads kommen: Kanal, Quelle, Referrer, Kampagne, Landingpage, Land, Gerät, Menschen oder Bots. Jede Zahl öffnet die passenden Leads.",
    response: {
      window: "Zeitraum",
      kpis: "Kennzahlen",
      trend: "Verlauf",
      breakdown: "Aufschlüsselung",
      agents: "Agents",
      coverage: "Tracking-Abdeckung",
    },
    errors: {
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Als Admin anmelden.",
      },
      validation: {
        title: "Ungültige Filter",
        description: "Zeitraum und Filterwerte prüfen.",
      },
      server: {
        title: "Bericht fehlgeschlagen",
        description: "Der Akquise-Bericht konnte nicht berechnet werden.",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Etwas ist schiefgelaufen.",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Server nicht erreichbar.",
      },
      forbidden: { title: "Kein Zugriff", description: "Nur für Admins." },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Berichtsdaten.",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Filteränderungen anwenden oder verwerfen.",
      },
      conflict: {
        title: "Konflikt",
        description: "Daten haben sich geändert. Neu laden.",
      },
    },
    success: {
      title: "Bericht bereit",
      description: "Akquise-Bericht geladen.",
    },
  },
  widget: {
    revenue: "Umsatz",
    humanVisits: "Menschliche Besuche",
    botVisits: "Bot-Besuche",
    botVisitsHint: "{{count}} Bot-Besuche",
    botsTitle: "Bot-Leads",
    botsSubtitle:
      "Crawler, Link-Vorschauen und Skripte. Klick auf einen Balken zeigt die Leads.",
    loading: "Akquise-Bericht wird geladen...",
    coverage:
      "Besuche werden seit {{date}} erfasst. Ältere Leads zählen, nur ohne Besuche.",
    botShareHint: "{{percent}} der neuen Leads",
    leadsTitle: "Menschliche Leads",
    leadsSubtitle:
      "Neue menschliche Leads. Klick auf einen Balken zeigt die Leads.",
    visitsTitle: "Erfasste Besuche",
    visitsSubtitle: "Erfasste Besuche. Menschen vs als Bot erkannte Leads.",
    conversionsTitle: "Registrierungen und Zahler",
    conversionsSubtitle: "Nach dem Tag, an dem der Schritt passierte.",
    breakdownTitle: "Woher die Leads kommen",
    breakdownSubtitle: "Erster Kontakt. Zeile anklicken für die Leads.",
    agentsTitle: "Wer auftaucht",
    agentsSubtitle: "Agent-Familie laut User Agent.",
    filtersTitle: "Segment",
    filtersSubtitle: "Grenzt jede Zahl auf dieser Seite ein.",
    apply: "Anwenden",
    empty: "Keine Leads in diesem Zeitraum.",
    emptyHint: "Längeren Zeitraum wählen oder Filter zurücksetzen.",
  },
};
