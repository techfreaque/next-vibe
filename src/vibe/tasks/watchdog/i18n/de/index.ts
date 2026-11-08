import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Task-Wächter",
  tags: {
    taskWatchdog: "task-waechter",
    vibeSense: "vibe-sense",
    budget: "budget",
  },
  enums: {
    incidentType: {
      all: "Alle Vorfälle",
      timeout: "Zeitüberschreitung",
      loop: "Endlosschleife",
      budget: "Budget",
      transientRetryExhausted: "Wiederholungen erschöpft",
      watchdogCancel: "Wächter-Abbruch",
    },
    budgetScope: {
      task: "Pro Task-Lauf",
      day: "Pro Tag (alle Tasks)",
      goal: "Pro Ziel und Tag",
    },
    spendKind: {
      model: "Modell-Runde",
      tool: "Tool-Aufruf",
    },
    healthMetric: {
      started: "Gestartete Tasks",
      completed: "Abgeschlossene Tasks",
      failed: "Fehlgeschlagene Tasks",
      watchdogCancelled: "Vom Wächter abgebrochene Tasks",
      avgDuration: "Durchschnittsdauer (Sekunden)",
      p95Duration: "95. Perzentil der Dauer (Sekunden)",
      creditSpend: "Von Tasks verbrauchte Credits",
      incidents: "Vorfälle",
    },
  },
  sweep: {
    post: {
      title: "Task-Wächter Durchlauf",
      titleShort: "Wächter-Durchlauf",
      description:
        "Findet hängende, kreisende und verwaiste Hintergrund-Tasks, stoppt sie mit protokolliertem Grund und eröffnet einen Vorfall. Läuft jede Minute.",
      container: {
        title: "Ergebnis des Durchlaufs",
        description: "Was der Wächter gefunden und getan hat",
      },
      response: {
        checked: "Geprüfte laufende Tasks",
        cancelled: "Abgebrochen (Limit überschritten)",
        orphaned: "Verwaiste Läufe geborgen",
        loops: "Endlos-Tasks deaktiviert",
        incidents: "Eröffnete Vorfälle",
      },
    },
    task: {
      description:
        "Stoppt Tasks, die zu lange laufen, kreisen oder ihren Prozess verloren haben. Jeder Stopp eröffnet einen Vorfall.",
    },
  },
  health: {
    get: {
      title: "Task-Gesundheit",
      titleShort: "Task-Gesundheit",
      description:
        "Laufende Tasks mit Alter, Runden und Verbrauch, jüngste Fehlschläge und offene Vorfälle. Tasks lassen sich hier abbrechen.",
      response: {
        running: "Laufende Tasks",
        failures: "Jüngste Fehlschläge",
        incidents: "Offene Vorfälle",
        daySpent: "Heute verbrauchte Credits",
        dayCap: "Tageslimit",
      },
      widget: {
        title: "Task-Gesundheit",
        subtitle: "Jeder Lauf wird überwacht. Hängende werden gestoppt.",
        refresh: "Aktualisieren",
        loading: "Task-Gesundheit wird geladen…",
        spendToday:
          "{{spent}} von {{cap}} Credits heute durch Tasks verbraucht",
        running: {
          title: "Läuft gerade",
          empty: "Nichts läuft.",
        },
        failures: {
          title: "Jüngste Fehlschläge",
          empty: "Keine Fehlschläge in den letzten 24 Stunden.",
        },
        incidents: {
          title: "Offene Vorfälle",
          empty: "Keine offenen Vorfälle.",
        },
        age: "Alter",
        turns: "Runden",
        toolCalls: "Tool-Aufrufe",
        spend: "Verbraucht",
        goal: "Ziel {{goal}}",
        limit: "Limit {{limit}}",
        lastError: "Letzter Fehler",
        noError: "Kein Fehler protokolliert",
        cancel: "Abbrechen",
        cancelling: "Wird abgebrochen…",
        resolve: "Erledigt",
        credits: "{{amount}} Cr",
      },
    },
  },
  cancel: {
    post: {
      title: "Task abbrechen",
      titleShort: "Task abbrechen",
      description:
        "Stoppt einen laufenden Task samt KI-Schleife und protokolliert den Abbruch, oder markiert einen Vorfall als erledigt.",
      fields: {
        taskId: {
          label: "Task-ID",
          description: "Der laufende Task, der gestoppt wird",
          placeholder: "Task-ID",
        },
        incidentId: {
          label: "Vorfall-ID",
          description: "Der Vorfall, der als erledigt gilt",
        },
      },
      response: {
        cancelled: "Task abgebrochen",
        resolved: "Vorfall erledigt",
      },
    },
  },
  budgetCaps: {
    get: {
      title: "Task-Budgetgrenzen",
      titleShort: "Budgetgrenzen",
      description:
        "Credit-Grenzen, die Hintergrund-Tasks stoppen: pro Task-Lauf, pro Tag und pro Ziel.",
      response: {
        rows: "Grenzen",
        daySpent: "Heute verbrauchte Credits",
      },
      widget: {
        title: "Task-Budgetgrenzen",
        subtitle:
          "Ein Task, der eine Grenze erreicht, stoppt sauber. Das Tageslimit ist die harte Obergrenze für alle unbeaufsichtigten Läufe.",
        refresh: "Aktualisieren",
        add: "Grenze setzen",
        loading: "Grenzen werden geladen…",
        empty: {
          title: "Keine Grenzen gesetzt",
          hint: "Standardwerte gelten: 100 Credits pro Task-Lauf, 1000 pro Tag, 500 pro Ziel.",
          cta: "Erste Grenze setzen",
        },
        spentToday: "{{spent}} Credits heute verbraucht",
        enabled: "Aktiv",
        disabled: "Aus",
        credits: "{{amount}} Credits",
        none: "keine",
      },
    },
    post: {
      title: "Task-Budgetgrenze setzen",
      titleShort: "Grenze setzen",
      description:
        "Credit-Grenze anlegen oder ändern. Eine Grenze pro Bereich und Schlüssel. Der Task-Schlüssel * ist der Standard für jeden Task.",
      fields: {
        scope: {
          label: "Bereich",
          description: "Was die Grenze begrenzt",
        },
        key: {
          label: "Schlüssel",
          description:
            "Task: Task-ID oder *. Tag: global. Ziel: Zielname oder * (Tag goal:<name> am Task)",
          placeholder: "*",
        },
        maxCredits: {
          label: "Max. Credits",
          description:
            "Verbrauch ab diesem Wert stoppt den Task. 0 blockiert ihn.",
        },
        enabled: {
          label: "Aktiv",
          description: "Aus behält die Zeile, ignoriert sie aber",
        },
        note: {
          label: "Notiz",
          description: "Warum es diese Grenze gibt",
          placeholder: "Nächtliche Recherche-Agenten",
        },
      },
      response: {
        id: "Grenzen-ID",
      },
      widget: {
        back: "Zurück",
        hint: "Eine Grenze stoppt den Task, sobald der Verbrauch sie erreicht. Das Tageslimit gilt immer.",
      },
    },
  },
  dataSources: {
    fields: {
      resolution: { label: "Auflösung", description: "Bucket-Größe" },
      range: { label: "Zeitraum", description: "Abzufragender Zeitraum" },
      lookback: {
        label: "Rückblick",
        description: "Zusätzliche Balken vor Zeitraumbeginn",
      },
      meta: { label: "Meta", description: "Ausführungs-Metadaten des Knotens" },
      metric: {
        label: "Messgröße",
        description:
          "Gestartete, abgeschlossene, fehlgeschlagene, vom Wächter abgebrochene Tasks, Dauer, Credit-Verbrauch oder Vorfälle",
      },
      incidentType: {
        label: "Vorfallstyp",
        description: "Nur für die Messgröße Vorfälle. Standard: alle Typen",
      },
    },
    taskHealth: {
      post: {
        title: "Task-Gesundheit",
        titleShort: "Task-Gesundheit",
        description:
          "Task-Läufe, Dauer, Credit-Verbrauch und Wächter-Vorfälle pro Bucket",
        fields: {
          result: { label: "Wert", description: "Messwert pro Bucket" },
        },
      },
    },
  },
  errors: {
    validation: {
      title: "Ungültige Eingabe",
      description: "Markierte Felder prüfen",
    },
    unauthorized: {
      title: "Nicht angemeldet",
      description: "Als Admin anmelden",
    },
    forbidden: {
      title: "Nur für Admins",
      description: "Die Task-Wächter-Werkzeuge brauchen die Admin-Rolle",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Dieser Task oder Vorfall existiert nicht",
    },
    conflict: {
      title: "Konflikt",
      description: "Der Eintrag hat sich geändert, neu laden und wiederholen",
    },
    server: {
      title: "Serverfehler",
      description: "Die Anfrage konnte nicht abgeschlossen werden",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Die Anfrage hat den Server nicht erreicht",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Etwas Unerwartetes ist fehlgeschlagen",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Erst speichern oder verwerfen",
    },
    nothingToDo: "Task-ID zum Abbrechen oder Vorfall-ID zum Erledigen angeben",
    taskNotRunning: "Task {{taskId}} läuft nicht",
    incidentNotFound: "Vorfall {{incidentId}} existiert nicht",
    invalidCap: "Eine Grenze braucht einen Betrag ab 0 und einen Schlüssel",
  },
  success: {
    title: "Erledigt",
    description: "Gespeichert",
  },
};
