import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    execution: "Wykonanie",
  },
  post: {
    title: "Wykonaj akcje agenta",
    description:
      "Ręcznie uruchom wykonanie zatwierdzonych akcji i wywołań narzędzi",
    form: {
      title: "Konfiguracja wykonania",
      description: "Skonfiguruj parametry wykonania akcji agenta",
    },
    confirmationIds: {
      label: "ID potwierdzeń",
      description: "Lista konkretnych ID potwierdzeń do wykonania (opcjonalne)",
      placeholder: "Wprowadź ID potwierdzeń oddzielone przecinkami",
    },
    maxActionsPerRun: {
      label: "Maks. akcji na przebieg",
      description:
        "Maksymalna liczba akcji do wykonania w jednym przebiegu (1-100)",
    },
    enableToolExecution: {
      label: "Włącz wykonywanie narzędzi",
      description: "Włącz wykonywanie zatwierdzonych wywołań narzędzi",
    },
    enableConfirmationCleanup: {
      label: "Włącz czyszczenie potwierdzeń",
      description: "Wyczyść wygasłe potwierdzenia podczas wykonywania",
    },
    confirmationExpiryHours: {
      label: "Godziny wygaśnięcia potwierdzeń",
      description: "Godziny, po których potwierdzenia wygasają (1-168)",
    },
    dryRun: {
      label: "Próbny przebieg",
      description: "Podgląd wykonania bez faktycznych zmian",
    },
    response: {
      title: "Wyniki wykonania",
      description: "Wyniki i statystyki wykonania akcji agenta",
      actionsExecuted: "Wykonane akcje",
      confirmationsProcessed: "Przetworzone potwierdzenia",
      expiredConfirmationsCleanedUp: "Wyczyszczone wygasłe potwierdzenia",
      toolCallsExecuted: "Wykonane wywołania narzędzi",
      errors: {
        item: "Element błędu",
        confirmationId: "ID potwierdzenia",
        emailId: "ID e-maila",
        action: "Akcja",
        error: "Błąd",
      },
      summary: {
        title: "Podsumowanie wykonania",
        description: "Podsumowanie wyników wykonania",
        totalProcessed: "Łącznie przetworzono",
        successfulExecutions: "Udane wykonania",
        failedExecutions: "Nieudane wykonania",
        pendingConfirmations: "Oczekujące potwierdzenia",
        expiredConfirmations: "Wygasłe potwierdzenia",
      },
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagana autoryzacja do wykonania akcji agenta",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Podano nieprawidłowe parametry wykonania",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera podczas wykonywania",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas wykonywania",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci podczas wykonywania akcji",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp do wykonania agenta jest zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Punkt końcowy wykonania agenta nie został znaleziony",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description:
          "Istnieją niezapisane zmiany, które należy najpierw zapisać",
      },
      conflict: {
        title: "Konflikt wykonania",
        description: "Wystąpił konflikt wykonania",
      },
    },
    success: {
      title: "Wykonanie zakończone",
      description: "Wykonanie akcji agenta zakończone pomyślnie",
    },
  },
  emails: {
    agent: {
      execution: {
        error: {
          execution_failed: "Wykonanie agenta nie powiodło się",
          server: {
            description: "Nie udało się wykonać akcji agenta",
          },
          confirmations_not_found: "Potwierdzenia nie znalezione",
          validation_failed: "Walidacja nie powiodła się",
          confirmation_not_approved: "Potwierdzenie nie zatwierdzone",
          confirmation_already_executed: "Potwierdzenie już wykonane",
          marking_failed: "Nie udało się oznaczyć potwierdzeń do wykonania",
        },
      },
    },
  },
  imapErrors: {
    agent: {
      execution: {
        error: {
          execution_failed: "Wykonanie agenta nie powiodło się",
          server: {
            description: "Nie udało się wykonać akcji agenta",
          },
          confirmations_not_found: "Nie znaleziono potwierdzeń do wykonania",
          validation_failed: "Podano nieprawidłowe parametry wykonania",
          confirmation_not_approved:
            "Potwierdzenie nie zatwierdzone do wykonania",
          confirmation_already_executed: "Potwierdzenie już wykonane",
          marking_failed: "Nie udało się oznaczyć potwierdzeń do wykonania",
        },
      },
    },
  },
};
