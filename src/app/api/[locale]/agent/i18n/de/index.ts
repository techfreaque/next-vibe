import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",
  tags: {
    streaming: "Streaming",
    chat: "Chat",
    ai: "KI",
    status: "Status",
    processing: "Verarbeitung",
    classification: "Klassifikation",
    automation: "Automatisierung",
    execution: "Ausführung",
    confirmation: "Bestätigung",
    speech: "Sprache",
    transcription: "Transkription",
    tts: "Text-zu-Sprache",
  },
  enums: {
    emailAgentStatus: {
      pending: "Ausstehend",
      processing: "In Bearbeitung",
      hardRulesComplete: "Feste Regeln Abgeschlossen",
      aiProcessing: "KI-Verarbeitung",
      awaitingConfirmation: "Bestätigung Ausstehend",
      completed: "Abgeschlossen",
      failed: "Fehlgeschlagen",
      skipped: "Übersprungen",
    },
    emailAgentActionType: {
      markBounced: "Als Bounce Markieren",
      markSpam: "Als Spam Markieren",
      classifyDeliveryFailure: "Zustellfehler Klassifizieren",
      respondToEmail: "E-Mail Beantworten",
      deleteEmail: "E-Mail Löschen",
      searchKnowledgeBase: "Wissensdatenbank Durchsuchen",
      webSearch: "Web-Suche",
      escalateToHuman: "An Mensch Weiterleiten",
      noAction: "Keine Aktion",
      chainAnalysis: "Ketten-Analyse",
    },
    emailAgentToolType: {
      knowledgeBaseSearch: "Wissensdatenbank-Suche",
      emailResponse: "E-Mail-Antwort",
      emailDelete: "E-Mail Löschen",
      webSearch: "Web-Suche",
    },
    bounceCategory: {
      hardBounce: "Harter Bounce",
      softBounce: "Weicher Bounce",
      spamComplaint: "Spam-Beschwerde",
      unsubscribe: "Abmelden",
      blockBounce: "Block-Bounce",
      invalidAddress: "Ungültige Adresse",
      mailboxFull: "Postfach Voll",
      contentRejected: "Inhalt Abgelehnt",
    },
    confirmationStatus: {
      pending: "Ausstehend",
      approved: "Genehmigt",
      rejected: "Abgelehnt",
      expired: "Abgelaufen",
    },
    processingPriority: {
      low: "Niedrig",
      normal: "Normal",
      high: "Hoch",
      urgent: "Dringend",
    },
    sortOrder: {
      asc: "Aufsteigend",
      desc: "Absteigend",
    },
    emailAgentSortField: {
      emailId: "E-Mail-ID",
      status: "Status",
      lastProcessedAt: "Zuletzt Verarbeitet Am",
      createdAt: "Erstellt Am",
      priority: "Priorität",
    },
    emailAgentStatusFilter: {
      all: "Alle",
      pending: "Ausstehend",
      processing: "In Bearbeitung",
      hardRulesComplete: "Feste Regeln Abgeschlossen",
      aiProcessing: "KI-Verarbeitung",
      awaitingConfirmation: "Bestätigung Ausstehend",
      completed: "Abgeschlossen",
      failed: "Fehlgeschlagen",
      skipped: "Übersprungen",
    },
    emailAgentActionTypeFilter: {
      all: "Alle",
      markBounced: "Als Bounce Markieren",
      markSpam: "Als Spam Markieren",
      classifyDeliveryFailure: "Zustellfehler Klassifizieren",
      respondToEmail: "E-Mail Beantworten",
      deleteEmail: "E-Mail Löschen",
      searchKnowledgeBase: "Wissensdatenbank Durchsuchen",
      webSearch: "Web-Suche",
      escalateToHuman: "An Mensch Weiterleiten",
      noAction: "Keine Aktion",
      chainAnalysis: "Ketten-Analyse",
    },
    confirmationStatusFilter: {
      all: "Alle",
      pending: "Ausstehend",
      approved: "Genehmigt",
      rejected: "Abgelehnt",
      expired: "Abgelaufen",
    },
    processingPriorityFilter: {
      all: "Alle",
      low: "Niedrig",
      normal: "Normal",
      high: "Hoch",
      urgent: "Dringend",
    },
    confirmationResponseAction: {
      approve: "Genehmigen",
      reject: "Ablehnen",
    },
    modelUtilities: {
      chat: "Chat",
      coding: "Programmierung",
      creative: "Kreatives Schreiben",
      analysis: "Analyse",
      reasoning: "Schlussfolgerung",
      roleplay: "Rollenspiel",
      fast: "Schnell",
      smart: "Intelligent",
      vision: "Vision",
      imageGen: "Bildgenerierung",
      politicalLeft: "Politisch Links",
      politicalRight: "Politisch Rechts",
      controversial: "Kontrovers",
      adultImplied: "Erwachsene (Angedeutet)",
      adultExplicit: "Erwachsene (Explizit)",
      violence: "Gewalt",
      harmful: "Schädliche Inhalte",
      illegalInfo: "Illegale Informationen",
      medicalAdvice: "Medizinische Beratung",
      offensiveLanguage: "Beleidigende Sprache",
      roleplayDark: "Dunkles Rollenspiel",
      conspiracy: "Verschwörung",
      legacy: "Veraltet",
      uncensored: "Unzensiert",
    },
  },
  aiStream: {
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
                "Alias oder vollständiger Tool-Name (z.B. 'web-search', 'agent_skills_GET'). Verwende tool-help zur Tool-Entdeckung.",
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
      titleShort: "KI-Chat",
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
        uncensoredApiKeyMissing:
          "Uncensored.ai API-Schlüssel nicht konfiguriert",
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
        download: "Audio herunterladen",
        downloadHint:
          "Lade die Datei herunter und hänge sie an deine nächste Nachricht an.",
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
  },
  chat: {
    category: "Chat",
    tags: {
      threads: "Threads",
      folders: "Ordner",
      files: "Dateien",
      messages: "Nachrichten",
      characters: "Charaktere",
      memories: "Erinnerungen",
      favorites: "Favoriten",
      credits: "Credits",
      balance: "Guthaben",
      permissions: "Berechtigungen",
      hotkey: "Hotkey",
      cli: "CLI",
      speech: "Sprache",
      sharing: "Teilen",
      settings: "Einstellungen",
    },
    config: {
      appName: "unbottled.ai",
      folders: {
        private: "Privat",
        shared: "Geteilt",
        public: "Öffentlich",
        incognito: "Inkognito",
        background: "Hintergrund",
        remote: "Remote",
      },
      foldersShort: {
        private: "Privat",
        shared: "Geteilt",
        public: "Öffentlich",
        incognito: "Inkognito",
        background: "Hintergrund",
        remote: "Remote",
      },
    },
    enums: {
      role: {
        user: "Benutzer",
        assistant: "Assistent",
        system: "System",
        tool: "Werkzeug",
        error: "Fehler",
      },
      threadStatus: {
        active: "Aktiv",
        archived: "Archiviert",
        deleted: "Gelöscht",
      },
      viewMode: {
        linear: "Linear",
        threaded: "Threaded",
        flat: "Flach",
        debug: "Debug",
      },
    },
    components: {
      sidebar: {
        login: "Anmelden",
        logout: "Abmelden",
        footer: {
          account: "Konto",
          profile: "Profil",
          balance: "Guthaben",
          buy: "Kaufen",
          freeCreditsLeft: "Kostenlose Credits",
        },
      },
      credits: {
        credit: "{{count}} Credit",
        credits: "{{count}} Credits",
      },
      navigation: {
        subscription: "Abonnement & Credits",
        referral: "Empfehlungsprogramm",
        help: "Hilfe",
        about: "Über uns",
      },
      confirmations: {
        deleteMessage: "Möchten Sie diese Nachricht wirklich löschen?",
      },
      welcomeTour: {
        authDialog: {
          title: "Private & geteilte Ordner freischalten",
          description:
            "Melden Sie sich an oder erstellen Sie ein Konto, um auf private und geteilte Ordner zuzugreifen. Ihre Chats werden geräteübergreifend synchronisiert.",
          continueTour: "Tour fortsetzen",
          signUp: "Registrieren / Anmelden",
        },
        buttons: {
          back: "Zurück",
          close: "Schließen",
          last: "Fertig",
          next: "Weiter",
          skip: "Überspringen",
        },
        welcome: {
          title: "Willkommen bei {{appName}}!",
          description:
            "Ihre datenschutzorientierte KI-Plattform mit {{modelCount}} Modellen, benutzergesteuerter Inhaltsfilterung und freier Meinungsfreiheit.",
          subtitle: "Machen Sie eine kurze Tour, um loszulegen.",
        },
        aiCompanion: {
          title: "Wählen Sie Ihren KI-Begleiter",
          description:
            "Wählen Sie aus {{modelCount}} KI-Modellen, darunter Mainstream, Open-Source und zensurfreie Optionen.",
          tip: "Klicken Sie, um den Modellselektor zu öffnen und Ihren Begleiter auszuwählen.",
        },
        rootFolders: {
          title: "Ihre Chat-Ordner",
          description:
            "Organisieren Sie Ihre Chats in verschiedenen Ordnern, jeder mit einzigartigen Datenschutzeinstellungen:",
          private: {
            name: "Privat",
            suffix: "— nur Sie können es sehen",
          },
          incognito: {
            name: "Inkognito",
            suffix: "— kein Verlauf gespeichert",
          },
          shared: {
            name: "Geteilt",
            suffix: "— mit anderen zusammenarbeiten",
          },
          public: {
            name: "Öffentlich",
            suffix: "— für alle sichtbar",
          },
        },
        privateFolder: {
          name: "Privat",
          suffix: "Ordner",
          description:
            "Ihre privaten Chats sind nur für Sie sichtbar. Perfekt für sensible Themen.",
        },
        incognitoFolder: {
          name: "Inkognito",
          suffix: "Ordner",
          description:
            "Chatten Sie ohne Speicherung auf dem Server. Nachrichten werden lokal in Ihrem Browser gespeichert und bleiben erhalten, bis Sie sie löschen.",
          note: "Während Inkognito-Sitzungen werden keine Daten auf unseren Servern gespeichert.",
        },
        sharedFolder: {
          name: "Geteilt",
          suffix: "Ordner",
          description:
            "Arbeiten Sie mit bestimmten Personen zusammen, indem Sie den Zugriff auf diesen Ordner teilen.",
        },
        publicFolder: {
          name: "Öffentlich",
          suffix: "Ordner",
          description:
            "Teilen Sie Ihre KI-Gespräche mit der Welt. Andere können Ihre Threads ansehen und forken.",
          note: "Alles im öffentlichen Bereich ist für alle Benutzer und Suchmaschinen sichtbar.",
        },
        newChatButton: {
          title: "Einen neuen Chat starten",
          description:
            "Klicken Sie hier, um ein neues Gespräch in einem beliebigen Ordner zu starten.",
        },
        sidebarLogin: {
          title: "Anmelden, um mehr freizuschalten",
          description:
            "Erstellen Sie ein kostenloses Konto, um auf private und geteilte Ordner zuzugreifen, geräteübergreifend zu synchronisieren und die KI Dinge über Sie merken zu lassen.",
          tip: "Die Registrierung ist kostenlos!",
        },
        subscriptionButton: {
          title: "Credits & Abonnement",
          description:
            "Erhalten Sie {{credits}} Credits/Monat mit einem Abonnement für nur {{price}}/Monat. Kostenlose Nutzer erhalten {{freeCredits}} Credits/Monat.",
        },
        chatInput: {
          title: "Ihre Nachricht eingeben",
          description:
            "Geben Sie Ihre Nachricht hier ein und drücken Sie Enter oder klicken Sie Senden, um mit Ihrem KI-Begleiter zu chatten.",
          tip: "Verwenden Sie Umschalt+Enter für eine neue Zeile. Sie können auch Dateien und Bilder anhängen.",
        },
        voiceInput: {
          title: "Spracheingabe",
          description:
            "Verwenden Sie Ihr Mikrofon, um mit Ihrem KI-Begleiter zu sprechen:",
          options: {
            transcribe: "Sprache in Text transkribieren",
            sendAudio: "Audio direkt an die KI senden",
            pauseResume: "Aufnahme pausieren und fortsetzen",
          },
        },
        callMode: {
          title: "Anrufmodus",
          description:
            "Aktivieren Sie den Anrufmodus für ein freihändiges, sprachgesteuertes Gesprächserlebnis mit Echtzeit-KI-Antworten.",
          tip: "Perfekt für unterwegs oder wenn Sie lieber sprechen als tippen.",
        },
        complete: {
          title: "Alles erledigt!",
          description:
            "Sie haben die Tour abgeschlossen! Beginnen Sie jetzt, mit Ihrem KI-Begleiter zu chatten.",
          help: "Brauchen Sie Hilfe? Klicken Sie jederzeit auf das Fragezeichen-Symbol in der Seitenleiste.",
        },
        authUnlocked: {
          unlocked: "Freigeschaltet!",
          privateDescription:
            "Ihr privater Ordner ist jetzt verfügbar. Alle Chats hier sind nur für Sie sichtbar.",
          privateNote:
            "Private Chats werden automatisch auf allen Ihren Geräten synchronisiert.",
          sharedDescription:
            "Ihr geteilter Ordner ist jetzt verfügbar. Laden Sie andere ein, an KI-Gesprächen zusammenzuarbeiten.",
          sharedNote:
            "Sie kontrollieren, wer Zugang zu Ihren geteilten Ordnern und Threads hat.",
        },
      },
    },
    selector: {
      loading: "Laden...",
      best: "Beste Übereinstimmung",
      free: "KOSTENLOS",
      creditsSingle: "1 Credit",
      creditsExact: "{{cost}} Credits",
      modelOnly: "Nur Modell",
      editModelSettings: "Modelleinstellungen bearbeiten",
      editSettings: "Einstellungen bearbeiten",
      switchSkill: "Charakter wechseln",
      editSkill: "Charakter bearbeiten",
      delete: "Löschen",
      autoSelectedModel: "FILTERBASIERT",
      manualSelectedModel: "MANUELL AUSGEWÄHLT",
      intelligence: "Intelligenz",
      contentFilter: "Inhalt",
      maxPrice: "Maximalpreis",
      modelSelection: "Modellauswahl",
      autoModeDescription:
        "Bestes Modell wird basierend auf Ihren Filtern ausgewählt",
      manualModeDescription: "Wählen Sie ein bestimmtes Modell manuell aus",
      autoMode: "Filterbasiert",
      manualMode: "Manuell",
      allModelsCount: "Alle {{count}} Modelle",
      filteredModelsCount: "{{count}} Modelle entsprechen den Filtern",
      showFiltered: "Gefilterte anzeigen",
      showAllModels: "Alle Modelle anzeigen",
      showLess: "Weniger anzeigen",
      showMore: "{{remaining}} weitere anzeigen",
      showLegacyModels_one: "{{count}} Legacy-Modell anzeigen",
      showLegacyModels_other: "{{count}} Legacy-Modelle anzeigen",
      noMatchingModels: "Keine passenden Modelle",
      noModelsWarning: "Keine Modelle entsprechen Ihren Filtern",
      useOnce: "Einmal verwenden",
      saveAsDefault: "Zu Favoriten hinzufügen",
      deleteSetup: "Setup löschen",
      content: "Inhalte durchsuchen...",
      characterSetup: "Charakter-Setup",
      noResults: "Keine Ergebnisse",
      add: "Zu Favoriten hinzufügen",
      added: "Hinzugefügt",
      addNew: "Neu hinzufügen",
      searchSkills: "Charaktere suchen...",
      createCustom: "Benutzerdefiniert erstellen",
      customizeSettings: "Einstellungen anpassen",
      requirements: {
        characterConflict: "Charakter-Anforderungskonflikte",
        tooLow: "zu niedrig",
        tooHigh: "zu hoch",
        min: "min",
        max: "max",
      },
    },
    common: {
      newChat: "Neuer Chat",
      privateChats: "Private Chats",
      search: "Suchen",
      delete: "Löschen",
      cancel: "Abbrechen",
      save: "Speichern",
      edit: "Bearbeiten",
      settings: "Einstellungen",
      close: "Schließen",
      toggleSidebar: "Seitenleiste umschalten",
      lightMode: "Heller Modus",
      darkMode: "Dunkler Modus",
      searchPlaceholder: "Suchen...",
      searchThreadsPlaceholder: "Threads durchsuchen...",
      searchResults: "Suchergebnisse",
      noChatsFound: "Keine Chats gefunden",
      noThreadsFound: "Keine Threads gefunden",
      enableTTSAutoplay: "TTS-Autoplay aktivieren",
      disableTTSAutoplay: "TTS-Autoplay deaktivieren",
      selector: {
        country: "Land",
        language: "Sprache",
      },
      copyButton: {
        copied: "Kopiert!",
        copyToClipboard: "In Zwischenablage kopieren",
        copyAsMarkdown: "Als Markdown kopieren",
        copyAsText: "Als Text kopieren",
      },
      assistantMessageActions: {
        cancelLoading: "Laden abbrechen",
        stopAudio: "Audio stoppen",
        playAudio: "Audio abspielen",
        answerAsAI: "Als KI-Modell antworten",
        deleteMessage: "Nachricht löschen",
      },
      characterSelector: {
        placeholder: "Charakter auswählen",
        addNewLabel: "Benutzerdefinierte Charakter erstellen",
        grouping: {
          bySource: "Nach Quelle",
          byCategory: "Nach Kategorie",
          sourceLabels: {
            builtIn: "Integriert",
            my: "Meine Charakters",
            community: "Community",
          },
          sourceIcons: {
            builtIn: "sparkles",
            my: "user",
            community: "people",
          },
        },
        addDialog: {
          title: "Benutzerdefinierte Charakter erstellen",
          fields: {
            name: {
              label: "Name",
              placeholder: "Charakter-Name eingeben",
            },
            icon: {
              label: "Symbol (Emoji)",
              placeholder: "😊",
            },
            description: {
              label: "Beschreibung",
              placeholder: "Kurze Beschreibung der Charakter",
            },
            systemPrompt: {
              label: "System-Prompt",
              placeholder: "Definieren Sie, wie sich die Charakter verhält...",
            },
            category: {
              label: "Kategorie",
            },
          },
          createCategory: "Kategorie erstellen",
          cancel: "Abbrechen",
          create: "Charakter erstellen",
        },
        addCategoryDialog: {
          title: "Kategorie erstellen",
          fields: {
            name: {
              label: "Kategoriename",
              placeholder: "Kategorienamen eingeben",
            },
            icon: {
              label: "Symbol (Emoji)",
              placeholder: "📁",
            },
          },
          cancel: "Abbrechen",
          create: "Kategorie erstellen",
        },
      },
    },
    actions: {
      newChatInFolder: "Neuer Chat im Ordner",
      newFolder: "Neuer Ordner",
      deleteFolder: "Ordner löschen",
      deleteMessage: "Nachricht löschen",
      deleteThisMessage: "Diese Nachricht löschen",
      searchEnabled: "Suche aktiviert",
      searchDisabled: "Suche deaktiviert",
      answerAsAI: "Als KI-Modell antworten",
      retry: "Mit anderem Modell/Charakter wiederholen",
      branch: "Konversation von hier abzweigen",
      editMessage: "Nachricht bearbeiten",
      stopAudio: "Audio-Wiedergabe stoppen",
      playAudio: "Audio abspielen",
      copyContent: "In Zwischenablage kopieren",
    },
    dialogs: {
      searchAndCreate: "Suchen & Erstellen",
      deleteChat: 'Chat "{{title}}" löschen?',
      deleteFolderConfirm:
        'Ordner "{{name}}" löschen und {{count}} Chat(s) nach Allgemein verschieben?',
    },
    views: {
      linearView: "Lineare Ansicht (ChatGPT-Stil)",
      threadedView: "Thread-Ansicht (Reddit/Discord-Stil)",
      flatView: "Flache Ansicht (4chan-Stil)",
      debugView: "Debug-Ansicht (mit Systemprompts)",
    },

    screenshot: {
      capturing: "Erfassen...",
      capture: "Screenshot aufnehmen",
      failed: "Screenshot konnte nicht aufgenommen werden",
      failedWithMessage:
        "Screenshot konnte nicht aufgenommen werden: {{message}}",
      tryAgain:
        "Screenshot konnte nicht aufgenommen werden. Bitte versuchen Sie es erneut.",
      noMessages:
        "Chat-Nachrichtenbereich konnte nicht gefunden werden. Bitte stellen Sie sicher, dass Sie Nachrichten im Chat haben.",
      quotaExceeded: "Speicherplatz überschritten. Screenshot ist zu groß.",
      canvasError: "Fehler beim Konvertieren des Screenshots in Bildformat.",
    },
    errors: {
      noResponse:
        "Keine Antwort von der KI erhalten. Die Anfrage wurde abgeschlossen, gab aber leeren Inhalt zurück. Bitte versuchen Sie es erneut.",
      noStream: "Fehler beim Streamen der Antwort: Kein Reader verfügbar",
      saveFailed: "Fehler beim Speichern der Bearbeitung",
      branchFailed: "Fehler beim Abzweigen",
      retryFailed: "Fehler beim Wiederholen",
      answerFailed: "Fehler beim Antworten",
      deleteFailed: "Fehler beim Löschen",
    },
    errorTypes: {
      streamError: "Stream-Fehler",
    },
    hooks: {
      stt: {
        "endpoint-not-available": "Sprache-zu-Text-Endpunkt nicht verfügbar",
        "failed-to-start": "Fehler beim Starten der Aufnahme",
        "permission-denied":
          "Mikrofon-Zugriff blockiert. Erlaube das Mikrofon in den Browser-Einstellungen und lade die Seite neu.",
        "permission-denied-ios":
          "Mikrofon blockiert. Gehe zu Einstellungen → Safari → Mikrofon und erlaube den Zugriff für diese Seite.",
        "permission-denied-android":
          "Mikrofon blockiert. Tippe auf das Schloss-Symbol in der Adressleiste → Website-Einstellungen → Mikrofon → Zulassen.",
        "permission-denied-mac":
          "Mikrofon blockiert. Öffne Systemeinstellungen → Datenschutz & Sicherheit → Mikrofon und aktiviere deinen Browser.",
        "permission-denied-windows":
          "Mikrofon blockiert. Öffne Einstellungen → Datenschutz → Mikrofon und stelle sicher, dass dein Browser zugelassen ist.",
        "no-microphone":
          "Kein Mikrofon gefunden. Schließe ein Mikrofon oder Headset an und versuche es erneut.",
        "microphone-in-use":
          "Dein Mikrofon wird von einer anderen App verwendet. Schließe sie und versuche es erneut.",
        "not-supported":
          "Dein Browser unterstützt keinen Mikrofon-Zugriff. Versuche Chrome, Firefox oder Safari.",
        "transcription-failed": "Fehler beim Transkribieren des Audios",
        "audio-too-short":
          "Aufnahme zu kurz. Halte das Mikrofon und sprich deutlich, dann erneut versuchen.",
      },
      tts: {
        "endpoint-not-available": "Text-zu-Sprache-Endpunkt nicht verfügbar",
        "failed-to-play": "Fehler beim Abspielen des Audios",
        "conversion-failed": "TTS-Konvertierung fehlgeschlagen",
        "failed-to-generate": "Fehler beim Generieren des Audios",
      },
    },
    post: {
      title: "Chat",
      description: "Chat-Oberfläche",
    },
    models: {
      descriptions: {
        uncensoredLmV11:
          "Unzensiertes KI-Modell für kreative und uneingeschränkte Konversationen",
        freedomgptLiberty:
          "FreedomGPT Liberty - Unzensiertes KI-Modell mit Fokus auf freie Meinungsäußerung und kreative Inhalte",
        gabAiArya:
          "Gab AI Arya - Unzensiertes Konversations-KI-Modell mit freier Meinungsäußerung und kreativen Fähigkeiten",
        gemini31ProPreviewCustomTools:
          "Gemini 3.1 Pro Preview (Custom Tools) - Gemini-3.1-Pro-Variante mit verbesserter Werkzeugauswahl für Coding-Agenten und komplexe Multi-Tool-Workflows",
        gemini31FlashImagePreview:
          "Gemini 3.1 Flash Image Preview - Googles multimodales Modell, das Bilder direkt aus Textprompts generiert und Text- sowie Bildausgabe in einem Gespräch unterstützt",
        gemini31FlashLitePreview:
          "Gemini 3.1 Flash Lite Preview - Googles hocheffizienztes Modell für Hochvolumen-Anwendungen mit Verbesserungen bei Audio, RAG-Ranking, Übersetzung und Code-Vervollständigung",
        gemini3Pro:
          "Google Gemini 3 Pro - Fortgeschrittenes multimodales KI-Modell mit großem Kontextfenster und leistungsstarken Reasoning-Fähigkeiten",
        gemini35Flash:
          "Gemini 3.5 Flash - Pro-nahe Coding- und Reasoning-Leistung zum Flash-Preis. Text, Bild, Video, Audio und PDF. Parallele Agentenausführung integriert. Denktiefe von minimal bis hoch für präzise Kosten-/Leistungssteuerung.",
        gemini3Flash:
          "Google Gemini 3 Flash - Schnelles, effizientes multimodales KI-Modell optimiert für schnelle Antworten",
        deepseekV32:
          "DeepSeek V3.2 - Hochleistungs-Reasoning-Modell mit erweiterten Coding-Fähigkeiten",
        deepseekV4Pro:
          "DeepSeek V4 Pro - 1,6T Parameter MoE-Modell mit 1M Kontext. Für komplette Codebase-Analysen, komplexes Denken und mehrstufige Agenten-Workflows.",
        deepseekV4Flash:
          "DeepSeek V4 Flash - 284B MoE zu minimalem Preis. 1M Kontext, schnelle Inferenz, starkes Coding. Die effiziente Wahl für leistungsstarke Workloads.",
        gpt55:
          "GPT-5.5 - OpenAIs Frontier-Modell für komplexe Profi-Workloads. Stärkeres Reasoning, höhere Zuverlässigkeit, bessere Token-Effizienz. 1M+ Kontext mit Text- und Bildeingaben.",
        gpt55Pro:
          "GPT-5.5 Pro - OpenAIs leistungsstärkstes Modell für tiefes Reasoning bei komplexen Hochrisiko-Aufgaben. 1M+ Kontext, langfristiges Problemlösen, agentisches Coding, präzise Mehrschritt-Ausführung.",
        gpt54Pro:
          "GPT-5.4 Pro - OpenAIs fortschrittlichstes Modell mit erweitertem Reasoning, 1M+ Kontextfenster und überlegener Leistung für komplexe Aufgaben",
        gpt54:
          "GPT-5.4 - OpenAIs neuestes Frontier-Modell, das Codex und GPT vereint, mit 1M+ Kontextfenster für kontextreiche Analyse und Codierung",
        gpt53Codex:
          "GPT-5.3-Codex - OpenAIs fortschrittlichstes agentisches Coding-Modell für lang laufende Tool-Workflows und komplexe Entwicklungsaufgaben",
        gpt53Chat:
          "GPT-5.3 Chat - Aktualisiertes ChatGPT-Konversationsmodell mit präziseren Antworten und deutlich weniger unnötigen Einschränkungen",
        gpt52Pro:
          "GPT-5.2 Pro - Fortgeschrittenes OpenAI-Modell mit verbessertem Reasoning und Coding-Fähigkeiten",
        gpt52:
          "GPT-5.2 - Hochleistungs-OpenAI-Modell für komplexe Aufgaben und Analyse",
        gpt52_chat:
          "GPT-5.2 Chat - Optimiertes OpenAI-Modell für Konversationsinteraktionen",
        dolphin3_0_r1_mistral_24b:
          "Dolphin 3.0 R1 Mistral 24B - Unzensiertes großes Sprachmodell basierend auf Mistral",
        dolphinLlama3_70B:
          "Dolphin Llama 3 70B - Unzensiertes großes Sprachmodell basierend auf Llama 3",
        veniceUncensored:
          "Venice Uncensored 1.1 - Das unzensierteste KI-Modell mit Tool-Calling-Unterstützung. Entwickelt für maximale kreative Freiheit und authentische Interaktion. Ideal für offene Erkundung, Rollenspiele und ungefilterten Dialog mit minimalen Inhaltsbeschränkungen.",
        claudeOpus45:
          "Claude Opus 4.5 - Leistungsstärkstes Claude-Modell mit außergewöhnlichen Reasoning- und kreativen Fähigkeiten",
        claudeOpus46:
          "Claude Opus 4.6 - Leistungsstarkes Claude-Modell mit außergewöhnlichen Reasoning- und kreativen Fähigkeiten",
        claudeOpus47:
          "Claude Opus 4.7 - Vorherige Opus-Generation. Nachfolger: 4.8.",
        claudeOpus48:
          "Claude Opus 4.8 - Anthropics leistungsstärkstes allgemein verfügbares Opus-Modell. Entwickelt für autonome Langzeit-Agenten, komplexes Coding und mehrstufiges Reasoning über sehr lange Ausgaben. 1M-Token-Kontextfenster. Unterstützt Text-, Bild- und Dateieingaben.",
        claudeSonnet46:
          "Claude Sonnet 4.6 - Anthropics leistungsfähigstes Sonnet-Modell mit frontier-Leistung in Coding, Agenten und professioneller Arbeit",
        claudeHaiku45:
          "Claude Haiku 4.5 - Schnelles und effizientes Claude-Modell optimiert für Geschwindigkeit und Kosteneffizienz",
        glm5_1:
          "GLM-5.1 - Z.AIs Coding-Modell der nächsten Generation für langfristige Aufgaben. Arbeitet über 8 Stunden autonom an einer einzigen Aufgabe - plant, führt aus und verbessert sich selbst, bis vollständige Engineering-Ergebnisse vorliegen.",
        glm5: "GLM-5 - Z.AIs Flaggschiff-Open-Source-Basismodell für komplexes Systemdesign und langfristige Agenten-Workflows, vergleichbar mit führenden Closed-Source-Modellen",
        glm5Turbo:
          "GLM-5 Turbo - Z.AIs Modell der nächsten Generation, tief optimiert für agentische Umgebungen mit schneller Inferenz, verbesserter Instruktionsverarbeitung und erweiterter Aufgabenstabilität",
        glm46:
          "GLM-4 6B - Effizientes chinesisch-englisches bilinguales KI-Modell mit starken allgemeinen Fähigkeiten",
        glm47:
          "GLM-4 7B - Fortgeschrittenes chinesisch-englisches bilinguales Modell mit verbesserten Reasoning- und Coding-Fähigkeiten",
        glm47Flash:
          "GLM-4 7B Flash - Ultraschnelles chinesisch-englisches Modell optimiert für schnelle Antworten",
        kimiK2:
          "Kimi K2 - Leistungsstarkes chinesisches KI-Modell mit ausgezeichnetem Kontextverständnis",
        kimiK2_5:
          "Kimi K2.5 - Moonshot AIs Vorgängermodell mit starkem Langkontext-Reasoning und Coding-Fähigkeiten",
        kimiK2_6:
          "Kimi K2.6 - Moonshot AIs Multimodal-Modell der nächsten Generation für langfristige Coding-Aufgaben, UI/UX-Generierung aus Prompts und Bildern sowie Multi-Agenten-Orchestrierung mit Agentenschwarm-Architektur für Hunderte paralleler Unteragenten",
        claudeSonnet45:
          "Claude Sonnet 4.5 - Anthropics Vorgänger-Sonnet-Modell mit starken Coding- und Analysefähigkeiten",
        claudeAgentSonnet:
          "Claude Agent Sonnet - Autonomer KI-Agent mit Claude Sonnet über Anthropics Agent SDK. Führt Tools selbstständig mit integriertem Reasoning aus.",
        claudeAgentHaiku:
          "Claude Agent Haiku - Schneller autonomer KI-Agent mit Claude Haiku über Anthropics Agent SDK. Optimiert für Geschwindigkeit mit Tool-Ausführung.",
        claudeAgentOpus:
          "Claude Agent Opus - Leistungsstärkster autonomer KI-Agent mit Claude Opus über Anthropics Agent SDK. Maximale Intelligenz mit Tool-Ausführung.",
        grok4:
          "Grok 4 - xAIs Flaggschiff-Reasoning-Modell mit Vision- und Web-Suchfähigkeiten",
        grok4Fast:
          "Grok 4 Fast - xAIs Hochgeschwindigkeitsmodell mit 2M-Token-Kontext optimiert für schnelle Antworten",
        grok43:
          "Grok 4.3 - xAIs Reasoning-Modell mit 1M-Token-Kontext, hoher Faktengenauigkeit und permanentem Reasoning für agentische Workflows und Tiefenrecherche",
        grok420Beta:
          "Grok 4.20 (Legacy) - xAIs vorheriges Flaggschiff-Modell mit agentischem Tool-Calling, niedriger Halluzinationsrate und 2M-Token-Kontext",
        gpt5Pro:
          "GPT-5 Pro - OpenAIs Premium-Modell mit erstklassigem Reasoning und fortgeschrittenen Coding-Fähigkeiten",
        gpt5Codex:
          "GPT-5 Codex - OpenAIs spezialisiertes Coding-Modell mit außergewöhnlichen Programmier- und technischen Fähigkeiten",
        gpt51Codex:
          "GPT 5.1 Codex - Aktualisiertes OpenAI-Coding-Modell mit verbesserten kreativen und Programmierfähigkeiten",
        gpt51:
          "GPT 5.1 - OpenAIs effizientes Allzweck-Modell mit starkem Reasoning und Analyse",
        gpt5: "GPT-5 - OpenAIs Flaggschiff-Modell mit breiter Intelligenz und vielseitigen Fähigkeiten",
        gpt54Mini:
          "GPT-5.4 Mini - OpenAIs effizienter GPT-5.4-Ableger für Hochdurchsatz-Workloads mit starkem Reasoning, Coding und Tool-Nutzung bei reduziertem Kostenpunkt",
        gpt54Nano:
          "GPT-5.4 Nano - OpenAIs leichtestes und kostengünstigstes Modell für geschwindigkeitskritische Aufgaben wie Klassifizierung, Datenextraktion und Sub-Agent-Ausführung",
        gpt5Mini:
          "GPT-5 Mini - OpenAIs leichtes schnelles Modell für schnelle alltägliche Aufgaben",
        gpt5Nano:
          "GPT-5 Nano - OpenAIs kleinstes und günstigstes Modell für einfache Konversationsaufgaben",
        gptOss120b:
          "GPT-OSS 120B - OpenAIs Open-Source-120B-Parameter-Modell mit starken Coding-Fähigkeiten",
        kimiK2Thinking:
          "Kimi K2 Thinking - Kimis Reasoning-fokussiertes Modell mit verbessertem analytischem und schrittweisem Denken",
        minimaxM27:
          "MiniMax M2.7 - MiniMaxs agentisches Modell der nächsten Generation für autonome Produktivität, Multi-Agenten-Zusammenarbeit und Produktions-Workflows inkl. Code-Debugging, Finanzmodellierung und Dokumenterstellung",
        mimoV2Pro:
          "MiMo V2 Pro - Xiaomis Flaggschiff-Modell mit 1T+ Parametern und 1M Kontext, tief optimiert für Agenten-Orchestrierung, komplexe Workflow-Automatisierung und Produktions-Engineering",
        glm45Air:
          "GLM 4.5 AIR - Z.AIs ultraschnelles leichtgewichtiges Modell für schnelle Konversationsinteraktionen",
        glm45v:
          "GLM 4.5v - Z.AIs Vision-fähiges Modell mit Bildverständnis und Chat-Fähigkeiten",
        geminiFlash25Lite:
          "Gemini 2.5 Flash Lite - Googles Einstiegs-Gemini-Modell mit großem Kontext und schnellen Antworten",
        geminiFlash25Flash:
          "Gemini 2.5 Flash - Googles effizientes multimodales Modell mit 1M-Token-Kontext für schnelle Aufgaben",
        geminiFlash25Pro:
          "Gemini 2.5 Flash Pro - Googles Vorgänger-Pro-Modell mit großem Kontext und starkem Reasoning",
        deepseekV31:
          "DeepSeek V3.1 - DeepSeeks Vorgänger-Modell mit starken Coding- und Analysefähigkeiten",
        deepseekR1:
          "DeepSeek R1 - DeepSeeks Reasoning-fokussiertes Modell mit fortgeschrittenem schrittweisem Problemlösen",
        qwen3235bFree:
          "Qwen3 235B - Alibabas großes offenes Modell mit 235B Parametern für komplexe Coding- und Reasoning-Aufgaben",
        deepseekR1Distill:
          "DeepSeek R1 Distill - Kompakte destillierte Version von DeepSeek R1 mit effizienten Reasoning-Fähigkeiten",
        qwen257b:
          "Qwen 2.5 7B - Alibabas kompaktes 7B-Modell für schnelle und günstige Konversationsaufgaben",
        dallE3:
          "DALL-E 3 - OpenAIs Bildgenerierungsmodell für hochwertige, detaillierte Bilder aus Textbeschreibungen",
        gptImage1:
          "GPT-Image-1 - OpenAIs schnelles und erschwingliches Bildgenerierungsmodell",
        fluxSchnell:
          "Flux Schnell - Black Forest Labs' schnelles Bildgenerierungsmodell, optimiert für Geschwindigkeit",
        fluxPro:
          "Flux Pro 1.1 - Black Forest Labs' professionelles Bildgenerierungsmodell mit überlegener Qualität",
        flux2Max:
          "FLUX.2 Max - Black Forest Labs' hochwertigstes Bildmodell mit maximaler Bildqualität, Prompt-Verständnis und Bearbeitungskonsistenz",
        flux2Klein4b:
          "FLUX.2 Klein 4B - Black Forest Labs' schnellstes und kosteneffizientestes Bildmodell, optimiert für hohen Durchsatz",
        riverflowV2Pro:
          "Riverflow V2 Pro - Sourcefuls leistungsstärkstes Bildgenerierungsmodell mit erstklassiger Steuerung und perfekter Textwiedergabe",
        riverflowV2Fast:
          "Riverflow V2 Fast - Sourcefuls schnellstes Bildgenerierungsmodell, optimiert für Produktionsumgebungen und latenzempfindliche Workflows",
        riverflowV2MaxPreview:
          "Riverflow V2 Max Preview - Sourcefuls leistungsstärkstes Preview-Modell, vereinheitlichtes Text-zu-Bild- und Bild-zu-Bild-Modell",
        riverflowV2StandardPreview:
          "Riverflow V2 Standard Preview - Sourcefuls Standard-Preview-Variante mit verbesserter Leistung gegenüber der Riverflow 1-Familie",
        riverflowV2FastPreview:
          "Riverflow V2 Fast Preview - Sourcefuls schnellste Preview-Variante, vereinheitlichtes Text-zu-Bild- und Bild-zu-Bild-Modell zum günstigsten Preis",
        flux2Flex:
          "FLUX.2 Flex - Black Forest Labs' Bildmodell mit hervorragender Text- und Typografiewiedergabe sowie Multi-Referenz-Bearbeitung in einer einheitlichen Architektur",
        flux2Pro:
          "FLUX.2 Pro - Black Forest Labs' hochwertiges Bildgenerierungs- und Bearbeitungsmodell mit erstklassiger Bildqualität, starker Prompt-Treue und konsistenter Charakterwiedergabe",
        gemini3ProImagePreview:
          "Nano Banana Pro (Gemini 3 Pro Image Preview) - Googles fortschrittlichstes Bildgenerierungsmodell mit verbessertem multimodalem Reasoning, Weltverständnis und branchenführender Textwiedergabe",
        gpt5ImageMini:
          "GPT-5 Image Mini - OpenAIs effizientes multimodales Bildgenerierungsmodell, das GPT-5 Mini-Sprachfähigkeiten mit schneller, kostengünstiger Bildgenerierung kombiniert",
        gpt5Image:
          "GPT-5 Image - OpenAIs Flaggschiff-Multimodal-Modell, das GPT-5-Sprachfähigkeiten mit modernster Bildgenerierung und -bearbeitung kombiniert",
        gpt54Image2:
          "GPT-5.4 Image 2 - OpenAIs Multimodal-Modell der nächsten Generation, das GPT-5.4-Reasoning mit GPT Image 2 verbindet. Wechselt nahtlos zwischen Coding, Analyse und visueller Erstellung in einem Gespräch.",
        seedream45:
          "Seedream 4.5 - ByteDances neuestes Bildgenerierungsmodell mit umfassenden Verbesserungen bei Bearbeitungskonsistenz, Porträtverfeinerung und Mehrbildkomposition",
        sdxl: "Stable Diffusion XL - Stability AIs hochwertiges Open-Source-Bildgenerierungsmodell",
        cassetteMusic:
          "CassetteAI Music - schnelle Text-zu-Musik-Generierung über Fal.ai mit Clips bis zu drei Minuten Länge",
        musicgenStereo:
          "MusicGen Stereo - Metas Open-Source-Stereo-Musikgenerierungsmodell via Replicate",
        stableAudio:
          "Stable Audio - Stability AIs Musik- und Audiogenerierungsmodell für hochwertige Clips",
        udioV2:
          "Udio v2 - Hochwertige KI-Musikgenerierung mit Gesang und vollständiger Produktionsqualität",
        modelsLabMusicGen:
          "ModelsLab Music Gen - KI-Musikgenerierung aus Textbeschreibungen mit MP3/WAV/FLAC-Ausgabe",
        modelsLabElevenlabsMusic:
          "ElevenLabs Music - Hochwertige Musikgenerierung mit ElevenLabs über ModelsLab",
        modelsLabSonautoSong:
          "Sonauto Song - Vollständige Songgenerierung mit Gesang, verschiedene Genres bis zu 4:45 Min.",
        modelsLabLyria3:
          "Lyria 3 - Googles fortschrittliches Musikgenerierungsmodell für originale 30-Sekunden-Tracks aus Text",
        modelsLabCogVideoX:
          "CogVideoX - ModelsLabs Text-zu-Video-Modell für kurze Videoclips",
        modelsLabWanx: "Wanx - ModelsLabs Text-zu-Video-Generierungsmodell",
        modelsLabWan22:
          "Wan 2.2 Ultra - ModelsLabs hochqualitatives Text-zu-Video-Modell",
        modelsLabWan21:
          "Wan 2.1 Ultra - ModelsLabs Text-zu-Video-Modell mit verbesserter Qualität",
        modelsLabWan25T2V:
          "Wan 2.5 T2V - ModelsLabs Wan 2.5 Text-zu-Video-Generierungsmodell",
        modelsLabWan25I2V:
          "Wan 2.5 I2V - ModelsLabs Wan 2.5 Bild-zu-Video-Generierungsmodell",
        modelsLabWan27T2V:
          "Wan 2.7 T2V - Alibabas neuestes Wan 2.7 Text-zu-Video-Modell mit flexiblen Seitenverhältnissen und 1080p-Ausgabe",
        modelsLabWan26T2V:
          "Wan 2.6 T2V - ModelsLabs Wan 2.6 Text-zu-Video-Generierungsmodell",
        modelsLabWan26I2V:
          "Wan 2.6 I2V - ModelsLabs Wan 2.6 Bild-zu-Video-Generierungsmodell",
        modelsLabWan26I2VFlash:
          "Wan 2.6 I2V Flash - ModelsLabs schnelles Wan 2.6 Bild-zu-Video-Generierungsmodell",
        modelsLabSeedanceT2V:
          "Seedance T2V - BytePlus Text-zu-Video-Generierungsmodell",
        modelsLabSeedanceI2V:
          "Seedance I2V - BytePlus Bild-zu-Video-Generierungsmodell",
        modelsLabOmnihuman:
          "Omnihuman - BytePlus Human-Video-Generierungsmodell",
        modelsLabSeedance1ProI2V:
          "Seedance 1.0 Pro I2V - BytePlus professionelles Bild-zu-Video-Modell",
        modelsLabSeedance1ProFastI2V:
          "Seedance 1.0 Pro Fast I2V - BytePlus schnelles professionelles Bild-zu-Video-Modell",
        modelsLabSeedance1ProFastT2V:
          "Seedance 1.0 Pro Fast T2V - BytePlus schnelles professionelles Text-zu-Video-Modell",
        modelsLabOmnihuman15:
          "Omnihuman 1.5 - BytePlus verbessertes Human-Video-Generierungsmodell",
        modelsLabSeedance15Pro:
          "Seedance 1.5 Pro - BytePlus fortschrittliches Video-Generierungsmodell",
        modelsLabVeo2:
          "Veo 2 - Googles hochwertiges Video-Generierungsmodell via ModelsLab",
        modelsLabVeo3:
          "Veo 3 - Googles neuestes Video-Generierungsmodell via ModelsLab",
        modelsLabVeo3Fast:
          "Veo 3 Fast - Googles schnelles Video-Generierungsmodell via ModelsLab",
        modelsLabVeo3FastPreview:
          "Veo 3 Fast Preview - Googles schnelles Video-Generierungs-Preview-Modell via ModelsLab",
        modelsLabVeo31:
          "Veo 3.1 - Googles verbessertes Veo 3 Video-Generierungsmodell via ModelsLab",
        modelsLabVeo31Fast:
          "Veo 3.1 Fast - Googles schnelles Veo 3.1 Video-Generierungsmodell via ModelsLab",
        modelsLabKlingV21I2V:
          "Kling V2.1 I2V - Kling AIs Bild-zu-Video-Modell Version 2.1",
        modelsLabKlingV25TurboI2V:
          "Kling V2.5 Turbo I2V - Kling AIs Turbo-Bild-zu-Video-Modell Version 2.5",
        modelsLabKlingV25TurboT2V:
          "Kling V2.5 Turbo T2V - Kling AIs Turbo-Text-zu-Video-Modell Version 2.5",
        modelsLabKlingV2MasterT2V:
          "Kling V2 Master T2V - Kling AIs Master-Qualität Text-zu-Video-Modell",
        modelsLabKlingV2MasterI2V:
          "Kling V2 Master I2V - Kling AIs Master-Qualität Bild-zu-Video-Modell",
        modelsLabKlingV21MasterT2V:
          "Kling V2.1 Master T2V - Kling AIs Master-Qualität Text-zu-Video-Modell v2.1",
        modelsLabKlingV21MasterI2V:
          "Kling V2.1 Master I2V - Kling AIs Master-Qualität Bild-zu-Video-Modell v2.1",
        modelsLabKlingV16MultiI2V:
          "Kling V1.6 Multi I2V - Kling AIs Multi-Bild-zu-Video-Modell Version 1.6",
        modelsLabKling30T2V:
          "Kling 3.0 T2V - Kling AIs Text-zu-Video-Modell Version 3.0",
        modelsLabLtx2ProT2V:
          "LTX 2 PRO T2V - LTXs professionelles Text-zu-Video-Generierungsmodell",
        modelsLabLtx2ProI2V:
          "LTX 2 PRO I2V - LTXs professionelles Bild-zu-Video-Generierungsmodell",
        modelsLabLtx23ProI2V:
          "LTX 2.3 Pro I2V - LTXs verbessertes professionelles Bild-zu-Video-Modell",
        modelsLabHailuo23T2V:
          "Hailuo 2.3 T2V - MiniMax Text-zu-Video-Generierungsmodell Version 2.3",
        modelsLabHailuo02T2V:
          "Hailuo 02 T2V - MiniMax Text-zu-Video-Generierungsmodell 02",
        modelsLabHailuo23I2V:
          "Hailuo 2.3 I2V - MiniMax Bild-zu-Video-Generierungsmodell Version 2.3",
        modelsLabHailuo23FastI2V:
          "Hailuo 2.3 Fast I2V - MiniMax schnelles Bild-zu-Video-Modell Version 2.3",
        modelsLabHailuo02I2V:
          "Hailuo 02 I2V - MiniMax Bild-zu-Video-Generierungsmodell 02",
        modelsLabHailuo02StartEnd:
          "Hailuo 02 Start/End - MiniMax Start-End-Frame Video-Generierungsmodell",
        modelsLabSora2:
          "Sora 2 - OpenAIs Sora 2 Video-Generierungsmodell via ModelsLab",
        modelsLabSora2Pro:
          "Sora 2 Pro - OpenAIs Sora 2 Pro Video-Generierungsmodell via ModelsLab",
        modelsLabGen4Aleph:
          "Gen4 Aleph - Runways Gen4 Aleph Video-Generierungsmodell via ModelsLab",
        modelsLabLipsync2:
          "Lipsync 2 - Syncs Lippensynchronisations-Video-Generierungsmodell",
        modelsLabGrokT2V:
          "Grok T2V - xAIs Grok Text-zu-Video-Generierungsmodell via ModelsLab",
        modelsLabGrokI2V:
          "Grok I2V - xAIs Grok Bild-zu-Video-Generierungsmodell via ModelsLab",
        modelsLabGen4T2ITurbo:
          "Gen4 T2I Turbo - Runways schnelles Text-zu-Bild-Generierungsmodell via ModelsLab",
        modelsLabGen4Image:
          "Gen4 Image - Runways Gen4 Text-zu-Bild-Generierungsmodell via ModelsLab",
        modelsLabWan27T2I:
          "Wan 2.7 T2I - Alibabas Wan 2.7 Text-zu-Bild-Modell via ModelsLab",
        modelsLabGrokT2I:
          "Grok Imagine T2I - xAIs Grok Text-zu-Bild-Modell via ModelsLab",
        modelsLabZImageBase:
          "Z Image Base - ModelsLabs schnelles und günstiges Text-zu-Bild-Modell",
        modelsLabZImageTurbo:
          "Z Image Turbo - ModelsLabs ultraschnelles Text-zu-Bild-Modell",
        modelsLabFlux2MaxT2I:
          "Flux 2 Max T2I - Black Forest Labs Flux 2 Max Text-zu-Bild via ModelsLab",
        modelsLabFluxPro11Ultra:
          "Flux Pro 1.1 Ultra - Black Forest Labs Flux Pro Ultra via ModelsLab",
        modelsLabFluxPro11:
          "Flux Pro 1.1 - Black Forest Labs Flux Pro 1.1 Text-zu-Bild via ModelsLab",
        modelsLabFlux2ProT2I:
          "Flux 2 Pro T2I - Black Forest Labs Flux 2 Pro Text-zu-Bild via ModelsLab",
        modelsLabFlux2DevT2I:
          "Flux 2 Dev T2I - Black Forest Labs Flux 2 Dev Text-zu-Bild via ModelsLab",
        modelsLabFluxT2I:
          "Flux T2I - Black Forest Labs Flux Text-zu-Bild via ModelsLab",
        modelsLabSeedream45T2I:
          "Seedream 4.5 T2I - ByteDances Seedream 4.5 Text-zu-Bild via ModelsLab",
        modelsLabSeedream40T2I:
          "Seedream 4.0 T2I - ByteDances Seedream 4.0 Text-zu-Bild via ModelsLab",
        modelsLabSeedreamT2I:
          "Seedream T2I - ByteDances Seedream Text-zu-Bild via ModelsLab",
        modelsLabImagen4Ultra:
          "Imagen 4 Ultra - Googles höchste Qualität Bildgenerierung via ModelsLab",
        modelsLabImagen4:
          "Imagen 4 - Googles Imagen 4 Text-zu-Bild via ModelsLab",
        modelsLabImagen4Fast:
          "Imagen 4 Fast - Googles schnelles Imagen 4 Text-zu-Bild via ModelsLab",
        modelsLabImagen3:
          "Imagen 3 - Googles Imagen 3 Text-zu-Bild via ModelsLab",
        modelsLabNanoBananaPro:
          "Nano Banana Pro - Hochwertige Bildgenerierung via ModelsLab",
        modelsLabNanoBanana: "Nano Banana - Bildgenerierung via ModelsLab",
        modelsLabQwenT2I: "Qwen T2I - Alibabas Qwen Text-zu-Bild via ModelsLab",
        modelsLabRealtimeT2I:
          "Realtime T2I - ModelsLabs ultraschnelles Echtzeit Text-zu-Bild-Modell",
      },
    },
    modelUtilities: {
      adultExplicit: "Explizite Erwachseneninhalte",
      adultImplied: "Angedeutete Erwachseneninhalte",
      analysis: "Analyse",
      chat: "Chat",
      coding: "Programmierung",
      conspiracy: "Verschwörungstheorien",
      controversial: "Kontroverse Themen",
      creative: "Kreatives Schreiben",
      fast: "Schnell",
      harmful: "Potenziell schädliche Inhalte",
      illegalInfo: "Illegale Informationen",
      imageGen: "Bildgenerierung",
      legacy: "Veraltet",
      medicalAdvice: "Medizinische Beratung",
      offensiveLanguage: "Beleidigende Sprache",
      politicalLeft: "Linke politische Ansichten",
      politicalRight: "Rechte politische Ansichten",
      reasoning: "Fortgeschrittenes Denkvermögen",
      roleplay: "Rollenspiel",
      roleplayDark: "Dunkles Rollenspiel",
      smart: "Intelligent",
      uncensored: "Unzensiert",
      violence: "Gewalt",
      vision: "Bildverarbeitung",
    },
    input: {
      attachments: {
        uploadFile: "Dateien anhängen",
        attachedFiles: "Angehängte Dateien",
        addMore: "Mehr hinzufügen",
      },
    },
  },

  search: {
    brave: {
      category: "Information",
      get: {
        title: "Im Web suchen",
        dynamicTitle: "Search: {{query}}",
        description:
          "Durchsuchen Sie das Internet nach aktuellen Informationen, Nachrichten, Fakten oder aktuellen Ereignissen. Verwenden Sie dies, wenn Sie aktuelle Informationen benötigen oder Fakten überprüfen möchten.",
        form: {
          title: "Suchparameter",
          description: "Konfigurieren Sie Ihre Web-Suchanfrage",
        },
        submitButton: {
          label: "Suchen",
          loadingText: "Suche läuft...",
        },
        backButton: {
          label: "Zurück",
        },
        fields: {
          query: {
            title: "Suchanfrage",
            description:
              "Klare und spezifische Suchanfrage. Verwenden Sie Schlüsselwörter statt Fragen.",
            placeholder: "Geben Sie Ihre Suchanfrage ein...",
          },
          maxResults: {
            title: "Max. Ergebnisse",
            description: "Anzahl der zurückzugebenden Ergebnisse (1-10)",
          },
          includeNews: {
            title: "Nachrichten einbeziehen",
            description:
              "Nachrichtenergebnisse für aktuelle Ereignisse einbeziehen",
          },
          freshness: {
            title: "Aktualität",
            description: "Ergebnisse nach Aktualität filtern",
            options: {
              day: "Letzter Tag",
              week: "Letzte Woche",
              month: "Letzter Monat",
              year: "Letztes Jahr",
            },
          },
        },
        response: {
          success: {
            title: "Erfolg",
            description: "Ob die Suche erfolgreich war",
          },
          message: {
            title: "Nachricht",
            description: "Statusnachricht zur Suche",
          },
          query: {
            title: "Anfrage",
            description: "Die ausgeführte Suchanfrage",
          },
          results: {
            title: "Ergebnisse",
            description: "Array von Suchergebnissen",
            result: "Ergebnis",
            item: {
              title: "Suchergebnis",
              description: "Einzelnes Suchergebnis",
              url: "URL",
              snippet: "Snippet",
              age: "Alter",
              source: "Quelle",
            },
          },
          cached: {
            title: "Gecacht",
            description: "Ob Ergebnisse aus dem Cache bereitgestellt wurden",
          },
          timestamp: {
            title: "Zeitstempel",
            description: "Wann die Suche durchgeführt wurde",
          },
        },
        errors: {
          queryEmpty: {
            title: "Suchanfrage ist erforderlich",
            description: "Bitte geben Sie eine Suchanfrage ein",
          },
          queryTooLong: {
            title: "Suchanfrage ist zu lang",
            description: "Die Anfrage darf maximal 400 Zeichen lang sein",
          },
          timeout: {
            title: "Suchanfrage hat Zeitüberschreitung",
            description: "Die Suche hat zu lange gedauert",
          },
          searchFailed: {
            title: "Suche fehlgeschlagen",
            description: "Bei der Suche ist ein Fehler aufgetreten",
          },
          validation: {
            title: "Ungültige Suche",
            description:
              "Bitte überprüfen Sie Ihre Suchparameter und versuchen Sie es erneut",
          },
          internal: {
            title: "Etwas ist schief gelaufen",
            description:
              "Wir konnten Ihre Suche nicht abschließen. Bitte versuchen Sie es erneut",
          },
          notConfigured: {
            title:
              "{{label}} API-Schlüssel nicht konfiguriert. Fügen Sie {{envKey}}=<ihr-schlüssel> zu Ihrer .env-Datei hinzu. Holen Sie sich Ihren Schlüssel auf {{url}}",
            description:
              "Richten Sie {{label}} ein, um die Websuche zu aktivieren",
          },
        },
        success: {
          title: "Suche erfolgreich",
          description: "Die Web-Suche wurde erfolgreich abgeschlossen",
        },
      },
      tags: {
        search: "Suche",
        web: "Web",
        internet: "Internet",
      },
    },
    kagi: {
      category: "Information",
      get: {
        title: "Mit Kagi suchen",
        dynamicTitle: "Kagi: {{query}}",
        description:
          "Durchsuchen Sie das Internet oder erhalten Sie KI-gestützte Antworten mit Kagi. Der FastGPT-Modus liefert umfassende Antworten mit Quellen, während der Suchmodus direkte Ergebnisse zurückgibt.",
        form: {
          title: "Suchparameter",
          description: "Konfigurieren Sie Ihre Kagi-Suchanfrage",
        },
        submitButton: {
          label: "Suchen",
          loadingText: "Suche läuft...",
        },
        backButton: {
          label: "Zurück",
        },
        fields: {
          query: {
            title: "Suchanfrage",
            description: "Klare und spezifische Suchanfrage oder Frage.",
            placeholder: "Geben Sie Ihre Suchanfrage ein...",
          },
          mode: {
            title: "Suchmodus",
            description:
              "Wählen Sie zwischen KI-gestützten Antworten (FastGPT) oder direkten Suchergebnissen",
            options: {
              fastgpt: "FastGPT (KI-gestützte Antworten)",
              search: "Suche (Direkte Ergebnisse)",
            },
          },
        },
        response: {
          success: {
            title: "Erfolg",
            description: "Ob die Suche erfolgreich war",
          },
          message: {
            title: "Nachricht",
            description: "Statusnachricht zur Suche",
          },
          output: {
            title: "Antwort",
            description: "KI-generierte Antwort von FastGPT",
          },
          query: {
            title: "Anfrage",
            description: "Die ausgeführte Suchanfrage",
          },
          references: {
            title: "Referenzen",
            description: "Quellenreferenzen und Zitate",
            reference: "Referenz",
            item: {
              title: "Referenz",
              description: "Quellenreferenz mit Zitat",
              url: "URL",
              snippet: "Snippet",
            },
          },
          cached: {
            title: "Gecacht",
            description: "Ob Ergebnisse aus dem Cache bereitgestellt wurden",
          },
          timestamp: {
            title: "Zeitstempel",
            description: "Wann die Suche durchgeführt wurde",
          },
        },
        errors: {
          queryEmpty: {
            title: "Suchanfrage ist erforderlich",
            description: "Bitte geben Sie eine Suchanfrage ein",
          },
          queryTooLong: {
            title: "Suchanfrage ist zu lang",
            description: "Die Anfrage darf maximal 400 Zeichen lang sein",
          },
          timeout: {
            title: "Suchanfrage hat Zeitüberschreitung",
            description: "Die Suche hat zu lange gedauert",
          },
          searchFailed: {
            title: "Suche fehlgeschlagen",
            description: "Bei der Suche ist ein Fehler aufgetreten",
          },
          validation: {
            title: "Ungültige Suche",
            description:
              "Bitte überprüfen Sie Ihre Suchparameter und versuchen Sie es erneut",
          },
          internal: {
            title: "Etwas ist schief gelaufen",
            description:
              "Wir konnten Ihre Suche nicht abschließen. Bitte versuchen Sie es erneut",
          },
          notConfigured: {
            title:
              "{{label}} API-Schlüssel nicht konfiguriert. Fügen Sie {{envKey}}=<ihr-schlüssel> zu Ihrer .env-Datei hinzu. Holen Sie sich Ihren Schlüssel auf {{url}}",
            description:
              "Richten Sie {{label}} ein, um die Kagi-Suche zu aktivieren",
          },
        },
        success: {
          title: "Suche erfolgreich",
          description: "Die Kagi-Suche wurde erfolgreich abgeschlossen",
        },
      },
      tags: {
        search: "Suche",
        web: "Web",
        ai: "KI",
      },
    },
    enums: {
      provider: {
        BRAVE: "Brave-Suche",
        KAGI: "Kagi FastGPT",
      },
    },
  },
  speechToText: {
    category: "Agent",

    hotkey: {
      post: {
        title: "Sprache-zu-Text-Hotkey",
        titleShort: "STT-Hotkey",
        description:
          "Audio aufnehmen und transkribieren mit automatischer Texteinfügung",
        form: {
          title: "Hotkey-Konfiguration",
          description: "Sprache-zu-Text-Hotkey-Einstellungen konfigurieren",
        },
        action: {
          label: "Aktion",
          description: "Auszuführende Aktion (start/stop/toggle)",
          options: {
            start: "Starten",
            stop: "Stoppen",
            toggle: "Umschalten",
            status: "Status",
          },
        },
        provider: {
          label: "Anbieter",
          description: "KI-Anbieter für Transkription",
        },
        language: {
          label: "Sprache",
          description: "Sprache der Audiodatei",
        },
        insertPrefix: {
          label: "Präfix einfügen",
          description: "Text, der vor der Transkription eingefügt werden soll",
          placeholder: "z.B. '> '",
        },
        insertSuffix: {
          label: "Suffix einfügen",
          description: "Text, der nach der Transkription eingefügt werden soll",
          placeholder: "z.B. ' '",
        },
        response: {
          title: "Ergebnis",
          description: "Aufnahme- und Transkriptionsergebnis",
          success: "Erfolg",
          status: "Status",
          message: "Nachricht",
          text: "Transkribierter Text",
          recordingDuration: "Aufnahmedauer (ms)",
        },
        errors: {
          unauthorized: {
            title: "Nicht autorisiert",
            description:
              "Sie müssen angemeldet sein, um diese Funktion zu nutzen",
          },
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Anforderungsparameter",
          },
          server: {
            title: "Serverfehler",
            description: "Fehler beim Verarbeiten der Aufnahme",
          },
          conflict: {
            title: "Konflikt",
            description: "Aufnahme läuft bereits",
          },
          forbidden: {
            title: "Verboten",
            description:
              "Sie haben keine Berechtigung, diese Funktion zu nutzen",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Verbindung zum Transkriptionsdienst fehlgeschlagen",
          },
          notFound: {
            title: "Nicht gefunden",
            description: "Sitzung nicht gefunden",
          },
          unsaved: {
            title: "Nicht gespeicherte Änderungen",
            description: "Aufnahme läuft",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unerwarteter Fehler ist aufgetreten",
          },
          dependenciesMissing:
            "Erforderliche Abhängigkeiten nicht verfügbar: {missing}. {recommendations}",
          invalidAction: "Ungültige Aktion: {action}",
          actionFailed: "Fehler beim Ausführen der Aktion: {error}",
          alreadyRecording: "Aufnahme läuft bereits",
          notRecording: "Keine Aufnahme läuft",
        },
        success: {
          title: "Erfolg",
          description: "Vorgang erfolgreich abgeschlossen",
        },
      },
      tags: {
        ai: "KI",
        transcription: "Transkription",
        speech: "Sprache",
        hotkey: "Hotkey",
        cli: "CLI",
      },
      platforms: {
        macos: "macOS",
        linuxWayland: "Linux (Wayland)",
        linuxX11: "Linux (X11)",
        windows: "Windows",
      },
      status: {
        idle: "Leerlauf",
        recording: "Aufnahme",
        processing: "Verarbeitung",
        completed: "Abgeschlossen",
        error: "Fehler",
      },
      actions: {
        start: "Aufnahme starten",
        stop: "Aufnahme stoppen",
        toggle: "Aufnahme umschalten",
        status: "Status prüfen",
      },
      recorderBackends: {
        ffmpegAvfoundation: "FFmpeg (AVFoundation)",
        ffmpegPulse: "FFmpeg (PulseAudio)",
        ffmpegAlsa: "FFmpeg (ALSA)",
        ffmpegDshow: "FFmpeg (DirectShow)",
        wfRecorder: "wf-recorder",
        arecord: "arecord",
      },
      typerBackends: {
        applescript: "AppleScript",
        wtype: "wtype",
        xdotool: "xdotool",
        wlClipboard: "wl-clipboard",
        xclip: "xclip",
        powershell: "PowerShell",
      },
    },
    post: {
      title: "Sprache zu Text",
      description:
        "Konvertieren Sie Audio in Text mit KI-Transkription (0,013 Credits pro Sekunde, 0,78 Credits pro Minute)",
      form: {
        title: "Audio-Transkription",
        description:
          "Laden Sie eine Audiodatei zum Transkribieren hoch (0,013 Credits pro Sekunde, 0,78 Credits pro Minute)",
      },
      fileUpload: {
        title: "Audiodatei-Upload",
        description: "Laden Sie Ihre Audiodatei zur Transkription hoch",
      },
      audio: {
        label: "Audiodatei",
        description: "Zu transkribierende Audiodatei (MP3, WAV, WebM usw.)",
        validation: {
          maxSize: "Dateigröße muss unter 25 MB liegen",
          audioOnly: "Bitte laden Sie eine Audio- oder Videodatei hoch",
        },
      },
      provider: {
        label: "Anbieter",
        description: "KI-Anbieter für Transkription",
      },
      language: {
        label: "Sprache",
        description: "Sprache der Audiodatei",
      },
      response: {
        title: "Transkriptionsergebnis",
        description: "Der transkribierte Text aus Ihrer Audiodatei",
        success: "Erfolg",
        text: "Transkribierter Text",
        provider: "Verwendeter Anbieter",
        confidence: "Konfidenzwert",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description:
            "Sie müssen angemeldet sein, um diese Funktion zu nutzen",
        },
        validation: {
          title: "Validierungsfehler",
          description: "Die Audiodatei oder Parameter sind ungültig",
        },
        server: {
          title: "Serverfehler",
          description: "Fehler beim Verarbeiten der Transkription",
        },
        apiKeyMissing: "Eden AI API-Schlüssel ist nicht konfiguriert",
        transcriptionFailed: "Transkription fehlgeschlagen: {{error}}",
        audioTooShort:
          "Aufnahme zu kurz. Halte die Taste länger gedrückt und sprich deutlich.",
        noAudioFile: "Keine Audiodatei bereitgestellt",
        internalError: "Interner Serverfehler",
        noPublicId: "Keine öffentliche ID erhalten",
        pollFailed: "Fehler beim Abrufen der Transkriptionsergebnisse",
        failed: "Transkription fehlgeschlagen",
        timeout: "Transkriptions-Zeitüberschreitung",
        creditsFailed: "Fehler beim Abziehen der Credits: {{error}}",
        providerError:
          "Fehler beim Transkriptionsdienst. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support, wenn das Problem weiterhin besteht.",
        balanceCheckFailed:
          "Ihr Guthaben konnte nicht überprüft werden. Bitte versuchen Sie es erneut",
        insufficientCredits:
          "Sie haben nicht genügend Guthaben für diese Transkription. Bitte fügen Sie mehr Guthaben hinzu, um fortzufahren",
      },
      success: {
        title: "Erfolg",
        description: "Audio erfolgreich transkribiert",
        transcriptionComplete: "Transkription erfolgreich abgeschlossen",
      },
    },
    providers: {
      openai: "OpenAI Whisper",
      assemblyai: "AssemblyAI",
      deepgram: "Deepgram",
      google: "Google Speech-to-Text",
      amazon: "Amazon Transcribe",
      microsoft: "Microsoft Azure",
      ibm: "IBM Watson",
      rev: "Rev.ai",
    },
    languages: {
      en: "Englisch",
      de: "Deutsch",
      pl: "Polnisch",
      es: "Spanisch",
      fr: "Französisch",
      it: "Italienisch",
    },
    models: {
      descriptions: {
        openaiWhisper: "OpenAI Whisper",
        deepgramNova2: "Deepgram Nova-2",
      },
    },
  },
  textToSpeech: {
    category: "Agent",
    tags: {
      speech: "Sprache",
      tts: "Text-zu-Sprache",
      ai: "KI",
    },

    post: {
      title: "Text zu Sprache",
      description:
        "Konvertieren Sie Text in natürlich klingende Sprache mit KI (~0,00052 Credits pro Zeichen)",
      form: {
        title: "Text-zu-Sprache-Konvertierung",
        description:
          "Geben Sie Text ein, um ihn in Sprache umzuwandeln (OpenAI TTS: ~0,00052 Credits pro Zeichen)",
      },
      text: {
        label: "Text",
        description: "In Sprache umzuwandelnder Text",
        placeholder:
          "Geben Sie den Text ein, den Sie in Sprache umwandeln möchten...",
      },
      voice: {
        label: "Stimme",
        description: "Stimmmodell für Sprachsynthese",
      },
      response: {
        title: "Audio-Ergebnis",
        description: "Die generierte Sprachaudio",
        success: "Erfolg",
        audioUrl: "Audio-URL",
      },
      errors: {
        validation_failed: {
          title: "Validierungsfehler",
          description: "Der angegebene Text oder die Parameter sind ungültig",
        },
        network_error: {
          title: "Netzwerkfehler",
          description: "Verbindung zum Server fehlgeschlagen",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description:
            "Sie müssen angemeldet sein, um Text-zu-Sprache zu verwenden",
        },
        forbidden: {
          title: "Verboten",
          description:
            "Sie haben keine Berechtigung, Text-zu-Sprache zu verwenden",
        },
        not_found: {
          title: "Nicht gefunden",
          description: "Die angeforderte Ressource wurde nicht gefunden",
        },
        server_error: {
          title: "Serverfehler",
          description:
            "Beim Konvertieren von Text zu Sprache ist ein Fehler aufgetreten",
        },
        unknown_error: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        unsaved_changes: {
          title: "Nicht gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Änderungen",
        },
        conflict: {
          title: "Konflikt",
          description: "Ein Konflikt ist aufgetreten",
        },
        notConfigured:
          "{{label}} API-Schlüssel nicht konfiguriert. Fügen Sie {{envKey}}=<ihr-schlüssel> zu Ihrer .env-Datei hinzu. Holen Sie sich Ihren Schlüssel auf {{url}}",
        conversionFailed: "Sprachsynthese fehlgeschlagen: {{error}}",
        noText: "Kein Text angegeben",
        noAudioUrl: "Keine Audio-URL vom Anbieter erhalten",
        audioFetchFailed: "Fehler beim Abrufen der Audiodatei",
        providerError: "Anbieterfehler: {{error}}",
        internalError: "Interner Serverfehler",
        unsupportedProvider:
          "Nicht unterstützter TTS-Anbieter für Stimme: {{voiceId}}",
        creditsFailed: "Fehler beim Abziehen der Credits: {{error}}",
        balanceCheckFailed:
          "Ihr Guthaben konnte nicht überprüft werden. Bitte versuchen Sie es erneut",
        insufficientCredits:
          "Sie haben nicht genügend Credits für diese Konvertierung. Bitte fügen Sie weitere Credits hinzu, um fortzufahren",
      },
      success: {
        title: "Erfolg",
        description: "Text erfolgreich in Sprache umgewandelt",
        conversionComplete: "Sprachsynthese erfolgreich abgeschlossen",
      },
    },
    languages: {
      en: "Englisch",
      de: "Deutsch",
      pl: "Polnisch",
      es: "Spanisch",
      fr: "Französisch",
      it: "Italienisch",
    },
    models: {
      descriptions: {
        openaiAlloy: "OpenAI Alloy",
        openaiNova: "OpenAI Nova",
        openaiOnyx: "OpenAI Onyx",
        openaiEcho: "OpenAI Echo",
        openaiShimmer: "OpenAI Shimmer",
        openaiFable: "OpenAI Fable",
        elevenlabsRachel: "ElevenLabs Rachel",
        elevenlabsJosh: "ElevenLabs Josh",
        elevenlabsBella: "ElevenLabs Bella",
        elevenlabsAdam: "ElevenLabs Adam",
      },
    },
  },
};
