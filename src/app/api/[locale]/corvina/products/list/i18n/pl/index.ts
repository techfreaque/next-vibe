export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    products: "Produkty",
  },
  get: {
    title: "Lista produktów",
    description: "Pobiera wszystkie produkty dostępne na platformie Corvina.",
    page: {
      label: "Strona",
      description: "Numer strony (od zera).",
    },
    pageSize: {
      label: "Rozmiar strony",
      description: "Liczba produktów na stronie.",
    },
    orgResourceId: {
      label: "ID zasobu organizacji",
      description: "Filtruj produkty po ID zasobu organizacji.",
    },
    response: {
      total: "Łącznie",
      totalPages: "Stron łącznie",
      currentPage: "Bieżąca strona",
      products: {
        id: "ID",
        code: "Kod",
        type: "Typ",
        label: "Nazwa",
        dealer: "Dealer",
        trial: "Wersja próbna",
        creationDate: "Data utworzenia",
        lastModified: "Ostatnia zmiana",
        autorenewDefault: "Domyślne auto-odnawianie",
        orgResourceId: "ID zasobu organizacji",
      },
    },
    widget: {
      title: "Produkty",
      noProductsFound: "Nie znaleziono produktów.",
      back: "Wstecz",
      compact: {
        type: "typ:",
        org: "org.:",
        separator: "·",
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
        description: "Corvina odrzuciła klucz API.",
      },
      forbidden: {
        title: "Zabronione",
        description: "Klucz API nie ma uprawnień do listy produktów.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono produktów dla podanych parametrów.",
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
      description: "Produkty pobrane pomyślnie.",
    },
  },
};
