import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",
  tags: {
    streaming: "Streaming",
    chat: "Chat",
    ai: "KI",
  },

  run: {
    task: {
      name: "KI-Herzschlag",
      description:
        "Hintergrund-KI-Agent, der den Systemzustand prüft, Aufgaben abarbeitet und den Menschen bei Bedarf kontaktiert",
    },
    post: {
      title: "KI-Agent ausführen",
      dynamicTitle: "AI Run{{suffix}}: {{prompt}}",
      description:
        "Einen headless KI-Agenten ausführen und die vollständige Textantwort erhalten. Verwende dies, um Aufgaben zu delegieren, Tool-Ergebnisse zusammenzufassen, Inhalte zu generieren oder Tools zu einer einzigen KI-Antwort zu verketten. Credits werden je nach Modell verbraucht. SCHNELLSTART: Übergib favoriteId, um Charakter + Modell + Tool-Konfiguration aus einem gespeicherten Favoriten zu laden. Überschreibe jedes Feld (model, character, tools, allowedTools) durch explizite Angabe. EINRICHTUNG: Vor der Ausführung den richtigen Charakter + Favoriten einrichten. Charaktere definieren Persona und System-Prompt (erstellen mit agent_chat_characters_create_POST). Favoriten bündeln Charakter mit Modellüberschreibung und Tool-Konfiguration (erstellen mit agent_chat_favorites_create_POST, modelSelection: {selectionType:'MANUAL', manualModelId:'...'} oder {selectionType:'FILTERS',...}). Workflow: 1) Favoriten (agent_chat_favorites_GET) oder Charaktere (agent_chat_characters_GET) auflisten. 2) Falls keiner passt, Charakter erstellen, dann Favorit dafür anlegen. 3) favoriteId an diesen Aufruf übergeben. TOOL-ZUGRIFF: Standard-Setup: allowedTools: [{toolId:'execute-tool'},{toolId:'system_help_GET'}] — execute-tool führt jeden Endpunkt aus, system_help_GET ermöglicht Tool-Entdeckung.",
      container: {
        title: "KI-Agent-Ausführung",
        description:
          "Vorausrufe und Prompt für headless KI-Ausführung konfigurieren",
      },
      fields: {
        favoriteId: {
          label: "Favoriten-ID",
          description:
            "UUID eines gespeicherten Favoriten zum Laden von Charakter, Modell und Tool-Konfiguration. Charakter, Modell (aus modelSelection) und Tool-Konfiguration (activeTools/visibleTools) des Favoriten werden als Standardwerte verwendet. Explizite Felder in dieser Anfrage überschreiben die Favoriten-Werte. Verwende agent_chat_favorites_GET zum Auflisten.",
          placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        },
        model: {
          label: "Modell",
          description:
            "KI-Modell. Optional wenn favoriteId oder character gesetzt (aus deren modelSelection aufgelöst). Schnell & günstig: claude-haiku-4.5, gemini-2.5-flash. Ausgewogen: claude-sonnet-4.6, gpt-5. Leistungsstark: claude-opus-4.6, gpt-5-pro. Kostenlos: qwen3_235b-free, gpt-oss-120b-free. Überschreibt das Modell aus favoriteId/character.",
        },
        character: {
          label: "Charakter",
          description:
            "Charakter-ID (UUID) oder 'default'. Optional wenn favoriteId gesetzt (aus dem Favoriten aufgelöst). Charaktere definieren KI-Persona, System-Prompt und Standard-Modell. Überschreibt den Charakter aus favoriteId. Verwende agent_chat_characters_GET zum Auflisten.",
          placeholder: "default",
        },
        prompt: {
          label: "Prompt",
          description:
            "Die Hauptanweisung oder Frage an die KI. Sei spezifisch — die KI nutzt Vorausruf-Ergebnisse als Kontext falls vorhanden.",
          placeholder: "Prompt eingeben...",
        },
        instructions: {
          label: "Zusätzliche System-Anweisungen",
          description:
            "Optionale Zusatzanweisungen, die an den System-Prompt angehängt werden. Verwende dies um Format, Ton oder Ausgabelänge einzuschränken (z.B. 'Sei präzise. Nur JSON.').",
          placeholder: "Prägnant sein. Max. ein Absatz.",
        },
        preCalls: {
          label: "Vorausrufe",
          description:
            "Tool-Aufrufe, die vor dem Prompt ausgeführt werden. Ergebnisse werden als Kontext injiziert. Verwende system_help_GET um verfügbare Tools und deren Argumente zu entdecken.",
          routeId: {
            label: "Tool-ID",
            description:
              "Alias oder vollständiger Tool-Name (z.B. 'web-search', 'agent_chat_characters_GET'). Verwende system_help_GET zur Tool-Entdeckung.",
            placeholder: "web-search",
          },
          args: {
            label: "Argumente",
            description:
              'Flache Schlüssel-Wert-Argumente — urlPathParams und Body-Felder zusammengeführt (z.B. {"query": "neueste Nachrichten", "maxResults": 5}).',
          },
        },
        allowedTools: {
          label: "Ausführbar (Berechtigungsschicht)",
          description:
            "Ausführungs-Berechtigungsschicht — kontrolliert welche Tools die KI tatsächlich ausführen darf. null = alle Tools erlaubt. Array = nur aufgelistete Tools (andere werden mit 'vom Benutzer deaktiviert' blockiert). Standard-Agent-Setup: [{toolId:'execute-tool'},{toolId:'system_help_GET'}] — execute-tool dispatcht jeden registrierten Endpunkt, system_help_GET ermöglicht Tool-Entdeckung. Tools aus dem tools-Feld müssen nicht wiederholt werden.",
          toolId: {
            label: "Tool-ID",
            description:
              "Alias oder vollständiger Name des erlaubten Tools (z.B. 'execute-tool', 'system_help_GET', 'web-search')",
          },
          requiresConfirmation: {
            label: "Bestätigung erforderlich",
            description:
              "Bei true wartet die Ausführung auf Benutzerbestätigung. Für destruktive oder kostenintensive Aktionen verwenden.",
          },
        },
        tools: {
          label: "Im Kontext (KI sieht diese)",
          description:
            "Tools im Kontextfenster des Modells — was die KI kennt und worüber sie nachdenken kann. null = Standard-Tool-Set des Benutzers (empfohlen). Array nur für fokussierten, minimalen Kontext. Hinweis: allowedTools kontrolliert die tatsächliche Ausführung — dieses Feld beeinflusst nur, was das Modell sieht.",
          toolId: {
            label: "Tool-ID",
            description:
              "Alias oder vollständiger Name des Tools im Kontext (z.B. 'execute-tool', 'system_help_GET')",
          },
          requiresConfirmation: {
            label: "Bestätigung erforderlich",
            description:
              "Ob dieses Tool vor der Ausführung eine Benutzerbestätigung erfordert",
          },
        },
        maxTurns: {
          label: "Max. Runden",
          description:
            "Maximale agentische Runden (Tool-Aufruf-Zyklen) vor dem Stopp. Standard: unbegrenzt. Auf 1 setzen für einzelnen Prompt+Antwort ohne Tool-Aufrufe.",
        },
        appendThreadId: {
          label: "Thread-ID (fortsetzen)",
          description:
            "UUID eines bestehenden Threads zum Fortsetzen. Die neue Nachricht wird an die Konversation angehängt. Weglassen für neuen Thread.",
          placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        },
        rootFolderId: {
          label: "Speicherordner",
          description:
            "Wo der Thread gespeichert wird. 'cron' (Standard) = persistierte Agent-Läufe. 'incognito' = kein Speicher, kein Verlauf. 'private' = privater Ordner des Benutzers. 'shared' = Team-zugänglich.",
          placeholder: "cron",
          options: {
            cron: "Cron (Agent-Läufe)",
            private: "Privat",
            shared: "Geteilt",
            incognito: "Inkognito (kein Speicher)",
          },
        },
        subFolderId: {
          label: "Unterordner-ID",
          description:
            "Optionale UUID eines Unterordners im Stammordner zur Organisation von Läufen.",
          placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        },
        excludeMemories: {
          label: "Erinnerungen ausschließen",
          description:
            "Wenn true, sieht die KI keine gespeicherten Erinnerungen im Kontext. Verwende dies für öffentliche Bots und isolierte Aufgaben, die keinen persönlichen Kontext erben sollen. Standard: false (Erinnerungen eingeschlossen).",
        },
      },
      response: {
        text: "Antworttext der KI (Think-Tags entfernt). Null wenn das Modell keine Ausgabe erzeugt hat.",
        promptTokens: "Verbrauchte Prompt-Token (Eingabekosten)",
        completionTokens: "Erzeugte Completion-Token (Ausgabekosten)",
        threadId:
          "Thread-UUID wo der Lauf gespeichert wurde. Null wenn rootFolderId 'incognito' war. Verwende dies um die Konversation via appendThreadId fortzusetzen.",
        lastAiMessageId:
          "UUID der letzten Assistenten-Nachricht. Nützlich für Verzweigungen oder Referenzen.",
        threadTitle: "Automatisch generierter Titel für diesen Thread",
        threadCreatedAt: "Erstellungszeitpunkt des Threads (ISO 8601)",
        preCallResults: {
          title: "Vorausruf-Ergebnisse",
          routeId: "Aufgerufenes Tool",
          succeeded: "Ob der Aufruf erfolgreich war",
          errorMessage: "Fehlermeldung falls der Aufruf fehlgeschlagen ist",
        },
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Parameter",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: { title: "Verboten", description: "Zugriff verweigert" },
        notFound: {
          title: "Nicht gefunden",
          description: "Route nicht gefunden",
        },
        internal: {
          title: "Serverfehler",
          description: "Interner Serverfehler",
        },
        network: { title: "Netzwerkfehler", description: "Netzwerkfehler" },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Unerwarteter Fehler",
        },
        unsaved: {
          title: "Nicht gespeichert",
          description: "Nicht gespeicherte Änderungen",
        },
        conflict: { title: "Konflikt", description: "Datenkonflikt" },
      },
      success: {
        title: "KI-Ausführung abgeschlossen",
        description: "Erfolgreich abgeschlossen",
      },
    },
  },
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
    timezone: {
      label: "Zeitzone",
      description: "Benutzer-Zeitzone für cache-stabile Zeitstempel",
    },
    activeTool: {
      label: "Ausführbar",
      description:
        "Ausführungs-Berechtigungsschicht — welche Tools die KI tatsächlich ausführen darf. null = alle erlaubt. Array = nur diese Tools.",
      toolId: {
        label: "Tool-ID",
        description: "Alias oder vollständiger Name des erlaubten Tools",
      },
    },
    tools: {
      label: "Im Kontext (KI sieht diese)",
      description:
        "Tools im Kontextfenster des Modells — was die KI kennt. null = Standard-Set des Benutzers. allowedTools steuert die tatsächliche Ausführung.",
      toolId: {
        label: "Tool-ID",
        description: "Alias oder vollständiger Name des Tools im Kontext",
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
      threadId: "Thread-ID",
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
  debugView: {
    systemPromptTitle: "System-Prompt",
    copied: "Kopiert!",
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
  wakeUp: {
    revivalPrompt:
      "The async task you dispatched has completed. The result is in the tool message above. Please summarise what the task returned for me.",
    revivalInstructions:
      "WAKE-UP REVIVAL MODE: An async task has completed and the result is in the thread. Respond to the user's last message by summarising the tool result — 1-3 sentences only. Do NOT call any tools. Do NOT re-execute the original user request.",
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
  resumeStream: {
    post: {
      title: "KI-Stream fortsetzen",
      description:
        "Setzt einen bestehenden Thread fort, indem ein headless KI-Schritt ausgeführt wird. Wird nach dem Abschluss eines asynchronen Remote-Tasks verwendet.",
      fields: {
        threadId: {
          title: "Thread-ID",
          description: "UUID des fortzusetzenden Threads.",
        },
        favoriteId: {
          title: "Favoriten-ID",
          description:
            "UUID eines gespeicherten Favoriten zum Laden von Modell und Charakter.",
        },
        modelId: {
          title: "Modell-ID",
          description: "KI-Modell für den fortgesetzten Schritt.",
        },
        characterId: {
          title: "Charakter-ID",
          description: "Charakter/Persona für den fortgesetzten Schritt.",
        },
        wakeUpToolMessageId: {
          title: "WakeUp-Tool-Nachrichten-ID",
          description:
            "ID der ursprünglichen wakeUp-Tool-Aufruf-Nachricht. Wird für das Einfügen einer verzögerten Ergebnisnachricht verwendet.",
        },
        resumed: {
          title: "Fortgesetzt",
          description: "Ob der Thread erfolgreich fortgesetzt wurde.",
        },
        lastAiMessageId: {
          title: "Letzte KI-Nachrichten-ID",
          description: "UUID der letzten generierten Assistentennachricht.",
        },
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Parameter",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: { title: "Verboten", description: "Zugriff verweigert" },
        notFound: {
          title: "Nicht gefunden",
          description: "Thread oder Modell nicht gefunden",
        },
        internal: {
          title: "Serverfehler",
          description: "Interner Fehler beim Fortsetzen des Streams",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler aufgetreten",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        unsaved: {
          title: "Nicht gespeicherte Änderungen",
          description: "Konflikt bei nicht gespeicherten Änderungen",
        },
        conflict: {
          title: "Konflikt",
          description: "Ein Konflikt ist aufgetreten",
        },
      },
      success: {
        title: "Stream fortgesetzt",
        description: "Der KI-Thread wurde erfolgreich fortgesetzt",
      },
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
