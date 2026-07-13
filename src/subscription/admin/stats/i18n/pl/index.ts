import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  get: {
    title: "Statystyki subskrypcji",
    titleShort: "Statystyki admin",
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
