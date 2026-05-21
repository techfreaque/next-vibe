export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    limits: "Limity",
  },
  get: {
    title: "Lista limitów zasobów",
    description: "Pobiera wszystkie limity zasobów instancji Corvina.",
    page: {
      label: "Strona",
      description: "Numer strony (od zera).",
    },
    pageSize: {
      label: "Rozmiar strony",
      description: "Liczba limitów na stronie.",
    },
    status: {
      label: "Status",
      description: "Filtruj po statusie limitu — VALID lub ALL.",
    },
    orgResourceId: {
      label: "ID zasobu organizacji",
      description: "Filtruj limity po ID zasobu organizacji.",
    },
    response: {
      total: "Łącznie",
      totalPages: "Stron łącznie",
      currentPage: "Bieżąca strona",
      limits: {
        resourceType: "Typ zasobu",
        quantity: "Ilość",
        used: "Użyte",
        targetOrganization: "Organizacja docelowa",
        grantingOrganization: "Organizacja przyznająca",
        orgResourceId: "ID zasobu organizacji",
      },
    },
    widget: {
      title: "Limity zasobów",
      noItemsFound: "Nie znaleziono limitów zasobów.",
      back: "Wstecz",
      refresh: "Odśwież",
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
        description: "Klucz API nie ma uprawnień do listy limitów zasobów.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono limitów zasobów dla podanych parametrów.",
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
      description: "Limity zasobów pobrane pomyślnie.",
    },
  },
  post: {
    title: "Utwórz limit zasobu",
    description: "Tworzy nowy limit zasobu dla instancji Corvina.",
    resourceType: {
      label: "Typ zasobu",
      description: "Typ zasobu do ograniczenia (np. DEVICE).",
    },
    quantity: {
      label: "Ilość",
      description: "Maksymalna ilość zasobu.",
    },
    orgResourceId: {
      label: "ID zasobu organizacji",
      description: "ID zasobu organizacji powiązane z tym limitem.",
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
        description: "Klucz API nie ma uprawnień do tworzenia limitów zasobów.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono organizacji docelowej.",
      },
      conflict: {
        title: "Konflikt",
        description: "Limit zasobu dla tego typu już istnieje.",
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
      description: "Limit zasobu utworzony pomyślnie.",
    },
    submitButton: {
      label: "Utwórz limit",
      loadingText: "Tworzenie...",
    },
  },
  put: {
    title: "Zaktualizuj limit zasobu",
    description: "Aktualizuje istniejący limit zasobu instancji Corvina.",
    resourceType: {
      label: "Typ zasobu",
      description: "Typ zasobu do aktualizacji.",
    },
    quantity: {
      label: "Ilość",
      description: "Nowa maksymalna ilość zasobu.",
    },
    orgResourceId: {
      label: "ID zasobu organizacji",
      description:
        "ID zasobu organizacji identyfikujące limit do aktualizacji.",
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
          "Klucz API nie ma uprawnień do aktualizacji limitów zasobów.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono limitu zasobu dla podanych parametrów.",
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
      title: "Zaktualizowano",
      description: "Limit zasobu zaktualizowany pomyślnie.",
    },
    submitButton: {
      label: "Zapisz zmiany",
      loadingText: "Zapisywanie...",
    },
  },
};
