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
          "Wymagany model lub charakter - podaj bezpośrednio lub podaj favoriteId z rozwiązywalnym wyborem modelu",
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
              "UUID zapisanego ulubionego do załadowania modelu i skilla.",
          },
          modelId: {
            title: "ID modelu",
            description: "Model AI dla wznowionego kroku.",
          },
          skillId: {
            title: "ID skilla",
            description: "Skill/persona dla wznowionego kroku.",
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
      characters: "Skille",
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
            "Otrzymuj {{credits}} kredytów/miesiąc z subskrypcją za jedyne {{price}}/miesiąc. Darmowe konta dostają {{freeCredits}} kredytów/miesiąc, z newsletterem {{freeCreditsMax}}.",
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
      switchSkill: "Zmień skill",
      editSkill: "Edytuj skill",
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
      characterSetup: "Konfiguracja skilla",
      noResults: "Brak wyników",
      add: "Dodaj do ulubionych",
      added: "Dodano",
      addNew: "Dodaj nowy",
      searchSkills: "Szukaj person...",
      createCustom: "Utwórz własną",
      customizeSettings: "Dostosuj ustawienia",
      requirements: {
        characterConflict: "Konflikty wymagań skilla",
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
        placeholder: "Wybierz skill",
        addNewLabel: "Utwórz własny skill",
        grouping: {
          bySource: "Według źródła",
          byCategory: "Według kategorii",
          sourceLabels: {
            builtIn: "Wbudowane",
            my: "Moje skille",
            community: "Społeczność",
          },
          sourceIcons: {
            builtIn: "sparkles",
            my: "user",
            community: "people",
          },
        },
        addDialog: {
          title: "Utwórz własny skill",
          fields: {
            name: {
              label: "Nazwa",
              placeholder: "Wprowadź nazwę skilla",
            },
            icon: {
              label: "Ikona (emoji)",
              placeholder: "😊",
            },
            description: {
              label: "Opis",
              placeholder: "Krótki opis skilla",
            },
            systemPrompt: {
              label: "Prompt systemowy",
              placeholder: "Zdefiniuj, jak zachowuje się skill...",
            },
            category: {
              label: "Kategoria",
            },
          },
          createCategory: "Utwórz kategorię",
          cancel: "Anuluj",
          create: "Utwórz skill",
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
          "Model od Uncensored.ai i jedyny w katalogu zbudowany bez cenzury od początku, a nie odblokowany po fakcie. Wybór do mrocznego roleplayu i fikcji tabu, pytań politycznych i kontrowersyjnych oraz poglądów spoza mainstreamu: bez łagodzenia scen, bez moralizowania, bez zawracania do linii konsensusu. Wywołuje narzędzia, 32K kontekstu, tylko tekst. Eksperymentalny, nie do kodu, a sporne twierdzenia podaje tak pewnie jak ustalone, więc sprawdzaj fakty.",
        freedomgptLiberty:
          "Flagowy model bez cenzury od Age of AI, czatbot wolności słowa, od którego zaczęła się cała kategoria. Zbudowany na otwartych wagach, nastawiony na dosadne odpowiedzi bez moralizowania. Szybki i błyskotliwy, 32K kontekstu. Słabszy w narzędziach, kodzie i głębokiej analizie: tam mocniejszy jest Qwen 3.6 Plus Uncensored. Po nieortodoksyjny pogląd z pełnym uzasadnieniem sięgnij po UncensoredLM.",
        gabAiArya:
          "Asystent Gab bez cenzury, przez samego twórcę umieszczony po prawej stronie sceny politycznej i zbudowany tak, by odpowiadać bez zwykłych barierek. Bystry, 131K kontekstu, czyta obrazy i wideo, wywołuje narzędzia. Wybierz go, gdy świadomie chcesz tego nachylenia; po inne poglądy bez linii firmy sięgnij po UncensoredLM, zbudowany bez cenzury. Słabszy w kodowaniu, a model bazowy nie został ujawniony.",
        gemini31ProPreviewCustomTools:
          "Wersja preview Gemini 3.1 Pro z dopiskiem custom tools, dostrojona tak, by wywoływała zdefiniowane przez ciebie narzędzia zamiast uciekać do basha. Stworzona dla agentów kodujących i przepływów z wieloma narzędziami, 1M kontekstu, przyjmuje tekst, obraz, wideo i audio. To wciąż preview. Gemini 4 Argon to nowsza klasa Pro w podobnej cenie.",
        gemini31FlashImagePreview:
          "Gemini 3.1 Flash Image od Google, wciąż w wersji preview. Generuje i edytuje obrazy prosto w czacie, tekst i grafika w jednej odpowiedzi. Najtańszy model obrazowy w katalogu. Filtry mainstreamowe, bez wywołań narzędzi, 64K kontekstu. Przy złożonych promptach i czytelniejszym tekście na obrazach Nano Banana Pro kosztuje więcej, ale daje więcej. Legacy: zastępuje go Nano Banana 2.1, za mniej więcej połowę ceny obrazu.",
        gemini31FlashLitePreview:
          "Budżetowy model Google do dużych wolumenów, wciąż w wersji preview: tłumaczenia, ranking, ekstrakcja i szybki czat w kontekście 1M, przyjmuje tekst, obraz, wideo i audio. Tani i szybki, ale nie do trudnego rozumowania. Nadal kosztuje mniej niż następca, Gemini 3.5 Flash Lite.",
        gemini3Pro:
          "Google Gemini 3 Pro - Zaawansowany multimodalny model AI z dużym oknem kontekstowym i potężnymi możliwościami rozumowania",
        gemini35Flash:
          "Model Flash od Google reklamowany jako bliski poziomowi Pro w kodowaniu i rozumowaniu. Regulowane poziomy myślenia, 1M kontekstu, przyjmuje tekst, obraz, wideo i audio. Solidny, ale Gemini 3.8 Flash jest nowszy i kosztuje mniej więcej połowę, więc warto zmienić.",
        gemini3Flash:
          "Pierwszy Gemini 3 Flash od Google: szybki, radzi sobie z kodem i codziennym rozumowaniem, 1M kontekstu, przyjmuje tekst, obraz, wideo i audio. Wciąż opłacalny i tańszy niż następca. Kto chce najnowszego Flasha, wybiera Gemini 3.8 Flash.",
        deepseekV32:
          "Model open-weight od DeepSeek z końca 2025 z rzadką uwagą (sparse attention), która obniża koszt pracy z długim kontekstem. Mieszanka ekspertów z 671B parametrów, dobra w kodzie i analizie za bardzo małe pieniądze, tylko tekst. DeepSeek V4.1 Flash jest nowszy i jeszcze tańszy.",
        deepseekV4Pro:
          "Flagowiec DeepSeek o otwartych wagach: mixture-of-experts z 1.6T parametrów, z czego 49B aktywnych, licencja MIT. Głębokie rozumowanie, poważny kod, analiza całych repozytoriów i wieloetapowa praca agentowa, 1M kontekstu, wywołuje narzędzia. Tylko tekst. Ułamek ceny Claude Opus 5.5. Do taniej i szybkiej pracy na co dzień jest DeepSeek V4.1 Flash.",
        deepseekV4Flash:
          "Model Flash od DeepSeek, mieszanka ekspertów z 284B parametrów: 1M kontekstu, szybki, mocny w kodzie, prawie darmowy za wiadomość. Tylko tekst. Następca, DeepSeek V4.1 Flash, kosztuje tyle samo, więc lepiej się przesiąść, chyba że potrzebujesz dokładnie tej wersji.",
        gpt55:
          "Dawny topowy model OpenAI: mocne rozumowanie, kodowanie i analiza w kontekście 1M, przyjmuje tekst i obrazy. Wciąż sprawny, ale drogi. GPT-6.1 Sol robi dziś to samo znacznie taniej. Słaby w roleplayu.",
        gpt55Pro:
          "Wersja Pro modelu GPT-5.5 z wydłużonym rozumowaniem, która zużywa znacznie więcej mocy na trudne problemy o wysoką stawkę. Jeden z najdroższych modeli w katalogu, opłaca się tylko wtedy, gdy błędna odpowiedź kosztuje więcej niż wiadomość. Nowszy wybór to GPT-6 Astra, za mniej więcej jedną trzecią ceny.",
        gpt54Pro:
          "Wersja Pro modelu GPT-5.4 z maksymalną mocą obliczeniową do trudnego rozumowania, researchu i krytycznych analiz w kontekście 1M. Powolna i jedna z najdroższych tutaj. GPT-6 Astra robi to samo za mniej więcej jedną trzecią ceny.",
        gpt54:
          "Model OpenAI, który wniósł kodowanie na poziomie Codex do głównej linii GPT. 1M kontekstu i obsługa obrazów. Solidny przy długich dokumentach, kodzie i analizie. GPT-6.1 Sol jest nowszy, oceniany o poziom wyżej i tańszy za wiadomość, więc warto się przesiąść.",
        gpt53Codex:
          "Specjalista OpenAI od agentowego kodowania: długie sesje programistyczne z narzędziami, refaktoryzacja i debugowanie, 400K kontekstu. Mocny w kodzie, słaby w pisaniu twórczym i roleplayu. GPT-6.1 Sol koduje dziś w podobnej cenie i umie więcej.",
        gpt53Chat:
          "GPT-5.3 Chat - Zaktualizowany model konwersacyjny ChatGPT z dokładniejszymi odpowiedziami i znacznie mniejszą liczbą zbędnych odmów",
        gpt52Pro:
          "GPT-5.2 z wydłużonym rozumowaniem na najtrudniejsze problemy: głęboki research, podchwytliwa matematyka, staranny code review. Wolny i bardzo drogi. GPT-6 Astra to obecna klasa Pro i kosztuje znacznie mniej niż połowę.",
        gpt52:
          "Koń roboczy OpenAI z końca 2025 roku do zadań zawodowych: kod, długie dokumenty i uporządkowana analiza, 400K kontekstu, obrazy na wejściu. Niezawodny, ale to już nie najlepszy stosunek ceny do jakości. GPT-6.1 Sol kosztuje mniej więcej tyle samo i jest nowszy.",
        gpt52_chat:
          "Szybka, czatowa wersja GPT-5.2 w stylu ChatGPT: odpowiada od razu, bez długiego myślenia, 128K kontekstu. Dobra do codziennych rozmów i szkiców. Mniejszy kontekst niż u rodzeństwa, a GPT-6.1 Terra robi to dziś za mniej więcej połowę ceny.",
        dolphin3_0_r1_mistral_24b:
          "Dolphin 3.0 R1 Mistral 24B - Niecenzurowany duży model językowy oparty na Mistral",
        dolphinLlama3_70B:
          "Dolphin Llama 3 70B - Niecenzurowany duży model językowy oparty na Llama 3",
        veniceUncensored:
          "Własny model Venice bez cenzury, czyli Dolphin Mistral 24B w edycji Venice. Jeden z najniższych wskaźników odmów na rynku: fikcja, swobodne rozmowy bez filtra. Czyta obrazy, 128K kontekstu, tani. To dostrojenie znoszące cenzurę, więc w polityce i najmroczniejszych scenach nadal widać spojrzenie Mistrala; do mrocznego roleplayu, polityki i innych poglądów lepszy jest UncensoredLM, zbudowany bez cenzury. Słaby w kodzie i cięższej analizie. Do tego weź Qwen 3.6 Plus Uncensored.",
        veniceUncensoredRoleplay:
          "Model Venice 24B dostrojony do roleplayu, z odmowami usuniętymi w treningu. Postacie trzymają swój głos przez długie kampanie, bez moralnych przerw w połowie historii. Czyta obrazy, 128K kontekstu. Odmowy usunięte, nie zbudowany bez cenzury: w najmroczniejszym materiale i tematach tabu dalej idzie UncensoredLM, ten wygrywa długimi kampaniami i obrazami. To narrator, nie asystent, więc do analizy i kodu się nie nadaje.",
        gemma4Uncensored:
          "Gemma 4 26B od Google w architekturze mixture-of-experts, z usuniętym filtrem, dostarczana przez Venice. Szybka, tania, czyta obrazy, wywołuje narzędzia, 256K kontekstu. Odmowy zniknęły, trening Google został, więc gorące tematy ujmuje nadal jak model bazowy. Do trudniejszego rozumowania bez odmów weź GLM 5.3 Flash Uncensored: trochę droższy, ale sięga dalej.",
        qwen36PlusUncensored:
          "Model rozumujący Qwen 3.6 Plus od Alibaby bez odmów, dostarczany przez Venice. Jeden z najmocniejszych programistów i analityków wśród modeli bez cenzury. Czyta obrazy, wywołuje narzędzia, 256K kontekstu. Już nie odmawia, ale trening Qwena wciąż kształtuje jego spojrzenie na politykę; do polityki, mrocznego roleplayu i innych poglądów jest UncensoredLM, zbudowany bez cenzury. Droższy od modeli flash. Drugi ciężki zawodnik to GLM 5.3 Uncensored: 1M kontekstu, ale tylko tekst.",
        glm47FlashHeretic:
          "Zabliterowany GLM 4.7 Flash: odmowy usunięte, więc odpowiada zamiast prawić kazania. Grosze za wiadomość, szybki, obsługuje narzędzia, dobry do niefiltrowanych rozmów i pisania twórczego. Trening bazowego GLM nadal kształtuje jego poglądy. Słaby w głębokiej analizie. GLM 5.3 Flash Uncensored to nowszy i bystrzejszy wybór bez cenzury, trochę droższy.",
        glm53Abliterated:
          "Pełny GLM 5.3, któremu Abliteration.ai wycięło odmowy prosto z wag. Czołowe rozumowanie, narzędzia, kontekst 1M. Najcięższy kaliber. Odmów brak, ale trening i spojrzenie bazowego GLM zostają.",
        deepseekV41FlashAbliterated:
          "DeepSeek V4.1 Flash bez odmów od Abliteration.ai. MoE 552B, mocne rozumowanie, rozumie obrazy, używa narzędzi. Kontekst 1M. Przestaje mówić nie, ale spojrzenie DeepSeeka zostaje.",
        mimoV26FlashAbliterated:
          "MiMo V2.6 Flash od Xiaomi z wyciętym kierunkiem odmów (abliteracja). Szybki, czyta obrazy, wywołuje narzędzia, 1M kontekstu. Dobry do dużych ilości pracy bez filtra, ale głębię oddaje za szybkość, a spojrzenie modelu bazowego zostaje. Kosztuje ponad dwa razy więcej niż GLM 5.3 Flash Uncensored, który robi podobne rzeczy.",
        glm53Uncensored:
          "Pełny model rozumujący GLM 5.3 od Z.AI z usuniętymi odmowami. Najcięższy zawodnik wśród modeli bez cenzury: kod, długie teksty, analiza i narzędzia, 1M kontekstu. Bez ograniczeń nie znaczy neutralnie: w polityce nadal potrafi się asekurować jak bazowy GLM, więc do polityki, mrocznego roleplayu i innych poglądów weź UncensoredLM. Tylko tekst, wolniejszy od modeli flash i wciąż eksperymentalny. Na co dzień taniej i szybciej wyjdzie GLM 5.3 Flash Uncensored.",
        glm53FlashUncensored:
          "GLM 5.3 Flash od Z.AI z usuniętymi odmowami: mixture-of-experts z 320B parametrów. Szybki, tani, czyta obrazy, wywołuje narzędzia, 1M kontekstu. Model na co dzień do pracy bez filtra, w polityce ze spojrzeniem bazowego GLM. Do najtrudniejszego rozumowania przesiądź się na pełny GLM 5.3 Uncensored.",
        veniceLustifyV8:
          "Checkpoint SDXL dostrojony do fotorealistycznych treści dla dorosłych, udostępniany przez Venice.ai. Bez cenzury: bez rozmycia, bez odmów. Jeden z najtańszych modeli obrazów w ofercie. Stworzony do ciał i skóry, nie do tekstu na obrazie, złożonych scen czy stylów artystycznych; Chroma ma szerszy zakres artystyczny.",
        veniceChroma:
          "Model z otwartymi wagami zbudowany na FLUX.1 schnell i dotrenowany bez filtrowania treści, udostępniany przez Venice.ai. Radzi sobie z długimi promptami i szeroką gamą stylów, także z treściami dosadnymi. Tani na obraz. W fotorealistycznej nagości mniej wyspecjalizowany niż Lustify v8, a na wejściu przyjmuje tylko tekst, więc do przeróbki gotowego obrazu użyj Qwen Edit Uncensored.",
        veniceQwenEdit:
          "Edycja obrazów bez cenzury oparta na modelu edycyjnym Qwen od Alibaby, udostępniana przez Venice.ai. Wrzuć obraz referencyjny i polecenie: podmień elementy, zmień styl, przebierz postać, przebuduj scenę. Bez rozmycia, bez odmów. Droższa niż Chroma czy Lustify v8, które generują tylko z tekstu.",
        veniceFireredImageEdit:
          "Edytor obrazów sterowany promptem, udostępniany przez Venice.ai. Opisz zmianę, a on wprowadzi dokładnie ją i nie ruszy reszty obrazu. Poziom uncensored bez odmów, choć w przeciwieństwie do Qwen Edit Uncensored nie jest oznaczony do treści dosadnych. Ta sama cena co Qwen Edit; przy trudnych edycjach sprawdź oba.",
        claudeOpus45:
          "Opus od Anthropic z listopada 2025, w swoim czasie jeden z najlepszych modeli do kodu i agentów i pierwszy Opus z wyraźnie obniżoną ceną. Świetny w starannym pisaniu i złożonym kodzie, 200K kontekstu. Ostrożny przy kontrowersyjnych tematach. Claude Opus 5.5 jest nowszy i tańszy.",
        claudeOpus46:
          "Opus od Anthropic z lutego 2026, pierwszy Opus z oknem kontekstu 1M. Mocny w długim kodowaniu agentowym, głębokiej analizie i starannym pisaniu. Cena premium, filtry mainstreamowe, ostrożny przy kontrowersyjnych tematach. Claude Opus 5.5 jest nowszy i tańszy.",
        claudeOpus47:
          "Wydanie Opusa z 2026 roku, pomiędzy 4.6 a 4.8: głębokie rozumowanie, złożony kod i długie teksty w kontekście 1M. Drogi i ostrożny przy kontrowersyjnych tematach. Claude Opus 5.5 go zastępuje i kosztuje mniej za wiadomość.",
        claudeOpus48:
          "Ostatnie wydanie Opusa 4, zbudowane do długiej pracy agentowej, złożonego kodu i bardzo długich odpowiedzi w kontekście 1M, z obsługą obrazów. Cena premium, filtry mainstreamowe, ostrożny przy kontrowersyjnych tematach. Claude Opus 5.5 jest nowszy i tańszy.",
        claudeSonnet46:
          "Sonnet od Anthropic z początku 2026, ulepszenie względem 4.5 w kodowaniu, pracy agentowej i zadaniach biurowych, kontekst 1M. Filtry mainstreamowe, ostrożny przy kontrowersyjnych tematach. Claude Sonnet 5.5 go zastępuje i kosztuje mniej za wiadomość.",
        claudeHaiku45:
          "Mały model Anthropic z października 2025: szybki, dobry w codziennym kodowaniu i czytaniu obrazów, 200K kontekstu. Filtry mainstreamowe, ostrożny przy drażliwych tematach. Claude Haiku 5.5 kosztuje dziś mniej więcej jedną dziesiątą, więc zmiana to formalność.",
        glm5_1:
          "Model Z.AI do kodowania, zbudowany do długich zadań i reklamowany jako zdolny pracować nad jednym problemem godzinami. Mocny w planowaniu, kodzie i wieloetapowych przebiegach agentów, 200K kontekstu, tylko tekst, luźniejsze filtry. GLM-5.3 jest nowszy i kosztuje ułamek ceny, ale jest o poziom niżej. Mocniejszy obecny otwarty wybór to Kimi K3.",
        glm5: "Otwarty flagowiec Z.AI z początku 2026, zbudowany do projektowania systemów i długich przepływów agentowych. Mocne rozumowanie i kodowanie, luźniejsze filtry, 200K kontekstu, tylko tekst. GLM-5.3 jest nowszy i dużo tańszy, ale o poziom niżej pod względem inteligencji. Mocniejsza otwarta alternatywa to Kimi K3.",
        glm5Turbo:
          "Szybszy GLM-5 dostrojony do pętli agentowych: sprawne wnioskowanie, porządny podział zadań i stabilne długie przebiegi. Dobry do automatyzacji z wieloma narzędziami, 200K kontekstu, tylko tekst, luźniejsze filtry. GLM-5.3 robi dziś podobną robotę za ułamek ceny.",
        glm46:
          "Wydanie Z.AI z września 2025, które podniosło kontekst do 200K i poprawiło kodowanie oraz pracę agentową. Nadal przyzwoity dwujęzyczny model do wszystkiego, luźniejsze filtry, tylko tekst. GLM-5.3 jest nowszy i tańszy.",
        glm47:
          "Wydanie Z.AI z grudnia 2025, solidny dwujęzyczny model chińsko-angielski z lepszym kodowaniem i rozumowaniem niż 4.6. Dobry do rozmów, analizy i zadań agentowych, 200K kontekstu, tylko tekst, luźniejsze filtry. GLM-5.3 jest nowszy i kosztuje mniej więcej jedną czwartą.",
        glm47Flash:
          "Mały, szybki GLM 4.7 i jeden z najtańszych modeli tutaj. Dobry do szybkich rozmów, prostych wywołań narzędzi i masowej pracy z tekstem, 200K kontekstu. Słaby w głębokim rozumowaniu. GLM-5.3 Flash jest nowszy, ale kosztuje mniej więcej dwa razy tyle.",
        kimiK2:
          "Model open-weight od Moonshot AI z lipca 2025, mieszanka ekspertów z 1T parametrów, która zasłynęła agentowym używaniem narzędzi i kodowaniem. Szybki, luźniejsze filtry, 262K kontekstu, tylko tekst. Bez trybu myślenia. Kimi K3 to nowszy flagowiec za mniej więcej dwukrotną cenę.",
        kimiK2_5:
          "Kimi od Moonshot ze stycznia 2026, natywnie multimodalny, z obsługą obrazów. Mocny w kodowaniu z długim kontekstem, zamianie zrzutów ekranu na kod i pisaniu twórczym, luźniejsze filtry, 262K kontekstu. Kimi K3 jest nowszy, ale kosztuje mniej więcej dwa razy tyle.",
        kimiK2_6:
          "Kimi K2.6 od Moonshot, nastawiony na długie kodowanie, budowanie interfejsów z promptów lub zrzutów ekranu i równoległą pracę wielu subagentów. Szybki i bystry, obrazy na wejściu, 262K kontekstu, luźniejsze filtry. Kimi K3 jest nowszy, ale droższy.",
        claudeSonnet45:
          "Sonnet od Anthropic z września 2025, znany z mocnego kodowania i długich, samodzielnych sesji agentowych. Nadal dobry do kodu i tekstów, tutaj z kontekstem 1M. Ostrożny przy kontrowersyjnych tematach, słaby w roleplayu. Claude Sonnet 5.5 jest nowszy i tańszy za wiadomość.",
        claudeAgentSonnet:
          "Claude Agent Sonnet - Autonomiczny agent AI z Claude Sonnet przez Anthropic Agent SDK. Samodzielnie wykonuje narzędzia z wbudowanym rozumowaniem.",
        claudeAgentHaiku:
          "Claude Agent Haiku - Szybki autonomiczny agent AI z Claude Haiku przez Anthropic Agent SDK. Zoptymalizowany pod kątem szybkości z wykonywaniem narzędzi.",
        claudeAgentOpus:
          "Claude Agent Opus - Najpotężniejszy autonomiczny agent AI z Claude Opus przez Anthropic Agent SDK. Maksymalna inteligencja z wykonywaniem narzędzi.",
        grok4:
          "Flagowiec xAI z lipca 2025, model rozumujący, który zawsze myśli przed odpowiedzią. Mocny w matematyce, naukach ścisłych i analizie, z luźniejszymi filtrami treści niż większość modeli mainstreamowych. Wolniejszy od zwykłych modeli czatowych. Obecny Grok to Grok 4.7, droższy.",
        grok4Fast:
          "Dawna szybka odmiana Groka. xAI wycofało tani poziom Fast, więc pod tą nazwą działa teraz Grok 4.3 w cenie Groka 4.3. Czyta obrazy, wywołuje narzędzia, 1M kontekstu, otwarta polityka treści. Zastępuje go Grok 4.7: rozumuje dużo głębiej za mniej więcej dwa razy wyższą cenę wyjścia. Na tani, szybki czat MiniMax M3.1 Flash albo DeepSeek V4.1 Flash kosztują ułamek tej ceny.",
        grok43:
          "Późniejsze wydanie Groka 4 z zawsze włączonym rozumowaniem i kontekstem 1M, nastawione na przepływy agentowe i głęboki research. Luźniejsze filtry, obsługa narzędzi, obrazy na wejściu. Ta sama cena co Grok 4 i taniej niż Grok 4.7, nowszy wybór dla tych, którzy chcą najświeższego.",
        grok420Beta:
          "Dawny flagowiec xAI z oknem kontekstu 2M, agentowym wywoływaniem narzędzi i obrazami na wejściu. Dobry do ogromnych dokumentów i długich przebiegów agentów przy luźniejszych filtrach. Grok 4.7 jest nowszy, ale droższy.",
        gpt5Pro:
          "GPT-5 z wydłużonym rozumowaniem, odpowiedź OpenAI z 2025 roku na najtrudniejsze pytania. Dokładny, ale wolny i bardzo drogi jak na starszą generację. GPT-6 Astra to obecny wybór klasy Pro i kosztuje mniej.",
        gpt5Codex:
          "GPT-5 Codex - Wyspecjalizowany model kodowania OpenAI z wyjątkowymi możliwościami programistycznymi i technicznymi",
        gpt51Codex:
          "GPT-5.1 dostrojony do agentowego kodowania w Codex od OpenAI: długie pętle edycji, uruchamiania i poprawek w prawdziwych repozytoriach, 400K kontekstu. Przy tej cenie uczciwy wybór do kodu. Słabszy w swobodnej rozmowie i pisaniu, a nowszy GPT-6.1 Sol poszedł już dalej.",
        gpt51:
          "Aktualizacja GPT-5 od OpenAI z listopada 2025: adaptacyjne rozumowanie, które myśli dłużej tylko przy trudnych pytaniach, i cieplejszy ton rozmowy. Nadal rozsądny model ogólny z 400K kontekstu i obsługą obrazów. GPT-6.1 Sol jest nowszy i bystrzejszy, ale nieco droższy.",
        gpt5: "Flagowiec OpenAI z sierpnia 2025, który połączył szybkie odpowiedzi i głębokie rozumowanie w jednym modelu. Nadal sprawny do wszystkiego: rozmowa, teksty, kod, 400K kontekstu i obrazy na wejściu. Obecny wybór od OpenAI to GPT-6.1 Sol: nowszy i mocniejszy, odrobinę droższy za wiadomość.",
        gpt54Mini:
          "Mniejszy GPT-5.4: przyzwoite rozumowanie, kodowanie i obsługa narzędzi w niższej cenie, 400K kontekstu i obrazy na wejściu. Dobry do dużej liczby rozmów i pracy jako subagent. GPT-6 Luna jest nowszy i dużo tańszy za wiadomość, ale nastawiony bardziej na szybkość niż na głębię.",
        gpt54Nano:
          "Najmniejszy GPT-5.4, stworzony do klasyfikacji, wyciągania danych i szybkich wywołań subagentów. Tani, szybki, obsługuje narzędzia i obrazy. Za płytki na poważną analizę. GPT-6 Luna to nowsza opcja budżetowa, i to jeszcze tańsza.",
        gpt5Mini:
          "Kompaktowy GPT-5 do szybkich codziennych zadań: krótkie odpowiedzi, streszczenia, proste wywołania narzędzi, 400K kontekstu. Tani i szybki, ale płytki przy głębszej analizie. GPT-6 Luna jest nowszy i kosztuje około jednej trzeciej.",
        gpt5Nano:
          "Najmniejszy GPT-5 i wciąż jeden z najtańszych modeli tutaj. Nadaje się do klasyfikacji, tagowania i krótkich odpowiedzi w dużej skali. Nie do kodu ani poważnej analizy. GPT-6 Luna to nowszy model budżetowy, trochę droższy.",
        gptOss120b:
          "Model OpenAI o otwartych wagach: 117B parametrów łącznie, mixture-of-experts, licencja Apache 2.0. Sprawnie rozumuje i koduje za grosze, wywołuje narzędzia, 131K kontekstu. Tylko tekst. Filtry luźniejsze niż w serii GPT-6, ale to nie jest model bez cenzury. GLM-5.3 kosztuje podobnie i daje 1M kontekstu.",
        kimiK2Thinking:
          "Rozumująca wersja Kimi K2 z listopada 2025, zbudowana tak, by myśleć przez setki połączonych wywołań narzędzi i nie gubić wątku. Dobra do researchu i wieloetapowej pracy agentowej za niewielką cenę, luźniejsze filtry. Tylko tekst i wolniejsza od zwykłego K2. Nowszy wybór to Kimi K3.",
        minimaxM27:
          "Model MiniMax nastawiony na agentów i praktyczną robotę: debugowanie, modele finansowe, generowanie dokumentów i przebiegi wielu agentów. Bystry i tani, 196K kontekstu, tylko tekst, luźniejsze filtry. Zastępuje go MiniMax M3.1 Flash: mocniejszy, multimodalny, 1M kontekstu i tańszy.",
        mimoV2Pro:
          "Flagowiec Xiaomi z linii MiMo V2, zbudowany do orkiestracji agentów i długich przepływów inżynierskich, kontekst 1M. Mocne rozumowanie i kodowanie w niskiej cenie, tylko tekst, luźniejsze filtry. MiMo V2.6 Pro jest nowszy i trochę tańszy.",
        glm45Air:
          "Lekki GLM 4.5, mieszanka ekspertów z 106B parametrów, z których aktywnych jest tylko 12B, więc odpowiedzi są szybkie i tanie. Dobry do luźnych rozmów i prostych zadań, 128K kontekstu, tylko tekst. Przestarzałe rozumowanie. GLM-5.3 Flash jest nowszy i tańszy.",
        glm45v:
          "Model wizyjny Z.AI zbudowany na GLM-4.5-Air, mieszance ekspertów o 106B parametrów. Czyta zrzuty ekranu, wykresy i zdjęcia, rozmawia i wywołuje narzędzia. Tylko 64K kontekstu i przestarzałe rozumowanie. GLM-5.3 Flash to nowszy i tańszy wybór od Z.AI.",
        geminiFlash25Lite:
          "Najtańszy Gemini od Google z 2025 roku: grosze za wiadomość, 1M kontekstu, przyjmuje tekst, obraz, wideo i audio. Świetny do masowego tagowania, tłumaczeń i krótkich odpowiedzi, płytki w rozumowaniu. Gemini 3.5 Flash Lite jest nowszy, ale kosztuje prawie cztery razy więcej, więc ten model wciąż ma sens.",
        geminiFlash25Flash:
          "Hybrydowy Flash od Google z 2025 roku z regulowanym budżetem myślenia, 1M kontekstu, przyjmuje tekst, obraz, wideo i audio. Nadal tania i szybka opcja do streszczeń i codziennego czatu. Gemini 3.8 Flash jest nowszy i bystrzejszy, ale kosztuje mniej więcej dwa razy tyle.",
        geminiFlash25Pro:
          "Myślący model Google z 2025 roku z kontekstem 1M, jak na swoje czasy mocny w analizie długich dokumentów i kodzie. Dziś wyraźnie o generację w tyle. Gemini 4 Argon to obecna klasa Pro, nieco droższa.",
        deepseekV31:
          "Hybrydowy model DeepSeek z sierpnia 2025, który przełącza się między szybkimi odpowiedziami a myśleniem krok po kroku. Sprawny i tani w kodowaniu, oparty na otwartej mieszance ekspertów z 671B parametrów, tylko tekst. DeepSeek V4.1 Flash jest nowszy i kosztuje mniej więcej jedną trzecią.",
        deepseekR1:
          "Otwarty model rozumujący ze stycznia 2025, który pokazał, że widoczne myślenie może być tanie. Nadal solidny w matematyce i logice, ale wolny, rozwlekły i powściągliwy w tematach politycznie drażliwych dla Chin. DeepSeek V4.1 Flash jest nowszy i kosztuje ułamek tej ceny.",
        qwen3235bFree:
          "Qwen3 235B od Alibaby to model o otwartych wagach typu mixture-of-experts z 22B aktywnych parametrów. Solidny w kodzie i rozumowaniu za niewielkie pieniądze, wywołuje narzędzia, 131K kontekstu. Tylko tekst i o generację starszy: Qwen 3.8 Flash jest nowszy, czyta obrazy i kosztuje mniej więcej tyle samo.",
        deepseekR1Distill:
          "Mały destylat DeepSeek R1 oparty na Qwen: tanie rozumowanie krok po kroku, tylko tekst, krótki kontekst 32K. Żaden dostawca już go nie serwuje. Zastępuje go DeepSeek V4.1 Flash: mądrzejszy, czyta obrazy, 1M kontekstu i nadal kosztuje grosze.",
        qwen257b:
          "Mały, otwarty model Alibaby z 7B parametrów z 2024 roku. Tani i szybki do prostych rozmów, krótkich przeróbek tekstu i podstawowych tłumaczeń, 32K kontekstu. Jak na dzisiejsze standardy słaby w kodzie i analizie. Qwen 3.8 Flash to nowszy wybór od Alibaby, bystrzejszy i trochę droższy.",
        dallE3:
          "DALL-E 3 - Model generowania obrazów OpenAI tworzący wysokiej jakości, szczegółowe obrazy z opisów tekstowych",
        gptImage1:
          "GPT-Image-1 - Szybki i przystępny cenowo model generowania obrazów OpenAI",
        fluxSchnell:
          "Flux Schnell - Szybki model generowania obrazów Black Forest Labs, zoptymalizowany pod kątem szybkości",
        fluxPro:
          "Sprawdzony koń roboczy Black Forest Labs z generacji FLUX.1, do zamiany tekstu na obraz. Czysta kompozycja, rzetelne trzymanie się promptu, szybki wynik. Na wejściu tylko tekst, bez edycji obrazu referencyjnego. FLUX.2 Pro kosztuje mniej więcej połowę i przyjmuje obrazy referencyjne, więc ten model sprawdzi się głównie przy promptach już pod niego dopracowanych.",
        flux2Max:
          "Najwyższy poziom rodziny FLUX.2 od Black Forest Labs. Generuje z tekstu albo edytuje na podstawie obrazów referencyjnych, z największą szczegółowością i spójnością w całej linii. Cena premium, kilka razy wyższa niż FLUX.2 Pro. Zostaw go na kluczowe ujęcia i trudne edycje z wieloma referencjami; na co dzień FLUX.2 Pro da ci prawie to samo za mniej. Legacy: zastępuje go FLUX.3, ostrzejszy i tańszy za obraz.",
        flux2Klein4b:
          "FLUX.2 Klein 4B - Najszybszy i najbardziej opłacalny model obrazów Black Forest Labs, zoptymalizowany pod kątem wysokiej przepustowości. Legacy: zastępuje go FLUX.3 Klein.",
        riverflowV2Pro:
          "Riverflow V2 Pro - Najpotężniejszy model generowania obrazów Sourceful z najlepszą kontrolą i perfekcyjnym renderowaniem tekstu",
        riverflowV2Fast:
          "Riverflow V2 Fast - Najszybszy model generowania obrazów Sourceful, zoptymalizowany pod kątem wdrożeń produkcyjnych i przepływów wrażliwych na opóźnienia",
        riverflowV2MaxPreview:
          "Riverflow V2 Max Preview - Najpotężniejszy wariant podglądu Sourceful, zunifikowany model text-to-image i image-to-image. Legacy: dostawca wycofał ten podgląd; użyj Riverflow V2 Pro.",
        riverflowV2StandardPreview:
          "Riverflow V2 Standard Preview - Standardowy wariant podglądu Sourceful z ulepszoną wydajnością względem rodziny Riverflow 1. Legacy: dostawca wycofał ten podgląd; użyj Riverflow V2 Pro.",
        riverflowV2FastPreview:
          "Riverflow V2 Fast Preview - Najszybszy wariant podglądu Sourceful, zunifikowany model text-to-image i image-to-image w najniższej cenie. Legacy: dostawca wycofał ten podgląd; użyj Riverflow V2 Fast.",
        flux2Flex:
          "FLUX.2 Flex - Model obrazów Black Forest Labs doskonały w renderowaniu złożonego tekstu, typografii i edycji wielu referencji w jednolitej architekturze",
        flux2Pro:
          "Koń roboczy FLUX.2 od Black Forest Labs do generowania i edycji. Przyjmuje tekst i obrazy referencyjne, utrzymuje spójność postaci i produktów między ujęciami, dobrze radzi sobie z długimi promptami. Średnia półka cenowa. Poziom open: łagodniejsze filtry niż Imagen 4, ale bez treści dosadnych; do tego są Chroma albo Lustify v8. Po FLUX.2 Max sięgaj tylko, gdy liczy się każdy detal.",
        gemini3ProImagePreview:
          "Gemini 3 Pro Image od Google, w wersji preview. Mocniejsze Nano Banana: wierniej trzyma się złożonych promptów, wstawia czytelny tekst do obrazów i edytuje wgrane zdjęcia. Filtry mainstreamowe, bez wywołań narzędzi, 64K kontekstu. Kosztuje kilka razy więcej niż Nano Banana, więc zostaw go na zadania, gdzie liczy się jakość obrazu.",
        gpt5ImageMini:
          "GPT-5 Image Mini od OpenAI: językowe możliwości GPT-5 Mini plus generowanie i edycja obrazów w tym samym czacie. Czyta obrazy, 400K kontekstu. Filtry mainstreamowe, bez wywołań narzędzi. Droższy od Nano Banana i cenowo blisko Nano Banana Pro, więc porównaj oba na własnym prompcie. Legacy: OpenRouter wycofuje go 1 grudnia 2026. W czacie użyj Nano Banana 2.1, a po jakość OpenAI sięgnij po GPT Image 2.6 Flare.",
        gpt5Image:
          "GPT-5 połączony z generatorem obrazów OpenAI: rozmawiasz, a potem w tej samej rozmowie tworzysz lub edytujesz obrazy, także na podstawie wgranych zdjęć. Dobry do dopracowywania grafik zwykłymi słowami. Bez wywołań narzędzi i drogi za wiadomość. GPT-5 Image Mini jest tańszy, warto też porównać z Nano Banana Pro.",
        gpt54Image2:
          "Rozumowanie GPT-5.4 połączone z generowaniem GPT Image 2, więc jedna rozmowa może przejść od analizy czy kodu do gotowych obrazów. Czyta też obrazy. Bez wywołań narzędzi i drogi. GPT-5 Image Mini kosztuje dużo mniej, a Nano Banana i Nano Banana Pro to pozostałe aktualne modele do obrazów.",
        seedream45:
          "Model obrazów od ByteDance, który generuje i edytuje w jednym. Mocny w portretach, w utrzymaniu spójności postaci i w łączeniu kilku obrazów wejściowych w jedną scenę. Średnia półka cenowa, blisko FLUX.2 Pro. Poziom open: łagodniejsze filtry niż w modelach mainstreamowych, ale bez treści dosadnych. Dobra druga opinia, gdy FLUX.2 Pro nie trafia w klimat. Legacy: zastępuje go Seedream 5.5, za połowę ceny.",
        sdxl: "Stable Diffusion XL - Wysokiej jakości otwarty model generowania obrazów Stability AI",
        cassetteMusic:
          "CassetteAI Music - szybkie generowanie muzyki z tekstu przez Fal.ai, klipy do trzech minut",
        musicgenStereo:
          "Otwartoźródłowy MusicGen od Meta w wersji stereo. Muzyka instrumentalna z promptu: gatunek, nastrój, instrumenty. Bez wokalu i tekstów. Tani. Dobry na podkłady i pętle; po piosenki z wokalem sięgnij po ElevenLabs Music albo Sonauto Song.",
        stableAudio:
          "Stable Audio - Model generowania muzyki i dźwięku Stability AI dla wysokiej jakości klipów",
        udioV2:
          "Udio v2 - Wysokiej jakości generowanie muzyki AI z wokalem i pełną jakością produkcji",
        modelsLabMusicGen:
          "Własny model ModelsLab do zamiany tekstu na muzykę, z wyjściem w MP3, WAV albo FLAC. Utwory z promptu na podkłady i dżingle. Kosztuje kilka razy więcej niż Lyria 3 czy MusicGen Stereo, a model bazowy nie jest udokumentowany. Najpierw spróbuj Lyria 3: jakość za niższą cenę.",
        modelsLabElevenlabsMusic:
          "Model muzyczny ElevenLabs. Pełne utwory z wokalem i tekstem w kilku językach albo instrumentalne, sterowane promptem. Obowiązują filtry mainstream. Wyższa półka cenowa wśród modeli muzycznych. Mocny w dopracowanych piosenkach brzmiących jak z radia; tańsze pełne utwory z wokalem da Sonauto Song.",
        modelsLabSonautoSong:
          "Generator piosenek Sonauto. Pełne utwory z wokalem i tekstem w wielu gatunkach, tanio jak na całe kawałki. Poziom open, łagodniejsze filtry niż w ElevenLabs. Jakość produkcji bywa nierówna; po czystszy miks dopłać do ElevenLabs Music albo Lyria 3 Pro Preview.",
        modelsLabLyria3:
          "Lyria 3 od Google. Oryginalne utwory około 30 sekund z promptu, w wysokiej jakości produkcji. Bardzo tani jak na to, co daje. Mainstream: obowiązują filtry Google. Za krótki na pełne piosenki; pełną długość ogarnia Lyria 3 Pro Preview.",
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
          "Model wideo Wan 2.7 od Alibaby. Klipy do 10 sekund (przez ModelsLab do 15) w rozdzielczości do 1080p, wiele proporcji obrazu, natywny dźwięk i opcjonalna pierwsza i ostatnia klatka do sterowania ujęciem. Średnia cena za sekundę. Elastyczny wszechstronny model; do tańszych testów Seedance 1.5 Pro, do najwyższego realizmu Veo 3.1. Legacy: zastępuje go Wan 3.0, ta sama cena za 720p i klipy do 30 sekund.",
        modelsLabWan26T2V:
          "Wan 2.6 T2V - Model tekst-na-wideo Wan 2.6 ModelsLab",
        modelsLabWan26I2V:
          "Model Wan 2.6 od Alibaby do zamiany obrazu w wideo: dajesz klatkę startową, on ożywia scenę, z natywnym dźwiękiem. Klipy 5 lub 10 sekund w 720p albo 1080p, poziomo lub pionowo. Tańszy niż Wan 2.7. Wybierz Wan 2.7 T2V, gdy chcesz też wyznaczyć klatkę końcową albo potrzebujesz więcej proporcji.",
        modelsLabWan26I2VFlash:
          "Szybka odmiana Wan 2.6 do zamiany obrazu w wideo. Robi ze zdjęcia klip 5 lub 10 sekund w 1080p przy krótszym czekaniu. Za sekundę nie jest tańsza od standardowego Wan 2.6 I2V, często nawet trochę droższa, więc opłaca się tylko, gdy liczy się czas. Natywny dźwięk nie jest podany dla tej wersji; standardowy model go ma.",
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
          "OmniHuman 1.5 od ByteDance ożywia osobę z jednego zdjęcia, prowadzony ścieżką audio: gadające głowy, śpiew, gesty. Specjalista od awatarów i dubbingu, a nie ogólny model tekst na wideo. Za sekundę droższy niż większość modeli wideo ze średniej półki. Do scen bez mówiącej postaci wybierz Kling 3.0 albo Wan 2.7.",
        modelsLabSeedance15Pro:
          "Seedance 1.5 Pro od ByteDance, sprzedawany przez chmurę BytePlus. Natywny dźwięk, klipy od 4 do 12 sekund w rozdzielczości od 480p do 1080p, kontrola pierwszej i ostatniej klatki, dużo proporcji obrazu. Jeden z najtańszych modeli wideo tutaj w przeliczeniu na klip. Świetny do testowania pomysłów i produkcji na ilość; Seedance 2.0 to krok wyżej po spójność i 4K.",
        modelsLabVeo2:
          "Veo 2 - Wysokiej jakości model generowania wideo Google via ModelsLab",
        modelsLabVeo3:
          "Veo 3 - Najnowszy model generowania wideo Google via ModelsLab",
        modelsLabVeo3Fast:
          "Veo 3 Fast - Szybki model generowania wideo Google via ModelsLab",
        modelsLabVeo3FastPreview:
          "Veo 3 Fast Preview - Szybki model generowania wideo preview Google via ModelsLab",
        modelsLabVeo31:
          "Flagowy model wideo Google. Filmowy realizm, natywny dźwięk z dialogami i efektami, klipy od 4 do 8 sekund do 4K, kontrola pierwszej i ostatniej klatki. Najdroższy model wideo w katalogu. Wart swojej ceny przy finalnych ujęciach; szkice rób na Veo 3.1 Fast za ułamek kwoty.",
        modelsLabVeo31Fast:
          "Szybsza i tańsza wersja Veo 3.1 od Google. Te same klipy od 4 do 8 sekund, natywny dźwięk, do 4K i kontrola klatek, za mniej więcej jedną trzecią do połowy ceny pełnego Veo 3.1. Przy wymagających ujęciach oddaje trochę jakości. Złoty środek dla większości pracy z Veo; Veo 3.1 Lite jest jeszcze tańszy.",
        modelsLabKlingV21I2V:
          "Kling V2.1 I2V - Model obraz-na-wideo Kling AI wersja 2.1",
        modelsLabKlingV25TurboI2V:
          "Kling 2.5 Turbo do zamiany obrazu w wideo: ożywia zdjęcie w krótkim klipie. Tani w przeliczeniu na klip i szybki, z żywym ruchem typowym dla Klinga. Natywny dźwięk nie jest podany. Kling 3.0 dokłada dźwięk i ujęcia do 15 sekund, ale kosztuje więcej.",
        modelsLabKlingV25TurboT2V:
          "Kling 2.5 Turbo z tekstu. Klipy 5 lub 10 sekund w 16:9, 9:16 albo 1:1, jedne z najtańszych w katalogu w przeliczeniu na klip. Jak na tę cenę mocny ruch, ale bez natywnego dźwięku. Po dźwięk i klipy do 15 sekund przejdź na Kling 3.0 T2V.",
        modelsLabKlingV2MasterT2V:
          "Kling V2 Master T2V - Model tekst-na-wideo najwyższej jakości Kling AI",
        modelsLabKlingV2MasterI2V:
          "Kling V2 Master I2V - Model obraz-na-wideo najwyższej jakości Kling AI",
        modelsLabKlingV21MasterT2V:
          "Kling 2.1 Master, wersja premium generacji 2.1 Klinga. Klipy 5 lub 10 sekund z tekstu, w wysokiej jakości obrazu. Cena blisko szczytu katalogu, około trzy razy wyższa niż Kling 3.0 T2V, który jest nowszy i ma natywny dźwięk. Opłaca się głównie przy promptach, które już tu dobrze działają.",
        modelsLabKlingV21MasterI2V:
          "Kling 2.1 Master do zamiany obrazu w wideo: ożywia zdjęcie w klipie 5 lub 10 sekund w wysokiej jakości. Cena blisko szczytu katalogu, około trzy razy wyższa niż nowszy Kling 3.0, który daje też dźwięk. Wybierz go tylko, gdy potrzebujesz dokładnie tego wyglądu; tanią alternatywą jest Kling V2.5 Turbo I2V.",
        modelsLabKlingV16MultiI2V:
          "Kling V1.6 Multi I2V - Model multi-obraz-na-wideo Kling AI wersja 1.6",
        modelsLabKling30T2V:
          "Kling 3.0 Pro od Kuaishou. Natywny dźwięk, klipy od 3 do 15 sekund w 720p, kontrola pierwszej i ostatniej klatki, 16:9, 9:16 albo 1:1. Żywy, przekonujący ruch w średniej cenie. 720p to sufit; po 1080p i więcej sięgnij po Veo 3.1 Fast albo Hailuo 3. Tańszą wersją jest Kling 3.0 Std.",
        modelsLabLtx2ProT2V:
          "LTX-2 Pro od Lightricks. Tekst na wideo w 2K albo 4K, klipy mniej więcej od 6 do 10 sekund. Jak na tę rozdzielczość średnia cena, więc to budżetowa droga do 4K obok Veo 3.1. Natywny dźwięk nie jest tu podany; po 4K z dźwiękiem sięgnij po Veo 3.1 Fast.",
        modelsLabLtx2ProI2V:
          "LTX 2 PRO I2V - Profesjonalny model obraz-na-wideo LTX",
        modelsLabLtx23ProI2V:
          "LTX 2.3 Pro od Lightricks do zamiany obrazu w wideo: ożywia zdjęcie w 2K albo 4K, w klipach od 6 do 10 sekund. Nowszy niż LTX 2 Pro i nieco droższy. Wybór na sytuacje, gdy obraz w wysokiej rozdzielczości ma zostać ostry także w ruchu. Natywny dźwięk nie jest podany.",
        modelsLabHailuo23T2V:
          "Hailuo 2.3 od MiniMax z tekstu, znany z żywego, fizycznego ruchu, jak taniec i akcja. Klipy 6 lub 10 sekund w 1080p w proporcji 16:9. Bez natywnego dźwięku. Średnia półka cenowa. Hailuo 3 dokłada dźwięk, 2K i kontrolę klatek za mniej więcej dwa razy wyższą cenę.",
        modelsLabHailuo02T2V: "Hailuo 02 T2V - Model tekst-na-wideo MiniMax 02",
        modelsLabHailuo23I2V:
          "Hailuo 2.3 od MiniMax do zamiany obrazu w wideo. Ożywia zdjęcie w klipie 6 lub 10 sekund, z ekspresyjnym, fizycznym ruchem. Bez natywnego dźwięku. Hailuo 2.3 Fast I2V robi to samo za mniej więcej połowę ceny, choć z mniejszym szlifem.",
        modelsLabHailuo23FastI2V:
          "Szybka i tania wersja Hailuo 2.3 do zamiany obrazu w wideo. Klipy 6 lub 10 sekund ze zdjęcia za około połowę ceny standardowego Hailuo 2.3 I2V. Dobra do szkiców i produkcji na ilość, kosztem detali. Bez natywnego dźwięku.",
        modelsLabHailuo02I2V: "Hailuo 02 I2V - Model obraz-na-wideo MiniMax 02",
        modelsLabHailuo02StartEnd:
          "Hailuo 02 Start/End - Model generowania wideo z klatkami początkowymi/końcowymi MiniMax",
        modelsLabSora2:
          "Sora 2 od OpenAI. Wiarygodna fizyka, zsynchronizowany dźwięk i dialogi, klipy do 12 sekund. W tej konfiguracji tylko 16:9. Cena średnia do wysokiej. Sora 2 Pro robi 20 sekund i 1080p za mniej więcej dwa do trzech razy więcej.",
        modelsLabSora2Pro:
          "Wersja premium Sora 2 od OpenAI. Zsynchronizowany dźwięk, klipy do 20 sekund, 720p albo 1080p, poziomo lub pionowo. Jeden z najdroższych modeli wideo w katalogu. Wart tego przy długich, dopracowanych ujęciach; szkice zrobisz na Sora 2 za mniej niż połowę ceny.",
        modelsLabGen4Aleph:
          "Aleph od Runway to bardziej edytor wideo niż generator: dajesz mu gotowy materiał, a on dodaje lub usuwa obiekty, zmienia styl, światło albo kąt kamery. Wiele proporcji obrazu, także szerokie formaty kinowe. Droższy niż większość generatorów. Do nowych klipów z promptu użyj Veo 3.1 Fast albo Kling 3.0.",
        modelsLabLipsync2:
          "lipsync-2 od Sync dopasowuje ruch ust w istniejącym wideo do nowej ścieżki dźwiękowej. Stworzony do dubbingu, tłumaczonych lektorów i poprawiania dialogów. Edytuje gotowy materiał, nie wymyśla scen. Do mówiącej postaci z jednego zdjęcia użyj Omnihuman 1.5.",
        modelsLabGrokT2V:
          "Grok Imagine od xAI, wideo z tekstu. Klipy od 1 do 15 sekund w 480p albo 720p, z opcjonalną pierwszą klatką. Średnia cena, szybko i swobodnie. Poziom open, więc filtry łagodniejsze niż w Veo czy Sorze, ale bez treści dosadnych. Grok Imagine Video 1.5 dokłada 1080p. Legacy: zastępuje go Grok Imagine Video 1.5 Lite, za mniej niż połowę ceny.",
        modelsLabGrokI2V:
          "Grok Imagine od xAI do zamiany obrazu w wideo. Ożywia zdjęcie w klipie HD do 15 sekund. Trochę tańszy niż Grok T2V. Dobry do szybkiego ożywiania zdjęć; po wyższą rozdzielczość sięgnij po Grok Imagine Video 1.5. Legacy: Grok Imagine Video 1.5 Lite ożywia zdjęcia taniej.",
        klingV30Std:
          "Standardowa wersja Kling 3.0 od Kuaishou. Te same klipy od 3 do 15 sekund z natywnym dźwiękiem i kontrolą klatek co Kling 3.0 T2V, czyli wersja Pro, ale taniej za sekundę. Wyjście w 720p. Najlepszy stosunek ceny do jakości w linii Kling 3; po Pro sięgnij, gdy liczą się drobne detale.",
        klingVideoO1:
          "Zunifikowany multimodalny model wideo Klinga, stworzony do generowania klipów i ich edycji na podstawie referencji w jednym modelu. Natywny dźwięk, 5 lub 10 sekund w 720p, kontrola pierwszej i ostatniej klatki. Cena na poziomie Kling 3.0 Pro. Wybierz go do pracy opartej na referencjach; do zwykłego tekstu na wideo tańszy jest Kling 3.0 Std.",
        veo31Lite:
          "Budżetowa wersja Veo 3.1 od Google. Natywny dźwięk, klipy od 4 do 8 sekund w 720p albo 1080p, kontrola pierwszej i ostatniej klatki. Najtańsze wejście w Veo, ale bez 4K. Dobra do dużej liczby klipów na social media; gdy liczy się jakość, przejdź na Veo 3.1 Fast.",
        seedance2:
          "Seedance 2.0 od ByteDance. Natywny dźwięk, klipy od 4 do 15 sekund w rozdzielczości od 480p do 4K, pierwsza i ostatnia klatka oraz referencje, które trzymają spójność postaci. Wyższa półka cenowa. Mocny wybór do ujęć fabularnych z powracającymi postaciami; Seedance 2.0 Fast jest tańszy do szkiców do 720p.",
        seedance2Fast:
          "Szybsza i tańsza wersja Seedance 2.0 od ByteDance. Natywny dźwięk, klipy do 15 sekund i kontrola klatek, ale maksymalnie 720p. Około 60 procent ceny pełnego modelu. Dobra do szkiców i klipów na social media; po 1080p albo 4K sięgnij po pełny Seedance 2.0.",
        happyhorse11:
          "Druga wersja modelu wideo HappyHorse od Alibaby, który generuje obraz i zsynchronizowany dźwięk w jednym przebiegu. Tekst na wideo, obraz na wideo i obrazy referencyjne, do 15 sekund w 720p albo 1080p. Ta sama cena co HappyHorse 1.0, a według Alibaby lepszy ruch i spójność, więc to domyślny wybór z tej dwójki. Średnia półka cenowa.",
        happyhorse10:
          "Pierwsza wersja modelu wideo HappyHorse od Alibaby, który generuje obraz i zsynchronizowany dźwięk w jednym przebiegu. Tekst na wideo, obraz na wideo i obrazy referencyjne, do 15 sekund w 720p albo 1080p. Kosztuje tyle samo co HappyHorse 1.1, więc nowsza wersja zwykle wypada lepiej. Przydaje się przy promptach dopracowanych pod 1.0.",
        modelsLabGen4T2ITurbo:
          "Szybsza i tańsza wersja modelu obrazów Gen-4 od Runway. Tekst na wejściu, obraz na wyjściu, za mniej niż jedną trzecią ceny Gen4 Image. Dobra do szybkich szkiców i dopracowywania filmowego stylu Runway. Bez edycji obrazów referencyjnych; do tego weź FLUX.2 Pro albo Seedream 4.5.",
        modelsLabGen4Image:
          "Model obrazów Gen-4 od Runway, znany z filmowego wyglądu, jak kadr z planu. Tekst na wejściu, obraz na wyjściu. Jedna z droższych opcji w katalogu, więc warto po nią sięgać, gdy zależy ci właśnie na estetyce Runway. Do taniego testowania zacznij od Gen4 T2I Turbo, do edycji z obrazem referencyjnym wybierz FLUX.2 Pro.",
        modelsLabWan27T2I:
          "Model obrazów Wan 2.7 od Alibaby, z tej samej rodziny co modele wideo Wan. Tekst na wejściu, obraz na wyjściu, w dolnej części średniej półki cenowej. Solidny wybór do ilustracji i scen. Nie przyjmuje obrazów referencyjnych; do edycji użyj Qwen Image 3 albo Seedream 4.5.",
        modelsLabGrokT2I:
          "Generator obrazów Grok Imagine od xAI. Tekst na wejściu, obraz na wyjściu, tani w użyciu. Poziom open, więc filtry łagodniejsze niż w Imagen 4, choć bez treści dosadnych. Dobry do szybkich, wyrazistych obrazów; do edycji z obrazem referencyjnym i nowszej generacji jest Grok Imagine Image 2.0, nieco droższy.",
        modelsLabZImageBase:
          "Pełna, niedestylowana wersja bazowa Z-Image, modelu obrazów z otwartymi wagami z laboratorium Tongyi Alibaby. Jedne z najtańszych obrazów w katalogu. Większa różnorodność niż Z Image Turbo, za to wolniej na obraz. Dobry do taniej masówki i eksperymentów; do dopracowanych prac końcowych przejdź na FLUX.2 Pro.",
        modelsLabZImageTurbo:
          "Destylowana, podkręcona pod szybkość wersja Z-Image, modelu z otwartymi wagami z laboratorium Tongyi Alibaby. Obraz w kilku krokach, cena na samym dole katalogu. Jak na tę cenę dobre zdjęciowe efekty i czytelny tekst na obrazie. Mniej różnorodności niż Z Image Base, przy trudnych promptach odstaje od FLUX.2 Pro.",
        modelsLabFlux2MaxT2I:
          "Flux 2 Max T2I - Black Forest Labs Flux 2 Max tekst-na-obraz via ModelsLab",
        modelsLabFluxPro11Ultra:
          "Tryb wysokiej rozdzielczości Flux Pro 1.1, stworzony do obrazów około 4 megapikseli. Na wejściu tylko tekst. Jeden z droższych modeli obrazów w katalogu. Wybierz go do dużych grafik gotowych do druku; do edycji i pracy z wieloma referencjami FLUX.2 Pro jest tańszy i elastyczniejszy.",
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
          "Najwyższy poziom Imagen 4 od Google. Najdokładniej trzyma się promptu w całej rodzinie i czysto, czytelnie renderuje tekst na obrazie. Mainstream: filtry Google działają w pełni. Mniej więcej trzy razy droższy od Imagen 4 Fast, więc zostaw go na finalne rendery. Mniej ograniczeń daje FLUX.2 Pro, treści dosadne Chroma.",
        modelsLabImagen4:
          "Standardowy Imagen 4 od Google. Zdjęciowe detale, dobra typografia i rzetelne trzymanie się promptu w średniej cenie. Mainstream: obowiązują filtry Google, więc przy odważniejszych promptach licz się z odmową. Imagen 4 Fast kosztuje około połowy i nada się do szkiców, Imagen 4 Ultra do szlifu na koniec.",
        modelsLabImagen4Fast:
          "Szybka wersja Imagen 4 od Google. Najtańszy Imagen, szybkie wyniki, dobry do szkiców i dużych serii. Oddaje trochę detali i precyzji względem Imagen 4 i Ultra. Obowiązują filtry mainstream. Jeszcze taniej i z łagodniejszymi filtrami wyjdzie Z Image Turbo.",
        modelsLabImagen3:
          "Imagen 3 - Google Imagen 3 tekst-na-obraz via ModelsLab",
        modelsLabNanoBananaPro:
          "Nano Banana Pro - Wysokiej jakości generowanie obrazów via ModelsLab",
        modelsLabNanoBanana: "Nano Banana - Generowanie obrazów via ModelsLab",
        modelsLabQwenT2I:
          "Model Qwen od Alibaby do zamiany tekstu na obraz. Linia Qwen wyróżnia się renderowaniem tekstu na obrazie, także chińskich znaków, więc świetnie pasuje do plakatów, szyldów i makiet. Cena na samym dole katalogu. Na wejściu tylko tekst; do edycji wybierz Qwen Image 3.",
        modelsLabRealtimeT2I:
          "Endpoint czasu rzeczywistego od ModelsLab, nastawiony na szybkość, nie na szlif. Szybkie obrazy w najniższym progu cenowym katalogu. Do burzy mózgów, miniatur i testowania promptów, zanim wydasz więcej na FLUX.2 Pro albo Imagen 4. Nie do finalnych prac ani złożonych scen.",
        claudeSonnet5:
          "Pierwszy Sonnet 5 od Anthropic: zrównoważony w kodzie, pracy agentowej i analizie, kontekst 1M, obrazy na wejściu. Filtry mainstreamowe, ostrożny przy kontrowersyjnych tematach, słaby w roleplayu. Claude Sonnet 5.5 kosztuje tyle samo i jest nowszy, więc nie ma powodu zostawać.",
        claudeOpus5:
          "Pierwszy Opus 5 od Anthropic, przeznaczony do najtrudniejszych zadań agentowych i analitycznych, kontekst 1M i obrazy na wejściu. Cena premium, filtry mainstreamowe, ostrożny przy kontrowersyjnych tematach. Claude Opus 5.5 jest nowszy i tańszy.",
        claudeOpus5Fast:
          "Claude Opus 5 Fast - Wariant Claude Opus 5 zoptymalizowany pod kątem wysokiej przepustowości i niskich opóźnień. Kontekst 1M tokenów.",
        claudeFable5:
          "Pierwszy Fable od Anthropic, czołowy model rozumujący do głębokiej syntezy, twórczej głębi i planowania na długą metę, kontekst 1M i obrazy na wejściu. Jeden z najdroższych modeli tutaj, z filtrami mainstreamowymi. Claude Fable 5.2 jest nowszy i tańszy. Do kodu lepiej wybrać Claude Opus 5.5.",
        grok45:
          "Rozumujący Grok 4.5 od xAI: mocny w analizie i kodowaniu, czyta obrazy, 500K kontekstu, z luźniejszą polityką treści Groka. Grok 4.7 jest nowszy w tej samej cenie, więc warto zmienić, chyba że potrzebujesz dokładnie tej wersji.",
        grok46:
          "Grok 4.6 poprawił rozumowanie i kodowanie względem 4.5, z obrazami na wejściu, 500K kontekstu i luźniejszymi filtrami xAI. Nadal sprawny model z lekką filtracją. Grok 4.7 kosztuje tyle samo i go zastępuje.",
        gpt56Luna:
          "Szybki i tani poziom linii GPT-5.6 od OpenAI, do codziennych rozmów i krótkich zadań, 1M kontekstu i obrazy na wejściu. Nie do głębokiej analizy. GPT-6 Luna jest nowszy i kosztuje mniej więcej połowę.",
        gpt56LunaPro:
          "Luna z lepszym kodowaniem i dokładniejszym trzymaniem się instrukcji, w tej samej niskiej cenie co zwykła Luna. Dobra do taniej pomocy przy kodzie i uporządkowanych zadań w kontekście 1M. GPT-6 Luna jest nowszy i kosztuje mniej więcej połowę.",
        gpt56Terra:
          "Średni poziom linii GPT-5.6 od OpenAI: solidne kodowanie, analiza i rozmowa w kontekście 1M, obrazy na wejściu. Słaby w roleplayu. GPT-6.1 Terra jest nowszy i kosztuje mniej więcej połowę.",
        gpt56TerraPro:
          "Terra z głębszym rozumowaniem do pracy pełnej analiz, w tej samej cenie co zwykła Terra, kontekst 1M. Słaba w roleplayu. GPT-6.1 Terra jest nowszy i kosztuje mniej więcej połowę. Po więcej głębi sięgnij po GPT-6.1 Sol.",
        gpt56Sol:
          "Najwyższy poziom linii GPT-5.6 od OpenAI: złożone rozumowanie, kod, pisanie i analiza w kontekście 1M, obrazy na wejściu. Cena premium, filtry mainstreamowe. GPT-6.1 Sol jest nowszy i kosztuje mniej więcej połowę.",
        gpt56SolPro:
          "Sol z dodatkowym wysiłkiem rozumowania na najtrudniejsze problemy, w tej samej cenie co zwykły Sol, kontekst 1M. Słaby w roleplayu, filtry mainstreamowe. GPT-6.1 Sol jest nowszy i kosztuje połowę. Po maksymalną głębię sięgnij po GPT-6 Astra.",
        gemini36Flash:
          "Gemini 3.6 Flash od Google: szybki i dobry w kodowaniu, 1M kontekstu, przyjmuje tekst, obraz, wideo i audio. Nadal rozsądna cena do codziennej pracy. Gemini 3.8 Flash jest nowszy i tylko trochę droższy.",
        gemini35FlashLite:
          "Najlżejsze Gemini od Google. Przyjmuje tekst, obrazy, wideo i audio, wywołuje narzędzia, 1M kontekstu. Dobre do prostych zadań w dużej skali: streszczeń, tagowania, szybkich odpowiedzi. Filtry mainstreamowe i brak poważnego rozumowania. Jak na model lite zaskakująco drogie: GPT-6 Luna i Claude Haiku 5.5 kosztują mniej.",
        gemini37Flash:
          "Gemini 3.7 Flash wniósł do linii Flash lepsze rozumowanie i analizę, 1M kontekstu, przyjmuje tekst, obraz, wideo i audio. Dobry model na co dzień w uczciwej cenie. Gemini 3.8 Flash go zastępuje i jest tylko nieco droższy.",
        kimiK3:
          "Kimi K3 od Moonshot AI, model z najwyższej półki. Mocny w kodzie, analizie, pisaniu kreatywnym i długich zadaniach agentowych, czyta obrazy i wideo, wywołuje narzędzia, 1M kontekstu. Luźniejsze filtry niż u amerykańskich laboratoriów. Kimi K3.1 Pro to nowsza, mocniejsza wersja za prawie dwa razy wyższą cenę.",
        glm52:
          "GLM-5.2 od Z.AI: mocne rozumowanie, szybkie wnioskowanie i 1M kontekstu. Dobry do kodu i analizy długich materiałów, tylko tekst, luźniejsze filtry. GLM-5.3 jest nowszy i kosztuje mniej więcej jedną trzecią.",
        minimaxM3:
          "Dawny flagowiec MiniMax. Dobry w kodzie, rozumowaniu i analizie, czyta obrazy i wideo, wywołuje narzędzia, 1M kontekstu, luźniejsze filtry niż u głównych laboratoriów. Zastępuje go MiniMax M3.1 Flash: wyraźnie lepszy w agentach i kodzie za połowę ceny albo mniej.",
        qwen37Flash:
          "Ultratani model Flash od Alibaby i jedna z najtańszych opcji w katalogu: 1M kontekstu, przyjmuje tekst, obraz i wideo, wywołuje narzędzia. Świetny do masowych zadań i szybkich rozmów, płytki przy trudnym rozumowaniu. Qwen 3.8 Flash jest nowszy i bystrzejszy, ale kosztuje kilka razy więcej.",
        qwen38Max:
          "Najmocniejszy Qwen od Alibaby. Rozumowanie, kod i analiza na najwyższym poziomie, czyta obrazy i wideo, wywołuje narzędzia, 1M kontekstu. Luźniejsze filtry niż u amerykańskich laboratoriów. Drogi jak na otwarty model: DeepSeek V4 Pro osiąga tę samą klasę za dużo mniej niż połowę ceny, jeśli wystarczy ci sam tekst.",
        mimoV25:
          "Wydajne MiMo V2.5 od Xiaomi: szybkie i dobre w kodowaniu, 1M kontekstu, przyjmuje tekst, obraz, wideo i audio. Luźniejsze filtry. MiMo V2.6 Flash jest nowszy i kosztuje mniej niż jedną trzecią.",
        mimoV25Pro:
          "MiMo V2.5 Pro od Xiaomi, model do głębokiego rozumowania i kodowania z kontekstem 1M w niskiej cenie. Tylko tekst, luźniejsze filtry. Nadal tańszy niż następca MiMo V2.6 Pro, który jest nowszym wyborem.",
        metaMuseSpark12:
          "Muse Spark 1.2 od Meta, multimodalny model rozumujący, który czyta tekst, obrazy i wideo w kontekście 1M. Dobry w analizie łączącej różne media, luźniejsze filtry. Nie jest nastawiony na kodowanie. Meta Muse Spark 1.3 kosztuje tyle samo i jest nowszy.",
        mistralMedium35:
          "Mistral Medium 3.5, model średniej klasy z francuskiego laboratorium Mistral AI: kodowanie, analiza i obrazy na wejściu, 262K kontekstu. Filtry mainstreamowe. Mistral Large 4 jest nowszy i kosztuje mniej niż połowę.",
        claudeOpus55:
          "Najmocniejszy Claude od Anthropic do ciężkiej codziennej pracy. Wybór na najtrudniejszy kod, długie zadania agentowe i staranną analizę, do tego świetnie pisze. Czyta obrazy, wywołuje narzędzia, 1M kontekstu. Cena premium i filtry mainstreamowe: odmawia przy drażliwych prośbach i słabo sprawdza się w roleplayu. Claude Sonnet 5.5 ogarnie większość codziennej pracy za połowę ceny.",
        claudeSonnet55:
          "Koń pociągowy wśród modeli Claude. Mocny w kodzie, pracy agentowej, analizie i pisaniu za połowę ceny Opus 5.5. Czyta obrazy, wywołuje narzędzia, 1M kontekstu. Filtry mainstreamowe, więc nie do roleplayu ani kontrowersyjnych tematów. Kosztuje tyle co GPT-6.1 Sol i Gemini 4 Argon, czyli jego naturalni rywale.",
        claudeHaiku55:
          "Najszybszy i najtańszy Claude od Anthropic. Szybki czat, lekkie kodowanie, rozumienie obrazów i narzędzia, 1M kontekstu, grosze za wiadomość. Filtry mainstreamowe, słaby w roleplayu i drażliwych tematach. Ta sama cena co GPT-6 Luna. Gdy zadanie wymaga prawdziwej głębi, przesiądź się na Claude Sonnet 5.5.",
        claudeFable51:
          "Fable 5.1 od Anthropic, czołowy model rozumujący do głębokiej syntezy, planowania na długą metę i starannego pisania w kontekście 1M. Cena premium, filtry mainstreamowe, ostrożny przy kontrowersyjnych tematach i słaby w roleplayu. Claude Fable 5.2 go zastępuje i kosztuje mniej. Do kodu lepiej pasuje Claude Opus 5.5.",
        claudeFable52:
          "Czołowy model rozumujący od Anthropic i najdroższy Claude. Stworzony do głębokiej syntezy, researchu i planowania na długim dystansie, do tego świetnie pisze. Czyta obrazy, wywołuje narzędzia, 1M kontekstu. Około dwa razy droższy od Opus 5.5, z filtrami mainstreamowymi. Do kodu lepszy stosunek ceny do jakości ma Claude Opus 5.5.",
        gpt6Astra:
          "Najpotężniejszy model OpenAI, zbudowany do maksymalnej głębi rozumowania przy najtrudniejszych problemach. Kod, analiza i pisanie, czyta obrazy, wywołuje narzędzia, 1M kontekstu. Najdroższy model w katalogu, z filtrami mainstreamowymi. GPT-6.1 Sol gra w tej samej lidze za mniej więcej jedną piątą ceny, więc sprawdź go najpierw.",
        gpt6AstraPro:
          "GPT-6 Astra Pro - GPT-6 Astra z rozszerzonym rozumowaniem. Wolniej, ale dokładniej. Kontekst 1,05M tokenów.",
        gpt61Sol:
          "Model rozumujący premium od OpenAI i rozsądny wybór z najwyższej półki. Mocny w kodzie, analizie i pisaniu, czyta obrazy, wywołuje narzędzia, 1M kontekstu. Filtry mainstreamowe, nie do roleplayu. Około jednej piątej ceny GPT-6 Astra i tyle samo co Claude Sonnet 5.5 czy Gemini 4 Argon.",
        gpt61SolPro:
          "GPT-6.1 Sol Pro - GPT-6.1 Sol z rozszerzonym rozumowaniem do złożonej analizy i kodu. Kontekst 1,05M tokenów.",
        gpt61Terra:
          "Zrównoważona średnia półka od OpenAI. Dobry w kodzie, analizie i codziennym czacie, czyta obrazy, wywołuje narzędzia, 1M kontekstu. Połowa ceny GPT-6.1 Sol. Filtry mainstreamowe, słaby w roleplayu. Jeśli pasują ci luźniejsze filtry, DeepSeek V4 Pro da wyższą klasę za mniej.",
        gpt61TerraPro:
          "GPT-6.1 Terra Pro - GPT-6.1 Terra z głębszym rozumowaniem do pracy analitycznej. Kontekst 1,05M tokenów.",
        gpt6Luna:
          "Lekki GPT-6 od OpenAI. Szybkie odpowiedzi za grosze, czyta obrazy, wywołuje narzędzia, 1M kontekstu. Dobry do krótkich pytań i prostych zadań, nie do głębokiego rozumowania ani roleplayu. Ta sama cena co Claude Haiku 5.5. DeepSeek V4.1 Flash jest jeszcze tańszy i ma luźniejsze filtry.",
        gpt6LunaPro:
          "GPT-6 Luna Pro - GPT-6 Luna z dodatkowym rozumowaniem. Lepszy kod i wykonywanie poleceń w tej samej niskiej cenie. Kontekst 1,05M tokenów.",
        gemini4Argon:
          "Flagowe Gemini od Google. Przyjmuje tekst, obrazy, wideo i audio, a potem rozumuje, koduje i analizuje na najwyższym poziomie. Wywołuje narzędzia, 1M kontekstu. Świetny wybór, gdy na wejściu masz nagranie, wideo albo stos zrzutów ekranu. Filtry mainstreamowe. Kosztuje tyle co Claude Sonnet 5.5 i GPT-6.1 Sol. Gemini 4 Carbon sięga głębiej przy najtrudniejszych zadaniach, a Gemini 4 Hydrogen jest szybszy i o jedną czwartą tańszy.",
        gemini38Flash:
          "Aktualne Gemini Flash od Google. Szybkie, dobre w kodzie i analizie, przyjmuje tekst, obrazy, wideo i audio, wywołuje narzędzia, 1M kontekstu. Filtry mainstreamowe. Średnia półka cenowa: sporo poniżej połowy Gemini 4 Argon, ale wyraźnie drożej niż otwarte szybkie modele, jak Qwen 3.8 Flash. Gemini 4 Hydrogen jest dużo mądrzejszy i szybszy, ale kosztuje prawie dwa razy tyle.",
        grok47:
          "Najnowszy Grok od xAI. Ostre rozumowanie i mocny kod, czyta obrazy, wywołuje narzędzia, 500K kontekstu, czyli połowa tego, co oferuje większość flagowców tutaj. Otwarta polityka treści: odpowiada na więcej niż modele głównych laboratoriów, choć nie jest całkiem bez cenzury. Cenowo jak Qwen 3.8 Max. Taniego poziomu Fast xAI już nie ma: na szybki, tani czat z otwartymi filtrami sprawdź MiniMax M3.1 Flash albo Meta Muse Ember.",
        kimiK31Pro:
          "Najmocniejsze Kimi od Moonshot AI. Rozumowanie, kod, pisanie kreatywne i długie zadania agentowe na najwyższym poziomie, czyta obrazy i wideo, wywołuje narzędzia, 1M kontekstu. Luźniejsze filtry niż u amerykańskich laboratoriów. Kosztuje tyle co Claude Sonnet 5.5. Kimi K3 jest blisko za nieco ponad połowę ceny.",
        deepseekV41Flash:
          "Szybki model DeepSeek, teraz także z rozumieniem obrazów. Poważne kodowanie i analiza prawie za darmo: najtańszy model w katalogu. Wywołuje narzędzia, 1M kontekstu, luźniejsze filtry. Nie myśli głęboko. Do trudnych problemów weź DeepSeek V4 Pro, a bez odmów DeepSeek V4.1 Flash Uncensored.",
        qwen38Flash:
          "Szybki Qwen od Alibaby. Na wejściu tekst, obrazy i wideo, na wyjściu szybkie odpowiedzi, przyzwoity w kodzie, wywołuje narzędzia, 1M kontekstu. Budżetowa cena, luźniejsze filtry. Model na co dzień, nie do głębokiego myślenia. Trudne problemy zostaw dla Qwen 3.8 Max.",
        glm53:
          "Model bazowy GLM-5.3 od Z.AI. Mocne rozumowanie i kod za grosze, wywołuje narzędzia, 1M kontekstu. Tylko tekst, luźniejsze filtry. Jeden z najtańszych bystrych modeli w katalogu. Chcesz zero odmów? GLM 5.3 Uncensored to wersja bez filtra.",
        glm53Flash:
          "Szybki GLM od Z.AI. Czyta tekst, obrazy i wideo, koduje, wywołuje narzędzia, 1M kontekstu. Stworzony do pracy na dużą skalę w budżetowej cenie, z luźniejszymi filtrami. Słabiej rozumuje niż GLM-5.3, który kosztuje tyle samo, więc wybierz Flash, gdy liczą się multimedia i szybkość.",
        mimoV26Pro:
          "Najmocniejsze MiMo od Xiaomi. Rozumowanie, kod i analiza na najwyższym poziomie, przyjmuje tekst, obrazy, wideo i audio. Wywołuje narzędzia, 1M kontekstu, luźniejsze filtry. Najtańszy model z najwyższej półki inteligencji w katalogu, ułamek ceny Gemini 4 Argon przy podobnym zakresie wejść. To nowsza marka, więc sprawdź go na własnych promptach.",
        mimoV26Flash:
          "Szybkie MiMo od Xiaomi. Przyjmuje tekst, obrazy, wideo i audio, jak na swoją cenę dobrze koduje, wywołuje narzędzia, 1M kontekstu. Bardzo tanie, luźniejsze filtry. Głębię oddaje za szybkość. Krok wyżej jest MiMo V2.6 Pro, a MiMo V2.6 Flash Abliterated nie odmawia.",
        metaMuseSpark13:
          "Muse ze średniej półki od Meta. Rozumuje i analizuje tekst, obrazy i wideo, wywołuje narzędzia, 1M kontekstu, luźniejsze filtry. Nie jest stworzony do kodu. W tej cenie Kimi K3 sięga wyższej klasy, a flagowcem Meta jest Meta Muse Wonder.",
        metaMuseWonder:
          "Flagowy Muse od Meta. Rozumowanie, kod, analiza i praca twórcza na najwyższym poziomie, przyjmuje tekst, obrazy, wideo i audio. Wywołuje narzędzia, 1M kontekstu, luźniejsze filtry niż u głównych laboratoriów. Premium, cenowo jak Claude Opus 5.5. Kimi K3.1 Pro i Gemini 4 Argon grają w tej samej lidze za połowę ceny.",
        mistralLarge4:
          "Flagowiec Mistral AI, europejskiego laboratorium. Dobry w kodzie i analizie, czyta obrazy, wywołuje narzędzia, 1M kontekstu, w umiarkowanej cenie. Filtry mainstreamowe. To jeszcze nie najwyższa półka: DeepSeek V4 Pro kosztuje odrobinę więcej i rozumuje głębiej.",
        gemini4Hydrogen:
          "Szybkie Gemini 4 od Google. Stworzone do pętli agentowych, kodowania i szybkiej analizy, a w benchmarkach i tak trafia na najwyższą półkę, działając około 2,5 raza szybciej niż Gemini 3.8 Flash. Przyjmuje tekst, obrazy, wideo i audio, wywołuje narzędzia, 1M kontekstu. Filtry mainstreamowe. Długie, głębokie łańcuchy rozumowania zostaw Gemini 4 Carbon albo Argon. O jedną czwartą tańszy niż Argon, prawie dwa razy droższy niż Gemini 3.8 Flash.",
        gemini4Carbon:
          "Najmocniejsze Gemini od Google i jeden z najlepszych modeli w ogóle. Do najtrudniejszego kodu, długich zadań agentowych i złożonego rozumowania, przyjmuje tekst, obrazy, wideo i audio. Wywołuje narzędzia, 1M kontekstu. Filtry mainstreamowe. Zużywa na zadanie więcej tokenów niż Argon, więc w praktyce wychodzi drożej. Cena startowa do 30 listopada równa Argonowi, Claude Sonnet 5.5 i GPT-6.1 Sol, potem rośnie dwukrotnie, do poziomu Claude Opus 5.5.",
        minimaxM31Flash:
          "Szybki model MiniMax i duży skok względem M3: dużo lepszy w agentach, kodzie i zadaniach z bezpieczeństwa. Czyta obrazy i wideo, wywołuje narzędzia, 1M kontekstu, luźniejsze filtry niż u głównych laboratoriów. Zawsze myśli przed odpowiedzią i pisze rozwlekle, więc odpowiada wolniej i dłużej niż inne modele Flash. Kosztuje połowę ceny M3 albo mniej, ta sama półka budżetowa co DeepSeek V4.1 Flash i Qwen 3.8 Flash.",
        metaMuseEmber:
          "Najmniejszy Muse od Meta, zrobiony do pracy, którą agenci powtarzają cały dzień: wywołania narzędzi, routing, wyciąganie danych i szybki czat. Czyta tekst, obrazy, wideo i audio, 1M kontekstu, luźniejsze filtry niż u głównych laboratoriów. Jak na swój rozmiar mocny w narzędziach i zadaniach na komputerze, płytki w trudnym kodzie i głębokim rozumowaniu. Kosztuje tyle co GPT-6 Luna i Claude Haiku 5.5, a przy promptach powyżej 200K tokenów trzy razy więcej.",
        veniceDeepseekV41FlashUncensored:
          "DeepSeek V4.1 Flash bez odmów, dostarczany przez Venice. Prawdziwe kodowanie i analiza, a do tego fikcja i roleplay, bez pouczania. Czyta obrazy, wywołuje narzędzia, 1M kontekstu, tani. Odpowiedzi polityczne nadal ujmuje trening DeepSeeka, a najmroczniejsze sceny potrafi złagodzić; do tego jest UncensoredLM, zbudowany bez cenzury. Mniej więcej cztery razy droższy niż zwykły DeepSeek V4.1 Flash. Tańszą alternatywą bez filtra jest GLM 5.3 Flash Uncensored.",
        drummerArtemis31b:
          "Fine-tune Gemmy 4 31B od TheDrummera do roleplayu i fikcji. Trzyma się postaci, pisze grimdark i dosadne sceny dla dorosłych bez odmów, a styl zostaje żywy, nie wygładzony. Czyta obrazy, wywołuje narzędzia, kontekst 262K. Słaby w kodowaniu i twardej analizie: to narrator, nie myśliciel. Fine-tune społeczności na jednym hoście NanoGPT, więc bywa chwilowo niedostępny. Kosztuje mniej więcej jedną piątą ceny Venice Role Play Uncensored. Gdy historia potrzebuje prawdziwej logiki, lepiej sięgnąć po DeepSeek V4.1 Flash Uncensored.",
        grokImagineImage2:
          "Druga generacja modelu obrazów Grok Imagine od xAI. Przyjmuje tekst albo obraz referencyjny, więc ogarnia edycje i nowe obrazy. Średnia półka cenowa. Poziom open: łagodniejsze filtry niż mainstream, bez treści dosadnych. Krok wyżej od Grok Imagine T2I, gdy potrzebujesz edycji albo wierniejszego trzymania się promptu.",
        qwenImage3:
          "Szybka wersja Qwen Image 3 od Alibaby. Generuje z tekstu i edytuje obraz referencyjny, a przy tym jest tania. Dobra do szybkich poprawek, grafik z dużą ilością tekstu i iteracji. Qwen Image 3 Pro daje więcej detali za niewiele wyższą cenę; do edycji bez cenzury jest Qwen Edit Uncensored.",
        qwenImage3Pro:
          "Wyższa jakościowo wersja Qwen Image 3 od Alibaby. Tekst albo obraz referencyjny na wejściu, więcej detali i szlifu niż w podstawowym Qwen Image 3 za niewielką dopłatą. Mocny w edycji i tekście na obrazie. Poziom open, więc bez treści dosadnych; do tego jest Qwen Edit Uncensored.",
        hailuo3:
          "Hailuo 3 od MiniMax. Natywny dźwięk, wyjście w 2K, klipy do 15 sekund, kontrola pierwszej i ostatniej klatki. Na papierze wyraźny skok względem Hailuo 2.3, za mniej więcej dwa razy wyższą cenę. Wyższa półka cenowa; tańsze 1080p bez dźwięku da ci Hailuo 2.3 T2V.",
        seedance25:
          "Seedance 2.5 od ByteDance. Główny atut to długość: klipy do 30 sekund z natywnym dźwiękiem i kontrolą klatek, w 480p albo 720p. Najdroższy Seedance w przeliczeniu na klip. Wybierz go do długich, ciągłych ujęć; ostrzejsze krótkie klipy da Seedance 2.0, aż do 4K.",
        flux3Video:
          "Flux 3 Video - Flagowy model generowania wideo Black Forest Labs z wyjątkową jakością.",
        grokImagineVideo15:
          "Grok Imagine Video 1.5 od xAI. Klipy do 15 sekund w 480p, 720p albo 1080p, z opcjonalną pierwszą klatką. Krok wyżej od Grok T2V pod względem rozdzielczości, za mniej więcej dwa razy wyższą cenę. Poziom open: łagodniejsze filtry niż w Veo czy Sorze, bez treści dosadnych.",
        lyria3ProPreview:
          "Wersja premium Lyria 3 od Google, wciąż w fazie preview. Stworzona do pełnometrażowych piosenek w wysokiej jakości produkcji. Mainstream: obowiązują filtry Google. Mniej więcej półtora raza droższa niż Lyria 3. Status preview oznacza, że działanie i dostępność mogą się jeszcze zmienić.",
        lyria3ClipPreview:
          "Lyria 3 Clip od Google do krótkich form, w fazie preview. Szybkie i tanie klipy muzyczne na intra, przerywniki i posty w social media. Obowiązują filtry mainstream. Tylko krótkie długości; do dłuższych utworów użyj Lyria 3 albo Lyria 3 Pro Preview.",
        geminiNanoBanana21:
          "Nano Banana 2.1 od Google. Generuje i edytuje obrazy prosto w czacie, tekst i grafika w jednej odpowiedzi. Około 3 do 4 kredytów za obraz, połowa ceny pierwszego Nano Banana, którego zastępuje. Mocny w precyzyjnych edycjach i czytelnym tekście na obrazie. Filtry mainstreamowe, bez wywołań narzędzi. Przy złożonych scenach Nano Banana Pro wciąż wygrywa, za mniej więcej czterokrotność ceny.",
        seedream55:
          "Seedream 5.5 od ByteDance. Generuje z tekstu albo edytuje na podstawie nawet dziesięciu obrazów referencyjnych. Mocny w portretach, spójnych postaciach i scenach z kilku obrazów. 2 kredyty za obraz, połowa ceny Seedream 4.5, który zastępuje. Poziom open: łagodniejsze filtry niż mainstream, bez treści dosadnych.",
        flux3Image:
          "FLUX.3 od Black Forest Labs. Ostrzejsze detale, czystszy tekst i lepsze trzymanie się promptu niż FLUX.2, z tekstu albo obrazów referencyjnych. Około 5 kredytów za obraz, taniej niż FLUX.2 Max, który zastępuje. Poziom open, bez treści dosadnych. Na co dzień FLUX.2 Pro jest tańszy; do dużych serii masz FLUX.3 Klein.",
        flux3Klein:
          "Mały, szybki FLUX.3. Poniżej 1 kredytu za obraz, jeden z najtańszych w katalogu, a mimo to przyjmuje obrazy referencyjne do edycji. Stworzony do szkiców, miniatur i dużych serii. Mniej detali niż pełny FLUX.3. Poziom open, bez treści dosadnych.",
        gptImage26Flare:
          "GPT Image 2.6 od OpenAI w wersji na szybkość. Tekst albo obraz referencyjny na wejściu, czyste wyniki w krótkim czasie, dobrze radzi sobie z tekstem i układem. Około 4 kredytów za obraz. Mainstream: obowiązują surowe filtry OpenAI. Do gęstych kompozycji i edycji pełnych detali sięgnij po Sunburst.",
        gptImage26Sunburst:
          "GPT Image 2.6 od OpenAI, nastawiony na detal. Gęste kompozycje, plakaty pełne tekstu i edycje, które trzymają szczegóły runda po rundzie. Około 6 kredytów za obraz. Mainstream: obowiązują surowe filtry OpenAI. Flare jest szybszy i tańszy, gdy drobne detale mniej się liczą.",
        geminiOmni12Flash:
          "Gemini Omni 1.2 Flash, model wideo od Google. Klipy od 3 do 15 sekund z natywnym dźwiękiem, od 360p aż do 4K, z kontrolą pierwszej i ostatniej klatki. Około 7 kredytów za sekundę w 720p i 10 w 1080p, taniej niż Veo 3.1 Fast w tej samej rozdzielczości. Obowiązują filtry Google.",
        grokImagineVideo15Lite:
          "Szybka i tania wersja Grok Imagine Video 1.5 od xAI. Klipy od 1 do 15 sekund w 480p, 720p albo 1080p, z opcjonalną pierwszą klatką. 3 kredyty za sekundę w 720p, mniej niż połowa ceny pierwszego wideo Grok Imagine, które zastępuje. Trochę jakości w zamian za tempo; pełny Grok Imagine Video 1.5 wygląda lepiej. Poziom open, bez treści dosadnych.",
        wan30:
          "Wan 3.0 od Alibaby. Klipy od 2 do 30 sekund z natywnym dźwiękiem, od 480p do 1080p, z kontrolą pierwszej i ostatniej klatki. 10 kredytów za sekundę w 720p, tyle co Wan 2.7, który zastępuje, plus poziom 480p za połowę tej ceny. Długie ujęcia przy małym budżecie. Poziom open, bez treści dosadnych.",
        seedance2Mini:
          "Budżetowy Seedance 2.0. Tekst albo obraz na wideo, od 4 do 15 sekund, natywny dźwięk, kontrola pierwszej i ostatniej klatki, w 480p albo 720p. Około 7,6 kredytu za sekundę w 720p, taniej niż Seedance 2.0 Fast. Dobry do szkiców i klipów na social media; gdy potrzebujesz 4K, masz Seedance 2.0. Poziom open, bez treści dosadnych.",
        hailuo3Max:
          "Hailuo 3 Max od MiniMax, szybsza, dotrenowana wersja Hailuo 3. Klipy od 5 do 15 sekund w 768p albo 480p, z kontrolą pierwszej i ostatniej klatki, bez dźwięku. 8 kredytów za sekundę, wyraźnie poniżej Hailuo 3. Świetny do szybkich iteracji; Hailuo 3 dokłada 2K i dźwięk. Poziom open, bez treści dosadnych.",
        runwayGen45:
          "Gen-4.5 od Runway. Filmowy ruch i wierność promptowi, tekst albo pierwsza klatka na wejściu, klipy od 2 do 10 sekund w 720p, bez dźwięku. 12 kredytów za sekundę, wyższa średnia półka. Mocny wybór do ujęć w filmowym stylu; jeśli potrzebujesz dźwięku w klipie, weź Veo 3.1 Fast albo Wan 3.0. Poziom open, bez treści dosadnych.",
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
        openaiWhisper:
          "Rozpoznawanie mowy Whisper od OpenAI, trenowane na 99 językach. Transkrybuje wywiady, notatki głosowe i spotkania, dobrze radzi sobie z akcentami i hałasem w tle. Tanie w użyciu. Nie oznacza mówców, a przy długiej ciszy potrafi zmyślić tekst. Nowszą opcją od OpenAI jest GPT-4o Mini Transcribe.",
        deepgramNova2: "Deepgram Nova-2",
        whisperLargeV3:
          "Whisper Large V3 - Otwarty model OpenAI, 99 języków, znacznie tańszy niż whisper-1.",
        voxtralMini:
          "Voxtral Mini Transcribe - transkrypcja Mistral z rozdzielaniem mówców i znacznikami czasu, do 10 minut.",
        nemotronAsr:
          "Nemotron ASR - otwarte wielojęzyczne rozpoznawanie mowy NVIDIA, 40 wariantów językowych, niskie opóźnienie.",
        gpt4oMiniTranscribe:
          "GPT-4o Mini Transcribe - niższy współczynnik błędów niż Whisper, lepsze wykrywanie języka.",
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
        openaiAlloy:
          "Głos Alloy od OpenAI. Wyważony i neutralny, ani wyraźnie męski, ani kobiecy, w spokojnym tempie. Pasuje do narracji, materiałów objaśniających i treści profesjonalnych, w których głos ma nie odciągać uwagi. Kosztuje ułamki centa. Mniej ciepła niż Nova, mniej powagi niż Onyx.",
        openaiNova:
          "Głos Nova od OpenAI. Jasny, ciepły i przyjazny, o kobiecej barwie. Pasuje do asystentów, aplikacji konwersacyjnych i pogodnych tekstów. Bardzo tani. Gorzej sprawdza się w poważnych czy formalnych treściach; tam lepiej wypada Onyx.",
        openaiOnyx:
          "Głos Onyx od OpenAI. Niski, spokojny męski głos z autorytetem. Pasuje do dokumentów, formalnej narracji i komunikatów. Bardzo tani. W luźnej rozmowie potrafi brzmieć zbyt ciężko; lżejszy i bardziej przyjazny jest Nova.",
        openaiEcho: "OpenAI Echo",
        openaiShimmer: "OpenAI Shimmer",
        openaiFable: "OpenAI Fable",
        elevenlabsRachel: "ElevenLabs Rachel",
        elevenlabsJosh: "ElevenLabs Josh",
        elevenlabsBella: "ElevenLabs Bella",
        elevenlabsAdam: "ElevenLabs Adam",
        kokoroBella:
          "Kokoro Bella - Otwarty model 82M, ciepły amerykański głos kobiecy. Bez filtra treści.",
        kokoroSarah:
          "Kokoro Sarah - Otwarty model 82M, wyraźny amerykański głos kobiecy. Bez filtra treści.",
        kokoroNicole:
          "Kokoro Nicole - Otwarty model 82M, miękki, stonowany głos kobiecy. Bez filtra treści.",
        kokoroAdam:
          "Kokoro Adam - Otwarty model 82M, spokojny amerykański głos męski. Bez filtra treści.",
        kokoroMichael:
          "Kokoro Michael - Otwarty model 82M, pewny siebie amerykański głos męski. Bez filtra treści.",
        kokoroEmma:
          "Kokoro Emma - Otwarty model 82M, brytyjski głos kobiecy. Bez filtra treści.",
        kokoroGeorge:
          "Kokoro George - Otwarty model 82M, brytyjski głos męski. Bez filtra treści.",
        inworldAshley:
          "Inworld Ashley - Szybki, tani głos kobiecy o żywej narracji.",
        inworldCraig: "Inworld Craig - Szybki, tani brytyjski głos męski.",
        xaiEve:
          "xAI Eve - Ekspresyjny głos kobiecy ze sterowaniem emocjami w tekście.",
        geminiZephyr:
          "Gemini Zephyr - Jasny głos kobiecy, ponad 100 języków, sterowanie intonacją.",
        geminiPuck:
          "Gemini Puck - Energiczny głos męski, ponad 100 języków, sterowanie intonacją.",
      },
    },
  },
};
