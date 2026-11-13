import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Geschäftszahlen",
  titleShort: "Nutzerstatistik",
  description:
    "Anmeldungen, aktive und zahlende Nutzer, MRR, Umsatz, Credit-Verbrauch, Conversion von Anmeldung zu Zahlung und D7-Retention. Jede Zahl gegen den Vorzeitraum, dazu Trend, Kanäle und Top-Nutzer.",
  category: "Nutzer",
  tag: "Statistik",
  fields: {
    range: {
      label: "Zeitraum",
      description:
        "Berichtszeitraum, verglichen mit dem gleich langen Zeitraum davor",
    },
    from: {
      label: "Von",
      description: "Erster Tag (UTC). Überschreibt den Zeitraumbeginn",
    },
    to: {
      label: "Bis",
      description: "Letzter Tag (UTC). Überschreibt das Zeitraumende",
    },
    granularity: {
      label: "Diagramm-Raster",
      description: "Tag, Woche oder Monat. Auto wählt nach Zeitraumlänge",
    },
    includeInternal: {
      label: "Admins einbeziehen",
      description: "Interne Admin-Konten und ihre Zahlungen mitzählen",
    },
  },
  response: {
    period: "Zeitraum",
    kpis: "Kennzahlen",
    series: "Zeitreihe",
    channels: "Anmeldekanäle",
    revenueByCurrency: "Umsatz nach Währung",
    subscriptionsByStatus: "Abos nach Status",
    topSpenders: "Top-Nutzer",
    generatedAt: "Erstellt am",
  },
  enums: {
    range: {
      last7Days: "Letzte 7 Tage",
      last30Days: "Letzte 30 Tage",
      last90Days: "Letzte 90 Tage",
      last12Months: "Letzte 12 Monate",
      thisMonth: "Dieser Monat",
      lastMonth: "Letzter Monat",
      allTime: "Gesamter Zeitraum",
      custom: "Eigene Daten",
    },
    granularity: {
      auto: "Auto",
      day: "Tag",
      week: "Woche",
      month: "Monat",
    },
  },
  kpi: {
    revenue: "Umsatz",
    revenueHint: "Erfolgreiche Zahlungen, USD",
    refundsHint: "{{amount}} erstattet",
    mrr: "MRR",
    mrrHint: "{{active}} aktive Abos, {{pastDue}} überfällig",
    payingUsers: "Zahlende Nutzer",
    payingAllTimeHint: "{{count}} haben je bezahlt",
    creditsSpent: "Verbrauchte Credits",
    creditsHint: "etwa {{usd}} Nutzung",
    newUsers: "Anmeldungen",
    totalUsersHint: "{{count}} Nutzer gesamt",
    activeUsers: "Aktive Nutzer",
    anonymousHint: "+{{count}} anonyme Besucher mit Verbrauch",
    signupToPaid: "Anmeldung zu Zahlung",
    ratioHint: "{{converted}} von {{cohort}} Neuanmeldungen haben bezahlt",
    retentionD7: "D7-Retention",
    retentionHint: "{{converted}} von {{cohort}} kamen nach Tag 7 zurück",
    activeSubscribers: "Aktive Abonnenten",
    pastDue: "Überfällig",
    totalUsers: "Nutzer gesamt",
    payingAllTime: "Je bezahlt",
    revenueAllTime: "Umsatz gesamt",
    refunds: "Erstattungen",
    anonymousActive: "Anonyme Nutzer mit Verbrauch",
  },
  series: {
    signups: "Anmeldungen",
    activeUsers: "Aktiv",
    payingUsers: "Zahlend",
    revenueUsd: "Umsatz",
    creditsSpent: "Credits",
  },
  sections: {
    trend: "Verlauf",
    channels: "Anmeldekanäle",
    subscriptions: "Abos aktuell",
    currencies: "Umsatz nach Währung",
    topSpenders: "Top-Verbraucher im Zeitraum",
  },
  table: {
    channel: "Kanal",
    signups: "Anmeldungen",
    paying: "Bezahlt",
    conversion: "Conv.",
    user: "Nutzer",
    creditsSpent: "Verbrauchte Credits",
    lifetimePaid: "Gesamtumsatz",
  },
  widget: {
    times: "{{count}}x",
    loading: "Zahlen werden berechnet...",
    users: "Nutzer",
    refresh: "Aktualisieren",
    new: "neu",
    noData: "Keine Daten in diesem Zeitraum.",
    chartTotal: "Summe {{total}}",
    period:
      "{{from}} bis {{to}} ({{days}} Tage, UTC). Veränderungen gegenüber den {{days}} Tagen davor.",
    definitions:
      "Aktiv = Credits verbraucht (eigene oder verknüpfte Lead-Wallet). Zahlend = erfolgreiche Zahlung im Zeitraum. Umsatz in USD zu festen Kursen. MRR = laufende Abos, bewertet mit ihrer letzten Zahlung. Admin-Konten ausgeschlossen, außer oben eingeschlossen.",
    text: {
      header: "{{from}} bis {{to}} ({{days}} Tage, UTC)",
      metric: "Kennzahl",
      current: "Jetzt",
      previous: "Davor",
      change: "Veränd.",
      bucket: "Periode",
      paying: "{{count}} bezahlt",
      footer:
        "Zeiträume: --range=enums.range.last7Days|last90Days|last12Months|allTime. Nutzer: vibe users-list",
    },
  },
  errors: {
    validation: {
      title: "Ungültige Anfrage",
      description: "Prüfe Zeitraum und Daten",
    },
    unauthorized: {
      title: "Anmeldung nötig",
      description: "Melde dich an, um Statistiken zu sehen",
    },
    forbidden: {
      title: "Nur für Admins",
      description: "Dafür brauchst du die Admin-Rolle",
    },
    notFound: {
      title: "Keine Daten",
      description: "Für diesen Zeitraum gibt es nichts",
    },
    server: {
      title: "Statistik fehlgeschlagen",
      description: "Der Server konnte die Nutzerstatistik nicht berechnen",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Server nicht erreichbar",
    },
    unknown: {
      title: "Unerwarteter Fehler",
      description: "Bei der Berechnung ist etwas schiefgelaufen",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Du hast ungespeicherte Änderungen",
    },
    conflict: {
      title: "Konflikt",
      description: "Die Anfrage widerspricht den aktuellen Daten",
    },
  },
  success: {
    title: "Statistik bereit",
    description: "Nutzerstatistik berechnet",
  },
};
