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
    parentMessageId: {
      label: "Eltern-Nachrichten-ID",
      description: "Eltern-Nachrichten-ID für Verzweigung/Threading",
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
    persona: {
      label: "Persona",
      description: "Optionale Persona für die KI",
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
    },
    resumeToken: {
      label: "Wiederaufnahme-Token",
      description: "Token zum Fortsetzen unterbrochener Streams",
    },
    enabledToolIds: {
      label: "Aktivierte Tool-IDs",
      description:
        "Liste der KI-Tool-IDs, die für diese Konversation aktiviert werden sollen",
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
  providers: {
    uncensoredHandler: {
      errors: {
        apiError: "Uncensored.ai API-Fehler ({{status}}): {{errorText}}",
      },
    },
  },
};
