import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  category: "Agent",

  get: {
    title: "Aktualizuj wszystkie ceny modeli",
    titleShort: "Aktualizuj ceny",
    description:
      "Pobiera aktualne ceny dostawców i pokazuje proponowane zmiany w katalogu. Użyj --write w lokalnym CLI, aby je zapisać.",
    form: {
      title: "Aktualizator cen modeli",
      write: "Zapisz zmiany w plikach źródłowych",
    },
    response: {
      diff: "Różnice w plikach źródłowych",
      summary: {
        status: "Status",
        notConfigured: "Porównanie cen pominięto. Brak kluczy API dostawców.",
        title: "Podsumowanie aktualizacji",
        totalProviders: "Uruchomione dostawcy",
        totalModels: "Łącznie modeli",
        modelsUpdated: "Proponowane zmiany",
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
        detail: "Nieznany błąd: {{error}}",
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
      description: "Pobrano ceny dostawców i porównano je z katalogiem.",
    },
  },
  tags: {
    models: "Modele",
  },
  updateAllModelPrices: {
    name: "Aktualizuj wszystkie ceny modeli",
    description:
      "Porównuje aktualne ceny dostawców z katalogiem i zapisuje różnice do sprawdzenia.",
  },
};
