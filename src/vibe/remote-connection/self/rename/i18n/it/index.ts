import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Account",
  tags: {
    remoteConnection: "Connessione remota",
  },
  patch: {
    title: "Rinominare il presente Tribunale",
    titleShort: "Rinominare il nome",
    description: "Aggiornare il nome amichevole della propria istanza",
    renaming: "Rinomina in corso…",
    newInstanceId: {
      label: "Nuovo nome dell'istanza",
      description:
        "Le istanze collegate vedono questo server con questo nome. Deve essere unico, massimo 32 caratteri.",
      placeholder: "hermes",
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
        description: "Devi essere connesso per rinominare questo caso",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di rinominare questa istanza",
      },
      notFound: {
        title: "Non trovato",
        description: "identitą non trovata",
      },
      server: {
        title: "Errore del server",
        description: "Si è verificato un errore durante il rinominazione",
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
      title: "Rinominato",
      description: "Rinominato con successo",
    },
  },
};
