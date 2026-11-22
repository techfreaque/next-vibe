import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/de";

import { translations as leadAnalyticsTranslations } from "@/leads/analytics/i18n/de";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  ...leadAnalyticsTranslations,
  category: "Analytik",
  tags: {
    analytics: "Analytik",
    overview: "Übersicht",
  },
  get: {
    title: "Geschäftsübersicht",
    titleShort: "Übersicht",
    description:
      "Traffic, Leads, Registrierungen, Zahlende, Umsatz, KI-Kosten und Warnungen eines Zeitraums im Vergleich zur Vorperiode. Jede Zahl öffnet den Bericht dahinter.",
    response: {
      window: "Zeitraum",
      generatedAt: "Stand",
      acquisition: "Akquise",
      referral: "Empfehlungen",
      money: "Finanzen",
      ops: "Betrieb",
    },
    widget: {
      kpi: {
        visits: "Echte Besuche",
        humanLeads: "Neue Leads",
        botLeadsHint: "{{count}} Bot-Leads ausgeschlossen",
        botVisitsHint: "{{count}} Bot-Besuche ausgeschlossen",
        excludedLeadsHint:
          "{{bots}} Bot- und {{unknown}} unbekannte Leads ausgeschlossen",
        excludedVisitsHint:
          "{{bots}} Bot- und {{unknown}} unbekannte Besuche ausgeschlossen",
        creditSpendHintNoPrevCost:
          "Anbieterkosten {{cost}} (im Vorzeitraum nicht erfasst). {{guests}} durch Gäste.",
        creditSpendHintNoCompare:
          "Anbieterkosten {{cost}}. {{guests}} durch Gäste.",
        payersHint: "Verschiedene Zahlende im Zeitraum",
        signups: "Registrierungen",
        signupRateHint: "{{rate}} der neuen Leads",
        payers: "Kunden mit Zahlung",
        revenue: "Umsatz",
        revenueHint: "Eingenommenes Geld, ca. USD",
        revenueNetHint:
          "Eingenommenes Geld, ca. USD. {{net}} nach KI-Anbieterkosten.",
        creditSpend: "KI-Nutzung (verbrauchte Credits)",
        guestSpendHint: "{{amount}} durch Gäste",
        creditSpendHint:
          "Anbieterkosten {{cost}} (ggü. {{previous}}). {{guests}} durch Gäste.",
        margin: "Marge KI-Nutzung",
        marginPartial: "KI-Marge (unvollständig)",
        marginHint:
          "Anbieterkosten {{cost}}. Abgerechnet minus Kosten, wo Kosten bekannt sind.",
        marginBaseHint:
          "{{rate}} von {{base}} abgerechneter Nutzung mit Kostendaten. Anbieterkosten {{cost}}.",
        marginRateHint:
          "{{margin}} auf {{base}} mit Kostendaten ({{coverage}} der Nutzung).",
        errors: "Offene Fehler",
        errorsHint: "{{count}} Vorkommen im Zeitraum",
        botShare: "Bot-Anteil der Leads",
        botShareHint:
          "{{count}} Bot-Leads, Hauptquelle unter Braucht Aufmerksamkeit",
        botShareTopHint: "{{count}} Bot-Leads. Größte Spitze {{prefix}}.",
      },
      trafficChart: "Echte Leads und Registrierungen",
      trafficChartHint: "Ohne Bots",
      moneyChart: "Umsatz",
      moneyChartHint: "Eingenommenes Geld pro Intervall",
      series: {
        visits: "Besuche",
        leads: "Neue Leads",
        signups: "Registrierungen",
        revenueUsd: "Umsatz",
        spendUsd: "Abgerechnete KI-Nutzung",
        upstreamCostUsd: "Anbieterkosten",
      },
      sources: "Woher die Leads kommen (Erstkontakt)",
      sourcesDimension: "Kanal",
      sourcesHint:
        "Aktivität im Zeitraum nach dem Erstkontakt-Kanal jeder Person",
      referralsHint:
        "Klicks, Registrierungen und Zahlungen, die dem Code in diesem Zeitraum gutgeschrieben wurden",
      leadShare: "Lead-Anteil",
      revenueShare: "Umsatzanteil",
      footerSources:
        "Umsatz in diesen Zeilen: {{rows}} von {{total}} im Zeitraum",
      footerReferrals:
        "Codes gutgeschrieben (Provisionsbasis): {{rows}} von {{total}} im Zeitraum",
      referrals: "Stärkste Empfehlungscodes",
      referralsDimension: "Code",
      columns: {
        leads: "Leads",
        signups: "Registrierungen",
        payers: "Zahlende",
        clicks: "Klicks",
        revenueUsd: "Umsatz",
        conversion: "Lead zu Registrierung",
        clickToSignup: "Klick zu Registrierung",
      },
      alerts: {
        severity: { high: "Hoch", medium: "Mittel", low: "Niedrig" },
        title: "Braucht Aufmerksamkeit",
        none: "In diesem Zeitraum ist nichts auffällig.",
        abuse:
          "{{count}} IP-Bereiche mit Lead-Spitzen, vorne {{prefix}} ({{leads}} Leads)",
        payouts: "{{count}} Auszahlungsanträge offen ({{amount}})",
        tasks: "{{count}} geplante Aufgaben schlagen fehl",
        connections: "{{count}} Remote-Verbindungen gestört",
        costCoverage:
          "Anbieterkosten nur für {{coverage}} der KI-Nutzung bekannt, Marge ist unvollständig",
        unattributed:
          "{{share}} des Umsatzes ohne bekannte Quelle ({{amount}})",
        errors:
          "{{count}} offene Fehler, {{occurrences}} Vorkommen im Zeitraum",
        errorsSince:
          "{{count}} offene Fehler, {{occurrences}} Vorkommen seit {{date}} (Tageszählung ab dann)",
      },
      open: {
        acquisition: "Akquise-Bericht",
        funnel: "Funnel",
        referrals: "Empfehlungsübersicht",
        revenue: "Umsatzbericht",
        usage: "KI-Nutzungsbericht",
        errors: "Fehlerprotokoll",
      },
      unavailable: "Dieser Bereich konnte nicht geladen werden.",
      asOf: "Stand {{time}}. Eine Minute zwischengespeichert.",
      loading: "Übersicht wird geladen",
    },
    errors: {
      unauthorized: {
        title: "Nicht angemeldet",
        description:
          "Melde dich als Admin an, um die Geschäftsübersicht zu sehen.",
      },
      validation: {
        title: "Ungültiger Zeitraum",
        description: "Prüfe Zeitraum und Datumsangaben.",
      },
      server: {
        title: "Übersicht fehlgeschlagen",
        description:
          "Die Übersicht konnte nicht berechnet werden. Versuche es erneut.",
      },
      unknown: {
        title: "Unerwarteter Fehler",
        description: "Beim Laden der Übersicht ist etwas schiefgelaufen.",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Der Server ist nicht erreichbar.",
      },
      forbidden: {
        title: "Nur für Admins",
        description: "Nur Admins sehen die Geschäftsübersicht.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die Übersicht ist nicht verfügbar.",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Speichere oder verwirf zuerst deine Änderungen.",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Die Daten haben sich beim Laden geändert. Versuche es erneut.",
      },
    },
    success: {
      title: "Übersicht geladen",
      description: "Geschäftsübersicht für den gewählten Zeitraum.",
    },
  },
};
