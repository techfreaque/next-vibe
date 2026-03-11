import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Zarządzanie kampaniami",
  tag: "Przetwarzanie zwrotów",
  task: {
    description:
      "Skanuj skrzynkę IMAP w poszukiwaniu powiadomień o zwrotach i aktualizuj status leada na BOUNCED",
  },
  post: {
    title: "Przetwarzanie zwrotów",
    description: "Przetwarzaj powiadomienia o zwrotach e-mail z IMAP",
    container: {
      title: "Przetwarzanie zwrotów",
      description:
        "Skanuje IMAP w poszukiwaniu powiadomień o zwrotach i blokuje zwróconych leadów",
    },
    fields: {
      dryRun: {
        label: "Próbny przebieg",
        description: "Uruchom bez wprowadzania zmian",
      },
      batchSize: {
        label: "Rozmiar partii",
        description: "Maksymalna liczba e-maili ze zwrotami na przebieg",
      },
    },
    response: {
      bouncesFound: "Znalezione zwroty",
      leadsUpdated: "Zaktualizowane leady",
      campaignsCancelled: "Anulowane kampanie",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      server: {
        title: "Błąd serwera",
        description: "Błąd podczas przetwarzania zwrotów",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
    },
    success: {
      title: "Przetwarzanie zwrotów zakończone",
      description: "Powiadomienia o zwrotach przetworzone pomyślnie",
    },
  },
  widget: {
    title: "Uruchom przetwarzanie zwrotów",
    description:
      "Ręcznie skanuj skrzynkę IMAP w poszukiwaniu powiadomień o zwrotach i aktualizuj statusy leadów.",
    runButton: "Uruchom teraz",
    running: "Uruchamianie...",
    done: "Gotowe",
  },
};
