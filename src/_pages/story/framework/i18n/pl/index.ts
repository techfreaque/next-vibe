import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Dla programistów: framework next-vibe, API AI bez cenzury, MCP",
    description:
      "Napisz jeden endpoint, a dostajesz interfejs web, polecenie CLI, narzędzie MCP i narzędzie AI. Open source. Sklonuj, zainstaluj, uruchom. Do tego jedno API zgodne z OpenAI i Anthropic dla modeli mainstreamowych i bez cenzury. W zestawie moduły księgowości, faktur, CRM i kasy.",
    category: "Dla programistów",
    imageAlt: "unbottled.ai dla programistów: API, MCP i self-hosting",
    keywords:
      "API AI bez cenzury, API zgodne z OpenAI, API zgodne z Anthropic, API modeli abliterated, UncensoredLM API, serwer MCP, AI na własnym serwerze, next-vibe",
  },
  hero: {
    eyebrow: "Dla programistów",
    title: "Jeden plik definition.ts.",
    titleAccent: "Każda platforma.",
    subtitle:
      "next-vibe to framework open source w TypeScripcie, na którym działa {{appName}}. Działają na nim czat AI, księgowość, kasa, magazyn i CRM. Jeden endpoint staje się interfejsem web, poleceniem CLI, narzędziem MCP i narzędziem AI. Zero kodu łączącego.",
    ctaFramework: "Zobacz kod źródłowy",
    ctaKeys: "Użyj API",
    stats: {
      endpoints: "typowanych endpointów w repozytorium",
      surfaces: "platform z jednej definicji",
      languages: "wbudowanych języków",
      models: "modeli czatu, jeden klucz API",
    },
  },
  paths: {
    api: {
      label: "Wywołaj API",
      title: "{{modelCount}} modeli na jednym kluczu",
      body: "Twój kod pod OpenAI lub Anthropic, nasz adres bazowy. Modele mainstreamowe i bez cenzury na jednym kluczu.",
      link: "Szybki start",
    },
    selfHost: {
      label: "Self-hosting",
      title: "Uruchom całą platformę",
      body: "Czat, księgowość, kasa, magazyn, CRM. Sklonuj, zainstaluj, uruchom.",
      link: "Zainstaluj",
    },
    framework: {
      label: "Buduj na nim",
      title: "Jedna definicja, wszystkie platformy",
      body: "Napisz endpoint raz. Dostajesz interfejs web, polecenie CLI, narzędzie MCP, narzędzie AI i więcej.",
      link: "Zobacz wzorzec",
    },
  },
  modules: {
    eyebrow: "W repozytorium",
    title: "Całe produkty, ten sam wzorzec.",
    intro:
      "Księgowość, faktury, CRM i wiadomości działają według tego samego wzorca co formularz kontaktowy powyżej. Każdy endpoint to polecenie CLI, narzędzie MCP i narzędzie AI, chyba że jego definicja to wyłącza. Otwórz dowolny folder: definition, repository, route.",
    endpoints: "Endpointy: {{count}}",
    business: "Prowadź na tym firmę",
    source: "Przeglądaj moduły na GitHubie",
    tryLine: "Ten sam wzorzec, prawdziwe polecenia",
    items: {
      accounting: "Pełna księgowość",
      documents: "Faktury, rachunki, oferty",
      purchasing: "Zakupy",
      pos: "Kasa",
      inventory: "Magazyn",
      crm: "CRM i leady",
      newsletter: "Newsletter",
      messaging: "Skrzynka i wiadomości",
    },
  },
  quickstart: {
    eyebrow: "Szybki start",
    title: "Pierwsza odpowiedź w trzech krokach.",
    intro:
      "API obsługuje OpenAI Chat Completions i Responses oraz Anthropic Messages. Twój kod zadziała tu po trzech zmianach: adresu bazowego, klucza i ID modelu z `GET /v1/models`.",
    step1: {
      title: "Odblokuj API i utwórz klucz",
      description:
        "Odblokowuje je każdy plan od {{subPrice}} miesięcznie. Potem otwórz klucze API, nazwij klucz i skopiuj go. Zobaczysz go tylko raz.",
      ctaPlans: "Zobacz plany",
      ctaKeys: "Otwórz klucze API",
    },
    step2: {
      title: "Skieruj klienta do nas",
      description:
        "Narzędzia pod OpenAI używają pierwszego adresu. Claude Code i SDK Anthropic używają drugiego.",
      baseUrl: "Adres bazowy OpenAI",
      baseUrlNote:
        "W ścieżce zadziała każdy locale. Zmienia tylko język komunikatów o błędach.",
      anthropicBaseUrl: "Adres bazowy Anthropic",
      anthropicNote:
        "Bez `/v1` na końcu: narzędzia Anthropic same dopisują `/v1/messages`.",
    },
    step3: {
      title: "Wyślij zapytanie",
      description:
        "Wstaw swój klucz i uruchom. `{{model}}` to jedno id modelu. `GET /v1/models` zwraca wszystkie id dostępne dla twojego klucza.",
      response: "Przykładowa odpowiedź",
    },
    agents: {
      title: "Agenci do kodowania działają od ręki",
      body: "Sprawdzone konfiguracje do skopiowania:",
      link: "Konfiguracje agentów do kodowania",
    },
    reference: "Pełna dokumentacja API",
  },
  pricing: {
    eyebrow: "Cennik",
    title: "Plan odblokowuje API. Za wywołania płacisz kredytami.",
    intro:
      "Te same stawki co w czacie. Bez dopłat za API, bez opłat za użytkownika, jedno saldo.",
    unlockTitle: "Odblokowuje API",
    unlockPlan: "Dowolny plan, od {{subPrice}} miesięcznie",
    unlockGrant:
      "Kredyty przyznane przez nasz zespół, na przykład kredyty testerskie",
    neverTitle: "Nigdy go nie odblokowuje",
    never:
      "Darmowy plan: miesięczny przydział, bonusy za rejestrację i newsletter, zarobki z poleceń. Bez planu lub przyznanych kredytów każde wywołanie `/v1` zwraca 402 `paid_plan_required`.",
    billTitle: "Jak rozliczamy wywołanie",
    bill: "Koszt dostawcy plus nasza marża, w kredytach. `GET /v1/models` podaje dla każdego modelu kredyty za milion tokenów wejścia i wyjścia. Każda odpowiedź zwraca `usage.credits_charged`, a strumień po włączeniu `stream_options.include_usage`.",
    topup:
      "Potrzebujesz więcej? Subskrybenci doładowują pakietami kredytów od {{packPrice}}. Kredyty z pakietów nigdy nie wygasają.",
    facts: {
      credit: "1 kredyt = 1 cent amerykański",
      rate: "Brak sztywnego limitu (płatność za zapytanie)",
      keys: "Do {{maxKeys}} kluczy na konto",
      preflight: "Za mało kredytów: 402, zanim cokolwiek się uruchomi",
    },
    modelsTitle: "Każdą cenę podaje samo API",
    modelsResponse: "Przykładowa odpowiedź",
  },
  uncensored: {
    eyebrow: "Modele bez cenzury",
    title: "Dwa rodzaje modeli bez cenzury. Oba w API.",
    intro:
      "Większość AI bez cenzury to mainstreamowy model z odmowami wyciętymi lub wytrenowanymi na zero. Mamy takie modele i jeden trenowany inaczej od samego początku. Model wybierasz w każdym zapytaniu przez jego id.",
    abliterated: {
      label: "Abliterated i fine-tuning",
      title: "Mainstreamowe modele, które przestają się wykręcać",
      body: "Odmowy wycięte z wag albo wytrenowane na zero. Ta sama wiedza, odpowiedzi wprost.",
    },
    worldview: {
      label: "Naprawdę bez cenzury",
      title: "Model z własnym światopoglądem",
      body: "{{model}} jest trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie. Efekt: model o przeciwnych poglądach politycznych.",
    },
    more: "+{{count}} kolejnych",
    consent:
      "Potwierdź raz na stronie kluczy API, że masz 18 lat. Do tego czasu modele bez cenzury zwracają 403 `uncensored_consent_required` i nic nie jest pobierane.",
    allModels: "Wszystkie modele bez cenzury",
    catalog: "Przeglądaj katalog modeli",
  },
  mcp: {
    eyebrow: "MCP i CLI",
    title: "Twój agent już zna twoją aplikację.",
    intro:
      "`bun i` zapisuje konfigurację MCP dla Claude Code, Cursor, VS Code, OpenCode i Codex. Otwórz repozytorium w swoim agencie, a narzędzia już tam są.",
    points: {
      stdio: "MCP przez stdio. Bez dodatkowego serwera, bez portu.",
      roles:
        "Te same role i walidacja co w interfejsie web. Modele sięgają tylko tam, gdzie pozwala twoja rola.",
      connect:
        "Połącz instalację z kontem {{appName}}, a jej agenci pracują na naszych modelach.",
      help: "Każde polecenie samo się dokumentuje: `vibe <command> --help`.",
    },
    configNote:
      "Wpis `atlas`, który zapisuje `bun i`, w skrócie. Prawdziwy plik ma też serwer `hermes` i używa ścieżki twojego klona.",
  },
  selfHost: {
    eyebrow: "Self-hosting",
    title: "Uruchom wszystko u siebie.",
    intro:
      "Platforma, na której działa {{appName}}, jest open source. Sklonuj, zainstaluj, uruchom. Potem przejmuje przeglądarka. Bez Dockera, bez plików konfiguracyjnych.",
    terminal: "Terminal",
    db: "Domyślnie wbudowany Postgres (PGlite). Gdy z niego wyrośniesz, ustaw `DATABASE_URL` na własnego Postgresa.",
    guide: "Poradnik self-hostingu",
    github: "Kod na GitHubie",
  },
  framework: {
    eyebrow: "Framework",
    title: "Prześledź jeden endpoint.",
    intro:
      "Formularz kontaktowy z tego repozytorium, przycięty, ale prawdziwy. Jedna definicja staje się interfejsem web, poleceniem CLI, narzędziem MCP, ekranem natywnym, narzędziem AI i zadaniem cron.",
    tabAdd: "Dodaj własny",
    call: {
      title: "Wywołaj",
      cli: "CLI",
      mcp: "MCP",
      ai: "Narzędzie AI",
      cron: "Cron",
    },
    becomes: "Formularz kontaktowy staje się",
    more: "I {{count}} kolejnych platform",
    source: "Pełny kod na GitHubie",
    live: "Na żywo na końcu strony",
    docs: "Dokumentacja wzorców na GitHubie",
    deleteLine:
      "Funkcja to folder. Usuń go, uruchom `vibe gen`, a znika ze wszystkich platform naraz.",
    moreSurfaces: {
      webApi: "REST API",
      websocket: "Zdarzenia WebSocket",
      adminPanel: "Panel admina",
      vibeFrame: "Widget do osadzenia",
    },
    surfaces: {
      web: {
        title: "Interfejs web",
        body: "Formularz na dole tej strony. Pola, walidacja i komunikat sukcesu pochodzą z definicji.",
      },
      cli: {
        title: "Polecenie CLI",
        body: "`vibe contact-form`, osobna flaga dla każdego pola, wbudowana pomoc.",
      },
      mcp: {
        title: "Narzędzie MCP",
        body: "Agenci sięgają po nie przez `vibe mcp` za pomocą narzędzia `execute-tool`. Schemat wejścia prosto z Zod.",
      },
      ai: {
        title: "Narzędzie AI",
        body: "Modele mogą je wywołać. `requiresConfirmation` każe najpierw zapytać użytkownika o zgodę.",
      },
      native: {
        title: "Ekran natywny",
        body: "Aplikacja Expo renderuje ten sam widget z natywnymi polami. Beta.",
      },
      cron: {
        title: "Zadanie cron",
        body: "Każdy endpoint może działać według harmonogramu. Ten sam handler, bez drugiej ścieżki kodu.",
      },
    },
    maturity: {
      stable: {
        title: "Na produkcji",
        body: "{{appName}} działa na tym kodzie: web, CLI, MCP, narzędzia AI, cron, realtime, płatności.",
      },
      beta: {
        title: "Beta",
        body: "Ekrany React Native, synchronizacja między instancjami i zdalne skille działają, ale mają jeszcze niedoróbki.",
      },
      churn: {
        title: "Licz się ze zmianami",
        body: "Jeden zespół, szybkie tempo. Jeszcze bez semver, a dokumentacja nie nadąża za kodem. Przypnij commit albo zrób forka.",
      },
    },
  },
  faq: {
    title: "Pytania, które zadają programiści",
    free: {
      q: "Czy jest darmowy dostęp do API?",
      a: "Nie. API odblokowuje każdy plan od {{subPrice}} miesięcznie albo kredyty przyznane przez nasz zespół. Darmowy przydział czatu go nie odblokowuje.",
    },
    sdks: {
      q: "Jakie SDK i narzędzia działają?",
      a: "Oficjalne SDK OpenAI i Anthropic, każda biblioteka zgodna z OpenAI oraz agenci kodujący jak Claude Code, Codex CLI, OpenCode, Aider, Cline i Continue. Zmieniasz adres bazowy i klucz.",
    },
    uncensored: {
      q: "Czy mogę wywoływać modele bez cenzury przez API?",
      a: "Tak. Potwierdź raz na stronie kluczy API, że masz 18 lat lub więcej, i wywołuj je jak każdy inny model. Modele abliterated i UncensoredLM korzystają z tych samych endpointów.",
    },
    media: {
      q: "Obrazy, głos, wideo i muzyka też?",
      a: "Ten sam klucz. `/v1/images`, `/v1/audio`, `/v1/videos` i `/v1/music` trzymają się formatów OpenAI tam, gdzie takie istnieją. Dokumentacja API opisuje każdy endpoint.",
    },
    limits: {
      q: "Jakie są limity zapytań?",
      a: "Brak sztywnego limitu zapytań. Rozliczamy każde wywołanie z Twojego salda kredytów i stosujemy wysoką ochronę przed nadużyciami (duży zapas na serie zapytań i jednoczesne streamy). Odpowiedzi 429 od dostawców modeli przekazujemy dalej z nagłówkiem `Retry-After`. Planujesz bardzo duży ruch? Napisz przez formularz kontaktowy poniżej.",
    },
    selfHost: {
      q: "Czy self-hosting jest darmowy?",
      a: "Tak. Kod jest open source: MIT dla aplikacji, GPL v3 dla frameworka. Użyj własnych kluczy dostawców albo połącz instalację z kontem {{appName}} i płać za to, czego używasz.",
    },
  },
  contact: {
    eyebrow: "Endpoint na żywo",
    title: "Masz pytania albo budujesz coś dużego?",
    description:
      "Konfiguracja, integracje szyte na miarę, przegląd architektury. Odpowiada zespół, który to zbudował. Ten formularz to endpoint kontaktowy z sekcji o frameworku.",
  },
  code: {
    copy: "Kopiuj",
    copied: "Skopiowano",
    wrap: "Zawijaj",
    anthropic: "Anthropic",
  },
};
