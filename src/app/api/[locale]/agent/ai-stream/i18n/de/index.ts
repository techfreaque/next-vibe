import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "KI-Stream-Chat",
    description: "Streamen Sie KI-gestützte Chat-Antworten mit OpenAI GPT-4o",
    form: {
      title: "KI-Chat-Konfiguration",
      description: "Konfigurieren Sie KI-Chat-Parameter und Nachrichten",
    },
    operation: {
      label: "Operation",
      description: "Art der Nachrichtenoperation",
      options: {
        send: "Nachricht senden",
        retry: "Nachricht wiederholen",
        edit: "Nachricht bearbeiten",
        answerAsAi: "Als KI antworten",
      },
    },
    rootFolderId: {
      label: "Hauptordner",
      description: "Hauptordner-Kontext für die Nachricht",
    },
    subFolderId: {
      label: "Unterordner",
      description: "Optionaler Unterordner im Hauptordner",
    },
    threadId: {
      label: "Thread-ID",
      description: "Thread-ID (null für neuen Thread)",
    },
    userMessageId: {
      label: "Benutzer-Nachrichten-ID",
      description: "Client-generierte Benutzer-Nachrichten-ID",
    },
    parentMessageId: {
      label: "Eltern-Nachrichten-ID",
      description: "Eltern-Nachrichten-ID für Verzweigung/Threading",
    },
    messageHistory: {
      label: "Nachrichtenverlauf",
      description: "Optionaler Nachrichtenverlauf für Inkognito-Modus",
      item: {
        title: "Nachricht",
        description: "Chat-Nachricht im Verlauf",
        role: {
          label: "Rolle",
        },
        content: {
          label: "Inhalt",
        },
        metadata: {
          toolCall: {
            toolName: {
              label: "Werkzeugname",
            },
            args: {
              label: "Werkzeugargumente",
            },
            result: {
              label: "Werkzeugergebnis",
            },
            error: {
              label: "Werkzeugfehler",
            },
            executionTime: {
              label: "Ausführungszeit (ms)",
            },
            creditsUsed: {
              label: "Verwendete Credits",
            },
          },
        },
      },
    },
    content: {
      label: "Nachrichteninhalt",
      description: "Inhalt der zu sendenden Nachricht",
      placeholder: "Geben Sie Ihre Nachricht ein...",
    },
    role: {
      label: "Rolle",
      description: "Rolle des Nachrichtensenders",
      options: {
        user: "Benutzer",
        assistant: "Assistent",
        system: "System",
      },
    },
    model: {
      label: "Modell",
      description: "KI-Modell für die Generierung verwenden",
    },
    character: {
      label: "Charakter",
      description: "Optionaler Charakter für die KI",
    },
    temperature: {
      label: "Temperatur",
      description: "Steuert die Zufälligkeit (0-2)",
    },
    maxTokens: {
      label: "Max. Token",
      description: "Maximale zu generierende Token",
    },
    systemPrompt: {
      label: "System-Prompt",
      description: "Optionale Systemanweisungen",
      placeholder: "System-Prompt eingeben...",
    },
    enableSearch: {
      label: "Web-Suche aktivieren",
      description:
        "KI erlauben, das Web nach aktuellen Informationen zu durchsuchen",
    },
    tools: {
      label: "KI-Tools",
      description:
        "Liste der KI-Tool-IDs, die für diese Konversation aktiviert werden sollen",
      toolId: {
        label: "Tool-ID",
        description: "Eindeutige Kennung für das KI-Tool",
      },
      requiresConfirmation: {
        label: "Benötigt Bestätigung",
        description:
          "Ob dieses Tool eine Benutzerbestätigung vor der Ausführung benötigt",
      },
    },
    resumeToken: {
      label: "Wiederaufnahme-Token",
      description: "Token zum Fortsetzen unterbrochener Streams",
    },
    voiceMode: {
      label: "Sprachmodus",
      description: "Konfiguration für sprachbasierte Interaktion",
      enabled: {
        label: "Sprachmodus aktivieren",
        description:
          "Sprachbasierte Interaktion mit Text-zu-Sprache aktivieren",
      },
      voice: {
        label: "Stimme",
        description: "Stimmtyp für Text-zu-Sprache auswählen",
        male: "Männliche Stimme",
        female: "Weibliche Stimme",
      },
    },
    audioInput: {
      title: "Audio-Eingabe",
      description: "Audio-Datei für Voice-to-Voice-Modus hochladen",
      file: {
        label: "Audio-Datei",
        description: "Audio-Datei zum Transkribieren und Verarbeiten",
      },
    },
    attachments: {
      label: "Dateianhänge",
      description:
        "An die Nachricht angehängte Dateien (Bilder, Dokumente, etc.)",
    },
    enabledToolIds: {
      label: "Aktivierte Tool-IDs",
      description:
        "Liste der KI-Tool-IDs, die für diese Konversation aktiviert werden sollen",
    },
    toolConfirmation: {
      label: "Tool-Bestätigung",
      description: "Tool-Bestätigungsantwort vom Benutzer",
      success: "Tool-Bestätigung erfolgreich verarbeitet",
      messageId: {
        label: "Nachrichten-ID",
        description: "ID der Nachricht, die den Tool-Aufruf enthält",
      },
      confirmed: {
        label: "Bestätigt",
        description: "Ob der Benutzer die Tool-Ausführung bestätigt hat",
      },
      updatedArgs: {
        label: "Aktualisierte Argumente",
        description: "Optional aktualisierte Argumente für den Tool-Aufruf",
      },
      errors: {
        messageNotFound: "Tool-Nachricht nicht gefunden",
        toolCallMissing: "ToolCall-Metadaten fehlen",
        toolNotFound: "Tool nicht gefunden",
      },
    },
    response: {
      title: "Stream-Antwort",
      description: "KI-generierte Streaming-Antwort",
      success: "Stream erfolgreich abgeschlossen",
      messageId: "Nachrichten-ID",
      totalTokens: "Verwendete Tokens insgesamt",
      finishReason: "Abschlussgrund",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung für KI-Streaming erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter angegeben",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler beim Streaming aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff auf KI-Streaming ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "KI-Streaming-Endpunkt nicht gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description:
          "Es gibt ungespeicherte Änderungen, die zuerst gespeichert werden müssen",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt beim Streaming aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "KI-Stream erfolgreich generiert",
    },
  },
  enums: {
    role: {
      user: "Benutzer",
      assistant: "Assistent",
      system: "System",
    },
  },
  streamingErrors: {
    aiStream: {
      error: {
        apiKey: {
          missing: "OpenAI API-Schlüssel fehlt",
          invalid: "OpenAI API-Schlüssel ist ungültig",
        },
        configuration: "KI-Streaming-Konfigurationsfehler",
        processing: "Fehler bei der Verarbeitung des KI-Streams",
      },
    },
  },
  route: {
    debug: {
      userObject: "AI Stream Route: Benutzerobjekt",
      extracted: "AI Stream Route: Extrahierte Werte",
    },
    errors: {
      invalidJson: "Ungültiges JSON im Anforderungstext",
      invalidRequestData: "Ungültige Anforderungsdaten",
      uncensoredApiKeyMissing: "Uncensored.ai API-Schlüssel nicht konfiguriert",
      openrouterApiKeyMissing: "OpenRouter API-Schlüssel nicht konfiguriert",
      streamCreationFailed: "Fehler beim Erstellen des Streams",
      unknownError: "Ein Fehler ist aufgetreten",
      creditValidationFailed: "Fehler bei der Validierung des Guthabens",
      noIdentifier: "Keine Benutzer- oder Lead-Kennung angegeben",
      insufficientCredits: "Nicht genügend Guthaben für diese Anfrage",
      authenticationRequired:
        "Bitte melden Sie sich an, um persistente Ordner zu verwenden. Verwenden Sie den Inkognito-Modus für anonyme Chats.",
      noResponseBody: "Kein Antworttext vom Stream erhalten",
    },
  },
  errorTypes: {
    streamError: "Stream-Fehler",
  },
  errorThread: {
    title: "Fehler",
  },
  error: {
    title: "Stream-Fehler",
  },
  errors: {
    toolExecutionError: "Werkzeug-Ausführungsfehler: {{error}}",
    toolExecutionFailed: "Werkzeug-Ausführung fehlgeschlagen",
    userDeclinedTool: "Benutzer hat die Werkzeug-Ausführung abgelehnt",
    streamError: "Stream-Fehler: {{error}}",
    streamProcessingError: "Fehler beim Verarbeiten des Streams",
    timeout:
      "Die Antwort hat nach {{seconds}} Sekunden eine Zeitüberschreitung erreicht. Die KI hat möglicherweise eine sehr lange Antwort generiert. Bitte versuchen Sie es erneut mit einer kürzeren Eingabe.",
  },
  providers: {
    uncensoredHandler: {
      errors: {
        apiError: "Uncensored.ai API-Fehler ({{status}}): {{errorText}}",
      },
    },
  },
};
