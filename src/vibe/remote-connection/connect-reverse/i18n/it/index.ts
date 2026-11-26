import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Account",
  tags: {
    remoteConnection: "Connessione remota",
  },
  post: {
    title: "Registrazione del sito",
    titleShort: "Istituzione",
    description:
      "Chiamato da un'istanza locale durante il flusso di connessione per registrarsi sul cloud",
    instanceId: {
      label: "Nome dell'istanza",
      description: "L'identificatore unico dell'istanza locale",
      placeholder: "hermes",
      validation: {
        invalid: "Utilizzare solo lettere minuscole, numeri e trattini",
      },
    },
    localUrl: {
      label: "Locale locale URL",
      description: "L'app URL dell'istanza locale",
      placeholder: "http://localhost:3000",
      validation: {
        required: "Inserisci il locale URL",
        invalid: "Si prega di inserire un URL valido",
      },
    },
    reverseToken: {
      label: "Token inverso",
      description:
        "Token JWT per il telecomando per autenticare nuovamente a questo caso",
    },
    reverseLeadId: {
      label: "Guida inversa ID",
      description: "Contatto ID per la connessione inversa",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Si prega di controllare i dettagli e riprovare",
      },
      network: {
        title: "Errore di rete",
        description: "Impossibile connettersi al server",
      },
      unauthorized: {
        title: "Non è stato registrato",
        description: "Devi essere connesso per registrare un'istanza",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di registrare un'istanza",
      },
      notFound: {
        title: "Non trovato",
        description: "Risorsa non trovata",
      },
      server: {
        title: "Errore del server",
        description:
          "Si è verificato un errore durante la registrazione dell'istanza",
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
        title: "istanza ID Già registrato",
        description:
          "Un'istanza con questo ID è già registrata per il tuo account. Scegliere un'istanza diversa ID.",
      },
    },
    success: {
      title: "Iscritto",
      description: "L'istanza locale è stata registrata con successo",
    },
  },
};
