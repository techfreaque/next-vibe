import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",
  tags: {
    streaming: "Strumieniowanie",
    chat: "Czat",
    ai: "AI",
    status: "Status",
    processing: "Przetwarzanie",
    classification: "Klasyfikacja",
    automation: "Automatyzacja",
    execution: "Wykonanie",
    confirmation: "Potwierdzenie",
    speech: "Mowa",
    transcription: "Transkrypcja",
    tts: "Tekst na mowę",
  },
  enums: {
    emailAgentStatus: {
      pending: "Oczekujący",
      processing: "Przetwarzanie",
      hardRulesComplete: "Twarde Zasady Zakończone",
      aiProcessing: "Przetwarzanie AI",
      awaitingConfirmation: "Oczekiwanie na Potwierdzenie",
      completed: "Zakończone",
      failed: "Nieudane",
      skipped: "Pominięte",
    },
    emailAgentActionType: {
      markBounced: "Oznacz jako Odbite",
      markSpam: "Oznacz jako Spam",
      classifyDeliveryFailure: "Klasyfikuj Błąd Dostarczenia",
      respondToEmail: "Odpowiedz na E-mail",
      deleteEmail: "Usuń E-mail",
      searchKnowledgeBase: "Przeszukaj Bazę Wiedzy",
      webSearch: "Wyszukiwanie w Internecie",
      escalateToHuman: "Przekaż do Człowieka",
      noAction: "Brak Działania",
      chainAnalysis: "Analiza Łańcuchowa",
    },
    emailAgentToolType: {
      knowledgeBaseSearch: "Wyszukiwanie w Bazie Wiedzy",
      emailResponse: "Odpowiedź E-mail",
      emailDelete: "Usuń E-mail",
      webSearch: "Wyszukiwanie w Internecie",
    },
    bounceCategory: {
      hardBounce: "Twarde Odbicie",
      softBounce: "Miękkie Odbicie",
      spamComplaint: "Skarga na Spam",
      unsubscribe: "Wypisz się",
      blockBounce: "Odbicie Blokowe",
      invalidAddress: "Nieprawidłowy Adres",
      mailboxFull: "Pełna Skrzynka",
      contentRejected: "Treść Odrzucona",
    },
    confirmationStatus: {
      pending: "Oczekujący",
      approved: "Zatwierdzony",
      rejected: "Odrzucony",
      expired: "Wygasły",
    },
    processingPriority: {
      low: "Niski",
      normal: "Normalny",
      high: "Wysoki",
      urgent: "Pilny",
    },
    sortOrder: {
      asc: "Rosnąco",
      desc: "Malejąco",
    },
    emailAgentSortField: {
      emailId: "ID E-maila",
      status: "Status",
      lastProcessedAt: "Ostatnio Przetworzony",
      createdAt: "Utworzony",
      priority: "Priorytet",
    },
    emailAgentStatusFilter: {
      all: "Wszystkie",
      pending: "Oczekujący",
      processing: "Przetwarzanie",
      hardRulesComplete: "Twarde Zasady Zakończone",
      aiProcessing: "Przetwarzanie AI",
      awaitingConfirmation: "Oczekiwanie na Potwierdzenie",
      completed: "Zakończone",
      failed: "Nieudane",
      skipped: "Pominięte",
    },
    emailAgentActionTypeFilter: {
      all: "Wszystkie",
      markBounced: "Oznacz jako Odbite",
      markSpam: "Oznacz jako Spam",
      classifyDeliveryFailure: "Klasyfikuj Błąd Dostarczenia",
      respondToEmail: "Odpowiedz na E-mail",
      deleteEmail: "Usuń E-mail",
      searchKnowledgeBase: "Przeszukaj Bazę Wiedzy",
      webSearch: "Wyszukiwanie w Internecie",
      escalateToHuman: "Przekaż do Człowieka",
      noAction: "Brak Działania",
      chainAnalysis: "Analiza Łańcuchowa",
    },
    confirmationStatusFilter: {
      all: "Wszystkie",
      pending: "Oczekujący",
      approved: "Zatwierdzony",
      rejected: "Odrzucony",
      expired: "Wygasły",
    },
    processingPriorityFilter: {
      all: "Wszystkie",
      low: "Niski",
      normal: "Normalny",
      high: "Wysoki",
      urgent: "Pilny",
    },
    confirmationResponseAction: {
      approve: "Zatwierdź",
      reject: "Odrzuć",
    },
    modelUtilities: {
      chat: "Czat",
      coding: "Programowanie",
      creative: "Pisanie Kreatywne",
      analysis: "Analiza",
      reasoning: "Rozumowanie",
      roleplay: "Odgrywanie Ról",
      fast: "Szybki",
      smart: "Inteligentny",
      vision: "Wizja",
      imageGen: "Generowanie Obrazów",
      politicalLeft: "Lewica Polityczna",
      politicalRight: "Prawica Polityczna",
      controversial: "Kontrowersyjny",
      adultImplied: "Dorosłe (Sugerowane)",
      adultExplicit: "Dorosłe (Jawne)",
      violence: "Przemoc",
      harmful: "Szkodliwe Treści",
      illegalInfo: "Nielegalne Informacje",
      medicalAdvice: "Porady Medyczne",
      offensiveLanguage: "Obraźliwy Język",
      roleplayDark: "Ciemne Odgrywanie Ról",
      conspiracy: "Spiskowanie",
      legacy: "Przestarzały",
      uncensored: "Bez Cenzury",
    },
  },
  aiStream: {
    category: "Agent",
    tags: {
      streaming: "Strumieniowanie",
      chat: "Czat",
      ai: "AI",
    },

    run: {
      task: {
        name: "Puls AI",
        description:
          "Agent AI w tle, który sprawdza stan systemu, realizuje zadania i kontaktuje się z człowiekiem w razie potrzeby",
      },
      post: {
        title: "Uruchom agenta AI",
        dynamicTitle: "AI Run{{suffix}}: {{prompt}}",
        description:
          "Deleguje zadanie do wyspecjalizowanego agenta AI i zwraca jego odpowiedź. Do tworzenia lub edycji umiejętności/person AI zawsze deleguj do skill='skill-creator' – nigdy nie próbuj samodzielnie. Podaj skill + prompt; agent zajmie się resztą. Kredyty zależne od modelu.",
        container: {
          title: "Uruchomienie agenta AI",
          description:
            "Konfiguracja wywołań wstępnych i promptu dla headless wykonania AI",
        },
        fields: {
          favoriteId: {
            label: "ID ulubionego",
            description:
              "Slug lub ID zapisanego ulubionego. Ładuje skill, model i konfigurację narzędzi jako wartości domyślne. Jawne pola nadpisują wartości ulubionego.",
            placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          },
          model: {
            label: "Model",
            description:
              "LLM do rozumowania tekstowego. Opcjonalny gdy ustawiono favoriteId lub skill. Szybki: claude-haiku-4.5, gemini-2.5-flash. Zbalansowany: claude-sonnet-4.6, gpt-5. Potężny: claude-opus-4.7. Darmowy: qwen3_235b-free. Nie do generowania obrazów/audio/wideo.",
          },
          skill: {
            label: "Umiejętność",
            description:
              "ID umiejętności lub nazwa domyślna. Definiuje personę AI i prompt systemowy. Użyj 'skill-creator' do tworzenia/edycji umiejętności AI. Opcjonalny gdy ustawiono favoriteId.",
            placeholder: "default",
          },
          prompt: {
            label: "Prompt",
            description:
              "Główna instrukcja lub pytanie do AI. Bądź konkretny - AI użyje wyników wywołań wstępnych jako kontekstu jeśli podano.",
            placeholder: "Wpisz prompt...",
          },
          instructions: {
            label: "Dodatkowe instrukcje systemowe",
            description:
              "Opcjonalne dodatkowe instrukcje dołączane do promptu systemowego. Użyj do ograniczenia formatu, tonu lub długości (np. 'Bądź zwięzły. Tylko JSON.').",
            placeholder: "Bądź zwięzły. Maksymalnie jeden akapit.",
          },
          preCalls: {
            label: "Wywołania wstępne",
            description:
              "Wywołania narzędzi do wykonania przed promptem. Wyniki są wstrzykiwane jako kontekst. Użyj tool-help do odkrywania dostępnych narzędzi i ich argumentów.",
            routeId: {
              label: "ID narzędzia",
              description:
                "Alias lub pełna nazwa narzędzia do wywołania (np. 'web-search', 'agent_skills_GET'). Użyj tool-help do odkrywania.",
              placeholder: "web-search",
            },
            args: {
              label: "Argumenty",
              description:
                'Płaskie argumenty klucz-wartość - urlPathParams i pola body połączone w jeden obiekt (np. {"query": "najnowsze wiadomości", "maxResults": 5}).',
            },
          },
          availableTools: {
            label: "Może wykonywać",
            description:
              "Które narzędzia AI może uruchomić. null = wszystkie dozwolone. Tablica = tylko wymienione. Standard: [{toolId:'execute-tool'},{toolId:'tool-help'}].",
            toolId: {
              label: "ID narzędzia",
              description:
                "Alias lub pełna nazwa narzędzia (np. 'execute-tool', 'tool-help', 'web-search')",
            },
            requiresConfirmation: {
              label: "Wymaga potwierdzenia",
              description:
                "Wstrzymaj wykonanie do potwierdzenia przez użytkownika",
            },
          },
          pinnedTools: {
            label: "W kontekście (AI to widzi)",
            description:
              "Narzędzia załadowane do kontekstu modelu. null = domyślny zestaw użytkownika. Wpływa tylko na to co model widzi, nie na to co może wykonać.",
            toolId: {
              label: "ID narzędzia",
              description: "Alias lub pełna nazwa narzędzia do kontekstu",
            },
            requiresConfirmation: {
              label: "Wymaga potwierdzenia",
              description:
                "Czy to narzędzie wymaga potwierdzenia użytkownika przed wykonaniem",
            },
          },
          maxTurns: {
            label: "Maks. tury",
            description:
              "Maksymalna liczba tur agencji (cykli wywołań narzędzi) przed zatrzymaniem. Domyślnie: bez limitu. Ustaw na 1 dla pojedynczego promptu+odpowiedzi bez wywołań narzędzi.",
          },
          appendThreadId: {
            label: "ID wątku (kontynuuj)",
            description:
              "UUID istniejącego wątku do kontynuacji. Nowa wiadomość jest dołączana do konwersacji. Pomiń aby rozpocząć nowy wątek.",
            placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          },
          rootFolderId: {
            label: "Folder zapisu",
            description:
              "Gdzie zapisać wątek. W tle = wszystkie automatyczne uruchomienia (Dreamer, Autopilot, zaplanowane zadania). Prywatny = twój folder. Udostępniony = zespół. Incognito = bez zapisu.",
            placeholder: "background",
            options: {
              background: "W tle",
              private: "Prywatny",
              shared: "Udostępniony",
              incognito: "Incognito (bez zapisu)",
            },
          },
          subFolderId: {
            label: "ID podfolderu",
            description:
              "Opcjonalne UUID podfolderu w folderze głównym do organizacji uruchomień.",
            placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          },
          excludeMemories: {
            label: "Wyklucz wspomnienia",
            description:
              "Pomiń ładowanie wspomnień do kontekstu. Dla publicznych botów lub izolowanych zadań. Domyślnie: false.",
          },
        },
        response: {
          text: "Tekst odpowiedzi AI (tagi think usunięte). Null jeśli model nie wygenerował wyjścia.",
          promptTokens: "Zużyte tokeny promptu (koszt wejścia)",
          completionTokens: "Wygenerowane tokeny odpowiedzi (koszt wyjścia)",
          creditCost:
            "Naliczone kredyty za to uruchomienie. Null dla trybów incognito.",
          threadId:
            "UUID wątku gdzie uruchomienie zostało zapisane. Null jeśli rootFolderId to 'incognito'. Użyj do kontynuacji konwersacji przez appendThreadId.",
          lastAiMessageId:
            "UUID ostatniej wiadomości asystenta. Przydatne do rozgałęzień lub referencji.",
          threadTitle: "Automatycznie wygenerowany tytuł wątku",
          threadCreatedAt: "Znacznik czasu utworzenia wątku (ISO 8601)",
          preCallResults: {
            title: "Wyniki wywołań wstępnych",
            routeId: "Wywołane narzędzie",
            succeeded: "Czy wywołanie się powiodło",
            errorMessage: "Komunikat błędu jeśli wywołanie się nie powiodło",
          },
        },
        errors: {
          validation: {
            title: "Błąd walidacji",
            description: "Nieprawidłowe parametry",
          },
          unauthorized: {
            title: "Nieautoryzowany",
            description: "Wymagane uwierzytelnienie",
          },
          forbidden: { title: "Zabronione", description: "Odmowa dostępu" },
          notFound: {
            title: "Nie znaleziono",
            description: "Trasa nie znaleziona",
          },
          internal: {
            title: "Błąd serwera",
            description: "Wewnętrzny błąd serwera",
          },
          network: { title: "Błąd sieci", description: "Błąd sieci" },
          unknown: {
            title: "Nieznany błąd",
            description: "Nieoczekiwany błąd",
          },
          unsaved: { title: "Niezapisane", description: "Niezapisane zmiany" },
          conflict: { title: "Konflikt", description: "Konflikt danych" },
        },
        success: {
          title: "Wykonanie AI zakończone",
          description: "Zakończono pomyślnie",
        },
        backButton: {
          label: "Wstecz",
        },
      },
    },
    post: {
      title: "Czat strumieniowy AI",
      titleShort: "Chat AI",
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
      leafMessageId: {
        label: "ID wiadomości liścia",
        description: "ID wiadomości liścia aktywnej gałęzi",
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
      skill: {
        label: "Umiejętność",
        description: "Opcjonalna umiejętność dla AI",
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
      timezone: {
        label: "Strefa czasowa",
        description:
          "Strefa czasowa użytkownika dla stabilnych znaczników czasu",
      },
      imageSize: {
        label: "Rozmiar obrazu",
        description:
          "Rozmiar generowanego obrazu (np. kwadratowy, poziomy, pionowy)",
      },
      imageQuality: {
        label: "Jakość obrazu",
        description: "Ustawienie jakości generowanego obrazu (standard lub hd)",
      },
      musicDuration: {
        label: "Czas trwania muzyki",
        description: "Czas trwania generowanego klipu audio",
      },
      favoriteConfig: {
        label: "Konfiguracja ulubionego",
        description:
          "Pełna konfiguracja aktywnego ulubionego - wybór modeli, konfiguracja narzędzi, ustawienia kontekstu. null = brak aktywnego ulubionego, używane domyślne ustawienia skilla/systemu.",
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
        threadId: "ID wątku",
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
        invalidRequestData: "Nieprawidłowe dane żądania ({{issue}})",
        uncensoredApiKeyMissing:
          "Klucz API Uncensored.ai nie został skonfigurowany",
        openrouterApiKeyMissing:
          "Klucz API OpenRouter nie został skonfigurowany",
        streamCreationFailed:
          "Nie udało się połączyć z usługą AI. Spróbuj ponownie.",
        unknownError: "Wystąpił błąd",
        creditValidationFailed: "Nie udało się zweryfikować salda kredytów",
        authenticationRequired:
          "Zaloguj się, aby korzystać z trwałych folderów. Użyj trybu incognito dla anonimowych czatów.",
        noIdentifier: "Nie podano identyfikatora użytkownika lub leada",
        insufficientCredits:
          "Niewystarczająca liczba kredytów do wykonania żądania (koszt: {{cost}}, saldo: {{balance}})",
        noResponseBody: "Nie otrzymano treści odpowiedzi ze strumienia",
      },
    },
    debugView: {
      systemPromptTitle: "Systemowy monit",
      copied: "Skopiowano!",
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
      toolExecutionErrorDetail: "Błąd narzędzia: {{error}}",
      toolExecutionFailed:
        "Wykonanie narzędzia nie powiodło się. Spróbuj ponownie.",
      toolDisabledByUser:
        "To narzędzie zostało wyłączone przez użytkownika. Nie próbuj go ponownie wywoływać.",
      userDeclinedTool: "Wykonanie narzędzia zostało anulowane.",
      pendingToolCall:
        "Narzędzie jest nadal uruchomione w tle. Poczekaj na jego zakończenie przed kontynuowaniem.",
      streamError: "Odpowiedź AI nie mogła zostać ukończona. Spróbuj ponownie.",
      streamProcessingError:
        "Nie udało się przetworzyć odpowiedzi AI. Spróbuj ponownie.",
      timeout:
        "AI zajęło zbyt dużo czasu na odpowiedź (przekroczono limit po {{maxDuration}} sekundach). Spróbuj ponownie z krótszą wiadomością.",
      noResponse: "AI nie wygenerowało odpowiedzi. Spróbuj ponownie.",
      modelUnavailable:
        "Wybrany model AI jest obecnie niedostępny. Spróbuj innego modelu.",
      rateLimitExceeded:
        "Zbyt wiele żądań. Poczekaj chwilę i spróbuj ponownie.",
      insufficientCredits:
        "Niewystarczająca liczba kredytów do wykonania tego żądania.",
      connectionFailed:
        "Nie udało się połączyć z usługą AI. Sprawdź połączenie i spróbuj ponownie.",
      invalidRequest:
        "Nieprawidłowe żądanie. Sprawdź swoje dane i spróbuj ponownie.",
      compactingStreamError:
        "Osiągnięto limit kontekstu - rozmowa jest zbyt długa do automatycznej kompresji. Spróbuj rozgałęzić się od wcześniejszej wiadomości, wybrać model z większym oknem kontekstowym lub dostosować okno kontekstowe w ustawieniach ulubionych.",
      compactingStreamErrorExpensive:
        "Osiągnięto limit kontekstu ({{tokens}} tokenów). Rozszerzenie okna kontekstowego jest możliwe, ale może być kosztowne. Najpierw spróbuj rozgałęzić się od wcześniejszej wiadomości lub zmienić model.",
      compactingException:
        "Nie udało się skompresować historii rozmowy. Spróbuj rozgałęzić się od wcześniejszego punktu w rozmowie lub przełącz na inny model.",
      compactingRebuildFailed:
        "Nie udało się odbudować rozmowy po kompresji. Spróbuj rozgałęzić się od wcześniejszej wiadomości.",
      unexpectedError:
        "Wystąpił nieoczekiwany błąd: {{error}}. Spróbuj ponownie.",
    },
    wakeUp: {
      revivalPrompt:
        "The async task you dispatched has completed. The result is in the tool message above. Please summarise what the task returned for me.",
      revivalInstructions:
        "WAKE-UP REVIVAL MODE: An async task has completed and the result is in the thread. Respond to the user's last message by summarising the tool result - 1-3 sentences only. Do NOT call any tools. Do NOT re-execute the original user request.",
    },
    info: {
      streamInterrupted:
        "Generowanie zostało zatrzymane. Częściowa odpowiedź została zapisana.",
    },
    headless: {
      errors: {
        missingModelOrSkill:
          "Model i charakter są wymagane - podaj je bezpośrednio lub podaj favoriteId z rozwiązywalnym wyborem modelu",
        favoriteNotFound:
          "Ulubiony nie znaleziony lub nie należy do tego użytkownika",
      },
    },
    resumeStream: {
      post: {
        title: "Wznów strumień AI",
        description:
          "Kontynuuje istniejący wątek przez uruchomienie bezgłowego kroku AI. Używane po zakończeniu asynchronicznego zadania zdalnego.",
        fields: {
          threadId: {
            title: "ID wątku",
            description: "UUID istniejącego wątku do kontynuowania.",
          },
          favoriteId: {
            title: "ID ulubionego",
            description:
              "UUID zapisanego ulubionego do załadowania modelu i postaci.",
          },
          modelId: {
            title: "ID modelu",
            description: "Model AI dla wznowionego kroku.",
          },
          skillId: {
            title: "ID postaci",
            description: "Postać/persona dla wznowionego kroku.",
          },
          callbackMode: {
            title: "Tryb callback",
            description:
              "Tryb callback oryginalnego wywołania narzędzia (wait lub wakeUp).",
          },
          wakeUpToolMessageId: {
            title: "ID wiadomości narzędzia wakeUp",
            description: "ID oryginalnej wiadomości narzędzia z wynikiem.",
          },
          wakeUpTaskId: {
            title: "ID zadania wakeUp",
            description: "ID zdalnego zadania cron, usuwane po wznowieniu.",
          },
          resumeTaskId: {
            title: "ID zadania resume",
            description:
              "ID tego zadania resume-stream cron, usuwane po wznowieniu.",
          },
          resumed: {
            title: "Wznowiony",
            description: "Czy wątek został pomyślnie kontynuowany.",
          },
          lastAiMessageId: {
            title: "ID ostatniej wiadomości AI",
            description: "UUID ostatniej wygenerowanej wiadomości asystenta.",
          },
        },
        errors: {
          validation: {
            title: "Błąd walidacji",
            description: "Nieprawidłowe parametry",
          },
          unauthorized: {
            title: "Brak autoryzacji",
            description: "Wymagane uwierzytelnienie",
          },
          forbidden: { title: "Zabronione", description: "Odmowa dostępu" },
          notFound: {
            title: "Nie znaleziono",
            description: "Wątek lub model nie znaleziony",
          },
          internal: {
            title: "Błąd serwera",
            description: "Wewnętrzny błąd podczas wznawiania strumienia",
          },
          network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieoczekiwany błąd",
          },
          unsaved: {
            title: "Niezapisane zmiany",
            description: "Konflikt niezapisanych zmian",
          },
          conflict: { title: "Konflikt", description: "Wystąpił konflikt" },
        },
        success: {
          title: "Strumień wznowiony",
          description: "Wątek AI został pomyślnie kontynuowany",
        },
      },
    },
    providers: {
      uncensoredHandler: {
        errors: {
          apiError: "Błąd API Uncensored.ai ({{status}}): {{errorText}}",
        },
      },
    },
    onboarding: {
      back: "Wstecz",
      welcome: {
        title: "Jedno AI do wszystkiego. Właściwe do każdego zadania.",
        line1:
          "Towarzysz do codziennych rozmów. Specjaliści do kodowania, badań, pisania - wybierasz jednego, gdy zadanie tego wymaga.",
        line2:
          "Ten sam czat. Przełączasz się, kiedy ma to znaczenie. Zajmuje sekundy.",
        line3: "Skonfigurujmy cię w mniej niż minutę.",
        continue: "Zaczynamy",
      },
      guest: {
        title: "Przeglądasz jako gość",
        line1:
          "Twoje ustawienia, towarzysz i historia czatu są zapisywane lokalnie tylko na tym urządzeniu.",
        line2:
          "Zaloguj się, aby synchronizować wszystko między urządzeniami - i mieć pewność, że nigdy nie stracisz swojej konfiguracji.",
        signIn: "Zaloguj się / Utwórz konto",
        continueAnyway: "Kontynuuj jako gość",
        note: "Możesz zalogować się później z menu w dowolnym momencie.",
      },
      companion: {
        title: "Wybierz swojego towarzysza",
        subtitle: "Twój główny partner do codziennych rozmów",
        modelTitle: "Który model ma go napędzać?",
        customSetup: "Zaawansowana konfiguracja →",
        next: "Dalej",
        selectFirst: "Wybierz towarzysza, aby kontynuować",
      },
      usecases: {
        title: "Do czego głównie będziesz tego używać?",
        subtitle:
          "Automatycznie dodamy odpowiednich specjalistów do zestawu narzędzi twojej AI.",
        saving: "Konfigurowanie...",
        start: "Rozpocznij czat",
        hintNoneSelected:
          "Wybierz obszary dla specjalistów lub naciśnij Start, aby pominąć",
        noProviderAvailable:
          "Brak skonfigurowanego dostawcy AI. Dodaj OPENROUTER_API_KEY lub włącz Claude Code (CLAUDE_CODE_ENABLED=true) aby kontynuować.",
        coding: {
          label: "Kodowanie & Technika",
          hint: "Vibe Coder, Coder",
        },
        research: {
          label: "Badania & Analiza",
          hint: "Researcher, Data Analyst",
        },
        writing: {
          label: "Pisanie & Edycja",
          hint: "Writer, Editor",
        },
        business: {
          label: "Biznes & Strategia",
          hint: "Business Advisor, Product Manager",
        },
        learning: {
          label: "Nauka & Edukacja",
          hint: "Tutor, Socratic Questioner",
        },
        creative: {
          label: "Kreatywność & Historie",
          hint: "Gawędziarz, Kreatywny",
        },
        health: {
          label: "Zdrowie & Kariera",
          hint: "Wellness, Coach kariery",
        },
        controversial: {
          label: "Wolne myślenie",
          hint: "Bez cenzury, Filozof",
        },
        roleplay: {
          label: "Roleplay & Postacie",
          hint: "Roleplay, Twórca postaci",
        },
      },
    },
    input: {
      placeholder: "Wyślij wiadomość...",
      imagePlaceholder: "Opisz obraz do wygenerowania...",
      audioPlaceholder: "Opisz dźwięk lub muzykę do wygenerowania...",
      noPermission: "Nie masz uprawnień do publikowania tutaj",
      keyboardShortcuts: {
        enter: "Enter",
        toSend: "aby wysłać",
        shiftEnter: "Shift+Enter",
        forNewLine: "dla nowej linii",
        ctrlV: "Ctrl+V",
        orPasteFiles: "lub wklej pliki",
      },
      speechInput: {
        transcribing: "Transkrybuję...",
      },
      attachments: {
        uploadFile: "Załącz pliki",
        attachedFiles: "Załączone pliki",
        addMore: "Dodaj więcej",
      },
    },
    imageGen: {
      sizeSquare: "Kwadrat (1024×1024)",
      sizeLandscape: "Poziomy (1792×1024)",
      sizePortrait: "Pionowy (1024×1792)",
      qualityStandard: "Standard",
      qualityHD: "HD",
    },
    audioGen: {
      durationShort: "Krótki (~8s)",
      durationMedium: "Średni (~15s)",
      durationLong: "Długi (~30s)",
    },
    voiceMode: {
      unconfiguredTitle: "Głos niekonfigurowany",
      unconfiguredDescription:
        "Zamiana tekstu na mowę nie jest dostępna dla tej umiejętności.",
      callMode: "Tryb rozmowy",
      callModeDescription: "AI odpowie głosem",
      tapToRecord: "Dotknij, aby nagrać",
      recording: {
        paused: "Wstrzymano",
        resume: "Wznów",
        pause: "Pauza",
      },
      callOverlay: {
        listening: "Słucham...",
      },
      actions: {
        cancel: "Anuluj",
        toInput: "Do wpisywania",
        sendVoice: "Wyślij głos",
        retry: "Spróbuj ponownie",
        download: "Pobierz audio",
        downloadHint: "Pobierz plik i dołącz go do następnej wiadomości.",
      },
    },
    actions: {
      cancellingGeneration: "Anulowanie...",
      stopGeneration: "Stop",
      sendMessage: "Wyślij",
    },
    toolsButton: {
      title: "Narzędzia AI",
      tools: "Narzędzia",
    },
  },
  chat: {
    category: "Czat",
    tags: {
      threads: "Wątki",
      folders: "Foldery",
      files: "Pliki",
      messages: "Wiadomości",
      characters: "Persony",
      memories: "Wspomnienia",
      favorites: "Ulubione",
      credits: "Kredyty",
      balance: "Saldo",
      permissions: "Uprawnienia",
      hotkey: "Skrót klawiszowy",
      cli: "CLI",
      speech: "Mowa",
      sharing: "Udostępnianie",
      settings: "Ustawienia",
    },
    config: {
      appName: "unbottled.ai",
      folders: {
        private: "Prywatny",
        shared: "Udostępniony",
        public: "Publiczny",
        incognito: "Incognito",
        background: "W tle",
        remote: "Zdalne",
      },
      foldersShort: {
        private: "Prywatny",
        shared: "Udostępniony",
        public: "Publiczny",
        incognito: "Incognito",
        background: "W tle",
        remote: "Zdalne",
      },
    },
    enums: {
      role: {
        user: "Użytkownik",
        assistant: "Asystent",
        system: "System",
        tool: "Narzędzie",
        error: "Błąd",
      },
      threadStatus: {
        active: "Aktywny",
        archived: "Zarchiwizowany",
        deleted: "Usunięty",
      },
      viewMode: {
        linear: "Liniowy",
        threaded: "Wątkowy",
        flat: "Płaski",
        debug: "Debug",
      },
    },
    components: {
      sidebar: {
        login: "Zaloguj się",
        logout: "Wyloguj się",
        footer: {
          account: "Konto",
          profile: "Profil",
          balance: "Saldo",
          buy: "Kup",
          freeCreditsLeft: "Darmowe kredyty",
        },
      },
      credits: {
        credit: "{{count}} kredyt",
        credits: "{{count}} kredytów",
      },
      navigation: {
        subscription: "Subskrypcja i Kredyty",
        referral: "Program Poleceń",
        help: "Pomoc",
        about: "O nas",
      },
      confirmations: {
        deleteMessage: "Czy na pewno chcesz usunąć tę wiadomość?",
      },
      welcomeTour: {
        authDialog: {
          title: "Odblokuj prywatne i udostępnione foldery",
          description:
            "Zarejestruj się lub zaloguj, aby uzyskać dostęp do prywatnych i udostępnionych folderów. Twoje czaty będą synchronizowane między urządzeniami.",
          continueTour: "Kontynuuj wycieczkę",
          signUp: "Zarejestruj się / Zaloguj",
        },
        buttons: {
          back: "Wstecz",
          close: "Zamknij",
          last: "Zakończ",
          next: "Dalej",
          skip: "Pomiń",
        },
        welcome: {
          title: "Witaj w {{appName}}!",
          description:
            "Twoja platforma AI zorientowana na prywatność z ponad {{modelCount}} modelami, kontrolą treści przez użytkownika i zasadami wolności słowa.",
          subtitle: "Zrób szybką wycieczkę, aby zacząć.",
        },
        aiCompanion: {
          title: "Wybierz swojego towarzysza AI",
          description:
            "Wybieraj spośród ponad {{modelCount}} modeli AI, w tym głównonurtowych, open-source i bez cenzury.",
          tip: "Kliknij, aby otworzyć selektor modeli i wybrać towarzysza.",
        },
        rootFolders: {
          title: "Twoje foldery czatów",
          description:
            "Organizuj swoje czaty w różnych folderach, każdy z unikalnymi ustawieniami prywatności:",
          private: {
            name: "Prywatny",
            suffix: "— tylko Ty możesz zobaczyć",
          },
          incognito: {
            name: "Incognito",
            suffix: "— historia nie jest zapisywana",
          },
          shared: {
            name: "Udostępniony",
            suffix: "— współpracuj z innymi",
          },
          public: {
            name: "Publiczny",
            suffix: "— widoczny dla wszystkich",
          },
        },
        privateFolder: {
          name: "Prywatny",
          suffix: "Folder",
          description:
            "Twoje prywatne czaty są widoczne tylko dla Ciebie. Idealne do wrażliwych tematów.",
        },
        incognitoFolder: {
          name: "Incognito",
          suffix: "Folder",
          description:
            "Rozmawiaj bez zapisywania historii na serwerze. Wiadomości są przechowywane lokalnie w przeglądarce i pozostają do momentu ich usunięcia.",
          note: "Żadne dane nie są przechowywane na naszych serwerach podczas sesji incognito.",
        },
        sharedFolder: {
          name: "Udostępniony",
          suffix: "Folder",
          description:
            "Współpracuj z konkretnymi osobami, udostępniając im dostęp do tego folderu.",
        },
        publicFolder: {
          name: "Publiczny",
          suffix: "Folder",
          description:
            "Udostępniaj swoje rozmowy AI światu. Inni mogą przeglądać i forkować Twoje wątki.",
          note: "Wszystko w folderze publicznym jest widoczne dla wszystkich użytkowników i wyszukiwarek.",
        },
        newChatButton: {
          title: "Rozpocznij nowy czat",
          description:
            "Kliknij tutaj, aby rozpocząć nową rozmowę w dowolnym folderze.",
        },
        sidebarLogin: {
          title: "Zaloguj się, aby odblokować więcej",
          description:
            "Utwórz darmowe konto, aby uzyskać dostęp do folderów prywatnych i udostępnionych, synchronizować historię rozmów między urządzeniami i pozwolić AI zapamiętywać informacje o Tobie.",
          tip: "Rejestracja jest bezpłatna!",
        },
        subscriptionButton: {
          title: "Kredyty i subskrypcja",
          description:
            "Otrzymuj {{credits}} kredytów/miesiąc z subskrypcją za jedyne {{price}}/miesiąc. Bezpłatni użytkownicy otrzymują {{freeCredits}} kredytów/miesiąc.",
        },
        chatInput: {
          title: "Wpisz swoją wiadomość",
          description:
            "Wpisz swoją wiadomość tutaj i naciśnij Enter lub kliknij Wyślij, aby rozmawiać z towarzyszem AI.",
          tip: "Użyj Shift+Enter dla nowej linii. Możesz też załączać pliki i zdjęcia.",
        },
        voiceInput: {
          title: "Wprowadzanie głosowe",
          description: "Użyj mikrofonu, aby rozmawiać z towarzyszem AI:",
          options: {
            transcribe: "Transkrybuj mowę na tekst",
            sendAudio: "Wyślij audio bezpośrednio do AI",
            pauseResume: "Wstrzymaj i wznów nagrywanie",
          },
        },
        callMode: {
          title: "Tryb połączenia",
          description:
            "Włącz tryb połączenia dla bezobsługowej, głosowej rozmowy z odpowiedziami AI w czasie rzeczywistym.",
          tip: "Idealne, gdy jesteś w ruchu lub wolisz mówić niż pisać.",
        },
        complete: {
          title: "Gotowe!",
          description:
            "Ukończyłeś wycieczkę! Zacznij teraz rozmawiać z towarzyszem AI.",
          help: "Potrzebujesz pomocy? Kliknij ikonę znaku zapytania na pasku bocznym w dowolnym momencie.",
        },
        authUnlocked: {
          unlocked: "Odblokowany!",
          privateDescription:
            "Twój prywatny folder jest teraz dostępny. Wszystkie czaty są widoczne tylko dla Ciebie.",
          privateNote:
            "Prywatne czaty automatycznie synchronizują się na wszystkich Twoich urządzeniach.",
          sharedDescription:
            "Twój udostępniony folder jest teraz dostępny. Zaproś innych do współpracy przy rozmowach AI.",
          sharedNote:
            "Kontrolujesz, kto ma dostęp do Twoich udostępnionych folderów i wątków.",
        },
      },
    },
    selector: {
      loading: "Ładowanie...",
      best: "Najlepsze dopasowanie",
      free: "DARMOWE",
      creditsSingle: "1 kredyt",
      creditsExact: "{{cost}} kredytów",
      modelOnly: "Tylko model",
      editModelSettings: "Edytuj ustawienia modelu",
      editSettings: "Edytuj ustawienia",
      switchSkill: "Zmień postać",
      editSkill: "Edytuj postać",
      delete: "Usuń",
      autoSelectedModel: "FILTROWANE",
      manualSelectedModel: "WYBRANE RĘCZNIE",
      intelligence: "Inteligencja",
      contentFilter: "Treść",
      maxPrice: "Maksymalna cena",
      modelSelection: "Wybór modelu",
      autoModeDescription:
        "Najlepszy model jest wybierany na podstawie Twoich filtrów",
      manualModeDescription: "Wybierz konkretny model ręcznie",
      autoMode: "Filtrowanie",
      manualMode: "Ręczny",
      allModelsCount: "Wszystkie {{count}} modeli",
      filteredModelsCount: "{{count}} modeli pasuje do filtrów",
      showFiltered: "Pokaż przefiltrowane",
      showAllModels: "Pokaż wszystkie modele",
      showLess: "Pokaż mniej",
      showMore: "Pokaż {{remaining}} więcej",
      showLegacyModels_one: "Pokaż {{count}} Model Legacy",
      showLegacyModels_other: "Pokaż {{count}} Modeli Legacy",
      noMatchingModels: "Brak pasujących modeli",
      noModelsWarning: "Żaden model nie pasuje do Twoich filtrów",
      useOnce: "Użyj raz",
      saveAsDefault: "Dodaj do ulubionych",
      deleteSetup: "Usuń konfigurację",
      content: "Przeszukaj treść...",
      characterSetup: "Konfiguracja persony",
      noResults: "Brak wyników",
      add: "Dodaj do ulubionych",
      added: "Dodano",
      addNew: "Dodaj nowy",
      searchSkills: "Szukaj person...",
      createCustom: "Utwórz własną",
      customizeSettings: "Dostosuj ustawienia",
      requirements: {
        characterConflict: "Konflikty wymagań postaci",
        tooLow: "zbyt niski",
        tooHigh: "zbyt wysoki",
        min: "min",
        max: "max",
      },
    },
    common: {
      newChat: "Nowy czat",
      privateChats: "Prywatne czaty",
      search: "Szukaj",
      delete: "Usuń",
      cancel: "Anuluj",
      save: "Zapisz",
      edit: "Edytuj",
      settings: "Ustawienia",
      close: "Zamknij",
      toggleSidebar: "Przełącz pasek boczny",
      lightMode: "Tryb jasny",
      darkMode: "Tryb ciemny",
      searchPlaceholder: "Szukaj...",
      searchThreadsPlaceholder: "Przeszukaj wątki...",
      searchResults: "Wyniki wyszukiwania",
      noChatsFound: "Nie znaleziono czatów",
      noThreadsFound: "Nie znaleziono wątków",
      enableTTSAutoplay: "Włącz autoodtwarzanie TTS",
      disableTTSAutoplay: "Wyłącz autoodtwarzanie TTS",
      selector: {
        country: "Kraj",
        language: "Język",
      },
      copyButton: {
        copied: "Skopiowano!",
        copyToClipboard: "Skopiuj do schowka",
        copyAsMarkdown: "Skopiuj jako Markdown",
        copyAsText: "Skopiuj jako tekst",
      },
      assistantMessageActions: {
        cancelLoading: "Anuluj ładowanie",
        stopAudio: "Zatrzymaj audio",
        playAudio: "Odtwórz audio",
        answerAsAI: "Odpowiedz jako model AI",
        deleteMessage: "Usuń wiadomość",
      },
      characterSelector: {
        placeholder: "Wybierz personę",
        addNewLabel: "Utwórz własną personę",
        grouping: {
          bySource: "Według źródła",
          byCategory: "Według kategorii",
          sourceLabels: {
            builtIn: "Wbudowane",
            my: "Moje persony",
            community: "Społeczność",
          },
          sourceIcons: {
            builtIn: "sparkles",
            my: "user",
            community: "people",
          },
        },
        addDialog: {
          title: "Utwórz własną personę",
          fields: {
            name: {
              label: "Nazwa",
              placeholder: "Wprowadź nazwę persony",
            },
            icon: {
              label: "Ikona (emoji)",
              placeholder: "😊",
            },
            description: {
              label: "Opis",
              placeholder: "Krótki opis persony",
            },
            systemPrompt: {
              label: "Prompt systemowy",
              placeholder: "Zdefiniuj, jak zachowuje się postać...",
            },
            category: {
              label: "Kategoria",
            },
          },
          createCategory: "Utwórz kategorię",
          cancel: "Anuluj",
          create: "Utwórz personę",
        },
        addCategoryDialog: {
          title: "Utwórz kategorię",
          fields: {
            name: {
              label: "Nazwa kategorii",
              placeholder: "Wprowadź nazwę kategorii",
            },
            icon: {
              label: "Ikona (emoji)",
              placeholder: "📁",
            },
          },
          cancel: "Anuluj",
          create: "Utwórz kategorię",
        },
      },
    },
    actions: {
      newChatInFolder: "Nowy czat w folderze",
      newFolder: "Nowy folder",
      deleteFolder: "Usuń folder",
      deleteMessage: "Usuń wiadomość",
      deleteThisMessage: "Usuń tę wiadomość",
      searchEnabled: "Wyszukiwanie włączone",
      searchDisabled: "Wyszukiwanie wyłączone",
      answerAsAI: "Odpowiedz jako model AI",
      retry: "Ponów z innym modelem/personą",
      branch: "Rozgałęź konwersację stąd",
      editMessage: "Edytuj wiadomość",
      stopAudio: "Zatrzymaj odtwarzanie audio",
      playAudio: "Odtwórz audio",
      copyContent: "Skopiuj do schowka",
    },
    dialogs: {
      searchAndCreate: "Szukaj i utwórz",
      deleteChat: 'Usunąć czat "{{title}}"?',
      deleteFolderConfirm:
        'Usunąć folder "{{name}}" i przenieść {{count}} czat(ów) do Ogólne?',
    },
    views: {
      linearView: "Widok liniowy (styl ChatGPT)",
      threadedView: "Widok wątkowy (styl Reddit/Discord)",
      flatView: "Widok płaski (styl 4chan)",
      debugView: "Widok debugowania (z promptami systemu)",
    },
    screenshot: {
      capturing: "Przechwytywanie...",
      capture: "Przechwyć zrzut ekranu",
      failed: "Nie udało się przechwycić zrzutu ekranu",
      failedWithMessage: "Nie udało się przechwycić zrzutu ekranu: {{message}}",
      tryAgain: "Nie udało się przechwycić zrzutu ekranu. Spróbuj ponownie.",
      noMessages:
        "Nie można znaleźć obszaru wiadomości czatu. Upewnij się, że masz wiadomości w czacie.",
      quotaExceeded: "Przekroczono limit miejsca. Zrzut ekranu jest za duży.",
      canvasError:
        "Nie udało się przekonwertować zrzutu ekranu na format obrazu.",
    },
    errors: {
      noResponse:
        "Nie otrzymano odpowiedzi od AI. Żądanie zostało zakończone, ale zwróciło pustą treść. Spróbuj ponownie.",
      noStream:
        "Nie udało się przesłać strumieniowo odpowiedzi: Brak dostępnego czytnika",
      saveFailed: "Nie udało się zapisać edycji",
      branchFailed: "Nie udało się rozgałęzić",
      retryFailed: "Nie udało się ponowić",
      answerFailed: "Nie udało się odpowiedzieć",
      deleteFailed: "Nie udało się usunąć",
    },
    errorTypes: {
      streamError: "Błąd strumienia",
    },
    hooks: {
      stt: {
        "endpoint-not-available": "Punkt końcowy mowy na tekst niedostępny",
        "failed-to-start": "Nie udało się rozpocząć nagrywania",
        "permission-denied":
          "Dostęp do mikrofonu zablokowany. Zezwól na mikrofon w ustawieniach przeglądarki i odśwież stronę.",
        "permission-denied-ios":
          "Mikrofon zablokowany. Przejdź do Ustawienia → Safari → Mikrofon i zezwól na dostęp dla tej strony.",
        "permission-denied-android":
          "Mikrofon zablokowany. Dotknij ikony kłódki na pasku adresu → Ustawienia witryny → Mikrofon → Zezwól.",
        "permission-denied-mac":
          "Mikrofon zablokowany. Otwórz Ustawienia systemowe → Prywatność i ochrona → Mikrofon i włącz przeglądarkę.",
        "permission-denied-windows":
          "Mikrofon zablokowany. Otwórz Ustawienia → Prywatność → Mikrofon i upewnij się, że przeglądarka ma dostęp.",
        "no-microphone":
          "Nie znaleziono mikrofonu. Podłącz mikrofon lub słuchawki z mikrofonem i spróbuj ponownie.",
        "microphone-in-use":
          "Mikrofon jest używany przez inną aplikację. Zamknij ją i spróbuj ponownie.",
        "not-supported":
          "Twoja przeglądarka nie obsługuje dostępu do mikrofonu. Spróbuj Chrome, Firefox lub Safari.",
        "transcription-failed": "Nie udało się transkrybować audio",
        "audio-too-short":
          "Nagranie za krótkie. Trzymaj mikrofon i mów wyraźnie, a następnie spróbuj ponownie.",
      },
      tts: {
        "endpoint-not-available": "Punkt końcowy tekstu na mowę niedostępny",
        "failed-to-play": "Nie udało się odtworzyć audio",
        "conversion-failed": "Konwersja TTS nie powiodła się",
        "failed-to-generate": "Nie udało się wygenerować audio",
      },
    },
    post: {
      title: "Czat",
      description: "Interfejs czatu",
    },
    models: {
      descriptions: {
        uncensoredLmV11:
          "Niecenzurowany model AI dla kreatywnych i nieograniczonych rozmów",
        freedomgptLiberty:
          "FreedomGPT Liberty - Niecenzurowany model AI skoncentrowany na wolności wypowiedzi i treściach kreatywnych",
        gabAiArya:
          "Gab AI Arya - Niecenzurowany model konwersacyjny AI z wolnością wypowiedzi i kreatywnymi możliwościami",
        gemini31ProPreviewCustomTools:
          "Gemini 3.1 Pro Preview (Custom Tools) - Wariant Gemini 3.1 Pro z ulepszoną selekcją narzędzi dla agentów kodowania i złożonych przepływów wielonarzędziowych",
        gemini31FlashImagePreview:
          "Gemini 3.1 Flash Image Preview - Multimodalny model Google generujący obrazy bezpośrednio z promptów tekstowych przez czat, obsługujący tekst i obraz w tej samej rozmowie",
        gemini31FlashLitePreview:
          "Gemini 3.1 Flash Lite Preview - Wysokowydajny model Google zoptymalizowany dla dużych wolumenów z ulepszeniami w audio, rankingu RAG, tłumaczeniu i uzupełnianiu kodu",
        gemini3Pro:
          "Google Gemini 3 Pro - Zaawansowany multimodalny model AI z dużym oknem kontekstowym i potężnymi możliwościami rozumowania",
        gemini35Flash:
          "Gemini 3.5 Flash - Możliwości bliskie Pro przy koszcie Flash. Obsługuje tekst, obrazy, wideo, audio i PDF. Wbudowane równoległe pętle agentów. Poziomy myślenia od minimalnego do wysokiego dla precyzyjnej kontroli kosztów i wydajności.",
        gemini3Flash:
          "Google Gemini 3 Flash - Szybki, wydajny multimodalny model AI zoptymalizowany dla szybkich odpowiedzi",
        deepseekV32:
          "DeepSeek V3.2 - Wysokowydajny model rozumowania z zaawansowanymi możliwościami kodowania",
        deepseekV4Pro:
          "DeepSeek V4 Pro - 1,6T parametrów MoE z kontekstem 1M. Do analizy całych baz kodu, złożonego rozumowania i wieloetapowych agentów.",
        deepseekV4Flash:
          "DeepSeek V4 Flash - 284B MoE za grosze. Kontekst 1M, szybka inferecja, solidne kodowanie. Wydajny wybór do zadań wymagających wysokiej przepustowości.",
        gpt55:
          "GPT-5.5 - Frontier model OpenAI dla złożonych profesjonalnych zadań. Silniejsze rozumowanie, wyższa niezawodność, lepsza wydajność tokenów. Kontekst 1M+ z obsługą tekstu i obrazów.",
        gpt55Pro:
          "GPT-5.5 Pro - Najwydajniejszy model OpenAI do głębokiego rozumowania w złożonych, wysokostawkowych zadaniach. Kontekst 1M+, długohoryzontowe rozwiązywanie problemów, agentyczne kodowanie, precyzyjne wykonanie wieloetapowe.",
        gpt54Pro:
          "GPT-5.4 Pro - Najbardziej zaawansowany model OpenAI z ulepszonym rozumowaniem, oknem kontekstu 1M+ i doskonałą wydajnością dla złożonych zadań",
        gpt54:
          "GPT-5.4 - Najnowszy model frontier OpenAI łączący Codex i GPT, z oknem kontekstu 1M+ dla wielokontekstowego rozumowania i kodowania",
        gpt53Codex:
          "GPT-5.3-Codex - Najbardziej zaawansowany model agentyczny OpenAI do kodowania, zoptymalizowany dla długich przepływów z narzędziami i złożonych zadań deweloperskich",
        gpt53Chat:
          "GPT-5.3 Chat - Zaktualizowany model konwersacyjny ChatGPT z dokładniejszymi odpowiedziami i znacznie mniejszą liczbą zbędnych odmów",
        gpt52Pro:
          "GPT-5.2 Pro - Zaawansowany model OpenAI z ulepszonymi możliwościami rozumowania i kodowania",
        gpt52:
          "GPT-5.2 - Wysokowydajny model OpenAI do złożonych zadań i analizy",
        gpt52_chat:
          "GPT-5.2 Chat - Zoptymalizowany model OpenAI dla interakcji konwersacyjnych",
        dolphin3_0_r1_mistral_24b:
          "Dolphin 3.0 R1 Mistral 24B - Niecenzurowany duży model językowy oparty na Mistral",
        dolphinLlama3_70B:
          "Dolphin Llama 3 70B - Niecenzurowany duży model językowy oparty na Llama 3",
        veniceUncensored:
          "Venice Uncensored 1.1 - Najbardziej niecenzurowany model AI z obsługą wywoływania narzędzi. Zaprojektowany dla maksymalnej kreatywnej wolności i autentycznej interakcji. Idealny do otwartej eksploracji, gier fabularnych i niefiltrowanego dialogu z minimalnymi ograniczeniami treści.",
        claudeOpus45:
          "Claude Opus 4.5 - Najpotężniejszy model Claude z wyjątkowymi możliwościami rozumowania i kreatywnymi",
        claudeOpus46:
          "Claude Opus 4.6 - Potężny model Claude z wyjątkowymi możliwościami rozumowania i kreatywnymi",
        claudeOpus47:
          "Claude Opus 4.7 - Poprzednia generacja Opus. Zastąpiony przez 4.8.",
        claudeOpus48:
          "Claude Opus 4.8 - Najpotężniejszy ogólnodostępny model Opus od Anthropic. Stworzony do długotrwałych zadań agentowych, złożonego programowania i wieloetapowego rozumowania przy bardzo długich wynikach. Okno kontekstu 1M tokenów. Obsługuje tekst, obrazy i pliki.",
        claudeSonnet46:
          "Claude Sonnet 4.6 - Najpotężniejszy model Sonnet od Anthropic z najwyższą wydajnością w kodowaniu, agentach i pracy profesjonalnej",
        claudeHaiku45:
          "Claude Haiku 4.5 - Szybki i wydajny model Claude zoptymalizowany pod kątem szybkości i opłacalności",
        glm5_1:
          "GLM-5.1 - model kodowania nowej generacji Z.AI stworzony do zadań długoterminowych. Pracuje autonomicznie ponad 8 godzin nad jednym zadaniem - planuje, wykonuje i doskonali się, aż dostarczy wyniki klasy inżynieryjnej.",
        glm5: "GLM-5 - flagowy model open-source Z.AI zaprojektowany do projektowania złożonych systemów i długoterminowych przepływów agentów, dorównujący wiodącym modelom zamkniętym",
        glm5Turbo:
          "GLM-5 Turbo - model nowej generacji Z.AI głęboko zoptymalizowany dla środowisk agentycznych z szybką inferencją, ulepszoną dekompozycją instrukcji i stabilnością długich zadań",
        glm46:
          "GLM-4 6B - Wydajny dwujęzyczny model AI chińsko-angielski z silnymi ogólnymi możliwościami",
        glm47:
          "GLM-4 7B - Zaawansowany dwujęzyczny model chińsko-angielski z ulepszonymi możliwościami rozumowania i kodowania",
        glm47Flash:
          "GLM-4 7B Flash - Ultraszybki model chińsko-angielski zoptymalizowany dla szybkich odpowiedzi",
        kimiK2:
          "Kimi K2 - Potężny chiński model AI z doskonałym zrozumieniem kontekstu",
        kimiK2_5:
          "Kimi K2.5 - Poprzednia generacja modelu Moonshot AI z silnym rozumowaniem w długim kontekście i możliwościami kodowania",
        kimiK2_6:
          "Kimi K2.6 - Model multimodalny nowej generacji Moonshot AI do długoterminowego kodowania, generowania UI/UX z promptów i obrazów oraz orkiestracji wielu agentów z architekturą roju agentów skalującą do setek równoległych podsystemów",
        claudeSonnet45:
          "Claude Sonnet 4.5 - Poprzednia generacja modelu Sonnet od Anthropic z silnymi możliwościami kodowania i analizy",
        claudeAgentSonnet:
          "Claude Agent Sonnet - Autonomiczny agent AI z Claude Sonnet przez Anthropic Agent SDK. Samodzielnie wykonuje narzędzia z wbudowanym rozumowaniem.",
        claudeAgentHaiku:
          "Claude Agent Haiku - Szybki autonomiczny agent AI z Claude Haiku przez Anthropic Agent SDK. Zoptymalizowany pod kątem szybkości z wykonywaniem narzędzi.",
        claudeAgentOpus:
          "Claude Agent Opus - Najpotężniejszy autonomiczny agent AI z Claude Opus przez Anthropic Agent SDK. Maksymalna inteligencja z wykonywaniem narzędzi.",
        grok4:
          "Grok 4 - Flagowy model rozumowania xAI z możliwościami wizji i wyszukiwania w sieci",
        grok4Fast:
          "Grok 4 Fast - Szybki model xAI z kontekstem 2M tokenów zoptymalizowany dla szybkich odpowiedzi",
        grok43:
          "Grok 4.3 - Model rozumowania xAI z kontekstem 1M tokenów, wysoką dokładnością faktograficzną i stałym trybem rozumowania dla agentycznych przepływów pracy i głębokich badań",
        grok420Beta:
          "Grok 4.20 (Legacy) - Poprzedni flagowy model xAI z agentycznym wywoływaniem narzędzi, niskim wskaźnikiem halucynacji i kontekstem 2M tokenów",
        gpt5Pro:
          "GPT-5 Pro - Premium model OpenAI z najwyższym poziomem rozumowania i zaawansowanymi możliwościami kodowania",
        gpt5Codex:
          "GPT-5 Codex - Wyspecjalizowany model kodowania OpenAI z wyjątkowymi możliwościami programistycznymi i technicznymi",
        gpt51Codex:
          "GPT 5.1 Codex - Zaktualizowany model kodowania OpenAI z ulepszonymi możliwościami kreatywnymi i programistycznymi",
        gpt51:
          "GPT 5.1 - Wydajny model ogólnego przeznaczenia OpenAI z silnym rozumowaniem i analizą",
        gpt5: "GPT-5 - Flagowy model OpenAI z szeroką inteligencją i wszechstronnymi możliwościami",
        gpt54Mini:
          "GPT-5.4 Mini - Wydajny wariant GPT-5.4 OpenAI zoptymalizowany dla dużej przepustowości z silnym rozumowaniem, kodowaniem i użyciem narzędzi przy niższym koszcie",
        gpt54Nano:
          "GPT-5.4 Nano - Najlżejszy i najbardziej ekonomiczny model OpenAI zoptymalizowany dla krytycznych pod względem szybkości zadań takich jak klasyfikacja, ekstrakcja danych i wykonywanie sub-agentów",
        gpt5Mini: "GPT-5 Mini - Lekki szybki model OpenAI do codziennych zadań",
        gpt5Nano:
          "GPT-5 Nano - Najmniejszy i najbardziej przystępny cenowo model OpenAI do prostych rozmów",
        gptOss120b:
          "GPT-OSS 120B - Model open-source OpenAI z 120B parametrami z silnymi możliwościami kodowania",
        kimiK2Thinking:
          "Kimi K2 Thinking - Model Kimi skoncentrowany na rozumowaniu z ulepszoną analizą krok po kroku",
        minimaxM27:
          "MiniMax M2.7 - Agentyczny model nowej generacji MiniMax przeznaczony do autonomicznej produktywności, współpracy wielu agentów i przepływów produkcyjnych w tym debugowania kodu, modelowania finansowego i generowania dokumentów",
        mimoV2Pro:
          "MiMo V2 Pro - Flagowy model Xiaomi z 1T+ parametrami i kontekstem 1M, głęboko zoptymalizowany do orkiestracji agentów, automatyzacji złożonych przepływów i zadań inżynieryjnych",
        glm45Air:
          "GLM 4.5 AIR - Ultraszybki lekki model Z.AI do szybkich interakcji konwersacyjnych",
        glm45v:
          "GLM 4.5v - Model wizyjny Z.AI z rozumieniem obrazów i możliwościami czatu",
        geminiFlash25Lite:
          "Gemini 2.5 Flash Lite - Podstawowy model Gemini Google z dużym kontekstem i szybkimi odpowiedziami",
        geminiFlash25Flash:
          "Gemini 2.5 Flash - Wydajny multimodalny model Google z kontekstem 1M tokenów dla szybkich zadań",
        geminiFlash25Pro:
          "Gemini 2.5 Flash Pro - Poprzedni model Pro Google z dużym kontekstem i silnym rozumowaniem",
        deepseekV31:
          "DeepSeek V3.1 - Poprzednia generacja modelu DeepSeek z silnymi możliwościami kodowania i analizy",
        deepseekR1:
          "DeepSeek R1 - Model DeepSeek skoncentrowany na rozumowaniu z zaawansowanym rozwiązywaniem problemów krok po kroku",
        qwen3235bFree:
          "Qwen3 235B - Duży otwarty model Alibaby z 235B parametrami do złożonych zadań kodowania i rozumowania",
        deepseekR1Distill:
          "DeepSeek R1 Distill - Kompaktowa zdestylowana wersja DeepSeek R1 z wydajnymi możliwościami rozumowania",
        qwen257b:
          "Qwen 2.5 7B - Kompaktowy model 7B Alibaby do szybkich i niedrogich zadań konwersacyjnych",
        dallE3:
          "DALL-E 3 - Model generowania obrazów OpenAI tworzący wysokiej jakości, szczegółowe obrazy z opisów tekstowych",
        gptImage1:
          "GPT-Image-1 - Szybki i przystępny cenowo model generowania obrazów OpenAI",
        fluxSchnell:
          "Flux Schnell - Szybki model generowania obrazów Black Forest Labs, zoptymalizowany pod kątem szybkości",
        fluxPro:
          "Flux Pro 1.1 - Profesjonalny model generowania obrazów Black Forest Labs z doskonałą jakością",
        flux2Max:
          "FLUX.2 Max - Flagowy model obrazów Black Forest Labs z najwyższą jakością obrazu, rozumieniem promptów i spójnością edycji",
        flux2Klein4b:
          "FLUX.2 Klein 4B - Najszybszy i najbardziej opłacalny model obrazów Black Forest Labs, zoptymalizowany pod kątem wysokiej przepustowości",
        riverflowV2Pro:
          "Riverflow V2 Pro - Najpotężniejszy model generowania obrazów Sourceful z najlepszą kontrolą i perfekcyjnym renderowaniem tekstu",
        riverflowV2Fast:
          "Riverflow V2 Fast - Najszybszy model generowania obrazów Sourceful, zoptymalizowany pod kątem wdrożeń produkcyjnych i przepływów wrażliwych na opóźnienia",
        riverflowV2MaxPreview:
          "Riverflow V2 Max Preview - Najpotężniejszy wariant podglądu Sourceful, zunifikowany model text-to-image i image-to-image",
        riverflowV2StandardPreview:
          "Riverflow V2 Standard Preview - Standardowy wariant podglądu Sourceful z ulepszoną wydajnością względem rodziny Riverflow 1",
        riverflowV2FastPreview:
          "Riverflow V2 Fast Preview - Najszybszy wariant podglądu Sourceful, zunifikowany model text-to-image i image-to-image w najniższej cenie",
        flux2Flex:
          "FLUX.2 Flex - Model obrazów Black Forest Labs doskonały w renderowaniu złożonego tekstu, typografii i edycji wielu referencji w jednolitej architekturze",
        flux2Pro:
          "FLUX.2 Pro - Zaawansowany model generowania i edycji obrazów Black Forest Labs z wysoką jakością wizualną, silną zgodnością z promptem i spójną reprodukcją postaci",
        gemini3ProImagePreview:
          "Nano Banana Pro (Gemini 3 Pro Image Preview) - Najbardziej zaawansowany model generowania obrazów Google z ulepszonym rozumowaniem multimodalnym, gruntowaniem w rzeczywistości i wiodącym renderowaniem tekstu",
        gpt5ImageMini:
          "GPT-5 Image Mini - Wydajny multimodalny model generowania obrazów OpenAI łączący możliwości językowe GPT-5 Mini z szybką i przystępną cenowo generacją obrazów",
        gpt5Image:
          "GPT-5 Image - Flagowy multimodalny model OpenAI łączący możliwości językowe GPT-5 z najnowocześniejszym generowaniem i edytowaniem obrazów",
        gpt54Image2:
          "GPT-5.4 Image 2 - Multimodalny model nowej generacji OpenAI łączący rozumowanie GPT-5.4 z generowaniem GPT Image 2. Płynnie przechodzi między kodowaniem, analizą i tworzeniem wizualnym w jednej rozmowie.",
        seedream45:
          "Seedream 4.5 - Najnowszy model generowania obrazów ByteDance z kompleksowymi ulepszeniami spójności edycji, retuszu portretów i kompozycji wielu obrazów",
        sdxl: "Stable Diffusion XL - Wysokiej jakości otwarty model generowania obrazów Stability AI",
        cassetteMusic:
          "CassetteAI Music - szybkie generowanie muzyki z tekstu przez Fal.ai, klipy do trzech minut",
        musicgenStereo:
          "MusicGen Stereo - Open-source'owy stereofoniczny model generowania muzyki Meta via Replicate",
        stableAudio:
          "Stable Audio - Model generowania muzyki i dźwięku Stability AI dla wysokiej jakości klipów",
        udioV2:
          "Udio v2 - Wysokiej jakości generowanie muzyki AI z wokalem i pełną jakością produkcji",
        modelsLabMusicGen:
          "ModelsLab Music Gen - Generowanie muzyki AI z opisów tekstowych, obsługuje MP3/WAV/FLAC",
        modelsLabElevenlabsMusic:
          "ElevenLabs Music - Wysokiej jakości generowanie muzyki z ElevenLabs przez ModelsLab",
        modelsLabSonautoSong:
          "Sonauto Song - Pełne generowanie piosenek z wokalem, różne gatunki do 4:45 min",
        modelsLabLyria3:
          "Lyria 3 - Zaawansowany model Google do generowania oryginalnych 30-sekundowych utworów z tekstu",
        modelsLabCogVideoX:
          "CogVideoX - Model tekst-na-wideo ModelsLab do generowania krótkich klipów",
        modelsLabWanx: "Wanx - Model generowania wideo z tekstu ModelsLab",
        modelsLabWan22:
          "Wan 2.2 Ultra - Wysokiej jakości model tekst-na-wideo ModelsLab",
        modelsLabWan21:
          "Wan 2.1 Ultra - Model tekst-na-wideo ModelsLab z ulepszoną jakością",
        modelsLabWan25T2V:
          "Wan 2.5 T2V - Model tekst-na-wideo Wan 2.5 ModelsLab",
        modelsLabWan25I2V:
          "Wan 2.5 I2V - Model obraz-na-wideo Wan 2.5 ModelsLab",
        modelsLabWan27T2V:
          "Wan 2.7 T2V - Najnowszy model tekst-na-wideo Wan 2.7 od Alibaba z elastycznymi proporcjami i wyjściem 1080p",
        modelsLabWan26T2V:
          "Wan 2.6 T2V - Model tekst-na-wideo Wan 2.6 ModelsLab",
        modelsLabWan26I2V:
          "Wan 2.6 I2V - Model obraz-na-wideo Wan 2.6 ModelsLab",
        modelsLabWan26I2VFlash:
          "Wan 2.6 I2V Flash - Szybki model obraz-na-wideo Wan 2.6 ModelsLab",
        modelsLabSeedanceT2V: "Seedance T2V - Model tekst-na-wideo BytePlus",
        modelsLabSeedanceI2V: "Seedance I2V - Model obraz-na-wideo BytePlus",
        modelsLabOmnihuman:
          "Omnihuman - Model generowania wideo z ludźmi BytePlus",
        modelsLabSeedance1ProI2V:
          "Seedance 1.0 Pro I2V - Profesjonalny model obraz-na-wideo BytePlus",
        modelsLabSeedance1ProFastI2V:
          "Seedance 1.0 Pro Fast I2V - Szybki profesjonalny model obraz-na-wideo BytePlus",
        modelsLabSeedance1ProFastT2V:
          "Seedance 1.0 Pro Fast T2V - Szybki profesjonalny model tekst-na-wideo BytePlus",
        modelsLabOmnihuman15:
          "Omnihuman 1.5 - Ulepszony model generowania wideo z ludźmi BytePlus",
        modelsLabSeedance15Pro:
          "Seedance 1.5 Pro - Zaawansowany model generowania wideo BytePlus",
        modelsLabVeo2:
          "Veo 2 - Wysokiej jakości model generowania wideo Google via ModelsLab",
        modelsLabVeo3:
          "Veo 3 - Najnowszy model generowania wideo Google via ModelsLab",
        modelsLabVeo3Fast:
          "Veo 3 Fast - Szybki model generowania wideo Google via ModelsLab",
        modelsLabVeo3FastPreview:
          "Veo 3 Fast Preview - Szybki model generowania wideo preview Google via ModelsLab",
        modelsLabVeo31:
          "Veo 3.1 - Ulepszony model generowania wideo Veo 3 Google via ModelsLab",
        modelsLabVeo31Fast:
          "Veo 3.1 Fast - Szybki model generowania wideo Veo 3.1 Google via ModelsLab",
        modelsLabKlingV21I2V:
          "Kling V2.1 I2V - Model obraz-na-wideo Kling AI wersja 2.1",
        modelsLabKlingV25TurboI2V:
          "Kling V2.5 Turbo I2V - Turbo model obraz-na-wideo Kling AI wersja 2.5",
        modelsLabKlingV25TurboT2V:
          "Kling V2.5 Turbo T2V - Turbo model tekst-na-wideo Kling AI wersja 2.5",
        modelsLabKlingV2MasterT2V:
          "Kling V2 Master T2V - Model tekst-na-wideo najwyższej jakości Kling AI",
        modelsLabKlingV2MasterI2V:
          "Kling V2 Master I2V - Model obraz-na-wideo najwyższej jakości Kling AI",
        modelsLabKlingV21MasterT2V:
          "Kling V2.1 Master T2V - Model tekst-na-wideo najwyższej jakości Kling AI v2.1",
        modelsLabKlingV21MasterI2V:
          "Kling V2.1 Master I2V - Model obraz-na-wideo najwyższej jakości Kling AI v2.1",
        modelsLabKlingV16MultiI2V:
          "Kling V1.6 Multi I2V - Model multi-obraz-na-wideo Kling AI wersja 1.6",
        modelsLabKling30T2V:
          "Kling 3.0 T2V - Model tekst-na-wideo Kling AI wersja 3.0",
        modelsLabLtx2ProT2V:
          "LTX 2 PRO T2V - Profesjonalny model tekst-na-wideo LTX",
        modelsLabLtx2ProI2V:
          "LTX 2 PRO I2V - Profesjonalny model obraz-na-wideo LTX",
        modelsLabLtx23ProI2V:
          "LTX 2.3 Pro I2V - Ulepszony profesjonalny model obraz-na-wideo LTX",
        modelsLabHailuo23T2V:
          "Hailuo 2.3 T2V - Model tekst-na-wideo MiniMax wersja 2.3",
        modelsLabHailuo02T2V: "Hailuo 02 T2V - Model tekst-na-wideo MiniMax 02",
        modelsLabHailuo23I2V:
          "Hailuo 2.3 I2V - Model obraz-na-wideo MiniMax wersja 2.3",
        modelsLabHailuo23FastI2V:
          "Hailuo 2.3 Fast I2V - Szybki model obraz-na-wideo MiniMax wersja 2.3",
        modelsLabHailuo02I2V: "Hailuo 02 I2V - Model obraz-na-wideo MiniMax 02",
        modelsLabHailuo02StartEnd:
          "Hailuo 02 Start/End - Model generowania wideo z klatkami początkowymi/końcowymi MiniMax",
        modelsLabSora2:
          "Sora 2 - Model generowania wideo Sora 2 OpenAI via ModelsLab",
        modelsLabSora2Pro:
          "Sora 2 Pro - Model generowania wideo Sora 2 Pro OpenAI via ModelsLab",
        modelsLabGen4Aleph:
          "Gen4 Aleph - Model generowania wideo Gen4 Aleph Runway via ModelsLab",
        modelsLabLipsync2:
          "Lipsync 2 - Model synchronizacji ust Sync do generowania wideo",
        modelsLabGrokT2V:
          "Grok T2V - Model tekst-na-wideo Grok xAI via ModelsLab",
        modelsLabGrokI2V:
          "Grok I2V - Model obraz-na-wideo Grok xAI via ModelsLab",
        modelsLabGen4T2ITurbo:
          "Gen4 T2I Turbo - Szybki model tekst-na-obraz Runway via ModelsLab",
        modelsLabGen4Image:
          "Gen4 Image - Model tekst-na-obraz Runway Gen4 via ModelsLab",
        modelsLabWan27T2I:
          "Wan 2.7 T2I - Model tekst-na-obraz Alibaba Wan 2.7 via ModelsLab",
        modelsLabGrokT2I:
          "Grok Imagine T2I - Model tekst-na-obraz xAI Grok via ModelsLab",
        modelsLabZImageBase:
          "Z Image Base - Szybki i tani model tekst-na-obraz ModelsLab",
        modelsLabZImageTurbo:
          "Z Image Turbo - Ultraszybki model tekst-na-obraz ModelsLab",
        modelsLabFlux2MaxT2I:
          "Flux 2 Max T2I - Black Forest Labs Flux 2 Max tekst-na-obraz via ModelsLab",
        modelsLabFluxPro11Ultra:
          "Flux Pro 1.1 Ultra - Black Forest Labs Flux Pro Ultra via ModelsLab",
        modelsLabFluxPro11:
          "Flux Pro 1.1 - Black Forest Labs Flux Pro 1.1 tekst-na-obraz via ModelsLab",
        modelsLabFlux2ProT2I:
          "Flux 2 Pro T2I - Black Forest Labs Flux 2 Pro tekst-na-obraz via ModelsLab",
        modelsLabFlux2DevT2I:
          "Flux 2 Dev T2I - Black Forest Labs Flux 2 Dev tekst-na-obraz via ModelsLab",
        modelsLabFluxT2I:
          "Flux T2I - Black Forest Labs Flux tekst-na-obraz via ModelsLab",
        modelsLabSeedream45T2I:
          "Seedream 4.5 T2I - ByteDance Seedream 4.5 tekst-na-obraz via ModelsLab",
        modelsLabSeedream40T2I:
          "Seedream 4.0 T2I - ByteDance Seedream 4.0 tekst-na-obraz via ModelsLab",
        modelsLabSeedreamT2I:
          "Seedream T2I - ByteDance Seedream tekst-na-obraz via ModelsLab",
        modelsLabImagen4Ultra:
          "Imagen 4 Ultra - Najwyższa jakość generowania obrazów Google via ModelsLab",
        modelsLabImagen4:
          "Imagen 4 - Google Imagen 4 tekst-na-obraz via ModelsLab",
        modelsLabImagen4Fast:
          "Imagen 4 Fast - Szybki Google Imagen 4 tekst-na-obraz via ModelsLab",
        modelsLabImagen3:
          "Imagen 3 - Google Imagen 3 tekst-na-obraz via ModelsLab",
        modelsLabNanoBananaPro:
          "Nano Banana Pro - Wysokiej jakości generowanie obrazów via ModelsLab",
        modelsLabNanoBanana: "Nano Banana - Generowanie obrazów via ModelsLab",
        modelsLabQwenT2I:
          "Qwen T2I - Alibaba Qwen tekst-na-obraz via ModelsLab",
        modelsLabRealtimeT2I:
          "Realtime T2I - Ultraszybki model tekst-na-obraz ModelsLab w czasie rzeczywistym",
      },
    },
    modelUtilities: {
      adultExplicit: "Treści dla dorosłych/Jednoznaczne",
      adultImplied: "Treści dla dorosłych/Sugerowane",
      analysis: "Analiza",
      chat: "Czat",
      coding: "Programowanie",
      conspiracy: "Teorie spiskowe",
      controversial: "Kontrowersyjne tematy",
      creative: "Twórcze pisanie",
      fast: "Szybki",
      harmful: "Potencjalnie szkodliwe treści",
      illegalInfo: "Nielegalne informacje",
      imageGen: "Generowanie obrazów",
      legacy: "Przestarzały",
      medicalAdvice: "Porady medyczne",
      offensiveLanguage: "Obraźliwy język",
      politicalLeft: "Lewicowe poglądy polityczne",
      politicalRight: "Prawicowe poglądy polityczne",
      reasoning: "Zaawansowane rozumowanie",
      roleplay: "Odgrywanie ról",
      roleplayDark: "Mroczne odgrywanie ról",
      smart: "Inteligentny",
      uncensored: "Niecenzurowany",
      violence: "Przemoc",
      vision: "Przetwarzanie obrazu",
    },
    input: {
      attachments: {
        uploadFile: "Załącz pliki",
        attachedFiles: "Załączone pliki",
        addMore: "Dodaj więcej",
      },
    },
  },

  search: {
    brave: {
      category: "Informacja",
      get: {
        title: "Wyszukaj w sieci",
        dynamicTitle: "Search: {{query}}",
        description:
          "Przeszukuj internet w poszukiwaniu aktualnych informacji, wiadomości, faktów lub ostatnich wydarzeń. Użyj tego, gdy potrzebujesz aktualnych informacji lub chcesz zweryfikować fakty.",
        form: {
          title: "Parametry wyszukiwania",
          description: "Skonfiguruj zapytanie wyszukiwania w sieci",
        },
        submitButton: {
          label: "Szukaj",
          loadingText: "Wyszukiwanie...",
        },
        backButton: {
          label: "Wstecz",
        },
        fields: {
          query: {
            title: "Zapytanie wyszukiwania",
            description:
              "Jasne i konkretne zapytanie wyszukiwania. Używaj słów kluczowych zamiast pytań.",
            placeholder: "Wprowadź zapytanie wyszukiwania...",
          },
          maxResults: {
            title: "Maks. wyniki",
            description: "Liczba wyników do zwrócenia (1-10)",
          },
          includeNews: {
            title: "Uwzględnij wiadomości",
            description: "Uwzględnij wyniki wiadomości dla bieżących wydarzeń",
          },
          freshness: {
            title: "Świeżość",
            description: "Filtruj wyniki według tego, jak są aktualne",
            options: {
              day: "Ostatni dzień",
              week: "Ostatni tydzień",
              month: "Ostatni miesiąc",
              year: "Ostatni rok",
            },
          },
        },
        response: {
          success: {
            title: "Sukces",
            description: "Czy wyszukiwanie zakończyło się sukcesem",
          },
          message: {
            title: "Wiadomość",
            description: "Komunikat o statusie wyszukiwania",
          },
          query: {
            title: "Zapytanie",
            description: "Zapytanie wyszukiwania, które zostało wykonane",
          },
          results: {
            title: "Wyniki",
            description: "Tablica wyników wyszukiwania",
            result: "Wynik",
            item: {
              title: "Wynik wyszukiwania",
              description: "Pojedynczy wynik wyszukiwania",
              url: "URL",
              snippet: "Fragment",
              age: "Wiek",
              source: "Źródło",
            },
          },
          cached: {
            title: "W pamięci podręcznej",
            description: "Czy wyniki zostały pobrane z pamięci podręcznej",
          },
          timestamp: {
            title: "Znacznik czasu",
            description: "Kiedy wykonano wyszukiwanie",
          },
        },
        errors: {
          queryEmpty: {
            title: "Zapytanie wyszukiwania jest wymagane",
            description: "Proszę podać zapytanie wyszukiwania",
          },
          queryTooLong: {
            title: "Zapytanie wyszukiwania jest zbyt długie",
            description: "Zapytanie może mieć maksymalnie 400 znaków",
          },
          timeout: {
            title: "Upłynął limit czasu wyszukiwania",
            description: "Wyszukiwanie trwało zbyt długo",
          },
          searchFailed: {
            title: "Wyszukiwanie nie powiodło się",
            description: "Wystąpił błąd podczas wyszukiwania",
          },
          validation: {
            title: "Nieprawidłowe wyszukiwanie",
            description: "Sprawdź parametry wyszukiwania i spróbuj ponownie",
          },
          internal: {
            title: "Coś poszło nie tak",
            description: "Nie mogliśmy ukończyć wyszukiwania. Spróbuj ponownie",
          },
          notConfigured: {
            title:
              "Klucz API {{label}} nie jest skonfigurowany. Dodaj {{envKey}}=<twój-klucz> do pliku .env. Pobierz klucz na {{url}}",
            description:
              "Skonfiguruj {{label}}, aby włączyć wyszukiwanie w sieci",
          },
        },
        success: {
          title: "Wyszukiwanie zakończone sukcesem",
          description: "Wyszukiwanie w sieci zakończyło się pomyślnie",
        },
      },
      tags: {
        search: "Wyszukiwanie",
        web: "Sieć",
        internet: "Internet",
      },
    },
    kagi: {
      category: "Informacja",
      get: {
        title: "Wyszukaj z Kagi",
        dynamicTitle: "Kagi: {{query}}",
        description:
          "Przeszukuj internet lub uzyskaj odpowiedzi generowane przez AI za pomocą Kagi. Tryb FastGPT zapewnia kompleksowe odpowiedzi ze źródłami, podczas gdy tryb wyszukiwania zwraca bezpośrednie wyniki.",
        form: {
          title: "Parametry wyszukiwania",
          description: "Skonfiguruj zapytanie wyszukiwania Kagi",
        },
        submitButton: {
          label: "Szukaj",
          loadingText: "Wyszukiwanie...",
        },
        backButton: {
          label: "Wstecz",
        },
        fields: {
          query: {
            title: "Zapytanie wyszukiwania",
            description:
              "Jasne i konkretne zapytanie wyszukiwania lub pytanie.",
            placeholder: "Wprowadź zapytanie wyszukiwania...",
          },
          mode: {
            title: "Tryb wyszukiwania",
            description:
              "Wybierz między odpowiedziami generowanymi przez AI (FastGPT) a bezpośrednimi wynikami wyszukiwania",
            options: {
              fastgpt: "FastGPT (Odpowiedzi generowane przez AI)",
              search: "Wyszukiwanie (Bezpośrednie wyniki)",
            },
          },
        },
        response: {
          success: {
            title: "Sukces",
            description: "Czy wyszukiwanie zakończyło się sukcesem",
          },
          message: {
            title: "Wiadomość",
            description: "Komunikat o statusie wyszukiwania",
          },
          output: {
            title: "Odpowiedź",
            description: "Odpowiedź wygenerowana przez AI z FastGPT",
          },
          query: {
            title: "Zapytanie",
            description: "Zapytanie wyszukiwania, które zostało wykonane",
          },
          references: {
            title: "Referencje",
            description: "Referencje źródłowe i cytaty",
            reference: "Referencja",
            item: {
              title: "Referencja",
              description: "Referencja źródłowa z cytatem",
              url: "URL",
              snippet: "Fragment",
            },
          },
          cached: {
            title: "W pamięci podręcznej",
            description: "Czy wyniki zostały pobrane z pamięci podręcznej",
          },
          timestamp: {
            title: "Znacznik czasu",
            description: "Kiedy wykonano wyszukiwanie",
          },
        },
        errors: {
          queryEmpty: {
            title: "Zapytanie wyszukiwania jest wymagane",
            description: "Proszę podać zapytanie wyszukiwania",
          },
          queryTooLong: {
            title: "Zapytanie wyszukiwania jest zbyt długie",
            description: "Zapytanie może mieć maksymalnie 400 znaków",
          },
          timeout: {
            title: "Upłynął limit czasu wyszukiwania",
            description: "Wyszukiwanie trwało zbyt długo",
          },
          searchFailed: {
            title: "Wyszukiwanie nie powiodło się",
            description: "Wystąpił błąd podczas wyszukiwania",
          },
          validation: {
            title: "Nieprawidłowe wyszukiwanie",
            description: "Sprawdź parametry wyszukiwania i spróbuj ponownie",
          },
          internal: {
            title: "Coś poszło nie tak",
            description: "Nie mogliśmy ukończyć wyszukiwania. Spróbuj ponownie",
          },
          notConfigured: {
            title:
              "Klucz API {{label}} nie jest skonfigurowany. Dodaj {{envKey}}=<twój-klucz> do pliku .env. Pobierz klucz na {{url}}",
            description: "Skonfiguruj {{label}}, aby włączyć wyszukiwanie Kagi",
          },
        },
        success: {
          title: "Wyszukiwanie zakończone sukcesem",
          description: "Wyszukiwanie Kagi zakończyło się pomyślnie",
        },
      },
      tags: {
        search: "Wyszukiwanie",
        web: "Sieć",
        ai: "AI",
      },
    },
    enums: {
      provider: {
        BRAVE: "Brave Search",
        KAGI: "Kagi FastGPT",
      },
    },
  },
  speechToText: {
    category: "Agent",

    hotkey: {
      post: {
        title: "Hotkey mowy na tekst",
        titleShort: "Skrót STT",
        description:
          "Nagrywaj i transkrybuj audio z automatycznym wstawianiem tekstu",
        form: {
          title: "Konfiguracja hotkey",
          description: "Skonfiguruj ustawienia hotkey mowy na tekst",
        },
        action: {
          label: "Akcja",
          description: "Akcja do wykonania (start/stop/toggle)",
          options: {
            start: "Start",
            stop: "Stop",
            toggle: "Przełącz",
            status: "Status",
          },
        },
        provider: {
          label: "Dostawca",
          description: "Dostawca AI do transkrypcji",
        },
        language: {
          label: "Język",
          description: "Język audio",
        },
        insertPrefix: {
          label: "Wstaw prefiks",
          description: "Tekst do wstawienia przed transkrypcją",
          placeholder: "np. '> '",
        },
        insertSuffix: {
          label: "Wstaw sufiks",
          description: "Tekst do wstawienia po transkrypcji",
          placeholder: "np. ' '",
        },
        response: {
          title: "Wynik",
          description: "Wynik nagrywania i transkrypcji",
          success: "Sukces",
          status: "Status",
          message: "Wiadomość",
          text: "Transkrybowany tekst",
          recordingDuration: "Czas nagrywania (ms)",
        },
        errors: {
          unauthorized: {
            title: "Nieautoryzowany",
            description: "Musisz być zalogowany, aby korzystać z tej funkcji",
          },
          validation: {
            title: "Błąd walidacji",
            description: "Nieprawidłowe parametry żądania",
          },
          server: {
            title: "Błąd serwera",
            description: "Nie udało się przetworzyć nagrania",
          },
          conflict: {
            title: "Konflikt",
            description: "Nagrywanie już w toku",
          },
          forbidden: {
            title: "Zabronione",
            description: "Nie masz uprawnień do korzystania z tej funkcji",
          },
          network: {
            title: "Błąd sieci",
            description: "Nie udało się połączyć z usługą transkrypcji",
          },
          notFound: {
            title: "Nie znaleziono",
            description: "Sesja nie znaleziona",
          },
          unsaved: {
            title: "Niezapisane zmiany",
            description: "Nagrywanie w toku",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieoczekiwany błąd",
          },
          dependenciesMissing:
            "Wymagane zależności niedostępne: {missing}. {recommendations}",
          invalidAction: "Nieprawidłowa akcja: {action}",
          actionFailed: "Nie udało się wykonać akcji: {error}",
          alreadyRecording: "Nagrywanie już w toku",
          notRecording: "Brak nagrywania w toku",
        },
        success: {
          title: "Sukces",
          description: "Operacja zakończona pomyślnie",
        },
      },
      tags: {
        ai: "AI",
        transcription: "Transkrypcja",
        speech: "Mowa",
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
        idle: "Bezczynny",
        recording: "Nagrywanie",
        processing: "Przetwarzanie",
        completed: "Zakończono",
        error: "Błąd",
      },
      actions: {
        start: "Rozpocznij nagrywanie",
        stop: "Zatrzymaj nagrywanie",
        toggle: "Przełącz nagrywanie",
        status: "Sprawdź status",
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
      title: "Mowa na tekst",
      description:
        "Konwertuj audio na tekst za pomocą transkrypcji AI (0,013 kredytów na sekundę, 0,78 kredytów na minutę)",
      form: {
        title: "Transkrypcja audio",
        description:
          "Prześlij plik audio do transkrypcji (0,013 kredytów na sekundę, 0,78 kredytów na minutę)",
      },
      fileUpload: {
        title: "Przesyłanie pliku audio",
        description: "Prześlij plik audio do transkrypcji",
      },
      audio: {
        label: "Plik audio",
        description: "Plik audio do transkrypcji (MP3, WAV, WebM itp.)",
        validation: {
          maxSize: "Rozmiar pliku musi być mniejszy niż 25 MB",
          audioOnly: "Proszę przesłać plik audio lub wideo",
        },
      },
      provider: {
        label: "Dostawca",
        description: "Dostawca AI do transkrypcji",
      },
      language: {
        label: "Język",
        description: "Język pliku audio",
      },
      response: {
        title: "Wynik transkrypcji",
        description: "Transkrybowany tekst z Twojego audio",
        success: "Sukces",
        text: "Transkrybowany tekst",
        provider: "Użyty dostawca",
        confidence: "Wynik pewności",
      },
      errors: {
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Musisz być zalogowany, aby korzystać z tej funkcji",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Plik audio lub parametry są nieprawidłowe",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się przetworzyć transkrypcji",
        },
        apiKeyMissing: "Klucz API Eden AI nie jest skonfigurowany",
        transcriptionFailed: "Transkrypcja nie powiodła się: {{error}}",
        audioTooShort:
          "Nagranie zbyt krótkie. Przytrzymaj przycisk dłużej i mów wyraźnie.",
        noAudioFile: "Nie podano pliku audio",
        internalError: "Wewnętrzny błąd serwera",
        noPublicId: "Nie otrzymano publicznego ID",
        pollFailed: "Nie udało się pobrać wyników transkrypcji",
        failed: "Transkrypcja nie powiodła się",
        timeout: "Przekroczono limit czasu transkrypcji",
        creditsFailed: "Nie udało się potrącić kredytów: {{error}}",
        providerError:
          "Błąd usługi transkrypcji. Spróbuj ponownie lub skontaktuj się z pomocą techniczną, jeśli problem będzie się powtarzał.",
        balanceCheckFailed:
          "Nie można sprawdzić salda kredytów. Spróbuj ponownie",
        insufficientCredits:
          "Nie masz wystarczającej liczby kredytów na tę transkrypcję. Dodaj więcej kredytów, aby kontynuować",
      },
      success: {
        title: "Sukces",
        description: "Audio transkrybowane pomyślnie",
        transcriptionComplete: "Transkrypcja zakończona pomyślnie",
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
      en: "Angielski",
      de: "Niemiecki",
      pl: "Polski",
      es: "Hiszpański",
      fr: "Francuski",
      it: "Włoski",
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
      speech: "Mowa",
      tts: "Tekst na mowę",
      ai: "AI",
    },

    post: {
      title: "Tekst na mowę",
      description:
        "Konwertuj tekst na naturalnie brzmiącą mowę za pomocą AI (~0,00052 kredytów na znak)",
      form: {
        title: "Konwersja tekstu na mowę",
        description:
          "Wprowadź tekst do przekształcenia na mowę (OpenAI TTS: ~0,00052 kredytów na znak)",
      },
      text: {
        label: "Tekst",
        description: "Tekst do przekształcenia na mowę",
        placeholder: "Wprowadź tekst, który chcesz przekształcić na mowę...",
      },
      voice: {
        label: "Głos",
        description: "Model głosu do syntezy mowy",
      },
      response: {
        title: "Wynik audio",
        description: "Wygenerowane audio mowy",
        success: "Sukces",
        audioUrl: "URL audio",
      },
      errors: {
        validation_failed: {
          title: "Błąd walidacji",
          description: "Podany tekst lub parametry są nieprawidłowe",
        },
        network_error: {
          title: "Błąd sieci",
          description: "Nie udało się połączyć z serwerem",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Musisz być zalogowany, aby korzystać z tekstu na mowę",
        },
        forbidden: {
          title: "Zabronione",
          description: "Nie masz uprawnień do korzystania z tekstu na mowę",
        },
        not_found: {
          title: "Nie znaleziono",
          description: "Żądany zasób nie został znaleziony",
        },
        server_error: {
          title: "Błąd serwera",
          description: "Wystąpił błąd podczas konwersji tekstu na mowę",
        },
        unknown_error: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        unsaved_changes: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
        conflict: {
          title: "Konflikt",
          description: "Wystąpił konflikt",
        },
        notConfigured:
          "Klucz API {{label}} nie jest skonfigurowany. Dodaj {{envKey}}=<twój-klucz> do pliku .env. Pobierz klucz na {{url}}",
        conversionFailed: "Synteza mowy nie powiodła się: {{error}}",
        noText: "Nie podano tekstu",
        noAudioUrl: "Nie otrzymano URL audio od dostawcy",
        providerError: "Błąd dostawcy: {{error}}",
        internalError: "Wewnętrzny błąd serwera",
        unsupportedProvider:
          "Nieobsługiwany dostawca TTS dla głosu: {{voiceId}}",
        creditsFailed: "Nie udało się odjąć kredytów: {{error}}",
        audioFetchFailed: "Nie można utworzyć pliku audio. Spróbuj ponownie",
        balanceCheckFailed:
          "Nie można sprawdzić salda kredytów. Spróbuj ponownie",
        insufficientCredits:
          "Nie masz wystarczającej liczby kredytów na tę konwersję. Dodaj więcej kredytów, aby kontynuować",
      },
      success: {
        title: "Sukces",
        description: "Tekst pomyślnie przekształcony na mowę",
        conversionComplete: "Synteza mowy zakończona pomyślnie",
      },
    },
    languages: {
      en: "Angielski",
      de: "Niemiecki",
      pl: "Polski",
      es: "Hiszpański",
      fr: "Francuski",
      it: "Włoski",
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
