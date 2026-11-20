import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Abbonamenti",
    titleShort: "Elenco dei membri",
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
        userId: "Cliente ID",
        paymentFailedAt: "Pagamento anticipato",
        gracePeriodEndsAt: "Periodo di grazia termina",
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
        detail:
          "Non è possibile caricare l'elenco degli abbonamenti: {{error}}",
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
    pick: "Seleziona l'abbonamento",
    failedPayments: "Operazioni fallite",
    renewal: "Rinnovo programmato",
    scheduledEnd: "Finisce senza rinnovo",
    notRecorded: "Non registrato",
    customer: "Aprire il cliente",
    paymentAttempts: "Visualizzare i tentativi di pagamento",
    apply: "Applicare i filtri",
    previous: "Precedente",
    next: "Avanti",
    pagination: "Pagina {{page}} degli abbonamenti {{pages}} · {{total}}",
    loading: "Abbonamenti di caricamento",
    customerScope: "Cliente {{id}}",
    clearScope: "Campo di applicazione chiaro",
    noSubscriptions: "Nessun abbonamento trovato.",
    noMatchingSubscriptions: "Nessun abbonamento corrisponde ai tuoi filtri.",
    searchPlaceholder: "Cerca per e-mail o nome...",
    refresh: "Aggiorna",
    viewStats: "Statistiche",
  },
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
  },
};
