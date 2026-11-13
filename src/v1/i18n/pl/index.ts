import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "AI",

  tags: {
    api: "API zgodne z OpenAI",
  },

  openai: {
    missingKey:
      "Brak klucza API. Wyślij go jako 'Authorization: Bearer <klucz>' albo 'x-api-key: <klucz>'. Utwórz klucz w Ustawienia > Klucze API.",
    invalidKey:
      "Nieprawidłowy lub unieważniony klucz API. Sprawdź klucz albo utwórz nowy w Ustawienia > Klucze API.",
    authUnavailable:
      "Nie udało się teraz zweryfikować klucza API. Klucz nie został odrzucony. Spróbuj ponownie za {{seconds}} s.",
    modelNotFound:
      "Model '{{model}}' nie istnieje lub nie jest dla Ciebie dostępny. Lista Twoich modeli: GET /v1/models.",
    paidRequired:
      "API jest dostępne w planach płatnych. Wykup subskrypcję lub kup kredyty, aby wywoływać /v1: zobacz Ustawienia > Klucze API.",
    toolsUnsupportedByModel:
      "Ten model nie obsługuje wywoływania narzędzi. Wybierz model z obsługą narzędzi albo usuń 'tools'.",
    badToolArguments:
      "Argumenty wywołania narzędzia '{{name}}' nie są poprawnym JSON-em.",
    toolChoiceUnknown:
      "tool_choice wskazuje '{{name}}', którego nie ma w 'tools'.",
    toolMessageNeedsId: "Wiadomość narzędzia {{param}} wymaga tool_call_id.",
    nUnsupported: "Obsługiwane jest tylko n=1.",
    badImageUrl:
      "image_url musi być adresem http(s) albo adresem data: w base64.",
    insufficientCredits:
      "Za mało kredytów. To wywołanie potrzebuje około {{cost}}, masz {{balance}}. Doładuj, żeby kontynuować.",
    rateLimited:
      "Limit osiągnięty: {{limit}} zapytań na minutę dla tego klucza. Spróbuj za {{seconds}} s.",
    upstreamFailed: "Dostawca modelu zawiódł: {{error}}",
    balanceCheckFailed:
      "Nie udało się sprawdzić salda. Nic nie zostało uruchomione. Spróbuj ponownie.",
  },

  models: {
    get: {
      title: "Modele zgodne z OpenAI",
      titleShort: "Modele v1",
      description:
        "Wyświetla modele dostępne dla Twojego klucza API. Format listy OpenAI. Uwierzytelnianie przez Authorization: Bearer <klucz>.",
      response: { object: "Typ obiektu" },
      success: {
        title: "Modele wyświetlone",
        description: "Modele dostępne dla tego klucza API",
      },
    },
  },

  completions: {
    post: {
      title: "Chat completions zgodne z OpenAI",
      titleShort: "Chat completions v1",
      description:
        "Wywołaj dowolny model w formacie OpenAI chat completions. Rozliczane z Twoich kredytów po cenach czatu. Obsługuje stream: true.",
      fields: {
        model: {
          label: "Model",
          description: "ID modelu z GET /v1/models",
        },
        messages: {
          label: "Wiadomości",
          description: "Lista wiadomości OpenAI (system, user, assistant)",
        },
        stream: {
          label: "Streaming",
          description: "Wyślij odpowiedź jako server-sent events",
        },
        streamOptions: {
          label: "Opcje streamu",
          description:
            "{ include_usage: true } dodaje końcowy chunk z zużyciem",
        },
        maxTokens: {
          label: "Maks. tokenów",
          description: "Górny limit wygenerowanych tokenów",
        },
        maxCompletionTokens: {
          label: "Maks. tokenów odpowiedzi",
          description: "To samo co max_tokens; ma pierwszeństwo",
        },
        temperature: {
          label: "Temperatura",
          description: "Temperatura próbkowania, od 0 do 2",
        },
        topP: {
          label: "Top P",
          description: "Próbkowanie nucleus, od 0 do 1",
        },
        stop: {
          label: "Stop",
          description: "Sekwencja zatrzymująca lub ich lista",
        },
        n: {
          label: "Odpowiedzi",
          description: "Obsługiwane jest tylko 1",
        },
        tools: {
          label: "Narzędzia",
          description:
            "Narzędzia funkcyjne OpenAI, które model może wywołać: [{type:'function', function:{name, description, parameters}}]",
        },
        toolChoice: {
          label: "Wybór narzędzia",
          description:
            "none, auto, required albo {type:'function', function:{name}}",
        },
        parallelToolCalls: {
          label: "Równoległe wywołania narzędzi",
          description: "Akceptowane dla zgodności; decyduje model",
        },
      },
      response: { object: "Typ obiektu" },
      success: {
        title: "Completion utworzone",
        description: "Model odpowiedział",
      },
    },
  },

  responses: {
    previousResponseUnsupported:
      "previous_response_id nie jest obsługiwane: odpowiedzi nie są zapisywane. Wyślij całą rozmowę w 'input' z store: false (Codex CLI robi to domyślnie).",
    badInputItem:
      "{{param}} nie nadaje się do użycia: obrazy muszą mieć adres http(s) lub base64 data:, a elementy narzędzi call_id.",
    post: {
      title: "OpenAI Responses API",
      titleShort: "v1 responses",
      description:
        "Wywołaj dowolny model w formacie OpenAI Responses, którym mówi Codex CLI. Bezstanowo: cała rozmowa idzie w input. Obsługuje streaming, narzędzia function, custom i local_shell oraz elementy reasoning.",
      fields: {
        model: { label: "Model", description: "ID modelu z GET /v1/models" },
        input: {
          label: "Wejście",
          description:
            "Tekst albo rozmowa jako elementy Responses (message, function_call, function_call_output, reasoning, ...)",
        },
        instructions: {
          label: "Instrukcje",
          description: "Instrukcje systemowe dla modelu",
        },
        stream: {
          label: "Stream",
          description: "Wyślij odpowiedź jako zdarzenia Responses (SSE)",
        },
        tools: {
          label: "Narzędzia",
          description:
            "Narzędzia function, custom i local_shell. Narzędzia hostowane (web_search, ...) są pomijane.",
        },
        toolChoice: {
          label: "Wybór narzędzia",
          description: "none, auto, required albo {type:'function', name}",
        },
        parallelToolCalls: {
          label: "Równoległe wywołania narzędzi",
          description: "Akceptowane dla zgodności; decyduje model",
        },
        maxOutputTokens: {
          label: "Maks. tokenów wyjścia",
          description: "Górny limit generowanych tokenów",
        },
        temperature: {
          label: "Temperatura",
          description: "Temperatura próbkowania, od 0 do 2",
        },
        topP: { label: "Top P", description: "Próbkowanie nucleus, od 0 do 1" },
        reasoning: {
          label: "Reasoning",
          description:
            "Akceptowane dla zgodności. Modele rozumujące i tak zwracają elementy reasoning.",
        },
        text: {
          label: "Format tekstu",
          description:
            "{format:{type:'json_schema', schema}} prosi o odpowiedź w JSON",
        },
        store: {
          label: "Zapis",
          description: "Odpowiedzi nigdy nie są zapisywane; wyślij false",
        },
        previousResponseId: {
          label: "ID poprzedniej odpowiedzi",
          description: "Nieobsługiwane: wyślij całą rozmowę",
        },
        include: {
          label: "Include",
          description:
            "Akceptowane dla zgodności. Elementy reasoning zawsze mają encrypted_content do ponownego użycia.",
        },
      },
      response: { object: "Typ obiektu" },
      success: {
        title: "Odpowiedź utworzona",
        description: "Model odpowiedział",
      },
    },
  },

  messages: {
    badContentBlock:
      "{{param}} zawiera blok, którego nie da się użyć: obrazy muszą być w base64 albo pod adresem http(s).",
    post: {
      title: "Anthropic Messages API",
      titleShort: "v1 messages",
      description:
        "Wywołaj dowolny model w formacie Anthropic Messages, którym mówi Claude Code. Klucz jako x-api-key albo Authorization: Bearer. Obsługuje streaming, narzędzia i bloki thinking.",
      fields: {
        model: {
          label: "Model",
          description:
            "ID modelu z GET /v1/models. ID Claude, np. claude-sonnet-4-5-20250929, trafiają do pasującego modelu Claude.",
        },
        messages: {
          label: "Wiadomości",
          description:
            "Wiadomości Anthropic: tury user i assistant z blokami text, image, tool_use, tool_result i thinking",
        },
        system: {
          label: "System",
          description: "Prompt systemowy: tekst albo bloki tekstu",
        },
        maxTokens: {
          label: "Maks. tokenów",
          description: "Górny limit generowanych tokenów",
        },
        stream: {
          label: "Stream",
          description: "Wyślij odpowiedź jako zdarzenia Anthropic (SSE)",
        },
        tools: {
          label: "Narzędzia",
          description:
            "Narzędzia klienta: [{name, description, input_schema}]. Narzędzia serwerowe (web_search, ...) są pomijane.",
        },
        toolChoice: {
          label: "Wybór narzędzia",
          description: "{type: auto | any | none | tool, name}",
        },
        stopSequences: {
          label: "Sekwencje stopu",
          description: "Ciągi znaków, które kończą odpowiedź",
        },
        temperature: {
          label: "Temperatura",
          description: "Temperatura próbkowania",
        },
        topP: { label: "Top P", description: "Próbkowanie nucleus, od 0 do 1" },
        thinking: {
          label: "Thinking",
          description:
            "Akceptowane dla zgodności. Modele rozumujące i tak zwracają bloki thinking.",
        },
      },
      response: { type: "Typ obiektu" },
      success: {
        title: "Wiadomość utworzona",
        description: "Model odpowiedział",
      },
    },
  },

  countTokens: {
    post: {
      title: "Liczenie tokenów Anthropic",
      titleShort: "v1 count tokens",
      description:
        "Szacuje tokeny wejściowe zapytania Anthropic Messages. Za darmo: bez wywołania modelu, bez kredytów.",
      fields: {
        action: { label: "Akcja", description: "Zawsze count_tokens" },
        model: { label: "Model", description: "ID modelu" },
        messages: { label: "Wiadomości", description: "Wiadomości Anthropic" },
        system: { label: "System", description: "Prompt systemowy" },
        tools: { label: "Narzędzia", description: "Definicje narzędzi" },
      },
      response: { inputTokens: "Tokeny wejściowe" },
      success: {
        title: "Tokeny policzone",
        description: "Szacowana liczba tokenów wejściowych",
      },
    },
  },

  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Nieprawidłowe żądanie",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Wymagany prawidłowy klucz API",
    },
    server: { title: "Błąd serwera", description: "Wewnętrzny błąd serwera" },
    unknown: { title: "Nieznany błąd", description: "Wystąpił nieznany błąd" },
    network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
    forbidden: { title: "Zabronione", description: "Odmowa dostępu" },
    notFound: { title: "Nie znaleziono", description: "Nie znaleziono modelu" },
    conflict: { title: "Konflikt", description: "Żądanie koliduje ze stanem" },
  },
};
