/**
 * German translations for Email Send endpoint
 */

export const translations = {
  title: "E-Mail senden",
  description: "E-Mails mit optionalen SMS-Benachrichtigungen senden",
  category: "E-Mail-Kommunikation",
  tag: "Senden",

  container: {
    title: "E-Mail-Sendekonfiguration",
    description:
      "E-Mail- und optionale SMS-Benachrichtigungseinstellungen konfigurieren",
  },

  // Field groups
  recipient: {
    title: "Empfängerinformationen",
    description: "Empfängerdetails konfigurieren",
  },
  emailContent: {
    title: "E-Mail-Inhalt",
    description: "E-Mail-Betreff und Inhalt konfigurieren",
  },
  senderSettings: {
    title: "Absendereinstellungen",
    description: "Absendername und Antwort-Adresse konfigurieren",
  },
  groups: {
    campaignTracking: {
      title: "Kampagnen-Tracking",
      description: "Diese E-Mail als Teil einer Kampagne verfolgen",
    },
    smsNotifications: {
      title: "SMS-Benachrichtigungen",
      description: "SMS-Benachrichtigungen zusätzlich zur E-Mail senden",
    },
  },

  // Email fields
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
    placeholder: "HTML-E-Mail-Inhalt eingeben...",
  },
  text: {
    label: "Nur-Text-Inhalt",
    description: "Nur-Text-Fallback-Inhalt (optional)",
    placeholder: "Nur-Text-Version eingeben...",
  },
  senderName: {
    label: "Absendername",
    description: "Name, der als Absender angezeigt wird",
    placeholder: "Ihr Unternehmen",
  },
  replyTo: {
    label: "Antworten-an-E-Mail",
    description: "E-Mail-Adresse für Antworten (optional)",
    placeholder: "noreply@beispiel.de",
  },

  // SMS notification fields
  sendSmsNotification: {
    label: "SMS-Benachrichtigung senden",
    description: "Zusätzlich zur E-Mail eine SMS-Benachrichtigung senden",
  },
  smsPhoneNumber: {
    label: "SMS-Telefonnummer",
    description: "Telefonnummer für SMS-Benachrichtigung",
    placeholder: "+491234567890",
  },
  smsMessage: {
    label: "SMS-Nachricht",
    description: "Nachrichteninhalt für SMS-Benachrichtigung",
    placeholder: "E-Mail erfolgreich gesendet!",
  },

  campaignType: {
    label: "Kampagnentyp",
    description: "Art der E-Mail-Kampagne",
    placeholder: "Kampagnentyp auswählen...",
    options: {
      leadCampaign: "Lead-Kampagne",
      newsletter: "Newsletter",
      transactional: "Transaktional",
      notification: "Benachrichtigung",
      system: "System",
    },
  },
  leadId: {
    label: "Lead-ID",
    description: "Zugehörige Lead-Kennung (optional)",
    placeholder: "lead-12345",
  },

  // Response fields
  response: {
    title: "E-Mail-Sendeergebnis",
    description: "Ergebnis des E-Mail-Sendevorgangs",
    deliveryStatus: {
      title: "Zustellungsstatus",
    },
    accountInfo: {
      title: "Kontoinformationen",
    },
    deliveryResults: {
      title: "Zustellungsergebnisse",
    },
    success: {
      label: "Erfolgreich",
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
      description: "Ergebnis der SMS-Benachrichtigungssendung",
      success: "SMS-Erfolg",
      messageId: {
        label: "SMS-Nachrichten-ID",
      },
      provider: "SMS-Anbieter",
      sentAt: {
        label: "SMS gesendet am",
      },
      error: {
        label: "SMS-Fehler",
      },
    },
  },

  // SMS template
  sms: {
    emailNotificationTemplate: "E-Mail-Benachrichtigung",
  },

  // Error messages
  errors: {
    validation: {
      title: "Validierungsfehler",
      description:
        "Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut",
      smsFields: "SMS-Benachrichtigungsfelder",
      smsRequired:
        "Telefonnummer und Nachricht sind erforderlich, wenn SMS-Benachrichtigung aktiviert ist",
    },
    sms: {
      temporarilyUnavailable: "SMS-Dienst ist vorübergehend nicht verfügbar",
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
    email: {
      title: "E-Mail-Sendefehler",
      description: "Fehler beim Senden der E-Mail über den SMTP-Service",
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
      description: "Ein Netzwerkfehler ist beim Senden der E-Mail aufgetreten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "E-Mail-Ressource nicht gefunden",
    },
    conflict: {
      title: "Konflikt",
      description: "E-Mail-Anfrage steht im Konflikt mit vorhandenen Daten",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Sie haben ungespeicherte Änderungen",
    },
  },
  success: {
    title: "E-Mail erfolgreich gesendet",
    description: "Ihre E-Mail wurde erfolgreich gesendet",
  },
};
