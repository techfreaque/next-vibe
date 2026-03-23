export const translations = {
  category: "System",
  tags: {
    vibeFrame: "Vibe Frame",
    embed: "Einbetten",
    widget: "Widget",
    config: "Konfiguration",
  },
  post: {
    title: "Vibe Frame Konfiguration",
    description:
      "Gibt Iframe-URLs für die angeforderten Integrationen zurück. Der Server liest echte Auth-Cookies und erstellt kurzlebige Exchange-Tokens.",
    container: {
      title: "Vibe Frame Konfiguration",
      description: "Iframe-URLs für eine oder mehrere Integrationen anfordern",
    },
    fields: {
      leadId: {
        label: "Lead-ID",
        description:
          "Besucher-Lead-ID von der Host-Seite (Cross-Origin - kann nicht aus Cookies gelesen werden)",
      },
      authToken: {
        label: "Auth-Token",
        description:
          "JWT-Auth-Token der Host-Seiten-Sitzung (für authentifizierte Widgets)",
      },
      integrations: {
        label: "Integrationen",
        description: "Liste der zu konfigurierenden Integrationen",
      },
      integration: {
        label: "Integration",
        description: "Einzelne Integrationskonfiguration",
      },
      id: {
        label: "Integrations-ID",
        description: "Eindeutige Kennung für diesen Integrationsslot",
        placeholder: "contact_POST",
      },
      endpoint: {
        label: "Endpunkt",
        description: "Endpunkt-Kennung (Standard: id)",
        placeholder: "contact_POST",
      },
      hasRendered: {
        label: "Bereits gerendert",
        description:
          "Wenn true, kann der Server diese Integration überspringen",
      },
      theme: {
        label: "Theme",
        description: "Farbthema für den Frame",
      },
      urlPathParams: {
        label: "URL-Pfadparameter",
        description: "JSON-kodierte URL-Pfadparameter",
        placeholder: '{"id":"123"}',
      },
      data: {
        label: "Daten",
        description: "JSON-kodierte Vorbelegungsdaten",
        placeholder: "{}",
      },
      widgets: {
        label: "Widgets",
        description: "Map von Integrations-ID zu Widget-Konfiguration",
      },
      widget: {
        label: "Widget",
        description: "Widget-Konfiguration für eine Integration",
      },
      frameId: {
        label: "Frame-ID",
        description: "Eindeutige Frame-ID für die Bridge-Kommunikation",
      },
      widgetUrl: {
        label: "Widget-URL",
        description: "Iframe-src-URL mit Exchange-Token",
      },
    },
    errors: {
      validation: {
        title: "Ungültige Parameter",
        description: "Die angegebenen Parameter sind ungültig",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Zugriff verboten",
        description: "Keine Berechtigung",
      },
      notFound: {
        title: "Endpunkt nicht gefunden",
        description: "Ein oder mehrere Endpunkte existieren nicht",
      },
      internal: {
        title: "Konfiguration fehlgeschlagen",
        description: "Fehler beim Erstellen der Konfigurationsantwort",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Ein Netzwerkfehler ist aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
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
      endpointNotFound: "Endpunkt nicht gefunden",
      configFailed: "Konfigurationsantwort konnte nicht erstellt werden",
      tokenMintFailed: "Exchange-Token konnte nicht erstellt werden",
    },
    success: {
      configured: {
        title: "Konfiguration bereit",
        description: "Iframe-URLs erfolgreich generiert",
      },
    },
  },
};
