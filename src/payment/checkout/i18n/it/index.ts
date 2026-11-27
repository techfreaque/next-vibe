import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Main checkout titles and descriptions
  title: "Crea il pagamento per l’abbonamento",
  titleShort: "Pagamento",
  description: "Crea una sessione di pagamento Stripe per l’abbonamento",
  category: "Abbonamento",

  // Tags
  tags: {
    subscription: "abbonamento",
    checkout: "checkout",
    stripe: "stripe",
  },

  // Form configuration
  form: {
    title: "Configurazione del pagamento",
    description: "Configura i parametri della sessione di pagamento",
    fields: {
      planId: {
        label: "Piano di abbonamento",
        description: "Selezionare il piano di abbonamento",
        placeholder: "Scegli un piano",
      },
      billingInterval: {
        label: "Frequenza di fatturazione",
        description: "Seleziona la frequenza di fatturazione",
        placeholder: "Scegli la frequenza di fatturazione",
      },
      provider: {
        label: "Servizio di pagamento",
        description: "Scegli come pagare",
        placeholder: "Seleziona il servizio di pagamento",
      },
      metadata: {
        label: "Metadati",
        description: "Metadati aggiuntivi per la sessione di pagamento",
        placeholder: "Inserisci i metadati come JSON",
      },
    },
  },

  // Response fields
  response: {
    success: "Sessione di pagamento creata",
    sessionId: "ID della sessione Stripe",
    checkoutUrl: "URL della pagina di pagamento",
    message: "Messaggio di stato",
  },

  // Error types
  errors: {
    validation: {
      title: "Errore di convalida",
      description: "Parametri della richiesta non validi",
    },
    network: {
      title: "Errore di rete",
      description: "Errore di connessione di rete",
    },
    unauthorized: {
      title: "Autenticazione richiesta",
      description: "Accedi per continuare",
    },
    forbidden: {
      title: "Accesso negato",
      description: "Accesso non consentito",
    },
    notFound: {
      title: "Non trovato",
      description: "Risorsa non trovata",
    },
    serverError: {
      title: "Errore del server",
      description: "Si è verificato un errore interno del server",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Si è verificato un errore sconosciuto",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Hai modifiche non salvate",
    },
    conflict: {
      title: "Conflitto",
      description: "I dati sono in conflitto",
    },
  },

  // Success types
  success: {
    title: "Operazione riuscita",
    description: "Sessione di pagamento creata",
  },

  // POST endpoint specific translations
  post: {
    title: "Crea una sessione di pagamento",
    description: "Crea una nuova sessione di pagamento per l’abbonamento",
    form: {
      title: "Configurazione della sessione di pagamento",
      description: "Configura i parametri della sessione di pagamento",
    },
    response: {
      title: "Risposta della sessione di pagamento",
      description: "Dati restituiti dalla sessione di pagamento",
    },
    errors: {
      alreadySubscribed: {
        detail: "Hai già un abbonamento attivo (utente {{userId}})",
        title: "Abbonamento già attivo",
        description: "Hai già un abbonamento attivo",
      },
      validation: {
        title: "Errore di convalida",
        description: "Parametri di pagamento non validi",
        reason: {
          yearlyNotAvailable:
            "La fatturazione annuale è disponibile solo per il piano {{plan}}. Scegli il pagamento mensile.",
        },
      },
      network: {
        title: "Errore di rete",
        description: "Errore di connessione di rete",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso non consentito",
      },
      notFound: {
        detail: "Nessun account trovato per l'utente {{userId}}",
        title: "Non trovato",
        description: "Sessione di pagamento non trovata",
      },
      server: {
        detail: "Impossibile avviare il pagamento: {{error}}",
        title: "Errore del server",
        description: "Si è verificato un errore interno del server",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto",
        description: "I dati sono in conflitto",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Sessione di pagamento creata",
    },
  },

  // General error message
  error: "Si è verificato un errore durante il pagamento",
  errorDetail: "Pagamento non riuscito: {{error}}",

  // Subscription plan labels
  plans: {
    starter: {
      title: "Starter",
    },
    plus: {
      title: "Plus",
    },
    pro: {
      title: "Pro",
    },
    ultra: {
      title: "Ultra",
    },
  },

  enums: {
    paymentProvider: {
      stripe: "Stripe",
      nowpayments: "NowPayments",
      whop: "Whop",
    },
  },

  // Billing interval labels
  billing: {
    monthly: "Mensile",
    yearly: "Annuale",
  },
  availability: {
    whopCardLabel: "Carta",
    whopCardDescription:
      "Visa, Mastercard e altre. Pagamento sicuro tramite Whop.",
    cardPaused:
      "I pagamenti con carta sono sospesi per ora. Con le criptovalute paghi subito.",
    cardPausedError:
      "I pagamenti con carta sono sospesi per ora. Scegli le criptovalute per completare l'acquisto.",
    nowpaymentsCardLabel: "Carta o criptovalute (NOWPayments)",
    nowpaymentsCardDescription:
      "Visa, Mastercard, Apple Pay, Google Pay oppure Bitcoin, Ethereum e altre",
    cryptoAmountBelowMinimum:
      "Questo importo è sotto il minimo per le criptovalute. Aggiungi un pacchetto o scegli un piano più grande.",
  },
};
