import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Beratungsverwaltung",
  tag: "beratung",

  // Form enum translations for the enum.ts file
  form: {
    selectionType: {
      new: "Neuen Lead erstellen",
      user: "Bestehender Benutzer",
      lead: "Bestehender Lead",
    },
    priority: {
      options: {
        low: "Niedrig",
        normal: "Normal",
        high: "Hoch",
      },
    },
  },

  post: {
    title: "Neue Beratung erstellen",
    description: "Neue Beratung über das Admin-Panel erstellen",
    category: "Beratungsverwaltung",
    tag: "beratung",

    container: {
      title: "Neue Beratung erstellen",
      description:
        "Neue Beratungsbuchung mit allen erforderlichen Details erstellen",
    },

    selectionType: {
      label: "Auswahltyp",
      description:
        "Wählen Sie, wie der Beratungsteilnehmer ausgewählt werden soll",
      placeholder: "Auswahltyp wählen",
    },

    userId: {
      label: "Benutzer-ID",
      description: "ID des bestehenden Benutzers für die Beratung",
      placeholder: "Benutzer-ID eingeben",
    },

    leadId: {
      label: "Lead-ID",
      description: "ID des bestehenden Leads für die Beratung",
      placeholder: "Lead-ID eingeben",
    },

    name: {
      label: "Vollständiger Name",
      description: "Vollständiger Name des Beratungsteilnehmers",
      placeholder: "Vollständigen Namen eingeben",
    },

    email: {
      label: "E-Mail-Adresse",
      description: "E-Mail-Adresse des Beratungsteilnehmers",
      placeholder: "E-Mail-Adresse eingeben",
    },

    phone: {
      label: "Telefonnummer",
      description: "Telefonnummer für den Beratungskontakt",
      placeholder: "Telefonnummer eingeben",
    },

    businessType: {
      label: "Unternehmenstyp",
      description: "Art des Unternehmens, das der Teilnehmer betreibt",
      placeholder: "Unternehmenstyp eingeben",
    },

    businessName: {
      label: "Firmenname",
      description: "Name des Teilnehmerunternehmens",
      placeholder: "Firmenname eingeben",
    },

    website: {
      label: "Website-URL",
      description: "Unternehmens-Website-URL",
      placeholder: "https://example.com",
    },

    country: {
      label: "Land",
      description: "Land, in dem sich das Unternehmen befindet",
      placeholder: "Land auswählen",
      options: {
        global: "Global",
        de: "Deutschland",
        pl: "Polen",
      },
    },

    language: {
      label: "Sprache",
      description: "Bevorzugte Beratungssprache",
      placeholder: "Sprache auswählen",
      options: {
        en: "Englisch",
        de: "Deutsch",
        pl: "Polnisch",
      },
    },

    city: {
      label: "Stadt",
      description: "Stadt, in der sich das Unternehmen befindet",
      placeholder: "Stadt eingeben",
    },

    currentChallenges: {
      label: "Aktuelle Herausforderungen",
      description:
        "Aktuelle Geschäftsherausforderungen, die angegangen werden sollen",
      placeholder: "Aktuelle Geschäftsherausforderungen beschreiben",
    },

    goals: {
      label: "Ziele",
      description: "Geschäftsziele und Objektive",
      placeholder: "Geschäftsziele beschreiben",
    },

    targetAudience: {
      label: "Zielgruppe",
      description: "Beschreibung der Zielgruppe",
      placeholder: "Zielgruppe beschreiben",
    },

    existingAccounts: {
      label: "Bestehende Social Media Konten",
      description: "Liste bestehender Social Media Konten",
      placeholder: "Bestehende Social Media Konten auflisten",
    },

    competitors: {
      label: "Konkurrenten",
      description: "Hauptgeschäftskonkurrenten",
      placeholder: "Hauptkonkurrenten auflisten",
    },

    preferredDate: {
      label: "Bevorzugtes Datum",
      description: "Bevorzugtes Beratungsdatum des Teilnehmers",
      placeholder: "Bevorzugtes Datum auswählen",
    },

    preferredTime: {
      label: "Bevorzugte Zeit",
      description: "Bevorzugte Beratungszeit des Teilnehmers",
      placeholder: "Bevorzugte Zeit auswählen",
    },

    message: {
      label: "Zusätzliche Nachricht",
      description: "Zusätzliche Informationen oder spezielle Anfragen",
      placeholder: "Zusätzliche Informationen eingeben",
    },

    status: {
      label: "Status",
      description: "Aktueller Beratungsstatus",
      placeholder: "Beratungsstatus auswählen",
    },

    priority: {
      label: "Priorität",
      description: "Beratungsprioritätsstufe",
      placeholder: "Prioritätsstufe auswählen",
    },

    internalNotes: {
      label: "Interne Notizen",
      description: "Interne Admin-Notizen (für Kunden nicht sichtbar)",
      placeholder: "Interne Admin-Notizen (für Kunden nicht sichtbar)",
    },

    // Response fields
    id: {
      label: "Beratungs-ID",
      description: "Eindeutige Kennung für die erstellte Beratung",
    },

    createdAt: {
      label: "Erstellt am",
      description: "Datum und Zeit der Beratungserstellung",
    },

    updatedAt: {
      label: "Aktualisiert am",
      description: "Datum und Zeit der letzten Beratungsaktualisierung",
    },

    userEmail: {
      label: "Benutzer-E-Mail",
      description: "E-Mail-Adresse des Beratungsteilnehmers",
    },

    userName: {
      label: "Benutzername",
      description: "Name des Beratungsteilnehmers",
    },

    userBusinessType: {
      label: "Benutzer-Unternehmenstyp",
      description: "Art des Unternehmens, das der Benutzer betreibt",
    },

    userContactPhone: {
      label: "Benutzer-Kontakttelefon",
      description: "Telefonnummer für den Beratungskontakt",
    },

    isNotified: {
      label: "Benachrichtigung gesendet",
      description: "Ob eine Benachrichtigung an den Teilnehmer gesendet wurde",
    },

    scheduledDate: {
      label: "Geplantes Datum",
      description: "Tatsächlich geplantes Beratungsdatum",
    },

    scheduledTime: {
      label: "Geplante Zeit",
      description: "Tatsächlich geplante Beratungszeit",
    },

    calendarEventId: {
      label: "Kalender-Event-ID",
      description: "Kalender-System-Event-Identifikator",
    },

    meetingLink: {
      label: "Meeting-Link",
      description: "Online-Meeting-URL für die Beratung",
    },

    icsAttachment: {
      label: "ICS-Anhang",
      description: "Kalenderdatei-Anhangsdaten",
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
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen, die verloren gehen",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
      email_send_failed: {
        title: "E-Mail-Versand fehlgeschlagen",
        description: "Beratungs-E-Mail konnte nicht gesendet werden",
      },
      missing_contact_info: {
        title: "Fehlende Kontaktinformationen",
        description: "Erforderliche Kontaktinformationen fehlen",
      },
      partner_notification_failed: {
        title: "Partner-Benachrichtigung fehlgeschlagen",
        description: "Partner-Benachrichtigung konnte nicht gesendet werden",
      },
      internal_notification_failed: {
        title: "Interne Benachrichtigung fehlgeschlagen",
        description: "Interne Benachrichtigung konnte nicht gesendet werden",
      },
      invalid_phone: {
        title: "Ungültige Telefonnummer",
        description: "Die angegebene Telefonnummer ist ungültig",
      },
      sms_send_failed: {
        title: "SMS-Versand fehlgeschlagen",
        description: "Beratungs-SMS konnte nicht gesendet werden",
      },
      no_phone_number: {
        title: "Keine Telefonnummer",
        description:
          "Telefonnummer ist für SMS-Benachrichtigungen erforderlich",
      },
      partner_confirmation_failed: {
        title: "Partner-Bestätigung fehlgeschlagen",
        description: "Partner-Bestätigungs-SMS konnte nicht gesendet werden",
      },
      status_update_failed: {
        title: "Status-Update fehlgeschlagen",
        description: "Beratungsstatus konnte nicht aktualisiert werden",
      },
    },
    success: {
      title: "Erfolg",
      description: "Beratung erfolgreich erstellt",
    },

    // Email templates
    emailTemplates: {
      partner: {
        subject: "Ihre Beratungsanfrage - {{businessName}}",
        title: "Vielen Dank für Ihre Beratungsanfrage, {{name}}!",
        preview:
          "Wir haben Ihre Beratungsanfrage für {{businessName}} erhalten",
        greeting: "Hallo {{name}},",
        message:
          "Vielen Dank für Ihre Beratungsanfrage bei unserem Team. Wir freuen uns darauf, Ihnen beim Wachstum Ihres Unternehmens zu helfen!",
        details: "Beratungsdetails:",
        preferredDate: "Gewünschtes Datum",
        additionalMessage: "Ihre Nachricht",
        nextSteps:
          "Wir werden uns bald bei Ihnen melden, um Ihre Beratungszeit zu bestätigen und die nächsten Schritte mitzuteilen.",
      },
      internal: {
        subject: "Neue Beratungsanfrage - {{businessName}}",
        title: "Neue Beratungsanfrage erhalten",
        preview: "Neue Beratungsanfrage von {{businessName}}",
        greeting: "Hallo Team,",
        message:
          "Eine neue Beratungsanfrage wurde eingereicht und erfordert Aufmerksamkeit.",
        details: "Kontaktdaten:",
        contactName: "Kontaktname",
        contactEmail: "E-Mail-Adresse",
        contactPhone: "Telefonnummer",
        businessName: "Firmenname",
        businessType: "Unternehmenstyp",
        preferredDate: "Gewünschtes Datum",
        priority: "Prioritätsstufe",
        messageContent: "Kundennachricht",
        internalNotes: "Interne Notizen",
        closing: "Bitte überprüfen und die Beratung entsprechend planen.",
        viewConsultation: "Vollständige Beratungsdetails anzeigen",
      },
    },
  },
};
