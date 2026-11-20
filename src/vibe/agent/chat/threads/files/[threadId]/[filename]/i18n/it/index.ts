import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    files: "File",
  },
  get: {
    title: "Ottieni file",
    titleShort: "File di file",
    description: "Recuperare un file caricato",
    success: {
      title: "File recuperato",
      description: "File recuperato con successo",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri di richiesta file non valido",
      },
      network: {
        title: "Errore di rete",
        description: "Non recuperato il file a causa di errore di rete",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Autenticazione necessaria per accedere a questo file",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di accedere a questo file",
      },
      notFound: {
        title: "File non trovato",
        description:
          "Il file richiesto non è stato trovato o l'accesso è stato negato",
      },
      server: {
        title: "Errore del server",
        description: "Non recuperato il file a causa dell'errore del server",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato un conflitto",
      },
    },
  },
  errors: {
    fileNotFound: "File non trovato o accesso negato",
  },
};
