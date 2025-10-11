import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  patch: {
    title: "Aktualizacja wsadowa",
    description:
      "Aktualizacja leadów wsadowo na podstawie kryteriów filtrowania",
    form: {
      title: "Konfiguracja aktualizacji wsadowej",
      description: "Skonfiguruj parametry aktualizacji wsadowej",
    },
    search: {
      label: "Wyszukaj",
      description: "Szukaj leadów po e-mailu lub nazwie firmy",
      placeholder: "Wprowadź e-mail lub nazwę firmy",
    },
    status: {
      label: "Filtr statusu",
      description: "Filtruj leady według obecnego statusu",
    },
    currentCampaignStage: {
      label: "Filtr etapu kampanii",
      description: "Filtruj leady według obecnego etapu kampanii",
    },
    source: {
      label: "Filtr źródła",
      description: "Filtruj leady według źródła",
    },
    scope: {
      label: "Zakres operacji",
      description: "Określ zakres operacji wsadowej",
    },
    dryRun: {
      label: "Test",
      description: "Podgląd zmian bez ich zastosowania",
    },
    maxRecords: {
      label: "Maks. rekordów",
      description: "Maksymalna liczba rekordów do przetworzenia",
    },
    updates: {
      title: "Pola do aktualizacji",
      description: "Określ, które pola zaktualizować",
      status: {
        label: "Nowy status",
        description: "Zaktualizuj status leada do tej wartości",
      },
      currentCampaignStage: {
        label: "Nowy etap kampanii",
        description: "Zaktualizuj etap kampanii do tej wartości",
      },
      source: {
        label: "Nowe źródło",
        description: "Zaktualizuj źródło leada do tej wartości",
      },
      notes: {
        label: "Notatki",
        description: "Dodaj lub zaktualizuj notatki dla leada",
      },
    },
    response: {
      title: "Odpowiedź aktualizacji",
      description: "Dane odpowiedzi aktualizacji wsadowej",
      success: "Sukces",
      totalMatched: "Całkowita Liczba Dopasowanych",
      totalProcessed: "Całkowita Liczba Przetworzonych",
      totalUpdated: "Całkowita Liczba Zaktualizowanych",
      preview: "Podgląd",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Autoryzacja wymagana dla operacji wsadowych",
      },
      validation: {
        title: "Błąd walidacji",
        description:
          "Nieprawidłowe parametry żądania dla aktualizacji wsadowej",
      },
      server: {
        title: "Błąd serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas aktualizacji wsadowej",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas aktualizacji wsadowej",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci podczas aktualizacji wsadowej",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony dla operacji wsadowych",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie został znaleziony dla aktualizacji wsadowej",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych podczas aktualizacji wsadowej",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany w aktualizacji wsadowej",
      },
    },
    success: {
      title: "Aktualizacja udała się",
      description: "Operacja aktualizacji wsadowej zakończona pomyślnie",
    },
  },
  delete: {
    title: "Usuwanie wsadowe",
    description: "Usuwanie leadów wsadowo na podstawie kryteriów filtrowania",
    form: {
      title: "Konfiguracja usuwania wsadowego",
      description: "Skonfiguruj parametry usuwania wsadowego",
    },
    search: {
      label: "Wyszukaj",
      description: "Szukaj leadów po e-mailu lub nazwie firmy",
    },
    status: {
      label: "Filtr statusu",
      description: "Filtruj leady według obecnego statusu",
    },
    confirmDelete: {
      label: "Potwierdź usunięcie",
      description: "Potwierdź, że chcesz usunąć wybrane leady",
    },
    dryRun: {
      label: "Test",
      description: "Podgląd usunięć bez rzeczywistego usuwania rekordów",
    },
    maxRecords: {
      label: "Maks. rekordów",
      description: "Maksymalna liczba rekordów do usunięcia",
    },
    response: {
      title: "Odpowiedź usunięcia",
      description: "Dane odpowiedzi usuwania wsadowego",
      success: "Sukces",
      totalMatched: "Całkowita Liczba Dopasowanych",
      totalProcessed: "Całkowita Liczba Przetworzonych",
      totalDeleted: "Całkowita Liczba Usuniętych",
      preview: "Podgląd",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Autoryzacja wymagana dla operacji usuwania wsadowego",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania dla usuwania wsadowego",
      },
      server: {
        title: "Błąd serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas usuwania wsadowego",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas usuwania wsadowego",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci podczas usuwania wsadowego",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony dla operacji usuwania wsadowego",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie został znaleziony dla usuwania wsadowego",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych podczas usuwania wsadowego",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany w usuwaniu wsadowym",
      },
    },
    success: {
      title: "Usunięcie udało się",
      description: "Operacja usuwania wsadowego zakończona pomyślnie",
    },
  },
  email: {
    admin: {
      batchUpdate: {
        title: "Aktualizacja Wsadowa Zakończona",
        subject: "Wyniki Aktualizacji Wsadowej",
        preview: "Przetworzono {{totalProcessed}} leadów",
        message:
          "Operacja aktualizacji wsadowej została zakończona z {{totalProcessed}} przetworzonymi leadami.",
        operationSummary: "Podsumowanie Operacji",
        totalMatched: "Całkowita Liczba Dopasowanych",
        totalProcessed: "Całkowita Liczba Przetworzonych",
        totalUpdated: "Całkowita Liczba Zaktualizowanych",
        errors: "Błędy",
        dryRunNote: "To był test - nie dokonano żadnych rzeczywistych zmian.",
        viewLeads: "Wyświetl Zaktualizowane Leady",
        error: {
          noData: "Brak danych aktualizacji wsadowej",
        },
      },
      batchDelete: {
        title: "Usuwanie Wsadowe Zakończone",
        subject: "Wyniki Usuwania Wsadowego",
        preview: "Przetworzono {{totalProcessed}} leadów do usunięcia",
        message:
          "Operacja usuwania wsadowego została zakończona z {{totalProcessed}} przetworzonymi leadami.",
        operationSummary: "Podsumowanie Operacji",
        totalMatched: "Całkowita Liczba Dopasowanych",
        totalProcessed: "Całkowita Liczba Przetworzonych",
        totalDeleted: "Całkowita Liczba Usuniętych",
        errors: "Błędy",
        dryRunNote: "To był test - nie dokonano żadnych rzeczywistych usunięć.",
        viewLeads: "Wyświetl Leady",
        error: {
          noData: "Brak danych usuwania wsadowego",
        },
      },
    },
  },
};
