import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Pobierz ceny modeli OpenRouter",
    description:
      "Pobierz ceny modeli i metadane z API OpenRouter i zaktualizuj models.ts",
    form: {
      title: "Ceny modeli OpenRouter",
    },
    response: {
      summary: {
        title: "Podsumowanie aktualizacji",
        totalModels: "Wszystkie modele",
        modelsFound: "Modele znalezione",
        modelsUpdated: "Modele zaktualizowane",
        fileUpdated: "Plik zaktualizowany",
      },
      models: {
        title: "Zaktualizowane modele",
        model: {
          id: "ID modelu",
          name: "Nazwa modelu",
          contextLength: "Długość kontekstu",
          inputTokenCost: "Koszt wejściowy ($/1M tokenów)",
          outputTokenCost: "Koszt wyjściowy ($/1M tokenów)",
        },
      },
      missingOpenRouterModels: {
        title: "Brakujące modele OpenRouter",
        model: {
          modelId: "ID modelu",
          openRouterId: "ID OpenRouter",
          suggestion: "Sugestia",
        },
      },
      nonOpenRouterModels: {
        title: "Modele spoza OpenRouter",
        model: {
          modelId: "ID modelu",
          provider: "Dostawca",
        },
      },
    },
    errors: {
      server: {
        title: "Błąd serwera",
        description: "Nie udało się pobrać danych z API OpenRouter",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z API OpenRouter",
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
        title: "Brak autoryzacji",
        description: "Nie jesteś upoważniony do wykonania tej akcji",
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
      description: "Pomyślnie pobrano i zaktualizowano ceny modeli",
    },
  },
  tags: {
    models: "Modele",
  },
} as const;
