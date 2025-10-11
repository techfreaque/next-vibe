import type { translations as enTranslations } from "../en";

/**
*

* Leads Stats subdomain translations for German
*/

export const translations: typeof enTranslations = {
  title: "Lead-Statistiken",
  description: "Umfassende Lead-Statistiken und Analysen mit historischen Daten",
  category: "Lead-Verwaltung",
  tags: {
    leads: "Leads",
    statistics: "Statistiken",
    analytics: "Analysen",
  },
  errors: {
    unauthorized: {
      title: "Nicht autorisierter Zugriff",
      description: "Authentifizierung erforderlich um Lead-Statistiken anzuzeigen",
    },
    validation: {
      title: "Validierungsfehler",
      description: "Ungültige Statistik-Anfrageparameter",
    },
    server: {
      title: "Serverfehler",
      description: "Interner Serverfehler beim Abrufen der Lead-Statistiken",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler beim Abrufen der Statistiken",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Netzwerkfehler beim Abrufen der Statistiken",
    },
    forbidden: {
      title: "Verboten",
      description: "Zugriff auf Lead-Statistiken verboten",
    },
    notFound: {
      title: "Keine Daten",
      description: "Keine statistischen Daten für die angegebenen Kriterien gefunden",
    },
    conflict: {
      title: "Konflikt",
      description: "Datenkonflikt beim Generieren der Statistiken",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Es gibt ungespeicherte Änderungen in den Statistikfiltern",
    },
  },
  success: {
    title: "Statistiken generiert",
    description: "Lead-Statistiken erfolgreich abgerufen",
  },
};
