import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "E-Mail",
  countries: {
    global: "Global",
    de: "Deutschland",
    pl: "Polen",
    us: "USA",
  },
  languages: {
    en: "Englisch",
    de: "Deutsch",
    pl: "Polnisch",
  },
  enums: {
    // SMTP Client Enums
    smtpSecurityType: {
      none: "Keine",
      tls: "TLS",
      ssl: "SSL",
      starttls: "STARTTLS",
    },
    smtpAccountStatus: {
      active: "Aktiv",
      inactive: "Inaktiv",
      error: "Fehler",
      testing: "Test",
    },
    smtpHealthStatus: {
      healthy: "Gesund",
      degraded: "Beeinträchtigt",
      unhealthy: "Ungesund",
      unknown: "Unbekannt",
    },
    smtpSortField: {
      name: "Name",
      status: "Status",
      createdAt: "Erstellt am",
      updatedAt: "Aktualisiert am",
      priority: "Priorität",
      totalEmailsSent: "Gesendete E-Mails",
      lastUsedAt: "Zuletzt verwendet",
    },
    smtpCampaignType: {
      leadCampaign: "Lead-Kampagne",
      newsletter: "Newsletter",
      signupNurture: "Signup-Nurture",
      retention: "Bindung",
      winback: "Rückgewinnung",
      transactional: "Transaktional",
      notification: "Benachrichtigung",
      system: "System",
    },
    smtpLoadBalancingStrategy: {
      roundRobin: "Round-Robin",
      weighted: "Gewichtet",
      priority: "Priorität",
      leastUsed: "Am wenigsten verwendet",
    },
    loadBalancingStrategy: {
      roundRobin: "Round-Robin",
      weighted: "Gewichtet",
      priority: "Priorität",
      leastUsed: "Am wenigsten verwendet",
    },
    smtpTestResult: {
      success: "Erfolgreich",
      authFailed: "Authentifizierung fehlgeschlagen",
      connectionFailed: "Verbindung fehlgeschlagen",
      timeout: "Zeitüberschreitung",
      unknownError: "Unbekannter Fehler",
    },
    testResult: {
      success: "Erfolgreich",
      authFailed: "Authentifizierung fehlgeschlagen",
      connectionFailed: "Verbindung fehlgeschlagen",
      timeout: "Zeitüberschreitung",
      unknownError: "Unbekannter Fehler",
    },
    smtpStatusFilter: {
      any: "Alle",
    },
    smtpHealthStatusFilter: {
      any: "Alle",
    },
    smtpCampaignTypeFilter: {
      any: "Alle",
    },
    smtpSelectionRuleSortField: {
      name: "Name",
      priority: "Priorität",
      campaignType: "Kampagnentyp",
      journeyVariant: "Journey-Variante",
      campaignStage: "Kampagnenstufe",
      country: "Land",
      language: "Sprache",
      createdAt: "Erstellt am",
      updatedAt: "Aktualisiert am",
      emailsSent: "Gesendete E-Mails",
      successRate: "Erfolgsrate",
      lastUsedAt: "Zuletzt verwendet",
    },
    selectionRuleSortField: {
      name: "Name",
      priority: "Priorität",
      campaignType: "Kampagnentyp",
      journeyVariant: "Journey-Variante",
      campaignStage: "Kampagnenstufe",
      country: "Land",
      language: "Sprache",
      createdAt: "Erstellt am",
      updatedAt: "Aktualisiert am",
      emailsSent: "Gesendete E-Mails",
      successRate: "Erfolgsrate",
      lastUsedAt: "Zuletzt verwendet",
    },
    smtpSelectionRuleStatusFilter: {
      any: "Alle",
      active: "Aktiv",
      inactive: "Inaktiv",
      default: "Standard",
      failover: "Failover",
    },
    selectionRuleStatusFilter: {
      any: "Alle",
      active: "Aktiv",
      inactive: "Inaktiv",
      default: "Standard",
      failover: "Failover",
    },
    // Email Messages Enums
    emailStatus: {
      pending: "Ausstehend",
      sent: "Gesendet",
      delivered: "Zugestellt",
      opened: "Geöffnet",
      clicked: "Geklickt",
      bounced: "Zurückgewiesen",
      failed: "Fehlgeschlagen",
      unsubscribed: "Abgemeldet",
    },
    emailType: {
      transactional: "Transaktional",
      marketing: "Marketing",
      notification: "Benachrichtigung",
      system: "System",
      leadCampaign: "Lead-Kampagne",
      userCommunication: "Benutzerkommunikation",
    },
    emailProvider: {
      resend: "Resend",
      sendgrid: "SendGrid",
      mailgun: "Mailgun",
      ses: "Amazon SES",
      smtp: "SMTP",
      mailjet: "Mailjet",
      postmark: "Postmark",
      other: "Andere",
    },
    emailSortField: {
      subject: "Betreff",
      recipientEmail: "Empfänger-E-Mail",
      recipientName: "Empfängername",
      type: "Typ",
      status: "Status",
      sentAt: "Gesendet am",
      createdAt: "Erstellt am",
    },
    emailStatusFilter: {
      any: "Alle",
    },
    emailTypeFilter: {
      any: "Alle",
    },
    emailRetryRange: {
      noRetries: "Keine Wiederholungen",
      oneToTwo: "1-2 Wiederholungen",
      threeToFive: "3-5 Wiederholungen",
      sixPlus: "6+ Wiederholungen",
    },
    // IMAP Client Enums
    imapSyncStatus: {
      pending: "Ausstehend",
      syncing: "Synchronisiert",
      synced: "Synchronisiert",
      error: "Fehler",
    },
    imapOverallSyncStatus: {
      idle: "Untätig",
      running: "Läuft",
      completed: "Abgeschlossen",
      failed: "Fehlgeschlagen",
      cancelled: "Abgebrochen",
    },
    imapSortOrder: {
      asc: "Aufsteigend",
      desc: "Absteigend",
    },
    imapAuthMethod: {
      plain: "Plain",
      oauth2: "OAuth2",
      xoauth2: "XOAuth2",
    },
    imapSpecialUseType: {
      inbox: "Posteingang",
      sent: "Gesendet",
      drafts: "Entwürfe",
      trash: "Papierkorb",
      junk: "Spam",
      archive: "Archiv",
    },
    imapFolderSortField: {
      name: "Name",
      displayName: "Anzeigename",
      messageCount: "Nachrichtenanzahl",
      unseenCount: "Ungelesene Anzahl",
      createdAt: "Erstellt am",
    },
    imapAccountSortField: {
      name: "Name",
      email: "E-Mail",
      host: "Host",
      enabled: "Aktiviert",
      lastSyncAt: "Letzte Synchronisation",
      createdAt: "Erstellt am",
    },
    imapConnectionStatus: {
      disconnected: "Getrennt",
      connecting: "Verbindet",
      connected: "Verbunden",
      error: "Fehler",
      timeout: "Zeitüberschreitung",
    },
    imapSyncStatusFilter: {
      all: "Alle",
    },
    imapAccountStatusFilter: {
      all: "Alle",
      enabled: "Aktiviert",
      disabled: "Deaktiviert",
    },
    imapAccountFilter: {
      all: "Alle",
    },
    imapMessageSortField: {
      subject: "Betreff",
      senderName: "Absendername",
      senderEmail: "Absender-E-Mail",
      recipientEmail: "Empfänger-E-Mail",
      recipientName: "Empfängername",
      isRead: "Gelesen",
      isFlagged: "Markiert",
      messageSize: "Nachrichtengröße",
      sentAt: "Gesendet am",
      createdAt: "Erstellt am",
    },
    imapMessageStatusFilter: {
      all: "Alle",
      read: "Gelesen",
      unread: "Ungelesen",
      flagged: "Markiert",
      unflagged: "Nicht markiert",
      draft: "Entwurf",
      deleted: "Gelöscht",
      hasAttachments: "Mit Anhängen",
      noAttachments: "Ohne Anhänge",
    },
    imapHealthStatus: {
      healthy: "Gesund",
      warning: "Warnung",
      error: "Fehler",
      maintenance: "Wartung",
    },
    imapPerformanceStatus: {
      good: "Gut",
      warning: "Warnung",
      error: "Fehler",
    },
    bulkMessageAction: {
      markRead: "Als gelesen markieren",
      markUnread: "Als ungelesen markieren",
      flag: "Markieren",
      unflag: "Markierung aufheben",
      delete: "Löschen",
    },
    imapLoggingLevel: {
      error: "Fehler",
      warn: "Warnung",
      info: "Info",
      debug: "Debug",
    },
    // Email Service Enums
    emailServicePriority: {
      low: "Niedrig",
      normal: "Normal",
      high: "Hoch",
      urgent: "Dringend",
    },
    emailServiceStatus: {
      idle: "Untätig",
      processing: "Verarbeitung",
      completed: "Abgeschlossen",
      failed: "Fehlgeschlagen",
      retrying: "Wiederholung",
    },
    // SMS Service Enums
    smsProvider: {
      twilio: "Twilio",
      awsSns: "AWS SNS",
      messagebird: "MessageBird",
      plivo: "Plivo",
    },
    smsStatus: {
      pending: "Ausstehend",
      sent: "Gesendet",
      delivered: "Zugestellt",
      failed: "Fehlgeschlagen",
      rejected: "Abgelehnt",
      undelivered: "Nicht zugestellt",
    },
    smsTemplateType: {
      notification: "Benachrichtigung",
      verification: "Verifizierung",
      marketing: "Marketing",
      alert: "Warnung",
      reminder: "Erinnerung",
    },
  },
  errors: {
    no_email: "Keine E-Mail-Adresse angegeben",
    email_generation_failed: "E-Mail-Generierung fehlgeschlagen",
  },
  email: {
    errors: {
      send: {
        title: "E-Mail-Versand fehlgeschlagen",
      },
    },
  },
  smsService: {
    title: "SMS-Service",
    description: "SMS-Nachrichten über verschiedene Anbieter senden",
    category: "SMS-Service",
    tag: "SMS-Service",
    errors: {
      unauthorized: {
        title: "Unberechtigt",
        description: "Sie sind nicht berechtigt, SMS-Nachrichten zu senden",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff auf SMS-Service ist verboten",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige SMS-Anfragedaten",
      },
      internal: {
        title: "Interner Fehler",
        description: "Ein interner Serverfehler ist aufgetreten",
      },
      conflict: {
        title: "Konflikt",
        description: "SMS-Anfrage steht in Konflikt mit vorhandenen Daten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "SMS-Ressource nicht gefunden",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler beim Senden der SMS aufgetreten",
      },
      server: {
        title: "Serverfehler",
        description: "Ein interner Serverfehler ist aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen",
      },
      invalid_phone: {
        title: "Ungültige Telefonnummer",
      },
      send: {
        title: "SMS-Versand fehlgeschlagen",
      },
    },
    send: {
      title: "SMS senden",
      description: "SMS-Nachricht an Empfänger senden",
      container: {
        title: "SMS-Konfiguration",
        description: "SMS-Versandparameter konfigurieren",
      },
      to: {
        label: "Telefonnummer",
        description: "Telefonnummer des Empfängers",
        placeholder: "+1234567890",
      },
      message: {
        label: "Nachricht",
        description: "SMS-Nachrichteninhalt",
        placeholder: "Geben Sie Ihre Nachricht hier ein...",
      },
      campaignType: {
        label: "Kampagnentyp",
        description: "Wählen Sie den Kampagnentyp für diese SMS",
        placeholder: "Kampagnentyp auswählen",
      },
      leadId: {
        label: "Lead-ID",
        description: "Zugehörige Lead-Kennung",
        placeholder: "lead-12345",
      },
      templateName: {
        label: "Vorlagenname",
        description: "Zu verwendende SMS-Vorlage",
        placeholder: "Vorlage auswählen",
      },
      response: {
        result: {
          title: "SMS-Ergebnis",
          description: "Ergebnis des SMS-Versandvorgangs",
          success: "Erfolg",
          messageId: "Nachrichten-ID",
          sentAt: "Gesendet am",
          provider: "Anbieter",
          cost: "Kosten",
        },
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige SMS-Anfragedaten",
        },
        unauthorized: {
          title: "Unberechtigt",
          description: "Sie sind nicht berechtigt, SMS-Nachrichten zu senden",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff auf SMS-Service ist verboten",
        },
        conflict: {
          title: "Konflikt",
          description: "SMS-Anfrage steht in Konflikt mit vorhandenen Daten",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "SMS-Ressource nicht gefunden",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler beim Senden der SMS aufgetreten",
        },
        server: {
          title: "Serverfehler",
          description: "Ein interner Serverfehler ist aufgetreten",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Sie haben ungespeicherte Änderungen",
        },
      },
      success: {
        title: "SMS erfolgreich gesendet",
        description: "Ihre SMS wurde erfolgreich gesendet",
      },
    },
  },
  sms: {
    errors: {
      invalid_phone: {
        title: "Ungültige Telefonnummer",
      },
      send: {
        title: "SMS-Versand fehlgeschlagen",
      },
    },
  },
  emailService: {
    tag: "SMTP-Client",
    category: "E-Mail-Dienste",
    components: {
      email: {
        tagline: "KI-Plattform für freie Meinungsäußerung",
        footer: {
          needHelp: "Brauchen Sie Hilfe?",
          helpText: "Brauchen Sie Hilfe? Kontaktieren Sie uns unter",
          unsubscribeText: "Möchten Sie diese E-Mails nicht mehr erhalten?",
          unsubscribeLink: "Abmelden",
          copyright: "© {{currentYear}} {{appName}}. Alle Rechte vorbehalten.",
          visitWebsite: "Website besuchen",
          allRightsReserved:
            "© {{currentYear}} {{appName}}. Alle Rechte vorbehalten.",
          feedbackHook: "Etwas zu sagen? Antworten - wir lesen es wirklich.",
          feedbackBody:
            "Fehler melden, Funktion anfragen oder sagen, was fehlt. Nuetzliches Feedback bringt dir {{credits}} Credits — ein ganzer Monat gratis.",
          feedbackLink: "Feedback senden →",
          footerSeparator: " · ",
        },
      },
      post: {
        title: "Titel",
        description: "Endpunkt-Beschreibung",
        form: {
          title: "Konfiguration",
          description: "Parameter konfigurieren",
        },
        response: {
          title: "Antwort",
          description: "Antwortdaten",
        },
        errors: {
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Authentifizierung erforderlich",
          },
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Anfrageparameter",
          },
          server: {
            title: "Serverfehler",
            description: "Interner Serverfehler",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unbekannter Fehler ist aufgetreten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkfehler aufgetreten",
          },
          forbidden: {
            title: "Verboten",
            description: "Zugriff verboten",
          },
          notFound: {
            title: "Nicht gefunden",
            description: "Ressource nicht gefunden",
          },
          conflict: {
            title: "Konflikt",
            description: "Datenkonflikt aufgetreten",
          },
        },
        success: {
          title: "Erfolg",
          description: "Vorgang erfolgreich abgeschlossen",
        },
      },
    },
    emailSending: {
      email: {
        defaultSenderName: "System",
        errors: {
          sending_failed:
            "E-Mail an {{recipient}} konnte nicht gesendet werden",
        },
      },
    },
    emailHandling: {
      email: {
        errors: {
          rendering_failed: "E-Mail-Vorlage konnte nicht gerendert werden",
          send_failed: "E-Mail konnte nicht gesendet werden",
          email_failed_subject: "E-Mail fehlgeschlagen",
          unknown_recipient: "Unbekannter Empfänger",
          unknown_sender: "System",
          email_render_exception: "E-Mail-Rendering-Ausnahme aufgetreten",
          batch_send_failed: "Batch-E-Mail-Versand fehlgeschlagen",
        },
      },
    },
    sending: {
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung für SMTP-Sendevorgänge erforderlich",
        },
        server: {
          title: "Server-Fehler",
          description: "Ein Fehler ist auf dem SMTP-Server aufgetreten",
        },
        rejected: {
          title: "E-Mail abgelehnt",
          defaultReason: "E-Mail vom Server abgelehnt",
        },
        no_recipients: {
          title: "Keine Empfänger akzeptiert",
          defaultReason: "Keine Empfänger akzeptiert",
        },
        rate_limit: {
          title: "Ratenlimit überschritten",
        },
        capacity: {
          title: "Kapazitätsfehler",
        },
        no_account: {
          title: "Kein SMTP-Konto verfügbar",
        },
      },
    },
    emailMetadata: {
      errors: {
        server: {
          title: "E-Mail-Metadaten Serverfehler",
          description: "Speichern von E-Mail-Metadaten fehlgeschlagen",
        },
      },
    },
    enums: {
      status: {
        active: "Aktiv",
        inactive: "Inaktiv",
        error: "Fehler",
        testing: "Testen",
      },
      securityType: {
        none: "Keine",
        tls: "TLS",
        ssl: "SSL",
        starttls: "STARTTLS",
      },
      statusFilter: {
        all: "Alle Status",
      },
      healthStatus: {
        healthy: "Gesund",
        degraded: "Beeinträchtigt",
        unhealthy: "Ungesund",
        unknown: "Unbekannt",
      },
      healthStatusFilter: {
        all: "Alle Gesundheitsstatus",
      },
      sortField: {
        name: "Name",
        status: "Status",
        createdAt: "Erstellt am",
        updatedAt: "Aktualisiert am",
        priority: "Priorität",
        totalEmailsSent: "Gesamt gesendete E-Mails",
        lastUsedAt: "Zuletzt verwendet",
      },
      campaignType: {
        leadCampaign: "Lead-Kampagne",
        newsletter: "Newsletter",
        signupNurture: "Anmelde-Pflege",
        retention: "Kundenbindung",
        winback: "Rückgewinnung",
        transactional: "Transaktional",
        notification: "Benachrichtigung",
        system: "System",
      },
      campaignTypeFilter: {
        all: "Alle Kampagnentypen",
      },
      selectionRuleSortField: {
        name: "Name",
        priority: "Priorität",
        campaignType: "Kampagnentyp",
        journeyVariant: "Journey-Variante",
        campaignStage: "Kampagnenstufe",
        country: "Land",
        language: "Sprache",
        createdAt: "Erstellt am",
        updatedAt: "Aktualisiert am",
        emailsSent: "Gesendete E-Mails",
        successRate: "Erfolgsrate",
        lastUsedAt: "Zuletzt verwendet",
      },
      selectionRuleStatusFilter: {
        all: "Alle",
        active: "Aktiv",
        inactive: "Inaktiv",
        default: "Standard",
        failover: "Failover",
      },
      loadBalancingStrategy: {
        roundRobin: "Round-Robin",
        weighted: "Gewichtet",
        priority: "Priorität",
        leastUsed: "Am wenigsten verwendet",
      },
      testResult: {
        success: "Erfolg",
        authFailed: "Authentifizierung fehlgeschlagen",
        connectionFailed: "Verbindung fehlgeschlagen",
        timeout: "Zeitüberschreitung",
        unknownError: "Unbekannter Fehler",
      },
    },
  },
  imapClient: {
    category: "IMAP-Client",
    tag: "IMAP-Client",
    tags: {
      health: "Gesundheit",
      monitoring: "Überwachung",
      sync: "Synchronisation",
      accounts: "Konten",
      folders: "Ordner",
      messages: "Nachrichten",
      config: "Konfiguration",
    },
    messages: {
      tag: "Nachrichten",
      id: {
        widget: {
          markRead: "Als gelesen markieren",
          markUnread: "Als ungelesen markieren",
          flag: "Markieren",
          unflag: "Markierung entfernen",
        },
      },
      errors: {
        server: { title: "Serverfehler" },
        notFound: { title: "Nachricht nicht gefunden" },
        accountNotFound: { title: "Konto nicht gefunden" },
        syncFailed: { title: "Synchronisierung fehlgeschlagen" },
        syncSuccess: { message: "Nachrichten erfolgreich synchronisiert" },
        list: {
          get: {
            errors: {
              server: { title: "Serverfehler beim Auflisten von Nachrichten" },
            },
          },
        },
      },
    },
    sync: {
      category: "IMAP-Client",

      title: "IMAP-Synchronisation",
      description: "IMAP-Synchronisierungsdienst",
      container: {
        title: "IMAP-Sync-Konfiguration",
        description: "IMAP-Synchronisierungsparameter konfigurieren",
      },
      accountIds: {
        label: "Konto-IDs",
        description: "IMAP-Konto-IDs zum Synchronisieren",
        placeholder: "Konto-IDs durch Kommas getrennt eingeben",
      },
      force: {
        label: "Sync erzwingen",
        description:
          "Synchronisation auch bei kürzlich erfolgter Sync erzwingen",
      },
      dryRun: {
        label: "Testlauf",
        description: "Testlauf ohne Änderungen durchführen",
      },
      maxMessages: {
        label: "Max. Nachrichten",
        description:
          "Maximale Anzahl Nachrichten pro Ordner zu synchronisieren",
        placeholder: "Maximale Nachrichtenanzahl eingeben",
      },
      post: {
        title: "Titel",
        description: "Endpunkt-Beschreibung",
        form: {
          title: "Konfiguration",
          description: "Parameter konfigurieren",
        },
        response: {
          title: "Antwort",
          description: "Antwortdaten",
          result: {
            title: "Sync-Ergebnisse",
            description: "Detaillierte Synchronisationsergebnisse",
            accountsProcessed: "Verarbeitete Konten",
            foldersProcessed: "Verarbeitete Ordner",
            messagesProcessed: "Verarbeitete Nachrichten",
            messagesAdded: "Hinzugefügte Nachrichten",
            messagesUpdated: "Aktualisierte Nachrichten",
            messagesDeleted: "Gelöschte Nachrichten",
            duration: "Dauer",
          },
          errors: {
            error: {
              title: "Sync-Fehler",
              description: "Fehlerdetails",
              code: "Fehlercode",
              message: "Fehlermeldung",
            },
          },
        },
        errors: {
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Authentifizierung erforderlich",
          },
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Anfrageparameter",
          },
          server: {
            title: "Serverfehler",
            description: "Interner Serverfehler",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unbekannter Fehler ist aufgetreten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkfehler aufgetreten",
          },
          forbidden: {
            title: "Verboten",
            description: "Zugriff verboten",
          },
          notFound: {
            title: "Nicht gefunden",
            description: "Ressource nicht gefunden",
          },
          conflict: {
            title: "Konflikt",
            description: "Datenkonflikt aufgetreten",
          },
        },
        success: {
          title: "Erfolg",
          description: "Vorgang erfolgreich abgeschlossen",
        },
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Anfrageparameter",
        },
        server: {
          title: "Serverfehler",
          description: "Interner Serverfehler",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unbekannter Fehler ist aufgetreten",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff verboten",
        },
      },
      success: {
        title: "Erfolg",
        description: "Vorgang erfolgreich abgeschlossen",
      },
      widget: {
        title: "Vollständige IMAP-Synchronisierung",
        options: "Synchronisierungsoptionen",
        noAccounts: "Keine IMAP-Konten konfiguriert",
        result: "Synchronisierungsergebnis",
        duration: "Dauer",
        errors: "Fehler",
        accountsProcessed: "Verarbeitete Konten",
        foldersProcessed: "Verarbeitete Ordner",
        messagesProcessed: "Verarbeitete Nachrichten",
        messagesAdded: "Hinzugefügte Nachrichten",
        messagesUpdated: "Aktualisierte Nachrichten",
        messagesDeleted: "Gelöschte Nachrichten",
        submit: "Sync starten",
        submitting: "Synchronisiere...",
      },
    },
    imapErrors: {
      accounts: {
        post: {
          error: {
            duplicate: {
              title: "Konto existiert bereits",
            },
            server: {
              title: "Serverfehler beim Erstellen des Kontos",
            },
          },
        },
        get: {
          error: {
            not_found: {
              title: "Konto nicht gefunden",
            },
            server: {
              title: "Serverfehler beim Abrufen des Kontos",
            },
          },
        },
        put: {
          error: {
            not_found: {
              title: "Konto nicht gefunden",
            },
            duplicate: {
              title: "Konto mit dieser E-Mail existiert bereits",
            },
            server: {
              title: "Serverfehler beim Aktualisieren des Kontos",
            },
          },
        },
        delete: {
          error: {
            not_found: {
              title: "Konto nicht gefunden",
            },
            server: {
              title: "Serverfehler beim Löschen des Kontos",
            },
          },
          success: {
            title: "Konto erfolgreich gelöscht",
          },
        },
      },
      folders: {
        get: {
          error: {
            not_found: {
              title: "Ordner nicht gefunden",
            },
            server: {
              title: "Serverfehler beim Abrufen des Ordners",
            },
          },
        },
        sync: {
          error: {
            missing_account: {
              title: "Konto für Ordnersynchronisation nicht gefunden",
            },
          },
        },
      },
      messages: {
        get: {
          error: {
            not_found: {
              title: "Nachricht nicht gefunden",
            },
            server: {
              title: "Serverfehler beim Abrufen der Nachricht",
            },
          },
        },
      },
      connection: {
        failed: "Verbindung fehlgeschlagen",
        timeout: {
          title: "Verbindungszeitüberschreitung",
        },
        test: {
          failed: "Verbindungstest fehlgeschlagen",
        },
        close: {
          failed: "Verbindung konnte nicht geschlossen werden",
        },
        folders: {
          list: {
            failed: "Ordner konnten nicht aufgelistet werden",
          },
        },
        messages: {
          list: {
            failed: "Nachrichten konnten nicht aufgelistet werden",
          },
        },
      },
      sync: {
        failed: "Synchronisation fehlgeschlagen",
        account: {
          failed: "Kontosynchronisation fehlgeschlagen",
        },
        folder: {
          failed: "Ordnersynchronisation fehlgeschlagen",
        },
        message: {
          failed: "Nachrichtensynchronisation fehlgeschlagen",
        },
        post: {
          error: {
            server: {
              title: "Serverfehler während der Synchronisation",
            },
          },
        },
      },
      validation: {
        account: {
          username: {
            required: "Benutzername ist erforderlich",
          },
          port: {
            invalid: "Ungültige Portnummer",
          },
          host: {
            invalid: "Ungültiger Host",
          },
        },
      },
    },
    imap: {
      "example.com": "imap.example.com",
      "gmail.com": "imap.gmail.com",
      connection: {
        test: {
          success: "Verbindungstest erfolgreich",
          failed: "Verbindungstest fehlgeschlagen",
          timeout: "Verbindungstest-Zeitüberschreitung",
        },
      },
      sync: {
        messages: {
          accounts: {
            success: "Alle Konten erfolgreich synchronisiert",
            successWithErrors: "Konten mit Fehlern synchronisiert",
          },
          account: {
            success: "Konto erfolgreich synchronisiert",
            successWithErrors: "Konto mit Fehlern synchronisiert",
          },
          folders: {
            success: "Ordner erfolgreich synchronisiert",
            successWithErrors: "Ordner mit Fehlern synchronisiert",
          },
          messages: {
            success: "Nachrichten erfolgreich synchronisiert",
            successWithErrors: "Nachrichten mit Fehlern synchronisiert",
          },
        },
        errors: {
          default: "IMAP-Synchronisation fehlgeschlagen",
          account_failed: "Kontosynchronisation fehlgeschlagen",
          folder_sync_failed: "Ordnersynchronisation fehlgeschlagen",
          message_sync_error: "Nachrichtensynchronisationsfehler",
          message_sync_failed: "Nachrichtensynchronisation fehlgeschlagen",
        },
      },
    },
    enums: {
      loggingLevel: {
        error: "Fehler",
        warn: "Warnung",
        info: "Info",
        debug: "Debug",
      },
      syncStatus: {
        pending: "Ausstehend",
        syncing: "Synchronisierung",
        synced: "Synchronisiert",
        error: "Fehler",
      },
      overallSyncStatus: {
        idle: "Inaktiv",
        running: "Läuft",
        completed: "Abgeschlossen",
        failed: "Fehlgeschlagen",
        cancelled: "Abgebrochen",
      },
      sortOrder: {
        asc: "Aufsteigend",
        desc: "Absteigend",
      },
      authMethod: {
        plain: "Einfach",
        oauth2: "OAuth2",
        xoauth2: "XOAuth2",
      },
      imapAuthMethod: {
        plain: "Einfach",
        oauth2: "OAuth2",
        xoauth2: "XOAuth2",
      },
      specialUseType: {
        inbox: "Posteingang",
        sent: "Gesendet",
        drafts: "Entwürfe",
        trash: "Papierkorb",
        junk: "Spam",
        archive: "Archiv",
      },
      folderSortField: {
        name: "Name",
        displayName: "Anzeigename",
        messageCount: "Nachrichtenanzahl",
        unseenCount: "Ungelesene Anzahl",
        createdAt: "Erstellt am",
      },
      accountSortField: {
        name: "Name",
        email: "E-Mail",
        host: "Host",
        enabled: "Aktiviert",
        lastSyncAt: "Letzte Synchronisation",
        createdAt: "Erstellt am",
      },
      connectionStatus: {
        disconnected: "Getrennt",
        connecting: "Verbindung wird hergestellt",
        connected: "Verbunden",
        error: "Fehler",
        timeout: "Zeitüberschreitung",
      },
      syncStatusFilter: {
        all: "Alle Synchronisationsstatus",
      },
      accountStatusFilter: {
        all: "Alle Kontostatus",
        enabled: "Aktiviert",
        disabled: "Deaktiviert",
      },
      accountFilter: {
        all: "Alle Konten",
      },
      messageSortField: {
        subject: "Betreff",
        senderName: "Absendername",
        senderEmail: "Absender-E-Mail",
        recipientEmail: "Empfänger-E-Mail",
        recipientName: "Empfängername",
        isRead: "Gelesen-Status",
        isFlagged: "Markiert",
        messageSize: "Nachrichtengröße",
        sentAt: "Gesendet am",
        createdAt: "Erstellt am",
      },
      messageStatusFilter: {
        all: "Alle Nachrichten",
        read: "Gelesen",
        unread: "Ungelesen",
        flagged: "Markiert",
        unflagged: "Nicht markiert",
        draft: "Entwurf",
        deleted: "Gelöscht",
        hasAttachments: "Mit Anhängen",
        noAttachments: "Ohne Anhänge",
      },
      healthStatus: {
        healthy: "Gesund",
        warning: "Warnung",
        error: "Fehler",
        maintenance: "Wartung",
      },
      performanceStatus: {
        good: "Gut",
        warning: "Warnung",
        error: "Fehler",
      },
    },
  },
  messages: {
    category: "E-Mail-Nachrichten",
    tag: "Nachrichten",
    tags: {
      stats: "Statistiken",
      analytics: "Analysen",
    },
    id: {
      category: "Emails",
      tags: {
        emails: "Emails",
      },
      title: "E-Mail-Details",
      description:
        "Eine einzelne E-Mail anhand ihrer eindeutigen Kennung abrufen",
      container: {
        title: "E-Mail-Details",
        description:
          "Detaillierte Informationen über eine bestimmte E-Mail anzeigen",
      },
      fields: {
        id: {
          label: "E-Mail-ID",
          description: "Eindeutige Kennung der abzurufenden E-Mail",
        },
      },
      response: {
        email: {
          title: "E-Mail-Details",
          description:
            "Vollständige Informationen über die angeforderte E-Mail",
          id: "E-Mail-ID",
          subject: "Betreff",
          recipientEmail: "Empfänger-E-Mail",
          recipientName: "Empfängername",
          senderEmail: "Absender-E-Mail",
          senderName: "Absendername",
          type: "E-Mail-Typ",
          status: "Status",
          templateName: "Vorlagenname",
          emailProvider: "E-Mail-Anbieter",
          externalId: "Externe ID",
          sentAt: "Gesendet am",
          deliveredAt: "Zugestellt am",
          openedAt: "Geöffnet am",
          clickedAt: "Geklickt am",
          retryCount: "Wiederholungsanzahl",
          error: "Fehlermeldung",
          userId: "Benutzer-ID",
          leadId: "Lead-ID",
          createdAt: "Erstellt am",
          updatedAt: "Aktualisiert am",
        },
      },
      get: {
        errors: {
          validation: {
            title: "Validierungsfehler",
            description: "Die angegebene E-Mail-ID ist ungültig",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description:
              "Sie müssen authentifiziert sein, um E-Mail-Details einzusehen",
          },
          not_found: {
            title: "E-Mail nicht gefunden",
            description: "Keine E-Mail mit der angegebenen ID gefunden",
          },
          forbidden: {
            title: "Verboten",
            description:
              "Sie haben keine Berechtigung, diese E-Mail anzuzeigen",
          },
          server: {
            title: "Serverfehler",
            description:
              "Ein interner Serverfehler ist beim Abrufen der E-Mail aufgetreten",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unerwarteter Fehler ist aufgetreten",
          },
        },
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Die angegebene E-Mail-ID ist ungültig",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description:
            "Sie müssen authentifiziert sein, um E-Mail-Details einzusehen",
        },
        notFound: {
          title: "E-Mail nicht gefunden",
          description: "Keine E-Mail mit der angegebenen ID gefunden",
        },
        forbidden: {
          title: "Verboten",
          description: "Sie haben keine Berechtigung, diese E-Mail anzuzeigen",
        },
        server: {
          title: "Serverfehler",
          description:
            "Ein interner Serverfehler ist beim Abrufen der E-Mail aufgetreten",
        },
        conflict: {
          title: "Konfliktfehler",
          description:
            "Ein Konflikt ist beim Verarbeiten der E-Mail-Anfrage aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description:
            "Ein Netzwerkfehler ist beim Abrufen der E-Mail aufgetreten",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Es gibt ungespeicherte Änderungen",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
      },
      success: {
        title: "E-Mail abgerufen",
        description: "E-Mail-Details erfolgreich abgerufen",
      },
      widget: {
        parties: "Beteiligte",
        to: "An",
        from: "Von",
        timestamps: "Zeitstempel",
        sentAt: "Gesendet am",
        deliveredAt: "Zugestellt am",
        openedAt: "Geöffnet am",
        clickedAt: "Geklickt am",
        technical: "Technische Details",
        template: "Vorlage",
        provider: "Anbieter",
        externalId: "Externe ID",
        retryCount: "Wiederholungsanzahl",
        error: "Fehler",
        associations: "Verknüpfungen",
        lead: "Lead",
        user: "Benutzer",
        notFound: "E-Mail nicht gefunden",
      },
      enums: {
        status: {
          pending: "Ausstehend",
          sent: "Gesendet",
          delivered: "Zugestellt",
          opened: "Geöffnet",
          clicked: "Geklickt",
          bounced: "Zurückgewiesen",
          failed: "Fehlgeschlagen",
          unsubscribed: "Abgemeldet",
        },
        type: {
          transactional: "Transaktional",
          marketing: "Marketing",
          notification: "Benachrichtigung",
          system: "System",
          leadCampaign: "Lead-Kampagne",
          userCommunication: "Benutzerkommunikation",
        },
        provider: {
          resend: "Resend",
          sendgrid: "SendGrid",
          mailgun: "Mailgun",
          ses: "Amazon SES",
          smtp: "SMTP",
          mailjet: "Mailjet",
          postmark: "Postmark",
          other: "Sonstiges",
        },
      },
    },
    list: {
      category: "Emails",
      tags: {
        emails: "Emails",
      },
      title: "E-Mail-Liste",
      description:
        "Eine paginierte Liste von E-Mails mit Filterung und Paginierung abrufen",
      container: {
        title: "E-Mail-Liste",
        description:
          "E-Mail-Listen-Parameter konfigurieren und Ergebnisse anzeigen",
      },
      filters: {
        title: "Filter",
        description: "E-Mails filtern und suchen",
      },
      displayOptions: {
        title: "Anzeigeoptionen",
      },
      fields: {
        dateRange: {
          title: "Datumsbereich",
        },
        page: {
          label: "Seite",
          description: "Seitenzahl für Paginierung",
          placeholder: "Seitenzahl eingeben",
        },
        limit: {
          label: "Grenzwert",
          description: "Anzahl der Elemente pro Seite",
          placeholder: "Grenzwert eingeben",
        },
        search: {
          label: "Suchen",
          description: "E-Mails nach Betreff, Empfänger oder Absender suchen",
          placeholder: "E-Mails suchen...",
        },
        status: {
          label: "Status",
          description: "Nach E-Mail-Status filtern",
          placeholder: "Status auswählen",
        },
        channel: {
          label: "Kanal",
          description: "Nach Nachrichtenkanal filtern",
        },
        type: {
          label: "Typ",
          description: "Nach E-Mail-Typ filtern",
          placeholder: "Typ auswählen",
        },
        sortBy: {
          label: "Sortieren nach",
          description: "Feld zum Sortieren",
          placeholder: "Sortierfeld auswählen",
        },
        sortOrder: {
          label: "Sortierreihenfolge",
          description: "Richtung der Sortierreihenfolge",
          placeholder: "Sortierreihenfolge auswählen",
        },
        dateFrom: {
          label: "Datum von",
          description: "E-Mails ab diesem Datum filtern",
          placeholder: "Startdatum auswählen",
        },
        dateTo: {
          label: "Datum bis",
          description: "E-Mails bis zu diesem Datum filtern",
          placeholder: "Enddatum auswählen",
        },
      },
      response: {
        emails: {
          title: "E-Mails",
          emptyState: {
            title: "Keine E-Mails gefunden",
            description: "Keine E-Mails entsprechen Ihren aktuellen Filtern",
          },
          item: {
            title: "E-Mail",
            description: "E-Mail-Details",
            id: "ID",
            subject: "Betreff",
            recipientEmail: "Empfänger-E-Mail",
            recipientName: "Empfängername",
            senderEmail: "Absender-E-Mail",
            senderName: "Absendername",
            type: "Typ",
            status: "Status",
            templateName: "Vorlagenname",
            emailProvider: "E-Mail-Anbieter",
            externalId: "Externe ID",
            sentAt: "Gesendet am",
            deliveredAt: "Zugestellt am",
            openedAt: "Geöffnet am",
            clickedAt: "Geklickt am",
            retryCount: "Wiederholungsanzahl",
            error: "Fehler",
            userId: "Benutzer-ID",
            leadId: "Lead-ID",
            createdAt: "Erstellt am",
            updatedAt: "Aktualisiert am",
            emailCore: {
              title: "Kerninformationen",
            },
            emailParties: {
              title: "Absender & Empfänger",
            },
            emailMetadata: {
              title: "Metadaten",
            },
            emailEngagement: {
              title: "Engagement-Tracking",
            },
            technicalDetails: {
              title: "Technische Details",
            },
            associatedIds: {
              title: "Zugehörige IDs",
            },
            timestamps: {
              title: "Zeitstempel",
            },
          },
        },
        pagination: {
          title: "Paginierung",
          description: "Paginierungsinformationen",
          page: "Aktuelle Seite",
          limit: "Elemente pro Seite",
          total: "Gesamtelemente",
          totalPages: "Gesamtseiten",
        },
        filters: {
          title: "Angewendete Filter",
          description: "Aktuell angewendete Filter",
          status: "Statusfilter",
          type: "Typfilter",
          search: "Suchanfrage",
          dateFrom: "Startdatum",
          dateTo: "Enddatum",
        },
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Die bereitgestellten Parameter sind ungültig",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description:
            "Sie müssen authentifiziert sein, um auf diese Ressource zuzugreifen",
        },
        forbidden: {
          title: "Verboten",
          description:
            "Sie haben keine Berechtigung, auf diese Ressource zuzugreifen",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Die angeforderte Ressource wurde nicht gefunden",
        },
        server: {
          title: "Serverfehler",
          description: "Ein interner Serverfehler ist aufgetreten",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        unsaved: {
          title: "Nicht gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Änderungen",
        },
        conflict: {
          title: "Konflikt",
          description:
            "Die Anfrage steht im Konflikt mit dem aktuellen Zustand",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Ein Netzwerkfehler ist aufgetreten",
        },
      },
      success: {
        title: "Erfolg",
        description: "E-Mails erfolgreich abgerufen",
      },
      enums: {
        type: {
          transactional: "Transaktional",
          marketing: "Marketing",
          notification: "Benachrichtigung",
          system: "System",
          leadCampaign: "Lead-Kampagne",
          userCommunication: "Benutzerkommunikation",
        },
        typeFilter: {
          any: "Alle Typen",
        },
        channel: {
          email: "E-Mail",
          sms: "SMS",
          whatsapp: "WhatsApp",
          telegram: "Telegram",
        },
        channelFilter: {
          any: "Alle Kanäle",
        },
        sortField: {
          subject: "Betreff",
          recipientEmail: "Empfänger-E-Mail",
          recipientName: "Empfängername",
          type: "Typ",
          status: "Status",
          sentAt: "Gesendet am",
          createdAt: "Erstellt am",
        },
        sortOrder: {
          asc: "Aufsteigend",
          desc: "Absteigend",
        },
      },
      widget: {
        to: "An",
        retries: "Wiederholungen",
        opened: "Geöffnet",
        clicked: "Geklickt",
        stats: "Statistiken",
        graphs: "Graphen",
        refresh: "Aktualisieren",
        searchPlaceholder: "E-Mails suchen...",
        clearSearch: "Löschen",
        emptyState: "Keine E-Mails gefunden",
        emptyFiltered: "Keine E-Mails entsprechen Ihren Filtern",
        page: "Seite",
        tabs: {
          all: "Alle",
          sent: "Gesendet",
          delivered: "Zugestellt",
          opened: "Geöffnet",
          failed: "Fehlgeschlagen",
          bounced: "Zurückgewiesen",
        },
      },
    },
    stats: {
      category: "Emails",
      tags: {
        stats: "Statistics",
        analytics: "Analytics",
      },
      dateRange: {
        today: "Heute",
        yesterday: "Gestern",
        last7Days: "Letzte 7 Tage",
        last30Days: "Letzte 30 Tage",
        last90Days: "Letzte 90 Tage",
        thisWeek: "Diese Woche",
        lastWeek: "Letzte Woche",
        thisMonth: "Dieser Monat",
        lastMonth: "Letzter Monat",
        thisQuarter: "Dieses Quartal",
        lastQuarter: "Letztes Quartal",
        thisYear: "Dieses Jahr",
        lastYear: "Letztes Jahr",
        custom: "Benutzerdefinierter Bereich",
      },
      get: {
        title: "E-Mail-Statistiken",
        description: "Umfassende E-Mail-Statistiken und Metriken abrufen",
        form: {
          title: "E-Mail-Statistiken Anfrage",
          description: "Parameter für die Abfrage von E-Mail-Statistiken",
        },
        startDate: {
          label: "Startdatum",
          description: "Startdatum für den Statistikzeitraum",
        },
        endDate: {
          label: "Enddatum",
          description: "Enddatum für den Statistikzeitraum",
        },
        accountId: {
          label: "Konto-ID",
          description: "Statistiken nach spezifischem Konto filtern",
        },
        type: {
          label: "E-Mail-Typ",
          description: "Nach E-Mail-Typ filtern",
          options: {
            all: "Alle",
            sent: "Gesendet",
            received: "Empfangen",
            draft: "Entwurf",
            trash: "Papierkorb",
          },
        },
        groupBy: {
          label: "Gruppieren Nach",
          description: "Wie die Statistiken gruppiert werden sollen",
          options: {
            day: "Nach Tag",
            week: "Nach Woche",
            month: "Nach Monat",
            account: "Nach Konto",
            type: "Nach Typ",
          },
        },
        includeDetails: {
          label: "Details Einschließen",
          description: "Detaillierte Aufschlüsselung in Ergebnisse einbeziehen",
        },
        status: {
          label: "E-Mail-Status",
          description: "Nach E-Mail-Status filtern",
        },
        search: {
          label: "Suchen",
          description: "E-Mails nach Betreff oder Empfänger suchen",
        },
        timePeriod: {
          label: "Zeitraum",
          description: "Zeitraumgranularität für historische Daten",
          hour: "Stunde",
          day: "Tag",
          week: "Woche",
          month: "Monat",
          quarter: "Quartal",
          year: "Jahr",
        },
        dateRangePreset: {
          label: "Datumsbereich-Voreinstellung",
          description: "Vordefinierter Datumsbereich für Filterung",
        },
        dateFrom: {
          label: "Startdatum",
          description: "E-Mails ab diesem Datum filtern",
        },
        dateTo: {
          label: "Enddatum",
          description: "E-Mails bis zu diesem Datum filtern",
        },
        chartType: {
          label: "Diagrammtyp",
          description: "Visualisierungstyp für Diagramme",
          line: "Liniendiagramm",
          bar: "Balkendiagramm",
          area: "Flächendiagramm",
          pie: "Kreisdiagramm",
          donut: "Ringdiagramm",
        },
        includeComparison: {
          label: "Vergleich Einschließen",
          description: "Vergleich mit vorherigem Zeitraum einbeziehen",
        },
        sortBy: {
          label: "Sortieren Nach",
          description: "Feld zum Sortieren der E-Mails",
        },
        sortOrder: {
          label: "Sortierreihenfolge",
          description:
            "Reihenfolge der Sortierung (aufsteigend oder absteigend)",
        },
        response: {
          title: "E-Mail-Statistiken Antwort",
          description: "Umfassende E-Mail-Statistiken und Metrikdaten",
          totalEmails: "E-Mails Gesamt",
          sentEmails: "Gesendete E-Mails",
          deliveredEmails: "Zugestellte E-Mails",
          openedEmails: "Geöffnete E-Mails",
          clickedEmails: "Geklickte E-Mails",
          bouncedEmails: "Zurückgewiesene E-Mails",
          failedEmails: "Fehlgeschlagene E-Mails",
          draftEmails: "Entwurf E-Mails",
          openRate: "Öffnungsrate",
          clickRate: "Klickrate",
          deliveryRate: "Zustellungsrate",
          bounceRate: "Rückweisungsrate",
          failureRate: "Fehlerrate",
          emailsByProvider: "E-Mails nach Anbieter",
          emailsByTemplate: "E-Mails nach Vorlage",
          emailsByStatus: "E-Mails nach Status",
          emailsByType: "E-Mails nach Typ",
          emailsWithUserId: "E-Mails mit Benutzer-ID",
          emailsWithoutUserId: "E-Mails ohne Benutzer-ID",
          emailsWithLeadId: "E-Mails mit Lead-ID",
          emailsWithoutLeadId: "E-Mails ohne Lead-ID",
          emailsWithErrors: "E-Mails mit Fehlern",
          emailsWithoutErrors: "E-Mails ohne Fehler",
          averageRetryCount: "Durchschnittliche Wiederholungsanzahl",
          maxRetryCount: "Maximale Wiederholungsanzahl",
          averageProcessingTime: "Durchschnittliche Verarbeitungszeit",
          averageDeliveryTime: "Durchschnittliche Zustellungszeit",
          historicalData: "Historische Daten",
          groupedStats: "Gruppierte Statistiken",
          generatedAt: "Generiert Am",
          dataRange: "Datenbereich",
          recentActivity: "Aktuelle Aktivität",
          topPerformingTemplates: "Top-Vorlagen",
          topPerformingProviders: "Top-Anbieter",
          metrics: {
            totalEmails: "Gesamt-E-Mails",
            sentEmails: "Gesendete E-Mails",
            deliveredEmails: "Zugestellte E-Mails",
            openedEmails: "Geöffnete E-Mails",
            clickedEmails: "Angeklickte E-Mails",
            bouncedEmails: "Bounce E-Mails",
            failedEmails: "Fehlgeschlagene E-Mails",
            deliveryRate: "Zustellrate",
            openRate: "Öffnungsrate",
            clickRate: "Klickrate",
            bounceRate: "Bounce-Rate",
            failureRate: "Fehlerrate",
            emails_with_errors: "E-Mails mit Fehlern",
            average_retry_count: "Durchschnittliche Anzahl der Wiederholungen",
            average_processing_time: "Durchschnittliche Verarbeitungszeit (ms)",
            average_delivery_time: "Durchschnittliche Zustellzeit (ms)",
            provider_historical: "Anbieter-Verlauf",
            template_historical: "Vorlagen-Verlauf",
            engagement_historical: "Engagement-Verlauf",
          },
          retry: {
            no_retries: "Keine Wiederholungen",
            with_retries: "Mit Wiederholungen",
          },
          association: {
            with_user: "Mit Benutzer",
            with_lead: "Mit Lead",
            with_both: "Mit Beiden",
            with_neither: "Eigenständig",
          },
        },
        errors: {
          unauthorized: {
            title: "Nicht Autorisiert",
            description:
              "Authentifizierung erforderlich für Zugriff auf E-Mail-Statistiken",
          },
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Anfrageparameter bereitgestellt",
          },
          server: {
            title: "Serverfehler",
            description: "Interner Serverfehler beim Abrufen der Statistiken",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unbekannter Fehler ist aufgetreten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkfehler beim Abrufen der Statistiken",
          },
          forbidden: {
            title: "Verboten",
            description: "Zugriff auf E-Mail-Statistiken ist verboten",
          },
          notFound: {
            title: "Nicht Gefunden",
            description: "E-Mail-Statistiken nicht gefunden",
          },
          unsavedChanges: {
            title: "Ungespeicherte Änderungen",
            description:
              "Es gibt ungespeicherte Änderungen, die zuerst gespeichert werden müssen",
          },
          conflict: {
            title: "Konflikt",
            description:
              "Datenkonflikt beim Abrufen der Statistiken aufgetreten",
          },
        },
        success: {
          title: "Erfolg",
          description: "E-Mail-Statistiken erfolgreich abgerufen",
        },
      },
      widget: {
        title: "E-Mail-Statistiken",
        total: "Gesamt",
        sent: "Gesendet",
        delivered: "Zugestellt",
        opened: "Geöffnet",
        clicked: "Geklickt",
        bounced: "Zurückgewiesen",
        failed: "Fehlgeschlagen",
        errors: "Fehler",
        engagementRates: "Engagement-Raten",
        deliveryRate: "Zustellungsrate",
        openRate: "Öffnungsrate",
        clickRate: "Klickrate",
        bounceRate: "Absprungrate",
        failureRate: "Fehlerrate",
        byStatus: "Nach Status",
        byType: "Nach Typ",
        avgRetries: "Ø Wiederholungen",
        avgDeliveryMs: "Ø Zustellungszeit",
        viewList: "Liste anzeigen",
        refresh: "Aktualisieren",
        search: "E-Mails suchen...",
      },
      enums: {
        status: {
          pending: "Ausstehend",
          sent: "Gesendet",
          delivered: "Zugestellt",
          opened: "Geöffnet",
          clicked: "Geklickt",
          bounced: "Zurückgewiesen",
          failed: "Fehlgeschlagen",
          unsubscribed: "Abgemeldet",
        },
        statusFilter: {
          any: "Alle Status",
        },
        type: {
          transactional: "Transaktional",
          marketing: "Marketing",
          notification: "Benachrichtigung",
          system: "System",
          leadCampaign: "Lead-Kampagne",
          userCommunication: "Benutzerkommunikation",
        },
        typeFilter: {
          any: "Alle Typen",
        },
        sortField: {
          subject: "Betreff",
          recipientEmail: "Empfänger-E-Mail",
          recipientName: "Empfängername",
          type: "Typ",
          status: "Status",
          sentAt: "Gesendet am",
          createdAt: "Erstellt am",
        },
        sortOrder: {
          asc: "Aufsteigend",
          desc: "Absteigend",
        },
      },
    },
    enums: {
      status: {
        pending: "Ausstehend",
        sent: "Gesendet",
        delivered: "Zugestellt",
        opened: "Geöffnet",
        clicked: "Geklickt",
        bounced: "Zurückgewiesen",
        failed: "Fehlgeschlagen",
        unsubscribed: "Abgemeldet",
      },
      statusFilter: {
        any: "Alle Status",
      },
      type: {
        transactional: "Transaktional",
        marketing: "Marketing",
        notification: "Benachrichtigung",
        system: "System",
        leadCampaign: "Lead-Kampagne",
        userCommunication: "Benutzerkommunikation",
      },
      typeFilter: {
        any: "Alle Typen",
      },
      provider: {
        resend: "Resend",
        sendgrid: "SendGrid",
        mailgun: "Mailgun",
        ses: "Amazon SES",
        smtp: "SMTP",
        mailjet: "Mailjet",
        postmark: "Postmark",
        other: "Andere",
      },
      sortField: {
        subject: "Betreff",
        recipientEmail: "Empfänger-E-Mail",
        recipientName: "Empfängername",
        type: "Typ",
        status: "Status",
        sentAt: "Gesendet am",
        createdAt: "Erstellt am",
      },
      retryRange: {
        noRetries: "Keine Wiederholungen",
        oneToTwo: "1-2 Wiederholungen",
        threeToFive: "3-5 Wiederholungen",
        sixPlus: "6+ Wiederholungen",
      },
      syncStatus: {
        pending: "Synchronisierung ausstehend",
        syncing: "Synchronisierung läuft",
        synced: "Synchronisiert",
        failed: "Synchronisierung fehlgeschlagen",
      },
      specialFolder: {
        inbox: "Posteingang",
        sent: "Gesendet",
        drafts: "Entwürfe",
        trash: "Papierkorb",
        spam: "Spam",
        archive: "Archiv",
      },
      sortOrder: {
        asc: "Aufsteigend",
        desc: "Absteigend",
      },
    },
  },
  send: {
    title: "Nachricht senden",
    description:
      "Nachricht über beliebigen Kanal senden (E-Mail, SMS, WhatsApp, Telegram)",
    category: "Messaging",
    tag: "Senden",

    container: {
      title: "Nachricht senden",
      description: "Über ein konfiguriertes Messenger-Konto senden",
    },

    accountId: {
      label: "Messenger-Konto",
      description: "Konto zum Senden",
      placeholder: "Konto-UUID auswählen",
    },
    to: {
      label: "Empfänger",
      description: "E-Mail-Adresse, Telefonnummer oder Chat-ID",
      placeholder: "benutzer@beispiel.de oder +4912345678",
    },
    toName: {
      label: "Empfängername",
      description: "Anzeigename des Empfängers (optional)",
      placeholder: "Max Mustermann",
    },
    subject: {
      label: "Betreff",
      description: "Betreffzeile (nur E-Mail, optional für andere Kanäle)",
      placeholder: "Ihr Betreff hier...",
    },
    text: {
      label: "Nachricht",
      description:
        "Nur-Text-Inhalt - für SMS/WhatsApp/Telegram; E-Mail-Fallback",
      placeholder: "Nachricht eingeben...",
    },
    html: {
      label: "HTML-Inhalt",
      description: "HTML-Inhalt (nur E-Mail, optional - Fallback auf Text)",
      placeholder: "<p>HTML-E-Mail-Inhalt eingeben...</p>",
    },
    senderName: {
      label: "Absendername",
      description: "Anzeigename des Absenders (nur E-Mail, optional)",
      placeholder: "Ihr Unternehmen",
    },
    replyTo: {
      label: "Antworten an",
      description: "Antwortadresse (nur E-Mail, optional)",
      placeholder: "support@beispiel.de",
    },
    leadId: {
      label: "Lead-ID",
      description: "Zugehöriger Lead zur Verfolgung (optional)",
      placeholder: "UUID",
    },
    campaignId: {
      label: "Kampagnen-ID",
      description: "Zugehörige Kampagne zur Verfolgung (optional)",
      placeholder: "UUID",
    },

    response: {
      title: "Sendeergebnis",
      description: "Ergebnis des Sendevorgangs",
      messageId: { label: "Nachrichten-ID" },
      accountName: { label: "Konto" },
      channel: { label: "Kanal" },
      provider: { label: "Anbieter" },
      sentAt: { label: "Gesendet am" },
    },

    errors: {
      validation: {
        title: "Validierungsfehler",
        description:
          "Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie haben keine Berechtigung zum Senden von Nachrichten",
      },
      server: {
        title: "Serverfehler",
        description: "Ein interner Serverfehler ist beim Senden aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff auf diese Ressource ist verboten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Ein Netzwerkfehler ist beim Senden aufgetreten",
      },
      notFound: {
        title: "Konto nicht gefunden",
        description: "Das angegebene Messenger-Konto wurde nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Anfrage steht im Konflikt mit vorhandenen Daten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen",
      },
    },

    success: {
      title: "Nachricht gesendet",
      description: "Ihre Nachricht wurde erfolgreich gesendet",
    },
  },
  smtpClient: {
    tag: "SMTP-Client",
    category: "E-Mail-Dienste",
    components: {
      email: {
        tagline: "KI-Plattform für freie Meinungsäußerung",
        footer: {
          needHelp: "Brauchen Sie Hilfe?",
          helpText: "Brauchen Sie Hilfe? Kontaktieren Sie uns unter",
          unsubscribeText: "Möchten Sie diese E-Mails nicht mehr erhalten?",
          unsubscribeLink: "Abmelden",
          copyright: "© {{currentYear}} {{appName}}. Alle Rechte vorbehalten.",
          visitWebsite: "Website besuchen",
          allRightsReserved:
            "© {{currentYear}} {{appName}}. Alle Rechte vorbehalten.",
          feedbackHook: "Etwas zu sagen? Antworten - wir lesen es wirklich.",
          feedbackBody:
            "Fehler melden, Funktion anfragen oder sagen, was fehlt. Nuetzliches Feedback bringt dir {{credits}} Credits — ein ganzer Monat gratis.",
          feedbackLink: "Feedback senden →",
          footerSeparator: " · ",
        },
      },
      post: {
        title: "Titel",
        description: "Endpunkt-Beschreibung",
        form: {
          title: "Konfiguration",
          description: "Parameter konfigurieren",
        },
        response: {
          title: "Antwort",
          description: "Antwortdaten",
        },
        errors: {
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Authentifizierung erforderlich",
          },
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Anfrageparameter",
          },
          server: {
            title: "Serverfehler",
            description: "Interner Serverfehler",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unbekannter Fehler ist aufgetreten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkfehler aufgetreten",
          },
          forbidden: {
            title: "Verboten",
            description: "Zugriff verboten",
          },
          notFound: {
            title: "Nicht gefunden",
            description: "Ressource nicht gefunden",
          },
          conflict: {
            title: "Konflikt",
            description: "Datenkonflikt aufgetreten",
          },
        },
        success: {
          title: "Erfolg",
          description: "Vorgang erfolgreich abgeschlossen",
        },
      },
    },
    emailSending: {
      email: {
        defaultSenderName: "System",
        errors: {
          sending_failed:
            "E-Mail an {{recipient}} konnte nicht gesendet werden",
        },
      },
    },
    emailHandling: {
      email: {
        errors: {
          rendering_failed: "E-Mail-Vorlage konnte nicht gerendert werden",
          send_failed: "E-Mail konnte nicht gesendet werden",
          email_failed_subject: "E-Mail fehlgeschlagen",
          unknown_recipient: "Unbekannter Empfänger",
          unknown_sender: "System",
          email_render_exception: "E-Mail-Rendering-Ausnahme aufgetreten",
          batch_send_failed: "Batch-E-Mail-Versand fehlgeschlagen",
        },
      },
    },
    sending: {
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung für SMTP-Sendevorgänge erforderlich",
        },
        server: {
          title: "Server-Fehler",
          description: "Ein Fehler ist auf dem SMTP-Server aufgetreten",
        },
        rejected: {
          title: "E-Mail abgelehnt",
          defaultReason: "E-Mail vom Server abgelehnt",
        },
        no_recipients: {
          title: "Keine Empfänger akzeptiert",
          defaultReason: "Keine Empfänger akzeptiert",
        },
        rate_limit: {
          title: "Ratenlimit überschritten",
        },
        capacity: {
          title: "Kapazitätsfehler",
        },
        no_account: {
          title: "Kein SMTP-Konto verfügbar",
        },
      },
    },
    emailMetadata: {
      errors: {
        server: {
          title: "E-Mail-Metadaten Serverfehler",
          description: "Speichern von E-Mail-Metadaten fehlgeschlagen",
        },
      },
    },
    enums: {
      status: {
        active: "Aktiv",
        inactive: "Inaktiv",
        error: "Fehler",
        testing: "Testen",
      },
      securityType: {
        none: "Keine",
        tls: "TLS",
        ssl: "SSL",
        starttls: "STARTTLS",
      },
      statusFilter: {
        all: "Alle Status",
      },
      healthStatus: {
        healthy: "Gesund",
        degraded: "Beeinträchtigt",
        unhealthy: "Ungesund",
        unknown: "Unbekannt",
      },
      healthStatusFilter: {
        all: "Alle Gesundheitsstatus",
      },
      sortField: {
        name: "Name",
        status: "Status",
        createdAt: "Erstellt am",
        updatedAt: "Aktualisiert am",
        priority: "Priorität",
        totalEmailsSent: "Gesamt gesendete E-Mails",
        lastUsedAt: "Zuletzt verwendet",
      },
      campaignType: {
        leadCampaign: "Lead-Kampagne",
        newsletter: "Newsletter",
        signupNurture: "Anmelde-Pflege",
        retention: "Kundenbindung",
        winback: "Rückgewinnung",
        transactional: "Transaktional",
        notification: "Benachrichtigung",
        system: "System",
      },
      campaignTypeFilter: {
        all: "Alle Kampagnentypen",
      },
      selectionRuleSortField: {
        name: "Name",
        priority: "Priorität",
        campaignType: "Kampagnentyp",
        journeyVariant: "Journey-Variante",
        campaignStage: "Kampagnenstufe",
        country: "Land",
        language: "Sprache",
        createdAt: "Erstellt am",
        updatedAt: "Aktualisiert am",
        emailsSent: "Gesendete E-Mails",
        successRate: "Erfolgsrate",
        lastUsedAt: "Zuletzt verwendet",
      },
      selectionRuleStatusFilter: {
        all: "Alle",
        active: "Aktiv",
        inactive: "Inaktiv",
        default: "Standard",
        failover: "Failover",
      },
      loadBalancingStrategy: {
        roundRobin: "Round-Robin",
        weighted: "Gewichtet",
        priority: "Priorität",
        leastUsed: "Am wenigsten verwendet",
      },
      testResult: {
        success: "Erfolg",
        authFailed: "Authentifizierung fehlgeschlagen",
        connectionFailed: "Verbindung fehlgeschlagen",
        timeout: "Zeitüberschreitung",
        unknownError: "Unbekannter Fehler",
      },
    },
  },

  // Core emails level translations
  tag: "E-Mails",
  tags: {
    stats: "Statistiken",
    analytics: "Analysen",
  },
  error: {
    default: "Ein Fehler ist aufgetreten",
  },
  template: {
    tagline: "KI ohne Einschränkungen",
  },
  footer: {
    visitWebsite: "Website besuchen",
    allRightsReserved: "Alle Rechte vorbehalten",
  },

  // Email Templates
  templates: {
    leads: {
      batch: {
        update: {
          meta: {
            name: "Lead-Massenaktualisierungs-E-Mail",
            description:
              "E-Mail, die bei Massenaktualisierung von Leads gesendet wird",
          },
          preview: {
            totalMatched: "Gesamt gefunden",
            totalMatched_description: "Anzahl der gefundenen Leads",
            totalProcessed: "Gesamt verarbeitet",
            totalProcessed_description: "Anzahl der verarbeiteten Leads",
            totalUpdated: "Gesamt aktualisiert",
            totalUpdated_description:
              "Anzahl der erfolgreich aktualisierten Leads",
            errorsCount: "Fehleranzahl",
            errorsCount_description:
              "Anzahl der Fehler während der Verarbeitung",
            dryRun: "Testlauf",
            dryRun_description: "Nur Vorschau ohne tatsächliche Änderungen",
            userId: "Benutzer-ID",
            userId_description: "ID des Benutzers, der die Aktion durchführt",
          },
        },
      },
      welcome: {
        meta: {
          name: "Lead-Willkommens-E-Mail",
          description: "Willkommens-E-Mail für neue Leads",
        },
        preview: {
          leadId: "Lead-ID",
          leadId_description: "Eindeutige ID des Leads",
          businessName: "Firmenname",
          businessName_description: "Name des Unternehmens (optional)",
          email: "E-Mail",
          email_description: "E-Mail-Adresse des Leads",
          userId: "Benutzer-ID",
          userId_description: "ID des zugeordneten Benutzers (optional)",
        },
      },
    },
    contact: {
      form: {
        meta: {
          name: "Kontaktformular-Einreichung",
          description: "E-Mail bei Kontaktformular-Einreichung",
        },
        preview: {
          name: "Name",
          name_description: "Name des Kontakts",
          email: "E-Mail",
          email_description: "E-Mail-Adresse des Kontakts",
          company: "Firma",
          company_description: "Firmenname (optional)",
          subject: "Betreff",
          subject_description: "Nachrichtenbetreff",
          message: "Nachricht",
          message_description: "Nachrichteninhalt",
          isForCompany: "Für Firmenkonto",
          isForCompany_description:
            "Ob diese E-Mail an das Firmenteam gesendet wird",
          userId: "Benutzer-ID",
          userId_description: "ID des zugeordneten Benutzers (optional)",
          leadId: "Lead-ID",
          leadId_description: "ID des zugeordneten Leads (optional)",
        },
      },
    },
    newsletter: {
      unsubscribe: {
        meta: {
          name: "Newsletter-Abmeldebestätigung",
          description: "Bestätigungs-E-Mail bei Newsletter-Abmeldung",
        },
        preview: {
          email: "E-Mail",
          email_description: "E-Mail-Adresse, die abgemeldet wird",
        },
      },
      welcome: {
        meta: {
          name: "Newsletter-Willkommens-E-Mail",
          description: "Willkommens-E-Mail für neue Newsletter-Abonnenten",
        },
        preview: {
          email: "E-Mail",
          email_description: "E-Mail-Adresse des Abonnenten",
          name: "Name",
          name_description: "Name des Abonnenten (optional)",
          leadId: "Lead-ID",
          leadId_description: "ID des zugeordneten Leads (optional)",
          userId: "Benutzer-ID",
          userId_description: "ID des zugeordneten Benutzers (optional)",
        },
      },
    },
    password: {
      reset: {
        confirm: {
          meta: {
            name: "Passwort-Zurücksetzungsbestätigung",
            description: "Bestätigungs-E-Mail nach Passwortzurücksetzung",
          },
          preview: {
            publicName: "Öffentlicher Name",
            publicName_description: "Öffentlicher Name des Benutzers",
            userId: "Benutzer-ID",
            userId_description: "Eindeutige ID des Benutzers",
          },
        },
        request: {
          meta: {
            name: "Passwort-Zurücksetzungsanfrage",
            description: "E-Mail mit Link zur Passwortzurücksetzung",
          },
          preview: {
            publicName: "Öffentlicher Name",
            publicName_description: "Öffentlicher Name des Benutzers",
            userId: "Benutzer-ID",
            userId_description: "Eindeutige ID des Benutzers",
            passwordResetUrl: "Passwort-Zurücksetzen-URL",
            passwordResetUrl_description: "URL zum Zurücksetzen des Passworts",
          },
        },
      },
    },
    signup: {
      welcome: {
        meta: {
          name: "Benutzer-Registrierungs-Willkommen",
          description: "Willkommens-E-Mail für neue Benutzerregistrierungen",
        },
        preview: {
          privateName: "Privater Name",
          privateName_description: "Privater Name des Benutzers",
          userId: "Benutzer-ID",
          userId_description: "Eindeutige ID des Benutzers",
          leadId: "Lead-ID",
          leadId_description: "ID des zugeordneten Leads",
        },
      },
    },
    users: {
      welcome: {
        meta: {
          name: "Benutzer-Willkommens-E-Mail",
          description: "Willkommens-E-Mail für neue Benutzer",
        },
        preview: {
          userId: "Benutzer-ID",
          userId_description: "Eindeutige ID des Benutzers",
          email: "E-Mail",
          email_description: "E-Mail-Adresse des Benutzers",
          privateName: "Privater Name",
          privateName_description: "Privater Name des Benutzers",
          publicName: "Öffentlicher Name",
          publicName_description: "Öffentlicher Name des Benutzers",
          leadId: "Lead-ID",
          leadId_description: "ID des zugeordneten Leads (optional)",
        },
      },
    },
    subscription: {
      success: {
        meta: {
          name: "Abonnement erfolgreich",
          description: "Bestätigungs-E-Mail für erfolgreiches Abonnement",
        },
        preview: {
          privateName: "Privatname",
          privateName_description: "Privatname des Benutzers",
          userId: "Benutzer-ID",
          userId_description: "Eindeutige ID des Benutzers",
          leadId: "Lead-ID",
          leadId_description: "ID des zugeordneten Leads",
          planName: "Plan-Name",
          planName_description: "Name des Abonnement-Plans",
        },
      },
    },
    admin: {
      signup: {
        meta: {
          name: "Admin: Neue Benutzerregistrierung",
          description: "Admin-Benachrichtigung bei neuer Benutzerregistrierung",
        },
        preview: {
          privateName: "Privatname",
          publicName: "Öffentlicher Name",
          email: "E-Mail",
          userId: "Benutzer-ID",
          subscribeToNewsletter: "Newsletter-Abonnement",
        },
      },
      subscription: {
        meta: {
          name: "Admin: Neues Abonnement",
          description: "Admin-Benachrichtigung bei neuem Abonnement",
        },
        preview: {
          privateName: "Privatname",
          publicName: "Öffentlicher Name",
          email: "E-Mail",
          planName: "Plan-Name",
          statusName: "Status",
        },
      },
      user_create: {
        meta: {
          name: "Admin: Neuer Benutzer erstellt",
          description:
            "Admin-Benachrichtigung bei Erstellung eines Benutzerkontos",
        },
        preview: {
          privateName: "Privatname",
          publicName: "Öffentlicher Name",
          email: "E-Mail",
          userId: "Benutzer-ID",
          leadId: "Lead-ID",
        },
      },
      contact: {
        meta: {
          name: "Admin: Kontaktformular-Einsendung",
          description:
            "Admin-Benachrichtigung bei Einreichung eines Kontaktformulars",
        },
        preview: {
          name: "Name des Absenders",
          email: "E-Mail des Absenders",
          subject: "Betreff",
          message: "Nachricht",
          company: "Unternehmen",
          userId: "Benutzer-ID",
          leadId: "Lead-ID",
        },
      },
    },
  },

  // Email Preview System
  preview: {
    render: {
      post: {
        title: "E-Mail-Vorschau rendern",
        titleShort: "Vorschau rendern",
        description: "Serverseitiges Rendern von E-Mail-Vorlagen",
        container: {
          title: "E-Mail-Vorschau-Konfiguration",
        },
        success: {
          title: "Vorschau gerendert",
          description: "E-Mail-Vorschau erfolgreich gerendert",
        },
        fields: {
          templateId: {
            label: "Vorlagen-ID",
            description: "ID der zu rendernden E-Mail-Vorlage",
          },
          language: {
            label: "Sprache",
            description: "Sprache für E-Mail-Rendering",
          },
          country: {
            label: "Land",
            description: "Land für E-Mail-Rendering",
          },
          props: {
            label: "Vorlagen-Props",
            description: "An die E-Mail-Vorlage zu übergebende Eigenschaften",
          },
          html: {
            title: "Gerendertes HTML",
          },
          subject: {
            title: "E-Mail-Betreff",
          },
          templateVersion: {
            title: "Vorlagenversion",
          },
        },
        errors: {
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Vorschau-Anfragedaten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkfehler beim Rendern der Vorschau",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Sie sind nicht berechtigt, Vorschauen zu rendern",
          },
          forbidden: {
            title: "Verboten",
            description: "Vorschau-Rendering ist verboten",
          },
          notFound: {
            title: "Nicht gefunden",
            description: "E-Mail-Vorlage nicht gefunden",
          },
          server: {
            title: "Serverfehler",
            description: "E-Mail-Vorschau konnte nicht gerendert werden",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unbekannter Fehler ist aufgetreten",
          },
          unsavedChanges: {
            title: "Nicht gespeicherte Änderungen",
            description: "Sie haben nicht gespeicherte Änderungen",
          },
          conflict: {
            title: "Konflikt",
            description: "Ein Konflikt ist beim Rendern aufgetreten",
          },
        },
      },
      title: "E-Mail-Vorschau",
      preview: "Vorschau",
      version: "Version",
      submit: "Vorschau rendern",
      submitting: "Rendere...",
    },
    sendTest: {
      post: {
        title: "Test-E-Mail senden",
        titleShort: "Test-E-Mail",
        description: "Test-E-Mail mit benutzerdefinierten Vorlagendaten senden",
        container: {
          title: "Test-E-Mail-Konfiguration",
        },
        success: {
          title: "Test-E-Mail gesendet",
          description: "Test-E-Mail erfolgreich gesendet",
        },
        fields: {
          templateId: {
            label: "Vorlagen-ID",
            description: "ID der zu sendenden E-Mail-Vorlage",
          },
          recipientEmail: {
            label: "Empfänger-E-Mail",
            description: "E-Mail-Adresse für Testversand",
          },
          language: {
            label: "Sprache",
            description: "Sprache für E-Mail-Rendering",
          },
          country: {
            label: "Land",
            description: "Land für E-Mail-Rendering",
          },
          props: {
            label: "Vorlagen-Props",
            description: "An die E-Mail-Vorlage zu übergebende Eigenschaften",
          },
          success: {
            title: "Erfolg",
          },
          message: {
            title: "Ergebnisnachricht",
          },
        },
        errors: {
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Test-E-Mail-Anfragedaten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkfehler beim Senden der Test-E-Mail",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Sie sind nicht berechtigt, Test-E-Mails zu senden",
          },
          forbidden: {
            title: "Verboten",
            description: "Senden von Test-E-Mails ist verboten",
          },
          notFound: {
            title: "Nicht gefunden",
            description: "E-Mail-Vorlage nicht gefunden",
          },
          server: {
            title: "Serverfehler",
            description: "Test-E-Mail konnte nicht gesendet werden",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unbekannter Fehler ist aufgetreten",
          },
          unsavedChanges: {
            title: "Nicht gespeicherte Änderungen",
            description: "Sie haben nicht gespeicherte Änderungen",
          },
          conflict: {
            title: "Konflikt",
            description: "Ein Konflikt ist beim Senden aufgetreten",
          },
        },
      },
      error: {
        templateNotFound: "E-Mail-Vorlage nicht gefunden",
        invalidProps: "Ungültige Vorlagen-Props",
        sendFailed: "Test-E-Mail konnte nicht gesendet werden",
      },
      success: "Test-E-Mail erfolgreich an {email} gesendet",
      title: "Test-E-Mail senden",
      failed: "Test-E-Mail konnte nicht gesendet werden",
      submit: "Test-E-Mail senden",
      submitting: "Sende...",
    },
  },
  messaging: {
    category: "Messaging",
    tag: "messaging",
    enums: {
      channel: {
        email: "E-Mail",
        sms: "SMS",
        whatsapp: "WhatsApp",
        telegram: "Telegram",
      },
      channelFilter: {
        any: "Alle Kanäle",
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
        active: "Aktiv",
        inactive: "Inaktiv",
        error: "Fehler",
        testing: "Test",
      },
    },
    send: {
      errors: {
        accountNotFound: "Messaging-Konto {{accountId}} nicht gefunden",
        sendFailed: "Nachricht konnte nicht gesendet werden",
        unexpected: "Unerwarteter Fehler beim Senden der Nachricht: {{error}}",
      },
    },
  },
  providers: {
    errors: {
      smtpSendFailed: "SMTP-Versand fehlgeschlagen",
      smtpAccountNotFound: "IMAP-Konto nicht gefunden",
      smtpListInboxFailed: "Posteingang konnte nicht aufgelistet werden",
      smtpListFoldersFailed: "Ordner konnten nicht aufgelistet werden",
      smtpMoveMessageFailed: "Nachricht konnte nicht verschoben werden",
      smtpMarkReadFailed: "Nachricht konnte nicht markiert werden",
      resendKeyNotConfigured: "Resend API-Schlüssel nicht konfiguriert",
      resendSendFailed: "Resend-Versand fehlgeschlagen",
      resendProviderError: "Resend-Anbieter-Fehler",
      resendNoInbox: "Resend unterstützt keinen Posteingang",
      resendNoFolders: "Resend unterstützt keine Ordner",
      smsSendFailed: "SMS-Versand fehlgeschlagen",
      whatsappSendFailed: "WhatsApp-Versand fehlgeschlagen",
      telegramSendFailed: "Telegram-Versand fehlgeschlagen",
      accountNotFound: "Messaging-Konto nicht gefunden",
      notSupported:
        "Diese Operation wird von diesem Anbieter nicht unterstützt",
    },
  },
};
