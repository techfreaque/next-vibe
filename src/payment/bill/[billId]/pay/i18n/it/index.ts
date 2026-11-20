import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "pagamento",
    bill: "fatturazione",
    ap: "contabilità-pagabile",
  },
  post: {
    title: "Paga Bill",
    titleShort: "Paga Bill",
    description:
      "Contrassegnare una fattura approvata come pagato e postare l'ingresso della rivista di pagamento",
    billId: {
      label: "Bill ID",
      description: "Il disegno di legge per contrassegnare come pagato",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Input non valido",
      },
      unauthorized: {
        title: "Non firmata",
        description: "Accedi per pagare le bollette",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Il ruolo contabile o amministrativo richiesto",
      },
      conflict: {
        title: "Stato non valido",
        description: "Bill deve essere APPROVED prima del pagamento",
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
        title: "Bill non trovato",
        description: "Questa legge non esiste",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    success: {
      title: "Bill Paid",
      description: "Bilancio indicato come corrisposto",
    },
    response: {
      status: "Stato",
      paidAt: "Pagato a",
    },
    widget: {
      back: "Indietro",
      submit: "Mark come Paid",
      paymentRecorded: "Pagamento registrato",
    },
  },
  enums: {
    billStatus: {
      DRAFT: "Progetto",
      RECEIVED: "Ricevuto.",
      APPROVED: "Approvazione",
      PAID: "Pagato",
      DISPUTED: "Disputato",
    },
  },
  accountNodeId: {
    label: "Banca / Conto Contanti",
    description: "Nodo conto usato per pagare (Bank o Cash)",
    placeholder: "Account UUID",
  },
  paidAt: {
    label: "Data di pagamento",
    description: "Data del pagamento",
    placeholder: "2024-01-31",
  },
};
