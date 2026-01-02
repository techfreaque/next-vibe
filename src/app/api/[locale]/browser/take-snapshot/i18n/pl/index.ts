import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Zrób snapshot",
  description: "Zrób tekstowy snapshot aktualnie wybranej strony na podstawie drzewa dostępności",
  form: {
    label: "Zrób snapshot",
    description: "Przechwyć tekstowy snapshot strony przeglądarki na podstawie drzewa a11y",
    fields: {
      verbose: {
        label: "Szczegółowy",
        description:
          "Czy dołączyć wszystkie dostępne informacje w pełnym drzewie a11y (domyślnie: false)",
        placeholder: "false",
      },
      filePath: {
        label: "Ścieżka pliku",
        description:
          "Ścieżka bezwzględna lub względna do bieżącego katalogu roboczego, aby zapisać snapshot zamiast dołączać go do odpowiedzi",
        placeholder: "/ścieżka/do/snapshot.txt",
      },
    },
  },
  response: {
    success: "Snapshot przechwycony pomyślnie",
    result: "Wynik przechwytywania snapshot",
    error: "Komunikat błędu",
    executionId: "ID wykonania do śledzenia",
  },
  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Sprawdź wprowadzone dane i spróbuj ponownie",
    },
    network: {
      title: "Błąd sieci",
      description: "Wystąpił błąd sieci podczas przechwytywania snapshot",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Nie masz uprawnień do przechwytywania snapshot",
    },
    forbidden: {
      title: "Zabronione",
      description: "Przechwytywanie snapshot jest zabronione",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Żądany zasób nie został znaleziony",
    },
    serverError: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera podczas przechwytywania snapshot",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas przechwytywania snapshot",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany, które mogą zostać utracone",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt podczas przechwytywania snapshot",
    },
  },
  success: {
    title: "Snapshot przechwycony pomyślnie",
    description: "Snapshot został pomyślnie przechwycony",
  },
};
