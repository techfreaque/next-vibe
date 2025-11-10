import { translations as hooksTranslations } from "../../hooks/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  hooks: hooksTranslations,
  widgets: {
    container: {
      noContent: "Kein Inhalt",
    },
    dataTable: {
      showing: "Zeige",
      of: "von",
      results: "Ergebnisse",
    },
    linkList: {
      noResults: "Keine Ergebnisse gefunden",
    },
    link: {
      invalidData: "Ungültige Link-Daten",
    },
    markdown: {
      noContent: "Kein Inhalt",
    },
    errorBoundary: {
      title: "Widget-Fehler",
      errorDetails: "Fehlerdetails",
      defaultMessage: "Beim Rendern dieses Widgets ist ein Fehler aufgetreten",
    },
    toolCall: {
      status: {
        error: "Fehler",
        executing: "Wird ausgeführt...",
        complete: "Abgeschlossen",
      },
      sections: {
        request: "Anfrage",
        response: "Antwort",
      },
      messages: {
        executingTool: "Tool wird ausgeführt...",
        errorLabel: "Fehler:",
        noArguments: "Keine Argumente",
        noResult: "Kein Ergebnis",
        metadataNotAvailable:
          "Widget-Metadaten nicht verfügbar. Zeige Rohdaten.",
      },
    },
  },
};
