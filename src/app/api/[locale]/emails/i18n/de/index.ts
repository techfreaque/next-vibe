import { translations as emailServiceTranslations } from "../../email-service/i18n/de";
import { translations as imapClientTranslations } from "../../imap-client/i18n/de";
import { translations as messagesTranslations } from "../../messages/i18n/de";
import { translations as sendTranslations } from "../../send/i18n/de";
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
  emailService: emailServiceTranslations,
  imapClient: imapClientTranslations,
  messages: messagesTranslations,
  send: sendTranslations,
  smtpClient: smtpClientTranslations,

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
    tagline: "Ihre KI-gestützte Chat-Plattform",
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
          firstName: "Vorname",
          firstName_description: "Vorname des Benutzers",
          userId: "Benutzer-ID",
          userId_description: "Eindeutige ID des Benutzers",
          leadId: "Lead-ID",
          leadId_description: "ID des zugeordneten Leads",
          planName: "Plan-Name",
          planName_description: "Name des Abonnement-Plans",
        },
      },
    },
  },

  // Email Preview System
  preview: {
    render: {
      post: {
        title: "E-Mail-Vorschau rendern",
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
    },
    sendTest: {
      post: {
        title: "Test-E-Mail senden",
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
    },
  },
};
