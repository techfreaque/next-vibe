import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Punto vendita",
  tags: {
    pos: "POS",
    terminal: "Terminal",
    session: "Sessione",
    order: "Ordinanza",
    payment: "Pagamento",
    create: "Creare",
    list: "Elenco",
    get: "Vai!",
    open: "Aperto",
    close: "Chiudi",
    complete: "Completato",
    void: "Void",
    addItem: "Aggiungi articolo",
    removeItem: "Rimuovi articolo",
    addPayment: "Aggiungi pagamento",
  },
  endpointCategories: {
    pos: "Punto vendita",
    terminals: "Terminali",
    sessions: "Sessioni",
    orders: "Ordini",
  },
  enums: {
    sessionStatus: {
      open: "Aperto",
      closed: "Chiuso",
    },
    orderStatus: {
      open: "Aperto",
      completed: "Completo",
      voided: "Voi stessi",
    },
    paymentMethod: {
      cash: "Contanti",
      card: "Carta di carta",
      transfer: "Trasferimento",
      other: "Altro",
    },
  },

  // POS Dashboard
  dashboard: {
    get: {
      title: "POS Dashboard",
      titleShort: "POS Dashboard",
      description:
        "Panoramica dei terminal, sessioni attive e vendite di oggi.",
      widget: {
        loading: "Caricamento cruscotto...",
        loadingHint: "Ritiro i dati POS.",
        kpiTerminals: "Terminali (attivo / totale)",
        kpiOpenSessions: "Sessioni aperte",
        kpiTodayOrders: "Ordini di oggi",
        kpiTodaySales: "Le entrate di oggi",
        terminalsHeading: "Terminali",
        refresh: "Aggiorna",
        openSession: "Sessione aperta",
        viewOrders: "Visualizza gli ordini",
        viewSession: "Visualizza sessione",
        allTerminals: "Tutti i terminal",
        statusActive: "Attivo",
        statusInactive: "Inattivo",
        statusSessionOpen: "Sessione aperta",
        emptyTerminals: "Nessun terminale configurato.",
        emptyTerminalsHint:
          "Contatta l'amministratore per configurare i terminali POS.",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Controllare i campi obbligatori",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per visualizzare il cruscotto POS",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso ai dati POS",
        },
        conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
        server: {
          title: "Errore del server",
          description: "Non caricate il cruscotto",
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
          description: "Nessun dato POS trovato",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Dashboard Caricato",
        description: "Panoramica POS recuperata",
      },
      response: {
        terminalsTotal: "Terminali totali",
        terminalsActive: "Terminali attivi",
        openSessionsCount: "Sessioni aperte",
        todayOrderCount: "Ordini di oggi",
        todaySalesTotal: "Il Revenue di oggi",
        currency: "Valuta",
        terminalId: "Terminal ID",
        terminalName: "Nome del terminale",
        terminalLocation: "Location",
        terminalCurrency: "Valuta",
        terminalIsActive: "Attivo",
        terminalHasOpenSession: "Sessione Aperto",
        terminalOpenSessionId: "Sessione aperta ID",
      },
    },
  },

  // Terminal create
  terminalCreate: {
    post: {
      title: "Creare un terminale",
      titleShort: "Creare un terminale",
      description: "Registrare un nuovo terminale POS per una società.",
      widget: {
        backToList: "Torna ai terminal",
        active: "Attivo",
        inactive: "Inattivo",
        openSession: "Sessione aperta",
      },
      companyId: {
        label: "Società ID",
        description: "Azienda questo terminal appartiene a",
      },
      name: {
        label: "Nome del terminale",
        description: "Nome di questo terminale",
        placeholder: "Registrazione principale",
      },
      location: {
        label: "Location",
        description: "Posizione fisica del terminal",
        placeholder: "Scrivania anteriore",
      },
      currency: {
        label: "Valuta",
        description: "Moneta di default (ISO 4217)",
        placeholder: "EUR",
      },
      cashAccountNodeId: {
        label: "Nodo conto in contanti",
        description: "Nodo conto per il cassetto in contanti",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Controllare i campi obbligatori",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per creare terminali",
        },
        forbidden: {
          title: "Amministrativo richiesto",
          description: "Solo gli amministratori possono creare terminali",
        },
        conflict: {
          title: "Conflitto",
          description: "Un terminale con questo nome esiste già",
        },
        server: {
          title: "Errore del server",
          description: "Non è riuscito a creare il terminale. riprovare",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        network: {
          title: "Errore di rete",
          description: "Controllare la connessione e riprovare",
        },
        notFound: { title: "Non trovato", description: "Risorsa non trovata" },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Terminal Creato",
        description: "Terminale registrato con successo",
      },
      response: {
        id: "Terminal ID",
        name: "Nome del terminale",
        companyId: "Società ID",
        currency: "Valuta",
        isActive: "Attivo",
      },
    },
  },

  // Terminal list
  terminalList: {
    get: {
      title: "Terminali",
      titleShort: "Terminali",
      description: "Elenca tutti i terminal per una società.",
      widget: {
        active: "Attivo",
        inactive: "Inattivo",
        total: "terminali",
        createTerminal: "Nuovo terminale",
        empty: "Nessun terminale configurato.",
        emptyHint:
          "I terminali sono i registri fisici nel tuo negozio. Contattare l'amministratore per configurarli.",
        emptyContact: "Contattare l'amministratore",
        openSession: "Sessione aperta",
        selectCompany: "Terminali di carico...",
        selectCompanyHint: "Prendo i terminali.",
        loading: "Terminali di carico...",
        loadingHint: "Prendo i terminali.",
        refresh: "Aggiorna",
        back: "Indietro",
      },
      companyId: {
        label: "Società ID",
        description: "Società di elencare terminali per",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Controllare i campi obbligatori",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per elencare i terminali",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questa azienda",
        },
        conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
        server: {
          title: "Errore del server",
          description: "Non elencare i terminali",
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
        title: "Terminali caricati",
        description: "Elenco dei terminali recuperati",
      },
      response: {
        id: "Terminal ID",
        name: "Nome del terminale",
        location: "Location",
        currency: "Valuta",
        isActive: "Attivo",
        createdAt: "Creato a",
      },
    },
  },

  // Session open
  sessionOpen: {
    post: {
      title: "Sessione aperta",
      titleShort: "Sessione aperta",
      description: "Avviare una sessione di cassiere su un terminale.",
      widget: {
        viewOrders: "Visualizza gli ordini",
        backToTerminals: "Torna ai terminal",
        selectTerminal: "Terminale pronto",
        selectTerminalHint:
          "Impostare il galleggiante di apertura e aprire la sessione.",
        terminal: "Terminal",
        readyToOpen: "Pronti",
        floatHint: "Contare i soldi nel cassetto prima di aprire.",
        startOrders: "Cominciare a prendere ordini",
      },
      terminalId: {
        label: "Terminal ID",
        description: "Terminale per aprire sessione",
      },
      openingFloat: {
        label: "Apertura Float",
        description: "Cash in cassetto all'inizio della sessione",
        placeholder: "0.00",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Controllare i campi obbligatori",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per aprire una sessione",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questo terminale",
        },
        conflict: {
          title: "Sessione già aperta",
          description: "Questo terminale ha già una sessione aperta",
        },
        server: {
          title: "Errore del server",
          description: "Non ha aperto la sessione",
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
          title: "Terminale Non trovato",
          description: "Terminal non esiste",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Sessione Aperto",
        description: "Sessione iniziata con successo",
      },
      response: {
        id: "Sessione ID",
        terminalId: "Terminal ID",
        openedAt: "Aperta",
        status: "Stato",
        openingFloat: "Apertura Float",
      },
    },
  },

  // Session close
  sessionClose: {
    post: {
      mixedCash:
        "Prima di chiudere la cassa, riconcilia i pagamenti in contanti in altre valute.",
      title: "Sessione chiusa",
      titleShort: "Sessione chiusa",
      description:
        "Chiudere una sessione di cassiere e registrare il galleggiante di chiusura.",
      widget: {
        backToTerminals: "Torna ai terminal",
        sessionSummary: "Sintesi della sessione",
        terminal: "Terminal",
        openedAt: "Aperto a",
        orderCount: "Ordini",
        sessionRevenue: "Ricavi",
        floatHint: "Conta i soldi nel cassetto prima di chiudere.",
        reconciliation: "Fine del giorno",
        sessionReady: "Sessione",
        active: "Attivo",
        openingFloat: "Apertura Float",
        cashSales: "Vendita di denaro",
        expectedClosingFloat: "Float di chiusura prevista",
        actualClosingFloat: "Float di chiusura effettiva",
        variance: "Variazione",
        reconciliationTitle: "Riconciliazione dei contanti",
      },
      sessionId: { label: "Sessione ID", description: "Sessione di chiusura" },
      closingFloat: {
        label: "Chiusura Float",
        description: "Contanti contati in cassettiera a chiusura",
        placeholder: "0.00",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Controllare i campi obbligatori",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per chiudere una sessione",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Puoi chiudere solo la tua sessione",
        },
        conflict: {
          title: "Sessione già chiusa",
          description: "Questa sessione è già chiusa",
        },
        server: {
          title: "Errore del server",
          description: "Non è riuscito a chiudere la sessione",
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
          title: "Sessione non trovata",
          description: "La sessione non esiste",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Sessione chiusa",
        description: "Sessione chiusa con successo",
      },
      response: {
        id: "Sessione ID",
        status: "Stato",
        closedAt: "Chiuso a",
        closingFloat: "Chiusura Float",
        expectedFloat: "Float previsto",
        cashSalesTotal: "Vendita di denaro",
        variance: "Variazione",
        orderCount: "Conteggio dell'ordine",
      },
    },
  },

  // Session get
  sessionGet: {
    get: {
      title: "Ottieni la sessione",
      titleShort: "Dettagli della sessione",
      description: "Recuperare i dettagli per una sessione specifica.",
      widget: {
        viewOrders: "Visualizza gli ordini",
        closeSession: "Chiudere la sessione",
        newOrder: "Nuovo ordine",
        sessionDetails: "Dettagli della sessione",
        loading: "La sessione di caricamento...",
        back: "Indietro",
      },
      sessionId: {
        label: "Sessione ID",
        description: "Sessione per recuperare",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Sessione non valida ID",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per visualizzare le sessioni",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questa sessione",
        },
        conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
        server: {
          title: "Errore del server",
          description: "Non è riuscito a caricare sessione",
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
          title: "Sessione non trovata",
          description: "La sessione non esiste",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Sessione Caricata",
        description: "Dati di sessione recuperati",
      },
      response: {
        id: "Sessione ID",
        terminalId: "Terminal ID",
        cashierUserId: "Contanti",
        status: "Stato",
        openedAt: "Aperta",
        closedAt: "Chiuso a",
        openingFloat: "Apertura Float",
        closingFloat: "Chiusura Float",
      },
    },
  },

  // Order create
  orderCreate: {
    post: {
      title: "Creare Ordine",
      titleShort: "Creare Ordine",
      description: "Creare un nuovo ordine in una sessione aperta.",
      widget: {
        addItem: "Aggiungi articolo",
        viewOrder: "Visualizza l'ordine",
        creating: "Ordine di apertura...",
        back: "Indietro",
      },
      sessionId: {
        label: "Sessione ID",
        description: "Sessione per creare l'ordine in",
      },
      customerId: {
        label: "Cliente ID",
        description: "Riferimento del cliente opzionale",
      },
      currency: {
        label: "Valuta",
        description: "Moneta d'ordine",
        placeholder: "EUR",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Controllare i campi obbligatori",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per creare ordini",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questa sessione",
        },
        conflict: {
          title: "Sessione chiusa",
          description: "Non è possibile creare ordini in una sessione chiusa",
        },
        server: {
          title: "Errore del server",
          description: "Non è riuscito a creare ordine",
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
          title: "Sessione non trovata",
          description: "La sessione non esiste",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Ordine Creato",
        description: "Ordine creato con successo",
      },
      response: {
        id: "Ordine ID",
        orderNumber: "Numero d'ordine",
        sessionId: "Sessione ID",
        status: "Stato",
        currency: "Valuta",
        total: "Totale",
      },
    },
  },

  // Order add item
  orderAddItem: {
    post: {
      title: "Aggiungi articolo",
      titleShort: "Aggiungi articolo",
      description: "Aggiungi una voce di linea a un ordine aperto.",
      widget: {
        backToOrder: "Torna all'ordine",
        linePreview: "Totale linea",
        taxNote: "incl. imposta",
        multiplier: "×",
        addAnother: "Aggiungi un altro articolo",
        searchProduct: "Catalogo prodotti",
        searchPlaceholder: "Nome o SKU...",
        orManual: "O inserire manualmente",
        selectedProduct: "Prodotto selezionato",
        clearProduct: "Azzera",
        searchButton: "Cerca",
        noProductResults:
          "Nessuna corrispondenza. inserire manualmente di seguito.",
      },
      orderId: {
        label: "Ordine ID",
        description: "Ordina per aggiungere elemento a",
      },
      productId: {
        label: "Prodotto ID",
        description: "Riferimento del prodotto opzionale",
      },
      itemDescription: {
        label: "Designazione",
        description: "Descrizione dell'oggetto",
        placeholder: "Caffè",
      },
      quantity: {
        label: "Quantità",
        description: "Quantità",
        placeholder: "1",
      },
      unitPrice: {
        label: "Prezzo unitario",
        description: "Prezzo per unità",
        placeholder: "3.50",
      },
      taxRate: {
        label: "Tasso d'imposta",
        description: "Tasso d'imposta come decimale (ad esempio 0.2 per 20%)",
        placeholder: "0.20",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Controllare i campi obbligatori",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per aggiungere elementi",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questo ordine",
        },
        conflict: {
          title: "Ordine Non Aperto",
          description:
            "Non è possibile aggiungere oggetti a un ordine non aperto",
        },
        server: {
          title: "Errore del server",
          description: "Non è stato possibile aggiungere l'elemento",
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
          title: "Ordine Non Trovato",
          description: "Ordine non esiste",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Articolo aggiunto",
        description: "Articolo aggiunto all'ordine",
      },
      response: {
        id: "Articolo ID",
        description: "Designazione",
        quantity: "Quantità",
        unitPrice: "Prezzo unitario",
        taxAmount: "Importo fiscale",
        lineTotal: "Totale",
        orderTotal: "Totale degli ordini",
      },
    },
  },

  // Order remove item
  orderRemoveItem: {
    post: {
      title: "Rimuovi articolo",
      titleShort: "Rimuovi articolo",
      description: "Rimuovere un elemento linea da un ordine aperto.",
      widget: {
        chooseLine: "Seleziona una riga",
        backToOrder: "Torna all'ordine",
      },
      orderId: {
        label: "Ordine",
        description: "Ordina per rimuovere l'elemento da",
      },
      itemId: { label: "Riga", description: "Articolo da rimuovere" },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Controllare i campi obbligatori",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per rimuovere gli elementi",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questo ordine",
        },
        conflict: {
          title: "Ordine Non Aperto",
          description:
            "Non è possibile rimuovere gli elementi da un ordine non aperto",
        },
        server: {
          title: "Errore del server",
          description: "Non è stato possibile rimuovere l'elemento",
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
          description: "Ordine o articolo non trovato",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Articolo rimosso",
        description: "Articolo rimosso dall'ordine",
      },
      response: {
        orderId: "Ordine ID",
        orderTotal: "Totale aggiornato",
      },
    },
  },

  // Order complete
  orderComplete: {
    post: {
      title: "Ordine completo",
      titleShort: "Ordine completo",
      description:
        "Completa un ordine. Convalida il pagamento completo e l'ingresso di giornale di messaggi.",
      widget: {
        backToList: "Torna agli ordini",
        confirmTitle: "Completa questo ordine?",
        confirmHint:
          "Questo non può essere annullato. Tutti i pagamenti devono essere raccolti.",
        orderNumber: "Ordinanza",
        cancel: "Annulla",
      },
      orderId: { label: "Ordine ID", description: "Ordine per completare" },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Ordine non valido ID",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per completare gli ordini",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questo ordine",
        },
        conflict: {
          title: "Saldo da pagare",
          description: "I pagamenti totali non coprono il totale dell'ordine",
        },
        server: {
          title: "Errore del server",
          description: "Non è stato possibile completare l'ordine",
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
          title: "Ordine Non Trovato",
          description: "Ordine non esiste",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Ordine Completato",
        description: "Ordine completato e articolo di giornale inviato",
      },
      response: {
        id: "Ordine ID",
        status: "Stato",
        total: "Totale",
        journalEntryId: "Entrata di giornale ID",
      },
    },
  },

  // Order void
  orderVoid: {
    post: {
      title: "Ordine Void",
      titleShort: "Ordine Void",
      description: "Void un ordine aperto. Non puo' essere annullato.",
      widget: {
        tendered:
          "È già stato registrato un pagamento. L’ordine e le sue righe non sono più modificabili.",
        closed: "Questo ordine è chiuso.",
        backToList: "Torna agli ordini",
      },
      orderId: { label: "Ordine", description: "Ordine a vuoto" },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Ordine non valido ID",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi agli ordini vuoti",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questo ordine",
        },
        conflict: {
          title: "Ordine Non Aperto",
          description: "Solo gli ordini aperti possono essere annullati",
        },
        server: {
          title: "Errore del server",
          description: "Non ha annullato l'ordine",
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
          title: "Ordine Non Trovato",
          description: "Ordine non esiste",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Ordine Voidded",
        description: "L'ordine è stato annullato",
      },
      response: {
        id: "Ordine ID",
        status: "Stato",
      },
    },
  },

  // Order get
  orderGet: {
    get: {
      title: "Ottenere ordine",
      titleShort: "Ordinare dettagli",
      description:
        "Recuperare un unico ordine con i suoi articoli e pagamenti.",
      widget: {
        addItem: "Aggiungi l'articolo",
        addPayment: "Aggiungi pagamento",
        complete: "Ordine completo",
        void: "Ordine Void",
        back: "Indietro",
        outstanding: "Eccezionale",
        fullyPaid: "Pienamente pagato",
        qtyTimesPrice: "×",
        loading: "Ordine di caricamento...",
        noItems: "Non ci sono ancora elementi. aggiungere il primo elemento.",
        viewJournalEntry: "Visualizza l'ingresso del giornale",
        voidedStamp: "VOIDED",
        completedReadOnly:
          "Questo ordine è completato e non può essere modificato.",
        select: "Selezionare l'ordine",
      },
      orderId: { label: "Ordine ID", description: "Ordine per recuperare" },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Ordine non valido ID",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per visualizzare gli ordini",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questo ordine",
        },
        conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
        server: {
          title: "Errore del server",
          description: "Non caricare l'ordine",
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
          title: "Ordine Non Trovato",
          description: "Ordine non esiste",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Ordine Caricato",
        description: "Dettagli dell'ordine recuperati",
      },
      response: {
        id: "Ordine ID",
        orderNumber: "Numero d'ordine",
        sessionId: "Sessione ID",
        customerId: "Cliente ID",
        status: "Stato",
        currency: "Valuta",
        subtotal: "Totale parziale",
        taxAmount: "Imposte",
        total: "Totale",
        journalEntryId: "Entrata di giornale ID",
        createdAt: "Creato a",
        items: "Articoli",
        itemId: "Articolo ID",
        productId: "Prodotto ID",
        description: "Designazione",
        quantity: "Quantità",
        unitPrice: "Prezzo unitario",
        taxRate: "Tasso d'imposta",
        taxAmountItem: "Imposte",
        lineTotal: "Totale",
        payments: "Pagamenti",
        paymentId: "Pagamento ID",
        method: "Metodo",
        amount: "Importo",
        change: "Cambia",
        reference: "Riferimento",
      },
    },
  },

  // Order list
  orderList: {
    get: {
      title: "Ordini",
      titleShort: "Ordini",
      description:
        "Elenca gli ordini per una sessione o un terminale con filtro di stato opzionale.",
      widget: {
        newOrder: "Nuovo ordine",
        empty: "Non ci sono ancora ordini in questa sessione.",
        emptyHint: "Inizia un nuovo ordine per iniziare a vendere.",
        back: "Indietro",
        backToTerminals: "Torna ai terminal",
        selectSession: "Seleziona una sessione",
        selectSessionHint:
          "Inserisci una sessione ID per visualizzare i suoi ordini.",
        sessionTotal: "Totale sessione",
        filterAll: "Tutti",
        loading: "Caricamento ordini...",
        ordersTotal: "ordini",
        tapToView: "Toccare per visualizzare",
      },
      sessionId: {
        label: "Sessione ID",
        description: "Sessione per elencare gli ordini",
      },
      status: {
        label: "Stato",
        description: "Filtra per stato dell'ordine",
        placeholder: "Tutti gli stati",
      },
      page: {
        label: "Pagina",
        description: "Numero di pagina (a partire da 1)",
      },
      pageSize: {
        label: "Per pagina",
        description: "Risultati per pagina (max 100)",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Controllare i campi obbligatori",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per elencare gli ordini",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questa sessione",
        },
        conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
        server: {
          title: "Errore del server",
          description: "Non elencare gli ordini",
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
          title: "Sessione non trovata",
          description: "La sessione non esiste",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Ordini accumulati",
        description: "Elenco degli ordini recuperati",
      },
      response: {
        count: "Totale",
        id: "Ordine ID",
        orderNumber: "Numero d'ordine",
        sessionId: "Sessione ID",
        status: "Stato",
        currency: "Valuta",
        total: "Totale",
        createdAt: "Creato a",
      },
    },
  },

  // Product lookup (POS catalog search)
  productLookup: {
    get: {
      title: "Ricerca prodotto",
      titleShort: "Ricerca prodotto",
      description:
        "Cerca i prodotti del catalogo per nome o SKU per la rapida entrata POS.",
      widget: {
        noResults: "Nessun prodotto trovato. provare una ricerca diversa.",
        tax: "Tassa fiscale",
        back: "Indietro",
      },
      companyId: {
        label: "Società ID",
        description: "Limitare la ricerca a una specifica azienda",
      },
      query: {
        label: "Cerca",
        description: "Ricerca per nome del prodotto o SKU",
        placeholder: "Caffe', BEV-001...",
      },
      page: {
        label: "Pagina",
        description: "Numero di pagina (a partire da 1)",
      },
      pageSize: {
        label: "Per pagina",
        description: "Risultati per pagina (max 50)",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Inserisci almeno un carattere per cercare",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi ai prodotti di ricerca",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questa azienda",
        },
        conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
        server: {
          title: "Errore del server",
          description: "Non riuscito a cercare i prodotti",
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
          description: "Nessun prodotto trovato",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Prodotti trovati",
        description: "Prodotti abbinati recuperati",
      },
      response: {
        id: "Prodotto ID",
        name: "Nome",
        sku: "SKU",
        type: "Tipologia",
        basePrice: "Prezzo",
        currency: "Valuta",
        defaultTaxRate: "Tasso d'imposta",
        unit: "Unità",
      },
    },
  },

  // Order add payment
  orderAddPayment: {
    post: {
      title: "Aggiungi pagamento",
      titleShort: "Aggiungi pagamento",
      description: "Registrare un pagamento contro un ordine aperto.",
      widget: {
        fullyPaid: "Pienamente pagato",
        backToOrder: "Torna all'ordine",
        amountDue: "Importo dovuto",
        changeLabel: "Cambia",
        changeHint: "Ritorno al cliente",
        addAnotherPayment: "Aggiungi un altro pagamento",
      },
      orderId: { label: "Ordine ID", description: "Ordinanza di pagamento" },
      method: {
        label: "Metodo di pagamento",
        description: "Come il cliente paga",
        placeholder: "Selezionare il metodo",
      },
      amount: {
        label: "Importo",
        description: "Importo a carico",
        placeholder: "0.00",
      },
      change: {
        label: "Cambia",
        description: "Cambio restituito al cliente",
        placeholder: "0.00",
      },
      reference: {
        label: "Riferimento",
        description:
          "Codice di autorizzazione della carta o riferimento di trasferimento",
      },
      accountNodeId: {
        label: "Nodo conto",
        description:
          "Ricevere il nodo dell'account (overrides terminal default)",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Controllare i campi obbligatori",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per aggiungere i pagamenti",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questo ordine",
        },
        conflict: {
          title: "Ordine Non Aperto",
          description:
            "Non è possibile aggiungere i pagamenti a un ordine non aperto",
        },
        server: {
          title: "Errore del server",
          description: "Non registrato il pagamento",
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
          title: "Ordine Non Trovato",
          description: "Ordine non esiste",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Pagamento Registrato",
        description: "Pagamento registrato contro l'ordine",
      },
      response: {
        id: "Pagamento ID",
        method: "Metodo",
        amount: "Importo",
        change: "Cambia",
        totalPaid: "Totale pagato",
        outstanding: "Eccezionale",
      },
    },
  },
};
