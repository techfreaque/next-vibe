export const translations = {
  category: "System",
  tags: {
    vibeFrame: "Vibe Frame",
    embed: "Einbetten",
    widget: "Widget",
    iframe: "Iframe",
  },
  get: {
    title: "Vibe Frame einbinden",
    description:
      "Einen next-vibe Endpunkt in einem isolierten Iframe einbinden, um ihn auf einer beliebigen Website oder nativen WebView einzubetten",
    container: {
      title: "Vibe Frame Einbindung",
      description: "Endpunkt-Frame konfigurieren und einbinden",
    },
    fields: {
      endpoint: {
        label: "Endpunkt",
        description:
          "Endpunkt-Kennung (z.B. contact_POST, agent_chat_threads_GET)",
        placeholder: "Endpunkt-Kennung eingeben...",
      },
      frameId: {
        label: "Frame-ID",
        description: "Eindeutige Frame-Kennung für die Bridge-Kommunikation",
        placeholder: "Automatisch generiert",
      },
      urlPathParams: {
        label: "URL-Pfadparameter",
        description: "JSON-kodierte URL-Pfadparameter",
        placeholder: '{"id": "123"}',
      },
      data: {
        label: "Daten",
        description: "JSON-kodierte Vorbelegungsdaten für das Formular",
        placeholder: "{}",
      },
      theme: {
        label: "Theme",
        description: "Farbthema für den eingebundenen Frame",
      },
      authToken: {
        label: "Auth-Token",
        description: "Authentifizierungstoken für Cross-Origin-Einbettung",
        placeholder: "Bearer-Token...",
      },
    },
    response: {
      html: {
        title: "Gerendertes HTML",
        description: "Das vollständige HTML-Dokument für den Iframe",
      },
    },
    errors: {
      validation: {
        title: "Ungültige Mount-Parameter",
        description: "Die angegebenen Mount-Parameter sind ungültig",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung für diesen Endpunkt erforderlich",
      },
      forbidden: {
        title: "Zugriff verboten",
        description:
          "Sie haben keine Berechtigung, diesen Endpunkt einzubinden",
      },
      notFound: {
        title: "Endpunkt nicht gefunden",
        description: "Der angegebene Endpunkt existiert nicht",
      },
      internal: {
        title: "Einbindung fehlgeschlagen",
        description:
          "Beim Rendern des Endpunkt-Frames ist ein Fehler aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Ein Netzwerkfehler ist aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Beim Einbinden des Frames ist ein unbekannter Fehler aufgetreten",
      },
      unsaved: {
        title: "Nicht gespeicherte Änderungen",
        description: "Es gibt nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
    },
    repository: {
      invalidUrlPathParams: "Ungültiges Format der URL-Pfadparameter",
      invalidData: "Ungültiges Datenformat",
      endpointNotFound: "Der angeforderte Endpunkt wurde nicht gefunden",
      mountFailed: "Einbindung des Vibe-Frame-Endpunkts fehlgeschlagen",
    },
    success: {
      mounted: {
        title: "Frame eingebunden",
        description: "Der Endpunkt wurde erfolgreich eingebunden",
      },
    },
  },
};
