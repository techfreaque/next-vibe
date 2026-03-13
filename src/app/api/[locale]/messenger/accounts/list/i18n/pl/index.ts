export const translations = {
  tags: {
    messaging: "Messaging",
  },
  title: "Konta Messenger",
  description: "Lista wszystkich kont messenger we wszystkich kanałach",
  fields: {
    channel: { label: "Kanał", description: "Filtruj według kanału" },
    provider: { label: "Dostawca", description: "Filtruj według dostawcy" },
    status: { label: "Status", description: "Filtruj według statusu" },
    search: {
      label: "Szukaj",
      description: "Szukaj po nazwie lub opisie",
      placeholder: "Szukaj kont...",
    },
    page: { label: "Strona", description: "Numer strony" },
    limit: { label: "Limit", description: "Liczba kont na stronę" },
    sortBy: { label: "Sortuj według", description: "Pole sortowania" },
    sortOrder: { label: "Kolejność", description: "Kierunek sortowania" },
  },
  response: {
    account: {
      title: "Konto",
      description: "Szczegóły konta messenger",
      id: "ID",
      name: "Nazwa",
      channel: "Kanał",
      provider: "Dostawca",
      status: "Status",
      healthStatus: "Zdrowie",
      priority: "Priorytet",
      messagesSentTotal: "Wysłanych wiadomości",
      lastUsedAt: "Ostatnio używany",
      createdAt: "Utworzono",
      isDefault: "Domyślny",
      smtpFromEmail: "Od e-mail",
      fromId: "Od ID",
    },
    pagination: {
      title: "Paginacja",
      description: "Informacje o paginacji",
      page: "Strona",
      limit: "Na stronę",
      total: "Łącznie",
      totalPages: "Stron łącznie",
    },
  },
  widget: {
    create: "Dodaj konto",
    refresh: "Odśwież",
    emptyState: "Brak skonfigurowanych kont messenger",
    searchPlaceholder: "Szukaj kont...",
  },
  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Nieprawidłowe parametry filtrowania",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Wymagany dostęp administratora",
    },
    forbidden: { title: "Zabronione", description: "Odmowa dostępu" },
    notFound: { title: "Nie znaleziono", description: "Zasób nie znaleziony" },
    conflict: { title: "Konflikt", description: "Wystąpił konflikt danych" },
    server: { title: "Błąd serwera", description: "Nie udało się pobrać kont" },
    networkError: {
      title: "Błąd sieci",
      description: "Komunikacja sieciowa nie powiodła się",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieoczekiwany błąd",
    },
  },
  success: {
    title: "Konta pobrane",
    description: "Konta messenger pobrane pomyślnie",
  },
};
