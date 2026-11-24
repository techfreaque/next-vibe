import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",

  get: {
    title: "Aggiorna tutti i prezzi del modello",
    titleShort: "Aggiornare i prezzi",
    description:
      "Recupera i prezzi correnti dei fornitori e mostra le modifiche proposte. Usa --write nella CLI locale per applicarle.",
    form: {
      title: "Aggiornamento del prezzo del modello",
      write: "Scrivi le modifiche nei file sorgente",
    },
    response: {
      diff: "Diff dei file sorgente",
      summary: {
        title: "Aggiornamento sommario",
        totalProviders: "Correre i fornitori",
        totalModels: "Modelli totali",
        modelsUpdated: "Modifiche proposte",
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
        "Prezzi dei fornitori recuperati e confrontati con il catalogo.",
    },
  },
  tags: {
    models: "Modelli",
  },
  updateAllModelPrices: {
    name: "Aggiorna tutti i prezzi dei modelli",
    description:
      "Confronta i prezzi correnti dei fornitori con il catalogo e riporta le differenze da esaminare.",
  },
};
