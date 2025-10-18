import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Czat strumieniowy AI",
    description:
      "Strumieniuj odpowiedzi czatu wspierane przez AI używając OpenAI GPT-4o",
    form: {
      title: "Konfiguracja czatu AI",
      description: "Skonfiguruj parametry czatu AI i wiadomości",
    },
    messages: {
      label: "Wiadomości",
      description: "Wiadomości czatu do przetworzenia",
      placeholder: "Wprowadź swoje wiadomości...",
    },
    model: {
      label: "Model",
      description: "Model AI do użycia podczas generowania",
    },
    temperature: {
      label: "Temperatura",
      description: "Kontroluje losowość (0-2)",
    },
    maxTokens: {
      label: "Maksymalna liczba tokenów",
      description: "Maksymalna liczba tokenów do wygenerowania",
    },
    systemPrompt: {
      label: "Prompt systemowy",
      description: "Opcjonalne instrukcje systemowe",
      placeholder: "Wprowadź prompt systemowy...",
    },
    enableSearch: {
      label: "Włącz wyszukiwanie internetowe",
      description:
        "Zezwól AI na przeszukiwanie sieci w poszukiwaniu aktualnych informacji",
    },
    response: {
      title: "Odpowiedź strumieniowa",
      description: "Odpowiedź strumieniowa wygenerowana przez AI",
      success: "Strumień zakończony pomyślnie",
      messageId: "ID wiadomości",
      totalTokens: "Łączna liczba użytych tokenów",
      finishReason: "Powód zakończenia",
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagana autoryzacja do strumieniowania AI",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Podano nieprawidłowe parametry żądania",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci podczas strumieniowania",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp do strumieniowania AI jest zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono punktu końcowego strumieniowania AI",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description:
          "Istnieją niezapisane zmiany, które należy najpierw zapisać",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych podczas strumieniowania",
      },
    },
    success: {
      title: "Sukces",
      description: "Strumień AI wygenerowany pomyślnie",
    },
  },
  enums: {
    role: {
      user: "Użytkownik",
      assistant: "Asystent",
      system: "System",
    },
  },
  streamingErrors: {
    aiStream: {
      error: {
        apiKey: {
          missing: "Brak klucza API OpenAI",
          invalid: "Klucz API OpenAI jest nieprawidłowy",
        },
        configuration: "Błąd konfiguracji strumieniowania AI",
        processing: "Błąd przetwarzania strumienia AI",
      },
    },
  },
  route: {
    errors: {
      invalidJson: "Nieprawidłowy JSON w treści żądania",
      invalidRequestData: "Nieprawidłowe dane żądania",
      uncensoredApiKeyMissing:
        "Klucz API Uncensored.ai nie został skonfigurowany",
      openrouterApiKeyMissing: "Klucz API OpenRouter nie został skonfigurowany",
      streamCreationFailed: "Nie udało się utworzyć strumienia",
      unknownError: "Wystąpił błąd",
      creditValidationFailed: "Nie udało się zweryfikować salda kredytów",
      noIdentifier: "Nie podano identyfikatora użytkownika lub leada",
      insufficientCredits:
        "Niewystarczająca liczba kredytów do wykonania żądania",
    },
  },
  providers: {
    uncensoredHandler: {
      errors: {
        apiError: "Błąd API Uncensored.ai ({{status}}): {{errorText}}",
      },
    },
  },
};
