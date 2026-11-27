import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",
  "claude-code": "Claude Code",
  "open-code": "OpenCode",
  codex: "Codex",
  antigravity: "Antigravity CLI",
  idle: "Bezczynny",
  running: "W toku",
  completed: "Ukończono",
  interrupted: "Przerwano",
  failed: "Niepowodzenie",
  "read-only": "Tylko odczyt",
  "workspace-write": "Zapis w obszarze roboczym",
  "danger-full-access": "Pełny dostęp",
  codingAgent: {
    tags: {
      tasks: "Zadania",
    },
    run: {
      post: {
        title: "Uruchom agenta kodowania",
        titleShort: "Agent kodowania",
        dynamicTitle: "Agent kodowania: {{prompt}}",
        description:
          "Uruchamia zadanie agenta kodowania przez Claude Code, OpenCode, Codex lub Antigravity. Podaj nazwę, aby zachować rozmowę i kierować nią w trakcie pracy, albo ustaw interactiveMode=true dla sesji w terminalu.",
        fields: {
          name: {
            label: "Nazwa agenta",
            description:
              "Opcjonalna trwała nazwa agenta (od 1 do 40 liter, cyfr, myślników lub podkreśleń). Użycie tej samej nazwy wznawia rozmowę.",
          },
          prompt: {
            label: "Zadanie",
            description:
              "Zadanie lub pytanie dla agenta kodowania. Podaj ścieżki plików, kontekst i oczekiwany sposób weryfikacji.",
          },
          promptFile: {
            label: "Plik z zadaniem",
            description:
              "Ścieżka do pliku z zadaniem względem bieżącego katalogu roboczego. Alternatywa dla promptu w treści.",
          },
          provider: {
            label: "Dostawca",
            description:
              "Wybierz CLI: claude-code, open-code, codex lub antigravity. Domyślnie codex dla nowych nazwanych agentów i claude-code dla uruchomień bez nazwy.",
            options: {
              claudeCode: "Claude Code",
              openCode: "OpenCode",
              codex: "Codex",
              antigravity: "Antigravity CLI",
            },
          },
          model: {
            label: "Model",
            description:
              "Identyfikator modelu u dostawcy. Pozostaw puste dla domyślnego (Antigravity używa Gemini 4 Neon High, Codex używa gpt-6.2-sol).",
          },
          effort: {
            label: "Poziom rozumowania",
            description:
              "Poziom rozumowania dla Codex lub Antigravity (np. low, medium, high).",
          },
          sandbox: {
            label: "Piaskownica Codex",
            description:
              "Izolacja plików dla Codex (read-only, workspace-write lub danger-full-access).",
          },
          cwd: {
            label: "Katalog roboczy",
            description:
              "Katalog, w którym działa agent. Domyślnie bieżący katalog roboczy.",
          },
          fresh: {
            label: "Nowa rozmowa",
            description:
              "Rozpocznij nową rozmowę zamiast wznawiać zapisany wątek dla tej nazwy.",
          },
          taskTitle: {
            label: "Tytuł zadania",
            description:
              "Krótki tytuł do archiwizacji. Generowany automatycznie z promptu, jeśli pominięty.",
          },
          interactiveMode: {
            label: "Tryb interaktywny",
            description:
              "false (DOMYŚLNY): działa w tle i zwraca wynik. true: otwiera okno terminala dla sesji na żywo.",
          },
          output: {
            label: "Wyjście",
            description:
              "Końcowa odpowiedź lub stdout procesu agenta. Puste przy eskalacji do tła.",
          },
          durationMs: {
            label: "Czas trwania (ms)",
            description: "Łączny czas działania procesu.",
          },
          threadId: {
            label: "ID rozmowy",
            description:
              "Zapisany identyfikator wątku lub sesji do wznowienia nazwanego agenta.",
          },
          status: {
            label: "Stan",
            description: "Wynik tury trwałego agenta.",
          },
          taskId: {
            label: "ID zadania",
            description:
              "W trybie interaktywnym: identyfikator zadania śledzącego. Wynik wraca automatycznie.",
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
              "Nieprawidłowe parametry żądania. Sprawdź nazwę agenta, zadanie i opcje.",
          },
          unauthorized: {
            title: "Brak autoryzacji",
            description:
              "Wymagane logowanie. Sprawdź rolę administratora lub logowanie w CLI dostawcy.",
          },
          internal: {
            title: "Wykonanie nie powiodło się",
            description:
              "Proces agenta kodowania nie uruchomił się lub uległ awarii.",
          },
          binaryMissing: {
            title:
              "{{bin}} nie jest zainstalowany na tej instancji. Zainstaluj go albo wybierz innego dostawcę.",
            description:
              "Nie znaleziono CLI agenta kodowania w PATH tego serwera.",
          },
          internalExitCode: {
            title: "Wykonanie nie powiodło się (exit {{exitCode}})",
            description:
              "Proces agenta kodowania zakończył się z niezerowym kodem wyjścia.",
          },
          forbidden: {
            title: "Zabronione",
            description:
              "Odmowa dostępu. Sprawdź uprawnienia u wybranego dostawcy.",
          },
          notFound: {
            title: "Nie znaleziono",
            description:
              "Nie znaleziono agenta, pliku z zadaniem ani katalogu roboczego.",
          },
          vibeCoderRedirect: {
            title: "Użyj ai-run z vibe-coder zamiast tego",
            description:
              "Agent kodowania jest ustawiony na vibe-coder. Użyj narzędzia ai-run ze skillem vibe-coder.",
          },
          network: {
            title: "Błąd sieci",
            description:
              "Dostawca lub agent kodowania jest chwilowo niedostępny.",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Nieoczekiwany błąd podczas wykonania.",
          },
          unsaved: {
            title: "Niezapisane zmiany",
            description: "Wykryto konflikt niezapisanych zmian.",
          },
          conflict: {
            title: "Konflikt",
            description:
              "Inna sesja już działa pod tą nazwą albo zapisany wątek należy do innego dostawcy.",
          },
          detail: "Operacja agenta nie powiodła się: {{detail}}",
        },
        backButton: {
          label: "Wstecz",
        },
        submitButton: {
          label: "Uruchom",
          loadingText: "Działa...",
        },
        success: {
          title: "Agent kodowania zakończony",
          description:
            "Agent kodowania zakończył pracę. Jeśli wyjście jest puste, wynik zostanie dostarczony do wątku.",
        },
        widget: {
          runningBatch: "Działa...",
          runningInteractive: "Uruchamianie interaktywnej sesji terminala...",
          escalated: "Działa w tle. Wynik zostanie dostarczony po zakończeniu.",
          taskIdLabel: "ID zadania",
          outputLabel: "Wyjście",
          interactiveSessionLaunched:
            "Interaktywna sesja uruchomiona w terminalu.",
          copyOutput: "Kopiuj",
          copied: "Skopiowano!",
          interactive: "Interaktywny",
          emptyPromptHint:
            "Wpisz zadanie poniżej, aby uruchomić agenta kodowania",
          agentNamePlaceholder: "Nazwa agenta (opcjonalnie)",
        },
      },
    },
    say: {
      post: {
        title: "Pokieruj agentem kodowania",
        titleShort: "Pokieruj agentem",
        description:
          "Wyślij wiadomość sterującą do działającego agenta Codex lub Antigravity. Po zakończeniu tury kontynuuj w coding-agent z tą samą nazwą.",
        success: {
          title: "Wiadomość dostarczona",
          description: "Wiadomość została przekazana do uruchomionego agenta.",
        },
        fields: {
          message: {
            label: "Wiadomość",
            description: "Wskazówka do wstrzyknięcia w bieżącą turę.",
          },
          messageFile: {
            label: "Plik z wiadomością",
            description:
              "Ścieżka do pliku z wiadomością względem bieżącego katalogu roboczego.",
          },
          delivered: {
            label: "Dostarczono",
          },
        },
      },
    },
    interrupt: {
      post: {
        title: "Przerwij pracę agenta kodowania",
        titleShort: "Przerwij agenta",
        description:
          "Zatrzymuje bieżącą turę agenta Codex lub Antigravity. Później możesz wznowić rozmowę pod tą samą nazwą.",
        success: {
          title: "Zlecono przerwanie",
          description: "Wysłano sygnał przerwania do agenta kodowania.",
        },
        fields: {
          interrupted: {
            label: "Wysłano przerwanie",
          },
          noInterrupt: {
            label: "Brak aktywnej tury",
          },
        },
      },
    },
    list: {
      post: {
        title: "Pokaż agentów kodowania",
        titleShort: "Lista agentów",
        description:
          "Pokazuje aktywnych i zapisanych agentów kodowania. Podaj nazwę, aby zobaczyć stan agenta, ostatnie wpisy dziennika i ostatnią odpowiedź.",
        success: {
          title: "Lista agentów gotowa",
          description: "Wczytano aktywnych i zapisanych agentów kodowania.",
        },
        fields: {
          summary: "{{name}} · {{provider}} · {{status}}",
          agents: {
            label: "Agenci",
          },
          noAgents: {
            label: "Brak trwałych agentów kodowania.",
          },
          lines: {
            label: "Wiersze dziennika",
            description:
              "Liczba ostatnich wierszy dziennika do zwrócenia dla wybranego agenta.",
          },
          tail: {
            label: "Ostatnie wpisy",
          },
          emptyTail: {
            label: "Dziennik jest pusty.",
          },
          lastMessage: {
            label: "Ostatnia odpowiedź",
          },
          lastError: {
            label: "Ostatni błąd",
          },
          startedAt: {
            label: "Rozpoczęto",
          },
          finishedAt: {
            label: "Zakończono",
          },
        },
      },
    },
  },
};
