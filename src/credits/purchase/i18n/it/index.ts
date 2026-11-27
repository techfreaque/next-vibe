import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    paymentProvider: {
      stripe: "Stripe",
      nowpayments: "NowPayments",
    },
  },
  post: {
    title: "Acquista crediti",
    titleShort: "Compra crediti",
    description:
      "Crea una sessione di pagamento Stripe per acquistare un pacchetto di crediti",
    container: {
      title: "Acquista crediti",
      description: "Acquista pacchetti di crediti per usare le funzioni di IA",
    },
    quantity: {
      label: "Quantità",
      description: "Numero di pacchetti di credito da acquistare (1-10)",
      placeholder: "Inserire la quantità (1-10)",
    },
    productId: {
      label: "Pacchetto di crediti",
      description: "Scegli il pacchetto da acquistare",
      placeholder: "Seleziona un pacchetto",
    },
    provider: {
      label: "Scegli come pagare",
      description: "Scegli come pagare il pacchetto di crediti",
      placeholder: "Seleziona il servizio di pagamento",
      stripe: "Carta, PayPal e wallet",
      stripeDescription: "Carta, PayPal, Apple Pay, Google Pay via Stripe",
      nowpayments: "Criptovalute",
      nowpaymentsDescription: "Paga con Bitcoin, Ethereum e altre criptovalute",
      cryptoMinimumDisabled:
        "Per pagare in criptovaluta servono almeno {{min}} pacchetti",
    },
    checkoutUrl: {
      content: "URL della pagina di pagamento",
    },
    sessionId: {
      content: "Sessione ID",
    },
    totalAmount: {
      content: "Importo totale (in centesimi)",
    },
    totalCredits: {
      content: "Crediti totali",
    },
    pack: {
      addPack: "Aggiungi un pacchetto",
      removePack: "Rimuovi un pacchetto",
      qtyCredits: "{{count}} crediti",
      title: "Pacchetto di crediti",
      description: "Ricarica il tuo piano. I crediti non scadono mai.",
      perPack: "/ pacchetto",
      features: {
        credits: "{{count}} crediti inclusi",
        expiry: "I crediti non scadono mai",
        bestFor: "Si aggiungono ai tuoi crediti mensili",
      },
      planRequired: {
        title: "I pacchetti ricaricano il tuo piano",
        body: "Attiva un piano, poi aggiungi pacchetti quando ti servono. Piani da {{price}} al mese.",
        cta: "Vedi i piani",
      },
      logIn: "Accedi",
      signUp: "Registrati",
      signInToBuy:
        "I pacchetti ricaricano il tuo piano. Crea un account gratuito e attiva un piano.",
      totalSummary: "{{totalCredits}} crediti · {{totalPrice}} in totale",
    },
    submit: {
      text: "Acquista un pacchetto di crediti",
      loading: "Elaborazione in corso…",
    },
    redirecting: "Apertura della pagina di pagamento…",
    openCheckout: "Vai al pagamento",
    backButton: {
      label: "Indietro",
    },
    submitButton: {
      label: "Acquista crediti",
      loadingText: "Elaborazione in corso…",
    },
    success: {
      title: "Sessione di pagamento creata",
      description: "Sessione di pagamento Stripe creata",
    },
    errors: {
      planRequired: {
        title: "Serve un piano attivo",
        description:
          "I pacchetti ricaricano un piano attivo. Scegli un piano, poi aggiungi pacchetti quando vuoi.",
      },
      validation: {
        title: "Errore di convalida",
        description: "Quantità di acquisto non valida",
      },
      network: {
        title: "Errore di rete",
        description: "Collegamento di rete fallito",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per acquistare crediti",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di acquistare crediti",
      },
      notFound: {
        title: "Non trovato",
        description: "Risorsa non trovata",
      },
      server: {
        title: "Errore del server",
        description: "Impossibile creare la sessione di pagamento",
        detail: "Impossibile avviare il pagamento: {{error}}",
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
        title: "Conflitto",
        description: "Il conflitto di risorse",
      },
    },
  },
  errors: {
    userNotFound: {
      title: "Utente non trovato",
      description: "L'account utente non è stato trovato",
    },
    checkoutFailed: {
      title: "Pagamento non riuscito",
      description:
        "Impossibile creare la sessione di pagamento per l’acquisto dei crediti",
    },
  },
};
