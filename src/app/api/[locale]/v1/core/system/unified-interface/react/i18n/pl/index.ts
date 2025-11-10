import { translations as hooksTranslations } from "../../hooks/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  hooks: hooksTranslations,
  widgets: {
    container: {
      noContent: "Brak zawartości",
    },
    dataTable: {
      showing: "Wyświetlanie",
      of: "z",
      results: "wyników",
    },
    linkList: {
      noResults: "Nie znaleziono wyników",
    },
    link: {
      invalidData: "Nieprawidłowe dane linku",
    },
    markdown: {
      noContent: "Brak zawartości",
    },
    errorBoundary: {
      title: "Błąd widgetu",
      errorDetails: "Szczegóły błędu",
      defaultMessage: "Wystąpił błąd podczas renderowania tego widgetu",
    },
    toolCall: {
      status: {
        error: "Błąd",
        executing: "Wykonywanie...",
        complete: "Zakończono",
      },
      sections: {
        request: "Żądanie",
        response: "Odpowiedź",
      },
      messages: {
        executingTool: "Wykonywanie narzędzia...",
        errorLabel: "Błąd:",
        noArguments: "Brak argumentów",
        noResult: "Brak wyniku",
        metadataNotAvailable:
          "Metadane widgetu niedostępne. Pokazywanie surowych danych.",
      },
    },
  },
};
