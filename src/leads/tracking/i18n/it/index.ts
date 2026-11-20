import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Tracciamento dei contatti",
  tags: {
    tracking: "Tracciamento",
    engagement: "Engagement",
  },
  post: {
    title: "Engagement dei lead record",
    titleShort: "Engagement del tracciato",
    description: "Registra un nuovo evento di fidanzamento per un lead",
    form: {
      title: "Modulo di interazione del contatto",
      description: "Dettagli di fidanzamento record",
    },
    leadId: {
      label: "ID del contatto",
      description: "Identificatore unico per il contatto",
      placeholder: "Inserisci l’ID del contatto",
      helpText: "UUID del contatto per tracciare il fidanzamento per",
    },
    engagementType: {
      label: "Tipo di inserimento",
      description: "Tipo di evento di fidanzamento",
      placeholder: "Selezionare il tipo di fidanzamento",
      helpText: "Il tipo di interazione o impegno",
    },
    campaignId: {
      label: "Campagna ID",
      description: "Identificatore di campagna associato",
      placeholder: "Entra nella campagna ID",
      helpText: "Campagna opzionale questo impegno fa parte di",
    },
    metadata: {
      label: "Metadati",
      description: "Altri metadati di impegno",
      placeholder: "Inserisci i metadati come JSON",
      helpText: "Dati personalizzati su questo impegno",
    },
    userId: {
      label: "Utente ID",
      description: "Identificatore utente associato",
      placeholder: "Inserisci utente ID",
      helpText: "utente opzionale ID se il contatto è associato a un utente",
    },
    response: {
      id: "Engagement ID",
      leadId: "ID del contatto",
      engagementType: "Tipo di inserimento",
      campaignId: "Campagna ID",
      metadata: "Metadati",
      timestamp: "Timestamp",
      ipAddress: "IP Indirizzo",
      userAgent: "Agente Utente",
      createdAt: "Creato a",
      leadCreated: "Contatto creato",
      relationshipEstablished: "Relazioni Istituite",
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
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    success: {
      title: "Engagement registrato",
      description: "Il coinvolgimento dei lead registrato con successo",
    },
  },
  get: {
    title: "Track Lead Click",
    titleShort: "Tracciare il tasto",
    description: "Tracciare il clic del cavo e reindirizzare al target URL",
    form: {
      title: "Fare clic sui parametri di tracciamento",
      description: "Parametri per il tracciamento del clic e reindirizzare",
    },
    id: {
      label: "ID del contatto",
      description: "Identificatore unico per il contatto",
      placeholder: "Inserisci l’ID del contatto",
      helpText: "UUID del cavo per tracciare clicca per",
    },
    stage: {
      label: "Fase di campagna",
      description: "Fase della campagna e-mail",
      placeholder: "Selezionare la fase della campagna",
      helpText: "Fase di campagna opzionale questo clic fa parte di",
    },
    source: {
      label: "Origine del contatto",
      description: "Fonte del contatto",
      placeholder: "Selezionare la sorgente di contatto",
      helpText: "Fonte da cui proviene il contatto",
    },
    url: {
      label: "Obiettivo URL",
      description: "URL per reindirizzare dopo il tracciamento",
      placeholder: "Inserisci il target URL",
      helpText: "La destinazione URL per la redirect",
    },
    ref: {
      label: "Riferimento ID",
      description: "Identificatore di riferimento per il tracciamento",
      placeholder: "Inserisci il riferimento ID",
      helpText:
        "Riferimento opzionale ID per un contesto di tracciamento aggiuntivo",
    },
    sig: {
      label: "Firma del link",
      description:
        "Prove una destinazione esterna è venuto da un link che abbiamo generato",
    },
    response: {
      success: "Operazione riuscita",
      redirectUrl: "Redirect URL",
      leadId: "ID del contatto",
      campaignId: "Campagna ID",
      engagementRecorded: "Engagement registrato",
      leadStatusUpdated: "Stato del contatto aggiornato",
      isLoggedIn: "è in ritardo",
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
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    success: {
      title: "Fare clic su Tracciato",
      description: "Contatto click tracciato con successo",
    },
  },
  widget: {
    post: {
      headerTitle: "Registrazione",
      viewStatsTitle: "Visualizza le statistiche di contatto",
      statsButton: "Stat",
      loading: "Registrazione di impegno...",
      successTitle: "Engagement registrato",
      successSubtitle: "tracciato con successo",
      event: "Evento",
      labels: {
        engagementId: "Engagement ID",
        type: "Tipologia",
        leadId: "ID del contatto",
        campaignId: "Campagna ID",
        ipAddress: "IP Indirizzo",
        recordedAt: "Registrato a",
        leadCreated: "Contatto creato",
        leadCreatedYes: "Sì (nuovo comando)",
        leadCreatedNo: "No (esistente)",
        relationshipEst: "Rapporto Est.",
        relationshipYes: "Sì.",
        relationshipNo: "No.",
        metadata: "Metadati",
      },
      nextSteps: "Prossimo passo:",
      viewLeadButton: "Visualizza contatto",
      leadStatsButton: "Statistiche dei contatti",
      emptyTitle: "Tracciare un evento di coinvolgimento",
      emptyDescription:
        "Compila il modulo sottostante e invia per registrare un nuovo evento di fidanzamento per un lead",
      viewLeadStatsButton: "Visualizza le statistiche di contatto",
    },
    get: {
      headerTitle: "Fare clic su Tracciamento",
      viewStatsTitle: "Visualizza le statistiche di contatto",
      statsButton: "Stat",
      loading: "Elaborazione click tracking...",
      successTitle: "Fare clic su Tracciato",
      successSubtitle: "Engagement registrato e reindirizzare URL pronto",
      failTitle: "Rilevamento non corretto",
      failSubtitle: "Non è possibile registrare l'evento click",
      labels: {
        engagementLabel: "Engagement",
        recorded: "Registrato",
        notRecorded: "Non registrato",
        leadStatusLabel: "Stato del contatto",
        updated: "Aggiornato",
        unchanged: "Scambio",
        userLabel: "Utente",
        loggedIn: "Mi sono intrufolato.",
        anonymous: "Anonimo",
        leadId: "ID del contatto",
        campaignId: "Campagna ID",
        redirectUrl: "Redirect URL",
      },
      nextSteps: "Prossimo passo:",
      openUrlButton: "Aprire URL",
      viewLeadButton: "Visualizza contatto",
      leadStatsButton: "Statistiche dei contatti",
      emptyTitle: "Tracciare un evento di clic",
      emptyDescription:
        "Inserisci i parametri di tracciamento qui sotto per registrare un clic e recuperare il reindirizzamento URL",
      viewLeadStatsButton: "Visualizza le statistiche di contatto",
    },
  },
  enums: {
    engagementLevel: {
      high: "Alto.",
      medium: "Mezzo medio",
      low: "Basso",
      none: "Nessuno",
    },
    engagementTypes: {
      emailOpen: "Email Apri",
      emailClick: "E-mail",
      websiteVisit: "Visita del sito web",
      formSubmit: "Modulo di richiesta",
      leadAttribution: "Attribuzione del contatto",
    },
    emailCampaignStage: {
      notStarted: "Non iniziato",
      initial: "Iniziativa",
      followup1: "Seguito 1",
      followup2: "Seguito 2",
      followup3: "Seguito 3",
      nurture: "Nurture",
      reactivation: "Riattivazione",
    },
    leadSource: {
      website: "Sito web",
      socialMedia: "Social Media",
      emailCampaign: "Campagna di email",
      referral: "Inviti",
      csvImport: "Importazione di CSV",
    },
  },
  error: {
    default:
      "Si è verificato un errore durante l'elaborazione del fidanzamento",
  },
};
