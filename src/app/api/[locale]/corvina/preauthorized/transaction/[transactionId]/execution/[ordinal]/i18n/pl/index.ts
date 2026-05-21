export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    preauthorized: "Transakcje preautoryzowane",
  },
  post: {
    title: "Wykonaj preautoryzowaną transakcję",
    description:
      "Wyzwala wykonanie preautoryzowanej transakcji dla danego numeru porządkowego.",
    transactionId: {
      label: "ID transakcji",
      description: "Numeryczny identyfikator preautoryzowanej transakcji.",
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
        description: "Brak uprawnień do wykonania tej transakcji.",
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
      title: "Wykonanie wyzwolone",
      description: "Zlecenie wykonania preautoryzowanej transakcji utworzone.",
    },
    submitButton: {
      label: "Wykonaj",
      loadingText: "Wykonywanie...",
    },
    widget: {
      back: "Wróć",
    },
  },
};
