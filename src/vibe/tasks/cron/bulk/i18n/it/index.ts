import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "API Endpoint",
  tags: {
    tasks: "Compiti",
    cron: "Cron",
    bulk: "Bulk",
  },
  post: {
    title: "Azione di attività Bulk",
    titleShort: "Compiti in serie",
    description:
      "Eseguire un'azione di massa (eliminare, attivare, disabilitare, eseguire) su più attività di cron",
    fields: {
      ids: {
        label: "ID delle attività",
        description: "Elenco degli ID delle attività da attivare",
      },
      action: {
        label: "Azione",
        description: "L'azione da eseguire sulle attività selezionate",
        options: {
          delete: "Elimina",
          enable: "Abilita'",
          disable: "Disattivare",
          run: "Correte!",
        },
      },
      succeeded: {
        label: "Accadenze",
        description: "Numero di compiti trattati con successo",
      },
      failed: {
        label: "Sfigato",
        description: "Numero di compiti che non sono riusciti a elaborare",
      },
      errors: {
        label: "Errori",
        description: "Elenco degli errori per-task",
      },
    },
    errors: {
      fetchFailed: "Non recuperato ID attività per azione di massa",
      validation: {
        title: "Convalida fallita",
        description: "I dati di azione in massa forniti non sono validi",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non hai il permesso di eseguire azioni di massa",
      },
      internal: {
        title: "Errore interno",
        description:
          "Si è verificato un errore durante l'esecuzione dell'azione di massa",
      },
      forbidden: {
        title: "Accesso negato",
        description: "L'accesso a questa risorsa è vietato",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Un conflitto si è verificato durante l'elaborazione dell'azione di massa",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      notFound: {
        title: "Account o sessione non trovati",
        description: "Una o più mansioni non sono state trovate",
      },
      unsaved: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
    },
    success: {
      completed: {
        title: "Azione Bulk completata",
        description:
          "L'azione di massa è stata applicata alle attività selezionate",
      },
    },
  },
};
