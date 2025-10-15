import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "API Endpunkt",
  tags: {
    tasks: "Tasks",
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
        label: "Aktiviert",
        description: "Nach Aktivierungsstatus filtern",
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
        priority: "Priorität",
        status: "Status",
        category: "Kategorie",
        lastRun: "Letzter Lauf",
        nextRun: "Nächster Lauf",
        version: "Version",
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
};
