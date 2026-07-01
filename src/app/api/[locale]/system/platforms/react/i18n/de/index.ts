import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  hooks: {
    localstorage: {
      noCallback: "Kein Callback für localStorage-Operation bereitgestellt",
    },
    apiUtils: {
      errors: {
        http_error: "HTTP-Fehler",
        validation_error: "Validierungsfehler",
        internal_error: "Interner Fehler",
        auth_required: "Authentifizierung erforderlich",
      },
    },
    mutationForm: {
      post: {
        errors: {
          mutation_failed: {
            title: "Mutation fehlgeschlagen",
          },
          validation_error: {
            title: "Validierungsfehler",
          },
        },
      },
    },
    queryForm: {
      errors: {
        network_failure: "Netzwerkfehler",
        validation_failed: "Validierung fehlgeschlagen",
      },
    },
    store: {
      errors: {
        validation_failed: "Validierung fehlgeschlagen",
        request_failed: "Anfrage fehlgeschlagen",
        mutation_failed: "Mutation fehlgeschlagen",
        unexpected_failure: "Unerwarteter Fehler",
        refetch_failed: "Erneutes Abrufen fehlgeschlagen",
      },
      status: {
        loading_data: "Daten werden geladen...",
        cached_data: "Zwischengespeicherte Daten werden verwendet",
        success: "Erfolgreich",
        mutation_pending: "Mutation ausstehend...",
        mutation_success: "Mutation erfolgreich",
      },
    },
  },
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
    rangeSlider: {
      min: "Min",
      max: "Max",
    },
    error: {
      title: "Fehler",
    },
    formField: {
      requiresContext:
        "Formularfeld erfordert Formularkontext und Feldkonfiguration",
    },
    formFields: {
      common: {
        required: "Erforderlich",
        enterPhoneNumber: "Telefonnummer eingeben",
        selectDate: "Datum wählen",
        unknownFieldType: "Unbekannter Feldtyp",
      },
      entityPicker: {
        select: "Auswählen",
        change: "Ändern",
        required: "Erforderlich",
        loading: "Wird geladen...",
        noItems: "Keine Einträge gefunden",
        useToFind: "Mit {{alias}} Einträge finden",
      },
      markdownTextarea: {
        edit: "Bearbeiten",
        preview: "Vorschau",
        toolbar: {
          bold: "Fett",
          italic: "Kursiv",
          strike: "Durchgestrichen",
          code: "Code",
          link: "Link",
          linkPrompt: "URL eingeben",
          heading1: "Überschrift 1",
          heading2: "Überschrift 2",
          heading3: "Überschrift 3",
          bulletList: "Aufzählung",
          orderedList: "Nummerierte Liste",
          blockquote: "Zitat",
          horizontalRule: "Trennlinie",
        },
      },
    },
    codeQualityFiles: {
      affectedFiles: "Betroffene Dateien",
    },
    codeQualitySummary: {
      summary: "Zusammenfassung",
      files: "Dateien",
      issues: "Probleme",
      errors: "Fehler",
      of: "von",
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
        waitingForTask: "Warte auf Aufgabe...",
        completeWaitForTask: "Abgeschlossen (gewartet)",
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
        runInBackground: "Im Hintergrund ausführen",
      },
      creditsUsed_one: "{{cost}} Guthaben",
      creditsUsed_other: "{{cost}} Guthaben",
    },
    codeQualityList: {
      noData: "Keine Code-Qualitätsprobleme gefunden",
      noIssues: "Keine Probleme gefunden",
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
