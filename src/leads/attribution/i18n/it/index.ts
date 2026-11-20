import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Contatti",
  tag: "Collegamento di corrispondenza IP",
  task: {
    description:
      "Scansione anonima porta a condividere lo stesso indirizzo IP e a collegarli alla stessa persona",
  },
  post: {
    title: "Collegamento di corrispondenza IP",
    titleShort: "Collegamento IP",
    description: "Link anonimo porta che condividono lo stesso indirizzo IP",
    container: {
      title: "Collegamento di corrispondenza IP",
      description:
        "Trova i cavi anonimi con gli IP corrispondenti creati all'interno della finestra del tempo e li collega",
    },
    fields: {
      dryRun: {
        label: "Correre a secco",
        description: "Correre senza apportare modifiche",
      },
      windowDays: {
        label: "Finestra (giorni)",
        description:
          "Solo match lead creati in questo molti giorni l'uno dell'altro",
      },
    },
    response: {
      pairsFound: "Coppie Trovate",
      pairsLinked: "Coppie Linked",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso non consentito",
      },
      server: {
        title: "Errore del server",
        description:
          "Si è verificato un errore durante l'esecuzione di IP match link",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
      },
    },
    success: {
      title: "Collegamento di corrispondenza IP completo",
      description: "IP -conduttori abbinati con successo",
    },
  },
};
