import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Stime",
  tags: { payment: "pagamento", estimate: "Grafico" },
  post: {
    title: "Stime duplicate",
    titleShort: "Stime duplicate",
    description: "Sostituire questa stima a un nuovo progetto",
    form: {
      title: "Stime duplicate",
      description: "Sostituire questa stima a un nuovo progetto",
    },
    response: {
      success: "Operazione riuscita",
      message: "Messaggio di stato",
      newEstimateId: "Nuova stima ID",
      estimateNumber: "Nuovo numero di preventivo",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      validation: {
        title: "Errore di convalida",
        description: "Parametri non validi",
      },
      server: {
        title: "Errore del server",
        description: "Errore del server interno",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      forbidden: { title: "Accesso negato", description: "Accesso negato" },
      notFound: { title: "Non trovato", description: "Stima non trovata" },
      conflict: {
        title: "Conflitto",
        description: "Non può eseguire l'azione nello stato attuale",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
    },
    success: {
      title: "Stima Duplicata",
      description: "È stato creato un nuovo progetto di stima",
    },
  },
  estimateId: {
    label: "Stima ID",
    description: "La stima per duplicare",
  },
  widget: {
    back: "Indietro",
    submit: "Stime duplicate",
    viewDuplicate: "Visualizza Duplicato",
    duplicateNote:
      "Una nuova stima del progetto verrà creata con le stesse linee e dettagli.",
  },
};
