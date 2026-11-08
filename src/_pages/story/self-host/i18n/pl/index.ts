import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Samodzielny hosting {{appName}} - Twoja instancja, Twoje zasady",
    description:
      "Uruchom pełny stos {{appName}} na własnym serwerze. Własne klucze API, Thea jako admin AI, pełna kontrola. Bezpłatnie na zawsze.",
    category: "Self-Host",
    imageAlt: "Samodzielny hosting {{appName}} - szybki start",
    keywords:
      "self-host, next-vibe, {{appName}}, open-source, AI, VPS, Docker, Kubernetes",
  },
  hero: {
    badge: "Bezpłatnie na zawsze - MIT + GPL v3",
    title: "Uruchom samodzielnie.",
    titleHighlight: "Miej wszystko.",
    subtitle:
      "Pełny stos {{appName}} na własnym serwerze. Każdy model, każde narzędzie, każda funkcja - plus Thea jako admin AI monitorująca i naprawiająca instancję 24/7.",
    ctaQuickstart: "Przejdź do szybkiego startu",
    ctaGithub: "Gwiazdka na GitHub",
  },
  includes: {
    title: "Wszystko co ma chmura. I więcej.",
    items: {
      models:
        "{{modelCount}} modeli - własne klucze API, płać bezpośrednio providerom",
      memory: "Trwała pamięć, tryb incognito, 4 poziomy prywatności",
      search: "Wyszukiwanie na żywo + pobieranie całych stron",
      thea: "Thea: admin AI monitorująca, naprawiająca i budująca narzędzia na polecenie",
      admin: "Panel admina, DB Studio, panel cron, monitoring stanu",
      ssh: "SSH, automatyzacja przeglądarki, klient email - narzędzia Thei",
      sync: "Synchronizacja lokalnej instancji z chmurą {{appName}} (beta)",
      free: "Bezpłatnie na zawsze - MIT + GPL v3, bez vendor lock-in",
    },
  },
  quickstart: {
    title: "Szybki start",
    subtitle: "Trzy komendy. Gotowe w 5 minut.",
    step1: {
      title: "Sklonuj i zainstaluj",
      description: "Pobierz kod i zainstaluj zależności.",
    },
    step2: {
      title: "Uruchom serwer deweloperski",
      description:
        "Uruchamia PostgreSQL w Dockerze, migracje, seeduje dane i otwiera localhost:3000.",
      noDocker:
        'Nie masz Dockera? Ustaw DATABASE_URL="file:///absolutna/sciezka/data.db" w .env, a vibe dev ruszy na wbudowanym PGlite.',
    },
    step3: {
      title: "Zaloguj się i skonfiguruj",
      description:
        'Kliknij „Zaloguj jako admin" na stronie logowania - bez hasła w trybie dev. Kreator przeprowadzi przez konfigurację klucza API i hasła admina.',
    },
    step4: {
      title: "Wybierz dostawcę AI",
      optionA: {
        label: "Opcja A: Claude Code (zalecane)",
        description:
          "Bez klucza API. Korzysta z istniejącej subskrypcji Claude. Wybierz model claude-code-* w selektorze modeli.",
      },
      optionB: {
        label: "Opcja B: OpenRouter",
        description:
          "Wszystkie modele OpenRouter, płatność za użycie. Klucz na openrouter.ai/keys.",
      },
    },
  },
  vps: {
    title: "Wdrażasz na VPS?",
    description:
      "Działa na każdym Linux VPS. Skieruj nginx lub Caddy na port 3000 - gotowe.",
    docker: "Konfiguracja Docker",
    kubernetes: "Kubernetes",
    kubernetesDescription:
      "Zawiera szablony dla web, task workerów, Redis, ingress i namespace.",
  },
  localSync: {
    title: "Połącz lokalną maszynę (beta)",
    description:
      "Thea może kierować zadania do Claude Code na Twoim komputerze. Przejdź do Admin → Połączenia zdalne w panelu i dodaj URL lokalnej instancji. Pamięci i zadania synchronizują się co 60 sekund - bez przekierowywania portów, bez VPN.",
  },
  own: {
    eyebrow: "Twój serwer, twoje zasady",
    title: "Twój stack. Twój filtr.",
    subtitle:
      "Żadnego konta w cudzej firmie. Twój Postgres, twoje klucze, twoje logi. Ty wybierasz modele i decydujesz, ile filtrów stoi między tobą a nimi.",
    cards: {
      data: {
        title: "Dane zostają u ciebie",
        body: "Wątki, wspomnienia i pliki leżą w twoim Postgresie i na twoim dysku. Nic nie dzwoni do domu.",
      },
      filter: {
        title: "Twój poziom filtrowania",
        body: "Modele mainstreamowe, otwarte albo bez cenzury. Decydujesz per skill, per wątek, per użytkownik. Bez zespołu od polityk po drodze.",
      },
      keys: {
        title: "Twoje klucze",
        body: "Podepnij OpenRouter, lokalny model albo Claude Code. Koszty idą do twojego dostawcy, nie przez nas.",
      },
    },
  },
  env: {
    title: "Czego potrzeba",
    intro:
      "Bun, Docker i garść zmiennych środowiskowych. To cała lista dla prywatnej instancji.",
    envLabel: "Minimalna konfiguracja",
    composeLabel: "Produkcja na VPS",
  },
  instances: {
    title: "Trzy instancje, trzy zadania",
    intro:
      "Jeden kod działa jako osobne instancje. Ten sam kod, inna baza i rola. Tak sami to uruchamiamy.",
    atlas: {
      name: "Atlas",
      body: "Instancja deweloperska. Hot reload, baza na wyrzut. Tu powstaje kod.",
    },
    hermes: {
      name: "Hermes",
      body: "Twój codzienny napęd. Lokalny podgląd na własnym Postgresie. W niej na co dzień mieszkasz.",
    },
    thea: {
      name: "Thea",
      body: "Instancja w chmurze na twoim VPS. Zawsze włączona, odpala twoje crony, przyjmuje zadania od dwóch pozostałych.",
    },
    note: "Instancje łączą się ze sobą. Wątki i zadania synchronizują się między laptopem a serwerem.",
  },
  fork: {
    title: "Ten sam framework, inny produkt",
    body: "next-vibe-headunit to fork na komputer samochodowy. Media, nawigacja, klimatyzacja, Bluetooth i radio to endpointy, a każdy jest też komendą CLI i narzędziem dla AI. Inny produkt, te same trzy pliki.",
  },
  enterprise: {
    title: "Potrzebujesz pomocy przy konfiguracji?",
    description:
      "Pomagamy przy wdrożeniu, niestandardowych integracjach i bieżącym wsparciu deweloperskim.",
  },
};
