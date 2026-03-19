import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",
  claudeCode: {
    tags: {
      tasks: "Zadania",
    },
    run: {
      post: {
        title: "Uruchom Claude Code",
        dynamicTitle: "Claude Code: {{prompt}}",
        description:
          "Uruchamia zadanie Claude Code. Tryb wsadowy (DOMYŚLNY): działa bezgłowo i zwraca wynik. Tryb interaktywny: otwiera sesję terminala na żywo — wynik jest dostarczany automatycznie gdy sesja się kończy.",
        fields: {
          prompt: {
            label: "Prompt",
            description:
              "Zadanie lub pytanie dla Claude Code. Bądź konkretny — podaj ścieżki plików, kontekst i oczekiwany format wyjścia.",
          },
          model: {
            label: "Model",
            description:
              "Model Claude do użycia w tej sesji. Domyślnie Sonnet (zalecany). Opus do złożonych zadań, Haiku do szybkich/tanich.",
            options: {
              sonnet: "Sonnet 4.6 (zalecany)",
              opus: "Opus 4.6 (najlepsze rozumowanie)",
              haiku: "Haiku 4.5 (najszybszy)",
            },
          },
          maxBudgetUsd: {
            label: "Maks. budżet (USD)",
            description:
              "Maksymalny limit wydatków w USD. Zapobiega niekontrolowanym kosztom. Pomiń dla braku limitu.",
          },
          availableTools: {
            label: "Dozwolone narzędzia",
            description:
              "Rozdzielona przecinkami lista dozwolonych narzędzi (np. Read,Edit,Bash). Pomiń dla wszystkich domyślnych.",
          },
          taskTitle: {
            label: "Tytuł zadania",
            description:
              "Krótki tytuł do archiwizacji zadania. Generowany automatycznie z promptu, jeśli pominięty.",
          },
          interactiveMode: {
            label: "Tryb interaktywny",
            description:
              "false (DOMYŚLNY): działa bezgłowo i zwraca cały wynik po zakończeniu. true: otwiera okno terminala dla sesji na żywo — wynik jest dostarczany automatycznie gdy sesja się kończy.",
          },
          output: {
            label: "Wyjście",
            description:
              "Połączony stdout procesu Claude Code. Pusty gdy zadanie zostało eskalowane do tła.",
          },
          durationMs: {
            label: "Czas trwania (ms)",
            description: "Łączny czas działania procesu.",
          },
          taskId: {
            label: "ID zadania",
            description:
              "W trybie interaktywnym: ID zadania śledzącego używanego przez Claude Code po zakończeniu sesji. Wynik jest dostarczany automatycznie. W trybie wsadowym: nieobecny (wynik zwracany inline).",
          },
          hint: {
            label: "Wskazówka",
            description:
              "Wskazówka dla AI dotycząca sposobu dostarczenia wyniku.",
          },
        },
        errors: {
          validation: {
            title: "Błąd walidacji",
            description:
              "Nieprawidłowe parametry żądania — sprawdź prompt i pola",
          },
          unauthorized: {
            title: "Brak autoryzacji",
            description: "Wymagane uwierzytelnienie — potrzebna rola admina",
          },
          internal: {
            title: "Wykonanie nie powiodło się",
            description:
              "Proces Claude Code nie mógł zostać uruchomiony lub uległ awarii",
          },
          internalExitCode: {
            title: "Wykonanie nie powiodło się (exit {{exitCode}})",
            description:
              "Proces Claude Code zakończył się z niezerowym kodem wyjścia",
          },
          forbidden: {
            title: "Zabronione",
            description: "Odmowa dostępu — niewystarczające uprawnienia",
          },
          notFound: {
            title: "Nie znaleziono",
            description: "Zasób lub katalog roboczy nie został znaleziony",
          },
          network: {
            title: "Błąd sieci",
            description: "Błąd sieci podczas komunikacji z Claude Code",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Nieoczekiwany błąd podczas wykonania",
          },
          unsaved: {
            title: "Niezapisane zmiany",
            description: "Wykryto konflikt niezapisanych zmian",
          },
          conflict: {
            title: "Konflikt",
            description:
              "Konflikt wykonania — możliwe że inna sesja już działa",
          },
        },
        success: {
          title: "Claude Code zakończony",
          description:
            "Proces Claude Code zakończony pomyślnie. Jeśli wyjście jest puste, wynik zostanie dostarczony przez injektowanie wątku.",
        },
        widget: {
          runningBatch: "Claude działa...",
          runningInteractive: "Uruchamianie interaktywnej sesji terminala...",
          escalated:
            "Działa w tle — wynik zostanie injektowany po zakończeniu.",
          taskIdLabel: "ID zadania",
          outputLabel: "Wyjście",
          interactiveSessionLaunched:
            "Interaktywna sesja uruchomiona w terminalu.",
          copyOutput: "Kopiuj",
          copied: "Skopiowano!",
        },
      },
    },
  },
};
