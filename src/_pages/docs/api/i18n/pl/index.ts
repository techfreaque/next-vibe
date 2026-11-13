import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Dokumentacja API {{appName}} - zgodne z OpenAI i Anthropic",
    description:
      "Jeden adres bazowy, {{modelCount}} modeli. OpenAI chat completions i Responses API, Anthropic Messages API, streaming, wywoływanie narzędzi. Codex CLI i Claude Code łączą się bezpośrednio. Płacisz za tokeny w kredytach.",
    category: "API",
    imageAlt: "Dokumentacja API {{appName}} zgodnego z OpenAI",
    keywords:
      "api, zgodne z openai, zgodne z anthropic, chat completions, responses api, messages api, codex cli, claude code, streaming, function calling, {{appName}}",
  },
  nav: {
    quickstart: "Szybki start",
    auth: "Uwierzytelnianie",
    models: "Modele",
    chat: "Chat completions",
    tools: "Wywoływanie narzędzi",
    responses: "Responses API",
    messages: "Messages API",
    billing: "Kredyty i rozliczenia",
    limits: "Limity zapytań",
    errors: "Błędy",
    codingTools: "Narzędzia do kodowania",
  },
  hero: {
    badge: "Zgodne z OpenAI i Anthropic",
    title: "Jeden adres bazowy.",
    titleHighlight: "Każdy model.",
    subtitle:
      "Skieruj dowolne SDK OpenAI albo Anthropic na {{appName}}. Codex CLI i Claude Code też. {{modelCount}} modeli, streaming, wywoływanie narzędzi. Twój klucz, twoje kredyty, żadnego nowego klienta do nauki.",
    ctaKey: "Weź klucz API",
    ctaPricing: "Zobacz plany",
  },
  quickstart: {
    title: "Pierwsze wywołanie w 60 sekund",
    intro:
      "API mówi formatem OpenAI i formatem Anthropic. Jeśli twój kod działa z którymś z nich, zadziała i tu po dwóch zmianach: adres bazowy i klucz.",
    baseUrlLabel: "Adres bazowy",
    anthropicBaseUrlLabel: "Adres bazowy Anthropic",
    anthropicBaseUrlNote:
      "Dla Claude Code i SDK Anthropic. Ten sam adres bez /v1: /v1/messages dopisują same.",
    baseUrlNote:
      "W ścieżce możesz użyć dowolnego języka (en-US, de-DE, pl-PL). Zmienia tylko język komunikatów o błędach.",
    step1: {
      title: "Weź klucz",
      description:
        "Utwórz klucz sk-unb w Ustawienia > Klucze API. Widać go tylko raz. API jest częścią każdego płatnego planu: odblokowuje je aktywna subskrypcja albo zakup pakietu kredytów.",
    },
    step2: {
      title: "Wyślij zapytanie",
      description: "Czyste HTTP. Działa w każdym języku.",
    },
    step3: {
      title: "Albo użyj SDK OpenAI",
      description: "Zmień baseURL i apiKey. Nic więcej.",
      python: "Python",
      node: "Node.js",
    },
  },
  access: {
    title: "Tylko plany płatne",
    body: "Tworzenie kluczy i wywołania /v1 wymagają płatnego konta: aktywnej subskrypcji albo co najmniej jednego zakupu kredytów. Konta na planie darmowym dostają HTTP 402 z kodem paid_plan_required, dokumentację nadal mogą czytać. Kredyty zostają twoje: kupujesz pakiet raz, a API działa, dopóki saldo się nie wyczerpie.",
  },
  auth: {
    title: "Uwierzytelnianie",
    intro:
      "Wysyłaj klucz w każdym zapytaniu jako token Bearer. Klucze zaczynają się od sk-unb-. Klienci Anthropic wysyłają go jako x-api-key i to też działa.",
    header: "Authorization: Bearer sk-unb-TWOJ_KLUCZ",
    headerAnthropic: "x-api-key: sk-unb-TWOJ_KLUCZ",
    points: {
      hash: "Przechowujemy hash, nie klucz. Zgubisz go, tworzysz nowy.",
      scope:
        "Klucz działa tylko na API: /v1/models, /v1/chat/completions, /v1/responses i /v1/messages. Nie dotknie konta, płatności ani ustawień.",
      limit:
        "Do 20 aktywnych kluczy na konto. Każdy klucz możesz unieważnić w dowolnej chwili: przestaje działać natychmiast.",
      missing:
        "Brak klucza albo klucz unieważniony zwraca 401. Klucz konta bez płatnego planu zwraca 402.",
    },
  },
  models: {
    title: "GET /v1/models",
    intro:
      "Zwraca modele, które twój klucz może teraz wywołać, z rozmiarem kontekstu, obsługą narzędzi i ceną w kredytach za milion tokenów. Użyj id jako pola model w zapytaniach.",
    note: "Lista zależy od twojego konta. Nieznane lub niedostępne id zwracają 404 model_not_found. Jedyne mapowanie: na /v1/messages ID Claude, które Claude Code wysyła domyślnie, trafiają do naszego najnowszego Claude z tej samej rodziny.",
  },
  chat: {
    title: "POST /v1/chat/completions",
    intro:
      "Standardowe chat completions w formacie OpenAI. Wiadomości na wejściu, jedna wiadomość asystenta na wyjściu. Wejście tekstowe i obrazy (image_url jako adres https albo base64 data URL).",
    nonStream: {
      title: "Bez streamingu",
      body: "Tryb domyślny. Dostajesz jedno ciało JSON, gdy model skończy. usage.credits_charged pokazuje, ile kosztowało wywołanie.",
    },
    stream: {
      title: "Streaming",
      body: "Z stream: true dostajesz zdarzenia server-sent w formacie chunków OpenAI, zakończone przez data: [DONE]. Dodaj stream_options.include_usage, by dostać ostatni chunk z liczbą tokenów i credits_charged. Zamknięcie połączenia zatrzymuje generowanie. Płacisz tylko za to, co się wykonało.",
    },
    paramsTitle: "Pola zapytania",
    paramsColumns: { field: "Pole", description: "Działanie" },
    params: {
      model: "Wymagane. Id modelu z GET /v1/models.",
      messages:
        "Wymagane. Wiadomości system, developer, user, assistant i tool. Treść user to string albo części text i image_url.",
      stream: "true dla zdarzeń server-sent. Domyślnie false.",
      streamOptions: "{ include_usage: true } dodaje końcowy chunk z użyciem.",
      maxTokens:
        "Górna granica generowanych tokenów. max_completion_tokens ma pierwszeństwo. Limit 32768.",
      temperature:
        "Od 0 do 2. Ignorowane przez modele, które tego nie obsługują.",
      topP: "Od 0 do 1.",
      stop: "Ciąg zatrzymujący albo ich lista.",
      n: "Obsługiwane jest tylko 1. Inne wartości zwracają 400.",
      tools:
        "Narzędzia funkcyjne, które model może wywołać. Zobacz wywoływanie narzędzi.",
      toolChoice: "none, auto, required albo jedna wskazana funkcja.",
    },
  },
  tools: {
    title: "Wywoływanie narzędzi",
    intro:
      "Function calling działa jak w OpenAI. Opisujesz funkcje, model decyduje się na wywołanie, ty je wykonujesz i odsyłasz wynik. Twoich narzędzi nigdy nie uruchamiamy.",
    flow: {
      title: "Pętla",
      step1: "Wyślij tools razem z wiadomościami.",
      step2:
        "Model odpowiada z tool_calls i finish_reason: tool_calls. Każde wywołanie ma id, nazwę funkcji i argumenty jako string JSON.",
      step3:
        "Wykonaj funkcję samodzielnie. Dołącz wiadomość asystenta, a potem po jednej wiadomości tool na wywołanie, z jej tool_call_id.",
      step4: "Wywołaj ponownie. Model użyje wyników i odpowie.",
    },
    requestTitle: "1. Zapytanie z narzędziami",
    responseTitle: "2. Model prosi o wywołanie",
    followUpTitle: "3. Odeślij wynik",
    sdkTitle: "Ta sama pętla w SDK Pythona",
    streamingTitle: "Wywołania narzędzi w streamie",
    streamingBody:
      "Z stream: true wywołania przychodzą jako chunki delta.tool_calls, adresowane przez index. Pierwszy chunk danego indeksu niesie id i function.name. Kolejne dopisują do function.arguments. Złóż je w całość i sparsuj JSON, gdy finish_reason to tool_calls. Każde SDK OpenAI robi to za ciebie.",
    rules: {
      title: "Zasady",
      support:
        "Model musi obsługiwać narzędzia: sprawdź supports_tools w GET /v1/models. Pozostałe zwracają 400 tools_not_supported.",
      choice:
        "tool_choice none, auto i required działają jak w OpenAI. Funkcja spoza tools zwraca 400.",
      names:
        "Nazwy funkcji: litery, cyfry, podkreślenie, myślnik, do 64 znaków.",
      billing:
        "Definicje narzędzi i ich wyniki to tokeny wejściowe. Wywołania to tokeny wyjściowe. Rozliczane są jak wszystkie inne tokeny.",
    },
  },
  billing: {
    title: "Kredyty i rozliczenia",
    intro:
      "API czerpie z tych samych kredytów co czat, po tych samych cenach. Jedno saldo, jeden rachunek.",
    points: {
      price:
        "Koszt = tokeny wejściowe plus wyjściowe po cenie modelu w kredytach. Ceny za milion tokenów podaje GET /v1/models.",
      usage:
        "Każda odpowiedź zawiera usage.credits_charged. Saldo znajdziesz w aplikacji w zakładce Kredyty.",
      preflight:
        "Przed wywołaniem porównujemy saldo z oszacowaniem na najgorszy przypadek. Za mało: HTTP 402 insufficient_credits, nic się nie wykonuje, nic nie jest pobierane.",
      real: "Po wywołaniu płacisz za rzeczywiste zużycie tokenów zgłoszone przez dostawcę, nie za oszacowanie.",
      topup:
        "Skończyły się kredyty? Kup pakiet albo odnów plan. Następne wywołanie działa od razu.",
    },
  },
  limits: {
    title: "Limity zapytań",
    body: "Każdy klucz domyślnie pozwala na 60 zapytań na minutę. Powyżej limitu dostajesz HTTP 429 z nagłówkiem Retry-After w sekundach. Odczekaj tyle i spróbuj ponownie. Limity są na klucz, więc większe obciążenia rozłóż na kilka kluczy.",
  },
  errors: {
    title: "Błędy",
    intro:
      "Błędy mają kopertę OpenAI, więc SDK zgłaszają swoje zwykłe wyjątki. Opieraj się na error.code, nie na treści komunikatu.",
    columns: { status: "HTTP", code: "code", meaning: "Znaczenie" },
    rows: {
      missingKey:
        "Nie wysłano klucza. Wyślij Authorization: Bearer sk-unb-... albo x-api-key.",
      invalidKey: "Klucz jest błędny albo unieważniony.",
      paid: "Konto nie ma płatnego planu. Wykup subskrypcję albo kup kredyty.",
      credits: "Saldo za niskie na to wywołanie. Doładuj.",
      cap: "Osiągnięty dzienny limit planu darmowego. Kredyty to naprawiają.",
      notFound: "Model nie istnieje albo nie jest dla ciebie dostępny.",
      invalid:
        "Błędne zapytanie: nieobsługiwany parametr, zły tool_choice, zły adres obrazu.",
      rate: "Ponad 60 zapytań na minutę dla tego klucza. Przeczytaj Retry-After.",
      upstream:
        "Dostawca modelu zawiódł. Ponowienie jest bezpieczne. Streamy kończą się zdarzeniem błędu.",
      balance: "Nie udało się odczytać salda, więc nic nie ruszyło. Ponów.",
    },
    streamNote:
      "Błędy w trakcie streamu przychodzą jako zdarzenie data: z tym samym obiektem błędu, po którym następuje data: [DONE].",
  },
  responses: {
    title: "POST /v1/responses",
    intro:
      "OpenAI Responses API, czyli format, którym mówi Codex CLI. Te same modele, klucz, kredyty i limity co w chat completions.",
    request: {
      title: "Zapytanie",
      body: "input to tekst albo lista elementów wejściowych. instructions to prompt systemowy. Odpowiedź przychodzi jako elementy output, a każde SDK OpenAI daje ci też output_text.",
    },
    stream: {
      title: "Streaming",
      body: "Ustaw stream: true, a dostaniesz strumień zdarzeń Responses: response.created, delty tekstu, na końcu response.completed z usage.",
    },
    points: {
      tools:
        "Narzędzia: function, custom i local_shell. Wywołania modelu wracają jako elementy output. Każdy wynik odsyłasz jako element function_call_output z tym samym call_id.",
      reasoning:
        "Modele rozumujące zwracają elementy reasoning obok odpowiedzi.",
      billing:
        "Rozliczenia, ID modeli, błędy i limity działają dokładnie jak w chat completions.",
    },
    sdkTitle: "Z SDK OpenAI dla Pythona",
  },
  messages: {
    title: "POST /v1/messages",
    intro:
      "Anthropic Messages API, czyli format Claude Code i SDK Anthropic. Użyj adresu bazowego bez /v1: klienci sami dopisują /v1/messages.",
    request: {
      title: "Zapytanie",
      body: "Standardowe zapytanie Messages: model, max_tokens, system, messages. Bloki tekstu i obrazów na wejściu, bloki tekstu i tool_use na wyjściu.",
    },
    stream: {
      title: "Streaming",
      body: "Ustaw stream: true, a dostaniesz zdarzenia SSE w formacie Anthropic, od message_start do message_stop.",
    },
    points: {
      auth: "Uwierzytelnianie: x-api-key albo Authorization: Bearer. Oba przyjmują twój klucz sk-unb.",
      models:
        "Model: dowolne ID z GET /v1/models. ID Anthropic, które Claude Code wysyła domyślnie, na przykład claude-sonnet-4-5-20250929, trafiają do naszego odpowiadającego modelu Claude.",
      tools:
        "Narzędzia: bloki tool_use wychodzą, bloki tool_result wracają, jak w API Anthropic.",
      billing:
        "Te same kredyty, te same ceny, te same limity co na każdym innym endpoincie.",
    },
    countTokens: {
      title: "POST /v1/messages/count_tokens",
      body: "Liczy tokeny wejściowe zapytania Messages bez uruchamiania modelu. Claude Code korzysta z tego, żeby pilnować kontekstu.",
    },
    sdkTitle: "Z SDK Anthropic dla Pythona",
  },
  codingTools: {
    title: "Użyj w swoim agencie kodującym",
    intro:
      "Jeden adres bazowy, jeden klucz. Codex CLI i Claude Code łączą się natywnie. OpenCode, Continue, Aider i Cline działają przez chat completions. Kopiujesz blok, uruchamiasz.",
    keyPage:
      "Strona Klucze API pokazuje te same bloki z twoim kluczem już wpisanym.",
    keyPageCta: "Weź je z własnym kluczem",
    guide: "Przeczytaj przewodnik po narzędziach",
  },
  cta: {
    title: "Buduj na każdym modelu.",
    subtitle: "Utwórz klucz, przełącz SDK, wypuść.",
    button: "Utwórz klucz API",
    secondary: "Porównaj plany",
  },
};
