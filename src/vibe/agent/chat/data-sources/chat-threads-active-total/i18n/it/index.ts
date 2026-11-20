import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Totale conversazioni attive",
    titleShort: "Conversazioni attive",
    description:
      "Totale delle conversazioni attive rilevato in ogni intervallo",
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
        label: "Conversazioni attive",
        description: "Serie temporale risultante",
      },
      meta: {
        label: "Metadati",
        description: "Metadati sull’esecuzione del nodo",
      },
    },
    success: {
      title: "Calcolo completato: Conversazioni attive",
      description: "Serie temporale restituita: Conversazioni attive",
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
