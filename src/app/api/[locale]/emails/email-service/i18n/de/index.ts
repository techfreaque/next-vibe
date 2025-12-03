/**
 * German translations for Email Service endpoint
 */

export const translations = {
  category: "E-Mail-Verwaltung",
  tag: "E-Mail-Service",

  send: {
    title: "E-Mail senden",
    description:
      "E-Mails über den E-Mail-Service mit erweiterten Optionen senden",

    container: {
      title: "E-Mail-Konfiguration",
      description: "E-Mail-Einstellungen und -Inhalt konfigurieren",
    },

    recipientInfo: {
      title: "Empfänger-Informationen",
      description: "Konfigurieren Sie, wer die E-Mail erhalten soll",
    },

    emailContent: {
      title: "E-Mail-Inhalt",
      description: "Betreff und Inhalt der E-Mail konfigurieren",
    },

    senderSettings: {
      title: "Absender-Einstellungen",
      description: "E-Mail-Absender-Informationen konfigurieren",
    },

    campaignSettings: {
      title: "Kampagnen-Einstellungen",
      description: "Kampagnenspezifische Einstellungen konfigurieren",
    },

    advancedOptions: {
      title: "Erweiterte Optionen",
      description: "Erweiterte Konfigurationsoptionen",
    },

    // Form fields
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
      placeholder: "E-Mail-Betreff eingeben...",
    },
    html: {
      label: "HTML-Inhalt",
      description: "HTML-Inhalt der E-Mail",
      placeholder: "HTML-Inhalt eingeben...",
    },
    text: {
      label: "Nur-Text-Inhalt",
      description: "Nur-Text-Version der E-Mail (optional)",
      placeholder: "Nur-Text-Inhalt eingeben...",
    },
    replyTo: {
      label: "Antwort-an-E-Mail",
      description: "E-Mail-Adresse für Antworten (optional)",
      placeholder: "noreply@beispiel.de",
    },
    unsubscribeUrl: {
      label: "Abmelde-URL",
      description: "URL für Empfänger zum Abmelden (optional)",
      placeholder: "https://beispiel.de/abmelden",
    },
    senderName: {
      label: "Absendername",
      description: "Name, der als Absender angezeigt wird",
      placeholder: "Ihr Unternehmen",
    },
    campaignType: {
      label: "Kampagnentyp",
      description: "Art der E-Mail-Kampagne (optional)",
      placeholder: "newsletter, transactional, etc.",
    },
    emailJourneyVariant: {
      label: "E-Mail-Journey-Variante",
      description: "Variante der E-Mail-Journey (optional)",
      placeholder: "variante-a, variante-b, etc.",
    },
    emailCampaignStage: {
      label: "E-Mail-Kampagnenstadium",
      description: "Stadium der E-Mail-Kampagne (optional)",
      placeholder: "willkommen, nachfass, etc.",
    },
    skipRateLimitCheck: {
      label: "Rate-Limit-Prüfung überspringen",
      description: "Rate-Limiting für diese E-Mail überspringen (nur Admin)",
    },
    leadId: {
      label: "Lead-ID",
      description: "Zugehörige Lead-Kennung (optional)",
      placeholder: "lead-12345",
    },
    campaignId: {
      label: "Kampagnen-ID",
      description: "Zugehörige Kampagnen-Kennung (optional)",
      placeholder: "kampagne-12345",
    },

    // Response fields
    response: {
      accountInfo: {
        title: "Kontoinformationen",
        description: "Details über das verwendete E-Mail-Konto",
      },
      deliveryStatus: {
        title: "Zustellstatus",
        description: "Status der E-Mail-Zustellung an Empfänger",
      },
      result: {
        title: "E-Mail-Ergebnis",
        description: "Ergebnis des E-Mail-Versandvorgangs",
        success: "Erfolg",
        messageId: {
          title: "Nachrichten-ID",
          label: "Nachrichten-ID",
        },
        accountId: {
          title: "Konto-ID",
          label: "Konto-ID",
        },
        accountName: {
          title: "Kontoname",
          label: "Kontoname",
        },
        response: {
          title: "Server-Antwort",
          label: "Antwort",
        },
        sentAt: "Gesendet am",
      },
      accepted: {
        title: "Akzeptierte Empfänger",
        description: "Liste der akzeptierten E-Mail-Empfänger",
        email: "E-Mail-Adresse",
      },
      rejected: {
        title: "Abgelehnte Empfänger",
        description: "Liste der abgelehnten E-Mail-Empfänger",
        email: "E-Mail-Adresse",
      },
    },

    // Error messages
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
      forbidden: {
        title: "Verboten",
        description: "Der Zugriff auf diese Ressource ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Ein Konflikt ist bei der Verarbeitung der Anfrage aufgetreten",
      },
      noData: {
        title: "Keine Daten",
        description:
          "SMTP-Service meldete Erfolg, aber keine Daten wurden bereitgestellt",
      },
      server: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist beim Senden der E-Mail aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description:
          "Ein Netzwerkfehler ist beim Senden der E-Mail aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
    },

    // Success messages
    success: {
      title: "E-Mail erfolgreich gesendet",
      description: "Ihre E-Mail wurde erfolgreich gesendet",
    },
  },
};
