import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Sistema",
  get: {
    title: "Generare la chiave segreta",
    titleShort: "Generare la chiave",
    description:
      "Generare una chiave esagonale a 64 caratteri casuale protetta dalla crittografia",
    tags: {
      generateKey: "Generare la chiave",
    },
    response: {
      key: {
        title: "Chiave generata",
      },
    },
    success: {
      title: "Chiave generata",
      description: "Chiave sicura generata con successo",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso all'amministratore richiesto",
      },
      notFound: {
        title: "Non trovato",
        description: "Account o sessione non trovati",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      server: {
        title: "Errore del server",
        description: "Non è riuscito a generare chiave",
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
