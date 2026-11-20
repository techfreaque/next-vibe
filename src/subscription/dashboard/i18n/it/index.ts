import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Panoramica dell’abbonamento",
    titleShort: "Dashboard",
    description: "Il tuo abbonamento a colpo d’occhio",
    errors: {
      unauthorized: {
        title: "Accedi per continuare",
        description: "Accedi per vedere il tuo abbonamento",
      },
      validation: {
        title: "Errore di convalida",
        description: "Parametri non validi",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di vedere questo",
      },
      server: {
        title: "Errore del server",
        description: "Non è possibile caricare i dati di abbonamento",
        detail: "Non è possibile caricare il tuo abbonamento: {{error}}",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "È successo qualcosa di inaspettato",
      },
      conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
      network: {
        title: "Errore di connessione",
        description: "Controlla la tua connessione internet",
      },
      notFound: {
        title: "Non trovato",
        description: "Nessun abbonamento trovato",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    success: {
      title: "Caricato",
      description: "Dati di abbonamento caricati",
    },
    response: {
      activeCount: "Attivo",
      cancelingCount: "In disdetta",
      trialCount: "Prova",
      totalCount: "Totale",
    },
  },
  widget: {
    renewalDiagnostics: "Rinnovi e guasti di pagamento",
    actions: "Azioni rapide",
    mySubscription: "Il mio abbonamento",
    manage: "Gestisci",
    refresh: "Aggiorna",
    noData: "Nessun dato di abbonamento disponibile",
  },
};
