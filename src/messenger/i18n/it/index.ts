import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Email",
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
    en: "Inglese",
    de: "Tedesco",
    pl: "Polacco",
    fr: "Francese",
  },
  enums: {
    // SMTP Client Enums
    smtpSecurityType: {
      none: "Nessuno",
      tls: "TLS",
      ssl: "SSL",
      starttls: "STARTTLS",
    },
    smtpAccountStatus: {
      active: "Attivo",
      inactive: "Inattivo",
      error: "Errore",
      testing: "Testing",
    },
    smtpHealthStatus: {
      healthy: "Salute",
      degraded: "Degrado",
      unhealthy: "Insicuro",
      unknown: "Sconosciuto",
    },
    smtpSortField: {
      name: "Nome",
      status: "Stato",
      createdAt: "Creato a",
      updatedAt: "Aggiornato At",
      priority: "Priorità",
      totalEmailsSent: "Totale messaggi di posta elettronica",
      lastUsedAt: "Ultimo accesso",
    },
    smtpCampaignType: {
      leadCampaign: "Campagna di acquisizione contatti",
      newsletter: "Newsletter",
      signupNurture: "Nurture di iscrizione",
      retention: "Retenzione",
      winback: "Winback",
      transactional: "Transazione",
      notification: "Notifica",
      system: "Sistema",
    },
    smtpLoadBalancingStrategy: {
      roundRobin: "Robin",
      weighted: "Peso",
      priority: "Priorità",
      leastUsed: "Meno Usato",
    },
    loadBalancingStrategy: {
      roundRobin: "Robin",
      weighted: "Peso",
      priority: "Priorità",
      leastUsed: "Meno Usato",
    },
    smtpTestResult: {
      success: "Operazione riuscita",
      authFailed: "Autenticazione non riuscita",
      connectionFailed: "Connessione non riuscita",
      timeout: "Timeout",
      unknownError: "Errore sconosciuto",
    },
    testResult: {
      success: "Operazione riuscita",
      authFailed: "Autenticazione non riuscita",
      connectionFailed: "Connessione non riuscita",
      timeout: "Timeout",
      unknownError: "Errore sconosciuto",
    },
    smtpStatusFilter: {
      any: "Qualsiasi",
    },
    smtpHealthStatusFilter: {
      any: "Qualsiasi",
    },
    smtpCampaignTypeFilter: {
      any: "Qualsiasi",
    },
    smtpSelectionRuleSortField: {
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
    smtpSelectionRuleStatusFilter: {
      any: "Qualsiasi",
      active: "Attivo",
      inactive: "Inattivo",
      default: "Predefinito",
      failover: "Failover",
    },
    selectionRuleStatusFilter: {
      any: "Qualsiasi",
      active: "Attivo",
      inactive: "Inattivo",
      default: "Predefinito",
      failover: "Failover",
    },
    // Email Messages Enums
    emailStatus: {
      pending: "Finanziamenti",
      sent: "Inviato",
      delivered: "Consegnato",
      opened: "Aperto",
      clicked: "Cliccato",
      bounced: "Bounce",
      failed: "Sfigato",
      unsubscribed: "Iscrizione annullata",
    },
    emailType: {
      transactional: "Transazione",
      marketing: "Marketing",
      notification: "Notifica",
      system: "Sistema",
      leadCampaign: "Campagna di acquisizione contatti",
      userCommunication: "Comunicazione dell'utente",
    },
    emailProvider: {
      resend: "Resend",
      sendgrid: "SendGrid",
      mailgun: "Mailgun",
      ses: "Amazon SES",
      smtp: "SMTP",
      mailjet: "Mailjet",
      postmark: "Postmark",
      other: "Altro",
    },
    emailSortField: {
      subject: "Oggetto",
      recipientEmail: "Email sensibile",
      recipientName: "Nome del destinatario",
      type: "Tipologia",
      status: "Stato",
      sentAt: "Inviato a",
      createdAt: "Creato a",
    },
    emailStatusFilter: {
      any: "Qualsiasi",
    },
    emailTypeFilter: {
      any: "Qualsiasi",
    },
    emailRetryRange: {
      noRetries: "Nessun problema",
      oneToTwo: "1-2 Ritiri",
      threeToFive: "3-5 Reti",
      sixPlus: "6+ Rettori",
    },
    // IMAP Client Enums
    imapSyncStatus: {
      pending: "Finanziamenti",
      syncing: "Sincronizzazione",
      synced: "Traduzione:",
      error: "Errore",
    },
    imapOverallSyncStatus: {
      idle: "Idle",
      running: "Esecuzione",
      completed: "Completo",
      failed: "Sfigato",
      cancelled: "Annullamento",
    },
    imapSortOrder: {
      asc: "Assunzione",
      desc: "Discussione",
    },
    imapAuthMethod: {
      plain: "Pianura",
      oauth2: "OAuth2",
      xoauth2: "XOAuth2",
    },
    imapSpecialUseType: {
      inbox: "Posta in arrivo",
      sent: "Inviato",
      drafts: "Progetti",
      trash: "Trattamenti",
      junk: "Junk",
      archive: "Archivia",
    },
    imapFolderSortField: {
      name: "Nome",
      displayName: "Nome dell'esposizione",
      messageCount: "Contatore di messaggi",
      unseenCount: "Conte invisibile",
      createdAt: "Creato a",
    },
    imapAccountSortField: {
      name: "Nome",
      email: "Email",
      host: "Host",
      enabled: "Abilitato",
      lastSyncAt: "Ultimo messaggio",
      createdAt: "Creato a",
    },
    imapConnectionStatus: {
      disconnected: "Scollegato",
      connecting: "Collegamento",
      connected: "Collegato",
      error: "Errore",
      timeout: "Timeout",
    },
    imapSyncStatusFilter: {
      all: "Tutti",
    },
    imapAccountStatusFilter: {
      all: "Tutti",
      enabled: "Abilitato",
      disabled: "Disabili",
    },
    imapAccountFilter: {
      all: "Tutti",
    },
    imapMessageSortField: {
      subject: "Oggetto",
      senderName: "Nome del fornitore",
      senderEmail: "Email di pagamento",
      recipientEmail: "Email sensibile",
      recipientName: "Nome del destinatario",
      isRead: "Leggi",
      isFlagged: "È bandito",
      messageSize: "Formato del messaggio",
      sentAt: "Inviato a",
      createdAt: "Creato a",
    },
    imapMessageStatusFilter: {
      all: "Tutti",
      read: "Leggi tutto",
      unread: "Non c'è",
      flagged: "Bandiera",
      unflagged: "Non gonfiato",
      draft: "Progetto",
      deleted: "Cancellato",
      hasAttachments: "Ha degli allegati",
      noAttachments: "Nessun allegato",
    },
    imapHealthStatus: {
      healthy: "Salute",
      warning: "Avvertenza",
      error: "Errore",
      maintenance: "Manutenzione",
    },
    imapPerformanceStatus: {
      good: "Buona",
      warning: "Avvertenza",
      error: "Errore",
    },
    bulkMessageAction: {
      markRead: "Segnala come Leggi",
      markUnread: "Segnala come unleggibile",
      flag: "Bandiera",
      unflag: "Unflag",
      delete: "Elimina",
    },
    imapLoggingLevel: {
      error: "Errore",
      warn: "Avvertenza",
      info: "Info",
      debug: "Debug",
    },
    // Email Service Enums
    emailServicePriority: {
      low: "Basso",
      normal: "Normale",
      high: "Alto.",
      urgent: "Urgente",
    },
    emailServiceStatus: {
      idle: "Idle",
      processing: "Lavorazione",
      completed: "Completo",
      failed: "Sfigato",
      retrying: "Ripensare",
    },
    // SMS Service Enums
    smsProvider: {
      twilio: "Twilio",
      awsSns: "AWS SNS",
      messagebird: "MessageBird",
      plivo: "Plivo",
    },
    smsStatus: {
      pending: "Finanziamenti",
      sent: "Inviato",
      delivered: "Consegnato",
      failed: "Sfigato",
      rejected: "Rifiuti",
      undelivered: "Non consegnata",
    },
    smsTemplateType: {
      notification: "Notifica",
      verification: "Verifica",
      marketing: "Marketing",
      alert: "Avviso",
      reminder: "Mitragliatrice",
    },
  },
  errors: {
    no_email: "Nessun indirizzo email fornito",
    email_generation_failed: "Non generare e-mail",
  },
  email: {
    errors: {
      send: {
        title: "Invia email non riuscita",
      },
    },
  },
  smsService: {
    title: "Servizio SMS",
    description: "Invia messaggi SMS attraverso vari fornitori",
    category: "Servizio SMS",
    tag: "Servizio SMS",
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non sei autorizzato a inviare messaggi SMS",
      },
      forbidden: {
        title: "Accesso negato",
        description: "L'accesso al servizio SMS è vietato",
      },
      validation: {
        title: "Errore di convalida",
        description: "Dati di richiesta non validi SMS",
      },
      internal: {
        title: "Errore interno",
        description: "Si è verificato un errore del server interno",
      },
      conflict: {
        title: "Conflitto",
        description: "SMS richiede conflitti con i dati esistenti",
      },
      notFound: {
        title: "Non trovato",
        description: "risorsa SMS non trovata",
      },
      network: {
        title: "Errore di rete",
        description: "Errore di rete si è verificato durante l'invio SMS",
      },
      server: {
        title: "Errore del server",
        description: "Si è verificato un errore del server interno",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      invalid_phone: {
        title: "Numero di telefono non valido",
      },
      send: {
        title: "SMS Invia fallito",
      },
    },
    send: {
      title: "Invia a SMS",
      description: "Invia un messaggio a SMS al destinatario",
      container: {
        title: "Configurazione SMS",
        description: "Configurare i parametri di invio SMS",
      },
      to: {
        label: "Numero di telefono",
        description: "Numero di telefono sensibile",
        placeholder: "+1234567890",
      },
      message: {
        label: "Messaggio",
        description: "Contenuto del messaggio SMS",
        placeholder: "Inserisci il tuo messaggio qui...",
      },
      campaignType: {
        label: "Tipo di campagna",
        description: "Selezionare il tipo di campagna per questo SMS",
        placeholder: "Selezionare il tipo di campagna",
      },
      leadId: {
        label: "ID del contatto",
        description: "Identificatore di contatto associato",
        placeholder: "lead-12345",
      },
      templateName: {
        label: "Nome del modello",
        description: "Modello SMS da usare",
        placeholder: "Selezionare il modello",
      },
      response: {
        result: {
          title: "Risultato di SMS",
          description: "Risultato dell'operazione di invio SMS",
          success: "Operazione riuscita",
          messageId: "Messaggio ID",
          sentAt: "Inviato a",
          provider: "Fornitore",
          cost: "Costo",
        },
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Dati di richiesta non validi SMS",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Non sei autorizzato a inviare messaggi SMS",
        },
        forbidden: {
          title: "Accesso negato",
          description: "L'accesso al servizio SMS è vietato",
        },
        conflict: {
          title: "Conflitto",
          description: "SMS richiede conflitti con i dati esistenti",
        },
        notFound: {
          title: "Non trovato",
          description: "risorsa SMS non trovata",
        },
        network: {
          title: "Errore di rete",
          description: "Errore di rete si è verificato durante l'invio SMS",
        },
        server: {
          title: "Errore del server",
          description: "Si è verificato un errore del server interno",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "SMS Sent Successivo",
        description: "Il tuo SMS è stato inviato con successo",
      },
    },
  },
  sms: {
    errors: {
      invalid_phone: {
        title: "Numero di telefono non valido",
      },
      send: {
        title: "SMS Invia fallito",
      },
    },
  },
  emailService: {
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
          copyright:
            "© {{currentYear}} {{appName}}. Tutti i diritti riservati.",
          visitWebsite: "Visita il sito web",
          allRightsReserved:
            "© {{currentYear}} {{appName}}. Tutti i diritti riservati.",
          feedbackHook:
            "Hai qualcosa da dire? Rispondete. L'abbiamo letto davvero.",
          feedbackBody:
            "Segnala un bug, richiedi una funzione o dicci cosa manca. Il feedback utile guadagna crediti {{credits}}. un mese intero su di noi.",
          feedbackLink: "Rispondi con feedback →",
          footerSeparator: " · ",
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
          sending_failed: "Non ha inviato email a {{recipient}}",
        },
      },
    },
    emailHandling: {
      email: {
        errors: {
          rendering_failed: "Non è riuscito a rendere il modello di e-mail",
          send_failed: "Non inviare email",
          email_failed_subject: "Email non riuscita",
          unknown_recipient: "Destinatario sconosciuto",
          unknown_sender: "Sistema",
          email_render_exception: "Eccezione di rendering e-mail è avvenuta",
          batch_send_failed: "Batch email invio fallito",
        },
      },
    },
    sending: {
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description:
            "Autenticazione richiesta per le operazioni di invio SMTP",
        },
        server: {
          title: "Errore del server",
          description: "Si è verificato un errore sul server SMTP",
        },
        rejected: {
          title: "E-mail respinta",
          defaultReason: "Email respinta dal server",
        },
        no_recipients: {
          title: "Nessun destinatario accettato",
          defaultReason: "Nessun destinatario accettato",
        },
        rate_limit: {
          title: "Limite di richieste superato",
        },
        capacity: {
          title: "Errore di capacità",
        },
        no_account: {
          title: "Nessun account SMTP disponibile",
        },
      },
    },
    emailMetadata: {
      errors: {
        server: {
          title: "Errore del server Metadati Email",
          description: "Non memorizzare i metadati email",
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
  },
  imapClient: {
    category: "Client IMAP",
    tag: "Client IMAP",
    tags: {
      health: "Salute",
      monitoring: "Monitoraggio",
      sync: "Sincronizzazione",
      accounts: "Account",
      folders: "Cartelle",
      messages: "Messaggi",
      config: "Configurazione",
    },
    messages: {
      tag: "Messaggi",
      id: {
        widget: {
          markRead: "Segnala come Leggi",
          markUnread: "Segnala come unleggibile",
          flag: "Bandiera",
          unflag: "Unflag",
        },
      },
      errors: {
        server: { title: "Errore del server" },
        notFound: { title: "Messaggio non trovato" },
        accountNotFound: { title: "Account Non trovato" },
        syncFailed: { title: "Traduzione:" },
        syncSuccess: { message: "Messaggi sincronizzati con successo" },
        list: {
          get: {
            errors: { server: { title: "Messaggi di errore del server" } },
          },
        },
      },
    },
    sync: {
      category: "Client IMAP",

      title: "Sincronizzazione IMAP",
      description: "Servizio di sincronizzazione IMAP",
      container: {
        title: "Configurazione sincronizzazione IMAP",
        description: "Configurare i parametri di sincronizzazione IMAP",
      },
      accountIds: {
        label: "ID account",
        description: "ID account IMAP per sincronizzare",
        placeholder: "Inserisci ID account separati da virgole",
      },
      force: {
        label: "Sincronizzazione della Forza",
        description:
          "Sincronizzazione forza anche se recentemente sincronizzata",
      },
      dryRun: {
        label: "Correre a secco",
        description: "Eseguire un test senza apportare modifiche",
      },
      maxMessages: {
        label: "Max messaggi",
        description: "Numero massimo di messaggi da sincronizzare per cartella",
        placeholder: "Inserisci il numero massimo di messaggi",
      },
      post: {
        title: "Sincronizzazione",
        description: "Sincronizzazione",
        form: {
          title: "Configurazione di sincronizzazione",
          description: "Configurare i parametri di sincronizzazione",
        },
        response: {
          title: "Risposta",
          description: "Dati di risposta Sync",
          result: {
            title: "Risultati Sync",
            description: "Risultati di sincronizzazione dettagliati",
            accountsProcessed: "Conti elaborati",
            foldersProcessed: "Cartelle lavorate",
            messagesProcessed: "Messaggi elaborati",
            messagesAdded: "Messaggi aggiunti",
            messagesUpdated: "Messaggi Aggiornati",
            messagesDeleted: "Messaggi cancellati",
            duration: "Durata",
          },
          errors: {
            error: {
              title: "Errore di sincronizzazione",
              description: "Dettagli dell’errore",
              code: "Codice di errore",
              message: "Messaggio di errore",
            },
          },
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
      },
      success: {
        title: "Operazione riuscita",
        description: "Operazione completata",
      },
      widget: {
        title: "Sincronizzazione completa IMAP",
        options: "Opzioni di sincronizzazione",
        noAccounts: "Nessun account IMAP configurato",
        result: "Risultato di Sync",
        duration: "Durata",
        errors: "Errori",
        accountsProcessed: "Conti elaborati",
        foldersProcessed: "Cartelle lavorate",
        messagesProcessed: "Messaggi elaborati",
        messagesAdded: "Messaggi aggiunti",
        messagesUpdated: "Messaggi Aggiornati",
        messagesDeleted: "Messaggi cancellati",
        submit: "Avviare la sincronizzazione",
        submitting: "Sincronizzazione...",
      },
    },
    imapErrors: {
      accounts: {
        post: {
          error: {
            duplicate: {
              title: "L'account esiste già",
            },
            server: {
              title: "Errore del server creare account",
            },
          },
        },
        get: {
          error: {
            not_found: {
              title: "Account non trovato",
            },
            server: {
              title: "Errore del server che recupera l'account",
            },
          },
        },
        put: {
          error: {
            not_found: {
              title: "Account non trovato",
            },
            duplicate: {
              title: "Account con questa e-mail esiste già",
            },
            server: {
              title: "Aggiornamento dell'errore server",
            },
          },
        },
        delete: {
          error: {
            not_found: {
              title: "Account non trovato",
            },
            server: {
              title: "Errore del server che cancella l'account",
            },
          },
          success: {
            title: "Account cancellato con successo",
          },
        },
      },
      folders: {
        get: {
          error: {
            not_found: {
              title: "Cartella non trovata",
            },
            server: {
              title: "Cartella di recupero dell'errore del server",
            },
          },
        },
        sync: {
          error: {
            missing_account: {
              title:
                "Account non trovato per la sincronizzazione della cartella",
            },
          },
        },
      },
      messages: {
        get: {
          error: {
            not_found: {
              title: "Messaggio non trovato",
            },
            server: {
              title: "Errore del server che recupera il messaggio",
            },
          },
        },
      },
      connection: {
        failed: "La connessione non è riuscita",
        timeout: {
          title: "Tempo di connessione",
        },
        test: {
          failed: "Test di connessione fallito",
        },
        close: {
          failed: "Non riuscito a chiudere la connessione",
        },
        folders: {
          list: {
            failed: "Non elencare le cartelle",
          },
        },
        messages: {
          list: {
            failed: "Non elencare i messaggi",
          },
        },
      },
      sync: {
        failed: "Sync ha fallito",
        account: {
          failed: "Sincronia dell'account fallita",
        },
        folder: {
          failed: "Sincronizzazione cartella guasto",
        },
        message: {
          failed: "Sincronia del messaggio fallita",
        },
        post: {
          error: {
            server: {
              title: "Errore del server durante la sincronizzazione",
            },
          },
        },
      },
      validation: {
        account: {
          username: {
            required: "Il nome utente è richiesto",
          },
          port: {
            invalid: "Numero di porto non valido",
          },
          host: {
            invalid: "Ospite non valido",
          },
        },
      },
    },
    imap: {
      "example.com": "imap.example.com",
      "gmail.com": "imap.gmail.com",
      connection: {
        test: {
          success: "Test di connessione di successo",
          failed: "Test di connessione fallito",
          timeout: "Tempo di prova di connessione",
        },
      },
      sync: {
        messages: {
          accounts: {
            success: "Tutti gli account sincronizzati con successo",
            successWithErrors: "Conti sincronizzati con errori",
          },
          account: {
            success: "Conto sincronizzato con successo",
            successWithErrors: "Conto sincronizzato con errori",
          },
          folders: {
            success: "Cartelle sincronizzate con successo",
            successWithErrors: "Cartelle sincronizzate con gli errori",
          },
          messages: {
            success: "Messaggi sincronizzati con successo",
            successWithErrors: "Messaggi sincronizzati con errori",
          },
        },
        errors: {
          default: "Sincronizzazione IMAP guasto",
          account_failed: "Sincronia dell'account fallita",
          folder_sync_failed: "Sincronizzazione cartella guasto",
          message_sync_error: "Errore di sincronizzazione del messaggio",
          message_sync_failed: "Sincronia del messaggio fallita",
        },
      },
    },
    enums: {
      loggingLevel: {
        error: "Errore",
        warn: "Avvertenza",
        info: "Info",
        debug: "Debug",
      },
      syncStatus: {
        pending: "Finanziamenti",
        syncing: "Sincronizzazione",
        synced: "Traduzione:",
        error: "Errore",
      },
      overallSyncStatus: {
        idle: "Idle",
        running: "Esecuzione",
        completed: "Completo",
        failed: "Sfigato",
        cancelled: "Annullamento",
      },
      sortOrder: {
        asc: "Assunzione",
        desc: "Discussione",
      },
      authMethod: {
        plain: "Pianura",
        oauth2: "OAuth2",
        xoauth2: "XOAuth2",
      },
      imapAuthMethod: {
        plain: "Pianura",
        oauth2: "OAuth2",
        xoauth2: "XOAuth2",
      },
      specialUseType: {
        inbox: "Posta in arrivo",
        sent: "Inviato",
        drafts: "Progetti",
        trash: "Trattamenti",
        junk: "Junk",
        archive: "Archivia",
      },
      folderSortField: {
        name: "Nome",
        displayName: "Nome dell'esposizione",
        messageCount: "Contatore di messaggi",
        unseenCount: "Conte invisibile",
        createdAt: "Creato a",
      },
      accountSortField: {
        name: "Nome",
        email: "Email",
        host: "Host",
        enabled: "Abilitato",
        lastSyncAt: "Ultimo messaggio",
        createdAt: "Creato a",
      },
      connectionStatus: {
        disconnected: "Scollegato",
        connecting: "Collegamento",
        connected: "Collegato",
        error: "Errore",
        timeout: "Timeout",
      },
      syncStatusFilter: {
        all: "Tutti gli stati Sync",
      },
      accountStatusFilter: {
        all: "Tutti gli stati dell'account",
        enabled: "Abilitato",
        disabled: "Disabili",
      },
      accountFilter: {
        all: "Tutti gli account",
      },
      messageSortField: {
        subject: "Oggetto",
        senderName: "Nome del fornitore",
        senderEmail: "Email di pagamento",
        recipientEmail: "Email sensibile",
        recipientName: "Nome del destinatario",
        isRead: "Leggi lo stato",
        isFlagged: "Bandiera",
        messageSize: "Formato del messaggio",
        sentAt: "Inviato a",
        createdAt: "Creato a",
      },
      messageStatusFilter: {
        all: "Tutti i messaggi",
        read: "Leggi tutto",
        unread: "Non c'è",
        flagged: "Bandiera",
        unflagged: "Non gonfiato",
        draft: "Progetto",
        deleted: "Cancellato",
        hasAttachments: "Ha degli allegati",
        noAttachments: "Nessun allegato",
      },
      healthStatus: {
        healthy: "Salute",
        warning: "Avvertenza",
        error: "Errore",
        maintenance: "Manutenzione",
      },
      performanceStatus: {
        good: "Buona",
        warning: "Avvertenza",
        error: "Errore",
      },
    },
  },
  messages: {
    category: "Messaggi di posta elettronica",
    tag: "Messaggi",
    tags: {
      stats: "Statistiche",
      analytics: "Analisi",
    },
    id: {
      category: "Email",
      tags: {
        emails: "Email",
      },
      title: "Dettaglio email",
      description: "Recuperare un'unica e-mail dal suo identificatore univoco",
      container: {
        title: "Email Dettagli",
        description:
          "Visualizza informazioni dettagliate su una specifica email",
      },
      fields: {
        id: {
          label: "Email ID",
          description: "Unico identificatore dell'e-mail per recuperare",
        },
      },
      response: {
        email: {
          title: "Email Dettagli",
          description: "Informazioni complete sull'e-mail richiesta",
          id: "Email ID",
          subject: "Oggetto",
          recipientEmail: "Email sensibile",
          recipientName: "Nome del destinatario",
          senderEmail: "Email di pagamento",
          senderName: "Nome del fornitore",
          type: "Tipo di email",
          status: "Stato",
          templateName: "Nome del modello",
          emailProvider: "Email Provider",
          externalId: "ID esterno",
          sentAt: "Inviato a",
          deliveredAt: "Consegnato a",
          openedAt: "Aperta",
          clickedAt: "Cliccato su",
          retryCount: "Conte di Retry",
          error: "Messaggio di errore",
          userId: "Utente ID",
          leadId: "ID del contatto",
          createdAt: "Creato a",
          updatedAt: "Aggiornato At",
        },
      },
      get: {
        errors: {
          validation: {
            title: "Errore di convalida",
            description: "L'e-mail fornita ID non è valida",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description:
              "Devi essere autenticato per accedere ai dettagli e-mail",
          },
          not_found: {
            title: "Email non trovata",
            description: "Nessuna e-mail trovata con il ID specificato",
          },
          forbidden: {
            title: "Accesso negato",
            description: "Non hai il permesso di visualizzare questa email",
          },
          server: {
            title: "Errore del server",
            description:
              "Si è verificato un errore del server interno durante il recupero dell'e-mail",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore imprevisto",
          },
        },
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "L'e-mail fornita ID non è valida",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description:
            "Devi essere autenticato per accedere ai dettagli e-mail",
        },
        notFound: {
          title: "Email non trovata",
          description: "Nessuna e-mail trovata con il ID specificato",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Non hai il permesso di visualizzare questa email",
        },
        server: {
          title: "Errore del server",
          description:
            "Si è verificato un errore del server interno durante il recupero dell'e-mail",
        },
        conflict: {
          title: "Errore di conflitto",
          description:
            "Si è verificato un conflitto durante l'elaborazione della richiesta di posta elettronica",
        },
        network: {
          title: "Errore di rete",
          description:
            "Si è verificato un errore di rete durante il recupero dell'e-mail",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Ci sono cambiamenti non rilevati",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
      },
      success: {
        title: "Email recuperato",
        description: "Dettagli e-mail recuperati con successo",
      },
      widget: {
        parties: "Parti",
        to: "A",
        from: "Da",
        timestamps: "Lampade da terra",
        sentAt: "Inviato a",
        deliveredAt: "Consegnato a",
        openedAt: "Aperta",
        clickedAt: "Cliccato su",
        technical: "Dettagli tecnici",
        template: "Template",
        provider: "Fornitore",
        externalId: "ID esterno",
        retryCount: "Conte di Retry",
        error: "Errore",
        associations: "Associazioni",
        lead: "Contatto",
        user: "Utente",
        notFound: "Email non trovata",
      },
      enums: {
        status: {
          pending: "Finanziamenti",
          sent: "Inviato",
          delivered: "Consegnato",
          opened: "Aperto",
          clicked: "Cliccato",
          bounced: "Bounce",
          failed: "Sfigato",
          unsubscribed: "Iscrizione annullata",
        },
        type: {
          transactional: "Transazione",
          marketing: "Marketing",
          notification: "Notifica",
          system: "Sistema",
          leadCampaign: "Campagna di acquisizione contatti",
          userCommunication: "Comunicazione dell'utente",
        },
        provider: {
          resend: "Resend",
          sendgrid: "SendGrid",
          mailgun: "Mailgun",
          ses: "Amazon SES",
          smtp: "SMTP",
          mailjet: "Mailjet",
          postmark: "Postmark",
          other: "Altro",
        },
      },
    },
    list: {
      category: "Email",
      tags: {
        emails: "Email",
      },
      title: "Elenco delle email",
      description:
        "Recuperare un elenco impaginato di e-mail con filtraggio e impaginazione",
      container: {
        title: "Elenco delle email",
        description:
          "Configurare i parametri dell'elenco e-mail e visualizzare i risultati",
      },
      filters: {
        title: "Filtri",
        description: "Filtro e email di ricerca",
      },
      displayOptions: {
        title: "Opzioni di visualizzazione",
      },
      fields: {
        dateRange: {
          title: "Gamma di date",
        },
        page: {
          label: "Pagina",
          description: "Numero di pagina per paginazione",
          placeholder: "Inserisci il numero di pagina",
        },
        limit: {
          label: "Limite",
          description: "Numero di articoli per pagina",
          placeholder: "Limiti di ingresso",
        },
        search: {
          label: "Cerca",
          description: "Cerca e-mail per soggetto, destinatario o mittente",
          placeholder: "Cercare e-mail...",
        },
        status: {
          label: "Stato",
          description: "Filtra per lo stato di e-mail",
          placeholder: "Selezionare lo stato",
        },
        channel: {
          label: "Canale",
          description: "Filtra per canale di messaggi",
        },
        type: {
          label: "Tipologia",
          description: "Filtra per email tipo",
          placeholder: "Selezionare il tipo",
        },
        sortBy: {
          label: "Ordina per",
          description: "Campo da smistamento",
          placeholder: "Seleziona il campo di selezione",
        },
        sortOrder: {
          label: "Ordinare",
          description: "Ordinare la direzione",
          placeholder: "Selezionare ordine ordinario",
        },
        dateFrom: {
          label: "Data da",
          description: "Filtra le email da questa data",
          placeholder: "Selezionare la data di inizio",
        },
        dateTo: {
          label: "Data di",
          description: "Filtra le email fino a questa data",
          placeholder: "Selezionare la data di fine",
        },
      },
      response: {
        emails: {
          title: "Email",
          emptyState: {
            title: "Nessuna email trovata",
            description: "Nessuna e-mail corrisponde ai filtri attuali",
          },
          item: {
            title: "Email",
            description: "Informazioni e-mail",
            id: "ID",
            subject: "Oggetto",
            recipientEmail: "Email sensibile",
            recipientName: "Nome del destinatario",
            senderEmail: "Email di pagamento",
            senderName: "Nome del fornitore",
            type: "Tipologia",
            status: "Stato",
            templateName: "Nome del modello",
            emailProvider: "Email Provider",
            externalId: "ID esterno",
            sentAt: "Inviato a",
            deliveredAt: "Consegnato a",
            openedAt: "Aperta",
            clickedAt: "Cliccato su",
            retryCount: "Conte di Retry",
            error: "Errore",
            userId: "Utente ID",
            leadId: "ID del contatto",
            createdAt: "Creato a",
            updatedAt: "Aggiornato At",
            emailCore: {
              title: "Informazioni di base",
            },
            emailParties: {
              title: "Sender &amp; Recipiente",
            },
            emailMetadata: {
              title: "Metadati",
            },
            emailEngagement: {
              title: "Tracciamento dell'ingenuazione",
            },
            technicalDetails: {
              title: "Dettagli tecnici",
            },
            associatedIds: {
              title: "ID associati",
            },
            timestamps: {
              title: "Lampade da terra",
            },
          },
        },
        pagination: {
          title: "Pagina",
          description: "Informazioni sulla pagina",
          page: "Pagina corrente",
          limit: "Articoli per pagina",
          total: "Totale articoli",
          totalPages: "Pagine totali",
        },
        filters: {
          title: "Filtri applicati",
          description: "Filtri attualmente applicati",
          status: "Filtro di stato",
          type: "Tipo di filtro",
          search: "Ricerca di Query",
          dateFrom: "Data di inizio",
          dateTo: "Data di fine",
        },
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "I parametri previsti sono invalidi",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Devi essere autenticato per accedere a questa risorsa",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Non hai il permesso di accedere a questa risorsa",
        },
        notFound: {
          title: "Non trovato",
          description: "La risorsa richiesta non è stata trovata",
        },
        server: {
          title: "Errore del server",
          description: "Si è verificato un errore del server interno",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        unsaved: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
        conflict: {
          title: "Conflitto",
          description: "La richiesta è in conflitto con lo stato attuale",
        },
        network: {
          title: "Errore di rete",
          description: "Si è verificato un errore di rete",
        },
      },
      success: {
        title: "Operazione riuscita",
        description: "Email recuperate con successo",
      },
      widget: {
        to: "A",
        retries: "Ritiri",
        opened: "Aperto",
        clicked: "Cliccato",
        stats: "Stat",
        graphs: "Grafi",
        refresh: "Aggiorna",
        searchPlaceholder: "Cercare e-mail...",
        clearSearch: "Azzera",
        emptyState: "Nessuna email trovata",
        emptyFiltered: "Nessun email corrisponde ai tuoi filtri",
        page: "Pagina",
        tabs: {
          all: "Tutti",
          sent: "Inviato",
          delivered: "Consegnato",
          opened: "Aperto",
          failed: "Sfigato",
          bounced: "Bounce",
        },
      },
      enums: {
        type: {
          transactional: "Transazione",
          marketing: "Marketing",
          notification: "Notifica",
          system: "Sistema",
          leadCampaign: "Campagna di acquisizione contatti",
          userCommunication: "Comunicazione dell'utente",
        },
        typeFilter: {
          any: "Tutti i tipi",
        },
        channel: {
          email: "Email",
          sms: "SMS",
          whatsapp: "WhatsApp",
          telegram: "Telegram",
        },
        channelFilter: {
          any: "Tutti i canali",
        },
        sortField: {
          subject: "Oggetto",
          recipientEmail: "Email sensibile",
          recipientName: "Nome del destinatario",
          type: "Tipologia",
          status: "Stato",
          sentAt: "Inviato a",
          createdAt: "Creato a",
        },
        sortOrder: {
          asc: "Assunzione",
          desc: "Discussione",
        },
      },
    },
    stats: {
      category: "Email",
      tags: {
        stats: "Statistiche",
        analytics: "Analisi",
      },
      dateRange: {
        today: "Oggi",
        yesterday:
          "Ieri, ieri, ieri, ieri sera, ieri, ieri, ieri, ieri, ieri, ieri, ieri, ieri, ieri, ieri, ieri, ieri, ieri",
        last7Days: "Ultimi 7 giorni",
        last30Days: "Ultimi 30 giorni",
        last90Days: "Ultimi 90 giorni",
        thisWeek: "Rassegna",
        lastWeek: "Rassegna",
        thisMonth: "Questo mese",
        lastMonth: "Ultimo mese",
        thisQuarter: "Questo quartiere",
        lastQuarter: "Ultimo trimestre",
        thisYear: "Quest'anno",
        lastYear: "Ultimo anno",
        custom: "Gamma personalizzata",
      },
      get: {
        title: "Statistiche del email",
        description: "Recuperare statistiche e-mail complete e metriche",
        form: {
          title: "Email Statistiche Richiesta",
          description: "Parametri per la querying e-mail statistiche",
        },
        startDate: {
          label: "Data di inizio",
          description: "Data di inizio per il periodo delle statistiche",
        },
        endDate: {
          label: "Data di fine",
          description: "Data di scadenza per il periodo delle statistiche",
        },
        accountId: {
          label: "Account ID",
          description: "Filtra le statistiche per conto specifico",
        },
        type: {
          label: "Tipo di email",
          description: "Filtra per email tipo",
          options: {
            all: "Tutti",
            sent: "Inviato",
            received: "Ricevuto.",
            draft: "Progetto",
            trash: "Trattamenti",
          },
        },
        groupBy: {
          label: "Gruppo per",
          description: "Come raggruppare le statistiche",
          options: {
            day: "Per giorno",
            week: "Rassegna",
            month: "Da Mese",
            account: "Per conto",
            type: "Per tipo",
          },
        },
        includeDetails: {
          label: "Includi dettagli",
          description: "Includere la ripartizione dettagliata dei risultati",
        },
        status: {
          label: "Stato di e-mail",
          description: "Filtra per lo stato di e-mail",
        },
        search: {
          label: "Cerca",
          description: "Ricerca e-mail per soggetto o destinatario",
        },
        timePeriod: {
          label: "Periodo di tempo",
          description: "Periodo di tempo granularità per i dati storici",
          hour: "Orario",
          day: "Giorno",
          week: "Rassegna",
          month: "Mese",
          quarter: "Quartiere",
          year: "Anno",
        },
        dateRangePreset: {
          label: "Preset della gamma di data",
          description: "Intervallo di date predefinito per il filtraggio",
        },
        dateFrom: {
          label: "Data di inizio",
          description: "Filtra le email da questa data",
        },
        dateTo: {
          label: "Data di fine",
          description: "Filtra le email fino a questa data",
        },
        chartType: {
          label: "Tipo di grafico",
          description: "Tipo di visualizzazione per grafici",
          line: "Grafico della linea",
          bar: "Grafico della barra",
          area: "Grafico dell'area",
          pie: "Grafico della torta",
          donut: "Grafico della ciambella",
        },
        includeComparison: {
          label: "Includere il confronto",
          description: "Includere il confronto con il periodo precedente",
        },
        sortBy: {
          label: "Ordina per",
          description: "Campo per ordinare e-mail da",
        },
        sortOrder: {
          label: "Ordinare",
          description: "Ordine di smistamento (a seconda o ascendente)",
        },
        response: {
          title: "Risposta delle statistiche di posta elettronica",
          description:
            "Statistiche e dati completi delle e-mail e delle metriche",
          totalEmails: "E-mail totali",
          sentEmails: "Inviare email",
          deliveredEmails: "E-mail fornite",
          openedEmails: "E-mail aperte",
          clickedEmails: "E-mail cliccate",
          bouncedEmails: "E-mail rimbalzate",
          failedEmails: "E-mail non corrette",
          draftEmails: "E-mail di progetto",
          openRate: "Tasso aperto",
          clickRate: "Cliccare sulla tariffa",
          deliveryRate: "Tasso di consegna",
          bounceRate: "Tasso di rimbalzo",
          failureRate: "Tasso di inadempimento",
          emailsByProvider: "Emails by Provider",
          emailsByTemplate: "E-mail per Template",
          emailsByStatus: "E-mail per Stato",
          emailsByType: "E-mail per tipo",
          emailsWithUserId: "E-mail con utente ID",
          emailsWithoutUserId: "E-mail senza utente ID",
          emailsWithLeadId: "E-mail con contatto ID",
          emailsWithoutLeadId: "E-mail senza contatto ID",
          emailsWithErrors: "E-mail con errori",
          emailsWithoutErrors: "E-mail senza errori",
          averageRetryCount: "Conteggio medio della rifornitura",
          maxRetryCount: "Conteggio massimo di riprovazione",
          averageProcessingTime: "Tempo medio di elaborazione",
          averageDeliveryTime: "Tempo medio di consegna",
          historicalData: "Dati storici",
          groupedStats: "Statistiche raggruppate",
          generatedAt: "Generato a",
          dataRange: "Gamma di dati",
          recentActivity: "Attività recenti",
          topPerformingTemplates: "Modelli di performatura superiore",
          topPerformingProviders: "Fornitori di prestazioni superiori",
          metrics: {
            totalEmails: "E-mail totali",
            sentEmails: "Inviare email",
            deliveredEmails: "E-mail fornite",
            openedEmails: "E-mail aperte",
            clickedEmails: "E-mail cliccate",
            bouncedEmails: "E-mail rimbalzate",
            failedEmails: "E-mail non corrette",
            deliveryRate: "Tasso di consegna",
            openRate: "Tasso aperto",
            clickRate: "Cliccare sulla tariffa",
            bounceRate: "Tasso di rimbalzo",
            failureRate: "Tasso di inadempimento",
            emails_with_errors: "E-mail con errori",
            average_retry_count: "Conteggio medio della rifornitura",
            average_processing_time: "Tempo medio di elaborazione (ms)",
            average_delivery_time: "Tempo medio di consegna (ms)",
            provider_historical: "Dati storici del Fornitore",
            template_historical: "Template Dati storici",
            engagement_historical: "Engagement Dati Storici",
          },
          retry: {
            no_retries: "Nessun problema",
            with_retries: "Con Retries",
          },
          association: {
            with_user: "Con l'utente",
            with_lead: "Con contatto",
            with_both: "Con entrambi",
            with_neither: "Standalone",
          },
        },
        errors: {
          unauthorized: {
            title: "Autenticazione richiesta",
            description:
              "Autenticazione necessaria per accedere alle statistiche delle email",
          },
          validation: {
            title: "Errore di convalida",
            description: "Parametri di richiesta non valida forniti",
          },
          server: {
            title: "Errore del server",
            description:
              "Errore del server interno si è verificato durante il recupero delle statistiche",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore sconosciuto",
          },
          network: {
            title: "Errore di rete",
            description:
              "Errore di rete si è verificato durante il recupero delle statistiche",
          },
          forbidden: {
            title: "Accesso negato",
            description:
              "L'accesso alle statistiche di posta elettronica è vietato",
          },
          notFound: {
            title: "Non trovato",
            description: "Statistiche dell'email non trovate",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description:
              "Ci sono cambiamenti non salvati che devono essere salvati prima",
          },
          conflict: {
            title: "Conflitto",
            description:
              "Il conflitto di dati si è verificato durante il recupero delle statistiche",
          },
        },
        success: {
          title: "Operazione riuscita",
          description: "Statistiche e-mail recuperate con successo",
        },
      },
      widget: {
        title: "Statistiche del email",
        total: "Totale",
        sent: "Inviato",
        delivered: "Consegnato",
        opened: "Aperto",
        clicked: "Cliccato",
        bounced: "Bounce",
        failed: "Sfigato",
        errors: "Errori",
        engagementRates: "Tassi di partecipazione",
        deliveryRate: "Tasso di consegna",
        openRate: "Tasso aperto",
        clickRate: "Cliccare sulla tariffa",
        bounceRate: "Tasso di rimbalzo",
        failureRate: "Tasso di inadempimento",
        byStatus: "Per Stato",
        byType: "Per tipo",
        avgRetries: "Avg. Ritiri",
        avgDeliveryMs: "Avg. Tempi di consegna",
        viewList: "Visualizza elenco",
        refresh: "Aggiorna",
        search: "Cercare e-mail...",
      },
      enums: {
        status: {
          pending: "Finanziamenti",
          sent: "Inviato",
          delivered: "Consegnato",
          opened: "Aperto",
          clicked: "Cliccato",
          bounced: "Bounce",
          failed: "Sfigato",
          unsubscribed: "Iscrizione annullata",
        },
        statusFilter: {
          any: "Tutti gli stati",
        },
        type: {
          transactional: "Transazione",
          marketing: "Marketing",
          notification: "Notifica",
          system: "Sistema",
          leadCampaign: "Campagna di acquisizione contatti",
          userCommunication: "Comunicazione dell'utente",
        },
        typeFilter: {
          any: "Tutti i tipi",
        },
        sortField: {
          subject: "Oggetto",
          recipientEmail: "Email sensibile",
          recipientName: "Nome del destinatario",
          type: "Tipologia",
          status: "Stato",
          sentAt: "Inviato a",
          createdAt: "Creato a",
        },
        sortOrder: {
          asc: "Assunzione",
          desc: "Discussione",
        },
      },
    },
    enums: {
      status: {
        pending: "Finanziamenti",
        sent: "Inviato",
        delivered: "Consegnato",
        opened: "Aperto",
        clicked: "Cliccato",
        bounced: "Bounce",
        failed: "Sfigato",
        unsubscribed: "Iscrizione annullata",
      },
      statusFilter: {
        any: "Tutti gli stati",
      },
      type: {
        transactional: "Transazione",
        marketing: "Marketing",
        notification: "Notifica",
        system: "Sistema",
        leadCampaign: "Campagna di acquisizione contatti",
        userCommunication: "Comunicazione dell'utente",
      },
      typeFilter: {
        any: "Tutti i tipi",
      },
      provider: {
        resend: "Resend",
        sendgrid: "SendGrid",
        mailgun: "Mailgun",
        ses: "Amazon SES",
        smtp: "SMTP",
        mailjet: "Mailjet",
        postmark: "Postmark",
        other: "Altro",
      },
      sortField: {
        subject: "Oggetto",
        recipientEmail: "Email sensibile",
        recipientName: "Nome del destinatario",
        type: "Tipologia",
        status: "Stato",
        sentAt: "Inviato a",
        createdAt: "Creato a",
      },
      retryRange: {
        noRetries: "Nessun problema",
        oneToTwo: "1-2 Ritiri",
        threeToFive: "3-5 Reti",
        sixPlus: "6+ Rettori",
      },
      syncStatus: {
        pending: "Pending Sync",
        syncing: "Sincronizzazione",
        synced: "Traduzione:",
        failed: "Traduzione:",
      },
      specialFolder: {
        inbox: "Posta in arrivo",
        sent: "Inviato",
        drafts: "Progetti",
        trash: "Trattamenti",
        spam: "Spam",
        archive: "Archivia",
      },
      sortOrder: {
        asc: "Assunzione",
        desc: "Discussione",
      },
    },
  },
  send: {
    title: "Invia messaggio",
    description:
      "Invia un messaggio tramite qualsiasi canale (Email, SMS, WhatsApp, Telegram)",
    category: "Messaggistica",
    tag: "Invia",

    container: {
      title: "Invia messaggio",
      description: "Inviare tramite un account messenger configurato",
    },

    accountId: {
      label: "Conto del Messaggero",
      description: "Account da inviare tramite",
      placeholder: "Selezionare l'account UUID",
    },
    to: {
      label: "Recipiente",
      description: "Indirizzo e-mail, numero di telefono, o chat ID",
      placeholder: "user@example.com o +12025551234",
    },
    toName: {
      label: "Nome del destinatario",
      description: "Visualizzazione del nome del destinatario (opzionale)",
      placeholder: "John Doe",
    },
    subject: {
      label: "Oggetto",
      description:
        "Linea del soggetto (solo e-mail, opzionale per altri canali)",
      placeholder: "Il tuo soggetto qui...",
    },
    text: {
      label: "Messaggio",
      description:
        "Corpo di testo normale - usato per SMS / WhatsApp /Telegram; errore di posta elettronica",
      placeholder: "Inserisci il tuo messaggio...",
    },
    html: {
      label: "Contenuto di HTML",
      description:
        "Corpo HTML (solo per e-mail, facoltativo - ritorna al testo se omesso)",
      placeholder: "<p> Inserisci il contenuto di e-mail HTML... </p>",
    },
    senderName: {
      label: "Nome del fornitore",
      description: "Visualizza il nome del mittente (solo e-mail, facoltativo)",
      placeholder: "La tua azienda",
    },
    replyTo: {
      label: "Rispondete",
      description: "Indirizzo di risposta (solo e-mail, facoltativo)",
      placeholder: "support@example.com",
    },
    leadId: {
      label: "ID del contatto",
      description: "Lead associato per il monitoraggio (facoltativo)",
      placeholder: "UUID",
    },
    campaignId: {
      label: "Campagna ID",
      description: "Campagna associata per il tracciamento (opzionale)",
      placeholder: "UUID",
    },

    response: {
      title: "Invia il Risultato",
      description: "Risultato dell'operazione di invio",
      messageId: { label: "Messaggio ID" },
      accountName: { label: "Account" },
      channel: { label: "Canale" },
      provider: { label: "Fornitore" },
      sentAt: { label: "Inviato a" },
    },

    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Si prega di controllare il vostro input e riprovare",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non hai il permesso di inviare messaggi",
      },
      server: {
        title: "Errore del server",
        description:
          "Si è verificato un errore del server interno durante l'invio",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      forbidden: {
        title: "Accesso negato",
        description: "L'accesso a questa risorsa è vietato",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete durante l'invio",
      },
      notFound: {
        title: "Account Non trovato",
        description: "L'account messenger specificato non è stato trovato",
      },
      conflict: {
        title: "Conflitto",
        description: "Richiedi conflitti con i dati esistenti",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },

    success: {
      title: "Messaggio",
      description: "Il tuo messaggio è stato inviato con successo",
    },
  },
  smtpClient: {
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
          copyright:
            "© {{currentYear}} {{appName}}. Tutti i diritti riservati.",
          visitWebsite: "Visita il sito web",
          allRightsReserved:
            "© {{currentYear}} {{appName}}. Tutti i diritti riservati.",
          feedbackHook:
            "Hai qualcosa da dire? Rispondete. L'abbiamo letto davvero.",
          feedbackBody:
            "Segnala un bug, richiedi una funzione o dicci cosa manca. Il feedback utile guadagna crediti {{credits}}. un mese intero su di noi.",
          feedbackLink: "Rispondi con feedback →",
          footerSeparator: " · ",
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
          sending_failed: "Non ha inviato email a {{recipient}}",
        },
      },
    },
    emailHandling: {
      email: {
        errors: {
          rendering_failed: "Non è riuscito a rendere il modello di e-mail",
          send_failed: "Non inviare email",
          email_failed_subject: "Email non riuscita",
          unknown_recipient: "Destinatario sconosciuto",
          unknown_sender: "Sistema",
          email_render_exception: "Eccezione di rendering e-mail è avvenuta",
          batch_send_failed: "Batch email invio fallito",
        },
      },
    },
    sending: {
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description:
            "Autenticazione richiesta per le operazioni di invio SMTP",
        },
        server: {
          title: "Errore del server",
          description: "Si è verificato un errore sul server SMTP",
        },
        rejected: {
          title: "E-mail respinta",
          defaultReason: "Email respinta dal server",
        },
        no_recipients: {
          title: "Nessun destinatario accettato",
          defaultReason: "Nessun destinatario accettato",
        },
        rate_limit: {
          title: "Limite di richieste superato",
        },
        capacity: {
          title: "Errore di capacità",
        },
        no_account: {
          title: "Nessun account SMTP disponibile",
        },
      },
    },
    emailMetadata: {
      errors: {
        server: {
          title: "Errore del server Metadati Email",
          description: "Non memorizzare i metadati email",
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
  },

  // Core emails level translations
  tag: "Email",
  tags: {
    stats: "Statistiche",
    analytics: "Analisi",
  },
  error: {
    default: "Si è verificato un errore",
  },
  template: {
    tagline: "AI senza la guardia",
  },
  footer: {
    visitWebsite: "Visita il sito web",
    allRightsReserved: "Tutti i diritti riservati",
  },

  // Email Templates
  templates: {
    leads: {
      batch: {
        update: {
          meta: {
            name: "Email di aggiornamento in blocco dei lead",
            description: "Email inviata quando i cavi sono aggiornati in batch",
          },
          preview: {
            totalMatched: "Totale abbinato",
            totalMatched_description: "Numero di lead corrispondenti",
            totalProcessed: "Totale processato",
            totalProcessed_description: "Numero di lead elaborati",
            totalUpdated: "Totale aggiornato",
            totalUpdated_description: "Numero di lead aggiornati",
            errorsCount: "Conteggio errori",
            errorsCount_description: "Numero di errori durante l'elaborazione",
            dryRun: "Correre a secco",
            dryRun_description: "Anteprima solo senza apportare modifiche",
            userId: "Utente ID",
            userId_description: "ID dell'utente che esegue l'azione",
          },
        },
      },
      welcome: {
        meta: {
          name: "Email di benvenuto",
          description: "Email di benvenuto inviata a nuovi lead",
        },
        preview: {
          leadId: "ID del contatto",
          leadId_description: "Identificatore unico per il contatto",
          businessName: "Nome di affari",
          businessName_description: "Nome del business (opzionale)",
          email: "Email",
          email_description: "Indirizzo e-mail del contatto",
          userId: "Utente ID",
          userId_description: "ID dell'utente associato (opzionale)",
        },
      },
    },
    contact: {
      form: {
        meta: {
          name: "Modulo di contatto",
          description:
            "Email inviata quando il modulo di contatto viene inviato",
        },
        preview: {
          name: "Nome",
          name_description: "Nome del contatto",
          email: "Email",
          email_description: "Indirizzo e-mail del contatto",
          company: "Società",
          company_description: "Nome della Società (opzionale)",
          subject: "Oggetto",
          subject_description: "Oggetto del messaggio",
          message: "Messaggio",
          message_description: "Contenuto del messaggio",
          isForCompany: "Per conto dell'azienda",
          isForCompany_description:
            "Se questa e-mail viene inviata al team aziendale",
          userId: "Utente ID",
          userId_description: "ID dell'utente associato (opzionale)",
          leadId: "ID del contatto",
          leadId_description: "ID del contatto associato (opzionale)",
        },
      },
    },
    newsletter: {
      unsubscribe: {
        meta: {
          name: "Conferma di disiscrizione dalla newsletter",
          description: "E-mail di conferma quando si cancella dalla newsletter",
        },
        preview: {
          email: "Email",
          email_description: "Indirizzo e-mail non sottoscritto",
        },
      },
      welcome: {
        meta: {
          name: "Newsletter Benvenuto Email",
          description:
            "Email di benvenuto per i nuovi iscritti alla newsletter",
        },
        preview: {
          email: "Email",
          email_description: "Indirizzo e-mail dell'abbonato",
          name: "Nome",
          name_description: "Nome dell'abbonato (opzionale)",
          leadId: "ID del contatto",
          leadId_description: "ID del contatto associato (opzionale)",
          userId: "Utente ID",
          userId_description: "ID dell'utente associato (opzionale)",
        },
      },
    },
    password: {
      reset: {
        confirm: {
          meta: {
            name: "Conferma della conferma della password",
            description: "Conferma e-mail dopo il ripristino della password",
          },
          preview: {
            publicName: "Nome pubblico",
            publicName_description: "Nome pubblico dell'utente",
            userId: "Utente ID",
            userId_description: "Identificatore unico per l'utente",
          },
        },
        request: {
          meta: {
            name: "Password Reset richiesta",
            description: "Email con link di reset password",
          },
          preview: {
            publicName: "Nome pubblico",
            publicName_description: "Nome pubblico dell'utente",
            userId: "Utente ID",
            userId_description: "Identificatore unico per l'utente",
            passwordResetUrl: "Password Reset URL",
            passwordResetUrl_description:
              "URL per il ripristino della password",
          },
        },
      },
    },
    signup: {
      welcome: {
        meta: {
          name: "Iscriviti all'utente Benvenuto",
          description: "E-mail di benvenuto per i nuovi registri utente",
        },
        preview: {
          privateName: "Nome privato",
          privateName_description: "Nome privato dell'utente",
          userId: "Utente ID",
          userId_description: "Identificatore unico per l'utente",
          leadId: "ID del contatto",
          leadId_description: "ID del contatto associato",
        },
      },
    },
    users: {
      welcome: {
        meta: {
          name: "Email di benvenuto",
          description: "Email di benvenuto inviata a nuovi utenti",
        },
        preview: {
          userId: "Utente ID",
          userId_description: "Identificatore unico per l'utente",
          email: "Email",
          email_description: "Indirizzo e-mail dell'utente",
          privateName: "Nome privato",
          privateName_description: "Nome privato dell'utente",
          publicName: "Nome pubblico",
          publicName_description: "Nome pubblico dell'utente",
          leadId: "ID del contatto",
          leadId_description: "ID del contatto associato (opzionale)",
        },
      },
    },
    subscription: {
      success: {
        meta: {
          name: "Abbonamento Successo",
          description: "E-mail di conferma per un abbonamento di successo",
        },
        preview: {
          privateName: "Nome privato",
          privateName_description: "Nome privato dell'utente",
          userId: "Utente ID",
          userId_description: "Identificatore unico per l'utente",
          leadId: "ID del contatto",
          leadId_description: "ID del contatto associato",
          planName: "Nome del piano",
          planName_description: "Nome del piano di abbonamento",
        },
      },
    },
    admin: {
      signup: {
        meta: {
          name: "Admin: Nuovo Utente",
          description: "Avvertire la notifica quando un nuovo utente registra",
        },
        preview: {
          privateName: "Nome privato",
          publicName: "Nome pubblico",
          email: "Email",
          userId: "Utente ID",
          subscribeToNewsletter: "Abbonamento Newsletter",
        },
      },
      subscription: {
        meta: {
          name: "Abbonamento: Nuovo abbonamento",
          description: "Avvertire la notifica quando un utente abbona",
        },
        preview: {
          privateName: "Nome privato",
          publicName: "Nome pubblico",
          email: "Email",
          planName: "Nome del piano",
          statusName: "Stato",
        },
      },
      user_create: {
        meta: {
          name: "Admin: Nuovo utente creato",
          description:
            "Notifica di amministratore quando viene creato un account utente",
        },
        preview: {
          privateName: "Nome privato",
          publicName: "Nome pubblico",
          email: "Email",
          userId: "Utente ID",
          leadId: "ID del contatto",
        },
      },
      contact: {
        meta: {
          name: "Amministrazioni: Modulo di contatto Submission",
          description:
            "Notifica di amministratore quando viene presentato un modulo di contatto",
        },
        preview: {
          name: "Nome del fornitore",
          email: "Email di pagamento",
          subject: "Oggetto",
          message: "Messaggio",
          company: "Società",
          userId: "Utente ID",
          leadId: "ID del contatto",
        },
      },
    },
  },

  // Email Preview System
  preview: {
    render: {
      post: {
        title: "Anteprima e-mail",
        titleShort: "Anteprima del mirino",
        description:
          "Visualizzazione lato server dei modelli di posta elettronica per l'anteprima",
        container: {
          title: "Configurazione di anteprima e-mail",
        },
        success: {
          title: "Anteprima Rendered",
          description: "Anteprima e-mail resa con successo",
        },
        fields: {
          templateId: {
            label: "Template ID",
            description: "ID del modello di e-mail da rendere",
          },
          language: {
            label: "Lingua",
            description: "Lingua per il rendering e-mail",
          },
          country: {
            label: "Paese",
            description: "Paese per il rendering email",
          },
          props: {
            label: "Template Props",
            description: "Proprietà da passare al modello di e-mail",
          },
          html: {
            title: "Rendering HTML",
          },
          subject: {
            title: "Oggetto e-mail",
          },
          templateVersion: {
            title: "Versione del modello",
          },
        },
        errors: {
          validation: {
            title: "Errore di convalida",
            description: "Dati di richiesta di anteprima non valida",
          },
          network: {
            title: "Errore di rete",
            description: "Errore di rete durante l'anteprima di rendering",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Non sei autorizzato a visualizzare le anteprime",
          },
          forbidden: {
            title: "Accesso negato",
            description: "Il rendering dell'anteprima è vietato",
          },
          notFound: {
            title: "Non trovato",
            description: "Email template non trovato",
          },
          server: {
            title: "Errore del server",
            description: "Non è riuscito a rendere l'anteprima email",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore sconosciuto",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description: "Hai modifiche non salvate",
          },
          conflict: {
            title: "Conflitto",
            description: "Si è verificato un conflitto durante la rendering",
          },
        },
      },
      title: "Anteprima del email",
      preview: "Anteprima",
      version: "Version",
      submit: "Anteprima del mirino",
      submitting: "Rendering...",
    },
    sendTest: {
      post: {
        title: "Inviare la prova",
        titleShort: "Test Email",
        description:
          "Invia email di prova con i dati del modello personalizzato",
        container: {
          title: "Configurazione e-mail di prova",
        },
        success: {
          title: "Invia un messaggio di prova",
          description: "E-mail di prova inviata con successo",
        },
        fields: {
          templateId: {
            label: "Template ID",
            description: "ID del modello di e-mail da inviare",
          },
          recipientEmail: {
            label: "Email sensibile",
            description: "Indirizzo e-mail per inviare il test a",
          },
          language: {
            label: "Lingua",
            description: "Lingua per il rendering e-mail",
          },
          country: {
            label: "Paese",
            description: "Paese per il rendering email",
          },
          props: {
            label: "Template Props",
            description: "Proprietà da passare al modello di e-mail",
          },
          success: {
            title: "Operazione riuscita",
          },
          message: {
            title: "Risultato Messaggio",
          },
        },
        errors: {
          validation: {
            title: "Errore di convalida",
            description: "Dati di richiesta e-mail di prova non valida",
          },
          network: {
            title: "Errore di rete",
            description: "Errore di rete durante l'invio di email di prova",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Non sei autorizzato a inviare e-mail di prova",
          },
          forbidden: {
            title: "Accesso negato",
            description: "Inviare e-mail di prova è vietato",
          },
          notFound: {
            title: "Non trovato",
            description: "Email template non trovato",
          },
          server: {
            title: "Errore del server",
            description: "Non ha inviato email di prova",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore sconosciuto",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description: "Hai modifiche non salvate",
          },
          conflict: {
            title: "Conflitto",
            description: "Si è verificato un conflitto durante l'invio",
          },
        },
      },
      error: {
        templateNotFound: "Email template {{templateId}} non trovato",
        invalidProps: "Profili modello non valido: {{error}}",
        sendFailed: "Non è stato possibile inviare e-mail di prova: {{error}}",
      },
      success: "E-mail di prova inviata",
      successDetail: "E-mail di prova inviata a {{email}}",
      title: "Inviare la prova",
      failed: "Non ha inviato email di prova",
      submit: "Inviare la prova",
      submitting: "Invio in corso…",
    },
  },
  messaging: {
    category: "Messaggistica",
    tag: "Messaggi di messaggi",
    enums: {
      channel: {
        email: "Email",
        sms: "SMS",
        whatsapp: "WhatsApp",
        telegram: "Telegram",
      },
      channelFilter: {
        any: "Tutti i canali",
      },
      provider: {
        twilio: "Twilio",
        awsSns: "AWS SNS",
        messagebird: "MessageBird",
        http: "HTTP",
        whatsappBusiness: "WhatsApp Business",
        telegramBot: "Telegram Bot",
      },
      accountStatus: {
        active: "Attivo",
        inactive: "Inattivo",
        error: "Errore",
        testing: "Testing",
      },
    },
    send: {
      errors: {
        accountNotFound: "Conto di messaggistica {{accountId}} non trovato",
        sendFailed: "Non ha inviato un messaggio",
        unexpected: "Errore inaspettato invia messaggio: {{error}}",
      },
    },
  },
  providers: {
    errors: {
      smtpSendFailed: "SMTP invio fallito",
      smtpAccountNotFound: "account IMAP non trovato",
      smtpListInboxFailed: "Non elencare la casella di posta",
      smtpListFoldersFailed: "Non elencare le cartelle",
      smtpMoveMessageFailed: "Non è riuscito a spostare il messaggio",
      smtpMarkReadFailed: "Non contrassegnare il messaggio",
      resendKeyNotConfigured: "Rispondere alla chiave API non configurata",
      resendSendFailed: "Rimandare l'invio fallito",
      resendProviderError: "Rispondere all'errore del fornitore",
      resendNoInbox: "Resend non supporta inbox",
      resendNoFolders: "Resend non supporta le cartelle",
      smsSendFailed: "SMS invio fallito",
      whatsappSendFailed: "WhatsApp invio fallito",
      telegramSendFailed: "Telegram invio fallito",
      accountNotFound: "Conto di messaggistica non trovato",
      notSupported: "Questa operazione non è supportata da questo fornitore",
    },
  },
};
