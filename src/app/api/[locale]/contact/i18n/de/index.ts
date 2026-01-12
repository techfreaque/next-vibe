import { translations as componentsTranslations } from "../../_components/i18n/de";
import type { translations as enTranslations } from "../en";

/**
*

* Contact API translations (German)
*/

export const translations: typeof enTranslations = {
  _components: componentsTranslations,
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
    description: "Status-Updates für Ihre Kontakt-Einreichung",
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
    noContactReturned:
      "Nach der Erstellung wurde kein Kontaktdatensatz zurückgegeben",
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
      phone: {
        missing:
          "Keine Admin-Telefonnummer für Kontakt-Benachrichtigungen konfiguriert",
      },
      send: {
        start:
          "Admin-Benachrichtigungs-SMS für Kontakt-Einreichung wird gesendet",
        error: "Fehler beim Senden der Admin-Benachrichtigungs-SMS für Kontakt",
      },
    },
    confirmation: {
      message:
        "{name}, vielen Dank für Ihre Nachricht! Wir melden uns bald bei Ihnen.",
      phone: {
        missing:
          "Keine Benutzer-Telefonnummer für Kontakt-Bestätigungs-SMS verfügbar",
      },
      send: {
        start: "Bestätigungs-SMS an Kontaktformular-Absender wird gesendet",
        error: "Fehler beim Senden der Bestätigungs-SMS für Kontakt",
      },
    },
  },

  repository: {
    create: {
      start: "Kontaktformular-Einreichung wird gestartet",
      success: "Kontaktformular erfolgreich eingereicht",
      error: "Fehler beim Erstellen der Kontaktformular-Einreichung",
    },
    lead: {
      conversion: {
        start: "Lead-Konvertierung für Kontakt wird gestartet",
        error: "Fehler bei der Lead-Konvertierung für Kontakt",
      },
      provided: "Lead-ID für Kontakt-Einreichung bereitgestellt",
    },
    seed: {
      create: {
        start: "Kontakt-Seed-Erstellung wird gestartet",
        error: "Fehler beim Erstellen des Kontakt-Seeds",
      },
    },
  },

  route: {
    sms: {
      admin: {
        failed:
          "Admin-Benachrichtigungs-SMS für Kontakt-Einreichung fehlgeschlagen",
      },
      confirmation: {
        failed: "Bestätigungs-SMS für Kontakt-Einreichung fehlgeschlagen",
      },
    },
  },

  seeds: {
    dev: {
      start: "Kontakt-Seeds für Entwicklungsumgebung werden gestartet",
      submission: {
        created: "Kontakt-Einreichung in Entwicklungs-Seeds erstellt",
        failed:
          "Fehler beim Erstellen der Kontakt-Einreichung in Entwicklungs-Seeds",
        error:
          "Fehler beim Erstellen der Kontakt-Einreichung in Entwicklungs-Seeds",
      },
      complete: "Kontakt-Entwicklungs-Seeds abgeschlossen",
      error: "Fehler beim Seeden der Kontakt-Entwicklungsdaten",
    },
    test: {
      start: "Kontakt-Seeds für Testumgebung werden gestartet",
      submission: {
        created: "Kontakt-Einreichung in Test-Seeds erstellt",
        failed: "Fehler beim Erstellen der Kontakt-Einreichung in Test-Seeds",
      },
      error: "Fehler beim Seeden der Kontakt-Testdaten",
    },
    prod: {
      start: "Kontakt-Seeds für Produktionsumgebung werden gestartet",
      ready: "Kontakt-Produktionsumgebung bereit",
      error: "Fehler beim Seeden der Kontakt-Produktionsdaten",
    },
  },

  success: {
    title: "Erfolg",
    description: "Ihr Kontaktformular wurde erfolgreich eingereicht",
  },

  email: {
    // Legacy keys for existing email template compatibility
    partner: {
      greeting: "Hallo",
      thankYou: "Vielen Dank für Ihre Kontaktaufnahme!",
      message: "Nachricht",
      additionalInfo:
        "Wir haben Ihre Anfrage erhalten und werden bald antworten.",
      subject: "Kontaktformular-Einreichung",
    },
    company: {
      contactDetails: "Kontaktdaten",
      name: "Name",
      email: "E-Mail",
      company: "Unternehmen",
      contactSubject: "Betreff",
      viewDetails: "Im Admin anzeigen",
    },
    // User confirmation email
    user_confirmation: {
      title: "Wir haben Ihre Nachricht erhalten!",
      subject: "Vielen Dank für Ihre Kontaktaufnahme mit {{appName}}",
      previewText:
        "Wir haben Ihre Nachricht erhalten und werden uns bald bei Ihnen melden.",
      greeting: "Hallo {{name}},",
      thankYou: "Vielen Dank, dass Sie sich an {{appName}} gewandt haben!",
      confirmation:
        "Wir haben Ihre Nachricht erhalten und unser Team wird sie in Kürze prüfen. Wir antworten in der Regel innerhalb von 24 Stunden an Werktagen.",
      yourMessage: "Ihre Nachricht",
      subject_label: "Betreff",
      message_label: "Nachricht",
      whatHappensNext: "Wie geht es weiter?",
      step1: "Unser Team prüft Ihre Anfrage",
      step2: "Wir antworten innerhalb von 24 Stunden",
      step3: "Wir arbeiten gemeinsam an Ihrem Anliegen",
      needUrgentHelp: "Dringende Hilfe benötigt?",
      urgentHelpInfo:
        "Wenn Ihre Anfrage dringend ist, können Sie uns auch per Live-Chat auf unserer Website erreichen oder in unserem Hilfecenter nach sofortigen Antworten suchen.",
      helpCenterButton: "Hilfecenter besuchen",
      signoff:
        "Vielen Dank, dass Sie sich für {{appName}} entschieden haben,\nDas {{appName}} Support-Team",
      footer: "Dies ist eine automatische Bestätigung von {{appName}}",
    },
    // Admin notification email
    admin_notification: {
      title: "Neue Kontaktformular-Einreichung",
      subject: "Neuer Kontakt: {{name}} - {{subject}}",
      previewText: "Neue Kontaktanfrage von {{name}} ({{email}})",
      message: "Eine neue Kontaktformular-Einreichung wurde eingereicht.",
      contactDetails: "Kontaktdaten",
      name: "Name",
      email: "E-Mail",
      company: "Unternehmen",
      subject_label: "Betreff",
      priority: "Priorität",
      message_label: "Nachricht",
      submittedAt: "Eingereicht am",
      leadInfo: "Lead-Informationen",
      leadId: "Lead-ID",
      status: "Status",
      actionRequired: "Aktion erforderlich",
      actionInfo:
        "Bitte prüfen und beantworten Sie diese Anfrage innerhalb von 24 Stunden.",
      viewInAdmin: "Im Admin-Panel anzeigen",
      replyToContact: "Auf Kontakt antworten",
      footer: "Dies ist eine automatische Benachrichtigung von {{appName}}",
    },
  },

  error: {
    general: {
      internal_server_error: "Interner Serverfehler aufgetreten",
    },
  },
};
