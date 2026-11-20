import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    messages: "Messaggi",
  },
  config: {
    folders: {
      private: "Chat private",
      shared: "Chat condivise",
      public: "Chat pubbliche",
      incognito: "Incognito Chats",
      background: "Filetti di sfondo",
      remote: "Chat remote",
    },
  },
  get: {
    title: "Sentiero di conversazione",
    titleShort: "Percorso del messaggio",
    description:
      "Recuperare i messaggi seguendo un percorso di conversazione specifico",
    container: {
      title: "Percorso di conversazione",
      description: "I messaggi nella sezione conversazione selezionata",
    },
    threadId: {
      label: "File ID",
      description: "ID del thread per recuperare il percorso",
    },
    rootFolderId: {
      label: "Cartella di radice",
      description:
        "cartella radice del thread (utilizzato per il routing client)",
    },
    leafMessageId: {
      label: "Messaggio di foglie ID",
      description:
        "ID del messaggio foglia (più profondo) per mostrare il percorso per. Omit per l'ultimo.",
    },
    before: {
      label: "Prima del messaggio ID",
      description:
        "Caricare la storia chunk prima di questo messaggio ID (impaginazione basata su cursor)",
    },
    response: {
      title: "Messaggi di percorso",
      description: "Messaggi nel percorso di conversazione",
      messages: {
        message: {
          title: "Messaggio",
          id: {
            content: "Messaggio ID",
          },
          threadId: {
            content: "File ID",
          },
          role: {
            content: "Role",
          },
          content: {
            content: "Contenuti",
          },
          parentId: {
            content: "Messaggio principale ID",
          },
          sequenceId: {
            content: "Sequenza ID",
          },
          authorId: {
            content: "Autore ID",
          },
          authorName: {
            content: "Nome dell'autore",
          },
          isAI: {
            content: "È AI",
          },
          model: {
            content: "Modello",
          },
          skill: {
            content: "Skill",
          },
          errorType: {
            content: "Tipo di errore",
          },
          errorMessage: {
            content: "Messaggio di errore",
          },
          errorCode: {
            content: "Codice di errore",
          },
          metadata: {
            content: "Metadati",
          },
          upvotes: {
            content: "Votazioni",
          },
          downvotes: {
            content: "Giù",
          },
          searchVector: {
            content: "Vettore di ricerca",
          },
          createdAt: {
            content: "Creato a",
          },
          updatedAt: {
            content: "Aggiornato At",
          },
        },
      },
      hasOlderHistory: {
        content: "Ha la storia più vecchia",
      },
      hasNewerMessages: {
        content: "Ha nuovi messaggi",
      },
      resolvedLeafMessageId: {
        content: "Messaggio di foglie risolte ID",
      },
      oldestLoadedMessageId: {
        content: "Messaggio più vecchio caricato ID",
      },
      compactionBoundaryId: {
        content: "Compattamento Boundary ID",
      },
      newerChunkAnchorId: {
        content: "Ancora più recente ID",
      },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile connettersi al server",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description:
          "Devi essere connesso per visualizzare i percorsi di conversazione",
      },
      forbidden: {
        title: "Accesso negato",
        description:
          "Non hai il permesso di vedere questo percorso di conversazione",
      },
      notFound: {
        title: "Non trovato",
        description: "Conversazione non trovata",
      },
      server: {
        title: "Errore del server",
        description: "Si è verificato un errore del server interno",
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
        description: "Si è verificato un conflitto",
      },
      threadNotFound: {
        title: "Filo non trovato",
        description: "Il thread specificato non esiste",
      },
      noRootMessage: {
        title: "Nessun messaggio di radice",
        description: "Il thread non ha un messaggio di root",
      },
      getFailed: {
        title: "Lasciati andare",
        description: "Non riuscito a recuperare il percorso di conversazione",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "percorso di conversazione recuperato con successo",
    },
  },
};
