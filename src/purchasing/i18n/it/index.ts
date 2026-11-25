import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Acquisti",
  tags: {
    purchasing: "Acquisti",
    vendor: "Venditore",
    order: "Ordine di acquisto",
    receipt: "Ricevimento",
    create: "Creare",
    list: "Elenco",
    get: "Vai!",
    update: "Aggiornamento",
    deactivate: "Disattivare",
    send: "Invia",
    confirm: "Conferma",
    receive: "Ricevi",
    cancel: "Annulla",
    convertToBill: "Convertire in Bill",
    addLine: "Aggiungere la linea",
    removeLine: "Rimuovi la linea",
  },
  endpointCategories: {
    purchasing: "Acquisti",
    vendors: "Fornitori",
    purchaseOrders: "Ordinanza di acquisto",
    purchasingOrders: "Ordinanza di acquisto",
    purchasingVendors: "Fornitori",
  },
  enums: {
    poStatus: {
      draft: "Progetto",
      sent: "Inviato",
      confirmed: "Confermato",
      partiallyReceived: "Ricevuta parzialmente",
      received: "Ricevuto.",
      billed: "Billed",
      cancelled: "Annullamento",
    },
  },

  // Vendor create
  vendorCreate: {
    post: {
      title: "Creare il Fornitore",
      titleShort: "Creare il Fornitore",
      description: "Registra un nuovo fornitore per la tua azienda.",
      widget: {
        back: "Indietro",
        viewVendor: "Fornitore aperto",
        createAnother: "Crea un altro",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Controlla tutti i campi e riprova",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per creare fornitori",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Hai bisogno di un ruolo membro o superiore",
        },
        conflict: {
          title: "Codice già esistente",
          description: "Un fornitore con questo codice esiste già",
        },
        server: {
          title: "Errore del server",
          description: "Non è riuscito a creare il venditore. riprovare",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        network: {
          title: "Errore di rete",
          description: "Controllare la connessione e riprovare",
        },
        notFound: { title: "Non trovato", description: "Società non trovata" },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Creato da Fornitore",
        description: "Venditore registrato con successo",
      },
      response: {
        id: "Venditore ID",
        name: "Nome",
        code: "Codice",
        email: "Email",
        isActive: "Attivo",
        createdAt: "Creato",
      },
    },
    companyId: {
      label: "Società",
      description: "Azienda questo fornitore appartiene a",
      placeholder: "Società UUID",
    },
    name: {
      label: "Nome del fornitore",
      description: "Nome legale del fornitore",
      placeholder: "Acme GmbH",
    },
    code: {
      label: "Codice",
      description: "Identificatore interno breve (opzionale)",
      placeholder: "ACM-001",
    },
    email: {
      label: "Email",
      description: "Contatto email del venditore",
      placeholder: "orders@acme.com",
    },
    phone: {
      label: "Telefono",
      description: "Telefono di contatto del venditore",
      placeholder: "+49 30 12345678",
    },
    website: {
      label: "Sito web",
      description: "Sito web del venditore",
      placeholder: "https://acme.com",
    },
    vatNumber: {
      label: "Numero di VAT",
      description: "Numero di registrazione del venditore VAT",
      placeholder: "DE123456789",
    },
    taxId: {
      label: "Tassa fiscale ID",
      description: "Numero di identificazione fiscale del venditore",
      placeholder: "12345678",
    },
    addressLine1: {
      label: "Indirizzo Linea 1",
      description: "Via e numero",
      placeholder: "123 Main Street",
    },
    addressLine2: {
      label: "Indirizzo Linea 2",
      description: "Suite, pavimento, ecc.",
      placeholder: "Piano 2",
    },
    city: { label: "Città", description: "Città", placeholder: "Berlin" },
    region: {
      label: "Regione / Stato",
      description: "Regione o stato",
      placeholder: "Berlin",
    },
    postalCode: {
      label: "Codice Postale",
      description: "Codice postale o ZIP",
      placeholder: "10115",
    },
    country: {
      label: "Paese",
      description: "Codice paese (ISO 3166 -1 alpha-2)",
      placeholder: "DE",
    },
    defaultCurrency: {
      label: "Valuta di default",
      description: "Valuta per ordini di acquisto a questo venditore",
      placeholder: "EUR",
    },
    defaultPaymentTermsDays: {
      label: "Termini di pagamento (giorni)",
      description: "Termini di pagamento predefiniti in giorni",
      placeholder: "30",
    },
    notes: {
      label: "Osservazioni",
      description: "Note interne su questo venditore",
      placeholder: "Preferito fornitore per elettronica",
    },
  },

  // Vendor list
  vendorList: {
    get: {
      title: "Fornitori",
      titleShort: "Fornitori",
      description: "Elenca tutti i fornitori per una società.",
      widget: {
        back: "Indietro",
        active: "Attivo",
        inactive: "Inattivo",
        total: "totale totale",
        createVendor: "Nuovo fornitore",
        empty: "Nessun fornitore configurato. Aggiungine uno per iniziare.",
        vatLabel: "VAT",
        vatPrefix: "VAT:",
        paymentTerms: "Net {{days}} giorni",
        paymentTermsPrefix: "Rete netta",
        paymentTermsSuffix: "D",
        loading: "Caricamento…",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Controllare i campi obbligatori",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per elencare i fornitori",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questa azienda",
        },
        conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
        server: {
          title: "Errore del server",
          description: "Non elencare i fornitori",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        network: {
          title: "Errore di rete",
          description: "Controllare la connessione e riprovare",
        },
        notFound: { title: "Non trovato", description: "Società non trovata" },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Venditori Caricati",
        description: "Elenco dei fornitori recuperati",
      },
      response: {
        id: "Venditore ID",
        name: "Nome",
        code: "Codice",
        email: "Email",
        vatNumber: "VAT",
        defaultCurrency: "Valuta",
        defaultPaymentTermsDays: "Termini di pagamento",
        isActive: "Attivo",
        createdAt: "Creato",
      },
    },
    companyId: {
      label: "Società",
      description: "Società per elencare i fornitori per",
    },
  },

  // Vendor get
  vendorGet: {
    get: {
      title: "Ottenere il venditore",
      titleShort: "Dettagli del fornitore",
      description: "Recuperare i dettagli completi per un venditore.",
      widget: {
        back: "Indietro",
        edit: "Modifica del fornitore",
        createOrder: "Nuovo acquisto",
        viewOrders: "Visualizza gli ordini",
        deactivate: "Disattivare",
        select: "Selezionare il fornitore",
      },
      vendorId: { label: "Venditore ID", description: "Vendor per recuperare" },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Venditore non valido ID",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per visualizzare i fornitori",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questo fornitore",
        },
        conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
        server: {
          title: "Errore del server",
          description: "Non è riuscito a caricare il venditore",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        network: {
          title: "Errore di rete",
          description: "Controllare la connessione e riprovare",
        },
        notFound: {
          title: "Vendor non trovato",
          description: "Il venditore non esiste",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Venditore caricato",
        description: "Dettagli del venditore recuperati",
      },
      response: {
        id: "Venditore ID",
        companyId: "Società ID",
        name: "Nome",
        code: "Codice",
        email: "Email",
        phone: "Telefono",
        website: "Sito web",
        vatNumber: "Numero di VAT",
        taxId: "Tassa fiscale ID",
        addressLine1: "Indirizzo",
        addressLine2: "Indirizzo Linea 2",
        city: "Città",
        region: "Regione",
        postalCode: "Codice Postale",
        country: "Paese",
        defaultCurrency: "Valuta di default",
        defaultPaymentTermsDays: "Termini di pagamento (giorni)",
        isActive: "Attivo",
        notes: "Osservazioni",
        createdAt: "Creato",
        updatedAt: "Aggiornato",
      },
    },
  },

  // Vendor update
  vendorUpdate: {
    patch: {
      title: "Aggiornamento Vendor",
      titleShort: "Aggiornamento Vendor",
      description: "Aggiorna i dettagli del fornitore.",
      widget: {
        backToVendor: "Torna al fornitore",
        viewVendor: "Visualizza venditore",
      },
      vendorId: {
        label: "Venditore ID",
        description: "Venditore per aggiornare",
      },
      name: {
        label: "Nome del fornitore",
        description: "Nome legale del fornitore",
        placeholder: "Acme GmbH",
      },
      code: {
        label: "Codice",
        description: "Identificazione interna corta",
        placeholder: "ACM-001",
      },
      email: {
        label: "Email",
        description: "Contatto email del venditore",
        placeholder: "orders@acme.com",
      },
      phone: {
        label: "Telefono",
        description: "Telefono di contatto del venditore",
        placeholder: "+49 30 12345678",
      },
      website: {
        label: "Sito web",
        description: "Sito web del venditore",
        placeholder: "https://acme.com",
      },
      vatNumber: {
        label: "Numero di VAT",
        description: "Numero di registrazione del venditore VAT",
        placeholder: "DE123456789",
      },
      taxId: {
        label: "Tassa fiscale ID",
        description: "Numero di identificazione fiscale",
        placeholder: "12345678",
      },
      addressLine1: {
        label: "Indirizzo Linea 1",
        description: "Via e numero",
        placeholder: "123 Main Street",
      },
      addressLine2: {
        label: "Indirizzo Linea 2",
        description: "Suite, pavimento, ecc.",
        placeholder: "Piano 2",
      },
      city: { label: "Città", description: "Città", placeholder: "Berlin" },
      region: {
        label: "Regione / Stato",
        description: "Regione o stato",
        placeholder: "Berlin",
      },
      postalCode: {
        label: "Codice Postale",
        description: "Codice postale o ZIP",
        placeholder: "10115",
      },
      country: {
        label: "Paese",
        description: "Codice paese (ISO 3166 -1 alpha-2)",
        placeholder: "DE",
      },
      defaultCurrency: {
        label: "Valuta di default",
        description: "Valuta per ordini di acquisto a questo venditore",
        placeholder: "EUR",
      },
      defaultPaymentTermsDays: {
        label: "Termini di pagamento (giorni)",
        description: "Termini di pagamento predefiniti in giorni",
        placeholder: "30",
      },
      notes: {
        label: "Osservazioni",
        description: "Note interne su questo venditore",
        placeholder: "Preferito fornitore",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Controllare i campi obbligatori",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per aggiornare i fornitori",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questo fornitore",
        },
        conflict: {
          title: "Codice Conflitto",
          description: "Quel codice del fornitore è già preso",
        },
        server: {
          title: "Errore del server",
          description: "Non è riuscito ad aggiornare il fornitore",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        network: {
          title: "Errore di rete",
          description: "Controllare la connessione e riprovare",
        },
        notFound: {
          title: "Vendor non trovato",
          description: "Il venditore non esiste",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Vendor aggiornato",
        description: "Venditore aggiornato con successo",
      },
      response: {
        id: "Venditore ID",
        name: "Nome",
        isActive: "Attivo",
        updatedAt: "Aggiornato",
      },
    },
  },

  // Vendor deactivate
  vendorDeactivate: {
    post: {
      title: "Disattivare il Fornitore",
      titleShort: "Disattivare",
      description:
        "Segnare un venditore come inattivo. Gli ordini di acquisto esistenti non sono interessati.",
      vendorId: {
        label: "Venditore ID",
        description: "Venditore per disattivare",
      },
      widget: {
        warning:
          "Questo disattiva il venditore. Gli ordini di acquisto esistenti non saranno interessati.",
        backToList: "Torna ai venditori",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Venditore non valido ID",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per disattivare i fornitori",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questo fornitore",
        },
        conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
        server: {
          title: "Errore del server",
          description: "Non è riuscito a disattivare il fornitore",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        network: {
          title: "Errore di rete",
          description: "Controllare la connessione e riprovare",
        },
        notFound: {
          title: "Vendor non trovato",
          description: "Il venditore non esiste",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Venditore disattivato",
        description: "Il venditore è ora inattivo",
      },
      response: {
        id: "Venditore ID",
        isActive: "Attivo",
      },
    },
  },

  // PO create
  orderCreate: {
    post: {
      title: "Creare ordine di acquisto",
      titleShort: "Creare Ordine",
      description:
        "Creare un nuovo ordine di acquisto in Situazione di progetto.",
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Controlla tutti i campi e riprova",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per creare ordini di acquisto",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Hai bisogno di un ruolo membro o superiore",
        },
        conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
        server: {
          title: "Errore del server",
          description: "Non creato ordine di acquisto. riprovare",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        network: {
          title: "Errore di rete",
          description: "Controllare la connessione e riprovare",
        },
        notFound: {
          title: "Non trovato",
          description: "Venditore o società non trovata",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Ordine di acquisto Creato",
        description: "Ordine di acquisto creato in Situazione di progetto",
      },
      widget: {
        browseVendors: "Sfoglia i fornitori",
        browseWarehouses: "Sfoglia i Magazzini",
        viewOrder: "Ordine di acquisto aperto",
        backToList: "Torna alla lista",
      },
      response: {
        id: "Ordine ID",
        poNumber: "Numero d'ordine di acquisto",
        status: "Stato",
        subtotal: "Totale parziale",
        taxAmount: "Imposte",
        total: "Totale",
        createdAt: "Creato",
      },
    },
    companyId: {
      label: "Società",
      description: "Società che emette questo ordine di acquisto",
      placeholder: "Società UUID",
    },
    vendorId: {
      label: "Venditore",
      description: "Fornitore che riceve questo ordine di acquisto",
      placeholder: "Venditore UUID",
    },
    currency: {
      label: "Valuta",
      description: "Acquisto di valuta",
      placeholder: "EUR",
    },
    expectedDeliveryDate: {
      label: "Consegna prevista",
      description: "Data di consegna prevista (opzionale)",
      placeholder: "2024-03-01",
    },
    deliveryWarehouseId: {
      label: "Magazzino di consegna",
      description: "Magazzino per ricevere merci (facoltativo)",
      placeholder: "Magazzino UUID",
    },
    notes: {
      label: "Osservazioni",
      description: "Note interne per questo ordine di acquisto",
      placeholder: "Ordine rush",
    },
    lines: {
      label: "Elementi di linea",
      description: "Prodotti e quantità per l'ordine",
    },
    lineDescription: {
      label: "Designazione",
      description: "Descrizione dell'oggetto",
      placeholder: "Sedie da ufficio",
    },
    lineProductId: {
      label: "Prodotto ID",
      description: "Prodotto catalogo (opzionale)",
      placeholder: "Prodotto UUID",
    },
    lineQuantity: {
      label: "Quantità",
      description: "Numero di unità",
      placeholder: "10",
    },
    lineUnitPrice: {
      label: "Prezzo unitario",
      description: "Prezzo per unità",
      placeholder: "99.00",
    },
    lineTaxRate: {
      label: "Tasso d'imposta",
      description: "Tasso d'imposta come decimale (ad esempio 0,19 = 19%)",
      placeholder: "0.19",
    },
    lineSortOrder: {
      label: "Ordinare",
      description: "Visualizza l'ordine di questa linea",
      placeholder: "0",
    },
  },

  // PO list
  orderList: {
    get: {
      title: "Ordinanza di acquisto",
      titleShort: "Ordini",
      description:
        "Elenca gli ordini di acquisto per un'azienda con filtro di stato opzionale.",
      widget: {
        newOrder: "Nuovo acquisto",
        empty: "Nessun ordine di acquisto trovato.",
        statusAll: "Tutti",
        orders: "ordini di acquisto",
        order: "ordine di acquisto",
        colPoVendor: "Ordine di acquisto / Venditore",
        colDate: "Data",
        colAmount: "Importo",
        colStatus: "Stato",
        deliveryArrow: "→",
        overdue: "in ritardo",
        actionNeeded: "ordini di acquisto bisogno attenzione",
        back: "Indietro",
        loading: "Caricamento…",
      },
      companyId: {
        label: "Società",
        description: "Società di elencare gli ordini di acquisto per",
      },
      status: {
        label: "Filtro di stato",
        description: "Filtra per ordine di acquisto (opzionale)",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Controllare i campi obbligatori",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per elencare gli ordini di acquisto",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questa azienda",
        },
        conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
        server: {
          title: "Errore del server",
          description: "Non elencare gli ordini di acquisto",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        network: {
          title: "Errore di rete",
          description: "Controllare la connessione e riprovare",
        },
        notFound: { title: "Non trovato", description: "Società non trovata" },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Ordine di acquisto addebitato",
        description: "Acquisto elenco ordine recuperato",
      },
      response: {
        id: "Ordine ID",
        poNumber: "Numero d'ordine di acquisto",
        vendorId: "Venditore",
        vendorName: "Venditore",
        status: "Stato",
        currency: "Valuta",
        total: "Totale",
        expectedDeliveryDate: "Consegna prevista",
        createdAt: "Creato",
      },
    },
  },

  // PO get
  orderGet: {
    get: {
      title: "Ottenere l'acquisto",
      titleShort: "Ordinare dettagli",
      description:
        "Recuperare un ordine di acquisto con tutte le linee e la cronologia delle ricevute.",
      widget: {
        back: "Indietro",
        send: "Invia al venditore",
        confirm: "Mark confermato",
        receive: "Ricevere beni",
        convertToBill: "Converti in fattura",
        viewBill: "Vedi il conto",
        addLine: "+ Aggiungi riga",
        cancel: "Annullare l'Ordine",
        edit: "Modifica",
        select: "Selezionare l'ordine di acquisto",
        linesHeader: "Elementi di linea",
        receiptsHeader: "Ricezione della storia",
        noLines: "Niente articoli di linea.",
        noReceipts: "Non ci sono ancora ricevute.",
        colDescription: "Designazione",
        colQtyPrice: "Prezzo di ×",
        colLineTotal: "Totale",
        delivery: "Consegna prevista:",
        overdue: "(in ritardo)",
        received: "ricevuto",
        billCreated: "AP fattura creata da questo ordine di acquisto.",
        vendorLabel: "Venditore:",
      },
      poId: {
        label: "Ordine ID",
        description: "Ordine di acquisto per recuperare",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Ordine di acquisto non valido ID",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per visualizzare gli ordini di acquisto",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questo ordine di acquisto",
        },
        conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
        server: {
          title: "Errore del server",
          description: "Non caricare l'ordine di acquisto",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        network: {
          title: "Errore di rete",
          description: "Controllare la connessione e riprovare",
        },
        notFound: {
          title: "Ordine di acquisto non trovato",
          description: "Ordine di acquisto non esiste",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Acquistare Ordine Caricato",
        description: "Acquista i dettagli dell'ordine recuperati",
      },
      response: {
        id: "Ordine ID",
        companyId: "Società ID",
        vendorId: "Venditore ID",
        poNumber: "Numero d'ordine di acquisto",
        status: "Stato",
        currency: "Valuta",
        expectedDeliveryDate: "Consegna prevista",
        deliveryWarehouseId: "Magazzino di consegna",
        notes: "Osservazioni",
        subtotal: "Totale parziale",
        taxAmount: "Imposte",
        total: "Totale",
        billId: "Bill ID",
        confirmedAt: "Confermato",
        receivedAt: "Ricevuto.",
        createdAt: "Creato",
        updatedAt: "Aggiornato",
        lines: "Linee",
        lineId: "Linea ID",
        lineProductId: "Prodotto ID",
        lineDescription: "Designazione",
        lineQuantity: "Qty",
        lineUnitPrice: "Prezzo unitario",
        lineTaxRate: "Tasso d'imposta",
        lineTaxAmount: "Imposte",
        lineTotal: "Totale",
        lineQuantityReceived: "Ricevuto.",
        receipts: "Ricevimenti",
        receiptId: "Ricezione di ID",
        receiptReceivedAt: "Ricevuto",
        receiptNotes: "Osservazioni",
      },
    },
  },

  // PO update
  orderUpdate: {
    patch: {
      title: "Aggiornare l'ordine di acquisto",
      titleShort: "Aggiornamento dell'ordine",
      description:
        "Modificare un progetto di ordine di acquisto. campi e linee.",
      widget: {
        backToPO: "Torna all'acquisto",
      },
      poId: {
        label: "Ordine ID",
        description: "Ordine di acquisto per l'aggiornamento",
      },
      vendorId: {
        label: "Venditore",
        description: "Cambia venditore (opzionale)",
        placeholder: "Venditore UUID",
      },
      currency: {
        label: "Valuta",
        description: "Acquisto di valuta",
        placeholder: "EUR",
      },
      expectedDeliveryDate: {
        label: "Consegna prevista",
        description: "Data di consegna prevista",
        placeholder: "2024-03-01",
      },
      deliveryWarehouseId: {
        label: "Magazzino di consegna",
        description: "Magazzino per ricevere merci",
        placeholder: "Magazzino UUID",
      },
      notes: {
        label: "Osservazioni",
        description: "Note interne per questo ordine di acquisto",
        placeholder: "Ordine rush",
      },
      lines: {
        label: "Elementi di linea",
        description: "Sostituisci tutti gli elementi della linea (opzionale)",
      },
      lineDescription: {
        label: "Designazione",
        description: "Descrizione dell'oggetto",
        placeholder: "Sedie da ufficio",
      },
      lineProductId: {
        label: "Prodotto ID",
        description: "Prodotto catalogo (opzionale)",
        placeholder: "Prodotto UUID",
      },
      lineQuantity: {
        label: "Quantità",
        description: "Numero di unità",
        placeholder: "10",
      },
      lineUnitPrice: {
        label: "Prezzo unitario",
        description: "Prezzo per unità",
        placeholder: "99.00",
      },
      lineTaxRate: {
        label: "Tasso d'imposta",
        description: "Tasso di imposta come decimale",
        placeholder: "0.19",
      },
      lineSortOrder: {
        label: "Ordinare",
        description: "Visualizza l'ordine di questa linea",
        placeholder: "0",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Controllare i campi obbligatori",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per aggiornare gli ordini di acquisto",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questo ordine di acquisto",
        },
        conflict: {
          title: "Non un progetto",
          description:
            "Possono essere modificati solo gli ordini di acquisto del progetto",
        },
        server: {
          title: "Errore del server",
          description: "Non è possibile aggiornare l'ordine di acquisto",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        network: {
          title: "Errore di rete",
          description: "Controllare la connessione e riprovare",
        },
        notFound: {
          title: "Ordine di acquisto non trovato",
          description: "Ordine di acquisto non esiste",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Ordine di acquisto aggiornato",
        description: "Ordine di acquisto aggiornato",
      },
      response: {
        id: "Ordine ID",
        status: "Stato",
        subtotal: "Totale parziale",
        taxAmount: "Imposte",
        total: "Totale",
        updatedAt: "Aggiornato",
      },
    },
  },

  // PO send
  orderSend: {
    post: {
      title: "Invia l'ordine di acquisto",
      titleShort: "Invia ordine",
      description: "Mark ordine di acquisto come Invia al fornitore.",
      poId: {
        label: "Ordine ID",
        description: "Ordine di acquisto per l'invio",
      },
      widget: {
        back: "Indietro",
        backToPO: "Torna all'acquisto",
        warning:
          "L'invio di marchi questo ordine di acquisto come spedito al venditore. Modifica dello stato da Draft a Sent.",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Ordine di acquisto non valido ID",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Iscriviti per inviare ordini di acquisto",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questo ordine di acquisto",
        },
        conflict: {
          title: "Non un progetto",
          description:
            "Solo gli ordini di acquisto di bozza possono essere inviati",
        },
        server: {
          title: "Errore del server",
          description: "Non inviare l'ordine di acquisto",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        network: {
          title: "Errore di rete",
          description: "Controllare la connessione e riprovare",
        },
        notFound: {
          title: "Ordine di acquisto non trovato",
          description: "Ordine di acquisto non esiste",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Ordinare il pagamento",
        description: "Ordine di acquisto contrassegnato come Inviato",
      },
      response: {
        id: "Ordine ID",
        status: "Stato",
      },
    },
  },

  // PO confirm
  orderConfirm: {
    post: {
      title: "Confermare l'ordine di acquisto",
      titleShort: "Confermare l'ordine",
      description:
        "Il venditore ha confermato l'ordine di acquisto. marchio come confermato.",
      poId: {
        label: "Ordine ID",
        description: "Ordine di acquisto per confermare",
      },
      widget: {
        back: "Indietro",
        backToPO: "Torna all'acquisto",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Ordine di acquisto non valido ID",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Iscriviti per confermare gli ordini di acquisto",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questo ordine di acquisto",
        },
        conflict: {
          title: "Stato non valido",
          description:
            "Solo gli ordini di acquisto inviati possono essere confermati",
        },
        server: {
          title: "Errore del server",
          description: "Non confermare l'ordine di acquisto",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        network: {
          title: "Errore di rete",
          description: "Controllare la connessione e riprovare",
        },
        notFound: {
          title: "Ordine di acquisto non trovato",
          description: "Ordine di acquisto non esiste",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Ordine di acquisto Confermato",
        description: "Ordine di acquisto contrassegnato come confermato",
      },
      response: {
        id: "Ordine ID",
        status: "Stato",
        confirmedAt: "Confermato",
      },
    },
  },

  // PO receive
  orderReceive: {
    post: {
      title: "Ricevere i beni",
      titleShort: "Ricevere i beni",
      description:
        "Registrazione della merce contro un ordine di acquisto. Crea movimenti azionari.",
      widget: {
        backToPO: "Torna all'acquisto",
      },
      poId: {
        label: "Ordine ID",
        description: "Ordine di acquisto per ricevere contro",
      },
      warehouseId: {
        label: "magazzino",
        description: "Magazzino che riceve la merce (opzionale)",
        placeholder: "Magazzino UUID",
      },
      notes: {
        label: "Osservazioni",
        description: "Note su questa consegna",
        placeholder: "Nota di consegna #12345",
      },
      lines: {
        label: "Articoli ricevuti",
        description: "Quantitativi ricevuti per ogni linea",
      },
      linePoLineId: { label: "Linea ID", description: "Linea di acquisto" },
      lineQuantityReceived: {
        label: "Quantità ricevuta",
        description: "Quantità ricevuta per questa linea",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Controlla tutti i campi e le quantità",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per ricevere merci",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questo ordine di acquisto",
        },
        conflict: {
          title: "Stato non valido",
          description:
            "L'ordine di acquisto deve essere confermato o inviato per ricevere le merci",
        },
        server: {
          title: "Errore del server",
          description: "Non ha registrato la ricevuta",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        network: {
          title: "Errore di rete",
          description: "Controllare la connessione e riprovare",
        },
        notFound: {
          title: "Ordine di acquisto non trovato",
          description: "Ordine di acquisto o linea non trovata",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Beni ricevuti",
        description: "Ricevimento registrato e aggiornato stock",
      },
      response: {
        receiptId: "Ricezione di ID",
        status: "Stato dell'ordine di acquisto",
        receivedAt: "Ricevuto",
      },
    },
  },

  // PO convert to bill
  orderConvertToBill: {
    post: {
      title: "Convertire in Bill",
      titleShort: "Convertire in Bill",
      description:
        "Crea una fattura fornitore da un ordine ricevuto per intero. Approva la fattura per contabilizzare il debito.",
      widget: {
        back: "Indietro",
        viewBill: "Vedi il conto",
      },
      poId: {
        label: "Ordine ID",
        description: "Ordine di acquisto per convertire",
      },
      errors: {
        validation: {
          title: "Verifica valuta e totali",
          description:
            "La valuta deve essere supportata e i totali devono coincidere con quelli delle righe.",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per creare fatture",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questo ordine di acquisto",
        },
        conflict: {
          title: "Ordine non fatturabile",
          description:
            "Puoi fatturare solo un ordine interamente ricevuto e senza fattura collegata.",
        },
        server: {
          title: "Errore del server",
          description: "Non è riuscito a creare la fattura",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        network: {
          title: "Errore di rete",
          description: "Controllare la connessione e riprovare",
        },
        notFound: {
          title: "Ordine di acquisto non trovato",
          description: "Ordine di acquisto non esiste",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Creato da Bill",
        description: "AP fattura creata dall'ordine di acquisto",
      },
      response: {
        billId: "Bill ID",
        billNumber: "Numero della fattura",
        poId: "Ordine ID",
      },
    },
  },

  // PO line add
  orderLineAdd: {
    post: {
      widget: {
        backToOrder: "Torna all'ordine",
        lineAdded: "Articolo di linea aggiunto",
      },
      title: "Aggiungi articolo",
      titleShort: "Aggiungere la linea",
      description: "Aggiungi una voce di linea a un ordine di acquisto.",
      poId: {
        label: "Ordine ID",
        description: "Ordine di acquisto per aggiungere una linea a",
      },
      productId: {
        label: "Prodotto",
        description: "Prodotto catalogo (opzionale)",
        placeholder: "Prodotto UUID",
      },
      itemDescription: {
        label: "Designazione",
        description: "Descrizione dell'oggetto",
        placeholder: "Sedie da ufficio",
      },
      quantity: {
        label: "Quantità",
        description: "Numero di unità",
        placeholder: "10",
      },
      unitPrice: {
        label: "Prezzo unitario",
        description: "Prezzo per unità",
        placeholder: "99.00",
      },
      taxRate: {
        label: "Tasso d'imposta",
        description: "Tasso d'imposta come decimale (ad esempio 0,19 = 19%)",
        placeholder: "0.19",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Controlla tutti i campi e riprova",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per aggiungere articoli di linea",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questo ordine di acquisto",
        },
        conflict: {
          title: "Non un progetto",
          description:
            "Possono essere modificati solo gli ordini di acquisto del progetto",
        },
        server: {
          title: "Errore del server",
          description: "Non è possibile aggiungere la voce di riga",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        network: {
          title: "Errore di rete",
          description: "Controllare la connessione e riprovare",
        },
        notFound: {
          title: "Ordine di acquisto non trovato",
          description: "Ordine di acquisto non esiste",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Linea Aggiunto",
        description: "Articolo di linea aggiunto all'ordine di acquisto",
      },
      response: {
        lineId: "Linea ID",
        subtotal: "Totale parziale",
        taxAmount: "Imposte",
        total: "Totale",
      },
    },
  },

  // PO line remove
  orderLineRemove: {
    post: {
      title: "Rimuovi l'articolo",
      titleShort: "Rimuovi la linea",
      description: "Rimuovere un elemento linea da un ordine di acquisto.",
      poId: {
        label: "Ordine ID",
        description: "Ordine di acquisto per rimuovere una linea da",
      },
      lineId: {
        label: "Linea ID",
        description: "Elemento di linea per rimuovere",
      },
      widget: {
        backToOrder: "Torna all'ordine di acquisto",
        warning:
          "Questo rimuoverà definitivamente l'elemento di linea dall'ordine di acquisto.",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "ID non validi",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per rimuovere gli elementi della linea",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questo ordine di acquisto",
        },
        conflict: {
          title: "Non un progetto",
          description:
            "Possono essere modificati solo gli ordini di acquisto del progetto",
        },
        server: {
          title: "Errore del server",
          description: "Non rimosso l'elemento di linea",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        network: {
          title: "Errore di rete",
          description: "Controllare la connessione e riprovare",
        },
        notFound: {
          title: "Non trovato",
          description: "Ordine di acquisto o articolo di linea non trovato",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Rimozione della linea",
        description: "Linea voce rimossa dall'ordine di acquisto",
      },
      response: {
        subtotal: "Totale parziale",
        taxAmount: "Imposte",
        total: "Totale",
      },
    },
  },

  // Purchasing Dashboard
  dashboard: {
    get: {
      title: "Panoramica sull'acquisto",
      titleShort: "Panoramica",
      description:
        "snapshot dal vivo degli ordini di acquisto e dell'attività dei fornitori per la vostra azienda.",
      widget: {
        openValue: "Valore degli ordini aperti",
        settledBills: "Fatture saldate questo mese",
        deliveries: "Consegne in arrivo",
        order: "Ordine",
        supplier: "Fornitore",
        expected: "Data prevista",
        orderTotal: "Totale ordine",
        noDeliveries: "Nessuna consegna in sospeso",
        overdue: "Consegne in ritardo",
        dueSeven: "In scadenza nei prossimi 7 giorni",
        kpiDraft: "Progetti",
        kpiConfirmed: "Confermato",
        kpiAwaitingReceipt: "Ricezione di risveglio",
        kpiActiveVendors: "Vendotori attivi",
        warningDueThisWeek:
          "È prevista una consegna questa settimana. Controlla la data.",
        warningDueThisWeekPlural:
          "Sono previste {{count}} consegne questa settimana. Controlla le date.",
        navNewPo: "Nuovo acquisto",
        navAllPos: "Tutti gli ordini di acquisto",
        navVendors: "Fornitori",
        navNewVendor: "Nuovo venditore",
        loading: "Caricamento…",
      },
      companyId: {
        label: "Società",
        description:
          "Società per mostrare le statistiche di acquisto per (opzionale)",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Controllare i campi obbligatori",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per visualizzare la panoramica degli acquisti",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questa azienda",
        },
        conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
        server: {
          title: "Errore del server",
          description: "Non caricare la panoramica di acquisto",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        network: {
          title: "Errore di rete",
          description: "Controllare la connessione e riprovare",
        },
        notFound: { title: "Non trovato", description: "Società non trovata" },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Dashboard Caricato",
        description: "Acquisisci la panoramica recuperata",
      },
      response: {
        draftCount: "Ordine di acquisto bozza",
        confirmedCount: "Ordini di acquisto confermati",
        awaitingReceiptCount: "Ricezione di risveglio",
        activeVendorCount: "Vendotori attivi",
        dueThisWeekCount: "Data questa settimana",
      },
    },
  },

  // PO cancel
  orderCancel: {
    post: {
      title: "Annulla l'ordine di acquisto",
      titleShort: "Annullare l'Ordine",
      description: "Annullare un ordine di acquisto bozza o Invia.",
      poId: {
        label: "Ordine ID",
        description: "Ordine di acquisto per annullare",
      },
      widget: {
        back: "Indietro",
        warning:
          "Questo annulla definitivamente l'ordine di acquisto. Possono essere annullati solo gli ordini di acquisto redatti o inviati.",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Ordine di acquisto non valido ID",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per annullare gli ordini di acquisto",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questo ordine di acquisto",
        },
        conflict: {
          title: "Cannone Annulla",
          description:
            "Possono essere annullati solo gli ordini di acquisto o di acquisto inviati",
        },
        server: {
          title: "Errore del server",
          description: "Non ha annullato l'ordine di acquisto",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        network: {
          title: "Errore di rete",
          description: "Controllare la connessione e riprovare",
        },
        notFound: {
          title: "Ordine di acquisto non trovato",
          description: "Ordine di acquisto non esiste",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Ordine di acquisto Annullato",
        description: "Ordine di acquisto annullato",
      },
      response: {
        id: "Ordine ID",
        status: "Stato",
      },
    },
  },
};
