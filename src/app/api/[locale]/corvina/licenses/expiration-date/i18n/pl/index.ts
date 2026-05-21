export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    licenses: "Licencje",
  },
  get: {
    title: "Data wygaśnięcia licencji",
    description:
      "Zwraca datę wygaśnięcia (epoch ms) dla podanego kodu licencji.",
    licenseCode: {
      label: "Kod licencji",
      description:
        "Kod licencji, dla którego sprawdzana jest data wygaśnięcia (np. XXXX-YYYY-ZZZZ-AAAA).",
      placeholder: "XXXX-YYYY-ZZZZ-AAAA",
    },
    response: {
      expirationDate: "Data wygaśnięcia",
    },
    widget: {
      title: "Sprawdź datę wygaśnięcia",
      back: "Wróć",
      result: "Wygaśnięcie",
      noResult: "Wpisz kod licencji, aby sprawdzić datę wygaśnięcia.",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Format kodu licencji jest nieprawidłowy.",
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
        description: "Brak uprawnień do sprawdzenia daty wygaśnięcia licencji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono licencji o podanym kodzie.",
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
      title: "Data wygaśnięcia pobrana",
      description: "Data wygaśnięcia licencji została pomyślnie zwrócona.",
    },
  },
};
