export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    subscriptions: "Subskrypcje",
  },
  get: {
    title: "Lista subskrypcji",
    description: "Pobiera wszystkie subskrypcje instancji Corvina.",
    page: {
      label: "Strona",
      description: "Numer strony (od zera).",
    },
    pageSize: {
      label: "Rozmiar strony",
      description: "Liczba subskrypcji na stronie.",
    },
    status: {
      label: "Status",
      description: "Filtruj po statusie subskrypcji — VALID lub ALL.",
    },
    orgResourceId: {
      label: "ID zasobu organizacji",
      description: "Filtruj subskrypcje po ID zasobu organizacji.",
    },
    response: {
      total: "Łącznie",
      totalPages: "Stron łącznie",
      currentPage: "Bieżąca strona",
      subscriptions: {
        resourceType: "Typ zasobu",
        quantity: "Ilość",
        used: "Użyte",
        expirationDate: "Data wygaśnięcia",
        creationDate: "Data utworzenia",
        expired: "Wygasła",
        productCode: "Kod produktu",
        productLabel: "Produkt",
        licenseId: "ID licencji",
        productId: "ID produktu",
      },
    },
    widget: {
      title: "Subskrypcje",
      noItemsFound: "Nie znaleziono subskrypcji.",
      back: "Wstecz",
      refresh: "Odśwież",
      expired: "Wygasła",
      expiringSoon: "Wygasa wkrótce",
      prevPage: "Poprzednia",
      nextPage: "Następna",
      nav: {
        orgs: "Organizacje",
        aggregated: "Zagregowane",
        summary: "Podsumowanie",
        history: "Historia",
      },
      compact: {
        exp: "wyg.:",
        qty: "il.:",
        used: "użyte:",
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
        description: "Klucz API nie ma uprawnień do listy subskrypcji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono subskrypcji dla podanych parametrów.",
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
      description: "Subskrypcje pobrane pomyślnie.",
    },
  },
};
