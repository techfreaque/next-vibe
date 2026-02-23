import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    favorites: "Favoriten",
  },
  post: {
    title: "Favoriten neu anordnen",
    description: "Reihenfolge Ihrer Favoriten-Konfigurationen aktualisieren",
    positions: {
      label: "Positionen",
    },
    errors: {
      validation: {
        title: "Ungültige Reihenfolge",
        description:
          "Bitte überprüfen Sie Ihre Einstellungen und versuchen Sie es erneut",
      },
      network: {
        title: "Verbindungsfehler",
        description:
          "Die neue Reihenfolge konnte nicht gespeichert werden. Bitte versuchen Sie es erneut",
      },
      unauthorized: {
        title: "Anmeldung erforderlich",
        description:
          "Bitte melden Sie sich an, um Ihre Favoriten neu anzuordnen",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Sie haben keine Berechtigung, Favoriten neu anzuordnen",
      },
      notFound: {
        title: "Favoriten nicht gefunden",
        description: "Wir konnten Ihre Favoriten nicht finden",
      },
      server: {
        title: "Ein Fehler ist aufgetreten",
        description:
          "Die neue Reihenfolge konnte nicht gespeichert werden. Bitte versuchen Sie es erneut",
      },
      unknown: {
        title: "Unerwarteter Fehler",
        description:
          "Etwas Unerwartetes ist passiert. Bitte versuchen Sie es erneut",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Ihre Änderungen wurden noch nicht gespeichert",
      },
      conflict: {
        title: "Reihenfolgen-Konflikt",
        description:
          "Die Reihenfolge hat sich geändert. Bitte aktualisieren Sie die Seite und versuchen Sie es erneut",
      },
    },
    success: {
      title: "Reihenfolge gespeichert",
      description: "Ihre Favoriten wurden erfolgreich neu angeordnet",
    },
  },
};
