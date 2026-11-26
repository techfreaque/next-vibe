import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Stime",
  tags: { payment: "pagamento", estimate: "Grafico" },
  post: {
    title: "Decidere la stima",
    titleShort: "Decidere la stima",
    description: "Valuta di marca come declinato dal cliente",
    form: {
      title: "Decidere la stima",
      description: "Valuta di marca come declinato dal cliente",
    },
    response: { success: "Operazione riuscita", message: "Messaggio di stato" },
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
      title: "Operazione riuscita",
      description: "Valuta di marca come declinato dal cliente",
    },
  },
  estimateId: { label: "Stima ID", description: "La stima di agire su" },
  widget: {
    loading: "Caricamento del preventivo",
    unavailable: "Solo i preventivi inviati possono essere rifiutati.",
    total: "Totale",
    back: "Indietro",
    submit: "Decidere la stima",
    declined: "Stima segnata come declinata.",
    confirmTitle: "Decidere questa stima?",
    confirmDescription:
      "Ciò segnerà la stima come declinata. Questa azione non può essere annullata.",
    confirmButton: "Declinazione",
    cancelButton: "Annulla",
  },
};
