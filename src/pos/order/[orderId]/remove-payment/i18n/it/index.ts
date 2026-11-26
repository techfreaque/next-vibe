import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    pos: "Cassa",
    order: "Vendita",
    removePayment: "Rimuovi pagamento",
  },
  enums: {
    paymentMethod: {
      cash: "Contanti",
      card: "Carta",
      transfer: "Bonifico",
      other: "Altro",
    },
  },
  post: {
    title: "Rimuovi pagamento",
    titleShort: "Rimuovi pagamento",
    description:
      "Togli un pagamento da una vendita aperta, per esempio dopo un errore di battitura.",
    orderId: {
      label: "Vendita",
      description: "La vendita aperta con questo pagamento",
    },
    paymentId: {
      label: "Pagamento",
      description: "Il pagamento da togliere dalla vendita",
    },
    response: {
      orderId: "Vendita",
      paymentId: "Pagamento rimosso",
      sessionId: "Sessione di cassa",
      currency: "Valuta",
      totalPaid: "Pagato finora",
      outstanding: "Ancora da pagare",
      remainingPayments: "Pagamenti rimasti",
    },
    widget: {
      back: "Torna alla vendita",
      pickPayment: "Scegli il pagamento da rimuovere",
      noPayments: "Questa vendita non ha pagamenti da rimuovere.",
      notOpen: "Si possono rimuovere solo pagamenti di una vendita aperta.",
      loading: "Caricamento della vendita",
      change: "Resto {{amount}}",
      selected: "Selezionato",
      amount: "Importo",
      confirmTitle: "Rimuovere questo pagamento?",
      confirmDescription:
        "La vendita resta aperta. Poi registra il pagamento giusto.",
      confirm: "Rimuovi pagamento",
      cancel: "Annulla",
      stillDue: "Ancora da pagare",
      paidSoFar: "Pagato finora",
      nothingPaid: "Nessun pagamento rimasto su questa vendita.",
    },
    success: {
      title: "Pagamento rimosso",
      description: "La vendita aspetta un nuovo pagamento.",
    },
  },
  errors: {
    validation: {
      title: "Controlla il pagamento",
      description: "Scegli un pagamento di questa vendita.",
    },
    unauthorized: {
      title: "Accesso richiesto",
      description: "Accedi per modificare le vendite.",
    },
    forbidden: {
      title: "Nessun accesso",
      description: "Non puoi modificare le vendite di questa azienda.",
    },
    notFound: {
      title: "Pagamento non trovato",
      description: "Questo pagamento non è più sulla vendita.",
    },
    conflict: {
      title: "Vendita non aperta",
      description:
        "Un pagamento si può rimuovere solo se vendita e sessione di cassa sono aperte.",
    },
    server: {
      title: "Pagamento non rimosso",
      description: "Qualcosa è andato storto. Riprova.",
    },
    unknown: {
      title: "Pagamento non rimosso",
      description: "Qualcosa è andato storto. Riprova.",
    },
    network: {
      title: "Nessuna connessione",
      description: "Controlla la connessione e riprova.",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Prima completa o annulla le modifiche.",
    },
  },
};
