import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    products: "Prodotti",
    catalog: "Catalogo",
    deactivate: "Disattivare",
  },
  post: {
    title: "Disattivare il prodotto",
    titleShort: "Disattivare",
    description:
      "Morbido-eliminare un prodotto di catalogo marcandolo inattivo. I dati del prodotto sono conservati.",
    productId: {
      label: "Prodotto ID",
      description: "La ID del prodotto per disattivare",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Controllare il prodotto ID e riprovare",
      },
      unauthorized: {
        title: "Non firmata",
        description: "Accedi per disattivare un prodotto",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di disattivare questo prodotto",
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
      title: "Riattivato il prodotto",
      description: "Il prodotto è stato rimosso dal catalogo attivo.",
    },
    response: {
      id: "Prodotto ID",
      isActive: "Stato attivo",
    },
    widget: {
      backToList: "Torna ai prodotti",
      back: "Indietro",
      warning:
        "Questo disattiva il prodotto e rimuoverlo dal catalogo attivo. I dati vengono conservati.",
    },
  },
};
