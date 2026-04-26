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
        "Delegiert eine Aufgabe an einen Spezialisten-KI-Agenten und gibt dessen Antwort zurück. Zum Erstellen oder Bearbeiten von KI-Skills/Personas immer an skill='skill-creator' delegieren – niemals selbst versuchen. skill + prompt übergeben; der Agent erledigt den Rest. Credits je nach Modell.",
      container: {
        title: "KI-Agent-Ausführung",
        description:
          "Vorausrufe und Prompt für headless KI-Ausführung konfigurieren",
      },
      fields: {
        favoriteId: {
          label: "Favoriten-ID",
          description:
            "Slug oder ID eines gespeicherten Favoriten. Lädt Skill, Modell und Tool-Konfiguration als Standardwerte. Explizite Felder überschreiben Favoriten-Werte.",
          placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        },
        model: {
          label: "Modell",
          description:
            "LLM für Text-Reasoning. Optional wenn favoriteId oder skill gesetzt. Schnell: claude-haiku-4.5, gemini-2.5-flash. Ausgewogen: claude-sonnet-4.6, gpt-5. Leistungsstark: claude-opus-4.7. Kostenlos: qwen3_235b-free. Nicht für Bild-/Audio-/Video-Generierung.",
        },
        skill: {
          label: "Skill",
          description:
            "Skill-ID oder Standard-Skill-Name. Definiert KI-Persona und System-Prompt. 'skill-creator' zum Erstellen/Bearbeiten von KI-Skills verwenden. Optional wenn favoriteId gesetzt.",
          placeholder: "default",
        },
        prompt: {
          label: "Prompt",
          description:
            "Die Hauptanweisung oder Frage an die KI. Sei spezifisch - die KI nutzt Vorausruf-Ergebnisse als Kontext falls vorhanden.",
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
            "Tool-Aufrufe vor dem Prompt. Ergebnisse werden als Kontext injiziert. Verwende tool-help um verfügbare Tools zu entdecken.",
          routeId: {
            label: "Tool-ID",
            description:
              "Alias oder vollständiger Tool-Name (z.B. 'web-search', 'agent_chat_skills_GET'). Verwende tool-help zur Tool-Entdeckung.",
            placeholder: "web-search",
          },
          args: {
            label: "Argumente",
            description:
              'Flache Schlüssel-Wert-Argumente - urlPathParams und Body-Felder zusammengeführt (z.B. {"query": "neueste Nachrichten", "maxResults": 5}).',
          },
        },
        availableTools: {
          label: "Ausführbar",
          description:
            "Welche Tools die KI ausführen darf. null = alle erlaubt. Array = nur aufgelistete Tools. Standard: [{toolId:'execute-tool'},{toolId:'tool-help'}].",
          toolId: {
            label: "Tool-ID",
            description:
              "Tool-Alias oder vollständiger Name (z.B. 'execute-tool', 'tool-help', 'web-search')",
          },
          requiresConfirmation: {
            label: "Bestätigung erforderlich",
            description: "Vor Ausführung auf Benutzerbestätigung warten",
          },
        },
        pinnedTools: {
          label: "Im Kontext (KI sieht diese)",
          description:
            "Tools im Modell-Kontext geladen. null = Standard-Set des Benutzers. Beeinflusst nur was das Modell sieht, nicht was es ausführen kann.",
          toolId: {
            label: "Tool-ID",
            description: "Tool-Alias oder vollständiger Name für den Kontext",
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
            "Wo der Thread gespeichert wird. Hintergrund = alle automatisierten Läufe (Dreamer, Autopilot, geplante Aufgaben). Privat = dein Ordner. Geteilt = Team. Inkognito = kein Speicher.",
          placeholder: "background",
          options: {
            background: "Hintergrund",
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
            "Gespeicherte Erinnerungen nicht in den Kontext laden. Für öffentliche Bots oder isolierte Aufgaben. Standard: false.",
        },
      },
      response: {
        text: "Antworttext der KI (Think-Tags entfernt). Null wenn das Modell keine Ausgabe erzeugt hat.",
        promptTokens: "Verbrauchte Prompt-Token (Eingabekosten)",
        completionTokens: "Erzeugte Completion-Token (Ausgabekosten)",
        creditCost:
          "Abgerechnete Credits für diesen Lauf. Null bei Inkognito-Läufen.",
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
      backButton: {
        label: "Zurück",
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
    leafMessageId: {
      label: "Blatt-Nachrichten-ID",
      description: "Aktuelle Zweig-Blatt-Nachrichten-ID",
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
    skill: {
      label: "Skill",
      description: "Optionaler Skill für die KI",
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
    imageSize: {
      label: "Bildgröße",
      description:
        "Größe des generierten Bildes (z.B. quadratisch, quer, hoch)",
    },
    imageQuality: {
      label: "Bildqualität",
      description:
        "Qualitätseinstellung für das generierte Bild (standard oder hd)",
    },
    musicDuration: {
      label: "Musikdauer",
      description: "Dauer des generierten Audioclips",
    },
    favoriteConfig: {
      label: "Favoriten-Konfiguration",
      description:
        "Vollständige Konfiguration des aktiven Favoriten - Modellauswahl, Tool-Konfiguration, Kontexteinstellungen. null = kein Favorit aktiv, Skill-/Systemstandards werden verwendet.",
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
      invalidRequestData: "Ungültige Anforderungsdaten ({{issue}})",
      uncensoredApiKeyMissing: "Uncensored.ai API-Schlüssel nicht konfiguriert",
      openrouterApiKeyMissing: "OpenRouter API-Schlüssel nicht konfiguriert",
      streamCreationFailed:
        "Verbindung zum KI-Dienst fehlgeschlagen. Bitte versuchen Sie es erneut.",
      unknownError: "Ein Fehler ist aufgetreten",
      creditValidationFailed: "Fehler bei der Validierung des Guthabens",
      noIdentifier: "Keine Benutzer- oder Lead-Kennung angegeben",
      insufficientCredits:
        "Nicht genügend Guthaben für diese Anfrage (Kosten: {{cost}}, Guthaben: {{balance}})",
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
    toolExecutionErrorDetail: "Tool-Fehler: {{error}}",
    toolExecutionFailed:
      "Werkzeug-Ausführung fehlgeschlagen. Bitte versuchen Sie es erneut.",
    toolDisabledByUser:
      "Dieses Werkzeug wurde vom Benutzer deaktiviert. Versuche nicht, es erneut aufzurufen.",
    userDeclinedTool: "Werkzeug-Ausführung wurde abgebrochen.",
    pendingToolCall:
      "Ein Werkzeug läuft noch im Hintergrund. Bitte warten Sie, bis es abgeschlossen ist.",
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
      "Kontextlimit erreicht - die Konversation ist zu lang für automatisches Komprimieren. Versuchen Sie, von einer früheren Nachricht zu verzweigen, ein Modell mit größerem Kontextfenster zu wählen oder das Kontextfenster in Ihren Favoriten-Einstellungen anzupassen.",
    compactingStreamErrorExpensive:
      "Kontextlimit erreicht ({{tokens}} Token). Das Erweitern des Kontextfensters ist möglich, kann aber teuer sein. Versuchen Sie zunächst, von einer früheren Nachricht zu verzweigen oder das Modell zu wechseln.",
    compactingException:
      "Komprimierung des Konversationsverlaufs fehlgeschlagen. Versuchen Sie, von einem früheren Punkt zu verzweigen oder ein anderes Modell zu verwenden.",
    compactingRebuildFailed:
      "Konversation nach dem Komprimieren konnte nicht wiederhergestellt werden. Versuchen Sie, von einer früheren Nachricht zu verzweigen.",
    unexpectedError:
      "Ein unerwarteter Fehler ist aufgetreten: {{error}}. Bitte versuchen Sie es erneut.",
  },
  wakeUp: {
    revivalPrompt:
      "The async task you dispatched has completed. The result is in the tool message above. Please summarise what the task returned for me.",
    revivalInstructions:
      "WAKE-UP REVIVAL MODE: An async task has completed and the result is in the thread. Respond to the user's last message by summarising the tool result - 1-3 sentences only. Do NOT call any tools. Do NOT re-execute the original user request.",
  },
  info: {
    streamInterrupted:
      "Generierung wurde gestoppt. Teilantwort wurde gespeichert.",
  },
  headless: {
    errors: {
      missingModelOrSkill:
        "Modell und Charakter sind erforderlich - direkt angeben oder favoriteId mit auflösbarer Modellauswahl bereitstellen",
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
        skillId: {
          title: "Charakter-ID",
          description: "Charakter/Persona für den fortgesetzten Schritt.",
        },
        callbackMode: {
          title: "Callback-Modus",
          description:
            "Callback-Modus des ursprünglichen Tool-Aufrufs (wait oder wakeUp).",
        },
        wakeUpToolMessageId: {
          title: "WakeUp-Tool-Nachrichten-ID",
          description:
            "ID der ursprünglichen Tool-Aufruf-Nachricht mit dem Ergebnis.",
        },
        wakeUpTaskId: {
          title: "WakeUp-Aufgaben-ID",
          description: "ID der auslösenden Remote-Cron-Aufgabe.",
        },
        resumeTaskId: {
          title: "Resume-Aufgaben-ID",
          description: "ID dieser Resume-Stream-Cron-Aufgabe.",
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
  onboarding: {
    back: "Zurück",
    welcome: {
      title: "Eine KI für alles. Die richtige für jeden Moment.",
      line1:
        "Ein Begleiter für alltägliche Gespräche. Spezialisten für Coding, Recherche, Schreiben - du wählst einen, wenn die Aufgabe es verlangt.",
      line2:
        "Gleicher Chat. Du wechselst, wenn es drauf ankommt. Dauert Sekunden.",
      line3: "Lass uns dich in unter einer Minute einrichten.",
      continue: "Los geht's",
    },
    guest: {
      title: "Du surfst als Gast",
      line1:
        "Deine Einstellungen, dein Begleiter und dein Chatverlauf werden nur lokal auf diesem Gerät gespeichert.",
      line2:
        "Melde dich an, um alles geräteübergreifend zu synchronisieren - und dein Setup nie zu verlieren.",
      signIn: "Anmelden / Konto erstellen",
      continueAnyway: "Als Gast fortfahren",
      note: "Du kannst dich jederzeit über das Menü anmelden.",
    },
    companion: {
      title: "Wähle deinen Begleiter",
      subtitle: "Dein täglicher Gesprächspartner",
      modelTitle: "Welches Modell soll es antreiben?",
      customSetup: "Erweiterte Einrichtung →",
      next: "Weiter",
      selectFirst: "Wähle einen Begleiter zum Fortfahren",
    },
    usecases: {
      title: "Wofür wirst du es hauptsächlich nutzen?",
      subtitle:
        "Wir fügen automatisch die richtigen Spezialisten zu deinem KI-Toolkit hinzu.",
      saving: "Einrichtung...",
      start: "Chat starten",
      hintNoneSelected:
        "Wähle Bereiche für Spezialisten oder tippe auf Start zum Überspringen",
      noProviderAvailable:
        "Kein KI-Anbieter konfiguriert. Füge OPENROUTER_API_KEY hinzu oder aktiviere Claude Code (CLAUDE_CODE_ENABLED=true) um fortzufahren.",
      coding: {
        label: "Coding & Technik",
        hint: "Vibe Coder, Coder",
      },
      research: {
        label: "Recherche & Analyse",
        hint: "Researcher, Data Analyst",
      },
      writing: {
        label: "Schreiben & Bearbeiten",
        hint: "Writer, Editor",
      },
      business: {
        label: "Business & Strategie",
        hint: "Business Advisor, Product Manager",
      },
      learning: {
        label: "Lernen & Studium",
        hint: "Tutor, Socratic Questioner",
      },
      creative: {
        label: "Kreativität & Geschichten",
        hint: "Storyteller, Kreativ",
      },
      health: {
        label: "Gesundheit & Karriere",
        hint: "Wellness, Karriere-Coach",
      },
      controversial: {
        label: "Freies Denken",
        hint: "Ohne Zensur, Philosoph",
      },
      roleplay: {
        label: "Rollenspiel & Charaktere",
        hint: "Rollenspiel, Charakterersteller",
      },
    },
  },
  input: {
    placeholder: "Nachricht senden...",
    imagePlaceholder: "Beschreibe ein zu generierendes Bild...",
    audioPlaceholder: "Beschreibe Audio oder Musik zum Generieren...",
    noPermission: "Du hast keine Berechtigung, hier zu posten",
    keyboardShortcuts: {
      enter: "Enter",
      toSend: "zum Senden",
      shiftEnter: "Shift+Enter",
      forNewLine: "für neue Zeile",
      ctrlV: "Strg+V",
      orPasteFiles: "oder Dateien einfügen",
    },
    speechInput: {
      transcribing: "Transkribiere...",
    },
    attachments: {
      uploadFile: "Dateien anhängen",
      attachedFiles: "Angehängte Dateien",
      addMore: "Weitere hinzufügen",
    },
  },
  imageGen: {
    sizeSquare: "Quadrat (1024×1024)",
    sizeLandscape: "Querformat (1792×1024)",
    sizePortrait: "Hochformat (1024×1792)",
    qualityStandard: "Standard",
    qualityHD: "HD",
  },
  audioGen: {
    durationShort: "Kurz (~8s)",
    durationMedium: "Mittel (~15s)",
    durationLong: "Lang (~30s)",
  },
  voiceMode: {
    unconfiguredTitle: "Sprache nicht konfiguriert",
    unconfiguredDescription:
      "Text-zu-Sprache ist für diese Fertigkeit nicht verfügbar.",
    callMode: "Anrufmodus",
    callModeDescription: "KI antwortet mit Sprache",
    tapToRecord: "Zum Aufnehmen tippen",
    recording: {
      paused: "Pausiert",
      resume: "Fortsetzen",
      pause: "Pause",
    },
    callOverlay: {
      listening: "Zuhören...",
    },
    actions: {
      cancel: "Abbrechen",
      toInput: "Zur Eingabe",
      sendVoice: "Sprachnachricht senden",
      retry: "Erneut versuchen",
    },
  },
  actions: {
    cancellingGeneration: "Abbrechen...",
    stopGeneration: "Stopp",
    sendMessage: "Senden",
  },
  toolsButton: {
    title: "KI-Werkzeuge",
    tools: "Werkzeuge",
  },
};
