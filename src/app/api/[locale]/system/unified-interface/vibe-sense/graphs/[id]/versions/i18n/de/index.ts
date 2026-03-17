import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  get: {
    title: "Graph-Versionsverlauf",
    description:
      "Versionskette fuer einen Graphen abrufen (Vorfahren-Traversierung)",
    fields: {
      id: { label: "Graph-ID", description: "UUID des Graphen" },
      versions: {
        label: "Versionen",
        description:
          "Geordnete Liste der Vorfahren-Versionen (aelteste zuerst)",
        id: { label: "Versions-ID", description: "UUID der Version" },
        name: { label: "Name", description: "Graphname in dieser Version" },
        createdAt: {
          label: "Erstellt am",
          description: "Wann diese Version erstellt wurde",
        },
        isActive: {
          label: "Aktiv",
          description: "Ob dies die aktuell aktive Version ist",
        },
      },
    },
    success: {
      title: "Versionsverlauf geladen",
      description: "Versionskette erfolgreich abgerufen",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff auf diesen Graphen nicht moeglich",
      },
      server: {
        title: "Serverfehler",
        description: "Versionsverlauf konnte nicht geladen werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      validation: {
        title: "Validierung fehlgeschlagen",
        description: "Ungueltige Parameter",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Graph nicht gefunden",
      },
      conflict: { title: "Konflikt", description: "Ressourcenkonflikt" },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkanfrage fehlgeschlagen",
      },
      unsavedChanges: {
        title: "Ungespeicherte Aenderungen",
        description: "Aenderungen zuerst speichern",
      },
    },
  },
};
