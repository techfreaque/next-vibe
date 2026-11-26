import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  widgets: {
    errorBoundary: {
      title: "Etwas ist schiefgelaufen",
      defaultMessage: "Ein unerwarteter Fehler ist aufgetreten",
      errorDetails: "Fehlerdetails",
    },
    error: {
      title: "Fehler",
    },
    chart: {
      noDataAvailable: "Keine Daten verfügbar",
      noDataToDisplay: "Keine Daten zur Anzeige",
    },
    codeQualityFiles: {
      affectedFiles: "Betroffene Dateien",
      andMoreFiles: "... und {{count}} weitere Datei(en)",
    },
    codeQualityList: {
      noIssues: "Keine Probleme gefunden",
    },
    codeQualitySummary: {
      errors: "Fehler",
      files: "Dateien",
      issues: "Probleme",
      of: "von",
      summary: "Zusammenfassung",
    },
    container: {
      noContent: "Kein Inhalt",
    },
    endpointRenderer: {
      cancel: "Abbrechen",
      submit: "Absenden",
      submitting: "Wird gesendet...",
      showResults: "Ergebnisse anzeigen",
      saveChanges: "Änderungen speichern",
      saving: "Wird gespeichert...",
      result: "Ergebnis",
      fixFields: "Prüfe die markierten Felder und versuche es erneut.",
      hiddenInvalid:
        "„{{field}}“ fehlt oder ist ungültig. Lade die Seite neu und versuche es erneut.",
    },
    toolUnavailable: {
      permissionTitle: "Du hast keinen Zugriff auf dieses Tool",
      permissionMessage:
        "Deine Rolle kann es nicht öffnen. Bitte einen Inhaber dieses Workspaces um Zugriff.",
      instanceTitle: "Dieses Tool läuft nicht auf dieser Instanz",
      instanceMessage:
        "Es läuft auf einer anderen verbundenen Instanz. Wechsle die Instanz in der Seitenleiste, um es zu öffnen.",
      setupTitle: "Dieses Tool muss erst eingerichtet werden",
      setupMessage:
        "Eine Pflichteinstellung fehlt. Schließe die Einrichtung ab und öffne das Tool dann erneut.",
      unknownTitle: "Dieser Link führt zu keinem Tool",
      unknownMessage: "Der Link ist veraltet oder falsch geschrieben.",
    },
    recordState: {
      loading: "Wird geladen",
      notFoundMessage: "Der Eintrag wurde gelöscht oder der Link ist veraltet.",
      loadFailed: "{{title}} konnte nicht geladen werden",
      serverError:
        "Bei uns ist etwas schiefgelaufen. Versuche es gleich noch einmal.",
      technicalDetails: "Technische Details",
      moreActions: "Weitere Aktionen",
      more: "Mehr",
      confirmCancel: "Abbrechen",
      details: "Details",
      emptyTitle: "Noch keine Einträge",
      copy: "Kopieren",
    },
    formField: {
      requiresContext: "Dieses Feld erfordert Kontext",
    },
    markdown: {
      noContent: "Kein Inhalt",
    },
    pagination: {
      itemsPerPage: "Einträge pro Seite",
      page: "Seite",
      showing: "Zeige",
    },
    rangeSlider: {
      max: "Max",
      min: "Min",
    },
    toolCall: {
      creditsUsed_one: "{{count}} Credit verwendet",
      creditsUsed_other: "{{count}} Credits verwendet",
      actions: {
        confirm: "Bestätigen",
        deny: "Ablehnen",
        runInBackground: "Im Hintergrund ausführen",
        resumeWhenDone: "Nach Abschluss fortsetzen",
      },
      status: {
        complete: "Abgeschlossen",
        confirmed: "Bestätigt",
        confirmedWakeUp: "Bestätigt (Aktivierung)",
        deferred: "Verschoben",
        denied: "Abgelehnt",
        deniedWakeUp: "Abgelehnt (Aktivierung)",
        error: "Fehler",
        executing: "Wird ausgeführt",
        pendingCancellation: "Abbruch ausstehend",
        pendingConfirmation: "Bestätigung ausstehend",
        sentToBackground: "In den Hintergrund verschoben",
        waitingForConfirmation: "Warte auf Bestätigung",
        waitingForConfirmationWakeUp: "Warte auf Bestätigung (Aktivierung)",
        waitingForRemote: "Warte auf Remote",
        wakeUpBackground: "Aktivierung (Hintergrund)",
      },
      messages: {
        confirmationRequired: "Bestätigung erforderlich",
        confirmationRequiredWakeUp: "Bestätigung erforderlich (Aktivierung)",
        deferredResult: "Verschobenes Ergebnis",
        errorLabel: "Fehler",
        executingTool: "Tool wird ausgeführt...",
      },
    },
    formFields: {
      common: {
        enterPhoneNumber: "Telefonnummer eingeben",
        required: "Pflichtfeld",
        selectDate: "Datum auswählen",
        openCalendar: "Kalender öffnen",
        time: "Uhrzeit",
        startDate: "Startdatum",
        endDate: "Enddatum",
        decreaseValue: "Wert verringern",
        increaseValue: "Wert erhöhen",
        unknownFieldType: "Unbekannter Feldtyp",
      },
      entityPicker: {
        change: "Ändern",
        loading: "Lädt...",
        noItems: "Keine Einträge gefunden",
        required: "Pflichtfeld",
        select: "Auswählen...",
        selectLabel: "{{label}} auswählen",
        useToFind: "Mit {{alias}} finden",
      },
      markdownTextarea: {
        edit: "Bearbeiten",
        preview: "Vorschau",
        toolbar: {
          blockquote: "Zitat",
          bold: "Fett",
          bulletList: "Aufzählung",
          code: "Code",
          heading1: "Überschrift 1",
          heading2: "Überschrift 2",
          heading3: "Überschrift 3",
          horizontalRule: "Trennlinie",
          italic: "Kursiv",
          link: "Link",
          linkPrompt: "URL eingeben",
          orderedList: "Nummerierte Liste",
          strike: "Durchgestrichen",
        },
      },
    },
  },
  formErrors: {
    required: "Bitte einen Wert eingeben",
    invalid: "Dieser Wert ist ungültig",
    minLength: "Mindestens {{min}} Zeichen",
    maxLength: "Höchstens {{max}} Zeichen",
    minNumber: "Mindestens {{min}} eingeben",
    maxNumber: "Höchstens {{max}} eingeben",
    minItems: "Mindestens {{min}} hinzufügen",
    email: "Gültige E-Mail-Adresse eingeben",
    url: "Vollständigen Link eingeben, z. B. https://example.com",
    choose: "Eine der Optionen wählen",
  },
  localstorage: {
    noCallback: "Kein Callback für localStorage-Operation bereitgestellt",
  },
  apiUtils: {
    errors: {
      http_error: "HTTP-Fehler",
      validation_error: "Validierungsfehler",
      internal_error: "Interner Fehler",
      auth_required: "Authentifizierung erforderlich",
      missingUrlParam: 'URL-Parameter "{{param}}" fehlt für {{path}}',
      httpStatus: "Anfrage an {{url}} mit Status {{status}} fehlgeschlagen",
      responseValidation: "Serverantwort ist ungültig: {{error}}",
      malformedResponse: "Fehlerhafte Antwort von {{url}}",
      recordTimeout:
        "Das Laden dieses Eintrags dauert zu lange. Versuchen Sie es erneut.",
      requestFailed: "Anfrage an {{path}} fehlgeschlagen: {{error}}",
      endpointFailed: "{{reason}} — {{path}}: {{error}}",
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
          detail: "Formularprüfung fehlgeschlagen: {{errors}}",
        },
      },
    },
  },
  queryForm: {
    errors: {
      network_failure: "Netzwerkfehler im Formular {{formId}}: {{error}}",
      validation_failed: "Validierung fehlgeschlagen",
      validationFailedDetail:
        "Validierung im Formular {{formId}} fehlgeschlagen: {{error}}",
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
};
