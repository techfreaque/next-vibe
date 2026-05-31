import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Konto",
  tags: {
    remoteConnection: "Fernverbindung",
  },
  delete: {
    title: "Trennen",
    description: "Von deiner Remote-Instanz trennen",
    instanceId: {
      label: "Instanz-ID",
      description: "Die zu trennende Instanz",
      placeholder: "hermes",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrage",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Du musst angemeldet sein, um zu trennen",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Du hast keine Berechtigung zum Trennen",
      },
      notFound: {
        title: "Nicht verbunden",
        description: "Keine Fernverbindung zum Trennen",
      },
      server: {
        title: "Serverfehler",
        description: "Fehler beim Trennen",
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
      title: "Getrennt",
      description: "Deine Fernverbindung wurde entfernt",
    },
  },
};
