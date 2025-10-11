import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "E-Mail-Agent-Warteschlange Verarbeiten",
    description: "E-Mail-Verarbeitung durch die Agent-Pipeline auslösen",
    form: {
      title: "E-Mail-Verarbeitungskonfiguration",
      description: "E-Mail-Verarbeitungsparameter und -optionen konfigurieren",
    },
    emailIds: {
      label: "E-Mail-IDs",
      description: "Liste spezifischer E-Mail-IDs zur Verarbeitung (optional)",
      placeholder: "Geben Sie E-Mail-IDs durch Kommas getrennt ein",
    },
    accountIds: {
      label: "Konto-IDs",
      description:
        "Liste der Konto-IDs zur Verarbeitung aller E-Mails (optional)",
      placeholder: "Geben Sie Konto-IDs durch Kommas getrennt ein",
    },
    forceReprocess: {
      label: "Neuverarbeitung Erzwingen",
      description: "Neuverarbeitung bereits verarbeiteter E-Mails erzwingen",
    },
    skipHardRules: {
      label: "Harte Regeln Überspringen",
      description:
        "Verarbeitung harter Regeln überspringen (Bounce/Spam-Erkennung)",
    },
    skipAiProcessing: {
      label: "KI-Verarbeitung Überspringen",
      description: "KI-gestützte Analyse und Empfehlungen überspringen",
    },
    dryRun: {
      label: "Testlauf",
      description: "Vorschau der Verarbeitung ohne tatsächliche Änderungen",
    },
    priority: {
      label: "Verarbeitungspriorität",
      description: "Prioritätsstufe für die Verarbeitungswarteschlange",
    },
    response: {
      title: "Verarbeitungsergebnisse",
      description: "E-Mail-Verarbeitungsergebnisse und Statistiken",
      item: "Element",
      processedEmails: "Verarbeitete E-Mails",
      hardRulesResults: {
        title: "Harte Regeln Ergebnisse",
        description:
          "Ergebnisse der Verarbeitung harter Regeln (Bounce/Spam-Erkennung)",
        item: {
          title: "Harte Regel Ergebnis",
        },
        emailId: "E-Mail-ID",
        result: "Ergebnis",
      },
      aiProcessingResults: {
        title: "KI-Verarbeitungsergebnisse",
        description: "Ergebnisse der KI-gestützten Analyse und Empfehlungen",
        item: {
          title: "KI-Verarbeitungsergebnis",
        },
        emailId: "E-Mail-ID",
        result: "Ergebnis",
      },
      confirmationRequests: {
        title: "Bestätigungsanfragen",
        description:
          "Menschliche Bestätigungen für die Verarbeitung erforderlich",
        id: "Bestätigungs-ID",
        actionType: "Aktionstyp",
        status: "Status",
      },
      errors: {
        title: "Verarbeitungsfehler",
        description: "Fehler, die während der Verarbeitung aufgetreten sind",
        item: {
          title: "Verarbeitungsfehler",
        },
        emailId: "E-Mail-ID",
        error: "Fehler",
        stage: "Stufe",
      },
      summary: {
        title: "Verarbeitungszusammenfassung",
        description: "Allgemeine Verarbeitungsstatistiken und Ergebnisse",
        totalProcessed: "Gesamt Verarbeitet",
        hardRulesApplied: "Harte Regeln Angewendet",
        aiProcessingCompleted: "KI-Verarbeitung Abgeschlossen",
        aiActionsRecommended: "Empfohlene KI-Aktionen",
        errorsEncountered: "Aufgetretene Fehler",
        confirmationsGenerated: "Generierte Bestätigungen",
        confirmationsRequired: "Erforderliche Bestätigungen",
      },
    },
    errors: {
      unauthorized: {
        title: "Nicht Autorisiert",
        description:
          "Authentifizierung erforderlich um E-Mail-Verarbeitung auszulösen",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Verarbeitungsparameter bereitgestellt",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler während der Verarbeitung",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist während der Verarbeitung aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler während der E-Mail-Verarbeitung",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff auf E-Mail-Verarbeitung ist verboten",
      },
      notFound: {
        title: "Nicht Gefunden",
        description: "E-Mail-Verarbeitungsendpunkt nicht gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description:
          "Es gibt ungespeicherte Änderungen, die zuerst gespeichert werden müssen",
      },
      conflict: {
        title: "Verarbeitungskonflikt",
        description: "E-Mail-Verarbeitungskonflikt aufgetreten",
      },
    },
    success: {
      title: "Verarbeitung Abgeschlossen",
      description: "E-Mail-Verarbeitung erfolgreich abgeschlossen",
    },
  },
  enums: {
    priority: {
      low: "Niedrig",
      normal: "Normal",
      high: "Hoch",
      urgent: "Dringend",
    },
  },
  imapErrors: {
    agent: {
      processing: {
        error: {
          server: {
            description: "E-Mail-Verarbeitung fehlgeschlagen",
          },
        },
      },
    },
  },
};
