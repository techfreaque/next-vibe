import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Utenti",
  get: {
    title: "Utenti",
    titleShort: "Utenti",
    description: "Ogni conto con quello che ha pagato, quello che spende e quando è stato l'ultimo attivo. Cerca, filtra per entrate, attività, data di registrazione o fonte, ordina da qualsiasi colonna di denaro.",
    fields: {
      search: {
        label: "Conti di ricerca",
        description: "Email, nome o l'avvio di un utente ID",
        placeholder: "Cerca email, nome o ID..."
      },
      roles: {
        label: "Roles",
        description: "Utenti che svolgono uno di questi ruoli",
        placeholder: "Qualsiasi ruolo"
      },
      accountState: {
        label: "Stato dell'account",
        description: "Attivo, inattivo, vietato, verificato o non verificato",
        placeholder: "Qualsiasi stato"
      },
      payer: {
        label: "Pagato o gratuito",
        description: "Pagato = almeno un pagamento di successo mai",
        placeholder: "Pagato o gratuito"
      },
      subscription: {
        label: "Abbonamento",
        description: "Abbonamento attivo ora, mai sottoscritto, o mai",
        placeholder: "Qualsiasi abbonamento"
      },
      lastActive: {
        label: "Ultimo attivo",
        description: "Attività = spesa di credito (portafogli personali o collegati) o un nuovo login",
        placeholder: "Ogni volta"
      },
      signupFrom: {
        label: "Iscritti da",
        description: "Primo giorno di iscrizione per includere"
      },
      signupTo: {
        label: "Registrati a",
        description: "Ultimo giorno di iscrizione per includere"
      },
      creditsMin: {
        label: "Crediti almeno",
        description: "Bilancia portafoglio minimo"
      },
      creditsMax: {
        label: "Crediti al massimo",
        description: "Saldo massimo del portafoglio"
      },
      source: {
        label: "Fonte",
        description: "Canale di primo contatto, sorgente UTM/medium/campaign, host del referrer o codice di riferimento",
        placeholder: "google, ref:, newsletter..."
      },
      referralActivity: {
        label: "Come referente",
        description: "Utenti che condividono un link di riferimento e che cosa ha prodotto",
        placeholder: "Qualsiasi"
      },
      sortBy: {
        label: "Ordina per",
        description: "Colonna da ordinare"
      },
      sortOrder: {
        label: "Ordinanza",
        description: "Assunzione o discesa"
      },
      page: {
        label: "Pagina",
        description: "Numero di pagina, inizia a 1"
      },
      limit: {
        label: "Per pagina",
        description: "Utenti per pagina (max 200)"
      }
    },
    response: {
      users: "Utenti",
      summary: "Riepilogo"
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per visualizzare gli utenti"
      },
      validation: {
        title: "Filtri non validi",
        description: "Controlla i valori del filtro e riprova"
      },
      forbidden: {
        title: "Admins solo",
        description: "Hai bisogno del ruolo di amministratore per visualizzare gli utenti"
      },
      server: {
        title: "Non è possibile caricare gli utenti",
        description: "Il server non è riuscito a caricare l'elenco utente"
      },
      unknown: {
        title: "Errore inaspettato",
        description: "Qualcosa è andato male gli utenti di caricamento"
      },
      conflict: {
        title: "Conflitto",
        description: "La richiesta è in conflitto con i dati attuali"
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile raggiungere il server"
      },
      notFound: {
        title: "Nessun utente",
        description: "Nessun utente corrisponde a questi filtri"
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate"
      }
    },
    success: {
      title: "Utenti caricati",
      description: "Lista utente caricata"
    }
  },
  enums: {
    sortOrder: {
      asc: "Assunzione",
      desc: "Discussione"
    },
    role: {
      admin: "Amministratore",
      customer: "Cliente",
      partnerAdmin: "Amministratore di partner",
      partnerEmployee: "Dipendente del partner",
      public: "Pubblico"
    },
    subscription: {
      any: "Qualsiasi",
      hasActive: "Attivo ora",
      hadAny: "Mai sottoscritto",
      never: "Non abbonati"
    },
    referrer: {
      any: "Qualsiasi",
      hasCode: "Ha un link di riferimento",
      hasClicks: "Collegamento ottenuto clic",
      hasSignups: "Collegamento ottenuto iscrizioni",
      hasSubscribers: "Link ha pagato gli abbonati"
    },
    sortField: {
      createdAt: "Data di iscrizione",
      lastActive: "Ultimo attivo",
      credits: "Bilancio di credito",
      totalPaid: "Totale pagato",
      creditsSpent: "Crediti spesi",
      email: "Email",
      name: "Nome"
    },
    accountState: {
      active: "Attivo",
      inactive: "Inattivo",
      banned: "Banati",
      verified: "Email verificata",
      unverified: "Email unverified"
    },
    payer: {
      any: "Pagato o gratuito",
      paid: "Pagamenti",
      free: "Mai pagato"
    },
    lastActive: {
      any: "Ogni volta",
      day: "Ultime 24 ore",
      week: "Ultimi 7 giorni",
      month: "Ultimi 30 giorni",
      dormant: "Dormant 30 giorni",
      never: "Mai attivo"
    }
  },
  widget: {
    creditsAny: "Qualsiasi",
    titleWithCount: "Utenti ({{count}})",
    loading: "Caricamento degli utenti...",
    never: "Mai.",
    referredBy: "via {{email}}",
    actions: {
      stats: "Stat",
      refresh: "Aggiorna",
      newUser: "Nuovo utente",
      clearFilters: "Cancella filtri",
      moreFilters: "Filtri"
    },
    kpi: {
      matching: "Utenti abbinati",
      paying: "Pagamenti",
      payingShare: "{{percent}} % di corrispondenza",
      revenue: "Entrate a vita",
      revenueHint: "Pagamento garantito, USD",
      credits: "Crediti detenuti",
      creditsHint: "Somma di bilancia portafogli"
    },
    quick: {
      paying: "Pagamenti",
      free: "Mai pagato",
      activeWeek: "Attivo 7d",
      dormant: "Dormant 30d+",
      never: "Mai attivo"
    },
    columns: {
      user: "Utente",
      joined: "Adeguato",
      lastActive: "Ultimo attivo",
      credits: "Crediti",
      spent: "Spettacolo",
      paid: "Pagato",
      subscription: "Piano",
      source: "Fonte",
      id: "ID"
    },
    flags: {
      admin: "admin",
      banned: "Banati",
      unverified: "Unverified"
    },
    empty: {
      none: "Nessun utente ancora",
      filtered: "Nessun utente corrisponde a questi filtri",
      filteredHint: "Loosen un filtro o cancellarli tutti."
    },
    pagination: {
      showing: "{{start}} - {{end}} di {{total}}"
    },
    text: {
      header: "Utenti {{total}} | {{paying}} pagando le entrate a vita di {{paid}}",
      pageHint: "Pagina {{page}} / {{pages}}. Il prossimo: --page= {{next}}",
      detailHint: "Dettagli: vibe users-view --userId=<ID>"
    }
  }
};
