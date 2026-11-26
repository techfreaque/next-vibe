import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    validation: {
      title: "Ungültige Anfrage",
      description: "Prüfen Sie die Anfrage.",
    },
    unauthorized: {
      title: "Anmeldung nötig",
      description:
        "Melden Sie sich an, um die Publikationsübersicht zu öffnen.",
    },
    forbidden: {
      title: "Nur für Admins",
      description:
        "Für die Publikationsübersicht ist die Administratorrolle erforderlich.",
    },
    notFound: {
      title: "Keine Daten",
      description: "Für diese Instanz liegen keine Veröffentlichungsdaten vor.",
    },
    server: {
      title: "Publikationsübersicht",
      description: "Die Publikationsübersicht konnte nicht geladen werden.",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Server nicht erreichbar",
    },
    unknown: {
      title: "Publikationsübersicht",
      description: "Die Publikationsübersicht konnte nicht geladen werden.",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Du hast ungespeicherte Änderungen",
    },
    conflict: {
      title: "Konflikt",
      description: "Die Anfrage widerspricht den aktuellen Daten",
    },
  },
  title: "Publikationsübersicht",
  description: "Öffentliches Forum und gespeicherte IndexNow-Meldungen.",
  threads: "Öffentliche Diskussionen",
  savedUrls: "Gespeicherte IndexNow-URLs",
  snapshotOn: "Stand vom {{date}} (UTC)",
  newestThread: "Neueste öffentliche Diskussion",
  indexingSnapshot: "IndexNow-Stand",
  newestOn: "Neueste öffentliche Diskussion vom {{date}}.",
  noThreads: "Es gibt noch keine öffentlichen Diskussionen.",
  indexingSavedOn:
    "IndexNow-Stand zuletzt am {{date}} gespeichert. Den Indexierungsstatus melden die Suchmaschinen separat.",
  noIndexingSnapshot:
    "Für diese Instanz sind keine IndexNow-Meldungen gespeichert.",
  noIndexingRecordsYet: "Noch keine Einträge",
  loading: "Publikationsübersicht wird geladen …",
};
