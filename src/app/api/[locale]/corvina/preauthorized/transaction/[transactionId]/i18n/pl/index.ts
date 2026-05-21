export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    preauthorized: "Transakcje preautoryzowane",
  },
  get: {
    title: "Pobierz preautoryzowaną transakcję",
    description:
      "Pobiera pojedynczą preautoryzowaną transakcję kredytową po ID.",
    transactionId: {
      label: "ID transakcji",
      description: "Numeryczny identyfikator preautoryzowanej transakcji.",
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
        description: "Brak uprawnień do odczytu preautoryzowanych transakcji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie istnieje transakcja o podanym ID.",
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
      title: "Transakcja załadowana",
      description: "Preautoryzowana transakcja pobrana pomyślnie.",
    },
    submitButton: {
      label: "Pobierz transakcję",
      loadingText: "Pobieranie...",
    },
    widget: {
      back: "Wróć",
    },
  },
  delete: {
    title: "Odwołaj preautoryzowaną transakcję",
    description: "Odwołuje preautoryzowaną transakcję kredytową po ID.",
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
        description: "Nie istnieje transakcja o podanym ID.",
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
      title: "Transakcja odwołana",
      description: "Preautoryzowana transakcja odwołana pomyślnie.",
    },
    submitButton: {
      label: "Odwołaj transakcję",
      loadingText: "Odwoływanie...",
    },
    widget: {
      back: "Wróć",
      revokedTransaction: "Odwołana transakcja",
    },
  },
};
