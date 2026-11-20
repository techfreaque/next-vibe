import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    messages: "Messaggi",
  },
  search: {
    get: {
      title: "Ricerca di messaggi globali",
      titleShort: "Messaggi di ricerca",
      description:
        "Cerca messaggi in tutti i thread utilizzando la ricerca full-text",
      container: {
        title: "Ricerca di messaggi globali",
        description: "Cerca messaggi in tutti i tuoi filetti",
      },
      query: {
        label: "Ricerca di Query",
        description: "Testo da cercare nei messaggi",
      },
      sections: {
        filters: {
          title: "Filtri",
          description: "Filtri opzionali per risultati di ricerca ristretti",
        },
        pagination: {
          title: "Pagina",
          description: "Impostazioni di navigazione pagina",
        },
      },
      rootFolderId: {
        label: "Cartella di radice",
        description:
          "Limitare la ricerca a un tipo di cartella radice specifico (privato, condiviso, pubblico, sfondo)",
      },
      role: {
        label: "Messaggio Role",
        description:
          "Filtra per messaggio ruolo (utente, assistente, sistema, strumento, errore)",
      },
      startDate: {
        label: "Data di inizio",
        description: "Solo includere i messaggi creati dopo questa data",
      },
      endDate: {
        label: "Data di fine",
        description: "Solo includere i messaggi creati prima di questa data",
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
            title: "Risultato del messaggio",
            messageId: {
              content: "Messaggio ID",
            },
            threadId: {
              content: "File ID",
            },
            threadTitle: {
              content: "Titolo del thread",
            },
            role: {
              content: "Role",
            },
            headline: {
              content: "Contenuto:",
            },
            createdAt: {
              content: "Creato a",
            },
            rootFolderId: {
              content: "Cartella di radice",
            },
          },
        },
        total: {
          content: "Risultati totali",
        },
        page: {
          content: "Pagina corrente",
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
          description: "Non hai il permesso di eseguire questa ricerca",
        },
        notFound: {
          title: "Non trovato",
          description:
            "Nessun risultato trovato corrispondente alla tua richiesta",
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
        description: "Ricerca globale dei messaggi completata con successo",
      },
    },
  },
};
