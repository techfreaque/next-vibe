import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    awaitTask: "Oczekuj na zadanie",
  },
  post: {
    title: "Oczekuj na zadanie",
    titleShort: "Oczekuj",
    description:
      "Czeka na uruchomione zadanie w tle. Zwraca wynik natychmiast jeśli ukończone, lub wstrzymuje strumień AI do czasu zakończenia.",
    fields: {
      taskId: {
        label: "ID zadania",
        description:
          "ID zadania zwrócone przez execute-tool (tryb detach lub wakeUp).",
      },
      status: {
        title: "Status",
        description: "Aktualny status zadania.",
      },
      result: {
        title: "Wynik",
        description: "Wyjście narzędzia (obecne po ukończeniu).",
      },
      waiting: {
        title: "Oczekiwanie",
        description: "True gdy strumień czeka na zakończenie zadania.",
      },
      originalToolName: {
        title: "Narzędzie",
        description: "Uruchomione narzędzie.",
      },
      originalArgs: {
        title: "Argumenty",
        description: "Argumenty wejściowe uruchomionego narzędzia.",
      },
    },
    widget: {
      noToolName: "Brak nazwy narzędzia.",
      resolving: "Rozwiązywanie narzędzia...",
      unknownTool: "Nieznane narzędzie: {{toolName}}",
    },
    status: {
      waiting: "Oczekiwanie",
      complete: "Ukończono",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe ID zadania",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagana autoryzacja",
      },
      internal: {
        title: "Błąd wewnętrzny",
        description: "Nie udało się zarejestrować oczekiwania",
      },
      forbidden: {
        title: "Zabronione",
        description: "Brak uprawnień do oczekiwania na to zadanie",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zadanie nie zostało znalezione",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      unsaved: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt stanu zadania",
      },
    },
    success: {
      title: "Gotowe",
      description: "Zadanie ukończone",
    },
  },
};
