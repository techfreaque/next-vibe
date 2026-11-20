import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Utenti",
  title: "Reimpostare la richiesta di password",
  description: "Richiedi il ripristino della password",
  tag: "Ripristino della password",
  ui: {
    title: "Reimposta la password",
    subtitle:
      "Inserisci il tuo indirizzo e-mail e ti invieremo un link per ripristinare la password",
    sendResetLink: "Inviare Reset Link",
    alreadyHaveAccount: "Hai già un account? Accedi",
  },
  actions: {
    submitting: "Invio in corso…",
  },
  email: {
    title: "Ripristina la tua password di {{appName}}",
    subject: "Richiesta di ripristino della password di {{appName}}",
    previewText:
      "Ripristina la tua password di {{appName}}. Il link è valido per {{hours}} ore.",
    greeting: "Ciao {{name}},",
    requestInfo:
      "Abbiamo ricevuto una richiesta di ripristino della password per il tuo account {{appName}}. Se l’hai inviata tu, usa il pulsante qui sotto.",
    buttonText: "Ripristina la mia password",
    expirationInfo:
      "Il link scade tra {{hours}} ore. Se non hai inviato tu la richiesta, ignora questa email. La tua password resta la stessa.",
    signoff: "Il team di {{appName}}",
    promoText: "{{modelCount}} modelli di IA. Zero filtri. Zero prediche.",
  },
  groups: {
    emailInput: {
      title: "Indirizzo email",
      description:
        "Inserisci il tuo indirizzo e-mail per ricevere le istruzioni di reset",
    },
  },
  fields: {
    email: {
      label: "Indirizzo email",
      description: "Inserisci il tuo indirizzo email",
      placeholder: "your@email.com",
      help: "Inserisci l'indirizzo email associato al tuo account",
      validation: {
        invalid: "Si prega di inserire un indirizzo email valido",
      },
    },
  },
  response: {
    title: "Reimpostare la risposta richiesta",
    description: "Risposta della richiesta di ripristino della password",
    success: {
      message: "Link di ripristino inviato",
    },
    deliveryInfo: {
      estimatedTime: "entro 5 minuti",
      expiresAt: "4 ore da ora",
    },
    nextSteps: {
      checkEmail: "Controlla la cartella posta e-mail e spam",
      clickLink: "Fare clic sul link di reset nell'e-mail",
      createPassword: "Creare una nuova password sicura",
    },
  },
  errors: {
    title: "Errore",
    validation: {
      title: "Errore di convalida",
      description: "Input non valido fornito",
    },
    unauthorized: {
      title: "Autenticazione richiesta",
      description: "Richiesta non autorizzata",
    },
    internal: {
      title: "Errore interno",
      description: "Errore del server interno",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Si è verificato un errore sconosciuto",
    },
    network: {
      title: "Errore di rete",
      description: "Errore di connessione di rete",
    },
    forbidden: {
      title: "Accesso negato",
      description: "Accesso non consentito",
    },
    notFound: {
      title: "Non trovato",
      description: "Risorsa non trovata",
    },
    unsaved: {
      title: "Modifiche non salvate",
      description: "Le modifiche non sono state salvate",
    },
    conflict: {
      title: "Conflitto",
      description: "I dati sono in conflitto",
    },
    no_email: "Nessun account trovato per {{email}}",
    email_generation_failed:
      "Non potrebbe costruire l'e-mail di reset per {{email}}: {{errorMessage}}",
  },
  success: {
    title: "Richiesta inviata",
    description: "Richiesta di ripristino della password inviata",
  },
  post: {
    title: "Richiesta",
    description: "Richiedi il punto finale",
    form: {
      title: "Richiesta di configurazione",
      description: "Configurare i parametri di richiesta",
    },
    response: {
      title: "Risposta",
      description: "Richiedi i dati di risposta",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
      },
      server: {
        title: "Errore del server",
        description: "Si è verificato un errore interno del server",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso non consentito",
      },
      notFound: {
        title: "Non trovato",
        description: "Risorsa non trovata",
      },
      conflict: {
        title: "Conflitto",
        description: "I dati sono in conflitto",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Operazione completata",
    },
  },
  emailTemplates: {
    request: {
      name: "Email con il link per ripristinare la password",
      description:
        "Email inviata agli utenti con un link per ripristinare la password",
      category: "Autenticazione",
      preview: {
        publicName: {
          label: "Nome pubblico",
          description: "Il nome del display pubblico dell'utente",
        },
        userId: {
          label: "Utente ID",
          description: "L'identificatore unico dell'utente",
        },
        passwordResetUrl: {
          label: "Password Reset URL",
          description: "URL per il ripristino della password",
        },
      },
    },
  },
};
