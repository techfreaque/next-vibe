import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  executeTool: {
    post: {
      title: "Tool ausführen",
      titleShort: "Tool ausführen",
      dynamicTitle: "Execute: {{toolName}}",
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
        instanceId: {
          label: "Instanz-ID",
          description:
            'Optionale Remote-Instanz-ID. Wenn gesetzt, wird ein asynchroner Task auf der Remote-Instanz erstellt. Ergebnis: {taskId, status:"pending"}.',
        },
        callbackMode: {
          label: "Callback-Modus",
          description:
            'Wie das asynchrone Ergebnis behandelt werden soll. "wait": warten bis fertig, "task-done": taskId sofort zurückgeben, "inject": Ergebnis in den aktuellen Thread einfügen.',
        },
      },
      response: {
        result:
          "Das von der Zielroute zurückgegebene Ergebnis. Bei Fehler ist dieses Feld nicht vorhanden - die Antwort selbst enthält den Fehler.",
        resultLabel: "Ergebnis",
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
          detail: 'Kein registriertes Tool mit dem Namen "{{toolName}}"',
        },
        remoteFailed: {
          title: "Remote-Tool fehlgeschlagen: {{message}}",
          description:
            "Die Remote-Instanz hat den Aufruf abgelehnt oder er ist fehlgeschlagen",
          detail: 'Remote-Tool "{{toolName}}" fehlgeschlagen: {{message}}',
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
          detail: "Unbekannter Fehler bei der Ausführung: {{error}}",
        },
      },
      success: {
        title: "Tool ausgeführt",
        description: "Das Tool wurde erfolgreich ausgeführt",
      },
      widget: {
        enterToolName: "Tool-Namen eingeben, um das Formular zu laden.",
        resolving: "Endpunkt wird aufgelöst…",
        unknownTool: "Unbekanntes Tool: {{toolName}}",
      },
      actions: {
        confirm: "Bestätigen",
        cancel: "Abbrechen",
      },
    },
  },
  dismissTask: {
    post: {
      title: "Aufgabe verwerfen",
      titleShort: "Verwerfen",
      description:
        "Bricht einen ausstehenden wakeUp-Ruf ab. Das Tool läuft im Hintergrund weiter, der Thread wird sofort entsperrt. Das Ergebnis wird beim Abschluss verworfen.",
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "callId ist erforderlich",
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
          title: "Nicht gefunden",
          description: "Kein ausstehender Aufruf für diese callId gefunden",
        },
        server: {
          title: "Serverfehler",
          description: "Ausstehender Aufruf konnte nicht verworfen werden",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler beim Verwerfen der Aufgabe",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
      },
      success: {
        title: "Aufgabe verworfen",
        description: "Thread entsperrt. Tool läuft im Hintergrund weiter.",
      },
    },
  },
  cancelTool: {
    post: {
      title: "Tool-Aufruf abbrechen",
      titleShort: "Tool abbrechen",
      description:
        "Bricht einen laufenden Tool-Aufruf per callId sofort ab. Der Aufruf stoppt und liefert einen Fehler als Ergebnis; der Zug und parallele Tool-Aufrufe laufen weiter.",
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "callId ist erforderlich",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: { title: "Verboten", description: "Zugriff verweigert" },
        notFound: {
          title: "Nicht gefunden",
          description: "Kein laufender Aufruf für diese callId",
        },
        server: {
          title: "Serverfehler",
          description: "Tool-Aufruf konnte nicht abgebrochen werden",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler beim Abbrechen",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
      },
      success: {
        title: "Tool-Aufruf abgebrochen",
        description: "Der laufende Tool-Aufruf wurde unterbrochen.",
      },
    },
  },
  detachCall: {
    post: {
      title: "Tool-Aufruf abkoppeln",
      titleShort: "Aufruf abkoppeln",
      description:
        "Stuft einen laufenden Tool-Aufruf per callId auf abgekoppelt hoch: er läuft im Hintergrund weiter, sein Ergebnis wird verworfen, der Zug wird sofort entsperrt. Nutze resume-when-done, wenn du das Ergebnis brauchst.",
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "callId ist erforderlich",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: { title: "Verboten", description: "Zugriff verweigert" },
        notFound: {
          title: "Nicht gefunden",
          description: "Kein laufender Aufruf für diese callId",
        },
        server: {
          title: "Serverfehler",
          description: "Tool-Aufruf konnte nicht abgekoppelt werden",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler beim Abkoppeln",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
      },
      success: {
        title: "Tool-Aufruf abgekoppelt",
        description:
          "Der Aufruf läuft im Hintergrund weiter; sein Ergebnis wird verworfen.",
      },
    },
  },
  resumeWhenDone: {
    post: {
      title: "Tool-Aufruf in den Hintergrund",
      titleShort: "Tool in Hintergrund",
      description:
        "Lässt einen laufenden Tool-Aufruf per callId im Hintergrund weiterlaufen. Der Zug endet, der Thread erwacht mit dem Ergebnis, sobald die Arbeit fertig ist.",
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "callId ist erforderlich",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: { title: "Verboten", description: "Zugriff verweigert" },
        notFound: {
          title: "Nicht gefunden",
          description: "Kein laufender Aufruf für diese callId",
        },
        server: {
          title: "Serverfehler",
          description:
            "Tool-Aufruf konnte nicht in den Hintergrund verschoben werden",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler beim Verschieben",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
      },
      success: {
        title: "Tool-Aufruf im Hintergrund",
        description: "Der Tool-Aufruf läuft im Hintergrund weiter.",
      },
    },
  },
  tools: {
    get: {
      title: "Tool-Hilfe - Verfügbare Tools entdecken",
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
