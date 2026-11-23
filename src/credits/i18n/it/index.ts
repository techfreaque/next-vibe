/**
 * English translations for credits endpoints
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Crediti",
  tags: {
    credits: "crediti",
    balance: "saldo",
  },
  repository: {
    bonusCreditsAdded: "Aggiunto Crediti bonus {{amount}}",
    tts: "Testo a velocità",
    stt: "Discorso a testo",
    search: "Cerca",
    sttHotkey: "Discorso-to-Text (Cucina)",
  },
  enums: {
    freeStatus: {
      active: "Crediti gratuiti attivi",
      verifyEmail: "Verifica la tua email per sbloccare i crediti dell'account",
      subnetLimit: "Crediti gratuiti sospesi per questa rete",
    },
    creditType: {
      userSubscription: "Crediti per l'abbonamento utente",
      leadFree: "Condurre crediti di livello libero",
    },
    creditFeature: {
      textToSpeech: "Sintesi vocale",
      speechToText: "Trascrizione vocale",
      memoryWrite: "Scrittura in memoria",
      memoryEdit: "Modifica della memoria",
      memorySearch: "Ricerca in memoria",
      memoryEmbedding: "Embedding della memoria",
    },
    transactionType: {
      purchase: "Acquisto",
      subscription: "Abbonamento",
      usage: "Utilizzo",
      expiry: "Scadenza",
      freeTier: "Piano gratuito",
      monthlyReset: "Rinnovo mensile",
      freeGrant: "Assegnazione gratuita",
      freeReset: "Rinnovo dei crediti gratuiti",
      refund: "Rimborso",
      transfer: "Trasferimento",
      otherDevices: "Usati su un altro dispositivo",
      referralEarning: "Guadagno da invito",
      referralPayout: "Prelievo dei guadagni da inviti",
    },
    fundingType: {
      freeAllowance: "Quota gratuita mensile",
      freeBonus: "Bonus account / newsletter",
      referral: "Crediti referral",
      purchased: "Pacchetto acquistato",
      subscription: "Crediti abbonamento",
      adminGrant: "Assegnazione admin",
      freeUnknown: "Gratuito, livello non registrato",
      packUnknown: "Pacchetto, origine non registrata",
    },
    packType: {
      subscription: "Abbonamento",
      permanent: "Permanent",
      bonus: "Bonus",
      earned: "Guarnizione",
    },
  },
  historyLabels: {
    signupCarryover: "Usati senza account prima della registrazione",
    sharedLimit: "I dispositivi collegati condividono il limite mensile",
    monthly: "Crediti gratuiti mensili",
    monthlyGuest: "Crediti gratuiti mensili (senza account)",
    monthlyAccount: "Crediti gratuiti mensili (account gratuito)",
    monthlyAccountNewsletter: "Crediti gratuiti mensili (account e newsletter)",
    freeGuest: "Crediti gratuiti (senza account)",
    accountUpgrade: "Bonus per l’account gratuito",
    newsletterBonus: "Bonus newsletter",
    otherDevices: "Usati su un altro dispositivo",
    linkedAccount: "Usati dall’account collegato",
  },
  expire: {
    post: {
      title: "Crediti scaduti",
      titleShort: "Crediti scaduti",
      description: "Crediti abbonamenti vecchi (chiamati da cron)",
      tag: "scadenza",
      container: {
        title: "Crediti scaduti",
        description: "Risultati di scadenza dei crediti",
      },
      response: {
        expiredCount: "Conte scaduto",
      },
      success: {
        title: "Crediti scaduti",
        description: "Crediti abbonamenti vecchi scaduti con successo",
      },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso negato",
        },
        server: {
          title: "Errore del server",
          description: "Non scadere crediti",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        validation: {
          title: "Errore di convalida",
          description: "Parametri della richiesta non validi",
        },
      },
    },
    task: {
      description: "Scade i crediti di abbonamento vecchi al giorno",
      error: "Non scadere crediti",
    },
  },
  cleanup: {
    task: {
      description:
        "Rimuove ogni settimana i portafogli dei lead non più collegati",
      error: "Non riuscito a ripulire i portafogli orfani",
    },
  },
  errors: {
    purchasedModel:
      "Per questo modello servono crediti a pagamento. Acquistali su {{path}} o scegli un modello gratuito.",
    clusterLimit:
      "I crediti gratuiti condivisi sono esauriti. Usa crediti a pagamento o attendi il rinnovo della quota.",
    getBalanceFailed: "Impossibile caricare il saldo crediti",
    getLeadBalanceFailed: "Impossibile caricare il saldo crediti del lead",
    getOrCreateLeadFailed: "Impossibile trovare o creare il lead",
    addCreditsFailed: "Non è stato possibile aggiungere crediti",
    deductCreditsFailed: "Non è riuscito a dedurre i crediti",
    insufficientCredits:
      "Crediti insufficienti. È necessario che i crediti {{cost}} utilizzino questa funzione.",
    deductionFailed:
      "Non ha detratto i crediti {{cost}}. Per favore, riprovate.",
    getTransactionsFailed: "Non riuscita a ottenere transazioni di credito",
    invalidIdentifier: "ID utente o lead non valido",
    userNotFound: "Utente non trovato",
    noLeadFound: "Nessun vantaggio trovato per l'utente",
    getCreditIdentifierFailed:
      "Non è riuscito a ottenere l'identificatore di credito",
    noCreditSource: "Nessuna fonte di credito disponibile",
    stripeCustomerFailed: "Non è riuscito a creare il cliente Stripe",
    checkoutFailed: "Impossibile creare la sessione di pagamento",
    mergeFailed: "Impossibile unire i crediti dei lead",
    mergeLeadWalletsFailed:
      "Impossibile trasferire i crediti dei lead all’account utente",
    cleanupOrphanedFailed:
      "Impossibile rimuovere i portafogli dei lead non più collegati",
    monthlyResetFailed: "Non risistemato crediti mensili",
    noLeadsToMerge: "Nessun indizio fornito a fondersi",
    oldestLeadNotFound: "Impossibile trovare il lead più vecchio del gruppo",
    transactionFailed: "Non è riuscito a creare record di transazione",
    not_implemented_on_native:
      "{{method}} non è implementato sulla piattaforma nativa. Si prega di utilizzare la versione web per questa operazione.",
    expireCreditsFailed: "Non scadere crediti",
    invalidAmount: "L'importo del credito deve essere un numero positivo",
    walletNotFound: "Portafoglio non trovato",
    walletCreationFailed: "Non è riuscito a creare il portafoglio",
    addEarnedCreditsFailed: "Non è riuscito a aggiungere crediti guadagnati",
    getEarnedBalanceFailed:
      "Impossibile caricare il saldo dei crediti guadagnati",
    insufficientEarnedCredits: "Crediti insufficienti per questa operazione",
    deductEarnedCreditsFailed: "Non riuscito a dedurre crediti guadagnati",
    getReferralTransactionsFailed:
      "Non è possibile ottenere transazioni di rinvio",
  },
  get: {
    title: "Consulta il saldo crediti",
    titleShort: "Saldo",
    description: "Consulta il saldo crediti dell’utente e la sua composizione",
    response: {
      title: "Saldo crediti",
      description: "Il tuo saldo crediti e come si compone",
    },
    balance: {
      subscribe: "Vedi i piani",
      freePlanHint:
        "{{count}} crediti gratuiti al mese, {{max}} con la newsletter. Piani da {{planPrice}} per {{subCredits}} crediti al mese.",
      lowBalance: {
        title: "Ti restano {{count}} crediti",
        emptyTitle: "Hai esaurito i crediti",
        hint: "Ricarica qui sotto. {{packCredits}} crediti senza scadenza a {{packPrice}}.",
        hintPlans: "Scegli un piano qui sotto. Ricevi i crediti appena paghi.",
        offersHint:
          "Ricarica e riparti in pochi secondi. I crediti dei pacchetti non scadono mai.",
        offersHintPlans: "Scegli un piano e riparti in pochi secondi.",
      },
      freePlan: "Hai il piano gratuito",
      guestPlan: "Saldo senza account",
      signUp: "Iscriviti gratis",
      loadFailed: "Impossibile caricare il saldo.",
      retry: "Riprova",
      title: "I tuoi crediti",
      adminTitle: "Limite di spesa",
      description: "Un solo saldo per tutti i {{modelCount}} modelli.",
      adminDescription:
        "I crediti fissano il limite di spesa. Scegli quanto possono usare l’IA tutti gli utenti.",
      credit: "{{count}} credito",
      credits: "{{count}} crediti",
      expiring: {
        title: "Crediti con scadenza",
        description:
          "I crediti del piano si rinnovano a ogni ciclo di fatturazione",
        adminDescription:
          "Crediti validi fino alla fine del ciclo di abbonamento",
      },
      permanent: {
        title: "Crediti senza scadenza",
        description: "Restano tuoi. Non scadono mai.",
        adminDescription: "Crediti permanenti, senza scadenza",
      },
      free: {
        title: "Crediti gratuiti",
        description: "{{count}} gratis ogni mese, {{max}} con la newsletter",
        descriptionGuest:
          "{{guest}} gratis ogni mese. Registrati per averne {{signedIn}}, oppure {{max}} con la newsletter.",
        adminDescription:
          "Limite mensile gratuito condiviso tra dispositivi. {{guest}} senza account, {{signedIn}} con account, {{max}} con account e newsletter.",
      },
      earned: {
        title: "Crediti guadagnati",
        description:
          "Li guadagni con gli inviti. Seleziona per invitare amici.",
      },
      spending: {
        title: "I tuoi crediti guadagnati",
        adminDescription:
          "I guadagni da inviti del tuo account, separati da quelli dell’istanza",
      },
    },
    total: {
      content: "Crediti totali",
    },
    expiring: {
      content: "Crediti con scadenza (abbonamento)",
    },
    permanent: {
      content: "Crediti senza scadenza (pacchetti)",
    },
    free: {
      content: "Crediti del piano gratuito",
    },
    earned: {
      content: "Crediti guadagnati con gli inviti",
    },
    expiresAt: {
      content: "Scadenza",
    },
    capacity: {
      content: "Capacità totale",
    },
    freeStatus: {
      content: "Stato dei crediti gratuiti",
      subnetLimit:
        "Questo mese sono stati creati troppi account gratuiti dalla tua rete. Per ora questo account non riceve crediti gratuiti. Puoi sbloccarli acquistando crediti oppure aspettare il mese prossimo, quando ci sarà di nuovo disponibilità sulla rete.",
    },
    success: {
      title: "Saldo caricato",
      description: "Abbiamo caricato il saldo crediti",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
      },
      network: {
        title: "Errore di rete",
        description: "Collegamento di rete fallito",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per vedere il saldo crediti",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di accedere a questa risorsa",
      },
      notFound: {
        title: "Non trovato",
        description: "Risorsa non trovata",
      },
      server: {
        title: "Errore del server",
        description: "Impossibile caricare il saldo crediti",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      noActiveSubscription: {
        title: "Serve un abbonamento attivo",
        description:
          "Per acquistare pacchetti di crediti, attiva un abbonamento",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto",
        description: "Il conflitto di risorse",
      },
      no_active_subscription: {
        title: "Serve un abbonamento attivo",
        description:
          "Per acquistare pacchetti di crediti, attiva un abbonamento",
      },
    },
  },
  history: {
    get: {
      guestGrantsHidden: "Bonus gratuiti degli ospiti nascosti",
      recent: "Attività recente",
      payment: "Pagamento",
      recentTitle: "Attività recente del registro",
      guestDevice: "Dispositivo ospite",
      kindAccount: "Account",
      kindLead: "Lead senza account",
      openPayment: "Apri pagamento",
      currentBalance: "Saldo attuale",
      currentBalanceHint: "{{paid}} pagati · {{free}} gratuiti",
      showingRange: "Da {{from}} a {{to}} di {{total}}",
      from: "Dal",
      to: "Al",
      totals: "Totali",
      allTypes: "Tutti i tipi",
      filteredBy: "Filtrato per",
      clearFilters: "Rimuovi tutti",
      removeFilter: "Rimuovi filtro",
      spent: "Crediti spesi",
      granted: "Crediti assegnati",
      entries: "Voci",
      periodHint: "Nel periodo filtrato",
      emptyFiltered: "Nessuna voce con questi filtri.",
      typeFilter: {
        label: "Tipo",
      },
      target: {
        label: "Cliente",
        description: "E-mail dell'account, ID utente o ID lead",
        placeholder: "cliente@example.com o un ID",
      },
      resolvedTarget: "Registro di",
      detail: "Modello o funzione",
      targetNotFound: "Nessun account o lead corrisponde a {{target}}.",
      lookupTitle: "Registro cliente",
      lookupHint:
        "Cerca un account o un lead per e-mail, ID utente o ID lead per vedere ogni movimento di crediti.",
      openLedger: "Apri registro",
      changeTarget: "Cerca un altro",
      colDate: "Data",
      colType: "Tipo",
      colDetail: "Modello o funzione",
      colAmount: "Importo",
      colBalance: "Saldo dopo",
      showing: "Registro di {{who}}",
      bonusGrant: "Assegnazione di crediti bonus",
      relatedRecords: "Record collegati",
      account: "Cliente",
      lead: "Contatto",
      openAccount: "Apri la scheda cliente",
      openLead: "Apri la scheda del lead",
      openPayouts: "Vedi i prelievi del partner",
      loading: "Caricamento dello storico crediti…",
      delta: "{{amount}} crediti",
      entryBalance: "Saldo dopo il movimento: {{count}} crediti",
      emptyHint: "Qui trovi tutti gli accrediti e gli addebiti.",
      title: "Consulta lo storico crediti",
      titleShort: "Storico crediti",
      description: "Consulta lo storico dei movimenti dei crediti per pagina",
      container: {
        title: "Storico crediti",
        description: "Consulta lo storico dei tuoi movimenti",
      },
      emptyState: "Nessun movimento per ora",
      balance: "Saldo dopo il movimento: {{count}}",
      limit: {
        label: "Limite",
        description: "Numero massimo di movimenti da mostrare (1-100)",
      },
      offset: {
        label: "Offset",
        description:
          "Numero di movimenti da saltare per passare a un’altra pagina",
      },
      targetUserId: {
        label: "ID dell’utente",
      },
      targetLeadId: {
        label: "ID del lead",
      },
      id: "ID del movimento",
      amount: "Importo",
      type: "Tipologia",
      modelId: "Modello",
      messageId: "Messaggio ID",
      createdAt: "Data",
      transactions: {
        title: "Transazioni",
        description: "Elenco dei movimenti di crediti",
      },
      paginationInfo: {
        total: "Totale movimenti",
        totalPages: "Pagine totali",
      },
      totalCount: {
        content: "Totale conteggio",
      },
      transaction: {
        id: {
          content: "ID del movimento",
        },
        amount: {
          content: "Importo",
        },
        balanceAfter: {
          content: "Saldo dopo il movimento",
        },
        type: {
          content: "Tipologia",
        },
        modelId: {
          content: "Modello",
        },
        messageId: {
          content: "Messaggio ID",
        },
        createdAt: {
          content: "Data",
        },
      },
      success: {
        title: "Storico caricato",
        description: "Abbiamo caricato lo storico crediti",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Parametri della richiesta non validi",
        },
        network: {
          title: "Errore di rete",
          description: "Collegamento di rete fallito",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per vedere lo storico crediti",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Non hai il permesso di accedere a questa risorsa",
        },
        notFound: {
          title: "Non trovato",
          description: "Risorsa non trovata",
        },
        server: {
          title: "Errore del server",
          description: "Impossibile caricare lo storico crediti",
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
  },
  purchase: {
    post: {
      title: "Acquista crediti",
      description:
        "Crea una sessione di pagamento Stripe per acquistare un pacchetto di crediti",
      container: {
        title: "Acquista crediti",
        description:
          "Acquista pacchetti di crediti per usare le funzioni di IA",
      },
      quantity: {
        label: "Quantità",
        description: "Numero di pacchetti di credito da acquistare (1-10)",
        placeholder: "Inserire la quantità (1-10)",
      },
      provider: {
        label: "Servizio di pagamento",
        description: "Scegli come pagare",
        placeholder: "Seleziona il servizio di pagamento",
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
      success: {
        title: "Sessione di pagamento creata",
        description: "Sessione di pagamento Stripe creata",
      },
      errors: {
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
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai cambiato",
        },
        conflict: {
          title: "Conflitto",
          description: "Il conflitto di risorse",
        },
        noActiveSubscription: {
          title: "Serve un abbonamento attivo",
          description:
            "Per acquistare pacchetti di crediti, attiva un abbonamento",
        },
      },
    },
  },
  adminAdd: {
    recipient: {
      renewsOn: "Si rinnova il {{date}}",
      endsOn: "Termina il {{date}}",
      freeBalance: "Crediti gratuiti",
      balanceSplit: "{{total}} in totale · {{paid}} pagati · {{free}} gratuiti",
      stepHint: "Passo 1: verifica il destinatario. Passo 2: scegli l'importo.",
      verified: "Destinatario verificato",
      kind: "Tipo di destinatario",
      kindAccount: "Account · dispositivi collegati: {{count}}",
      subscription: "Abbonamento",
      noSubscription: "Nessun abbonamento",
      linkedDevices: "Dispositivi collegati",
      recentGrants: "Ultimi bonus concessi",
      noGrants: "Nessun bonus finora",
      grantLine: "{{count}} crediti il {{date}}",
      nextStep: "Poi: concedi crediti a questo account",
      grant: "Concedi crediti",
      openLedger: "Apri registro",
      name: "Nome",
      balance: "Saldo attuale",
      joinedAt: "Iscritto il",
      noName: "Nessun nome",
      credits: "{{count}} crediti",
      balanceLine: "Saldo {{count}} crediti",
      joinedLine: "Iscritto il {{date}}",
      title: "Verificare il beneficiario della sovvenzione",
      description: "Trovare l'account idoneo per ricevere i crediti bonus.",
      accountId: "Account ID",
      email: "E-mail sensibile",
      noLinkedDevice: "Questo account non ha un dispositivo collegato.",
      loadFailed: "Incapace di verificare il destinatario.",
      loading: "Verificare il destinatario...",
      retry: "Riprova",
      openAccount: "Apri la scheda cliente",
      change: "Scegli un altro destinatario",
      verify: "Verifica",
    },
    post: {
      stepTwo: "Passo 2 di 2: importo",
      testerPreset: "3.000 (tester)",
      preview: "Saldo {{before}} → {{after}} (+{{amount}})",
      title: "Aggiungere crediti",
      titleShort: "Aggiungere crediti",
      description:
        "Aggiungere pacchetti di credito a un account utente (solo admin)",
      tag: "admin",
      container: {
        title: "Concedi crediti bonus",
        description:
          "Scegli un destinatario e inserisci l'importo esatto da concedere al portafoglio.",
        selfTitle: "Aggiungi crediti al tuo account",
        selfDescription: "Concediti crediti bonus",
      },
      targetUserId: {
        label: "Recipiente",
        description: "Scegli un cliente dalla directory dell'account.",
      },
      amount: {
        label: "Importo dei crediti",
        description: "Inserisci un intero numero di crediti bonus.",
        placeholder: "137",
      },
      packType: {
        label: "Tipo di pacchetto",
        description: "Tipo di pacchetto di credito da aggiungere",
      },
      response: {
        message: {
          content: "Risultato",
        },
      },
      backButton: {
        label: "Indietro",
      },
      submitButton: {
        label: "Crediti bonus di sovvenzione",
        loadingText: "Concessione di crediti...",
      },
      success: {
        title: "Credits Aggiunto",
        description: "I crediti sono stati aggiunti all'account utente",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Parametri della richiesta non validi",
        },
        network: {
          title: "Errore di rete",
          description: "Collegamento di rete fallito",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso all'amministratore richiesto",
        },
        notFound: {
          title: "Non trovato",
          description: "Utente non trovato",
        },
        server: {
          title: "Errore del server",
          description: "Non è stato possibile aggiungere crediti",
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
  },
  email: {
    creditPack: {
      user: {
        subject: "Il tuo pacchetto di crediti su {{appName}} è pronto",
        title: "Crediti aggiunti al tuo account",
        previewText: "Abbiamo aggiunto {{credits}} crediti al tuo account",
        greeting: "Ciao {{privateName}},",
        body: "Acquisto completato. Hai {{credits}} crediti senza scadenza, già disponibili sul tuo account.",
        cta: "Usa i tuoi crediti",
        signoff: "Grazie per l’acquisto!\n\nIl team di {{appName}}",
      },
      admin: {
        subject: "[{{appName}}] Pacchetto acquistato: {{credits}} crediti",
        title: "Acquisto di un pacchetto di crediti",
        preview: "Un utente ha acquistato un pacchetto di crediti",
        body: "Un utente ha acquistato un pacchetto di crediti.",
        labelUser: "Utente",
        labelCredits: "Crediti",
        footer: "Notifica automatica di {{appName}}",
      },
    },
  },
};
