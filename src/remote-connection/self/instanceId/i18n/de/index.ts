import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Konto",
  tags: {
    remoteConnection: "Fernverbindung",
  },
  get: {
    title: "ID dieser Instanz",
    titleShort: "Instanz-ID",
    description: "Den Bezeichner deiner eigenen Instanz auf diesem Gerät lesen",
    instanceId: {
      label: "Instanz-ID",
      description: "Der Bezeichner dieser Instanz",
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
        description: "Du musst angemeldet sein, um die Instanz-ID zu lesen",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Du hast keine Berechtigung, die Instanz-ID zu lesen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Instanzidentität nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Fehler beim Lesen der Instanz-ID",
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
      title: "Instanz-ID",
      description: "ID dieser Instanz ermittelt",
    },
  },
};
