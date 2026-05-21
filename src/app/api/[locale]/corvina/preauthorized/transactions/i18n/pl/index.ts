export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    preauthorized: "Transakcje preautoryzowane",
  },
  get: {
    title: "Lista preautoryzowanych transakcji",
    description:
      "Wyświetla preautoryzowane transakcje kredytowe z paginacją i opcjonalnymi filtrami.",
    targetWalletId: {
      label: "ID docelowego portfela",
      description: "Filtruj według ID docelowego portfela.",
    },
    orderId: {
      label: "ID zamówienia",
      description: "Filtruj według ID zamówienia.",
    },
    orgResourceId: {
      label: "ID zasobu organizacji",
      description: "Filtruj według ID zasobu organizacji.",
    },
    page: {
      label: "Strona",
      description: "Numer strony (zaczyna się od 0).",
    },
    pageSize: {
      label: "Rozmiar strony",
      description: "Liczba wyników na stronie.",
    },
    response: {
      id: "ID",
      orderId: "ID zamówienia",
      ordinal: "Numer porządkowy",
      authorizedBy: "Autoryzowane przez",
      targetWalletId: "ID docelowego portfela",
      amount: "Kwota",
      sourceOrgResourceId: "ID zasobu organizacji źródłowej",
      sourceWalletId: "ID portfela źródłowego",
      description: "Opis",
      transactionSubjectType: "Typ podmiotu",
      transactionSubjectRef: "Referencja podmiotu",
      transactionSubjectQuantity: "Ilość podmiotu",
      executionMinTime: "Najwcześniejsze wykonanie",
      executionMaxTime: "Najpóźniejsze wykonanie",
      updatedAt: "Zaktualizowano",
      revokedBy: "Odwołane przez",
      executionMaxOrdinal: "Maks. numer porządkowy wykonania",
      state: "Stan",
      orgResourceId: "ID zasobu organizacji",
      expectedPaymentsToDate: "Oczekiwane płatności do daty",
      actualPaymentsReceived: "Faktycznie otrzymane płatności",
      nextPaymentDate: "Data następnej płatności",
      total: "Łącznie",
      currentPage: "Bieżąca strona",
      totalPages: "Łączna liczba stron",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie do Corvina było błędne.",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z API Corvina.",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Corvina odrzuciła klucz API.",
      },
      forbidden: {
        title: "Brak dostępu",
        description:
          "Brak uprawnień do wyświetlania preautoryzowanych transakcji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono zasobu.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina zgłosiła konflikt.",
      },
      server: {
        title: "Błąd serwera",
        description: "Corvina zwróciła wewnętrzny błąd serwera.",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd.",
      },
    },
    success: {
      title: "Transakcje załadowane",
      description: "Preautoryzowane transakcje pobrane pomyślnie.",
    },
    submitButton: {
      label: "Wyświetl transakcje",
      loadingText: "Ładowanie...",
    },
    widget: {
      back: "Wróć",
      title: "Preautoryzowane transakcje",
      noItemsFound: "Nie znaleziono transakcji.",
    },
  },
  post: {
    title: "Utwórz preautoryzowane transakcje (zbiorczo)",
    description:
      "Tworzy wiele preautoryzowanych transakcji kredytowych w jednym żądaniu.",
    orderId: {
      label: "ID zamówienia",
      description: "Unikalny identyfikator zamówienia.",
    },
    targetWalletId: {
      label: "ID docelowego portfela",
      description: "ID portfela, który otrzyma kredyt.",
    },
    amount: { label: "Kwota", description: "Kwota kredytu." },
    ordinal: {
      label: "Numer porządkowy",
      description: "Numer porządkowy wykonania.",
    },
    sourceWalletId: {
      label: "ID portfela źródłowego",
      description: "ID portfela finansującego transakcję.",
    },
    txDescription: { label: "Opis", description: "Dowolny opis transakcji." },
    transactionSubjectType: {
      label: "Typ podmiotu",
      description: "Typ podmiotu transakcji.",
    },
    transactionSubjectRef: {
      label: "Referencja podmiotu",
      description: "Identyfikator referencyjny podmiotu.",
    },
    transactionSubjectQuantity: {
      label: "Ilość podmiotu",
      description: "Ilość powiązana z podmiotem.",
    },
    executionMinTime: {
      label: "Najwcześniejszy czas wykonania",
      description: "Transakcja nie może zostać wykonana przed tą datą.",
    },
    executionMaxTime: {
      label: "Najpóźniejszy czas wykonania",
      description: "Transakcja musi zostać wykonana przed tą datą.",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie do Corvina było błędne.",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z API Corvina.",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Corvina odrzuciła klucz API.",
      },
      forbidden: {
        title: "Brak dostępu",
        description:
          "Brak uprawnień do tworzenia preautoryzowanych transakcji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono zasobu.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina zgłosiła konflikt.",
      },
      server: {
        title: "Błąd serwera",
        description: "Corvina zwróciła wewnętrzny błąd serwera.",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd.",
      },
    },
    success: {
      title: "Transakcje utworzone",
      description: "Preautoryzowane transakcje utworzone pomyślnie.",
    },
    submitButton: { label: "Utwórz transakcje", loadingText: "Tworzenie..." },
    widget: { back: "Wróć" },
  },
  delete: {
    title: "Odwołaj preautoryzowane transakcje (zbiorczo)",
    description:
      "Odwołuje wiele preautoryzowanych transakcji kredytowych w jednym żądaniu.",
    transactionId: {
      label: "ID transakcji",
      description: "Numeryczny identyfikator transakcji do odwołania.",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie do Corvina było błędne.",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z API Corvina.",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Corvina odrzuciła klucz API.",
      },
      forbidden: {
        title: "Brak dostępu",
        description:
          "Brak uprawnień do odwołania preautoryzowanych transakcji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono zasobu.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina zgłosiła konflikt.",
      },
      server: {
        title: "Błąd serwera",
        description: "Corvina zwróciła wewnętrzny błąd serwera.",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd.",
      },
    },
    success: {
      title: "Transakcje odwołane",
      description: "Preautoryzowane transakcje odwołane pomyślnie.",
    },
    submitButton: {
      label: "Odwołaj transakcje",
      loadingText: "Odwoływanie...",
    },
    widget: { back: "Wróć" },
  },
};
