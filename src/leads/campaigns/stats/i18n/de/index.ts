import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/de";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  title: "Kampagnen-Leistung",
  description:
    "Geht Kampagnen-Mail raus, was hängt in der Queue und wie schlägt sich jede Journey",
  enums: {
    emailJourneyVariantFilter: {
      all: "Alle",
      uncensoredConvert: "Unzensierter Konverter",
      sideHustle: "Nebenverdienst",
      quietRecommendation: "Stille Empfehlung",
      signupNurture: "Anmeldungs-Nurturing",
      retention: "Kundenbindung",
      winback: "Rückgewinnung",
      newsletterMay2026: "Newsletter Mai 2026",
      newsletterNov2026: "Newsletter November 2026",
    },
    emailJourneyVariant: {
      uncensoredConvert: "Unzensierter Konverter",
      sideHustle: "Nebenverdienst",
      quietRecommendation: "Stille Empfehlung",
      signupNurture: "Anmeldungs-Nurturing",
      retention: "Kundenbindung",
      winback: "Rückgewinnung",
      newsletterMay2026: "Newsletter Mai 2026",
      newsletterNov2026: "Newsletter November 2026",
    },
    emailCampaignStageFilter: {
      all: "Alle",
    },
    emailCampaignStage: {
      notStarted: "Nicht gestartet",
      initial: "Erster Kontakt",
      followup1: "Nachfassung 1",
      followup2: "Nachfassung 2",
      followup3: "Nachfassung 3",
      nurture: "Pflege",
      reactivation: "Reaktivierung",
    },
  },
  get: {
    title: "Kampagnen-Leistung",
    titleShort: "Kampagnen",
    description:
      "Engine-Status, Queue-Zustand und E-Mail-Leistung im Verlauf: gesendet, geöffnet, geklickt, abgemeldet, gebounct und fehlgeschlagen pro Journey-Variante, Stufe und Sprache. Jede Zahl öffnet die passenden Leads.",
    fields: {
      journeyVariant: {
        label: "Journey-Variante",
        description: "Nur diese E-Mail-Journey",
        placeholder: "Jede Journey",
      },
      stage: {
        label: "Stufe",
        description: "Nur E-Mails dieser Kampagnenstufe",
        placeholder: "Jede Stufe",
      },
      locale: {
        label: "Sprache",
        description: "Gerenderte Locale (de-DE) oder Sprache (de)",
        placeholder: "Jede Sprache",
      },
    },
    response: {
      variantTrend: "Gesendet nach Journey",
      window: "Zeitraum",
      engine: "Engine-Status",
      queue: "Queue-Zustand",
      kpis: "Kennzahlen",
      totals: "Summen",
      trend: "Gesendet, geöffnet, geklickt",
      problems: "Fehler, Bounces, Abmeldungen",
      funnel: "E-Mail-Funnel",
      byVariant: "Nach Journey-Variante",
      byStage: "Nach Stufe",
      byLocale: "Nach Sprache",
      topErrors: "Häufigste Sendefehler",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein",
      },
      forbidden: {
        title: "Verboten",
        description: "Keine Berechtigung",
      },
      server: {
        title: "Serverfehler",
        description: "Fehler beim Abrufen der Statistiken",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Eingabeparameter",
      },
    },
    success: {
      title: "Statistiken abgerufen",
      description: "Kampagnenstatistiken erfolgreich abgerufen",
    },
  },
  widget: {
    groups: {
      now: "Jetzt",
      period: "Im gewählten Zeitraum",
    },
    stuck: "Nie gesendet",
    title: "Kampagnen-Leistung",
    loading: "Kampagnenzahlen werden geladen...",
    filters: "Filter",
    openQueue: "Queue öffnen",
    empty: "Keine Sendungen in diesem Zeitraum.",
    emptySendingOff:
      "Keine Sendungen in diesem Zeitraum. Der Versand ist aus, siehe oben.",
    noProblems: "Keine Fehler, Bounces oder Abmeldungen in diesem Zeitraum.",
    noErrors: "Keine Sendefehler in diesem Zeitraum.",
    sentNoteOff:
      "Null Sendungen heißt hier: die Engine ist aus. Nicht: niemand reagiert.",
    errors: {
      duplicate: "Übersprungen: doppelter Empfänger",
      statusChange: "Übersprungen: Lead ist jetzt {{status}}",
    },
    engine: {
      starterOff:
        "Auch campaign-starter ist aus: keine neuen Leads starten eine Journey.",
      otherPath:
        "Diese kamen über einen anderen Weg (Blast oder manueller Lauf), nicht vom Dispatcher.",
      openDispatcher: "Dispatcher-Einstellungen öffnen",
      neverSent: "Noch nie wurde eine Kampagnen-E-Mail gesendet.",
      lastSend: "Letzter Versand {{when}}. Gesendet in 24 h: {{count}}.",
      offTitle: "Versand ist aus",
      failingTitle: "Dispatcher schlägt fehl ({{count}} Läufe in Folge)",
      onTitle: "Versand läuft",
      missing:
        "Der email-campaigns-Dispatcher hat keinen Cron-Zeitplan. {{count}} fällige E-Mails liegen in der Queue und gehen nie raus, bis er eingeplant ist.",
      disabled:
        "Der email-campaigns-Dispatcher ist deaktiviert. {{count}} fällige E-Mails warten in der Queue.",
      on: "Letzter Lauf {{last}}, nächster Lauf {{next}}.",
      noError: "Keine Fehlermeldung gespeichert.",
      openDue: "{{count}} Leads zeigen",
      state: {
        missing: "nicht eingeplant",
        disabled: "deaktiviert",
        failing: "fehlerhaft",
        running: "läuft",
      },
    },
    queue: {
      oldestBiggest:
        "{{emails}} Leads. Größter Rückstau: {{journey}} ({{count}} E-Mails)",
      stuckClaims: "Hängende Versand-Claims",
      stuckClaimsHint: "Vor über 1 h beansprucht, nie bestätigt",
      stuckDaysHint: "Fällig seit {{when}}",
      stuckDays: "Älteste fällig, Tage",
      nothingScheduled: "Nichts geplant",
      dueNow: "Fällige E-Mails",
      oldest: "{{emails}} Leads warten",
      nothingDue: "Nichts wartet",
      scheduled: "Für später geplant",
      scheduledHint: "{{count}} in den nächsten 24 h, nächste {{when}}",
    },
    kpi: {
      bouncedOff:
        "bounce-processor ist aus, Bounces fehlen evtl. {{rate}} der gesendeten",
      ofSentRate: "{{rate}} der gesendeten",
      skippedHint: "Duplikat- und Status-Skips nicht gezählt: {{count}}",
      sent: "Gesendet",
      openRate: "Öffnungsrate",
      clickRate: "Klickrate",
      ofSent: "{{count}} der gesendeten E-Mails",
      unsubscribed: "Abgemeldet",
      bounced: "Gebounct",
      failed: "Sendefehler im Zeitraum",
    },
    series: {
      sent: "Gesendet",
      opened: "Geöffnet",
      clicked: "Geklickt",
      failed: "Sendefehler",
      bounced: "Gebounct",
      unsubscribed: "Abgemeldet",
    },
    charts: {
      errorsHint:
        "Nur echte Fehler. Duplikat- und Status-Skips ausgeblendet: {{count}}",
      variantTrendHint:
        "Gesendete E-Mails pro Intervall, nach Journey-Variante",
      variantTrend: "Gesendet nach Journey",
      trend: "Gesendet, geöffnet, geklickt",
      trendHint:
        "Nach Versandtag: gesendete E-Mails und wie viele davon später geöffnet oder geklickt wurden. Tag anklicken für diese Leads.",
      problems: "Probleme",
      problemsHint:
        "Fehlgeschlagene Sendungen, Bounces und Abmeldungen pro Intervall",
      funnel: "E-Mail-Funnel",
      funnelHint: "Im Zeitraum gesendete E-Mails und was Empfänger damit taten",
      byVariant: "Nach Journey-Variante",
      byVariantHint:
        "Im Zeitraum gesendet. Fällig = wartet jetzt in der Queue.",
      byStage: "Nach Stufe",
      byLocale: "Nach Sprache",
      errors: "Sendefehler",
    },
    columns: {
      failed: "Sendefehler",
      sent: "Gesendet",
      openRate: "Öffn.",
      clickRate: "Klick",
      unsubscribed: "Abm.",
      bounced: "Bounce",
      due: "Fällige E-Mails",
      variant: "Journey",
      stage: "Stufe",
      locale: "Sprache",
      error: "Fehler",
      count: "Anzahl",
    },
    definitions:
      "Öffnungs- und Klickrate zählen im Zeitraum gesendete E-Mails, die irgendwann geöffnet oder geklickt wurden. Fällig = ausstehend und in der Vergangenheit geplant: nur der email-campaigns-Dispatcher verschickt sie. Sprache = gerenderte Locale, sonst Sprache und Land des Leads.",
  },
};
