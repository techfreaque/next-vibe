export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organizacje",
  },
  get: {
    title: "Pobierz organizację Corvina",
    description: "Pobiera pojedynczą organizację klienta po identyfikatorze.",
    container: {
      title: "Organizacja",
      description: "Szczegóły jednej organizacji klienta.",
    },
    id: {
      label: "ID organizacji",
      description: "Identyfikator organizacji w Corvina.",
    },
    response: {
      title: "Organizacja",
      description: "Organizacja zwrócona przez Corvina.",
      organization: {
        title: "Szczegóły",
        description: "Główne pola organizacji.",
        id: "ID",
        name: "Nazwa",
        displayName: "Nazwa wyświetlana",
        enabled: "Aktywna",
        createdAt: "Utworzono",
      },
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
        description: "Corvina odrzuciła dane konta serwisowego.",
      },
      forbidden: {
        title: "Zabronione",
        description:
          "Konto serwisowe nie ma zakresu do odczytu tej organizacji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Organizacja o tym ID nie istnieje.",
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
      description: "Organizacja pobrana pomyślnie.",
    },
  },
  patch: {
    title: "Aktualizuj organizację Corvina",
    description:
      "Zmienia nazwę organizacji Corvina. Włączanie/wyłączanie nie jest jeszcze podpięte — potwierdź najpierw właściwą operację API.",
    container: {
      title: "Aktualizuj organizację",
      description: "Edytuj nazwę wyświetlaną organizacji.",
    },
    id: {
      label: "ID organizacji",
      description: "Identyfikator aktualizowanej organizacji.",
    },
    displayName: {
      label: "Nazwa wyświetlana",
      description: "Czytelna nazwa pokazywana w Corvina.",
      placeholder: "Acme Sp. z o.o.",
    },
    response: {
      title: "Zaktualizowana organizacja",
      description: "Organizacja po aktualizacji.",
      organization: {
        title: "Szczegóły",
        description: "Pola po aktualizacji.",
        id: "ID",
        name: "Nazwa",
        displayName: "Nazwa wyświetlana",
        enabled: "Aktywna",
        createdAt: "Utworzono",
      },
    },
    submitButton: {
      label: "Zapisz zmiany",
      loadingText: "Zapisywanie…",
    },
    backButton: {
      label: "Wstecz",
    },
    errors: {
      validation: {
        title: "Nieprawidłowa aktualizacja",
        description: "Corvina odrzuciła ładunek aktualizacji.",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z API Corvina.",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Corvina odrzuciła dane konta serwisowego.",
      },
      forbidden: {
        title: "Zabronione",
        description:
          "Konto serwisowe nie ma zakresu do aktualizacji tej organizacji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Organizacja o tym ID nie istnieje.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina zgłosiła konflikt dla tej aktualizacji.",
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
      title: "Zapisano",
      description: "Organizacja zaktualizowana pomyślnie.",
    },
  },
  delete: {
    title: "Usuń organizację Corvina",
    description:
      "Usuwa organizację z Corvina. Operacja nieodwracalna — potwierdź przed wykonaniem.",
    container: {
      title: "Usuń organizację",
      description: "Trwale usuń tę organizację.",
    },
    id: {
      label: "ID organizacji",
      description: "Identyfikator organizacji do usunięcia.",
    },
    response: {
      title: "Usunięcie",
      description: "Wynik wywołania usunięcia.",
      deleted: "Usunięto",
      id: "ID",
    },
    submitButton: {
      label: "Usuń organizację",
      loadingText: "Usuwanie…",
    },
    backButton: {
      label: "Wstecz",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Corvina odrzuciła żądanie usunięcia.",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z API Corvina.",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Corvina odrzuciła dane konta serwisowego.",
      },
      forbidden: {
        title: "Zabronione",
        description:
          "Konto serwisowe nie ma zakresu do usuwania organizacji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Organizacja o tym ID nie istnieje.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina zgłosiła konflikt dla tego usunięcia.",
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
      title: "Usunięto",
      description: "Organizacja usunięta pomyślnie.",
    },
  },
};
