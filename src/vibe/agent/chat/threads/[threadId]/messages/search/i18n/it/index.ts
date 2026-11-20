import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    messages: "Messaggi",
  },
  search: {
    get: {
      title: "Messaggi di ricerca",
      titleShort: "Messaggi di ricerca",
      description:
        "Cerca messaggi all'interno di un thread specifico utilizzando la ricerca full-text",
      container: {
        title: "Ricerca nei messaggi",
        description: "Cerca messaggi in questo thread",
      },
      threadId: {
        label: "File ID",
        description: "La ID del thread per la ricerca",
      },
      query: {
        label: "Ricerca di Query",
        description: "Testo da cercare nei messaggi",
      },
      sections: {
        pagination: {
          title: "Pagination",
          description: "Impostazioni di navigazione pagina",
        },
      },
      page: {
        label: "Pagina",
        description: "Numero di pagina per recuperare",
      },
      limit: {
        label: "Limite",
        description: "Numero di risultati per pagina",
      },
      response: {
        results: {
          message: {
            title: "Messaggio",
            id: {
              content: "Messaggio ID",
            },
            content: {
              content: "Contenuti",
            },
            role: {
              content: "Role",
            },
            rank: {
              content: "Rilevamento Score",
            },
            headline: {
              content: "Snippet",
            },
            createdAt: {
              content: "Creato a",
            },
          },
        },
        totalCount: {
          content: "Risultati totali",
        },
      },
      errors: {
        validationFailed: {
          title: "Convalida non riuscita",
          description: "Parametri di ricerca non validi forniti",
        },
        network: {
          title: "Errore di rete",
          description: "Non è possibile connettersi al server",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Devi essere connesso ai messaggi di ricerca",
        },
        forbidden: {
          title: "Accesso negato",
          description:
            "Non hai il permesso di cercare i messaggi in questo thread",
        },
        notFound: {
          title: "Filo non trovato",
          description:
            "Il thread specificato non esiste o non hai accesso ad esso",
        },
        serverError: {
          title: "Errore del server",
          description:
            "Un errore del server interno è avvenuto durante la ricerca",
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
        description: "Ricerca messaggi completata con successo",
      },
    },
  },
};
