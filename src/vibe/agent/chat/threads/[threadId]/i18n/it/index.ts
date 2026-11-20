import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  enums: {
    threadStatus: {
      active: "Attivo",
      archived: "Archivio",
      deleted: "Cancellato",
    },
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
  tags: {
    threads: "Conversazioni",
  },
  errors: {
    not_implemented_on_native:
      "{{method}} non è implementato sulla piattaforma nativa. Si prega di utilizzare la versione web per questa operazione.",
  },
  get: {
    title: "Ottieni file di chat",
    titleShort: "File",
    description: "Recuperare un thread di chat specifico da ID",
    container: {
      title: "Dettagli del filetto",
      description: "Visualizza le informazioni dettagliate sul thread",
    },
    id: {
      label: "File ID",
      description: "Identificatore unico per il thread",
      placeholder: "Inserire il thread ID...",
    },
    rootFolderId: {
      label: "Cartella di radice",
      description:
        "cartella radice del thread (utilizzato per il routing client)",
    },
    response: {
      thread: {
        title: "Dettagli del filetto",
        description: "Informazioni complete sul thread",
        id: {
          content: "File ID",
        },
        userId: {
          content: "Utente ID",
        },
        leadId: {
          content: "ID del contatto",
        },
        threadTitle: {
          content: "Titolo",
        },
        rootFolderId: {
          content: "Cartella di radice ID",
        },
        folderId: {
          content: "Cartella ID",
        },
        status: {
          content: "Stato",
        },
        defaultModel: {
          content: "Modello predefinito",
        },
        defaultTone: {
          content: "Abilità predefinita",
        },
        systemPrompt: {
          content: "Prompt di sistema",
        },
        pinned: {
          content: "Pining",
        },
        archived: {
          content: "Archivio",
        },
        tags: {
          content: "Tags",
        },
        published: {
          content: "Pubblicato",
        },
        streamingState: {
          content: "Stato di streaming",
        },
        searchVector: {
          content: "Vettore di ricerca",
        },
        preview: {
          content: "Anteprima",
        },
        metadata: {
          content: "Metadati",
        },
        createdAt: {
          content: "Creato a",
        },
        updatedAt: {
          content: "Aggiornato At",
        },
      },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Filetto non valido ID fornito",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Devi essere connesso per visualizzare i filetti",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di vedere questo thread",
      },
      notFound: {
        title: "Filo non trovato",
        description: "Il thread richiesto non è stato trovato",
      },
      server: {
        title: "Errore del server",
        description: "Si è verificato un errore del server interno",
        detail: "Errore del server: {{error}}",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile connettersi al server",
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
    },
    success: {
      title: "Operazione riuscita",
      description: "Filettato recuperato con successo",
    },
  },
  patch: {
    title: "Aggiornare il file di chat",
    titleShort: "Aggiornamento del filo",
    description: "Aggiornare un thread di chat esistente",
    container: {
      title: "Aggiornamento del filo",
      description: "Modificare le impostazioni del thread",
    },
    id: {
      label: "File ID",
      description: "Unico identificatore per il thread per aggiornare",
      placeholder: "Inserire il thread ID...",
    },
    sections: {
      updates: {
        title: "Aggiornamenti del thread",
        description: "Campi da aggiornare",
      },
    },
    threadTitle: {
      label: "Titolo",
      description: "Titolo del filetto",
      placeholder: "Inserire il titolo thread...",
    },
    rootFolderId: {
      label: "Cartella di radice",
      description:
        "cartella radice del thread (utilizzato per il routing client)",
    },
    folderId: {
      label: "Cartella",
      description: "Cartella per posizionare il filo in",
    },
    status: {
      label: "Stato",
      description: "Situazione del thread",
    },
    defaultModel: {
      label: "Modello predefinito",
      description: "Modello predefinito AI per questo thread",
    },
    defaultTone: {
      label: "Abilità predefinita",
      description: "Abilità predefinita per questo thread",
    },
    systemPrompt: {
      label: "Prompt di sistema",
      description: "Avviso di sistema personalizzato per questo thread",
    },
    pinned: {
      label: "Pining",
      description: "Pin questo filo in alto",
    },
    archived: {
      label: "Archivio",
      description: "Archivio questo thread",
    },
    tags: {
      label: "Tags",
      description: "Tags per l'organizzazione",
    },
    published: {
      label: "Pubblicato",
      description:
        "Rendere questo thread pubblicamente accessibile tramite link (solo cartelle SHARED)",
    },
    response: {
      thread: {
        title: "Filetto aggiornato",
        description: "Dettagli del thread dopo l'aggiornamento",
        id: {
          content: "File ID",
        },
        userId: {
          content: "Utente ID",
        },
        leadId: {
          content: "ID del contatto",
        },
        threadTitle: {
          content: "Titolo",
        },
        rootFolderId: {
          content: "Cartella di radice ID",
        },
        folderId: {
          content: "Cartella ID",
        },
        status: {
          content: "Stato",
        },
        defaultModel: {
          content: "Modello predefinito",
        },
        defaultTone: {
          content: "Abilità predefinita",
        },
        systemPrompt: {
          content: "Prompt di sistema",
        },
        pinned: {
          content: "Pining",
        },
        archived: {
          content: "Archivio",
        },
        tags: {
          content: "Tags",
        },
        published: {
          content: "Pubblicato",
        },
        searchVector: {
          content: "Vettore di ricerca",
        },
        preview: {
          content: "Anteprima",
        },
        metadata: {
          content: "Metadati",
        },
        createdAt: {
          content: "Creato a",
        },
        updatedAt: {
          content: "Aggiornato At",
        },
      },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Dati filettati non validi forniti",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Devi essere connesso per aggiornare i filetti",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di aggiornare questo thread",
      },
      notFound: {
        title: "Filo non trovato",
        description: "Il thread per l'aggiornamento non è stato trovato",
        detail: "Filetto non trovato: {{threadId}}",
      },
      server: {
        title: "Errore del server",
        description: "Si è verificato un errore del server interno",
        detail: "Errore del server: {{error}}",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile connettersi al server",
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
        description: "Si è verificato un conflitto durante l'aggiornamento",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Thread aggiornato con successo",
    },
  },
  delete: {
    title: "Eliminare il thread di chat",
    titleShort: "Elimina conversazione",
    description: "Eliminare un thread di chat",
    container: {
      title: "Elimina conversazione",
      description: "Rimuovere permanentemente il filo",
    },
    id: {
      label: "File ID",
      description: "Unico identificatore per il thread da eliminare",
      placeholder: "Inserire il thread ID...",
      helpText: "WARNING: Questa azione non può essere annullata",
    },
    rootFolderId: {
      label: "Cartella di radice",
      description:
        "cartella radice del thread (utilizzato per il routing client)",
    },
    response: {
      userId: {
        content: "Proprietario",
      },
      title: {
        content: "Titolo",
      },
      folderId: {
        content: "Cartella",
      },
      status: {
        content: "Stato",
      },
      preview: {
        content: "Anteprima",
      },
      createdAt: {
        content: "Creato",
      },
      updatedAt: {
        content: "Aggiornato",
      },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Filetto non valido ID fornito",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Devi essere connesso per eliminare i filetti",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di eliminare questo thread",
      },
      notFound: {
        title: "Filo non trovato",
        description: "Il filo da eliminare non è stato trovato",
        detail: "Filetto non trovato: {{threadId}}",
      },
      server: {
        title: "Errore del server",
        description: "Si è verificato un errore del server interno",
        detail: "Errore del server: {{error}}",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile connettersi al server",
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
        description:
          "Non è possibile eliminare il thread a causa delle dipendenze esistenti",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "File eliminato con successo",
    },
  },
  widget: {
    screenshot: {
      capture: "Cattura screenshot",
      capturing: "Catturare...",
    },
  },
};
