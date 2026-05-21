export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organizacje",
  },
  get: {
    title: "Lista organizacji Corvina",
    description:
      "Pobiera wszystkie organizacje klientów ze skonfigurowanego tenanta Corvina.",
    container: {
      title: "Organizacje Corvina",
      description:
        "Wszystkie organizacje klientów na skonfigurowanym tenancie Corvina.",
    },
    response: {
      title: "Organizacje",
      description: "Organizacje klientów zwrócone przez API Corvina.",
      organizations: {
        title: "Organizacje",
        description: "Każdy wiersz to jedna organizacja klienta.",
        id: "ID",
        name: "Nazwa",
        displayName: "Nazwa wyświetlana",
        enabled: "Aktywna",
        createdAt: "Utworzono",
      },
      total: "Łącznie",
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
        description:
          "Corvina odrzuciła dane konta serwisowego. Sprawdź CORVINA_CLIENT_ID i CORVINA_CLIENT_SECRET.",
      },
      forbidden: {
        title: "Zabronione",
        description:
          "Konto serwisowe nie ma wymaganego zakresu, aby listować organizacje.",
      },
      notFound: {
        title: "Nie znaleziono",
        description:
          "Corvina zwraca 404 dla skonfigurowanej ścieżki. Dostosuj CORVINA_ORGANIZATIONS_PATH.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina zgłosiła konflikt przy listowaniu organizacji.",
      },
      server: {
        title: "Błąd serwera",
        description: "API Corvina zwróciło wewnętrzny błąd serwera.",
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
      description: "Organizacje pobrane pomyślnie.",
    },
  },
};
