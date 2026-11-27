import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Import checkout translations
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
          description: "Scegli il tuo piano",
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

  // Main subscription domain
  category: "Fatturazione",

  // Tags
  tags: {
    subscription: "abbonamento",
    billing: "fatturazione",
    get: "- No.",
    create: "creare",
    update: "aggiornamento",
    cancel: "Cancellazione",
  },

  // Subscription plans
  plans: {
    starter: {
      title: "Piano di avvio",
    },
    professional: {
      title: "Piano professionale",
    },
    premium: {
      title: "Piano Premium",
    },
    enterprise: {
      title: "Piano d'imprese",
    },
  },

  // Billing intervals
  billing: {
    monthly: "Mensile",
    yearly: "Annuale",
  },

  // GET endpoint
  get: {
    title: "Abbonamento",
    titleShort: "Il mio abbonamento",
    description: "Recuperare i dettagli dell'abbonamento corrente",
    form: {
      title: "Dettagli dell’abbonamento",
      description:
        "Visualizza le informazioni relative all'abbonamento corrente",
    },
  },

  // POST endpoint
  post: {
    title: "Crea abbonamento",
    titleShort: "Abbonati",
    description: "Creare un nuovo abbonamento",
    form: {
      title: "Creazione dell'abbonamento",
      description: "Creare un nuovo abbonamento con il piano selezionato",
    },
    errors: {
      validation: {
        title: "Input non valido",
        description: "Controlla i dati dell'abbonamento e riprova",
      },
      network: {
        title: "Errore di connessione",
        description:
          "Connessione assente. Controlla la tua connessione a Internet",
      },
      unauthorized: {
        title: "Accedi per continuare",
        description: "Accedi per abbonarti",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di creare un abbonamento",
      },
      notFound: {
        title: "Piano non trovato",
        description: "Il piano di abbonamento selezionato non è stato trovato",
      },
      server: {
        title: "Qualcosa è andato storto",
        description: "Non siamo riusciti a creare il tuo abbonamento. Riprova.",
      },
      unknown: {
        title: "Errore imprevisto",
        description: "Qualcosa è andato storto. Riprova.",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Abbonamento già attivo",
        description: "Hai già un abbonamento attivo",
      },
    },
    success: {
      title: "Abbonamento attivato",
      description: "Il tuo abbonamento è attivo",
    },
  },

  // PUT endpoint
  put: {
    title: "Aggiorna l’abbonamento",
    titleShort: "Cambia piano",
    description: "Aggiornare l'abbonamento esistente",
    form: {
      title: "Aggiornamento dell'abbonamento",
      description:
        "Aggiorna il piano di abbonamento o l'intervallo di fatturazione",
    },
    errors: {
      validation: {
        title: "Aggiornamento non valido",
        description: "Controlla le modifiche e riprova",
      },
      network: {
        title: "Errore di connessione",
        description: "Non siamo riusciti a salvare le modifiche. Riprova.",
      },
      unauthorized: {
        title: "Accedi per continuare",
        description: "Accedi per modificare il tuo abbonamento",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di aggiornare questo abbonamento",
      },
      notFound: {
        title: "Abbonamento non trovato",
        description: "Non troviamo il tuo abbonamento",
      },
      server: {
        title: "Aggiornamento non riuscito",
        description: "Non siamo riusciti a salvare le modifiche. Riprova.",
      },
      unknown: {
        title: "Errore imprevisto",
        description: "Qualcosa è andato storto. Riprova.",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto di aggiornamento",
        description:
          "Il tuo abbonamento è cambiato nel frattempo. Ricarica la pagina e riprova",
      },
    },
    submit: {
      label: "Aggiorna l’abbonamento",
      loading: "Aggiornamento...",
    },
    success: {
      title: "Abbonamento aggiornato",
      description: "Il tuo abbonamento è aggiornato",
    },
  },

  // DELETE endpoint
  delete: {
    title: "Disdici l’abbonamento",
    titleShort: "Disdici",
    description: "Disdici il tuo abbonamento",
    warning:
      "Se disdici, l’accesso termina alla fine del periodo di fatturazione.",
    form: {
      title: "Disdetta dell'abbonamento",
      description: "Disdici l'abbonamento, con impostazioni facoltative",
    },
    errors: {
      validation: {
        title: "Richiesta non valida",
        description: "Controlla i dati della disdetta e riprova",
      },
      network: {
        title: "Errore di connessione",
        description: "Non siamo riusciti a elaborare la disdetta. Riprova.",
      },
      unauthorized: {
        title: "Accedi per continuare",
        description: "Accedi per disdire l'abbonamento",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di disdire questo abbonamento",
      },
      notFound: {
        title: "Abbonamento non trovato",
        description:
          "Non siamo riusciti a trovare il tuo abbonamento per cancellare",
      },
      server: {
        title: "Cancellazione non riuscita",
        description:
          "Non siamo riusciti a disdire il tuo abbonamento. Riprova.",
      },
      unknown: {
        title: "Errore imprevisto",
        description: "Qualcosa è andato storto. Riprova.",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto nella disdetta",
        description:
          "Lo stato del tuo abbonamento è cambiato. Ricarica la pagina e riprova",
      },
    },
    submit: {
      label: "Disdici l’abbonamento",
      loading: "Disdetta in corso…",
    },
    success: {
      title: "Abbonamento disdetto",
      description: "Il tuo abbonamento è disdetto",
    },
  },

  // Form fields
  form: {
    fields: {
      planId: {
        label: "Piano di abbonamento",
        description: "Scegli il tuo piano",
        placeholder: "Scegli il piano",
      },
      billingInterval: {
        label: "Frequenza di fatturazione",
        description: "Seleziona la frequenza di fatturazione",
        placeholder: "Scegli la frequenza di fatturazione",
      },
      provider: {
        label: "Servizio di pagamento",
        description: "Scegli come pagare",
      },
      catalogProductId: {
        label: "Prodotto del catalogo",
        description: "Link a un prodotto di catalogo per questo abbonamento",
      },
      cancelAtPeriodEnd: {
        label: "Disdici a fine periodo",
        description: "Disdici l'abbonamento alla fine del periodo in corso",
      },
      reason: {
        label: "Motivo della disdetta",
        description: "Dicci perché disdici",
        placeholder: "Scrivi il motivo",
      },
    },
  },

  // Response fields
  response: {
    checkoutUrl: "URL della pagina di pagamento",
    sessionId: "Sessione ID",
    hasSubscription: "Ha Abbonamento",
    id: "Abbonamento ID",
    userId: "Utente ID",
    status: "Stato di abbonamento",
    planId: "Piano ID",
    billingInterval: "Frequenza di fatturazione",
    currentPeriodStart: "Inizio del periodo attuale",
    currentPeriodEnd: "Periodo attuale Fine",
    cancelAtPeriodEnd: "Disdici a fine periodo",
    cancelAt: "Annullare",
    canceledAt: "Annullato a",
    endedAt: "Fine a",
    gracePeriodEndsAt: "Fine del periodo di tolleranza",
    retryPaymentUrl: "Link per ripetere il pagamento",
    cardCountry: "Paese della carta",
    recentCardAuthFailure: "Recente autenticazione della carta non riuscita",
    checkoutProviders: "Metodi di pagamento disponibili",
    nowPaymentsAcceptsCards: "Il checkout crypto accetta carte",
    cryptoMinUsd: "Minimo cripto (USD)",
    trialStart: "Data di inizio del processo",
    trialEnd: "Data di fine prova",
    success: "Operazione di successo",
    message: "Messaggio di stato",
    subscriptionId: "Abbonamento ID",
    stripeCustomerId: "Stripe cliente ID",
    updatedFields: "Campi aggiornati",
    endsAt: "Fines At",
    createdAt: "Creato a",
    updatedAt: "Aggiornato At",
    provider: "Servizio di pagamento",
    providerSubscriptionId: "Abbonamento Provider ID",
  },

  // Error types
  errors: {
    tierChange: {
      notActive: "Il tuo piano è inattivo. Attiva un nuovo piano.",
      cryptoNotSupported:
        "Non puoi cambiare piano a metà periodo se paghi in criptovaluta. Scegli il nuovo piano alla scadenza di quello attuale.",
      paymentRequired:
        "La banca richiede una conferma per il passaggio. Apri la fattura per completarlo: {{url}}",
      failed: "Cambio di piano non riuscito: {{error}}",
      upgraded:
        "Sei passato a {{plan}}. Hai {{credits}} crediti extra per questo periodo.",
      changed: "Ora hai il piano {{plan}}.",
      downgraded:
        "Passerai a {{plan}} al prossimo rinnovo. Fino ad allora mantieni i crediti attuali.",
      unchanged: "Hai già questo piano.",
    },
    validation: {
      title: "Errore di convalida",
      description: "Parametri di abbonamento non validi",
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
      description: "Abbonamento non trovato",
    },
    not_found: "Abbonamento non trovato",
    not_found_description: "L'abbonamento richiesto non è stato trovato",
    server: {
      title: "Errore del server",
      description: "Si è verificato un errore interno del server",
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
    use_checkout_flow:
      "Per acquistare un abbonamento, usa la pagina di pagamento",
    use_checkout_flow_description:
      "Per attivare un abbonamento, completa l’acquisto dalla pagina di pagamento.",
    conflict: {
      title: "Conflitto",
      description: "I dati sono in conflitto",
    },
    sync_failed: "Non sincronizzare l'abbonamento con il database",
    database_error: "Errore del database si è verificato: {{error}}",
    create_crashed: "Creazione di abbonamenti fallito",
    cancel_failed: "Non è possibile cancellare l'abbonamento: {{error}}",
    user_not_found: "Utente non trovato",
    stripe_customer_creation_failed:
      "Non è riuscito a creare il cliente Stripe",
    not_implemented_on_native:
      "{{method}} non è ancora disponibile nell'app. Usa la versione web.",
    no_provider_id: "Nessun fornitore di pagamento ID trovato",
  },

  sync: {
    failed: "Non sincronizzare l'abbonamento: {{error}}",
    stripe_error: "Errore di sincronizzazione Stripe: {{error}}",
    success: "Abbonamento sincronizzato con successo",
  },

  // Cancel operation
  cancel: {
    success: "Abbonamento annullato con successo",
  },

  // Success types
  success: {
    title: "Operazione riuscita",
    description: "Operazione completata",
  },

  // Status translations
  status: {
    incomplete: "Incompleto",
    incomplete_expired: "Scadenza incompleta",
    trialing: "In prova",
    active: "Attivo",
    pastDue: "Passato",
    canceled: "Annullamento",
    unpaid: "Non pagato",
    paused: "In pausa",
  },

  // Email translations
  email: {
    success: {
      headline: "Ci sei. Zero filtri, zero prediche.",
      subject: "Il tuo abbonamento a {{appName}} è attivo",
      previewText:
        "{{privateName}}, ci sei. {{subscriptionCredits}} crediti al mese, {{modelCount}} modelli, zero restrizioni.",
      activeBadge: "Attivo",
      greeting: "Ciao {{privateName}},",
      intro:
        "Il tuo abbonamento a {{appName}} è attivo. Ogni mese hai {{subscriptionCredits}} crediti da usare con tutti i modelli. Nessun limite giornaliero, nessun filtro sui contenuti, nessuna spiegazione da dare.",
      models: {
        title: "{{modelCount}} modelli, 3 categorie",
        mainstream: "Mainstream",
        open: "Open source",
        uncensored: "Senza censura",
      },
      included: {
        title: "Cosa ricevi ogni mese:",
        credits:
          "{{subscriptionCredits}} crediti al mese, con rinnovo automatico",
        models: "Accesso a tutti i {{modelCount}} modelli di IA",
        nolimits: "Nessun limite giornaliero. Usa i crediti quando vuoi",
        uncensored: "Modelli senza filtri sui contenuti",
        packs: "Pacchetti di crediti extra senza scadenza",
        cancel: "Disdici quando vuoi, senza dover dare spiegazioni",
      },
      cta: "Inizia a chattare",
      packs: {
        title: "Ti servono più crediti?",
        description:
          "Ti restano pochi crediti prima del rinnovo? Ricarica quando vuoi: {{packCredits}} crediti a {{packPrice}}. I pacchetti non scadono mai e si aggiungono ai crediti mensili.",
        cta: "Acquista un pacchetto di crediti",
      },
      manage: "Gestisci o disdici l’abbonamento quando vuoi dalle",
      manageLink: "impostazioni del tuo account",
      signoff: "Buone chat,\nIl team di {{appName}}",
    },
    admin_notification: {
      title: "Nuovo abbonamento",
      subject: "Nuovo abbonamento al piano {{planName}}",
      preview: "Nuovo abbonamento: {{userName}} ha scelto {{planName}}",
      message: "C’è un nuovo abbonato su {{appName}}.",
      details: "Dettagli dell’abbonamento",
      user_name: "Nome utente",
      user_email: "Email utente",
      plan: "Piano",
      status: "Stato",
      contact_user: "Contatta l'utente",
      footer: "Notifica automatica di {{appName}}",
    },
  },

  // Email template metadata (for preview registry)
  emailTemplates: {
    success: {
      name: "Abbonamento Successo Email",
      description:
        "E-mail di conferma inviata quando l'utente attiva un abbonamento",
      category: "abbonamento",
      preview: {
        privateName: {
          label: "Nome utente",
          description: "Il nome del display dell'utente",
        },
        userId: {
          label: "Utente ID",
          description: "L'identificatore unico dell'utente",
        },
        leadId: {
          label: "ID del contatto",
          description: "L'identificatore di contatto associato",
        },
        planName: {
          label: "Nome del piano",
          description: "Il nome del piano di abbonamento",
        },
      },
    },
    adminNotification: {
      name: "Notifica di abbonamento di Admin",
      description:
        "Notifica interna inviata agli amministratori quando un utente abbona",
      category: "admin",
      preview: {
        privateName: {
          label: "Nome utente",
        },
        publicName: {
          label: "Nome pubblico",
        },
        email: {
          label: "Email utente",
        },
        planName: {
          label: "Nome del piano",
        },
        statusName: {
          label: "Stato di abbonamento",
        },
      },
    },
  },

  // Widget-specific keys (cancel confirmation dialog, etc.)
  widget: {
    back: "Indietro",
    confirm: {
      title: "Vuoi disdire l’abbonamento?",
      description:
        "Perderai l’accesso alla fine del periodo di fatturazione. Non potrai annullare la disdetta.",
      cancel: "Mantieni l’abbonamento",
      proceed: "Sì, disdici",
    },
  },

  // Widget display keys
  title: "Il tuo abbonamento",
  description: "Gestisci l’abbonamento e la fatturazione",
  notAvailable: "N/A",
  canceledOn: "Disdetto il",
  endedOn: "Terminato il",
  billingInterval: "Frequenza di fatturazione",
  currentPeriodStart: "Inizio del periodo attuale",
  endsOn: "Termina il",
  nextBillingDate: "Prossima data di fatturazione",
  cancellation: {
    title: "Disdetta programmata",
    description:
      "Il tuo abbonamento terminerà il {{date}}. Fino ad allora avrai ancora accesso.",
  },
  canceled: {
    title: "Abbonamento terminato",
    description:
      "Il tuo abbonamento è terminato. Rinnovalo per riavere accesso a tutte le funzioni.",
  },
  pastDue: {
    title: "L'ultimo pagamento non è andato a buon fine",
    description:
      "Piano e crediti restano attivi fino al {{date}}. Fino ad allora puoi anche ricaricare con un pacchetto di crediti una tantum, con carta o crypto.",
    reason:
      "Spesso la banca trattiene il pagamento in attesa della tua approvazione (3D Secure o codice OTP).",
    indiaMandate:
      "La tua carta è indiana: le banche indiane consentono addebiti ricorrenti su carta solo con un e-mandate approvato, e sopra i 15.000 ₹ ogni addebito richiede il tuo OTP. Prima di ogni rinnovo controlla l'SMS o la notifica dell'app della banca.",
    retry: "Approva o riprova il pagamento",
    buyPack: "Ricarica con un pacchetto di crediti",
    payCrypto: "Paga in crypto",
  },
  checkoutTip: {
    title: "La carta chiede un codice?",
    body: "Conferma l'OTP o il controllo 3D Secure nell'app della banca o via SMS, e tieni aperta la scheda del pagamento finché non viene confermato.",
    india:
      "Carte indiane: i pagamenti online internazionali sono spesso disattivati di default. Attivali nell'app della banca (controlli della carta) e riprova.",
    other: "Non funziona ancora? Prova un'altra carta o paga in crypto.",
  },
  noSubscription: {
    title: "Nessun abbonamento attivo",
    description:
      "Abbonati per ricevere crediti ogni mese e accedere a tutti i modelli.",
    cta: "Vedi i piani",
  },
  manage: {
    nowpayments: {
      info: "Contatta l’assistenza per gestire l’abbonamento NowPayments.",
      button: "Gestisci l’abbonamento",
    },
    stripe: {
      button: "Gestisci l’abbonamento",
    },
    portal: {
      error: "Impossibile aprire il portale clienti. Riprova.",
    },
  },

  // Enum translations
  enums: {
    plan: {
      subscription: "Starter",
      plus: "Plus",
      pro: "Pro",
      ultra: "Ultra",
    },
    status: {
      incomplete: "Incompleto",
      incompleteExpired: "Scadenza incompleta",
      trialing: "In prova",
      active: "Attivo",
      pastDue: "Passato",
      canceled: "Annullamento",
      unpaid: "Non pagato",
      paused: "In pausa",
      canceling: "In disdetta",
    },
    billing: {
      monthly: "Mensile",
      yearly: "Annuale",
    },
    cancellation: {
      tooExpensive: "Troppo costoso",
      missingFeatures: "Caratteristiche mancanti",
      switchingService: "Servizio di commutazione",
      temporaryPause: "Pausa temporanea",
      other: "Altro",
    },
    paymentProvider: {
      nowpayments: "NowPayments",
      stripe: "Stripe",
      whop: "Whop",
    },
  },

  // Buy / pricing page translations
  quickCheckout: {
    pack: {
      title: "{{credits}} crediti",
      note: "Ricarica una tantum. I crediti non scadono mai.",
      aria: "Acquista {{credits}} crediti a {{price}}. Paghi una volta sola.",
    },
    plan: {
      title: "{{credits}} crediti al mese",
      note: "{{plan}}. Disdici quando vuoi.",
      perMonth: "/mese",
      aria: "Attiva {{plan}}: {{credits}} crediti al mese a {{price}}",
    },
    upgrade: {
      title: "Passa a {{plan}}",
      note: "{{credits}} crediti al mese",
      aria: "Passa a {{plan}}: {{credits}} crediti al mese a {{price}}",
      confirm:
        "Paghi la differenza per il resto del periodo e ricevi subito i crediti extra.",
      confirmButton: "Passa ora al nuovo piano",
      cancel: "Annulla",
      working: "Cambio di piano in corso…",
    },
    opening: "Apertura della pagina di pagamento…",
    secure: "Carta, PayPal, Apple Pay e Google Pay.",
    secureCard: "Paghi con carta, fatto in pochi secondi.",
    allPlans: "Tutti i piani e le criptovalute",
    moreOptions: "Criptovalute e altre opzioni",
    error: "Impossibile aprire la pagina di pagamento. Riprova.",
  },
  tiers: {
    examples: {
      heading: "Cosa ottieni con {{credits}} crediti al mese",
      subheading: "Messaggi al mese con alcuni modelli popolari.",
      perMessage: "circa {{credits}} crediti a messaggio",
      messages: "circa {{amount}} messaggi",
      note: "Stima per un messaggio tipico: {{input}} token in ingresso (la chat fin qui) e {{output}} in uscita. Le chat brevi costano meno, quelle lunghe e i file di più.",
    },
    faq: {
      heading: "Domande prima di pagare",
      credit: {
        question: "Quanto vale un credito?",
        answer:
          "Un credito vale {{unitPrice}}. I modelli leggeri costano meno di un credito a messaggio, i migliori qualche credito. Gli esempi qui sopra usano i prezzi reali dei modelli.",
      },
      unused: {
        question: "Che fine fanno i crediti non usati?",
        answer:
          "I crediti del piano coprono il tuo mese di fatturazione e si ricaricano al rinnovo. I pacchetti di crediti non scadono mai.",
      },
      cancel: {
        question: "Posso disdire?",
        answer:
          "Sì, quando vuoi, proprio qui. Tieni il piano e i suoi crediti fino alla fine del periodo pagato.",
      },
      free: {
        question: "Cosa resta gratis?",
        answer:
          "Gli ospiti ricevono {{freeCreditsGuest}} crediti al mese. Un account gratuito ne riceve {{freeCreditsSignedIn}}, e {{freeCreditsMax}} con l’iscrizione alla newsletter confermata. Senza carta.",
      },
      api: {
        question: "Un piano sblocca l’API?",
        answer:
          "Sì. Qualsiasi piano o pacchetto di crediti sblocca le chiavi API per i client compatibili con OpenAI e Anthropic. I crediti gratuiti no.",
      },
      pay: {
        question: "Come posso pagare?",
        answer:
          "Con carta o PayPal tramite Stripe, oppure in cripto tramite NOWPayments.",
      },
      more: "Altre risposte nel centro assistenza",
    },
    heading: "Scegli il tuo piano",
    subheading:
      "Nuovi crediti ogni mese per tutti i {{modelCount}} modelli. Disdici quando vuoi.",
    changeHeading: "Cambia piano",
    changeSubheading: "Hai il piano {{plan}}: {{credits}} crediti al mese.",
    recommended: "Consigliato",
    current: "Il tuo piano",
    perMonth: "/ mese",
    perYear: "/ anno",
    creditsPerMonth: "crediti al mese",
    yearlyEquivalent: "{{monthlyPrice}} al mese, con pagamento annuale",
    picked: "{{plan}}: {{credits}} crediti al mese",
    pickedNote:
      "Tutti i {{modelCount}} modelli. I crediti si rinnovano ogni mese. Disdici quando vuoi.",
    cta: {
      start: "Scegli {{plan}}",
      upgrade: "Passa a {{plan}}",
      downgrade: "Passa a {{plan}} al rinnovo",
      intervalYearly: "Passa al pagamento annuale",
      intervalMonthly: "Passa a {{plan}} con pagamento mensile",
      current: "Il tuo piano attuale",
    },
    signInHint: "Crea un account gratuito per attivare un piano.",
    cryptoHint:
      "Vuoi pagare in criptovaluta? Plus, Pro e Ultra accettano pagamenti mensili o annuali. Starter solo annuali.",
    confirm: {
      upgradeTitle: "Vuoi passare a {{plan}}?",
      upgradeBody:
        "Paghi la differenza per il resto del periodo e ricevi subito i crediti extra. Dal prossimo rinnovo pagherai {{price}} al mese per {{credits}} crediti.",
      upgradeButton: "Paga e passa al nuovo piano",
      downgradeTitle: "Vuoi passare a {{plan}}?",
      downgradeBody:
        "Il nuovo piano parte al prossimo rinnovo, il {{date}}. Fino ad allora mantieni il piano e i crediti attuali. Da quel giorno pagherai {{price}} al mese per {{credits}} crediti.",
      downgradeButton: "Cambia al rinnovo",
      intervalTitle: "Vuoi cambiare la fatturazione?",
      intervalBody:
        "Il periodo di fatturazione riparte oggi. Stripe calcola la differenza in base al tempo rimanente. Nuovo piano: {{plan}}, {{price}}{{period}}, {{credits}} crediti al mese.",
      intervalButton: "Cambia la fatturazione",
      cancel: "Non ora",
      working: "Cambio in corso…",
    },
    packsLocked: {
      title: "Pacchetti di crediti: {{credits}} crediti a {{price}}",
      body: "I pacchetti ricaricano un piano attivo. Attiva un piano e aggiungi pacchetti quando ti servono. Non scadono mai.",
    },
    topUp: {
      heading: "Ricarica",
      subheading:
        "Ti restano pochi crediti prima del rinnovo? I pacchetti si aggiungono al tuo piano e non scadono mai.",
    },
  },
  buy: {
    provider: {
      stripe: "Carta, PayPal e wallet",
      stripeDescription: "Carta, PayPal, Apple Pay e Google Pay tramite Stripe",
      nowpayments: "Criptovalute (NowPayments)",
      nowpaymentsDescription: "Paga con Bitcoin, Ethereum e altre criptovalute",
      cryptoAmountTooLow:
        "Questo importo è sotto il minimo per le criptovalute. Scegli la fatturazione annuale o un piano più grande.",
    },
    login: "Accedi",
    signup: "Registrati gratis",
  },

  // Page metadata
  meta: {
    subscription: {
      title: "Abbonamento",
      description: "Gestisci l’abbonamento e la fatturazione",
    },
    buyCredits: {
      title: "Compra crediti",
      description: "Acquistare crediti aggiuntivi per il tuo account",
    },
    history: {
      title: "Cronologia di fatturazione",
      description:
        "Visualizza la cronologia delle transazioni e della fatturazione",
    },
    overview: {
      title: "Panoramica dell’abbonamento",
      description: "Visualizza lo stato e i dettagli dell'abbonamento",
    },
  },
};
