import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Stripe CLI",
  titleShort: "Stripe CLI",
  description: "Ascoltare per Stripe webhooks locally",
  category: "Integrazione dei pagamenti",
  tags: {
    stripe: "Stripe",
    cli: "Linea di comando",
    webhook: "Webhook",
  },

  form: {
    title: "Stripe CLI",
    description: "Avanti eventi webhook Stripe al tuo server locale",
    fields: {
      port: {
        label: "Port",
        description: "Porta locale per inoltrare webhooks a (default: 3000)",
        placeholder: "3000",
      },
    },
  },

  status: {
    authenticated: "Autentico e pronto",
    not_authenticated: "Non autenticata. eseguire «stripe login»",
    not_installed: "Stripe CLI non è installato. {{instructions}}",
  },

  errors: {
    validation: {
      title: "Configurazione non valida",
      description: "Controlla la configurazione Stripe CLI e riprova",
    },
    network: {
      title: "Errore di rete",
      description: "Non è possibile connettersi a Stripe",
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
      title: "Non trovato",
      description: "Stripe CLI non è installato",
    },
    serverError: {
      detail: "Stripe CLI ascoltatore fallito: {{error}}",
      title: "Errore del server",
      description:
        "Si è verificato un errore durante l'esecuzione dell'ascoltatore Stripe",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Si è verificato un errore imprevisto",
    },
    customerRetrievalFailed: {
      detail:
        "Non è possibile caricare il record del cliente Stripe: {{error}} (utente {{userId}})",
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
    execution_failed: "Funzionamento Stripe CLI fallito",
    userNotFound: {
      detail: "Nessun account trovato per l'utente {{userId}}",
      title: "Utente non trovato",
      description: "L'utente specificato non è stato trovato",
    },
    customerCreationFailed: {
      detail:
        "Non è possibile creare il tuo record di clienti Stripe: {{error}} (utente {{userId}})",
      title: "Creazione del cliente non riuscita",
      description: "Non è riuscito a creare il cliente Stripe",
    },
    checkoutCreationFailed: {
      detail: "Non è possibile avviare il checkout: {{error}}",
      title: "Creazione di controllo non riuscita",
      description: "Non è riuscito a creare la sessione di checkout Stripe",
    },
    webhookVerificationFailed: {
      detail: "Non è possibile verificare il webhook Stripe: {{error}}",
      title: "Webhook verifica non riuscita",
      description: "Non è riuscito a verificare la firma webhook",
    },
    subscriptionRetrievalFailed: {
      detail: "Non è possibile caricare l'abbonamento da Stripe: {{error}}",
      title: "Abbonamento Recuperare non corretto",
      description: "Non riuscito a recuperare l'abbonamento da Stripe",
    },
    subscriptionCancellationFailed: {
      detail: "Non è possibile cancellare l'abbonamento: {{error}}",
      title: "Abbonamento Cancellazione Non riuscita",
      description: "Non è possibile annullare l'abbonamento in Stripe",
    },
    priceCreationFailed: {
      detail:
        "Non è possibile creare il prezzo Stripe: {{error}} (prodotto {{productId}})",
      title: "La creazione di prezzo non è riuscita",
      description: "Non creato il prezzo in Stripe",
    },
    notConfigured: {
      title: "Stripe Non configurato",
      description: "Imposta STRIPE_SECRET_KEY nel file .env",
    },
    stripeCliNotInstalled: "Stripe CLI non è installato",
    listenerFailed: "Non ha avviato l'ascoltatore webhook Stripe",
  },

  success: {
    title: "Ascoltatore Iniziato",
    description: "Stripe CLI sta ascoltando per webhooks",
  },
};
