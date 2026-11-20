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
  chat: {
    enums: {
      role: {
        user: "Utente",
        assistant: "Assistente aggiunto",
        system: "Sistema",
        tool: "Strumento",
        error: "Errore",
      },
    },
  },
  get: {
    title: "Ottieni un messaggio",
    titleShort: "Messaggio",
    description: "Recuperare un messaggio specifico da ID",
    container: {
      title: "Dettagli del messaggio",
      description: "Visualizza le informazioni del messaggio",
    },
    threadId: {
      label: "File ID",
      description: "ID del thread contenente il messaggio",
    },
    messageId: {
      label: "Messaggio ID",
      description: "ID del messaggio per recuperare",
    },
    rootFolderId: {
      label: "Cartella di radice",
      description:
        "cartella radice del thread (utilizzato per il routing client)",
    },
    response: {
      title: "Risposta del messaggio",
      description: "Dettagli del messaggio",
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
        authorId: {
          content: "Autore ID",
        },
        isAI: {
          content: "È AI",
        },
        model: {
          content: "Modello",
        },
        tokens: {
          content: "Tokens",
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
        description: "Parametri della richiesta non validi",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile connettersi al server",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Devi essere connesso per visualizzare i messaggi",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di visualizzare questo messaggio",
      },
      notFound: {
        title: "Non trovato",
        description: "Messaggio non trovato",
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
      messageNotFound: {
        title: "Messaggio non trovato",
        description: "Il messaggio specificato non esiste",
      },
    },
    backButton: {
      label: "Indietro",
    },
    success: {
      title: "Operazione riuscita",
      description: "Messaggio recuperato con successo",
    },
  },
  patch: {
    title: "Messaggio di aggiornamento",
    titleShort: "Messaggio di aggiornamento",
    description: "Aggiornare il contenuto di un messaggio",
    container: {
      title: "Modifica messaggio",
      description: "Aggiornare il contenuto del messaggio",
    },
    form: {
      title: "Modifica messaggio",
      description: "Aggiornare il contenuto del messaggio",
    },
    sections: {
      message: {
        title: "Contenuto del messaggio",
        description: "Modifica del messaggio",
      },
    },
    threadId: {
      label: "File ID",
      description: "ID del thread contenente il messaggio",
    },
    messageId: {
      label: "Messaggio ID",
      description: "ID del messaggio per aggiornare",
    },
    rootFolderId: {
      label: "Cartella di radice",
      description:
        "cartella radice del thread (utilizzato per il routing client)",
    },
    content: {
      label: "Contenuti",
      description: "Contenuto del messaggio aggiornato",
      placeholder: "Inserisci il contenuto del messaggio...",
    },
    role: {
      label: "Role",
      description: "Messaggio (utente, assistente, sistema)",
    },
    response: {
      title: "Messaggio aggiornato",
      description: "Dettagli del messaggio aggiornati",
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
        description: "Dati di messaggio non valido forniti",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile connettersi al server",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Devi essere connesso per aggiornare i messaggi",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di aggiornare questo messaggio",
      },
      notFound: {
        title: "Non trovato",
        description: "Messaggio non trovato",
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
      messageNotFound: {
        title: "Messaggio non trovato",
        description: "Il messaggio specificato non esiste",
      },
    },
    backButton: {
      label: "Indietro",
    },
    submitButton: {
      label: "Salvare le modifiche",
      loadingText: "Salvare...",
    },
    success: {
      title: "Operazione riuscita",
      description: "Messaggio aggiornato con successo",
    },
  },
  delete: {
    title: "Cancella messaggio",
    titleShort: "Cancella messaggio",
    description: "Eliminare un messaggio dal thread",
    container: {
      title: "Cancella messaggio",
      description: "Rimuovere il messaggio dal thread",
    },
    confirmTitle: "Cancella messaggio",
    confirmText:
      "Sei sicuro di voler eliminare questo messaggio? Questa azione non può essere annullata.",
    backButton: {
      label: "Annulla",
    },
    submitButton: {
      label: "Elimina",
      loadingText: "Deleting...",
    },
    deleteButton: {
      label: "Elimina",
      loadingText: "Deleting...",
    },
    threadId: {
      label: "File ID",
      description: "ID del thread contenente il messaggio",
    },
    messageId: {
      label: "Messaggio ID",
      description: "ID del messaggio da eliminare",
    },
    rootFolderId: {
      label: "Cartella di radice",
      description:
        "cartella radice del thread (utilizzato per il routing client)",
    },
    response: {
      success: { content: "Operazione riuscita" },
      role: { content: "Role" },
      content: { content: "Contenuti" },
      parentId: { content: "Messaggio principale ID" },
      authorId: { content: "Autore ID" },
      isAI: { content: "È AI" },
      model: { content: "Modello" },
      createdAt: { content: "Creato a" },
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
        description: "Devi essere connesso per eliminare i messaggi",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di cancellare questo messaggio",
      },
      notFound: {
        title: "Non trovato",
        description: "Messaggio non trovato",
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
        description:
          "Non è possibile eliminare il messaggio con i messaggi dei bambini",
      },
      threadNotFound: {
        title: "Filo non trovato",
        description: "Il thread specificato non esiste",
      },
      messageNotFound: {
        title: "Messaggio non trovato",
        description: "Il messaggio specificato non esiste",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Messaggio cancellato con successo",
    },
  },
  vote: {
    category: "Chat",
    tags: {
      messages: "Messaggi",
    },
    post: {
      title: "Vota il messaggio",
      description: "Inviare o revocare un messaggio",
      container: {
        title: "Votazioni",
        description: "Votate su questo messaggio",
      },
      form: {
        title: "Vota il messaggio",
        description: "Rivolgere, revocare, o rimuovere il voto",
      },
      threadId: {
        label: "File ID",
        description: "ID del thread contenente il messaggio",
      },
      messageId: {
        label: "Messaggio ID",
        description: "ID del messaggio per votare",
      },
      rootFolderId: {
        label: "Cartella di radice",
        description:
          "cartella radice del thread (utilizzato per il routing client)",
      },
      vote: {
        label: "Votazioni",
        description: "Votazione: revoca, revoca o rimozione",
        placeholder: "Seleziona il tipo di voto...",
        options: {
          upvote: "Votazioni",
          downvote: "Votazioni",
          remove: "Rimuovere Vote",
        },
      },
      response: {
        title: "Risultato Votativo",
        description: "Conti di voto aggiornati",
        upvotes: {
          content: "Votazioni",
        },
        downvotes: {
          content: "Giù",
        },
        userVote: {
          content: "Votazioni",
        },
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Dati di voto non validi forniti",
        },
        network: {
          title: "Errore di rete",
          description: "Non è possibile connettersi al server",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Devi essere connesso per votare sui messaggi",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Non hai il permesso di votare su questo messaggio",
          incognitoNotAllowed:
            "I filetti incisivi non possono essere accessibili sul server",
        },
        notFound: {
          title: "Non trovato",
          description: "Messaggio non trovato",
        },
        server: {
          title: "Errore del server",
          description: "Non ha registrato il voto",
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
          description: "Si è verificato un conflitto di voti",
        },
      },
      success: {
        title: "Voto registrato",
        description: "Il vostro voto è stato registrato con successo",
      },
    },
  },
};
