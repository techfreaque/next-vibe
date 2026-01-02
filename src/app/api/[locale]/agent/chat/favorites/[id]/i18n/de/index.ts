import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Favorit abrufen",
    description: "Spezifische Favoriten-Konfiguration abrufen",
    container: {
      title: "Favoriten-Details",
    },
    id: {
      label: "Favoriten-ID",
    },
    response: {
      characterId: {
        content: "Charakter: {{value}}",
      },
      customName: {
        content: "Benutzerdefinierter Name: {{value}}",
      },
      voice: {
        content: "Stimme: {{value}}",
      },
      mode: {
        content: "Modus: {{value}}",
      },
      intelligence: {
        content: "Intelligenz: {{value}}",
      },
      maxPrice: {
        content: "Maximaler Preis: {{value}}",
      },
      content: {
        content: "Inhaltsstufe: {{value}}",
      },
      manualModelId: {
        content: "Manuelles Modell: {{value}}",
      },
      position: {
        content: "Position: {{value}}",
      },
      color: {
        content: "Farbe: {{value}}",
      },
      isActive: {
        content: "Aktiv: {{value}}",
      },
      useCount: {
        content: "Verwendungen: {{value}}",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Favoriten-ID",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server nicht möglich",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein, um diesen Favoriten anzuzeigen",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, diesen Favoriten anzuzeigen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Favorit nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Favorit konnte nicht geladen werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen, die verloren gehen",
      },
      conflict: {
        title: "Konflikt",
        description: "Bei der Verarbeitung Ihrer Anfrage ist ein Konflikt aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Favorit erfolgreich geladen",
    },
  },
  patch: {
    title: "Favorit aktualisieren",
    description: "Bestehende Favoriten-Konfiguration aktualisieren",
    container: {
      title: "Favorit bearbeiten",
    },
    id: {
      label: "Favoriten-ID",
    },
    characterId: {
      label: "Charakter",
    },
    customName: {
      label: "Benutzerdefinierter Name",
    },
    voice: {
      label: "Stimme",
      description: "Text-to-Speech-Stimmpräferenz",
    },
    mode: {
      label: "Auswahlmodus",
    },
    intelligence: {
      label: "Intelligenzstufe",
    },
    maxPrice: {
      label: "Maximaler Preis",
    },
    content: {
      label: "Inhaltsstufe",
    },
    manualModelId: {
      label: "Manuelles Modell",
    },
    isActive: {
      label: "Aktiv",
    },
    position: {
      label: "Position",
    },
    response: {
      success: {
        content: "Aktualisiert: {{value}}",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server nicht möglich",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein, um diesen Favoriten zu aktualisieren",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, diesen Favoriten zu aktualisieren",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Favorit nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Favorit konnte nicht aktualisiert werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen, die verloren gehen",
      },
      conflict: {
        title: "Konflikt",
        description: "Beim Aktualisieren des Favoriten ist ein Konflikt aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Favorit erfolgreich aktualisiert",
    },
  },
  delete: {
    title: "Favorit löschen",
    description: "Favoriten-Konfiguration entfernen",
    container: {
      title: "Favorit löschen",
    },
    id: {
      label: "Favoriten-ID",
    },
    response: {
      success: {
        content: "Gelöscht: {{value}}",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Favoriten-ID",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server nicht möglich",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein, um diesen Favoriten zu löschen",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, diesen Favoriten zu löschen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Favorit nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Favorit konnte nicht gelöscht werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen, die verloren gehen",
      },
      conflict: {
        title: "Konflikt",
        description: "Favorit kann aufgrund eines Konflikts nicht gelöscht werden",
      },
    },
    success: {
      title: "Erfolg",
      description: "Favorit erfolgreich gelöscht",
    },
  },
};
