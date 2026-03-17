import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "API Endpunkt",
  tags: {
    tasks: "Tasks",
    cron: "Cron",
    bulk: "Stapel",
  },
  post: {
    title: "Massenaufgabenaktion",
    description:
      "Führe eine Massenaktion (löschen, aktivieren, deaktivieren, ausführen) auf mehreren Cron-Aufgaben durch",
    fields: {
      ids: {
        label: "Aufgaben-IDs",
        description:
          "Liste der Aufgaben-IDs, auf die die Aktion angewendet wird",
      },
      action: {
        label: "Aktion",
        description:
          "Die Aktion, die auf die ausgewählten Aufgaben angewendet wird",
        options: {
          delete: "Löschen",
          enable: "Aktivieren",
          disable: "Deaktivieren",
          run: "Jetzt ausführen",
        },
      },
      succeeded: {
        label: "Erfolgreich",
        description: "Anzahl der erfolgreich verarbeiteten Aufgaben",
      },
      failed: {
        label: "Fehlgeschlagen",
        description: "Anzahl der fehlgeschlagenen Aufgaben",
      },
      errors: {
        label: "Fehler",
        description: "Liste der aufgabenspezifischen Fehler",
      },
    },
    errors: {
      fetchFailed:
        "Aufgaben-IDs für Massenaktion konnten nicht abgerufen werden",
      validation: {
        title: "Validierung fehlgeschlagen",
        description: "Die bereitgestellten Massenaktionsdaten sind ungültig",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie haben keine Berechtigung, Massenaktionen durchzuführen",
      },
      internal: {
        title: "Interner Fehler",
        description:
          "Beim Durchführen der Massenaktion ist ein Fehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff auf diese Ressource ist verboten",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Ein Konflikt ist bei der Verarbeitung der Massenaktion aufgetreten",
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
        description: "Eine oder mehrere Aufgaben wurden nicht gefunden",
      },
      unsaved: {
        title: "Nicht gespeicherte Änderungen",
        description: "Es gibt nicht gespeicherte Änderungen",
      },
    },
    success: {
      completed: {
        title: "Massenaktion abgeschlossen",
        description:
          "Die Massenaktion wurde auf die ausgewählten Aufgaben angewendet",
      },
    },
  },
};
