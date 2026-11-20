import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  patch: {
    title: "Modifica file",
    titleShort: "Modifica file",
    description:
      "Cambiare parte di un file. Trovare il testo e sostituirlo, o modificare le linee specifiche.",
    dynamicTitle: "Modificato da {{path}}",
    status: {
      loading: "Modificare...",
      done: "Modificato",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Sentiero",
        description: "Quale file da modificare",
      },
      find: {
        label: "Trova",
        description: "Testo da trovare",
      },
      replace: {
        label: "Sostituire",
        description: "Sostituiscilo con questo",
      },
      startLine: {
        label: "Dalla linea",
        description: "Iniziare a questo numero di linea",
      },
      endLine: {
        label: "Per la linea",
        description: "Fine a questo numero di linea",
      },
      newContent: {
        label: "Nuovi contenuti",
        description: "Metti questo invece di quelle righe",
      },
    },
    submitButton: {
      label: "Applicare",
      loadingText: "Applicare...",
    },
    response: {
      path: { content: "Sentiero" },
      size: { text: "Dimensione" },
      replacements: { text: "Variazioni" },
      updatedAt: { content: "Aggiornato" },
    },
    errors: {
      validation: {
        title: "Bad Input",
        description: "Controllare il percorso e trovare / sostituire",
      },
      network: {
        title: "Offline",
        description: "Non riesco a raggiungere il server",
      },
      unauthorized: {
        title: "Non è stato registrato",
        description: "Accedi per primo",
      },
      forbidden: {
        title: "Nessun accesso",
        description: "Non è possibile modificare questo",
      },
      notFound: { title: "Non trovato", description: "Il file non esiste" },
      findNotFound:
        'Testo non trovato: " {{snippet}} " in {{path}}. Leggi il file con cortex-read, poi riprovare con il testo esatto.',
      lineRangeOutOfBounds:
        "Linea gamma {{startLine}} - {{endLine}} è fuori dai limiti. Il file ha linee {{lineCount}}.",
      missingEditStrategy:
        "Fornire o trovare + sostituire, o startLine + endLine + newContent. Ricevuto: {{provided}}.",
      noParamsProvided: "niente",
      server: { title: "Errore del server", description: "Qualcosa di rotto" },
      unknown: { title: "Errore", description: "Qualcosa è andato storto" },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Salvare o scartare prima",
      },
      conflict: {
        title: "Conflitto",
        description: "Il file è cambiato durante la modifica",
      },
    },
    success: {
      title: "Modificato",
      description: "Modifiche salvate",
    },
  },
};
