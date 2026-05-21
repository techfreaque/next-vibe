export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    subscriptions: "Subskrypcje",
  },
  post: {
    title: "Zagregowane użycie według organizacji",
    description:
      "Zwraca zagregowane użycie zasobów pogrupowane według podanych organizacji.",
    organizations: {
      label: "Organizacje",
      description:
        "Lista identyfikatorów zasobów organizacji oddzielona przecinkami.",
      placeholder: "org1.example,org2.example",
    },
    response: {
      items: {
        org: "Organizacja",
        resourceType: "Typ zasobu",
        quantity: "Ilość",
        used: "Użyte",
        licensed: "Licencjonowane",
        granted: "Przyznane",
        grantedUsed: "Przyznane użyte",
        lastUpdateFreeQuantity: "Ostatnia aktualizacja wolnej ilości",
      },
    },
    widget: {
      title: "Zagregowane użycie według organizacji",
      noItemsFound: "Nie znaleziono danych.",
      back: "Wstecz",
    },
    submitButton: {
      label: "Pobierz",
      loadingText: "Ładowanie...",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie jest nieprawidłowe.",
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
        description: "Brak uprawnień.",
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
      title: "Dane pobrane",
      description: "Zagregowane użycie według organizacji pobrane pomyślnie.",
    },
  },
};
