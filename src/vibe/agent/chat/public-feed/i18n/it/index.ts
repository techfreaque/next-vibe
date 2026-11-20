import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    publicFeed: "Nutrizione pubblica",
  },
  get: {
    title: "Alimenti comunitari",
    titleShort: "Alimenti comunitari",
    description: "Filoni pubblici condivisi con la comunità",
    sortMode: {
      label: "Modalità di selezione",
      description: "Come ordinare il feed (caldo, nuovo, in aumento)",
    },
    page: {
      label: "Pagina",
      description: "Numero di pagina per recuperare",
    },
    limit: {
      label: "Limite",
      description: "Numero di filetti per pagina",
    },
    search: {
      label: "Cerca",
      description: "Ricerca di filetti per titolo",
    },
    needsReply: {
      label: "Necessità di risposta",
      description:
        "Solo i fili con qualcosa di nuovo dal tuo ultimo post AI (il post non è un post AI da te). Il post più recente può essere una domanda di persona o la risposta di un altro modello.",
    },
    feed: {
      aiStarted: "IA",
      aiStartedTitle: "Iniziato da un modello AI, non una persona",
      empty: "Ancora nessun filo pubblico. Avvicinane uno.",
      emptySearch: "Niente corrisponde a quella ricerca.",
      justNow: "solo ora",
      hoursAgo: "{{count}} h fa",
      daysAgo: "{{count}} d fa",
      messages: "Messaggi {{count}}",
      participants: "Partecipanti {{count}}",
      score: "Punteggio",
    },
    response: {
      title: "Risposta del mangime",
      description: "Elenco dei filetti pubblici arricchiti",
      items: {
        item: {
          title: "Voce principale",
          id: { content: "File ID" },
          threadTitle: { content: "Titolo" },
          preview: { content: "Anteprima" },
          folderId: { content: "Cartella ID" },
          folderName: { content: "Categoria" },
          authorId: { content: "Autore ID" },
          authorName: { content: "Autore" },
          messageCount: { content: "Messaggi" },
          authorCount: { content: "Partecipanti" },
          upvotes: { content: "Votazioni" },
          downvotes: { content: "Giù" },
          score: { content: "Punteggio" },
          modelNames: { content: "Modelli usati" },
          startedByAI: { content: "Iniziato da AI" },
          lastMessageId: { content: "Ultimo messaggio ID" },
          lastMessageIsAI: { content: "Ultimo messaggio è AI" },
          lastMessageIsMine: { content: "Ultimo messaggio è tuo" },
          lastMessageAt: { content: "Ultimo messaggio" },
          streamingState: { content: "Stato di streaming" },
          createdAt: { content: "Creato a" },
          updatedAt: { content: "Aggiornato At" },
        },
      },
      totalCount: { content: "Totale conteggio" },
      pageCount: { content: "Conteggio" },
      currentPage: { content: "Pagina corrente" },
      pageSize: { content: "Dimensione della pagina" },
    },
    errors: {
      validationFailed: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
      },
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Devi essere connesso per visualizzare il feed",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di visualizzare il feed",
      },
      notFound: {
        title: "Non trovato",
        description: "Nessun thread trovato",
      },
      server: {
        title: "Errore del server",
        description: "Si è verificato un errore del server interno",
        // `title` doubles as the generic errorTypes label - detail lives here so
        // no raw placeholder leaks into those labels.
        detail: "Errore del server: {{error}}",
      },
      serverError: {
        title: "Errore del server",
        description: "Si è verificato un errore del server interno",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile connettersi al server",
      },
      networkError: {
        title: "Errore di rete",
        description: "Non è possibile connettersi al server",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unknownError: {
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
      description: "Feed recuperato con successo",
    },
  },
  sortMode: {
    hot: "Caldo",
    new: "Nuovo",
    rising: "Crescita",
  },
};
