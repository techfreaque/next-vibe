import type { translations as enTranslations } from "../en";

/**
 * Consultation Create subdomain translations for German
 */

export const translations: typeof enTranslations = {
  title: "Beratung erstellen",
  description: "Buchen Sie eine Beratung mit unseren Experten",
  category: "Beratung",
  tag: "Beratung",
  container: {
    title: "Beratungsbuchungsformular",
    description: "Füllen Sie das Formular aus, um Ihre Beratung zu planen",
  },
  consultationTypes: {
    label: "Beratungstyp",
    description: "Wählen Sie einen oder mehrere Beratungstypen aus",
    placeholder: "Beratungstypen auswählen",
  },
  preferredDate: {
    label: "Bevorzugtes Datum",
    description: "Wählen Sie Ihr bevorzugtes Beratungsdatum",
    placeholder: "Datum auswählen",
  },
  preferredTime: {
    label: "Bevorzugte Zeit",
    description: "Wählen Sie Ihre bevorzugte Beratungszeit",
    placeholder: "Zeit auswählen (HH:MM)",
  },
  message: {
    label: "Nachricht",
    description: "Zusätzliche Informationen oder Fragen (optional)",
    placeholder: "Erzählen Sie uns mehr darüber, was Sie besprechen möchten",
  },
  response: {
    title: "Beratung erstellt",
    description: "Ihre Beratung wurde erfolgreich geplant",
    consultationId: "Ihre Beratungs-ID",
  },

  // Enum translations for consultation types
  enums: {
    consultationType: {
      initial: "Erstberatung",
      followUp: "Folgetermin",
      technical: "Technischer Support",
      sales: "Verkaufsgespräch",
      support: "Allgemeine Unterstützung",
      strategy: "Strategieplanung",
    },
  },
  errors: {
    validation: {
      title: "Validierungsfehler",
      description:
        "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Die angeforderte Ressource wurde nicht gefunden",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie haben keine Berechtigung, eine Beratung zu erstellen",
    },
    forbidden: {
      title: "Zugriff verweigert",
      description: "Authentifizierung erforderlich, um eine Beratung zu buchen",
    },
    server: {
      title: "Serverfehler",
      description: "Beim Erstellen Ihrer Beratung ist ein Fehler aufgetreten",
    },
    network: {
      title: "Netzwerkfehler",
      description:
        "Verbindung zum Server nicht möglich. Bitte versuchen Sie es erneut",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Bitte füllen Sie alle erforderlichen Felder aus",
    },
    conflict: {
      title: "Buchungskonflikt",
      description: "Der ausgewählte Zeitraum ist nicht mehr verfügbar",
    },
    database: {
      title: "Datenbankfehler",
      description: "Beratungsdaten konnten nicht gespeichert werden",
    },
    userNotFound: {
      title: "Benutzer nicht gefunden",
      description: "Benutzerkonto nicht gefunden",
    },
    invalid_phone: {
      title: "Ungültige Telefonnummer",
      description: "Die angegebene Telefonnummer ist ungültig",
    },
    sms_send_failed: {
      title: "SMS-Versand fehlgeschlagen",
      description: "Beratungs-SMS konnte nicht gesendet werden",
    },
    user_not_found: {
      title: "Benutzer nicht gefunden",
      description: "Benutzerkonto nicht gefunden",
    },
    no_phone_number: {
      title: "Keine Telefonnummer",
      description: "Telefonnummer ist für SMS-Benachrichtigungen erforderlich",
    },
    confirmation_sms_failed: {
      title: "Bestätigungs-SMS fehlgeschlagen",
      description: "Bestätigungs-SMS konnte nicht gesendet werden",
    },
    update_sms_failed: {
      title: "Update-SMS fehlgeschlagen",
      description: "Update-SMS konnte nicht gesendet werden",
    },
  },
  success: {
    title: "Beratung gebucht",
    description: "Ihre Beratung wurde erfolgreich geplant",
    message: "Beratung erfolgreich erstellt",
  },

  // Debug translations for email rendering
  debug: {
    rendering_consultation_request_email: "Rendern der Beratungsanfrage-E-Mail",
    rendering_consultation_update_email: "Rendern der Beratungsupdate-E-Mail",
    rendering_consultation_admin_notification_email:
      "Rendern der Admin-Benachrichtigungs-E-Mail für Beratung",
  },
};
