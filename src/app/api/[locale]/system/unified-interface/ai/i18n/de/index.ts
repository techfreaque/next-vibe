import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  executeTool: {
    post: {
      title: "Tool ausführen",
      description:
        "Führt jeden registrierten Endpunkt nach Name aus. Übergeben Sie den Toolnamen und seine Eingabeparameter. Die Zielroute erzwingt ihre eigene Authentifizierung.",
      container: {
        title: "Tool-Ausführung",
        description: "Routenname und Eingabeparameter",
      },
      fields: {
        toolName: {
          label: "Tool-Name",
          description:
            "Der registrierte Tool-Name oder Alias (z.B. 'agent_chat_characters_GET'). Verwende system_help_GET zum Entdecken.",
          placeholder: "agent_chat_characters_GET",
        },
        input: {
          label: "Eingabe",
          description:
            "Eingabeparameter als JSON-Objekt. URL-Pfadparameter werden automatisch extrahiert.",
        },
      },
      response: {
        result:
          "Das von der Zielroute zurückgegebene Ergebnis. Bei Fehler ist dieses Feld nicht vorhanden — die Antwort selbst enthält den Fehler.",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "toolName oder Eingabeparameter sind ungültig",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff verweigert",
        },
        notFound: {
          title: "Tool nicht gefunden",
          description: "Kein registriertes Tool mit diesem Namen gefunden",
        },
        server: {
          title: "Ausführungsfehler",
          description: "Die Zielroute hat einen Serverfehler gemeldet",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler bei der Ausführung",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
      },
      success: {
        title: "Tool ausgeführt",
        description: "Das Tool wurde erfolgreich ausgeführt",
      },
    },
  },
  tools: {
    get: {
      title: "Tool-Hilfe — Verfügbare Tools entdecken",
      description:
        "Durchsuchen und entdecken Sie alle verfügbaren KI-Tools. Verwenden Sie query für die Suche, category für die Filterung.",
      category: "KI-Tools",
      tags: {
        tools: "tools",
      },
    },
  },
  executor: {
    errors: {
      toolNotFound: "Tool nicht gefunden: {{toolName}}",
      parameterValidationFailed:
        "Parametervalidierung fehlgeschlagen: {{errors}}",
      executionFailed: "Tool-Ausführung fehlgeschlagen",
    },
  },
  factory: {
    errors: {
      executionFailed: "Tool-Ausführung fehlgeschlagen",
    },
    descriptions: {
      noParametersRequired:
        "Keine erforderlichen Parameter für diesen Endpunkt",
    },
  },
  converter: {
    constants: {
      examplePrefix: "\n\nBeispiel: ",
      underscore: "_",
      dollarOne: "$1",
      dollarTwo: "$2",
      space: " ",
      endpointForPrefix: "Endpunkt für ",
      hiddenPlaceholder: "[verborgen]",
    },
  },
  discovery: {
    constants: {
      underscore: "_",
      dollarOne: "$1",
      dollarTwo: "$2",
    },
  },
  registry: {
    errors: {
      initializationFailed: "Tool-Registry-Initialisierung fehlgeschlagen",
    },
  },
};
