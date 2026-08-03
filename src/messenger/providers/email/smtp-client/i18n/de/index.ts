import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
          "E-Mail an {{recipient}} konnte nicht gesendet werden: {{error}}",
        invalid_locale:
          "Versand an {{recipient}} nicht möglich: '{{locale}}' ist keine gültige Sprachkennung",
      },
    },
  },
  emailHandling: {
    email: {
      errors: {
        rendering_failed:
          "E-Mail-Vorlage konnte nicht gerendert werden: {{error}}",
        send_failed: "E-Mail konnte nicht gesendet werden: {{error}}",
        email_failed_subject: "E-Mail fehlgeschlagen",
        unknown_recipient: "Unbekannter Empfänger",
        unknown_sender: "System",
        email_render_exception: "E-Mail-Rendering-Ausnahme aufgetreten",
        batch_send_failed: "Batch-E-Mail-Versand fehlgeschlagen",
        batch_send_failed_item: "Batch-Versand fehlgeschlagen: {{error}}",
        batch_send_failed_all:
          "Batch-E-Mail-Versand fehlgeschlagen: {{errors}}",
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
        detail: "SMTP-Versand fehlgeschlagen: {{error}}",
        detail_account:
          "SMTP-Fehler bei {{accountName}} ({{accountId}}): {{error}}",
        detail_attempt:
          "SMTP-Konto {{accountId}} scheiterte bei Versuch {{attempt}}: {{error}}",
        detail_exhausted:
          "SMTP-Konto {{accountId}} hat alle Wiederholungen aufgebraucht",
      },
      rejected: {
        title: "E-Mail an {{recipient}} abgelehnt: {{reason}}",
        defaultReason: "E-Mail vom Server abgelehnt",
      },
      no_recipients: {
        title: "Kein Empfänger akzeptiert für {{recipient}}",
        defaultReason: "Keine Empfänger akzeptiert",
      },
      rate_limit: {
        title:
          "Stundenlimit von {{accountName}} erreicht: {{current}}/{{limit}} versendet, {{remainingCapacity}} verbleibend",
      },
      capacity: {
        title: "Kapazitätsprüfung fehlgeschlagen: {{error}}",
      },
      no_account: {
        title: "Kein SMTP-Konto verfügbar",
        detail_criteria:
          "Kein SMTP-Konto für {{campaignType}} / {{journeyVariant}} / {{campaignStage}} / {{country}} / {{language}}",
        detail_campaign: "Kein SMTP-Konto für Kampagnentyp {{campaignType}}",
        detail_account: "SMTP-Konto {{accountId}} nicht gefunden",
      },
    },
  },
  emailMetadata: {
    errors: {
      server: {
        title: "E-Mail-Metadaten Serverfehler",
        description: "Speichern von E-Mail-Metadaten fehlgeschlagen",
        detail_store:
          "Metadaten für {{recipient}} konnten nicht gespeichert werden: {{error}}",
        detail_engagement:
          "Interaktionsdaten für Nachricht {{emailId}} konnten nicht aktualisiert werden: {{error}}",
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
};
