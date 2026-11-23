import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Utenti",
  get: {
    title: "Utenti",
    titleShort: "Utenti",
    description:
      "Ogni conto con quello che ha pagato, quello che spende e quando è stato l'ultimo attivo. Cerca, filtra per entrate, attività, data di registrazione o fonte, ordina da qualsiasi colonna di denaro.",
    fields: {
      hasSpentCredits: "Crediti utilizzati",
      requiredState: {
        label: "Stato richiesto",
        description: "Il conto deve avere anche questo stato",
      },
      accountLocale: {
        label: "Lingua del conto",
        description: "Codice della lingua esatto, ad esempio it-IT",
      },
      attributedRefCode: {
        label: "Codice invito attribuito",
        description:
          "Codice invito accreditato o, in sua assenza, quello della prima visita",
      },
      search: {
        label: "Conti di ricerca",
        description: "Email, nome o l'avvio di un utente ID",
        placeholder: "Cerca email, nome o ID...",
      },
      roles: {
        label: "Roles",
        description: "Utenti che svolgono uno di questi ruoli",
        placeholder: "Qualsiasi ruolo",
      },
      accountState: {
        label: "Stato dell'account",
        description: "Attivo, inattivo, vietato, verificato o non verificato",
        placeholder: "Qualsiasi stato",
      },
      payer: {
        label: "Pagato o gratuito",
        description: "Pagato = almeno un pagamento di successo mai",
        placeholder: "Pagato o gratuito",
      },
      subscription: {
        label: "Abbonamento",
        description: "Abbonamento attivo ora, mai sottoscritto, o mai",
        placeholder: "Qualsiasi abbonamento",
      },
      lastActive: {
        label: "Ultimo attivo",
        description: "Attività = crediti spesi, accesso o pagamento",
        placeholder: "Ogni volta",
      },
      signupFrom: {
        label: "Iscritti da",
        description: "Primo giorno di iscrizione per includere",
      },
      signupTo: {
        label: "Registrati a",
        description: "Ultimo giorno di iscrizione per includere",
      },
      creditsMin: {
        label: "Crediti almeno",
        description: "Bilancia portafoglio minimo",
      },
      creditsMax: {
        label: "Crediti al massimo",
        description: "Saldo massimo del portafoglio",
      },
      source: {
        label: "Fonte",
        description:
          "Canale di primo contatto, sorgente UTM/medium/campaign, host del referrer o codice di riferimento",
        placeholder: "google, ref:, newsletter...",
      },
      referralActivity: {
        label: "Come referente",
        description:
          "Utenti che condividono un link di riferimento e che cosa ha prodotto",
        placeholder: "Qualsiasi",
      },
      audience: {
        label: "Pubblico",
        description:
          "Solo persone esclude admin e indirizzi di test (example.com, .invalid, fixture .test)",
        placeholder: "Tutti",
      },
      channel: {
        label: "Canale",
        description:
          "Canale del primo contatto, esatto (google, youtube, direct). none = account senza percorso",
        placeholder: "youtube",
      },
      channelType: {
        label: "Tipo di canale",
        description: "Come è arrivato il primo contatto",
        placeholder: "Qualsiasi tipo",
      },
      refCode: {
        label: "Codice referral",
        description:
          "Codice della prima visita o del referral accreditato, esatto",
        placeholder: "FRIEND2024",
      },
      plan: {
        label: "Piano",
        description: "Abbonamento attivo o in prova su questo piano",
        placeholder: "Qualsiasi piano",
      },
      activeFrom: {
        label: "Crediti usati dal",
        description: "Consumo di crediti in questo giorno o dopo",
      },
      activeTo: {
        label: "Crediti usati fino al",
        description: "Consumo di crediti in questo giorno o prima",
      },
      spentMin: {
        label: "Speso almeno",
        description:
          "Crediti spesi in totale. Con Mai pagato trovi chi brucia crediti gratis",
      },
      paidFrom: {
        label: "Pagato dal",
        description: "Pagamento riuscito in questo giorno o dopo",
      },
      paidTo: {
        label: "Pagato fino al",
        description: "Pagamento riuscito in questo giorno o prima",
      },
      sortBy: {
        label: "Ordina per",
        description: "Colonna da ordinare",
      },
      sortOrder: {
        label: "Ordinanza",
        description: "Assunzione o discesa",
      },
      page: {
        label: "Pagina",
        description: "Numero di pagina, inizia a 1",
      },
      limit: {
        label: "Per pagina",
        description: "Utenti per pagina (max 200)",
      },
    },
    response: {
      users: "Utenti",
      summary: "Riepilogo",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per visualizzare gli utenti",
      },
      validation: {
        title: "Filtri non validi",
        description: "Controlla i valori del filtro e riprova",
      },
      forbidden: {
        title: "Admins solo",
        description:
          "Hai bisogno del ruolo di amministratore per visualizzare gli utenti",
      },
      server: {
        title: "Non è possibile caricare gli utenti",
        description: "Il server non è riuscito a caricare l'elenco utente",
      },
      unknown: {
        title: "Errore inaspettato",
        description: "Qualcosa è andato male gli utenti di caricamento",
      },
      conflict: {
        title: "Conflitto",
        description: "La richiesta è in conflitto con i dati attuali",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile raggiungere il server",
      },
      notFound: {
        title: "Nessun utente",
        description: "Nessun utente corrisponde a questi filtri",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    success: {
      title: "Utenti caricati",
      description: "Lista utente caricata",
    },
  },
  enums: {
    audience: {
      all: "Tutti",
      humans: "Solo persone",
    },
    channelType: {
      campaign: "Campagna",
      referral: "Referral",
      organic: "Organico",
      direct: "Diretto",
    },
    plan: {
      subscription: "Starter",
      plus: "Plus",
      pro: "Pro",
      ultra: "Ultra",
    },
    sortOrder: {
      asc: "Assunzione",
      desc: "Discussione",
    },
    role: {
      admin: "Amministratore",
      customer: "Cliente",
      partnerAdmin: "Amministratore di partner",
      partnerEmployee: "Dipendente del partner",
      public: "Pubblico",
    },
    subscription: {
      any: "Qualsiasi",
      hasActive: "Attivo ora",
      hadAny: "Mai sottoscritto",
      never: "Non abbonati",
    },
    referrer: {
      any: "Qualsiasi",
      hasCode: "Ha un link di riferimento",
      hasClicks: "Collegamento ottenuto clic",
      hasSignups: "Collegamento ottenuto iscrizioni",
      hasSubscribers: "Link ha pagato gli abbonati",
    },
    sortField: {
      createdAt: "Data di iscrizione",
      lastActive: "Ultimo attivo",
      credits: "Bilancio di credito",
      totalPaid: "Totale pagato",
      creditsSpent: "Crediti spesi",
      email: "Email",
      name: "Nome",
    },
    accountState: {
      active: "Attivo",
      inactive: "Inattivo",
      banned: "Banati",
      verified: "Email verificata",
      unverified: "Email unverified",
    },
    payer: {
      any: "Pagato o gratuito",
      paid: "Pagamenti",
      free: "Mai pagato",
    },
    lastActive: {
      any: "Ogni volta",
      day: "Ultime 24 ore",
      week: "Ultimi 7 giorni",
      month: "Ultimi 30 giorni",
      dormant: "Dormant 30 giorni",
      never: "Mai attivo",
    },
  },
  widget: {
    spent30d: "{{count}} in 30 gg",
    notTracked: "non tracciato",
    oneOff: "Solo crediti",
    refCode: "ref:{{code}}",
    chips: {
      paid: "Pagato",
      signedUp: "Iscritto",
      spentCredits: "Crediti usati",
      remove: "Rimuovi filtro {{label}}",
    },
    creditsAny: "Qualsiasi",
    titleWithCount: "Utenti ({{count}})",
    loading: "Caricamento degli utenti...",
    never: "Mai.",
    referredBy: "via {{email}}",
    actions: {
      open: "Aperto",
      select: "Seleziona",
      openUser: "Aprire il conto per {{email}}",
      selectUser: "Selezionare {{email}}",
      stats: "Report iscrizioni",
      refresh: "Aggiorna",
      newUser: "Nuovo utente",
      clearFilters: "Cancella filtri",
      moreFilters: "Filtri",
    },
    kpi: {
      activeSpentHint: "{{credits}} crediti spesi in 30 giorni",
      matchingHint:
        "Iscrizioni a settimana, ultime 12 settimane complete. Settimana scorsa: {{last}}, questa finora: {{count}}",
      verified: "Email verificata",
      verifiedHint: "{{count}} account",
      active: "Attivi 30 gg",
      matching: "Utenti abbinati",
      paying: "Pagamenti",
      payingShare: "{{percent}} % di corrispondenza",
      revenue: "Entrate a vita",
      revenueHint: "Pagamento garantito, USD",
      credits: "Crediti detenuti",
      creditsHint: "Somma di bilancia portafogli",
    },
    quick: {
      freeBurn: "Consumo gratis {{min}}+ ({{count}})",
      banned: "Bannati ({{count}})",
      humans: "Solo persone",
      paying: "Paganti ({{count}})",
      free: "Mai pagato",
      activeWeek: "Attivo 7d",
      dormant: "Dormant 30d+",
      never: "Mai attivo",
    },
    columns: {
      flags: "Segnali",
      user: "Utente",
      joined: "Adeguato",
      lastActive: "Ultimo attivo",
      credits: "Saldo",
      spent: "Speso (totale)",
      paid: "Pagato",
      subscription: "Piano",
      source: "Fonte",
      id: "ID",
    },
    compact: {
      joined: "iscritto il {{date}}",
      active: "attivo {{when}}",
      neverActive: "mai attivo",
      paid: "pagato {{amount}}",
      free: "mai pagato",
      spent: "{{count}} crediti spesi",
    },
    flags: {
      freeBurn: "Consumo gratis",
      admin: "admin",
      banned: "Banati",
      unverified: "Unverified",
    },
    empty: {
      none: "Nessun utente ancora",
      filtered: "Nessun utente corrisponde a questi filtri",
      filteredHint: "Loosen un filtro o cancellarli tutti.",
    },
    pagination: {
      previous: "Pagina precedente",
      next: "Pagina successiva",
      showing: "{{start}} - {{end}} di {{total}}",
    },
    text: {
      subheader:
        "{{verified}} verificati | {{active}} attivi 30 gg | {{banned}} bannati | iscrizioni/settimana (12 sett.): {{weekly}}",
      header:
        "Utenti {{total}} | {{paying}} pagando le entrate a vita di {{paid}}",
      pageHint: "Pagina {{page}} / {{pages}}. Il prossimo: --page= {{next}}",
      detailHint: "Dettagli: vibe users-view --userId=<ID>",
    },
  },
};
