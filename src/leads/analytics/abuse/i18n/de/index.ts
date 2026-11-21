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
    title: "Missbrauchssignale",
    titleShort: "Missbrauch",
    description:
      "Lead- und Registrierungswellen aus einem Netz oder von einem User Agent, dazu Gratis-Credits, die Besucher ohne Konto verbrennen. Jede Zeile öffnet die passenden Leads.",
    fields: {
      minLeads: {
        label: "Wellen-Schwelle",
        description:
          "Leads eines Clusters im Zeitraum, ab denen er als Welle gilt",
      },
    },
    response: {
      window: "Zeitraum",
      groupByUsed: "Gruppiert nach",
      minLeadsUsed: "Wellen-Schwelle",
      kpis: "Kennzahlen",
      trend: "Leads aus markierten Clustern",
      clusters: "Cluster",
      burners: "Größte Gratis-Credit-Verbraucher",
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
        description: "Der Missbrauchsbericht konnte nicht berechnet werden.",
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
      description: "Missbrauchsbericht geladen.",
    },
  },
  widget: {
    fast: "Schnell",
    noIp: "Keine IP",
    perHour: "Leads/Stunde",
    thresholdOption: "ab {{count}} Leads",
    loading: "Missbrauchssignale werden geladen...",
    flaggedPrefixes: "Markierte Netze",
    flaggedAgents: "Markierte Agents",
    thresholdHint: "{{count}}+ Leads im Zeitraum",
    flaggedLeads: "Leads aus Wellen",
    flaggedShare: "{{percent}} % der neuen Leads",
    freeCredits: "Verbrannte Gratis-Credits",
    freeCreditsHint: "Von Besuchern ohne Konto",
    burners: "Verbrauchende Besucher",
    burnersHint: "Nicht-Nutzer, die Gratis-Credits ausgeben",
    trendTitle: "Leads aus Bursts",
    trendSubtitle: "Welle = Cluster mit {{count}}+ Leads im Zeitraum.",
    seriesFlagged: "Aus Wellen",
    seriesOther: "Übrige Leads",
    clustersIpTitle: "Wellen nach Netz",
    clustersUaTitle: "Wellen nach User Agent",
    clustersSubtitle:
      "Sortiert nach Leads pro Stunde. Schnell = ab {{rate}} Leads/Stunde. Klick auf eine Zeile zeigt die Leads.",
    prefix: "Netz",
    userAgent: "User Agent",
    prefixes: "Verschiedene Netze",
    agents: "Verschiedene Agents",
    noClusters: "Kein Cluster erreichte {{count}} Leads in diesem Zeitraum.",
    burnersTitle: "Größte Gratis-Credit-Verbraucher",
    burnersSubtitle: "Besucher ohne Konto. Anklicken öffnet den Lead.",
    lead: "Lead",
    requests: "Anfragen",
    noBurners: "Keine Gratis-Credits von Nicht-Nutzern in diesem Zeitraum.",
    filtersTitle: "Segment",
    filtersSubtitle: "Grenzt jede Zahl auf dieser Seite ein.",
    apply: "Anwenden",
  },
};
