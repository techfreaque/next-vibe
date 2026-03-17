import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Konto",
  tags: {
    remoteConnection: "Fernverbindung",
  },
  patch: {
    title: "Verbindung umbenennen",
    description: "Anzeigenamen der Fernverbindung aktualisieren",
    instanceId: {
      label: "Instanz-ID",
      description: "Die umzubenennende Instanz",
      placeholder: "hermes",
    },
    friendlyName: {
      label: "Anzeigename",
      description: "Ein lesbarer Name für diese Verbindung",
      placeholder: "Mein Laptop",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Du musst angemeldet sein, um umzubenennen",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Du hast keine Berechtigung zum Umbenennen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Verbindung nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Fehler beim Umbenennen",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Du hast ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
    },
    success: {
      title: "Umbenannt",
      description: "Verbindung erfolgreich umbenannt",
    },
  },
};
