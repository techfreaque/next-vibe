import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  overview: {
    description: "E-Mail-Vorlagen anzeigen und in der Vorschau anzeigen",
    template: "Vorlage",
    templates: "Vorlagen",
    version: "Version",
    id: "ID",
    view_preview: "Vorschau anzeigen",
    total: "Gesamtvorlagen",
  },
  preview: {
    back_to_templates: "Zurück zu den Vorlagen",
    previous: "Vorherige Vorlage",
    next: "Nächste Vorlage",
    id: "Vorlagen-ID",
    version: "Version",
    category: "Kategorie",
    path: "Vorlagenpfad",
    send_test: "Test-E-Mail senden",
    loading: "Vorschau wird geladen...",
    error_loading: "E-Mail-Vorschau konnte nicht geladen werden",
    locale: {
      title: "Vorschau Sprache & Land",
      description: "Wählen Sie Sprache und Land für die E-Mail-Vorschau",
      language: "Sprache",
      country: "Land",
      languages: {
        en: "English",
        de: "Deutsch",
        pl: "Polski",
      },
      countries: {
        GLOBAL: "Global",
        DE: "Deutschland",
        PL: "Polska",
        US: "United States",
      },
    },
    form: {
      title: "Email Vorschau Anpassen",
      description:
        "Passen Sie die E-Mail-Eigenschaften an, um verschiedene Szenarien in der Vorschau anzuzeigen",
      reset: "Zurücksetzen",
      select_option: "Option wählen...",
    },
  },
  test: {
    title: "Test-E-Mail",
    description: "Senden Sie eine Test-E-Mail, um die Vorlage zu überprüfen",
    recipient: "Empfänger-E-Mail",
    template: "Vorlage",
    success: "Test-E-Mail erfolgreich versendet",
    send: "Test-E-Mail senden",
    sending: "Wird gesendet...",
  },
  templates: {
    signup: {
      welcome: {
        meta: {
          name: "Willkommens-E-Mail zur Registrierung",
          description:
            "Willkommens-E-Mail an neue Benutzer nach der Registrierung",
        },
        preview: {
          privateName: {
            label: "Name des Benutzers",
            description: "Der Vorname oder bevorzugte Name des Benutzers",
          },
          userId: {
            label: "Benutzer-ID",
            description: "Eindeutige Kennung für das Benutzerkonto",
          },
          leadId: {
            label: "Lead-ID",
            description: "Lead-Tracking-Kennung für Analysen",
          },
        },
      },
    },
    newsletter: {
      welcome: {
        meta: {
          name: "Willkommens-E-Mail zum Newsletter",
          description: "Willkommens-E-Mail an neue Newsletter-Abonnenten",
        },
        preview: {
          email: {
            label: "E-Mail-Adresse",
            description: "E-Mail-Adresse des Abonnenten",
          },
          name: {
            label: "Name des Abonnenten",
            description: "Name des Abonnenten (optional)",
          },
          leadId: {
            label: "Lead-ID",
            description: "Lead-Tracking-Identifikator für Analysen",
          },
          userId: {
            label: "Benutzer-ID",
            description: "Benutzerkonto-Identifikator (optional)",
          },
        },
      },
    },
    subscription: {
      success: {
        meta: {
          name: "E-Mail zur Bestätigung des Abonnements",
          description: "Bestätigungs-E-Mail nach erfolgreichem Abonnement",
        },
        preview: {
          privateName: {
            label: "Vorname",
            description: "Vorname des Benutzers",
          },
          userId: {
            label: "Benutzer-ID",
            description: "Eindeutige Benutzerkennung",
          },
          leadId: {
            label: "Lead-ID",
            description: "Lead-Tracking-Identifikator",
          },
          planName: {
            label: "Planname",
            description: "Name des Abonnementplans",
          },
        },
      },
    },
    password: {
      reset: {
        request: {
          meta: {
            name: "E-Mail zur Anfrage des Passwort-Zurücksets",
            description: "E-Mail mit Link zum Zurücksetzen des Passworts",
          },
          preview: {
            privateName: {
              label: "Benutzername",
              description: "Öffentlicher Name des Benutzers",
            },
            userId: {
              label: "Benutzer-ID",
              description: "Eindeutige Benutzerkennung",
            },
            resetToken: {
              label: "Passwort-Reset-URL",
              description: "Vollständige URL zum Zurücksetzen des Passworts",
            },
          },
        },
        confirm: {
          meta: {
            name: "E-Mail zur Bestätigung des Passwort-Zurücksets",
            description:
              "Bestätigungsl-E-Mail nach dem Zurücksetzen des Passworts",
          },
          preview: {
            privateName: {
              label: "Benutzername",
              description: "Öffentlicher Name des Benutzers",
            },
            userId: {
              label: "Benutzer-ID",
              description: "Eindeutige Benutzerkennung",
            },
          },
        },
      },
    },
    contact: {
      form: {
        meta: {
          name: "E-Mail aus Kontaktformular",
          description:
            "E-Mail wird versendet, wenn das Kontaktformular eingereicht wird",
        },
        preview: {
          name: {
            label: "Name des Absenders",
            description: "Name der Person, die das Formular absendet",
          },
          email: {
            label: "E-Mail des Absenders",
            description: "E-Mail-Adresse des Absenders",
          },
          subject: {
            label: "Betreff",
            description: "Betreff des Kontaktformulars",
          },
          message: {
            label: "Nachricht",
            description: "Nachrichteninhalt des Kontaktformulars",
          },
          company: {
            label: "Unternehmen",
            description: "Unternehmensname (optional)",
          },
          isForCompany: {
            label: "Für Firmenkonto",
            description:
              "Ob dies für ein Unternehmen oder eine Einzelperson ist",
          },
          userId: {
            label: "Benutzer-ID",
            description: "Benutzerkontoidentifikator (optional)",
          },
          leadId: {
            label: "Lead-ID",
            description: "Lead-Tracking-Identifikator",
          },
        },
      },
    },
  },
};
