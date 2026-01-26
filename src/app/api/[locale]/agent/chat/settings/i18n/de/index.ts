import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Chat-Einstellungen abrufen",
    description: "Benutzereinstellungen und Präferenzen abrufen",
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
        title: "Nicht autorisiert",
        description:
          "Sie müssen angemeldet sein, um auf Einstellungen zuzugreifen",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung für diese Ressource",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Einstellungen nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Fehler beim Abrufen der Einstellungen",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt mit dem aktuellen Zustand ist aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Einstellungen erfolgreich abgerufen",
    },
  },
  post: {
    title: "Chat-Einstellungen aktualisieren",
    description: "Benutzereinstellungen und Präferenzen aktualisieren",
    container: {
      title: "Chat-Einstellungen",
    },
    selectedModel: {
      label: "Ausgewähltes Modell",
    },
    selectedCharacter: {
      label: "Ausgewählter Charakter",
    },
    activeFavoriteId: {
      label: "Aktiver Favorit",
    },
    ttsAutoplay: {
      label: "TTS Autoplay",
    },
    ttsVoice: {
      label: "TTS Stimme",
    },
    viewMode: {
      label: "Ansichtsmodus",
    },
    enabledTools: {
      label: "Aktivierte Tools",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Einstellungen",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Einstellungen konnten nicht gespeichert werden",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie müssen angemeldet sein, um Einstellungen zu aktualisieren",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, Einstellungen zu aktualisieren",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Einstellungen nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Einstellungen konnten nicht gespeichert werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Einstellungskonflikt aufgetreten",
      },
    },
    success: {
      title: "Einstellungen gespeichert",
      description: "Ihre Einstellungen wurden erfolgreich gespeichert",
    },
  },
};
