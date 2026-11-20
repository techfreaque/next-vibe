import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Client SMTP",
  category: "Servizi e-mail",
  components: {
    email: {
      tagline: "Piattaforma di discorso libero AI",
      footer: {
        needHelp: "Ti serve aiuto?",
        helpText: "Ti serve aiuto? Contattaci a",
        unsubscribeText: "Preferisci non ricevere queste email?",
        unsubscribeLink: "Disiscriviti",
        copyright: "© {{currentYear}} {{appName}}. Tutti i diritti riservati.",
        visitWebsite: "Visita il sito web",
        allRightsReserved:
          "© {{currentYear}} {{appName}}. Tutti i diritti riservati.",
        feedbackHook:
          "Hai qualcosa da dire? Rispondete. L'abbiamo letto davvero.",
        feedbackBody:
          "Segnala un bug, richiedi una funzione o dicci cosa manca. Il feedback utile si guadagna crediti {{credits}}. E' un mese intero per noi.",
        feedbackLink: "Rispondi con feedback →",
        footerSeparator: " · ",
        legalOperator: "{{companyName}} è gestito da {{owner}}, {{address}}.",
        legalContact: "Contatto",
        legalNotice: "Avviso legale",
      },
    },
    post: {
      title: "Componenti",
      description: "Componenti endpoint",
      form: {
        title: "Configurazione dei componenti",
        description: "Configurare i parametri dei componenti",
      },
      response: {
        title: "Risposta",
        description: "Dati di risposta dei componenti",
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
  },
  emailSending: {
    email: {
      defaultSenderName: "Sistema",
      errors: {
        sending_failed:
          "Non è possibile inviare email a {{recipient}}: {{error}}",
        invalid_locale:
          "Non può inviare a {{recipient}}: ' {{locale}} ' non è un locale valido",
      },
    },
  },
  emailHandling: {
    email: {
      errors: {
        rendering_failed:
          "Non è possibile visualizzare il modello di e-mail: {{error}}",
        send_failed: "Non inviare email: {{error}}",
        email_failed_subject: "Email non riuscita",
        unknown_recipient: "Destinatario sconosciuto",
        unknown_sender: "Sistema",
        email_render_exception: "Eccezione di rendering e-mail è avvenuta",
        batch_send_failed: "Batch email invio fallito",
        batch_send_failed_item: "Batch invio fallito: {{error}}",
        batch_send_failed_all: "Batch email inviare non riuscito: {{errors}}",
      },
    },
  },
  sending: {
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Autenticazione richiesta per le operazioni di invio SMTP",
      },
      server: {
        title: "Errore del server",
        description: "Si è verificato un errore sul server SMTP",
        detail: "SMTP invia guasto: {{error}}",
        detail_account:
          "Guasto SMTP su {{accountName}} ({{accountId}}): {{error}}",
        detail_attempt:
          "L'account SMTP {{accountId}} non è riuscito nel tentativo {{attempt}}: {{error}}",
        detail_exhausted: "SMTP conto {{accountId}} esaurito tutti i retries",
      },
      rejected: {
        title: "E-mail a {{recipient}} respinta: {{reason}}",
        defaultReason: "Email respinta dal server",
      },
      no_recipients: {
        title: "Nessun destinatario accettato per {{recipient}}",
        defaultReason: "Nessun destinatario accettato",
      },
      rate_limit: {
        title:
          "Limite di velocità oraria colpito su {{accountName}}: {{current}} / {{limit}} inviato, {{remainingCapacity}} sinistra",
      },
      capacity: {
        title: "Controllo della capacità non riuscito: {{error}}",
      },
      no_account: {
        title: "Nessun account SMTP disponibile",
        detail_criteria:
          "Nessun account SMTP per {{campaignType}} / {{journeyVariant}} / {{campaignStage}} / {{country}} / {{language}}",
        detail_campaign:
          "Nessun account SMTP per campagna tipo {{campaignType}}",
        detail_account: "SMTP account {{accountId}} non trovato",
      },
    },
  },
  emailMetadata: {
    errors: {
      server: {
        title: "Errore del server Metadati Email",
        description: "Non memorizzare i metadati email",
        detail_store:
          "Non è possibile memorizzare i metadati per {{recipient}}: {{error}}",
        detail_engagement:
          "Non è stato possibile aggiornare l'impegno per il messaggio {{emailId}}: {{error}}",
      },
    },
  },
  enums: {
    status: {
      active: "Attivo",
      inactive: "Inattivo",
      error: "Errore",
      testing: "Testing",
    },
    securityType: {
      none: "Nessuno",
      tls: "TLS",
      ssl: "SSL",
      starttls: "STARTTLS",
    },
    statusFilter: {
      all: "Tutti gli stati",
    },
    healthStatus: {
      healthy: "Salute",
      degraded: "Degrado",
      unhealthy: "Insicuro",
      unknown: "Sconosciuto",
    },
    healthStatusFilter: {
      all: "Tutti gli stati di salute",
    },
    sortField: {
      name: "Nome",
      status: "Stato",
      createdAt: "Creato a",
      updatedAt: "Aggiornato At",
      priority: "Priorità",
      totalEmailsSent: "Totale messaggi di posta elettronica",
      lastUsedAt: "Ultimo accesso",
    },
    campaignType: {
      leadCampaign: "Campagna di acquisizione contatti",
      newsletter: "Newsletter",
      signupNurture: "Nurture di iscrizione",
      retention: "Retenzione",
      winback: "Winback",
      transactional: "Transazione",
      notification: "Notifica",
      system: "Sistema",
    },
    campaignTypeFilter: {
      all: "Tutti i tipi di campagna",
    },
    selectionRuleSortField: {
      name: "Nome",
      priority: "Priorità",
      campaignType: "Tipo di campagna",
      journeyVariant: "Variante di viaggio",
      campaignStage: "Fase di campagna",
      country: "Paese",
      language: "Lingua",
      createdAt: "Creato a",
      updatedAt: "Aggiornato At",
      emailsSent: "Inviare email",
      successRate: "Tasso di successo",
      lastUsedAt: "Ultimo accesso",
    },
    selectionRuleStatusFilter: {
      all: "Tutti",
      active: "Attivo",
      inactive: "Inattivo",
      default: "Predefinito",
      failover: "Failover",
    },
    loadBalancingStrategy: {
      roundRobin: "Robin",
      weighted: "Peso",
      priority: "Priorità",
      leastUsed: "Meno Usato",
    },
    testResult: {
      success: "Operazione riuscita",
      authFailed: "Autenticazione non riuscita",
      connectionFailed: "Connessione non riuscita",
      timeout: "Timeout",
      unknownError: "Errore sconosciuto",
    },
  },
};
