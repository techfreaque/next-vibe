import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  name: "NOWPayments",
  description:
    "Fornitore di pagamento Cryptocurrency con supporto per l'abbonamento",

  cli: {
    post: {
      title: "NOWPayments CLI",
      description: "Gestisci la galleria webhook NOWPayments con ngrok",
      category: "Pagamento",
      tags: {
        nowpayments: "NOWPayments",
        cli: "CLI",
        webhook: "Webhook",
      },
      operations: {
        check: "Verifica",
        install: "Installazione",
        tunnel: "Tunnel",
        status: "Stato",
      },
      form: {
        title: "Operazioni NOWPayments CLI",
        description:
          "Configurare e gestire il tunnel ngrok per i webhook NOWPayments",
        fields: {
          operation: {
            label: "Operazione",
            description: "Selezionare l'operazione per eseguire",
            placeholder: "Scegli un'operazione",
          },
          port: {
            label: "Port",
            description: "Porto locale al tunnel (default: 3000)",
            placeholder: "3000",
          },
        },
      },
      errors: {
        validationFailed: {
          title: "Errore di convalida",
          description: "Funzionamento o parametri non validi",
        },
        networkError: {
          title: "Errore di rete",
          description: "Collegamento di rete fallito",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso negato",
        },
        notFound: {
          title: "Non trovato",
          description: "Risorsa non trovata",
        },
        serverError: {
          title: "Errore del server",
          description: "Non eseguito l'operazione",
        },
        unknownError: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore sconosciuto",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Ci sono cambiamenti non rilevati",
        },
        conflict: {
          title: "Conflitto",
          description: "conflitto di risorse",
        },
      },
      response: {
        title: "Risposta",
        description: "Risultato dell'operazione",
        fields: {
          success: "Operazione riuscita",
          installed: "Installato",
          version: "Version",
          status: "Stato",
          output: "Produzione",
          instructions: "Istruzioni",
          tunnelUrl: "Tunnel URL",
          webhookUrl: "Webhook URL",
        },
      },
      success: {
        title: "Operazione riuscita",
        description: "Operazione completata",
      },
    },
  },

  errors: {
    userNotFound: {
      detail: "Nessun account trovato per l'utente {{userId}}",
      title: "Utente non trovato",
      description: "L'utente specificato non potrebbe essere trovato",
    },
    customerCreationFailed: {
      detail:
        "Non è possibile impostare il record del cliente NOWPayments: {{error}} (utente {{userId}})",
      title: "Creazione del cliente non riuscita",
      description:
        "Non è stato possibile garantire il cliente NOWPayments: {{error}}",
    },
    productNotFound: {
      detail: "Nessun prodotto del genere: {{productId}}",
      title: "Prodotto Non trovato",
      description: "Il prodotto specificato non è stato trovato: {{productId}}",
    },
    userEmailRequired: {
      title: "Email dell'utente richiesto",
      description:
        "L'email dell'utente è richiesta per gli abbonamenti: {{userId}}",
    },
    checkoutCreationFailed: {
      detail: "Non potrebbe avviare il controllo criptografico: {{error}}",
      title: "Creazione di controllo non riuscita",
      description:
        "Non è riuscito a creare la sessione di checkout NOWPayments: {{error}}",
    },
    invoiceCreationFailed: {
      detail: "Non è possibile creare la fattura NOWPayments: {{error}}",
      title: "Creazione di fattura non riuscita",
      description:
        "Non è stato possibile creare la fattura NOWPayments: {{error}}",
    },
    invalidApiKey: {
      detail:
        "Invalid NOWPayments API chiave. Controlla NOWPAYMENTS_API_KEY nel tuo ambiente e conferma la chiave di https://nowpayments.io/app/dashboard",
      title: "Invalid API chiave",
      description:
        "Invalid NOWPayments API chiave. Controlla la configurazione e assicurati di avere una chiave API valida da https://nowpayments.io/app/dashboard",
    },
    planCreationFailed: {
      title: "Creazione di piano fallita",
      description:
        "Non è stato possibile creare un piano di abbonamento NOWPayments: {{error}}",
    },
    subscriptionCreationFailed: {
      title: "Creazione di sottoscrizione non riuscita",
      description:
        "Non è stato possibile creare un abbonamento NOWPayments: {{error}}",
    },
    subscriptionRetrievalFailed: {
      detail: "Non è possibile caricare l'abbonamento NOWPayments: {{error}}",
      title: "Abbonamento Recuperare non corretto",
      description: "Non recuperato l'abbonamento NOWPayments: {{error}}",
    },
    subscriptionCancellationFailed: {
      detail: "Non è possibile cancellare l'abbonamento NOWPayments: {{error}}",
      title: "Abbonamento Cancellazione Non riuscita",
      description:
        "Non è stato possibile cancellare l'abbonamento NOWPayments: {{error}}",
    },
    subscriptionListFailed: {
      detail: "Non è possibile elencare gli abbonamenti NOWPayments: {{error}}",
      title: "Elenco Abbonamento non corretto",
      description: "Non elencato gli abbonamenti NOWPayments: {{error}}",
    },
    notConfigured: {
      title: "NOWPayments Non configurato",
      description:
        "NOWPayments non è configurato. Imposta NOWPAYMENTS_API_KEY e NOWPAYMENTS_IPN_SECRET nel file .env",
    },
    webhookVerificationFailed: {
      detail: "Non è possibile verificare il webhook NOWPayments: {{error}}",
      invalidSignature: "Webhook firma non corrisponde",
      title: "Webhook verifica non riuscita",
      description: "Non verificata la firma webhook NOWPayments: {{error}}",
    },
    paymentStatusFailed: {
      detail:
        "Non è possibile leggere lo stato di pagamento da NOWPayments: {{error}}",
      title: "Stato di pagamento Recuperare non corretto",
      description:
        "Non recuperato lo stato di pagamento da NOWPayments: {{error}}",
    },
  },

  success: {
    invoiceCreated: {
      title: "Fattura Creata",
      description: "fattura NOWPayments creata con successo",
    },
    webhookVerified: {
      title: "Webhook verificato",
      description: "NOWPayments webhook verificato con successo",
    },
    paymentStatusRetrieved: {
      title: "Stato di pagamento recuperato",
      description: "Stato di pagamento NOWPayments recuperato con successo",
    },
  },
};
