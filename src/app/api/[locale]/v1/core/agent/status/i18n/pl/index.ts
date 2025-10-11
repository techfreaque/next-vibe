import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Status Agenta E-mail",
    description: "Pobierz status przetwarzania e-maili",
    form: {
      title: "Parametry zapytania o status",
      description: "Filtruj i sortuj status przetwarzania agenta e-mail",
    },
    page: {
      label: "Strona",
      description: "Numer strony dla paginacji",
    },
    limit: {
      label: "Limit",
      description: "Liczba elementów na stronę",
    },
    emailId: {
      label: "ID e-maila",
      description: "Filtruj według konkretnego ID e-maila",
    },
    accountId: {
      label: "ID konta",
      description: "Filtruj według ID konta e-mail",
    },
    status: {
      label: "Status",
      description: "Filtruj według statusu przetwarzania",
    },
    actionType: {
      label: "Typ akcji",
      description: "Filtruj według typu akcji",
    },
    priority: {
      label: "Priorytet",
      description: "Filtruj według priorytetu przetwarzania",
    },
    sortBy: {
      label: "Sortuj według",
      description: "Pola do sortowania",
    },
    sortOrder: {
      label: "Kolejność sortowania",
      description: "Kierunek kolejności sortowania",
    },
    dateFrom: {
      label: "Data od",
      description: "Filtruj od tej daty",
    },
    dateTo: {
      label: "Data do",
      description: "Filtruj do tej daty",
    },
    response: {
      title: "Odpowiedź statusu",
      description: "Wyniki statusu przetwarzania agenta e-mail",
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do dostępu do statusu agenta",
      },
      validation: {
        title: "Walidacja nie powiodła się",
        description: "Podano nieprawidłowe parametry",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się pobrać statusu agenta",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Komunikacja sieciowa nie powiodła się",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp do tego zasobu jest zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt zasobów",
      },
    },
    success: {
      title: "Sukces",
      description: "Status agenta pobrany pomyślnie",
    },
  },
  post: {
    title: "Status Agenta E-mail (CLI)",
    description: "Wersja CLI do pobierania statusu przetwarzania",
    form: {
      title: "Parametry zapytania o status",
      description: "Skonfiguruj parametry do pobierania statusu",
    },
    page: {
      label: "Strona",
      description: "Numer strony dla paginacji",
    },
    limit: {
      label: "Limit",
      description: "Liczba elementów na stronę",
    },
    response: {
      title: "Odpowiedź statusu",
      description: "Wyniki statusu przetwarzania agenta e-mail",
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do dostępu do statusu agenta",
      },
      validation: {
        title: "Walidacja nie powiodła się",
        description: "Podano nieprawidłowe parametry",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się pobrać statusu agenta",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Komunikacja sieciowa nie powiodła się",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp do tego zasobu jest zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt zasobów",
      },
    },
    success: {
      title: "Sukces",
      description: "Status agenta pobrany pomyślnie",
    },
  },
};
