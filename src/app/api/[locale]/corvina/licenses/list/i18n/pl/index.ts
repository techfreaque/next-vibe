export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    licenses: "Licencje",
  },
  get: {
    title: "Lista licencji",
    description:
      "Pobiera wszystkie licencje zarejestrowane w instancji Corvina.",
    page: {
      label: "Strona",
      description: "Numer strony (od zera).",
    },
    pageSize: {
      label: "Rozmiar strony",
      description: "Liczba licencji na stronie.",
    },
    orgResourceId: {
      label: "ID zasobu organizacji",
      description: "Filtruj licencje po ID zasobu organizacji.",
    },
    response: {
      total: "Łącznie",
      totalPages: "Stron łącznie",
      currentPage: "Bieżąca strona",
      licenses: {
        licenseId: "ID licencji",
        productCode: "Kod produktu",
        productLabel: "Produkt",
        productType: "Typ",
        productTrial: "Wersja próbna",
        creationDate: "Data utworzenia",
        expirationDate: "Data wygaśnięcia",
        activationDate: "Data aktywacji",
        used: "Używana",
        code: "Kod",
        externalRef: "Zewnętrzny identyfikator",
        price: "Cena",
        currency: "Waluta",
        autorenew: "Automatyczne odnawianie",
        orgResourceId: "ID zasobu organizacji",
      },
    },
    widget: {
      title: "Licencje",
      noLicensesFound: "Nie znaleziono licencji.",
      back: "Wstecz",
      refresh: "Odśwież",
      prevPage: "Poprzednia",
      nextPage: "Następna",
      nav: {
        orgs: "Organizacje",
        create: "Nowa licencja",
        trial: "Licencja próbna",
      },
      compact: {
        exp: "wyg.:",
        autorenew: "auto-odnow.:",
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
        description: "Klucz API nie ma uprawnień do listy licencji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono licencji dla podanych parametrów.",
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
      description: "Licencje pobrane pomyślnie.",
    },
  },
};
