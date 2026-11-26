import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Stime",
  tags: { payment: "pagamento", estimate: "Grafico" },
  post: {
    title: "Accettare la stima",
    titleShort: "Accettare la stima",
    description: "Mark preventivo come accettato dal cliente",
    form: {
      title: "Accettare la stima",
      description: "Mark preventivo come accettato dal cliente",
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
      description: "Mark preventivo come accettato dal cliente",
    },
  },
  estimateId: { label: "Stima ID", description: "La stima di agire su" },
  widget: {
    cancel: "Annulla",
    loading: "Caricamento del preventivo",
    unavailable: "Solo i preventivi inviati possono essere accettati.",
    total: "Totale",
    back: "Indietro",
    submit: "Accettare la stima",
    accepted: "Stime contrassegnate come accettate.",
    confirmMessage: "Ciò segnerà la stima accettata dal cliente.",
  },
};
