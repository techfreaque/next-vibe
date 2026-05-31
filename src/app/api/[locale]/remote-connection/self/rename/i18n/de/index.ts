import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Konto",
  tags: {
    remoteConnection: "Fernverbindung",
  },
  patch: {
    title: "Diese Instanz umbenennen",
    description: "Anzeigenamen dieser Instanz aktualisieren",
    newInstanceId: {
      label: "Neue Instanz-ID",
      description: "Der neue Bezeichner für diese Instanz",
      placeholder: "hermes",
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
        description: "Instanzidentität nicht gefunden",
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
      description: "Instanz erfolgreich umbenannt",
    },
  },
};
