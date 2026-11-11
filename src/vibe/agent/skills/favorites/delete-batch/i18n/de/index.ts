import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    favorites: "Favoriten",
  },
  post: {
    title: "Favoriten entfernen",
    titleShort: "Entfernen",
    description: "Mehrere Favoriten auf einen Schlag entfernen",
    ids: {
      label: "Favoriten-IDs",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Bitte prüfe, was du entfernst, und versuche es erneut",
      },
      network: {
        title: "Verbindungsfehler",
        description:
          "Die Favoriten konnten nicht entfernt werden. Bitte versuche es erneut",
      },
      unauthorized: {
        title: "Anmeldung erforderlich",
        description: "Bitte melde dich an, um deine Favoriten zu entfernen",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Du hast keine Berechtigung, diese Favoriten zu entfernen",
      },
      notFound: {
        title: "Favoriten nicht gefunden",
        description: "Wir konnten die zu entfernenden Favoriten nicht finden",
      },
      server: {
        title: "Ein Fehler ist aufgetreten",
        description:
          "Die Favoriten konnten nicht entfernt werden. Bitte versuche es erneut",
      },
      unknown: {
        title: "Unerwarteter Fehler",
        description:
          "Etwas Unerwartetes ist passiert. Bitte versuche es erneut",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Deine Änderungen wurden noch nicht gespeichert",
      },
      conflict: {
        title: "Konflikt beim Entfernen",
        description:
          "Diese Favoriten haben sich geändert. Bitte lade die Seite neu und versuche es erneut",
      },
    },
    success: {
      title: "Favoriten entfernt",
      description: "Die ausgewählten Favoriten wurden entfernt",
    },
  },
};
