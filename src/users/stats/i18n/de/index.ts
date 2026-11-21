import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/de";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  title: "Registrierungen",
  titleShort: "Registrierungen",
  description:
    "Wer sich registriert hat, über welchen Kanal oder Ref-Code, wie viele bestätigt haben, aktiv blieben und zahlten, und wer Gratis-Credits verbrennt. Jede Zahl gegen den Vorzeitraum, jede Kachel und Zeile öffnet die passenden Konten.",
  category: "Nutzer",
  tag: "Statistik",
  response: {
    window: "Zeitraum",
    kpis: "Kennzahlen",
    totals: "Summen",
    signupTrend: "Registrierungen im Verlauf",
    activityTrend: "Aktivität im Verlauf",
    funnel: "Registrierungs-Funnel",
    byChannel: "Nach Kanal",
    byRefCode: "Nach Ref-Code",
    byPlan: "Abonnenten nach Tarif",
    byLocale: "Nach Sprache",
    freeBurners: "Top Gratis-Verbrenner",
  },
  widget: {
    planLapsed: "Abo abgelaufen",
    planPacks: "Nur Credit-Pakete",
    groups: {
      abuse: "Missbrauch",
      signups: "Registrierungen im Zeitraum",
      accounts: "Alle passenden Konten, dieser Zeitraum",
    },
    cliHint:
      "Konten hinter diesen Registrierungen: vibe users-list --audience=enums.audience.humans --signupFrom={{from}} --signupTo={{to}}",
    loading: "Zahlen werden berechnet...",
    filters: "Filter",
    openUsers: "Konten öffnen",
    empty: "Keine Registrierungen in diesem Zeitraum.",
    noJourney: "(nicht erfasst)",
    noRefCodes: "Keine Registrierungen mit Ref-Code in diesem Zeitraum.",
    noSubscribers: "Keine aktiven Abonnenten in dieser Gruppe.",
    noBurners: "Niemand hat in diesem Zeitraum Gratis-Credits verbrannt.",
    signedUpOn: "dabei seit {{date}}",
    banned: "Gesperrt",
    unverified: "Unbestätigt",
    kpi: {
      revenuePerPayerHint: "Umsatz im Zeitraum / zahlende Konten",
      revenuePerPayer: "Umsatz pro Zahler",
      revenuePeriod: "Umsatz im Zeitraum",
      activatedRate: "Credits genutzt",
      signups: "Registrierungen",
      signupsHint:
        "Im Zeitraum registriert. {{total}} passende Konten insgesamt",
      verifiedRate: "Bestätigt",
      paidConversion: "Zahl-Conversion",
      ofSignups: "{{count}} von {{total}} Registrierungen",
      activeUsers: "Aktive Konten",
      activeHint: "Alle passenden Konten mit Credit-Verbrauch im Zeitraum",
      payingUsers: "Zahlende Konten",
      payingHint: "Alle passenden Konten mit Zahlung im Zeitraum",
      revenue: "Umsatz",
      revenueHint:
        "Alle passenden Konten, erfolgreiche Zahlungen im Zeitraum, USD",
      freeBurn: "Gratis-Credit-Verbrauch",
      freeBurnHint: "Credits von Konten ohne Zahlung. Konten: {{count}}",
      banned: "Gesperrte Registrierungen",
      bannedHint: "Im Zeitraum registriert, jetzt gesperrt",
    },
    series: {
      paid: "Bezahlt",
      verified: "Bestätigt, nicht bezahlt",
      unverified: "Unbestätigt, nicht bezahlt",
      active: "Aktive Konten",
      paying: "Zahlende Konten",
    },
    funnel: {
      paid: "Bezahlt",
      active: "Credits genutzt",
      verified: "E-Mail bestätigt",
      signups: "Registriert",
    },
    charts: {
      signups: "Registrierungen",
      signupsHint:
        "Neue Konten pro Intervall, aufgeteilt nach dem, was sie seitdem getan haben. Balken anklicken für die Konten.",
      activity: "Aktivität",
      activityHint:
        "Alle passenden Konten pro Intervall. Legende zeigt eindeutige Konten im Zeitraum",
      funnel: "Meilensteine der Registrierungen",
      funnelHint:
        "Registrierungen im Zeitraum, die jeden Meilenstein erreicht haben. Zahlen entsprechen den Kacheln oben.",
      byChannel: "Registrierungen nach Erstkontakt-Kanal",
      byChannelHint:
        "Erstkontakt dieser Registrierungen. Umsatz = ihre Zahlungen im Zeitraum",
      byRefCode: "Registrierungen nach Ref-Code",
      byRefCodeHint:
        "Einem Code gutgeschriebene Registrierungen, sonst Code des ersten Besuchs. Kann die ref:-Kanalzeilen übersteigen",
      byPlan: "Zahlende Konten nach Tarif",
      byPlanHint:
        "Konten mit Zahlung im Zeitraum und ihr Umsatz; ergibt die Kacheln Zahlende und Umsatz",
      byLocale: "Registrierungen nach Sprache",
      freeBurners: "Top Gratis-Verbrenner",
      freeBurnersHint: "Nie bezahlt, meiste Credits im Zeitraum",
    },
    columns: {
      ofSignups: "% der Registr.",
      accounts: "Konten",
      milestone: "Meilenstein",
      active: "Credits genutzt",
      creditsGranted: "Gutgeschrieben",
      creditsSpentTotal: "Gesamt",
      creditBalance: "Guthaben",
      signups: "Registr.",
      verified: "Bestätigt",
      paid: "Bezahlt",
      conversion: "Conv.",
      revenue: "Umsatz im Zeitraum",
      channel: "Kanal",
      refCode: "Ref-Code",
      plan: "Tarif",
      subscribers: "Konten",
      revenueWindow: "Umsatz",
      locale: "Sprache",
      account: "Konto",
      creditsSpent: "Im Zeitraum",
    },
    definitions:
      "Standardmäßig nur Menschen: Admins und Testdomains sind ausgeschlossen. Aktiv = Credits auf dem eigenen oder einem verknüpften Gast-Wallet genutzt. Umsatz in USD zu festen Wechselkursen. Conversion zählt Zahlungen zu jedem Zeitpunkt nach der Registrierung.",
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
