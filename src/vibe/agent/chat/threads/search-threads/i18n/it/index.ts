/**
 * Thread Search API - English Translations
 */

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
  tags: {
    threads: "Conversazioni",
  },
  search: {
    get: {
      title: "Ricerca di filetti",
      titleShort: "Ricerca di filetti",
      description:
        "Cerca tra i titoli, le anteprime e le richieste di sistema utilizzando la ricerca full-text",
      container: {
        title: "Ricerca nelle conversazioni",
        description: "Ricerca di fili con pertinenza classifica",
      },
      query: {
        label: "Ricerca di Query",
        description:
          "Inserisci i termini di ricerca. Supporta frasi in preventivi, operatori AND / OR",
        placeholder: "Ricerca di filetti...",
      },
      sections: {
        pagination: {
          title: "Pagination",
          description: "Risultato di controllo",
        },
      },
      page: {
        label: "Pagina",
        description: "Numero di pagina (1-based)",
      },
      limit: {
        label: "Risultati per Pagina",
        description: "Numero di risultati per pagina (1-100)",
      },
      sortBy: {
        label: "Ordina per",
        description: "Ordina i risultati per rilevanza o data",
        options: {
          relevance: "Rilevamento",
          date: "Data (il più basso)",
        },
      },
      includeArchived: {
        label: "Includere Archiviato",
        description: "Includere filetti archiviati nei risultati di ricerca",
      },
      response: {
        results: {
          title: "Risultati della ricerca",
          description: "Filetti che corrispondono alla tua ricerca",
          thread: {
            id: {
              label: "File ID",
            },
            title: {
              label: "Titolo",
            },
            preview: {
              label: "Anteprima",
            },
            rank: {
              label: "Rilevamento Score",
              description: "I punteggi più alti indicano partite migliori",
            },
            headline: {
              label: "Snippet",
              description: "Estratto evidenziato che mostra i termini abbinati",
            },
            status: {
              label: "Stato",
            },
            createdAt: {
              label: "Creato a",
            },
            updatedAt: {
              label: "Aggiornato At",
            },
          },
        },
        totalResults: {
          label: "Risultati totali",
          description:
            "Numero totale di filetti corrispondenti alla query di ricerca",
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
          description: "Devi essere connesso ai filetti di ricerca",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Non hai il permesso di cercare i filetti",
        },
        notFound: {
          title: "Non trovato",
          description: "Nessun thread trovato",
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
        description: "Ricerca completata con successo",
      },
    },
  },
};
