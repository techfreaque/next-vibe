import type { streamingApiTranslations as EnglishStreamingApiTranslations } from "../../en/sections/streamingApi";

export const streamingApiTranslations: typeof EnglishStreamingApiTranslations =
  {
    admin: {
      title: "Streaming API",
      description:
        "Testuj i zarządzaj punktami końcowymi streaming API dla przetwarzania danych w czasie rzeczywistym",
    },
    nav: {
      aiStream: "AI Stream",
      basicStream: "Basic Stream",
      aiStreamDescription: "Chat ze streamingiem AI napędzany OpenAI GPT-4o",
      basicStreamDescription:
        "Podstawowy streaming z progresywnym dostarczaniem wiadomości",
    },
    aiStream: {
      description: "Streamuj odpowiedzi AI używając modelu OpenAI GPT-4o",
      admin: {
        title: "Testowanie AI Stream",
        description:
          "Testuj funkcjonalność streamingu AI z integracją OpenAI GPT-4o",
      },
      config: {
        title: "Konfiguracja",
        show: "Pokaż konfigurację",
        hide: "Ukryj konfigurację",
      },
      chat: {
        title: "Interfejs AI Chat",
        clear: "Wyczyść chat",
        empty: "Rozpocznij rozmowę wpisując wiadomość poniżej",
        user: "Ty",
        assistant: "Asystent AI",
        placeholder: "Wpisz swoją wiadomość tutaj...",
        send: "Wyślij",
        sending: "Wysyłanie...",
      },
      fields: {
        messages: "Tablica wiadomości chatu",
        model: "Model AI",
        temperature: "Temperatura (kreatywność)",
        maxTokens: "Maksymalna liczba tokenów",
        systemPrompt: "Prompt systemowy (opcjonalny)",
        systemPromptPlaceholder:
          "Wprowadź prompt systemowy, aby dostosować zachowanie AI...",
      },
      models: {
        gpt4o: "GPT-4o",
        gpt4oMini: "GPT-4o Mini",
        gpt4Turbo: "GPT-4 Turbo",
      },
    },
    basicStream: {
      description: "Streamuj losowe wiadomości progresywnie używając pętli for",
      defaultPrefix: "Wiadomość",
      admin: {
        title: "Testowanie Basic Stream",
        description:
          "Testuj podstawową funkcjonalność streamingu z progresywnym dostarczaniem wiadomości",
      },
      config: {
        title: "Konfiguracja Stream",
      },
      controls: {
        title: "Kontrola Stream",
        start: "Rozpocznij Stream",
        stop: "Zatrzymaj Stream",
        clear: "Wyczyść wszystko",
        streaming: "Streamowanie...",
      },
      progress: {
        label: "Postęp",
      },
      messages: {
        title: "Wiadomości ze streamu",
        titleWithCount: "Wiadomości ze streamu ({{count}})",
        empty: "Brak wiadomości. Kliknij 'Rozpocznij Stream' aby zacząć",
      },
      summary: {
        title: "Podsumowanie Stream",
        totalMessages: "Łączna liczba wiadomości",
        duration: "Czas trwania",
        status: "Status",
        completed: "Zakończono",
        incomplete: "Niekompletne",
      },
      log: {
        title: "Log debugowania",
        empty: "Brak wpisów w logu",
        messageReceived: "[{{time}}] Odebrano wiadomość: {{content}}",
        streamCompleted:
          "[{{time}}] Stream zakończony: {{totalMessages}} wiadomości w {{duration}}ms",
        error: "[{{time}}] Błąd: {{error}} - {{message}}",
      },
      fields: {
        count: "Liczba wiadomości",
        delay: "Opóźnienie między wiadomościami (ms)",
        prefix: "Prefiks wiadomości",
        includeTimestamp: "Dołącz znacznik czasu",
        includeCounter: "Dołącz licznik",
      },
    },
  };
