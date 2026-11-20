import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Fatturazione",
  tags: {
    payment: "pagamento",
    invoice: "fattura",
    ar: "A.",
  },
  post: {
    title: "Inviare il Mittente di Pagamento",
    titleShort: "Inviare il Mittente",
    description:
      "Invia un promemoria di pagamento per una fattura in ritardo. La fattura deve essere lo stato OPEN e oltre la sua data di scadenza. Registra il promemoria come una nota del cliente.",
    form: {
      title: "Inviare il Mittente",
      description: "Informare il cliente sul loro pagamento in ritardo",
    },
    response: {
      success: "Mitragliatore inviato",
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
        title: "Non esagerare.",
        description:
          "I remittenti possono essere inviati solo per fatture aperte oltre la data di scadenza",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Promemoria di pagamento inviato e registrato",
    },
  },
  invoiceId: {
    label: "Fatturazione ID",
    description: "ID della fattura indebita",
    placeholder: "Inserire la fattura ID",
  },
  message: {
    label: "Messaggio personalizzato",
    description:
      "Messaggio personalizzato opzionale da includere nel promemoria",
    placeholder: "Aggiungi una nota personale al promemoria...",
  },
  widget: {
    back: "Indietro",
    submit: "Inviare il Mittente",
    reminderSent:
      "Mi hanno mandato un mittente. Il cliente è stato notificato.",
    viewInvoice: "Visualizza Fattura",
  },
};
