import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    titleShort: "Consentimento Libero Usato",
    title: "Consentimento Libero Usato (mese a data)",
    description:
      "Crediti gratuiti consumati suddivisi per crediti gratuiti concessi, sia al mese (mese UTC, reimposta sul 1°). 0 = nulla usato, 1 = ogni credito libero scontato speso. Lavori per assegni (ospite / utente / newsletter).",
    fields: {
      resolution: { label: "Risoluzione", description: "Tempo di calcolo" },
      range: {
        label: "Gamma di intervallo",
        description: "Intervallo di tempo per query",
      },
      lookback: {
        label: "Lookback",
        description: "Barre extra prima dell'inizio della gamma",
      },
      result: {
        label: "Consentimento Libero Usato",
        description: "Serie di tempo di uscita",
      },
      meta: { label: "Meta", description: "metadati di esecuzione del nodo" },
    },
    success: {
      title: "Credits Free Pool Utilizzo calcolato",
      description: "Credits Free Pool Serie di utilizzo restituito",
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
