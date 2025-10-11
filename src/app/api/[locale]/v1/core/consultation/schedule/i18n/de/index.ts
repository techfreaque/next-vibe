import type { translations as enTranslations } from "../en";

/**
 * Consultation Schedule subdomain translations for German
 */

export const translations: typeof enTranslations = {
  // Main endpoint metadata
  title: "Beratung planen",
  description:
    "Planen Sie eine verfügbare Beratung mit spezifischen Zeit- und Meetingdetails",
  category: "Beratungsverwaltung",
  tag: "beratung",

  // Flat field references (strings for labels)
  consultationId: "Beratungs-ID",
  selectTime: "Zeit auswählen",
  meetingLink: "Meeting-Link",
  calendarEventId: "Kalender-Event-ID",
  icsAttachment: "ICS-Anhang",

  // Field details with nested structure (avoiding duplicate keys)
  consultationIdDetails: {
    description: "Die ID der zu planenden Beratung",
    placeholder: "Beratungs-ID eingeben",
  },
  scheduledDate: {
    description: "Datum und Uhrzeit der Beratung",
    placeholder: "Geplantes Datum und Uhrzeit auswählen",
  },
  scheduledTime: {
    description: "Optionale spezifische Zeit für die Beratung",
    placeholder: "Zeit eingeben (HH:MM)",
  },
  meetingLinkDetails: {
    description: "Videoanruf-Link für die Beratung",
    placeholder: "Meeting-Link eingeben (z.B. Zoom, Teams)",
  },
  calendarEventIdDetails: {
    description: "Externe Kalender-Event-ID zur Verfolgung",
    placeholder: "Kalender-Event-ID eingeben",
  },
  icsAttachmentDetails: {
    description: "Kalender-Datei-Anhang für das Meeting",
    placeholder: "ICS-Kalenderdaten eingeben",
  },

  // Response field descriptions
  response: {
    id: "Beratungs-ID",
    status: "Beratungsstatus",
    isNotified: "E-Mail-Benachrichtigung gesendet",
    updatedAt: "Zuletzt aktualisiert",
  },

  // Success messages
  success: {
    title: "Beratung geplant",
    description: "Die Beratung wurde erfolgreich geplant",
  },

  // Error messages organized by type
  errors: {
    validation: {
      title: "Validierungsfehler",
      description:
        "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut",
      consultationId: "Ungültiges Beratungs-ID-Format",
      scheduledDate: "Ungültiges Datums- oder Zeitformat",
    },
    notFound: {
      title: "Beratung nicht gefunden",
      description: "Die Beratung mit der angegebenen ID wurde nicht gefunden",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie haben keine Berechtigung, diese Beratung zu planen",
    },
    forbidden: {
      title: "Zugriff verweigert",
      description: "Authentifizierung erforderlich, um Beratungen zu planen",
    },
    conflict: {
      title: "Planungskonflikt",
      description:
        "Diese Beratung kann nicht geplant werden (bereits abgeschlossen oder abgesagt)",
    },
    server: {
      title: "Serverfehler",
      description: "Beim Planen der Beratung ist ein Fehler aufgetreten",
    },
    network: {
      title: "Netzwerkfehler",
      description:
        "Verbindung zum Server nicht möglich. Bitte versuchen Sie es erneut",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Bitte füllen Sie alle erforderlichen Felder aus",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut",
    },
    email_send_failed: {
      title: "E-Mail-Versand fehlgeschlagen",
      description: "Terminplanungs-E-Mail konnte nicht gesendet werden",
    },
    user_not_found: {
      title: "Benutzer nicht gefunden",
      description: "Benutzerkonto nicht gefunden",
    },
    scheduled_email_failed: {
      title: "Geplante E-Mail fehlgeschlagen",
      description: "Geplante Beratungs-E-Mail konnte nicht gesendet werden",
    },
    rescheduled_email_failed: {
      title: "Umgeplante E-Mail fehlgeschlagen",
      description: "Umgeplante Beratungs-E-Mail konnte nicht gesendet werden",
    },
    admin_notification_failed: {
      title: "Admin-Benachrichtigung fehlgeschlagen",
      description: "Admin-Benachrichtigung konnte nicht gesendet werden",
    },
    invalid_phone: {
      title: "Ungültige Telefonnummer",
      description: "Die angegebene Telefonnummer ist ungültig",
    },
    sms_send_failed: {
      title: "SMS-Versand fehlgeschlagen",
      description: "Terminplanungs-SMS konnte nicht gesendet werden",
    },
    no_phone_number: {
      title: "Keine Telefonnummer",
      description: "Telefonnummer ist für SMS-Benachrichtigungen erforderlich",
    },
    scheduled_sms_failed: {
      title: "Geplante SMS fehlgeschlagen",
      description: "Geplante Beratungs-SMS konnte nicht gesendet werden",
    },
    rescheduled_sms_failed: {
      title: "Umgeplante SMS fehlgeschlagen",
      description: "Umgeplante Beratungs-SMS konnte nicht gesendet werden",
    },
  },
};
