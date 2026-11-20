import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: {
    vibeSense: "vibe-sense",
  },

  list: {
    title: "Grafi di pipelina",
    titleShort: "Grafi",
    description: "Elenca tutti i grafici visibili all'utente corrente",
    fields: {
      search: {
        label: "Cerca",
        description: "Filtra i grafici per nome o slug",
        placeholder: "Cerca i grafici...",
      },
    },
    container: {
      title: "Grafi",
      description: "Tutti i grafici delle tubazioni",
    },
    response: {
      graphs: "Grafi",
      graph: {
        id: "ID",
        slug: "Slug",
        name: "Nome",
        description: "Designazione",
        ownerType: "Tipo di proprietario",
        ownerId: "Proprietario ID",
        isActive: "Attivo",
        createdAt: "Creato a",
      },
    },
    success: {
      title: "Grafi caricati",
      description: "I grafi di pipeline recuperati con successo",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Autenticazione necessaria per elencare i grafici",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso all'amministratore richiesto",
      },
      server: {
        title: "Errore del server",
        description: "Non caricate i grafici",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore inaspettato si è verificato durante il caricamento dei grafici",
      },
      validation: {
        title: "Convalida fallita",
        description: "Parametri della richiesta non validi",
      },
      notFound: {
        title: "Account o sessione non trovati",
        description: "Nessun grafico trovato",
      },
      conflict: {
        title: "Conflitto",
        description: "Il conflitto di risorse",
      },
      network: {
        title: "Errore di rete",
        description:
          "La richiesta di rete è fallita durante il caricamento dei grafici",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Salvare le modifiche prima di continuare",
      },
    },
  },

  widget: {
    refresh: "Aggiorna",
    createGraph: "Nuovo Graph",
    active: "Attivo",
    inactive: "Inattivo",
    empty:
      "Non ci sono ancora grafici. Crea il tuo primo grafico delle tubazioni.",
    error: "Non è riuscito a caricare grafici. Per favore, riprovate.",
    archive: "Archivia",
    delete: "Elimina",
    searchPlaceholder: "Cerca per nome, slug, o descrizione...",
    noMatchTitle: "Nessun grafico corrispondente",
    noMatchHint: "Prova un termine di ricerca diverso",
    clearSearch: "Cancella la ricerca",
    searchResults: "risultati per",
    stats: {
      total: "Grafici totali",
      active: "Attivo",
      system: "Sistema",
      admin: "Amministratore",
    },
  },

  create: {
    title: "Creare Graph",
    description: "Creare un nuovo grafico delle tubazioni",
    fields: {
      name: {
        label: "Nome",
        description: "Nome dell'esposizione del grafico",
        placeholder: "Il mio grafico",
      },
      slug: {
        label: "Slug",
        description: "Identificatore unico (basso, solo iphens)",
        placeholder: "il mio",
      },
      description: {
        label: "Designazione",
        description: "Descrizione facoltativa",
        placeholder: "",
      },
      config: {
        label: "Configurazione",
        description: "Configurazione del grafico DAG",
      },
    },
    response: {
      id: "Grafico ID",
    },
    success: {
      title: "Grafio creato",
      description: "Grafico Pipeline creato con successo",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Autenticazione necessaria per creare grafici",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso all'amministratore richiesto",
      },
      server: {
        title: "Errore del server",
        description: "Non creato grafico",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore inaspettato si è verificato durante la creazione di grafico",
      },
      validation: {
        title: "Convalida fallita",
        description: "Configurazione del grafico non valido",
      },
      notFound: {
        title: "Account o sessione non trovati",
        description: "Risorsa non trovata",
      },
      conflict: {
        title: "Conflitto",
        description: "Graph slug esiste già",
      },
      network: {
        title: "Errore di rete",
        description:
          "La richiesta di rete non è riuscita durante la creazione del grafico",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Salvare le modifiche prima di continuare",
      },
    },
  },
};
