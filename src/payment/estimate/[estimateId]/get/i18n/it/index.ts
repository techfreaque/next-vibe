import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  lineRounding: "Arrotondamento per riga",
  category: "Stime",
  tags: { payment: "pagamento", estimate: "Grafico" },
  post: {
    title: "Ottieni il preventivo",
    titleShort: "Ottieni il preventivo",
    description: "Ottenere una stima unica con tutte le sue linee",
    form: {
      title: "Ottieni il preventivo",
      description: "Ottenere una stima unica con tutte le sue linee",
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
      description: "Ottenere una stima unica con tutte le sue linee",
    },
  },
  estimateId: { label: "Stima ID", description: "La stima di agire su" },
  widget: {
    send: "Segna come inviato",
    terms: "Condizioni",
    noItems: "Questo preventivo non contiene voci.",
    addLine: "Aggiungere la linea",
    accept: "Accettazione dei record",
    decline: "Rifiuto record",
    openInvoice: "Fattura aperta",
    back: "Indietro",
    submit: "Guarda il preventivo",
    estimateNumber: "Stima",
    valid: "Valido fino a quando",
    customer: "Cliente",
    lineItems: "Elementi di linea",
    description: "Designazione",
    qty: "Qty",
    unitPrice: "Prezzo unitario",
    tax: "Imposte",
    total: "Totale",
    subtotal: "Totale parziale",
    sendEstimate: "Invia",
    acceptEstimate: "Accettare",
    declineEstimate: "Declinazione",
    convertToInvoice: "Converti in Fattura",
    duplicate: "Duplicare",
    status: {
      draft: "Progetto",
      sent: "Inviato",
      accepted: "Accettato",
      declined: "Declinato",
      expired: "Scadenza",
      converted: "Convertito",
    },
  },
};
