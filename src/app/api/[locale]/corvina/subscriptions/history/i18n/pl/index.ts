export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    subscriptions: "Subskrypcje",
  },
  get: {
    title: "Historia subskrypcji",
    description:
      "Pobiera historyczne dane użycia subskrypcji dla podanego zakresu dat.",
    fromDate: {
      label: "Data od",
      description: "Początek zakresu dat (np. 2024-01-01).",
    },
    toDate: {
      label: "Data do",
      description: "Koniec zakresu dat (np. 2024-12-31).",
    },
    orgResourceId: {
      label: "ID zasobu organizacji",
      description: "Filtruj wyniki po ID zasobu organizacji.",
    },
    resourceId: {
      label: "ID zasobu",
      description: "Filtruj wyniki po ID zasobu.",
    },
    page: {
      label: "Strona",
      description: "Numer strony (od zera).",
    },
    pageSize: {
      label: "Rozmiar strony",
      description: "Liczba wpisów historii na stronie.",
    },
    response: {
      total: "Łącznie",
      totalPages: "Stron łącznie",
      currentPage: "Bieżąca strona",
      items: {
        resourceType: "Typ zasobu",
        quantity: "Ilość",
        used: "Użyte",
        granted: "Przyznane",
        grantedUsed: "Przyznane użyte",
        licensed: "Licencjonowane",
        timestamp: "Znacznik czasu",
      },
    },
    widget: {
      title: "Historia subskrypcji",
      noItemsFound: "Nie znaleziono wpisów historii.",
      back: "Wstecz",
      fetch: "Pobierz historię",
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
        description: "Klucz API nie ma dostępu do historii subskrypcji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono historii dla podanych parametrów.",
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
      description: "Historia subskrypcji pobrana pomyślnie.",
    },
  },
};
