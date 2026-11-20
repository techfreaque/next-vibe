import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    products: "Prodotti",
    category: "Categoria",
    list: "Elenco",
  },
  get: {
    title: "Categorie",
    titleShort: "Categorie",
    description:
      "Recuperare le categorie di prodotti per una società o proprietario.",
    companyId: {
      label: "Società ID",
      description: "Filtra le categorie appartenenti a questa azienda",
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
        description: "Accedi per visualizzare le categorie",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di visualizzare queste categorie",
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
        description: "Nessuna categoria trovata",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    success: {
      title: "Categorie recuperate",
      description: "Le categorie di prodotti sono elencate di seguito.",
    },
    response: {
      id: "Categoria ID",
      name: "Nome della categoria",
      parentId: "Categoria principale",
      sortOrder: "Ordinare",
      isActive: "Attivo",
      createdAt: "Creato",
      total: "Totale",
    },
    widget: {
      addCategory: "Aggiungi la categoria",
      active: "Attivo",
      inactive: "Inattivo",
      empty: "Nessuna categoria trovata. Aggiungi la tua prima categoria.",
      viewProducts: "Visualizza prodotti →",
      backToCatalog: "← Prodotti",
      back: "Indietro",
    },
  },
};
