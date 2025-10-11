import { translations as emailServiceTranslations } from "../../email-service/i18n/de";
import { translations as imapClientTranslations } from "../../imap-client/i18n/de";
import { translations as messagesTranslations } from "../../messages/i18n/de";
import { translations as smtpClientTranslations } from "../../smtp-client/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "E-Mail-Verwaltung",
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
      all: "Alle",
    },
    smtpHealthStatusFilter: {
      all: "Alle",
    },
    smtpCampaignTypeFilter: {
      all: "Alle",
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
      all: "Alle",
      active: "Aktiv",
      inactive: "Inaktiv",
      default: "Standard",
      failover: "Failover",
    },
    selectionRuleStatusFilter: {
      all: "Alle",
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
      all: "Alle",
    },
    emailTypeFilter: {
      all: "Alle",
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
  emailService: emailServiceTranslations,
  imapClient: imapClientTranslations,
  messages: messagesTranslations,
  smtpClient: smtpClientTranslations,

  // Core emails level translations
  tag: "E-Mails",
  tags: {
    stats: "Statistiken",
    analytics: "Analysen",
  },
  send: {
    title: "E-Mail senden",
    description: "E-Mails mit optionalen SMS-Benachrichtigungen senden",
    container: {
      title: "E-Mail-Konfiguration",
      description:
        "E-Mail- und SMS-Benachrichtigungseinstellungen konfigurieren",
    },
    to: {
      label: "Empfänger-E-Mail",
      description: "E-Mail-Adresse des Empfängers",
      placeholder: "empfaenger@beispiel.de",
    },
    toName: {
      label: "Empfängername",
      description: "Anzeigename des Empfängers (optional)",
      placeholder: "Max Mustermann",
    },
    subject: {
      label: "E-Mail-Betreff",
      description: "Betreffzeile für die E-Mail",
      placeholder: "Ihr Betreff hier...",
    },
    html: {
      label: "HTML-Inhalt",
      description: "HTML-Inhalt der E-Mail",
    },
    text: {
      label: "Nur-Text-Inhalt",
      description: "Nur-Text-Fallback-Inhalt (optional)",
    },
    senderName: {
      label: "Absendername",
      description: "Als Absender angezeigter Name",
      placeholder: "Ihr Unternehmen",
    },
    replyTo: {
      label: "Antwort-E-Mail",
      description: "E-Mail-Adresse für Antworten (optional)",
      placeholder: "noreply@beispiel.de",
    },
    campaignType: {
      label: "Kampagnentyp",
      description: "Art der E-Mail-Kampagne",
    },
    leadId: {
      label: "Lead-ID",
      description: "Zugehörige Lead-Kennung (optional)",
      placeholder: "lead-12345",
    },
    sendSmsNotification: {
      label: "SMS-Benachrichtigung senden",
      description: "Zusätzlich zur E-Mail eine SMS-Benachrichtigung senden",
    },
    smsPhoneNumber: {
      label: "SMS-Telefonnummer",
      description: "Telefonnummer für SMS-Benachrichtigung",
      placeholder: "+49123456789",
    },
    smsMessage: {
      label: "SMS-Nachricht",
      description: "Nachrichteninhalt für SMS-Benachrichtigung",
      placeholder: "E-Mail erfolgreich gesendet!",
    },
    response: {
      success: {
        label: "Erfolg",
      },
      messageId: {
        label: "Nachrichten-ID",
      },
      accountId: {
        label: "Konto-ID",
      },
      accountName: {
        label: "SMTP-Konto",
      },
      accepted: {
        label: "Akzeptierte Empfänger",
      },
      rejected: {
        label: "Abgelehnte Empfänger",
      },
      response: {
        label: "SMTP-Antwort",
      },
      sentAt: {
        label: "Gesendet am",
      },
      smsResult: {
        title: "SMS-Benachrichtigungsergebnis",
        description: "Ergebnis des SMS-Benachrichtigungsversands",
        success: "SMS-Erfolg",
        messageId: "SMS-Nachrichten-ID",
        provider: "SMS-Anbieter",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description:
          "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie haben keine Berechtigung zum Senden von E-Mails",
      },
      server: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist beim Senden der E-Mail aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Der Zugriff auf diese Ressource ist verboten",
      },
      network: {
        title: "Netzwerkfehler",
        description:
          "Ein Netzwerkfehler ist beim Senden der E-Mail aufgetreten",
      },
    },
    success: {
      title: "E-Mail erfolgreich gesendet",
      description: "Ihre E-Mail wurde erfolgreich gesendet",
    },
  },
};
