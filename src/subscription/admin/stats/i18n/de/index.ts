import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  get: {
    title: "Abo-Statistiken",
    titleShort: "Admin-Statistiken",
    description: "Umsatz-, Abo-, Credit- und Empfehlungskennzahlen",
    form: {
      title: "Statistik-Dashboard",
      description: "Geschäftskennzahlen",
    },
    timePeriodOptions: {
      title: "Zeitraum",
      description: "Zeitraum konfigurieren",
    },
    timePeriod: { label: "Zeitraum", description: "Gruppierungsintervall" },
    dateRangePreset: {
      label: "Datumsbereich",
      description: "Vordefinierter Zeitraum",
    },
    response: {
      revenueStats: {
        title: "Umsatz",
        description: "Umsatzkennzahlen",
        mrr: { label: "MRR" },
        arr: { label: "ARR" },
        totalRevenue: { label: "Gesamtumsatz" },
        avgOrderValue: { label: "Ø Bestellwert" },
      },
      subscriptionStats: {
        title: "Abonnements",
        description: "Abo-Zahlen",
        activeCount: { label: "Aktiv" },
        trialingCount: { label: "Testphase" },
        canceledCount: { label: "Gekündigt" },
        churnRate: { label: "Abwanderungsrate" },
      },
      intervalStats: {
        title: "Abrechnungsintervalle",
        description: "Monatlich vs. jährlich",
        monthlyCount: { label: "Monatlich" },
        yearlyCount: { label: "Jährlich" },
        yearlyRevenuePct: { label: "% Jahresumsatz" },
      },
      creditStats: {
        title: "Credits",
        description: "Credit-Kennzahlen",
        totalPurchased: { label: "Gekauft" },
        totalSpent: { label: "Verbraucht" },
        packsSold: { label: "Pakete verkauft" },
        avgPackSize: { label: "Ø Paketgröße" },
      },
      referralStats: {
        title: "Empfehlungen",
        description: "Empfehlungsprogramm",
        totalReferrals: { label: "Gesamt" },
        conversionRate: { label: "Konversion" },
        totalEarned: { label: "Verdient" },
        pendingPayouts: { label: "Ausstehend" },
      },
      growthMetrics: {
        title: "Wachstum",
        description: "Umsatz- und Abo-Trends",
        revenueChart: {
          label: "Umsatzverlauf",
          description: "Umsatztrend",
        },
        subscriptionChart: {
          label: "Abo-Wachstum",
          description: "Aktive Abos",
        },
      },
      businessInsights: {
        title: "Einblicke",
        description: "Generierte Kennzahlen",
        generatedAt: { label: "Erstellt am" },
      },
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Anmeldung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Parameter",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Admin-Zugang erforderlich",
      },
      server: {
        title: "Serverfehler",
        description: "Statistiken konnten nicht generiert werden",
        detail: "Statistikauswertung fehlgeschlagen: {{error}}",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      conflict: { title: "Konflikt", description: "Datenkonflikt" },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung fehlgeschlagen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Statistiken nicht verfügbar",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: { title: "Erfolg", description: "Statistiken generiert" },
  },
  widget: {
    refresh: "Aktualisieren",
    filters: "Filter",
  },
  stats: {
    timePeriod: {
      day: "Tag",
      week: "Woche",
      month: "Monat",
      quarter: "Quartal",
      year: "Jahr",
    },
    dateRange: {
      today: "Heute",
      yesterday: "Gestern",
      last7Days: "Letzte 7 Tage",
      last30Days: "Letzte 30 Tage",
      last90Days: "Letzte 90 Tage",
      thisWeek: "Diese Woche",
      lastWeek: "Letzte Woche",
      thisMonth: "Dieser Monat",
      lastMonth: "Letzter Monat",
      thisQuarter: "Dieses Quartal",
      lastQuarter: "Letztes Quartal",
      thisYear: "Dieses Jahr",
      lastYear: "Letztes Jahr",
      custom: "Benutzerdefiniert",
    },
  },
};
