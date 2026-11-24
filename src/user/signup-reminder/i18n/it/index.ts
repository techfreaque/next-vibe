import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Utenti",

  post: {
    title: "Promemoria registrazione",
    titleShort: "Promemoria registrazione",
    description:
      "Invia un promemoria a chi ha iniziato la registrazione senza mai confermare l’email. Il promemoria contiene un nuovo codice e un link valido 24 ore.",
    tag: "Promemoria registrazione",
    container: {
      title: "Promemoria registrazione",
      description:
        "Registrazioni in sospeso, ultima email da 2 a 24 ore fa, mai confermate",
    },
    fields: {
      batchSize: {
        label: "Dimensione lotto",
        description: "Numero massimo di promemoria per esecuzione",
      },
      dryRun: {
        label: "Prova",
        description: "Conta chi riceverebbe un promemoria senza inviare",
      },
    },
    response: {
      candidates: "Registrazioni non confermate nella finestra",
      sent: "Promemoria inviati",
      skipped: "Saltati",
      failed: "Falliti",
    },
    errors: {
      unauthorized: {
        title: "Non autorizzato",
        description: "Solo un admin può inviare promemoria di registrazione",
      },
      forbidden: {
        title: "Vietato",
        description: "Accesso negato",
      },
      server: {
        title: "Errore del server",
        description: "Invio dei promemoria di registrazione non riuscito",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      validation: {
        title: "Errore di validazione",
        description: "Impostazioni non valide",
      },
    },
    success: {
      title: "Promemoria elaborati",
      description: "Promemoria di registrazione elaborati",
    },
  },
  task: {
    name: "Promemoria di registrazione",
    description:
      "Ogni 30 minuti: un promemoria alle registrazioni ancora non confermate 2 ore dopo l’ultima email",
  },
};
