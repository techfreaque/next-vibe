import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  executeTool: {
    post: {
      title: "Wykonaj narzędzie",
      titleShort: "Wykonaj narzędzie",
      dynamicTitle: "Execute: {{toolName}}",
      description:
        "Wykonuje dowolny zarejestrowany punkt końcowy według nazwy. Przekaż nazwę narzędzia i parametry wejściowe. Docelowa trasa egzekwuje własne uwierzytelnienie.",
      container: {
        title: "Wykonanie narzędzia",
        description: "Nazwa trasy i parametry wejściowe",
      },
      fields: {
        toolName: {
          label: "Nazwa narzędzia",
          description:
            "Zarejestrowana nazwa narzędzia lub alias (np. 'agent_chat_characters_GET'). Użyj system_help_GET aby odkryć dostępne narzędzia.",
          placeholder: "agent_chat_characters_GET",
        },
        input: {
          label: "Dane wejściowe",
          description:
            "Parametry wejściowe jako obiekt JSON. Parametry ścieżki URL są automatycznie wyodrębniane.",
        },
        instanceId: {
          label: "ID instancji",
          description:
            'Opcjonalne ID zdalnej instancji. Gdy ustawione, tworzy asynchroniczne zadanie na zdalnej instancji. Wynik: {taskId, status:"pending"}.',
        },
        callbackMode: {
          label: "Tryb wywołania zwrotnego",
          description:
            'Jak obsługiwać wynik asynchroniczny. "wait": czekaj aż gotowe, "task-done": zwróć taskId natychmiast, "inject": wstaw wynik do bieżącego wątku.',
        },
      },
      response: {
        result:
          "Dane wynikowe zwrócone przez docelową trasę. W przypadku błędu pole to jest nieobecne - sama odpowiedź zawiera błąd.",
        resultLabel: "Wynik",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "toolName lub parametry wejściowe są nieprawidłowe",
        },
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Wymagane uwierzytelnienie",
        },
        forbidden: {
          title: "Zabronione",
          description: "Odmowa dostępu",
        },
        notFound: {
          title: "Narzędzie nie znalezione",
          description: "Brak zarejestrowanego narzędzia o podanej nazwie",
          detail:
            'Narzędzie "{{toolName}}" nie znalezione. Nie powtarzaj — sprawdź dostępne narzędzia przez tool-help.',
        },
        remoteFailed: {
          title: "Zdalne narzędzie zawiodło: {{message}}",
          description:
            "Zdalna instancja odrzuciła wywołanie lub zakończyło się błędem",
          detail: 'Zdalne narzędzie "{{toolName}}" zawiodło: {{message}}',
        },
        server: {
          title: "Błąd wykonania",
          description: "Docelowa trasa napotkała błąd serwera",
        },
        network: {
          title: "Błąd sieci",
          description: "Błąd sieci podczas wykonania",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
          detail: "Nieznany błąd podczas wykonania: {{error}}",
        },
      },
      success: {
        title: "Narzędzie wykonane",
        description: "Narzędzie zostało wykonane pomyślnie",
      },
      widget: {
        enterToolName: "Wprowadź nazwę narzędzia, aby załadować formularz.",
        resolving: "Rozwiązywanie punktu końcowego…",
        unknownTool: "Nieznane narzędzie: {{toolName}}",
      },
      actions: {
        confirm: "Potwierdź",
        cancel: "Anuluj",
      },
    },
  },
  dismissTask: {
    post: {
      title: "Odrzuć zadanie",
      titleShort: "Odrzuć",
      description:
        "Anuluje oczekujące wznowienie wakeUp. Narzędzie działa dalej w tle, wątek zostaje natychmiast odblokowany. Wynik jest cicho odrzucany po zakończeniu.",
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "callId jest wymagany",
        },
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Wymagane uwierzytelnienie",
        },
        forbidden: {
          title: "Zabronione",
          description: "Odmowa dostępu",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Brak oczekującego wywołania dla tego callId",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się odrzucić oczekującego wywołania",
        },
        network: {
          title: "Błąd sieci",
          description: "Błąd sieci podczas odrzucania zadania",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
      },
      success: {
        title: "Zadanie odrzucone",
        description: "Wątek odblokowany. Narzędzie działa dalej w tle.",
      },
    },
  },
  cancelTool: {
    post: {
      title: "Anuluj wywołanie narzędzia",
      titleShort: "Anuluj narzędzie",
      description:
        "Przerywa trwające wywołanie narzędzia po callId. Wywołanie zatrzymuje się i zwraca błąd jako wynik; tura i równoległe wywołania narzędzi działają dalej.",
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "callId jest wymagane",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagane uwierzytelnienie",
        },
        forbidden: { title: "Zabronione", description: "Odmowa dostępu" },
        notFound: {
          title: "Nie znaleziono",
          description: "Brak trwającego wywołania dla tego callId",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się anulować wywołania narzędzia",
        },
        network: {
          title: "Błąd sieci",
          description: "Błąd sieci podczas anulowania",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
      },
      success: {
        title: "Wywołanie narzędzia anulowane",
        description: "Trwające wywołanie narzędzia zostało przerwane.",
      },
    },
  },
  detachCall: {
    post: {
      title: "Odłącz wywołanie narzędzia",
      titleShort: "Odłącz wywołanie",
      description:
        "Podnosi trwające wywołanie narzędzia po callId do odłączonego: działa dalej w tle, jego wynik jest odrzucany, a tura zostaje natychmiast odblokowana. Użyj resume-when-done, jeśli potrzebujesz wyniku.",
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "callId jest wymagane",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagane uwierzytelnienie",
        },
        forbidden: { title: "Zabronione", description: "Odmowa dostępu" },
        notFound: {
          title: "Nie znaleziono",
          description: "Brak trwającego wywołania dla tego callId",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się odłączyć wywołania narzędzia",
        },
        network: {
          title: "Błąd sieci",
          description: "Błąd sieci podczas odłączania",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
      },
      success: {
        title: "Wywołanie narzędzia odłączone",
        description: "Wywołanie działa dalej w tle; jego wynik jest odrzucany.",
      },
    },
  },
  resumeWhenDone: {
    post: {
      title: "Przenieś wywołanie narzędzia w tło",
      titleShort: "Narzędzie w tle",
      description:
        "Pozwala trwającemu wywołaniu narzędzia dokończyć w tle po callId. Tura się kończy, a wątek budzi się z wynikiem po zakończeniu pracy.",
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "callId jest wymagane",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagane uwierzytelnienie",
        },
        forbidden: { title: "Zabronione", description: "Odmowa dostępu" },
        notFound: {
          title: "Nie znaleziono",
          description: "Brak trwającego wywołania dla tego callId",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się przenieść wywołania w tło",
        },
        network: {
          title: "Błąd sieci",
          description: "Błąd sieci podczas przenoszenia",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
      },
      success: {
        title: "Wywołanie narzędzia w tle",
        description: "Wywołanie narzędzia działa dalej w tle.",
      },
    },
  },
  tools: {
    get: {
      title: "Pomoc narzędzi - odkryj dostępne narzędzia AI",
      description:
        "Wyszukuj i odkrywaj wszystkie dostępne narzędzia AI. Użyj query do wyszukiwania, category do filtrowania.",
      category: "Narzędzia AI",
      tags: {
        tools: "narzędzia",
      },
    },
  },
  executor: {
    errors: {
      toolNotFound: "Narzędzie nie znalezione: {{toolName}}",
      parameterValidationFailed:
        "Walidacja parametrów nie powiodła się: {{errors}}",
      executionFailed: "Wykonanie narzędzia nie powiodło się",
    },
  },
  factory: {
    errors: {
      executionFailed: "Wykonanie narzędzia nie powiodło się",
    },
    descriptions: {
      noParametersRequired:
        "Brak wymaganych parametrów dla tego punktu końcowego",
    },
  },
  converter: {
    constants: {
      examplePrefix: "\n\nPrzykład: ",
      underscore: "_",
      dollarOne: "$1",
      dollarTwo: "$2",
      space: " ",
      endpointForPrefix: "Punkt końcowy dla ",
      hiddenPlaceholder: "[ukryty]",
    },
  },
  discovery: {
    constants: {
      underscore: "_",
      dollarOne: "$1",
      dollarTwo: "$2",
    },
  },
  registry: {
    errors: {
      initializationFailed: "Inicjalizacja rejestru narzędzi nie powiodła się",
    },
  },
};
