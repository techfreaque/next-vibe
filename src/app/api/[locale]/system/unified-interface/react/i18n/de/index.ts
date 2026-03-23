import { translations as hooksTranslations } from "../../hooks/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  hooks: hooksTranslations,
  widgets: {
    endpointRenderer: {
      submit: "Absenden",
      submitting: "Wird gesendet...",
      cancel: "Abbrechen",
    },
    container: {
      noContent: "Kein Inhalt",
    },
    dataTable: {
      showingResults: "Zeige {{count}} von {{total}} Ergebnisse",
      noData: "Keine Daten verfügbar",
    },
    dataList: {
      noData: "Keine Daten verfügbar",
      showMore: "{{count}} weitere anzeigen",
      showLess: "Weniger anzeigen",
      viewList: "Listenansicht",
      viewGrid: "Rasteransicht",
    },
    groupedList: {
      showMore: "{{count}} weitere anzeigen",
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
    filterPills: {
      requiresContext:
        "Filter-Pills-Widget erfordert Formularkontext und Feldname",
    },
    toolCall: {
      status: {
        error: "Fehler",
        executing: "Wird ausgeführt...",
        complete: "Abgeschlossen",
        sentToBackground: "Im Hintergrund gesendet",
        wakeUpBackground: "Hintergrundaufgabe - KI wird mit Ergebnis geweckt",
        waitingForRemote: "Wartet auf Remote...",
        deferred: "Async-Ergebnis",
        confirmed: "Von Ihnen bestätigt",
        confirmedWakeUp: "Bestätigt - läuft im Hintergrund",
        waitingForConfirmation: "Wartet auf Bestätigung",
        waitingForConfirmationWakeUp: "Bestätigen zum Ausführen im Hintergrund",
        pendingConfirmation: "Bestätigung ausstehend",
        pendingCancellation: "Stornierung ausstehend",
        denied: "Abgelehnt",
        deniedWakeUp: "Abgelehnt - wird nicht im Hintergrund ausgeführt",
        notRun: "Nicht ausgeführt",
      },
      sections: {
        request: "Anfrage",
        response: "Antwort",
      },
      messages: {
        executingTool: "Tool wird ausgeführt...",
        deferredResult:
          "Dieses Ergebnis ist asynchron nach dem Ende des ursprünglichen Streams angekommen.",
        taskId: "Aufgaben-ID:",
        errorLabel: "Fehler:",
        noArguments: "Keine Argumente",
        noResult: "Kein Ergebnis",
        metadataNotAvailable:
          "Widget-Metadaten nicht verfügbar. Zeige Rohdaten.",
        confirmationRequired:
          "Parameter prüfen und bearbeiten, dann bestätigen.",
        confirmationRequiredWakeUp:
          "Parameter prüfen und bearbeiten, dann bestätigen - Ergebnis weckt KI auf.",
      },
      actions: {
        confirm: "Bestätigen",
        cancel: "Abbrechen",
        deny: "Ablehnen",
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
      total: "Gesamt",
    },
    creditTransactionList: {
      invalidConfig: "Ungültige Konfiguration für Kredit-Transaktionsliste",
      noTransactions: "Keine Transaktionen gefunden",
    },
    pagination: {
      showing: "Zeige {{start}}-{{end}} von {{total}} Einträgen",
      itemsPerPage: "Einträge pro Seite",
      page: "Seite {{current}} von {{total}}",
    },
  },
};
