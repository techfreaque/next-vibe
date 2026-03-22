export const translations = {
  tags: {
    messaging: "Messaging",
  },
  title: "Messenger-Konto erstellen",
  description: "Ein neues Messenger-Konto erstellen",
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

  fields: {
    name: {
      label: "Kontoname",
      description: "Ein eindeutiger Name",
      placeholder: "z.B. Haupt-SMTP, Twilio SMS",
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
      description: "SMTP-Server-Hostname",
      placeholder: "smtp.example.com",
    },
    smtpPort: {
      label: "SMTP-Port",
      description: "SMTP-Server-Port",
      placeholder: "587",
    },
    smtpSecurityType: {
      label: "Sicherheit",
      description: "Verbindungssicherheitstyp",
    },
    smtpUsername: {
      label: "SMTP-Benutzername",
      description: "SMTP-Authentifizierungs-Benutzername",
      placeholder: "user@example.com",
    },
    smtpPassword: {
      label: "SMTP-Passwort",
      description: "SMTP-Authentifizierungs-Passwort",
      placeholder: "••••••••",
    },
    smtpFromEmail: {
      label: "Von-E-Mail",
      description: "Absender-E-Mail-Adresse",
      placeholder: "noreply@example.com",
    },
    smtpConnectionTimeout: {
      label: "Verbindungs-Timeout",
      description: "Timeout in Millisekunden",
    },
    smtpMaxConnections: {
      label: "Max. Verbindungen",
      description: "Maximale gleichzeitige Verbindungen",
    },
    smtpRateLimitPerHour: {
      label: "Ratenlimit",
      description: "Maximale E-Mails pro Stunde",
    },
    apiKey: {
      label: "API-Schlüssel",
      description: "API-Schlüssel für diesen Anbieter",
      placeholder: "re_xxxxxxxxxxxx",
    },
    apiToken: {
      label: "API-Token",
      description: "Primäres API-Token",
      placeholder: "ACxxxxxxxxxxxx",
    },
    apiSecret: {
      label: "API-Secret",
      description: "Sekundäre Anmeldeinformationen",
      placeholder: "••••••••",
    },
    fromId: {
      label: "Von-ID",
      description: "Telefonnummer oder Absender-ID",
      placeholder: "+1234567890",
    },
    webhookUrl: {
      label: "Webhook-URL",
      description: "Eingehende Nachrichten-Webhook-URL",
      placeholder: "https://example.com/webhook",
    },
    imapHost: {
      label: "IMAP-Host",
      description: "IMAP-Server-Hostname",
      placeholder: "imap.example.com",
    },
    imapPort: {
      label: "IMAP-Port",
      description: "IMAP-Server-Port",
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
      description: "IMAP-Passwort",
      placeholder: "••••••••",
    },
    imapAuthMethod: {
      label: "IMAP-Authentifizierungsmethode",
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
      description: "Kampagnentypen für dieses Konto",
      placeholder: "Kampagnentypen auswählen",
    },
    emailJourneyVariants: {
      label: "Journey-Varianten",
      description: "E-Mail-Journey-Varianten",
      placeholder: "Journey-Varianten auswählen",
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
      description: "Genaue Länder-/Sprachübereinstimmung erforderlich",
    },
    weight: { label: "Gewicht", description: "Lastenausgleichsgewicht" },
    isFailover: {
      label: "Failover",
      description: "Als Failover-Konto verwenden",
    },
    failoverPriority: {
      label: "Failover-Priorität",
      description: "Failover-Prioritätsreihenfolge",
    },
  },
  response: {
    account: {
      title: "Konto erstellt",
      description: "Neues Messenger-Konto",
      id: "ID",
      name: "Name",
      channel: "Kanal",
      provider: "Anbieter",
      status: "Status",
      smtpFromEmail: "Von-E-Mail",
      fromId: "Von-ID",
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
    notFound: {
      title: "Nicht gefunden",
      description: "Ressource nicht gefunden",
    },
    conflict: {
      title: "Namenskonflikt",
      description: "Ein Konto mit diesem Namen existiert bereits",
    },
    server: {
      title: "Serverfehler",
      description: "Konto konnte nicht erstellt werden",
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
  success: {
    title: "Konto erstellt",
    description: "Messenger-Konto erfolgreich erstellt",
  },
};
