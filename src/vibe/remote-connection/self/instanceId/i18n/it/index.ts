import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Account",
  tags: {
    remoteConnection: "Connessione remota",
  },
  get: {
    title: "ID di questo grado",
    titleShort: "Articolo ID",
    description: "Leggi l'identificatore della tua istanza su questa macchina",
    instanceId: {
      label: "Articolo ID",
      description: "L'identificatore di questo caso",
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
        title: "Non è stato registrato",
        description: "Devi essere connesso per leggere ID di questa istanza",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di leggere la ID di questa istanza",
      },
      notFound: {
        title: "Non trovato",
        description: "identitą non trovata",
      },
      server: {
        title: "Errore del server",
        description:
          "Si è verificato un errore durante la lettura dell'istanza ID",
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
    success: {
      title: "Articolo ID",
      description: "Risolto ID di questa istanza",
    },
  },
};
