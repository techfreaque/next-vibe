import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Import sub-domain translations
  checkout: {
    // Main checkout titles and descriptions
    title: "Crea il pagamento per l’abbonamento",
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
          title: "Abbonamento già attivo",
          description: "Hai già un abbonamento attivo",
        },
        validation: {
          title: "Errore di convalida",
          description: "Parametri di pagamento non validi",
          reason: {
            enterpriseCustomPricing:
              "Il piano ENTERPRISE richiede prezzi personalizzati",
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
          title: "Non trovato",
          description: "Sessione di pagamento non trovata",
        },
        server: {
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

    // Subscription plan labels
    plans: {
      starter: {
        title: "Starter",
      },
    },

    // Billing interval labels
    billing: {
      monthly: "Mensile",
      yearly: "Annuale",
    },
  },
  invoice: {
    category: "Fatturazione",
    tags: {
      payment: "pagamento",
      invoice: "fattura",
      transactions: "transazioni",
    },
    defaultItem: "Votazioni",
    success: {
      created: "Fattura creata con successo",
    },
    post: {
      title: "Fatturato",
      description: "Punto di riferimento della fattura",
      form: {
        title: "Configurazione delle fatture",
        description: "Configurare i parametri di fattura",
      },
      response: {
        success: "Fattura creata con successo",
        message: "Messaggio di stato",
        invoice: {
          title: "Dettagli della fattura",
          description: "Informazioni sulle fatture generate",
          id: "Fatturazione ID",
          userId: "Utente ID",
          stripeInvoiceId: "Stripe Fatturazione ID",
          invoiceNumber: "Numero di fatturazione",
          amount: "Importo",
          currency: "Valuta",
          status: "Stato",
          invoiceUrl: "Fatturazione URL",
          invoicePdf: "Fatturazione PDF",
          dueDate: "Data di scadenza",
          paidAt: "Pagato a",
          createdAt: "Creato a",
          updatedAt: "Aggiornato At",
        },
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
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Ci sono cambiamenti non rilevati",
        },
      },
      success: {
        title: "Operazione riuscita",
        description: "Operazione completata",
      },
      widget: {
        back: "Indietro",
      },
    },
    customerId: {
      label: "Cliente ID",
      description: "ID utente Stripe",
      placeholder: "Inserisci il cliente ID",
    },
    amount: {
      label: "Importo",
      description: "Importo della fattura",
      placeholder: "Inserisci l'importo",
    },
    currency: {
      label: "Valuta",
      description: "Codice valutario",
      placeholder: "Seleziona la valuta",
      usd: "Dollaro US (USD)",
      eur: "Euro (EUR)",
      pln: "Zloty polacco (PLN)",
    },
    description: {
      label: "Designazione",
      description: "Descrizione della fattura",
      placeholder: "Inserisci la descrizione",
    },
    dueDate: {
      label: "Data di scadenza",
      description: "Data di pagamento",
      placeholder: "Selezionare la data",
    },
    metadata: {
      label: "Metadati",
      description: "Altri metadati",
      placeholder: "Inserisci i metadati come JSON",
    },
  },
  portal: {
    success: {
      created: "Sessione del portale clienti creata con successo",
    },
    post: {
      title: "Portale clienti",
      description:
        "Crea sessione del portale clienti per la gestione delle fatture",
      form: {
        title: "Configurazione del portale",
        description: "Configurare i parametri del portale clienti",
      },
      returnUrl: {
        label: "Ritorno URL",
        description: "URL per reindirizzare dopo la sessione del portale",
        placeholder: "https://example.com/dashboard",
      },
      response: {
        success: "Sessione del portale creata con successo",
        message: "Messaggio di stato",
        customerPortalUrl: "Portale clienti URL",
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
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Ci sono cambiamenti non rilevati",
        },
      },
      success: {
        title: "Operazione riuscita",
        description: "Operazione completata",
      },
    },
  },
  refund: {
    title: "Rimborso di processo",
    description: "Elaborare un rimborso per una transazione di pagamento",
    category: "Rimborsi di pagamento",

    tags: {
      refund: "rimborso",
      transaction: "transazione",
    },

    success: {
      created: "Rimborso effettuato con successo",
    },

    reason: {
      requestedByCustomer: "Richiesta da parte del cliente",
    },

    form: {
      title: "Modulo di rimborso",
      description: "Inserisci i dettagli del rimborso",
      fields: {
        transactionId: {
          label: "Transazione ID",
          description: "ID della transazione al rimborso",
          placeholder: "Inserisci la transazione ID",
        },
        amount: {
          label: "Importo del rimborso",
          description:
            "Importo al rimborso (opzionale, predefiniti per l'intero importo)",
          placeholder: "Inserisci l'importo",
        },
        reason: {
          label: "Ragione di rimborso",
          description: "Motivo del rimborso",
          placeholder: "Inserisci il motivo",
        },
        metadata: {
          label: "Metadati",
          description: "Altri metadati di rimborso",
          placeholder: "Inserisci i metadati come JSON",
        },
      },
    },

    post: {
      title: "Rimborso di processo",
      description: "Elaborare un rimborso di pagamento",
      response: {
        success: "Rimborso effettuato con successo",
        message: "Messaggio di stato",
        refund: {
          title: "Dettagli di rimborso",
          description: "Informazioni di rimborso processate",
          id: "Rimborso ID",
          userId: "Utente ID",
          transactionId: "Transazione ID",
          stripeRefundId: "Stripe Rimborso ID",
          amount: "Importo del rimborso",
          currency: "Valuta",
          status: "Stato di rimborso",
          reason: "Ragione di rimborso",
          createdAt: "Creato a",
          updatedAt: "Aggiornato At",
        },
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Parametri di rimborso non validi",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Permesso negato",
        },
        notFound: {
          title: "Non trovato",
          description: "Transazione non trovata",
        },
        server: {
          title: "Errore del server",
          description: "Si è verificato un errore interno del server",
        },
        network: {
          title: "Errore di rete",
          description: "Errore di connessione di rete",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        conflict: {
          title: "Conflitto",
          description: "Rimborso del conflitto rilevato",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Ci sono cambiamenti non rilevati",
        },
      },
      success: {
        title: "Operazione riuscita",
        description: "Rimborso effettuato con successo",
      },
    },
  },
  providers: {
    stripe: {
      title: "Integrazione Stripe CLI",
      description: "Gestire le operazioni Stripe CLI e l'ascolto webhook",
      category: "Integrazione dei pagamenti",
      tags: {
        stripe: "Stripe",
        cli: "Linea di comando",
        webhook: "Webhook",
      },

      operations: {
        check: "Controllare l'installazione",
        install: "Installare Stripe CLI",
        listen: "Avviare Webhook Ascoltatore",
        login: "Accedi a Stripe",
        status: "Controllare lo stato",
      },

      form: {
        title: "Configurazione Stripe CLI",
        description:
          "Configurare le operazioni Stripe CLI e le impostazioni webhook",
        fields: {
          operation: {
            label: "Tipo di operazione",
            description: "Selezionare l'operazione Stripe CLI per eseguire",
            placeholder: "Scegli un'operazione...",
          },
          port: {
            label: "Numero della porta",
            description: "Numero di porta per inoltro webhook (1000-65535)",
            placeholder: "4242",
          },
          events: {
            label: "Webhook Eventi",
            description: "Selezionare eventi Stripe per ascoltare",
            placeholder: "Seleziona gli eventi per monitorare...",
            paymentIntentSucceeded: "Pagamento Intentato Acceso",
            paymentIntentFailed: "Pagamento Intento non riuscito",
            subscriptionCreated: "Abbonamento attivato",
            subscriptionUpdated: "Abbonamento Aggiornato",
            invoicePaymentSucceeded: "Pagamento Fatturato Successo",
            invoicePaymentFailed: "Pagamento in fattura non corretto",
          },
          forwardTo: {
            label: "Avanti a URL",
            description: "endpoint locale per inoltrare eventi webhook",
            placeholder: "localhost:3000/api/webhooks/stripe",
          },
          skipSslVerify: {
            label: "Skip SSL Verificazione",
            description: "Salta verifica del certificato SSL per lo sviluppo",
          },
        },
      },

      response: {
        success: "Operazione completata",
        installed: "stato di installazione Stripe CLI",
        version: "Versione Stripe CLI installata",
        status: "Stato attuale delle operazioni",
        output: "Uscita di comando e logs",
        instructions: "Prossimo passo e istruzioni",
        webhookEndpoint: "Webhook endpoint URL",
      },

      login: {
        instructions:
          "Per autenticarsi con Stripe, eseguire 'stripe login' nel terminale e seguire le istruzioni per collegare il tuo account Stripe.",
      },

      status: {
        authenticated: "Autentico e pronto",
        not_authenticated: "Non autenticato - eseguire 'stripe login'",
        not_installed: "Stripe CLI non è installato",
      },

      errors: {
        validation: {
          title: "Configurazione non valida",
          description: "Controlla la configurazione Stripe CLI e riprova",
        },
        network: {
          title: "Errore di rete",
          description: "Incapace di connettersi ai servizi Stripe",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Non hai il permesso di eseguire questa operazione",
        },
        forbidden: {
          title: "Accesso Proibito",
          description: "Questa operazione non è consentita per il tuo account",
        },
        notFound: {
          title: "Risorse non trovata",
          description: "La risorsa Stripe richiesta non è stata trovata",
        },
        serverError: {
          title: "Errore del server",
          description:
            "Si è verificato un errore durante l'elaborazione dell'operazione Stripe",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Un errore inaspettato si è verificato con Stripe CLI",
        },
        customerRetrievalFailed: {
          title: "Ritiro del cliente non riuscito",
          description:
            "Non riuscito a recuperare le informazioni del cliente Stripe",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai delle modifiche di configurazione non salvate",
        },
        conflict: {
          title: "Operazione Conflitto",
          description: "Un'altra operazione Stripe è attualmente in corso",
        },
        execution_failed:
          "L'operazione Stripe CLI non è riuscita a eseguire correttamente",
        userNotFound: {
          title: "Utente non trovato",
          description: "L'utente specificato non è stato trovato",
        },
        customerCreationFailed: {
          title: "Creazione del cliente non riuscita",
          description: "Non è riuscito a creare il cliente Stripe",
        },
        checkoutCreationFailed: {
          title: "Creazione di controllo non riuscita",
          description: "Non è riuscito a creare la sessione di checkout Stripe",
        },
        webhookVerificationFailed: {
          title: "Webhook verifica non riuscita",
          description: "Non è riuscito a verificare la firma webhook",
        },
        subscriptionRetrievalFailed: {
          title: "Abbonamento Recuperare non corretto",
          description: "Non riuscito a recuperare l'abbonamento da Stripe",
        },
        subscriptionCancellationFailed: {
          title: "Abbonamento Cancellazione Non riuscita",
          description: "Non è possibile annullare l'abbonamento in Stripe",
        },
        priceCreationFailed: {
          title: "La creazione di prezzo non è riuscita",
          description: "Non creato il prezzo in Stripe",
        },
        notConfigured: {
          title: "Stripe Non configurato",
          description:
            "Stripe non è configurato. Imposta STRIPE_SECRET_KEY nel file .env",
        },
        stripeCliNotInstalled: "Stripe CLI non è installato",
        listenerFailed: "Non ha avviato l'ascoltatore webhook Stripe",
      },

      success: {
        title: "Operazione Successo",
        description: "Funzionamento Stripe CLI completato con successo",
      },

      installInstructions: {
        documentation:
          "Si prega di installare Stripe CLI seguendo la documentazione ufficiale: https://docs.stripe.com/stripe-cli",
        quickInstallation: "Opzioni di installazione rapide:",
        macOS: {
          title: "macOS (utilizzando Homebrew):",
          command: "brew install stripe/stripe-cli/stripe",
        },
        linux: {
          title: "Linux (utilizzando il gestore dei pacchetti):",
          debian: {
            title: "Debian/Ubuntu",
          },
          fedora: {
            title: "CentOS/RHEL/Fedora",
          },
        },
        windows: {
          title: "Finestre:",
          scoop: {
            title: "Utilizzo di Scoop",
          },
          github: {
            title: "Oppure scarica direttamente da GitHub rilascia:",
            url: "https://github.com/stripe/stripe-cli/releases",
          },
        },
        authentication: {
          title: "Dopo l'installazione, autenticare con:",
          command: "stripe login",
        },
      },
    },
    nowpayments: {
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
          title: "Utente non trovato",
          description: "L'utente specificato non potrebbe essere trovato",
        },
        customerCreationFailed: {
          title: "Creazione del cliente non riuscita",
          description:
            "Non è stato possibile garantire il cliente NOWPayments: {error}",
        },
        productNotFound: {
          title: "Prodotto Non trovato",
          description:
            "Il prodotto specificato non è stato trovato: {productId}",
        },
        userEmailRequired: {
          title: "Email dell'utente richiesto",
          description:
            "L'email dell'utente è richiesta per gli abbonamenti: {userId}",
        },
        checkoutCreationFailed: {
          title: "Creazione di controllo non riuscita",
          description:
            "Non è riuscito a creare la sessione di checkout NOWPayments: {error}",
        },
        invoiceCreationFailed: {
          title: "Creazione di fattura non riuscita",
          description:
            "Non è stato possibile creare la fattura NOWPayments: {error}",
        },
        invalidApiKey: {
          title: "Invalid API chiave",
          description:
            "Invalid NOWPayments API chiave. Controlla la configurazione e assicurati di avere una chiave API valida da https://nowpayments.io/app/dashboard",
        },
        planCreationFailed: {
          title: "Creazione di piano fallita",
          description:
            "Non è stato possibile creare un piano di abbonamento NOWPayments: {error}",
        },
        subscriptionCreationFailed: {
          title: "Creazione di sottoscrizione non riuscita",
          description:
            "Non è stato possibile creare un abbonamento NOWPayments: {error}",
        },
        subscriptionRetrievalFailed: {
          title: "Abbonamento Recuperare non corretto",
          description: "Non recuperato l'abbonamento NOWPayments: {error}",
        },
        subscriptionCancellationFailed: {
          title: "Abbonamento Cancellazione Non riuscita",
          description:
            "Non è stato possibile cancellare l'abbonamento NOWPayments: {error}",
        },
        subscriptionListFailed: {
          title: "Elenco Abbonamento non corretto",
          description: "Non elencato gli abbonamenti NOWPayments: {error}",
        },
        notConfigured: {
          title: "NOWPayments Non configurato",
          description:
            "NOWPayments non è configurato. Imposta NOWPAYMENTS_API_KEY e NOWPAYMENTS_IPN_SECRET nel file .env",
        },
        webhookVerificationFailed: {
          title: "Webhook verifica non riuscita",
          description: "Non verificata la firma webhook NOWPayments: {error}",
        },
        paymentStatusFailed: {
          title: "Stato di pagamento Recuperare non corretto",
          description:
            "Non recuperato lo stato di pagamento da NOWPayments: {error}",
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
    },
  },

  // Main payment domain
  category: "Fatturazione",

  // Main form configuration
  form: {
    title: "Configurazione dei pagamenti",
    description: "Configurare i parametri di pagamento",
  },

  // Tags
  tags: {
    payment: "pagamento",
    stripe: "stripe",
    checkout: "checkout",
    list: "elenco",
    transactions: "transazioni",
    info: "info info",
  },

  // Create payment endpoint
  create: {
    title: "Creare la sessione di pagamento",
    titleShort: "Crea sessione",
    description: "Creare una nuova sessione di pagamento con Stripe",
    form: {
      title: "Configurazione dei pagamenti",
      description: "Configurare i parametri di sessione di pagamento",
    },
    paymentMethodTypes: {
      label: "Metodi di pagamento",
      description: "Selezionare i metodi di pagamento accettati",
    },
    successUrl: {
      label: "Successo URL",
      description: "URL per reindirizzare dopo il pagamento di successo",
      placeholder: "https://example.com/success",
    },
    cancelUrl: {
      label: "Annullamento URL",
      description: "URL per reindirizzare se il pagamento viene annullato",
      placeholder: "https://example.com/cancel",
    },
    customerEmail: {
      label: "Email del cliente",
      description: "Indirizzo email del cliente per il pagamento",
      placeholder: "customer@example.com",
    },
    response: {
      success: "Sessione di pagamento creata con successo",
      sessionId: "ID della sessione Stripe",
      sessionUrl: "sessione Stripe URL",
      checkoutUrl: "URL della pagina di pagamento",
      message: "Messaggio di stato",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri di pagamento non validi",
      },
      internal: {
        title: "Errore interno",
        description: "Si è verificato un errore interno",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Permesso negato",
      },
      notFound: {
        detail: "Nessun account trovato per l'utente {{userId}}",
        title: "Non trovato",
        description: "Sessione di pagamento non trovata",
      },
      server: {
        detail: "Non è possibile creare la sessione di pagamento: {{error}}",
        stripeNotConfigured:
          "Stripe non e' ancora stato impostato. Aggiungi STRIPE_SECRET_KEY al tuo ambiente.",
        title: "Errore del server",
        description: "Si è verificato un errore interno del server",
      },
      network: {
        title: "Errore di rete",
        description: "Errore di connessione di rete",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
      conflict: {
        title: "Conflitto",
        description: "Rilevamento del conflitto di pagamento",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Sessione di pagamento creata con successo",
      message: "Sessione di pagamento creata con successo",
    },
  },

  // Get payment endpoint
  get: {
    title: "Ottieni informazioni di pagamento",
    titleShort: "Pagamenti",
    description: "Recuperare le transazioni e i metodi di pagamento",
    form: {
      title: "Pagamento Query",
      description: "Informazioni sul pagamento",
    },
    response: {
      success: "Dati di pagamento recuperati con successo",
      sessionUrl: "Sessione di pagamento URL",
      sessionId: "Sessione di pagamento ID",
      message: "Messaggio di stato",
      transactions: "Operazioni di pagamento",
      paymentMethods: "Metodi di pagamento",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri di query non validi",
      },
      internal: {
        title: "Errore interno",
        description: "Si è verificato un errore interno",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Permesso negato",
      },
      notFound: {
        title: "Non trovato",
        description: "Informazioni di pagamento non trovate",
      },
      server: {
        detail:
          "Non è possibile caricare le informazioni di pagamento: {{error}}",
        title: "Errore del server",
        description: "Si è verificato un errore interno del server",
      },
      network: {
        title: "Errore di rete",
        description: "Errore di connessione di rete",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
      conflict: {
        title: "Conflitto",
        description: "Rilevamento del conflitto di pagamento",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Informazioni di pagamento recuperate con successo",
    },
  },

  // Top-level error handling
  errors: {
    validation: {
      title: "Errore di convalida",
      description: "Parametri di pagamento non validi",
    },
    notFound: {
      title: "Non trovato",
      description: "Pagamento non trovato",
    },
    unauthorized: {
      signInRequired: "Accedi per gestire i pagamenti",
      title: "Autenticazione richiesta",
      description: "Accedi per continuare",
    },
    forbidden: {
      title: "Accesso negato",
      description: "Permesso negato",
    },
    server: {
      detail: "Pagamento webhook non potrebbe essere elaborato: {{error}}",
      title: "Errore del server",
      description: "Si è verificato un errore interno del server",
    },
    network: {
      title: "Errore di rete",
      description: "Errore di connessione di rete",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Si è verificato un errore imprevisto",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Ci sono cambiamenti non rilevati",
    },
    conflict: {
      title: "Conflitto",
      description: "Rilevamento del conflitto di pagamento",
    },
    notImplemented: {
      title: "Non implementato",
      description:
        "Questa funzione del fornitore di pagamento non è ancora stata implementata",
    },
    customerCreationFailed: "Non è riuscito a creare il cliente Stripe",
    customerNotFound: "cliente Stripe non trovato",
    localMode: "Il pagamento è disabilitato in modalità di sviluppo locale.",
    webhookVerificationFailed:
      "La verifica della firma di Webhook è fallita: {{error}}",
  },

  // Top-level success
  success: {
    title: "Operazione riuscita",
    description: "Operazione completata",
    sessionCreated: "Sessione di pagamento creata con successo",
    infoRetrieved: "Informazioni di pagamento recuperate con successo",
  },

  // Field labels and descriptions
  amount: {
    label: "Importo",
    description: "Importo di pagamento nella valuta specificata",
    placeholder: "Inserisci l'importo",
  },
  currency: {
    label: "Valuta",
    description: "Moneta di pagamento",
    placeholder: "Seleziona la valuta",
    usd: "Dollaro US (USD)",
    eur: "Euro (EUR)",
    pln: "Zloty polacco (PLN)",
  },
  mode: {
    label: "Modalità di pagamento",
    description: "Tipo di sessione di pagamento",
    placeholder: "Selezionare la modalità di pagamento",
  },
  successUrl: {
    label: "Successo URL",
    description: "URL per reindirizzare dopo il pagamento di successo",
    placeholder: "https://example.com/success",
  },
  cancelUrl: {
    label: "Annullamento URL",
    description: "URL per reindirizzare se il pagamento viene annullato",
    placeholder: "https://example.com/cancel",
  },
  metadata: {
    label: "Metadati",
    description: "Altri metadati per la sessione di pagamento",
    placeholder: "Inserisci i metadati come JSON",
  },
  paymentId: {
    label: "Pagamento ID",
    description: "Pagamento specifico ID per recuperare",
    placeholder: "Inserisci il pagamento ID",
  },
  sessionId: {
    label: "Sessione ID",
    description: "Stripe sessione ID per query",
    placeholder: "Inserisci sessione ID",
  },
  limit: {
    label: "Limite",
    description: "Numero massimo di risultati da restituire",
    placeholder: "20",
  },
  offset: {
    label: "Offset",
    description: "Numero di risultati per saltare",
    placeholder: "0",
  },
  priceId: {
    label: "Prezzo ID",
    description: "Identificatore di prezzo Stripe per il prodotto",
    placeholder: "price_1234567890",
  },
  provider: {
    label: "Servizio di pagamento",
    description: "Scegli il tuo metodo di pagamento",
    placeholder: "Seleziona il servizio di pagamento",
  },

  // Enum translations
  enums: {
    paymentProvider: {
      stripe: "Stripe",
      nowpayments: "NOWPayments",
    },
    paymentStatus: {
      pending: "Finanziamenti",
      processing: "Lavorazione",
      succeeded: "Accadenze",
      failed: "Sfigato",
      canceled: "Annullamento",
      refunded: "Rimborso",
    },
    paymentMethodType: {
      card: "Carta di credito/debito",
      bankTransfer: "Bonifico bancario",
      paypal: "PayPal",
      applePay: "Apple Pay",
      googlePay: "Google Pay",
      sepaDebit: "Debito diretto SEPA",
    },
    paymentIntentStatus: {
      requiresPaymentMethod: "Richiede il metodo di pagamento",
      requiresConfirmation: "Richiede conferma",
      requiresAction: "Richiede Azione",
      processing: "Lavorazione",
      requiresCapture: "Richiede la cattura",
      canceled: "Annullamento",
      succeeded: "Accadenze",
    },
    checkoutMode: {
      payment: "Pagamento",
      subscription: "Abbonamento",
      setup: "Configurazione iniziale",
    },
    refundStatus: {
      pending: "Finanziamenti",
      succeeded: "Accadenze",
      failed: "Sfigato",
      canceled: "Annullamento",
    },
    disputeStatus: {
      warningNeedsResponse: "Avvertenza - ha bisogno di risposta",
      warningUnderReview: "Avvertenza - Sotto Recensione",
      warningClosed: "Avvertenza - Chiuso",
      needsResponse: "Necessità di risposta",
      underReview: "In base alla recensione",
      chargeRefunded: "Rimborso di oneri",
      won: "Voce",
      lost: "Perdita",
    },
    invoiceStatus: {
      draft: "Progetto",
      open: "Aperto",
      paid: "Pagato",
      void: "Void",
      uncollectible: "Incoltoso",
    },
    taxStatus: {
      complete: "Completato",
      failed: "Sfigato",
      requiresLocation: "Requires Location",
    },
    paymentInterval: {
      month: "Mensile",
      year: "Annuale",
      one_time: "Una volta sola.",
    },
    manualPaymentMethod: {
      cash: "Contanti",
      bankTransfer: "Bonifico bancario",
      other: "Altro",
    },
    billStatus: {
      DRAFT: "Progetto",
      RECEIVED: "Ricevuto.",
      APPROVED: "Approvazione",
      PAID: "Pagato",
      DISPUTED: "Disputato",
    },
    estimateStatus: {
      DRAFT: "Progetto",
      SENT: "Inviato",
      ACCEPTED: "Accettato",
      DECLINED: "Declinato",
      EXPIRED: "Scadenza",
      CONVERTED: "Convertito",
    },
  },
};
