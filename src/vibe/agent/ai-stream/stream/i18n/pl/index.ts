// oxlint-disable boilerplate/i18n-pattern -- imports model translations shared across scoped files
import { translations as modelTranslations } from "../../../../models/i18n/pl";
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
      titleShort: "Uruchom agenta",
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
            "Slug zapisanego ulubionego (np. 'thea-cheap'). Nie slug skilla – do tego użyj pola skill. Ładuje skill, model i konfigurację narzędzi jednym wywołaniem. Priorytet: model > favoriteId > skill.",
          placeholder: "thea-cheap",
        },
        model: {
          label: "Model (tylko CLI)",
          description:
            "Bezpośrednie nadpisanie LLM. Tylko przez CLI – inne platformy używają favoriteId lub skill. Szybki: claude-haiku-4.5, gemini-2.5-flash. Zbalansowany: claude-sonnet-4.6, gpt-5. Potężny: claude-opus-4.7. Darmowy: qwen3_235b-free.",
        },
        skill: {
          label: "Umiejętność",
          description:
            "Slug umiejętności (np. 'thea', 'thea__cheap-smart'). Nie slug ulubionego – do tego użyj favoriteId. Definiuje personę AI i prompt systemowy. Użyj 'skill-creator' do tworzenia/edycji.",
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
            public: "Publiczny",
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
        unknown: { title: "Nieznany błąd", description: "Nieoczekiwany błąd" },
        unsaved: { title: "Niezapisane", description: "Niezapisane zmiany" },
        conflict: { title: "Konflikt", description: "Konflikt danych" },
      },
      requireFavOrSkill:
        "Podaj co najmniej jedno z: favoriteId, skill lub model (tylko CLI). Nie można uruchomić bez rozwiązywalnego modelu i skilla.",
      skillNotFound:
        "Skill '{{skill}}' nie znaleziony. Jeśli to slug ulubionego (np. 'thea-cheap'), użyj --favoriteId zamiast --skill.",
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
      options: {
        private: "Prywatny",
        shared: "Udostępniony",
        public: "Publiczny",
        incognito: "Incognito (bez zapisu)",
        background: "Tło",
      },
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
    incognitoThreadTitle: {
      label: "Tytuł wątku incognito",
      description:
        "Aktualny tytuł wątku incognito - wysyłany przez klienta, ponieważ wątki incognito nie mają wiersza na serwerze",
    },
    incognitoThreadDescription: {
      label: "Opis wątku incognito",
      description: "Aktualny opis wątku incognito",
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
        tool: "Narzędzie",
        error: "Błąd",
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
    executionContext: {
      label: "Kontekst wykonania",
      description:
        "Sposób wykonania strumienia: lokalnie, zdalny przekaźnik lub inference-provider. Normalne żądania czatu używają lokalnie (domyślnie).",
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
      lastAiMessageContent: "Treść ostatniej wiadomości AI",
      lastGeneratedMediaUrl: "URL wygenerowanych mediów",
      totalCreditsDeducted: "Potrącone kredyty",
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
      serviceUnavailable: {
        title: "Zdalna instancja niedostępna",
        description:
          "Połączona instancja, od której zależy ten wątek, była nieosiągalna",
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
      fileTypeNotAllowed: "Niedozwolony typ pliku: {{fileType}}",
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
    contentFiltered:
      "Ta odpowiedź została zablokowana przez filtr treści dostawcy. Spróbuj innego modelu.",
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
  info: {
    streamInterrupted:
      "Generowanie zostało zatrzymane. Częściowa odpowiedź została zapisana.",
    billingFailed:
      "Zatrzymano: nie udało się pobrać kredytów za tę odpowiedź. Nic nie przepadło - wyślij wiadomość ponownie za chwilę.",
    budgetExceeded:
      "Zatrzymano: to zadanie w tle osiągnęło limit kredytów. Podnieś limit w Limitach budżetu zadań, aby mogło działać dalej.",
    taskWatchdog:
      "Zatrzymano: strażnik zadań zakończył to uruchomienie, bo przekroczyło limit czasu, tur lub wywołań narzędzi.",
  },
  headless: {
    errors: {
      missingModelOrSkill:
        "Wymagany model lub charakter - podaj bezpośrednio lub podaj favoriteId z rozwiązywalnym wyborem modelu",
      favoriteNotFound:
        "Ulubiony nie znaleziony lub nie należy do tego użytkownika",
      ambiguousModel:
        "Podaj ALBO jawny model, ALBO ulubiony/charakter - nie oba naraz",
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
    signin: {
      title: "Zachowaj swoją konfigurację",
      subtitle: "Zaloguj się raz. Wszystko, co tu zbudujesz, zostaje z Tobą.",
      benefits: {
        sync: {
          title: "Synchronizacja na wszystkich urządzeniach",
          body: "Twój towarzysz, specjaliści i rozmowy na każdym urządzeniu.",
        },
        keep: {
          title: "Nic nie przepada",
          body: "W trybie gościa wszystko zostaje tylko w tej przeglądarce. Po zalogowaniu zostaje z Tobą.",
        },
        private: {
          title: "Prywatność od początku",
          body: "Ty decydujesz o swoich danych i poziomie filtrowania. Zawsze.",
        },
      },
      cta: "Zaloguj się lub załóż konto",
      continueAsGuest: "Kontynuuj jako gość",
      note: "Możesz zalogować się później z menu w dowolnej chwili.",
    },
    setup: {
      title: "Skonfiguruj swoje AI",
      subtitle:
        "Wybierz, z kim rozmawiasz. Specjaliści, jeśli chcesz. Wszystko zmienisz później.",
      companionLabel: "Twój towarzysz",
      specialistsLabel: "Dodaj specjalistów",
      optional: "opcjonalnie",
      start: "Zacznij rozmowę",
      saving: "Konfiguruję...",
      failed:
        "Nie udało się zapisać ustawień. Sprawdź połączenie i spróbuj ponownie.",
      retry: "Spróbuj ponownie",
    },
    usecases: {
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
    noCredits: {
      title: "Skończyły się kredyty",
      addCredits: "Doładuj kredyty",
      description: "Saldo jest puste. Doładuj i rozmawiaj dalej.",
    },
    creditsLoadFailed: {
      title: "Nie udało się wczytać salda.",
      retry: "Ponów",
    },
    insufficientCredits: {
      title: "Za mało kredytów (potrzeba {{cost}}, masz {{balance}})",
      description: "Doładuj kredyty albo wybierz tańszy model.",
    },
    noModel: {
      title: "Nie wybrano modelu",
      description:
        "Najpierw wybierz model. Brak na liście? Sprawdź klucze API dostawców.",
    },
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
  outOfCredits: {
    dismiss: "Zamknij",
    guest: {
      title: "Darmowe kredyty się skończyły",
      description:
        "Kredyty gościa się wyczerpały. Podaj e-mail albo załóż darmowe konto i pisz dalej.",
      emailLabel: "E-mail",
      emailPlaceholder: "ty@przyklad.pl",
      emailSubmit: "Odbierz +{{bonus}} kredytów",
      emailSubmitting: "Wysyłanie…",
      invalidEmail: "Podaj poprawny adres e-mail.",
      added: "Dodano {{bonus}} kredytów. Pisz dalej.",
      confirm:
        "Sprawdź skrzynkę. Potwierdź e-mail, by odblokować +{{bonus}} kredytów.",
      claimed:
        "Ten e-mail już odebrał bonus. Załóż konto: {{signedIn}} kredytów miesięcznie za darmo.",
      or: "lub",
      signUp: "Załóż konto: {{signedIn}} kredytów/mies. za darmo",
      haveAccount: "Masz już konto?",
      logIn: "Zaloguj się",
    },
    member: {
      title: "Skończyły Ci się kredyty",
      description: "Doładuj kredyty i pisz dalej od tego miejsca.",
      getCredits: "Doładuj kredyty",
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
    openThread: "Otwórz wątek",
  },
  toolsButton: {
    title: "Narzędzia AI",
    tools: "Narzędzia",
  },
  config: {
    folders: {
      private: "Prywatny",
      shared: "Udostępniony",
      public: "Publiczny",
      background: "Tło",
      incognito: "Incognito",
      remote: "Zdalny",
    },
  },
  models: { names: modelTranslations.names },
};
