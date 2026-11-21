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
    title: "Funnel",
    titleShort: "Funnel",
    description:
      "Im Zeitraum erstellte Leads und wie weit sie kamen: Mensch, erster Chat, Registrierung, E-Mail bestätigt, bezahlt. Pro Kanal, Quelle oder Ref-Code. Jeder Schritt öffnet seine Leads.",
    response: {
      window: "Zeitraum",
      dimensionUsed: "Segment-Dimension",
      steps: "Funnel-Schritte",
      previousSteps: "Schritte im Vorzeitraum",
      rates: "Konversionsraten",
      segments: "Funnel pro Segment",
      trend: "Kohortenverlauf",
      signupSteps: "Registrierungsschritte im Zeitraum",
      previousSignupSteps: "Registrierungsschritte im Vorzeitraum",
      signupSegments: "Registrierungsschritte pro Segment",
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
        description: "Der Funnel-Bericht konnte nicht berechnet werden.",
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
      description: "Funnel-Bericht geladen.",
    },
  },
  widget: {
    signupTitle: "Registrierungsbestätigung",
    signupSubtitle:
      "Leads pro Schritt, datiert auf den Schritt. Der Abfall zeigt, wo Registrierungen scheitern.",
    started: "Begonnen",
    emailSent: "Mail gesendet",
    sendFailed: "Versand fehlgeschlagen",
    bounced: "Unzustellbar",
    expired: "Abgelaufen",
    confirmed: "Bestätigt",
    confirmRate: "Bestätigungsrate",
    ofStarted: "{{count}} von {{total}} begonnen",
    signupSegmentsTitle: "Registrierungsschritte pro Segment",
    signupSegmentsSubtitle: "Dieselben Schritte nach gewählter Dimension.",
    signupEmpty: "Keine Registrierungen in diesem Zeitraum.",
    signupLost: "Verloren bei der Mail",
    signupLostHint:
      "Unzustellbar, fehlgeschlagen oder abgelaufen vor der Bestätigung",
    loading: "Funnel wird geladen...",
    cohortHint: "von {{count}} erstellten Leads",
    signupRate: "Registrierungsrate",
    payRate: "Zahlungsrate",
    overallRate: "Mensch zu Zahlendem",
    overallShort: "Zu Zahlendem",
    ofHumans: "{{count}} von {{total}} menschlichen Leads",
    ofSignups: "{{count}} von {{total}} Registrierungen",
    funnelTitle: "Kohorten-Funnel",
    funnelSubtitle:
      "Funnel ab menschlichen Leads. Bots und alle Leads: siehe erste Karte.",
    trendTitle: "Kohorte nach Erstellungstag",
    trendSubtitle: "Menschliche Leads und wie viele davon konvertierten.",
    segmentsTitle: "Funnel pro Segment",
    segmentsSubtitle:
      "Raten pro menschlichem Lead. Zeile anklicken für die Leads.",
    filtersTitle: "Segment",
    filtersSubtitle: "Grenzt jede Zahl auf dieser Seite ein.",
    apply: "Anwenden",
    empty: "Keine Leads in diesem Zeitraum.",
  },
};
