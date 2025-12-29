import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Pobierz ulubiony",
    description: "Pobierz konkretną ulubioną konfigurację",
    container: {
      title: "Szczegóły ulubionego",
    },
    id: {
      label: "ID ulubionego",
    },
    response: {
      characterId: {
        content: "Postać: {{value}}",
      },
      customName: {
        content: "Nazwa niestandardowa: {{value}}",
      },
      voice: {
        content: "Głos: {{value}}",
      },
      mode: {
        content: "Tryb: {{value}}",
      },
      intelligence: {
        content: "Inteligencja: {{value}}",
      },
      maxPrice: {
        content: "Maksymalna cena: {{value}}",
      },
      content: {
        content: "Poziom treści: {{value}}",
      },
      manualModelId: {
        content: "Model ręczny: {{value}}",
      },
      position: {
        content: "Pozycja: {{value}}",
      },
      color: {
        content: "Kolor: {{value}}",
      },
      isActive: {
        content: "Aktywny: {{value}}",
      },
      useCount: {
        content: "Użycia: {{value}}",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe ID ulubionego",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Musisz być zalogowany, aby wyświetlić ten ulubiony",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do wyświetlenia tego ulubionego",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Ulubiony nie znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się załadować ulubionego",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które zostaną utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas przetwarzania żądania",
      },
    },
    success: {
      title: "Sukces",
      description: "Ulubiony załadowany pomyślnie",
    },
  },
  patch: {
    title: "Aktualizuj ulubiony",
    description: "Aktualizuj istniejącą ulubioną konfigurację",
    container: {
      title: "Edytuj ulubiony",
    },
    id: {
      label: "ID ulubionego",
    },
    characterId: {
      label: "Postać",
    },
    customName: {
      label: "Nazwa niestandardowa",
    },
    voice: {
      label: "Głos",
      description: "Preferencje głosu text-to-speech",
    },
    mode: {
      label: "Tryb wyboru",
    },
    intelligence: {
      label: "Poziom inteligencji",
    },
    maxPrice: {
      label: "Maksymalna cena",
    },
    content: {
      label: "Poziom treści",
    },
    manualModelId: {
      label: "Model ręczny",
    },
    isActive: {
      label: "Aktywny",
    },
    position: {
      label: "Pozycja",
    },
    response: {
      success: {
        content: "Zaktualizowano: {{value}}",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź wprowadzone dane i spróbuj ponownie",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Musisz być zalogowany, aby zaktualizować ten ulubiony",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do aktualizacji tego ulubionego",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Ulubiony nie znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się zaktualizować ulubionego",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które zostaną utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas aktualizacji ulubionego",
      },
    },
    success: {
      title: "Sukces",
      description: "Ulubiony zaktualizowany pomyślnie",
    },
  },
  delete: {
    title: "Usuń ulubiony",
    description: "Usuń ulubioną konfigurację",
    container: {
      title: "Usuń ulubiony",
    },
    id: {
      label: "ID ulubionego",
    },
    response: {
      success: {
        content: "Usunięto: {{value}}",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe ID ulubionego",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Musisz być zalogowany, aby usunąć ten ulubiony",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do usunięcia tego ulubionego",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Ulubiony nie znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się usunąć ulubionego",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które zostaną utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Nie można usunąć ulubionego z powodu konfliktu",
      },
    },
    success: {
      title: "Sukces",
      description: "Ulubiony usunięty pomyślnie",
    },
  },
};
