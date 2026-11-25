import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    metric: {
      occurrences: "Occorrenze",
      distinct: "Classi di errore viste",
      new: "Nuove classi di errore",
      openBacklog: "Backlog aperto (irrisolto ora)",
    },
    level: {
      all: "Errori e avvisi",
      error: "Solo errori",
      warn: "Solo avvisi",
    },
  },
  post: {
    title: "Serie dei log di errore",
    titleShort: "Log di errore",
    description:
      "Volume degli errori nel tempo. Occorrenze e classi viste vengono dal contatore giornaliero (per giorno, storico dal 22/11/2026). Le nuove classi contano le prime comparse. Il backlog aperto è il numero attuale di classi irrisolte, salvato a ogni esecuzione del grafo.",
    fields: {
      resolution: {
        label: "Risoluzione",
        description:
          "Intervallo di calcolo (occorrenze e classi al massimo giornaliere)",
      },
      range: {
        label: "Intervallo",
        description: "Intervallo di tempo da interrogare",
      },
      lookback: {
        label: "Lookback",
        description: "Barre extra prima dell'inizio dell'intervallo",
      },
      metric: {
        label: "Metrica",
        description:
          "Cosa contare: occorrenze, classi viste, nuove classi o backlog aperto",
      },
      level: {
        label: "Livello",
        description: "Errori, avvisi o entrambi",
      },
      result: {
        label: "Conteggio log di errore",
        description: "Serie temporale di output",
      },
      meta: {
        label: "Meta",
        description: "Metadati di esecuzione del nodo",
      },
    },
    success: {
      title: "Serie dei log di errore calcolata",
      description: "Serie dei log di errore restituita",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso all'amministratore richiesto",
      },
      server: { title: "Errore del server", description: "Query fallito" },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      validation: {
        title: "Convalida fallita",
        description: "Parametri della richiesta non validi",
      },
      notFound: {
        title: "Account o sessione non trovati",
        description: "Account o sessione non trovati",
      },
      conflict: { title: "Conflitto", description: "Conflitto" },
      network: {
        title: "Errore di rete",
        description: "La richiesta di rete è fallita",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Salvare le modifiche prima",
      },
    },
  },
};
