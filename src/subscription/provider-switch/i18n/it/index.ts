import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Pagamenti",
  tags: {
    subscription: "Abbonamento",
    billing: "Fatturazione",
  },

  get: {
    title: "Sposta il tuo piano",
    titleShort: "Sposta piano",
    description:
      "Mostra se il tuo piano con carta può passare al nuovo fornitore di pagamento e quando lì inizia la fatturazione.",
  },
  post: {
    title: "Avvia lo spostamento del piano",
    titleShort: "Sposta piano",
    description:
      "Apre il pagamento presso il nuovo fornitore per il tuo piano attuale. Il vecchio piano con carta si ferma una volta pagato il nuovo. Nessun doppio addebito.",
  },

  form: {
    fields: {
      provider: {
        label: "Metodo di pagamento",
        description:
          "Carta (Whop) o cripto (NOWPayments). Predefinito: il metodo principale.",
      },
    },
  },

  response: {
    offer: "Offerta",
    targetProvider: "Nuovo fornitore",
    providers: "Metodi di pagamento",
    nowPaymentsAcceptsCards: "Pagamenti con carta tramite NOWPayments",
    cryptoMinUsd: "Importo cripto minimo (USD)",
    plan: "Piano",
    billingInterval: "Frequenza di fatturazione",
    pastDue: "Pagamento scaduto",
    deadline: "Piano attivo fino al",
    billingStartAt: "Nuova fatturazione dal",
    firstPeriodEnd: "Fine del primo nuovo periodo",
    carryOver: "Riporto del tempo pagato",
    checkoutUrl: "Link di pagamento",
    sessionId: "Sessione di pagamento",
  },

  widget: {
    badge: "Azione richiesta",
    title: "Troppa libertà per il nostro gestore carte",
    description:
      "Hanno deciso che un'AI che risponde liberamente non rientra nelle loro regole. Noi non cambiamo nemmeno una risposta. Il tuo piano e i tuoi crediti sono al sicuro.",
    deadline:
      "Nessuna fretta: il tuo piano è attivo fino al {{date}}. Spostalo quando vuoi prima di quella data.",
    carryExtend:
      "Spostarlo prima non costa nulla in più: i giorni già pagati restano tuoi (il primo nuovo periodo dura fino al {{date}}).",
    carryDeferred:
      "Oggi non paghi nulla. La fatturazione con il nuovo fornitore inizia il {{date}}, quando finisce il tempo già pagato.",
    pastDue:
      "Il tuo ultimo rinnovo non è andato a buon fine. Sposta ora il piano per non perderlo.",
    unsupportedPlan:
      "Il nuovo pagamento con carta non offre ancora questo piano con fatturazione mensile. Scegli la fatturazione annuale o paga in crypto.",
    cta: "Sposta il mio piano",
    ctaLoading: "Apertura del pagamento...",
    noDoubleCharge:
      "Il vecchio piano con carta si ferma appena paghi il nuovo. Non paghi mai due volte.",
    checkoutReady: "Il pagamento è pronto.",
    openCheckout: "Apri il pagamento",
    notEligible: "Nessun piano con carta da spostare.",
  },

  manage: {
    cancelOld: "Annulla il vecchio piano con carta",
    moveFirst:
      "Vuoi tenere il piano? Spostalo qui sopra. Annullare qui lo chiude.",
  },

  enums: {
    paymentProvider: {
      nowpayments: "NowPayments",
      stripe: "Stripe",
      whop: "Whop",
    },
    carryOver: {
      extendFirstPeriod:
        "Addebito ora, il tempo pagato allunga il primo periodo",
      deferredStart: "La fatturazione inizia alla fine del tempo pagato",
    },
    status: {
      pending: "Pagamento avviato",
      completed: "Spostato",
      cancelFailed: "Spostato, annullamento del vecchio piano non riuscito",
    },
    cancelMode: {
      atPeriodEnd: "A fine periodo",
      immediate: "Subito",
    },
    offer: {
      available: "Disponibile",
      planNotSupported: "Piano non supportato",
      notEligible: "Non idoneo",
    },
    notice: {
      sending: "In invio",
      sent: "Inviato",
      failed: "Non riuscito",
    },
  },

  errors: {
    validation: {
      title: "Richiesta non valida",
      description: "Controlla la richiesta e riprova.",
    },
    unauthorized: {
      title: "Accesso richiesto",
      description: "Accedi per spostare il tuo piano.",
    },
    forbidden: {
      title: "Non consentito",
      description: "Questo account non può spostare un piano.",
    },
    notFound: {
      title: "Nessun piano con carta",
      description:
        "Su questo account non c'è nessun piano con carta da spostare.",
    },
    conflict: {
      title: "Niente da spostare",
      description:
        "Lo spostamento dei piani non è aperto in questo momento, oppure questo piano non si può spostare. Il tuo piano resta attivo.",
    },
    unsupportedPlan: {
      title: "Piano non supportato",
      description:
        "Il nuovo fornitore non può vendere questo piano con questa frequenza di fatturazione.",
    },
    server: {
      title: "Qualcosa si è rotto",
      description: "Impossibile aprire il pagamento. Riprova tra un minuto.",
    },
    network: {
      title: "Errore di rete",
      description: "Server non raggiungibile. Controlla la connessione.",
    },
    unknown: {
      title: "Errore imprevisto",
      description: "È successo qualcosa di imprevisto. Riprova.",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Prima salva o annulla le modifiche.",
    },
  },

  success: {
    title: "Pagamento pronto",
    description: "Completa il pagamento per spostare il tuo piano.",
  },
};
