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
        description:
          "Uruchamia sesję Claude Code na Hermesie (lokalnej maszynie deweloperskiej). PREFERUJ headless:false (domyślnie) — otwiera pełną sesję Claude Code, w której Max może aktywnie uczestniczyć. headless:true tylko dla w pełni zautomatyzowanych zadań wsadowych bez udziału człowieka (np. cron-joby). W trybie interaktywnym sesja jest strumieniowana na żywo do terminala; w trybie wsadowym uruchamia `claude -p` i zwraca wynik po zakończeniu. Zawsze uruchamia z --dangerously-skip-permissions.",
        fields: {
          prompt: {
            label: "Prompt",
            description:
              "Zadanie lub pytanie dla Claude Code. Bądź konkretny — podaj ścieżki plików, kontekst i oczekiwany format wyjścia.",
          },
          model: {
            label: "Model",
            description:
              "Model Claude do użycia w tej sesji. Domyślnie Sonnet.",
            options: {
              sonnet: "Sonnet 4.6",
              opus: "Opus 4.6",
              haiku: "Haiku 4.5",
            },
          },
          maxBudgetUsd: {
            label: "Maks. budżet (USD)",
            description:
              "Maksymalny limit wydatków w USD. Zapobiega niekontrolowanym kosztom użycia narzędzi. Pomiń dla braku limitu.",
          },
          allowedTools: {
            label: "Dozwolone narzędzia",
            description:
              "Rozdzielona przecinkami lista dozwolonych narzędzi (np. Read,Edit,Bash). Pomiń dla wszystkich domyślnych narzędzi.",
          },
          interactiveMode: {
            label: "Tryb interaktywny",
            description:
              "PREFERUJ true (domyślnie). Tryb interaktywny otwiera pełną sesję Claude Code — Max widzi wyniki na żywo i może uczestniczyć. Ustaw false tylko dla w pełni zautomatyzowanych zadań wsadowych (cron-joby, pipeline'y) bez interakcji człowieka.",
          },
          timeoutSeconds: {
            label: "Timeout (sekundy)",
            description:
              "Maksymalny czas wykonania w sekundach. Domyślnie: 600 (10 minut).",
          },
          output: {
            label: "Wyjście",
            description: "Połączony stdout procesu Claude Code.",
          },
          exitCode: {
            label: "Kod wyjścia",
            description: "Kod wyjścia procesu. 0 = sukces, niezerowy = błąd.",
          },
          taskTitle: {
            label: "Tytuł zadania",
            description:
              "Krótki tytuł do archiwizacji tego zadania (np. 'Napraw błąd logowania'). Generowany automatycznie z promptu, jeśli pominięty.",
          },
          durationMs: {
            label: "Czas trwania (ms)",
            description: "Łączny czas działania procesu.",
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
            "Proces Claude Code zakończony — sprawdź exitCode dla sukcesu/błędu i output dla wyników",
        },
      },
    },
  },
};
