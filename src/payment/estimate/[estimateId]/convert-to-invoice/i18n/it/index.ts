import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Stime",
  tags: { payment: "pagamento", estimate: "Grafico", invoice: "fattura" },
  post: {
    title: "Convertire Stime in Fattura",
    titleShort: "Converti in Fattura",
    description: "Convertire una stima accettata in un progetto di fattura",
    form: {
      title: "Converti in Fattura",
      description: "Convertire questa stima in una fattura",
    },
    response: {
      success: "Convertito in fattura",
      message: "Messaggio di stato",
      invoiceId: "Creato Fattura ID",
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
        description:
          "La stima deve essere nello stato SENT o ACCEPTED per convertire",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Stime convertite in fattura",
    },
  },
  estimateId: { label: "Stima ID", description: "La stima per convertire" },
  widget: {
    back: "Indietro",
    submit: "Converti in Fattura",
    converted: "Fattura creata da questa stima.",
    viewInvoice: "Visualizza Fattura",
    convertNote:
      "Verrà creata una bozza di fattura con gli stessi articoli di linea. La stima sarà contrassegnata come convertita.",
  },
};
