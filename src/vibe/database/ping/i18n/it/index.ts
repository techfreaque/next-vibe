import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Operazioni del database",
  tag: "database",
  post: {
    title: "Database Ping",
    titleShort: "DB Ping",
    description: "Controlla la connettività e la salute del database",
    form: {
      title: "Configurazione Ping",
      description: "Configurare i parametri di ping del database",
    },
    response: {
      title: "Risposta",
      description: "Dati di risposta Ping",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description:
          "Autenticazione necessaria per accedere alle operazioni del database",
      },
      validation: {
        title: "Errore di convalida",
        description: "Parametri di richiesta non valida ping",
      },
      server: {
        title: "Errore del server",
        description:
          "Errore del server interno si è verificato durante la pinizzazione del database",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante il ping del database",
      },
      network: {
        title: "Errore di rete",
        description:
          "Errore di rete si è verificato durante la connessione al database",
        detail: "Database ping fallito: {{error}}",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso vietato - autorizzazioni insufficienti",
      },
      notFound: {
        title: "Non trovato",
        description: "risorsa di database non trovata",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Il conflitto di dati si è verificato durante l'operazione",
      },
    },
    success: {
      title: "Database Ping Successivo",
      description: "Collegato con successo al database",
    },
  },
  fields: {
    silent: {
      title: "Modalità silenziosa",
      description: "Eseguire ping senza messaggi di uscita",
    },
    keepConnectionOpen: {
      title: "Tenere aperta la connessione",
      description: "Mantenere la connessione del database aperta dopo il ping",
    },
    success: {
      title: "Stato di successo",
      content: "Operazione riuscita",
    },
    isAccessible: {
      title: "Database Accessibile",
      content: "Accessibile",
    },
    output: {
      title: "Messaggio di uscita",
      content: "Produzione",
    },
    connectionInfo: {
      title: "Informazioni sulla connessione",
      totalConnections: {
        content: "Connessioni totali",
      },
      idleConnections: {
        content: "Collegamenti inattivo",
      },
      waitingClients: {
        content: "In attesa di clienti",
      },
    },
  },
  status: {
    success: "Operazione riuscita",
    failed: "Sfigato",
    timeout: "Timeout",
    error: "Errore",
  },
  connectionType: {
    primary: "Primario",
    replica: "Replica",
    cache: "Cache",
  },
};
