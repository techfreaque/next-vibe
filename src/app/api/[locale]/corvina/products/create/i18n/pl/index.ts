export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    products: "Produkty",
  },
  post: {
    title: "Utwórz produkt",
    description: "Tworzy nowy produkt na platformie Corvina.",
    code: {
      label: "Kod produktu",
      description: "Unikalny kod identyfikujący ten produkt.",
      placeholder: "CORVINA_STANDARD",
    },
    type: {
      label: "Typ produktu",
      description: "np. STANDARD",
      placeholder: "STANDARD",
    },
    productLabel: {
      label: "Etykieta",
      description: "Czytelna nazwa tego produktu.",
      placeholder: "Corvina Standard",
    },
    trial: {
      label: "Wersja próbna",
      description: "Oznacz ten produkt jako ofertę próbną.",
    },
    autorenewDefaultValueForNewLicenses: {
      label: "Domyślne automatyczne odnawianie",
      description:
        "Domyślne ustawienie automatycznego odnawiania dla nowych licencji tego produktu.",
    },
    orgResourceId: {
      label: "ID zasobu organizacji",
      description: "Przypisz ten produkt do konkretnego zasobu organizacji.",
      placeholder: "exorde.connex.connectika",
    },
    submitButton: {
      label: "Utwórz produkt",
      loadingText: "Tworzenie...",
    },
    response: {
      id: "ID produktu",
      code: "Kod",
      type: "Typ",
      productLabel: "Etykieta",
      dealer: "Dealer",
      trial: "Wersja próbna",
      creationDate: "Utworzono",
      lastModified: "Ostatnia zmiana",
      autorenewDefaultValueForNewLicenses: "Domyślne auto-odnawianie",
      orgResourceId: "ID zasobu org.",
    },
    widget: {
      title: "Utwórz produkt",
      back: "Wstecz",
      resultTitle: "Produkt utworzony",
      noData: "Brak danych produktu",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie utworzenia produktu jest nieprawidłowe.",
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
        description: "Klucz API nie ma uprawnień do tworzenia produktów.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony.",
      },
      conflict: {
        title: "Konflikt",
        description: "Produkt z tym kodem już istnieje.",
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
      title: "Produkt utworzony",
      description: "Produkt został pomyślnie utworzony.",
    },
  },
};
