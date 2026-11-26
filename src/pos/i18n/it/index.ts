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
  workflow: {
    backToSessionOrders: "Torna agli ordini della sessione",
    receiptTitle: "Ricevuta",
    amountDue: "Importo da incassare",
    ledgerCurrencyMismatch:
      "La valuta dell’ordine è diversa da quella contabile. Prima di incassare usa una cassa o un ordine nella valuta contabile.",
    postingUnavailable:
      "Impossibile contabilizzare la vendita. Controlla la valuta aziendale, il periodo aperto e i conti.",
    cashCurrencyMismatch:
      "Il contante deve essere nella valuta della cassa. Scegli un altro metodo di pagamento per questo ordine.",
    tenderMinorUnits: "Inserisci importi in centesimi interi.",
    legacyTenderReview:
      "Un pagamento precedente include una frazione di centesimo. Verifica l’importo prima di incassare altro.",
    legacyTenderRecorded:
      "Questo ordine conserva gli importi originali con quattro decimali.",
    legacyPostingReview:
      "Gli importi registrati con frazioni di centesimo non possono essere contabilizzati. Verifica il pagamento iniziale prima di chiudere la vendita.",
    viewReceipt: "Mostra ricevuta",
    openDrawer: "Apri la cassa",
    warehouse: "Magazzino di vendita",
    noWarehouse: "Nessun magazzino assegnato",
    chooseCompanyFirst: "Seleziona prima un’azienda.",
    warehouseInstruction:
      "Scegli un magazzino attivo dell’azienda selezionata.",
    stockUnavailable:
      "Le scorte disponibili nel magazzino di questa cassa sono insufficienti. Controlla le quantità prima di completare la vendita.",
  },
  dashboard: {
    get: {
      title: "POS Dashboard",
      titleShort: "POS Dashboard",
      description:
        "Panoramica dei terminal, sessioni attive e vendite di oggi.",
      widget: {
        title: "Punto vendita",
        subtitle:
          "Apra la cassa, registri le vendite, chiuda il turno con la conta.",
        salesHistory: "Storico vendite",
        newTill: "Nuova cassa",
        kpiSalesToday: "Vendite di oggi",
        kpiSalesCount: "Vendite: {{count}}",
        kpiOpenTills: "Casse aperte",
        kpiTillsTotal: "{{active}} attive su {{total}}",
        kpiAverage: "Scontrino medio",
        kpiRefunds: "Rimborsi di oggi",
        kpiRefundsCount: "Rimborsi: {{count}}",
        tillsTitle: "Casse",
        manageTills: "Gestisci casse",
        emptyTitle: "Ancora nessuna cassa",
        emptyMessage: "Aggiunga una cassa per vendere al banco.",
        createTill: "Aggiungi cassa",
        tillSelling: "In vendita",
        tillReady: "Pronta",
        tillInactive: "Inattiva",
        openRegister: "Apri schermata cassa",
        openTill: "Apri cassa",
        closeTill: "Chiudi cassa",
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
        refundsToday: "Rimborsi di oggi",
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
      title: "Nuova cassa",
      titleShort: "Nuova cassa",
      description:
        "Aggiungi una cassa a un'azienda: nome, valuta, conto cassa e magazzino.",
      widget: {
        title: "Nuova cassa",
        subtitle:
          "Una cassa vende in una valuta, registra i contanti su un conto e preleva merce da un magazzino.",
        subtitleCompany:
          "Nuova cassa per {{company}}. Vende in una valuta e registra i contanti su un conto.",
        back: "Indietro",
        backToList: "Tutte le casse",
        openTill: "Apri cassa",
        cancel: "Annulla",
        submit: "Crea cassa",
        none: "Nessuno",
        sectionTill: "Cassa",
        sectionMoney: "Denaro",
        sectionMoneyHint:
          "La valuta di vendita e il conto che riceve i contanti.",
        sectionStock: "Magazzino",
        sectionStockHint:
          "Le vendite concluse scaricano la merce da questo magazzino. Lascia vuoto se vendi solo servizi.",
        defaultCashAccount: "Conto cassa predefinito dell'azienda",
        noWarehouse: "Senza gestione magazzino",
        chooseCompanyFirst: "Scegli prima un'azienda.",
      },
      companyId: {
        label: "Azienda",
        description: "L'azienda a cui appartiene la cassa",
      },
      name: {
        label: "Nome",
        description: "Compare sulla scheda della cassa e sugli scontrini",
        placeholder: "Bancone principale",
      },
      location: {
        label: "Posizione",
        description: "Dove si trova la cassa. Facoltativo.",
        placeholder: "Piano terra",
      },
      currency: {
        label: "Valuta",
        description: "Ogni vendita su questa cassa usa questa valuta",
        placeholder: "Scegli una valuta",
      },
      cashAccountNodeId: {
        label: "Conto cassa",
        description:
          "I contanti incassati qui vengono registrati su questo conto.",
        invalid:
          "Scegli un conto cassa o banca movimentabile di questa azienda.",
      },
      warehouseId: {
        label: "Magazzino",
        description: "A vendita conclusa la merce esce da questo magazzino.",
      },
      errors: {
        validation: {
          title: "Controlla la cassa",
          description: "Inserisci un nome e scegli una valuta.",
        },
        unauthorized: {
          title: "Accesso richiesto",
          description: "Accedi per aggiungere casse.",
        },
        forbidden: {
          title: "Solo per admin",
          description: "Solo gli admin dell'azienda aggiungono casse.",
        },
        conflict: {
          title: "Nome già usato",
          description: "Esiste già una cassa con questo nome.",
        },
        server: {
          title: "Cassa non creata",
          description: "Qualcosa è andato storto. Riprova.",
        },
        unknown: {
          title: "Cassa non creata",
          description: "Qualcosa è andato storto. Riprova.",
        },
        network: {
          title: "Nessuna connessione",
          description: "Controlla la connessione e riprova.",
        },
        notFound: {
          title: "Non trovato",
          description: "L'azienda o il magazzino non esiste.",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Completa o scarta prima le modifiche.",
        },
      },
      success: {
        title: "Cassa creata",
        description: "Conta il fondo cassa e aprila per iniziare a vendere.",
      },
      response: {
        id: "Cassa",
        name: "Nome",
        companyId: "Azienda",
        currency: "Valuta",
        isActive: "Attiva",
      },
    },
  },

  // Terminal list
  terminalList: {
    get: {
      title: "Casse",
      titleShort: "Casse",
      description:
        "Tutte le casse delle tue aziende e quali stanno vendendo adesso.",
      widget: {
        title: "Casse",
        pickTitle: "Scegli una cassa",
        subtitle: "Ogni cassa del tuo bancone e se sta vendendo adesso.",
        summary: "Casse: {{total}} · In vendita: {{selling}}",
        newTill: "Nuova cassa",
        createTill: "Aggiungi una cassa",
        emptyTitle: "Nessuna cassa",
        emptyMessage: "Aggiungi una cassa per vendere al bancone.",
        selling: "In vendita",
        ready: "Pronta",
        inactive: "Inattiva",
        openRegister: "Apri schermata cassa",
        openTill: "Apri cassa",
        loading: "Caricamento casse",
        back: "Indietro",
      },
      companyId: {
        label: "Azienda",
        description: "Solo le casse di questa azienda",
      },
      terminalId: {
        label: "Cassa",
        description: "Solo questa cassa",
      },
      errors: {
        validation: {
          title: "Controlla il filtro",
          description: "L'azienda o la cassa non è valida.",
        },
        unauthorized: {
          title: "Accesso richiesto",
          description: "Accedi per vedere le casse.",
        },
        forbidden: {
          title: "Nessun accesso",
          description: "Non sei membro di questa azienda.",
        },
        conflict: {
          title: "Conflitto",
          description: "I dati sono cambiati. Ricarica e riprova.",
        },
        server: {
          title: "Casse non caricate",
          description: "Qualcosa è andato storto. Riprova.",
        },
        unknown: {
          title: "Casse non caricate",
          description: "Qualcosa è andato storto. Riprova.",
        },
        network: {
          title: "Nessuna connessione",
          description: "Controlla la connessione e riprova.",
        },
        notFound: {
          title: "Non trovato",
          description: "Questa azienda non esiste.",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Completa o scarta prima le modifiche.",
        },
      },
      success: {
        title: "Casse caricate",
        description: "Le tue casse sono aggiornate.",
      },
      response: {
        id: "Cassa",
        name: "Nome",
        location: "Posizione",
        currency: "Valuta",
        isActive: "Attiva",
        companyName: "Azienda",
        openSessionId: "Turno aperto",
        createdAt: "Creata",
      },
    },
  },

  // Session open
  sessionOpen: {
    post: {
      title: "Apri cassa",
      titleShort: "Apri cassa",
      description:
        "Avvia un turno su una cassa con il fondo contato nel cassetto.",
      widget: {
        title: "Apri cassa",
        subtitle: "Conta i contanti nel cassetto, poi avvia il turno.",
        back: "Indietro",
        cancel: "Annulla",
        loadingTill: "Caricamento cassa",
        selling: "In vendita",
        ready: "Pronta",
        inactive: "Inattiva",
        alreadyOpen: "Questa cassa è già aperta. Continua a vendere.",
        openRegister: "Apri schermata cassa",
        floatHint:
          "Il fondo cassa serve per il resto. Alla chiusura il conteggio viene confrontato con questo importo.",
      },
      terminalId: {
        label: "Cassa",
        description: "La cassa da aprire",
      },
      openingFloat: {
        label: "Fondo cassa",
        description: "Contanti nel cassetto all'inizio del turno",
        placeholder: "0,00",
      },
      errors: {
        validation: {
          title: "Controlla il fondo cassa",
          description: "Inserisci i contanti nel cassetto, zero o più.",
        },
        unauthorized: {
          title: "Accesso richiesto",
          description: "Accedi per aprire una cassa.",
        },
        forbidden: {
          title: "Nessun accesso",
          description: "Non sei membro dell'azienda di questa cassa.",
        },
        conflict: {
          title: "Cassa già aperta",
          description: "Questa cassa ha già un turno aperto.",
        },
        server: {
          title: "Cassa non aperta",
          description: "Qualcosa è andato storto. Riprova.",
        },
        unknown: {
          title: "Cassa non aperta",
          description: "Qualcosa è andato storto. Riprova.",
        },
        network: {
          title: "Nessuna connessione",
          description: "Controlla la connessione e riprova.",
        },
        notFound: {
          title: "Cassa non trovata",
          description: "Questa cassa non esiste.",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Completa o scarta prima le modifiche.",
        },
      },
      success: {
        title: "Cassa aperta",
        description: "Il turno è iniziato. Batti la prima vendita.",
      },
      response: {
        id: "Turno",
        terminalId: "Cassa",
        openedAt: "Aperta il",
        status: "Stato",
        openingFloat: "Fondo cassa",
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
        backToTerminals: "Indietro",
        sessionSummary: "Sintesi della sessione",
        terminal: "Terminal",
        openedAt: "Aperto a",
        orderCount: "Ordini: {{count}}",
        sessionRevenue: "Ricavi",
        floatHint: "Conti tutte le banconote e le monete nel cassetto.",
        reconciliation: "Fine del giorno",
        sessionReady: "Sessione",
        active: "Attivo",
        openingFloat: "Fondo cassa",
        cashSales: "Vendite in contanti",
        expectedClosingFloat: "Previsto in cassa",
        actualClosingFloat: "Contanti contati",
        variance: "Variazione",
        reconciliationTitle: "Conta di cassa",
        title: "Chiudi cassa",
        subtitle: "{{terminal}} · aperta dalle {{time}}",
        cashRefunds: "Rimborsi in contanti",
        balanced: "Cassa in pari",
        over: "Eccedenza di {{amount}}",
        short: "Mancano {{amount}}",
        openSaleBlocks:
          "Su questa cassa c'è ancora una vendita aperta. La concluda o la annulli nella schermata cassa, poi chiuda la cassa.",
        backToPos: "Torna al punto vendita",
      },
      sessionId: { label: "Sessione ID", description: "Sessione di chiusura" },
      closingFloat: {
        label: "Contanti contati",
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
        cashRefundsTotal: "Rimborsi in contanti",
        openingFloat: "Apertura Float",
        variance: "Variazione",
        orderCount: "Conteggio dell'ordine",
      },
    },
  },

  // Session get
  sessionGet: {
    get: {
      title: "Riepilogo turno",
      titleShort: "Turno",
      description:
        "Un turno su una cassa: apertura, cassiere e quanto deve esserci nel cassetto.",
      widget: {
        title: "Turno",
        back: "Indietro",
        loading: "Caricamento turno",
        selling: "In vendita",
        closed: "Chiusa",
        subtitleOpen: "Aperta dal {{time}}",
        subtitleClosed: "Chiusa il {{time}}",
        sales: "Vendite",
        closeTill: "Chiudi cassa",
        openRegister: "Apri schermata cassa",
        drawerTitle: "Cassetto",
        variance: "Differenza",
        closeSession: "Chiudi cassa",
        newOrder: "Nuovo ordine",
      },
      sessionId: {
        label: "Turno",
        description: "Il turno da mostrare",
      },
      errors: {
        validation: {
          title: "Controlla il turno",
          description: "Questo link al turno non è valido.",
        },
        unauthorized: {
          title: "Accesso richiesto",
          description: "Accedi per vedere i turni.",
        },
        forbidden: {
          title: "Nessun accesso",
          description: "Non sei membro dell'azienda di questa cassa.",
        },
        conflict: {
          title: "Conflitto",
          description: "I dati sono cambiati. Ricarica e riprova.",
        },
        server: {
          title: "Turno non caricato",
          description: "Qualcosa è andato storto. Riprova.",
        },
        unknown: {
          title: "Turno non caricato",
          description: "Qualcosa è andato storto. Riprova.",
        },
        network: {
          title: "Nessuna connessione",
          description: "Controlla la connessione e riprova.",
        },
        notFound: {
          title: "Turno non trovato",
          description: "Questo turno non esiste.",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Completa o scarta prima le modifiche.",
        },
      },
      success: {
        title: "Turno caricato",
        description: "I dati del cassetto sono aggiornati.",
      },
      response: {
        id: "Turno",
        terminalId: "Cassa",
        terminalName: "Cassa",
        companyName: "Azienda",
        cashierUserId: "Cassiere",
        cashierName: "Cassiere",
        status: "Stato",
        openedAt: "Aperta il",
        closedAt: "Chiusa il",
        openingFloat: "Fondo cassa",
        closingFloat: "Contato alla chiusura",
        cashSalesTotal: "Vendite in contanti",
        cashRefundsTotal: "Rimborsi in contanti",
        expectedCash: "Atteso nel cassetto",
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
      mergeWithLine: {
        label: "Aggiungi alla riga esistente",
        description:
          "Aumenta la quantità della riga già presente per questo prodotto",
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
      quantity: {
        label: "Quantità da rimuovere",
        description: "Lasci vuoto per rimuovere l'intera riga",
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
        refund: "Rimborsa",
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
        viewJournalEntry: "Visualizza la registrazione contabile",
        voidedStamp: "ANNULLATO",
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
        title: "Vendite",
        subtitleAll: "Tutte le vendite in cassa, dalle più recenti.",
        subtitleSession: "Vendite di questo turno, dalle più recenti.",
        openRegister: "Apri schermata cassa",
        colSale: "Vendita",
        colTime: "Ora",
        colStatus: "Stato",
        colTotal: "Totale",
        count: "Vendite: {{count}}",
        newOrder: "Nuovo ordine",
        empty: "Ancora nessuna vendita",
        emptyHint: "Le vendite in cassa compaiono qui con il loro scontrino.",
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
      companyId: {
        label: "Azienda",
        description: "Azienda di cui mostrare le vendite in cassa",
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
        terminalName: "Cassa",
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
      title: "Ricerca prodotti",
      titleShort: "Prodotti",
      description:
        "Trova prodotti del catalogo per nome o codice, con prezzo e IVA.",
      widget: {
        title: "Prodotti",
        pickTitle: "Scegli un prodotto",
        subtitle:
          "Cerca per nome o codice. Un codice a barre scansionato trova il prodotto esatto.",
        back: "Indietro",
        loading: "Caricamento prodotti",
        emptyTitle: "Nessun prodotto",
        emptyMessage:
          "I prodotti del catalogo compaiono qui con il loro prezzo.",
        noMatchTitle: "Nessun risultato per «{{query}}»",
        noMatchMessage: "Controlla l'ortografia o cerca per codice.",
        vat: "IVA {{rate}}",
        noVat: "Senza IVA",
        perUnit: "per {{unit}}",
      },
      companyId: {
        label: "Azienda",
        description: "Solo i prodotti di questa azienda",
      },
      query: {
        label: "Cerca prodotti",
        description: "Nome del prodotto o codice. Lascia vuoto per sfogliare.",
        placeholder: "Nome o codice",
      },
      currency: {
        label: "Valuta",
        description: "Solo prodotti con prezzo in questa valuta",
      },
      page: {
        label: "Pagina",
        description: "Numero di pagina, da 1",
      },
      pageSize: {
        label: "Per pagina",
        description: "Risultati per pagina, al massimo 50",
      },
      errors: {
        validation: {
          title: "Controlla la ricerca",
          description: "Al massimo 120 caratteri.",
        },
        unauthorized: {
          title: "Accesso richiesto",
          description: "Accedi per cercare prodotti.",
        },
        forbidden: {
          title: "Nessun accesso",
          description: "Non sei membro di questa azienda.",
        },
        conflict: {
          title: "Conflitto",
          description: "I dati sono cambiati. Ricarica e riprova.",
        },
        server: {
          title: "Ricerca non riuscita",
          description: "Qualcosa è andato storto. Riprova.",
        },
        unknown: {
          title: "Ricerca non riuscita",
          description: "Qualcosa è andato storto. Riprova.",
        },
        network: {
          title: "Nessuna connessione",
          description: "Controlla la connessione e riprova.",
        },
        notFound: {
          title: "Non trovato",
          description: "Nessun prodotto trovato.",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Completa o scarta prima le modifiche.",
        },
      },
      success: {
        title: "Prodotti trovati",
        description: "I risultati sono aggiornati.",
      },
      response: {
        id: "Prodotto",
        name: "Nome",
        sku: "Codice",
        type: "Tipo",
        basePrice: "Prezzo",
        currency: "Valuta",
        defaultTaxRate: "Aliquota IVA",
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
