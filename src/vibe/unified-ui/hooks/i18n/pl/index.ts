import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  widgets: {
    errorBoundary: {
      title: "Coś poszło nie tak",
      defaultMessage: "Wystąpił nieoczekiwany błąd",
      errorDetails: "Szczegóły błędu",
    },
    error: {
      title: "Błąd",
    },
    chart: {
      noDataAvailable: "Brak danych",
      noDataToDisplay: "Brak danych do wyświetlenia",
    },
    codeQualityFiles: {
      affectedFiles: "Dotknięte pliki",
      andMoreFiles: "... i jeszcze {{count}} plik(ów)",
    },
    codeQualityList: {
      noIssues: "Brak problemów",
    },
    codeQualitySummary: {
      errors: "Błędy",
      files: "Pliki",
      issues: "Problemy",
      of: "z",
      summary: "Podsumowanie",
    },
    container: {
      noContent: "Brak treści",
    },
    endpointRenderer: {
      cancel: "Anuluj",
      submit: "Wyślij",
      submitting: "Wysyłanie...",
    },
    formField: {
      requiresContext: "To pole wymaga kontekstu",
    },
    markdown: {
      noContent: "Brak treści",
    },
    pagination: {
      itemsPerPage: "Elementów na stronę",
      page: "Strona",
      showing: "Wyświetlanie",
    },
    rangeSlider: {
      max: "Maks",
      min: "Min",
    },
    toolCall: {
      creditsUsed_one: "Wykorzystano {{count}} kredyt",
      creditsUsed_other: "Wykorzystano {{count}} kredytów",
      actions: {
        confirm: "Potwierdź",
        deny: "Odmów",
        runInBackground: "Uruchom w tle",
        resumeWhenDone: "Wznowien po ukończeniu",
      },
      status: {
        complete: "Zakończono",
        confirmed: "Potwierdzone",
        confirmedWakeUp: "Potwierdzone (wybudzenie)",
        deferred: "Odroczone",
        denied: "Odmowa",
        deniedWakeUp: "Odmowa (wybudzenie)",
        error: "Błąd",
        executing: "Wykonywanie",
        pendingCancellation: "Oczekuje na anulowanie",
        pendingConfirmation: "Oczekuje na potwierdzenie",
        sentToBackground: "Wysłano do tła",
        waitingForConfirmation: "Oczekiwanie na potwierdzenie",
        waitingForConfirmationWakeUp:
          "Oczekiwanie na potwierdzenie (wybudzenie)",
        waitingForRemote: "Oczekiwanie na zdalne",
        wakeUpBackground: "Wybudzenie (tło)",
      },
      messages: {
        confirmationRequired: "Wymagane potwierdzenie",
        confirmationRequiredWakeUp: "Wymagane potwierdzenie (wybudzenie)",
        deferredResult: "Odroczone wyniki",
        errorLabel: "Błąd",
        executingTool: "Wykonywanie narzędzia...",
      },
    },
    formFields: {
      common: {
        enterPhoneNumber: "Podaj numer telefonu",
        required: "Wymagane",
        selectDate: "Wybierz datę",
        unknownFieldType: "Nieznany typ pola",
      },
      entityPicker: {
        change: "Zmień",
        loading: "Ładowanie...",
        noItems: "Brak wyników",
        required: "Wymagane",
        select: "Wybierz...",
        useToFind: "Użyj do wyszukania",
      },
      markdownTextarea: {
        edit: "Edytuj",
        preview: "Podgląd",
        toolbar: {
          blockquote: "Cytat",
          bold: "Pogrubienie",
          bulletList: "Lista punktowana",
          code: "Kod",
          heading1: "Nagłówek 1",
          heading2: "Nagłówek 2",
          heading3: "Nagłówek 3",
          horizontalRule: "Linia pozioma",
          italic: "Kursywa",
          link: "Link",
          linkPrompt: "Podaj URL",
          orderedList: "Lista numerowana",
          strike: "Przekreślenie",
        },
      },
    },
  },
  localstorage: {
    noCallback: "Brak callbacka dla operacji localStorage",
  },
  apiUtils: {
    errors: {
      http_error: "Błąd HTTP",
      validation_error: "Błąd walidacji",
      internal_error: "Błąd wewnętrzny",
      auth_required: "Wymagana autoryzacja",
      missingUrlParam: 'Brakuje parametru URL "{{param}}" dla {{path}}',
      httpStatus: "Żądanie do {{url}} zakończone statusem {{status}}",
      responseValidation: "Odpowiedź serwera nie przeszła walidacji: {{error}}",
      malformedResponse: "Błędna odpowiedź z {{url}}",
      requestFailed: "Żądanie do {{path}} nie powiodło się: {{error}}",
      endpointFailed: "{{reason}} — {{path}}: {{error}}",
    },
  },
  mutationForm: {
    post: {
      errors: {
        mutation_failed: {
          title: "Mutacja nie powiodła się",
        },
        validation_error: {
          title: "Błąd walidacji",
          detail: "Walidacja formularza nie powiodła się: {{errors}}",
        },
      },
    },
  },
  queryForm: {
    errors: {
      network_failure: "Błąd sieci w formularzu {{formId}}: {{error}}",
      validation_failed: "Walidacja nie powiodła się",
      validationFailedDetail:
        "Walidacja w formularzu {{formId}} nie powiodła się: {{error}}",
    },
  },
  store: {
    errors: {
      validation_failed: "Walidacja nie powiodła się",
      request_failed: "Żądanie nie powiodło się",
      mutation_failed: "Mutacja nie powiodła się",
      unexpected_failure: "Nieoczekiwany błąd",
      refetch_failed: "Ponowne pobieranie nie powiodło się",
    },
    status: {
      loading_data: "Ładowanie danych...",
      cached_data: "Używanie danych z pamięci podręcznej",
      success: "Sukces",
      mutation_pending: "Mutacja w toku...",
      mutation_success: "Mutacja zakończona sukcesem",
    },
  },
};
