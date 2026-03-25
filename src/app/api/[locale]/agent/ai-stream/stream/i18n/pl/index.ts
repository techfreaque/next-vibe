import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
        "Uruchom headless agenta AI i otrzymaj pełną odpowiedź tekstową. Użyj do delegowania zadań, podsumowywania wyników narzędzi, generowania treści lub łączenia narzędzi w jedną odpowiedź AI. Kredyty są pobierane w zależności od modelu. SZYBKI START: Przekaż favoriteId, aby załadować postać + model + konfigurację narzędzi z zapisanego ulubionego. Nadpisz dowolne pole (model, skill, tools, availableTools) przekazując je jawnie. KONFIGURACJA: Przed uruchomieniem skonfiguruj odpowiednią postać + ulubiony. Postacie definiują personę i prompt systemowy (utwórz za pomocą agent_chat_skills_create_POST). Ulubione łączą postać z nadpisaniem modelu i konfiguracją narzędzi (utwórz za pomocą agent_chat_favorites_create_POST, modelSelection: {selectionType:'MANUAL', manualModelId:'...'} lub {selectionType:'FILTERS',...}). Workflow: 1) Listuj ulubione (agent_chat_favorites_GET) lub postacie (agent_chat_skills_GET). 2) Jeśli żaden nie pasuje, utwórz postać, potem ulubiony. 3) Przekaż favoriteId. DOSTĘP DO NARZĘDZI: Standardowe ustawienie: availableTools: [{toolId:'execute-tool'},{toolId:'system_help_GET'}] - execute-tool uruchamia dowolny endpoint, system_help_GET pozwala odkrywać narzędzia.",
      container: {
        title: "Uruchomienie agenta AI",
        description:
          "Konfiguracja wywołań wstępnych i promptu dla headless wykonania AI",
      },
      fields: {
        favoriteId: {
          label: "ID ulubionego",
          description:
            "UUID zapisanego ulubionego do załadowania postaci, modelu i konfiguracji narzędzi. Postać, model (z modelSelection) i konfiguracja narzędzi (availableTools/pinnedTools) ulubionego są używane jako wartości domyślne. Jawne pola w tym żądaniu nadpisują wartości ulubionego. Użyj agent_chat_favorites_GET do listowania.",
          placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        },
        model: {
          label: "Model",
          description:
            "Model AI. Opcjonalny gdy ustawiono favoriteId lub skill (rozwiązywany z ich modelSelection). Szybki & tani: claude-haiku-4.5, gemini-2.5-flash. Zbalansowany: claude-sonnet-4.6, gpt-5. Potężny: claude-opus-4.6, gpt-5-pro. Darmowy: qwen3_235b-free, gpt-oss-120b-free. Nadpisuje model z favoriteId/skill.",
        },
        skill: {
          label: "Umiejętność",
          description:
            "ID umiejętności (UUID) lub 'default'. Opcjonalny gdy ustawiono favoriteId (rozwiązywany z ulubionego). Umiejętności definiują personę AI, prompt systemowy i domyślny model. Nadpisuje umiejętność z favoriteId. Użyj agent_chat_skills_GET do listowania.",
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
            "Wywołania narzędzi do wykonania przed promptem. Wyniki są wstrzykiwane jako kontekst. Użyj system_help_GET do odkrywania dostępnych narzędzi i ich argumentów.",
          routeId: {
            label: "ID narzędzia",
            description:
              "Alias lub pełna nazwa narzędzia do wywołania (np. 'web-search', 'agent_chat_skills_GET'). Użyj system_help_GET do odkrywania.",
            placeholder: "web-search",
          },
          args: {
            label: "Argumenty",
            description:
              'Płaskie argumenty klucz-wartość - urlPathParams i pola body połączone w jeden obiekt (np. {"query": "najnowsze wiadomości", "maxResults": 5}).',
          },
        },
        availableTools: {
          label: "Może wykonywać (warstwa uprawnień)",
          description:
            "Brama uprawnień do wykonania - kontroluje które narzędzia AI faktycznie może uruchomić. null = wszystkie dozwolone. Tablica = tylko wymienione narzędzia (inne blokowane z 'wyłączone przez użytkownika'). Standardowe ustawienie: [{toolId:'execute-tool'},{toolId:'system_help_GET'}] - execute-tool dispatchuje dowolny zarejestrowany endpoint, system_help_GET pozwala odkrywać narzędzia. Nie trzeba powtarzać narzędzi z pola tools.",
          toolId: {
            label: "ID narzędzia",
            description:
              "Alias lub pełna nazwa narzędzia, które AI może wykonać (np. 'execute-tool', 'system_help_GET', 'web-search')",
          },
          requiresConfirmation: {
            label: "Wymaga potwierdzenia",
            description:
              "Jeśli true, wykonanie zatrzymuje się i czeka na potwierdzenie użytkownika. Używaj dla destrukcyjnych lub kosztownych akcji.",
          },
        },
        pinnedTools: {
          label: "W kontekście (AI to widzi)",
          description:
            "Narzędzia załadowane do okna kontekstu modelu - co AI zna i nad czym może rozumować. null = domyślny zestaw narzędzi użytkownika (zalecane). Podaj tablicę tylko dla skupionego, minimalnego kontekstu. Uwaga: availableTools kontroluje co faktycznie się wykonuje - to pole wpływa tylko na to, co model widzi.",
          toolId: {
            label: "ID narzędzia",
            description:
              "Alias lub pełna nazwa narzędzia w kontekście (np. 'execute-tool', 'system_help_GET')",
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
            "Gdzie zapisać wątek. 'cron' (domyślny) = trwałe uruchomienia agenta. 'incognito' = bez zapisu, bez historii. 'private' = prywatny folder użytkownika. 'shared' = dostępny dla zespołu.",
          placeholder: "cron",
          options: {
            cron: "Cron (zadania agenta)",
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
            "Gdy true, AI nie zobaczy zapisanych wspomnień użytkownika w kontekście. Użyj dla publicznych botów i izolowanych zadań, które nie powinny dziedziczyć osobistego kontekstu. Domyślnie: false (wspomnienia włączone).",
        },
      },
      response: {
        text: "Tekst odpowiedzi AI (tagi think usunięte). Null jeśli model nie wygenerował wyjścia.",
        promptTokens: "Zużyte tokeny promptu (koszt wejścia)",
        completionTokens: "Wygenerowane tokeny odpowiedzi (koszt wyjścia)",
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
        unknown: { title: "Nieznany błąd", description: "Nieoczekiwany błąd" },
        unsaved: { title: "Niezapisane", description: "Niezapisane zmiany" },
        conflict: { title: "Konflikt", description: "Konflikt danych" },
      },
      success: {
        title: "Wykonanie AI zakończone",
        description: "Zakończono pomyślnie",
      },
    },
  },
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
      description: "Strefa czasowa użytkownika dla stabilnych znaczników czasu",
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
    availableTools: {
      label: "Może wykonywać",
      description:
        "Warstwa uprawnień wykonania - które narzędzia AI może faktycznie uruchomić. null = wszystkie dozwolone. Tablica = tylko wymienione.",
      toolId: {
        label: "ID narzędzia",
        description: "Alias lub pełna nazwa narzędzia, które AI może wykonać",
      },
    },
    pinnedTools: {
      label: "W kontekście (AI to widzi)",
      description:
        "Narzędzia w oknie kontekstu modelu - co AI zna. null = domyślny zestaw użytkownika. availableTools kontroluje rzeczywiste wykonanie.",
      toolId: {
        label: "ID narzędzia",
        description: "Alias lub pełna nazwa narzędzia w kontekście",
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
      openrouterApiKeyMissing: "Klucz API OpenRouter nie został skonfigurowany",
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
    rateLimitExceeded: "Zbyt wiele żądań. Poczekaj chwilę i spróbuj ponownie.",
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
      title: "Pomyśl o nas jak o swoim zespole AI.",
      line1:
        "Twój towarzysz obsługuje codzienne rozmowy. Specjaliści wkraczają przy kodowaniu, badaniach, pisaniu - cokolwiek jest potrzebne.",
      line2:
        "AI przełącza się między nimi automatycznie. Ty po prostu rozmawiasz.",
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
    },
  },
};
