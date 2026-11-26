import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Inventario",
  shared: {
    errors: {
      failedToRecordMovement: "Non ha registrato il movimento azionario",
      failedToApplyMovement: "Non è possibile applicare il movimento azionario",
    },
  },
  tags: {
    cancel: "Annulla",
    inventory: "Inventario",
    warehouse: "magazzino",
    stock: "Scorte",
    transfer: "Trasferimento",
    create: "Creare",
    list: "Elenco",
    get: "Vai!",
    update: "Aggiornamento",
    adjust: "Regolare",
    receive: "Ricevi",
    issue: "Fascicolo",
    dispatch: "Dispiace",
  },
  endpointCategories: {
    inventory: "Inventario",
    warehouses: "Magazzini",
    stock: "Livelli di stock",
    transfers: "Trasferimenti",
  },
  enums: {
    movementType: {
      receipt: "Ricevimento",
      issue: "Fascicolo",
      transferIn: "Trasferimento",
      transferOut: "Trasferimento",
      adjustment: "Regolazione",
      sale: "Vendita",
      return: "Ritorno",
    },
    transferStatus: {
      draft: "Progetto",
      inTransit: "In transito",
      received: "Ricevuto.",
      cancelled: "Annullamento",
    },
  },

  // Warehouse create
  warehouseCreate: {
    post: {
      title: "Creare un magazzino",
      titleShort: "Nuovo magazzino",
      description: "Registrare un nuovo magazzino per una società.",
      widget: {
        openWarehouse: "Apri magazzino",
        createAnother: "Creane un altro",
        backToList: "Torna ai magazzini",
        active: "Attivo",
        inactive: "Inattivo",
        default: "Predefinito",
      },
      companyId: {
        label: "Società",
        description: "Azienda questo magazzino appartiene a",
      },
      name: {
        label: "Nome del magazzino",
        description: "Nome completo del magazzino",
        placeholder: "Magazzino",
      },
      code: {
        label: "Codice",
        description: "Identificatore breve (ad es. WH-01)",
        placeholder: "WH-01",
      },
      address: {
        label: "Indirizzo",
        description: "Indirizzo fisico del magazzino",
        placeholder: "123 Lane di stoccaggio",
      },
      isActive: {
        label: "Attivo",
        description: "Se questo magazzino è operativo",
      },
      isDefault: {
        label: "Magazzino di default",
        description: "Impostare come magazzino predefinito per questa azienda",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Controllare i campi obbligatori",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per creare magazzini",
        },
        forbidden: {
          title: "Amministrativo richiesto",
          description: "Solo gli amministratori possono creare magazzini",
        },
        conflict: {
          title: "Codice già esistente",
          description: "Un magazzino con questo codice esiste già",
        },
        server: {
          title: "Errore del server",
          description: "Non è riuscito a creare magazzino. riprovare",
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
        title: "Magazzino creato",
        description: "Magazzino registrato correttamente",
      },
      response: {
        id: "Magazzino ID",
        name: "Nome del magazzino",
        code: "Codice",
        companyId: "Società ID",
        isActive: "Attivo",
        isDefault: "Predefinito",
      },
    },
  },

  // Warehouse list
  warehouseList: {
    get: {
      title: "Magazzini",
      titleShort: "Magazzini",
      description: "Elenca tutti i magazzini per un'azienda.",
      widget: {
        subtitle:
          "Dove si trova la tua merce. Aprine uno per vedere giacenze e valore.",
        status: "Stato",
        active: "Attivo",
        inactive: "Inattivo",
        default: "Predefinito",
        total: "magazzini",
        createWarehouse: "Nuovo magazzino",
        empty: "Non ci sono ancora magazzini.",
        emptyHint:
          "Crea il tuo primo magazzino per iniziare a tracciare l'inventario.",
        emptyIcon: "🏭",
        back: "Indietro",
        loading: "Caricamento di magazzini...",
        load: "Carico",
        viewStock: "Visualizza stock",
        selectCompany: "Immettere una società ID per caricare i magazzini.",
      },
      companyId: {
        label: "Società",
        description: "Società per elencare magazzini per",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Controllare i campi obbligatori",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per elencare i magazzini",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questa azienda",
        },
        conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
        server: {
          title: "Errore del server",
          description: "Non elencato i magazzini",
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
        title: "Magazzini carico",
        description: "Elenco dei magazzini recuperati",
      },
      response: {
        id: "Magazzino ID",
        name: "Nome",
        code: "Codice",
        address: "Indirizzo",
        isActive: "Attivo",
        isDefault: "Predefinito",
        createdAt: "Creato a",
      },
    },
  },

  // Warehouse get
  warehouseGet: {
    get: {
      title: "Ottieni magazzino",
      titleShort: "magazzino",
      description: "Recuperare i dettagli per un magazzino specifico.",
      widget: {
        companyName: "Azienda",
        stockedProducts: "Prodotti in magazzino",
        companyInventory: "Inventario aziendale",
        missingValuation: "Costo mancante",
        details: "Dati del magazzino",
        related: "Inventario",
        backToList: "Torna ai magazzini",
        back: "Indietro",
        edit: "Modifica del magazzino",
        viewStock: "Visualizza stock",
        select: "Selezionare il magazzino",
      },
      warehouseId: {
        label: "Magazzino",
        description: "Magazzino per recuperare",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Deposito non valido ID",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per visualizzare i magazzini",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questo magazzino",
        },
        conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
        server: {
          title: "Errore del server",
          description: "Non caricare il magazzino",
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
          title: "Magazzino non trovato",
          description: "Il magazzino non esiste",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Magazzino carico",
        description: "Dettagli del magazzino recuperati",
      },
      response: {
        id: "Magazzino ID",
        companyId: "Società ID",
        name: "Nome",
        code: "Codice",
        address: "Indirizzo",
        isActive: "Attivo",
        isDefault: "Predefinito",
        createdAt: "Creato a",
        updatedAt: "Aggiornato At",
      },
    },
  },

  // Warehouse update
  warehouseUpdate: {
    patch: {
      title: "Aggiornamento del magazzino",
      titleShort: "Modifica del magazzino",
      description: "Aggiornare i dettagli del magazzino.",
      widget: {
        backToWarehouse: "Torna a magazzino",
        active: "Attivo",
        inactive: "Inattivo",
      },
      warehouseId: {
        label: "Magazzino",
        description: "Magazzino per aggiornare",
      },
      name: {
        label: "Nome del magazzino",
        description: "Nome completo del magazzino",
        placeholder: "Magazzino",
      },
      code: {
        label: "Codice",
        description: "Identificatore breve",
        placeholder: "WH-01",
      },
      address: {
        label: "Indirizzo",
        description: "Indirizzo fisico",
        placeholder: "123 Lane di stoccaggio",
      },
      isActive: {
        label: "Attivo",
        description: "Se questo magazzino è operativo",
      },
      isDefault: {
        label: "Magazzino di default",
        description: "Impostare come magazzino predefinito",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Controllare i campi obbligatori",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per aggiornare i magazzini",
        },
        forbidden: {
          title: "Amministrativo richiesto",
          description: "Solo gli amministratori possono aggiornare i magazzini",
        },
        conflict: {
          title: "Codice Conflitto",
          description: "Quel codice di magazzino è già preso",
        },
        server: {
          title: "Errore del server",
          description: "Non è riuscito ad aggiornare il magazzino",
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
          title: "Magazzino non trovato",
          description: "Il magazzino non esiste",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Magazzino aggiornato",
        description: "Magazzino aggiornato correttamente",
      },
      response: {
        id: "Magazzino ID",
        name: "Nome",
        code: "Codice",
        isActive: "Attivo",
        isDefault: "Predefinito",
      },
    },
  },

  // Stock list
  stockList: {
    get: {
      title: "Livelli di stock",
      titleShort: "Livelli di stock",
      description:
        "Visualizza i livelli di stock per un magazzino con disponibilità e indicatori di basso contenuto di scorte.",
      widget: {
        unnamedProduct: "Nome prodotto non disponibile",
        search: "Cerca prodotti o magazzini",
        stockStatus: "Stato scorte",
        actions: "Azioni",
        noMatches: "Nessuna giacenza corrispondente",
        loadMore: "Mostra altri",

        back: "Indietro",
        defaultLowStockRule:
          "Scorta bassa sotto {{threshold}} unità disponibili",
        reorderPointRule:
          "Scorta bassa con {{threshold}} unità disponibili o meno",
        stockValuePrecision:
          "Il valore delle scorte è dato dalla quantità a magazzino × il costo unitario non arrotondato. I costi visualizzati sono arrotondati a due decimali.",
        lowStock: "Basso stock",
        available: "Disponibile",
        onHand: "Sulla mano",
        reserved: "Riservato",
        onOrder: "In ordine",
        reorderPoint: "Punto di riferimento",
        empty: "Non ci sono ancora documenti.",
        emptyHint:
          "Ricevere magazzino in un magazzino per vedere i livelli qui.",
        emptyIcon: "📦",
        loading: "Caricamento dei livelli di stock...",
        filterProduct: "Filtra per prodotto",
        load: "Carico",
        selectWarehouse:
          "Inserisci un magazzino ID per visualizzare i livelli di stock.",
        total: "Articolo",
        adjust: "Regolare",
        transfer: "Trasferimento",
        outOfStock: "a titolo di stock",
        belowReorderPoint: "sotto il punto di riordino",
        bulletSeparator: "·",
        stockValue: "Valore di magazzino",
        statusOk: "Disponibile",
      },
      warehouseId: {
        label: "Magazzino",
        description: "Magazzino per query stock",
      },
      productId: {
        label: "Prodotto",
        description: "Filtra a un prodotto specifico (opzionale)",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Controllare i campi obbligatori",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per visualizzare le azioni",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questo magazzino",
        },
        conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
        server: {
          title: "Errore del server",
          description: "Non caricate i livelli di stock",
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
          title: "Magazzino non trovato",
          description: "Il magazzino non esiste",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Caricamento in corso",
        description: "Livelli di stock recuperati",
      },
      response: {
        currency: "Valuta",
        id: "Giacenza",
        warehouseId: "Magazzino ID",
        warehouseName: "magazzino",
        productId: "Prodotto ID",
        productName: "Prodotto",
        quantityOnHand: "Sulla mano",
        quantityReserved: "Riservato",
        quantityOnOrder: "Su ordine",
        quantityAvailable: "Disponibile",
        reorderPoint: "Punto di riferimento",
        reorderQuantity: "Qtà di riordino",
        unitCost: "Costo unitario",
        isLowStock: "Basso stock",
        updatedAt: "Aggiornato At",
      },
    },
  },

  // Stock adjust
  stockWrite: {
    onHandNow: "Giacenza attuale:",
    viewStock: "Vedi giacenze",
    again: "Registra un'altra",
  },
  stockAdjust: {
    post: {
      title: "Regolare le azioni",
      titleShort: "Regolare le azioni",
      description:
        "Regolare manualmente la quantità di stock. Utilizzare i valori negativi per gli spegnimenti.",
      widget: {
        backToStock: "Torna a magazzino",
        reserved: "Riservato",
        preview: "Anteprima",
        quantityChange: "Variazione della quantità",
        positiveHint: "Quantità positiva aggiunge azione",
        negativeHint: "Quantità negativa rimuove le scorte",
      },
      warehouseId: {
        label: "Magazzino",
        description: "Magazzino per regolare le scorte in",
      },
      productId: { label: "Prodotto", description: "Prodotto per regolare" },
      quantity: {
        label: "Quantità",
        description:
          "Variazione di quantità firmata (positivo = aggiungere, negativo = rimuovere)",
        placeholder: "10",
      },
      reason: {
        label: "Motivazione",
        description: "Perché questo adeguamento è stato fatto",
        placeholder: "Correzione del conteggio fisico",
      },
      unitCost: {
        label: "Costo unitario",
        description: "Costo per unità (opzionale)",
        placeholder: "0.00",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Controllare i campi obbligatori",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per regolare lo stock",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questo magazzino",
        },
        conflict: {
          title: "Azione insufficiente",
          description:
            "Non abbastanza stock disponibile per questa regolazione",
        },
        server: {
          title: "Errore del server",
          description: "Non è riuscito a regolare lo stock",
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
          description: "Magazzino o prodotto non trovato",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Aggiustazioni delle scorte",
        description: "Regolazione delle scorte",
      },
      response: {
        movementId: "Movimento ID",
        productId: "Prodotto ID",
        warehouseId: "Magazzino ID",
        quantityOnHand: "Nuovo sulla mano",
        quantityAvailable: "Disponibile",
      },
    },
  },

  // Stock receive
  stockReceive: {
    post: {
      title: "Ricevimento",
      titleShort: "Ricevimento",
      description:
        "Archiviazione in arrivo. aggiornamenti sulla quantità di mano e il costo medio ponderato.",
      widget: {
        backToStock: "Torna a magazzino",
      },
      warehouseId: {
        label: "Magazzino",
        description: "Magazzino che riceve il magazzino",
      },
      productId: { label: "Prodotto", description: "Prodotto ricevuto" },
      quantity: {
        label: "Quantità",
        description: "Numero di unità ricevute",
        placeholder: "100",
      },
      unitCost: {
        label: "Costo unitario",
        description: "Costo per unità ricevuta",
        placeholder: "0.00",
      },
      reference: {
        label: "Riferimento",
        description: "Numero d'ordine di acquisto o nota di consegna",
        placeholder: "PO-2024-001",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Controllare i campi obbligatori",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per ricevere azioni",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questo magazzino",
        },
        conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
        server: {
          title: "Errore del server",
          description: "Non ricevete le azioni",
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
          description: "Magazzino o prodotto non trovato",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Azioni ricevute",
        description: "Ricevuta d'appalto",
      },
      response: {
        movementId: "Movimento ID",
        productId: "Prodotto ID",
        warehouseId: "Magazzino ID",
        quantityOnHand: "Nuovo sulla mano",
        unitCost: "Nuovo costo unitario",
      },
    },
  },

  // Stock issue
  stockIssue: {
    post: {
      title: "Titolo",
      titleShort: "Titolo",
      description:
        "Emettere azioni da un magazzino. Convalida quantità sufficiente disponibile.",
      widget: {
        backToStock: "Torna a magazzino",
      },
      warehouseId: {
        label: "Magazzino",
        description: "Magazzino emissione stock da",
      },
      productId: { label: "Prodotto", description: "Prodotto da emettere" },
      quantity: {
        label: "Quantità",
        description: "Numero di unità da emettere",
        placeholder: "10",
      },
      reference: {
        label: "Riferimento",
        description: "Ordine del lavoro, numero di lavoro o altro riferimento",
        placeholder: "WO-2024-001",
      },
      unitCost: {
        label: "Costo unitario",
        description:
          "Costo per unità (predefiniti alla media ponderata corrente)",
        placeholder: "0.00",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Controllare i campi obbligatori",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per emettere azioni",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questo magazzino",
        },
        conflict: {
          title: "Azione insufficiente",
          description: "Non abbastanza stock disponibile per emettere",
        },
        server: {
          title: "Errore del server",
          description: "Non rilasciate azioni",
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
          description: "Magazzino o prodotto non trovato",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Emissione di azioni",
        description: "Stock rilasciato con successo",
      },
      response: {
        movementId: "Movimento ID",
        productId: "Prodotto ID",
        warehouseId: "Magazzino ID",
        quantityOnHand: "Nuovo sulla mano",
        quantityAvailable: "Disponibile",
      },
    },
  },

  // Transfer create
  transferCreate: {
    post: {
      title: "Creare un trasferimento",
      titleShort: "Nuovo trasferimento",
      description:
        "Creare una richiesta di trasferimento magazzino. Comincia in Situazione di progetto.",
      widget: {
        itemsTitle: "Articoli da spostare",
        pickSource: "Scegli il magazzino di origine per vederne le giacenze.",
        noStock: "Questo magazzino non ha giacenze da spostare.",
        available: "{{quantity}} disponibili",
        itemsRequired: "Inserisci una quantità per almeno un prodotto.",
        backToList: "Torna ai trasferimenti",
        viewTransfer: "Visualizza trasferimento",
        browseWarehouses: "Sfoglia i Magazzini",
      },
      companyId: {
        label: "Società",
        description: "Società questo trasferimento appartiene a",
      },
      fromWarehouseId: {
        label: "Dal magazzino",
        description: "Magazzino invio magazzino",
      },
      toWarehouseId: {
        label: "A magazzino",
        description: "Magazzino che riceve",
      },
      reference: {
        label: "Riferimento",
        description: "Numero di riferimento del trasferimento",
        placeholder: "TR-2024-001",
      },
      notes: {
        label: "Osservazioni",
        description: "Note aggiuntive su questo trasferimento",
        placeholder: "Rifornimenti stagionali",
      },
      items: {
        label: "Articoli",
        description: "Prodotti e quantità per il trasferimento",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Controllare i campi obbligatori",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per creare trasferimenti",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questa azienda",
        },
        conflict: {
          invalidWarehouses:
            "Entrambi i magazzini devono essere attivi e appartenere a questa società.",
          invalidItems:
            "Ogni prodotto una sola volta, con quantità maggiore di zero (fino a 4 decimali).",
          title: "Stesso magazzino",
          description: "Da e per il magazzino deve essere diverso",
        },
        server: {
          title: "Errore del server",
          description: "Non è riuscito a creare il trasferimento",
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
          description: "Magazzino non trovato",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Trasferimento Creato",
        description: "Progetto di trasferimento creato",
      },
      response: {
        id: "Trasferimento ID",
        status: "Stato",
        reference: "Riferimento",
        fromWarehouseId: "Dal magazzino",
        toWarehouseId: "A magazzino",
      },
    },
  },

  // Transfer list
  transferList: {
    get: {
      title: "Trasferimenti",
      titleShort: "Trasferimenti",
      description: "Elenca i trasferimenti di magazzino per un'azienda.",
      widget: {
        back: "Indietro",
        newTransfer: "Nuovo trasferimento",
        empty: "Non ci sono ancora trasferimenti.",
        emptyHint:
          "Creare un trasferimento per spostare lo stock tra i magazzini.",
        emptyIcon: "🔄",
        loading: "Trasferimenti di carico...",
        load: "Carico",
        selectCompany: "Inserire una società ID per caricare i trasferimenti.",
        total: "bonifici",
        view: "Vista",
        draft: "Progetto",
        inTransit: "In transito",
        viewTransfer: "Visualizza trasferimento",
        tabAll: "Tutti",
        tabDraft: "Finanziamenti",
        tabInTransit: "In transito",
        tabReceived: "Completo",
        tabCancelled: "Annullamento",
        arrowSeparator: "→",
      },
      companyId: {
        label: "Società",
        description: "Società di elencare i trasferimenti per",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Controllare i campi obbligatori",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per elencare i trasferimenti",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questa azienda",
        },
        conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
        server: {
          title: "Errore del server",
          description: "Non elencare i trasferimenti",
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
        title: "Trasferimenti Caricati",
        description: "Elenco di trasferimento recuperato",
      },
      response: {
        id: "Trasferimento ID",
        fromWarehouseId: "Dal magazzino ID",
        fromWarehouseName: "Da",
        toWarehouseId: "A magazzino ID",
        toWarehouseName: "A",
        status: "Stato",
        reference: "Riferimento",
        createdAt: "Creato a",
        completedAt: "Completo a",
      },
    },
  },

  // Transfer get
  transferGet: {
    get: {
      title: "Ottieni trasferimento",
      titleShort: "Trasferimento",
      description:
        "Recuperare un trasferimento con tutti i suoi articoli di linea.",
      widget: {
        cancel: "Annulla trasferimento",
        retry: "Riprova",
        noItems: "Questo trasferimento non contiene articoli.",
        noItemsHint:
          "Aggiungi i prodotti da spostare quando crei il trasferimento. Senza articoli non può essere spedito.",
        receivedOf: "{{received}} di {{requested}} ricevuti",
        newTransfer: "Nuovo trasferimento",
        back: "Indietro",
        dispatch: "Trasferimenti di spedizione",
        receive: "Mark ricevuto",
        status: "Stato",
        select: "Selezionare il trasferimento",
      },
      transferId: {
        label: "Trasferimento",
        description: "Trasferimenti per recuperare",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Trasferimento non valido ID",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per visualizzare i trasferimenti",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questo trasferimento",
        },
        conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
        server: {
          title: "Errore del server",
          description: "Non caricate il trasferimento",
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
          title: "Transfer Non trovato",
          description: "Il trasferimento non esiste",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Trasferimento Caricato",
        description: "Trasferire i dettagli recuperati",
      },
      response: {
        id: "Trasferimento ID",
        companyId: "Società ID",
        fromWarehouseId: "Dal magazzino",
        fromWarehouseName: "Dal magazzino",
        toWarehouseId: "A magazzino",
        toWarehouseName: "A magazzino",
        status: "Stato",
        reference: "Riferimento",
        notes: "Osservazioni",
        createdAt: "Creato il",
        completedAt: "Completato il",
        items: "Articoli",
        itemId: "Articolo ID",
        productId: "Prodotto ID",
        productName: "Prodotto",
        quantityRequested: "Richiesta",
        quantityReceived: "Ricevuto.",
      },
    },
  },

  // Transfer dispatch
  transferCancel: {
    post: {
      title: "Annulla trasferimento",
      titleShort: "Annulla trasferimento",
      description:
        "Ferma questo trasferimento. Se già spedito, la merce torna nel magazzino di origine.",
      widget: {
        backToTransfer: "Torna al trasferimento",
      },
      transferId: {
        label: "Trasferimento",
        description: "Trasferimento da annullare",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Trasferimento non valido",
        },
        unauthorized: {
          title: "Accesso non effettuato",
          description: "Accedi per annullare i trasferimenti",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questo trasferimento",
        },
        conflict: {
          title: "Impossibile annullare",
          description:
            "Si possono annullare solo bozze e trasferimenti in transito",
        },
        server: {
          title: "Errore del server",
          description: "Impossibile annullare il trasferimento",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        network: {
          title: "Errore di rete",
          description: "Controlla la connessione e riprova",
        },
        notFound: {
          title: "Trasferimento non trovato",
          description: "Questo trasferimento non esiste",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Trasferimento annullato",
        description: "Nulla di questo trasferimento è più in transito.",
      },
      response: {
        id: "Trasferimento",
        status: "Stato",
      },
    },
  },
  transferDispatch: {
    post: {
      title: "Trasferimento della posta",
      titleShort: "Dispiace",
      description:
        "Trasferimento di marca come in transito. La scorta lascia il magazzino di origine.",
      widget: {
        backToTransfer: "Ritorno al trasferimento",
      },
      transferId: {
        label: "Trasferimento",
        description: "Trasferimento alla spedizione",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Trasferimento non valido ID",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per inviare i trasferimenti",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questo trasferimento",
        },
        conflict: {
          insufficientStock:
            "Giacenza insufficiente nel magazzino di origine per almeno un articolo.",
          title: "Non un progetto",
          description: "Possono essere spediti solo bozze di bozzetti",
        },
        server: {
          title: "Errore del server",
          description: "Non è stato possibile inviare il trasferimento",
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
          title: "Transfer Non trovato",
          description: "Il trasferimento non esiste",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Trasferimento Dispattraverso",
        description: "Il trasferimento è ora in transito",
      },
      response: {
        id: "Trasferimento ID",
        status: "Stato",
      },
    },
  },

  // Transfer receive
  transferReceive: {
    post: {
      title: "Ricevere il trasferimento",
      titleShort: "Ricevere il trasferimento",
      description:
        "Trasferimento di marca come ricevuto. Crea movimenti azionari e aggiorna l'inventario su entrambe le estremità.",
      widget: {
        backToTransfer: "Ritorno al trasferimento",
      },
      transferId: {
        label: "Trasferimento",
        description: "Trasferimenti per ricevere",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Trasferimento non valido ID",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per ricevere i trasferimenti",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questo trasferimento",
        },
        conflict: {
          title: "Non in Transit",
          description:
            "Solo i trasferimenti in transito possono essere ricevuti",
        },
        server: {
          title: "Errore del server",
          description: "Non ricevete il trasferimento",
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
          title: "Transfer Non trovato",
          description: "Il trasferimento non esiste",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Trasferimento ricevuto",
        description: "Movimenti di stock creati e aggiornati",
      },
      response: {
        id: "Trasferimento ID",
        status: "Stato",
        completedAt: "Completo a",
      },
    },
  },

  // Inventory Dashboard
  dashboard: {
    get: {
      title: "Panoramica dell'inventario",
      titleShort: "Panoramica",
      description:
        "snapshot dal vivo della salute delle scorte, dei trasferimenti in sospeso e dei conteggi di magazzino.",
      widget: {
        navStockLevelsHint: "Quantità, valore e punti di riordino",
        navTransfersHint: "In transito: {{count}}",
        navWarehousesHint: "Sedi: {{count}}",
        noWarehouses: "Nessun magazzino",
        noWarehousesHint: "Crea un magazzino per ricevere e spostare merce.",
        related: "Correlati",
        kpiInStock: "In stock",
        kpiOutOfStock: "Fuori dal magazzino",
        kpiLowStock: "Basso stock",
        kpiWarehouses: "Magazzini",
        attention: "Scorte da controllare",
        noAttention: "Nessun articolo da riordinare.",
        newPurchaseOrder: "Nuovo ordine",
        kpiTransfersInTransit: "Trasferimenti in transito",
        alertOutOfStock: "Prodotto {{count}} esaurito",
        alertOutOfStockPlural: "Prodotti {{count}} esauriti",
        navStockLevels: "Livelli di stock",
        navTransfers: "Trasferimenti",
        navWarehouses: "Magazzini",
        loading: "Caricamento…",
        pendingTransfers: "Trasferimento {{count}} in transito",
        pendingTransfersPlural: "Trasferimenti {{count}} in transito",
      },
      companyId: {
        label: "Società",
        description:
          "Società per mostrare le statistiche di inventario per (opzionale)",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Controllare i campi obbligatori",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per visualizzare la panoramica dell'inventario",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Nessun accesso a questa azienda",
        },
        conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
        server: {
          title: "Errore del server",
          description: "Non caricare la panoramica dell'inventario",
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
        description: "Panoramica dell'inventario recuperato",
      },
      response: {
        inStockCount: "In stock",
        outOfStockCount: "Fuori dal magazzino",
        lowStockCount: "Basso stock",
        pendingTransferCount: "Trasferimenti",
        warehouseCount: "Magazzini",
      },
    },
  },
};
