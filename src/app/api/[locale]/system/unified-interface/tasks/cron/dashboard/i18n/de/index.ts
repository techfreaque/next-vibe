import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Aufgabenverwaltung",

  errors: {
    fetchDashboard: "Fehler beim Abrufen des Aufgaben-Dashboards",
    repositoryInternalError: "Ein interner Fehler ist aufgetreten",
  },

  widget: {
    title: "Kampagnen-Monitoring",
    refresh: "Aktualisieren",
    health: {
      healthy: "Gesund",
      warning: "Warnung",
      critical: "Kritisch",
    },
    stats: {
      totalTasks: "Gesamtaufgaben",
      enabled: "Aktiviert",
      disabled: "Deaktiviert",
      successRate: "Erfolgsrate (24h)",
      failed24h: "Fehlgeschlagen (24h)",
    },
    task: {
      lastRun: "Letzter Lauf",
      nextRun: "Nächster Lauf",
      never: "Nie",
      executions: "Ausführungen",
      avgDuration: "Ø",
      noHistory: "Noch keine Ausführungen",
      runNow: "Jetzt ausführen",
    },
    status: {
      running: "Läuft",
      completed: "Abgeschlossen",
      failed: "Fehlgeschlagen",
      error: "Fehler",
      timeout: "Zeitüberschreitung",
      pending: "Ausstehend",
      scheduled: "Geplant",
      cancelled: "Abgebrochen",
      unknown: "Unbekannt",
    },
    alerts: {
      title: "Warnungen",
      failures: "aufeinanderfolgende Fehler",
    },
    empty: "Keine Kampagnenaufgaben gefunden",
    loading: "Überwachungsdaten laden...",
  },

  get: {
    tags: {
      tasks: "Aufgaben",
      monitoring: "Überwachung",
    },
    title: "Aufgaben-Dashboard",
    description:
      "Einheitliche Ansicht aller geplanten Aufgaben mit aktueller Ausführungshistorie, Fehlerwarnungen und Systemgesundheit.",
    fields: {
      limit: {
        label: "Aufgabenlimit",
        description: "Maximale Anzahl der zurückzugebenden Aufgaben",
      },
      historyDepth: {
        label: "Historien-Tiefe",
        description: "Anzahl der letzten Ausführungen pro Aufgabe",
      },
    },
    response: {
      tasks: { title: "Aufgaben mit letzten Ausführungen" },
      campaignTasks: { title: "Kampagnenaufgaben" },
      alerts: {
        title: "Fehlerwarnungen für kritische/hohe Prioritätsaufgaben",
      },
      stats: { title: "Aggregierte Statistiken" },
    },
    success: {
      title: "Dashboard geladen",
      description: "Dashboard-Daten erfolgreich abgerufen",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Unzureichende Berechtigungen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Dashboard-Daten nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Ein interner Serverfehler ist aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
    },
  },
};
