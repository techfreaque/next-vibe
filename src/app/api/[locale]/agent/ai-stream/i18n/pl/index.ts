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
    userMessageId: {
      label: "ID wiadomości użytkownika",
      description: "ID wiadomości użytkownika wygenerowane przez klienta",
    },
    parentMessageId: {
      label: "ID wiadomości nadrzędnej",
      description: "ID wiadomości nadrzędnej dla rozgałęzienia/wątku",
    },
    messageHistory: {
      label: "Historia wiadomości",
      description: "Opcjonalna historia wiadomości dla trybu incognito",
      item: {
        title: "Wiadomość",
        description: "Wiadomość czatu w historii",
        role: {
          label: "Rola",
        },
        content: {
          label: "Treść",
        },
        metadata: {
          toolCall: {
            toolName: {
              label: "Nazwa narzędzia",
            },
            args: {
              label: "Argumenty narzędzia",
            },
            result: {
              label: "Wynik narzędzia",
            },
            error: {
              label: "Błąd narzędzia",
            },
            executionTime: {
              label: "Czas wykonania (ms)",
            },
            creditsUsed: {
              label: "Użyte kredyty",
            },
          },
        },
      },
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
    character: {
      label: "Postać",
      description: "Opcjonalna postać dla AI",
    },
    systemPrompt: {
      label: "Prompt systemowy",
      description: "Opcjonalne instrukcje systemowe",
      placeholder: "Wprowadź prompt systemowy...",
      now: "teraz",
      minutesAgo: "{{minutes}}m temu",
      hoursAgo: "{{hours}}h temu",
      daysAgo: "{{days}}d temu",
    },
    enableSearch: {
      label: "Włącz wyszukiwanie internetowe",
      description:
        "Zezwól AI na przeszukiwanie sieci w poszukiwaniu aktualnych informacji",
    },
    activeTool: {
      label: "Aktywne narzędzia",
      description:
        "Narzędzia, które model może wykonywać. Null oznacza, że wszystkie narzędzia są dozwolone.",
      toolId: {
        label: "ID narzędzia",
        description: "Unikalny identyfikator narzędzia AI",
      },
    },
    tools: {
      label: "Widoczne narzędzia",
      description:
        "Narzędzia załadowane do okna kontekstu AI. Model może je bezpośrednio wywoływać.",
      toolId: {
        label: "ID narzędzia",
        description: "Unikalny identyfikator narzędzia AI",
      },
      requiresConfirmation: {
        label: "Wymaga potwierdzenia",
        description:
          "Czy to narzędzie wymaga potwierdzenia użytkownika przed wykonaniem",
      },
    },
    resumeToken: {
      label: "Token wznowienia",
      description: "Token do wznowienia przerwanych strumieni",
    },
    voiceMode: {
      label: "Tryb głosowy",
      description: "Konfiguracja interakcji głosowej",
      enabled: {
        label: "Włącz tryb głosowy",
        description: "Włącz interakcję głosową z syntezą mowy",
      },
      voice: {
        label: "Głos",
        description: "Wybierz typ głosu dla syntezy mowy",
        male: "Głos męski",
        female: "Głos żeński",
      },
    },
    audioInput: {
      title: "Wejście audio",
      description: "Prześlij plik audio dla trybu głos-do-głosu",
      file: {
        label: "Plik audio",
        description: "Plik audio do transkrypcji i przetwarzania",
      },
    },
    attachments: {
      label: "Załączniki",
      description: "Pliki załączone do wiadomości (obrazy, dokumenty, itp.)",
    },
    enabledToolIds: {
      label: "ID włączonych narzędzi",
      description: "Lista ID narzędzi AI do włączenia dla tej konwersacji",
    },
    toolConfirmation: {
      label: "Potwierdzenie narzędzia",
      description: "Odpowiedź potwierdzająca narzędzie od użytkownika",
      success: "Potwierdzenie narzędzia zostało pomyślnie przetworzone",
      messageId: {
        label: "ID wiadomości",
        description: "ID wiadomości zawierającej wywołanie narzędzia",
      },
      confirmed: {
        label: "Potwierdzone",
        description: "Czy użytkownik potwierdził wykonanie narzędzia",
      },
      updatedArgs: {
        label: "Zaktualizowane argumenty",
        description:
          "Opcjonalne zaktualizowane argumenty dla wywołania narzędzia",
      },
      errors: {
        messageNotFound: "Wiadomość narzędzia nie została znaleziona",
        toolCallMissing: "Brak metadanych ToolCall",
        toolNotFound: "Narzędzie nie znalezione",
      },
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
      streamCreationFailed:
        "Nie udało się połączyć z usługą AI. Spróbuj ponownie.",
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
  errorThread: {
    title: "Błąd",
  },
  error: {
    title: "Błąd strumienia",
  },
  errors: {
    toolExecutionError:
      "Narzędzie nie zostało poprawnie wykonane. Spróbuj ponownie.",
    toolExecutionFailed:
      "Wykonanie narzędzia nie powiodło się. Spróbuj ponownie.",
    toolDisabledByUser:
      "To narzędzie zostało wyłączone przez użytkownika. Nie próbuj go ponownie wywoływać.",
    userDeclinedTool: "Wykonanie narzędzia zostało anulowane.",
    streamError: "Odpowiedź AI nie mogła zostać ukończona. Spróbuj ponownie.",
    streamProcessingError:
      "Nie udało się przetworzyć odpowiedzi AI. Spróbuj ponownie.",
    timeout:
      "AI zajęło zbyt dużo czasu na odpowiedź (przekroczono limit po {{maxDuration}} sekundach). Spróbuj ponownie z krótszą wiadomością.",
    noResponse: "AI nie wygenerowało odpowiedzi. Spróbuj ponownie.",
    modelUnavailable:
      "Wybrany model AI jest obecnie niedostępny. Spróbuj innego modelu.",
    rateLimitExceeded: "Zbyt wiele żądań. Poczekaj chwilę i spróbuj ponownie.",
    insufficientCredits:
      "Niewystarczająca liczba kredytów do wykonania tego żądania.",
    connectionFailed:
      "Nie udało się połączyć z usługą AI. Sprawdź połączenie i spróbuj ponownie.",
    invalidRequest:
      "Nieprawidłowe żądanie. Sprawdź swoje dane i spróbuj ponownie.",
    compactingStreamError:
      "Błąd podczas kompresji historii: {{error}}. Twoja rozmowa nie została skompresowana.",
    compactingException:
      "Nie udało się skompresować historii rozmowy: {{error}}. Spróbuj ponownie.",
    compactingRebuildFailed:
      "Nie udało się odbudować rozmowy po kompresji. Spróbuj ponownie.",
    unexpectedError:
      "Wystąpił nieoczekiwany błąd: {{error}}. Spróbuj ponownie.",
  },
  info: {
    streamInterrupted:
      "Generowanie zostało zatrzymane. Częściowa odpowiedź została zapisana.",
  },
  headless: {
    errors: {
      missingModelOrCharacter:
        "Model i charakter są wymagane — podaj je bezpośrednio lub podaj favoriteId z rozwiązywalnym wyborem modelu",
      favoriteNotFound:
        "Ulubiony nie znaleziony lub nie należy do tego użytkownika",
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
