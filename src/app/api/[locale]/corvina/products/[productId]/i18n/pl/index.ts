export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    products: "Produkty",
  },
  get: {
    title: "Pobierz produkt",
    description: "Pobiera pojedynczy produkt na podstawie jego ID.",
    productId: {
      label: "ID produktu",
      description: "Numeryczne ID produktu.",
    },
    response: {
      id: "ID produktu",
      code: "Kod",
      type: "Typ",
      label: "Nazwa",
      dealer: "Sprzedawca",
      trial: "Wersja próbna",
      creationDate: "Utworzono",
      lastModified: "Zaktualizowano",
      autorenewDefault: "Domyślne auto-odnowienie",
      orgResourceId: "ID zasobu org.",
    },
    widget: {
      title: "Szczegóły produktu",
      back: "Wstecz",
      noData: "Produkt nie znaleziony.",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "ID produktu jest nieprawidłowe.",
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
        description: "Brak uprawnień do tego produktu.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Produkt o podanym ID nie istnieje.",
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
      title: "Produkt pobrany",
      description: "Produkt został pomyślnie pobrany.",
    },
  },
};
