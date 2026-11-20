import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    awaitTask: "Attività di attesa",
  },
  post: {
    title: "Attività di attesa",
    titleShort: "Attività di attesa",
    description:
      "Attendere su un compito di sfondo spedito. Ritorna immediatamente se già fatto, o si ferma il flusso AI fino a quando l'attività termina.",
    fields: {
      taskId: {
        label: "Task ID",
        description:
          "L'attività ID è stata restituita da esegui-tool (modalità di distacco o wakeUp).",
      },
      status: {
        title: "Stato",
        description: "Situazione attuale delle attività.",
      },
      result: {
        title: "Risultato",
        description: "Utensile di uscita (presente quando completato).",
      },
      waiting: {
        title: "Aspettare",
        description:
          "È vero quando il flusso viene sospeso in attesa del compito.",
      },
      originalToolName: {
        title: "Strumento",
        description: "Lo strumento che è stato spedito.",
      },
      originalArgs: {
        title: "Argomenti",
        description: "Gli argomenti di input dello strumento spedito.",
      },
    },
    dynamicTitle: "Aspetta: {{toolName}}",
    widget: {
      noToolName: "Nessun nome di strumento disponibile.",
      resolving: "Risolvere lo strumento...",
      unknownTool: "Strumento sconosciuto: {{toolName}}",
    },
    status: {
      waiting: "Aspettare",
      complete: "Completato",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Invalid taskId",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      internal: {
        title: "Errore interno",
        description: "Non è riuscito a registrare cameriere sul compito",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non avete il permesso di attendere questo compito",
      },
      notFound: {
        title: "Non trovato",
        description: "Compito non trovato",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      unsaved: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
      conflict: {
        title: "Conflitto",
        description: "Discorso dello stato di attività",
      },
    },
    success: {
      title: "Fatto",
      description: "Compito",
    },
  },
};
