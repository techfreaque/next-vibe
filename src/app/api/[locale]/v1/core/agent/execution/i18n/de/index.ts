import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    execution: "Ausführung",
  },
  post: {
    title: "Agent-Aktionen ausführen",
    description: "Manuelle Ausführung genehmigter Aktionen und Tool-Aufrufe",
    form: {
      title: "Ausführungskonfiguration",
      description:
        "Konfigurieren Sie die Ausführungsparameter für Agent-Aktionen",
    },
    confirmationIds: {
      label: "Bestätigungs-IDs",
      description:
        "Liste spezifischer Bestätigungs-IDs zur Ausführung (optional)",
      placeholder: "Geben Sie Bestätigungs-IDs durch Kommas getrennt ein",
    },
    maxActionsPerRun: {
      label: "Max. Aktionen pro Durchlauf",
      description: "Maximale Anzahl von Aktionen pro Durchlauf (1-100)",
    },
    enableToolExecution: {
      label: "Tool-Ausführung aktivieren",
      description: "Ausführung genehmigter Tool-Aufrufe aktivieren",
    },
    enableConfirmationCleanup: {
      label: "Bestätigungsbereinigung aktivieren",
      description:
        "Abgelaufene Bestätigungen während der Ausführung bereinigen",
    },
    confirmationExpiryHours: {
      label: "Bestätigungsablauf in Stunden",
      description: "Stunden, nach denen Bestätigungen ablaufen (1-168)",
    },
    dryRun: {
      label: "Probelauf",
      description: "Vorschau der Ausführung ohne tatsächliche Änderungen",
    },
    response: {
      title: "Ausführungsergebnisse",
      description: "Ergebnisse und Statistiken der Agent-Aktionsausführung",
      actionsExecuted: "Ausgeführte Aktionen",
      confirmationsProcessed: "Verarbeitete Bestätigungen",
      expiredConfirmationsCleanedUp: "Bereinigte abgelaufene Bestätigungen",
      toolCallsExecuted: "Ausgeführte Tool-Aufrufe",
      errors: {
        item: "Fehlerelement",
        confirmationId: "Bestätigungs-ID",
        emailId: "E-Mail-ID",
        action: "Aktion",
        error: "Fehler",
      },
      summary: {
        title: "Ausführungszusammenfassung",
        description: "Zusammenfassung der Ausführungsergebnisse",
        totalProcessed: "Insgesamt verarbeitet",
        successfulExecutions: "Erfolgreiche Ausführungen",
        failedExecutions: "Fehlgeschlagene Ausführungen",
        pendingConfirmations: "Ausstehende Bestätigungen",
        expiredConfirmations: "Abgelaufene Bestätigungen",
      },
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Authentifizierung erforderlich für Agent-Aktionsausführung",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Ausführungsparameter angegeben",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler bei der Ausführung aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist bei der Ausführung aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description:
          "Netzwerkfehler bei der Ausführung von Aktionen aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff auf Agent-Ausführung ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Agent-Ausführungsendpunkt nicht gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description:
          "Es gibt ungespeicherte Änderungen, die zuerst gespeichert werden müssen",
      },
      conflict: {
        title: "Ausführungskonflikt",
        description: "Ausführungskonflikt aufgetreten",
      },
    },
    success: {
      title: "Ausführung abgeschlossen",
      description: "Agent-Aktionsausführung erfolgreich abgeschlossen",
    },
  },
  emails: {
    agent: {
      execution: {
        error: {
          execution_failed: "Agent-Ausführung fehlgeschlagen",
          server: {
            description: "Fehler bei der Ausführung von Agent-Aktionen",
          },
          confirmations_not_found: "Bestätigungen nicht gefunden",
          validation_failed: "Validierung fehlgeschlagen",
          confirmation_not_approved: "Bestätigung nicht genehmigt",
          confirmation_already_executed: "Bestätigung bereits ausgeführt",
          marking_failed:
            "Fehler beim Markieren von Bestätigungen zur Ausführung",
        },
      },
    },
  },
  imapErrors: {
    agent: {
      execution: {
        error: {
          execution_failed: "Agent-Ausführung fehlgeschlagen",
          server: {
            description: "Fehler bei der Ausführung von Agent-Aktionen",
          },
          confirmations_not_found:
            "Bestätigungen für Ausführung nicht gefunden",
          validation_failed: "Ungültige Ausführungsparameter bereitgestellt",
          confirmation_not_approved:
            "Bestätigung nicht für Ausführung genehmigt",
          confirmation_already_executed: "Bestätigung bereits ausgeführt",
          marking_failed:
            "Fehler beim Markieren von Bestätigungen zur Ausführung",
        },
      },
    },
  },
};
