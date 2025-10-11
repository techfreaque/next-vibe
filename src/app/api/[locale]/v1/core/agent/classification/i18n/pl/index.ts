import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Klasyfikacja Agenta E-mail",
    description: "Ręcznie uruchom klasyfikację e-maili przez pipeline agenta",
    form: {
      title: "Parametry klasyfikacji",
      description: "Skonfiguruj opcje przetwarzania klasyfikacji e-maili",
    },
    emailIds: {
      label: "ID e-maili",
      description: "Konkretne ID e-maili do klasyfikacji (jeden na linię)",
      placeholder: "Wprowadź UUID e-maili, jeden na linię",
    },
    accountIds: {
      label: "ID kont",
      description: "ID kont e-mail do przetworzenia (jeden na linię)",
      placeholder: "Wprowadź UUID kont, jeden na linię",
    },
    maxEmailsPerRun: {
      label: "Maks. e-maili na uruchomienie",
      description:
        "Maksymalna liczba e-maili do przetworzenia w tym uruchomieniu",
    },
    enableHardRules: {
      label: "Włącz twarde reguły",
      description:
        "Zastosuj przetwarzanie twardych reguł (wykrywanie odrzuceń, filtrowanie spamu)",
    },
    enableAiProcessing: {
      label: "Włącz przetwarzanie AI",
      description: "Zastosuj klasyfikację i analizę opartą na AI",
    },
    priorityFilter: {
      label: "Filtr priorytetu",
      description: "Przetwarzaj tylko e-maile z tymi poziomami priorytetu",
    },
    forceReprocess: {
      label: "Wymuś ponowne przetworzenie",
      description: "Przetwarzaj e-maile nawet jeśli są już sklasyfikowane",
    },
    dryRun: {
      label: "Uruchomienie próbne",
      description: "Symuluj przetwarzanie bez wprowadzania zmian",
    },
    response: {
      title: "Wyniki klasyfikacji",
      description: "Wyniki przetwarzania klasyfikacji e-maili",
      emailsProcessed: "E-maile przetworzone",
      hardRulesApplied: "Twarde reguły zastosowane",
      aiProcessingCompleted: "Przetwarzanie AI zakończone",
      confirmationRequestsCreated: "Żądania potwierdzenia utworzone",
      errors: {
        item: "Element błędu",
        emailId: "ID e-maila",
        stage: "Etap przetwarzania",
        error: "Szczegóły błędu",
      },
      summary: {
        title: "Podsumowanie przetwarzania",
        description: "Ogólne podsumowanie wyników klasyfikacji",
        totalProcessed: "Łączna liczba przetworzonych e-maili",
        pendingCount: "Liczba oczekujących",
        completedCount: "Liczba ukończonych",
        failedCount: "Liczba nieudanych",
        awaitingConfirmationCount: "Liczba oczekujących na potwierdzenie",
      },
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do uruchamiania klasyfikacji e-maili",
      },
      validation: {
        title: "Walidacja nie powiodła się",
        description: "Podano nieprawidłowe parametry klasyfikacji",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się uruchomić klasyfikacji e-maili",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas klasyfikacji",
      },
      network: {
        title: "Błąd sieci",
        description: "Komunikacja sieciowa nie powiodła się",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp do tego zasobu jest zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt zasobów",
      },
    },
    success: {
      title: "Sukces",
      description: "Klasyfikacja e-maili uruchomiona pomyślnie",
    },
  },
  error: {
    execution_failed: "Wykonanie klasyfikacji nie powiodło się",
    server: {
      description: "Wystąpił błąd serwera podczas klasyfikacji e-maili",
    },
    emails_not_found: "Nie znaleziono e-maili do klasyfikacji",
    validation_failed: "Walidacja parametrów klasyfikacji nie powiodła się",
    processing_records_failed:
      "Przetwarzanie rekordów e-maili do klasyfikacji nie powiodło się",
  },
  imapErrors: {
    agent: {
      classification: {
        error: {
          execution_failed: "Wykonanie klasyfikacji e-maili nie powiodło się",
          server: {
            description: "Przetwarzanie klasyfikacji e-maili nie powiodło się",
          },
          emails_not_found: "Nie znaleziono e-maili spełniających kryteria",
          validation_failed: "Podano nieprawidłowe parametry klasyfikacji",
          processing_records_failed:
            "Przetwarzanie rekordów klasyfikacji e-maili nie powiodło się",
        },
      },
    },
  },
  api: {
    agent: {
      classification: {
        execution: {
          failed: "Wykonanie klasyfikacji nie powiodło się",
        },
        emails: {
          not: {
            found: "Nie znaleziono e-maili do klasyfikacji",
          },
        },
        validation: {
          failed: "Walidacja parametrów klasyfikacji nie powiodła się",
        },
      },
    },
  },
};
