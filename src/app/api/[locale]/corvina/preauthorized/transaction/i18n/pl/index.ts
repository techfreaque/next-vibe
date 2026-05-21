export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    preauthorized: "Transakcje preautoryzowane",
  },
  post: {
    title: "Utwórz preautoryzowaną transakcję",
    description:
      "Tworzy pojedynczą preautoryzowaną transakcję kredytową w Corvina.",
    orderId: {
      label: "ID zamówienia",
      description: "Unikalny identyfikator zamówienia.",
    },
    targetWalletId: {
      label: "ID docelowego portfela",
      description: "ID portfela, który otrzyma kredyt.",
    },
    amount: {
      label: "Kwota",
      description: "Kwota kredytu dla tej transakcji.",
    },
    ordinal: {
      label: "Numer porządkowy",
      description: "Numer porządkowy wykonania transakcji.",
    },
    sourceWalletId: {
      label: "ID portfela źródłowego",
      description: "ID portfela finansującego transakcję.",
    },
    txDescription: {
      label: "Opis",
      description: "Dowolny opis tej transakcji.",
    },
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
      title: "Transakcja utworzona",
      description: "Preautoryzowana transakcja kredytowa utworzona pomyślnie.",
    },
    submitButton: {
      label: "Utwórz transakcję",
      loadingText: "Tworzenie...",
    },
    widget: {
      back: "Wróć",
    },
  },
};
