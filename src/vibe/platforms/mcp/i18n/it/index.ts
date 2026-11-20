import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tools: {
    category: "Strumenti MCP",
    tags: {
      mcp: "MCP",
    },
    get: {
      title: "Elenco strumenti MCP",
      description:
        "Ottieni tutti gli strumenti MCP disponibili per l'utente corrente",
      fields: {
        name: "Nome dello strumento",
        description: "Designazione",
        inputSchema: "Schema di input",
      },
      response: {
        title: "Elenco degli strumenti MCP",
        description: "Elenco degli strumenti disponibili MCP",
      },
      errors: {
        validation: {
          title: "Convalida non riuscita",
          description: "Parametri della richiesta non validi",
        },
        network: {
          title: "Errore di rete",
          description: "Non è riuscito a connettersi al server",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Non hai il permesso di accedere a questa risorsa",
        },
        notFound: {
          title: "Non trovato",
          description: "Risorsa non trovata",
        },
        server: {
          title: "Errore del server",
          description: "Si è verificato un errore interno del server",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
        conflict: {
          title: "Conflitto",
          description: "Rilevato conflitto di risorse",
        },
      },
      success: {
        title: "Operazione riuscita",
        description: "Strumenti recuperati con successo",
      },
    },
  },
  execute: {
    category: "Esecuzione di MCP",
    tags: {
      mcp: "MCP",
    },
    post: {
      title: "Eseguire lo strumento MCP",
      titleShort: "Server MCP",
      description: "Eseguire uno strumento MCP per nome con argomenti",
      fields: {
        title: "Parametri di esecuzione degli strumenti",
        description: "Parametri per l'esecuzione degli strumenti",
        name: {
          title: "Nome dello strumento",
          description:
            "Nome dello strumento da eseguire (ad esempio, core:system:db:ping)",
          placeholder: "core:system:db:ping",
        },
        arguments: {
          title: "Argomenti",
          description: "Argomenti degli strumenti come coppie chiave-valore",
          placeholder: "{}",
        },
      },
      response: {
        title: "Risultato dell'esecuzione degli strumenti",
        description: "Risultato dell'esecuzione degli strumenti",
        result: {
          content: {
            type: "Tipo di contenuto",
            text: "Contenuti",
          },
          isError: "Errore è",
        },
      },
      errors: {
        validation: {
          title: "Convalida non riuscita",
          description: "Nome o argomenti non validi",
        },
        network: {
          title: "Errore di rete",
          description: "Non è riuscito a connettersi al server",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Non hai il permesso di eseguire questo strumento",
        },
        notFound: {
          title: "Strumento non trovato",
          description: "Lo strumento specificato non esiste",
        },
        server: {
          title: "Errore del server",
          description: "Esecuzione degli strumenti fallita",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
        conflict: {
          title: "Conflitto",
          description: "Rilevato conflitto di risorse",
        },
      },
      success: {
        title: "Operazione riuscita",
        description: "Strumento eseguito con successo",
      },
    },
  },
  serve: {
    category: "Server MCP",
    tags: {
      mcp: "MCP",
    },
    post: {
      title: "Avviare il server MCP",
      titleShort: "Server MCP",
      description: "Avviare il server del protocollo di modello",
      response: {
        title: "Stato del server MCP",
        description: "Stato del server MCP",
      },
      errors: {
        validation: {
          title: "Convalida non riuscita",
          description: "Parametri della richiesta non validi",
        },
        server: {
          title: "Errore del server",
          description: "Non è possibile avviare il server MCP",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
      },
      success: {
        title: "Operazione riuscita",
        description: "Il server MCP è iniziato con successo",
      },
    },
  },
  registry: {
    toolNotFound: "Strumento non trovato",
    endpointNotFound: "Endpoint non trovato",
    permissionDenied: "Permesso negato",
    toolExecutionFailed: "Esecuzione degli strumenti fallita",
  },
};
