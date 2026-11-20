/**
 * English translations for WS Provider Models endpoint
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Modelli AI",
  tags: {
    models: "modelli",
    aiModels: "ai-modelli",
  },
  get: {
    title: "Elenco modelli AI",
    titleShort: "Modelli AI",
    description:
      "Restituisce tutti i modelli AI disponibili con informazioni sui prezzi e sulle capacità",
    response: {
      models: {
        title: "Modelli",
      },
      id: {
        content: "Modello ID",
      },
      name: {
        content: "Nome",
      },
      provider: {
        content: "Fornitore",
      },
      category: {
        content: "Categoria",
      },
      description: {
        content: "Designazione",
      },
      contextWindow: {
        content: "Finestra di contesto",
      },
      supportsTools: {
        content: "Supporta gli strumenti",
      },
      creditCost: {
        content: "Costo di credito",
      },
    },
    success: {
      title: "Modelli recuperati",
      description: "Lista modello AI recuperato con successo",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
      },
      network: {
        title: "Errore di rete",
        description: "Impossibile connettersi al server",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso negato",
      },
      notFound: {
        title: "Non trovato",
        description: "Modelli non trovati",
      },
      server: {
        title: "Errore del server",
        description: "Non recuperato modelli",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato un conflitto",
      },
    },
  },
};
