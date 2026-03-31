export const translations = {
  category: "Agent",

  get: {
    title: "Aktualizuj wszystkie ceny modeli",
    description:
      "Pobierz aktualne ceny dla wszystkich modeli z każdego API dostawcy (OpenRouter, Replicate itp.) i zaktualizuj models.ts",
    form: {
      title: "Aktualizator cen modeli",
    },
    response: {
      summary: {
        title: "Podsumowanie aktualizacji",
        totalProviders: "Uruchomione dostawcy",
        totalModels: "Łącznie modeli",
        modelsUpdated: "Zaktualizowane modele",
        fileUpdated: "Plik zaktualizowany",
      },
      updates: {
        title: "Zaktualizowane modele",
        model: {
          modelId: "ID modelu",
          name: "Nazwa modelu",
          provider: "Dostawca",
          field: "Pole ceny",
          value: "Nowa wartość",
          source: "Źródło ceny",
        },
      },
      failures: {
        title: "Nieudane pobrania cen",
        model: {
          modelId: "ID modelu",
          provider: "Dostawca",
          reason: "Powód",
        },
      },
      providerResults: {
        title: "Wyniki dostawców",
        model: {
          provider: "Dostawca",
          modelsFound: "Znalezione modele",
          modelsUpdated: "Zaktualizowane",
          error: "Błąd",
        },
      },
    },
    errors: {
      server: {
        title: "Błąd serwera",
        description: "Nie udało się zaktualizować cen modeli",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z API cen",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do wykonania tej akcji",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp do tego zasobu jest zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas przetwarzania żądania",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Sukces",
      description: "Pomyślnie pobrano i zaktualizowano wszystkie ceny modeli",
    },
  },
  tags: {
    models: "Modele",
  },
  updateAllModelPrices: {
    name: "Aktualizuj wszystkie ceny modeli",
    description:
      "Pobiera aktualne ceny dla wszystkich modeli z każdego API dostawcy i aktualizuje models.ts",
  },
};
