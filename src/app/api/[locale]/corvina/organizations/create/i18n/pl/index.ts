export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organizacje",
  },
  post: {
    title: "Utwórz organizację Corvina",
    description: "Tworzy nową organizację klienta w Corvina.",
    container: {
      title: "Nowa organizacja",
      description: "Dodaj organizację klienta do tenanta Corvina.",
    },
    name: {
      label: "Nazwa",
      description:
        "Stały identyfikator używany w adresach URL i API. Małe litery, bez spacji.",
      placeholder: "acme",
    },
    displayName: {
      label: "Nazwa wyświetlana",
      description: "Czytelna nazwa pokazywana w Corvina.",
      placeholder: "Acme Sp. z o.o.",
    },
    enabled: {
      label: "Aktywna",
      description: "Czy organizacja jest aktywna po utworzeniu.",
    },
    response: {
      title: "Utworzona organizacja",
      description: "Nowa organizacja zwrócona przez Corvina.",
      organization: {
        title: "Szczegóły",
        description: "Główne pola utworzonej organizacji.",
        id: "ID",
        name: "Nazwa",
        displayName: "Nazwa wyświetlana",
        enabled: "Aktywna",
        createdAt: "Utworzono",
      },
    },
    submitButton: {
      label: "Utwórz organizację",
      loadingText: "Tworzenie…",
    },
    backButton: {
      label: "Wstecz",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe dane",
        description: "Corvina odrzuciła ładunek tworzenia.",
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
          "Konto serwisowe nie ma zakresu do tworzenia organizacji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Skonfigurowana ścieżka zwróciła 404.",
      },
      conflict: {
        title: "Konflikt",
        description: "Organizacja o tej nazwie już istnieje.",
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
      title: "Utworzono",
      description: "Organizacja utworzona pomyślnie.",
    },
  },
};
