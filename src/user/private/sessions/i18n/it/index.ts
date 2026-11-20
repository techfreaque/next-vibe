import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Utenti",

  widget: {
    intro:
      "Tutti i dispositivi sono firmati sul tuo account. Firma tutto quello che non riconosce.",
    revokeFailed: "Non potevo firmare quel dispositivo. Riprova.",
    back: "Indietro",
    loading: "Le sessioni di carico...",
    empty: "Nessuna sessione attiva",
    emptyHint: "Una sessione viene creata ogni volta che si accede",
    browserSession: "Sessione del browser",
    revoke: "Firma",
    revoking: "Rispondendo...",
    currentSession: "Corrente",
    created: "Creato",
    expires: "Scadenze",
    never: "Mai.",
  },

  list: {
    title: "Dispositivi firmati",
    titleShort: "Le mie sessioni",
    description: "Elenca tutte le sessioni attive per il tuo account",
    tag: "Sessioni",
    response: {
      sessions: "Sessioni",
    },
    success: {
      title: "Sessioni recuperate",
      description: "Le tue sessioni attive sono state recuperate",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      validation: {
        title: "Errore di convalida",
        description: "Richiesta non valida",
      },
      server: {
        title: "Errore del server",
        description: "Errore del server interno",
        detail: "Non poteva caricare le sessioni: {{error}}",
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
      notFound: { title: "Non trovato", description: "Risorsa non trovata" },
      conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
    },
  },
  create: {
    title: "Crea token di sessione",
    titleShort: "Creare Token",
    description:
      "Creare un token di sessione denominato per l'accesso programmatico",
    tag: "Sessioni",
    form: {
      name: "Nome del token",
      namePlaceholder: "ad esempio. Il mio agente Bo",
    },
    response: {
      token: "Token",
      id: "Sessione ID",
      name: "Nome",
      message: "Copia ora il token. Non verrà più mostrato.",
    },
    success: {
      title: "Sessione creata",
      description: "Il tuo token di sessione è stato creato",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      validation: {
        title: "Errore di convalida",
        description: "Richiesta non valida",
      },
      server: {
        title: "Errore del server",
        description: "Errore del server interno",
        detail: "Non è possibile creare il token di sessione: {{error}}",
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
      notFound: { title: "Non trovato", description: "Risorsa non trovata" },
      conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
    },
  },
  revoke: {
    title: "Sessione di voto",
    titleShort: "Sessione di voto",
    description: "Rivolgere un token di sessione da ID",
    tag: "Sessioni",
    response: {
      message: "Sessione revocata",
    },
    success: {
      title: "Sessione revocata",
      description: "La sessione è stata revocata",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      validation: {
        title: "Errore di convalida",
        description: "Richiesta non valida",
      },
      server: {
        title: "Errore del server",
        description: "Errore del server interno",
        detail: "Non è possibile revocare la sessione: {{error}}",
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
        description: "Sessione non trovata",
        detail:
          "Nessuna sessione con ID {{sessionId}} appartiene al tuo account",
      },
      conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
    },
  },
};
