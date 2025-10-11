import type { streamingApiTranslations as EnglishStreamingApiTranslations } from "../../en/sections/streamingApi";

export const streamingApiTranslations: typeof EnglishStreamingApiTranslations =
  {
    admin: {
      title: "Streaming API",
      description:
        "Streaming API-Endpunkte für die Echtzeitdatenverarbeitung testen und verwalten",
    },
    nav: {
      aiStream: "AI Stream",
      basicStream: "Basic Stream",
      aiStreamDescription: "AI-gestütztes Streaming-Chat mit OpenAI GPT-4o",
      basicStreamDescription:
        "Einfaches Streaming mit progressiver Nachrichtenübertragung",
    },
    aiStream: {
      description: "AI-Antworten mit OpenAI GPT-4o Modell streamen",
      admin: {
        title: "AI Stream Testen",
        description:
          "AI-gestützte Streaming-Funktionalität mit OpenAI GPT-4o Integration testen",
      },
      config: {
        title: "Konfiguration",
        show: "Konfiguration anzeigen",
        hide: "Konfiguration verbergen",
      },
      chat: {
        title: "AI Chat Interface",
        clear: "Chat löschen",
        empty:
          "Starten Sie ein Gespräch, indem Sie unten eine Nachricht eingeben",
        user: "Sie",
        assistant: "AI Assistent",
        placeholder: "Geben Sie hier Ihre Nachricht ein...",
        send: "Senden",
        sending: "Wird gesendet...",
      },
      fields: {
        messages: "Chat-Nachrichten Array",
        model: "AI Modell",
        temperature: "Temperatur (Kreativität)",
        maxTokens: "Maximale Token",
        systemPrompt: "System-Prompt (optional)",
        systemPromptPlaceholder:
          "Geben Sie einen System-Prompt ein, um das Verhalten der AI anzupassen...",
      },
      models: {
        gpt4o: "GPT-4o",
        gpt4oMini: "GPT-4o Mini",
        gpt4Turbo: "GPT-4 Turbo",
      },
    },
    basicStream: {
      description:
        "Zufällige Nachrichten progressiv mit einer For-Schleife streamen",
      defaultPrefix: "Nachricht",
      admin: {
        title: "Basic Stream Testen",
        description:
          "Einfache Streaming-Funktionalität mit progressiver Nachrichtenübertragung testen",
      },
      config: {
        title: "Stream Konfiguration",
      },
      controls: {
        title: "Stream Steuerung",
        start: "Stream starten",
        stop: "Stream stoppen",
        clear: "Alle löschen",
        streaming: "Streaming...",
      },
      progress: {
        label: "Fortschritt",
      },
      messages: {
        title: "Gestreamte Nachrichten",
        titleWithCount: "Gestreamte Nachrichten ({{count}})",
        empty:
          "Noch keine Nachrichten. Klicken Sie auf 'Stream starten' um zu beginnen",
      },
      summary: {
        title: "Stream Zusammenfassung",
        totalMessages: "Gesamt Nachrichten",
        duration: "Dauer",
        status: "Status",
        completed: "Abgeschlossen",
        incomplete: "Unvollständig",
      },
      log: {
        title: "Debug Log",
        empty: "Noch keine Log-Einträge",
        messageReceived: "[{{time}}] Nachricht empfangen: {{content}}",
        streamCompleted:
          "[{{time}}] Stream abgeschlossen: {{totalMessages}} Nachrichten in {{duration}}ms",
        error: "[{{time}}] Fehler: {{error}} - {{message}}",
      },
      fields: {
        count: "Nachrichtenanzahl",
        delay: "Verzögerung zwischen Nachrichten (ms)",
        prefix: "Nachrichten-Präfix",
        includeTimestamp: "Zeitstempel einschließen",
        includeCounter: "Zähler einschließen",
      },
    },
  };
