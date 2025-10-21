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
    operation: {
      label: "Operacja",
      description: "Typ operacji wiadomości",
      options: {
        send: "Wyślij wiadomość",
        retry: "Ponów wiadomość",
        edit: "Edytuj wiadomość",
        answerAsAi: "Odpowiedz jako AI",
      },
    },
    rootFolderId: {
      label: "Folder główny",
      description: "Kontekst folderu głównego dla wiadomości",
    },
    subFolderId: {
      label: "Podfolder",
      description: "Opcjonalny podfolder w folderze głównym",
    },
    threadId: {
      label: "ID wątku",
      description: "ID wątku (null dla nowego wątku)",
    },
    parentMessageId: {
      label: "ID wiadomości nadrzędnej",
      description: "ID wiadomości nadrzędnej dla rozgałęzienia/wątku",
    },
    content: {
      label: "Treść wiadomości",
      description: "Treść wiadomości do wysłania",
      placeholder: "Wprowadź swoją wiadomość...",
    },
    role: {
      label: "Rola",
      description: "Rola nadawcy wiadomości",
      options: {
        user: "Użytkownik",
        assistant: "Asystent",
        system: "System",
      },
    },
    model: {
      label: "Model",
      description: "Model AI do użycia podczas generowania",
    },
    persona: {
      label: "Persona",
      description: "Opcjonalna persona dla AI",
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
    resumeToken: {
      label: "Token wznowienia",
      description: "Token do wznowienia przerwanych strumieni",
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
    debug: {
      userObject: "AI Stream Route: Obiekt użytkownika",
      extracted: "AI Stream Route: Wyodrębnione wartości",
    },
    errors: {
      invalidJson: "Nieprawidłowy JSON w treści żądania",
      invalidRequestData: "Nieprawidłowe dane żądania",
      uncensoredApiKeyMissing:
        "Klucz API Uncensored.ai nie został skonfigurowany",
      openrouterApiKeyMissing: "Klucz API OpenRouter nie został skonfigurowany",
      streamCreationFailed: "Nie udało się utworzyć strumienia",
      unknownError: "Wystąpił błąd",
      creditValidationFailed: "Nie udało się zweryfikować salda kredytów",
      authenticationRequired:
        "Zaloguj się, aby korzystać z trwałych folderów. Użyj trybu incognito dla anonimowych czatów.",
      noIdentifier: "Nie podano identyfikatora użytkownika lub leada",
      insufficientCredits:
        "Niewystarczająca liczba kredytów do wykonania żądania",
      noResponseBody: "Nie otrzymano treści odpowiedzi ze strumienia",
    },
  },
  errorTypes: {
    streamError: "Błąd strumienia",
  },
  providers: {
    uncensoredHandler: {
      errors: {
        apiError: "Błąd API Uncensored.ai ({{status}}): {{errorText}}",
      },
    },
  },
};
