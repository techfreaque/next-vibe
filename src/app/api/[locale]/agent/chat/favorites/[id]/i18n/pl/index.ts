import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Pobierz ulubiony",
    description: "Pobierz konkretną ulubioną konfigurację",
    container: {
      title: "Szczegóły ulubionego",
    },
    editButton: {
      label: "Edytuj ulubiony",
    },
    deleteButton: {
      label: "Usuń ulubiony",
    },
    customizeCharacterButton: {
      label: "Dostosuj osobowość postaci",
    },
    signupPrompt: {
      title: "Dostosuj osobowość postaci",
      description:
        "Edytuj prompt systemowy i zachowanie postaci. Zarejestruj się, aby rozpocząć.",
      backButton: "Wstecz",
      signupButton: "Utwórz konto",
      loginButton: "Zaloguj się",
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
      customIcon: {
        content: "Ikona niestandardowa: {{value}}",
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
      modelSelection: {
        title: "Wybór modelu",
      },
      selectionType: {
        content: "Typ wyboru: {{value}}",
      },
      minIntelligence: {
        content: "Min. inteligencja: {{value}}",
      },
      maxIntelligence: {
        content: "Maks. inteligencja: {{value}}",
      },
      minPrice: {
        content: "Minimalna cena: {{value}}",
      },
      maxPrice: {
        content: "Maksymalna cena: {{value}}",
      },
      minContent: {
        content: "Min. poziom treści: {{value}}",
      },
      maxContent: {
        content: "Maks. poziom treści: {{value}}",
      },
      minSpeed: {
        content: "Min. prędkość: {{value}}",
      },
      maxSpeed: {
        content: "Maks. prędkość: {{value}}",
      },
      content: {
        content: "Poziom treści: {{value}}",
      },
      preferredStrengths: {
        content: "Preferowane mocne strony: {{value}}",
      },
      ignoredWeaknesses: {
        content: "Ignorowane słabe strony: {{value}}",
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
    backButton: {
      label: "Wróć do ulubionego",
    },
    deleteButton: {
      label: "Usuń ulubiony",
    },
    customizeCharacterButton: {
      label: "Dostosuj osobowość postaci",
    },
    signupPrompt: {
      title: "Dostosuj osobowość postaci",
      description:
        "Edytuj prompt systemowy i zachowanie postaci. Zarejestruj się, aby rozpocząć.",
      backButton: "Wstecz",
      signupButton: "Utwórz konto",
      loginButton: "Zaloguj się",
    },
    submitButton: {
      label: "Zapisz zmiany",
      loadingText: "Zapisywanie...",
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
      label: "Głos AI",
      description: "Wybierz głos dla swojego asystenta AI",
    },
    mode: {
      label: "Tryb wyboru",
    },
    modelSelection: {
      title: "Wybór modelu",
      description:
        "Wybierz sposób wyboru modelu AI - wybierz konkretny model lub pozwól systemowi wybrać na podstawie filtrów",
    },
    selectionType: {
      label: "Typ wyboru",
      characterBased: "Na podstawie postaci",
      manual: "Konkretny model",
      filters: "Kryteria filtrowania",
    },
    intelligence: {
      label: "Poziom inteligencji",
    },
    minIntelligence: {
      label: "Minimalna inteligencja",
      description:
        "Minimalny poziom inteligencji/możliwości wymagany dla modelu",
    },
    maxIntelligence: {
      label: "Maksymalna inteligencja",
      description:
        "Maksymalny poziom inteligencji/możliwości dozwolony dla modelu",
    },
    minPrice: {
      label: "Minimalna cena",
      description: "Minimalny koszt kredytów na wiadomość",
    },
    maxPrice: {
      label: "Maksymalna cena",
    },
    minContent: {
      label: "Minimalny poziom treści",
      description: "Minimalny poziom moderacji treści dla modelu",
    },
    maxContent: {
      label: "Maksymalny poziom treści",
      description: "Maksymalny poziom moderacji treści dla modelu",
    },
    minSpeed: {
      label: "Minimalna prędkość",
      description: "Minimalny poziom prędkości wymagany dla modelu",
    },
    maxSpeed: {
      label: "Maksymalna prędkość",
      description: "Maksymalny poziom prędkości dozwolony dla modelu",
    },
    content: {
      label: "Poziom treści",
    },
    preferredStrengths: {
      label: "Preferowane mocne strony",
      description: "Możliwości i mocne strony modelu do preferowania",
    },
    ignoredWeaknesses: {
      label: "Ignorowane słabe strony",
      description: "Słabe strony modelu do ignorowania lub akceptowania",
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
    color: {
      label: "Kolor",
      description: "Niestandardowy kolor dla tego ulubionego",
    },
    customIcon: {
      label: "Niestandardowa ikona",
      description: "Niestandardowa ikona dla tego ulubionego",
    },
    changeCharacter: {
      label: "Zmień postać",
    },
    modifyCharacter: {
      label: "Modyfikuj postać",
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
      description: "Trwale usuń tę ulubioną konfigurację",
    },
    backButton: {
      label: "Anuluj",
    },
    actions: {
      delete: "Usuń ulubiony",
      deleting: "Usuwanie ulubionego...",
    },
    id: {
      label: "ID ulubionego",
      description: "Unikatowy identyfikator ulubionego do usunięcia",
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
