import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Sistema",
  get: {
    title: "Produzione di esportazione",
    titleShort: "Esportazione Env",
    description:
      "Generare un file.env di produzione con valori decritti, istruzioni di distribuzione e una lista di controllo",
    tags: {
      exportEnv: "Esportazione Env",
    },
    response: {
      content: {
        title: "Contenuti di file Env",
      },
      filename: {
        title: "Nome del file",
      },
    },
    success: {
      title: "Esportazione di Env",
      description: "Produzione file env generato con successo",
    },
    widget: {
      copy: "Copia a clipboard",
      copied: "Copiato!",
      download: "Scarica.env.prod",
      instructions: "Copia questo file sul server e riavvia l'applicazione.",
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
        description: "Impostazioni non trovate",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      server: {
        title: "Errore del server",
        description: "Non è riuscito a generare file env",
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
