import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "{{modelCount}} modeli, jedno API: zgodne z OpenAI i Anthropic | {{appName}}",
    description:
      "Jeden klucz {{appName}} do {{modelCount}} modeli. OpenAI chat completions, Responses API i Anthropic Messages pod jednym endpointem. Działa z Claude Code i Codex CLI.",
    category: "Przewodnik dla programistów",
    imageAlt: "{{appName}}: jeden endpoint API dla każdego modelu",
    keywords:
      "{{appName}}, alternatywa dla OpenRouter, OpenRouter alternative, jedno API do GPT Claude Gemini, API kompatybilne z OpenAI, API zgodne z OpenAI, OpenAI compatible API, API zgodne z Anthropic, Anthropic Messages API, Responses API, Claude Code z innymi modelami, Codex CLI własny dostawca, bramka LLM API, modele niecenzurowane API",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Przewodnik dla programistów",
    readTime: "11 min czytania",
    title: "Jeden klucz API. {{modelCount}} modeli. Trzy formaty.",
    subtitle:
      "{{appName}} mówi OpenAI chat completions, OpenAI Responses API i Anthropic Messages API pod jednym endpointem. Twoje SDK zostaje. Twoje narzędzia zostają. Zmieniasz tylko adres bazowy.",
  },
  intro: {
    lead: "GPT od OpenAI, Claude od Anthropic, Gemini od Google. Trzy SDK, trzy klucze, trzy rachunki, trzy panele. Albo gorzej: twoje ulubione narzędzie mówi tylko jednym formatem, więc dostaje modele tylko jednego dostawcy.",
    p2: "{{appName}} daje {{modelCount}} modeli czatu z {{providerCount}} laboratoriów pod jednym kluczem i jednym saldem kredytów. Wołasz je w formacie OpenAI, Responses albo Anthropic. Te same modele na każdym endpoincie. Poniżej dokładnie: jak to działa, ile kosztuje i kiedy lepiej iść bezpośrednio do dostawcy albo do routera.",
  },
  endpoints: {
    title: "Pięć endpointów, jeden klucz",
    intro:
      "Każdy endpoint przyjmuje ten sam klucz, pobiera z tego samego salda i obsługuje te same modele.",
    chat: "POST /v1/chat/completions: OpenAI Chat Completions. Streaming przez SSE zakończony data: [DONE], stream_options.include_usage, wywołania narzędzi. Format, którym mówi prawie każdy klient zgodny z OpenAI.",
    responses:
      "POST /v1/responses: OpenAI Responses API, format, którym mówi Codex CLI. Streaming i narzędzia. Bezstanowe: store ma wartość false, a previous_response_id kończy się błędem 400. Wysyłaj więc pełny input w każdej turze.",
    messages:
      "POST /v1/messages: Anthropic Messages API. Streaming i tool use. Z tym rozmawiają Claude Code i SDK Anthropic.",
    countTokens:
      "POST /v1/messages/count_tokens: za darmo. Lokalne oszacowanie bez wywołania modelu, które nie zjada limitu zapytań na minutę. Claude Code woła go non stop, żeby mierzyć swój kontekst.",
    models:
      "GET /v1/models: każdy model, który twój klucz może teraz wywołać, z długością kontekstu, obsługą narzędzi i cenami. Jedna odpowiedź, którą parsują zarówno SDK OpenAI, jak i Anthropic.",
    auth: "Uwierzytelnianie działa na dwa sposoby, na każdym endpoincie. Authorization: Bearer sk-unb-... dla klientów OpenAI i dla Claude Code z ANTHROPIC_AUTH_TOKEN. x-api-key: sk-unb-... dla SDK Anthropic. Klucze zaczynają się od sk-unb-, widzisz je tylko raz, a my przechowujemy wyłącznie hash. Tworzysz je w Ustawienia > Klucze API, do 20 aktywnych kluczy na konto.",
    baseUrlLabel: "Adres bazowy",
    baseUrlNote:
      "Dla SDK OpenAI i narzędzi w stylu OpenAI. Locale jest częścią ścieżki. Zmienia tylko język komunikatów o błędach, działa każde obsługiwane, ale musi tam być.",
    anthropicBaseUrlLabel: "Adres bazowy Anthropic",
    anthropicBaseUrlNote:
      "Dla SDK Anthropic i Claude Code. Ten sam adres bez /v1: /v1/messages dopisują same.",
  },
  samples: {
    title: "Kod: twoje SDK, nasz adres bazowy",
    intro:
      "Żadnej nowej biblioteki. Oficjalne SDK OpenAI i Anthropic działają bez zmian. Wstaw swój klucz w miejsce sk-unb-YOUR_KEY.",
    curl: {
      title: "curl",
      body: "Najszybszy dowód, że klucz działa. Zwykłe chat completion, nic do instalowania.",
      caption: "Chat completions przez curl",
    },
    openai: {
      title: "OpenAI Python SDK",
      body: "Ustaw base_url i api_key w kliencie, potem wołaj chat.completions.create jak zawsze. W polu model działa każdy model z GET /v1/models, także Claude i Gemini.",
      caption: "Chat completions z SDK OpenAI",
      responses:
        "Ten sam klient mówi też Responses API: client.responses.create. Pamiętaj, że tutaj jest bezstanowe. W każdej turze przekazuj całą rozmowę jako input.",
      responsesCaption: "Responses API z SDK OpenAI",
    },
    anthropic: {
      title: "Anthropic Python SDK",
      body: "Ustaw base_url bez /v1 i swój klucz jako api_key, potem messages.create. Modele rozumujące zaczynają od bloku thinking, dlatego przykład wypisuje blok text, a nie pierwszy blok.",
      caption: "Messages API z SDK Anthropic",
      countTokens:
        "Chcesz znać rozmiar przed wysłaniem? count_tokens zwraca oszacowanie za darmo, bez wywołania modelu.",
      countTokensCaption: "Liczenie tokenów przez curl",
    },
    models: {
      title: "Lista modeli",
      body: "GET /v1/models to źródło prawdy. Pokazuje dokładnie, które ID może wywołać twój klucz, z długością kontekstu, obsługą narzędzi i ceną za token.",
      caption: "Lista modeli przez curl",
    },
  },
  ids: {
    title: "ID modeli: nasze albo dostawcy",
    intro:
      "Konfiguracji, które już podają model, nie musisz przepisywać. Przyjmujemy popularne zapisy.",
    ours: "Nasze ID, tak jak wypisuje je GET /v1/models: claude-sonnet-5.5, gpt-6.1-sol, glm-5.3. Używaj ich, gdy zaczynasz od zera.",
    vendor:
      "Zapisy dostawców też działają. ID Anthropic z datą (claude-sonnet-4-5-20250929 trafia na claude-sonnet-4.5), numery wersji z myślnikami, sufiks -latest, sufiks kontekstu [1m] i ID z kropką, jak gpt-5.5.",
    prefix:
      "Prefiksy dostawców, takie jak anthropic/... czy openai/..., więc ID w stylu OpenRouter z istniejącej konfiguracji dalej działają.",
    claudeFallback:
      "Tylko na /v1/messages: ID Claude, którego twoje konto nie może wywołać, na przykład wbudowane ID wysyłane przez Claude Code przy zadaniach w tle, trafia na najnowszego Claude z tej samej rodziny (Opus, Sonnet albo Haiku), do którego masz dostęp. Claude Code działa bez dodatkowych zmiennych środowiskowych. Każde inne nieznane ID zwraca 404 model_not_found.",
  },
  tools: {
    title: "Claude Code i Codex CLI z innymi modelami",
    intro:
      "Oba łączą się bezpośrednio. Bez proxy, bez warstwy tłumaczącej, nic do instalowania.",
    p1: "Każdy snippet domyślnie używa {{model}}. Przeszedł prawdziwe sesje w Claude Code i Codex CLI, niezawodnie wywołuje narzędzia i mało kosztuje za token wyjściowy. Gdy wszystko działa, podmień go na dowolne ID.",
    claudeCode:
      "Tyle wystarczy, żeby używać Claude Code z innymi modelami. ANTHROPIC_BASE_URL kieruje go do nas, ANTHROPIC_AUTH_TOKEN niesie twój klucz, a zmienne modeli decydują, co działa. Podmień ID modelu na dowolne z GET /v1/models: GPT, Gemini, Kimi, DeepSeek albo model niecenzurowany. CLAUDE_CODE_MAX_CONTEXT_TOKENS jest ustawione na prawdziwe okno kontekstu modelu, więc Claude Code kompaktuje rozmowę we właściwym momencie.",
    codex:
      "Codex CLI dostaje własnego dostawcę modeli z wire_api ustawionym na responses. Rozmawia z nami przez Responses API dokładnie tak jak z OpenAI. Model zmieniasz przez -m.",
    others:
      "OpenCode, Continue, Aider i Cline też działają, wszystkie przetestowane. Ich konfiguracje, stałe pliki ustawień i pułapki, na które trafiliśmy, znajdziesz w przewodniku po narzędziach do kodowania.",
    guideLink: "Skonfiguruj każde narzędzie do kodowania",
  },
  picks: {
    title: "Który model do jakiej roboty",
    intro:
      "Każdy model poniżej obsługuje wywołania narzędzi. Kliknij nazwę, żeby zobaczyć cenę i parametry, a ID skopiuj do kodu.",
    frontier: {
      title: "Czołówka: najtrudniejszy kod i rozumowanie",
      body: "Duże refaktory, nieznane bazy kodu, długie łańcuchy rozumowania. Wyższa cena za token, mniej błędnych ścieżek.",
    },
    cheap: {
      title: "Tanio i szybko: pętle agentów, masowe zadania, wywołania w tle",
      body: "Pętle agentów z dużymi promptami, zadania wsadowe, klasyfikacja, wywołania w tle, które narzędzia do kodowania odpalają cały dzień. Ułamek cen czołówki.",
    },
    uncensored: {
      title: "Niecenzurowane: bez odruchu odmowy",
      body: "GLM 5.3 Uncensored i Qwen 3.6 Plus Uncensored to modele głównego nurtu z usuniętymi odmowami. UncensoredLM v1.2 jest inny: ma własny światopogląd, to nie tylko odblokowany model. To samo API, te same narzędzia.",
    },
    compare:
      "Nie możesz się zdecydować? Strony porównań stawiają dwa modele obok siebie.",
    compareLink: "{{a}} vs {{b}}",
    allModels: "Wszystkie modele ({{modelCount}})",
  },
  billing: {
    title: "Ile to kosztuje",
    intro: "Kredyty, rozliczane za token. Bez opłat za stanowisko.",
    price:
      "Większość modeli rozliczamy po podanej cenie za token plus nasza marża. Tokeny wejściowe z cache liczymy po cenie cache modelu. Modele obsługiwane przez OpenRouter rozliczają rzeczywisty koszt, który OpenRouter policzył za wywołanie, plus tę samą marżę.",
    reported:
      "Każda odpowiedź podaje usage.credits_charged. Nigdy nie musisz zgadywać, ile kosztowało wywołanie.",
    preflight:
      "Zanim wywołanie ruszy, sprawdzamy saldo względem najgorszego scenariusza. Za mało oznacza HTTP 402 insufficient_credits: nic nie rusza, nic nie jest pobierane.",
    abort:
      "Przy streamingu zamknięcie połączenia zatrzymuje generowanie. Płacisz tylko za to, co się wykonało. Tak samo, gdy dostawca padnie w trakcie streamu.",
    chat: "Czat i API rozliczają się tak samo. OpenRouter rozkłada model na kilku dostawców, a niektórzy biorą więcej niż najtańszy, którego podajemy. Dlatego przy tych modelach cena na liście to szacunek, a usage.credits_charged to prawdziwa kwota. Gdy OpenRouter nie poda kosztu wywołania, liczymy cenę z listy.",
    paid: "To samo saldo kredytów co w aplikacji czatu, które pokrywa tam też obrazy, wideo, muzykę, głos i wyszukiwanie w sieci. Samo API wymaga płatnego konta: aktywnej subskrypcji albo co najmniej jednego kupionego pakietu kredytów. Darmowe kredyty go nie odblokowują.",
    sub: "Subskrypcja: {{subCredits}} kredytów miesięcznie za {{subPrice}}.",
    pack: "Pakiet kredytów: {{packCredits}} kredytów za {{packPrice}}. Pakiety nigdy nie wygasają. Płacisz kartą albo kryptowalutą.",
    link: "Zobacz plany i ceny",
  },
  versus: {
    title: "Bezpośrednio, przez router czy u nas?",
    intro: "Trzy uczciwe opcje. Każda jest dla kogoś najlepsza.",
    direct: {
      title: "Bezpośrednio u OpenAI, Anthropic albo Google",
      body: "Najnowsze funkcje producenta trafiają tam najpierw. Bez marży pośrednika. Regulamin tylko jednego dostawcy. Jeśli używasz modeli tylko jednego dostawcy, idź bezpośrednio.",
    },
    router: {
      title: "Agregator, na przykład OpenRouter",
      body: "Dużo modeli, płacisz za zużycie. Uczciwie: wiele naszych modeli działa przez OpenRouter. Jeśli potrzebujesz samego routingu, idź tam.",
    },
    here: {
      title: "{{appName}}",
      body: "Jeden klucz do trzech formatów: chat completions, Responses i Anthropic Messages razem z count_tokens. Claude Code i Codex CLI łączą się bez proxy. Modele niecenzurowane stoją obok modeli głównego nurtu, za jednorazowym potwierdzeniem 18+. To samo saldo płaci za aplikację czatu i API, z kredytów subskrypcji albo pakietów. A {{appName}} jest open source i możesz go hostować samodzielnie.",
    },
    verdict:
      "Podsumowując: jeden dostawca, idź bezpośrednio. Zwykły routing w formacie OpenAI załatwi router. Chcesz Claude Code, Codex CLI oraz SDK OpenAI i Anthropic na jednym kluczu, z modelami niecenzurowanymi i aplikacją czatu na tym samym saldzie? Właśnie po to to zbudowaliśmy.",
  },
  limits: {
    title: "Limity, które warto znać",
    intro: "Bez niespodzianek na produkcji. Oto twarde granice.",
    stateless:
      "Bezstanowo. Responses API działa ze store ustawionym na false i odrzuca previous_response_id. Wysyłaj pełną historię w każdej turze. Dotyczy to każdego endpointu.",
    maxTokens:
      "Odpowiedź jest ograniczona do {{maxTokens}} tokenów na zapytanie.",
    rateLimit:
      "Domyślnie {{rateLimit}} zapytań na minutę na klucz. Po przekroczeniu dostajesz 429 z nagłówkiem Retry-After. Agenci, którzy odpalają dużo wywołań, dostają własny klucz.",
    countTokens:
      "count_tokens to oszacowanie, nie dokładny tokenizer dostawcy. Dobre do mierzenia kontekstu, nie do rozliczeń.",
    tools:
      "Wywołania narzędzi działają tylko na modelach, które je obsługują. W przeciwnym razie dostajesz 400 tools_not_supported. GET /v1/models pokazuje supports_tools dla każdego modelu.",
    consent:
      "Modele niecenzurowane wymagają jednorazowego potwierdzenia 18+ na stronie Klucze API. Bez niego dostajesz 403 uncensored_consent_required i nic nie jest pobierane.",
    localeUrl:
      "Dwa klasyczne błędy przy konfiguracji, oba kończą się 404. Pierwszy: brak locale w ścieżce. Adres bazowy to /api/<locale>/v1, nie /api/v1. Drugi: zostawione /v1 w adresie bazowym Anthropic. Claude Code i SDK Anthropic same dopisują /v1/messages, a podwójne /v1 niczego nie znajdzie.",
  },
  privacy: {
    title: "Co dzieje się z twoimi promptami",
    intro: "W skrócie: zatrzymujemy rachunek, nie rozmowę.",
    noStore:
      "API nie zapisuje żadnej rozmowy i nie tworzy wątków. U nas zostaje tylko wpis rozliczeniowy: jaki model, ile kredytów.",
    upstream:
      "Twój prompt trafia do dostawcy, który obsługuje model. To, co otrzymuje, podlega jego regulaminowi.",
    incognito:
      "W aplikacji czatu rozmowy incognito żyją tylko w pamięci lokalnej twojej przeglądarki, nie na naszych serwerach.",
    selfHost:
      "Chcesz pełnej kontroli? {{appName}} jest open source (MIT i GPL v3). Postaw własną instancję z własnymi kluczami dostawców i płać im bezpośrednio.",
    selfHostLink: "Hostuj samodzielnie",
  },
  faq: {
    title: "FAQ",
    openrouter: {
      q: "Czy {{appName}} to alternatywa dla OpenRouter?",
      a: "W wielu zastosowaniach tak: jeden klucz, dużo modeli, płatność za token. Różnice: {{appName}} natywnie mówi Anthropic Messages API i OpenAI Responses API, nie tylko chat completions. Ma modele niecenzurowane. A aplikacja czatu działa na tym samym saldzie. Wiele naszych modeli pod spodem obsługuje OpenRouter.",
    },
    claudeCode: {
      q: "Czy mogę używać Claude Code z modelami innymi niż Claude?",
      a: "Tak. Ustaw ANTHROPIC_BASE_URL na adres bazowy Anthropic w {{appName}}, wpisz klucz do ANTHROPIC_AUTH_TOKEN i wybierz dowolne ID z GET /v1/models. GPT, Gemini, GLM, Kimi, DeepSeek i modele niecenzurowane działają tak w Claude Code.",
    },
    sdk: {
      q: "Czy potrzebuję nowego SDK?",
      a: "Nie. Używaj oficjalnych SDK OpenAI i Anthropic. Zmień adres bazowy i klucz. Nic więcej.",
    },
    free: {
      q: "Czy API ma darmowy plan?",
      a: "Nie. Aplikacja czatu ma darmowe kredyty, API nie. Potrzebuje subskrypcji ({{subCredits}} kredytów miesięcznie za {{subPrice}}) albo jednego pakietu kredytów ({{packCredits}} kredytów za {{packPrice}}). Raz kupiony pakiet utrzymuje API aktywne, dopóki starczy salda.",
    },
    pricing: {
      q: "Czy płacę cenę z listy?",
      a: "Przy większości modeli tak: cena za token z listy plus nasza marża. Modele obsługiwane przez OpenRouter rozliczają rzeczywisty koszt, który OpenRouter policzył za wywołanie, plus tę samą marżę, w czacie i w API tak samo. Ich cena na liście to szacunek. Dokładną kwotę podaje każda odpowiedź w usage.credits_charged.",
    },
    models: {
      q: "Jakie modele mogę wywołać?",
      a: "Obecnie {{modelCount}} modeli czatu: Claude, GPT, Gemini, DeepSeek, Kimi, GLM, Qwen i modele niecenzurowane. GET /v1/models wypisuje dokładnie to, co może wywołać twój klucz, z cenami.",
    },
    data: {
      q: "Czy {{appName}} przechowuje moje prompty?",
      a: "Z API nie. Żadna rozmowa nie jest zapisywana, zostaje tylko wpis rozliczeniowy: model i pobrane kredyty. Dostawca, który obsługuje model, widzi prompt na swoich zasadach.",
    },
    docsLink: "Pełna dokumentacja API",
    pricingLink: "Zobacz plany i ceny",
  },
  partners: {
    body: "Tworzysz narzędzia albo treści dla programistów? Program partnerski {{appName}} płaci ci cykliczną prowizję od każdej płatności, którą polecisz.",
    link: "Dołącz do programu partnerskiego",
  },
  cta: {
    title: "Jeden klucz. Każdy model. Zaczynaj.",
    subtitle:
      "Utwórz klucz, zmień jeden adres bazowy, zostaw swoje SDK. Dokumentacja API opisuje każdy endpoint, pole i kod błędu.",
    key: "Utwórz klucz API",
    docs: "Przeczytaj dokumentację API",
  },
};
