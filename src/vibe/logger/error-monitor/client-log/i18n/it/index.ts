import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Sistema",

  enums: {
    level: {
      error: "Errore",
      warn: "Avvertenza",
    },
  },

  post: {
    title: "Segnala l'errore client",
    titleShort: "Errore di log",
    description:
      "Persistere un errore lato client o un avviso al registro di errore",
    tags: {
      monitoring: "Monitoraggio",
    },
    fields: {
      level: {
        label: "Livello",
        description: "Livello di registro: errore o avvertire",
      },
      message: {
        label: "Messaggio",
        description: "Messaggio di errore",
        placeholder: "Qualcosa è andato storto",
      },
      metadata: {
        label: "Metadati",
        description: "Contesto strutturato addizionale",
      },
    },
    response: {
      ok: {
        title: "Accettato",
      },
    },
    success: {
      title: "Impiego",
      description: "Errore del cliente persistito",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Richiesta non valida",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso negato",
      },
      notFound: {
        title: "Non trovato",
        description: "Risorsa non trovata",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      server: {
        title: "Errore del server",
        description: "Non riuscito a persistere il registro di errore",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        titleChanges: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto",
        description: "I dati sono in conflitto",
      },
    },
  },
};
