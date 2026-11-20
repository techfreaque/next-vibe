import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Conversazioni create",
    titleShort: "Nuove conversazioni",
    description: "Numero di nuove conversazioni per intervallo",
    fields: {
      resolution: {
        label: "Risoluzione",
        description: "Intervallo usato per il calcolo",
      },
      range: { label: "Periodo", description: "Periodo da esaminare" },
      lookback: {
        label: "Storico aggiuntivo",
        description: "Intervalli aggiuntivi prima dell’inizio del periodo",
      },
      result: {
        label: "Conversazioni create",
        description: "Serie temporale risultante",
      },
      meta: {
        label: "Metadati",
        description: "Metadati sull’esecuzione del nodo",
      },
    },
    success: {
      title: "Calcolo completato: Conversazioni create",
      description: "Serie temporale restituita: Conversazioni create",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Servono i permessi di amministratore",
      },
      server: {
        title: "Errore del server",
        description: "Impossibile eseguire la query",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      validation: {
        title: "Convalida fallita",
        description: "Parametri della richiesta non validi",
      },
      notFound: { title: "Non trovato", description: "Non trovato" },
      conflict: { title: "Conflitto", description: "Conflitto" },
      network: {
        title: "Errore di rete",
        description: "Richiesta di rete fallita",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Prima salva le modifiche",
      },
    },
  },
};
