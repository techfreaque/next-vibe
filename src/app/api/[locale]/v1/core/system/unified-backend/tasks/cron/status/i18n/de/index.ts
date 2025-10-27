import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Cron-System Status",
  description: "Cron-Systemstatus und Aufgabeninformationen abrufen",
  category: "API Endpunkt",
  tags: {
    status: "Status",
  },
  common: {
    taskName: "Aufgabenname",
    taskNamesDescription: "Namen der zu filternden Aufgaben",
    detailed: "Detailliert",
    detailedDescription: "Detaillierte Informationen einbeziehen",
    active: "Aktiv",
    total: "Gesamt",
    uptime: "Betriebszeit",
    id: "ID",
    status: "Status",
    lastRun: "Letzter Lauf",
    nextRun: "Nächster Lauf",
    schedule: "Zeitplan",
  },
  success: {
    title: "Erfolg",
    content: "Erfolg",
  },
  errors: {
    validation: {
      title: "Validierung Fehlgeschlagen",
      description: "Ungültige Anfrageparameter",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Netzwerkverbindung fehlgeschlagen",
    },
    unauthorized: {
      title: "Nicht Autorisiert",
      description: "Authentifizierung erforderlich",
    },
    forbidden: {
      title: "Verboten",
      description: "Zugriff verboten",
    },
    notFound: {
      title: "Nicht Gefunden",
      description: "Cron-Job nicht gefunden",
    },
    server: {
      title: "Serverfehler",
      description: "Beim Abrufen des Cron-Status ist ein Fehler aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht Gespeicherte Änderungen",
      description: "Sie haben nicht gespeicherte Änderungen",
    },
    conflict: {
      title: "Konflikt",
      description: "Ein Konflikt ist aufgetreten",
    },
  },
};
