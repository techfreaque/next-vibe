import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Operazioni del database",

  tag: "seed",
  post: {
    title: "Database Seed",
    titleShort: "Sega DB",
    description: "Database Seed con i dati",
    form: {
      title: "Configurazione dei semi",
      description: "Configurare i parametri di visualizzazione",
    },
    response: {
      title: "Risposta del seme",
      description: "Risultati dell'operazione di sezionamento della banca dati",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Autenticazione necessaria per la semina del database",
      },
      validation: {
        title: "Errore di convalida",
        description: "Parametri di seme non valido forniti",
      },
      server: {
        title: "Errore del server",
        description: "Errore del server interno durante la visualizzazione",
        detail: "La semina del database non è riuscita: {{error}}",
      },
      internal: {
        title: "Errore interno",
        description: "L'operazione di rilevamento del database non è riuscita",
      },
      database: {
        title: "Errore del database",
        description: "Errore del database si è verificato durante la semina",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Un errore sconosciuto si è verificato durante la semina",
      },
      network: {
        title: "Errore di rete",
        description: "Errore di rete durante la semina",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Autorizzazioni insufficienti per la semina dei database",
      },
      notFound: {
        title: "Non trovato",
        description: "Risorse di semi non trovate",
      },
      conflict: {
        title: "Conflitto",
        description: "Il conflitto di dati rilevati durante la semina",
      },
    },
    success: {
      title: "Database Seeded",
      description: "Database seeding completato con successo",
    },
  },
  fields: {
    environment: {
      title: "Ambiente",
      description: "Ambiente di semina target (dev, test, prod)",
    },
    success: {
      title: "Stato di successo",
    },
    seedsExecuted: {
      title: "Semi esecuti",
    },
    collections: {
      title: "Collezioni di semi",
      item: {
        title: "Collezione",
      },
      name: {
        title: "Nome della collezione",
      },
      status: {
        title: "Stato",
      },
      recordsCreated: {
        title: "Registrazione Creata",
      },
    },
    totalRecords: {
      title: "Totale record",
    },
    duration: {
      title: "Durata (m)",
    },
  },
};
