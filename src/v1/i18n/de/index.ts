import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "KI",

  tags: {
    api: "OpenAI-kompatible API",
  },

  openai: {
    missingKey:
      "API-Schlüssel fehlt. Sende ihn als 'Authorization: Bearer <Schlüssel>'. Erstelle einen unter Einstellungen > API-Schlüssel.",
    invalidKey:
      "Ungültiger oder widerrufener API-Schlüssel. Prüfe den Schlüssel oder erstelle unter Einstellungen > API-Schlüssel einen neuen.",
    modelNotFound:
      "Das Modell '{{model}}' existiert nicht oder steht dir nicht zur Verfügung. Deine Modelle: GET /v1/models.",
    toolsUnsupported:
      "Tool- und Funktionsaufrufe werden von dieser API noch nicht unterstützt.",
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
          description: "Noch nicht unterstützt",
        },
      },
      response: { object: "Objekttyp" },
      success: {
        title: "Completion erstellt",
        description: "Das Modell hat geantwortet",
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
