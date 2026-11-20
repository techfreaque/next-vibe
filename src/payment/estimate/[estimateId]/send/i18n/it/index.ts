import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Stime",
  tags: { payment: "pagamento", estimate: "Grafico" },
  post: {
    title: "Invia la tua stima",
    titleShort: "Invia la tua stima",
    description: "Valuta di marca come inviato al cliente",
    form: {
      title: "Invia la tua stima",
      description: "Valuta di marca come inviato al cliente",
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
      description: "Valuta di marca come inviato al cliente",
    },
  },
  estimateId: { label: "Stima ID", description: "La stima di agire su" },
  widget: {
    back: "Indietro",
    submit: "Invia la tua stima",
    sent: "Stime contrassegnate come inviate al cliente.",
    sendNote:
      "Lo stato di stima sarà aggiornato a Sent. Il cliente può quindi accettare o rifiutare.",
  },
};
