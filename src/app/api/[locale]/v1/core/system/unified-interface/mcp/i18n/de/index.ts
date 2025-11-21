import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tools: {
    category: "MCP-Tools",
    tags: {
      mcp: "MCP",
    },
    get: {
      title: "MCP-Tools auflisten",
      description:
        "Alle verfügbaren MCP-Tools für den aktuellen Benutzer abrufen",
      fields: {
        name: "Tool-Name",
        description: "Beschreibung",
        inputSchema: "Eingabeschema",
      },
      response: {
        title: "MCP-Tools-Liste",
        description: "Liste der verfügbaren MCP-Tools",
      },
      errors: {
        validation: {
          title: "Validierung fehlgeschlagen",
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
          description: "Sie haben keine Berechtigung für diese Ressource",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Ressource nicht gefunden",
        },
        server: {
          title: "Serverfehler",
          description: "Interner Serverfehler aufgetreten",
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
          description: "Ressourcenkonflikt erkannt",
        },
      },
      success: {
        title: "Erfolg",
        description: "Tools erfolgreich abgerufen",
      },
    },
  },
  execute: {
    category: "MCP ausführen",
    tags: {
      mcp: "MCP",
    },
    post: {
      title: "MCP-Tool ausführen",
      description: "Ein MCP-Tool nach Namen mit Argumenten ausführen",
      fields: {
        title: "Tool-Ausführungsparameter",
        description: "Parameter für die Tool-Ausführung",
        name: {
          title: "Tool-Name",
          description:
            "Name des auszuführenden Tools (z.B. core:system:db:ping)",
          placeholder: "core:system:db:ping",
        },
        arguments: {
          title: "Argumente",
          description: "Tool-Argumente als Schlüssel-Wert-Paare",
          placeholder: "{}",
        },
      },
      response: {
        title: "Tool-Ausführungsergebnis",
        description: "Ergebnis der Tool-Ausführung",
        result: {
          content: {
            type: "Inhaltstyp",
            text: "Inhalt"
          },
          isError: "Ist Fehler",
        },
      },
      errors: {
        validation: {
          title: "Validierung fehlgeschlagen",
          description: "Ungültiger Tool-Name oder Argumente",
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
          description: "Sie haben keine Berechtigung, dieses Tool auszuführen",
        },
        notFound: {
          title: "Tool nicht gefunden",
          description: "Das angegebene Tool existiert nicht",
        },
        server: {
          title: "Serverfehler",
          description: "Tool-Ausführung fehlgeschlagen",
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
          description: "Ressourcenkonflikt erkannt",
        },
      },
      success: {
        title: "Erfolg",
        description: "Tool erfolgreich ausgeführt",
      },
    },
  },
  registry: {
    toolNotFound: "Tool nicht gefunden",
    endpointNotFound: "Endpunkt nicht gefunden",
    permissionDenied: "Zugriff verweigert",
    toolExecutionFailed: "Tool-Ausführung fehlgeschlagen",
  },
};
