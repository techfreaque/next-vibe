export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    licenses: "Licencje",
  },
  post: {
    title: "Aktywuj licencję",
    description: "Aktywuje licencję na podstawie jej kodu.",
    licenseCode: {
      label: "Kod licencji",
      description: "Kod aktywacyjny licencji.",
      placeholder: "XXXX-YYYY-ZZZZ",
    },
    orgResourceId: {
      label: "ID zasobu org.",
      description: "Organizacja docelowa dla aktywacji.",
      placeholder: "exorde.connex.example",
    },
    submitButton: {
      label: "Aktywuj",
      loadingText: "Aktywowanie...",
    },
    response: {
      licenseId: "ID licencji",
      productCode: "Kod produktu",
      productLabel: "Produkt",
      productType: "Typ",
      productTrial: "Wersja próbna",
      creationDate: "Utworzono",
      expirationDate: "Wygasa",
      activationDate: "Aktywowano",
      used: "Używana",
      code: "Kod",
      orgResourceId: "Org.",
      externalRef: "Zewnętrzna ref.",
      price: "Cena",
      currency: "Waluta",
      autorenew: "Automatyczne odnawianie",
    },
    widget: {
      title: "Aktywuj licencję",
      back: "Wstecz",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie aktywacji jest nieprawidłowe.",
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
        description: "Klucz API nie ma uprawnień do aktywacji licencji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Podany kod licencji nie został znaleziony.",
      },
      conflict: {
        title: "Konflikt",
        description: "Ta licencja została już aktywowana.",
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
      title: "Licencja aktywowana",
      description: "Licencja została pomyślnie aktywowana.",
    },
  },
};
