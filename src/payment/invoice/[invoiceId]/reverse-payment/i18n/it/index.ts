import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Storna incasso cliente",
  description:
    "Indica il motivo della correzione. La registrazione originale resta nel giornale.",
  invoiceId: "Riferimento della fattura",
  entryId: "Riferimento della registrazione di incasso",
  date: "Data dello storno",
  reason: "Motivo dello storno",
  reasonPlaceholder: "Per esempio, la banca ha restituito il pagamento",
  datePlaceholder: "Oggi",
  viewInvoice: "Apri fattura",
  reversal: "Registrazione di storno",
  originalDate: "Data dell’incasso",
  receiptAmount: "Importo incassato",
  postingStatus: "Stato della registrazione",
  viewReversal: "Apri la registrazione di storno",
  cancel: "Annulla",
  confirmTitle: "Contabilizzare questo storno?",
  confirm: "Contabilizza lo storno",
  success: {
    title: "Incasso stornato",
    description: "Il saldo della fattura tiene conto dello storno.",
  },
  invalidDate: "Scegli una data dalla data dell’incasso a oggi.",
  noPeriod: "Nessun periodo contabile aperto include questa data.",
  invalidReceipt: "Questo incasso non può essere stornato per questa fattura.",
  invalidLines:
    "Le righe salvate sono incomplete o appartengono a un’altra valuta o azienda.",
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
  tags: { payment: "payment", invoice: "invoice" },
};
