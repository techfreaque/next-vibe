import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    sessionErrorReason: {
      noTokenInCookies: "Nessun token nei cookie",
    },
  },
  errors: {
    session_not_found: "Sessione non trovata per il token {{token}}",
    session_token_missing: "Token di sessione non trovato ({{reason}})",
    session_lookup_failed:
      "Impossibile cercare la sessione {{token}}: {{error}}",
    current_session_failed:
      "Impossibile leggere la sessione corrente: {{error}}",
    expired_sessions_delete_failed: "Impossibile eliminare le sessioni scadute",
    session_creation_failed:
      "Impossibile creare la sessione dell’utente {{userId}}",
    session_creation_database_error:
      "Errore del database durante la creazione della sessione dell’utente {{userId}}: {{error}}",
    user_sessions_delete_failed:
      "Impossibile eliminare la sessione {{sessionId}}: {{error}}",
    expired: "Sessione scaduta il {{expiresAt}}",
  },
  post: {
    title: "Sessione",
    description: "Endpoint di sessione",
    form: {
      title: "Configurazione della sessione",
      description: "Imposta i parametri della sessione",
    },
    response: {
      title: "Risposta",
      description: "Dati restituiti per la sessione",
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
    },
    success: {
      title: "Operazione riuscita",
      description: "Operazione completata",
    },
  },
};
