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
            title: "Prompt",
            description:
              "Zadanie lub pytanie dla Claude Code. Bądź konkretny — podaj ścieżki plików, kontekst i oczekiwany format wyjścia.",
          },
          model: {
            title: "Model",
            description:
              "ID modelu Claude (np. claude-sonnet-4-6, claude-opus-4-6). Domyślnie używa ustawień Claude Code.",
          },
          maxBudgetUsd: {
            title: "Maks. budżet (USD)",
            description:
              "Maksymalny limit wydatków w USD. Zapobiega niekontrolowanym kosztom użycia narzędzi. Pomiń dla braku limitu.",
          },
          systemPrompt: {
            title: "Prompt systemowy",
            description:
              "Opcjonalny prompt systemowy. Dla persony, ograniczeń lub kontekstu całej sesji.",
          },
          allowedTools: {
            title: "Dozwolone narzędzia",
            description:
              "Rozdzielona przecinkami lista dozwolonych narzędzi (np. Read,Edit,Bash). Pomiń dla wszystkich domyślnych narzędzi.",
          },
          headless: {
            title: "Headless (tryb wsadowy)",
            description:
              "PREFERUJ false (domyślnie). headless:false otwiera pełną interaktywną sesję Claude Code — Max widzi wyniki na żywo i może uczestniczyć. Ustaw true tylko dla w pełni zautomatyzowanych zadań wsadowych (cron-joby, pipeline'y) bez interakcji człowieka.",
          },
          workingDir: {
            title: "Katalog roboczy",
            description:
              "Bezwzględna ścieżka dla procesu Claude Code. Domyślnie: bieżący katalog serwera.",
          },
          timeoutMs: {
            title: "Timeout (ms)",
            description:
              "Maksymalny czas wykonania w milisekundach. Domyślnie: 600000 (10 minut).",
          },
          output: {
            title: "Wyjście",
            description: "Połączony stdout procesu Claude Code.",
          },
          exitCode: {
            title: "Kod wyjścia",
            description: "Kod wyjścia procesu. 0 = sukces, niezerowy = błąd.",
          },
          durationMs: {
            title: "Czas trwania (ms)",
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
