import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  error: {
    title: "Errore",
    message: "Si è verificato un errore. Per favore, riprovate.",
    general: {
      unknown_validation_error:
        "Si è verificato un errore di validazione sconosciuto.",
    },
  },
  errorTypes: {
    auth_error: "Errore di autenticazione",
    bad_request: "Cattiva richiesta",
    database_error: "Errore del database",
    email_error: "Errore e-mail",
    external_service_error: "Errore di servizio esterno",
    forbidden: "Accesso negato",
    http_error: "Errore di HTTP",
    internal_error: "Errore interno",
    invalid_credentials_error: "credenziali non valide",
    invalid_data_error: "Dati non validi",
    invalid_format_error: "Formato non valido",
    invalid_input_error: "Input non valido",
    invalid_method_error: "Metodo non valido",
    invalid_parameter_error: "Parametro non valido",
    invalid_path_error: "Percorso non valido",
    invalid_payload_error: "Carico di pagamento non valido",
    invalid_query_error: "Domanda non valida",
    invalid_request_error: "Richiesta non valida",
    invalid_response_error: "Risposta non valida",
    invalid_status_error: "Stato non valido",
    invalid_token_error: "Token non valido",
    invalid_url_error: "Invalid URL",
    no_response_data: "Nessun dato di risposta",
    not_found: "Account o sessione non trovati",
    partial_failure: "Insufficienza parziale",
    payment_failed: "Pagamento fallito",
    payment_required: "Pagamento richiesto",
    permission_denied: "Permesso negato",
    permission_error: "Errore di autorizzazione",
    sms_error: "Errore di SMS",
    token_expired_error: "Token scaduto",
    email_confirmation_required: "Codice di conferma via email",
    two_factor_required: "Richiesta di autenticazione a due fattori",
    unauthorized: "Autenticazione richiesta",
    unknown_error: "Errore sconosciuto",
    validation_error: "Errore di convalida",
  },
  stats: {
    chartType: {
      area: "Settore",
      bar: "Bar",
      donut: "Ciambella.",
      line: "Linea",
      pie: "Torta",
    },
    dateRange: {
      custom: "Personalizzato",
      last30Days: "Ultimi 30 giorni",
      last7Days: "Ultimi 7 giorni",
      last90Days: "Ultimi 90 giorni",
      lastMonth: "Il mese scorso",
      lastQuarter: "Ultimo trimestre",
      lastWeek: "La settimana scorsa",
      lastYear: "Ultimo anno",
      thisMonth: "Questo mese",
      thisQuarter: "Questo trimestre",
      thisWeek: "Questa settimana",
      thisYear: "Quest'anno",
      today: "Oggi",
      yesterday:
        "Ieri, ieri, ieri, ieri sera, ieri, ieri, ieri, ieri, ieri, ieri, ieri, ieri, ieri, ieri, ieri, ieri, ieri",
    },
    timePeriod: {
      day: "Giorno",
      month: "Mese",
      quarter: "Quartiere",
      week: "Rassegna",
      year: "Anno",
    },
  },
  errors: {
    invalid_request_data: "Dati di richiesta non validi",
    serverError: {
      description:
        "Si è verificato un errore del server. Per favore, riprovate.",
    },
    validationFailed: {
      description:
        "La convalida è fallita. Si prega di controllare il vostro input.",
    },
  },
  cli: {
    vibe: {
      errors: {
        routeNotFound: "Percorso non trovato per strumento: {{toolName}}",
        routeUnavailableOnServer:
          "{{toolName}} funziona solo nella CLI di vibe. Questo server non lo offre.",
        executionFailed: "Esecuzione fallita",
        // Bare label - the CLI error formatter renders it param-free as its
        // last-resort fallback, so the cause gets its own key.
        unknownError: "Si è verificato un errore sconosciuto",
        unknownErrorDetail: "Si è verificato un errore sconosciuto: {{error}}",
      },
    },
  },
  shared: {
    permissions: {
      errors: {
        definitionError: "Errore di definizione di endpoint",
        platformAccessDenied: "Accesso negato su {{platform}}: {{reason}}",
        insufficientRoles:
          "L'utente {{userId}} non ha ruoli richiesti: {{requiredRoles}}",
      },
    },
    endpoints: {
      definition: {
        loader: {
          errors: {
            endpointNotFound: "Endpoint non trovato",
            loadFailed: "Non caricate l'endpoint",
            batchLoadFailed: "Non caricate gli endpoint",
          },
        },
      },
    },
  },
  utils: {
    parseJsonWithComments: {
      errors: {
        invalid_json: "Invalid JSON",
      },
    },
    time: {
      errors: {
        invalid_time_format: {
          title: "Formato orario non valido",
        },
        invalid_time_range: {
          title: "intervallo di tempo non valido",
        },
      },
    },
  },
};
