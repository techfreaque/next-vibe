import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Operazioni del database",

  tag: "sql",
  post: {
    title: "Esegui SQL",
    titleShort: "Correre SQL",
    description: "Esegui le query SQL sul database",
    form: {
      title: "Configurazione di query SQL",
      description: "Configurare i parametri di query SQL",
    },
    response: {
      title: "Risposta alla query",
      description: "Risultati dell'esecuzione delle query SQL",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Autenticazione richiesta per l'esecuzione SQL",
      },
      validation: {
        title: "Errore di convalida",
        description: "Invalid SQL query o parametri",
      },
      server: {
        title: "Errore del server",
        description: "Errore del server interno durante l'esecuzione SQL",
      },
      internal: {
        title: "Errore interno",
        description: "Esecuzione delle query SQL fallita",
      },
      database: {
        title: "Errore del database",
        description:
          "Errore del database si è verificato durante l'esecuzione delle query",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante l'esecuzione SQL",
      },
      network: {
        title: "Errore di rete",
        description: "Errore di rete durante l'esecuzione SQL",
      },
      forbidden: {
        title: "Accesso negato",
        description: "autorizzazioni insufficienti per l'esecuzione SQL",
      },
      notFound: {
        title: "Non trovato",
        description: "Risorse SQL non trovate",
      },
      conflict: {
        title: "Conflitto",
        description: "conflitto SQL rilevato",
      },
    },
    success: {
      title: "Query Eseguita",
      description: "query SQL eseguito con successo",
    },
  },
  fields: {
    query: {
      title: "Query SQL",
      description: "La query SQL per eseguire",
    },
    queryFile: {
      title: "Percorso file query",
      description: "Percorso a un file SQL per eseguire",
      placeholder: "/percorso/a/query.sql",
    },
    dryRun: {
      title: "Simulazione",
      description: "Domanda di anteprima senza eseguire",
    },
    verbose: {
      title: "Uscita Verbose",
      description: "Mostra informazioni dettagliate su query",
    },
    limit: {
      title: "Limite di riga",
      description: "Numero massimo di righe da restituire (1-1000)",
    },
    success: {
      title: "Stato di successo",
    },
    output: {
      title: "Produzione",
    },
    results: {
      title: "Risultati di query",
    },
    rowCount: {
      title: "Conteggio di riga",
    },
    queryType: {
      title: "Tipologia di query",
    },
  },
};
