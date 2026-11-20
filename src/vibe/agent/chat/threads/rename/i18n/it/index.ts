import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    threads: "Conversazioni",
  },
  patch: {
    title: "Rinominare il filo",
    titleShort: "Rinominare il filo",
    description: "Aggiornare il titolo e l'anteprima di un thread di chat",
    container: {
      title: "Rinominare il filo",
      description: "Impostare un nuovo titolo o anteprima per il thread",
    },
    threadId: {
      label: "File ID",
      description: "ID del thread per rinominare",
    },
    threadTitle: {
      label: "Titolo",
      description: "Nuovo titolo per il thread",
      placeholder: "Inserire il titolo thread...",
    },
    preview: {
      label: "Anteprima",
      description: "Breve descrizione o testo di anteprima per il thread",
      placeholder: "Inserisci il testo di anteprima...",
    },
    response: {
      threadId: {
        content: "File ID",
      },
      title: {
        content: "Titolo",
      },
      preview: {
        content: "Anteprima",
      },
      updatedAt: {
        content: "Aggiornato At",
      },
    },
    errors: {
      validation: {
        title: "Input non valido",
        description:
          "Controllare che threadId sia un valido UUID e che almeno un campo sia fornito",
        noActiveThread: "Nessun thread attivo nel contesto del flusso",
        folderUnresolved: "Non è possibile risolvere la cartella del thread",
      },
      unauthorized: {
        title: "Non firmato",
        description: "Accedi per rinominare i filetti",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di rinominare questo thread",
      },
      notFound: {
        title: "Conversazione non trovata",
        description: "Nessun filo esiste con questo ID",
        detail: "Filetto non trovato: {{threadId}}",
      },
      server: {
        title: "Errore del server",
        description: "Non rinominare il filo",
        detail: "Errore del server: {{error}}",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile raggiungere il server",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Qualcosa è andato storto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
      conflict: {
        title: "Conflitto",
        description: "Il filo è stato modificato da qualcun altro",
      },
    },
    success: {
      title: "Discussione rinominato",
      description: "Il titolo e l'anteprima del thread sono stati aggiornati",
    },
    backButton: {
      label: "Annulla",
    },
    submitButton: {
      label: "Salva",
      loadingText: "Salvare...",
    },
    dynamicTitle: "Rinominare il filo: {{title}}",
  },
};
