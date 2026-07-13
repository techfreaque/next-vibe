import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  error: {
    title: "Fehler",
    message: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
    general: {
      unknown_validation_error:
        "Ein unbekannter Validierungsfehler ist aufgetreten.",
    },
  },
  errorTypes: {
    auth_error: "Authentifizierungsfehler",
    bad_request: "Ungültige Anfrage",
    database_error: "Datenbankfehler",
    email_error: "E-Mail-Fehler",
    external_service_error: "Fehler eines externen Dienstes",
    forbidden: "Verboten",
    http_error: "HTTP-Fehler",
    internal_error: "Interner Fehler",
    invalid_credentials_error: "Ungültige Anmeldedaten",
    invalid_data_error: "Ungültige Daten",
    invalid_format_error: "Ungültiges Format",
    invalid_input_error: "Ungültige Eingabe",
    invalid_method_error: "Ungültige Methode",
    invalid_parameter_error: "Ungültiger Parameter",
    invalid_path_error: "Ungültiger Pfad",
    invalid_payload_error: "Ungültige Nutzlast",
    invalid_query_error: "Ungültige Abfrage",
    invalid_request_error: "Ungültige Anfrage",
    invalid_response_error: "Ungültige Antwort",
    invalid_status_error: "Ungültiger Status",
    invalid_token_error: "Ungültiges Token",
    invalid_url_error: "Ungültige URL",
    no_response_data: "Keine Antwortdaten",
    not_found: "Nicht gefunden",
    partial_failure: "Teilweise fehlgeschlagen",
    payment_failed: "Zahlung fehlgeschlagen",
    payment_required: "Zahlung erforderlich",
    permission_denied: "Zugriff verweigert",
    permission_error: "Berechtigungsfehler",
    sms_error: "SMS-Fehler",
    token_expired_error: "Token abgelaufen",
    two_factor_required: "Zwei-Faktor-Authentifizierung erforderlich",
    unauthorized: "Nicht autorisiert",
    unknown_error: "Unbekannter Fehler",
    validation_error: "Validierungsfehler",
  },
  stats: {
    chartType: {
      area: "Fläche",
      bar: "Balken",
      donut: "Ring",
      line: "Linie",
      pie: "Kreis",
    },
    dateRange: {
      custom: "Benutzerdefiniert",
      last30Days: "Letzte 30 Tage",
      last7Days: "Letzte 7 Tage",
      last90Days: "Letzte 90 Tage",
      lastMonth: "Letzter Monat",
      lastQuarter: "Letztes Quartal",
      lastWeek: "Letzte Woche",
      lastYear: "Letztes Jahr",
      thisMonth: "Dieser Monat",
      thisQuarter: "Dieses Quartal",
      thisWeek: "Diese Woche",
      thisYear: "Dieses Jahr",
      today: "Heute",
      yesterday: "Gestern",
    },
    timePeriod: {
      day: "Tag",
      month: "Monat",
      quarter: "Quartal",
      week: "Woche",
      year: "Jahr",
    },
  },
  errors: {
    invalid_request_data: "Ungültige Anfragedaten",
    serverError: {
      description:
        "Ein Serverfehler ist aufgetreten. Bitte versuchen Sie es erneut.",
    },
    validationFailed: {
      description:
        "Validierung fehlgeschlagen. Bitte überprüfen Sie Ihre Eingabe.",
    },
  },
  cli: {
    vibe: {
      errors: {
        routeNotFound: "Route für Tool nicht gefunden: {{toolName}}",
        executionFailed: "Ausführung fehlgeschlagen",
        unknownError: "Ein unbekannter Fehler ist aufgetreten",
      },
    },
  },
  shared: {
    permissions: {
      errors: {
        definitionError: "Fehler in der Endpunkt-Definition",
        platformAccessDenied: "Zugriff auf {{platform}} verweigert: {{reason}}",
        insufficientRoles:
          "Benutzer {{userId}} fehlen erforderliche Rollen: {{requiredRoles}}",
      },
    },
    endpoints: {
      definition: {
        loader: {
          errors: {
            endpointNotFound: "Endpunkt nicht gefunden",
            loadFailed: "Endpunkt konnte nicht geladen werden",
            batchLoadFailed: "Endpunkte konnten nicht geladen werden",
          },
        },
      },
    },
  },
  utils: {
    parseJsonWithComments: {
      errors: {
        invalid_json: "Ungültiges JSON",
      },
    },
    time: {
      errors: {
        invalid_time_format: {
          title: "Ungültiges Zeitformat",
        },
        invalid_time_range: {
          title: "Ungültiger Zeitbereich",
        },
      },
    },
  },
};
