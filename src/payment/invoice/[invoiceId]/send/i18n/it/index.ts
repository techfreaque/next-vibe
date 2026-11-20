import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Fatturazione",
  tags: {
    payment: "pagamento",
    invoice: "fattura",
  },
  post: {
    title: "Invia fattura",
    titleShort: "Invia fattura",
    description:
      "Segnare un progetto di fattura come inviato. stato di transizione per aprire",
    form: {
      title: "Invia fattura",
      description: "Invia la fattura al cliente",
    },
    response: {
      success: "Fattura inviata",
      message: "Messaggio di stato",
      viewUrl: "Vista clienti URL",
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
        title: "Conflitto",
        description: "La fattura non è in progetto di stato",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Fatturato contrassegnato come inviato",
    },
  },
  invoiceId: {
    label: "Fatturazione ID",
    description: "ID della fattura da inviare",
    placeholder: "Inserire la fattura ID",
  },
  widget: {
    back: "Indietro",
    submit: "Invia fattura",
    sent: "Fattura inviata",
    viewUrl: "Link di visualizzazione del cliente",
  },
};
