import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  delete: {
    title: "Graph löschen",
    titleShort: "Graph löschen",
    description: "Graph endgültig löschen. Unwiderruflich.",
    fields: {
      id: {
        label: "Graph-ID",
        description: "UUID des zu löschenden Graphen",
      },
    },
    response: {
      deletedId: "Gelöschte Graph-ID",
    },
    widget: {
      confirmDescription:
        "Endgültig. Graph und Konfiguration werden gelöscht — kein Zurück. Nur möglich, wenn der Graph keine Daten enthält; andernfalls archiviere ihn.",
      deletedIdLabel: "Gelöschte ID:",
      backToList: "Zurück zu den Graphen",
    },
    success: {
      title: "Graph gelöscht",
      description: "Der Graph wurde endgültig entfernt",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Diesen Graph darfst du nicht löschen",
      },
      server: {
        title: "Serverfehler",
        description: "Graph konnte nicht gelöscht werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      validation: {
        title: "Validierung fehlgeschlagen",
        description: "Ungültige Parameter",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Graph nicht gefunden",
      },
      conflict: {
        title: "Enthält Daten",
        description:
          "Graph enthält Datenpunkte — archiviere ihn statt zu löschen",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkanfrage fehlgeschlagen",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Zuerst Änderungen speichern",
      },
    },
  },
};
