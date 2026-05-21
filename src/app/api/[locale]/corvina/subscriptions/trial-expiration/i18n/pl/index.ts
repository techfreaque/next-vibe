export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    subscriptions: "Subskrypcje",
  },
  get: {
    title: "Wygaśnięcie okresu próbnego",
    description:
      "Zwraca datę wygaśnięcia okresu próbnego dla bieżącego najemcy.",
    orgResourceId: {
      label: "ID zasobu organizacji",
      description: "Ogranicz zapytanie do konkretnej organizacji.",
    },
    response: {
      expirationDate: "Data wygaśnięcia okresu próbnego",
    },
    widget: {
      title: "Wygaśnięcie okresu próbnego",
      back: "Wstecz",
      noExpiration: "Nie ustawiono daty wygaśnięcia okresu próbnego.",
      expiringSoon: "Okres próbny wygasa wkrótce",
      expired: "Okres próbny wygasł",
      expiresOn: "Wygasa",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie do Corvina było nieprawidłowe.",
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
        title: "Zabronione",
        description:
          "Klucz API nie ma dostępu do danych o wygaśnięciu okresu próbnego.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono danych o wygaśnięciu okresu próbnego.",
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
        description: "Występują niezapisane zmiany.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd.",
      },
    },
    success: {
      title: "Sukces",
      description: "Data wygaśnięcia okresu próbnego pobrana pomyślnie.",
    },
  },
};
