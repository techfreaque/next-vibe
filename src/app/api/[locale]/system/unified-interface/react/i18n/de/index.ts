import { translations as hooksTranslations } from "../../hooks/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  hooks: hooksTranslations,
  widgets: {
    endpointRenderer: {
      submit: "Absenden",
      submitting: "Wird gesendet...",
    },
    container: {
      noContent: "Kein Inhalt",
    },
    dataTable: {
      showing: "Zeige",
      of: "von",
      results: "Ergebnisse",
      noData: "Keine Daten verfügbar",
    },
    dataList: {
      noData: "Keine Daten verfügbar",
      showMore: "{{count}} weitere anzeigen",
      showLess: "Weniger anzeigen",
      viewList: "Listenansicht",
      viewGrid: "Rasteransicht",
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
    formField: {
      requiresContext:
        "Formularfeld erfordert Formularkontext und Feldkonfiguration",
    },
    toolCall: {
      status: {
        error: "Fehler",
        executing: "Wird ausgeführt...",
        complete: "Abgeschlossen",
        waitingForConfirmation: "Wartet auf Bestätigung",
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
        confirmationRequired: "Parameter prüfen und bearbeiten, dann bestätigen.",
      },
      actions: {
        confirm: "Bestätigen",
        cancel: "Abbrechen",
      },
    },
    codeQualityList: {
      noData: "Keine Code-Qualitätsprobleme gefunden",
      rule: "Regel: {{rule}}",
    },
    section: {
      noData: "Keine Abschnittsdaten verfügbar",
    },
    title: {
      noData: "Keine Titeldaten verfügbar",
    },
    chart: {
      noDataAvailable: "Keine Daten verfügbar",
      noDataToDisplay: "Keine Daten anzuzeigen",
    },
  },
};
