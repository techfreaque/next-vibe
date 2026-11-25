import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    kind: {
      paid: "Pagati (pacchetti + abbonamenti)",
      packs: "Pacchetti pagati",
      subscriptions: "Crediti abbonamento",
      gifted: "Regalati (admin)",
    },
  },
  post: {
    titleShort: "Crediti emessi",
    title: "Crediti emessi (pagati, regalati)",
    description:
      "Crediti aggiunti ai portafogli per intervallo, in crediti (non denaro): pacchetti pagati e crediti abbonamento da pagamenti reali, oppure crediti regalati dall'admin (tester, creator, rimborsi di cortesia).",
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
      kind: {
        label: "Tipo",
        description:
          "Cosa contare: pacchetti pagati + abbonamenti, solo pacchetti, solo abbonamenti o crediti regalati dall'admin",
      },
      result: {
        label: "Crediti emessi",
        description: "Serie di tempo di uscita",
      },
      meta: { label: "Meta", description: "metadati di esecuzione del nodo" },
    },
    success: {
      title: "Crediti Acquistati calcolati",
      description: "Credits Serie acquistata restituita",
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
