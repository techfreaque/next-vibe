import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Lista kont SMTP",
  description: "Pobierz paginowaną listę kont SMTP z opcjami filtrowania",

  container: {
    title: "Lista kont SMTP",
    description: "Przeglądaj i filtruj konta SMTP",
  },

  fields: {
    campaignType: {
      label: "Typ kampanii",
      description: "Filtruj według typu kampanii",
    },
    status: {
      label: "Status konta",
      description: "Filtruj według statusu konta",
    },
    healthStatus: {
      label: "Status zdrowia",
      description: "Filtruj według statusu sprawdzenia zdrowia",
    },
    search: {
      label: "Szukaj",
      description: "Wyszukaj według nazwy konta lub e-maila",
      placeholder: "Szukaj kont...",
    },
    sortBy: {
      label: "Sortuj według",
      description: "Sortuj konta według pola",
    },
    sortOrder: {
      label: "Kolejność sortowania",
      description: "Kolejność sortowania (rosnąco lub malejąco)",
    },
    page: {
      label: "Strona",
      description: "Numer strony do paginacji",
    },
    limit: {
      label: "Limit",
      description: "Liczba kont na stronę",
    },
  },

  response: {
    account: {
      title: "Konto SMTP",
      description: "Szczegóły konta SMTP",
      id: "ID konta",
      name: "Nazwa konta",
      status: "Status",
      healthStatus: "Status zdrowia",
      priority: "Priorytet",
      totalEmailsSent: "Łączna liczba wysłanych e-maili",
      lastUsedAt: "Ostatnio używane",
      createdAt: "Utworzono",
    },
    pagination: {
      title: "Paginacja",
      description: "Informacje o paginacji",
      page: "Strona",
      limit: "Limit",
      total: "Łącznie",
      totalPages: "Łączna liczba stron",
    },
  },

  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Nieprawidłowe parametry filtrowania",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Wymagane uprawnienia administratora do listy kont SMTP",
    },
    forbidden: {
      title: "Zabronione",
      description: "Dostęp zabroniony",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Zasób nie został znaleziony",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt danych",
    },
    server: {
      title: "Błąd serwera",
      description: "Nie udało się pobrać kont SMTP",
    },
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
    title: "Konta SMTP pobrane",
    description: "Pomyślnie pobrano listę kont SMTP",
  },
};
