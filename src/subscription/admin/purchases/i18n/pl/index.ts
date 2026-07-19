import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  get: {
    title: "Zakupy kredytów",
    titleShort: "Zakupy admin",
    description: "Historia zakupów pakietów kredytowych",
    form: {
      title: "Historia zakupów",
      description: "Przeglądaj pakiety kredytowe",
    },
    searchFilters: {
      title: "Szukaj i filtruj",
      description: "Filtruj zakupy",
    },
    search: {
      label: "Szukaj",
      description: "Szukaj po emailu",
      placeholder: "Szukaj zakupów...",
    },
    packType: {
      label: "Typ pakietu",
      description: "Filtruj po typie",
      placeholder: "Dowolny",
    },
    source: {
      label: "Źródło",
      description: "Filtruj po źródle",
      placeholder: "Dowolne",
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
      title: "Zakupy",
      description: "Historia zakupów pakietów",
      purchases: {
        id: "ID",
        userEmail: "Email",
        userName: "Nazwa",
        packType: "Typ",
        source: "Źródło",
        originalAmount: "Ilość",
        remaining: "Pozostało",
        expiresAt: "Wygasa",
        createdAt: "Zakupiono",
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
        description: "Nie udało się pobrać zakupów",
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
        description: "Brak zakupów",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Niezapisane zmiany",
      },
    },
    success: { title: "Sukces", description: "Zakupy pobrane" },
  },
  widget: {
    noPurchases: "Nie znaleziono zakupów kredytowych.",
    noMatchingPurchases: "Żadne zakupy nie pasują do filtrów.",
    searchPlaceholder: "Szukaj po emailu...",
    refresh: "Odśwież",
    expired: "Wygasło",
    neverExpires: "Bezterminowo",
  },
  enums: {
    creditPackTypeFilter: {
      any: "Dowolny",
      subscription: "Subskrypcja",
      permanent: "Trwały",
      bonus: "Bonus",
      earned: "Zarobiony",
    },
    creditPackSourceFilter: {
      any: "Dowolne",
      stripePurchase: "Zakup Stripe",
      stripeSubscription: "Grant subskrypcji",
      adminGrant: "Przydział admina",
      referralEarning: "Zarobek z polecenia",
    },
    purchaseSortField: {
      createdAt: "Data utworzenia",
      amount: "Kwota",
      type: "Typ",
      userEmail: "Email",
    },
    sortOrder: {
      asc: "Rosnąco",
      desc: "Malejąco",
    },
  },
};
