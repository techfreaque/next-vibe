import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "AI",

  tags: {
    api: "API zgodne z OpenAI",
  },

  openai: {
    missingKey:
      "Brak klucza API. Wyślij go jako 'Authorization: Bearer <klucz>'. Utwórz klucz w Ustawienia > Klucze API.",
    invalidKey:
      "Nieprawidłowy lub unieważniony klucz API. Sprawdź klucz albo utwórz nowy w Ustawienia > Klucze API.",
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
