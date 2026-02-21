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
    systemPrompt: {
      label: "System-Prompt",
      description: "Optionale Systemanweisungen",
      placeholder: "System-Prompt eingeben...",
      now: "jetzt",
      minutesAgo: "{{minutes}}m her",
      hoursAgo: "{{hours}}h her",
      daysAgo: "{{days}}t her",
    },
    enableSearch: {
      label: "Web-Suche aktivieren",
      description:
        "KI erlauben, das Web nach aktuellen Informationen zu durchsuchen",
    },
    activeTool: {
      label: "Aktive Tools",
      description:
        "Tools, die das Modell ausführen darf. Null bedeutet alle Tools sind erlaubt.",
      toolId: {
        label: "Tool-ID",
        description: "Eindeutige Kennung für das KI-Tool",
      },
    },
    tools: {
      label: "Sichtbare Tools",
      description:
        "Tools, die in das KI-Kontextfenster geladen werden. Das Modell kann diese direkt aufrufen.",
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
      streamCreationFailed:
        "Verbindung zum KI-Dienst fehlgeschlagen. Bitte versuchen Sie es erneut.",
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
    toolExecutionError:
      "Ein Werkzeug konnte nicht korrekt ausgeführt werden. Bitte versuchen Sie es erneut.",
    toolExecutionFailed:
      "Werkzeug-Ausführung fehlgeschlagen. Bitte versuchen Sie es erneut.",
    toolDisabledByUser:
      "Dieses Werkzeug wurde vom Benutzer deaktiviert. Versuche nicht, es erneut aufzurufen.",
    userDeclinedTool: "Werkzeug-Ausführung wurde abgebrochen.",
    streamError:
      "Die KI-Antwort konnte nicht vollständig verarbeitet werden. Bitte versuchen Sie es erneut.",
    streamProcessingError:
      "Fehler beim Verarbeiten der KI-Antwort. Bitte versuchen Sie es erneut.",
    timeout:
      "Die KI brauchte zu lange für eine Antwort (Zeitüberschreitung nach {{maxDuration}} Sekunden). Bitte versuchen Sie es mit einer kürzeren Nachricht erneut.",
    noResponse:
      "Die KI hat keine Antwort generiert. Bitte versuchen Sie es erneut.",
    modelUnavailable:
      "Das ausgewählte KI-Modell ist derzeit nicht verfügbar. Bitte versuchen Sie ein anderes Modell.",
    rateLimitExceeded:
      "Zu viele Anfragen. Bitte warten Sie einen Moment und versuchen Sie es erneut.",
    insufficientCredits: "Nicht genügend Credits für diese Anfrage.",
    connectionFailed:
      "Verbindung zum KI-Dienst fehlgeschlagen. Bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut.",
    invalidRequest:
      "Ungültige Anfrage. Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut.",
    compactingStreamError:
      "Fehler beim Komprimieren der Verlauf: {{error}}. Ihre Konversation wurde nicht komprimiert.",
    compactingException:
      "Fehler beim Komprimieren des Konversationsverlaufs: {{error}}. Bitte versuchen Sie es erneut.",
    compactingRebuildFailed:
      "Fehler beim Wiederherstellen der Konversation nach dem Komprimieren. Bitte versuchen Sie es erneut.",
    unexpectedError:
      "Ein unerwarteter Fehler ist aufgetreten: {{error}}. Bitte versuchen Sie es erneut.",
  },
  info: {
    streamInterrupted:
      "Generierung wurde gestoppt. Teilantwort wurde gespeichert.",
  },
  headless: {
    errors: {
      missingModelOrCharacter:
        "Modell und Charakter sind erforderlich — direkt angeben oder favoriteId mit auflösbarer Modellauswahl bereitstellen",
      favoriteNotFound:
        "Favorit nicht gefunden oder gehört nicht diesem Benutzer",
    },
  },
  providers: {
    uncensoredHandler: {
      errors: {
        apiError: "Uncensored.ai API-Fehler ({{status}}): {{errorText}}",
      },
    },
  },
};
