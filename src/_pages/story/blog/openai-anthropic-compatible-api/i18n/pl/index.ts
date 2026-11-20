import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternatywa dla OpenRouter | API OpenAI i Anthropic | {{appName}}",
    description:
      "Porównaj {{appName}} z OpenRouter. Użyj swojego SDK OpenAI z API do {{modelCount}} modeli czatu i {{mediaModelCount}} modeli multimedialnych.",
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
      "Używaj Chat Completions, Responses lub Anthropic Messages z jednym kluczem {{appName}}. Zachowaj swoje SDK, zmień adres bazowy i klucz, a potem sprawdź identyfikator modelu. Ten sam klucz działa też z {{mediaModelCount}} modelami multimedialnymi.",
  },
  intro: {
    lead: "GPT od OpenAI, Claude od Anthropic, Gemini od Google. Trzy SDK, trzy klucze, trzy rachunki, trzy panele. Albo gorzej: twoje ulubione narzędzie mówi tylko jednym formatem, więc dostaje modele tylko jednego dostawcy.",
    p2: "{{appName}} daje {{modelCount}} modeli czatu z {{providerCount}} laboratoriów pod jednym kluczem i jednym saldem kredytów. Wołasz je w formacie OpenAI, Responses albo Anthropic. Te same modele na każdym endpoincie. Poniżej dokładnie: jak to działa, ile kosztuje i kiedy lepiej iść bezpośrednio do dostawcy albo do routera.",
    access:
      "Na start: API wymaga płatnego konta. Odblokuje je dowolny plan, od {{subPrice}} miesięcznie. Darmowe i bonusowe kredyty nie wystarczą.",
    accessLink: "Odblokuj API",
  },
  endpoints: {
    title: "Wszystkie endpointy, jeden klucz",
    intro:
      "Każdy endpoint przyjmuje ten sam klucz i pobiera z tego samego salda. Trzy formaty czatu obsługują te same modele.",
    chat: "POST /v1/chat/completions: OpenAI Chat Completions. Streaming przez SSE zakończony data: [DONE], stream_options.include_usage, wywołania narzędzi. Format, którym mówi prawie każdy klient zgodny z OpenAI.",
    responses:
      "POST /v1/responses: OpenAI Responses API, format, którym mówi Codex CLI. Streaming i narzędzia. Bezstanowe: store ma wartość false, a previous_response_id kończy się błędem 400. Wysyłaj więc pełny input w każdej turze.",
    messages:
      "POST /v1/messages: Anthropic Messages API. Streaming i tool use. Z tym rozmawiają Claude Code i SDK Anthropic.",
    countTokens:
      "POST /v1/messages/count_tokens: nie zużywa kredytów. Lokalne oszacowanie bez wywołania modelu, które nie zjada limitu zapytań na minutę. Claude Code woła go non stop, żeby mierzyć swój kontekst.",
    models:
      "GET /v1/models: każdy model, który twój klucz może teraz wywołać, z długością kontekstu, obsługą narzędzi i cenami. Jedna odpowiedź, którą parsują zarówno SDK OpenAI, jak i Anthropic.",
    media:
      "Multimedia w formacie OpenAI, {{mediaModelCount}} modeli: POST /v1/images/generations i /v1/images/edits, /v1/audio/speech, /v1/audio/transcriptions i /v1/audio/translations. Wideo (POST /v1/videos) i muzyka (POST /v1/music) działają jako zadania asynchroniczne: start, sprawdzanie, pobranie. GET /v1/models oznacza każdy model jego modality.",
    auth: "Uwierzytelnianie działa na dwa sposoby, na każdym endpoincie. Authorization: Bearer sk-unb-... dla klientów OpenAI i dla Claude Code z ANTHROPIC_AUTH_TOKEN. x-api-key: sk-unb-... dla SDK Anthropic. Klucze zaczynają się od sk-unb-, widzisz je tylko raz, a my przechowujemy wyłącznie hash. Tworzysz je w Ustawienia > Klucze API, do 20 aktywnych kluczy na konto.",
    baseUrlLabel: "Adres bazowy",
    baseUrlNote:
      "Dla SDK OpenAI i narzędzi w stylu OpenAI. Locale jest częścią ścieżki. Zmienia tylko język komunikatów o błędach, działa każde obsługiwane, ale musi tam być.",
    anthropicBaseUrlLabel: "Adres bazowy Anthropic",
    anthropicBaseUrlNote:
      "Dla SDK Anthropic i Claude Code. Ten sam adres bez /v1: /v1/messages dopisują same.",
  },
  switching: {
    title: "Jak przejść z OpenRouter na {{appName}}",
    intro:
      "Szukasz alternatywy dla OpenRouter? Obie usługi przyjmują żądania Chat Completions w formacie OpenAI. Możesz zachować SDK OpenAI i zmienić jego konfigurację.",
    key: "Aktywuj dostęp do API na koncie {{appName}} i utwórz nowy klucz API w ustawieniach.",
    baseUrl:
      "W kliencie OpenAI ustaw podany wyżej adres bazowy dla swojego języka, razem z /v1.",
    model:
      "Wywołaj GET /v1/models w nowym API i wstaw jeden ze zwróconych identyfikatorów w pole model.",
    routing:
      "Przed zmianą sprawdź opcje routingu właściwe dla OpenRouter. Przetestuj z wybranym modelem funkcje potrzebne twojej aplikacji, na przykład streaming lub wywoływanie narzędzi.",
    openrouterDocs: "Dokumentacja API OpenRouter",
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
        "Chcesz znać rozmiar przed wysłaniem? count_tokens zwraca oszacowanie bez wywołania modelu i bez zużycia kredytów.",
      countTokensCaption: "Liczenie tokenów przez curl",
    },
    models: {
      title: "Lista modeli",
      body: "GET /v1/models to źródło prawdy. Pokazuje dokładnie, które ID może wywołać twój klucz, z długością kontekstu, obsługą narzędzi i ceną za token.",
      caption: "Lista modeli przez curl",
    },
    media: {
      title: "Obrazy, głos, wideo, muzyka",
      body: "Ten sam klucz, ten sam adres bazowy, formaty multimediów OpenAI. Klienci images i audio z SDK OpenAI działają bez zmian. Wybierz w GET /v1/models model z pasującą modality.",
      imageCaption: "Obraz przez curl",
      async:
        "Wideo i muzyka trwają minuty, więc działają jako zadania. POST od razu zwraca ID. Sprawdzaj status za darmo, potem pobierz plik. Nieudane zadanie nic nie kosztuje.",
      videoCaption: "Start zadania wideo",
      pollCaption: "Sprawdź status, potem pobierz MP4",
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
      "W przypadku obsługiwanych modeli API rozpoznaje typowe prefiksy dostawców, takie jak anthropic/ i openai/.",
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
      body: "GLM 5.3 Uncensored i Qwen 3.6 Plus Uncensored to modele głównego nurtu z usuniętymi odmowami. UncensoredLM v1.2 jest inny: trenowano go na książkach i dokumentach zakazanych w mainstreamowym internecie, to nie tylko odblokowany model. To samo API, te same narzędzia.",
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
    media:
      "Multimedia rozliczają się tak samo: realny koszt dostawcy plus nasza marża, gdy dostawca go podaje, w innym wypadku cena z listy. Obrazy za sztukę, głos za znaki, transkrypcja za sekundę nagrania, wideo i muzyka dopiero, gdy plik jest gotowy.",
    paid: "To samo saldo kredytów co w aplikacji czatu. Samo API wymaga płatnego konta: dowolnego planu. Darmowe kredyty go nie odblokowują.",
    sub: "Plany miesięczne: cztery rozmiary, od {{subCredits}} kredytów za {{subPrice}}.",
    pack: "Pakiety kredytów: doładowanie dla subskrybentów, {{packCredits}} kredytów za {{packPrice}}. Nigdy nie wygasają. Karta, PayPal albo krypto.",
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
      body: "OpenRouter udostępnia wiele modeli przez jedno API z wyborem dostawcy i trasami zapasowymi. Obsługuje też część naszych zapytań do modeli.",
    },
    here: {
      title: "{{appName}}",
      body: "Jeden klucz do trzech formatów: chat completions, Responses i Anthropic Messages razem z count_tokens. Claude Code i Codex CLI łączą się bez proxy. Modele niecenzurowane stoją obok modeli głównego nurtu, za jednorazowym potwierdzeniem 18+. To samo saldo płaci za aplikację czatu i API, z kredytów subskrypcji albo pakietów. A {{appName}} jest open source i możesz go hostować samodzielnie.",
    },
    verdict:
      "Porównaj katalogi modeli i potrzebne ci funkcje routingu. Jeśli chcesz używać modeli bez cenzury w API i korzystać z tego samego salda na czacie, sprawdź modele dostępne dla twojego klucza {{appName}}.",
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
      a: "{{appName}} obsługuje Chat Completions, Responses i Anthropic Messages za pomocą jednego klucza. Z modeli bez cenzury możesz korzystać po potwierdzeniu ukończenia 18 lat. Czat i API mają wspólne saldo. Część żądań obsługuje OpenRouter.",
    },
    openrouterModels: {
      q: "Czy po zmianie API mogę zachować identyfikatory modeli OpenRouter?",
      a: "Niektóre identyfikatory z prefiksem dostawcy działają, jeśli dany model jest dostępny. Sprawdź dostępność przez GET /v1/models i skopiuj dokładny identyfikator zwrócony przez nowe API.",
    },
    claudeCode: {
      q: "Czy mogę używać Claude Code z modelami innymi niż Claude?",
      a: "Tak. Ustaw ANTHROPIC_BASE_URL na adres bazowy Anthropic w {{appName}}, wpisz klucz do ANTHROPIC_AUTH_TOKEN i wybierz dowolne ID z GET /v1/models. GPT, Gemini, GLM, Kimi, DeepSeek i modele niecenzurowane działają tak w Claude Code.",
    },
    sdk: {
      q: "Czy potrzebuję nowego SDK?",
      a: "Użyj oficjalnego SDK OpenAI lub Anthropic. Ustaw adres bazowy dla wybranego SDK, dodaj klucz API i wybierz identyfikator dostępnego modelu.",
    },
    free: {
      q: "Czy API ma darmowy plan?",
      a: "Nie. Aplikacja czatu ma darmowe kredyty, API nie. Potrzebuje planu, od {{subCredits}} kredytów miesięcznie za {{subPrice}}. Subskrybenci dokupują pakiety kredytów ({{packCredits}} kredytów za {{packPrice}}), które nigdy nie wygasają.",
    },
    pricing: {
      q: "Czy płacę cenę z listy?",
      a: "Przy większości modeli tak: cena za token z listy plus nasza marża. Modele obsługiwane przez OpenRouter rozliczają rzeczywisty koszt, który OpenRouter policzył za wywołanie, plus tę samą marżę, w czacie i w API tak samo. Ich cena na liście to szacunek. Dokładną kwotę podaje każda odpowiedź w usage.credits_charged.",
    },
    models: {
      q: "Jakie modele mogę wywołać?",
      a: "Obecnie {{modelCount}} modeli czatu: Claude, GPT, Gemini, DeepSeek, Kimi, GLM, Qwen i modele niecenzurowane. Do tego {{mediaModelCount}} modeli obrazu, wideo, muzyki, głosu i transkrypcji. GET /v1/models wypisuje dokładnie to, co może wywołać twój klucz, z cenami.",
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
