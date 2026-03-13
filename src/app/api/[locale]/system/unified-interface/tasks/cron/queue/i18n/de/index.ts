import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "API Endpunkt",
  tags: {
    tasks: "Tasks",
    cron: "Cron",
    scheduling: "Planung",
    queue: "Warteschlange",
  },
  errors: {
    fetchQueue: "Fehler beim Abrufen der Aufgabenwarteschlange",
  },
  get: {
    title: "Aufgabenwarteschlange",
    description:
      "Die anstehende Aufgabenwarteschlange nach nächster Ausführungszeit sortiert anzeigen",
    fields: {
      priority: {
        label: "Priorität",
        description: "Nach Aufgabenpriorität filtern",
        placeholder: "Priorität auswählen...",
      },
      category: {
        label: "Kategorie",
        description: "Nach Aufgabenkategorie filtern",
        placeholder: "Kategorie auswählen...",
      },
      hidden: {
        label: "Sichtbarkeit",
        description:
          "Versteckte Aufgaben einbeziehen (Standard: alle Aufgaben)",
        placeholder: "Alle Aufgaben",
      },
      limit: {
        label: "Limit",
        description: "Maximale Anzahl der zurückzugebenden Aufgaben",
      },
      offset: {
        label: "Offset",
        description: "Anzahl der zu überspringenden Aufgaben",
      },
    },
    response: {
      tasks: {
        title: "Aufgaben in der Warteschlange",
      },
      task: {
        title: "Aufgabe",
        description: "Individuelle Aufgabeninformationen",
        id: "Aufgaben-ID",
        routeId: "Route-ID",
        displayName: "Name",
        taskDescription: "Beschreibung",
        schedule: "Zeitplan",
        enabled: "Aktiviert",
        hidden: "Versteckt",
        priority: "Priorität",
        status: "Status",
        category: "Kategorie",
        version: "Version",
        timezone: "Zeitzone",
        timeout: "Zeitüberschreitung (ms)",
        retries: "Wiederholungen",
        retryDelay: "Wiederholungsverzögerung (ms)",
        lastExecutedAt: "Zuletzt ausgeführt am",
        lastExecutionStatus: "Status der letzten Ausführung",
        lastExecutionError: "Fehler der letzten Ausführung",
        lastExecutionDuration: "Dauer der letzten Ausführung (ms)",
        nextExecutionAt: "Nächste Ausführung am",
        executionCount: "Ausführungsanzahl",
        consecutiveFailures: "Aufeinanderfolgende Fehler",
        successCount: "Erfolgreiche Ausführungen",
        errorCount: "Fehleranzahl",
        averageExecutionTime: "Durchschnittliche Ausführungszeit (ms)",
        createdAt: "Erstellt am",
        updatedAt: "Aktualisiert am",
        userId: "Benutzer-ID",
        outputMode: "Ausgabemodus",
      },
      totalTasks: "Gesamtaufgaben",
    },
    errors: {
      internal: {
        title: "Interner Serverfehler beim Abrufen der Warteschlange",
        description:
          "Ein unerwarteter Fehler ist beim Abrufen der Aufgabenwarteschlange aufgetreten",
      },
      unauthorized: {
        title: "Unbefugter Zugriff auf Aufgabenwarteschlange",
        description:
          "Sie haben keine Berechtigung, die Aufgabenwarteschlange anzuzeigen",
      },
      validation: {
        title: "Ungültige Anfrageparameter",
        description: "Die bereitgestellten Anfrageparameter sind ungültig",
      },
      forbidden: {
        title: "Zugriff verboten",
        description: "Der Zugriff auf diese Ressource ist verboten",
      },
      notFound: {
        title: "Warteschlange nicht gefunden",
        description: "Keine Aufgaben in der Warteschlange gefunden",
      },
      network: {
        title: "Netzwerkfehler",
        description:
          "Ein Netzwerkfehler ist beim Abrufen der Warteschlange aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      unsaved: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Es gibt nicht gespeicherte Änderungen, die bearbeitet werden müssen",
      },
      conflict: {
        title: "Konfliktfehler",
        description:
          "Ein Konflikt ist bei der Verarbeitung der Anfrage aufgetreten",
      },
    },
    success: {
      retrieved: {
        title: "Warteschlange erfolgreich abgerufen",
        description: "Die Aufgabenwarteschlange wurde erfolgreich abgerufen",
      },
    },
  },
  widget: {
    title: "Aufgabenwarteschlange",
    loading: "Warteschlange wird geladen...",
    header: {
      tasks: "Alle Aufgaben",
      history: "Verlauf",
      refresh: "Aktualisieren",
    },
    filter: {
      visible: "Sichtbar",
      hiddenOnly: "Versteckt",
      allTasks: "Alle Aufgaben",
      allPriorities: "Alle Prioritäten",
      allCategories: "Alle Kategorien",
    },
    search: {
      placeholder: "Warteschlange durchsuchen...",
    },
    queue: {
      position: "#",
      nextRun: "Nächste Ausführung",
      lastRun: "Letzte Ausführung",
      never: "Nie",
      notScheduled: "Nicht geplant",
      in: "in",
      ago: "vor",
      justNow: "gerade eben",
      overdue: "überfällig",
      hiddenBadge: "Versteckt",
      owner: {
        system: "System",
        user: "Benutzer",
      },
    },
    action: {
      view: "Details anzeigen",
      history: "Verlauf anzeigen",
      edit: "Aufgabe bearbeiten",
      run: "Jetzt ausführen",
    },
    empty: {
      noTasks: "Warteschlange ist leer",
      noTasksDesc: "Keine aktiven Aufgaben mit geplanten Ausführungen",
      noMatches: "Keine Aufgaben entsprechen Ihren Filtern",
      noMatchesDesc:
        "Versuchen Sie, Ihre Suche oder Filterkriterien anzupassen",
      clearFilters: "Filter löschen",
    },
  },
};
