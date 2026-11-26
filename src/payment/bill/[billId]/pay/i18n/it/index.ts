import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "pagamento",
    bill: "fattura-fornitore",
    ap: "debiti-verso-fornitori",
  },
  post: {
    title: "Paga fattura",
    titleShort: "Paga fattura",
    description:
      "Segna una fattura approvata come pagata e contabilizza il pagamento.",
    billId: {
      label: "Fattura",
      description: "La fattura da segnare come pagata.",
    },
    errors: {
      approvalPosting:
        "Prima di pagare questa fattura serve la scrittura contabile di approvazione.",
      paymentAccount:
        "Scegli un conto bancario o di cassa attivo di questa azienda.",
      paymentPosting:
        "Controlla la data di pagamento, la valuta aziendale e i conti di registrazione.",
      validation: {
        title: "Errore di convalida",
        description: "Input non valido",
      },
      unauthorized: {
        title: "Accedi per continuare",
        description: "Accedi per pagare le fatture.",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Servono i permessi di contabile o amministratore.",
      },
      conflict: {
        title: "Impossibile pagare la fattura",
        description: "Puoi segnare come pagate solo le fatture approvate.",
      },
      server: {
        title: "Errore del server",
        description: "Non è possibile registrare il pagamento",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      network: {
        title: "Errore di rete",
        description: "Controlla la connessione",
      },
      notFound: {
        title: "Fattura non trovata",
        description: "Questa fattura non esiste.",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    success: {
      title: "Fattura pagata",
      description: "La fattura è stata segnata come pagata.",
    },
    response: {
      status: "Stato",
      paidAt: "Data di pagamento",
    },
    widget: {
      back: "Indietro",
      details: "Dettagli del pagamento",
      loadingBill: "Caricamento della fattura…",
      retry: "Riprova",
      submit: "Segna come pagata",
      paymentRecorded: "Pagamento registrato",
    },
  },
  enums: {
    billStatus: {
      DRAFT: "Bozza",
      RECEIVED: "Ricevuta",
      APPROVED: "Approvata",
      PAID: "Pagata",
      DISPUTED: "Contestata",
    },
  },
  accountNodeId: {
    label: "Conto bancario o di cassa",
    description:
      "Lascia il campo vuoto per usare il conto di pagamento predefinito.",
  },
  paidAt: {
    label: "Data di pagamento",
    description: "Data del pagamento",
    placeholder: "2024-01-31",
  },
};
