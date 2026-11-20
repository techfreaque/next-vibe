import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Acquisti di credito",
    titleShort: "Admin Acquisti",
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
  enums: {
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
    sortOrder: {
      asc: "Assunzione",
      desc: "Discussione",
    },
  },
};
