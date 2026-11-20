import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Abbonamenti",
  tags: {
    admin: "Amministratore",
    stats: "Statistiche",
    list: "Elenco",
    purchases: "Acquisti",
    referrals: "Referrals",
  },
  // Stats endpoint translations
  stats: {
    get: {
      title: "Statistiche dell'abbonamento",
      description: "Revenue, abbonamenti, metriche di credito e di riferimento",
      form: {
        title: "Statistiche Dashboard",
        description: "metriche aziendali aggregate",
      },
      timePeriodOptions: {
        title: "Periodo di tempo",
        description: "Configura l'intervallo di tempo",
      },
      timePeriod: {
        label: "Periodo",
        description: "Intervallo di gruppo",
      },
      dateRangePreset: {
        label: "Gamma di date",
        description: "intervallo di date predefinito",
      },
      response: {
        revenueStats: {
          title: "Entrate",
          description: "Misurazioni delle entrate",
          mrr: { label: "MRR" },
          arr: { label: "ARR" },
          totalRevenue: { label: "Totale delle entrate" },
          avgOrderValue: { label: "Ordine Avg" },
        },
        subscriptionStats: {
          title: "Abbonamenti",
          description: "Conti di abbonamento",
          activeCount: { label: "Attivo" },
          trialingCount: { label: "Trialing" },
          canceledCount: { label: "Annullamento" },
          churnRate: { label: "Tasso di cambio" },
        },
        intervalStats: {
          title: "Intervalli di fatturazione",
          description: "Mensile vs scissione annuale",
          monthlyCount: { label: "Mensile" },
          yearlyCount: { label: "Annuale" },
          yearlyRevenuePct: { label: "% Entrate annuali" },
        },
        creditStats: {
          title: "Crediti",
          description: "metriche del pacchetto di credito",
          totalPurchased: { label: "Acquistato" },
          totalSpent: { label: "Spettacolo" },
          packsSold: { label: "Pacchetti venduti" },
          avgPackSize: { label: "Dimensione del pacchetto di Avg" },
        },
        referralStats: {
          title: "Referrals",
          description: "metriche del programma di riferimento",
          totalReferrals: { label: "Referrali totali" },
          conversionRate: { label: "Conversione" },
          totalEarned: { label: "Totale accumulato" },
          pendingPayouts: { label: "Pagamenti in sospeso" },
        },
        growthMetrics: {
          title: "Crescita",
          description: "Tendenze delle entrate e dell'abbonamento",
          revenueChart: {
            label: "Entrate nel tempo",
            description: "Tendenza delle entrate",
          },
          subscriptionChart: {
            label: "Crescita dell'abbonamento",
            description: "Tendenza di abbonamento attiva",
          },
        },
        businessInsights: {
          title: "Insights",
          description: "metriche generate",
          generatedAt: { label: "Generato a" },
        },
      },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Login necessario per visualizzare le statistiche",
        },
        validation: {
          title: "Errore di convalida",
          description: "Parametri non validi",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso all'amministratore richiesto",
        },
        server: {
          title: "Errore del server",
          description: "Incapace di generare statistiche",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Errore inaspettato si è verificato",
        },
        conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
        network: {
          title: "Errore di rete",
          description: "Incapace di connettersi",
        },
        notFound: {
          title: "Non trovato",
          description: "Statistiche non disponibili",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Operazione riuscita",
        description: "Statistiche generate",
      },
    },
    widget: {
      refresh: "Aggiorna",
      filters: "Filtri",
    },
  },
  // List endpoint translations
  list: {
    get: {
      title: "Elenco delle iscrizioni",
      description: "Sfoglia tutti gli abbonamenti",
      form: {
        title: "Gestione dell'abbonamento",
        description: "Filtra e sfoglia gli abbonamenti",
      },
      searchFilters: {
        title: "Ricerca &amp; Filtri",
        description: "Filtri abbonamenti",
      },
      search: {
        label: "Cerca",
        description: "Ricerca per email o nome dell'utente",
        placeholder: "Abbonamenti di ricerca...",
      },
      status: {
        label: "Stato",
        description: "Filtra per lo stato dell'abbonamento",
        placeholder: "Selezionare lo stato...",
      },
      interval: {
        label: "Frequenza di fatturazione",
        description: "Filtra con intervallo di fatturazione",
        placeholder: "Qualsiasi intervallo",
      },
      provider: {
        label: "Fornitore",
        description: "Filtra con il fornitore di pagamento",
        placeholder: "Qualsiasi fornitore",
      },
      dateFrom: {
        label: "Da",
        description: "Filtro data di inizio",
      },
      dateTo: {
        label: "A",
        description: "Filtro della data di fine",
      },
      sortingOptions: {
        title: "Ordinazione",
        description: "Configurare la selezione dei risultati",
      },
      sortBy: {
        label: "Ordina per",
        description: "Ordinare il campo",
        placeholder: "Seleziona il campo di selezione...",
      },
      sortOrder: {
        label: "Ordinare",
        description: "Ordinare la direzione",
        placeholder: "Seleziona l'ordine...",
      },
      response: {
        title: "Abbonamenti",
        description: "Abbonamenti di corrispondenza",
        subscriptions: {
          id: "ID",
          userEmail: "Email",
          userName: "Nome",
          planId: "Piano",
          billingInterval: "Intervallo",
          status: "Stato",
          createdAt: "Iniziato",
          currentPeriodEnd: "Periodo",
          cancelAtPeriodEnd: "Annullare a fine",
          canceledAt: "Annullato a",
          cancellationReason: "Annullare la Ragione",
          provider: "Fornitore",
          providerSubscriptionId: "Provider ID",
        },
        totalCount: "Totale Abbonamenti",
        pageCount: "Pagine totali",
      },
      page: { label: "Pagina" },
      limit: { label: "Per pagina" },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Login richiesto",
        },
        validation: {
          title: "Errore di convalida",
          description: "Parametri non validi",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso all'amministratore richiesto",
        },
        server: {
          title: "Errore del server",
          description: "Incapace di recuperare gli abbonamenti",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Errore inaspettato",
        },
        conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
        network: {
          title: "Errore di rete",
          description: "Incapace di connettersi",
        },
        notFound: {
          title: "Non trovato",
          description: "Nessun abbonamento trovato",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Modifiche non salvate",
        },
      },
      success: {
        title: "Operazione riuscita",
        description: "Abbonamenti recuperati",
      },
    },
    widget: {
      noSubscriptions: "Nessun abbonamento trovato.",
      noMatchingSubscriptions: "Nessun abbonamento corrisponde ai tuoi filtri.",
      searchPlaceholder: "Cerca per e-mail o nome...",
      refresh: "Aggiorna",
      viewStats: "Statistiche",
    },
  },
  // Purchases endpoint translations
  purchases: {
    get: {
      title: "Acquisti di credito",
      description: "Storia dell'acquisto del pacchetto di credito",
      form: {
        title: "Storia dell'acquisto",
        description: "Sfoglia gli acquisti del pacchetto di credito",
      },
      searchFilters: {
        title: "Ricerca &amp; Filtri",
        description: "Filtri acquisti",
      },
      search: {
        label: "Cerca",
        description: "Ricerca per email dell'utente",
        placeholder: "Acquisti di ricerca...",
      },
      packType: {
        label: "Tipo di pacchetto",
        description: "Filtra per tipo di pacchetto di credito",
        placeholder: "Qualsiasi tipo",
      },
      source: {
        label: "Fonte",
        description: "Filtra per fonte di acquisto",
        placeholder: "Qualsiasi fonte",
      },
      dateFrom: {
        label: "Da",
        description: "Filtro data di inizio",
      },
      dateTo: {
        label: "A",
        description: "Filtro della data di fine",
      },
      sortingOptions: {
        title: "Ordinazione",
        description: "Configurare la selezione dei risultati",
      },
      sortBy: {
        label: "Ordina per",
        description: "Ordinare il campo",
        placeholder: "Seleziona il campo di selezione...",
      },
      sortOrder: {
        label: "Ordinare",
        description: "Ordinare la direzione",
        placeholder: "Seleziona l'ordine...",
      },
      response: {
        title: "Acquisti",
        description: "Storia dell'acquisto del pacchetto di credito",
        purchases: {
          id: "ID",
          userEmail: "Email",
          userName: "Nome",
          packType: "Tipologia",
          source: "Fonte",
          originalAmount: "Importo",
          remaining: "Rimanere",
          expiresAt: "Scadenze",
          createdAt: "Acquistato",
        },
        totalCount: "Acquisti totali",
        pageCount: "Pagine totali",
      },
      page: { label: "Pagina" },
      limit: { label: "Per pagina" },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Login richiesto",
        },
        validation: {
          title: "Errore di convalida",
          description: "Parametri non validi",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso all'amministratore richiesto",
        },
        server: {
          title: "Errore del server",
          description: "Incapace di recuperare gli acquisti",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Errore inaspettato",
        },
        conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
        network: {
          title: "Errore di rete",
          description: "Incapace di connettersi",
        },
        notFound: {
          title: "Non trovato",
          description: "Nessun acquisto trovato",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Modifiche non salvate",
        },
      },
      success: {
        title: "Operazione riuscita",
        description: "Acquisti recuperati",
      },
    },
    widget: {
      noPurchases: "Nessun acquisto del pacchetto di credito trovato.",
      noMatchingPurchases: "Nessun acquisto corrisponde ai tuoi filtri.",
      searchPlaceholder: "Cerca per e-mail...",
      refresh: "Aggiorna",
      expired: "Scadenza",
      neverExpires: "Mai.",
    },
  },
  // Referrals endpoint translations
  referrals: {
    get: {
      title: "Referral Dashboard",
      description: "Codici invito, guadagni e pagamenti",
      form: {
        title: "Gestione del riferimento",
        description: "Gestire il programma di riferimento",
      },
      searchFilters: {
        title: "Ricerca &amp; Filtri",
        description: "Filtra i dati di riferimento",
      },
      search: {
        label: "Cerca",
        description: "Ricerca per email dell'utente",
        placeholder: "Cerca i rinvii...",
      },
      payoutStatus: {
        label: "Stato di pagamento",
        description: "Filtra per richiesta di pagamento stato",
        placeholder: "Qualsiasi stato",
      },
      dateFrom: {
        label: "Da",
        description: "Filtro data di inizio",
      },
      dateTo: {
        label: "A",
        description: "Filtro della data di fine",
      },
      sortingOptions: {
        title: "Ordinazione",
        description: "Configurare la selezione dei risultati",
      },
      sortBy: {
        label: "Ordina per",
        description: "Ordinare il campo",
        placeholder: "Seleziona il campo di selezione...",
      },
      sortOrder: {
        label: "Ordinare",
        description: "Ordinare la direzione",
        placeholder: "Seleziona l'ordine...",
      },
      response: {
        title: "Referrals",
        description: "Dati del programma di riferimento",
        summary: {
          title: "Riepilogo",
          description: "Statistiche di riferimento Aggregate",
          totalCodes: { label: "Codici totali" },
          totalSignups: { label: "Totale iscrizioni" },
          totalEarned: { label: "Totale accumulato" },
          totalPaidOut: { label: "Totale pagato" },
          pendingPayouts: { label: "Pagamenti in sospeso" },
        },
        codes: {
          code: "Codice",
          ownerEmail: "Proprietario",
          ownerName: "Nome",
          currentUses: "Clics",
          totalSignups: "Iscrizione",
          totalEarned: "Guarnizione",
          isActive: "Attivo",
          createdAt: "Creato",
        },
        payoutRequests: {
          id: "ID",
          userEmail: "Utente",
          amountCents: "Importo",
          currency: "Valuta",
          status: "Stato",
          walletAddress: "Portafoglio",
          adminNotes: "Osservazioni",
          rejectionReason: "Ragione di iniezione",
          createdAt: "Richiesta",
          processedAt: "Elaborazione",
        },
        totalCount: "Totale",
        pageCount: "Pagine totali",
      },
      page: { label: "Pagina" },
      limit: { label: "Per pagina" },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Login richiesto",
        },
        validation: {
          title: "Errore di convalida",
          description: "Parametri non validi",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso all'amministratore richiesto",
        },
        server: {
          title: "Errore del server",
          description: "Incapace di recuperare i rinvii",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Errore inaspettato",
        },
        conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
        network: {
          title: "Errore di rete",
          description: "Incapace di connettersi",
        },
        notFound: {
          title: "Non trovato",
          description: "Nessun dato di riferimento trovato",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Modifiche non salvate",
        },
      },
      success: {
        title: "Operazione riuscita",
        description: "Referrali recuperati",
      },
    },
    post: {
      title: "Azione di pagamento",
      description: "Approva, rifiuta o completa una richiesta di pagamento",
      form: {
        title: "Azione di pagamento",
        description: "Elaborare una richiesta di pagamento",
      },
      requestId: {
        label: "Richiesta ID",
        description: "Richiesta di pagamento al processo",
        placeholder: "Inserire la richiesta ID...",
      },
      action: {
        label: "Azione",
        description: "Azione da prendere",
        placeholder: "Selezionare l'azione...",
      },
      adminNotes: {
        label: "Note di amministrazione",
        description: "Note opzionali",
        placeholder: "Aggiungi note...",
      },
      rejectionReason: {
        label: "Ragione di iniezione",
        description: "Obbligatorio quando si rifiuta",
        placeholder: "Inserire il motivo...",
      },
      response: {
        title: "Risultato",
        description: "Risultato dell'azione",
        success: "Operazione riuscita",
        message: "Messaggio",
      },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Login richiesto",
        },
        validation: {
          title: "Errore di convalida",
          description: "Parametri non validi",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso all'amministratore richiesto",
        },
        server: {
          title: "Errore del server",
          description: "Incapace di elaborare la vincita",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Errore inaspettato",
        },
        conflict: {
          title: "Conflitto",
          description: "Pagamenti già elaborati",
        },
        network: {
          title: "Errore di rete",
          description: "Incapace di connettersi",
        },
        notFound: {
          title: "Non trovato",
          description: "Richiesta di pagamento non trovata",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Modifiche non salvate",
        },
      },
      success: {
        title: "Operazione riuscita",
        description: "Pagamenti trattati",
      },
    },
    widget: {
      noReferrals: "Nessun codice invito trovato.",
      noPayouts: "Nessuna richiesta di pagamento.",
      approve: "Approvo",
      reject: "Rifiuti",
      complete: "Completato",
      sectionCodes: "Codici invito",
      sectionPayouts: "Richieste di pagamento",
      refresh: "Aggiorna",
      codeActive: "Attivo",
      codeInactive: "Inattivo",
      clicks: "clicks",
      signups: "segnalazioni",
      earned: "guadagnato",
      confirm: {
        title: "Confermare l'azione di pagamento",
        description:
          "Sei sicuro di voler procedere con questa azione di pagamento? Questo non può essere annullato.",
        cancel: "Annulla",
        proceed: "Procedimento",
      },
    },
  },
  // Enum translations
  enums: {
    subscriptionStatusFilter: {
      incomplete: "Incompleto",
      incompleteExpired: "Incompleto scaduto",
      all: "Tutti",
      active: "Attivo",
      trialing: "Trialing",
      pastDue: "Passato",
      canceled: "Annullamento",
      unpaid: "Non pagato",
      paused: "Paused",
    },
    billingIntervalFilter: {
      any: "Qualsiasi",
      monthly: "Mensile",
      yearly: "Annuale",
    },
    providerFilter: {
      any: "Qualsiasi",
      stripe: "Stripe",
      nowpayments: "NowPayments",
    },
    subscriptionSortField: {
      periodEnd: "Periodo",
      createdAt: "Creato a",
      status: "Stato",
      interval: "Intervallo",
      userEmail: "Email utente",
    },
    sortOrder: {
      asc: "Assunzione",
      desc: "Discussione",
    },
    creditPackTypeFilter: {
      any: "Qualsiasi",
      subscription: "Abbonamento",
      permanent: "Permanente",
      bonus: "Bonus",
      earned: "Guarnizione",
    },
    creditPackSourceFilter: {
      any: "Qualsiasi",
      stripePurchase: "Stripe acquisto",
      stripeSubscription: "Sovvenzione di abbonamento",
      adminGrant: "Sovvenzione di Admin",
      referralEarning: "Guarnizione di riferimento",
    },
    purchaseSortField: {
      createdAt: "Creato a",
      amount: "Importo",
      type: "Tipologia",
      userEmail: "Email utente",
    },
    payoutStatusFilter: {
      all: "Tutti",
      pending: "Finanziamenti",
      approved: "Approvazione",
      rejected: "Rifiuti",
      processing: "Lavorazione",
      completed: "Completo",
      failed: "Sfigato",
    },
    referralSortField: {
      createdAt: "Creato a",
      earnings: "Guadagni totali",
      signups: "Iscrizione",
    },
    payoutAction: {
      approve: "Approvo",
      reject: "Rifiuti",
      complete: "Completato",
    },
  },
};
