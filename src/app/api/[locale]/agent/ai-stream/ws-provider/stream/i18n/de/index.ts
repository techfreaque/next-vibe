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
    titleShort: "WS-Stream",
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
      threadMirrorMode: {
        label: "Thread-Spiegelmodus",
        description:
          "Wo der Thread gespeichert wird: beide Seiten, nur Aufrufer, nur Provider oder nirgends. 'both'/'cloud' speichern den Thread auf dieser Instanz unter BACKGROUND/<Aufrufer-Instanz>.",
      },
      folderPath: {
        label: "Ordnerpfad",
        description:
          "Geordnete Liste von Unterordnernamen, die unter BACKGROUND/<Aufrufer-Instanz> erstellt werden (z. B. ['tests', 'meine-suite']). Spiegelt die Ordnerhierarchie des Aufrufers.",
      },
      userMessageId: {
        label: "Benutzernachrichten-ID",
        description:
          "Die vom Aufrufer vergebene ID der Benutzernachricht. Wird unverändert gespeichert, damit die Thread-Synchronisation idempotent bleibt.",
      },
      parentMessageId: {
        label: "Übergeordnete Nachrichten-ID",
        description:
          "Die ID der vorherigen Blattnachricht des Aufrufers. Die neue Benutzernachricht wird daran angehängt, damit der synchronisierte Thread eine einzige verkettete Liste bleibt.",
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
      toolConfirmations: {
        title: "Tool-Bestätigungen",
        description:
          "Tool-Aufrufe freigeben oder ablehnen, die auf Bestätigung warten. Der Stream wird mit dem bestätigten Tool-Ergebnis fortgesetzt.",
        messageId: {
          label: "Nachrichten-ID",
          description: "ID der Tool-Nachricht, die auf Bestätigung wartet",
        },
        confirmed: {
          label: "Bestätigt",
          description: "True für Freigabe und Ausführung, false für Ablehnung",
        },
        updatedArgs: {
          label: "Geänderte Argumente",
          description: "Optional bearbeitete Tool-Argumente für die Ausführung",
        },
      },
      confirmationOverrides: {
        title: "Bestätigungs-Overrides",
        description:
          "Pro-Tool-Bestätigungsregeln aus dem Favoriten/Skill des Aufrufers, angewendet auf das execute-tool-Gate dieser Schleife.",
        toolId: {
          label: "Tool-ID",
          description: "Das Tool, für das die Bestätigungsregel gilt",
        },
        requiresConfirmation: {
          label: "Bestätigung erforderlich",
          description:
            "Wahr, wenn das Tool auf Benutzerbestätigung warten muss",
        },
      },
      attachments: {
        title: "Anhänge",
        description:
          "An die Nutzernachricht angehängte Dateien, base64-kodiert für die Übertragung.",
        filename: {
          label: "Dateiname",
          description: "Ursprünglicher Dateiname",
        },
        mimeType: {
          label: "MIME-Typ",
          description: "Inhaltstyp der Datei",
        },
        data: {
          label: "Daten",
          description: "Base64-kodierter Dateiinhalt",
        },
      },
      messageHistory: {
        label: "Nachrichtenverlauf",
        description:
          "Gesprächskontext der aufrufenden Instanz. Der Provider hält keinen Thread-Zustand, daher liefert der Aufrufer die bisherigen Nachrichten bei jedem Zug mit.",
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
