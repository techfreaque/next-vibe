export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    subscriptions: "Subskrypcje",
  },
  get: {
    title: "Zagregowane subskrypcje",
    description:
      "Pobiera zagregowane dane użycia subskrypcji dla wszystkich zasobów instancji.",
    orgResourceId: {
      label: "ID zasobu organizacji",
      description: "Filtruj zagregowane dane po ID zasobu organizacji.",
    },
    response: {
      items: {
        resourceType: "Typ zasobu",
        org: "Organizacja",
        quantity: "Ilość",
        used: "Użyte",
        licensed: "Licencjonowane",
        granted: "Przyznane",
        grantedUsed: "Przyznane użyte",
        lastUpdateFreeQuantity: "Ostatnia aktualizacja wolnej ilości",
      },
    },
    widget: {
      title: "Zagregowane subskrypcje",
      noItemsFound: "Nie znaleziono zagregowanych danych.",
      back: "Wstecz",
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
        description: "Klucz API nie ma dostępu do zagregowanych subskrypcji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description:
          "Nie znaleziono zagregowanych danych dla podanych parametrów.",
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
      description: "Zagregowane subskrypcje pobrane pomyślnie.",
    },
  },
};
