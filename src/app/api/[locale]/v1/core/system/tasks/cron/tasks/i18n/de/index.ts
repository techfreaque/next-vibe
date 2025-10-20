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
  post: {
    title: "Cron-Aufgabe erstellen",
    description: "Neue Cron-Aufgabe erstellen",
    container: {
      title: "Aufgabe erstellen",
      description: "Neue Cron-Aufgabe konfigurieren",
    },
    fields: {
      name: {
        label: "Aufgabenname",
        description: "Eindeutiger Name für die Aufgabe",
        placeholder: "Aufgabennamen eingeben...",
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
};
