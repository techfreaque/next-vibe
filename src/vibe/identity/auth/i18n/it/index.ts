import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Autenticazione",
  search: {
    tag: "Auth",
  },
  authClient: {
    errors: {
      status_save_failed: "Non riuscito a salvare lo stato di autenticazione",
      status_remove_failed:
        "Non riuscito a rimuovere lo stato di autenticazione",
      status_check_failed: "Non controlla lo stato di autenticazione",
      token_save_failed: "Non riuscito a salvare il token di autenticazione",
      token_get_failed: "Non riuscito a recuperare il token di autenticazione",
      token_remove_failed:
        "Non riuscito a rimuovere il token di autenticazione",
      token_save_failed_detail:
        "Non riuscito a salvare il token di autenticazione: {{error}}",
      token_get_failed_detail:
        "Non recuperato il token di autenticazione: {{error}}",
      token_remove_failed_detail:
        "Non è stato possibile rimuovere il token di autenticazione: {{error}}",
    },
  },
  debug: {
    getAuthMinimalUserNext: {
      start: "getAuthMinimalUserNext : - Prima verifica dell'autenticazione",
      result: "getAuthMinimalUserNext: risultato getCurrentUserNext",
      authenticated:
        "getAuthMinimalUserNext: L'utente è autenticato, ottenendo leadId",
      returningAuth: "getAuthMinimalUserNext: Ritorno utente autenticato",
      notAuthenticated:
        "getAuthMinimalUserNext: Utente non autenticato, di ritorno utente pubblico",
    },
    signingJwt: "Firma JWT",
    jwtSignedSuccessfully: "JWT ha firmato con successo",
    errorSigningJwt: "Firma di errore JWT",
    verifyingJwt: "Verifica JWT",
    invalidTokenPayload: "Carico di pagamento del gettone non valido",
    jwtVerifiedSuccessfully: "JWT verificato con successo",
    errorVerifyingJwt: "Verifica errore JWT",
    userIdNotExistsInDb: "L'utente ID non esiste nel database",
    sessionNotFound: "Sessione non trovata",
    sessionExpired: "Sessione scaduta",
    errorValidatingUserSession: "Procedura di convalida degli errori",
    errorGettingUserRoles: "Errore di ottenere ruoli utente",
    errorCheckingUserAuth: "Controllo errore dell'autenticazione utente",
    authenticatingCliUserWithPayload: "Autentico utente CLI con payload",
    errorAuthenticatingCliUserWithPayload:
      "Errore di autenticazione utente CLI con payload",
    creatingCliToken: "Creazione di token CLI",
    errorCreatingCliToken: "Errore di creazione del token CLI",
    validatingCliToken: "Convalida token CLI",
    errorValidatingCliToken: "Errore che convalida il token CLI",
    gettingCurrentUserFromNextjs: "Ottenere utente corrente da Next.js",
    errorGettingAuthUserForNextjs: "Errore di ottenere utente auth per Next.js",
    settingNextjsAuthCookies: "Impostazione dei cookie Next.js auth",
    clearingNextjsAuthCookies: "Cancellazione Next.js cookie auth",
    gettingCurrentUserFromToken: "Ottenere l'utente corrente da token",
    errorGettingCurrentUserFromCli:
      "Errore di ottenere l'utente corrente da CLI",
    errorGettingAuthUserForCli: "Errore di ottenere utente auth per CLI",
    errorGettingUserRolesForCli: "Errore di ottenere ruoli utente per CLI",
    tokenFromAuthHeader: "Token da auth header",
    tokenFromCookie: "Token da cookie",
    noTokenFound: "Nessun token trovato",
    errorExtractingToken: "Estrazione di errore token",
    errorParsingCookies: "Cookie di analisi errori",
  },
  errors: {
    token_generation_failed:
      "Non è riuscito a generare token di autenticazione",
    invalid_session: "La sessione è invalida o scaduta",
    missing_request_context: "Il contesto di richiesta manca",
    missing_locale: "Locale non è disponibile su richiesta",
    unsupported_platform: "La piattaforma non è supportata",
    session_retrieval_failed: "Non recuperato sessione",
    missing_token: "Manca il token di autenticazione",
    invalid_token_signature: "La firma del token non è valida",
    invalid_token_signature_detail: "Controllo firma token fallito: {{error}}",
    jwt_payload_missing_id: "JWT payload manca l'utente ID",
    cookie_set_failed: "Non impostare cookie di autenticazione: {{error}}",
    cookie_clear_failed:
      "Non è stato possibile cancellare il cookie di autenticazione: {{error}}",
    publicPayloadNotSupported:
      "Il payload pubblico JWT non è supportato per l'autenticazione CLI",
    jwt_signing_failed: "Non firmato il token JWT: {{error}}",
    authentication_failed: "Autenticazione fallita: {{error}}",
    user_not_authenticated: "L'utente non è autenticato: {{email}}",
    publicUserNotAllowed:
      "L'utente pubblico non è consentito per questo endpoint",
    validation_failed: "Convalida fallita",
    failed_to_create_lead: "Non è riuscito a creare contatto",
    native: {
      unsupported:
        "Questo metodo di autenticazione non è supportato su React Native",
      storage_failed: "Non memorizzare i dati di autenticazione: {{error}}",
      clear_failed:
        "Non è possibile cancellare i dati di autenticazione: {{error}}",
    },
    not_implemented_native:
      "Questa funzione non è ancora stata implementata per React Native",
    unknownError:
      "Un errore sconosciuto si è verificato durante l'autenticazione",
  },
  post: {
    title: "Auth",
    description: "Fine della fase",
    form: {
      title: "Auth Configuration",
      description: "Configurare i parametri auth",
    },
    response: {
      title: "Risposta",
      description: "Dati di risposta dell'auth",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
      },
      missing_locale: {
        title: "Missing Locale",
        description: "Il parametro Locale è richiesto",
      },
      server: {
        title: "Errore del server",
        description: "Si è verificato un errore interno del server",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso non consentito",
      },
      notFound: {
        title: "Non trovato",
        description: "Risorsa non trovata",
      },
      conflict: {
        title: "Conflitto",
        description: "I dati sono in conflitto",
      },
      token_generation_failed: {
        title: "La generazione di Token non è riuscita",
        description: "Non è riuscito a generare token di autenticazione",
      },
      invalid_session: {
        title: "Sessione non valida",
        description: "La sessione è invalida o scaduta",
      },
      missing_request_context: {
        title: "Richiesta mancante Contesto",
        description: "Il contesto di richiesta manca",
      },
      unsupported_platform: {
        title: "Piattaforma non supportata",
        description: "La piattaforma non è supportata",
      },
      session_retrieval_failed: {
        title: "Recuperare la sessione non riuscita",
        description: "Non recuperato sessione",
      },
      missing_token: {
        title: "Token mancante",
        description: "Manca il token di autenticazione",
      },
      invalid_token_signature: {
        title: "Firma di Token non valida",
        description: "La firma del token non è valida",
      },
      jwt_payload_missing_id: {
        title: "JWT Payload mancante ID",
        description: "JWT payload manca l'utente ID",
      },
      cookie_set_failed: {
        title: "Cookie Set non corretto",
        description: "Non impostare cookie di autenticazione",
      },
      cookie_clear_failed: {
        title: "Cookie Cancellazione non riuscita",
        description: "Non riuscito a cancellare il cookie di autenticazione",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Operazione completata",
    },
  },
  check: {
    get: {
      title: "Verificare l'autenticità",
      description: "Controlla lo stato di autenticazione corrente",
      response: {
        title: "Stato di autenticazione",
        description: "Stato di autenticazione attuale",
        authenticated: "Autentico",
        tokenValid: "Convalida di token",
      },
    },
  },
  enums: {
    webSocketErrorCode: {
      unauthorized: "Autenticazione richiesta",
      forbidden: "Accesso negato",
      invalidToken: "Token non valido",
      tokenExpired: "Scadenza di Token",
      serverError: "Errore del server",
    },
  },
};
