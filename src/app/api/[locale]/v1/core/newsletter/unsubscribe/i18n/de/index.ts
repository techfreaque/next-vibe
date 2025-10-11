import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Newsletter",
  tags: {
    newsletter: "Newsletter",
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
    internal: {
      title: "Interner Fehler",
      description:
        "Beim Verarbeiten Ihrer Abmeldeanfrage ist ein Fehler aufgetreten",
    },
  },
  post: {
    title: "Newsletter abmelden",
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
  },
  sms: {
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
