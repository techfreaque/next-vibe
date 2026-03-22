import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "API Endpunkt",
  tags: {
    tasks: "Tasks",
    cron: "Cron",
    scheduling: "Planung",
  },
  errors: {
    fetchCronTasks: "Fehler beim Abrufen der Cron-Aufgaben",
    createCronTask: "Fehler beim Erstellen der Cron-Aufgabe",
    invalidTaskInput:
      "Task-Eingabe stimmt nicht mit dem Anforderungsschema des Endpunkts überein",
    endpointNotFound: "Endpunkt für die angegebene Route-ID nicht gefunden",
    targetInstanceForbidden:
      "Nur Administratoren können die Zielinstanz für Aufgaben festlegen",
  },
  list: {
    columns: {
      createdAt: "Erstellt am",
      updatedAt: "Aktualisiert am",
    },
  },
  get: {
    title: "Cron-Aufgaben auflisten",
    description: "Liste der Cron-Aufgaben mit optionaler Filterung abrufen",
    container: {
      title: "Cron-Aufgaben Liste",
      description: "Cron-Aufgaben filtern und anzeigen",
    },
    fields: {
      status: {
        label: "Status",
        description: "Nach Aufgabenstatus filtern",
        placeholder: "Status auswählen...",
      },
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
      enabled: {
        label: "Status",
        description: "Nach Aktivierungsstatus filtern",
        placeholder: "Alle Aufgaben",
      },
      hidden: {
        label: "Sichtbarkeit",
        description:
          "Nach Sichtbarkeitsstatus filtern (Standard: nur sichtbare)",
        placeholder: "Sichtbare Aufgaben",
      },
      search: {
        label: "Suche",
        description:
          "Aufgaben nach Name, Route, Beschreibung oder Kategorie filtern",
        placeholder: "Aufgaben suchen...",
      },
      sort: {
        label: "Sortierung",
        description: "Sortierreihenfolge der Aufgabenliste",
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
        title: "Aufgaben",
      },
      task: {
        title: "Aufgabe",
        description: "Individuelle Aufgabeninformationen",
        id: "Aufgaben-ID",
        name: "Aufgabenname",
        taskDescription: "Beschreibung",
        schedule: "Zeitplan",
        enabled: "Aktiviert",
        hidden: "Versteckt",
        priority: "Priorität",
        status: "Status",
        category: "Kategorie",
        lastRun: "Letzter Lauf",
        nextRun: "Nächster Lauf",
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
        successCount: "Erfolgreiche Ausführungen",
        errorCount: "Fehleranzahl",
        averageExecutionTime: "Durchschnittliche Ausführungszeit (ms)",
        createdAt: "Erstellt am",
        updatedAt: "Aktualisiert am",
      },
      totalTasks: "Gesamtaufgaben",
    },
    errors: {
      internal: {
        title: "Interner Serverfehler beim Abrufen der Aufgaben",
        description:
          "Ein unerwarteter Fehler ist beim Abrufen der Aufgabenliste aufgetreten",
      },
      unauthorized: {
        title: "Unbefugter Zugriff auf Aufgabenliste",
        description:
          "Sie haben keine Berechtigung, die Aufgabenliste anzuzeigen",
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
        title: "Aufgaben nicht gefunden",
        description:
          "Es wurden keine Aufgaben gefunden, die den Kriterien entsprechen",
      },
      network: {
        title: "Netzwerkfehler",
        description:
          "Ein Netzwerkfehler ist beim Abrufen der Aufgaben aufgetreten",
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
        title: "Aufgaben erfolgreich abgerufen",
        description: "Die Aufgabenliste wurde erfolgreich abgerufen",
      },
    },
  },
  post: {
    title: "Cron-Aufgabe erstellen",
    description: "Neue Cron-Aufgabe erstellen",
    container: {
      title: "Aufgabe erstellen",
      description: "Neue Cron-Aufgabe konfigurieren",
    },
    fields: {
      id: {
        label: "Task-ID",
        description:
          "Eindeutiger, stabiler Bezeichner für diese Aufgabe (z.B. 'db-health')",
        placeholder: "Task-ID eingeben...",
      },
      routeId: {
        label: "Route-ID",
        description:
          "Handler-Bezeichner: Aufgabenname, Endpunktalias oder 'cron-steps'",
        placeholder: "Route-ID eingeben...",
      },
      displayName: {
        label: "Anzeigename",
        description: "Menschenlesbares Label für diese Aufgabe",
        placeholder: "Anzeigenamen eingeben...",
      },
      outputMode: {
        label: "Ausgabemodus",
        description: "Wann Benachrichtigungen nach der Ausführung senden",
        placeholder: "Ausgabemodus auswählen...",
      },
      description: {
        label: "Beschreibung",
        description: "Aufgabenbeschreibung",
        placeholder: "Beschreibung eingeben...",
      },
      schedule: {
        label: "Zeitplan",
        description: "Cron-Zeitplanausdruck",
        placeholder: "*/5 * * * *",
      },
      priority: {
        label: "Priorität",
        description: "Aufgabenpriorität",
      },
      category: {
        label: "Kategorie",
        description: "Aufgabenkategorie",
      },
      enabled: {
        label: "Aktiviert",
        description: "Aufgabe aktivieren oder deaktivieren",
      },
      hidden: {
        label: "Versteckt",
        description:
          "Diese Aufgabe in KI-System-Prompts und Standard-Aufgabenlisten ausblenden",
      },
      timeout: {
        label: "Zeitüberschreitung (ms)",
        description: "Maximale Ausführungszeit in Millisekunden",
      },
      retries: {
        label: "Wiederholungen",
        description: "Anzahl der Wiederholungsversuche",
      },
      retryDelay: {
        label: "Wiederholungsverzögerung (ms)",
        description: "Verzögerung zwischen Wiederholungen in Millisekunden",
      },
      taskInput: {
        label: "Aufgabeneingabe",
        description: "JSON-Eingabedaten für die Aufgabe",
      },
      runOnce: {
        label: "Einmal ausführen",
        description: "Diese Aufgabe nur einmal ausführen und dann deaktivieren",
      },
      targetInstance: {
        label: "Ziel-Instanz",
        description:
          "Instanz-ID, auf der diese Aufgabe ausgeführt werden soll. Leer lassen für alle Instanzen.",
        placeholder: "Leer lassen für alle Instanzen",
      },
    },
    response: {
      task: {
        title: "Erstellte Aufgabe",
      },
    },
    errors: {
      validation: {
        title: "Validierung fehlgeschlagen",
        description: "Die bereitgestellten Aufgabendaten sind ungültig",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie haben keine Berechtigung, Aufgaben zu erstellen",
      },
      internal: {
        title: "Interner Fehler",
        description: "Beim Erstellen der Aufgabe ist ein Fehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff auf diese Ressource ist verboten",
      },
      conflict: {
        title: "Konflikt",
        description: "Eine Aufgabe mit diesem Namen existiert bereits",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Ein Netzwerkfehler ist aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      unsaved: {
        title: "Nicht gespeicherte Änderungen",
        description: "Es gibt nicht gespeicherte Änderungen",
      },
    },
    success: {
      created: {
        title: "Aufgabe erstellt",
        description: "Die Aufgabe wurde erfolgreich erstellt",
      },
    },
  },
  widget: {
    title: "Cron-Aufgaben",
    loading: "Aufgaben werden geladen...",
    header: {
      stats: "Statistiken",
      graphs: "Graphen",
      history: "Verlauf",
      queue: "Warteschlange",
      refresh: "Aktualisieren",
      create: "Neue Aufgabe",
    },
    filter: {
      all: "Alle",
      running: "Laufend",
      completed: "Abgeschlossen",
      failed: "Fehlgeschlagen",
      pending: "Ausstehend",
      disabled: "Deaktiviert",
      allPriorities: "Alle Prioritäten",
      allCategories: "Alle Kategorien",
      visible: "Sichtbar",
      hiddenOnly: "Versteckt",
      allTasks: "Alle Aufgaben",
    },
    search: {
      placeholder: "Aufgaben suchen...",
    },
    sort: {
      nameAsc: "Name A-Z",
      nameDesc: "Name Z-A",
      schedule: "Zeitplan",
      lastRunNewest: "Letzter Lauf (neueste)",
      executionsMost: "Meiste Ausführungen",
    },
    task: {
      executions: "Ausführungen:",
      lastRun: "Letzter Lauf:",
      never: "Nie",
      nextRun: "Nächster Lauf:",
      notScheduled: "Nicht geplant",
      routeId: "Route-ID",
      hiddenBadge: "Versteckt",
      owner: {
        system: "System",
        user: "Benutzer",
      },
      outputMode: {
        storeOnly: "Nur speichern",
        notifyOnFailure: "Bei Fehler benachrichtigen",
        notifyAlways: "Immer benachrichtigen",
      },
    },
    action: {
      view: "Details anzeigen",
      history: "Verlauf anzeigen",
      edit: "Aufgabe bearbeiten",
      delete: "Aufgabe löschen",
      runNow: "Jetzt ausführen",
    },
    bulk: {
      selected: "{count} ausgewählt",
      selectAll: "Alle auswählen",
      clearSelection: "Auswahl aufheben",
      enable: "Aktivieren",
      disable: "Deaktivieren",
      runNow: "Jetzt ausführen",
      delete: "Löschen",
      confirmDeleteTitle: "Aufgaben löschen?",
      confirmDelete:
        "{count} Aufgabe(n) löschen? Dies kann nicht rückgängig gemacht werden.",
      cancel: "Abbrechen",
      success: "{succeeded} erfolgreich, {failed} fehlgeschlagen",
    },
    empty: {
      noTasks: "Keine Cron-Aufgaben",
      noTasksDesc: "Erstellen Sie Ihre erste Cron-Aufgabe",
      noMatches: "Keine Aufgaben entsprechen Ihren Filtern",
      noMatchesDesc:
        "Versuchen Sie, Ihre Suche oder Filterkriterien anzupassen",
      clearFilters: "Filter löschen",
    },
  },
};
