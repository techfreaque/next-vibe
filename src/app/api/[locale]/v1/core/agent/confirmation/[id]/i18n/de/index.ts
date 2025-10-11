import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    confirmation: "Bestätigung",
    automation: "Automatisierung",
  },
  post: {
    title: "Menschliche Bestätigungsantwort",
    description:
      "Auf eine menschliche Bestätigungsanfrage antworten (genehmigen/ablehnen)",
    form: {
      title: "Bestätigungsantwort",
      description: "Geben Sie Ihre Bestätigungsantwort an",
    },
    id: {
      label: "Bestätigungs-ID",
      description: "Die ID der Bestätigungsanfrage",
    },
    confirmationId: {
      label: "Bestätigungs-ID",
      description:
        "Die ID der Bestätigungsanfrage, auf die geantwortet werden soll",
    },
    action: {
      label: "Aktion",
      description: "Bestätigungsanfrage genehmigen oder ablehnen",
    },
    reason: {
      label: "Grund",
      description: "Optionaler Grund für Ihre Entscheidung",
      placeholder: "Grund für Genehmigung/Ablehnung eingeben...",
    },
    metadata: {
      label: "Metadaten",
      description: "Zusätzliche Metadaten für die Antwort",
      placeholder: "JSON-Metadaten eingeben...",
    },
    response: {
      title: "Antwortergebnis",
      description: "Bestätigungsantwortergebnis",
      success: "Antwort erfolgreich",
      message: "Bestätigungsantwort erfolgreich verarbeitet",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Authentifizierung erforderlich um auf Bestätigungen zu antworten",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Bestätigungsantwortdaten bereitgestellt",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler bei der Bestätigung aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist bei der Bestätigung aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description:
          "Netzwerkfehler bei der Verarbeitung der Bestätigung aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff auf Bestätigungsantwort ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Bestätigungsanfrage nicht gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description:
          "Es gibt ungespeicherte Änderungen, die zuerst gespeichert werden müssen",
      },
      conflict: {
        title: "Bestätigungskonflikt",
        description:
          "Bestätigung wurde bereits beantwortet oder ist abgelaufen",
      },
    },
    success: {
      title: "Bestätigung übermittelt",
      description: "Ihre Bestätigungsantwort wurde erfolgreich übermittelt",
    },
  },
  enums: {
    action: {
      approve: "Genehmigen",
      reject: "Ablehnen",
    },
  },
  imapErrors: {
    agent: {
      confirmation: {
        error: {
          not_found: {
            description: "Bestätigungsanfrage nicht gefunden",
          },
          conflict: {
            description: "Bestätigung wurde bereits beantwortet",
          },
          expired: {
            description: "Bestätigungsanfrage ist abgelaufen",
          },
          server: {
            description: "Fehler bei der Verarbeitung der Bestätigungsantwort",
          },
        },
        success: {
          approved: "Bestätigung erfolgreich genehmigt",
          rejected: "Bestätigung erfolgreich abgelehnt",
        },
      },
    },
  },
};
