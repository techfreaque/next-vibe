import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/pl";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  get: {
    title: "Przychody",
    titleShort: "Przychody",
    description:
      "Przychody z pakietów kredytów, nowych subskrypcji i odnowień według operatora płatności, planu i waluty, ze zwrotami, sporami, MRR, aktywnymi subskrypcjami i rezygnacjami.",
    tags: {
      revenue: "przychody",
      mrr: "MRR",
    },
    fields: {
      kind: {
        label: "Rodzaj",
        description:
          "Pakiety kredytów, nowe subskrypcje, odnowienia albo wszystko",
      },
      provider: {
        label: "Operator",
        description: "Tylko płatności przez tego operatora",
      },
      currency: {
        label: "Waluta",
        description: "Tylko płatności w tej walucie (USD, EUR, PLN)",
      },
      plan: {
        label: "Plan",
        description: "Tylko płatności i subskrypcje w tym planie",
      },
      includeInternal: {
        label: "Uwzględnij konta adminów",
        description: "Licz też płatności kont adminów",
      },
    },
    response: {
      window: "Okres",
      appliedFilters: "Zastosowane filtry",
      kpis: "Kluczowe wskaźniki",
      revenueByKind: "Przychody według rodzaju",
      revenueByProcessor: "Przychody według operatora",
      subscriptionFlow: "Nowe vs anulowane subskrypcje",
      byPlan: "Według planu lub produktu",
      byCurrency: "Według waluty",
      byProcessor: "Według operatora",
      recentPayments: "Ostatnie płatności",
      fxRates: "Kursy walut do USD",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe filtry",
        description: "Sprawdź okres i filtry, potem spróbuj ponownie.",
      },
      unauthorized: {
        title: "Wymagane logowanie",
        description: "Zaloguj się jako admin, żeby zobaczyć przychody.",
      },
      forbidden: {
        title: "Tylko dla adminów",
        description: "Przychody widzą tylko admini.",
      },
      notFound: {
        title: "Nic nie znaleziono",
        description: "Brak płatności dla tego zapytania.",
      },
      server: {
        title: "Raport nieudany",
        description:
          "Nie udało się zbudować raportu przychodów. Spróbuj ponownie.",
      },
      unknown: {
        title: "Nieoczekiwany błąd",
        description: "Coś poszło nie tak podczas ładowania raportu.",
      },
      network: {
        title: "Błąd połączenia",
        description: "Nie można połączyć się z serwerem.",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Najpierw zastosuj albo odrzuć zmiany filtrów.",
      },
      conflict: {
        title: "Konflikt danych",
        description: "Dane zmieniły się podczas ładowania. Odśwież raport.",
      },
    },
    success: {
      title: "Raport gotowy",
      description: "Przychody wczytane",
    },
  },
  widget: {
    loadingReport: "Wczytywanie raportu przychodów…",
    operatingTitle: "Przychody operacyjne",
    currencyBasis: "Kwoty w przybliżeniu w USD.",
    filterDisclosure: "Filtry",
    extra: {
      grossHint: "Subskrypcje {{subs}} · pakiety {{packs}} · ok. USD",
      newSubsHint:
        "Subskrypcje rozpoczęte w okresie · {{count}} pierwszych płatności",
      churn30Hint: "Zakończone w okresie · rezygnacje 30 dni {{rate}}",
      notLoaded: "Raport nie wczytany. Odśwież, aby spróbować ponownie.",
      firstPayments: "Pierwsze płatności za subskrypcje",
      openAll: "Otwórz wszystkie płatności",
      churnChart: "Rezygnacje w 30 dni",
      churnNote:
        "Subskrypcje zakończone w 30 dniach przed punktem ÷ aktywne na początku tych 30 dni",
      kindPack: "Pakiet kredytów",
      kindNew: "Pierwsza płatność za subskrypcję",
      kindRenewal: "Odnowienie",
      paid: "Opłacone",
      subscriptionNote: "Dane subskrypcji pomijają filtry rodzaju i waluty.",
      netHint:
        "Brutto minus zwroty w okresie; spory i opłaty operatora nieodliczone",
      mrrHint: "Subskrypcje aktywne na koniec okresu, plany roczne ÷ 12",
      mrrChart: "MRR w czasie",
      mrrNote: "Przychód cykliczny z subskrypcji aktywnych w danym momencie.",
      churnRate: "{{rate}} subskrypcji aktywnych na początku okresu",
      seriesMrr: "MRR",
      seriesActive: "Aktywne subskrypcje",
      packUnknown: "Pakiet kredytów, rozmiar nieznany",
      filterIgnored: "Filtr rodzaju i waluty tu nie działa",
      processorAll: "Wszyscy operatorzy",
      currencyAll: "Wszystkie waluty",
    },
    group: {
      money: "Pieniądze",
      customers: "Klienci i subskrypcje",
      volume: "Wolumen płatności",
    },
    kpi: {
      grossRevenueUsd: "Przychód brutto",
      netRevenueUsd: "Przychód netto",
      refundsUsd: "Zwroty",
      mrrUsd: "MRR",
      payingCustomers: "Płacący klienci",
      activeSubscriptions: "Aktywne subskrypcje",
      newSubscriptions: "Nowe subskrypcje",
      churnedSubscriptions: "Anulowane",
      renewals: "Odnowienia",
      packPurchases: "Zakupy pakietów",
      disputes: "Spory",
      failedPayments: "Nieudane płatności",
    },
    hint: {
      grossRevenueUsd: "Pobrane płatności, ok. USD",
      netRevenueUsd: "Brutto minus zwroty wydane w okresie",
      refundsUsd: "Zwroty wydane w okresie",
      mrrUsd: "Aktywne subskrypcje na koniec okresu, roczne / 12",
      payingCustomers: "Konta z co najmniej jedną pobraną płatnością",
      activeSubscriptions: "Aktywne na koniec okresu",
      newSubscriptions: "Subskrypcje rozpoczęte w okresie",
      churnedSubscriptions: "Subskrypcje zakończone w okresie",
      renewals: "Pobrane płatności za odnowienia",
      packPurchases: "Pobrane płatności za pakiety kredytów",
      disputes: "Obciążenia zwrotne otwarte w okresie",
      failedPayments: "Płatności nieudane w okresie",
    },
    chart: {
      kind: "Przychody według rodzaju",
      processor: "Przychody według operatora",
      flow: "Subskrypcje: nowe vs anulowane",
    },
    series: {
      pack: "Pakiety kredytów",
      newSubscription: "Nowe subskrypcje",
      renewal: "Odnowienia",
      new: "Nowe",
      churned: "Anulowane",
    },
    breakdown: {
      byPlan: "Według planu lub produktu",
      byCurrency: "Według waluty",
      byProcessor: "Według operatora",
      recent: "Ostatnie płatności",
      recentHint:
        "Kliknij płatność, żeby otworzyć ją w transakcjach operatora.",
      drillHint: "Kliknij wiersz, żeby przefiltrować raport.",
      plan: "Plan lub produkt",
      currency: "Waluta",
      processor: "Operator",
      payment: "Płatność",
    },
    column: {
      revenueUsd: "Przychód",
      amount: "Kwota oryginalna",
      payments: "Płatności",
      customers: "Klienci",
      failed: "Nieudane",
      refundsUsd: "Zwrócono",
      usd: "USD",
    },
    label: {
      creditPack: "Pakiet kredytów (500)",
      creditPackLarge: "Pakiet kredytów (2500)",
      pack: "Pakiet kredytów",
      newSubscription: "Nowa subskrypcja, plan nieznany",
      renewal: "Odnowienie, plan nieznany",
      rate: "1 {{currency}} = {{rate}} USD",
    },
    fxNote: "Sumy w ok. USD po stałych kursach: {{rates}}.",
    subscriptionNote:
      "Dane subskrypcji uwzględniają tylko filtry operatora i planu.",
    filter: {
      kind: "Rodzaj",
      provider: "Operator",
      currency: "Waluta",
      plan: "Plan",
      internal: "Z adminami",
    },
    empty: "Brak płatności w tym okresie.",
    includeInternal: "Uwzględnij adminów",
  },
  enums: {
    kind: {
      all: "Wszystko",
      pack: "Pakiety",
      newSubscription: "Pierwsze płatności",
      renewal: "Odnowienia",
    },
    paymentProvider: {
      stripe: "Stripe",
      nowpayments: "NOWPayments",
      whop: "Whop",
    },
    paymentStatus: {
      pending: "Oczekuje",
      processing: "W toku",
      succeeded: "Udana",
      failed: "Nieudana",
      canceled: "Anulowana",
      refunded: "Zwrócona",
    },
    plan: {
      subscription: "Starter",
      plus: "Plus",
      pro: "Pro",
      ultra: "Ultra",
    },
  },
};
