import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  endpointCategories: {
    ai: "KI",
  },
  tags: {
    ai: "KI",
    streaming: "Streaming",
  },
  post: {
    title: "WS-Provider-Stream",
    description:
      "Startet einen KI-Stream für einen entfernten WS-Provider-Client. Der Client sendet eine Nachricht, ein Modell und optionale Tool-Definitionen. KI-Ereignisse werden über den Standard-WebSocket-Kanal gestreamt. Client-bereitgestellte Tools pausieren den Stream, bis der Client Tool-Ergebnisse zurücksendet.",
    fields: {
      content: {
        label: "Nachricht",
        description:
          "Die Benutzernachricht, die an das KI-Modell gesendet wird",
        placeholder: "Nachricht eingeben...",
      },
      model: {
        label: "Modell",
        description: "KI-Modell für die Generierung",
      },
      threadId: {
        label: "Thread-ID",
        description:
          "UUID eines bestehenden Threads zum Fortsetzen. Weglassen, um einen neuen Thread zu starten.",
        placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      },
      rootFolderId: {
        label: "Stammordner",
        description:
          "Ordner für den neuen Thread. Standard: 'private'. 'support' für Support-Sitzungen.",
      },
      skill: {
        label: "Skill",
        description:
          "Skill-ID oder 'default'. Definiert die KI-Persona und den System-Prompt.",
      },
      systemPrompt: {
        label: "System-Prompt",
        description:
          "Optionale Systemanweisungen vom entfernten Client, die an den Skill-System-Prompt angehängt werden.",
        placeholder: "Systemanweisungen eingeben...",
      },
      instanceId: {
        label: "Instanz-ID",
        description:
          "Kennung der entfernten Instanz. Wird als Unterordner für die Thread-Organisation verwendet.",
      },
      tools: {
        title: "Client-Tools",
        description:
          "Tool-Definitionen des entfernten Clients. Wenn die KI eines aufruft, wird die Ausführung pausiert, bis der Client das Ergebnis sendet.",
        name: {
          label: "Tool-Name",
          description: "Eindeutiger Name für dieses Tool",
        },
        toolDescription: {
          label: "Tool-Beschreibung",
          description: "Beschreibung der Tool-Funktion (wird der KI angezeigt)",
        },
        parameters: {
          label: "Parameter-Schema",
          description:
            "JSON-Schema-Objekt, das die Eingabeparameter des Tools beschreibt",
        },
      },
      timezone: {
        label: "Zeitzone",
        description: "Client-Zeitzone für cache-stabile Zeitstempel",
      },
    },
    response: {
      responseThreadId: "Thread-ID der Konversation",
      messageId: "Nachrichten-ID der KI-Assistenznachricht",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Parameter angegeben",
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
        description: "Ressource nicht gefunden",
      },
      internal: {
        title: "Serverfehler",
        description: "Interner Serverfehler beim Streaming",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler beim Streaming",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsaved: {
        title: "Ungespeicherte Änderungen",
        description: "Konflikt mit ungespeicherten Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
    },
    success: {
      title: "Stream gestartet",
      description: "Der KI-Stream wurde erfolgreich gestartet",
    },
  },
};
