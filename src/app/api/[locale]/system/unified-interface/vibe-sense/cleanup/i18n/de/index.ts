import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  cleanup: {
    name: "Vibe Sense Bereinigung",
    description: "Löscht alte Datenpunkte und läuft Snapshot-Cache ab",
  },
  post: {
    title: "Vibe Sense Bereinigung",
    description:
      "Aufbewahrungsbereinigung für Datenpunkte und Snapshot-Ablauf durchführen",
    response: {
      nodesProcessed: "Verarbeitete Knoten",
      totalDeleted: "Gelöschte Zeilen",
      snapshotsDeleted: "Gelöschte Snapshots",
      graphsChecked: "Geprüfte Graphen",
      graphsExecuted: "Ausgeführte Graphen",
    },
    success: {
      title: "Bereinigung abgeschlossen",
      description: "Aufbewahrungsbereinigung abgeschlossen",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Administratorzugang erforderlich",
      },
      server: {
        title: "Serverfehler",
        description: "Bereinigung fehlgeschlagen",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrage",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Nicht gefunden",
      },
      conflict: { title: "Konflikt", description: "Konflikt" },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkanfrage fehlgeschlagen",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Änderungen zuerst speichern",
      },
    },
  },
};
