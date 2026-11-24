import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",

  get: {
    title: "Aggiorna tutti i prezzi del modello",
    titleShort: "Aggiornare i prezzi",
    description:
      "Ottieni prezzi in tempo reale per tutti i modelli da ogni fornitore API (OpenRouter, Replicate, ecc.) e aggiorna modelli.ts",
    form: {
      title: "Aggiornamento del prezzo del modello",
    },
    response: {
      summary: {
        title: "Aggiornamento sommario",
        totalProviders: "Correre i fornitori",
        totalModels: "Modelli totali",
        modelsUpdated: "Modelli Aggiornati",
        fileUpdated: "Aggiornamento del file",
      },
      updates: {
        title: "Modelli aggiornati",
        model: {
          modelId: "Modello ID",
          name: "Nome del modello",
          provider: "Fornitore",
          field: "Campo dei prezzi",
          value: "Nuovo valore",
          source: "Fonte del prezzo",
        },
      },
      failures: {
        title: "Guarnizione del prezzo",
        model: {
          modelId: "Modello ID",
          provider: "Fornitore",
          reason: "Motivazione",
        },
      },
      providerResults: {
        title: "Risultati del fornitore",
        model: {
          provider: "Fornitore",
          modelsFound: "Modelli trovati",
          modelsUpdated: "Aggiornato",
          error: "Errore",
        },
      },
    },
    errors: {
      server: {
        title: "Errore del server",
        description: "Non è riuscito ad aggiornare i prezzi del modello",
      },
      network: {
        title: "Errore di rete",
        description: "Non poteva connettersi alle API di prezzi",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
        // `title` doubles as the generic errorTypes label - detail lives here so
        // no raw placeholder leaks into those labels.
        detail: "Errore sconosciuto: {{error}}",
      },
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non sei autorizzato a eseguire questa azione",
      },
      forbidden: {
        title: "Accesso negato",
        description: "L'accesso a questa risorsa è vietato",
      },
      notFound: {
        title: "Non trovato",
        description: "La risorsa richiesta non è stata trovata",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Si è verificato un conflitto durante l'elaborazione della richiesta",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    success: {
      title: "Operazione riuscita",
      description:
        "Con successo ottenuto e aggiornato tutti i prezzi dei modelli",
    },
  },
  tags: {
    models: "Modelli",
  },
  updateAllModelPrices: {
    name: "Aggiorna tutti i prezzi dei modelli",
    description:
      "Recupera i prezzi correnti di tutti i modelli dalle API dei fornitori e aggiorna models.ts.",
  },
};
