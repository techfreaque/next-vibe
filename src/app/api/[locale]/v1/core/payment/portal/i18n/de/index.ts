import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  success: {
    created: "Kundenportal-Sitzung erfolgreich erstellt",
  },
  post: {
    title: "Titel",
    description: "Endpunkt-Beschreibung",
    form: {
      title: "Portal-Konfiguration",
      description: "Parameter für das Kundenportal konfigurieren",
    },
    returnUrl: {
      label: "Rücksprung-URL",
      description: "URL für die Weiterleitung nach der Portal-Sitzung",
      placeholder: "https://example.com/dashboard",
    },
    response: {
      success: "Portal-Sitzung erfolgreich erstellt",
      message: "Statusmeldung",
      customerPortalUrl: "Kundenportal-URL",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Erfolg",
      description: "Vorgang erfolgreich abgeschlossen",
    },
  },
};
