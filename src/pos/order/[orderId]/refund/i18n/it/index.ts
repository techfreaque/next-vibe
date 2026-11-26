import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    pos: "Cassa",
    order: "Ordine",
    refund: "Rimborso",
  },
  enums: {
    paymentMethod: {
      cash: "Contanti",
      card: "Carta",
      transfer: "Bonifico",
      other: "Altro",
    },
  },
  get: {
    title: "Rimborsi delle vendite",
    titleShort: "Rimborsi",
    description:
      "Cosa è stato venduto, cosa è tornato e cosa si può ancora rimborsare.",
    orderId: {
      label: "Vendita",
      description: "La vendita completata",
    },
    response: {
      orderId: "Vendita",
      orderNumber: "Numero vendita",
      status: "Stato",
      currency: "Valuta",
      total: "Totale vendita",
      refundedTotal: "Rimborsato",
      refundableTotal: "Ancora rimborsabile",
      journalPosted: "Registrato in contabilità",
      lines: "Articoli",
      orderItemId: "Riga",
      description: "Articolo",
      quantity: "Venduto",
      refundedQuantity: "Rimborsato",
      refundableQuantity: "Rimborsabile",
      unitPrice: "Prezzo unitario",
      lineTotal: "Totale riga",
      taxRate: "Aliquota IVA",
      refunds: "Rimborsi",
      refundId: "Rimborso",
      refundNumber: "Numero rimborso",
      method: "Rimborsato con",
      reason: "Motivo",
      createdAt: "Data",
      cashSession: "Cassetto",
      sessionId: "Sessione",
      terminalName: "Cassa",
      available: "Contanti nel cassetto",
    },
    widget: {
      back: "Indietro",
      startRefund: "Rimborsa articoli",
      fullyRefunded: "Tutto in questa vendita è stato rimborsato.",
      notCompleted: "Si possono rimborsare solo vendite completate.",
      history: "Storico rimborsi",
      noRefunds: "Nessun rimborso su questa vendita per ora.",
      loading: "Caricamento vendita",
    },
    success: {
      title: "Rimborsi caricati",
      description: "Vendita e storico rimborsi sono aggiornati.",
    },
  },
  post: {
    title: "Rimborsa vendita",
    titleShort: "Rimborsa",
    description:
      "Restituisci il denaro di una vendita completata, in tutto o riga per riga. La merce torna a scaffale e la contabilità si allinea.",
    orderId: {
      label: "Vendita",
      description: "La vendita completata da rimborsare",
    },
    lines: {
      label: "Articoli da rimborsare",
      description:
        "Riga e quantità per articolo. Lascia vuoto per rimborsare tutto ciò che resta.",
    },
    method: {
      label: "Rimborsa con",
      description:
        "Come torna il denaro. I contanti escono da un cassetto aperto.",
      placeholder: "Scegli come rimborsare",
    },
    sessionId: {
      label: "Cassetto",
      description:
        "Sessione aperta che paga i contanti. Di default è la tua sessione aperta su una cassa nella valuta della vendita.",
    },
    reason: {
      label: "Motivo",
      description:
        "Perché il denaro torna indietro. Resta salvato con il rimborso.",
      placeholder: "Ad esempio: articolo danneggiato restituito",
    },
    response: {
      refundId: "Rimborso",
      refundNumber: "Numero rimborso",
      orderId: "Vendita",
      sessionId: "Sessione",
      method: "Rimborsato con",
      currency: "Valuta",
      subtotal: "Netto",
      taxAmount: "IVA",
      total: "Rimborsato ora",
      refundedTotal: "Totale rimborsato",
      fullyRefunded: "Rimborsato per intero",
      journalEntryId: "Scrittura contabile",
      stockReturned: "Prodotti tornati in magazzino",
    },
    widget: {
      back: "Torna alla vendita",
      items: "Cosa torna indietro",
      selectAll: "Rimborsa tutto",
      clear: "Azzera",
      decrease: "{{item}}: uno in meno",
      increase: "{{item}}: uno in più",
      all: "Tutto",
      sold: "Venduti {{quantity}}",
      alreadyRefunded: "{{quantity}} già rimborsati",
      nothingLeft: "Rimborsato per intero",
      summary: "Rimborso",
      net: "Netto",
      vat: "IVA",
      total: "Totale rimborso",
      cashFrom: "Pagato dal cassetto di {{terminal}}",
      drawerAvailable: "Nel cassetto: {{amount}}",
      noCashSession:
        "Apri una sessione su una cassa in {{currency}} per rimborsare in contanti.",
      drawerShort: "Il cassetto contiene meno contanti di questo rimborso.",
      confirmTitle: "Rimborsare {{amount}}?",
      confirmDescription:
        "Il denaro torna con {{method}}. Magazzino e contabilità vengono aggiornati. Un rimborso non si può annullare.",
      confirm: "Rimborsa",
      cancel: "Annulla",
      pickItems: "Scegli almeno un articolo.",
      reasonMissing: "Aggiungi un motivo.",
      loading: "Caricamento vendita",
      viewRefunds: "Vedi rimborsi",
      newSale: "Torna alla vendita",
    },
    success: {
      title: "Rimborso eseguito",
      description: "Il denaro sta tornando al cliente.",
    },
  },
  messages: {
    notCompleted: "Si possono rimborsare solo vendite completate.",
    invalidLine:
      "Scegli articoli di questa vendita con una quantità maggiore di zero.",
    nothingLeft: "Non resta nulla da rimborsare su questa vendita.",
    overRefund: "È più di quanto venduto, meno i rimborsi precedenti.",
    rounding:
      "Questo rimborso è troppo piccolo per essere pagato. Aggiungi altri articoli.",
    cashSessionRequired:
      "I rimborsi in contanti richiedono una sessione aperta su una cassa nella valuta della vendita.",
    sessionInvalid: "Scegli una sessione aperta di questa azienda.",
    cashCurrencyMismatch:
      "Questa cassa lavora in una valuta diversa dalla vendita.",
    drawerShort: "Il cassetto contiene meno contanti di questo rimborso.",
    postingUnavailable:
      "Non è stato possibile registrare il rimborso in contabilità. Controlla che un periodo contabile sia aperto.",
    stockUnavailable:
      "Non è stato possibile rimettere la merce a magazzino. Controlla che il magazzino sia attivo.",
  },
  errors: {
    validation: {
      title: "Controlla il rimborso",
      description: "Scegli gli articoli, un metodo di rimborso e un motivo.",
    },
    unauthorized: {
      title: "Accesso richiesto",
      description: "Accedi per rimborsare le vendite.",
    },
    forbidden: {
      title: "Nessun accesso",
      description: "Non puoi rimborsare le vendite di questa azienda.",
    },
    notFound: {
      title: "Vendita non trovata",
      description: "Questa vendita non esiste o appartiene a un'altra azienda.",
    },
    conflict: {
      title: "Rimborso non possibile",
      description: "La vendita o il cassetto non consentono questo rimborso.",
    },
    server: {
      title: "Rimborso non riuscito",
      description: "Nulla è stato rimborsato. Riprova.",
    },
    unknown: {
      title: "Rimborso non riuscito",
      description: "Nulla è stato rimborsato. Riprova.",
    },
    network: {
      title: "Nessuna connessione",
      description: "Controlla la connessione e riprova.",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Prima completa o scarta le tue modifiche.",
    },
  },
};
