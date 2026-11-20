import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Referral Dashboard",
    titleShort: "Referrals dell'amministrazione",
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
    titleShort: "Azione di pagamento",
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
  enums: {
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
    sortOrder: {
      asc: "Assunzione",
      desc: "Discussione",
    },
    payoutAction: {
      approve: "Approvo",
      reject: "Rifiuti",
      complete: "Completato",
    },
  },
};
