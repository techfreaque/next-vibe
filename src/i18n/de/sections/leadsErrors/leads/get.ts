import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/leadsErrors/leads/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Lead-Datenvalidierung fehlgeschlagen",
      description: "Lead-Datenanfrage konnte nicht validiert werden",
    },
    unauthorized: {
      title: "Lead-Datenzugriff verweigert",
      description:
        "Sie haben keine Berechtigung für den Zugriff auf Lead-Daten",
    },
    server: {
      title: "Lead-Daten Serverfehler",
      description:
        "Lead-Daten konnten aufgrund eines Serverfehlers nicht geladen werden",
    },
    unknown: {
      title: "Lead-Datenzugriff fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler beim Laden der Lead-Daten ist aufgetreten",
    },
    not_found: {
      title: "Lead nicht gefunden",
      description: "Der angeforderte Lead konnte nicht gefunden werden",
    },
    forbidden: {
      title: "Lead-Zugriff verboten",
      description: "Sie haben keine Berechtigung, diesen Lead anzuzeigen",
    },
    network: {
      title: "Netzwerkfehler",
      description:
        "Lead-Daten konnten aufgrund eines Netzwerkfehlers nicht geladen werden",
    },
    unsaved_changes: {
      title: "Nicht gespeicherte Änderungen",
      description:
        "Sie haben nicht gespeicherte Änderungen, die verloren gehen werden",
    },
    conflict: {
      title: "Datenkonflikt",
      description: "Die Lead-Daten wurden von einem anderen Benutzer geändert",
    },
  },
  success: {
    title: "Lead-Daten geladen",
    description: "Lead-Informationen erfolgreich abgerufen",
  },
};
