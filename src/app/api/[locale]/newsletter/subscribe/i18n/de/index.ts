import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Newsletter",
  tags: {
    newsletter: "Newsletter",
    subscription: "Abonnement",
  },
  email: {
    label: "E-Mail-Adresse",
    description: "Ihre E-Mail-Adresse für das Newsletter-Abonnement",
    placeholder: "benutzer@beispiel.de",
    helpText:
      "Wir verwenden diese Adresse, um Ihnen Newsletter-Updates zu senden",
  },
  name: {
    label: "Name",
    description: "Ihr Name (optional)",
    placeholder: "Max Mustermann",
    helpText: "Hilft uns, Ihr Newsletter-Erlebnis zu personalisieren",
  },
  preferences: {
    label: "Newsletter-Präferenzen",
    description: "Wählen Sie die Art von Newslettern, die Sie erhalten möchten",
    placeholder: "Wählen Sie Ihre Präferenzen",
    helpText: "Sie können diese Präferenzen jederzeit ändern",
  },
  leadId: {
    label: "Lead-ID",
    description: "Optionale Lead-Kennung",
    placeholder: "123e4567-e89b-12d3-a456-426614174000",
    helpText: "Nur für interne Verwendung",
  },
  response: {
    success: "Newsletter erfolgreich abonniert",
    message: "Erfolgsmeldung",
    leadId: "Lead-Kennung",
    subscriptionId: "Abonnement-ID",
    userId: "Benutzer-ID",
    alreadySubscribed:
      "Diese E-Mail-Adresse ist bereits für unseren Newsletter angemeldet",
  },
  errors: {
    badRequest: {
      title: "Ungültige Anfrage",
      description: "Ungültige Anfrageparameter bereitgestellt",
    },
    internal: {
      title: "Interner Fehler",
      description:
        "Beim Verarbeiten Ihres Abonnements ist ein Fehler aufgetreten",
    },
  },
  post: {
    title: "Newsletter abonnieren",
    description: "Newsletter-Abonnement einrichten",
    form: {
      title: "Newsletter-Abonnement",
      description: "Newsletter-Abonnement konfigurieren",
    },
    response: {
      title: "Abonnement-Antwort",
      description: "Newsletter-Abonnement Antwortdaten",
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
          "Beim Verarbeiten Ihrer Anmeldung ist ein Fehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
      conflict: {
        title: "Bereits abonniert",
        description:
          "Diese E-Mail-Adresse ist bereits für unseren Newsletter angemeldet",
      },
      badRequest: {
        title: "Ungültige Anfrage",
        description: "Ungültige Anfrageparameter bereitgestellt",
      },
    },
    success: {
      title: "Erfolgreich abonniert",
      description: "Sie wurden erfolgreich für unseren Newsletter angemeldet",
    },
  },
  repository: {
    starting: "Newsletter-Abonnement wird gestartet",
    linking_to_lead: "Newsletter-Abonnement wird mit Lead verknüpft",
    lead_found: "Lead für Newsletter-Abonnement gefunden",
    lead_updated: "Lead mit Newsletter-Abonnementdaten aktualisiert",
    lead_update_failed:
      "Fehler beim Aktualisieren des Leads mit Newsletter-Daten",
    lead_not_found: "Lead nicht gefunden oder nicht berechtigt für Update",
    lead_linking_error: "Fehler beim Verknüpfen des Leads mit Newsletter",
    missing_lead_id: "Newsletter-Abonnement ohne leadId versucht",
    already_subscribed: "Benutzer hat Newsletter bereits abonniert",
    reactivating: "Newsletter-Abonnement wird reaktiviert",
    creating_new: "Neues Newsletter-Abonnement wird erstellt",
    created_successfully: "Newsletter-Abonnement erfolgreich erstellt",
    subscription_failed: "Newsletter-Abonnement fehlgeschlagen",
  },
  sms: {
    no_phone_number:
      "Keine Telefonnummer für Newsletter-Willkommens-SMS verfügbar",
    sending_welcome: "Willkommens-SMS an Newsletter-Abonnenten wird gesendet",
    welcome_error: "Fehler beim Senden der Newsletter-Willkommens-SMS",
    no_admin_phone:
      "Keine Admin-Telefonnummer konfiguriert, SMS-Benachrichtigung wird übersprungen",
    sending_admin_notification:
      "Admin-Benachrichtigungs-SMS für Newsletter-Abonnement wird gesendet",
    admin_notification_error:
      "Fehler beim Senden der Admin-Benachrichtigungs-SMS",
    welcome: {
      message:
        "Hallo {{name}}! Willkommen bei unserem Newsletter. Bleiben Sie dran für Updates!",
    },
    admin_notification: {
      message:
        "Neue Newsletter-Anmeldung: {{displayName}} ({{email}}) hat sich angemeldet",
    },
  },
  route: {
    sms_failed_continuing:
      "SMS-Benachrichtigungen fehlgeschlagen, wird fortgesetzt",
  },
};
