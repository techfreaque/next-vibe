import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  capture: {
    title: "Cattura la struttura interattiva",
    titleShort: "Telaio di cattura",
    description:
      "Leggi il frame reso corrente da una sessione interattiva in esecuzione",
    form: {
      fields: {
        pid: {
          label: "Sessione PID",
          description:
            "PID della sessione interattiva. Auto-detected quando omesso.",
        },
      },
    },
    response: {
      fields: {
        content: "Contenuto della struttura",
        logs: "Log di errore",
        pid: "Sessione PID",
      },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      server: {
        title: "Errore del server",
        description: "Errore del server interno",
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
        title: "Nessuna sessione",
        description: "Nessuna sessione interattiva attiva trovata",
        noSession:
          "Nessuna sessione interattiva in esecuzione. Iniziare con: vibe <alias> -i --agent-control",
        deadSession: "Sessione PID {{pid}} non è più in esecuzione.",
        frameNotFound:
          "Nessun telaio reso per sessione {{pid}} ancora. Dagli un momento e riprova.",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      conflict: {
        title: "Conflitto",
        description: "conflitto di sessione",
      },
    },
    success: {
      title: "Catturazione della struttura",
      description: "Telaio corrente recuperato con successo",
    },
  },
  sendKeys: {
    title: "Inviare le chiavi a sessione interattiva",
    titleShort: "Inviare le chiavi",
    description:
      "Inietta i tasti in una sessione interattiva in esecuzione e restituisci il frame aggiornato",
    form: {
      fields: {
        keys: {
          label: "Chiavi",
          description:
            "chiave per inviare: entrare, scheda, fuga, su, giù, sinistra, destra, backspace, spazio o testo letterale",
        },
        pid: {
          label: "Sessione PID",
          description:
            "PID della sessione interattiva. Auto-detected quando omesso.",
        },
        waitMs: {
          label: "Aspetta (ms)",
          description:
            "Millisecondi per aspettare dopo l'iniezione chiavi prima di leggere il telaio. Predefinito 500.",
        },
      },
    },
    response: {
      fields: {
        content: "Contenuto della struttura",
        logs: "Log di errore",
        pid: "Sessione PID",
      },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      server: {
        title: "Errore del server",
        description: "Errore del server interno",
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
        title: "Nessuna sessione",
        description: "Nessuna sessione interattiva attiva trovata",
        noSession:
          "Nessuna sessione interattiva in esecuzione. Iniziare con: vibe <alias> -i --agent-control",
        deadSession: "Sessione PID {{pid}} non è più in esecuzione.",
        keysNotFound:
          "Sessione {{pid}} non accetta ancora le chiavi. Dagli un momento e riprova.",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      conflict: {
        title: "Conflitto",
        description: "conflitto di sessione",
      },
    },
    success: {
      title: "Chiave di passaggio",
      description: "Keystrokes inviati e frame aggiornati",
    },
  },
};
