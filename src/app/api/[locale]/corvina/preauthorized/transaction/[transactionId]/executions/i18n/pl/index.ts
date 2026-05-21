export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    preauthorized: "Transakcje preautoryzowane",
  },
  get: {
    title: "Lista zleceń wykonania",
    description:
      "Wyświetla wszystkie zlecenia wykonania preautoryzowanej transakcji.",
    transactionId: {
      label: "ID transakcji",
      description: "Numeryczny identyfikator preautoryzowanej transakcji.",
    },
    ordinal: {
      label: "Numer porządkowy",
      description: "Filtruj według numeru porządkowego wykonania.",
    },
    issuer: {
      label: "Wystawca",
      description: "Filtruj według wystawcy.",
    },
    response: {
      id: "ID",
      transactionId: "ID transakcji",
      preauthorizedCreditTransactionId:
        "ID preautoryzowanej transakcji kredytowej",
      executionTime: "Czas wykonania",
      ordinal: "Numer porządkowy",
      executionResult: "Wynik wykonania",
      errorCode: "Kod błędu",
      failureReason: "Przyczyna niepowodzenia",
      issuer: "Wystawca",
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
        description: "Brak uprawnień do wyświetlania zleceń wykonania.",
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
      title: "Zlecenia wykonania załadowane",
      description: "Zlecenia wykonania pobrane pomyślnie.",
    },
    submitButton: {
      label: "Wyświetl wykonania",
      loadingText: "Ładowanie...",
    },
    widget: {
      back: "Wróć",
      title: "Zlecenia wykonania",
      noItemsFound: "Nie znaleziono zleceń wykonania.",
    },
  },
};
