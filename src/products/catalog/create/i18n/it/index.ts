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
    create: "Creare",
  },
  post: {
    title: "Creare un prodotto",
    titleShort: "Creare un prodotto",
    description: "Aggiungi un prodotto o un servizio al tuo catalogo.",
    name: {
      label: "Nome del prodotto",
      description: "Nome del prodotto o del servizio",
      placeholder: "Pacchetto Web Design",
    },
    productDescription: {
      label: "Designazione",
      description:
        "Breve descrizione di ciò che il prodotto o il servizio include",
      placeholder: "Progettazione completa del sito web con fino a 5 pagine",
    },
    sku: {
      label: "SKU",
      description: "Unità di stoccaggio. il vostro codice del prodotto interno",
      placeholder: "WD-001",
    },
    type: {
      label: "Tipo di prodotto",
      description:
        "Che si tratti di un servizio, un bene fisico o un elemento digitale",
      placeholder: "Selezionare il tipo",
    },
    unit: {
      label: "Unità",
      description: "Unità di fatturazione (ad esempio ora, pezzo, licenza)",
      placeholder: "ora",
    },
    basePrice: {
      label: "Prezzo base",
      description: "Prezzo predefinito nella valuta selezionata",
      placeholder: "150.00",
    },
    currency: {
      label: "Valuta",
      description: "3 lettere ISO codice valutario",
      placeholder: "EUR",
    },
    defaultTaxRate: {
      label: "Tasso di imposta predefinito",
      description:
        "Valuta di default VAT /tax come decimale (ad esempio 0.19 per 19%)",
      placeholder: "0.19",
    },
    companyId: {
      label: "Società",
      description: "Associare questo prodotto con un'azienda",
    },
    categoryId: {
      label: "Categoria",
      description: "Categoria prodotto",
    },
    imageUrl: {
      label: "Immagine URL",
      description: "URL a un'immagine di prodotto",
      placeholder: "https://example.com/product.jpg",
    },
    isSubscription: {
      label: "Prodotto di abbonamento",
      description: "Caricare i clienti su una base ricorrente",
    },
    billingInterval: {
      label: "Intervallo di fatturazione",
      description: "Quanto spesso i clienti sono a carico",
      placeholder: "Selezionare l'intervallo",
      monthly: "Mensile",
      yearly: "Annuale",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Controlla i campi del modulo e riprova",
      },
      unauthorized: {
        title: "Non firmata",
        description: "Accedi per creare un prodotto",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di creare questo prodotto",
      },
      conflict: {
        title: "Gia'.",
        description: "Un prodotto con questo SKU esiste già",
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
        description: "Risorsa non trovata",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    success: {
      title: "Prodotto Creato",
      description: "Il tuo prodotto è ora nel catalogo.",
    },
    response: {
      id: "Prodotto ID",
      name: "Nome del prodotto",
    },
    widget: {
      viewProduct: "Visualizza prodotto",
      backToList: "Torna ai prodotti",
      back: "Indietro",
    },
  },
};
