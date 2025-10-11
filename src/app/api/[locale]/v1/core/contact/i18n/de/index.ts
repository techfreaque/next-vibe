import type { translations as enTranslations } from "../en";

/**
*

* Contact API translations (German)
*/

export const translations: typeof enTranslations = {
  title: "Kontaktformular-Einreichung",
  description:
    "Kontaktformular senden und E-Mail-Benachrichtigungen verarbeiten",
  category: "Kern-API",
  summary: "Kontaktformular-Einreichungen mit Lead-Tracking verarbeiten",
  tags: {
    contactForm: "Kontaktformular",
    contactUs: "Kontaktieren Sie uns",
    contactSubmission: "Kontakt-Einreichung",
    helpSupport: "Hilfe & Support",
  },

  form: {
    label: "Kontaktformular",
    description:
      "Füllen Sie das Formular aus, um mit unserem Team in Kontakt zu treten",
    fields: {
      name: {
        label: "Vollständiger Name",
        description: "Geben Sie Ihren vollständigen Namen ein",
        placeholder: "Max Mustermann",
      },
      email: {
        label: "E-Mail-Adresse",
        description: "Geben Sie Ihre E-Mail-Adresse ein",
        placeholder: "max.mustermann@beispiel.de",
      },
      company: {
        label: "Unternehmen",
        description: "Geben Sie Ihren Firmennamen ein (optional)",
        placeholder: "Musterfirma GmbH",
      },
      subject: {
        label: "Betreff",
        description: "Kurze Beschreibung Ihrer Anfrage",
        placeholder: "Allgemeine Anfrage zu Dienstleistungen",
      },
      message: {
        label: "Nachricht",
        description: "Detaillierte Beschreibung Ihrer Anfrage",
        placeholder:
          "Bitte geben Sie weitere Details zu Ihren Bedürfnissen an...",
      },
      priority: {
        label: "Priorität",
        description: "Wählen Sie die Dringlichkeitsstufe Ihrer Anfrage",
        placeholder: "Prioritätsstufe auswählen",
      },
      leadId: {
        label: "Lead-ID",
        description: "Interne Lead-Tracking-ID (automatisch ausgefüllt)",
        placeholder: "lead_123",
      },
    },
  },

  subject: {
    helpSupport: "Hilfe & Support",
    generalInquiry: "Allgemeine Anfrage",
    technicalSupport: "Technischer Support",
    accountQuestion: "Kontofrage",
    billingQuestion: "Abrechnungsfrage",
    salesInquiry: "Vertriebsanfrage",
    featureRequest: "Feature-Anfrage",
    bugReport: "Fehlerbericht",
    feedback: "Feedback",
    complaint: "Beschwerde",
    partnership: "Partnerschaft",
    other: "Sonstiges",
  },

  priority: {
    low: "Niedrig",
    medium: "Mittel",
    high: "Hoch",
    urgent: "Dringend",
  },

  status: {
    new: "Neu",
    inProgress: "In Bearbeitung",
    resolved: "Gelöst",
    closed: "Geschlossen",
  },

  response: {
    label: "Kontakt-Einreichung Antwort",
    description: "Ergebnis der Kontaktformular-Einreichung",
    success: "Kontaktformular erfolgreich eingereicht",
    messageId: "Nachrichten-ID zur Verfolgung",
    status: "Aktueller Status des Kontakts",
  },

  examples: {
    requests: {
      general: {
        title: "Allgemeine Kontaktanfrage",
        description: "Beispiel einer allgemeinen Kontaktformular-Einreichung",
      },
    },
    responses: {
      success: {
        title: "Erfolgreiche Einreichung",
        description: "Beispiel einer erfolgreichen Kontaktformular-Antwort",
      },
    },
  },

  errors: {
    createFailed: {
      title: "Kontakteinreichung fehlgeschlagen",
      description:
        "Ihr Kontaktformular kann derzeit nicht verarbeitet werden. Bitte versuchen Sie es später erneut.",
    },
    repositoryCreateFailed: "Kontaktanfrage konnte nicht erstellt werden",
    repositoryCreateDetails:
      "Ihr Kontaktformular kann derzeit nicht verarbeitet werden. Bitte versuchen Sie es später erneut.",
    validation: {
      title: "Validierungsfehler",
      description:
        "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut",
      nameMinLength: "Der Name muss mindestens 2 Zeichen lang sein",
      emailInvalid: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
      subjectRequired: "Betreff ist erforderlich",
      messageMinLength: "Die Nachricht muss mindestens 10 Zeichen lang sein",
      priorityInvalid: "Bitte wählen Sie eine gültige Prioritätsstufe",
      statusInvalid: "Ungültiger Statuswert",
    },
    network: {
      title: "Netzwerkfehler",
      description:
        "Ein Netzwerkfehler ist bei der Verarbeitung Ihrer Anfrage aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, diese Aktion durchzuführen",
    },
    forbidden: {
      title: "Verboten",
      description: "Diese Aktion ist verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Die angeforderte Ressource wurde nicht gefunden",
    },
    serverError: {
      title: "Serverfehler",
      description: "Ein interner Serverfehler ist aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unbekannter Fehler ist aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description: "Sie haben nicht gespeicherte Änderungen",
    },
    conflict: {
      title: "Konflikt",
      description:
        "Ein Konflikt ist bei der Verarbeitung Ihrer Anfrage aufgetreten",
    },
  },

  sms: {
    admin: {
      notification: "Neue Kontaktanfrage: {name} ({email}) - {subject}",
    },
    confirmation: {
      message:
        "{name}, vielen Dank für Ihre Nachricht! Wir melden uns bald bei Ihnen.",
    },
  },

  success: {
    title: "Erfolg",
    description: "Ihr Kontaktformular wurde erfolgreich eingereicht",
  },
};
