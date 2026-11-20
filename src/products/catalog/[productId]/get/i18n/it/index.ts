import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    products: "Prodotti",
    catalog: "Catalogo",
    get: "Vai!",
  },
  get: {
    title: "Ottenere il prodotto del catalogo",
    titleShort: "Dettagli del prodotto",
    description: "Recuperare un singolo catalogo prodotto da ID.",
    productId: {
      label: "Prodotto ID",
      description: "La ID del prodotto da recuperare",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Controllare il prodotto ID e riprovare",
      },
      unauthorized: {
        title: "Non firmata",
        description: "Accedi per visualizzare i dettagli del prodotto",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di visualizzare questo prodotto",
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
      title: "Prodotto recuperato",
      description: "Dettagli prodotto caricato.",
    },
    response: {
      id: "Prodotto ID",
      companyId: "Società",
      name: "Nome del prodotto",
      description: "Designazione",
      sku: "SKU",
      type: "Tipologia",
      unit: "Unità",
      basePrice: "Prezzo base",
      currency: "Valuta",
      defaultTaxRate: "Tasso di imposta predefinito",
      categoryId: "Categoria",
      imageUrl: "Immagine URL",
      isActive: "Attivo",
      isSubscription: "Abbonamento",
      billingInterval: "Frequenza di fatturazione",
      createdAt: "Creato",
      updatedAt: "Aggiornato",
    },
    widget: {
      edit: "Modifica",
      deactivate: "Disattivare",
      activate: "Attivare",
      active: "Attivo",
      inactive: "Inattivo",
      back: "Indietro",
      loading: "Caricamento del prodotto...",
      typeService: "Servizio",
      typePhysical: "Fisica",
      typeDigital: "Digitale",
      recurring: "Ripresa",
      billingMonthly: "Mensile",
      billingYearly: "Annuale",
      addToInvoice: "Aggiungi alla fattura",
      details: "Dettagli",
      select: "Selezionare il prodotto",
    },
  },
};
