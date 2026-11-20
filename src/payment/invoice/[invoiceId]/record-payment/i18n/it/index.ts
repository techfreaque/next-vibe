import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Fatturazione",
  tags: {
    payment: "pagamento",
    invoice: "fattura",
  },
  post: {
    title: "Pagamento manuale di registrazione",
    titleShort: "Pagamento record",
    description:
      "Registrare un pagamento manuale contro una fattura. Lo segna come Paid se completamente sistemato.",
    form: {
      title: "Pagamento record",
      description:
        "Immettere i dati di pagamento per registrare contro questa fattura",
    },
    response: {
      success: "Pagamento registrato",
      message: "Messaggio di stato",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      validation: {
        title: "Errore di convalida",
        description: "Parametri di pagamento non validi",
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
        description: "La fattura è già pagata o annullata",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Pagamento manuale registrato",
    },
  },
  enums: {
    manualPaymentMethod: {
      cash: "Contanti",
      bankTransfer: "Bonifico bancario",
      other: "Altro",
    },
  },
  invoiceId: {
    label: "Fatturazione ID",
    description: "ID della fattura per registrare il pagamento contro",
    placeholder: "Inserire la fattura ID",
  },
  amount: {
    label: "Importo pagato",
    description: "Importo ricevuto",
    placeholder: "0.00",
  },
  method: {
    label: "Metodo di pagamento",
    description: "Come è stato ricevuto il pagamento",
    placeholder: "Selezionare il metodo",
  },
  paidAt: {
    label: "Data di pagamento",
    description: "Quando il pagamento è stato ricevuto",
    placeholder: "Seleziona una data",
  },
  accountNodeId: {
    label: "Account Node ID",
    description: "Facoltativo: nodo contabile che ha ricevuto questo pagamento",
    placeholder: "Inserire il nodo dell'account ID",
  },
  widget: {
    back: "Indietro",
    submit: "Pagamento record",
    paymentRecorded: "Pagamento registrato con successo.",
    viewInvoice: "Visualizza Fattura",
  },
};
