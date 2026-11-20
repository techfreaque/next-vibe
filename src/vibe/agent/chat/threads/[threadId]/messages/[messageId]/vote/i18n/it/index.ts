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
  post: {
    title: "Vota il messaggio",
    titleShort: "Vota il messaggio",
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
};
