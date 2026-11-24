import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "KI",

  tags: {
    api: "OpenAI-kompatible API",
  },

  promptCache: {
    label: "Prompt-Cache",
    description:
      "Gemeinsamen Prompt-Anfang zwischenspeichern und bei Bedarf die Speicherdauer festlegen.",
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
      "Die API braucht ein bezahltes Konto: einen beliebigen Tarif, ab {{subPrice}} im Monat. Hol ihn dir unter {{url}}.",
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
        "Schätzt die Eingabe-Tokens einer Anthropic-Messages-Anfrage. Kein Modellaufruf, keine Credits.",
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

  media: {
    images: {
      generations: {
        title: "OpenAI-kompatible Bildgenerierung",
        titleShort: "v1-Bilder",
        description:
          "Bilder mit jedem Bildmodell aus GET /v1/models erzeugen. OpenAI-Bildformat: url (signiert, 7 Tage gültig) oder b64_json. Abrechnung pro Bild.",
        success: {
          title: "Bilder erzeugt",
          description: "Die Bilder sind gespeichert und verlinkt",
        },
      },
      edits: {
        title: "OpenAI-kompatible Bildbearbeitung",
        titleShort: "v1-Bildbearbeitung",
        description:
          "Ein Bild per Prompt bearbeiten, mit einem Modell, das Bildeingabe versteht. Als Multipart-Feld 'image' hochladen oder 'image_url' senden. Abrechnung pro Bild.",
        success: {
          title: "Bild bearbeitet",
          description: "Das bearbeitete Bild ist gespeichert und verlinkt",
        },
      },
    },
    speech: {
      title: "OpenAI-kompatible Sprachausgabe",
      titleShort: "v1-Sprachausgabe",
      description:
        "Text in Sprache umwandeln. Antwortet mit den Audiodaten (standardmäßig mp3). Abrechnung pro Zeichen.",
      success: { title: "Sprache erzeugt", description: "Die Audiodatei" },
    },
    transcriptions: {
      title: "OpenAI-kompatible Transkription",
      titleShort: "v1-Transkription",
      description:
        "Eine Audiodatei transkribieren (Multipart-Feld 'file', bis 25 MB). JSON, Text, SRT, WebVTT oder ausführliches JSON mit Segmenten. Abrechnung pro Audiosekunde.",
      success: {
        title: "Audio transkribiert",
        description: "Das Transkript",
      },
    },
    translations: {
      title: "OpenAI-kompatible Audioübersetzung",
      titleShort: "v1-Übersetzung",
      description:
        "Eine Audiodatei mit Whisper direkt in englischen Text überführen. Gleiche Formate und Abrechnung wie bei Transkriptionen.",
      success: {
        title: "Audio übersetzt",
        description: "Das englische Transkript",
      },
    },
    videos: {
      create: {
        title: "Videogenerierung (asynchron)",
        titleShort: "v1-Videos",
        description:
          "Startet einen Videojob im Format der OpenAI-Video-API. Antwortet sofort mit dem Job; Status per GET /v1/videos/{id}, Download per GET /v1/videos/{id}/content. Abrechnung erst, wenn das Video fertig ist.",
        success: {
          title: "Videojob eingereiht",
          description: "Status über die ID abfragen",
        },
      },
      get: {
        title: "Videojob-Status",
        titleShort: "v1-Videostatus",
        description:
          "Status, Fortschritt und Ergebnis-URL eines Videojobs. Abfragen ist kostenlos und zählt nicht gegen das Ratenlimit.",
        success: { title: "Videojob", description: "Aktueller Jobzustand" },
      },
      content: {
        title: "Video-Download",
        titleShort: "v1-Videodatei",
        description: "Die fertige Videodatei eines abgeschlossenen Jobs.",
        success: { title: "Videodatei", description: "Die MP4-Daten" },
      },
    },
    music: {
      create: {
        title: "Musikgenerierung (asynchron)",
        titleShort: "v1-Musik",
        description:
          "Startet einen Musikjob. Antwortet sofort mit dem Job; Status per GET /v1/music/{id}, Download per GET /v1/music/{id}/content. Abrechnung pro Clip, sobald er fertig ist.",
        success: {
          title: "Musikjob eingereiht",
          description: "Status über die ID abfragen",
        },
      },
      get: {
        title: "Musikjob-Status",
        titleShort: "v1-Musikstatus",
        description:
          "Status und Ergebnis-URL eines Musikjobs. Abfragen ist kostenlos und zählt nicht gegen das Ratenlimit.",
        success: { title: "Musikjob", description: "Aktueller Jobzustand" },
      },
      content: {
        title: "Musik-Download",
        titleShort: "v1-Musikdatei",
        description: "Die fertige Audiodatei eines abgeschlossenen Musikjobs.",
        success: { title: "Musikdatei", description: "Die Audiodaten" },
      },
    },
    file: {
      title: "Mediendatei-Download",
      titleShort: "v1-Mediendatei",
      description:
        "Eine Datei herunterladen, die ein Medienaufruf erzeugt hat. Die signierte URL funktioniert 7 Tage lang ohne Schlüssel; mit deinem API-Schlüssel jederzeit.",
      success: { title: "Datei", description: "Die Dateidaten" },
    },
    fields: {
      model: {
        label: "Modell",
        imageDescription: "Bildmodell-ID aus GET /v1/models (modality: image)",
        speechDescription:
          "Eine Stimmen-ID aus GET /v1/models (modality: speech), z. B. openai-nova. Oder tts-1 plus eine Stimme.",
        transcriptionDescription:
          "Transkriptionsmodell-ID aus GET /v1/models (modality: transcription). whisper-1 funktioniert.",
        translationDescription:
          "Ein Whisper-Modell von OpenAI: whisper-1 oder openai-whisper",
        videoDescription: "Videomodell-ID aus GET /v1/models (modality: video)",
        musicDescription: "Musikmodell-ID aus GET /v1/models (modality: music)",
      },
      prompt: {
        label: "Prompt",
        imageDescription: "Was gezeichnet werden soll, bis 2000 Zeichen",
        editDescription: "Was am Bild geändert werden soll",
        transcriptionDescription:
          "Aus Kompatibilitätsgründen akzeptiert; nicht jeder Anbieter erhält ihn",
        videoDescription: "Was im Clip passiert, bis 2000 Zeichen",
        musicDescription: "Stil, Stimmung, Instrumente, Tempo",
      },
      n: {
        label: "Bilder",
        description: "Anzahl der Bilder, 1 bis 4. Jedes wird berechnet.",
      },
      size: {
        label: "Größe",
        imageDescription:
          "BREITExHÖHE wie 1024x1024 oder 1536x1024, oder auto. Wählt die nächstliegende Größe und das Seitenverhältnis, das das Modell kann.",
        videoDescription:
          "BREITExHÖHE wie 1280x720. Legt das Seitenverhältnis fest und, wo das Modell es anbietet, die Auflösung.",
      },
      aspectRatio: {
        label: "Seitenverhältnis",
        imageDescription:
          "1:1, 16:9, 9:16, 4:3, 3:4, 3:2, 2:3 oder 21:9. Hat Vorrang vor size.",
        videoDescription:
          "16:9, 9:16, 1:1, 4:3, 3:4, 3:2, 2:3, 21:9 oder 9:21. Hat Vorrang vor size.",
      },
      quality: {
        label: "Qualität",
        description:
          "standard, hd, low, medium, high oder auto. hd und high fordern die Detailstufe an, wo das Modell eine hat.",
      },
      style: {
        label: "Stil",
        description:
          "Aus Kompatibilitätsgründen akzeptiert. Den Stil in den Prompt schreiben.",
      },
      responseFormat: {
        label: "Antwortformat",
        imageDescription:
          "url (Standard, signierter Link, 7 Tage gültig) oder b64_json",
        speechDescription:
          "mp3 (Standard), opus, aac, flac, wav oder pcm. Welche eine Stimme liefert, hängt vom Anbieter ab.",
        transcriptionDescription:
          "json (Standard), text, srt, verbose_json oder vtt",
      },
      user: {
        label: "Nutzer",
        description:
          "ID deines Endnutzers. Aus Kompatibilitätsgründen akzeptiert.",
      },
      image: {
        label: "Bild",
        description: "Das zu bearbeitende Bild als Multipart-Datei-Upload",
      },
      imageUrl: {
        label: "Bild-URL",
        description:
          "Das zu bearbeitende Bild als http(s)-URL oder base64-data:-URL, für JSON-Anfragen",
        videoDescription:
          "Erstes Bild als http(s)-URL oder base64-data:-URL (Bild-zu-Video)",
      },
      mask: {
        label: "Maske",
        description: "Nicht unterstützt. Die Änderung im Prompt beschreiben.",
      },
      input: {
        label: "Eingabe",
        description: "Der zu sprechende Text, bis 4096 Zeichen",
      },
      voice: {
        label: "Stimme",
        description:
          "Mit einem OpenAI-Modellnamen (tts-1): alloy, nova, onyx, echo, shimmer oder fable. Oder jede Stimmen-ID aus GET /v1/models.",
      },
      speed: {
        label: "Tempo",
        description:
          "0.25 bis 4.0. Wirkt bei Stimmen von OpenAI, NanoGPT und ElevenLabs.",
      },
      instructions: {
        label: "Anweisungen",
        description:
          "Aus Kompatibilitätsgründen akzeptiert; Stimmen lesen die Eingabe wie geschrieben",
      },
      file: {
        label: "Datei",
        description:
          "Die Audiodatei: mp3, mp4, m4a, wav, webm, ogg oder flac, bis 25 MB",
      },
      language: {
        label: "Sprache",
        description:
          "ISO-639-1-Code der gesprochenen Sprache, z. B. en oder de. Standard: die Sprache in der URL.",
      },
      temperature: {
        label: "Temperatur",
        description: "Aus Kompatibilitätsgründen akzeptiert",
      },
      seconds: {
        label: "Sekunden",
        videoDescription:
          "Cliplänge. Wird auf die Längen gerundet, die das Modell anbietet.",
        musicDescription:
          "Gewünschte Länge: etwa 8, 20 oder 30 Sekunden. Das Modell kann runden.",
      },
      resolution: {
        label: "Auflösung",
        description: "z. B. 720p oder 1080p, wo das Modell die Wahl lässt",
      },
      negativePrompt: {
        label: "Negativ-Prompt",
        description:
          "Was nicht im Clip vorkommen soll, wo das Modell es unterstützt",
      },
      inputReference: {
        label: "Eingabereferenz",
        description: "Erstes Bild als Multipart-Bild-Upload (Bild-zu-Video)",
      },
      jobId: { label: "Job-ID", description: "Die ID aus der POST-Antwort" },
      threadId: { label: "Ordner", description: "Speicherordner der Datei" },
      filename: { label: "Dateiname", description: "Gespeicherter Dateiname" },
      expires: {
        label: "Ablauf",
        description: "Unix-Zeit, ab der der signierte Link nicht mehr gilt",
      },
      sig: { label: "Signatur", description: "Signatur des Links" },
    },
    response: {
      created: "Erstellt",
      object: "Objekttyp",
      text: "Text",
      id: "Job-ID",
      status: "Status",
    },
    errors: {
      badSize:
        "size '{{size}}' ist weder BREITExHÖHE (wie 1024x1024) noch auto.",
      maskUnsupported:
        "Masken werden nicht unterstützt. Beschreib die Änderung stattdessen im Prompt.",
      oneImageOnly: "Ein Bild pro Bearbeitung. Sende ein einzelnes 'image'.",
      imageTooLarge: "Das Bild ist größer als {{max}} MB.",
      imageRequired:
        "Sende das zu bearbeitende Bild: Multipart-Feld 'image' oder 'image_url' im JSON.",
      modelCannotEdit:
        "{{model}} nimmt kein Eingabebild an. Wähle ein Bild-zu-Bild-Modell aus GET /v1/models (input_modalities enthält image).",
      storageFailed:
        "Die Datei wurde erzeugt, konnte aber nicht gespeichert werden. Versuch es erneut.",
      voiceNotFound:
        "Keine Stimme '{{voice}}' für dich verfügbar. Stimmen auflisten mit GET /v1/models (modality: speech), oder Modell tts-1 mit Stimme nova nutzen.",
      formatUnsupported:
        "{{voice}} liefert {{supported}}. Fordere eines davon als response_format an.",
      audioTooLarge: "Die Audiodatei ist größer als 25 MB.",
      fileRequired: "Lade das Audio als Multipart-Feld 'file' hoch.",
      translationUnsupported:
        "{{model}} kann nicht übersetzen. Übersetzung ins Englische läuft über whisper-1.",
      jobNotFound: "Kein {{kind}}-Job '{{id}}' auf diesem Konto.",
      jobNotReady:
        "Der {{kind}}-Job '{{id}}' ist {{status}}. Download erst, wenn der Status completed ist.",
      jobInterrupted:
        "Der Job wurde beim Neustart seines Servers abgebrochen. Nichts wurde berechnet. Sende ihn erneut.",
      jobNotCreated:
        "Der Job konnte nicht gespeichert werden. Nichts wurde berechnet. Versuch es erneut.",
      mediaNotFound:
        "Datei nicht gefunden oder Link abgelaufen. Hol dir einen frischen Link aus dem Job oder sende deinen API-Schlüssel.",
      modelNoImageInput:
        "{{model}} nimmt kein Startbild an. Wähle ein Bild-zu-Video-Modell aus GET /v1/models oder lass das Bild weg.",
      modelNeedsImage:
        "{{model}} animiert ein Bild. Sende input_reference oder image_url.",
      resolutionUnsupported:
        "{{model}} rendert {{supported}}. Fordere eine davon als resolution an.",
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
