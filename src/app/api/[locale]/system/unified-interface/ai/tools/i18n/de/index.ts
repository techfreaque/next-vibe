import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Verfügbare KI-Tools abrufen",
    description: "Liste der für den aktuellen Benutzer verfügbaren KI-Tools abrufen",
    response: {
      title: "KI-Tools Antwort",
      description: "Liste der verfügbaren KI-Tools",
    },
    fields: {
      tools: {
        title: "Verfügbare Tools",
      },
    },
    success: {
      title: "Tools erfolgreich abgerufen",
      description: "Verfügbare KI-Tools abgerufen",
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
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung für AI-Tools",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "AI-Tools-Endpunkt nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Tools konnten nicht abgerufen werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist beim Abrufen der AI-Tools aufgetreten",
      },
    },
  },
  category: "KI-Tools",
  tags: {
    tools: "tools",
  },
};
