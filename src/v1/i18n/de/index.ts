import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "KI",

  tags: {
    api: "OpenAI-kompatible API",
  },

  openai: {
    missingKey:
      "API-Schlüssel fehlt. Sende ihn als 'Authorization: Bearer <Schlüssel>' oder 'x-api-key: <Schlüssel>'. Erstelle einen unter Einstellungen > API-Schlüssel.",
    invalidKey:
      "Ungültiger oder widerrufener API-Schlüssel. Prüfe den Schlüssel oder erstelle unter Einstellungen > API-Schlüssel einen neuen.",
    authUnavailable:
      "API-Schlüssel gerade nicht prüfbar. Dein Schlüssel wurde nicht abgelehnt. In {{seconds}}s erneut versuchen.",
    modelNotFound:
      "Das Modell '{{model}}' existiert nicht oder steht dir nicht zur Verfügung. Deine Modelle: GET /v1/models.",
    paidRequired:
      "Die API ist in bezahlten Tarifen verfügbar. Abonniere oder kaufe Credits, um /v1 aufzurufen: siehe Einstellungen > API-Schlüssel.",
    toolsUnsupportedByModel:
      "Dieses Modell unterstützt keine Tool-Aufrufe. Wähle ein Modell mit Tool-Unterstützung oder entferne 'tools'.",
    badToolArguments:
      "Die Argumente des Tool-Aufrufs '{{name}}' sind kein gültiges JSON.",
    toolChoiceUnknown:
      "tool_choice nennt '{{name}}', das nicht in 'tools' enthalten ist.",
    toolMessageNeedsId:
      "Die Tool-Nachricht {{param}} braucht eine tool_call_id.",
    nUnsupported: "Nur n=1 wird unterstützt.",
    badImageUrl:
      "image_url muss eine http(s)-URL oder eine base64-data:-URL sein.",
    insufficientCredits:
      "Nicht genug Credits. Dieser Aufruf braucht etwa {{cost}}, du hast {{balance}}. Lade auf, um weiterzumachen.",
    rateLimited:
      "Limit erreicht: {{limit}} Anfragen pro Minute für diesen Schlüssel. Neuer Versuch in {{seconds}} s.",
    upstreamFailed: "Der Modellanbieter ist fehlgeschlagen: {{error}}",
    balanceCheckFailed:
      "Dein Guthaben konnte nicht geprüft werden. Es wurde nichts ausgeführt. Versuch es erneut.",
  },

  models: {
    get: {
      title: "OpenAI-kompatible Modelle",
      titleShort: "v1-Modelle",
      description:
        "Listet die Modelle, die dein API-Schlüssel aufrufen kann. OpenAI-Listenformat. Authentifizierung per Authorization: Bearer <Schlüssel>.",
      response: { object: "Objekttyp" },
      success: {
        title: "Modelle aufgelistet",
        description: "Die für diesen API-Schlüssel verfügbaren Modelle",
      },
    },
  },

  completions: {
    post: {
      title: "OpenAI-kompatible Chat-Completions",
      titleShort: "v1-Chat-Completions",
      description:
        "Jedes Modell im OpenAI-Chat-Completions-Format aufrufen. Abrechnung über deine Credits zu Chat-Preisen. Unterstützt stream: true.",
      fields: {
        model: {
          label: "Modell",
          description: "Modell-ID aus GET /v1/models",
        },
        messages: {
          label: "Nachrichten",
          description: "OpenAI-Nachrichtenliste (system, user, assistant)",
        },
        stream: {
          label: "Streaming",
          description: "Antwort als Server-Sent Events senden",
        },
        streamOptions: {
          label: "Stream-Optionen",
          description: "{ include_usage: true } hängt einen Nutzungs-Chunk an",
        },
        maxTokens: {
          label: "Max. Tokens",
          description: "Obergrenze für erzeugte Tokens",
        },
        maxCompletionTokens: {
          label: "Max. Completion-Tokens",
          description: "Wie max_tokens; hat Vorrang",
        },
        temperature: {
          label: "Temperatur",
          description: "Sampling-Temperatur, 0 bis 2",
        },
        topP: {
          label: "Top P",
          description: "Nucleus-Sampling, 0 bis 1",
        },
        stop: {
          label: "Stopp",
          description: "Stoppsequenz oder Liste davon",
        },
        n: {
          label: "Antworten",
          description: "Nur 1 wird unterstützt",
        },
        tools: {
          label: "Tools",
          description:
            "OpenAI-Funktions-Tools, die das Modell aufrufen darf: [{type:'function', function:{name, description, parameters}}]",
        },
        toolChoice: {
          label: "Tool-Auswahl",
          description:
            "none, auto, required oder {type:'function', function:{name}}",
        },
        parallelToolCalls: {
          label: "Parallele Tool-Aufrufe",
          description:
            "Nur aus Kompatibilitätsgründen akzeptiert; das Modell entscheidet",
        },
      },
      response: { object: "Objekttyp" },
      success: {
        title: "Completion erstellt",
        description: "Das Modell hat geantwortet",
      },
    },
  },

  responses: {
    previousResponseUnsupported:
      "previous_response_id wird nicht unterstützt: Antworten werden nicht gespeichert. Sende den kompletten Verlauf in 'input' mit store: false (Codex CLI macht das standardmäßig).",
    badInputItem:
      "{{param}} ist nicht verwendbar: Bilder brauchen eine http(s)- oder base64-data:-URL, Tool-Einträge eine call_id.",
    post: {
      title: "OpenAI Responses API",
      titleShort: "v1 responses",
      description:
        "Jedes Modell im OpenAI-Responses-Format aufrufen, dem Format von Codex CLI. Zustandslos: Der komplette Verlauf kommt in input. Mit Streaming, function-, custom- und local_shell-Tools sowie Reasoning-Einträgen.",
      fields: {
        model: { label: "Modell", description: "Modell-ID aus GET /v1/models" },
        input: {
          label: "Eingabe",
          description:
            "Ein String oder der Verlauf als Responses-Einträge (message, function_call, function_call_output, reasoning, ...)",
        },
        instructions: {
          label: "Anweisungen",
          description: "Systemanweisungen für das Modell",
        },
        stream: {
          label: "Stream",
          description: "Antwort als Responses-Server-Sent-Events senden",
        },
        tools: {
          label: "Tools",
          description:
            "function-, custom- und local_shell-Tools. Gehostete Tools (web_search, ...) werden übersprungen.",
        },
        toolChoice: {
          label: "Tool-Auswahl",
          description: "none, auto, required oder {type:'function', name}",
        },
        parallelToolCalls: {
          label: "Parallele Tool-Aufrufe",
          description:
            "Aus Kompatibilitätsgründen akzeptiert; das Modell entscheidet",
        },
        maxOutputTokens: {
          label: "Max. Ausgabe-Tokens",
          description: "Obergrenze für erzeugte Tokens",
        },
        temperature: {
          label: "Temperatur",
          description: "Sampling-Temperatur, 0 bis 2",
        },
        topP: { label: "Top P", description: "Nucleus-Sampling, 0 bis 1" },
        reasoning: {
          label: "Reasoning",
          description:
            "Aus Kompatibilitätsgründen akzeptiert. Reasoning-Modelle liefern Reasoning-Einträge ohnehin.",
        },
        text: {
          label: "Textformat",
          description:
            "{format:{type:'json_schema', schema}} fordert JSON-Ausgabe an",
        },
        store: {
          label: "Speichern",
          description: "Antworten werden nie gespeichert; sende false",
        },
        previousResponseId: {
          label: "Vorherige Antwort-ID",
          description:
            "Nicht unterstützt: Sende stattdessen den kompletten Verlauf",
        },
        include: {
          label: "Include",
          description:
            "Aus Kompatibilitätsgründen akzeptiert. Reasoning-Einträge tragen immer encrypted_content zur Wiederverwendung.",
        },
      },
      response: { object: "Objekttyp" },
      success: {
        title: "Antwort erstellt",
        description: "Das Modell hat geantwortet",
      },
    },
  },

  messages: {
    badContentBlock:
      "{{param}} enthält einen unbrauchbaren Inhaltsblock: Bilder brauchen base64 oder eine http(s)-URL.",
    post: {
      title: "Anthropic Messages API",
      titleShort: "v1 messages",
      description:
        "Jedes Modell im Anthropic-Messages-Format aufrufen, dem Format von Claude Code. Schlüssel als x-api-key oder Authorization: Bearer. Mit Streaming, Tools und Thinking-Blöcken.",
      fields: {
        model: {
          label: "Modell",
          description:
            "Modell-ID aus GET /v1/models. Claude-IDs wie claude-sonnet-4-5-20250929 landen beim passenden Claude-Modell.",
        },
        messages: {
          label: "Nachrichten",
          description:
            "Anthropic-Nachrichten: user- und assistant-Züge mit text-, image-, tool_use-, tool_result- und thinking-Blöcken",
        },
        system: {
          label: "System",
          description: "Systemprompt: ein String oder Textblöcke",
        },
        maxTokens: {
          label: "Max. Tokens",
          description: "Obergrenze für erzeugte Tokens",
        },
        stream: {
          label: "Stream",
          description: "Antwort als Anthropic-Server-Sent-Events senden",
        },
        tools: {
          label: "Tools",
          description:
            "Client-Tools: [{name, description, input_schema}]. Server-Tools (web_search, ...) werden übersprungen.",
        },
        toolChoice: {
          label: "Tool-Auswahl",
          description: "{type: auto | any | none | tool, name}",
        },
        stopSequences: {
          label: "Stoppsequenzen",
          description: "Zeichenfolgen, die die Antwort beenden",
        },
        temperature: {
          label: "Temperatur",
          description: "Sampling-Temperatur",
        },
        topP: { label: "Top P", description: "Nucleus-Sampling, 0 bis 1" },
        thinking: {
          label: "Thinking",
          description:
            "Aus Kompatibilitätsgründen akzeptiert. Reasoning-Modelle liefern Thinking-Blöcke ohnehin.",
        },
      },
      response: { type: "Objekttyp" },
      success: {
        title: "Nachricht erstellt",
        description: "Das Modell hat geantwortet",
      },
    },
  },

  countTokens: {
    post: {
      title: "Anthropic-Tokenzählung",
      titleShort: "v1 count tokens",
      description:
        "Schätzt die Eingabe-Tokens einer Anthropic-Messages-Anfrage. Kostenlos: kein Modellaufruf, keine Credits.",
      fields: {
        action: { label: "Aktion", description: "Immer count_tokens" },
        model: { label: "Modell", description: "Modell-ID" },
        messages: {
          label: "Nachrichten",
          description: "Anthropic-Nachrichten",
        },
        system: { label: "System", description: "Systemprompt" },
        tools: { label: "Tools", description: "Tool-Definitionen" },
      },
      response: { inputTokens: "Eingabe-Tokens" },
      success: {
        title: "Tokens gezählt",
        description: "Geschätzte Eingabe-Tokens",
      },
    },
  },

  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Ungültige Anfrage",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Ein gültiger API-Schlüssel ist erforderlich",
    },
    server: { title: "Serverfehler", description: "Interner Serverfehler" },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unbekannter Fehler ist aufgetreten",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Netzwerkfehler aufgetreten",
    },
    forbidden: { title: "Verboten", description: "Zugriff verweigert" },
    notFound: { title: "Nicht gefunden", description: "Modell nicht gefunden" },
    conflict: {
      title: "Konflikt",
      description: "Anfrage steht im Konflikt mit dem Zustand",
    },
  },
};
