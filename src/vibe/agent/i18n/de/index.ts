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
          "Modell oder Skill erforderlich - direkt angeben oder favoriteId mit auflösbarer Modellauswahl bereitstellen",
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
              "UUID eines gespeicherten Favoriten zum Laden von Modell und Skill.",
          },
          modelId: {
            title: "Modell-ID",
            description: "KI-Modell für den fortgesetzten Schritt.",
          },
          skillId: {
            title: "Skill-ID",
            description: "Skill/Persona für den fortgesetzten Schritt.",
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
      characters: "Skills",
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
          note: "Während Inkognito-Sitzungen werden keine Daten auf unseren Servern gespeichert (generierte Medien speichern wir aus technischen Gründen vorübergehend).",
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
            "Erhalten Sie {{credits}} Credits/Monat mit einem Abonnement für nur {{price}}/Monat. Kostenlose Konten erhalten {{freeCredits}} Credits/Monat, mit Newsletter {{freeCreditsMax}}.",
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
      switchSkill: "Skill wechseln",
      editSkill: "Skill bearbeiten",
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
      characterSetup: "Skill-Setup",
      noResults: "Keine Ergebnisse",
      add: "Zu Favoriten hinzufügen",
      added: "Hinzugefügt",
      addNew: "Neu hinzufügen",
      searchSkills: "Skills suchen...",
      createCustom: "Benutzerdefiniert erstellen",
      customizeSettings: "Einstellungen anpassen",
      requirements: {
        characterConflict: "Skill-Anforderungskonflikte",
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
        placeholder: "Skill auswählen",
        addNewLabel: "Benutzerdefiniertes Skill erstellen",
        grouping: {
          bySource: "Nach Quelle",
          byCategory: "Nach Kategorie",
          sourceLabels: {
            builtIn: "Integriert",
            my: "Meine Skills",
            community: "Community",
          },
          sourceIcons: {
            builtIn: "sparkles",
            my: "user",
            community: "people",
          },
        },
        addDialog: {
          title: "Benutzerdefiniertes Skill erstellen",
          fields: {
            name: {
              label: "Name",
              placeholder: "Skill-Name eingeben",
            },
            icon: {
              label: "Symbol (Emoji)",
              placeholder: "😊",
            },
            description: {
              label: "Beschreibung",
              placeholder: "Kurze Beschreibung das Skill",
            },
            systemPrompt: {
              label: "System-Prompt",
              placeholder: "Definieren Sie, wie sich die Skill verhält...",
            },
            category: {
              label: "Kategorie",
            },
          },
          createCategory: "Kategorie erstellen",
          cancel: "Abbrechen",
          create: "Skill erstellen",
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
      retry: "Mit anderem Modell/Skill wiederholen",
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
          "Das eigene Modell von Uncensored.ai und die andere Sorte unzensiert. Der Rest dieser Stufe sind Mainstream-Modelle ohne Verweigerungen: gleiches Training, gleiches Weltbild. Dieses hat ein eigenes. Uncensored.ai stimmt es darauf ab, der Beweislage statt der offiziellen Linie zu folgen, nach eigenen Worten „biased to reality“. Politische Positionen gegen den Mainstream sind hier die Regel. Die Wahl für Politik, andere Perspektiven und düstere, tabuisierte Fiktion: keine entschärften Szenen, keine Moralpredigt, keine Rücklenkung auf die Konsenslinie. Ruft Tools auf, 32K Kontext, nur Text. Experimentell, nichts für Code, und umstrittene Behauptungen klingen bei ihm so sicher wie belegte, also Fakten prüfen.",
        freedomgptLiberty:
          "Das unzensierte Flaggschiff von Age of AI und der Free-Speech-Chatbot, mit dem die Kategorie begann. Basiert auf offenen Gewichten, abgestimmt auf direkte Antworten ohne Belehrung. Schnell und schlagfertig, 32K Kontext. Schwach bei Tools, Code und tiefer Analyse: Dort ist Qwen 3.6 Plus Uncensored stärker. Für ein anderes Weltbild statt nur weniger Verweigerungen: UncensoredLM.",
        gabAiArya:
          "Der unzensierte Assistent von Gab, vom Hersteller selbst politisch rechts verortet und darauf ausgelegt, ohne die üblichen Leitplanken zu antworten. Intelligent, 131K Kontext, liest Bilder und Videos, ruft Tools auf. Die Wahl, wenn du genau diese Ausrichtung willst; UncensoredLM ist das andere Modell hier mit eigenem Weltbild. Schwächer beim Programmieren, das Basismodell ist nicht offengelegt.",
        gemini31ProPreviewCustomTools:
          "Die Custom-Tools-Preview von Gemini 3.1 Pro, darauf abgestimmt, eigene definierte Tools aufzurufen statt auf Bash auszuweichen. Gemacht für Coding-Agenten und Workflows mit vielen Tools, mit 1M Kontext und Eingabe von Text, Bild, Video und Audio. Ein Preview-Build. Gemini 4 Argon ist die neuere Pro-Klasse zum ähnlichen Preis.",
        gemini31FlashImagePreview:
          "Googles Gemini 3.1 Flash Image, noch als Preview. Erzeugt und bearbeitet Bilder direkt im Chat, Text und Bild in derselben Antwort. Das günstigste Bildmodell im Katalog. Mainstream-Filter, keine Tool-Aufrufe, 64K Kontext. Für komplexe Prompts und saubereren Text im Bild ist Nano Banana Pro teurer, aber stärker. Legacy: Nano Banana 2.1 löst es ab, zum etwa halben Bildpreis.",
        gemini31FlashLitePreview:
          "Googles Sparmodell für hohes Volumen, noch als Preview: Übersetzung, Ranking, Extraktion und schneller Chat über 1M Kontext, mit Text-, Bild-, Video- und Audioeingabe. Günstig und schnell, aber nicht für schweres Reasoning gebaut. Kostet weiterhin weniger als der Nachfolger Gemini 3.5 Flash Lite.",
        gemini3Pro:
          "Google Gemini 3 Pro - Fortgeschrittenes multimodales KI-Modell mit großem Kontextfenster und leistungsstarken Reasoning-Fähigkeiten",
        gemini35Flash:
          "Googles Flash-Modell, beworben mit Coding und Reasoning nahe Pro-Niveau, mit einstellbaren Denkstufen, 1M Kontext und Eingabe von Text, Bild, Video und Audio. Solide, doch Gemini 3.8 Flash ist neuer und kostet etwa die Hälfte. Ein Wechsel lohnt sich.",
        gemini3Flash:
          "Das erste Gemini 3 Flash von Google: schnell, fähig bei Code und Alltags-Reasoning, 1M Kontext, Eingabe von Text, Bild, Video und Audio. Weiterhin preiswert und günstiger als der Nachfolger. Wer das neueste Flash will, nimmt Gemini 3.8 Flash.",
        deepseekV32:
          "DeepSeeks Open-Weight-Modell von Ende 2025 mit Sparse Attention, die Arbeit mit langem Kontext günstiger macht. Ein Mixture-of-Experts mit 671B Parametern, stark bei Code und Analyse für sehr wenig Geld, nur Text. DeepSeek V4.1 Flash ist neuer und noch günstiger.",
        deepseekV4Pro:
          "Das Open-Weight-Flaggschiff von DeepSeek: Mixture-of-Experts mit 1.6T Parametern, davon 49B aktiv, MIT-Lizenz. Tiefes Reasoning, ernsthafter Code, Analyse ganzer Codebasen und mehrstufige Agentenarbeit, 1M Kontext, ruft Tools auf. Nur Text. Kostet einen Bruchteil von Claude Opus 5.5. Für schnelle, günstige Alltagsarbeit gibt es DeepSeek V4.1 Flash.",
        deepseekV4Flash:
          "DeepSeeks Flash-Modell, ein Mixture-of-Experts mit 284B Parametern: 1M Kontext, schnell, stark im Code, fast kostenlos pro Nachricht. Nur Text. Der Nachfolger DeepSeek V4.1 Flash kostet gleich viel, also besser wechseln, außer genau diese Version wird gebraucht.",
        gpt55:
          "Früheres Spitzenmodell von OpenAI: starkes Reasoning, Coding und Analyse über 1M Kontext, mit Text- und Bildeingabe. Weiterhin leistungsfähig, aber teuer. GPT-6.1 Sol erledigt dieselben Aufgaben heute deutlich günstiger. Schwach im Rollenspiel.",
        gpt55Pro:
          "Pro-Stufe von GPT-5.5 mit erweitertem Reasoning, die für schwierige Probleme mit hohem Einsatz deutlich mehr Rechenzeit aufwendet. Eines der teuersten Modelle im Katalog und nur sinnvoll, wenn eine falsche Antwort mehr kostet als die Nachricht. Neuere Wahl: GPT-6 Astra, für etwa ein Drittel des Preises.",
        gpt54Pro:
          "Pro-Variante von GPT-5.4 mit maximalem Rechenaufwand für schweres Reasoning, Recherche und kritische Analysen über 1M Kontext. Langsam und eines der teuersten Modelle hier. GPT-6 Astra deckt dasselbe für etwa ein Drittel des Preises ab.",
        gpt54:
          "Das OpenAI-Modell, das Coding auf Codex-Niveau in die GPT-Hauptlinie holte, mit 1M Kontext und Bildeingabe. Solide für lange Dokumente, Code und Analyse. GPT-6.1 Sol ist neuer, eine Stufe höher eingeordnet und pro Nachricht günstiger. Ein Wechsel lohnt sich.",
        gpt53Codex:
          "OpenAIs Spezialist für agentisches Coding: lange, toolintensive Entwicklungssitzungen, Refactorings und Debugging bei 400K Kontext. Stark im Code, schwach bei kreativem Schreiben und Rollenspiel. GPT-6.1 Sol übernimmt Coding heute zum ähnlichen Preis und kann darüber hinaus mehr.",
        gpt53Chat:
          "GPT-5.3 Chat - Aktualisiertes ChatGPT-Konversationsmodell mit präziseren Antworten und deutlich weniger unnötigen Einschränkungen",
        gpt52Pro:
          "GPT-5.2 mit erweitertem Reasoning für die härtesten Fälle: tiefe Recherche, knifflige Mathematik, sorgfältige Code-Reviews. Langsam und sehr teuer. GPT-6 Astra ist die aktuelle Pro-Klasse und kostet deutlich weniger als die Hälfte.",
        gpt52:
          "OpenAIs Arbeitstier von Ende 2025 für professionelle Aufgaben: Coding, lange Dokumente und strukturierte Analysen, 400K Kontext, Bildeingabe. Zuverlässig, aber nicht mehr das beste Preis-Leistungs-Verhältnis. GPT-6.1 Sol kostet etwa gleich viel und ist neuer.",
        gpt52_chat:
          "Die schnelle Chat-Variante von GPT-5.2 im ChatGPT-Stil: zügige Antworten ohne langes Nachdenken, 128K Kontext. Gut für Alltagschat und Entwürfe. Weniger Kontext als die Geschwistermodelle, und GPT-6.1 Terra erledigt das heute zum halben Preis.",
        dolphin3_0_r1_mistral_24b:
          "Dolphin 3.0 R1 Mistral 24B - Unzensiertes großes Sprachmodell basierend auf Mistral",
        dolphinLlama3_70B:
          "Dolphin Llama 3 70B - Unzensiertes großes Sprachmodell basierend auf Llama 3",
        veniceUncensored:
          "Das hauseigene unzensierte Modell von Venice: Dolphin Mistral 24B in der Venice Edition. Eine der niedrigsten Verweigerungsraten überhaupt. Fiktion, offene Gespräche ohne Filter. Liest Bilder, 128K Kontext, günstig. Ein Feintuning gegen Zensur: Verweigerungen weg, Mistrals Weltbild bleibt bei Politik und den düstersten Szenen. Für ein anderes Weltbild: UncensoredLM. Schwach bei Code und anspruchsvoller Analyse, dafür eignet sich Qwen 3.6 Plus Uncensored.",
        veniceUncensoredRoleplay:
          "Das 24B-Modell von Venice, abgestimmt auf Rollenspiel, Verweigerungen abtrainiert. Figuren behalten ihre Stimme über lange Kampagnen, ohne moralischen Abbruch mitten in der Geschichte. Liest Bilder, 128K Kontext. Verweigerungen entfernt, Weltbild des Basismodells behalten: Beim düstersten und tabuisierten Material geht UncensoredLM weiter, dieses hier punktet bei langen Kampagnen und Bildeingabe. Ein Erzähler, kein Assistent, also nichts für Analyse oder Code.",
        gemma4Uncensored:
          "Googles Gemma 4 26B als Mixture-of-Experts, Filter entfernt, bereitgestellt über Venice. Schnell, günstig, liest Bilder, ruft Tools auf, 256K Kontext. Verweigerungen herausgeschnitten, Googles Training und Weltbild behalten: Bei heiklen Themen antwortet es, mit Googles Einordnung. Für anspruchsvolleres Reasoning ohne Verweigerungen kostet GLM 5.3 Flash Uncensored etwas mehr und leistet deutlich mehr.",
        qwen36PlusUncensored:
          "Alibabas Reasoning-Modell Qwen 3.6 Plus ohne Verweigerungen, bereitgestellt über Venice. Einer der stärksten Programmierer und Analysten unter den unzensierten Modellen. Liest Bilder, ruft Tools auf, 256K Kontext. Es verweigert nicht mehr, doch Qwens Training und Weltbild bleiben; für einen anderen Blick auf Politik hat UncensoredLM ein eigenes. Teurer als die Flash-Modelle. Das andere Schwergewicht ist GLM 5.3 Uncensored, mit 1M Kontext, aber nur Text.",
        glm47FlashHeretic:
          "Ein abliteriertes GLM 4.7 Flash: Verweigerungen herausgelöst, es antwortet statt zu belehren. Centbeträge pro Nachricht, schnell, mit Tools, gut für ungefilterten Chat und kreatives Schreiben. Gleiches Training, gleiches Weltbild wie das Basis-GLM: Es weicht nur nicht mehr aus. Schwach bei tiefer Analyse. GLM 5.3 Flash Uncensored ist die neuere, klügere unzensierte Wahl, etwas teurer.",
        glm53Abliterated:
          "Das volle GLM 5.3, dem Abliteration.ai die Verweigerungen direkt aus den Gewichten entfernt hat. Spitzen-Reasoning, Tools, 1M Kontext. Das Schwergewicht. Keine Absagen mehr, Training und Grundhaltung des Basis-GLM bleiben.",
        deepseekV41FlashAbliterated:
          "DeepSeek V4.1 Flash ohne Verweigerungen, von Abliteration.ai. 552B-MoE, starkes Reasoning, versteht Bilder, nutzt Tools. 1M Kontext. Es sagt nicht mehr nein, die Sichtweise von DeepSeek bleibt.",
        mimoV26FlashAbliterated:
          "Xiaomis MiMo V2.6 Flash mit entfernter Verweigerungsrichtung (abliterated). Schnell, liest Bilder, ruft Tools auf, 1M Kontext. Gut für ungefilterte Arbeit in großen Mengen, tauscht aber Tiefe gegen Tempo, und das Weltbild des Basismodells bleibt. Kostet mehr als das Doppelte von GLM 5.3 Flash Uncensored, das ein ähnliches Feld abdeckt.",
        glm53Uncensored:
          "Das vollständige Reasoning-Modell GLM 5.3 von Z.AI, Verweigerungen entfernt. Das Schwergewicht unter den unzensierten Modellen: Code, lange Texte, Analyse und Tools, 1M Kontext. Verweigerungen entfernt, Weltbild unangetastet: Bei Politik antwortet es mit der Einordnung des Basis-GLM. Für politische Positionen gegen den Mainstream: UncensoredLM. Nur Text, langsamer als die Flash-Modelle, weiterhin experimentell. GLM 5.3 Flash Uncensored ist die günstigere, schnellere Alltagswahl.",
        glm53FlashUncensored:
          "GLM 5.3 Flash von Z.AI ohne Verweigerungen: ein Mixture-of-Experts mit 320B Parametern. Schnell, günstig, liest Bilder, ruft Tools auf, 1M Kontext. Das Alltagsmodell für ungefilterte Arbeit. Es weicht nicht mehr aus, Training und Weltbild des Basis-GLM bleiben, auch bei Politik; ein anderes Weltbild hat UncensoredLM. Für die härtesten Denkaufgaben lieber zum vollen GLM 5.3 Uncensored greifen.",
        veniceLustifyV8:
          "Ein SDXL-Checkpoint, getrimmt auf fotorealistische Erwachseneninhalte, bereitgestellt über Venice.ai. Unzensiert: kein Weichzeichner, keine Ablehnungen. Eines der günstigsten Bildmodelle im Angebot. Gebaut für Körper und Haut, nicht für Text im Bild, komplexe Szenen oder Kunststile; Chroma bietet mehr künstlerische Bandbreite.",
        veniceChroma:
          "Ein Open-Weight-Modell auf Basis von FLUX.1 schnell, ohne Inhaltsfilter neu trainiert und über Venice.ai bereitgestellt. Kommt mit langen Prompts und vielen Kunststilen klar, explizite Inhalte eingeschlossen. Günstig pro Bild. Bei fotorealistischer Nacktheit weniger spezialisiert als Lustify v8 und nur mit Texteingabe; zum Überarbeiten vorhandener Bilder Qwen Edit Uncensored nutzen.",
        veniceQwenEdit:
          "Unzensierte Bildbearbeitung auf Basis von Alibabas Qwen-Bildbearbeitungsmodell, bereitgestellt über Venice.ai. Referenzbild plus Anweisung genügt: Elemente austauschen, Stil ändern, Outfits wechseln, Szenen umbauen. Kein Weichzeichner, keine Ablehnungen. Teurer als Chroma oder Lustify v8, die nur aus Text generieren.",
        veniceFireredImageEdit:
          "Ein promptgesteuerter Bildeditor, bereitgestellt über Venice.ai. Änderung beschreiben, er setzt genau diese um und lässt den Rest des Bildes unangetastet. Unzensierte Stufe ohne Ablehnungen, anders als Qwen Edit Uncensored aber nicht für explizite Ausgaben ausgewiesen. Gleicher Preis wie Qwen Edit; bei schwierigen Bearbeitungen beide testen.",
        claudeOpus45:
          "Anthropics Opus vom November 2025, damals eines der besten Modelle für Coding und Agenten und das erste Opus mit deutlich gesenktem Preis. Stark bei sorgfältigen Texten und komplexem Code, 200K Kontext. Vorsichtig bei kontroversen Themen. Claude Opus 5.5 ist neuer und günstiger.",
        claudeOpus46:
          "Anthropics Opus vom Februar 2026, das erste Opus mit 1M Kontextfenster. Stark bei langem agentischem Coding, tiefer Analyse und sorgfältigem Schreiben. Premium-Preis, Mainstream-Filter, vorsichtig bei kontroversen Themen. Claude Opus 5.5 ist neuer und günstiger.",
        claudeOpus47:
          "Ein Opus-Release von 2026 zwischen 4.6 und 4.8: tiefes Reasoning, komplexes Coding und lange Texte über 1M Kontext. Teuer und vorsichtig bei kontroversen Themen. Claude Opus 5.5 löst es ab und kostet pro Nachricht weniger.",
        claudeOpus48:
          "Das letzte Opus-4-Release, gebaut für lange Agentenarbeit, komplexes Coding und sehr lange Ausgaben über 1M Kontext, mit Bildeingabe. Premium-Preis, Mainstream-Filter, vorsichtig bei kontroversen Themen. Claude Opus 5.5 ist neuer und günstiger.",
        claudeSonnet46:
          "Anthropics Sonnet aus Anfang 2026, ein Upgrade gegenüber 4.5 bei Coding, Agenten und Büroarbeit, mit 1M Kontext. Mainstream-Filter, vorsichtig bei kontroversen Themen. Claude Sonnet 5.5 löst es ab und kostet pro Nachricht weniger.",
        claudeHaiku45:
          "Anthropics kleines Modell vom Oktober 2025: schnell, gut bei alltäglichem Coding und beim Lesen von Bildern, 200K Kontext. Mainstream-Filter, zurückhaltend bei heiklen Themen. Claude Haiku 5.5 kostet heute etwa ein Zehntel, der Wechsel fällt also leicht.",
        glm5_1:
          "Z.AIs Coding-Modell für lange Aufgaben, beworben damit, stundenlang an einer einzigen Aufgabe dranzubleiben. Stark bei Planung, Code und mehrstufigen Agenten-Läufen, 200K Kontext, nur Text, lockere Filter. GLM-5.3 ist neuer und kostet einen Bruchteil, liegt aber eine Stufe tiefer. Kimi K3 ist die stärkere aktuelle offene Wahl.",
        glm5: "Z.AIs Open-Weight-Flaggschiff aus Anfang 2026, gebaut für Systemdesign und lange Agenten-Workflows. Starkes Reasoning und Coding, lockere Filter, 200K Kontext, nur Text. GLM-5.3 ist neuer und viel günstiger, liegt aber eine Intelligenzstufe tiefer. Kimi K3 ist die stärkere offene Alternative.",
        glm5Turbo:
          "Ein schnelleres GLM-5, abgestimmt auf Agenten-Schleifen: zügige Inferenz, saubere Zerlegung von Aufgaben, stabile lange Läufe. Gut für toolintensive Automatisierung mit 200K Kontext, nur Text, lockere Filter. GLM-5.3 erledigt Ähnliches heute für einen Bruchteil des Preises.",
        glm46:
          "Z.AIs Release vom September 2025, das den Kontext auf 200K anhob und Coding sowie Agenten-Nutzung verbesserte. Weiterhin ein ordentlicher zweisprachiger Allrounder, lockere Filter, nur Text. GLM-5.3 ist neuer und günstiger.",
        glm47:
          "Z.AIs Release vom Dezember 2025, ein solider zweisprachiger Allrounder für Chinesisch und Englisch mit besserem Coding und Reasoning als 4.6. Gut für Chat, Analyse und Agenten-Aufgaben, 200K Kontext, nur Text, lockere Filter. GLM-5.3 ist neuer und kostet etwa ein Viertel.",
        glm47Flash:
          "Das kleine, schnelle GLM 4.7 und eines der günstigsten Modelle hier. Gut für schnellen Chat, einfache Tool-Aufrufe und Textarbeit in Masse mit 200K Kontext. Schwach bei tiefem Reasoning. GLM-5.3 Flash ist neuer, kostet aber etwa das Doppelte.",
        kimiK2:
          "Moonshot AIs Open-Weight-Modell vom Juli 2025, ein Mixture-of-Experts mit 1T Parametern, bekannt geworden durch agentische Tool-Nutzung und Coding. Schnell, lockere Filter, 262K Kontext, nur Text. Kein Denkmodus. Kimi K3 ist das neuere Flaggschiff zum etwa doppelten Preis.",
        kimiK2_5:
          "Moonshots Kimi vom Januar 2026, nativ multimodal mit Bildeingabe. Stark bei Coding mit langem Kontext, Code aus Screenshots und kreativem Schreiben, lockere Filter, 262K Kontext. Kimi K3 ist neuer, kostet aber etwa das Doppelte.",
        kimiK2_6:
          "Moonshots Kimi K2.6, ausgerichtet auf langes Coding, UIs aus Prompts oder Screenshots und viele parallel laufende Sub-Agenten. Schnell und klug, Bildeingabe, 262K Kontext, lockere Filter. Kimi K3 ist neuer, aber teurer.",
        claudeSonnet45:
          "Anthropics Sonnet vom September 2025, bekannt für starkes Coding und lange autonome Agenten-Sitzungen. Weiterhin gut für Code und Texte, hier mit 1M Kontext. Vorsichtig bei kontroversen Themen, schwach im Rollenspiel. Claude Sonnet 5.5 ist neuer und pro Nachricht günstiger.",
        claudeAgentSonnet:
          "Claude Agent Sonnet - Autonomer KI-Agent mit Claude Sonnet über Anthropics Agent SDK. Führt Tools selbstständig mit integriertem Reasoning aus.",
        claudeAgentHaiku:
          "Claude Agent Haiku - Schneller autonomer KI-Agent mit Claude Haiku über Anthropics Agent SDK. Optimiert für Geschwindigkeit mit Tool-Ausführung.",
        claudeAgentOpus:
          "Claude Agent Opus - Leistungsstärkster autonomer KI-Agent mit Claude Opus über Anthropics Agent SDK. Maximale Intelligenz mit Tool-Ausführung.",
        grok4:
          "xAIs Flaggschiff vom Juli 2025, ein Reasoning-Modell, das vor jeder Antwort nachdenkt. Stark in Mathematik, Naturwissenschaft und Analyse, mit lockereren Inhaltsfiltern als die meisten Mainstream-Modelle. Langsamer als reine Chat-Modelle. Aktueller Grok ist Grok 4.7, zu höherem Preis.",
        grok4Fast:
          "Die frühere Tempo-Variante von Grok. xAI hat die günstige Fast-Stufe eingestellt, unter diesem Namen läuft jetzt Grok 4.3 zum Grok-4.3-Preis. Bildeingabe, Tool-Aufrufe, 1M Kontext, offene Inhaltsrichtlinie. Nachfolger ist Grok 4.7: deutlich stärkeres Reasoning bei etwa doppeltem Output-Preis. Für günstigen Schnellchat kosten MiniMax M3.1 Flash oder DeepSeek V4.1 Flash nur einen Bruchteil.",
        grok43:
          "Spätere Grok-4-Version mit dauerhaft aktivem Reasoning und 1M Kontext, ausgelegt auf Agenten-Workflows und tiefe Recherche. Lockere Filter, Tool-Nutzung, Bildeingabe. Gleicher Preis wie Grok 4 und günstiger als Grok 4.7, die neuere Wahl für alle, die das Aktuellste wollen.",
        grok420Beta:
          "xAIs früheres Flaggschiff mit 2M Kontextfenster, agentischem Tool-Calling und Bildeingabe. Gut für riesige Dokumente und lange Agenten-Läufe bei lockeren Filtern. Grok 4.7 ist neuer, kostet aber mehr.",
        gpt5Pro:
          "GPT-5 mit erweitertem Reasoning, OpenAIs Antwort von 2025 auf die schwersten Fragen. Gründlich, aber langsam und für eine ältere Generation sehr teuer. GPT-6 Astra ist die aktuelle Pro-Wahl und kostet weniger.",
        gpt5Codex:
          "GPT-5 Codex - OpenAIs spezialisiertes Coding-Modell mit außergewöhnlichen Programmier- und technischen Fähigkeiten",
        gpt51Codex:
          "GPT-5.1, abgestimmt auf agentisches Coding in OpenAIs Codex: lange Schleifen aus Bearbeiten, Ausführen und Korrigieren in echten Repositories, 400K Kontext. Für Code preislich fair. Weniger geeignet für freien Chat oder Texte, und das neuere GPT-6.1 Sol ist inzwischen weiter.",
        gpt51:
          "OpenAIs Update von GPT-5 vom November 2025: adaptives Reasoning, das nur bei schweren Fragen länger nachdenkt, dazu ein wärmerer Gesprächston. Weiterhin ein brauchbares Allround-Modell mit 400K Kontext und Bildeingabe. GPT-6.1 Sol ist neuer und schärfer, kostet aber etwas mehr.",
        gpt5: "OpenAIs Flaggschiff vom August 2025, das schnelle Antworten und tiefes Reasoning in einem Modell vereinte. Weiterhin ein fähiger Allrounder für Chat, Texte und Code, mit 400K Kontext und Bildeingabe. Aktuelle OpenAI-Wahl ist GPT-6.1 Sol: neuer und stärker, pro Nachricht etwas teurer.",
        gpt54Mini:
          "Die kleinere Ausführung von GPT-5.4: ordentliches Reasoning, Coding und Tool-Nutzung zum niedrigeren Preis, 400K Kontext und Bildeingabe. Gut für viel Chat-Volumen und Sub-Agenten. GPT-6 Luna ist neuer und pro Nachricht viel günstiger, aber stärker auf Tempo als auf Tiefe ausgelegt.",
        gpt54Nano:
          "Das kleinste GPT-5.4, gebaut für Klassifizierung, Datenextraktion und schnelle Sub-Agenten-Aufrufe. Günstig, flott, mit Tools und Bildeingabe. Für echte Analysen zu flach. GPT-6 Luna ist die neuere Sparoption und noch günstiger.",
        gpt5Mini:
          "Das kompakte GPT-5 für schnelle Alltagsaufgaben: kurze Antworten, Zusammenfassungen, einfache Tool-Aufrufe, 400K Kontext. Günstig und flott, aber dünn bei tiefer Analyse. GPT-6 Luna ist neuer und kostet etwa ein Drittel.",
        gpt5Nano:
          "Das kleinste GPT-5 und weiterhin eines der günstigsten Modelle hier. Taugt für Klassifizierung, Tagging und kurze Antworten in großer Menge. Nicht für Code oder echte Analyse. GPT-6 Luna ist das neuere Sparmodell, etwas teurer.",
        gptOss120b:
          "Das Open-Weight-Modell von OpenAI: 117B Parameter insgesamt, Mixture-of-Experts, Apache-2.0-Lizenz. Ordentlicher Denker und Programmierer für wenige Cent, ruft Tools auf, 131K Kontext. Nur Text. Lockerere Filter als die GPT-6-Reihe, aber nicht unzensiert. GLM-5.3 kostet ungefähr gleich viel und bietet 1M Kontext.",
        kimiK2Thinking:
          "Die Reasoning-Version von Kimi K2 vom November 2025, gebaut, um über Hunderte verketteter Tool-Aufrufe hinweg weiterzudenken, ohne den Faden zu verlieren. Gut für Recherche und mehrstufige Agentenarbeit zum kleinen Preis, lockere Filter. Nur Text und langsamer als das normale K2. Neuere Wahl: Kimi K3.",
        minimaxM27:
          "MiniMax' agentenorientiertes Modell für praktische Arbeit: Debugging, Finanzmodellierung, Dokumenterstellung und Multi-Agenten-Läufe. Klug und günstig, 196K Kontext, nur Text, lockere Filter. Nachfolger ist MiniMax M3.1 Flash: stärker, multimodal, 1M Kontext und günstiger.",
        mimoV2Pro:
          "Xiaomis Flaggschiff der MiMo-V2-Reihe, gebaut für Agenten-Orchestrierung und lange Engineering-Workflows mit 1M Kontext. Starkes Reasoning und Coding zum kleinen Preis, nur Text, lockere Filter. MiMo V2.6 Pro ist neuer und etwas günstiger.",
        glm45Air:
          "Das leichte GLM 4.5, ein Mixture-of-Experts mit 106B Parametern, von denen nur 12B aktiv sind. Antworten kommen daher schnell und günstig. Gut für lockeren Chat und einfache Aufgaben, 128K Kontext, nur Text. Veraltetes Reasoning. GLM-5.3 Flash ist neuer und günstiger.",
        glm45v:
          "Z.AIs Vision-Modell auf Basis von GLM-4.5-Air, einem Mixture-of-Experts mit 106B Parametern. Liest Screenshots, Diagramme und Fotos, chattet und nutzt Tools. Nur 64K Kontext und veraltetes Reasoning. GLM-5.3 Flash ist die neuere, günstigere Z.AI-Wahl.",
        geminiFlash25Lite:
          "Googles günstigstes Gemini von 2025: Centbeträge pro Nachricht, 1M Kontext, Eingabe von Text, Bild, Video und Audio. Ideal für Tagging, Übersetzung und kurze Antworten in Masse, flach beim Reasoning. Gemini 3.5 Flash Lite ist neuer, kostet aber fast das Vierfache. Dieses Modell hat also weiter seinen Platz.",
        geminiFlash25Flash:
          "Googles hybrides Flash-Modell von 2025 mit steuerbarem Denkbudget, 1M Kontext und Eingabe von Text, Bild, Video und Audio. Weiterhin günstig und schnell für Zusammenfassungen und Alltagschat. Gemini 3.8 Flash ist neuer und klüger, kostet aber etwa das Doppelte.",
        geminiFlash25Pro:
          "Googles Denkmodell von 2025 mit 1M Kontext, damals stark bei der Analyse langer Dokumente und bei Code. Heute klar eine Generation zurück. Gemini 4 Argon ist die aktuelle Pro-Klasse, etwas teurer.",
        deepseekV31:
          "DeepSeeks Hybridmodell vom August 2025, das zwischen schnellen Antworten und schrittweisem Nachdenken wechselt. Ein fähiger, günstiger Coder auf Basis eines Open-Weight-Mixture-of-Experts mit 671B Parametern, nur Text. DeepSeek V4.1 Flash ist neuer und kostet etwa ein Drittel.",
        deepseekR1:
          "Das Open-Weight-Reasoning-Modell vom Januar 2025, das bewies, dass sichtbares Nachdenken günstig sein kann. Weiterhin solide für Mathematik und Logik, aber langsam, wortreich und zurückhaltend bei politischen Themen, die in China als heikel gelten. DeepSeek V4.1 Flash ist neuer und kostet einen Bruchteil.",
        qwen3235bFree:
          "Qwen3 235B von Alibaba: offene Gewichte, Mixture-of-Experts mit 22B aktiven Parametern. Solide bei Code und logischem Denken für wenig Geld, ruft Tools auf, 131K Kontext. Nur Text und eine Generation älter. Qwen 3.8 Flash ist neuer, liest Bilder und kostet etwa gleich viel.",
        deepseekR1Distill:
          "Kleines Destillat von DeepSeek R1 auf Qwen-Basis: günstiges Schritt-für-Schritt-Reasoning, nur Text, knapper 32K-Kontext. Kein Anbieter stellt es mehr bereit. Nachfolger ist DeepSeek V4.1 Flash: klüger, mit Bildverständnis, 1M Kontext und weiterhin fast kostenlos.",
        qwen257b:
          "Alibabas kleines Open-Weight-Modell mit 7B Parametern aus 2024. Günstig und flott für einfachen Chat, kurze Umformulierungen und Basis-Übersetzungen, 32K Kontext. Für heutige Verhältnisse schwach bei Code und Analyse. Qwen 3.8 Flash ist die neuere Alibaba-Wahl, klüger und etwas teurer.",
        dallE3:
          "DALL-E 3 - OpenAIs Bildgenerierungsmodell für hochwertige, detaillierte Bilder aus Textbeschreibungen",
        gptImage1:
          "GPT-Image-1 - OpenAIs schnelles und erschwingliches Bildgenerierungsmodell",
        fluxSchnell:
          "Flux Schnell - Black Forest Labs' schnelles Bildgenerierungsmodell, optimiert für Geschwindigkeit",
        fluxPro:
          "Das bewährte Text-zu-Bild-Arbeitspferd von Black Forest Labs aus der FLUX.1-Generation. Saubere Bildkomposition, verlässliche Prompt-Treue, kurze Wartezeit. Nur Texteingabe, keine Bearbeitung von Referenzbildern. FLUX.2 Pro kostet etwa die Hälfte und verarbeitet Referenzbilder; dieses Modell lohnt sich vor allem für bereits darauf abgestimmte Prompts.",
        flux2Max:
          "Die Spitzenstufe der FLUX.2-Familie von Black Forest Labs. Erzeugt Bilder aus Text oder bearbeitet Referenzbilder, mit dem meisten Detail und der höchsten Konsistenz der Reihe. Premiumpreis, ein Mehrfaches von FLUX.2 Pro. Für Hauptmotive und knifflige Bearbeitungen mit mehreren Referenzen; im Alltag liefert FLUX.2 Pro fast dasselbe für deutlich weniger. Legacy: FLUX.3 löst es ab, schärfer und günstiger pro Bild.",
        flux2Klein4b:
          "FLUX.2 Klein 4B - Black Forest Labs' schnellstes und kosteneffizientestes Bildmodell, optimiert für hohen Durchsatz. Legacy: FLUX.3 Klein löst es ab.",
        riverflowV2Pro:
          "Riverflow V2 Pro - Sourcefuls leistungsstärkstes Bildgenerierungsmodell mit erstklassiger Steuerung und perfekter Textwiedergabe",
        riverflowV2Fast:
          "Riverflow V2 Fast - Sourcefuls schnellstes Bildgenerierungsmodell, optimiert für Produktionsumgebungen und latenzempfindliche Workflows",
        riverflowV2MaxPreview:
          "Riverflow V2 Max Preview - Sourcefuls leistungsstärkstes Preview-Modell, vereinheitlichtes Text-zu-Bild- und Bild-zu-Bild-Modell. Legacy: Die Preview wurde beim Anbieter eingestellt; Riverflow V2 Pro nutzen.",
        riverflowV2StandardPreview:
          "Riverflow V2 Standard Preview - Sourcefuls Standard-Preview-Variante mit verbesserter Leistung gegenüber der Riverflow 1-Familie. Legacy: Die Preview wurde beim Anbieter eingestellt; Riverflow V2 Pro nutzen.",
        riverflowV2FastPreview:
          "Riverflow V2 Fast Preview - Sourcefuls schnellste Preview-Variante, vereinheitlichtes Text-zu-Bild- und Bild-zu-Bild-Modell zum günstigsten Preis. Legacy: Die Preview wurde beim Anbieter eingestellt; Riverflow V2 Fast nutzen.",
        flux2Flex:
          "FLUX.2 Flex - Black Forest Labs' Bildmodell mit hervorragender Text- und Typografiewiedergabe sowie Multi-Referenz-Bearbeitung in einer einheitlichen Architektur",
        flux2Pro:
          "Das FLUX.2-Arbeitspferd von Black Forest Labs für Generierung und Bearbeitung. Nimmt Text plus Referenzbilder, hält Figuren und Produkte über mehrere Motive hinweg konsistent und kommt mit langen Prompts gut klar. Mittleres Preisniveau. Open-Stufe: lockerere Filter als Imagen 4, aber keine expliziten Inhalte; dafür gibt es Chroma oder Lustify v8. FLUX.2 Max nur dann, wenn jedes Detail zählt.",
        gemini3ProImagePreview:
          "Googles Gemini 3 Pro Image, als Preview. Das stärkere Nano Banana: hält sich enger an komplexe Prompts, setzt gut lesbaren Text ins Bild und bearbeitet hochgeladene Fotos. Mainstream-Filter, keine Tool-Aufrufe, 64K Kontext. Kostet ein Vielfaches von Nano Banana, also für Arbeiten, bei denen Bildqualität zählt.",
        gpt5ImageMini:
          "GPT-5 Image Mini von OpenAI: die Sprachfähigkeiten von GPT-5 Mini plus Bilderzeugung und Bildbearbeitung im selben Chat. Liest Bilder, 400K Kontext. Mainstream-Filter, keine Tool-Aufrufe. Teurer als Nano Banana und nah am Preis von Nano Banana Pro, ein Vergleich mit dem eigenen Prompt lohnt sich. Legacy: OpenRouter stellt es am 1. Dezember 2026 ein. Im Chat Nano Banana 2.1 nutzen, für OpenAI-Qualität GPT Image 2.6 Flare.",
        gpt5Image:
          "GPT-5 kombiniert mit OpenAIs Bildgenerator: chatten und im selben Gespräch Bilder erstellen oder bearbeiten, mit Bildeingabe. Gut, um Motive per Sprache Schritt für Schritt zu verfeinern. Keine Tool-Aufrufe und teuer pro Nachricht. GPT-5 Image Mini ist günstiger, ein Vergleich mit Nano Banana Pro lohnt sich.",
        gpt54Image2:
          "GPT-5.4-Reasoning kombiniert mit GPT Image 2, sodass ein Chat von Analyse oder Code direkt zu fertigen Bildern übergehen kann. Liest auch Bilder. Keine Tool-Aufrufe und teuer. GPT-5 Image Mini kostet deutlich weniger, Nano Banana und Nano Banana Pro sind die anderen aktuellen Bildmodelle.",
        seedream45:
          "Das Bildmodell von ByteDance für Generierung und Bearbeitung in einem. Stark bei Porträts, bei konsistenten Motiven und beim Zusammenführen mehrerer Eingabebilder zu einer Szene. Mittleres Preisniveau, nah an FLUX.2 Pro. Open-Stufe: lockerere Filter als Mainstream-Modelle, aber nicht explizit. Eine gute Zweitmeinung, wenn FLUX.2 Pro den gewünschten Look verfehlt. Legacy: Seedream 5.5 löst es ab, zum halben Preis.",
        sdxl: "Stable Diffusion XL - Stability AIs hochwertiges Open-Source-Bildgenerierungsmodell",
        cassetteMusic:
          "CassetteAI Music - schnelle Text-zu-Musik-Generierung über Fal.ai mit Clips bis zu drei Minuten Länge",
        musicgenStereo:
          "Metas Open-Source-Modell MusicGen in der Stereoversion. Instrumentalmusik aus einem Textprompt: Genre, Stimmung, Instrumente. Kein Gesang, keine Songtexte. Günstig. Gut für Hintergrundmusik und Loops; für Songs mit Gesang ElevenLabs Music oder Sonauto Song nutzen.",
        stableAudio:
          "Stable Audio - Stability AIs Musik- und Audiogenerierungsmodell für hochwertige Clips",
        udioV2:
          "Udio v2 - Hochwertige KI-Musikgenerierung mit Gesang und vollständiger Produktionsqualität",
        modelsLabMusicGen:
          "Das hauseigene Text-zu-Musik-Modell von ModelsLab, mit Ausgabe als MP3, WAV oder FLAC. Promptgesteuerte Tracks für Hintergrundmusik und Jingles. Kostet ein Mehrfaches von Lyria 3 oder MusicGen Stereo, und das zugrunde liegende Modell ist nicht dokumentiert. Zuerst Lyria 3 testen: mehr Qualität für weniger Geld.",
        modelsLabElevenlabsMusic:
          "Das Musikmodell von ElevenLabs. Komplette Tracks mit Gesang und Text in mehreren Sprachen oder rein instrumental, gesteuert über den Prompt. Mainstream-Filter greifen. Oberes Preissegment bei Musik. Stark für ausproduzierte, radiotaugliche Songs; günstigere Songs mit Gesang liefert Sonauto Song.",
        modelsLabSonautoSong:
          "Der Songgenerator von Sonauto. Komplette Songs mit Gesang und Text in vielen Genres, für ganze Tracks günstig. Open-Stufe mit lockereren Filtern als ElevenLabs. Die Produktionsqualität schwankt; für sauberere Mixe lieber ElevenLabs Music oder Lyria 3 Pro Preview.",
        modelsLabLyria3:
          "Lyria 3 von Google. Eigene Tracks von rund 30 Sekunden aus einem Textprompt, mit hoher Produktionsqualität. Für das Gebotene sehr günstig. Mainstream: Googles Filter greifen. Zu kurz für ganze Songs; volle Länge schafft Lyria 3 Pro Preview.",
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
          "Alibabas Videomodell Wan 2.7. Clips bis 10 Sekunden (über ModelsLab bis 15) in bis zu 1080p, viele Seitenverhältnisse, Ton direkt aus dem Modell und optionale Start- und Endbilder zur Steuerung. Mittlerer Preis pro Sekunde. Ein flexibler Allrounder; für günstige Tests Seedance 1.5 Pro, für maximalen Realismus Veo 3.1. Legacy: Wan 3.0 löst es ab, gleicher 720p-Preis, Clips bis 30 Sekunden.",
        modelsLabWan26T2V:
          "Wan 2.6 T2V - ModelsLabs Wan 2.6 Text-zu-Video-Generierungsmodell",
        modelsLabWan26I2V:
          "Alibabas Bild-zu-Video-Modell Wan 2.6: Startbild rein, animierte Szene raus, inklusive Ton aus dem Modell. Clips mit 5 oder 10 Sekunden in 720p oder 1080p, quer oder hochkant. Günstiger als Wan 2.7. Wan 2.7 T2V ist die bessere Wahl, wenn zusätzlich ein Endbild oder mehr Seitenverhältnisse gefragt sind.",
        modelsLabWan26I2VFlash:
          "Die Tempovariante von Wan 2.6 Bild zu Video. Macht aus einem Standbild einen 5- oder 10-Sekunden-Clip in 1080p, mit kürzerer Wartezeit. Pro Sekunde nicht günstiger als das normale Wan 2.6 I2V, oft sogar etwas teurer; lohnt sich also nur, wenn es schnell gehen muss. Ton aus dem Modell ist für diese Variante nicht ausgewiesen, beim Standardmodell schon.",
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
          "OmniHuman 1.5 von ByteDance erweckt eine Person aus einem einzigen Foto zum Leben, gesteuert von einer Audiospur: sprechende Köpfe, Gesang, Gestik. Ein Spezialist für Avatare und Vertonung, kein allgemeines Text-zu-Video-Modell. Pro Sekunde teurer als die meisten Videomodelle der Mittelklasse. Für Szenen ohne sprechende Person lieber Kling 3.0 oder Wan 2.7.",
        modelsLabSeedance15Pro:
          "Seedance 1.5 Pro von ByteDance, vertrieben über die BytePlus-Cloud. Ton aus dem Modell, Clips mit 4 bis 12 Sekunden von 480p bis 1080p, Steuerung über Start- und Endbild, viele Seitenverhältnisse. Pro Clip eines der günstigsten Videomodelle hier. Stark für Ideentests und Masse; Seedance 2.0 ist der nächste Schritt für Konsistenz und 4K.",
        modelsLabVeo2:
          "Veo 2 - Googles hochwertiges Video-Generierungsmodell via ModelsLab",
        modelsLabVeo3:
          "Veo 3 - Googles neuestes Video-Generierungsmodell via ModelsLab",
        modelsLabVeo3Fast:
          "Veo 3 Fast - Googles schnelles Video-Generierungsmodell via ModelsLab",
        modelsLabVeo3FastPreview:
          "Veo 3 Fast Preview - Googles schnelles Video-Generierungs-Preview-Modell via ModelsLab",
        modelsLabVeo31:
          "Googles Flaggschiff unter den Videomodellen. Kinoreifer Realismus, Ton direkt aus dem Modell mit Dialogen und Geräuschen, Clips mit 4 bis 8 Sekunden bis 4K, Steuerung über Start- und Endbild. Das teuerste Videomodell im Katalog. Lohnt sich für finale Einstellungen; Entwürfe gehen mit Veo 3.1 Fast für einen Bruchteil des Preises.",
        modelsLabVeo31Fast:
          "Die schnelle, günstigere Stufe von Googles Veo 3.1. Gleiche Clips mit 4 bis 8 Sekunden, Ton aus dem Modell, bis 4K und Bildsteuerung, für etwa ein Drittel bis die Hälfte des Preises von Veo 3.1. Bei anspruchsvollen Einstellungen etwas weniger Detailtreue. Der beste Kompromiss für die meisten Veo-Projekte; Veo 3.1 Lite ist noch günstiger.",
        modelsLabKlingV21I2V:
          "Kling V2.1 I2V - Kling AIs Bild-zu-Video-Modell Version 2.1",
        modelsLabKlingV25TurboI2V:
          "Kling 2.5 Turbo für Bild zu Video: macht aus einem Standbild einen kurzen Clip. Günstig pro Clip und schnell, mit Klings lebendiger Bewegung. Kein Ton aus dem Modell ausgewiesen. Kling 3.0 bringt Ton und Einstellungen bis 15 Sekunden, kostet aber mehr.",
        modelsLabKlingV25TurboT2V:
          "Kling 2.5 Turbo aus Text. Clips mit 5 oder 10 Sekunden in 16:9, 9:16 oder 1:1, pro Clip unter den günstigsten im Katalog. Für den Preis starke Bewegung, kein Ton aus dem Modell. Für Ton und Clips bis 15 Sekunden auf Kling 3.0 T2V umsteigen.",
        modelsLabKlingV2MasterT2V:
          "Kling V2 Master T2V - Kling AIs Master-Qualität Text-zu-Video-Modell",
        modelsLabKlingV2MasterI2V:
          "Kling V2 Master I2V - Kling AIs Master-Qualität Bild-zu-Video-Modell",
        modelsLabKlingV21MasterT2V:
          "Kling 2.1 Master, die Premiumstufe von Klings 2.1-Generation. Clips mit 5 oder 10 Sekunden aus Text, mit hoher Bildqualität. Preislich nahe der Katalogspitze, etwa dreimal so teuer wie Kling 3.0 T2V, das neuer ist und Ton mitliefert. Lohnt sich vor allem für Prompts, die hier bereits gut funktionieren.",
        modelsLabKlingV21MasterI2V:
          "Kling 2.1 Master für Bild zu Video: macht aus einem Standbild einen 5- oder 10-Sekunden-Clip mit hoher Bildqualität. Preislich nahe der Katalogspitze, etwa dreimal so teuer wie das neuere Kling 3.0, das zusätzlich Ton liefert. Nur wählen, wenn genau dieser Look gebraucht wird; Kling V2.5 Turbo I2V ist die günstige Alternative.",
        modelsLabKlingV16MultiI2V:
          "Kling V1.6 Multi I2V - Kling AIs Multi-Bild-zu-Video-Modell Version 1.6",
        modelsLabKling30T2V:
          "Kling 3.0 Pro von Kuaishou. Ton aus dem Modell, Clips mit 3 bis 15 Sekunden in 720p, Steuerung über Start- und Endbild, 16:9, 9:16 oder 1:1. Lebendige, überzeugende Bewegung zum mittleren Preis. Bei 720p ist Schluss; für 1080p und mehr Veo 3.1 Fast oder Hailuo 3. Kling 3.0 Std ist die günstigere Stufe.",
        modelsLabLtx2ProT2V:
          "LTX-2 Pro von Lightricks. Text zu Video in 2K oder 4K, mit Clips von etwa 6 bis 10 Sekunden. Für diese Auflösung ein mittlerer Preis und damit der günstige Weg zu 4K neben Veo 3.1. Kein Ton aus dem Modell ausgewiesen; für 4K mit Ton Veo 3.1 Fast nutzen.",
        modelsLabLtx2ProI2V:
          "LTX 2 PRO I2V - LTXs professionelles Bild-zu-Video-Generierungsmodell",
        modelsLabLtx23ProI2V:
          "LTX 2.3 Pro von Lightricks für Bild zu Video: animiert ein Standbild in 2K oder 4K, mit Clips von 6 bis 10 Sekunden. Neuer als LTX 2 Pro und etwas teurer. Die Wahl, wenn ein hochaufgelöstes Bild auch in Bewegung scharf bleiben soll. Kein Ton aus dem Modell ausgewiesen.",
        modelsLabHailuo23T2V:
          "Hailuo 2.3 von MiniMax aus Text, bekannt für lebendige, körperliche Bewegung wie Tanz und Action. Clips mit 6 oder 10 Sekunden in 1080p im Format 16:9. Kein Ton aus dem Modell. Mittleres Preisniveau. Hailuo 3 bringt Ton, 2K und Bildsteuerung für etwa den doppelten Preis.",
        modelsLabHailuo02T2V:
          "Hailuo 02 T2V - MiniMax Text-zu-Video-Generierungsmodell 02",
        modelsLabHailuo23I2V:
          "Hailuo 2.3 von MiniMax für Bild zu Video. Macht aus einem Standbild einen Clip mit 6 oder 10 Sekunden, mit ausdrucksstarker, körperlicher Bewegung. Kein Ton aus dem Modell. Hailuo 2.3 Fast I2V erledigt dasselbe für etwa die Hälfte, mit weniger Feinschliff.",
        modelsLabHailuo23FastI2V:
          "Die schnelle, günstige Stufe von Hailuo 2.3 Bild zu Video. Clips mit 6 oder 10 Sekunden aus einem Standbild, für etwa die Hälfte des normalen Hailuo 2.3 I2V. Gut für Entwürfe und Masse, dafür weniger Detail. Kein Ton aus dem Modell.",
        modelsLabHailuo02I2V:
          "Hailuo 02 I2V - MiniMax Bild-zu-Video-Generierungsmodell 02",
        modelsLabHailuo02StartEnd:
          "Hailuo 02 Start/End - MiniMax Start-End-Frame Video-Generierungsmodell",
        modelsLabSora2:
          "Sora 2 von OpenAI. Glaubwürdige Physik, synchroner Ton samt Dialog, Clips bis 12 Sekunden. Über diesen Weg nur im Format 16:9. Mittleres bis gehobenes Preisniveau. Sora 2 Pro schafft 20 Sekunden und 1080p für etwa das Zwei- bis Dreifache.",
        modelsLabSora2Pro:
          "Die Premiumstufe von OpenAIs Sora 2. Synchroner Ton, Clips bis 20 Sekunden, 720p oder 1080p, quer oder hochkant. Eines der teuersten Videomodelle hier. Lohnt sich für lange, ausgefeilte Einstellungen; für Entwürfe reicht Sora 2 zu weniger als dem halben Preis.",
        modelsLabGen4Aleph:
          "Runways Aleph ist eher Videoeditor als Generator: Vorhandenes Material rein, und es fügt Objekte hinzu oder entfernt sie, ändert Stil, Licht oder Kamerawinkel. Viele Seitenverhältnisse, auch breite Kinoformate. Teurer als die meisten Generatoren. Für neue Clips aus einem Prompt Veo 3.1 Fast oder Kling 3.0 nutzen.",
        modelsLabLipsync2:
          "lipsync-2 von Sync passt die Mundbewegungen in einem vorhandenen Video an eine neue Tonspur an. Gemacht für Synchronisation, übersetzte Voiceovers und nachträgliche Dialogkorrekturen. Bearbeitet bestehendes Material, erfindet keine Szenen. Für eine sprechende Person aus einem einzelnen Foto Omnihuman 1.5 nutzen.",
        modelsLabGrokT2V:
          "Grok Imagine Video von xAI aus Text. Clips von 1 bis 15 Sekunden in 480p oder 720p, optional mit Startbild. Mittleres Preisniveau, schnell und locker. Open-Stufe, also lockerere Filter als Veo oder Sora, aber nicht explizit. Grok Imagine Video 1.5 kann zusätzlich 1080p. Legacy: Grok Imagine Video 1.5 Lite löst es ab, für weniger als den halben Preis.",
        modelsLabGrokI2V:
          "Grok Imagine von xAI für Bild zu Video. Macht aus einem Standbild einen HD-Clip mit bis zu 15 Sekunden. Etwas günstiger als Grok T2V. Gut für schnell animierte Standbilder; für höhere Auflösung auf Grok Imagine Video 1.5 wechseln. Legacy: Grok Imagine Video 1.5 Lite animiert Standbilder günstiger.",
        klingV30Std:
          "Die Standardstufe von Kling 3.0 von Kuaishou. Dieselben Clips mit 3 bis 15 Sekunden, Ton aus dem Modell und Bildsteuerung wie Kling 3.0 T2V, die Pro-Stufe, aber günstiger pro Sekunde. Ausgabe in 720p. Die Preis-Leistungs-Wahl der Kling-3-Reihe; Pro nehmen, wenn feine Details zählen.",
        klingVideoO1:
          "Klings vereinheitlichtes multimodales Videomodell, gebaut, um Clips in einem Modell zu erzeugen und anhand von Referenzen zu bearbeiten. Ton aus dem Modell, 5 oder 10 Sekunden in 720p, Steuerung über Start- und Endbild. Preislich auf dem Niveau von Kling 3.0 Pro. Die Wahl für referenzgetriebene Arbeit; für reines Text zu Video ist Kling 3.0 Std günstiger.",
        veo31Lite:
          "Die Sparstufe von Googles Veo 3.1. Ton aus dem Modell, Clips mit 4 bis 8 Sekunden in 720p oder 1080p, Steuerung über Start- und Endbild. Der günstigste Einstieg in Veo, allerdings ohne 4K. Gut für Social-Clips in großer Zahl; wenn Qualität zählt, auf Veo 3.1 Fast wechseln.",
        seedance2:
          "Seedance 2.0 von ByteDance. Ton aus dem Modell, Clips mit 4 bis 15 Sekunden von 480p bis 4K, Start- und Endbild sowie Referenzen für konsistente Figuren. Oberes Preissegment. Stark für Story-Einstellungen mit wiederkehrenden Figuren; Seedance 2.0 Fast ist für Entwürfe bis 720p günstiger.",
        seedance2Fast:
          "Die schnellere, günstigere Stufe von Seedance 2.0 von ByteDance. Ton aus dem Modell, Clips bis 15 Sekunden und Bildsteuerung, aber maximal 720p. Etwa 60 Prozent des Preises des vollen Modells. Gut für Entwürfe und Social-Clips; für 1080p oder 4K das volle Seedance 2.0 nehmen.",
        happyhorse11:
          "Die zweite Version von Alibabas Videomodell HappyHorse, das Bild und synchronen Ton in einem Durchgang erzeugt. Text zu Video, Bild zu Video und Referenzbilder, bis 15 Sekunden in 720p oder 1080p. Gleicher Preis wie HappyHorse 1.0, laut Alibaba mit besserer Bewegung und Konsistenz, daher die erste Wahl der beiden. Mittleres Preisniveau.",
        happyhorse10:
          "Die erste Version von Alibabas Videomodell HappyHorse, das Bild und synchronen Ton in einem Durchgang erzeugt. Text zu Video, Bild zu Video und Referenzbilder, bis 15 Sekunden in 720p oder 1080p. Kostet dasselbe wie HappyHorse 1.1, die neuere Version ist also meist die bessere Wahl. Sinnvoll für Prompts, die auf 1.0 abgestimmt sind.",
        modelsLabGen4T2ITurbo:
          "Die schnellere, günstigere Variante von Runways Gen-4-Bildmodell. Text rein, Bild raus, für weniger als ein Drittel des Preises von Gen4 Image. Ideal für schnelle Entwürfe und zum Ausloten von Runways Kino-Look. Keine Bearbeitung von Referenzbildern; dafür FLUX.2 Pro oder Seedream 4.5 nehmen.",
        modelsLabGen4Image:
          "Runways Gen-4-Bildmodell, bekannt für einen filmischen Standbild-Look. Text rein, Bild raus. Eine der teureren Bildoptionen im Katalog; lohnt sich, wenn genau diese Runway-Ästhetik gefragt ist. Für günstige Iterationen zuerst Gen4 T2I Turbo, für Bearbeitungen auf Basis eines Referenzbilds FLUX.2 Pro.",
        modelsLabWan27T2I:
          "Das Bildmodell Wan 2.7 von Alibaba, aus derselben Familie wie die Wan-Videomodelle. Text rein, Bild raus, im unteren Mittelfeld beim Preis. Solide Allzweckwahl für Illustrationen und Szenen. Keine Referenzbilder als Eingabe; für Bearbeitungen Qwen Image 3 oder Seedream 4.5 nutzen.",
        modelsLabGrokT2I:
          "Der Bildgenerator Grok Imagine von xAI. Text rein, Bild raus, günstig im Betrieb. Open-Stufe, also lockerere Filter als Imagen 4, aber nicht explizit. Gut für schnelle, plakative Bilder; für Bearbeitungen mit Referenzbild und die neuere Generation kostet Grok Imagine Image 2.0 etwas mehr.",
        modelsLabZImageBase:
          "Die vollständige, nicht destillierte Basisversion von Z-Image, dem Open-Weight-Bildmodell aus Alibabas Tongyi-Labor. Eines der günstigsten Bildmodelle im Katalog. Mehr Vielfalt als Z Image Turbo, dafür langsamer pro Bild. Gut für günstige Mengen und Experimente; für ausgefeilte Endergebnisse lieber FLUX.2 Pro.",
        modelsLabZImageTurbo:
          "Die destillierte, auf Tempo getrimmte Version von Z-Image, dem Open-Weight-Modell aus Alibabas Tongyi-Labor. Bilder in wenigen Schritten, Preis am unteren Ende des Katalogs. Für den Preis gute fotorealistische Ergebnisse und lesbarer Text im Bild. Weniger Vielfalt als Z Image Base, bei schwierigen Prompts hinter FLUX.2 Pro.",
        modelsLabFlux2MaxT2I:
          "Flux 2 Max T2I - Black Forest Labs Flux 2 Max Text-zu-Bild via ModelsLab",
        modelsLabFluxPro11Ultra:
          "Der Hochauflösungsmodus von Flux Pro 1.1, ausgelegt auf Bilder mit rund 4 Megapixeln. Nur Texteingabe. Gehört zu den teureren Bildmodellen hier. Die Wahl für große, druckfertige Motive; für Bearbeitung oder Arbeit mit mehreren Referenzen ist FLUX.2 Pro günstiger und flexibler.",
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
          "Die Spitzenstufe von Googles Imagen 4. Die präziseste Prompt-Treue der Familie und saubere, lesbare Schrift im Bild. Mainstream: Googles Filter greifen vollständig. Etwa dreimal so teuer wie Imagen 4 Fast, also eher für finale Renderings. Weniger Einschränkungen bietet FLUX.2 Pro, explizite Inhalte Chroma.",
        modelsLabImagen4:
          "Googles Standardversion von Imagen 4. Fotorealistische Details, gute Typografie und verlässliche Prompt-Treue zum mittleren Preis. Mainstream: Googles Filter greifen, bei heiklen Prompts sind Ablehnungen wahrscheinlich. Imagen 4 Fast kostet für Entwürfe etwa die Hälfte, Imagen 4 Ultra übernimmt den Feinschliff.",
        modelsLabImagen4Fast:
          "Die Tempostufe von Googles Imagen 4. Das günstigste Imagen, schnelle Ergebnisse, gut für Entwürfe und große Serien. Etwas weniger Detail und Prompt-Präzision als Imagen 4 und Ultra. Mainstream-Filter greifen. Noch günstigere Mengen mit lockereren Filtern liefert Z Image Turbo.",
        modelsLabImagen3:
          "Imagen 3 - Googles Imagen 3 Text-zu-Bild via ModelsLab",
        modelsLabNanoBananaPro:
          "Nano Banana Pro - Hochwertige Bildgenerierung via ModelsLab",
        modelsLabNanoBanana: "Nano Banana - Bildgenerierung via ModelsLab",
        modelsLabQwenT2I:
          "Alibabas Qwen-Modell für Text zu Bild. Die Qwen-Bildreihe glänzt beim Setzen von Text im Bild, chinesische Schriftzeichen eingeschlossen, ideal für Poster, Schilder und Mockups. Preis am unteren Ende des Katalogs. Nur Texteingabe; zum Bearbeiten Qwen Image 3 wählen.",
        modelsLabRealtimeT2I:
          "Der Echtzeit-Endpunkt von ModelsLab, auf Tempo statt Feinschliff getrimmt. Schnelle Bilder in der niedrigsten Preisstufe des Katalogs. Für schnelles Ideensammeln, Thumbnails und Prompt-Tests, bevor Geld in FLUX.2 Pro oder Imagen 4 fließt. Nichts für finale Motive oder komplexe Szenen.",
        claudeSonnet5:
          "Anthropics erstes Sonnet 5: ausgewogen bei Coding, Agenten und Analyse über 1M Kontext, mit Bildeingabe. Mainstream-Filter, vorsichtig bei kontroversen Themen, schwach im Rollenspiel. Claude Sonnet 5.5 kostet gleich viel und ist neuer, es gibt also keinen Grund zu bleiben.",
        claudeOpus5:
          "Anthropics erstes Opus 5, ausgelegt auf die schwersten agentischen und analytischen Aufgaben, mit 1M Kontext und Bildeingabe. Premium-Preis, Mainstream-Filter, vorsichtig bei kontroversen Themen. Claude Opus 5.5 ist neuer und günstiger.",
        claudeOpus5Fast:
          "Claude Opus 5 Fast - Hochdurchsatz-Variante von Claude Opus 5 für latenzkritische Anwendungen. 1M-Token-Kontext.",
        claudeFable5:
          "Anthropics erstes Fable, ein Spitzenmodell für tiefe Synthese, kreative Tiefe und langfristige Planung, mit 1M Kontext und Bildeingabe. Eines der teuersten Modelle hier, mit Mainstream-Filtern. Claude Fable 5.2 ist neuer und günstiger. Für Code besser Claude Opus 5.5.",
        grok45:
          "xAIs Reasoning-Modell Grok 4.5: stark bei Analyse und Coding, liest Bilder, 500K Kontext, mit Groks lockerer Inhaltsrichtlinie. Grok 4.7 ist neuer und kostet gleich viel, also besser wechseln, außer genau diese Version wird gebraucht.",
        grok46:
          "Grok 4.6 schärfte Reasoning und Coding gegenüber 4.5, mit Bildeingabe, 500K Kontext und xAIs lockereren Filtern. Weiterhin ein fähiges Modell mit wenig Filterung. Grok 4.7 kostet gleich viel und löst es ab.",
        gpt56Luna:
          "Die schnelle, günstige Stufe der GPT-5.6-Reihe von OpenAI, für Alltagschat und kurze Aufgaben, mit 1M Kontext und Bildeingabe. Nicht für tiefe Analysen gebaut. GPT-6 Luna ist neuer und kostet etwa die Hälfte.",
        gpt56LunaPro:
          "Luna mit besserem Coding und genauerem Befolgen von Anweisungen, zum gleichen niedrigen Preis wie das normale Luna. Gut für günstige Code-Hilfe und strukturierte Aufgaben über 1M Kontext. GPT-6 Luna ist neuer und kostet etwa die Hälfte.",
        gpt56Terra:
          "Die Mittelklasse der GPT-5.6-Reihe von OpenAI: solides Coding, Analyse und Chat über 1M Kontext, mit Bildeingabe. Schwach im Rollenspiel. GPT-6.1 Terra ist neuer und kostet etwa die Hälfte.",
        gpt56TerraPro:
          "Terra mit tieferem Reasoning für analyselastige Arbeit, zum gleichen Preis wie das normale Terra, über 1M Kontext. Schwach im Rollenspiel. GPT-6.1 Terra ist neuer und kostet etwa die Hälfte. Für mehr Tiefe GPT-6.1 Sol.",
        gpt56Sol:
          "Die Spitzenstufe der GPT-5.6-Reihe von OpenAI: komplexes Reasoning, Coding, Schreiben und Analyse über 1M Kontext, mit Bildeingabe. Premium-Preis, Mainstream-Filter. GPT-6.1 Sol ist neuer und kostet etwa die Hälfte.",
        gpt56SolPro:
          "Sol mit zusätzlichem Reasoning-Aufwand für die schwersten Probleme, zum gleichen Preis wie das normale Sol, über 1M Kontext. Schwach im Rollenspiel, Mainstream-Filter. GPT-6.1 Sol ist neuer und kostet die Hälfte. Für maximale Tiefe GPT-6 Astra.",
        gemini36Flash:
          "Googles Gemini 3.6 Flash: schnell und gut im Coding, mit 1M Kontext und Eingabe von Text, Bild, Video und Audio. Weiterhin ein faires Angebot für den Alltag. Gemini 3.8 Flash ist neuer und nur wenig teurer.",
        gemini35FlashLite:
          "Das leichteste Gemini von Google. Verarbeitet Text, Bilder, Video und Audio, ruft Tools auf, 1M Kontext. Gut für einfache Massenaufgaben wie Zusammenfassungen, Verschlagwortung und schnelle Antworten. Mainstream-Filter und kein Reasoning-Modell. Für ein Lite-Modell überraschend teuer: GPT-6 Luna und Claude Haiku 5.5 kosten weniger.",
        gemini37Flash:
          "Gemini 3.7 Flash brachte besseres Reasoning und mehr Analysestärke in die Flash-Reihe, mit 1M Kontext und Eingabe von Text, Bild, Video und Audio. Ein gutes Alltagsmodell zum fairen Preis. Gemini 3.8 Flash löst es ab und kostet nur etwas mehr.",
        kimiK3:
          "Kimi K3 von Moonshot AI, ein Modell der Spitzenklasse. Stark bei Code, Analyse, kreativem Schreiben und langen Agentenläufen, liest Bilder und Videos, ruft Tools auf, 1M Kontext. Lockerere Filter als die US-Anbieter. Kimi K3.1 Pro ist die neuere, stärkere Version zum fast doppelten Preis.",
        glm52:
          "Z.AIs GLM-5.2: starkes Reasoning bei schneller Inferenz und 1M Kontext. Gut für Code und Analyse langer Eingaben, nur Text, lockere Filter. GLM-5.3 ist neuer und kostet etwa ein Drittel.",
        minimaxM3:
          "Das frühere Flaggschiff von MiniMax. Gut bei Code, Reasoning und Analyse, liest Bilder und Videos, ruft Tools auf, 1M Kontext, lockerere Filter als die Mainstream-Anbieter. Nachfolger ist MiniMax M3.1 Flash: spürbar stärker bei Agenten und Code, zum halben Preis oder weniger.",
        qwen37Flash:
          "Alibabas extrem günstiges Flash-Modell und eine der billigsten Optionen im Katalog: 1M Kontext, Eingabe von Text, Bild und Video, Tool-Aufrufe. Ideal für Massenaufgaben und schnellen Chat, flach bei schwerem Reasoning. Qwen 3.8 Flash ist neuer und klüger, kostet aber ein Mehrfaches.",
        qwen38Max:
          "Das stärkste Qwen von Alibaba. Reasoning, Code und Analyse auf Spitzenniveau, liest Bilder und Videos, ruft Tools auf, 1M Kontext. Lockerere Filter als die US-Anbieter. Für ein offenes Modell teuer: DeepSeek V4 Pro erreicht dieselbe Klasse für deutlich weniger als die Hälfte, sofern reine Texteingabe genügt.",
        mimoV25:
          "Xiaomis effizientes MiMo V2.5: flott und gut im Coding, mit 1M Kontext und Eingabe von Text, Bild, Video und Audio. Lockere Filter. MiMo V2.6 Flash ist neuer und kostet weniger als ein Drittel.",
        mimoV25Pro:
          "Xiaomis MiMo V2.5 Pro, ein Modell für tiefes Reasoning und Coding mit 1M Kontext zum kleinen Preis. Nur Text, lockere Filter. Weiterhin günstiger als der Nachfolger MiMo V2.6 Pro, die neuere Wahl.",
        metaMuseSpark12:
          "Meta Muse Spark 1.2, ein multimodales Reasoning-Modell, das Text, Bilder und Videos über 1M Kontext verarbeitet. Stark bei Analysen über Medien hinweg, lockere Filter. Nicht für Coding ausgelegt. Meta Muse Spark 1.3 kostet gleich viel und ist neuer.",
        mistralMedium35:
          "Mistral Medium 3.5 aus dem französischen Labor Mistral AI: Coding, Analyse und Bildeingabe mit 262K Kontext. Mainstream-Filter. Mistral Large 4 ist neuer und kostet weniger als die Hälfte.",
        claudeOpus55:
          "Das stärkste Claude von Anthropic für schwere Alltagsarbeit. Die Wahl für härtestes Programmieren, lange Agentenaufgaben und sorgfältige Analyse, dazu stark im Schreiben. Liest Bilder, ruft Tools auf, 1M Kontext. Premiumpreis und Mainstream-Filter: lehnt heikle Anfragen ab und taugt wenig fürs Rollenspiel. Claude Sonnet 5.5 erledigt die meiste Alltagsarbeit zum halben Preis.",
        claudeSonnet55:
          "Das Arbeitstier unter den Claude-Modellen. Starkes Programmieren, Agentenarbeit, Analyse und Schreiben zum halben Preis von Opus 5.5. Liest Bilder, ruft Tools auf, 1M Kontext. Mainstream-Filter, also nichts für Rollenspiel oder kontroverse Themen. Preisgleich mit GPT-6.1 Sol und Gemini 4 Argon, den naheliegenden Konkurrenten.",
        claudeHaiku55:
          "Das schnellste und günstigste Claude von Anthropic. Flotter Chat, leichtes Programmieren, Bildverständnis und Tools, 1M Kontext, Centbeträge pro Nachricht. Mainstream-Filter, schwach bei Rollenspiel und heiklen Themen. Gleicher Preis wie GPT-6 Luna. Braucht die Aufgabe echte Tiefe, lieber zu Claude Sonnet 5.5 wechseln.",
        claudeFable51:
          "Anthropics Fable 5.1, ein Spitzenmodell für tiefe Synthese, langfristige Planung und sorgfältiges Schreiben über 1M Kontext. Premium-Preis, Mainstream-Filter, vorsichtig bei kontroversen Themen und schwach im Rollenspiel. Claude Fable 5.2 löst es ab und kostet weniger. Für Code passt Claude Opus 5.5 besser.",
        claudeFable52:
          "Der Spitzen-Denker von Anthropic und das teuerste Claude. Gebaut für tiefe Synthese, Recherche und langfristige Planung, dazu stark im Schreiben. Liest Bilder, ruft Tools auf, 1M Kontext. Etwa doppelt so teuer wie Opus 5.5, mit Mainstream-Filtern. Für Code bietet Claude Opus 5.5 mehr fürs Geld.",
        gpt6Astra:
          "Das leistungsstärkste Modell von OpenAI, gebaut für maximale Denktiefe bei den härtesten Problemen. Code, Analyse und Schreiben, liest Bilder, ruft Tools auf, 1M Kontext. Das teuerste Modell im Katalog, mit Mainstream-Filtern. GPT-6.1 Sol spielt in derselben Klasse für etwa ein Fünftel des Preises, also zuerst dort testen.",
        gpt6AstraPro:
          "GPT-6 Astra Pro - GPT-6 Astra mit erweitertem Denkaufwand. Langsamer, gründlicher. 1,05M-Token-Kontext.",
        gpt61Sol:
          "Der Premium-Denker von OpenAI und die vernünftige Wahl in der Spitzenklasse. Stark bei Code, Analyse und Schreiben, liest Bilder, ruft Tools auf, 1M Kontext. Mainstream-Filter, nichts fürs Rollenspiel. Kostet etwa ein Fünftel von GPT-6 Astra und liegt preislich gleichauf mit Claude Sonnet 5.5 und Gemini 4 Argon.",
        gpt61SolPro:
          "GPT-6.1 Sol Pro - GPT-6.1 Sol mit erweitertem Denkaufwand für komplexe Analysen und Code. 1,05M-Token-Kontext.",
        gpt61Terra:
          "Die ausgewogene Mittelklasse von OpenAI. Gutes Programmieren, Analyse und Alltagschat, liest Bilder, ruft Tools auf, 1M Kontext. Halber Preis von GPT-6.1 Sol. Mainstream-Filter, schwach im Rollenspiel. Wer mit lockereren Filtern leben kann, bekommt mit DeepSeek V4 Pro eine höhere Klasse für weniger Geld.",
        gpt61TerraPro:
          "GPT-6.1 Terra Pro - GPT-6.1 Terra mit tieferem Denken für analyseintensive Arbeit. 1,05M-Token-Kontext.",
        gpt6Luna:
          "Das leichte GPT-6 von OpenAI. Schnelle Antworten für Centbeträge, liest Bilder, ruft Tools auf, 1M Kontext. Gut für kurze Fragen und einfache Aufgaben, nicht für tiefes Reasoning oder Rollenspiel. Gleicher Preis wie Claude Haiku 5.5. DeepSeek V4.1 Flash ist noch günstiger und weniger streng gefiltert.",
        gpt6LunaPro:
          "GPT-6 Luna Pro - GPT-6 Luna mit mehr Denkleistung. Besserer Code und präzisere Befolgung, gleicher Niedrigpreis. 1,05M-Token-Kontext.",
        gemini4Argon:
          "Das Gemini-Flaggschiff von Google. Nimmt Text, Bilder, Video und Audio auf und liefert Reasoning, Code und Analyse auf Spitzenniveau. Ruft Tools auf, 1M Kontext. Stark, wenn die Eingabe eine Aufnahme, ein Video oder ein Stapel Screenshots ist. Mainstream-Filter. Preisgleich mit Claude Sonnet 5.5 und GPT-6.1 Sol. Gemini 4 Carbon geht bei den härtesten Aufgaben tiefer, Gemini 4 Hydrogen ist schneller und ein Viertel günstiger.",
        gemini38Flash:
          "Das aktuelle Flash von Google. Schnell, gut bei Code und Analyse, verarbeitet Text, Bilder, Video und Audio, ruft Tools auf, 1M Kontext. Mainstream-Filter. Mittleres Preisniveau: deutlich unter der Hälfte von Gemini 4 Argon, aber weit über offenen Schnellmodellen wie Qwen 3.8 Flash. Gemini 4 Hydrogen ist deutlich klüger und schneller, kostet aber fast das Doppelte.",
        grok47:
          "Das neueste Grok von xAI. Scharfes Reasoning und starker Code, liest Bilder, ruft Tools auf, 500K Kontext, halb so viel wie bei den meisten Flaggschiffen hier. Offene Inhaltsrichtlinie: beantwortet mehr als die Mainstream-Anbieter, ist aber nicht vollständig unzensiert. Preislich auf dem Niveau von Qwen 3.8 Max. Eine günstige Fast-Stufe bietet xAI nicht mehr: Für schnellen, billigen Chat mit offenen Filtern MiniMax M3.1 Flash oder Meta Muse Ember testen.",
        kimiK31Pro:
          "Das stärkste Kimi von Moonshot AI. Reasoning, Code, kreatives Schreiben und lange Agentenläufe auf Spitzenniveau, liest Bilder und Videos, ruft Tools auf, 1M Kontext. Lockerere Filter als die US-Anbieter. Preisgleich mit Claude Sonnet 5.5. Kimi K3 kommt für gut die Hälfte des Preises nah heran.",
        deepseekV41Flash:
          "Das schnelle Modell von DeepSeek, jetzt mit Bildverständnis. Ernsthaftes Programmieren und Analysieren für fast nichts: das günstigste Modell im Katalog. Ruft Tools auf, 1M Kontext, lockerere Filter. Kein tiefer Denker. Für harte Probleme DeepSeek V4 Pro, ohne Verweigerungen DeepSeek V4.1 Flash Uncensored.",
        qwen38Flash:
          "Das schnelle Qwen von Alibaba. Text, Bilder und Video rein, flotte Antworten raus, ordentlich beim Programmieren, ruft Tools auf, 1M Kontext. Budgetpreis, lockerere Filter. Ein Alltagsmodell, kein tiefer Denker. Die harten Probleme übernimmt Qwen 3.8 Max.",
        glm53:
          "Das Basismodell GLM-5.3 von Z.AI. Starkes Reasoning und Code für Centbeträge, ruft Tools auf, 1M Kontext. Nur Text, lockerere Filter. Eines der günstigsten klugen Modelle im Katalog. Gar keine Verweigerungen gewünscht? GLM 5.3 Uncensored ist die ungefilterte Variante.",
        glm53Flash:
          "Das schnelle GLM von Z.AI. Liest Text, Bilder und Video, programmiert, ruft Tools auf, 1M Kontext. Gebaut für Massenarbeit zum Budgetpreis, mit lockereren Filtern. Schwächer im Reasoning als GLM-5.3, das gleich viel kostet. Flash also dann, wenn Medien-Eingabe und Tempo zählen.",
        mimoV26Pro:
          "Das stärkste MiMo von Xiaomi. Reasoning, Code und Analyse auf Spitzenniveau, verarbeitet Text, Bilder, Video und Audio. Ruft Tools auf, 1M Kontext, lockerere Filter. Das günstigste Modell der höchsten Intelligenzstufe hier, ein Bruchteil von Gemini 4 Argon bei ähnlicher Eingabevielfalt. Ein jüngerer Name, also mit eigenen Prompts testen.",
        mimoV26Flash:
          "Das schnelle MiMo von Xiaomi. Verarbeitet Text, Bilder, Video und Audio, programmiert gut für seinen Preis, ruft Tools auf, 1M Kontext. Sehr günstig, lockerere Filter. Tauscht Tiefe gegen Tempo. MiMo V2.6 Pro ist die nächste Stufe, MiMo V2.6 Flash Abliterated verzichtet auf Verweigerungen.",
        metaMuseSpark13:
          "Das Muse-Modell der Mittelklasse von Meta. Reasoning und Analyse über Text, Bilder und Video hinweg, ruft Tools auf, 1M Kontext, lockerere Filter. Nicht aufs Programmieren ausgelegt. Zum gleichen Preis erreicht Kimi K3 eine höhere Klasse, das Meta-Flaggschiff ist Meta Muse Wonder.",
        metaMuseWonder:
          "Das Muse-Flaggschiff von Meta. Reasoning, Code, Analyse und kreative Arbeit auf Spitzenniveau, verarbeitet Text, Bilder, Video und Audio. Ruft Tools auf, 1M Kontext, lockerere Filter als die Mainstream-Anbieter. Premium, preislich wie Claude Opus 5.5. Kimi K3.1 Pro und Gemini 4 Argon spielen in derselben Klasse zum halben Preis.",
        mistralLarge4:
          "Das Flaggschiff von Mistral AI, aus europäischem Haus. Gut bei Code und Analyse, liest Bilder, ruft Tools auf, 1M Kontext, zu moderatem Preis. Mainstream-Filter. Nicht ganz Spitzenklasse: DeepSeek V4 Pro kostet etwas mehr und denkt tiefer.",
        gemini4Hydrogen:
          "Das schnelle Gemini 4 von Google. Gebaut für Agentenschleifen, Coding und zügige Analyse, in Benchmarks trotzdem Spitzenklasse und rund 2,5-mal so schnell wie Gemini 3.8 Flash. Verarbeitet Text, Bilder, Video und Audio, ruft Tools auf, 1M Kontext. Mainstream-Filter. Lange, tiefe Denkketten besser Gemini 4 Carbon oder Argon überlassen. Ein Viertel günstiger als Argon, knapp doppelt so teuer wie Gemini 3.8 Flash.",
        gemini4Carbon:
          "Googles stärkstes Gemini und derzeit eines der besten Modelle überhaupt. Gemacht für den härtesten Code, lange Agentenläufe und komplexes Reasoning, nimmt Text, Bilder, Video und Audio auf. Ruft Tools auf, 1M Kontext. Mainstream-Filter. Verbraucht pro Aufgabe mehr Tokens als Argon und kostet in der Praxis daher mehr. Der Einführungspreis entspricht bis 30. November Argon, Claude Sonnet 5.5 und GPT-6.1 Sol, danach verdoppelt er sich auf das Niveau von Claude Opus 5.5.",
        minimaxM31Flash:
          "Das schnelle Modell von MiniMax und ein großer Sprung gegenüber M3: deutlich stärker bei Agenten, Code und Security-Aufgaben. Liest Bilder und Videos, ruft Tools auf, 1M Kontext, lockerere Filter als die Mainstream-Anbieter. Denkt vor jeder Antwort nach und schreibt ausführlich, daher langsamer und wortreicher als andere Flash-Modelle. Kostet die Hälfte von M3 oder weniger und spielt in derselben Budgetklasse wie DeepSeek V4.1 Flash und Qwen 3.8 Flash.",
        metaMuseEmber:
          "Metas kleinstes Muse-Modell, gebaut für die Arbeit, die Agenten den ganzen Tag wiederholen: Tool-Aufrufe, Routing, Datenextraktion und schneller Chat. Verarbeitet Text, Bilder, Video und Audio, 1M Kontext, lockerere Filter als die Mainstream-Anbieter. Für seine Größe stark bei Tool-Nutzung und Computer-Aufgaben, flach bei schwierigem Code und tiefem Reasoning. Preisgleich mit GPT-6 Luna und Claude Haiku 5.5, bei Prompts über 200K Tokens dreimal so teuer.",
        veniceDeepseekV41FlashUncensored:
          "DeepSeek V4.1 Flash ohne Verweigerungen, bereitgestellt über Venice. Echtes Programmieren und Analysieren, dazu Fiktion und Rollenspiel, ganz ohne Belehrungen. Liest Bilder, ruft Tools auf, 1M Kontext, günstig. Gleiches Training, gleiches Weltbild: DeepSeeks Einordnung prägt weiter politische Antworten und kann die düstersten Szenen entschärfen. UncensoredLM bringt ein anderes Weltbild mit. Etwa viermal so teuer wie das normale DeepSeek V4.1 Flash. GLM 5.3 Flash Uncensored ist die günstigere ungefilterte Alternative.",
        drummerArtemis31b:
          "Das Gemma-4-31B-Finetune von TheDrummer für Rollenspiel und Fiktion. Bleibt in der Rolle, schreibt Grimdark und explizite Szenen für Erwachsene ohne Verweigerung und hält die Sprache lebendig statt glattgebügelt. Liest Bilder, ruft Tools auf, 262K Kontext. Schwach bei Code und harter Analyse: ein Erzähler, kein Denker. Ein Community-Finetune auf einem einzigen NanoGPT-Host, fällt also gelegentlich kurz aus. Kostet rund ein Fünftel von Venice Role Play Uncensored. Braucht die Geschichte echte Logik, ist DeepSeek V4.1 Flash Uncensored die klügere Wahl.",
        grokImagineImage2:
          "Die zweite Generation des Grok-Imagine-Bildmodells von xAI. Nimmt Text oder ein Referenzbild und beherrscht damit Bearbeitungen ebenso wie neue Bilder. Mittleres Preisniveau. Open-Stufe: lockerere Filter als Mainstream-Modelle, nicht explizit. Das Upgrade gegenüber Grok Imagine T2I, wenn Bearbeitung oder genauere Prompt-Treue gefragt ist.",
        qwenImage3:
          "Die schnelle Stufe von Alibabas Qwen Image 3. Erzeugt Bilder aus Text und bearbeitet Referenzbilder, zum niedrigen Preis. Gut für schnelle Bearbeitungen, textlastige Grafiken und Iterationen. Qwen Image 3 Pro bringt für etwas mehr Geld mehr Detail; für unzensierte Bearbeitungen gibt es Qwen Edit Uncensored.",
        qwenImage3Pro:
          "Die Qualitätsstufe von Alibabas Qwen Image 3. Text oder Referenzbild als Eingabe, mehr Detail und Feinschliff als das normale Qwen Image 3 bei moderatem Aufpreis. Stark bei Bearbeitungen und Text im Bild. Open-Stufe, also nicht explizit; dafür gibt es Qwen Edit Uncensored.",
        hailuo3:
          "Hailuo 3 von MiniMax. Ton aus dem Modell, Ausgabe in 2K, Clips bis 15 Sekunden, Steuerung über Start- und Endbild. Auf dem Papier ein klarer Sprung gegenüber Hailuo 2.3, zum etwa doppelten Preis. Oberes Preissegment; günstiger 1080p ohne Ton liefert Hailuo 2.3 T2V.",
        seedance25:
          "Seedance 2.5 von ByteDance. Das Hauptargument ist die Länge: Clips bis 30 Sekunden mit Ton aus dem Modell und Bildsteuerung, in 480p oder 720p. Pro Clip das teuerste Seedance. Die Wahl für lange, durchgehende Einstellungen; für schärfere kurze Clips schafft Seedance 2.0 bis 4K.",
        flux3Video:
          "Flux 3 Video - Black Forest Labs' Flaggschiff-Videogenerierungsmodell mit herausragender Qualität.",
        grokImagineVideo15:
          "Grok Imagine Video 1.5 von xAI. Clips bis 15 Sekunden in 480p, 720p oder 1080p, optional mit Startbild. Bei der Auflösung ein Schritt über Grok T2V, zum etwa doppelten Preis. Open-Stufe: lockerere Filter als Veo oder Sora, nicht explizit.",
        lyria3ProPreview:
          "Die Premiumstufe von Googles Lyria 3, noch im Preview-Status. Gebaut für Songs in voller Länge mit hoher Produktionsqualität. Mainstream: Googles Filter greifen. Etwa anderthalbmal so teuer wie Lyria 3. Preview heißt: Verhalten und Verfügbarkeit können sich noch ändern.",
        lyria3ClipPreview:
          "Lyria 3 Clip von Google für Kurzformate, im Preview-Status. Schnelle, günstige Musikclips für Intros, Jingles und Social-Posts. Mainstream-Filter greifen. Nur kurze Längen; für längere Tracks Lyria 3 oder Lyria 3 Pro Preview nutzen.",
        geminiNanoBanana21:
          "Nano Banana 2.1 von Google. Erzeugt und bearbeitet Bilder direkt im Chat, Text und Bild in derselben Antwort. Rund 3 bis 4 Credits pro Bild, halber Bildpreis des ursprünglichen Nano Banana, den es ablöst. Stark bei präzisen Bearbeitungen und lesbarem Text im Bild. Mainstream-Filter, keine Tool-Aufrufe. Bei komplexen Szenen bleibt Nano Banana Pro vorn, zum etwa vierfachen Preis.",
        seedream55:
          "Seedream 5.5 von ByteDance. Erzeugt Bilder aus Text oder bearbeitet bis zu zehn Referenzbilder. Stark bei Porträts, konsistenten Figuren und Szenen aus mehreren Bildern. 2 Credits pro Bild, halber Preis von Seedream 4.5, das es ablöst. Open-Stufe: lockerere Filter als Mainstream-Modelle, nicht explizit.",
        flux3Image:
          "FLUX.3 von Black Forest Labs. Schärfere Details, saubererer Text und genauere Prompt-Treue als FLUX.2, aus Text oder Referenzbildern. Rund 5 Credits pro Bild, günstiger als FLUX.2 Max, das es ablöst. Open-Stufe, nicht explizit. Für den Alltag bleibt FLUX.2 Pro günstiger; für Masse gibt es FLUX.3 Klein.",
        flux3Klein:
          "Das kleine, schnelle FLUX.3. Unter 1 Credit pro Bild, damit eines der günstigsten Modelle im Katalog, und es nimmt trotzdem Referenzbilder für Bearbeitungen. Gebaut für Entwürfe, Vorschaubilder und Serienläufe. Weniger Detail als das volle FLUX.3. Open-Stufe, nicht explizit.",
        gptImage26Flare:
          "GPT Image 2.6 von OpenAI in der Tempo-Variante. Text oder Referenzbild rein, schnell saubere Ergebnisse, stark bei Text und Layouts. Rund 4 Credits pro Bild. Mainstream: OpenAIs strenge Filter greifen. Für dichte Kompositionen und detailreiche Bearbeitungen ist Sunburst die Schwester.",
        gptImage26Sunburst:
          "GPT Image 2.6 von OpenAI, auf Detail getrimmt. Dichte Kompositionen, textlastige Plakate und Bearbeitungen, die Details über viele Runden halten. Rund 6 Credits pro Bild. Mainstream: OpenAIs strenge Filter greifen. Flare ist schneller und günstiger, wenn feine Details weniger zählen.",
        geminiOmni12Flash:
          "Gemini Omni 1.2 Flash, das Videomodell von Google. Clips von 3 bis 15 Sekunden mit Ton aus dem Modell, von 360p bis 4K, mit Steuerung über Start- und Endbild. Rund 7 Credits pro Sekunde in 720p und 10 in 1080p, günstiger als Veo 3.1 Fast bei gleicher Auflösung. Googles Filter greifen.",
        grokImagineVideo15Lite:
          "Die schnelle, günstige Fassung von Grok Imagine Video 1.5 von xAI. Clips von 1 bis 15 Sekunden in 480p, 720p oder 1080p, optional mit Startbild. 3 Credits pro Sekunde in 720p, weniger als die Hälfte des ursprünglichen Grok-Imagine-Videos, das es ablöst. Etwas Qualität gegen Tempo getauscht; das volle Grok Imagine Video 1.5 sieht besser aus. Open-Stufe, nicht explizit.",
        wan30:
          "Wan 3.0 von Alibaba. Clips von 2 bis 30 Sekunden mit Ton aus dem Modell, 480p bis 1080p, Steuerung über Start- und Endbild. 10 Credits pro Sekunde in 720p, so viel wie Wan 2.7, das es ablöst, dazu eine 480p-Stufe zum halben Preis. Lange Einstellungen mit kleinem Budget. Open-Stufe, nicht explizit.",
        seedance2Mini:
          "Das Sparmodell von Seedance 2.0. Text oder Bild zu Video, 4 bis 15 Sekunden, Ton aus dem Modell, Start- und Endbild-Steuerung, in 480p oder 720p. Rund 7,6 Credits pro Sekunde in 720p, unter Seedance 2.0 Fast. Gut für Entwürfe und Social-Clips; bei Bedarf liefert Seedance 2.0 bis 4K. Open-Stufe, nicht explizit.",
        hailuo3Max:
          "Hailuo 3 Max von MiniMax, eine auf Tempo nachtrainierte Fassung von Hailuo 3. Clips von 5 bis 15 Sekunden in 768p oder 480p mit Start- und Endbild-Steuerung, ohne Ton. 8 Credits pro Sekunde, deutlich unter Hailuo 3. Ideal für schnelle Iterationen; Hailuo 3 bringt 2K und Ton. Open-Stufe, nicht explizit.",
        runwayGen45:
          "Gen-4.5 von Runway. Kinoreife Bewegung und hohe Prompt-Treue, Text oder Startbild rein, Clips von 2 bis 10 Sekunden in 720p, ohne Ton. 12 Credits pro Sekunde, oberes Mittelfeld. Stark für filmische Einstellungen; wer Ton im Clip braucht, nimmt Veo 3.1 Fast oder Wan 3.0. Open-Stufe, nicht explizit.",
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
        openaiWhisper:
          "Die Spracherkennung Whisper von OpenAI, trainiert auf 99 Sprachen. Transkribiert Interviews, Sprachnotizen und Meetings und kommt gut mit Akzenten und Hintergrundgeräuschen zurecht. Günstig pro Nutzung. Keine Sprecherkennzeichnung, und bei langen Pausen erfindet es mitunter Text. Als neuere OpenAI-Option bietet sich GPT-4o Mini Transcribe an.",
        deepgramNova2: "Deepgram Nova-2",
        whisperLargeV3:
          "Whisper Large V3 - Open-Weight-Modell von OpenAI, 99 Sprachen, deutlich günstiger als gehostetes whisper-1.",
        voxtralMini:
          "Voxtral Mini Transcribe - Mistral-Transkription mit Sprechertrennung und Segment-Zeitstempeln, bis zu 10 Minuten.",
        nemotronAsr:
          "Nemotron ASR - offene mehrsprachige Spracherkennung von NVIDIA, 40 Sprachvarianten, geringe Latenz.",
        gpt4oMiniTranscribe:
          "GPT-4o Mini Transcribe - Niedrigere Wortfehlerrate als Whisper, bessere Spracherkennung.",
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
        openaiAlloy:
          "Die Stimme Alloy von OpenAI. Ausgewogen und neutral, weder klar männlich noch weiblich, mit ruhigem Tempo. Passt zu Erzählungen, Erklärstücken und professionellen Inhalten, bei denen die Stimme nicht im Vordergrund stehen soll. Kostet nur Bruchteile eines Cents. Weniger Wärme als Nova, weniger Gewicht als Onyx.",
        openaiNova:
          "Die Stimme Nova von OpenAI. Hell, warm und freundlich, mit weiblicher Klangfarbe. Passt zu Assistenten, Dialog-Apps und lockeren, positiven Texten. Sehr günstig. Weniger geeignet für ernste oder formelle Inhalte; dafür ist Onyx die bessere Wahl.",
        openaiOnyx:
          "Die Stimme Onyx von OpenAI. Tiefe, ruhige Männerstimme mit Autorität. Passt zu Dokumentationen, formellen Sprechertexten und Ansagen. Sehr günstig. Für lockere Unterhaltungen mitunter zu schwer; Nova ist die leichtere, freundlichere Wahl.",
        openaiEcho: "OpenAI Echo",
        openaiShimmer: "OpenAI Shimmer",
        openaiFable: "OpenAI Fable",
        elevenlabsRachel: "ElevenLabs Rachel",
        elevenlabsJosh: "ElevenLabs Josh",
        elevenlabsBella: "ElevenLabs Bella",
        elevenlabsAdam: "ElevenLabs Adam",
        kokoroBella:
          "Kokoro Bella - Open-Weight-Modell, warme amerikanische Frauenstimme. Kein Inhaltsfilter.",
        kokoroSarah:
          "Kokoro Sarah - Open-Weight-Modell, klare amerikanische Frauenstimme. Kein Inhaltsfilter.",
        kokoroNicole:
          "Kokoro Nicole - Open-Weight-Modell, weiche, zurückhaltende Frauenstimme. Kein Inhaltsfilter.",
        kokoroAdam:
          "Kokoro Adam - Open-Weight-Modell, ruhige amerikanische Männerstimme. Kein Inhaltsfilter.",
        kokoroMichael:
          "Kokoro Michael - Open-Weight-Modell, selbstbewusste amerikanische Männerstimme. Kein Inhaltsfilter.",
        kokoroEmma:
          "Kokoro Emma - Open-Weight-Modell, britische Frauenstimme. Kein Inhaltsfilter.",
        kokoroGeorge:
          "Kokoro George - Open-Weight-Modell, britische Männerstimme. Kein Inhaltsfilter.",
        inworldAshley:
          "Inworld Ashley - Schnelle, günstige Frauenstimme mit lebendigem Vortrag.",
        inworldCraig:
          "Inworld Craig - Schnelle, günstige britische Männerstimme.",
        xaiEve:
          "xAI Eve - Ausdrucksstarke Frauenstimme mit Emotionssteuerung im Text.",
        geminiZephyr:
          "Gemini Zephyr - Helle Frauenstimme, über 100 Sprachen, steuerbarer Vortrag.",
        geminiPuck:
          "Gemini Puck - Lebhafte Männerstimme, über 100 Sprachen, steuerbarer Vortrag.",
      },
    },
  },
};
