import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Fatturazione",
  tags: {
    payment: "pagamento",
    invoice: "fattura",
    ar: "A.",
  },
  post: {
    title: "Fatturato",
    titleShort: "Fatturato",
    description:
      "Cancellare una bozza o una fattura aperta. Le fatture pagate non possono essere annullate. Se esiste una voce del diario, è invertita.",
    form: {
      title: "Fatturato",
      description: "Questa azione non può essere annullata.",
    },
    response: {
      success: "Fattura vuota",
      message: "Messaggio di stato",
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
        description: "Si è verificato un errore interno del server",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso non consentito",
      },
      notFound: {
        title: "Non trovato",
        description: "Fattura non trovata",
      },
      conflict: {
        title: "Non si può",
        description: "Le fatture pagate non possono essere annullate",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Fattura svuotata con successo",
    },
  },
  invoiceId: {
    label: "Fatturazione ID",
    description: "ID della fattura a vuoto",
    placeholder: "Inserire la fattura ID",
  },
  widget: {
    back: "Indietro",
    submit: "Fatturato",
    warning:
      "Questa azione non può essere annullata. La fattura verrà cancellata in modo permanente.",
    confirm: "Fatturato",
    voided: "Fattura vuota",
    backToList: "Torna a Suggerimenti",
  },
};
