import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/de";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  get: {
    title: "Umsatz",
    titleShort: "Umsatz",
    description:
      "Umsatz aus Credit-Paketen, Neuabos und Verlängerungen nach Zahlungsanbieter, Plan und Währung, mit Erstattungen, Rückbuchungen, MRR, aktiven Abos und Kündigungen.",
    tags: {
      revenue: "Umsatz",
      mrr: "MRR",
    },
    fields: {
      kind: {
        label: "Art",
        description: "Credit-Pakete, Neuabos, Verlängerungen oder alle",
      },
      provider: {
        label: "Zahlungsanbieter",
        description: "Nur Zahlungen über diesen Zahlungsanbieter",
      },
      currency: {
        label: "Währung",
        description: "Nur Zahlungen in dieser Währung (USD, EUR, PLN)",
      },
      plan: {
        label: "Plan",
        description: "Nur Zahlungen und Abos in diesem Plan",
      },
      includeInternal: {
        label: "Admin-Konten einbeziehen",
        description: "Zahlungen von Admin-Konten mitzählen",
      },
    },
    response: {
      window: "Zeitraum",
      appliedFilters: "Aktive Filter",
      kpis: "Kennzahlen",
      revenueByKind: "Umsatz nach Art",
      revenueByProcessor: "Umsatz nach Zahlungsanbieter",
      subscriptionFlow: "Neue vs. gekündigte Abos",
      byPlan: "Nach Plan oder Produkt",
      byCurrency: "Nach Währung",
      byProcessor: "Nach Zahlungsanbieter",
      recentPayments: "Letzte Zahlungen",
      fxRates: "Wechselkurse zu USD",
    },
    errors: {
      validation: {
        title: "Ungültige Filter",
        description: "Zeitraum und Filter prüfen, dann erneut versuchen.",
      },
      unauthorized: {
        title: "Anmeldung erforderlich",
        description: "Als Admin anmelden, um den Umsatz zu sehen.",
      },
      forbidden: {
        title: "Nur für Admins",
        description: "Nur Admins sehen den Umsatz.",
      },
      notFound: {
        title: "Nichts gefunden",
        description: "Keine Zahlungen zu dieser Anfrage.",
      },
      server: {
        title: "Bericht fehlgeschlagen",
        description:
          "Der Umsatzbericht konnte nicht erstellt werden. Erneut versuchen.",
      },
      unknown: {
        title: "Unerwarteter Fehler",
        description: "Beim Laden des Berichts ist etwas schiefgelaufen.",
      },
      network: {
        title: "Verbindungsfehler",
        description: "Der Server ist nicht erreichbar.",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Filteränderungen erst anwenden oder verwerfen.",
      },
      conflict: {
        title: "Datenkonflikt",
        description:
          "Die Daten haben sich beim Laden geändert. Bericht neu laden.",
      },
    },
    success: {
      title: "Bericht bereit",
      description: "Umsatz geladen",
    },
  },
  widget: {
    loadingReport: "Umsatzbericht wird geladen…",
    operatingTitle: "Operativer Umsatz",
    currencyBasis: "Beträge als Näherungswerte in USD.",
    filterDisclosure: "Filter",
    extra: {
      grossHint: "Abos {{subs}} · Pakete {{packs}} · ca. USD",
      newSubsHint: "Im Zeitraum gestartete Abos · {{count}} Erstzahlungen",
      churn30Hint: "Im Zeitraum beendet · 30-Tage-Kündigungsrate {{rate}}",
      notLoaded: "Bericht nicht geladen. Zum erneuten Versuch aktualisieren.",
      firstPayments: "Erste Abo-Zahlungen",
      openAll: "Alle Zahlungen öffnen",
      churnChart: "30-Tage-Kündigungsrate",
      churnNote:
        "In den 30 Tagen vor jedem Punkt beendete Abos ÷ aktive Abos zu Beginn dieser 30 Tage",
      kindPack: "Credit-Paket",
      kindNew: "Erste Abo-Zahlung",
      kindRenewal: "Verlängerung",
      paid: "Bezahlt",
      subscriptionNote:
        "Abo-Kennzahlen ignorieren den Art- und Währungsfilter.",
      netHint:
        "Brutto minus Erstattungen im Zeitraum; Rückbuchungen und Zahlungsgebühren nicht abgezogen",
      mrrHint: "Laufende Abos zum Periodenende, Jahrespläne ÷ 12",
      mrrChart: "MRR im Zeitverlauf",
      mrrNote: "Wiederkehrender Umsatz der jeweils laufenden Abos.",
      churnRate: "{{rate}} der Abos, die zu Periodenbeginn aktiv waren",
      seriesMrr: "MRR",
      seriesActive: "Aktive Abos",
      packUnknown: "Credit-Paket, Größe nicht erfasst",
      filterIgnored: "Unabhängig vom Art- und Währungsfilter",
      processorAll: "Alle Anbieter",
      currencyAll: "Alle Währungen",
    },
    group: {
      money: "Geld",
      customers: "Kunden und Abos",
      volume: "Zahlungsvolumen",
    },
    kpi: {
      grossRevenueUsd: "Bruttoumsatz",
      netRevenueUsd: "Nettoumsatz",
      refundsUsd: "Erstattungen",
      mrrUsd: "MRR",
      payingCustomers: "Zahlende Kunden",
      activeSubscriptions: "Aktive Abos",
      newSubscriptions: "Neuabos",
      churnedSubscriptions: "Gekündigt",
      renewals: "Verlängerungen",
      packPurchases: "Paketkäufe",
      disputes: "Rückbuchungen",
      failedPayments: "Fehlgeschlagene Zahlungen",
    },
    hint: {
      grossRevenueUsd: "Eingegangene Zahlungen, ca. USD",
      netRevenueUsd: "Brutto minus Erstattungen im Zeitraum",
      refundsUsd: "Im Zeitraum erstattet",
      mrrUsd: "Aktive Abos zum Periodenende, jährlich / 12",
      payingCustomers: "Konten mit mindestens einer eingegangenen Zahlung",
      activeSubscriptions: "Laufend zum Periodenende",
      newSubscriptions: "Im Zeitraum gestartete Abos",
      churnedSubscriptions: "Im Zeitraum beendete Abos",
      renewals: "Eingegangene Verlängerungszahlungen",
      packPurchases: "Eingegangene Zahlungen für Credit-Pakete",
      disputes: "Im Zeitraum eröffnete Rückbuchungen",
      failedPayments: "Im Zeitraum fehlgeschlagene Zahlungen",
    },
    chart: {
      kind: "Umsatz nach Art",
      processor: "Umsatz nach Zahlungsanbieter",
      flow: "Abos: neu vs. gekündigt",
    },
    series: {
      pack: "Credit-Pakete",
      newSubscription: "Neuabos",
      renewal: "Verlängerungen",
      new: "Neu",
      churned: "Gekündigt",
    },
    breakdown: {
      byPlan: "Nach Plan oder Produkt",
      byCurrency: "Nach Währung",
      byProcessor: "Nach Zahlungsanbieter",
      recent: "Letzte Zahlungen",
      recentHint:
        "Klicke eine Zahlung an, um sie in den Zahlungsvorgängen zu öffnen.",
      drillHint: "Zeile anklicken, um den Bericht zu filtern.",
      plan: "Plan oder Produkt",
      currency: "Währung",
      processor: "Zahlungsanbieter",
      payment: "Zahlung",
    },
    column: {
      revenueUsd: "Umsatz",
      amount: "Originalbetrag",
      payments: "Zahlungen",
      customers: "Kunden",
      failed: "Fehlgeschl.",
      refundsUsd: "Erstattet",
      usd: "USD",
    },
    label: {
      creditPack: "Credit-Paket (500)",
      creditPackLarge: "Credit-Paket (2.500)",
      pack: "Credit-Paket",
      newSubscription: "Neuabo, Plan nicht erfasst",
      renewal: "Verlängerung, Plan nicht erfasst",
      rate: "1 {{currency}} = {{rate}} USD",
    },
    fxNote: "Summen in ca. USD zu festen Kursen: {{rates}}.",
    subscriptionNote:
      "Abo-Zahlen folgen nur den Filtern für Zahlungsanbieter und Plan.",
    filter: {
      kind: "Art",
      provider: "Anbieter",
      currency: "Währung",
      plan: "Plan",
      internal: "Inkl. Admins",
    },
    empty: "Keine Zahlungen in diesem Zeitraum.",
    includeInternal: "Admins einbeziehen",
  },
  enums: {
    kind: {
      all: "Alle",
      pack: "Pakete",
      newSubscription: "Erstzahlungen",
      renewal: "Verlängerungen",
    },
    paymentProvider: {
      stripe: "Stripe",
      nowpayments: "NOWPayments",
    },
    paymentStatus: {
      pending: "Ausstehend",
      processing: "In Bearbeitung",
      succeeded: "Erfolgreich",
      failed: "Fehlgeschlagen",
      canceled: "Storniert",
      refunded: "Erstattet",
    },
    plan: {
      subscription: "Starter",
      plus: "Plus",
      pro: "Pro",
      ultra: "Ultra",
    },
  },
};
