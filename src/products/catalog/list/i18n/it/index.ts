import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    products: "Prodotti",
    catalog: "Catalogo",
    list: "Elenco",
  },
  enums: {
    productType: {
      service: "Servizio",
      physical: "Fisica",
      digital: "Digitale",
    },
  },
  get: {
    title: "Prodotti",
    titleShort: "Prodotti",
    description:
      "Recuperare tutti i prodotti nel vostro catalogo. Filtra per azienda, categoria, tipo o stato attivo.",
    companyId: {
      label: "Società ID",
      description: "Filtra i prodotti appartenenti a questa azienda",
    },
    categoryId: {
      label: "Categoria ID",
      description: "Filtra i prodotti in questa categoria",
    },
    type: {
      label: "Tipo di prodotto",
      description: "Filtra per servizio, fisico o digitale",
      placeholder: "Tutti i tipi",
    },
    isActive: {
      label: "Solo",
      description: "Mostra solo prodotti attivi",
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
        description: "Controllare i parametri del filtro e riprovare",
      },
      unauthorized: {
        title: "Non firmata",
        description: "Accedi per visualizzare il tuo catalogo",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di visualizzare questo catalogo",
      },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato un conflitto",
      },
      server: {
        title: "Errore del server",
        description: "Qualcosa è andato storto alla nostra fine. riprovare",
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
      title: "Prodotti recuperati",
      description: "I prodotti del catalogo sono elencati di seguito.",
    },
    response: {
      id: "Prodotto ID",
      name: "Nome del prodotto",
      type: "Tipologia",
      sku: "SKU",
      basePrice: "Prezzo base",
      currency: "Valuta",
      unit: "Unità",
      isActive: "Attivo",
      isSubscription: "Abbonamento",
      billingInterval: "Frequenza di fatturazione",
      categoryId: "Categoria",
      createdAt: "Creato",
      total: "Totale",
    },
    widget: {
      addProduct: "Aggiungi il prodotto",
      active: "Attivo",
      inactive: "Inattivo",
      empty:
        "Nessun prodotto trovato. Regolare i filtri o aggiungere un nuovo prodotto.",
      columnProduct: "Prodotto",
      columnTypePrice: "Tipo / Prezzo / Stato",
      filterLoad: "Carico",
      filterAllTypes: "Tutti i tipi",
      filterActiveOnly: "Solo attivo",
      filterAllStatus: "Tutto lo stato",
      recurring: "Ripresa",
      billingMonthly: "Mensile",
      billingYearly: "Annuale",
      navCategories: "Categorie",
      navTaxRates: "Aliquote fiscali",
      back: "Indietro",
    },
  },
};
