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
    helpText: "Wir verwenden diese Adresse, um Ihnen Newsletter-Updates zu senden",
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
    alreadySubscribed: "Diese E-Mail-Adresse ist bereits für unseren Newsletter angemeldet",
  },
  errors: {
    badRequest: {
      title: "Ungültige Anfrage",
      description: "Ungültige Anfrageparameter bereitgestellt",
    },
    internal: {
      title: "Interner Fehler",
      description: "Beim Verarbeiten Ihres Abonnements ist ein Fehler aufgetreten",
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
        description: "Beim Verarbeiten Ihrer Anmeldung ist ein Fehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
      conflict: {
        title: "Bereits abonniert",
        description: "Diese E-Mail-Adresse ist bereits für unseren Newsletter angemeldet",
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
    lead_update_failed: "Fehler beim Aktualisieren des Leads mit Newsletter-Daten",
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
    no_phone_number: "Keine Telefonnummer für Newsletter-Willkommens-SMS verfügbar",
    sending_welcome: "Willkommens-SMS an Newsletter-Abonnenten wird gesendet",
    welcome_error: "Fehler beim Senden der Newsletter-Willkommens-SMS",
    no_admin_phone:
      "Keine Admin-Telefonnummer konfiguriert, SMS-Benachrichtigung wird übersprungen",
    sending_admin_notification:
      "Admin-Benachrichtigungs-SMS für Newsletter-Abonnement wird gesendet",
    admin_notification_error: "Fehler beim Senden der Admin-Benachrichtigungs-SMS",
    welcome: {
      message: "Hallo {{name}}! Willkommen bei unserem Newsletter. Bleiben Sie dran für Updates!",
    },
    admin_notification: {
      message: "Neue Newsletter-Anmeldung: {{displayName}} ({{email}}) hat sich angemeldet",
    },
  },
  route: {
    sms_failed_continuing: "SMS-Benachrichtigungen fehlgeschlagen, wird fortgesetzt",
  },
  emailTemplate: {
    welcome: {
      title: "Willkommen zum {{appName}} Newsletter!",
      subject: "Willkommen bei {{appName}} - Bleib auf dem Laufenden über unzensierte KI",
      preview:
        "Du bist angemeldet! Erhalte die neuesten Updates über unzensierte KI, neue Modelle und exklusive Tipps.",
      greeting_with_name: "Hallo {{name}}!",
      greeting: "Hallo!",
      message:
        "Willkommen zum {{appName}} Newsletter! Du bist jetzt Teil unserer Community von KI-Enthusiasten, die ehrliche, unzensierte Gespräche mit KI schätzen.",
      what_to_expect: "Das erwartet dich:",
      benefit_1: "Ankündigungen und Updates zu neuen KI-Modellen",
      benefit_2: "Tipps und Tricks, um das Beste aus unzensierten KI-Modellen herauszuholen",
      benefit_3: "Exklusive Angebote und früher Zugang zu neuen Features",
      benefit_4: "Community-Highlights und Erfolgsgeschichten",
      frequency: "Wir senden dir alle paar Wochen Updates – nie Spam, immer wertvoller Inhalt.",
      unsubscribe_text: "Möchtest du diese E-Mails nicht mehr erhalten?",
      unsubscribe_link: "Abmelden",
    },
    admin_notification: {
      title: "Neues Newsletter-Abonnement",
      subject: "Neues Newsletter-Abonnement",
      preview: "Ein neuer Benutzer hat den Newsletter abonniert",
      message: "Ein neuer Benutzer hat den Newsletter abonniert.",
      subscriber_details: "Abonnenten-Details",
      email: "E-Mail",
      name: "Name",
      preferences: "Präferenzen",
      view_in_admin: "Im Admin-Panel anzeigen",
    },
  },
};
