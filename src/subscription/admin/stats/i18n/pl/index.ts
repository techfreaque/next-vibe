import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  get: {
    title: "Statystyki subskrypcji",
    titleShort: "Wskaźniki subskrypcji",
    description: "Przychody, subskrypcje, kredyty i polecenia",
    form: {
      title: "Dashboard statystyk",
      description: "Zagregowane metryki",
    },
    timePeriodOptions: {
      title: "Okres",
      description: "Konfiguracja zakresu",
    },
    timePeriod: { label: "Okres", description: "Interwał grupowania" },
    dateRangePreset: {
      label: "Zakres dat",
      description: "Predefiniowany zakres",
    },
    response: {
      revenueStats: {
        title: "Przychody",
        description: "Metryki przychodów",
        mrr: { label: "MRR" },
        arr: { label: "ARR" },
        totalRevenue: { label: "Łączny przychód" },
        avgOrderValue: { label: "Śr. zamówienie" },
      },
      subscriptionStats: {
        title: "Subskrypcje",
        description: "Liczba subskrypcji",
        activeCount: { label: "Aktywne" },
        trialingCount: { label: "Okres próbny" },
        pastDueCount: { label: "Zaległe" },
        canceledCount: { label: "Anulowane" },
        churnRate: { label: "Wskaźnik rezygnacji" },
      },
      intervalStats: {
        title: "Okresy rozliczeniowe",
        description: "Miesięcznie vs rocznie",
        monthlyCount: { label: "Miesięcznie" },
        yearlyCount: { label: "Rocznie" },
        yearlyRevenuePct: { label: "% przychodu rocznego" },
      },
      creditStats: {
        title: "Kredyty",
        description: "Metryki kredytów",
        totalPurchased: { label: "Kupione" },
        spentFromFree: { label: "Z darmowej puli" },
        totalSpent: { label: "Wydane" },
        packsSold: { label: "Sprzedane pakiety" },
        avgPackSize: { label: "Śr. rozmiar" },
      },
      referralStats: {
        title: "Polecenia",
        description: "Program poleceń",
        totalReferrals: { label: "Łącznie" },
        conversionRate: { label: "Konwersja" },
        totalEarned: { label: "Zarobione" },
        pendingPayouts: { label: "Oczekujące" },
      },
      growthMetrics: {
        title: "Wzrost",
        description: "Trendy przychodów i subskrypcji",
        revenueChart: {
          label: "Przychody w czasie",
          description: "Trend przychodów",
        },
        subscriptionChart: {
          label: "Wzrost subskrypcji",
          description: "Aktywne subskrypcje",
        },
      },
      businessInsights: {
        title: "Wnioski",
        description: "Wygenerowane metryki",
        generatedAt: { label: "Wygenerowano" },
      },
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane logowanie",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Wymagany dostęp administratora",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się wygenerować statystyk",
        detail: "Nie udało się zbudować statystyk: {{error}}",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      conflict: { title: "Konflikt", description: "Konflikt danych" },
      network: {
        title: "Błąd sieci",
        description: "Nie udało się połączyć",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Statystyki niedostępne",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: { title: "Sukces", description: "Statystyki wygenerowane" },
  },
  widget: {
    paidPacks: "Płatne pakiety: subskrypcja + kupione",
    canceledShare: "Udział anulowanych, cały okres",
    spentSplit:
      "{{packs}} z pakietów (jak w Pakietach kredytów) · {{free}} z darmowych pul",
    creditsSold: "Sprzedane kredyty",
    creditsSoldHint:
      "Pakiety z subskrypcji i kupione. Bez przydziałów i prowizji z poleceń.",
    pastDueHint: "Płatność nieudana, nadal liczony jako subskrybent",
    yearlyShare: "Plany roczne",
    yearlyShareHint:
      "Udział aktywnych, próbnych i zaległych subskrypcji rozliczanych rocznie",
    showLegacy: "Pokaż stary przegląd przychodów",
    hideLegacy: "Ukryj stary przegląd przychodów",
    approxUsd: "ok. USD",
    openLabel: "Otwórz:",
    linkSubscriptions: "Lista subskrypcji",
    linkPurchases: "Pakiety kredytów",
    linkReferrals: "Polecenia",
    apply: "Zastosuj",
    sectionSubscriptions: "Subskrypcje",
    sectionSubscriptionsHint: "Stan obecny, cały okres",
    activePaid: "Aktywne",
    activePaidHint: "Stan aktywny. Ta sama liczba co na liście subskrypcji.",
    churnHint:
      "Anulowane spośród aktywnych, próbnych, zaległych i anulowanych. To nie miesięczny churn.",
    sectionCredits: "Kredyty",
    purchasedHint: "Kredyty w pakietach kont",
    spentHint: "Kredyty zużyte",
    sectionReferrals: "Polecenia",
    sectionLegacy: "Stary przegląd przychodów",
    sectionLegacyHint:
      "Zastąpiony raportem przychodów. Przeliczone na ok. USD.",
    revenueReportTitle: "Przychody, MRR i churn są teraz w raporcie przychodów",
    revenueReportHint:
      "Realnie zebrane pieniądze dzień po dniu, według waluty i rodzaju, z wglądem w każdą płatność.",
    openRevenueReport: "Otwórz raport przychodów",
    refresh: "Odśwież",
    filters: "Filtry",
  },
  stats: {
    timePeriod: {
      day: "Dzień",
      week: "Tydzień",
      month: "Miesiąc",
      quarter: "Kwartał",
      year: "Rok",
    },
    dateRange: {
      today: "Dziś",
      yesterday: "Wczoraj",
      last7Days: "Ostatnie 7 dni",
      last30Days: "Ostatnie 30 dni",
      last90Days: "Ostatnie 90 dni",
      thisWeek: "Ten tydzień",
      lastWeek: "Ostatni tydzień",
      thisMonth: "Ten miesiąc",
      lastMonth: "Ostatni miesiąc",
      thisQuarter: "Ten kwartał",
      lastQuarter: "Ostatni kwartał",
      thisYear: "Ten rok",
      lastYear: "Ostatni rok",
      custom: "Niestandardowy",
    },
  },
};
