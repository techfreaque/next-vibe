import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    productType: {
      service: "Servizio",
      physical: "Fisica",
      digital: "Digitale",
    },
  },
  tags: {
    products: "Prodotti",
    catalog: "Catalogo",
    update: "Aggiornamento",
  },
  patch: {
    title: "Aggiornamento del prodotto",
    titleShort: "Aggiornamento del prodotto",
    description: "Campi di aggiornamento su un prodotto di catalogo esistente.",
    productId: {
      label: "Prodotto ID",
      description: "La ID del prodotto per aggiornare",
    },
    name: {
      label: "Nome del prodotto",
      description: "Nome aggiornato per il prodotto",
      placeholder: "Pacchetto Web Design",
    },
    productDescription: {
      label: "Designazione",
      description: "Descrizione del prodotto aggiornata",
      placeholder: "Progettazione completa del sito web con fino a 5 pagine",
    },
    sku: {
      label: "SKU",
      description: "Codice unità di conservazione delle scorte aggiornato",
      placeholder: "WD-001",
    },
    type: {
      label: "Tipo di prodotto",
      description: "Tipo di prodotto aggiornato",
      placeholder: "Selezionare il tipo",
    },
    unit: {
      label: "Unità",
      description: "Unità di fatturazione aggiornata",
      placeholder: "ora",
    },
    basePrice: {
      label: "Prezzo base",
      description: "Prezzo base aggiornato",
      placeholder: "150.00",
    },
    currency: {
      label: "Valuta",
      description: "Aggiornato il codice di valuta a 3 lettere ISO",
      placeholder: "EUR",
    },
    defaultTaxRate: {
      label: "Tasso di imposta predefinito",
      description: "Tasso di imposta predefinito aggiornato come decimale",
      placeholder: "0.19",
    },
    categoryId: {
      label: "Categoria",
      description: "Categoria di prodotto aggiornata",
    },
    imageUrl: {
      label: "Immagine URL",
      description: "Immagine prodotto aggiornata URL",
      placeholder: "https://example.com/product.jpg",
    },
    isActive: {
      label: "Attivo",
      description: "Se il prodotto è disponibile nel catalogo",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Controlla i campi e riprova",
      },
      unauthorized: {
        title: "Non firmata",
        description: "Accedi per aggiornare un prodotto",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di aggiornare questo prodotto",
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
        description: "Prodotto non trovato",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    success: {
      title: "Prodotto aggiornato",
      description: "I dettagli del prodotto sono stati salvati.",
    },
    response: {
      id: "Prodotto ID",
      name: "Nome del prodotto",
    },
    widget: {
      catalogCompany: "Azienda del catalogo",
      billingCadence: "Frequenza di fatturazione",
      oneTime: "Acquisto singolo",
      personalCatalog: "Catalogo personale",
      companyUnavailable: "Nome dell’azienda non disponibile",
      couldNotLoad: "Impossibile caricare il prodotto.",
      retry: "Riprova",
      backToList: "Torna ai prodotti",
      back: "Indietro",
    },
  },
};
