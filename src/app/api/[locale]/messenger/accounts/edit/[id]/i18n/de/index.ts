export const translations = {
  tags: {
    messaging: "Messaging",
  },
  get: {
    title: "Messenger-Konto anzeigen",
    description: "Messenger-Konto-Details abrufen",
  },
  enums: {
    channel: {
      email: "E-Mail",
      sms: "SMS",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
    },
    provider: {
      smtp: "SMTP",
      resend: "Resend",
      ses: "Amazon SES",
      mailgun: "Mailgun",
      sendgrid: "SendGrid",
      mailjet: "Mailjet",
      postmark: "Postmark",
      twilio: "Twilio",
      awsSns: "AWS SNS",
      messagebird: "MessageBird",
      http: "HTTP",
      whatsappBusiness: "WhatsApp Business",
      telegramBot: "Telegram Bot",
    },
    status: {
      active: "Aktiv",
      inactive: "Inaktiv",
      error: "Fehler",
      testing: "Test",
    },
    securityType: {
      none: "Keine",
      tls: "TLS",
      ssl: "SSL",
      starttls: "STARTTLS",
    },
    imapAuthMethod: { plain: "Plain", oauth2: "OAuth2", xoauth2: "XOAUTH2" },
  },

  sections: {
    identity: "Kontoidentität",
    identitySubtitle: "Name und grundlegende Einstellungen",
    smtp: "SMTP-Ausgang",
    smtpSubtitle: "Servereinstellungen für den E-Mail-Versand",
    api: "API-Zugangsdaten",
    apiSubtitle: "API-Schlüssel und Zugriffstoken",
    apiSubtitleSms: "API-Schlüssel und Absender-ID",
    apiSubtitleWhatsapp: "WhatsApp Business API-Token und Telefonnummern-ID",
    apiSubtitleTelegram: "Bot-Token von @BotFather eingeben",
    apiTitleSms: "SMS-Anbieter-Zugangsdaten",
    apiTitleWhatsapp: "WhatsApp Business-Zugangsdaten",
    apiTitleTelegram: "Bot-Token",
    imap: "IMAP-Eingang",
    imapSubtitle: "Eingehende E-Mails empfangen und synchronisieren (optional)",
    routing: "E-Mail-Routing",
    routingSubtitle: "Kampagnen und Journeys für dieses Konto steuern",
    toggleHide: "Ausblenden",
    toggleShow: "Einblenden",
  },

  delete: {
    title: "Konto löschen",
    description: "Dieses Messenger-Konto dauerhaft löschen",
    container: {
      title: "Konto löschen",
      description:
        "Sind Sie sicher, dass Sie dieses Messenger-Konto dauerhaft löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
    },
    backButton: {
      label: "Abbrechen",
    },
    deleteButton: {
      label: "Konto löschen",
    },
    success: {
      title: "Konto gelöscht",
      description: "Messenger-Konto wurde dauerhaft gelöscht",
    },
  },
  put: {
    title: "Messenger-Konto bearbeiten",
    description: "Messenger-Konto-Einstellungen aktualisieren",
    success: {
      title: "Konto aktualisiert",
      description: "Messenger-Konto erfolgreich aktualisiert",
    },
  },
  fields: {
    id: { label: "ID", description: "Konto-ID" },
    name: {
      label: "Kontoname",
      description: "Eindeutiger Name",
      placeholder: "z.B. Haupt-SMTP",
    },
    description: {
      label: "Beschreibung",
      description: "Optionale Beschreibung",
      placeholder: "Zweck des Kontos",
    },
    channel: { label: "Kanal", description: "Kommunikationskanal" },
    provider: { label: "Anbieter", description: "Dienstanbieter" },
    status: { label: "Status", description: "Kontostatus" },
    priority: {
      label: "Priorität",
      description: "Höhere Zahl = höhere Priorität",
    },
    isDefault: {
      label: "Standardkonto",
      description: "Als Standard für diesen Kanal verwenden",
    },
    smtpHost: {
      label: "SMTP-Host",
      description: "SMTP-Hostname",
      placeholder: "smtp.example.com",
    },
    smtpPort: {
      label: "SMTP-Port",
      description: "SMTP-Port",
      placeholder: "587",
    },
    smtpSecurityType: {
      label: "Sicherheit",
      description: "Verbindungssicherheitstyp",
    },
    smtpUsername: {
      label: "SMTP-Benutzername",
      description: "SMTP-Benutzername",
      placeholder: "user@example.com",
    },
    smtpPassword: {
      label: "SMTP-Passwort",
      description: "Leer lassen zum Behalten",
      placeholder: "Neues Passwort oder leer lassen",
    },
    smtpFromEmail: {
      label: "Von-E-Mail",
      description: "Absender-E-Mail",
      placeholder: "noreply@example.com",
    },
    smtpFromName: {
      label: "Absendername",
      description: "Anzeigename des Absenders in E-Mail-Clients",
      placeholder: "Unbottled",
    },
    smtpConnectionTimeout: {
      label: "Verbindungs-Timeout",
      description: "Timeout in ms",
    },
    smtpMaxConnections: {
      label: "Max. Verbindungen",
      description: "Maximale gleichzeitige Verbindungen",
    },
    smtpRateLimitPerHour: {
      label: "Ratenlimit",
      description: "Max. E-Mails pro Stunde",
    },
    apiKey: {
      label: "API-Schlüssel",
      description: "Leer lassen zum Behalten",
      placeholder: "Leer lassen zum Behalten",
    },
    apiToken: {
      label: "API-Token",
      description: "Leer lassen zum Behalten",
      placeholder: "Leer lassen zum Behalten",
    },
    apiSecret: {
      label: "API-Secret",
      description: "Leer lassen zum Behalten",
      placeholder: "Leer lassen zum Behalten",
    },
    fromId: {
      label: "Von-ID",
      description: "Telefonnummer oder Absender-ID",
      placeholder: "+1234567890",
    },
    webhookUrl: {
      label: "Webhook-URL",
      description: "Webhook für eingehende Nachrichten",
      placeholder: "https://example.com/webhook",
    },
    imapHost: {
      label: "IMAP-Host",
      description: "IMAP-Hostname",
      placeholder: "imap.example.com",
    },
    imapPort: {
      label: "IMAP-Port",
      description: "IMAP-Port",
      placeholder: "993",
    },
    imapSecure: {
      label: "IMAP TLS",
      description: "TLS/SSL für IMAP verwenden",
    },
    imapUsername: {
      label: "IMAP-Benutzername",
      description: "IMAP-Benutzername",
      placeholder: "user@example.com",
    },
    imapPassword: {
      label: "IMAP-Passwort",
      description: "Leer lassen zum Behalten",
      placeholder: "Leer lassen zum Behalten",
    },
    imapAuthMethod: {
      label: "IMAP-Auth-Methode",
      description: "IMAP-Authentifizierungsmethode",
    },
    imapSyncEnabled: {
      label: "Sync aktivieren",
      description: "Automatische IMAP-Synchronisierung aktivieren",
    },
    imapSyncInterval: {
      label: "Sync-Intervall",
      description: "Sync-Intervall in Sekunden",
    },
    imapMaxMessages: {
      label: "Max. Nachrichten",
      description: "Max. Nachrichten pro Ordner",
    },
    campaignTypes: {
      label: "Kampagnentypen",
      description: "Kampagnentypen",
      placeholder: "Kampagnentypen auswählen",
    },
    emailJourneyVariants: {
      label: "Journey-Varianten",
      description: "Journey-Varianten",
      placeholder: "Varianten auswählen",
    },
    emailCampaignStages: {
      label: "Kampagnenphasen",
      description: "Kampagnenphasen",
      placeholder: "Phasen auswählen",
    },
    countries: {
      label: "Länder",
      description: "Zielländer",
      placeholder: "Länder auswählen",
    },
    languages: {
      label: "Sprachen",
      description: "Zielsprachen",
      placeholder: "Sprachen auswählen",
    },
    isExactMatch: {
      label: "Genaue Übereinstimmung",
      description: "Genaue Übereinstimmung erforderlich",
    },
    weight: { label: "Gewicht", description: "Lastenausgleichsgewicht" },
    isFailover: {
      label: "Failover",
      description: "Als Failover-Konto verwenden",
    },
    failoverPriority: {
      label: "Failover-Priorität",
      description: "Failover-Priorität",
    },
  },
  response: {
    account: {
      id: "ID",
      name: "Name",
      channel: "Kanal",
      provider: "Anbieter",
      status: "Status",
      healthStatus: "Gesundheit",
      isDefault: "Standard",
      priority: "Priorität",
      smtpFromEmail: "Von-E-Mail",
      smtpFromName: "Absendername",
      fromId: "Von-ID",
      smtpHost: "SMTP-Host",
      smtpPort: "SMTP-Port",
      smtpSecurityType: "Sicherheit",
      smtpUsername: "SMTP-Benutzer",
      imapHost: "IMAP-Host",
      imapPort: "IMAP-Port",
      imapSyncEnabled: "IMAP-Sync",
      imapLastSyncAt: "Letzter IMAP-Sync",
      messagesSentTotal: "Gesendete Nachrichten",
      lastUsedAt: "Zuletzt verwendet",
      createdAt: "Erstellt",
      updatedAt: "Aktualisiert",
    },
  },
  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Ungültige Kontodaten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Admin-Zugriff erforderlich",
    },
    forbidden: { title: "Verboten", description: "Zugriff verweigert" },
    notFound: { title: "Nicht gefunden", description: "Konto nicht gefunden" },
    conflict: {
      title: "Namenskonflikt",
      description: "Ein Konto mit diesem Namen existiert bereits",
    },
    server: {
      title: "Serverfehler",
      description: "Anfrage konnte nicht verarbeitet werden",
    },
    networkError: {
      title: "Netzwerkfehler",
      description: "Netzwerkkommunikation fehlgeschlagen",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Sie haben ungespeicherte Änderungen",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist aufgetreten",
    },
  },
  success: { title: "Erfolg", description: "Konto erfolgreich geladen" },
};
