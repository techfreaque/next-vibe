export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    resources: "Zasoby",
  },
  get: {
    title: "Zasoby",
    description: "Wyświetla wszystkie dostępne typy zasobów platformy Corvina.",
    response: {
      items: {
        id: "ID",
        type: "Typ zasobu",
        maxActive: "Maks. aktywnych",
        consumable: "Zużywalny",
      },
    },
    widget: {
      title: "Zasoby",
      noItemsFound: "Nie znaleziono zasobów.",
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
        description: "Brak uprawnień do wyświetlania zasobów.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono zasobów.",
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
      title: "Zasoby pobrane",
      description: "Zasoby pobrane pomyślnie.",
    },
  },
};
