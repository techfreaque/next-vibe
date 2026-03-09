export const translations = {
  title: "Warianty journey",
  description: "Zarządzaj rejestracjami wariantów journey e-mail",
  get: {
    title: "Warianty journey",
    description: "Lista wszystkich zarejestrowanych wariantów journey e-mail",
    response: {
      id: "ID",
      variantKey: "Klucz wariantu",
      displayName: "Nazwa wyświetlana",
      description: "Opis",
      weight: "Waga",
      active: "Aktywny",
      campaignType: "Typ kampanii",
      sourceFilePath: "Ścieżka pliku źródłowego",
      checkErrors: "Błędy sprawdzania",
      createdAt: "Data utworzenia",
      updatedAt: "Data aktualizacji",
      items: "Warianty",
      total: "Łącznie wariantów",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagany admin",
      },
      forbidden: { title: "Zabronione", description: "Brak uprawnień" },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się załadować wariantów journey",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      notFound: { title: "Nie znaleziono", description: "Nie znaleziono" },
      conflict: { title: "Konflikt", description: "Konflikt" },
      network: { title: "Błąd sieci", description: "Błąd sieci" },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Niezapisane zmiany",
      },
    },
    success: {
      title: "Warianty załadowane",
      description: "Warianty journey załadowane pomyślnie",
    },
  },
  post: {
    title: "Zarejestruj wariant journey",
    description: "Zarejestruj nowy wariant journey e-mail",
    fields: {
      variantKey: {
        label: "Klucz wariantu",
        description:
          "Unikalny identyfikator (np. MY_VARIANT). Musi odpowiadać kluczowi w enum EmailJourneyVariant.",
      },
      displayName: {
        label: "Nazwa wyświetlana",
        description: "Czytelna dla człowieka nazwa wariantu",
      },
      description: {
        label: "Opis",
        description: "Czym jest ta journey",
      },
      weight: {
        label: "Waga",
        description: "Waga testu A/B (1-100). Tylko dla kampanii cold-lead.",
      },
      campaignType: {
        label: "Typ kampanii",
        description: "Dla jakiego typu kampanii jest ten wariant (opcjonalnie)",
      },
      sourceFilePath: {
        label: "Ścieżka pliku źródłowego",
        description: "Względna ścieżka do pliku .email.tsx",
      },
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagany admin",
      },
      forbidden: { title: "Zabronione", description: "Brak uprawnień" },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się zarejestrować wariantu journey",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowy klucz wariantu lub dane",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Klucz wariantu nie znaleziony w enum",
      },
      conflict: {
        title: "Konflikt",
        description: "Klucz wariantu już zarejestrowany",
      },
      network: { title: "Błąd sieci", description: "Błąd sieci" },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Niezapisane zmiany",
      },
    },
    success: {
      title: "Wariant zarejestrowany",
      description: "Wariant journey zarejestrowany pomyślnie",
    },
  },
  patch: {
    title: "Zaktualizuj wariant journey",
    description: "Zaktualizuj zarejestrowany wariant journey e-mail",
    fields: {
      id: {
        label: "ID wariantu",
        description: "ID wariantu do aktualizacji",
      },
      active: {
        label: "Aktywny",
        description: "Włącz lub wyłącz ten wariant",
      },
      weight: {
        label: "Waga",
        description: "Waga testu A/B (1-100)",
      },
      displayName: {
        label: "Nazwa wyświetlana",
        description: "Czytelna dla człowieka nazwa wariantu",
      },
      description: {
        label: "Opis",
        description: "Czym jest ta journey",
      },
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagany admin",
      },
      forbidden: { title: "Zabronione", description: "Brak uprawnień" },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się zaktualizować wariantu journey",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe dane aktualizacji",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Wariant nie znaleziony",
      },
      conflict: { title: "Konflikt", description: "Konflikt" },
      network: { title: "Błąd sieci", description: "Błąd sieci" },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Niezapisane zmiany",
      },
    },
    success: {
      title: "Wariant zaktualizowany",
      description: "Wariant journey zaktualizowany pomyślnie",
    },
  },
  widget: {
    title: "Warianty journey",
    refresh: "Odśwież",
    register: "Zarejestruj wariant",
    noVariants: "Brak zarejestrowanych wariantów",
    activeLabel: "Aktywny",
    inactiveLabel: "Nieaktywny",
    weightLabel: "Waga",
    campaignTypeLabel: "Typ kampanii",
    sourceFileLabel: "Plik źródłowy",
    toggleActivate: "Aktywuj",
    toggleDeactivate: "Dezaktywuj",
    checkErrorsLabel: "Błędy sprawdzania:",
  },
};
