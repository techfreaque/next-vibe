import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  get: {
    title: "Subskrypcje",
    titleShort: "Lista subskrypcji",
    description: "Przeglądaj wszystkie subskrypcje",
    form: {
      title: "Zarządzanie subskrypcjami",
      description: "Filtruj i przeglądaj",
    },
    searchFilters: {
      title: "Szukaj i filtruj",
      description: "Filtruj subskrypcje",
    },
    search: {
      label: "Szukaj",
      description: "Szukaj po emailu lub nazwie",
      placeholder: "Szukaj subskrypcji...",
    },
    status: {
      label: "Status",
      description: "Filtruj po statusie",
      placeholder: "Wybierz status...",
    },
    interval: {
      label: "Okres",
      description: "Filtruj po okresie",
      placeholder: "Dowolny",
    },
    provider: {
      label: "Dostawca",
      description: "Filtruj po dostawcy",
      placeholder: "Dowolny",
    },
    dateFrom: { label: "Od", description: "Data początkowa" },
    dateTo: { label: "Do", description: "Data końcowa" },
    sortingOptions: {
      title: "Sortowanie",
      description: "Konfiguracja sortowania",
    },
    sortBy: {
      label: "Sortuj po",
      description: "Pole sortowania",
      placeholder: "Wybierz pole...",
    },
    sortOrder: {
      label: "Kolejność",
      description: "Kierunek sortowania",
      placeholder: "Wybierz...",
    },
    response: {
      title: "Subskrypcje",
      description: "Pasujące subskrypcje",
      subscriptions: {
        id: "ID",
        userEmail: "Email",
        userName: "Nazwa",
        planId: "Plan",
        billingInterval: "Okres",
        status: "Status",
        createdAt: "Rozpoczęta",
        currentPeriodEnd: "Koniec okresu",
        cancelAtPeriodEnd: "Anuluj na koniec",
        canceledAt: "Anulowana",
        cancellationReason: "Powód anulowania",
        provider: "Dostawca",
        providerSubscriptionId: "ID dostawcy",
      },
      totalCount: "Łącznie",
      pageCount: "Stron",
    },
    page: { label: "Strona" },
    limit: { label: "Na stronę" },
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
        description: "Nie udało się pobrać subskrypcji",
        detail: "Nie udało się pobrać listy subskrypcji: {{error}}",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Nieoczekiwany błąd",
      },
      conflict: { title: "Konflikt", description: "Konflikt danych" },
      network: {
        title: "Błąd sieci",
        description: "Nie udało się połączyć",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Brak subskrypcji",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Niezapisane zmiany",
      },
    },
    success: { title: "Sukces", description: "Subskrypcje pobrane" },
  },
  widget: {
    noSubscriptions: "Nie znaleziono subskrypcji.",
    noMatchingSubscriptions: "Żadne subskrypcje nie pasują do filtrów.",
    searchPlaceholder: "Szukaj po emailu lub nazwie...",
    refresh: "Odśwież",
    viewStats: "Statystyki",
  },
  enums: {
    subscriptionStatusFilter: {
      all: "Wszystkie",
      active: "Aktywne",
      trialing: "Próbne",
      pastDue: "Przeterminowane",
      canceled: "Anulowane",
      unpaid: "Nieopłacone",
      paused: "Wstrzymane",
    },
    billingIntervalFilter: {
      any: "Dowolny",
      monthly: "Miesięczny",
      yearly: "Roczny",
    },
    providerFilter: {
      any: "Dowolny",
      stripe: "Stripe",
      nowpayments: "NowPayments",
    },
    subscriptionSortField: {
      createdAt: "Data utworzenia",
      status: "Status",
      interval: "Interwał",
      userEmail: "Email",
    },
    sortOrder: {
      asc: "Rosnąco",
      desc: "Malejąco",
    },
  },
};
