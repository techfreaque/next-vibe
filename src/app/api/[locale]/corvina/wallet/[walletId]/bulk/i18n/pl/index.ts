export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    wallet: "Portfel",
  },
  post: {
    title: "Masowy transfer kredytów",
    description:
      "Przenosi kredyty z subskrypcji do portfela. Wykonuje jeden transfer jako żądanie zbiorcze.",
    targetWalletId: {
      label: "ID portfela docelowego",
      description: "ID portfela, który ma otrzymać kredyty.",
      placeholder: "b-12345-6789-abcde",
    },
    orderId: {
      label: "ID zamówienia",
      description: "Unikalny identyfikator zamówienia dla tej transakcji.",
      placeholder: "order-12345",
    },
    amount: {
      label: "Kwota",
      description: "Liczba kredytów do przeniesienia.",
      placeholder: "100",
    },
    ordinal: {
      label: "Numer kolejny",
      description: "Pozycja tej transakcji w zamówieniu (od 0).",
      placeholder: "0",
    },
    sourceWalletId: {
      label: "ID portfela źródłowego",
      description:
        "ID portfela źródłowego (przy transferze między portfelami).",
      placeholder: "a-12345-6789-abcde",
    },
    transferDescription: {
      label: "Opis",
      description: "Czytelny opis transferu.",
      placeholder: "Płatność za usługi",
    },
    transactionSubjectType: {
      label: "Typ przedmiotu",
      description: "Typ przedmiotu transakcji (np. SERVICE).",
      placeholder: "SERVICE",
    },
    transactionSubjectRef: {
      label: "Referencja przedmiotu",
      description: "Identyfikator referencyjny przedmiotu transakcji.",
      placeholder: "service-12345",
    },
    transactionSubjectQuantity: {
      label: "Ilość przedmiotu",
      description: "Ilość powiązana z przedmiotem transakcji.",
      placeholder: "1",
    },
    response: {
      items: {
        id: "ID transakcji",
        executionResult: "Wynik",
        failureReason: "Powód błędu",
        sourceWalletId: "Portfel źródłowy",
        targetWalletId: "Portfel docelowy",
        amount: "Kwota",
        createdAt: "Utworzono",
        orderId: "ID zamówienia",
        ordinal: "Numer kolejny",
        orgResourceId: "ID zasobu organizacji",
      },
    },
    widget: {
      title: "Masowy transfer kredytów",
      back: "Wstecz",
      noItems: "Brak zwróconych transakcji.",
    },
    submitButton: {
      label: "Przenieś kredyty",
      loadingText: "Przenoszenie...",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Sprawdź ID portfela docelowego, ID zamówienia i kwotę.",
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
        description: "Brak uprawnień do przenoszenia kredytów.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono portfela.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina zgłosiła konflikt.",
      },
      server: {
        title: "Błąd serwera",
        description: "Corvina zwróciła błąd wewnętrzny serwera.",
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
      title: "Kredyty przeniesione",
      description: "Masowy transfer kredytów zakończony pomyślnie.",
    },
  },
};
