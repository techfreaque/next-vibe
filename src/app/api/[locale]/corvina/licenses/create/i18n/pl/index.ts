export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    licenses: "Licencje",
  },
  post: {
    title: "Utwórz licencję",
    description: "Tworzy nową licencję na platformie Corvina.",
    productId: {
      label: "ID produktu",
      description: "Numeryczne ID produktu Corvina do licencjonowania.",
      placeholder: "42",
    },
    autorenew: {
      label: "Automatyczne odnawianie",
      description: "Automatycznie odnawiaj tę licencję przed jej wygaśnięciem.",
    },
    expirationDate: {
      label: "Data wygaśnięcia",
      description:
        "Termin ważności w milisekundach epoch. Pozostaw puste, by licencja nie wygasała.",
      placeholder: "1800000000000",
    },
    price: {
      label: "Cena",
      description: "Cena zakupu tej licencji.",
      placeholder: "99.00",
    },
    currency: {
      label: "Waluta",
      description: "Kod waluty ISO 4217 (np. EUR, USD).",
      placeholder: "EUR",
    },
    externalRef: {
      label: "Zewnętrzna referencja",
      description:
        "Opcjonalny identyfikator zewnętrzny do śledzenia między systemami.",
      placeholder: "zamowienie-12345",
    },
    targetOrgResourceId: {
      label: "ID zasobu organizacji docelowej",
      description:
        "Przypisz licencję bezpośrednio do konkretnego zasobu organizacji.",
      placeholder: "exorde.connex.connectika",
    },
    submitButton: {
      label: "Utwórz licencję",
      loadingText: "Tworzenie...",
    },
    response: {
      licenseId: "ID licencji",
      productCode: "Kod produktu",
      productLabel: "Produkt",
      productType: "Typ",
      productTrial: "Wersja próbna",
      creationDate: "Utworzono",
      activationDate: "Aktywowano",
      used: "W użyciu",
      code: "Kod licencji",
      orgResourceId: "ID zasobu org.",
    },
    widget: {
      title: "Utwórz licencję",
      back: "Wstecz",
      resultTitle: "Licencja utworzona",
      noData: "Brak danych licencji",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie utworzenia licencji jest nieprawidłowe.",
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
        description: "Klucz API nie ma uprawnień do tworzenia licencji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany produkt nie został znaleziony.",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt licencji.",
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
      title: "Licencja utworzona",
      description: "Licencja została pomyślnie utworzona.",
    },
  },
};
