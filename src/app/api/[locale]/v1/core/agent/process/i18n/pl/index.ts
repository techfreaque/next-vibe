import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Przetwórz Kolejkę Agenta E-mail",
    description: "Uruchom przetwarzanie e-maili przez pipeline agenta",
    form: {
      title: "Konfiguracja Przetwarzania E-maili",
      description: "Skonfiguruj parametry i opcje przetwarzania e-maili",
    },
    emailIds: {
      label: "ID E-maili",
      description: "Lista konkretnych ID e-maili do przetworzenia (opcjonalne)",
      placeholder: "Wprowadź ID e-maili oddzielone przecinkami",
    },
    accountIds: {
      label: "ID Kont",
      description:
        "Lista ID kont do przetworzenia wszystkich e-maili (opcjonalne)",
      placeholder: "Wprowadź ID kont oddzielone przecinkami",
    },
    forceReprocess: {
      label: "Wymuś Ponowne Przetwarzanie",
      description: "Wymuś ponowne przetwarzanie już przetworzonych e-maili",
    },
    skipHardRules: {
      label: "Pomiń Twarde Reguły",
      description: "Pomiń przetwarzanie twardych reguł (detekcja odbić/spamu)",
    },
    skipAiProcessing: {
      label: "Pomiń Przetwarzanie AI",
      description: "Pomiń analizę i rekomendacje napędzane przez AI",
    },
    dryRun: {
      label: "Próbny Przebieg",
      description: "Podgląd przetwarzania bez wprowadzania rzeczywistych zmian",
    },
    priority: {
      label: "Priorytet Przetwarzania",
      description: "Poziom priorytetu dla kolejki przetwarzania",
    },
    response: {
      title: "Wyniki Przetwarzania",
      description: "Wyniki i statystyki przetwarzania e-maili",
      item: "Element",
      processedEmails: "Przetworzone E-maile",
      hardRulesResults: {
        title: "Wyniki Twardych Reguł",
        description:
          "Wyniki przetwarzania twardych reguł (detekcja odbić/spamu)",
        item: {
          title: "Wynik Twardej Reguły",
        },
        emailId: "ID E-maila",
        result: "Wynik",
      },
      aiProcessingResults: {
        title: "Wyniki Przetwarzania AI",
        description: "Wyniki analizy i rekomendacji napędzanych przez AI",
        item: {
          title: "Wynik Przetwarzania AI",
        },
        emailId: "ID E-maila",
        result: "Wynik",
      },
      confirmationRequests: {
        title: "Żądania Potwierdzenia",
        description: "Wymagane potwierdzenia człowieka do przetwarzania",
        id: "ID Potwierdzenia",
        actionType: "Typ Akcji",
        status: "Status",
      },
      errors: {
        title: "Błędy Przetwarzania",
        description: "Błędy, które wystąpiły podczas przetwarzania",
        item: {
          title: "Błąd Przetwarzania",
        },
        emailId: "ID E-maila",
        error: "Błąd",
        stage: "Etap",
      },
      summary: {
        title: "Podsumowanie Przetwarzania",
        description: "Ogólne statystyki i wyniki przetwarzania",
        totalProcessed: "Łącznie Przetworzonych",
        hardRulesApplied: "Zastosowane Twarde Reguły",
        aiProcessingCompleted: "Przetwarzanie AI Zakończone",
        aiActionsRecommended: "Zalecane Akcje AI",
        errorsEncountered: "Napotkane Błędy",
        confirmationsGenerated: "Wygenerowane Potwierdzenia",
        confirmationsRequired: "Wymagane Potwierdzenia",
      },
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description:
          "Wymagana autoryzacja do uruchomienia przetwarzania e-maili",
      },
      validation: {
        title: "Błąd Walidacji",
        description: "Podano nieprawidłowe parametry przetwarzania",
      },
      server: {
        title: "Błąd Serwera",
        description: "Wewnętrzny błąd serwera podczas przetwarzania",
      },
      unknown: {
        title: "Nieznany Błąd",
        description: "Wystąpił nieznany błąd podczas przetwarzania",
      },
      network: {
        title: "Błąd Sieci",
        description: "Błąd sieci podczas przetwarzania e-maili",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp do przetwarzania e-maili jest zabroniony",
      },
      notFound: {
        title: "Nie Znaleziono",
        description:
          "Punkt końcowy przetwarzania e-maili nie został znaleziony",
      },
      unsavedChanges: {
        title: "Niezapisane Zmiany",
        description: "Są niezapisane zmiany, które muszą być najpierw zapisane",
      },
      conflict: {
        title: "Konflikt Przetwarzania",
        description: "Wystąpił konflikt przetwarzania e-maili",
      },
    },
    success: {
      title: "Przetwarzanie Zakończone",
      description: "Przetwarzanie e-maili zakończone pomyślnie",
    },
  },
  enums: {
    priority: {
      low: "Niski",
      normal: "Normalny",
      high: "Wysoki",
      urgent: "Pilny",
    },
  },
  imapErrors: {
    agent: {
      processing: {
        error: {
          server: {
            description: "Nie udało się przetworzyć e-maili",
          },
        },
      },
    },
  },
};
