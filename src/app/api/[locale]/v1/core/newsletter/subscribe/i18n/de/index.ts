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
};
