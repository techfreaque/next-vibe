import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    products: "Prodotti",
    category: "Categoria",
    create: "Creare",
  },
  post: {
    title: "Creare Categoria prodotto",
    titleShort: "Creare Categoria",
    description:
      "Aggiungi una categoria per organizzare i tuoi prodotti di catalogo.",
    name: {
      label: "Nome della categoria",
      description: "Nome della categoria di prodotto",
      placeholder: "Servizi di progettazione",
    },
    companyId: {
      label: "Società",
      description: "Associare questa categoria con un'azienda",
    },
    parentId: {
      label: "Categoria principale",
      description: "Categoria madre opzionale per l'organizzazione gerarchica",
    },
    sortOrder: {
      label: "Ordinare",
      description: "Ordine di visualizzazione. numeri più bassi appaiono prima",
      placeholder: "0",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Controlla i campi del modulo e riprova",
      },
      unauthorized: {
        title: "Non firmata",
        description: "Accedi per creare una categoria",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di creare questa categoria",
      },
      conflict: {
        title: "Gia'.",
        description: "Una categoria con questo nome esiste già",
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
      title: "Categoria Creato",
      description: "La vostra categoria di prodotto è pronta.",
    },
    response: {
      id: "Categoria ID",
      name: "Nome della categoria",
    },
    widget: {
      backToList: "Torna a Categorie",
      back: "Indietro",
    },
  },
};
