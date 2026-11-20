import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Operazioni del database",

  tag: "studio",
  post: {
    title: "Database Studio",
    titleShort: "DB Studio",
    description:
      "Studio di database aperto per la gestione visiva dei database",
    form: {
      title: "Configurazione dello studio",
      description: "Configurare i parametri dello studio del database",
    },
    response: {
      title: "Risposta dello Studio",
      description: "Risultati del lancio dello studio di database",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Autenticazione necessaria per lo studio di database",
      },
      validation: {
        title: "Errore di convalida",
        description: "Parametri dello studio non validi",
      },
      server: {
        title: "Errore del server",
        description: "Errore del server interno durante il lancio dello studio",
        detail:
          "Drizzle Studio non è riuscito a iniziare dopo {{seconds}} s: {{error}}",
      },
      internal: {
        title: "Errore interno",
        description: "Il lancio dello studio di database è fallito",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante il lancio di studio",
      },
      network: {
        title: "Errore di rete",
        description: "Errore di rete durante il lancio dello studio",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Autorizzazioni insufficienti per lo studio di database",
      },
      notFound: {
        title: "Non trovato",
        description: "Risorse dello studio non trovate",
      },
      conflict: {
        title: "Conflitto",
        description: "Discussione della porta di studio rilevato",
      },
    },
    success: {
      title: "Studio lanciato",
      description: "Database studio lanciato con successo",
    },
  },
  fields: {
    port: {
      title: "Port",
      description: "Numero di porta per lo studio del database (1024-65535)",
    },
    openBrowser: {
      title: "Apri il browser",
      description: "Studio automatico aperto nel browser",
    },
    success: {
      title: "Stato di successo",
    },
    url: {
      title: "Studio URL",
    },
    portUsed: {
      title: "Porto effettivo usato",
    },
    output: {
      title: "Uscita del lancio",
    },
    duration: {
      title: "Durata del lancio",
    },
  },
};
