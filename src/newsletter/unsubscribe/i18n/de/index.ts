import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Newsletter",
  tags: {
    newsletter: "Newsletter",
  },
  emailPlaceholder: "Geben Sie Ihre E-Mail ein",
  subscription: {
    unsubscribe: {
      title: "Abmelden",
      confirmButton: "Abmeldung bestätigen",
      success: "Sie wurden abgemeldet",
      error: "Abmeldung fehlgeschlagen",
    },
  },
  unsubscribe: {
    page: {
      title: "Abmelden",
      description: "Adresse eingeben, Button drücken, fertig. Ohne Drama.",
      subtitle: "Verwalten Sie Ihr Newsletter-Abonnement",
      emailProvided: {
        title: "Abmeldung bestätigen",
        description:
          "Diese Adresse bekommt danach keinen Newsletter mehr. Ein Klick.",
      },
      unsubscribeButton: "Abmelden",
      unsubscribing: "Wird abgemeldet...",
      status: {
        subscribed: "Diese Adresse erhält unseren Newsletter.",
        notSubscribed: "Diese Adresse steht nicht auf unserer Liste.",
      },
      subscribeText: "Doch anders überlegt?",
      subscribeLink: "Erneut abonnieren",
      info: {
        title: "Was als Nächstes passiert",
        description: "Hier ist, was Sie über die Abmeldung wissen müssen:",
        immediate: {
          title: "Sofort.",
          description:
            "Ab jetzt landet kein Newsletter mehr in deinem Postfach.",
        },
        resubscribe: {
          title: "Umkehrbar.",
          description: "Du kannst jederzeit wieder abonnieren.",
        },
      },
      alternatives: {
        title: "Bevor Sie gehen",
        description: "Erwägen Sie diese Alternativen:",
        subscribe: "E-Mail-Häufigkeit anpassen",
        contact: "Sag uns, was wir besser machen sollen",
      },
    },
  },
  email: {
    label: "E-Mail-Adresse",
    description:
      "Die E-Mail-Adresse, die vom Newsletter abgemeldet werden soll",
    placeholder: "benutzer@beispiel.de",
    unsubscribe: {
      title: "Vom Newsletter abmelden",
      preview: "Sie haben sich erfolgreich von unserem Newsletter abgemeldet",
      greeting: "Hallo",
      confirmation:
        "Wir haben {{email}} erfolgreich von unserem Newsletter abgemeldet",
      resubscribe_info:
        "Falls Sie Ihre Meinung ändern, können Sie sich jederzeit auf unserer Website wieder anmelden",
      resubscribe_button: "Wieder anmelden",
      support_message: "Bei Fragen wenden Sie sich bitte an unser Support-Team",
      subject: "Newsletter Abmeldebestätigung",
      admin_unsubscribe_notification: {
        title: "Newsletter Abmelde-Benachrichtigung",
        preview: "Ein Nutzer hat sich vom Newsletter abgemeldet",
        message: "Ein Nutzer hat sich vom Newsletter abgemeldet",
        email: "E-Mail",
        date: "Datum",
        view_dashboard: "Dashboard anzeigen",
        subject: "Newsletter Abmeldung - Admin Benachrichtigung",
      },
    },
  },
  response: {
    success: "Newsletter erfolgreich abgemeldet",
    message: "Erfolgsmeldung",
  },
  errors: {
    email_generation_failed: "E-Mail konnte nicht generiert werden",
    internal: {
      title: "Interner Fehler",
      description:
        "Beim Verarbeiten Ihrer Abmeldeanfrage ist ein Fehler aufgetreten",
      detail: "Abmeldung fehlgeschlagen: {{error}}",
    },
  },
  post: {
    title: "Newsletter abmelden",
    titleShort: "Abmelden",
    description: "Vom Newsletter abmelden",
    form: {
      title: "Vom Newsletter abmelden",
      description:
        "Geben Sie Ihre E-Mail-Adresse ein, um sich vom Newsletter abzumelden",
    },
    response: {
      title: "Abmeldeantwort",
      description: "Newsletter-Abmeldebestätigung",
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
      internal: {
        title: "Interner Fehler",
        description:
          "Beim Verarbeiten Ihrer Abmeldeanfrage ist ein Fehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
    },
    success: {
      title: "Erfolgreich abgemeldet",
      description: "Sie wurden vom Newsletter abgemeldet",
    },
  },
  sync: {
    failed: "Newsletter-Abmeldung Synchronisation fehlgeschlagen",
    error: "Newsletter-Abmeldung Synchronisation Fehler",
    tag: "Newsletter-Synchronisation",
    post: {
      title: "Newsletter-Abmeldung synchronisieren",
      description: "Lead-Status für Newsletter-Abmeldungen synchronisieren",
      container: {
        title: "Synchronisierungskonfiguration",
        description: "Synchronisierungsparameter konfigurieren",
      },
      fields: {
        batchSize: {
          label: "Batch-Größe",
          description: "Anzahl der Datensätze pro Batch",
        },
        dryRun: {
          label: "Testlauf",
          description: "Ausführen ohne Änderungen vorzunehmen",
        },
      },
      response: {
        leadsProcessed: "Verarbeitete Leads",
        leadsUpdated: "Aktualisierte Leads",
        executionTimeMs: "Ausführungszeit (ms)",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff verweigert",
        },
        server: {
          title: "Serverfehler",
          description: "Beim Synchronisieren ist ein Fehler aufgetreten",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unbekannter Fehler ist aufgetreten",
        },
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Anfrageparameter",
        },
      },
      success: {
        title: "Synchronisierung abgeschlossen",
        description: "Newsletter-Abmeldungen erfolgreich synchronisiert",
      },
    },
  },
  emailTemplates: {
    unsubscribe: {
      name: "Newsletter Abmelde-E-Mail",
      description: "Bestätigungs-E-Mail für Newsletter-Abmeldungen",
      category: "newsletter",
      preview: {
        email: {
          label: "E-Mail-Adresse",
          description: "Die abzumeldende E-Mail-Adresse",
        },
      },
    },
  },
  sms: {
    confirmation: {
      message:
        "Sie haben sich erfolgreich vom {{appName}} Newsletter abgemeldet. Falls dies ein Fehler war, besuchen Sie bitte unsere Website, um sich erneut anzumelden.",
    },
    admin_notification: {
      message:
        "Newsletter-Abmeldung: {{email}} hat sich vom Newsletter abgemeldet.",
    },
    errors: {
      confirmation_failed: {
        title: "SMS-Bestätigung fehlgeschlagen",
        description: "Fehler beim Senden der Abmelde-Bestätigungs-SMS",
      },
      admin_notification_failed: {
        title: "Admin-SMS-Benachrichtigung fehlgeschlagen",
        description: "Fehler beim Senden der Admin-Benachrichtigungs-SMS",
      },
    },
  },
};
