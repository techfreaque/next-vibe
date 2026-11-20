import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Utenti",
  tags: {
    create: "Creare",
    admin: "Amministratore",
    user: "Utente",
    view: "Vista",
    stats: "Statistiche",
  },
  create: {
    category: "Utenti",
    tags: {
      create: "Creare",
      admin: "Amministratore",
    },
    post: {
      title: "Crea utente",
      description: "Creare un nuovo account utente",
      form: {
        title: "Modulo di creazione dell'utente",
        description: "Compila i dettagli per creare un nuovo utente",
      },
      email: {
        label: "Indirizzo email",
        description:
          "Indirizzo email dell'utente per il login e la comunicazione",
      },
      password: {
        label: "Password",
        description: "Password sicura per l'account utente",
      },
      privateName: {
        label: "Nome privato",
        description:
          "Nome completo legale dell'utente (visibile solo agli amministratori)",
      },
      publicName: {
        label: "Nome pubblico",
        description:
          "Nome di visualizzazione dell'utente (visibile a tutti gli utenti)",
      },
      firstName: {
        label: "Nome",
        description: "Nome utente",
      },
      lastName: {
        label: "Ultimo nome",
        description: "cognome dell'utente",
      },
      company: {
        label: "Società",
        description: "Azienda o organizzazione dell'utente",
      },
      phone: {
        label: "Numero di telefono",
        description: "Numero di telefono di contatto dell'utente",
      },
      preferredContactMethod: {
        label: "Metodo di contatto preferito",
        description: "Come l'utente preferisce essere contattato",
      },
      roles: {
        label: "Ruoli utente",
        description: "Assegnare ruoli all'utente",
      },
      imageUrl: {
        label: "Immagine del profilo URL",
        description: "URL all'immagine del profilo dell'utente",
      },
      bio: {
        label: "Biografia",
        description: "Breve descrizione dell'utente",
      },
      website: {
        label: "Sito web",
        description: "Sito personale o aziendale dell'utente",
      },
      jobTitle: {
        label: "Titolo del lavoro",
        description: "Titolo o posizione del lavoro dell'utente",
      },
      emailVerified: {
        label: "E-mail verificato",
        description: "Se l'e-mail dell'utente è verificata",
      },
      isActive: {
        label: "Stato attivo",
        description: "Se l'account utente è attivo",
      },
      leadId: {
        label: "ID del contatto",
        description: "Identificatore di contatto associato",
      },
      country: {
        label: "Paese",
        description: "Paese di residenza dell'utente",
      },
      language: {
        label: "Lingua",
        description: "La lingua preferita dell'utente",
      },
      response: {
        title: "Creato dall'utente",
        description: "Dettagli dell'utente appena creato",
        id: {
          content: "Utente ID",
        },
        leadId: {
          content: "Contatto associato ID",
        },
        country: {
          label: "Paese",
          description: "Paese di residenza dell'utente",
        },
        language: {
          label: "Lingua",
          description: "La lingua preferita dell'utente",
        },
        email: {
          content: "Indirizzo email",
        },
        privateName: {
          content: "Nome privato",
        },
        publicName: {
          content: "Nome pubblico",
        },
        firstName: {
          content: "Nome",
        },
        lastName: {
          content: "Ultimo nome",
        },
        company: {
          content: "Società",
        },
        phone: {
          content: "Numero di telefono",
        },
        preferredContactMethod: {
          content: "Metodo di contatto preferito",
        },
        imageUrl: {
          content: "Immagine del profilo",
        },
        bio: {
          content: "Biografia",
        },
        website: {
          content: "Sito web",
        },
        jobTitle: {
          content: "Titolo del lavoro",
        },
        emailVerified: {
          content: "E-mail verificato",
        },
        isActive: {
          content: "Stato attivo",
        },
        stripeCustomerId: {
          content: "Stripe cliente ID",
        },
        userRoles: {
          content: "Ruoli utente",
          id: {
            content: "Role ID",
          },
          role: {
            content: "Role",
          },
        },
        createdAt: {
          content: "Creato a",
        },
        updatedAt: {
          content: "Aggiornato At",
        },
      },
      errors: {
        unauthorized: {
          title: "Accesso non autorizzato",
          description: "Devi essere connesso per creare utenti",
        },
        validation: {
          title: "Convalida non riuscita",
          description: "Si prega di controllare i dati del modulo e riprovare",
        },
        server: {
          title: "Errore del server",
          description:
            "Incapace di creare l'utente a causa dell'errore del server",
        },
        unknown: {
          title: "Errore sconosciuto",
          description:
            "Un errore inaspettato si è verificato durante la creazione dell'utente",
        },
        network: {
          title: "Errore di rete",
          description:
            "La connessione di rete è fallita durante la creazione dell'utente",
        },
        forbidden: {
          title: "Accesso Proibito",
          description: "Non hai il permesso di creare utenti",
        },
        notFound: {
          title: "Risorse non trovata",
          description:
            "risorsa necessaria non trovata per la creazione dell'utente",
        },
        conflict: {
          title: "Utente già esistente",
          description: "Un utente con questa e-mail esiste già",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai dei cambiamenti non salvati che saranno persi",
        },
        internal: {
          title: "Errore interno",
          description:
            "Si è verificato un errore interno durante la creazione dell'utente",
        },
      },
      sms: {
        errors: {
          welcome_failed: {
            title: "SMS Benvenuto non riuscito",
            description: "Non ha inviato il benvenuto SMS all'utente",
          },
          verification_failed: {
            title: "La verifica di SMS non è riuscita",
            description:
              "Non è stato possibile inviare la verifica SMS all'utente",
          },
        },
      },
      success: {
        title: "Utente Creato con successo",
        description: "Il nuovo account utente è stato creato",
        message: {
          content: "Utente creato con successo",
        },
        created: {
          content: "Creato",
        },
      },
    },
    widget: {
      headerCreated: "Creato dall'utente",
      headerCreate: "Crea utente",
      headerSubtitle: "Creare un nuovo utente amministratore o account cliente",
      activeBadge: "Attivo",
      verifiedBadge: "Verificato",
      copiedTooltip: "Copiato",
      copyUserIdTooltip: "Copia utente ID",
      copyIdButton: "Copia ID",
      copiedButton: "Copiato",
      viewUserButton: "Visualizza utente",
      fullProfileButton: "Profilo completo",
      creditHistoryButton: "Storico crediti",
      createAnotherButton: "Crea un altro utente",
      createdPrefix: "Creato",
    },
    email: {
      users: {
        welcome: {
          greeting: "Benvenuto nella nostra piattaforma, {{firstName}}!",
          preview: "Il tuo account è stato creato con successo",
          subject: "Benvenuto a {{companyName}} - Il tuo account è pronto!",
          introduction:
            "Ciao {{firstName}}, siamo entusiasti di averti a bordo! Il tuo account è stato creato con successo e ora puoi accedere a tutte le nostre funzionalità.",
          accountDetails: "Dettagli dell'account",
          email: "Email",
          name: "Nome",
          publicName: "Nome dell'esposizione",
          company: "Società",
          phone: "Telefono",
          nextSteps: "Prossimo passo",
          loginButton: "Accedi al tuo account",
          support:
            "Se avete domande, il nostro team di supporto è qui per aiutare. Contattaci in qualsiasi momento!",
        },
        admin: {
          newUser: "Nuovo utente Creato",
          preview: "È stato creato un nuovo utente {{firstName}} {{lastName}}",
          subject: "Nuovo account utente creato - {{firstName}} {{lastName}}",
          notification:
            "Nel sistema è stato creato un nuovo account utente. Ecco i dettagli:",
          userDetails: "Dettagli utente",
          viewUser: "Visualizza profilo utente",
        },
        errors: {
          missing_data:
            "I dati dell'utente richiesti sono mancanti per il modello di e-mail",
        },
        error: {
          general: {
            internal_server_error:
              "Si è verificato un errore del server interno",
          },
        },
        labels: {
          id: "ID:",
          email: "Email:",
          name: "Nome:",
          privateName: "Nome completo:",
          publicName: "Nome dell'esposizione:",
          company: "Società:",
          created: "Creato:",
          leadId: "Contatto ID:",
        },
      },
    },
    sms: {
      welcome: {
        message:
          "Benvenuto {{firstName}}! Il tuo account è stato creato con successo. Visitaci a {{appUrl}}",
      },
      verification: {
        message:
          "{{firstName}}, il codice di verifica è: {{code}}. Inserisci il codice entro 10 minuti.",
      },
      errors: {
        welcome_failed: {
          title: "SMS Benvenuto non riuscito",
          description: "Non ha inviato il benvenuto SMS all'utente",
        },
        verification_failed: {
          title: "La verifica di SMS non è riuscita",
          description:
            "Non è stato possibile inviare la verifica SMS all'utente",
        },
      },
    },
  },
  list: {
    get: {
      title: "Elenco utenti",
      description: "Ricerca e filtrazione degli utenti",
      form: {
        title: "Gestione utente",
        description: "Gestione e filtrazione degli utenti",
      },
      actions: {
        refresh: "Aggiorna",
        refreshing: "Raffreddamento...",
      },
      // Search & Filters section
      searchFilters: {
        title: "Ricerca &amp; Filtri",
        description: "Ricerca e filtra gli utenti per criteri",
      },
      search: {
        label: "Cerca",
        description: "Cerca utenti per nome o email",
        placeholder: "Cerca utenti...",
      },
      status: {
        label: "Stato",
        description: "Filtra gli utenti per stato",
        placeholder: "Selezionare lo stato...",
      },
      role: {
        label: "Role",
        description: "Filtra gli utenti per ruolo",
        placeholder: "Seleziona il ruolo...",
      },
      subscription: {
        label: "Abbonamento",
        description: "Filtra per lo stato dell'abbonamento",
        placeholder: "Qualsiasi stato di abbonamento",
      },
      creditActivity: {
        label: "Attività di credito",
        description: "Filtra con l'acquisto di credito o attività di spesa",
        placeholder: "Qualsiasi attività di credito",
      },
      threads: {
        label: "Conversazioni",
        description: "Filtrare se l'utente ha qualsiasi thread di chat",
        placeholder: "Qualsiasi stato di thread",
      },
      referralActivity: {
        label: "Attività di riferimento",
        description:
          "Filtra per link di riferimento, clic, iscrizioni o abbonati paganti",
        placeholder: "Qualsiasi attività di riferimento",
      },
      // Sorting section
      sortingOptions: {
        title: "Ordinazione",
        description: "Configurare la selezione dei risultati",
      },
      sortBy: {
        label: "Ordina per",
        description: "Campo da smistamento",
        placeholder: "Seleziona il campo di selezione...",
      },
      sortOrder: {
        label: "Ordinare",
        description: "Ordinare la direzione",
        placeholder: "Seleziona ordine di selezione...",
      },
      // Response section
      response: {
        title: "Utenti",
        description: "Elenco degli utenti corrispondenti ai criteri",
        users: {
          id: "Utente ID",
          email: "Email",
          privateName: "Nome privato",
          publicName: "Nome pubblico",
          isActive: "Attivo",
          emailVerified: "Verificato",
          createdAt: "Creato",
          updatedAt: "Aggiornato",
          referralCode: "Codice Refrigerato Usato",
          referredByUserId: "Riferito da",
          totalReferrals: "Referrals Made",
        },
        totalCount: "Totale utenti",
        pageCount: "Pagine totali",
      },
      // Pagination section
      page: {
        label: "Pagina",
      },
      limit: {
        label: "Per pagina",
      },
      // Error messages
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Devi essere connesso per visualizzare gli utenti",
        },
        validation: {
          title: "Errore di convalida",
          description: "Parametri non validi forniti",
        },
        forbidden: {
          title: "Accesso Proibito",
          description: "Non hai il permesso di visualizzare gli utenti",
        },
        server: {
          title: "Errore del server",
          description: "Incapace di recuperare gli utenti",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        conflict: {
          title: "Errore di conflitto",
          description: "Incapace di elencare gli utenti a causa di conflitti",
        },
        network: {
          title: "Errore di rete",
          description: "Non è possibile connettersi al server",
        },
        notFound: {
          title: "Non trovato",
          description: "Nessun utente trovato",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Operazione riuscita",
        description: "Gli utenti recuperati con successo",
      },
    },
    // Legacy keys for backward compatibility
    title: "Elenco degli utenti",
    description: "Elenco e ricerca utenti con filtraggio",
    category: "Utenti",
    tag: "Elenco",
    container: {
      title: "Elenco utenti",
      description: "Ricerca e filtrazione degli utenti",
    },
    response: {
      summary: {
        title: "Sintesi dell'utente",
        description: "Statistiche di sintesi per l'elenco degli utenti",
      },
      users: {
        title: "Utenti",
      },
      user: {
        title: "Utente",
        id: "Utente ID",
        email: "Email",
        privateName: "Nome privato",
        publicName: "Nome pubblico",
        firstName: "Nome",
        lastName: "Ultimo nome",
        company: "Società",
        phone: "Telefono",
        isActive: "Attivo",
        emailVerified: "E-mail verificato",
        role: "Role",
        createdAt: "Creato a",
        updatedAt: "Aggiornato At",
      },
      total: {
        content: "Totale utenti",
      },
      page: {
        content: "Pagina corrente",
      },
      limit: {
        content: "Gli utenti per pagina",
      },
      totalPages: {
        content: "Pagine totali",
      },
    },
    errors: {
      unauthorized: {
        title: "Accesso non autorizzato",
        description: "Devi essere connesso per visualizzare gli utenti",
      },
      validation: {
        title: "Convalida non riuscita",
        description: "Parametri non validi forniti per l'elenco degli utenti",
      },
      forbidden: {
        title: "Accesso Proibito",
        description: "Non hai il permesso di visualizzare gli utenti",
      },
      server: {
        title: "Errore del server",
        description:
          "Non è possibile recuperare gli utenti a causa di errore server",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore inaspettato si è verificato durante l'elenco degli utenti",
      },
      conflict: {
        title: "Errore di conflitto",
        description:
          "Incapace di elencare gli utenti a causa dei conflitti esistenti",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile connettersi al server",
      },
      notFound: {
        title: "Utenti non trovati",
        description:
          "Nessun utente è stato trovato corrispondente ai tuoi criteri",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che saranno persi",
      },
      internal: {
        title: "Errore interno",
        description:
          "Si è verificato un errore interno durante l'elenco degli utenti",
      },
    },
    post: {
      title: "Elenco",
      description: "Elenco dei punti",
      form: {
        title: "Configurazione dell'elenco",
        description: "Configurare i parametri dell'elenco",
      },
      response: {
        title: "Risposta",
        description: "Elenco dei dati di risposta",
      },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        validation: {
          title: "Errore di convalida",
          description: "Parametri della richiesta non validi",
        },
        server: {
          title: "Errore del server",
          description: "Si è verificato un errore interno del server",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore sconosciuto",
        },
        network: {
          title: "Errore di rete",
          description: "Si è verificato un errore di rete",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso non consentito",
        },
        notFound: {
          title: "Non trovato",
          description: "Risorsa non trovata",
        },
        conflict: {
          title: "Conflitto",
          description: "I dati sono in conflitto",
        },
      },
      success: {
        title: "Operazione riuscita",
        description: "Operazione completata",
      },
    },
    widget: {
      statusActive: "Attivo",
      statusInactive: "Inattivo",
      statusUnverified: "Unverified",
      joined: "Adeguato",
      creditHistory: "Storico crediti",
      view: "Vista",
      edit: "Modifica",
      delete: "Elimina",
      stats: "Stat",
      graphs: "Grafi",
      newUser: "Nuovo utente",
      searchPlaceholder: "Cerca per nome o e-mail... (Ctrl+F)",
      roleFilterLabel: "Role",
      sortLabel: "Tipo:",
      clearFilters: "Cancella filtri",
      noUsersMatchFilters: "Nessun utente corrisponde ai tuoi filtri.",
      noUsersFound: "Nessun utente trovato.",
      userStatistics: "Statistiche dell'utente",
      refresh: "Aggiorna",
      roleAll: "Tutti",
      roleAdmin: "Amministratore",
      roleCustomer: "Cliente",
      rolePartnerAdmin: "Amministratore partner",
      rolePartnerEmployee: "Collaboratore partner",
      statusAll: "Tutti",
      sortNewest: "Nuovo",
      sortOldest: "Più vecchio",
      sortNameAZ: "Nome A-Z",
      sortNameZA: "Nome Z-A",
      sortEmailAZ: "Email A-Z",
      of: "di",
      usersShown: "utenti mostrati",
      paginationPage: "Pagina",
      paginationOf: "di",
      paginationSeparator: "·",
      paginationUsers: "utenti",
    },
    enums: {
      userSortField: {
        createdAt: "Creato a",
        updatedAt: "Aggiornato At",
        email: "Email",
        privateName: "Nome privato",
        publicName: "Nome pubblico",
        firstName: "Nome",
        lastName: "Ultimo nome",
        company: "Società",
        lastLogin: "Ultimo accesso",
      },
      sortOrder: {
        asc: "Assunzione",
        desc: "Discussione",
      },
      userStatusFilter: {
        all: "Tutti",
        active: "Attivo",
        inactive: "Inattivo",
        pending: "Finanziamenti",
        suspended: "Sospeso",
        emailVerified: "E-mail verificato",
        emailUnverified: "Email Unverified",
      },
      userStatus: {
        active: "Attivo",
        inactive: "Inattivo",
        pending: "Finanziamenti",
        suspended: "Sospeso",
      },
      userRoleFilter: {
        all: "Tutti",
        user: "Utente",
        public: "Pubblico",
        customer: "Cliente",
        moderator: "Moderatore",
        partnerAdmin: "Amministratore partner",
        partnerEmployee: "Collaboratore partner",
        admin: "Amministratore",
        superAdmin: "Super Admin",
      },
      subscriptionPresenceFilter: {
        any: "Qualsiasi",
        hasActive: "Ha un abbonamento attivo",
        hadAny: "Aveva un abbonamento (ogni volta)",
        never: "Non abbonati",
      },
      creditActivityFilter: {
        any: "Qualsiasi",
        boughtPack: "Pacchetto di credito acquistato",
        spentCredits: "Crediti di spegnimento",
        neverSpent: "Mai speso crediti",
      },
      threadsFilter: {
        any: "Qualsiasi",
        hasThreads: "Ha fili",
        noThreads: "Nessun filo",
      },
      referralActivityFilter: {
        any: "Qualsiasi",
        hasCode: "Ha un link di riferimento",
        hasClicks: "Ha click di riferimento",
        hasSignups: "Ha le iscrizioni di rinvio",
        hasSubscribers: "Ha pagato i rinvii",
      },
    },
  },
  stats: {
    title: "Statistiche dell'utente",
    description: "Analisi e statistiche degli utenti completi",
    category: "Utenti",
    tag: "Statistiche",
    container: {
      title: "Statistiche utente Dashboard",
      description: "Visualizza analisi utente e statistiche complete",
    },
    actions: {
      refresh: "Aggiorna",
      refreshing: "Raffreddamento...",
    },
    basicFilters: {
      title: "Filtri di base",
      description: "Filtra gli utenti per stato e ruolo",
    },
    subscriptionFilters: {
      title: "Filtri di abbonamento",
      description: "Filtra per abbonamento e pagamento",
    },
    locationFilters: {
      title: "Filtri di posizione",
      description: "Filtra per paese e lingua",
    },
    timePeriodOptions: {
      title: "Opzioni periodo di tempo",
      description:
        "Configurare il periodo di tempo e le impostazioni del grafico",
    },
    sections: {
      filterOptions: {
        title: "Opzioni di filtro",
        description: "Configurare i filtri per le statistiche degli utenti",
      },
    },
    fields: {
      status: {
        label: "Filtro di stato",
        description: "Filtra le statistiche per stato dell'utente",
      },
      role: {
        label: "Filtro di corda",
        description: "Filtra le statistiche per ruolo utente",
      },
      country: {
        label: "Filtro Paese",
        description: "Filtra le statistiche per paese",
        placeholder: "Seleziona il paese...",
      },
      language: {
        label: "Filtro di lingua",
        description: "Filtra le statistiche per lingua",
        placeholder: "Seleziona la lingua...",
      },
      search: {
        label: "Cerca",
        description: "Ricerca utenti per statistiche",
        placeholder: "Inserisci il termine di ricerca...",
      },
      chartType: {
        label: "Tipo di grafico",
        description: "Selezionare il tipo di grafico da visualizzare",
      },
      dateRangePreset: {
        label: "Preset della gamma di data",
        description: "Selezionare un intervallo di date predefinito",
      },
      includeComparison: {
        label: "Includere il confronto",
        description: "Includere il confronto con il periodo precedente",
      },
      timePeriod: {
        label: "Periodo di tempo",
        description: "Selezionare il periodo di tempo per le statistiche",
      },
      subscriptionStatus: {
        label: "Stato di abbonamento",
        description: "Filtra per lo stato dell'abbonamento",
      },
      paymentMethod: {
        label: "Metodo di pagamento",
        description: "Filtra con metodo di pagamento",
      },
    },
    response: {
      overviewStats: {
        title: "Panoramica Statistiche",
        description: "Panoramica delle statistiche degli utenti generali",
        totalUsers: {
          label: "Totale utenti",
        },
        activeUsers: {
          label: "Utenti attivi",
        },
        inactiveUsers: {
          label: "Utenti attivi",
        },
        newUsers: {
          label: "Nuovi utenti",
        },
      },
      emailStats: {
        title: "Statistiche del email",
        description: "Statistiche di verifica dell'email dell'utente",
        emailVerifiedUsers: {
          label: "E-mail verificate",
        },
        emailUnverifiedUsers: {
          label: "E-mail non verificate",
        },
        verificationRate: {
          label: "Tasso di verifica",
        },
      },
      profileStats: {
        title: "Statistiche del profilo",
        description: "Statistiche di completamento del profilo utente",
        complete: {
          title: "Completo del profilo",
          description: "metriche di completamento del profilo dettagliate",
          usersWithPhone: {
            content: "Utenti con Telefono",
          },
          usersWithBio: {
            content: "Utenti con Biografia",
          },
          usersWithWebsite: {
            content: "Utenti con il Sito",
          },
          usersWithJobTitle: {
            content: "Utenti con titolo di lavoro",
          },
          usersWithImage: {
            content: "Utenti con immagine di profilo",
          },
          completionRate: {
            content: "Tasso di completamento del profilo",
          },
        },
      },
      subscriptionStats: {
        title: "Statistiche dell'abbonamento",
        description: "Statistiche di distribuzione degli abbonamenti",
        activeSubscriptions: {
          label: "Attivo",
        },
        canceledSubscriptions: {
          label: "Annullamento",
        },
        expiredSubscriptions: {
          label: "Scadenza",
        },
        noSubscription: {
          label: "Nessun abbonamento",
        },
        subscriptionChart: {
          label: "Distribuzione dell'abbonamento",
          description: "Ripartizione visiva degli stati di abbonamento",
        },
      },
      paymentStats: {
        title: "Statistiche di pagamento",
        description: "Statistiche delle entrate e delle transazioni",
        totalRevenue: {
          label: "Ricavi totali",
        },
        transactionCount: {
          label: "Transazioni",
        },
        averageOrderValue: {
          label: "Avg. Valore d'ordine",
        },
        refundRate: {
          label: "Tasso di rimborso",
        },
      },
      roleStats: {
        title: "Statistiche del ruolo",
        description: "Statistiche di distribuzione del ruolo utente",
        publicUsers: {
          label: "Pubblico",
        },
        customerUsers: {
          label: "Clienti",
        },
        partnerAdminUsers: {
          label: "Amministratori dei partner",
        },
        partnerEmployeeUsers: {
          label: "Staff del partner",
        },
        adminUsers: {
          label: "Admins",
        },
        roleChart: {
          label: "Distribuzione dei ruoli",
          description: "Ripartizione visiva degli utenti per ruolo",
        },
      },
      timeStats: {
        title: "Statistiche basate sul tempo",
        description:
          "Statistiche per la creazione e la crescita dell'utente nel tempo",
        usersCreatedToday: {
          label: "Oggi",
        },
        usersCreatedThisWeek: {
          label: "Rassegna",
        },
        usersCreatedThisMonth: {
          label: "Questo mese",
        },
        usersCreatedLastMonth: {
          label: "Ultimo mese",
        },
        growthRate: {
          label: "Tasso di crescita",
        },
      },
      companyStats: {
        title: "Statistiche aziendali",
        description: "Statistiche dell'utente relative alla società",
        uniqueCompanies: {
          content: "Aziende Uniche",
        },
      },
      // Keep the flat structure for backward compatibility
      totalUsers: {
        content: "Totale utenti",
      },
      activeUsers: {
        content: "Utenti attivi",
      },
      inactiveUsers: {
        content: "Utenti attivi",
      },
      newUsers: {
        content: "Nuovi utenti",
      },
      emailVerifiedUsers: {
        content: "Email Utenti verificati",
      },
      emailUnverifiedUsers: {
        content: "Email Utenti non verificati",
      },
      verificationRate: {
        content: "Tasso di verifica e-mail",
      },
      usersWithPhone: {
        content: "Utenti con Telefono",
      },
      usersWithBio: {
        content: "Utenti con Biografia",
      },
      usersWithWebsite: {
        content: "Utenti con il Sito",
      },
      usersWithJobTitle: {
        content: "Utenti con titolo di lavoro",
      },
      usersWithImage: {
        content: "Utenti con immagine di profilo",
      },
      usersWithStripeId: {
        content: "Utenti con Stripe ID",
      },
      usersWithoutStripeId: {
        content: "Utenti senza Stripe ID",
      },
      stripeIntegrationRate: {
        content: "Tasso di integrazione Stripe",
      },
      usersWithLeadId: {
        content: "Utenti con Contatto ID",
      },
      usersWithoutLeadId: {
        content: "Utenti senza contatto ID",
      },
      leadAssociationRate: {
        content: "Tasso di Associazioni di Contatto",
      },
      publicUsers: {
        content: "Utenti pubblici",
      },
      customerUsers: {
        content: "Utenti clienti",
      },
      partnerAdminUsers: {
        content: "Utenti di Admination Partner",
      },
      partnerEmployeeUsers: {
        content: "Utenti dipendenti partner",
      },
      adminUsers: {
        content: "Amministratori utenti",
      },
      uniqueCompanies: {
        content: "Aziende Uniche",
      },
      usersCreatedToday: {
        content: "Gli utenti creati oggi",
      },
      usersCreatedThisWeek: {
        content: "Gli utenti hanno creato questa settimana",
      },
      usersCreatedThisMonth: {
        content: "Gli utenti hanno creato questo mese",
      },
      usersCreatedLastMonth: {
        content: "Gli utenti hanno creato Ultimo mese",
      },
      growthRate: {
        content: "Tasso di crescita",
      },
      leadToUserConversionRate: {
        content: "Condurre al tasso di conversione dell'utente",
      },
      retentionRate: {
        content: "Tasso di conservazione dell'utente",
      },
      generatedAt: {
        content: "Statistiche Generazioni",
      },
      growthMetrics: {
        title: "Metriche di crescita",
        description: "metriche di crescita e conversione dell'utente",
        growthChart: {
          label: "Crescita dell'utente nel tempo",
          description:
            "Rappresentazione visiva delle tendenze della creazione dell'utente",
        },
      },
      performanceRates: {
        title: "Tassi di prestazione",
        description: "metriche di performance e conversione degli utenti",
        growthRate: {
          label: "Tasso di crescita",
        },
        leadToUserConversionRate: {
          label: "Conversione dei contatti",
        },
        retentionRate: {
          label: "Tasso di detenzione",
        },
      },
      businessInsights: {
        title: "Insights aziendali",
        description: "Intelligenza aziendale e analisi",
        uniqueCompanies: {
          label: "Aziende Uniche",
        },
        generatedAt: {
          label: "Generato a",
        },
      },
    },
    errors: {
      validation: {
        title: "Convalida non riuscita",
        description: "Parametri statistici non validi forniti",
      },
      unauthorized: {
        title: "Accesso non autorizzato",
        description: "Devi essere connesso per visualizzare le statistiche",
      },
      forbidden: {
        title: "Accesso Proibito",
        description: "Non hai il permesso di visualizzare le statistiche",
      },
      notFound: {
        title: "Statistiche non trovata",
        description: "Le statistiche richieste non sono state trovate",
      },
      conflict: {
        title: "Errore di conflitto",
        description:
          "Incapace di generare statistiche a causa dei conflitti esistenti",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile connettersi al server",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che saranno persi",
      },
      server: {
        title: "Errore del server",
        description:
          "Incapace di generare statistiche a causa dell'errore del server",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore inaspettato si è verificato durante la generazione di statistiche",
      },
    },
    enums: {
      subscriptionStatusFilter: {
        all: "Tutti",
        active: "Attivo",
        trialing: "Trialing",
        pastDue: "Passato",
        canceled: "Annullamento",
        unpaid: "Non pagato",
        paused: "Paused",
        noSubscription: "Nessun abbonamento",
      },
      paymentMethodFilter: {
        all: "Tutti",
        card: "Carta di carta",
        bankTransfer: "Bonifico bancario",
        paypal: "PayPal",
        applePay: "Apple Pay",
        googlePay: "Google Pay",
        sepaDebit: "Debito SEPA",
        crypto: "Criptovalute",
        noPaymentMethod: "Nessun metodo di pagamento",
      },
    },
    success: {
      title: "Statistiche Generated Successivo",
      description:
        "Le statistiche degli utenti sono state generate con successo",
    },
    widget: {
      headerTitle: "Statistiche degli utenti",
      refresh: "Aggiorna",
      labelTotalUsers: "Totale utenti",
      labelActiveUsers: "Utenti attivi",
      labelNewToday: "Nuovo oggi",
      labelNewThisWeek: "Nuova settimana",
      labelNewThisMonth: "Nuovo questo mese",
      labelTotalRevenue: "Ricavi totali",
      labelAvgRevenuePerUser: "Avg Revenue / Utente",
      labelEmailVerified: "E-mail verificato",
      labelVerificationRate: "Tasso di verifica",
      labelEmailUnverified: "Email Unverified",
      labelGrowthRate: "Tasso di crescita",
      labelLeadUserCvr: "Contatto → Utente CVR",
      labelRetentionRate: "Tasso di detenzione",
      chartByRole: "Da Role",
      chartBySubscriptionStatus: "Per Stato dell'abbonamento",
      chartGrowthOverTime: "Crescita nel tempo",
      recentSignupsSummary: "Riepilogo delle iscrizioni recenti",
      rowToday: "Oggi",
      rowThisWeek: "Rassegna",
      rowThisMonth: "Questo mese",
      rowLastMonth: "Ultimo mese",
      generatedAt: "Generato a:",
      filters: "Filtri",
      filtersTitle: "Opzioni di filtro",
      applyFilters: "Applicare filtri",
      viewUsers: "Visualizza gli utenti",
      createUser: "Crea utente",
    },
  },
  user: {
    category: "Utenti",
    tag: "Gestione utente",
    errors: {
      not_found: {
        title: "Utente non trovato",
        description: "L'utente richiesto non è stato trovato",
      },
      internal: {
        title: "Errore interno",
        description:
          "Si è verificato un errore interno durante l'elaborazione della richiesta dell'utente",
      },
    },
    id: {
      category: "Utenti",
      tag: "Gestione utente",

      id: {
        roles: {
          post: {
            title: "Aggiungi il ruolo dell'utente",
            description: "Concedere un ruolo a un account utente specifico",
            container: {
              title: "Aggiungi Role",
              description: "Selezionare un ruolo da concedere a questo utente",
            },
            id: {
              label: "Utente ID",
              description:
                "Unico identificatore dell'utente per concedere il ruolo a",
              placeholder: "Inserisci utente ID...",
            },
            role: {
              label: "Role",
              description: "Il ruolo da concedere all'utente",
              placeholder: "Seleziona un ruolo...",
            },
            submit: {
              label: "Aggiungi Role",
            },
            response: {
              roleId: {
                content: "Assegnazione del ruolo ID",
              },
              userId: {
                content: "Utente ID",
              },
              assignedRole: {
                content: "Assegnato Role",
              },
            },
            errors: {
              unauthorized: {
                title: "Autenticazione richiesta",
                description:
                  "Devi essere connesso per gestire i ruoli degli utenti",
              },
              validation: {
                title: "Convalida non riuscita",
                description: "Si prega di fornire un utente valido ID e ruolo",
              },
              forbidden: {
                title: "Accesso Proibito",
                description:
                  "Solo gli amministratori possono gestire i ruoli degli utenti",
              },
              notFound: {
                title: "Utente non trovato",
                description: "L'utente specificato non potrebbe essere trovato",
              },
              conflict: {
                title: "Role già assegnata",
                description: "Questo utente ha già il ruolo specificato",
              },
              network: {
                title: "Errore di rete",
                description: "Non è possibile connettersi al server",
              },
              unsavedChanges: {
                title: "Modifiche non salvate",
                description:
                  "Hai dei cambiamenti non salvati che saranno persi",
              },
              server: {
                title: "Errore del server",
                description:
                  "Non è possibile aggiungere ruolo a causa di errore server",
              },
              unknown: {
                title: "Errore sconosciuto",
                description:
                  "Si è verificato un errore inaspettato, aggiungendo il ruolo",
              },
            },
            success: {
              title: "Role Aggiunto",
              description: "Il ruolo è stato concesso con successo all'utente",
            },
          },
          delete: {
            title: "Rimuovi il ruolo dell'utente",
            description: "Rivolgere un ruolo da un account utente specifico",
            container: {
              title: "Rimuovere Role",
              description: "Selezionare un ruolo da revocare da questo utente",
            },
            id: {
              label: "Utente ID",
              description:
                "Unico identificatore dell'utente per revocare il ruolo da",
              placeholder: "Inserisci utente ID...",
            },
            role: {
              label: "Role",
              description: "Il ruolo da revocare dall'utente",
              placeholder: "Seleziona un ruolo...",
            },
            submit: {
              label: "Rimuovere Role",
            },
            response: {
              success: {
                content: "Role Rimuovi",
              },
            },
            errors: {
              unauthorized: {
                title: "Autenticazione richiesta",
                description:
                  "Devi essere connesso per gestire i ruoli degli utenti",
              },
              validation: {
                title: "Convalida non riuscita",
                description: "Si prega di fornire un utente valido ID e ruolo",
              },
              forbidden: {
                title: "Accesso Proibito",
                description:
                  "Solo gli amministratori possono gestire i ruoli degli utenti",
              },
              notFound: {
                title: "Utente non trovato",
                description: "L'utente specificato non potrebbe essere trovato",
              },
              conflict: {
                title: "Errore di conflitto",
                description:
                  "Incapace di rimuovere il ruolo a causa delle dipendenze esistenti",
              },
              network: {
                title: "Errore di rete",
                description: "Non è possibile connettersi al server",
              },
              unsavedChanges: {
                title: "Modifiche non salvate",
                description:
                  "Hai dei cambiamenti non salvati che saranno persi",
              },
              server: {
                title: "Errore del server",
                description:
                  "Non è possibile rimuovere il ruolo a causa di errore del server",
              },
              unknown: {
                title: "Errore sconosciuto",
                description:
                  "Si è verificato un errore inaspettato mentre si rimuove il ruolo",
              },
            },
            success: {
              title: "Role Rimuovi",
              description: "Il ruolo è stato revocato con successo dall'utente",
            },
          },
        },
        get: {
          title: "Ottieni l'utente",
          description:
            "Recuperare informazioni dettagliate su un utente specifico",
          container: {
            title: "Dettagli utente",
            description: "Visualizza le informazioni dettagliate dell'utente",
          },
          id: {
            label: "Utente ID",
            description: "Identificatore unico per l'utente",
            placeholder: "Inserisci utente ID...",
          },
          response: {
            userProfile: {
              title: "Profilo utente",
              description: "Informazioni dettagliate sul profilo utente",
              basicInfo: {
                title: "Informazioni di base",
                description: "Informazioni utente core",
                id: {
                  content: "Utente ID",
                },
                email: {
                  content: "Indirizzo email",
                },
                privateName: {
                  content: "Nome privato",
                },
                publicName: {
                  content: "Nome pubblico",
                },
                firstName: {
                  content: "Nome",
                },
                lastName: {
                  content: "Ultimo nome",
                },
                company: {
                  content: "Società",
                },
              },
              contactDetails: {
                title: "Dettagli di contatto",
                description: "Informazioni di contatto dell'utente",
                phone: {
                  content: "Numero di telefono",
                },
                preferredContactMethod: {
                  content: "Metodo di contatto preferito",
                },
                website: {
                  content: "Sito web",
                },
              },
            },
            profileDetails: {
              title: "Dettagli del profilo",
              description: "Ulteriori informazioni sul profilo",
              imageUrl: {
                content: "Immagine del profilo",
              },
              bio: {
                content: "Biografia",
              },
              jobTitle: {
                content: "Titolo del lavoro",
              },
              leadId: {
                content: "Contatto associato ID",
              },
            },
            accountStatus: {
              title: "Stato dell'account",
              description: "Informazioni sullo stato dell'account utente",
              isActive: {
                content: "Stato attivo",
              },
              emailVerified: {
                content: "E-mail verificato",
              },
              stripeCustomerId: {
                content: "Stripe cliente ID",
              },
              userRoles: {
                content: "Ruoli utente",
              },
            },
            timestamps: {
              title: "Lampade da terra",
              description: "Creazione e aggiornamento di timestamp",
              createdAt: {
                content: "Creato a",
              },
              updatedAt: {
                content: "Aggiornato At",
              },
            },
            referralInfo: {
              title: "Informazioni di riferimento",
              description: "Catena di riferimento e guadagni",
              referredByUserId: {
                content: "Referred By (User ID)",
              },
              referredByCode: {
                content: "Codice di riferimento usato",
              },
              totalReferrals: {
                content: "Utenti rinviati",
              },
              totalEarnedCents: {
                content: "Totale Guadagnato (centri)",
              },
            },
            leadId: {
              content: "Contatto associato ID",
            },
            email: {
              content: "Indirizzo email",
            },
            privateName: {
              content: "Nome privato",
            },
            publicName: {
              content: "Nome pubblico",
            },
            firstName: {
              content: "Nome",
            },
            lastName: {
              content: "Ultimo nome",
            },
            company: {
              content: "Società",
            },
            phone: {
              content: "Numero di telefono",
            },
            preferredContactMethod: {
              content: "Metodo di contatto preferito",
            },
            imageUrl: {
              content: "Immagine del profilo",
            },
            bio: {
              content: "Biografia",
            },
            website: {
              content: "Sito web",
            },
            jobTitle: {
              content: "Titolo del lavoro",
            },
            emailVerified: {
              content: "E-mail verificato",
            },
            isActive: {
              content: "Stato attivo",
            },
            stripeCustomerId: {
              content: "Stripe cliente ID",
            },
            userRoles: {
              content: "Ruoli utente",
            },
            createdAt: {
              content: "Creato a",
            },
            updatedAt: {
              content: "Aggiornato At",
            },
          },
          errors: {
            unauthorized: {
              title: "Accesso non autorizzato",
              description:
                "Devi essere connesso per visualizzare i dettagli dell'utente",
            },
            validation: {
              title: "Convalida non riuscita",
              description: "Utente non valido ID fornito",
            },
            forbidden: {
              title: "Accesso Proibito",
              description: "Non hai il permesso di visualizzare questo utente",
            },
            notFound: {
              title: "Utente non trovato",
              description: "L'utente richiesto non è stato trovato",
            },
            conflict: {
              title: "Errore di conflitto",
              description:
                "Incapace di recuperare l'utente a causa dei conflitti esistenti",
            },
            network: {
              title: "Errore di rete",
              description: "Non è possibile connettersi al server",
            },
            unsavedChanges: {
              title: "Modifiche non salvate",
              description: "Hai dei cambiamenti non salvati che saranno persi",
            },
            server: {
              title: "Errore del server",
              description:
                "Non è possibile recuperare l'utente a causa di errore del server",
            },
            unknown: {
              title: "Errore sconosciuto",
              description:
                "Un errore inaspettato si è verificato durante il recupero dell'utente",
            },
          },
          success: {
            title: "Utente recuperato con successo",
            description: "I dettagli utente sono stati recuperati con successo",
          },
        },
        put: {
          title: "Aggiornamento dell'utente",
          description:
            "Aggiornare le informazioni sull'utente e i dettagli del profilo",
          container: {
            title: "Aggiornamento dell'utente",
            description:
              "Modificare le informazioni e le impostazioni dell'utente",
          },
          id: {
            label: "Utente ID",
            description: "Univoco identificativo per l'utente per aggiornare",
            placeholder: "Inserisci utente ID...",
          },
          sections: {
            basicInfo: {
              title: "Informazioni di base",
              description: "Aggiornare le informazioni di base dell'utente",
            },
            contactInfo: {
              title: "Informazioni di contatto",
              description: "Aggiornare i dettagli del contatto",
            },
            profileDetails: {
              title: "Dettagli del profilo",
              description: "Aggiornare ulteriori informazioni sul profilo",
            },
            adminSettings: {
              title: "Impostazioni amministrative",
              description: "Aggiornare le impostazioni amministrative",
            },
          },
          email: {
            label: "Indirizzo email",
            description:
              "Indirizzo email dell'utente per il login e la comunicazione",
            placeholder: "Inserisci l'indirizzo e-mail...",
          },
          privateName: {
            label: "Nome privato",
            description:
              "Nome completo legale dell'utente (visibile solo agli amministratori)",
          },
          publicName: {
            label: "Nome pubblico",
            description:
              "Nome di visualizzazione dell'utente (visibile a tutti gli utenti)",
          },
          firstName: {
            label: "Nome",
            description: "Nome utente",
            placeholder: "Inserisci il nome...",
          },
          lastName: {
            label: "Ultimo nome",
            description: "cognome dell'utente",
            placeholder: "Inserisci il cognome...",
          },
          company: {
            label: "Società",
            description: "Azienda o organizzazione dell'utente",
            placeholder: "Inserisci il nome dell'azienda...",
          },
          phone: {
            label: "Numero di telefono",
            description: "Numero di telefono di contatto dell'utente",
            placeholder: "Inserisci il numero di telefono...",
          },
          preferredContactMethod: {
            label: "Metodo di contatto preferito",
            description: "Come l'utente preferisce essere contattato",
          },
          bio: {
            label: "Biografia",
            description: "Breve descrizione dell'utente",
            placeholder: "Entra in biografia...",
          },
          website: {
            label: "Sito web",
            description: "Sito personale o aziendale dell'utente",
            placeholder: "Inserisci il sito web URL...",
          },
          jobTitle: {
            label: "Titolo del lavoro",
            description: "Titolo o posizione del lavoro dell'utente",
            placeholder: "Inserire il titolo di lavoro...",
          },
          emailVerified: {
            label: "E-mail verificato",
            description: "Se l'e-mail dell'utente è verificata",
          },
          isActive: {
            label: "Stato attivo",
            description: "Se l'account utente è attivo",
          },
          leadId: {
            label: "ID del contatto",
            description: "Identificatore di contatto associato",
            placeholder: "Inserire il comando ID...",
          },
          isBanned: {
            label: "Banati",
            description: "Se l'utente è vietato dalla piattaforma",
          },
          bannedReason: {
            label: "Motivazione del bando",
            description: "Motivo per il divieto dell'utente",
          },
          response: {
            leadId: {
              content: "Contatto associato ID",
            },
            email: {
              content: "Indirizzo email",
            },
            privateName: {
              content: "Nome privato",
            },
            publicName: {
              content: "Nome pubblico",
            },
            firstName: {
              content: "Nome",
            },
            lastName: {
              content: "Ultimo nome",
            },
            company: {
              content: "Società",
            },
            phone: {
              content: "Numero di telefono",
            },
            preferredContactMethod: {
              content: "Metodo di contatto preferito",
            },
            imageUrl: {
              content: "Immagine del profilo",
            },
            bio: {
              content: "Biografia",
            },
            website: {
              content: "Sito web",
            },
            jobTitle: {
              content: "Titolo del lavoro",
            },
            emailVerified: {
              content: "E-mail verificato",
            },
            isActive: {
              content: "Stato attivo",
            },
            stripeCustomerId: {
              content: "Stripe cliente ID",
            },
            userRoles: {
              content: "Ruoli utente",
            },
            createdAt: {
              content: "Creato a",
            },
            updatedAt: {
              content: "Aggiornato At",
            },
          },
          errors: {
            unauthorized: {
              title: "Accesso non autorizzato",
              description: "Devi essere connesso per aggiornare gli utenti",
            },
            validation: {
              title: "Convalida non riuscita",
              description:
                "Si prega di controllare i dati del modulo e riprovare",
            },
            forbidden: {
              title: "Accesso Proibito",
              description: "Non hai il permesso di aggiornare questo utente",
            },
            notFound: {
              title: "Utente non trovato",
              description: "L'utente che aggiorna non potrebbe essere trovato",
            },
            conflict: {
              title: "Aggiornamento Conflict",
              description:
                "I dati dell'utente sono in conflitto con i record esistenti",
            },
            server: {
              title: "Errore del server",
              description:
                "Non è possibile aggiornare l'utente a causa dell'errore del server",
            },
            unknown: {
              title: "Errore sconosciuto",
              description:
                "Si è verificato un errore inaspettato durante l'aggiornamento dell'utente",
            },
            network: {
              title: "Errore di rete",
              description: "Non è possibile connettersi al server",
            },
            unsavedChanges: {
              title: "Modifiche non salvate",
              description: "Hai dei cambiamenti non salvati che saranno persi",
            },
          },
          success: {
            title: "Aggiornato l'utente con successo",
            description:
              "Le informazioni dell'utente sono state aggiornate con successo",
          },
        },
        delete: {
          title: "Cancella l'utente",
          description: "Cancellare permanentemente un account utente",
          container: {
            title: "Cancella l'utente",
            description: "Rimuovere permanentemente l'utente dal sistema",
          },
          id: {
            label: "Utente ID",
            description: "Univoco identificativo per l'utente da eliminare",
            placeholder: "Inserisci utente ID...",
            helpText: "WARNING: Questa azione non può essere annullata",
          },
          submitButton: {
            label: "Cancella l'utente",
            loadingText: "Deleting...",
          },
          response: {
            deletionResult: {
              title: "Risultato di cancellazione",
              description: "Risultato dell'operazione di cancellazione",
              success: {
                content: "Successo di cancellazione",
              },
              message: {
                content: "Messaggio di cancellazione",
              },
              deletedAt: {
                content: "Cancellato a",
              },
            },
            success: {
              content: "Successo di cancellazione",
            },
            message: {
              content: "Messaggio di cancellazione",
            },
          },
          errors: {
            unauthorized: {
              title: "Accesso non autorizzato",
              description: "Devi essere connesso per eliminare gli utenti",
            },
            validation: {
              title: "Convalida non riuscita",
              description: "Utente non valido ID fornito per la cancellazione",
            },
            forbidden: {
              title: "Accesso Proibito",
              description: "Non hai il permesso di eliminare gli utenti",
            },
            notFound: {
              title: "Utente non trovato",
              description: "L'utente da cancellare non potrebbe essere trovato",
            },
            server: {
              title: "Errore del server",
              description:
                "Non è possibile eliminare l'utente a causa di errore del server",
            },
            unknown: {
              title: "Errore sconosciuto",
              description:
                "Un errore inaspettato si è verificato durante la cancellazione dell'utente",
            },
            conflict: {
              title: "Errore di conflitto",
              description:
                "Incapace di eliminare l'utente a causa delle dipendenze esistenti",
            },
            network: {
              title: "Errore di rete",
              description: "Non è possibile connettersi al server",
            },
            unsavedChanges: {
              title: "Modifiche non salvate",
              description: "Hai dei cambiamenti non salvati che saranno persi",
            },
          },
          success: {
            title: "Utente eliminato con successo",
            description: "L'utente è stato cancellato con successo",
          },
        },
        widget: {
          userProfile: "Profilo utente",
          active: "Attivo",
          inactive: "Inattivo",
          leadId: "Contatto ID:",
          viewLead: "Visualizza contatto",
          created: "Creato",
          lastUpdated: "Ultimo aggiornamento",
          fullProfile: "Profilo completo",
          referrals: "Referrals",
          subscription: "Abbonamento",
          creditHistory: "Storico crediti",
          deleteUser: "Cancella l'utente",
          userDeletedSuccessfully: "Utente cancellato con successo",
          deletedAt: "Cancellato a",
          confirmDeletion: "Confermare la cancellazione",
          confirmDeletionMessage:
            "Ciò cancellerà definitivamente l'utente e tutti i dati associati. Questa azione non può essere annullata.",
          titleReferralCodes: "Visualizza codici di riferimento e statistiche",
          titleSubscription: "Visualizza abbonamento",
          titleCopyUserId: "Copia utente ID",
        },
      },
    },
  },
  view: {
    category: "Utenti",
    tags: {
      user: "Utente",
      view: "Vista",
    },

    badge: "Dettagli utente",
    get: {
      title: "Visualizza utente",
      description: "Visualizza informazioni dettagliate su un utente",
      userId: {
        label: "Utente ID",
      },
    },
    errors: {
      validation: {
        title: "Richiesta non valida",
        description: "Si prega di controllare l'utente ID e riprovare",
      },
      network: {
        title: "Errore di connessione",
        description:
          "Incapace di connettersi. Si prega di controllare la connessione internet",
      },
      unauthorized: {
        title: "Accedi per continuare",
        description:
          "Si prega di firmare per visualizzare i dettagli dell'utente",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di visualizzare questo utente",
      },
      notFound: {
        title: "Utente non trovato",
        description: "Non siamo riusciti a trovare questo utente",
      },
      serverError: {
        title: "Qualcosa di strano",
        description:
          "Non potevamo caricare i dettagli dell'utente. Per favore prova di nuovo.",
      },
      unknown: {
        title: "Errore inaspettato",
        description:
          "E' successo qualcosa di inaspettato. Per favore prova di nuovo.",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti che non sono stati salvati",
      },
      conflict: {
        title: "Conflitto dei dati",
        description:
          "I dati dell'utente sono cambiati. Si prega di rinfrescare e riprovare",
      },
    },
    success: {
      title: "Caricamento dell'utente",
      description: "Dati utente caricati con successo",
    },
    empty: "Nessun dato dell'utente trovato",
    sections: {
      basicInfo: "Informazioni di base",
      chatActivity: "Attività Chat",
      credits: "Crediti",
      payments: "Pagamenti",
      newsletter: "Newsletter",
      referrals: "Referrals",
      recentActivity: "Attività recenti",
    },
    status: {
      active: "Attivo",
      banned: "Banati",
      inactive: "Inattivo",
      verified: "Verificato",
    },
    fields: {
      userId: "Utente ID",
      locale: "Locale",
      twoFactor: "Aute di due fanti",
      enabled: "Abilitato",
      disabled: "Disabili",
      marketing: "Marketing",
      optedIn: "Optato in",
      optedOut: "Optato",
      created: "Creato",
      lastUpdated: "Ultimo aggiornamento",
      banReason: "Motivazione del bando",
      roles: "Roles",
    },
    credits: {
      currentBalance: "Saldo attuale",
      availableCredits: "Crediti disponibili",
      packBreakdown: "Ripartizione del pacchetto di credito",
      subscription: "Abbonamento",
      permanent: "Permanente",
      bonus: "Bonus",
      earned: "Guarnizione",
      expires: "Scadenze",
    },
    payment: {
      stripeCustomerId: "Stripe cliente ID",
      activeSubscription: "Abbonamento attivo",
      subscriptionPlan: "Piano",
      subscriptionStatus: "Stato di abbonamento",
      nextBilling: "Il prossimo Billing",
    },
    common: {
      yes: "Sì.",
      no: "No.",
    },
    newsletter: {
      status: "Stato",
      subscribed: "Iscritto",
      notSubscribed: "Non sottoscritto",
      subscribedAt: "Abbonati a",
      confirmedAt: "Confermato",
      lastEmailSent: "Ultimo messaggio",
    },
    referrals: {
      totalReferrals: "Referrali totali",
      activeCodes: "Codici attivi",
      revenue: "Ricavi",
      earnings: "Guadagni",
    },
    activity: {
      lastLogin: "Ultimo accesso",
      lastThread: "Ultima conversazione",
      lastMessage: "Ultimo messaggio",
      lastPayment: "Ultimo pagamento",
    },
    tabs: {
      overview: "Panoramica",
      credits: "Crediti",
      referrals: "Referrals",
      earnings: "Guadagni",
      connections: "Connessioni",
      favorites: "Preferiti",
      skills: "Skill",
    },
    modelUsage: {
      title: "Uso del modello",
      model: "Modello",
      spent: "Credits Spent",
      messages: "Messaggi",
      noUsage: "Nessun dato di utilizzo del modello",
    },
    connections: {
      title: "Connessioni",
      leadsTitle: "Contatto collegato",
      usersTitle: "Utenti connessi",
      noLeads: "Nessun cavo collegato",
      noUsers: "Nessun utente connesso",
      leadEmail: "Email",
      leadBusiness: "Affari",
      leadStatus: "Stato",
      ipAddress: "IP Indirizzo",
      device: "Dispositivo",
      linkReason: "Motivo di collegamento",
      linkedAt: "Linked At",
      userId: "Utente ID",
      userEmail: "Email",
      userPublicName: "Nome utente",
      viewLead: "Visualizza contatto",
      viewUser: "Visualizza utente",
    },
    ban: {
      banUser: "Annuncio utente",
      unbanUser: "Utente Unban",
    },
    widget: {
      actions: {
        edit: "Modifica",
        delete: "Elimina",
        viewCreditHistory: "Visualizza la cronologia dei crediti",
        viewSubscription: "Visualizza Abbonamento",
        viewReferralCodes: "Visualizza i codici di riferimento",
        viewReferralEarnings: "Visualizza le orecchie di rinvio",
        addCredits: "Aggiungere crediti",
        viewLead: "Visualizza contatto",
        copyUserId: "Copia utente ID",
        copied: "Copiato",
      },
      sections: {
        quickActions: "Azioni rapide",
      },
      stats: {
        totalThreads: "Totale filetti",
        totalMessages: "Messaggi totali",
        userMessages: "Messaggi dell'utente",
        lastActivity: "Ultima attività",
        never: "Mai.",
        freeCredits: "Crediti gratuiti",
        freePeriod: "Periodo",
        totalSpent: "Totale Spettacolo",
        totalPurchased: "Totale acquisto",
        totalRevenue: "Ricavi totali",
        payments: "pagamenti",
        successful: "Successo",
        failed: "Sfigato",
        totalRefunds: "Totale Rimborsi",
        lastPayment: "Ultimo pagamento",
      },
    },
  },
};
