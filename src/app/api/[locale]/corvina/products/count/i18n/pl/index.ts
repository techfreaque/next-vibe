export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    products: "Produkty",
  },
  get: {
    title: "Liczba produktów",
    description: "Pobiera liczbę licencji na produkt.",
    orgResourceId: {
      label: "ID zasobu organizacji",
      description: "Filtruj po ID zasobu organizacji.",
    },
    productId: {
      label: "ID produktu",
      description: "Filtruj po konkretnym ID produktu.",
    },
    page: {
      label: "Strona",
      description: "Numer strony (od 0).",
    },
    pageSize: {
      label: "Rozmiar strony",
      description: "Liczba wyników na stronę.",
    },
    response: {
      items: {
        productId: "ID produktu",
        totalCount: "Łączna liczba",
        activeCount: "Aktywne",
      },
      total: "Łącznie",
      totalPages: "Łączna liczba stron",
      currentPage: "Bieżąca strona",
    },
    widget: {
      title: "Liczba produktów",
      noItemsFound: "Nie znaleziono produktów.",
      back: "Wstecz",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie było nieprawidłowe.",
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
        description: "Brak uprawnień do wyświetlania liczby produktów.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono danych.",
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
      title: "Liczba produktów pobrana",
      description: "Liczba produktów pobrana pomyślnie.",
    },
  },
};
