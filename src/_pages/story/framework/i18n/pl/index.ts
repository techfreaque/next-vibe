import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Framework next-vibe - Jedna definicja, każda powierzchnia",
    description:
      "Framework open source w TypeScripcie. Jeden definition.ts staje się interfejsem web, poleceniem CLI, narzędziem MCP, ekranem natywnym, narzędziem AI i zadaniem cron. Do tego API zgodne z OpenAI i Anthropic.",
    category: "Framework",
    imageAlt: "Framework next-vibe dla programistów",
    keywords:
      "next-vibe, framework TypeScript, serwer MCP, CLI, narzędzia AI, Zod, Drizzle, API zgodne z OpenAI",
  },
  hero: {
    eyebrow: "Open source · MIT + GPL v3",
    title: "Jeden definition.ts.",
    titleAccent: "Każda powierzchnia.",
    subtitle:
      "next-vibe to framework w TypeScripcie, w którym jedna definicja endpointu staje się interfejsem web, poleceniem CLI, narzędziem MCP, ekranem natywnym, narzędziem AI, zadaniem cron i siedmioma innymi powierzchniami. Ta sama walidacja, te same typy, zero kleju.",
    ctaQuickstart: "Start w czterech poleceniach",
    ctaGithub: "Zobacz na GitHubie",
    stat1Label: "typowanych endpointów w repo",
    stat2Label: "powierzchni na endpoint",
    stat3Label: "języki na każdy tekst",
    stat4Label: "definicja na funkcję",
  },
  example: {
    eyebrow: "Jeden prawdziwy endpoint",
    title: "Prześledź formularz kontaktowy.",
    intro:
      "Endpoint kontaktowy z repo, działa na dole tej strony. Dwa pliki do przeczytania. Sześć z trzynastu powierzchni poniżej.",
    source: "Pełny kod na GitHubie",
    live: "Wypróbuj formularz na żywo",
    becomes: "Czym się staje",
    more: "Plus siedem kolejnych",
    moreSurfaces: {
      webApi: "REST API",
      websocket: "Zdarzenia WebSocket",
      electron: "Aplikacja Electron",
      adminPanel: "Panel admina",
      vibeFrame: "Widget do osadzenia",
      remoteSkill: "Skill agenta",
      vibeBoard: "Węzeł analityki",
    },
    surfaces: {
      web: {
        title: "Interfejs web",
        body: "Formularz na dole tej strony. Pola, walidacja i komunikat sukcesu pochodzą z definicji.",
      },
      cli: {
        title: "Polecenie CLI",
        body: "vibe contact-form. Flaga na każde pole, pomoc z przykładami w zestawie.",
      },
      mcp: {
        title: "Narzędzie MCP",
        body: "Każdy klient MCP wywołuje contact-form przez vibe mcp. Schemat wejścia prosto z Zod.",
      },
      ai: {
        title: "Narzędzie AI",
        body: "Modele mogą je wywołać. requiresConfirmation wymaga zgody użytkownika przed wysłaniem.",
      },
      native: {
        title: "Ekran natywny",
        body: "Aplikacja Expo renderuje ten sam widget z natywnymi polami.",
      },
      cron: {
        title: "Zadanie cron",
        body: "Każdy endpoint może działać według harmonogramu. Ten sam handler, bez drugiej ścieżki kodu.",
      },
    },
    callsTitle: "Cztery wejścia",
    callsBody:
      "Prawdziwe wywołania. CLI, MCP i AI trafiają w handler kontaktu powyżej. Zakładka Cron to prawdziwe zadanie z harmonogramu z repo.",
  },
  pattern: {
    eyebrow: "Wzorzec",
    title: "Funkcja to folder.",
    subtitle:
      "definition.ts i route.ts są wymagane. Widget, e-maile, tabela i tłumaczenia leżą obok. Żadnego centralnego rejestru do ręcznej edycji.",
    deleteLine:
      "Usuń folder i uruchom vibe gen. Funkcja znika ze wszystkich powierzchni naraz.",
  },
  hood: {
    eyebrow: "Pod maską",
    title: "Nudne części, zrobione raz.",
    intro:
      "Framework zajmuje się walidacją, autoryzacją, logowaniem, i18n i realtime. Twój folder to logika biznesowa.",
    platform: {
      title: "Role i znaczniki platform",
      body: "allowedRoles decyduje, kto może wywołać endpoint. Znaczniki platform decydują, gdzie się pojawia: AI_TOOL_OFF ukrywa go przed modelami, PRODUCTION_OFF trzyma go z dala od produkcji. Sprawdzane na każdej powierzchni.",
    },
    data: {
      title: "Zod, Drizzle, PostgreSQL",
      body: "Zod waliduje wejście i wyjście oraz generuje każdy schemat narzędzia. Repozytoria odpowiadają za zapis przez Drizzle. Migracje są w repo. Domyślnie działa na wbudowanym PGlite, bez Dockera. Gdy urośniesz, ustaw DATABASE_URL na dowolnego Postgresa.",
    },
    realtime: {
      title: "Typowany realtime",
      body: "Endpointy deklarują schematy zdarzeń i zakresy kanałów. Klienci subskrybują przez WebSocket strumieniowane tokeny i postęp zadań. Pub/sub działa w procesie albo na Redisie.",
    },
    remote: {
      title: "Połączone instancje",
      body: "Instancje łączą się ze sobą, uruchamiają narzędzia u drugiej strony i synchronizują to, na co pozwolisz. Każda strona pilnuje własnych uprawnień. Tak instalacja self-hosted korzysta z modeli unbottled.ai.",
    },
  },
  typescript: {
    title: "Bez any. Bez unknown. Bez throw.",
    subtitle:
      "Typy zgadzają się od początku do końca, bez wyjątków. vibe check pilnuje tego, zanim cokolwiek trafi na produkcję.",
    patterns: {
      any: {
        name: "bez any",
        description:
          "Napisz prawdziwy interfejs. Sięgasz po any, bo w architekturze jest dziura.",
      },
      unknown: {
        name: "bez unknown",
        description: "Ta sama zasada. unknown to any okrężną drogą.",
      },
      object: {
        name: "bez gołego object",
        description: "Opisz kształt, którego oczekujesz. object nic nie mówi.",
      },
      asX: {
        name: "bez as X",
        description: "Rzutowania okłamują kompilator. Napraw typy u źródła.",
      },
      throwStatements: {
        name: "bez throw",
        description:
          "Zwracaj ResponseType<T> przez success(data) albo fail({ message, errorType }). Błędy to dane.",
      },
      hardcodedStrings: {
        name: "bez sztywnych tekstów",
        description:
          "Każdy widoczny tekst to klucz tłumaczenia. Linter wyłapuje literały.",
      },
    },
    vibeCheck:
      "vibe check uruchamia równolegle Oxlint, ESLint i sprawdzanie typów TypeScript. Zero błędów, inaczej nic nie wychodzi.",
  },
  quickstart: {
    eyebrow: "Szybki start",
    title: "Cztery polecenia. Potem przejmuje przeglądarka.",
    intro:
      "Klonuj, instaluj, uruchom. Kreator konfiguracji ustawia login admina i dostawcę AI. Żadnych plików konfiguracyjnych.",
    selfHost: "Poradnik self-hostingu",
    docs: "Dokumentacja wzorców na GitHubie",
  },
  api: {
    eyebrow: "API w chmurze",
    title: "Albo po prostu wywołaj API {{appName}}.",
    intro:
      "Bez instalacji. Zgodne z OpenAI i Anthropic: zostaw swoje SDK, zmień adres bazowy i klucz.",
    endpoints: {
      chat: "OpenAI Chat Completions",
      responses: "OpenAI Responses",
      messages: "Anthropic Messages",
      models: "Lista modeli z cenami",
    },
    access:
      "Modele ({{modelCount}}) za jednym kluczem, rozliczane w kredytach {{appName}}. Klucze API odblokowuje każda subskrypcja lub pakiet kredytów.",
    docs: "Dokumentacja API",
    keys: "Utwórz klucz API",
  },
  examples: {
    eyebrow: "W tym repo",
    title: "Nie tylko czat AI.",
    subtitle:
      "Całe obszary biznesu są w tym repo, każdy zbudowany według tego samego wzorca.",
    items: {
      aiPlatform: {
        label: "Platforma AI",
        title: "{{appName}}",
        body: "Modele ({{modelCount}}), czat, pamięć, agenci, rozliczenia i MCP. Dokładnie ten kod, na produkcji.",
      },
      commerce: {
        label: "Handel",
        title: "Produkty i kasa",
        body: "Produkty, punkt sprzedaży, magazyn i zakupy.",
      },
      finance: {
        label: "Finanse",
        title: "Księgowość i płatności",
        body: "Plan kont, stawki podatkowe, faktury, płatności Stripe i krypto.",
      },
      crm: {
        label: "CRM",
        title: "Leady i wiadomości",
        body: "Leady, newsletter, skrzynka e-mail i SMS-y.",
      },
    },
  },
  maturity: {
    eyebrow: "Uczciwy stan",
    title: "Co działa dziś.",
    stable: {
      title: "Na produkcji",
      body: "{{appName}} działa na tym kodzie: web, CLI, MCP, narzędzia AI, cron, realtime, płatności. Buildy produkcyjne działają na Next.js. Lokalnie domyślnie TanStack Start z Vite.",
    },
    beta: {
      title: "Beta",
      body: "Ekrany React Native, synchronizacja między instancjami i zdalne skille działają, ale mają szorstkie krawędzie.",
    },
    honest: {
      title: "Licz się ze zmianami",
      body: "Jeden zespół, szybkie tempo, mocne zdanie. Jeszcze bez semver, a dokumentacja nie nadąża za kodem. Przypnij commit albo zrób forka.",
    },
  },
  contact: {
    eyebrow: "Endpoint na żywo",
    title: "Pytania, albo budujesz coś dużego?",
    description:
      "Wdrożenie, integracje na miarę, przegląd architektury. Ten formularz to endpoint kontaktowy z góry strony, wyrenderowany przez framework.",
  },
  code: {
    copy: "Kopiuj",
    copied: "Skopiowano",
    wrap: "Zawijaj",
    terminal: "Terminal",
    cli: "CLI",
    mcp: "MCP",
    ai: "Narzędzie AI",
    cron: "Cron",
    anthropic: "Anthropic (curl)",
  },
};
