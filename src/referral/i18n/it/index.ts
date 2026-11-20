import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Main referral domain
  category: "Inviti",

  // Tags
  tags: {
    referral: "rinvio",
    codes: "codes",
    earnings: "guadagni",
    get: "- No.",
    create: "creare",
    list: "elenco",
  },

  // GET endpoint (get referral code)
  get: {
    title: "Consulta il codice invito",
    titleShort: "Consulta codice",
    description: "Consulta i dettagli del codice invito",
    form: {
      title: "Dettagli del Codice Referral",
      description: "Visualizza le informazioni sul codice referral",
      limit: {
        label: "Limite",
        description: "Numero massimo di risultati da restituire",
      },
      offset: {
        label: "Offset",
        description: "Numero di risultati per saltare",
      },
    },
    response: {
      earnings: {
        id: "ID",
        earnerUserId: "Utente di Earner ID",
        sourceUserId: "Utente sorgente ID",
        transactionId: "ID del movimento",
        level: "Livello",
        amountCents: "Importo (centri)",
        currency: "Valuta",
        status: "Stato",
        createdAt: "Creato a",
      },
      totalCount: "Totale conteggio",
    },
  },

  // POST endpoint (create referral code)
  post: {
    title: "Crea un codice invito",
    titleShort: "Crea codice",
    description: "Crea un nuovo codice invito",
    form: {
      title: "Nuovo codice invito",
      description:
        "Usa un codice per ogni pubblico. Discord, blog, amici. Ogni codice ha le sue statistiche.",
    },
    submit: {
      label: "Crea codice",
      loading: "Creazione in corso…",
    },
  },

  // PUT endpoint (update referral code)
  put: {
    title: "Modifica il codice invito",
    description: "Modifica impostazioni del codice di riferimento",
    form: {
      title: "Modifica il codice invito",
      description: "Modificare le proprietà del codice di riferimento",
    },
  },

  // DELETE endpoint (deactivate referral code)
  delete: {
    title: "Disattiva il codice invito",
    description: "Disattivare un codice di riferimento",
    form: {
      title: "Disattiva il codice invito",
      description: "Disattivare questo codice di riferimento",
    },
  },

  // Link to Lead endpoint
  linkToLead: {
    post: {
      title: "Link Referral a Contatto",
      titleShort: "Link Referral",
      description:
        "Collegare un codice di riferimento a un comando prima dell'iscrizione",
      form: {
        title: "Link Codice di riferimento",
        description: "Codice di riferimento associato con la sessione",
      },
    },
    success: {
      title: "Referral Linked",
      description: "Codice di riferimento collegato con successo alla sessione",
    },
  },

  // Codes List endpoint
  codes: {
    list: {
      get: {
        title: "Elenco dei codici invito",
        titleShort: "I miei codici",
        description:
          "Ottieni tutti i tuoi codici di riferimento con le statistiche",
        form: {
          title: "I tuoi codici invito",
          description: "Consulta e gestisci i tuoi codici invito",
        },
        response: {
          codes: {
            id: "ID",
            code: "Codice",
            label: "Etichetta",
            currentVisitors: "Visitatori attuali",
            isActive: "Attivo",
            createdAt: "Creato a",
            totalSignups: "Registrazioni totali",
            totalRevenueCents: "Totale entrate (centri)",
            totalEarningsCents: "Guarnizioni totali (centri)",
          },
        },
      },
      success: {
        title: "Codici recuperati",
        description: "Recuperare con successo i codici di riferimento",
      },
      widget: {
        loading: "Caricamento dei codici…",
        empty: "Non hai ancora codici invito",
        emptyHint:
          "Crea il tuo primo codice qui sotto. Il link è subito pronto.",
        copied: "Copiato",
        copy: "Copia link",
        visitors: "Visitatori",
        signups: "Registrazioni",
        revenue: "Ricavi",
        earnings: "Guadagni",
        inactive: "Questo codice invito non è attivo",
        conversionHint:
          "Per ogni abbonamento da {{examplePrice}} al mese, guadagni {{exampleEarning}} al mese.",
        linkGen: "Link personalizzato",
        linkGenPlaceholder: "Incolla l’URL di una pagina…",
        linkGenHint:
          "Incolla l’URL di una pagina di unbottled per creare un link invito con statistiche",
        linkGenCopy: "Copia",
        linkGenCopied: "Copiato",
      },
    },
  },

  // Stats endpoint
  stats: {
    get: {
      title: "Statistiche degli inviti",
      titleShort: "Stat",
      description: "Ricevi le statistiche del programma di riferimento",
      form: {
        title: "Le tue statistiche sugli inviti",
        description: "Visualizza le metriche delle prestazioni di riferimento",
      },
    },
    success: {
      title: "Stats recuperato",
      description: "Recuperare con successo le statistiche di riferimento",
    },
    widget: {
      emptyMessage:
        "Nessuna attività per ora. Condividi il link invito per iniziare a guadagnare.",
    },
    fields: {
      totalSignups: "Registrazioni totali",
      totalSignupsDescription:
        "Numero di persone che si sono registrate con il tuo codice invito",
      totalRevenue: "Ricavi totali",
      totalRevenueDescription: "Ricavi totali generati dai tuoi inviti",
      totalEarned: "Guadagni totali",
      totalEarnedDescription: "Commissioni totali guadagnate con gli inviti",
      availableBalance: "Saldo disponibile",
      availableBalanceDescription: "Saldo disponibile per il prelievo",
      availableBalanceDescriptionLow:
        "Usa i guadagni per chattare con l’IA. Gli altri crediti vengono usati per primi. Raggiungi {{minPayout}} per sbloccare il prelievo.",
      totalRevenueCredits: "Ricavi totali (crediti)",
      totalEarnedCredits: "Guadagni totali (crediti)",
      totalPaidOutCredits: "Totale prelevato (crediti)",
      availableCredits: "Crediti disponibili",
    },
  },

  // Earnings List endpoint
  earnings: {
    confirm: {
      post: {
        title: "Confermare le orecchie di rinvio",
        titleShort: "Confermare i guadagni",
        description:
          "Sblocca i guadagni di riferimento la cui finestra di rimborso è passata. Corri ogni giorno.",
        container: {
          title: "Conferma dei guadagni",
          description: "Retribuire i guadagni oltre la finestra di rimborso",
        },
        response: {
          confirmedCount: "Confermato",
          failedCount: "Sfigato",
        },
        success: {
          title: "Guadagni confermati",
          description: "I guadagni di riferimento sono ora spendibili",
        },
      },
      task: {
        description:
          "Trasforma i guadagni di riferimento più vecchi della finestra di rimborso in crediti guadagnati",
      },
    },
    list: {
      get: {
        title: "Storico dei guadagni da inviti",
        titleShort: "Guadagni",
        description: "Consulta lo storico dei guadagni da inviti",
        form: {
          title: "I tuoi guadagni da inviti",
          description: "Consulta i guadagni dei tuoi inviti",
        },
        response: {
          earnings: {
            id: "ID",
            earnerUserId: "Utente di Earner ID",
            sourceUserId: "Utente sorgente ID",
            transactionId: "ID del movimento",
            level: "Livello",
            amountCents: "Importo (centri)",
            currency: "Valuta",
            status: "Stato",
            createdAt: "Creato a",
          },
        },
      },
      success: {
        title: "Guadagni caricati",
        description: "Abbiamo caricato i tuoi guadagni da inviti",
      },
    },
  },

  // Form fields
  form: {
    fields: {
      code: {
        label: "Codice",
        description:
          "Che tipo di persone o vedere nel tuo link. 3-50 caratteri.",
        placeholder: "ad es. ALEX10",
      },
      label: {
        label: "Etichetta (solo lo vedi)",
        description: "Dove lo condividerai.",
        placeholder: "ad es. YouTube bio",
      },
      description: {
        label: "Designazione",
        description: "Descrizione facoltativa",
        placeholder: "Inserisci la descrizione",
      },
      maxUses: {
        label: "Utilizzazioni massime",
        description:
          "Numero massimo di volte che questo codice può essere utilizzato",
        placeholder: "Lasciare vuoto per illimitato",
      },
      expiresAt: {
        label: "Data di scadenza",
        description: "Quando questo codice scade",
        placeholder: "Seleziona una data",
      },
      isActive: {
        label: "Attivo",
        description: "Se questo codice è attualmente attivo",
      },
    },
  },

  // Response fields
  response: {
    id: "ID",
    code: "Codice",
    label: "Etichetta",
    description: "Designazione",
    ownerUserId: "Utente proprietario ID",
    maxUses: "Utilizzazioni massime",
    currentUses: "Usi correnti",
    expiresAt: "Scadenza",
    isActive: "Attivo",
    createdAt: "Creato a",
    updatedAt: "Aggiornato At",
    referralCode: "Codice invito",
    success:
      "🎉 Il tuo codice invito è pronto! Copia il link qui sotto e guadagna il {{directPct}} di commissione su ogni abbonamento, più i bonus degli inviti dei tuoi iscritti.",
    message: "Messaggio",
  },

  // Admin payout management
  admin: {
    payouts: {
      get: {
        title: "Richieste di pagamento",
        titleShort: "Richieste",
        description: "Gestire richieste di pagamento referral",
      },
      post: {
        title: "Sovvenzione del processo",
        titleShort: "Sovvenzione del processo",
        description: "Approva, rifiuta o completa una richiesta di pagamento",
      },
      fields: {
        search: {
          label: "E-mail partner",
          description: "Ricerca per indirizzo e-mail completo o parziale.",
        },
        userId: {
          label: "Account partner",
        },
        page: {
          label: "Pagina",
        },
        limit: {
          label: "Risultati per pagina",
        },
        status: {
          all: "Tutti gli stati",
          label: "Filtro di stato",
          description: "Filtra per lo stato di pagamento",
        },
        requestId: {
          label: "Richiesta ID",
          description: "Identificatore di richiesta di pagamento",
        },
        action: {
          label: "Azione",
          description: "Azione da eseguire sulla richiesta di pagamento",
        },
        adminNotes: {
          label: "Note di amministrazione",
          description: "Note opzionali per questa azione",
        },
        rejectionReason: {
          label: "Ragione di iniezione",
          description: "Motivo per rifiutare la richiesta di pagamento",
        },
      },
      widget: {
        empty: "Nessuna richiesta di pagamento trovata",
        emptyHint: "Prova un'email o uno stato diverso.",
        results: "{{count}} richieste di pagamento",
        apply: "Applicare i filtri",
        clear: "Cancella filtri",
        refresh: "Aggiorna",
        loading: "Caricamento delle richieste di pagamento...",
        amount: "{{credits}} ha guadagnato crediti · Valore {{value}} USD",
        payoutSummary: "{{amount}} · Destinazione: {{currency}}",
        requestedAt: "Richiesta {{date}}",
        processedAt: "Aggiornato {{date}}",
        rejectionReason: "Motivo: {{reason}}",
        adminNotes: "Note: {{notes}}",
        openPartner: "Partner aperto",
        openPartnerFor: "Account partner aperto per {{email}}",
        actionFor: "Pagamento {{action}} per {{email}}",
        previous: "Pagina precedente",
        next: "Pagina successiva",
        page: "Pagina {{page}} di {{total}}",
        confirmAction: "Confermare l'azione",
        lookupFailed: "Incapace di caricare la richiesta di pagamento.",
        state: "Stato",
        valueLabel: "Valore richiesto",
        destinationLabel: "Destinazione",
        actionSaved: "Azione di pagamento salvata.",
        approveDetail:
          "Approvazione mantiene i crediti guadagnati riservati per questa vincita.",
        rejectDetail:
          "Rejection rilascia i crediti guadagnati riservati per questa vincita.",
        completeDetail:
          "Contrassegnare la vincita completa dopo l'invio del trasferimento. Questo deduce i crediti corrispondenti guadagnati.",
        approve: "Approvo",
        reject: "Rifiuti",
        complete: "Completato",
        credits: "crediti",
      },
    },
  },

  // Payout endpoint + errors
  payout: {
    get: {
      title: "I tuoi guadagni",
      titleShort: "I miei guadagni",
      description: "Consulta lo storico dei guadagni da inviti e dei prelievi",
    },
    post: {
      title: "Richiedi un prelievo",
      titleShort: "Richiedi un prelievo",
      description: "Preleva i guadagni dei tuoi inviti",
    },
    fields: {
      amountCents: {
        label: "Importo (crediti)",
        description: "Importo da prelevare in crediti",
        placeholder: "ad esempio 5000",
      },
      currency: {
        label: "Metodo di prelievo",
        description: "Scegli come ricevere i tuoi guadagni",
      },
      walletAddress: {
        label: "Indirizzo del wallet",
        description: "Obbligatorio per i prelievi in BTC o USDC",
        placeholder: "L’indirizzo del tuo wallet",
      },
    },
    widget: {
      totalEarned: "Guadagni totali",
      available: "Disponibile",
      locked: "Bloccati",
      credits: "crediti",
      readyForPayout: "disponibili per il prelievo",
      moreToUnlock: "mancanti per il prelievo",
      pendingConfirmation: "in attesa di conferma",
      requestPayout: "Richiedi un prelievo",
      payoutHistory: "Storico dei prelievi",
      noPayout: "Nessuna richiesta di prelievo per ora",
      howItWorksTitle: "Come funziona",
      step1Title: "Crea codici invito",
      step1Body:
        "Crea un codice diverso per ogni pubblico. Per esempio amici, social o campagne.",
      step2Title: "Condividi il tuo link o quello di una skill",
      step2Body:
        "Link invito: guadagni il {{directPct}} su ogni pagamento dell’utente che hai invitato, per sempre. Se altri condividono una tua skill, guadagni il {{skillBonusPct}} su ogni pagamento degli utenti arrivati da quei link.",
      step3Title: "Riscuoti i tuoi guadagni",
      step3Body:
        "I guadagni si sbloccano {{holdDays}} giorni dopo ogni pagamento, al termine del periodo di rimborso. Poi puoi usarli come crediti per la chat o prelevarli in criptovaluta.",
      withdrawTitle: "Preleva i tuoi guadagni",
      withdrawDescription: "Scegli come usare i guadagni dei tuoi inviti",
      useAsCredits: "Usa come crediti per la chat",
      useAsCreditsDesc:
        "Converti subito i guadagni in crediti per chattare con l’IA.",
      cryptoPayout: "Preleva in criptovaluta",
      cryptoPayoutDesc: "Richiedi un prelievo in BTC o USDC sul tuo wallet.",
      minimumNote:
        "Prelievo minimo: {{minPayout}}. Elaboriamo i prelievi in criptovaluta entro {{cryptoPayoutHours}} ore dall’approvazione.",
      progressLabel: "Avanzamento verso il prelievo",
      unlockedOf: "disponibili su",
      viewHistory: "Vedi lo storico",
      historyEmpty: "Qui vedrai i tuoi prelievi",
      pendingTitle: "{{amount}} in attesa",
      pendingNote:
        "I guadagni si sbloccano {{holdDays}} giorni dopo ogni pagamento, al termine del periodo di rimborso. Un rimborso annulla i guadagni relativi al pagamento.",
    },
    email: {
      user: {
        subjectCrypto: "Richiesta di prelievo ricevuta",
        subjectCredits: "Crediti convertiti",
        titleCrypto: "La tua richiesta di prelievo",
        titleCredits: "Crediti convertiti",
        previewCrypto: "Stiamo elaborando la tua richiesta di prelievo",
        previewCredits: "Abbiamo convertito i tuoi crediti",
        bodyCrypto:
          "Abbiamo ricevuto la tua richiesta di prelievo. Dopo l’approvazione dell’amministratore, elaboriamo i prelievi in criptovaluta entro {{cryptoPayoutHours}} ore.",
        bodyCredits:
          "Abbiamo convertito subito i guadagni dei tuoi inviti in crediti per la chat e li abbiamo aggiunti al tuo account.",
        followUpCrypto:
          "Ti invieremo un’altra email quando avremo elaborato il prelievo.",
        labelAmount: "Importo",
        labelMethod: "Metodo",
        labelWallet: "Portafoglio",
        credits: "crediti",
      },
      admin: {
        subject: "Nuova richiesta di prelievo",
        title: "Nuova richiesta di prelievo",
        preview: "Richiesta di prelievo inviata",
        body: "Un utente ha inviato una richiesta di prelievo.",
        footer:
          "Controlla ed elabora la richiesta nel pannello di amministrazione.",
        labelUser: "Utente",
        labelAmount: "Importo",
        labelCurrency: "Valuta",
        labelWallet: "Portafoglio",
        credits: "crediti",
      },
    },
    errors: {
      minimumAmount: "Il prelievo minimo è di {{minPayout}}",
      walletRequired:
        "Per i prelievi in criptovaluta serve un indirizzo del wallet",
      insufficientBalance: "Saldo insufficiente per il prelievo",
      conversionFailed:
        "Conversione non riuscita. I tuoi guadagni sono ancora disponibili. Riprova tra un minuto.",
      notFound: "Richiesta di prelievo non trovata",
      invalidStatus:
        "Richiesta di pagamento non valido stato per questa operazione",
    },
    success: {
      creditsConverted: "Crediti convertiti",
      payoutRequested:
        "Richiesta di prelievo inviata. Sarà elaborata entro {{hours}} ore.",
    },
  },

  // Error types
  errors: {
    validation: {
      title: "Errore di convalida",
      description: "Parametri del codice di riferimento non valido",
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
      description: "Codice di riferimento non trovato",
    },
    not_found: "Codice di riferimento non trovato",
    server: {
      title: "Errore del server",
      description: "Si è verificato un errore interno del server",
    },
    serverError: {
      title: "Errore del server",
      description: "Si è verificato un errore interno del server",
      detail: "Qualcosa si è rotto alla nostra fine: {{error}}",
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
      description: "Codice di riferimento già esiste",
    },
    code_exists: "Questo codice di riferimento esiste già",
    code_expired: "Questo codice di riferimento è scaduto",
    code_inactive: "Questo codice di riferimento non è attivo",
    max_uses_reached:
      "Questo codice di riferimento ha raggiunto i suoi massimi utilizzi",
    invalid_code: "Codice di riferimento non valido",
  },

  // Success types
  success: {
    title: "Operazione riuscita",
    description: "Operazione completata",
    code_created: "Codice di riferimento creato con successo",
    code_updated: "Codice di riferimento aggiornato con successo",
    code_deactivated: "Codice di riferimento disattivato con successo",
  },

  // Enum translations
  enums: {
    sourceType: {
      subscription: "Abbonamento",
      creditPack: "Pacchetto di crediti",
    },
    earningStatus: {
      pending: "Finanziamenti",
      confirmed: "Confermato",
      canceled: "Annullamento",
    },
    payoutCurrency: {
      usdc: "USDC",
      btc: "Bitcoin",
      credits: "Crediti",
    },
    payoutStatus: {
      pending: "Finanziamenti",
      processing: "Lavorazione",
      completed: "Completo",
      failed: "Sfigato",
      rejected: "Rifiuti",
      approved: "Approvazione",
    },
  },
};
