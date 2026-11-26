import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  traffic: {
    burstNetwork: "Rete in picco: {{count}} lead in 30 giorni",
    sharedAgent: "User agent condiviso: {{count}} lead",
    title: "Traffico e rete",
    subtitle:
      "Tipo di agente, primo contatto e quanti lead condividono questa rete o questo agente.",
    agent: "Agente",
    firstTouch: "Primo contatto",
    referrer: "Referrer",
    landingPath: "Pagina di ingresso",
    refCode: "Codice referral",
    freeCredits: "Crediti gratuiti consumati",
    network: "Rete",
    sameAgent: "Stesso user agent",
    agentLeadsIn30d: "{{count}} lead in 30 giorni",
    openLeads: "Apri i lead",
  },
  category: "Contatti",
  tags: {
    leads: "Contatti",
    management: "Gestione",
  },

  get: {
    title: "Visualizza i dettagli del contatto",
    titleShort: "Dettagli del contatto",
    description: "Recuperare informazioni dettagliate su un contatto specifico",
    backButton: {
      label: "Torna ai contatti",
    },
    editButton: {
      label: "Modifica contatto",
    },
    deleteButton: {
      label: "Elimina contatto",
    },
    id: {
      label: "ID del contatto",
      description: "Identificatore unico per il contatto",
    },
    form: {
      title: "Richiesta dei dettagli del contatto",
      description:
        "Richiedi i parametri per il recupero delle informazioni sul contatto",
    },
    response: {
      title: "Informazioni sul contatto",
      description: "Dettagli completi di contatto e storia",
      basicInfo: {
        title: "Informazioni di base",
        description: "Identificazione e stato del contatto core",
      },
      id: {
        content: "ID del contatto",
      },
      email: {
        content: "Indirizzo email",
      },
      businessName: {
        content: "Nome di affari",
      },
      contactName: {
        content: "Nome di contatto",
      },
      status: {
        content: "Stato del contatto",
      },
      contactDetails: {
        title: "Dettagli di contatto",
        description: "Informazioni e preferenze di contatto",
      },
      phone: {
        content: "Numero di telefono",
      },
      website: {
        content: "Sito web URL",
      },
      country: {
        content: "Paese",
      },
      language: {
        content: "Lingua",
      },
      campaignTracking: {
        title: "Tracciamento della campagna",
        description: "Campagna e-mail e informazioni di tracciamento",
      },
      source: {
        content: "Origine del contatto",
      },
      currentCampaignStage: {
        content: "Fase della campagna attuale",
      },
      emailJourneyVariant: {
        content: "Variante di viaggio email",
      },
      emailsSent: {
        content: "Inviare email",
      },
      lastEmailSentAt: {
        content: "Ultimo messaggio",
      },
      engagement: {
        title: "Metriche dell'engagement",
        description: "Dati di coinvolgimento e interazione e-mail",
      },
      emailsOpened: {
        content: "E-mail aperte",
      },
      emailsClicked: {
        content: "E-mail cliccate",
      },
      lastEngagementAt: {
        content: "Ultimo coinvolgimento",
      },
      unsubscribedAt: {
        content: "Non sottoscritto a",
      },
      conversion: {
        title: "Conversion Tracking",
        description: "Conversione di contatto e tracciamento pietre miliari",
      },
      convertedUserId: {
        content: "Utente convertito ID",
      },
      convertedAt: {
        content: "Convertito in",
      },
      signedUpAt: {
        content: "Iscritti a",
      },
      subscriptionConfirmedAt: {
        content: "Abbonamento confermato",
      },
      metadata: {
        title: "Informazioni aggiuntive",
        description: "Note e metadati",
        content: "Metadati",
      },
      notes: {
        content: "Osservazioni",
      },
      createdAt: {
        content: "Creato a",
      },
      updatedAt: {
        content: "Aggiornato At",
      },
      identity: {
        title: "Dispositivi e identità",
        description:
          "Monitoraggio dell'identità e delle informazioni sui dispositivi",
      },
      ipAddress: {
        content: "IP Indirizzo",
      },
      userAgent: {
        content: "Agente Utente",
      },
      deviceType: {
        content: "Tipo di dispositivo",
      },
      browser: {
        content: "Browser",
      },
      os: {
        content: "Sistema operativo",
      },
      referralCode: {
        content: "Codice invito",
      },
      lifecycle: {
        title: "Ciclo di vita",
        description: "Ulteriori timestamp del ciclo di vita",
      },
      bouncedAt: {
        content: "Bounced At",
      },
      invalidAt: {
        content: "Invalid At",
      },
      campaignStartedAt: {
        content: "La campagna è iniziata",
      },
      linkedLeads: {
        title: "Contatti collegato",
        description: "Contatti riconducibili alla stessa persona",
        linkedLeadId: {
          content: "Contatto collegato ID",
        },
        linkReason: {
          content: "Motivo di collegamento",
        },
        linkedAt: {
          content: "Linked At",
        },
        email: {
          content: "Email",
        },
        businessName: {
          content: "Nome di affari",
        },
        status: {
          content: "Stato",
        },
        ipAddress: {
          content: "IP Indirizzo",
        },
        userAgent: {
          content: "Agente Utente",
        },
        createdAt: {
          content: "Creato a",
        },
      },
      linkedUsers: {
        title: "Account utente collegato",
        description: "Account utente associati a questo contatto",
        userId: {
          content: "Utente ID",
        },
        linkReason: {
          content: "Motivo di collegamento",
        },
        linkedAt: {
          content: "Linked At",
        },
        email: {
          content: "Email",
        },
        publicName: {
          content: "Nome dell'esposizione",
        },
      },
      referralHistory: {
        title: "Storia del referral",
        description:
          "Codici di riferimento questo contatto cliccato prima di iscriversi",
        code: {
          content: "Codice invito",
        },
        ownerUserId: {
          content: "Titolare del Codice",
        },
        clickedAt: {
          content: "Cliccato su",
        },
      },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Il contatto fornito ID è invalido",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description:
          "Autenticazione necessaria per accedere ai dettagli del contatto",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di vedere questa pista",
      },
      notFound: {
        title: "Contatto non trovato",
        description: "Nessun contatto trovato con il fornito ID",
      },
      server: {
        title: "Errore del server",
        description:
          "Si è verificato un errore durante il recupero dei dettagli del contatto",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile connettersi al server",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto dei dati",
        description: "I dati di contatto sono stati modificati",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Dettagli di contatto recuperati con successo",
    },
  },
  patch: {
    title: "Aggiornamento del contatto",
    titleShort: "Modifica contatto",
    description: "Aggiornare le informazioni e lo stato di contatto",
    backButton: {
      label: "Torna al contatto",
    },
    deleteButton: {
      label: "Elimina contatto",
    },
    submitButton: {
      label: "Aggiornamento del contatto",
      loadingText: "Aggiornamento di contatto...",
    },
    id: {
      label: "ID del contatto",
      description: "Identificatore unico per il contatto per l'aggiornamento",
    },
    form: {
      title: "Aggiornamento del contatto",
      description: "Modificare le informazioni di contatto",
    },
    updates: {
      title: "Aggiornamenti dei contatti",
      description: "Campi da aggiornare",
    },
    basicInfo: {
      title: "Informazioni di base",
      description: "Aggiornare le informazioni sul core lead",
    },
    email: {
      label: "Indirizzo email",
      description: "Indirizzo e-mail di Lead",
      placeholder: "email@example.com",
    },
    businessName: {
      label: "Nome di affari",
      description: "Nome del business",
      placeholder: "Acme Corporation",
    },
    contactName: {
      label: "Nome di contatto",
      description: "Persona di contatto primaria",
      placeholder: "John Doe",
    },
    status: {
      label: "Stato del contatto",
      description: "Situazione attuale del contatto",
      placeholder: "Selezionare lo stato",
    },
    contactDetails: {
      title: "Dettagli di contatto",
      description: "Aggiornare le informazioni di contatto",
    },
    phone: {
      label: "Numero di telefono",
      description: "Numero di telefono di contatto",
      placeholder: "+1234567890",
    },
    website: {
      label: "Sito web",
      description: "Sito web commerciale URL",
      placeholder: "https://example.com",
    },
    country: {
      label: "Paese",
      description: "Paese d'affari",
      placeholder: "Seleziona il paese",
    },
    language: {
      label: "Lingua",
      description: "Lingua preferenziale",
      placeholder: "Seleziona la lingua",
    },
    campaignManagement: {
      title: "Gestione delle campagne",
      description: "Gestire le impostazioni della campagna",
    },
    source: {
      label: "Origine del contatto",
      description: "Origine del contatto",
      placeholder: "Selezionare la sorgente",
    },
    currentCampaignStage: {
      label: "Fase di campagna",
      description: "La fase attuale della campagna email",
      placeholder: "Selezionare la fase",
    },
    additionalDetails: {
      title: "Ulteriori dettagli",
      description: "Note e metadati",
    },
    notes: {
      label: "Osservazioni",
      description: "Note interne sul contatto",
      placeholder: "Aggiungi note qui",
    },
    metadata: {
      label: "Metadati",
      description: "Altri metadati (JSON)",
      placeholder: '{"key": "value"}',
    },
    convertedUserId: {
      label: "Utente convertito ID",
      description: "ID dell'account utente convertito",
      placeholder: "Utente ID",
    },
    subscriptionConfirmedAt: {
      label: "Abbonamento confermato",
      description: "Data in cui l'abbonamento è stato confermato",
      placeholder: "Seleziona una data",
    },
    response: {
      title: "Contatto aggiornato",
      description: "Aggiornamento delle informazioni di contatto",
      basicInfo: {
        title: "Informazioni di base",
        description: "Informazioni di base aggiornate",
      },
      id: {
        content: "ID del contatto",
      },
      email: {
        content: "Indirizzo email",
      },
      businessName: {
        content: "Nome di affari",
      },
      contactName: {
        content: "Nome di contatto",
      },
      status: {
        content: "Stato del contatto",
      },
      contactDetails: {
        title: "Dettagli di contatto",
        description: "Informazioni di contatto aggiornate",
      },
      phone: {
        content: "Numero di telefono",
      },
      website: {
        content: "Sito web URL",
      },
      country: {
        content: "Paese",
      },
      language: {
        content: "Lingua",
      },
      campaignTracking: {
        title: "Tracciamento della campagna",
        description: "Informazioni sulla campagna aggiornate",
      },
      source: {
        content: "Origine del contatto",
      },
      currentCampaignStage: {
        content: "Fase della campagna attuale",
      },
      emailJourneyVariant: {
        content: "Variante di viaggio email",
      },
      emailsSent: {
        content: "Inviare email",
      },
      lastEmailSentAt: {
        content: "Ultimo messaggio",
      },
      engagement: {
        title: "Metriche dell'engagement",
        description: "Dati di impegno e-mail",
      },
      emailsOpened: {
        content: "E-mail aperte",
      },
      emailsClicked: {
        content: "E-mail cliccate",
      },
      lastEngagementAt: {
        content: "Ultimo coinvolgimento",
      },
      unsubscribedAt: {
        content: "Non sottoscritto a",
      },
      conversion: {
        title: "Conversion Tracking",
        description: "Conversion Milestone tracking",
      },
      convertedUserId: {
        content: "Utente convertito ID",
      },
      convertedAt: {
        content: "Convertito in",
      },
      signedUpAt: {
        content: "Iscritti a",
      },
      subscriptionConfirmedAt: {
        content: "Abbonamento confermato",
      },
      metadata: {
        title: "Informazioni aggiuntive",
        description: "Note e metadati",
        content: "Metadati",
      },
      notes: {
        content: "Osservazioni",
      },
      createdAt: {
        content: "Creato a",
      },
      updatedAt: {
        content: "Aggiornato At",
      },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "I dati forniti sono invalidi",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Autenticazione necessaria per aggiornare i cavi",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di aggiornare questo comando",
      },
      notFound: {
        title: "Contatto non trovato",
        description: "Nessun contatto trovato con il fornito ID",
      },
      conflict: {
        title: "Aggiornamento Conflict",
        description: "Il comando è stato modificato da un altro utente",
      },
      server: {
        title: "Errore del server",
        description:
          "Si è verificato un errore durante l'aggiornamento del contatto",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile connettersi al server",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Contatto aggiornato",
    },
  },
  post: {
    title: "[id]",
    description: "[id] endpoint",
    form: {
      title: "Configurazione",
      description: "Configurare i parametri [id]",
    },
    response: {
      title: "Risposta",
      description: "[id] dati di risposta",
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
  enums: {
    leadStatus: {
      new: "Nuovo",
      pending: "Finanziamenti",
      campaignRunning: "Campagna in corso",
      websiteUser: "Utente del Sito",
      newsletterSubscriber: "Iscriviti alla newsletter",
      inContact: "In contatto",
      signedUp: "Firmato",
      subscriptionConfirmed: "Abbonamento Confermato",
      unsubscribed: "Iscrizione annullata",
      bounced: "Bounce",
      invalid: "Non valido",
    },
    leadSource: {
      website: "Sito web",
      referral: "Inviti",
      socialMedia: "Social Media",
      emailCampaign: "Campagna di email",
      csvImport: "Importazione di CSV",
      api: "API",
      manual: "Manuale",
      other: "Altro",
    },
    emailCampaignStage: {
      notStarted: "Non iniziato",
      initial: "Contatto iniziale",
      followup1: "Seguito 1",
      followup2: "Seguito 2",
      followup3: "Seguito 3",
      nurture: "Nurture",
      reactivation: "Riattivazione",
    },
    emailJourneyVariant: {
      uncensoredConvert: "Conversione ai modelli senza censura",
      sideHustle: "Hustle laterali",
      quietRecommendation: "Raccomandazioni silenziose",
    },
  },
  journey: {
    reviewUnavailable:
      "Portafoglio, consenso e registri di viaggio non potrebbero essere caricati.",
    title: "Percorso del lead",
    subtitle: "Anziano primo · attività recente e pietre miliari registrate",
    unavailable: "Le prove del viaggio non possono essere caricate",
    campaign: "La coda della campagna",
    emailScheduled: "Prossimo email programmata",
    campaignRunning: "Campagna in corso",
    noQueue: "Nessuna e-mail è programmata",
    openQueue: "Apri la coda del lead",
    openAccount: "Account aperto",
    openLead: "Apri la scheda del lead",
    attributionOnly:
      "I link di attribuzione sono indizi da rivedere. Una visita condivisa IP o monitoraggio può coinvolgere più di una persona.",
    recordedAccountLink: "Collegamento al conto registrato",
    recordedConversion: "Conto registrato alla conversione",
    attributedAccount: "Conto registrato nell'attribuzione della crescita",
    previewIpMatches: "Anteprima IP abbinato tra i cavi",
    wallets: "Portafogli",
    noWallets: "Nessun portafogli trovato",
    thisLeadWallet: "Portafoglio di questo lead",
    accountWallet: "Portafoglio account",
    relatedLeadWallet: "Portafoglio del lead collegato",
    newsletterConsent: "Registrazione del consenso della newsletter",
    noNewsletter: "Nessun registro di newsletter collegato",
    consentRecorded: "Consenso registrato",
    consentAbsent: "Nessun consenso registrato",
    confirmedOn: "Confermato {{date}}",
    confirmationMissing: "Data di conferma mancante",
    guestConsent: "Consenso degli ospiti per i modelli non censurati",
    consentVersion: "Versione connessa {{version}}",
    leadReference: "ID lead {{id}}",
    accountReference: "ID account {{id}}",
    leadSource: "Fonte del lead · {{source}}",
    guestConsentOn: "Consenso ai modelli senza censura registrato il {{date}}",
    guestConsentMissing:
      "Nessun consenso registrato per i modelli senza censura",
    consentVersionMissing: "Versione del consenso mancante",
    firstTouch: "Prima visita · {{touch}}",
    lastTouch: "Ultima visita attribuita · {{touch}}",
    attributionMissing: "Nessuna attribuzione di acquisizione registrata",
    linkEvidenceUnavailable: "Dati su consenso e attribuzione non disponibili",
    optedOutOn: "Disiscrizione registrata il {{date}}",
    optOutDateMissing: "Nessuna data di disiscrizione registrata",
    events: {
      created: "Lead creato",
      campaignStarted: "Inizia la campagna",
      emailSent: "Email campagna inviata",
      emailBounced: "E-mail campagna rimbalzata",
      bounced: "Lead con email respinta",
      unsubscribed: "Lead disiscritto",
      invalid: "Lead contrassegnato come non valido",
      signup: "Conto sottoscritto",
      converted: "Conversione registrata",
      subscriptionConfirmed: "Abbonamento confermato",
      firstTouch: "Prima visita registrata",
      lastTouch: "Ultima visita attribuita",
      firstChat: "Prima chat",
      firstPayment: "Prima conversione a pagamento",
      leadLink: "Lead collegato",
      accountLink: "Collegamento account registrato",
      referral: "Codice di riferimento utilizzato",
      interaction: "Interazione registrata",
      newsletterSubscribed: "Registrazione della newsletter registrata",
      newsletterConfirmed: "Newsletter email confermata",
      newsletterUnsubscribed: "Newsletter non sottoscritta",
    },
    evidence: {
      ipMatch: "partita IP condivisa",
      trackPage: "Tracciare la visita e i cookie dei visitatori",
      referral: "Collegamento di riferimento",
      manual: "Link manuale",
      test: "Link di prova",
      login: "Linked al login",
      signup: "Collegato all'iscrizione",
      merge: "Link storico di fusione",
    },
  },
  widget: {
    loading: "Caricamento del contatto...",
    notFound: "Contatto non trovato.",
    loadFailed: "Impossibile caricare il contatto",
    retryLoad: "Riprova",
    back: "Indietro",
    leadFallbackTitle: "Contatto",
    edit: "Modifica",
    delete: "Elimina",
    converted: "Convertito",
    quickActions: "Azioni rapide",
    editLead: "Modifica contatto",
    sendTestEmail: "Inviare la prova",
    viewInSearch: "Vedi in Ricerca",
    userProfile: "Profilo utente",
    userDetail: "Dettaglio utente",
    creditHistory: "Storico crediti",
    campaignFunnel: "Imbuto di campagna",
    sourceLabel: "Fonte:",
    lastEmailLabel: "Ultimo messaggio:",
    campaignPerformance: "Prestazioni della campagna",
    emailsSent: "Inviare email",
    opened: "Aperto",
    clicked: "Cliccato",
    openRate: "Tasso aperto",
    clickRate: "Cliccare sulla tariffa",
    clickToOpenRate: "Tariffa Click to-Open",
    contactDetails: "Dettagli di contatto",
    country: "Paese",
    language: "Lingua",
    engagement: "Engagement",
    emailsOpened: "E-mail aperte",
    emailsClicked: "E-mail cliccate",
    lastEngagement: "Ultimo coinvolgimento",
    unsubscribed: "Iscrizione annullata",
    conversion: "Conversione",
    signedUp: "Firmato",
    convertedAt: "Convertito in",
    subscriptionConfirmed: "Abbonamento Confermato",
    convertedUserId: "Utente convertito ID",
    activeSubscriberSince: "Abbonato attivo da",
    viewUserProfile: "Visualizza profilo utente",
    viewUserDetail: "Visualizza il dettaglio dell'utente",
    notesAndMetadata: "Note e Metadati",
    notes: "Osservazioni",
    metadata: "Metadati",
    created: "Creato",
    lastUpdated: "Ultimo aggiornamento",
    daysOld: "giorni vecchi",
    lastEngaged: "Ultimo fidanzato",
    ago: "fa",
    variant: "Variante:",
    copyEmail: "e-mail",
    copyId: "ID",
    copyPhone: "telefono",
    copyUserId: "utente ID",
    stageNotStarted: "Non iniziato",
    stageInitial: "Iniziativa",
    stageFollowup1: "Seguito 1",
    stageFollowup2: "Seguito 2",
    stageFollowup3: "Seguito 3",
    stageNurture: "Nurture",
    stageReactivation: "Riattivazione",
    tabOverview: "Panoramica",
    tabDetails: "Dettagli",
    tabIdentity: "Identità",
    tabBasic: "Base di base",
    tabCampaign: "Campagna",
    tabAdvanced: "Avanzato",
    deviceIdentity: "Dispositivi e identità",
    ipAddress: "IP Indirizzo",
    userAgent: "Agente Utente",
    deviceType: "Tipo di dispositivo",
    browser: "Browser",
    os: "Sistema operativo",
    referralCode: "Codice invito",
    lifecycleTimestamps: "Ciclo di vita",
    bouncedAt: "Bounced At",
    invalidAt: "Invalid At",
    campaignStartedAt: "La campagna è iniziata",
    linkedLeadsSection: "Contatti collegato",
    linkedLeadsEmpty: "Nessun cavo collegato",
    linkedUsersSection: "Account utente collegato",
    linkedUsersEmpty: "Nessun account utente collegato",
    linkReason: "Motivo di collegamento:",
    linkedAt: "Collegato a:",
    copyIp: "IP",
    copyLinkedLeadId: "ID del contatto",
    copyUserId2: "utente ID",
    more: "Altro",
    copyLeadId: "Copia ID lead",
    kpiFirstTouch: "Primo contatto",
    kpiStage: "Fase campagna",
    kpiEmails: "Email aperte",
    kpiOpenRate: "{{percent}}% di apertura",
    kpiAge: "Età del lead",
    kpiAgeValue: "{{count}} giorni",
    kpiAgeHint: "Creato il {{date}}",
    kpiCredits: "Crediti gratuiti usati",
    kpiCreditsHint: "Consumati nel piano gratuito",
    notTracked: "Non tracciato",
    selectLead: "Selezionare Lead",
  },
  delete: {
    title: "Elimina contatto",
    titleShort: "Elimina contatto",
    description:
      "Elimina per sempre il contatto e il suo percorso. Non si può annullare.",
    container: {
      title: "Elimina contatto",
      description:
        "Sei sicuro di voler eliminare definitivamente questa pista?",
    },
    backButton: {
      label: "Annulla",
    },
    submitButton: {
      label: "Elimina contatto",
      loadingText: "Deleting Lead...",
    },
    actions: {
      delete: "Elimina contatto",
      deleting: "Deleting Lead...",
    },
    id: {
      label: "ID del contatto",
      description: "Identificatore unico per il contatto per eliminare",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Il contatto fornito ID è invalido",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Autenticazione necessaria per eliminare i cavi",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di eliminare questo comando",
      },
      notFound: {
        title: "Contatto non trovato",
        description: "Nessun contatto trovato con il fornito ID",
      },
      conflict: {
        title: "Eliminare i conflitti",
        description:
          "Il contatto non può essere cancellato a causa delle dipendenze esistenti",
      },
      server: {
        title: "Errore del server",
        description:
          "Si è verificato un errore durante l'eliminazione del contatto",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile connettersi al server",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    success: {
      title: "Contatto eliminato",
      description: "Il contatto è stato eliminato con successo",
    },
  },
  countries: {
    ...regionalCountryNames("it"),
    global: "Globale",
    de: "Germania",
    pl: "Polonia",
    fr: "Francia",
    us: "Stati Uniti",
  },
  languages: {
    it: "Italiano",
    es: "Spagnolo",
    sk: "Slovacco",
    en: "Inglese",
    de: "Tedesco",
    pl: "Polacco",
    fr: "Francese",
  },
};
