import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errorTypes: {
    auth_error: "Errore di autenticazione",
    bad_request: "Cattiva richiesta",
    conflict: "Conflitto",
    purchased_model_required:
      "Per questo modello servono crediti a pagamento. Scegli un modello gratuito o acquista crediti.",
    shared_allowance_reached:
      "I crediti gratuiti condivisi sono esauriti. Acquista crediti o attendi il rinnovo della quota.",
    consent_required: "Consenso richiesto",
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
    // Detailed variants. The bare labels above and every `errorTypes.*` entry
    // double as generic, param-free banner text, so the cause gets its own key
    // rather than a placeholder bolted onto a shared label.
    invalidLocaleDetail: 'Invalid locale " {{locale}} "',
    invalidRequestDataDetail: "Dati di richiesta non validi: {{error}}",
    invalidResponseDetail: "Dati di risposta non validi: {{error}}",
    invalidErrorResponseDetail: "Risposta di errore malformato: {{error}}",
    csrfFailedDetail: "Richiesta bloccata dalla protezione CSRF: {{reason}}",
    csrfReasonUnknown: "La validazione di token CSRF è fallita",
    uploadTooLargeDetail:
      "Carica troppo grande: {{size}} MB. Un messaggio può portare fino a {{limit}} MB di file. Rimuovere o ridurre un file e inviare di nuovo.",
    internalDetail: "Errore interno: {{error}}",
    authenticationFailed: "L'autenticazione utente non è riuscita",
  },
  validation: {
    missingFields: "Campi obbligatori mancanti ({{count}}):",
    failedOne: "Validazione non riuscita (1 errore):",
    failedMany: "Errore di convalida (errore {{count}}):",
    cliHints:
      "\n\nEsempio:\n  {{example}}\n\nO eseguire interattivamente:\n  {{interactive}}\n\nMaggiori informazioni:\n  {{help}}",
    /**
     * Assembly shell, deliberately word-free so it is identical in every
     * language: `fail()` takes a single already-translated message, so the
     * header/bullet/hint parts have to meet inside one final `t()` call.
     */
    report: "{{header}}{{fields}}{{hints}}",
    unexpected: "La convalida non è riuscita inaspettatamente: {{error}}",
  },
  shared: {
    permissions: {
      errors: {
        definitionError: "Errore di definizione endpoint: {{reason}}",
        allowedRolesMissing:
          "Errore di definizione endpoint: allowedRoles manca o non è un elenco",
        /**
         * One key per denial cause from checkPlatformAccess. The cause code
         * selects the key; `platform` is the only parameter, and it is a raw
         * runtime value.
         */
        platformAccessDenied: {
          productionDisabled:
            "Accesso negato a {{platform}}: questo punto finale è disabilitato nella produzione",
          platformExcluded:
            "Accesso negato su {{platform}}: questo endpoint non è esposto su questa piattaforma",
          cliPackageAuthRequired:
            "Accesso negato su {{platform}}: questo endpoint ha bisogno di autenticazione, che il pacchetto CLI non può fornire",
          mcpNotListed:
            "Accesso negato su {{platform}}: questo punto finale non è elencato su MCP",
        },
        /**
         * Four variants instead of one key with `{{userId}}`/`{{userRoles}}`
         * placeholders filled by translated nouns: "public" and "none" are
         * words, not values, so they belong inside the sentence.
         */
        insufficientRoles:
          "L'utente {{userId}} non ha ruoli richiesti: {{requiredRoles}} (ha: {{userRoles}})",
        insufficientRolesNoRoles:
          "L'utente {{userId}} non ha ruoli richiesti: {{requiredRoles}} (has: noe)",
        insufficientRolesPublic:
          "Il pubblico dell'utente non ha ruoli richiesti: {{requiredRoles}} (has: {{userRoles}})",
        insufficientRolesPublicNoRoles:
          "Il pubblico dell'utente non ha ruoli richiesti: {{requiredRoles}} (has: noe)",
      },
    },
    endpoints: {
      definition: {
        loader: {
          errors: {
            endpointNotFound: "Endpoint non trovato: {{identifier}}",
            loadFailed: "Non caricare endpoint {{identifier}}: {{error}}",
            batchLoadFailed:
              "Non caricare {{failedCount}} di endpoint {{totalCount}}",
            batchLoadError:
              "Non caricare {{failedCount}} degli endpoint {{totalCount}}: {{error}}",
          },
        },
      },
    },
  },
};
