import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Dokumentacja API {{appName}} - zgodne z OpenAI i Anthropic",
    description:
      "Jeden adres bazowy, {{modelCount}} modeli czatu. OpenAI chat completions i Responses API, Anthropic Messages API, streaming, wywoływanie narzędzi. Do tego obrazy, mowa, transkrypcja, wideo i muzyka w formacie OpenAI. Codex CLI i Claude Code łączą się bezpośrednio. Płacisz kredytami.",
    category: "API",
    imageAlt: "Dokumentacja API {{appName}} zgodnego z OpenAI",
    keywords:
      "api, zgodne z openai, zgodne z anthropic, chat completions, responses api, messages api, codex cli, claude code, streaming, function calling, api generowania obrazów, api text to speech, api whisper, api generowania wideo, api generowania muzyki, {{appName}}",
  },
  toc: {
    title: "Na tej stronie",
    mobileTitle: "Przejdź do",
    groups: {
      start: "Pierwsze kroki",
      chat: "Czat",
      media: "Multimedia",
      reference: "Dokumentacja",
      integrations: "Integracje",
    },
  },
  nav: {
    quickstart: "Szybki start",
    auth: "Uwierzytelnianie",
    access: "Dostęp i ceny",
    models: "Modele",
    chat: "Chat completions",
    tools: "Wywoływanie narzędzi",
    responses: "Responses API",
    messages: "Messages API",
    billing: "Kredyty i rozliczenia",
    errors: "Błędy i limity",
    codingTools: "Narzędzia do kodowania",
    sdks: "Przykłady SDK",
    guides: "Poradniki",
    images: "Obrazy",
    speech: "Zamiana tekstu na mowę",
    transcriptions: "Transkrypcja",
    videos: "Wideo",
    music: "Muzyka",
    mediaFiles: "Pliki multimedialne",
  },
  hero: {
    badge: "Dokumentacja API",
    title: "Jeden adres bazowy.",
    titleHighlight: "Każdy model.",
    subtitle:
      "Skieruj dowolne SDK OpenAI albo Anthropic na {{appName}}. Codex CLI i Claude Code też. Obrazy, głos, wideo i muzyka na tym samym kluczu. Żadnego nowego klienta do nauki.",
    ctaKey: "Weź klucz API",
    ctaPricing: "Zobacz plany",
    quickstartLink: "Szybki start w 3 krokach",
    facts: {
      models: "{{modelCount}} modeli czatu",
      formats: "Format OpenAI i Anthropic",
      streaming: "Streaming i narzędzia",
      rate: "{{rate}} zapytań na minutę na klucz",
    },
  },
  code: {
    copy: "Kopiuj",
    wrap: "Zawijaj",
    copied: "Skopiowano",
    request: "Zapytanie",
    response: "Odpowiedź",
    stream: "Stream",
    showResponse: "Przykładowa odpowiedź",
    showStream: "Przykładowy stream",
    showObject: "Gotowy obiekt zadania",
  },
  quickstart: {
    title: "Szybki start",
    intro:
      "API mówi formatem OpenAI i formatem Anthropic. Jeśli twój kod działa z którymś z nich, zadziała i tu po dwóch zmianach: adres bazowy i klucz.",
    baseUrlLabel: "Adres bazowy OpenAI",
    anthropicBaseUrlLabel: "Adres bazowy Anthropic",
    anthropicBaseUrlNote:
      "Dla Claude Code i SDK Anthropic. Bez `/v1` na końcu: `/v1/messages` dopisują same.",
    baseUrlNote:
      "W ścieżce możesz użyć dowolnego języka (en-US, de-DE, pl-PL). Zmienia tylko język komunikatów o błędach.",
    envLabel: "Albo ustaw raz dla każdego SDK OpenAI",
    step1: {
      title: "Utwórz klucz",
      description:
        "Otwórz Klucze API na swoim koncie, nazwij klucz, skopiuj go. Zobaczysz go tylko raz.",
      cta: "Otwórz Klucze API",
    },
    step2: {
      title: "Ustaw adres bazowy",
      description:
        "Podmień adres bazowy w swoim kliencie. Klienci Anthropic biorą drugi.",
    },
    step3: {
      title: "Wyślij zapytanie",
      description:
        "Wklej do terminala, wpisz swój klucz, uruchom. To samo wywołanie w Pythonie i JavaScripcie.",
    },
  },
  access: {
    title: "Dostęp i ceny",
    intro:
      "API działa na tych samych kredytach co czat. Bez osobnego planu API, bez opłat za stanowisko.",
    unlockTitle: "Co odblokowuje API",
    plan: "Dowolny plan, od {{subPrice}} miesięcznie. Każdy plan daje kredyty co miesiąc.",
    grant: "Kredyty przyznane przez nasz zespół, np. kredyty testerskie.",
    never:
      "Darmowe kredyty nigdy go nie odblokowują: miesięczny przydział, bonus za rejestrację i newsletter, zarobki z poleceń.",
    withoutTitle: "Bez zakupu",
    locked:
      "Konto bez zakupu nie utworzy klucza, a każde wywołanie `/v1` zwraca HTTP 402 `paid_plan_required`.",
    topup:
      "Potrzebujesz więcej? Subskrybenci dokupują pakiety kredytów od {{packPrice}}. Kredyty z pakietów nigdy nie wygasają.",
    ctaUnlock: "Zobacz plany",
    ctaKeys: "Otwórz Klucze API",
  },
  auth: {
    title: "Uwierzytelnianie",
    intro:
      "Wysyłaj klucz w każdym zapytaniu jako token Bearer. Klucze zaczynają się od `sk-unb-`. Klienci Anthropic wysyłają go jako `x-api-key` i to też działa.",
    header: "Authorization: Bearer sk-unb-TWOJ_KLUCZ",
    headerAnthropic: "x-api-key: sk-unb-TWOJ_KLUCZ",
    headerTab: "Format OpenAI",
    headerAnthropicTab: "Format Anthropic",
    points: {
      hash: "Przechowujemy hash, nie klucz. Zgubisz go, tworzysz nowy.",
      scope:
        "Klucz działa tylko na API: `/v1/models`, czat (`/v1/chat/completions`, `/v1/responses`, `/v1/messages`) i multimedia (`/v1/images`, `/v1/audio`, `/v1/videos`, `/v1/music`, `/v1/media`). Nie dotknie konta, płatności ani ustawień.",
      limit:
        "Do {{maxKeys}} aktywnych kluczy na konto. Każdy klucz możesz unieważnić w dowolnej chwili: przestaje działać natychmiast.",
      missing:
        "Brak klucza albo klucz unieważniony zwraca 401. Klucz konta bez żadnego zakupu zwraca 402.",
    },
  },
  models: {
    title: "Modele",
    intro:
      "`GET /v1/models` zwraca modele, które twój klucz może teraz wywołać, z rozmiarem kontekstu, obsługą narzędzi i ceną w kredytach za milion tokenów. Użyj id jako pola model w zapytaniach.",
    note: "Lista zależy od twojego konta. Nieznane lub niedostępne id zwracają 404 `model_not_found`. Jedyne mapowanie: na `/v1/messages` ID Claude, które Claude Code wysyła domyślnie, trafiają do naszego najnowszego Claude z tej samej rodziny.",
    browse: "Przeglądaj wszystkie modele z cenami i filtrami",
    media: {
      title: "Modele multimedialne na tej samej liście",
      body: "Modele obrazów, wideo, muzyki, głosu i transkrypcji są na tej samej liście. Każdy wpis mówi, co model robi i gdzie go wywołać.",
      filename: "wpis multimedialny",
      points: {
        modality:
          "modality to chat, image, video, music, speech albo transcription. endpoints podaje ścieżki, które przyjmują model.",
        pricing:
          "Ceny multimediów są za jednostkę: `credits_per_image`, `credits_per_second` (wideo), `credits_per_clip` (muzyka), `credits_per_1k_characters` (mowa), `credits_per_minute` (transkrypcja).",
        anthropic:
          "Klienci Anthropic (nagłówek `anthropic-version`) dostają tylko modele czatu. Modeli, których dostawca nie jest u nas skonfigurowany, nie ma na liście i odpowiadają 404 `model_not_found`.",
      },
    },
  },
  chat: {
    title: "Chat completions",
    intro:
      "Standardowe chat completions w formacie OpenAI. Wiadomości na wejściu, jedna wiadomość asystenta na wyjściu. Wejście tekstowe i obrazy (`image_url` jako adres https albo base64 data URL).",
    nonStream: {
      title: "Bez streamingu",
      body: "Tryb domyślny. Dostajesz jedno ciało JSON, gdy model skończy. `usage.credits_charged` pokazuje, ile kosztowało wywołanie.",
    },
    stream: {
      title: "Streaming",
      body: "Z `stream: true` dostajesz zdarzenia server-sent w formacie chunków OpenAI, zakończone przez `data: [DONE]`. Dodaj `stream_options.include_usage`, by dostać ostatni chunk z liczbą tokenów i `credits_charged`. Zamknięcie połączenia zatrzymuje generowanie. Płacisz tylko za to, co się wykonało.",
    },
    paramsTitle: "Pola zapytania",
    paramsColumns: { field: "Pole", description: "Działanie" },
    params: {
      model: "Wymagane. Id modelu z `GET /v1/models`.",
      messages:
        "Wymagane. Wiadomości system, developer, user, assistant i tool. Treść user to string albo części text i `image_url`.",
      stream: "true dla zdarzeń server-sent. Domyślnie false.",
      streamOptions:
        "`{ include_usage: true }` dodaje końcowy chunk z użyciem.",
      maxTokens:
        "Górna granica generowanych tokenów. `max_completion_tokens` ma pierwszeństwo. Limit {{maxTokens}}.",
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
        "Model odpowiada z `tool_calls` i `finish_reason: tool_calls`. Każde wywołanie ma id, nazwę funkcji i argumenty jako string JSON.",
      step3:
        "Wykonaj funkcję samodzielnie. Dołącz wiadomość asystenta, a potem po jednej wiadomości tool na wywołanie, z jej `tool_call_id`.",
      step4: "Wywołaj ponownie. Model użyje wyników i odpowie.",
    },
    requestTitle: "1. Zapytanie z narzędziami",
    responseTitle: "2. Model prosi o wywołanie",
    followUpTitle: "3. Odeślij wynik",
    sdkTitle: "Ta sama pętla w SDK Pythona",
    streamingTitle: "Wywołania narzędzi w streamie",
    streamingBody:
      "Z `stream: true` wywołania przychodzą jako chunki `delta.tool_calls`, adresowane przez index. Pierwszy chunk danego indeksu niesie id i `function.name`. Kolejne dopisują do `function.arguments`. Złóż je w całość i sparsuj JSON, gdy `finish_reason` to `tool_calls`. Każde SDK OpenAI robi to za ciebie.",
    rules: {
      title: "Zasady",
      support:
        "Model musi obsługiwać narzędzia: sprawdź `supports_tools` w `GET /v1/models`. Pozostałe zwracają 400 `tools_not_supported`.",
      choice:
        "`tool_choice` none, auto i required działają jak w OpenAI. Funkcja spoza tools zwraca 400.",
      names:
        "Nazwy funkcji: litery, cyfry, podkreślenie, myślnik, do 64 znaków.",
      billing:
        "Definicje narzędzi i ich wyniki to tokeny wejściowe. Wywołania to tokeny wyjściowe. Rozliczane są jak wszystkie inne tokeny.",
    },
  },
  billing: {
    title: "Kredyty i rozliczenia",
    intro:
      "API czerpie z tych samych kredytów co czat i rozlicza się według tych samych zasad. Jedno saldo, jeden rachunek.",
    points: {
      price:
        "Koszt = tokeny wejściowe plus wyjściowe po cenie modelu w kredytach, podanej za milion tokenów w `GET /v1/models`. Wyjątek to modele OpenRouter: płacisz tyle, ile dostawca naprawdę policzył za wywołanie, plus naszą marżę. Ich cena na liście to szacunek. Czat rozlicza je tak samo.",
      usage:
        "Każda odpowiedź zawiera `usage.credits_charged`. Saldo znajdziesz w aplikacji w zakładce Kredyty.",
      preflight:
        "Przed wywołaniem porównujemy saldo z oszacowaniem na najgorszy przypadek. Za mało: HTTP 402 `insufficient_credits`, nic się nie wykonuje, nic nie jest pobierane.",
      real: "Po wywołaniu płacisz za rzeczywiste zużycie, nie za oszacowanie: liczbę tokenów zgłoszoną przez dostawcę, a przy modelach OpenRouter jego prawdziwy koszt. Gdy dostawca nie poda kosztu, obowiązuje cena z listy.",
      media:
        "Wywołania multimedialne rozliczają się tak samo: realny koszt dostawcy plus nasza marża, gdy dostawca go podaje, w innym wypadku cena z listy. Obrazy za sztukę, mowa za znaki, transkrypcja za sekundę nagrania, wideo gdy klip jest gotowy, muzyka za klip.",
      topup:
        "Skończyły się kredyty? Dokup pakiet, odnów albo podnieś plan. Następne wywołanie działa od razu.",
    },
  },
  limits: {
    title: "Limity zapytań",
    body: "Każdy klucz domyślnie pozwala na {{rate}} zapytań na minutę. Powyżej limitu dostajesz HTTP 429 z nagłówkiem `Retry-After` w sekundach. Odczekaj tyle i spróbuj ponownie. Limity są na klucz, więc większe obciążenia rozłóż na kilka kluczy.",
  },
  errors: {
    title: "Błędy i limity",
    intro:
      "Błędy mają kopertę OpenAI, więc SDK zgłaszają swoje zwykłe wyjątki. Opieraj się na `error.code`, nie na treści komunikatu.",
    shapeTitle: "Treść błędu",
    shapeOpenAi: "Format OpenAI",
    shapeAnthropic: "Format Anthropic",
    codesTitle: "Kody błędów",
    columns: { status: "HTTP", code: "code", meaning: "Znaczenie" },
    rows: {
      missingKey:
        "Nie wysłano klucza. Wyślij `Authorization: Bearer sk-unb-...` albo `x-api-key`.",
      invalidKey: "Klucz jest błędny albo unieważniony.",
      paid: "Na koncie nie ma jeszcze żadnego zakupu. Odblokuje je dowolny plan.",
      credits: "Saldo za niskie na to wywołanie. Doładuj.",
      cap: "Płatne saldo puste i dzienny limit darmowych kredytów osiągnięty. Doładuj.",
      notFound: "Model nie istnieje albo nie jest dla ciebie dostępny.",
      invalid:
        "Błędne zapytanie: nieobsługiwany parametr, zły `tool_choice`, zły adres obrazu.",
      contentPolicy:
        "Dostawca multimediów odrzucił prompt. Nic nie pobieramy. Przeformułuj albo wybierz inny model.",
      consent:
        "Modele bez cenzury wymagają jednorazowego potwierdzenia 18+ na koncie. Potwierdź raz na stronie Klucze API i wyślij ponownie.",
      rate: "Ponad {{rate}} zapytań na minutę dla tego klucza. Przeczytaj `Retry-After`.",
      upstream:
        "Dostawca modelu zawiódł. Ponowienie jest bezpieczne. Streamy kończą się zdarzeniem błędu.",
      balance: "Nie udało się odczytać salda, więc nic nie ruszyło. Ponów.",
    },
    streamNote:
      "Błędy w trakcie streamu przychodzą jako zdarzenie data: z tym samym obiektem błędu, po którym następuje `data: [DONE]`.",
  },
  responses: {
    title: "Responses API",
    intro:
      "OpenAI Responses API, czyli format, którym mówi Codex CLI. Te same modele, klucz, kredyty i limity co w chat completions.",
    request: {
      title: "Zapytanie",
      body: "input to tekst albo lista elementów wejściowych. instructions to prompt systemowy. Odpowiedź przychodzi jako elementy output, a każde SDK OpenAI daje ci też `output_text`.",
    },
    stream: {
      title: "Streaming",
      body: "Ustaw `stream: true`, a dostaniesz strumień zdarzeń Responses: `response.created`, delty tekstu, na końcu `response.completed` z usage.",
    },
    points: {
      tools:
        "Narzędzia: function, custom i `local_shell`. Wywołania modelu wracają jako elementy output. Każdy wynik odsyłasz jako element `function_call_output` z tym samym `call_id`.",
      reasoning:
        "Modele rozumujące zwracają elementy reasoning obok odpowiedzi.",
      billing:
        "Rozliczenia, ID modeli, błędy i limity działają dokładnie jak w chat completions.",
    },
  },
  messages: {
    title: "Messages API",
    intro:
      "Anthropic Messages API, czyli format Claude Code i SDK Anthropic. Użyj adresu bazowego bez `/v1`: klienci sami dopisują `/v1/messages`.",
    request: {
      title: "Zapytanie",
      body: "Standardowe zapytanie Messages: model, `max_tokens`, system, messages. Bloki tekstu i obrazów na wejściu, bloki tekstu i `tool_use` na wyjściu.",
    },
    stream: {
      title: "Streaming",
      body: "Ustaw `stream: true`, a dostaniesz zdarzenia SSE w formacie Anthropic, od `message_start` do `message_stop`.",
    },
    points: {
      auth: "Uwierzytelnianie: `x-api-key` albo `Authorization: Bearer`. Oba przyjmują twój klucz sk-unb.",
      models:
        "Model: dowolne ID z `GET /v1/models`. ID Anthropic, które Claude Code wysyła domyślnie, na przykład `claude-sonnet-4-5-20250929`, trafiają do naszego odpowiadającego modelu Claude.",
      tools:
        "Narzędzia: bloki `tool_use` wychodzą, bloki `tool_result` wracają, jak w API Anthropic.",
      billing:
        "Te same kredyty, te same ceny, te same limity co na każdym innym endpoincie.",
    },
    countTokens: {
      title: "Liczenie tokenów",
      body: "`POST /v1/messages/count_tokens` liczy tokeny wejściowe zapytania Messages bez uruchamiania modelu. Claude Code korzysta z tego, żeby pilnować kontekstu.",
    },
  },
  images: {
    title: "Obrazy",
    intro:
      "Format obrazów OpenAI. Każdy model z modality image z `GET /v1/models`. Działa z klientem images w każdym SDK OpenAI.",
    generate: {
      title: "Generowanie",
      body: "Wyślij JSON z tymi polami. Odpowiedź zawiera jeden url na obraz.",
    },
    params: {
      model: "Wymagane. Dowolne id z modality `image` z `GET /v1/models`.",
      prompt: "Wymagane. Co narysować, do 2000 znaków.",
      n: "Obrazów na wywołanie, od 1 do {{maxImages}}. Każdy jest płatny.",
      size: "`SZEROKOŚĆxWYSOKOŚĆ`, np. `1024x1024`, albo `auto`. Wybieramy najbliższy rozmiar, który model renderuje.",
      aspectRatio:
        "Nasze rozszerzenie: `1:1 | 16:9 | 9:16 | 4:3 | 3:4 | 3:2 | 2:3 | 21:9`. Ma pierwszeństwo przed size.",
      quality:
        "`standard | hd | low | medium | high | auto`. `hd` i `high` proszą o dokładniejszy poziom, jeśli model go ma.",
      responseFormat:
        "`url` (domyślnie, podpisany link ważny 7 dni) albo `b64_json`.",
    },
    edit: {
      title: "Edycja obrazu",
      body: "Jeden obraz wejściowy plus prompt. Wyślij go jako pole multipart image albo podaj `image_url` (https lub base64 data URL) w JSON. Model musi przyjmować obraz: `input_modalities` zawiera image. Maski nie są obsługiwane; opisz zmianę w prompcie.",
    },
    points: {
      size: "Dobieramy najbliższy rozmiar i proporcje, które model generuje.",
      format:
        "url to podpisany link do zapisanego pliku, ważny 7 dni bez klucza. `b64_json` zwraca bajty od razu w odpowiedzi.",
      billing:
        "Płacisz za każdy obraz. `credits_charged` w odpowiedzi mówi, ile kosztowało wywołanie.",
    },
  },
  speech: {
    title: "Zamiana tekstu na mowę",
    intro:
      "Tekst na wejściu, bajty audio na wyjściu. model to ID głosu z `GET /v1/models` (modality speech), np. `openai-nova`. Styl OpenAI też działa: model `tts-1` z voice nova.",
    points: {
      voices:
        "input do {{maxChars}} znaków. speed od 0.25 do 4 dla głosów OpenAI, NanoGPT i ElevenLabs.",
      formats:
        "`response_format` mp3 (domyślnie), opus, aac, flac, wav lub pcm. Dostępne formaty zależą od dostawcy głosu; inne zwracają 400 z listą.",
      billing:
        "Płacisz za znaki. Nagłówek `X-Credits-Charged` mówi, ile kosztowało wywołanie.",
    },
  },
  transcriptions: {
    title: "Transkrypcja",
    intro:
      "Mowa na tekst w formacie OpenAI Whisper. Upload multipart, to samo wywołanie SDK, którego już używasz.",
    transcribe: {
      title: "Transkrypcja",
      body: "file do {{maxMb}} MB (mp3, mp4, m4a, wav, webm, ogg, flac), model np. `whisper-1`, opcjonalnie language. `response_format` json, text, srt, `verbose_json` lub vtt.",
    },
    translate: {
      title: "Tłumaczenie na angielski",
      body: "`POST /v1/audio/translations`: dowolny język mówiony na wejściu, angielski tekst na wyjściu. Działa na `whisper-1`. Te same formaty co transkrypcja.",
    },
    points: {
      billing: "Płacisz za sekundę nagrania.",
    },
  },
  videos: {
    title: "Wideo",
    intro:
      "Asynchronicznie, w formacie API wideo OpenAI. Wywołanie od razu zwraca zadanie. Sprawdzaj status, potem pobierz MP4.",
    create: {
      title: "Uruchom zadanie",
      body: "model, prompt, seconds, size albo `aspect_ratio`, resolution, `negative_prompt`. Odpowiedź to obiekt wideo ze status queued.",
    },
    poll: {
      title: "Sprawdzanie i pobieranie",
      body: "`GET /v1/videos/{id}` zwraca status (queued, `in_progress`, completed, failed), progress, a na końcu podpisany url. Sprawdzanie jest darmowe i nie wlicza się do limitu zapytań. `GET /v1/videos/{id}/content` przesyła MP4.",
    },
    points: {
      image:
        "Obraz na wideo: wyślij `image_url` w JSON albo `input_reference` jako upload multipart. Stanie się pierwszą klatką.",
      billing:
        "Płacisz, gdy wideo jest gotowe, za sekundę wideo. `credits_charged` pokazuje koszt.",
      failed: "Nieudane zadanie nic nie kosztuje. error mówi dlaczego.",
    },
  },
  music: {
    title: "Muzyka",
    intro:
      "Asynchronicznie, jak wideo. Uruchom zadanie, sprawdzaj `GET /v1/music/{id}`, pobierz `GET /v1/music/{id}/content`.",
    startTitle: "Uruchom zadanie",
    pollTitle: "Sprawdzanie i pobieranie",
    points: {
      seconds:
        "seconds: około 8, 20 lub 30. Model może zaokrąglić. Styl, nastrój, instrumenty i tempo opisz w prompt.",
      billing:
        "Płacisz za klip, gdy jest gotowy. Nieudane zadanie nic nie kosztuje.",
    },
  },
  mediaFiles: {
    title: "Pliki multimedialne",
    intro:
      "Każdy url w odpowiedzi multimedialnej prowadzi tutaj. Podpisany link działa bez klucza przez 7 dni, więc możesz dać go przeglądarce albo użytkownikowi. Z twoim kluczem API ta sama ścieżka działa zawsze.",
  },
  codingTools: {
    title: "Narzędzia do kodowania",
    intro:
      "Jeden adres bazowy, jeden klucz. Codex CLI i Claude Code łączą się natywnie. OpenCode, Continue, Aider i Cline działają przez chat completions. Wybierasz narzędzie, kopiujesz blok, uruchamiasz.",
    keyPage:
      "Strona Klucze API pokazuje te same bloki z twoim kluczem już wpisanym.",
    keyPageCta: "Weź je z własnym kluczem",
    guide: "Przeczytaj przewodnik po narzędziach",
  },
  sdks: {
    title: "Przykłady SDK",
    intro:
      "Oficjalne SDK OpenAI i Anthropic działają bez zmian. Ustaw adres bazowy i klucz, reszta kodu zostaje.",
    chat: "Czat",
    stream: "Streaming",
    responses: "Responses API",
    anthropic: "SDK Anthropic",
    images: "Obrazy",
    speech: "Mowa",
    transcription: "Transkrypcja",
  },
  guides: {
    title: "Poradniki",
    intro:
      "Dłuższe przewodniki: przejście z OpenAI lub OpenRoutera, modele bez cenzury przez API i podpięcie klucza do narzędzi programistycznych.",
  },
  cta: {
    title: "Buduj na każdym modelu.",
    subtitle: "Utwórz klucz, przełącz SDK, wypuść.",
    button: "Utwórz klucz API",
    secondary: "Porównaj plany",
  },
};
