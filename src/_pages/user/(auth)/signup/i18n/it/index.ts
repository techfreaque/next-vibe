import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    failedToLoadBrowserIdentity:
      "Impossibile caricare l’identità del browser. Ricarica la pagina.",
  },
  meta: {
    title: "Registrati a {{appName}}",
    description:
      "Crea un account su {{appName}} e inizia a sviluppare le tue applicazioni.",
    category: "Autenticazione",
    imageAlt: "Registrazione a {{appName}}",
    keywords: "registrazione, iscriviti, crea un account, {{appName}}",
    ogTitle: "Registrati a {{appName}}",
    ogDescription:
      "Registrati a {{appName}} e inizia oggi a sviluppare le tue applicazioni.",
    twitterTitle: "Registrati a {{appName}}",
    twitterDescription:
      "Crea il tuo account e inizia a sviluppare con {{appName}}.",
  },
  post: {
    title: "Registrazione",
    description: "Endpoint di registrazione",
    form: {
      title: "Configurazione della registrazione",
      description: "Configura i parametri di registrazione",
    },
    response: {
      title: "Risposta",
      description: "Dati restituiti dalla registrazione",
    },
    errors: {
      unauthorized: {
        title: "Non autorizzato",
        description: "Devi autenticarti",
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
        description: "Non hai i permessi per accedere",
      },
      notFound: {
        title: "Risorsa non trovata",
        description: "La risorsa richiesta non esiste",
      },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato un conflitto di dati",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Operazione completata",
    },
  },
};
