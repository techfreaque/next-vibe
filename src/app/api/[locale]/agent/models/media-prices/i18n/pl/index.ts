import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",

  get: {
    title: "Pobierz ceny modeli medialnych",
    description:
      "Pobierz aktualne ceny modeli generowania obrazów i dźwięku z Replicate, OpenAI, Fal.ai i OpenRouter, a następnie zaktualizuj models.ts",
    form: {
      title: "Ceny modeli medialnych",
    },
    response: {
      summary: {
        title: "Podsumowanie aktualizacji",
        totalModels: "Łączna liczba modeli medialnych",
        modelsUpdated: "Zaktualizowane modele",
        fileUpdated: "Plik zaktualizowany",
      },
      models: {
        title: "Zaktualizowane modele",
        model: {
          id: "ID modelu",
          name: "Nazwa modelu",
          provider: "Dostawca",
          costUsd: "Koszt (USD)",
          creditCost: "Kredyty",
          source: "Źródło ceny",
        },
      },
    },
    errors: {
      server: {
        title: "Błąd serwera",
        description: "Nie udało się pobrać cen modeli medialnych",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z API cennika",
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
      description: "Pomyślnie pobrano i zaktualizowano ceny modeli medialnych",
    },
  },
  tags: {
    models: "Modele",
  },
  updateMediaModelPrices: {
    name: "Zaktualizuj ceny modeli medialnych",
    description:
      "Pobiera aktualne ceny modeli generowania obrazów i dźwięku z API dostawców i aktualizuje models.ts",
  },
};
