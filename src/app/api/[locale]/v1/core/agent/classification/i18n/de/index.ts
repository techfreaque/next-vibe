import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "E-Mail Agent Klassifikation",
    description:
      "E-Mail-Klassifikation manuell durch die Agent-Pipeline auslösen",
    form: {
      title: "Klassifikationsparameter",
      description: "E-Mail-Klassifikation Verarbeitungsoptionen konfigurieren",
    },
    emailIds: {
      label: "E-Mail IDs",
      description: "Spezifische E-Mail IDs zu klassifizieren (eine pro Zeile)",
      placeholder: "E-Mail UUIDs eingeben, eine pro Zeile",
    },
    accountIds: {
      label: "Konto IDs",
      description: "E-Mail Konto IDs zu verarbeiten (eine pro Zeile)",
      placeholder: "Konto UUIDs eingeben, eine pro Zeile",
    },
    maxEmailsPerRun: {
      label: "Max E-Mails pro Lauf",
      description:
        "Maximale Anzahl der E-Mails, die in diesem Lauf verarbeitet werden",
    },
    enableHardRules: {
      label: "Harte Regeln aktivieren",
      description:
        "Harte Regelverarbeitung anwenden (Bounce-Erkennung, Spam-Filterung)",
    },
    enableAiProcessing: {
      label: "KI-Verarbeitung aktivieren",
      description: "KI-basierte Klassifikation und Analyse anwenden",
    },
    priorityFilter: {
      label: "Prioritätsfilter",
      description: "Nur E-Mails mit diesen Prioritätsstufen verarbeiten",
    },
    forceReprocess: {
      label: "Neuverarbeitung erzwingen",
      description:
        "E-Mails auch dann verarbeiten, wenn sie bereits klassifiziert sind",
    },
    dryRun: {
      label: "Testlauf",
      description: "Verarbeitung simulieren ohne Änderungen vorzunehmen",
    },
    response: {
      title: "Klassifikationsergebnisse",
      description: "E-Mail-Klassifikation Verarbeitungsergebnisse",
      emailsProcessed: "E-Mails verarbeitet",
      hardRulesApplied: "Harte Regeln angewendet",
      aiProcessingCompleted: "KI-Verarbeitung abgeschlossen",
      confirmationRequestsCreated: "Bestätigungsanfragen erstellt",
      errors: {
        item: "Fehler-Element",
        emailId: "E-Mail ID",
        stage: "Verarbeitungsstufe",
        error: "Fehlerdetails",
      },
      summary: {
        title: "Verarbeitungsübersicht",
        description: "Gesamtübersicht der Klassifikationsergebnisse",
        totalProcessed: "Gesamt verarbeitete E-Mails",
        pendingCount: "Ausstehende Anzahl",
        completedCount: "Abgeschlossene Anzahl",
        failedCount: "Fehlgeschlagene Anzahl",
        awaitingConfirmationCount: "Anzahl der Bestätigungen ausstehend",
      },
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie sind nicht berechtigt, E-Mail-Klassifikation auszulösen",
      },
      validation: {
        title: "Validierung fehlgeschlagen",
        description: "Ungültige Klassifikationsparameter angegeben",
      },
      server: {
        title: "Server-Fehler",
        description: "E-Mail-Klassifikation konnte nicht ausgelöst werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist während der Klassifikation aufgetreten",
      },
      network: {
        title: "Netzwerk-Fehler",
        description: "Netzwerkkommunikation fehlgeschlagen",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff auf diese Ressource ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Angeforderte Ressource nicht gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ressourcenkonflikt aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "E-Mail-Klassifikation erfolgreich ausgelöst",
    },
  },
  error: {
    execution_failed: "Klassifikations-Ausführung fehlgeschlagen",
    server: {
      description: "Serverfehler während der E-Mail-Klassifikation aufgetreten",
    },
    emails_not_found: "E-Mails für Klassifikation nicht gefunden",
    validation_failed:
      "Validierung der Klassifikationsparameter fehlgeschlagen",
    processing_records_failed:
      "Verarbeitung von E-Mail-Datensätzen für Klassifikation fehlgeschlagen",
  },
  imapErrors: {
    agent: {
      classification: {
        error: {
          execution_failed: "E-Mail-Klassifikations-Ausführung fehlgeschlagen",
          server: {
            description:
              "Verarbeitung der E-Mail-Klassifikation fehlgeschlagen",
          },
          emails_not_found:
            "Keine E-Mails gefunden, die den Kriterien entsprechen",
          validation_failed:
            "Ungültige Klassifikationsparameter bereitgestellt",
          processing_records_failed:
            "Verarbeitung von E-Mail-Klassifikationsdatensätzen fehlgeschlagen",
        },
      },
    },
  },
  api: {
    agent: {
      classification: {
        execution: {
          failed: "Klassifikations-Ausführung fehlgeschlagen",
        },
        emails: {
          not: {
            found: "E-Mails für Klassifikation nicht gefunden",
          },
        },
        validation: {
          failed: "Validierung der Klassifikationsparameter fehlgeschlagen",
        },
      },
    },
  },
};
