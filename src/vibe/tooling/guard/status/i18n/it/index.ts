import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Protezione",
  post: {
    title: "Stato di protezione",
    titleShort: "Stato di protezione",
    description: "Controllare lo stato dell'ambiente di guardia",
    tag: "Stato",
    container: {
      title: "Configurazione dello stato della guardia",
      description: "Configurare i parametri di controllo dello stato",
    },
    fields: {
      projectPath: {
        title: "Percorso del progetto",
        description: "Percorso al progetto di guardia",
        placeholder: "/percorso/progetto",
      },
      guardId: {
        title: "Guardia ID",
        description: "Identificatore unico per la guardia",
        placeholder: "guard-123",
      },
      username: {
        title: "Nome utente",
      },
      status: {
        title: "Stato",
      },
      createdAt: {
        title: "Creato a",
      },
      securityLevel: {
        title: "Livello di sicurezza",
      },
      isolationMethod: {
        title: "Metodo di isolamento",
      },
      isRunning: {
        title: "È in esecuzione",
      },
      userHome: {
        title: "Casa dell'utente",
      },
      listAll: {
        title: "Elenca tutte le guardie",
        description: "Elenca tutti gli ambienti di guardia",
      },
      success: {
        title: "Operazione riuscita",
      },
      output: {
        title: "Produzione",
      },
      guards: {
        title: "Guards",
      },
      totalGuards: {
        title: "Totale guardie",
      },
      activeGuards: {
        title: "Guardie attive",
      },
    },
    form: {
      title: "Configurazione dello stato",
      description: "Configurare i parametri di stato",
    },
    response: {
      title: "Risposta",
      description: "Dati di risposta allo stato",
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
      internal: {
        title: "Errore interno",
        description: "Si è verificato un errore interno del server",
      },
      statusFailed:
        "Errore interno durante il controllo dello stato della guardia: {{detail}}",
    },
    success: {
      title: "Operazione riuscita",
      description: "Operazione completata",
    },
  },
};
