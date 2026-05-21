export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    preauthorized: "Transakcje preautoryzowane",
  },
  post: {
    title: "Zbiorcze wykonanie preautoryzowanych transakcji",
    description:
      "Wyzwala wykonanie wielu preautoryzowanych transakcji w jednym żądaniu.",
    preauthorizedCreditTransactionId: {
      label: "ID transakcji",
      description: "ID preautoryzowanej transakcji kredytowej do wykonania.",
    },
    ordinal: {
      label: "Numer porządkowy",
      description: "Numer porządkowy wykonania do wyzwolenia.",
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
        description: "Brak uprawnień do zbiorczego wykonania.",
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
      title: "Wykonania wyzwolone",
      description: "Zbiorcze zlecenia wykonania utworzone pomyślnie.",
    },
    submitButton: {
      label: "Wyzwól wykonania",
      loadingText: "Wyzwalanie...",
    },
    widget: {
      back: "Wróć",
      title: "Wyniki wykonania",
      noItemsFound: "Nie zwrócono zleceń wykonania.",
    },
  },
};
